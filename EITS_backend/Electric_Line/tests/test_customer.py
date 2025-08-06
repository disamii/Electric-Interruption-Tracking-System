import pytest
from rest_framework.test import APIClient
from django.urls import reverse

@pytest.mark.django_db
class TestCustomer:
    """
    Test CRUD operations for customer.
    """
    def test_create_customer(self, api_client_customer):
        response = api_client_customer
        assert response.status_code == 201

    def test_read_customer(self, api_client_customer,api_client):
        customer = api_client_customer.data
        url = reverse('customer-detail', kwargs={'pk': customer['id']})  
        response = api_client.get(url)
        assert response.status_code == 200
    
    def test_update_customer(self, api_client_customer,create_customer):
        customer = api_client_customer.data  # Fetching the data from the response
        url = reverse('customer-detail', kwargs={'pk': customer['id']})

        updated_customer_data =create_customer
        updated_customer_data['tag_name']='updated customer'
        client = APIClient()
        response = client.put(url, updated_customer_data, format='json')
        print(response.data)
        
        assert response.status_code == 200

    def test_delete_customer(self, api_client_customer):
        customer = api_client_customer.data  
        url = reverse('customer-detail', kwargs={'pk': customer['id']})

        client = APIClient()
        response = client.delete(url)
        assert response.status_code == 204

        # Check if the customer is really deleted
        response = client.get(url)
        assert response.status_code == 404
