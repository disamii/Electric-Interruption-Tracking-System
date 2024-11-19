import pytest
from rest_framework.test import APIClient
from django.urls import reverse

@pytest.mark.django_db
class TestSwitchingStation:
    """
    Test CRUD operations for switching_station.
    """
    def test_create_switching_station(self, api_client_switching_station):
        response = api_client_switching_station
        assert response.status_code == 201
    
    def test_create_nested_switching_station(self, api_client_nested_switching_station):
        response = api_client_nested_switching_station
        assert response.status_code == 201
    
    
    def test_read_nested_switching_station(self, api_client_nested_switching_station, api_client):
        switching_station_id = api_client_nested_switching_station.data['id']
        substation_link = api_client_nested_switching_station.data['substation'] 
        substation_id = int(substation_link.split('/')[-2])  
    
        url = reverse(
            'substation-switching_station-detail',
            kwargs={'pk': switching_station_id,'substation_pk':substation_id}
        )
        response = api_client.get(url)
        assert response.status_code == 200
    
    
    def test_read_switching_station(self, api_client_switching_station, api_client):
        switching_station_id = api_client_switching_station.data['id']

        url = reverse(
            'switching_station-detail',
            kwargs={'pk': switching_station_id}
        )
        response = api_client.get(url)

        assert response.status_code == 200
    
    def test_update_switching_station(self, api_client_switching_station,create_switching_station):
        switching_station = api_client_switching_station.data 
        url = reverse('switching_station-detail', kwargs={'pk': switching_station['id']})

        updated_switching_station_data =create_switching_station
        updated_switching_station_data['tag_name']='updated switching_station'
        client = APIClient()
        response = client.put(url, updated_switching_station_data, format='json')
        
        assert response.status_code == 200


    def test_update_nested_switching_station(self, api_client_nested_switching_station,create_switching_station):
        switching_station_id = api_client_nested_switching_station.data['id']
        substation_link = api_client_nested_switching_station.data['substation'] 
        substation_id = int(substation_link.split('/')[-2])  

        url = reverse(
            'substation-switching_station-detail',
            kwargs={'pk': switching_station_id,'substation_pk':substation_id}
        )

        updated_switching_station_data =create_switching_station
        updated_switching_station_data['tag_name']='updated switching_station'
        client = APIClient()
        response = client.put(url, updated_switching_station_data, format='json')
        
        assert response.status_code == 200

    def test_delete_switching_station(self, api_client_switching_station):
        switching_station = api_client_switching_station.data  
        url = reverse('switching_station-detail', kwargs={'pk': switching_station['id']})

        client = APIClient()
        response = client.delete(url)
        assert response.status_code == 204

        # Check if the switching_station is really deleted
        response = client.get(url)
        assert response.status_code == 404


    def test_delete_nested_switching_station(self, api_client_nested_switching_station):
        switching_station_id = api_client_nested_switching_station.data['id']
        substation_link = api_client_nested_switching_station.data['substation'] 
        substation_id = int(substation_link.split('/')[-2])  

        url = reverse(
            'substation-switching_station-detail',
            kwargs={'pk': switching_station_id,'substation_pk':substation_id}
        )

        client = APIClient()
        response = client.delete(url)
        assert response.status_code == 204

        # Check if the switching_station is really deleted
        response = client.get(url)
        assert response.status_code == 404

