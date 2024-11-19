import pytest
from rest_framework.test import APIClient
from django.urls import reverse

@pytest.mark.django_db
class TestTransformer:
    """
    Test CRUD operations for transformer.
    """
    def test_create_transformer(self, api_client_transformer):
        response = api_client_transformer
        assert response.status_code == 201

    def test_read_transformer(self, api_client_transformer,api_client):
        transformer = api_client_transformer.data
        url = reverse('transformer-detail', kwargs={'pk': transformer['id']})  
        response = api_client.get(url)
        assert response.status_code == 200
    
    def test_update_transformer(self, api_client_transformer,create_transformer):
        transformer = api_client_transformer.data  # Fetching the data from the response
        url = reverse('transformer-detail', kwargs={'pk': transformer['id']})

        updated_transformer_data =create_transformer
        updated_transformer_data['tag_name']='updated transformer'
        client = APIClient()
        response = client.put(url, updated_transformer_data, format='json')
        print(response.data)
        
        assert response.status_code == 200

    def test_delete_transformer(self, api_client_transformer):
        transformer = api_client_transformer.data  
        url = reverse('transformer-detail', kwargs={'pk': transformer['id']})

        client = APIClient()
        response = client.delete(url)
        assert response.status_code == 204

        # Check if the transformer is really deleted
        response = client.get(url)
        assert response.status_code == 404
