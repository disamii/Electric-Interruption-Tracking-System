from rest_framework import  permissions,viewsets,status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.core.exceptions import ObjectDoesNotExist
from .models import InterruptionData,DataSummary
from .serializers import InterruptDataSerializer,DataSummarySerializer
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Count
from django.db.models.functions import ExtractYear
from.filter import YearFilterBackend
from Accounts.permission import CustomIsAdminUser

class InterrputionDataViewSet(viewsets.ModelViewSet):

    queryset = InterruptionData.objects.all()
    serializer_class = InterruptDataSerializer
    filter_backends = [YearFilterBackend, DjangoFilterBackend]
    filterset_fields=['express','uploaded_by']


    def get_permissions(self):
        if self.request.method in ['PUT', 'DELETE']:
            return [CustomIsAdminUser()]  
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)


# used to upload  many at once
    @action(detail=False, methods=['POST'])
    def post_list(self, request):
        serializer = InterruptDataSerializer(data=request.data, many=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    



    @action(detail=False, methods=['get'],permission_classes=[IsAuthenticated])
    def get_choices(self, request):
        try:
            # Convert each set of choices to a list of values
            choices = {
                'express': [choice[0] for choice in InterruptionData.EXPRESS_CHOICES],
                'feeder': [choice[0] for choice in InterruptionData.FEEDER_CHOICES],
                'G_express': [choice[0] for choice in InterruptionData.G_EXPRESS_CHOICES],
                'reason': [choice[0] for choice in InterruptionData.REASON_CHOICES]
            }
            return Response(choices, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response(
                {"error": f"Something went wrong: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        

    @action(detail=False, methods=['get'],permission_classes=[IsAuthenticated])
    def get_availble_year(self,request):
            try:
                get_year_list = self.queryset.annotate(year=ExtractYear('start_date'))       
                year_list = [data.year for data in get_year_list]
                unique_year_list = sorted(set(year_list), reverse=True)

                return Response(unique_year_list, status=status.HTTP_200_OK)
            except Exception as e:
             return Response({"error": f"An error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        



# used for filter group according to given params
    @action(detail=False, methods=['get'],permission_classes=[IsAuthenticated])
    def get_by(self, request):
        express = request.query_params.get('express')
        year= request.query_params.get('year')
                # by express or feeder

        group_by=request.query_params.get('by')   
        if not express or not group_by or not year:
            return Response({"error": "Missing express  parameters"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            grouped = self.queryset.filter(express=express,start_date__year=year) \
                .values('express', group_by, 'start_date__year') \
                .annotate(frequency=Count('id'))        
           
            return Response(grouped, status=status.HTTP_200_OK)
        
        except ObjectDoesNotExist:
             return Response({"error": "express data not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
             return Response({"error": f"An error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def get_latest_upload(self, request):
        express = request.query_params.get('express')  
        username = request.query_params.get('uploaded_by')
        
        try:
            if express:
                if username:
                    latest_upload = self.queryset.filter(express=express, uploaded_by=username).latest('created_at')
                else:
                    latest_upload = self.queryset.filter(express=express).latest('created_at')
            else:
                latest_upload = self.queryset.latest('created_at')

        except InterruptionData.DoesNotExist:
            return Response({"detail": "No uploads found for the specified criteria."}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({"error": f"An error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        serializer = InterruptDataSerializer(latest_upload)
        return Response(serializer.data, status=status.HTTP_200_OK)




        


class DataSummaryViewSet(viewsets.ModelViewSet):
    queryset = DataSummary.objects.all()
    serializer_class = DataSummarySerializer
    permission_classes = [CustomIsAdminUser]

    filter_backends=[DjangoFilterBackend]
    filterset_fields=['year','period']


# used to create both list and single post of data from url...
    def create(self, request, *args, **kwargs):
        if isinstance(request.data, list):
                serializer = self.get_serializer(data=request.data, many=True)
                serializer.is_valid(raise_exception=True)
                serializer.save()
                headers = self.get_success_headers(serializer.data)
                return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        else:
                return super().create(request, *args, **kwargs)
        



    @action(detail=False, methods=['get'])
    def monthly_summary_of_year(self,request):
        year=request.query_params.get('year')
        if not year:
              return Response({"error": "Missing year  parameters"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            year=int(year)
            summary = InterruptionData.objects.get_summary_monthly(year)
            return Response(summary, status=status.HTTP_200_OK)

        except ObjectDoesNotExist:
            return Response({"error": "Monthly summary data not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": f"An error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    


    @action(detail=False, methods=['get'])
    def six_month_summary(self, request):
        year=request.query_params.get('year')
        period=request.query_params.get('period')
        if not year:
            return Response({"error": "Missing year  parameters"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            if not period:
                summary = DataSummary.objects.get_grouped_summary(['express', 'year','period'],year=year)
                return Response(summary, status=status.HTTP_200_OK)
            else:
                summary = DataSummary.objects.get_grouped_summary(['express', 'year','period'],year=year,period=period)
                return Response(summary, status=status.HTTP_200_OK)             
        except ObjectDoesNotExist:
            return Response({"error": "Six-month summary data not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": f"An error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    

    @action(detail=False, methods=['get'])
    def yearly_summary(self, request):
        try:
            summary = DataSummary.objects.get_grouped_summary(['express', 'feeder', 'year'])
            return Response(summary, status=status.HTTP_200_OK)
        except ObjectDoesNotExist:
            return Response({"error": "Yearly summary data not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": f"An error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
