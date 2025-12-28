from django.db.models.functions import ExtractYear
from rest_framework import filters

class YearFilterBackend(filters.BaseFilterBackend):
    """
    Custom filter that filters queryset by the year extracted from the 'start_date' field.
    """
    def filter_queryset(self, request, queryset, view):
        year = request.query_params.get('year')
        if year:
            # Use double underscores for lookup
            queryset = queryset.filter(start_date__year=year)
        return queryset
