import pytest
from rest_framework.test import APIClient
from django.urls import reverse
from Electric_Line.models import Substation


@pytest.mark.django_db
class TestSubstation:
    """
    Test CRUD operations for Substation.
    """
    def test_create_substation(self,api_client_substation):
        response=api_client_substation
        assert response.status_code == 201

    def test_read_substation(self, api_client_substation,api_client):
        substation = api_client_substation.data  # Fetching the data from the response
        url = reverse('substation-detail', kwargs={'pk': substation['id']})
        response = api_client.get(url)
        
        assert response.status_code == 200

    def test_update_substation(self, api_client_substation,create_substation):
        substation = api_client_substation.data  # Fetching the data from the response
        url = reverse('substation-detail', kwargs={'pk': substation['id']})

        updated_substation_data =create_substation
        updated_substation_data['tag_name']='updated substation'
        client = APIClient()
        response = client.put(url, updated_substation_data, format='json')
        print(response.data)
        
        assert response.status_code == 200

    def test_delete_substation(self, api_client_substation):
        substation = api_client_substation.data  
        url = reverse('substation-detail', kwargs={'pk': substation['id']})

        client = APIClient()
        response = client.delete(url)
        assert response.status_code == 204

        # Check if the substation is really deleted
        response = client.get(url)
        assert response.status_code == 404
