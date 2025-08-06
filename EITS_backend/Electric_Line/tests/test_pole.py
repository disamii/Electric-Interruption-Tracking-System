import pytest
from rest_framework.test import APIClient
from django.urls import reverse

@pytest.mark.django_db
class TestPole:
    """
    Test CRUD operations for pole.
    """
    def test_create_pole(self, api_client_pole):
        response = api_client_pole
        assert response.status_code == 201

    def test_read_pole(self, api_client_pole,api_client):
        pole = api_client_pole.data
        url = reverse('pole-detail', kwargs={'pk': pole['id']})  
        response = api_client.get(url)
        assert response.status_code == 200
    
    def test_update_pole(self, api_client_pole,create_pole):
        pole = api_client_pole.data  # Fetching the data from the response
        url = reverse('pole-detail', kwargs={'pk': pole['id']})

        updated_pole_data =create_pole
        updated_pole_data['tag_name']='updated pole'
        client = APIClient()
        response = client.put(url, updated_pole_data, format='json')
        print(response.data)
        
        assert response.status_code == 200

    def test_delete_pole(self, api_client_pole):
        pole = api_client_pole.data  
        url = reverse('pole-detail', kwargs={'pk': pole['id']})

        client = APIClient()
        response = client.delete(url)
        assert response.status_code == 204

        # Check if the pole is really deleted
        response = client.get(url)
        assert response.status_code == 404
