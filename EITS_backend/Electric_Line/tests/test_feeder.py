import pytest
from rest_framework.test import APIClient
from django.urls import reverse

@pytest.mark.django_db
class TestFeeder:
    """
    Test CRUD operations for feeder.
    """
    def test_create_feeder(self, api_client_feeder):
        response = api_client_feeder
        assert response.status_code == 201

    def test_read_feeder(self, api_client_feeder,api_client):
        feeder = api_client_feeder.data
        url = reverse('feeder-detail', kwargs={'pk': feeder['id']})  
        response = api_client.get(url)
        assert response.status_code == 200
    
    def test_update_feeder(self, api_client_feeder,create_feeder):
        feeder = api_client_feeder.data  # Fetching the data from the response
        url = reverse('feeder-detail', kwargs={'pk': feeder['id']})

        updated_feeder_data =create_feeder
        updated_feeder_data['tag_name']='updated feeder'
        client = APIClient()
        response = client.put(url, updated_feeder_data, format='json')
        print(response.data)
        
        assert response.status_code == 200

    def test_delete_feeder(self, api_client_feeder):
        feeder = api_client_feeder.data  
        url = reverse('feeder-detail', kwargs={'pk': feeder['id']})

        client = APIClient()
        response = client.delete(url)
        assert response.status_code == 204

        # Check if the feeder is really deleted
        response = client.get(url)
        assert response.status_code == 404
