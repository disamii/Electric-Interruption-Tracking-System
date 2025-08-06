import pytest
from rest_framework.test import APIClient
from django.urls import reverse

@pytest.mark.django_db
class TestLocation:
    """
    Test CRUD operations for Location.
    """
    def test_create_location(self, api_client_location):
        response = api_client_location
        assert response.status_code == 201

    def test_read_location(self, api_client_location,api_client):
        location = api_client_location.data
        url = reverse('location-detail', kwargs={'pk': location['id']})  
        response = api_client.get(url)
        assert response.status_code == 200
    
    def test_update_location(self, api_client_location,create_location):
        location = api_client_location.data  # Fetching the data from the response
        url = reverse('location-detail', kwargs={'pk': location['id']})

        updated_location_data =create_location
        updated_location_data['tag_name']='updated location'
        client = APIClient()
        response = client.put(url, updated_location_data, format='json')
        print(response.data)
        
        assert response.status_code == 200

    def test_delete_location(self, api_client_location):
        location = api_client_location.data  
        url = reverse('location-detail', kwargs={'pk': location['id']})

        client = APIClient()
        response = client.delete(url)
        assert response.status_code == 204

        # Check if the location is really deleted
        response = client.get(url)
        assert response.status_code == 404
