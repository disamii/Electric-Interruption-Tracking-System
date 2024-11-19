from rest_framework import serializers
from rest_framework_gis.serializers import GeoFeatureModelSerializer
from rest_framework_nested.serializers import NestedHyperlinkedModelSerializer
from .models import *
from rest_framework import serializers


class LocationSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = Location
        fields = ['id','city', 'kebele','point']
        geo_field = 'point'


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model=Customer
        fields=['id','contract_account','phone_number','business_partner','pole']

class PoleSerializer(serializers.ModelSerializer):
    total_user=serializers.SerializerMethodField()
    class Meta:
        model=Pole
        fields=['tag_name','total_user','created_at','voltage_level','height']
    def get_total_user(self,obj):
        return  obj.customer.count()
    
    
    
class PoleDetailSerializer(serializers.ModelSerializer):
    location = LocationSerializer()
    class Meta:
        model=Pole
        fields=['id','tag_name','transformer','created_at','voltage_level','height','location']
        
    def create(self, validated_data):
        location_data = validated_data.pop('location')
        location = Location.objects.create(**location_data)
        pole = Pole.objects.create(location=location, **validated_data)
        return pole
    
    def update(self, instance, validated_data):
        location_data = validated_data.pop('location', None)

        if location_data:
            location = instance.location  
            for attr, value in location_data.items():
                setattr(location, attr, value)  
            location.save()  
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance

class TransformerSerializer(serializers.ModelSerializer):
    total_num_of_pole=serializers.SerializerMethodField(read_only=True)
    class Meta:
        model=Transformer
        fields=['id','tag_name','rating','cooling','feeder','created_at','manufacturing_date','property_of','total_num_of_pole']
        
    def get_total_num_of_pole(self,obj):
        return obj.pole.count()



class TransformerDetailSerializer(serializers.ModelSerializer):
    location = LocationSerializer()
    pole=PoleSerializer(many=True,read_only=True)
    class Meta:
        model=Transformer
        fields=['id','tag_name','rating','cooling','feeder','pole','created_at','manufacturing_date','property_of','location']

    def create(self, validated_data):
        location_data = validated_data.pop('location')
        location = Location.objects.create(**location_data)
        transformer = Transformer.objects.create(location=location, **validated_data)
        return transformer
    
    def update(self, instance, validated_data):
        location_data = validated_data.pop('location', None)

        if location_data:
            location = instance.location  
            for attr, value in location_data.items():
                setattr(location, attr, value)  
            location.save()  
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance


class FeederDetailSerializer(GeoFeatureModelSerializer):
    transformer=TransformerSerializer(many=True,read_only=True)
    switching_station = serializers.HyperlinkedRelatedField(
        view_name='switching_station-detail',
        queryset=SwitchingStation.objects.all()
    )
    
    start_point=LocationSerializer()
    end_point=LocationSerializer()
    switching_station_tag_name = serializers.ReadOnlyField(source='switching_station.tag_name')
    class Meta:
        model = Feeder
        fields = ['id','tag_name','voltage_level','transformer', 'switching_station','switching_station_tag_name','length','coverage_area','created_at', 'start_point', 'end_point','path']
        geo_field = 'path'
    def create(self, validated_data):
        transformers_data = validated_data.pop('transformer', [])
        start_point_data = validated_data.pop('start_point', None)
        end_point_data = validated_data.pop('end_point', None)

        # Create Location objects
        start_point = Location.objects.create(**start_point_data) if start_point_data else None
        end_point = Location.objects.create(**end_point_data) if end_point_data else None

        # Create the Feeder instance
        feeder = Feeder.objects.create(**validated_data, start_point=start_point, end_point=end_point)

        # Handle transformers (assuming transformers are pre-existing or need to be created)
        for transformer_data in transformers_data:
            transformer = Transformer.objects.create(**transformer_data)
            feeder.transformer.add(transformer)

        return feeder

    def update(self, instance, validated_data):
        transformers_data = validated_data.pop('transformer', [])
        start_point_data = validated_data.pop('start_point', None)
        end_point_data = validated_data.pop('end_point', None)

        # Update Location objects (if they exist)
        if start_point_data:
            start_point = instance.start_point
            for attr, value in start_point_data.items():
                setattr(start_point, attr, value)
            start_point.save()
        else:
            start_point = instance.start_point

        if end_point_data:
            end_point = instance.end_point
            for attr, value in end_point_data.items():
                setattr(end_point, attr, value)
            end_point.save()
        else:
            end_point = instance.end_point

        # Update the Feeder instance fields
        instance.tag_name = validated_data.get('tag_name', instance.tag_name)
        instance.voltage_level = validated_data.get('voltage_level', instance.voltage_level)
        instance.length = validated_data.get('length', instance.length)
        instance.coverage_area = validated_data.get('coverage_area', instance.coverage_area)

        # Handle switching station (can be updated if needed)
        instance.switching_station = validated_data.get('switching_station', instance.switching_station)
        
        # Save the Feeder instance
        instance.save()

        # Handle transformers (add or remove them as needed)
        if transformers_data:
            # Clear the existing transformers
            instance.transformer.clear()
            for transformer_data in transformers_data:
                transformer = Transformer.objects.create(**transformer_data)
                instance.transformer.add(transformer)

        return instance

class FeederSerializer(serializers.ModelSerializer):
    total_num_of_transformer=serializers.SerializerMethodField()
    class Meta :
        model=Feeder
        fields = ['id','tag_name','voltage_level','created_at','total_num_of_transformer']
        
    def get_total_num_of_transformer(self,obj):
        return obj.transformer.count()


class SwitchingStationNestedSerializer(NestedHyperlinkedModelSerializer):
    location=LocationSerializer()
    total_num_of_feeder=serializers.SerializerMethodField()

    class Meta:
        model = SwitchingStation
        fields = ['id','substation','total_num_of_feeder', 'tag_name', 'created_at', 'type_of_CB','location'] 
        read_only_fields = ['substation'] 
        extra_kwargs = {
            'url': {
                'view_name': 'substation-switching_station-detail',
                'lookup_url_kwarg': 'switching_station_pk'  
            }
        }
    parent_lookup_kwargs = {
        'substation_pk': 'substation_id'  
    }
    
    def create(self, validated_data):
        validated_data['substation_id']=self.context['substation_pk']
        location_data = validated_data.pop('location')
        location = Location.objects.create(**location_data)
        switching_station = SwitchingStation.objects.create(location=location, **validated_data)
        return switching_station 
    
    def update(self, instance, validated_data):
        location_data = validated_data.pop('location', None)

        if location_data:
            location = instance.location  
            for attr, value in location_data.items():
                setattr(location, attr, value)  
            location.save()  
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance
    
    def get_total_num_of_feeder(self,obj):
            return obj.feeders.count()

class SwitchingStationDetailSerializer(serializers.ModelSerializer):
    location=LocationSerializer()
    feeders=FeederSerializer(many=True,read_only=True)
    class Meta:
        model = SwitchingStation
        fields = ['id','substation', 'tag_name', 'created_at', 'type_of_CB','location','feeders']
    def create(self, validated_data):
        location_data = validated_data.pop('location')
        location = Location.objects.create(**location_data)
        switching_station = SwitchingStation.objects.create(location=location, **validated_data)
        return switching_station 
    
    def update(self, instance, validated_data):
        location_data = validated_data.pop('location', None)

        if location_data:
            location = instance.location  
            for attr, value in location_data.items():
                setattr(location, attr, value)  
            location.save()  
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance

class SwitchingStationSerializer(serializers.ModelSerializer):
        total_num_of_feeder=serializers.SerializerMethodField()
        class Meta:
            model = SwitchingStation
            fields = ['id','substation', 'tag_name', 'created_at', 'type_of_CB','total_num_of_feeder']
        def get_total_num_of_feeder(self,obj):
            return obj.feeders.count()


class SubstationDetailSerializer(serializers.ModelSerializer):
    location=LocationSerializer()
    switching_station_link = serializers.HyperlinkedIdentityField(
        view_name='substation-switching_station-list',
        lookup_url_kwarg='substation_pk'  ,
        read_only=True
    )
    switching_station=SwitchingStationNestedSerializer(many=True,read_only=True)
    class Meta:
        model = Substation
        fields = ['id','tag_name', 'created_at', 'switching_station','switching_station_link','location']
        
    
    def create(self, validated_data):
        location_data = validated_data.pop('location')
        location = Location.objects.create(**location_data)
        substation = Substation.objects.create(location=location, **validated_data)
        return substation 
    
    def update(self, instance, validated_data):
        location_data = validated_data.pop('location', None)

        if location_data:
            location = instance.location  
            for attr, value in location_data.items():
                setattr(location, attr, value)  
            location.save()  
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance


class SubstationSerializer(serializers.ModelSerializer):
    total_num_switching_station = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = Substation
        fields = ['id', 'tag_name', 'created_at',  'total_num_switching_station']
        
    def get_total_num_switching_station(self, obj):
        return obj.switching_station.count()
