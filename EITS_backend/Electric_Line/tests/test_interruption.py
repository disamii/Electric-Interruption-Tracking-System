import pytest
from rest_framework.test import APIClient
from django.urls import reverse

@pytest.mark.django_db
class Testinterruption:
    """
    Test CRUD operations for interruption.
    """
    def test_create_interruption(self, api_client_interruption):
        response = api_client_interruption
        assert response.status_code == 201

    def test_read_interruption(self, api_client_interruption,api_client):
        interruption = api_client_interruption.data
        url = reverse('interruption-detail', kwargs={'pk': interruption['id']})  
        response = api_client.get(url)
        assert response.status_code == 200
    
    def test_update_interruption(self, api_client_interruption,create_interruption):
        interruption = api_client_interruption.data  # Fetching the data from the response
        url = reverse('interruption-detail', kwargs={'pk': interruption['id']})

        updated_interruption_data =create_interruption
        updated_interruption_data['tag_name']='updated interruption'
        client = APIClient()
        response = client.put(url, updated_interruption_data, format='json')
        print(response.data)
        
        assert response.status_code == 200

    def test_delete_interruption(self, api_client_interruption):
        interruption = api_client_interruption.data  
        url = reverse('interruption-detail', kwargs={'pk': interruption['id']})

        client = APIClient()
        response = client.delete(url)
        assert response.status_code == 204

        # Check if the interruption is really deleted
        response = client.get(url)
        assert response.status_code == 404
