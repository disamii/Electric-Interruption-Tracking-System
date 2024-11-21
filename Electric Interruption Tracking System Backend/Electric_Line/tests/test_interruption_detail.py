import pytest
from rest_framework.test import APIClient
from django.urls import reverse

@pytest.mark.django_db
class TestInterruptiondetail:
    """
    Test CRUD operations for interruption_detail.
    """
    def test_create_interruption_detail(self, api_client_interruption_detail):
        response = api_client_interruption_detail
        assert response.status_code == 201


    def test_read_interruption_detail(self, api_client_interruption_detail, api_client):
        interruption_id = api_client_interruption_detail.data['interruption']
        interruption_detail = api_client_interruption_detail.data
        url = reverse('interruption-detail-detail', kwargs={'pk': interruption_detail['id'], 'interruption_pk': interruption_id})
        response = api_client.get(url)
        assert response.status_code == 200

    
    def test_update_interruption_detail(self, api_client_interruption_detail,create_interruption_detail):
        interruption_id=api_client_interruption_detail.data['interruption']
        interruption_detail = api_client_interruption_detail.data
        url = reverse('interruption-detail-detail', kwargs={'pk': interruption_detail['id'],'interruption_pk':interruption_id})
        updated_interruption_detail_data =create_interruption_detail
        updated_interruption_detail_data['tag_name']='updated interruption_detail'
        client = APIClient()
        response = client.put(url, updated_interruption_detail_data, format='json')
        print(response.data)
        
        assert response.status_code == 200

    def test_delete_interruption_detail(self, api_client_interruption_detail):
        interruption_id=api_client_interruption_detail.data['interruption']
        interruption_detail = api_client_interruption_detail.data
        url = reverse('interruption-detail-detail', kwargs={'pk': interruption_detail['id'],'interruption_pk':interruption_id})
        client = APIClient()
        response = client.delete(url)
        assert response.status_code == 204

        # Check if the interruption_detail is really deleted
        response = client.get(url)
        assert response.status_code == 404
