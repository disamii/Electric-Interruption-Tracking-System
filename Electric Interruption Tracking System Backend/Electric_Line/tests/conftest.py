import pytest
from rest_framework.test import APIClient
from django.urls import reverse
from Electric_Line.models import *


@pytest.fixture
def api_client():
    """
    Fixture to provide an instance of the API client
    """
    return APIClient()

@pytest.fixture
def create_location():
    """
    Fixture to create a Location
    """
    location = {
        "city":"Sample City",
        "kebele":"Sample Kebele",
        "point": {
            "type": "Point",
            "coordinates": [30, 10],
        },
    }
    return location

@pytest.fixture
def api_client_location(api_client, create_location):
        location= create_location
        url = reverse('location-list') 
        response = api_client.post(url, location, format='json')
        
        return response


@pytest.fixture
def create_substation(create_location):
    """
    Fixture to create a substation for testing
    """
    substation = {
            "tag_name":"Substation A",
            "created_at": "2024-11-16",
            "location":create_location
    }
    return substation  


@pytest.fixture
def api_client_substation(create_substation):
    """
    Fixture to provide an instance of the API client.
    It makes a POST request to create a substation.
    """
    substation= create_substation
    url = reverse('substation-list')
    client = APIClient()
    response = client.post(url, substation, format='json')
    return response


@pytest.fixture
def create_switching_station(api_client_substation,create_location):
    """
    Fixture to create a Switching Station associated with a Substation
    """
    substation = api_client_substation.data['id']
    location = create_location
    switching_station = {
        "tag_name":"Switching Station A", "substation":substation,
        "created_at":"2024-11-16", "type_of_CB": "CB Type A","location":location
    }
    return switching_station


@pytest.fixture
def api_client_switching_station(api_client, create_switching_station):
        switching_station = create_switching_station
        url = reverse('switching_station-list') 
        response = api_client.post(url, switching_station, format='json')
        return response


@pytest.fixture
def api_client_nested_switching_station(api_client, create_switching_station):
        substation_id=create_switching_station['substation']
        switching_station = create_switching_station
        url = reverse('substation-switching_station-list',kwargs={'substation_pk':substation_id}) 
        response = api_client.post(url, switching_station, format='json')
        return response


@pytest.fixture
def create_feeder(api_client_switching_station, create_location):
    """
    Fixture to create a Feeder as JSON data.
    """
    switching_station = api_client_switching_station.data  # Get the data from the response (which is the model data)
    switching_station_id = switching_station['id'] 
    start_location = create_location
    end_location = create_location

    feeder = {
        "tag_name": "Feeder A",
        "voltage_level": "High",
        "switching_station": reverse('switching_station-detail', kwargs={'pk': switching_station_id}),
        "length": 10,
        "coverage_area": {
            "type": "Polygon",
            "coordinates": [
                [
                    [28.07999267578127, 23.54766395958881],
                    [21.3599853515625, 22.221030646204053],
                    [32.87999267578124, -14.483217711858277],
                    [-139.44001464843754, -1.199921433068391],
                    [-117.3599853515625, 33.24113021023257],
                    [28.07999267578127, 23.54766395958881],
                ]
            ],
        },
        "created_at": "2024-11-16",
        "start_point": start_location,
        "end_point": end_location,
        "path": {
            "type": "LineString",
            "coordinates": [
                [0.0, 0.0],
                [1.0, 1.0],
                [2.0, 2.0],
            ],
        },
    }
    return feeder


@pytest.fixture
def api_client_feeder(create_feeder,api_client):
    
    """
    Fixture to provide an instance of the API client.
    It makes a POST request to create a feeder.
    """
    feeder = create_feeder  
    url = reverse('feeder-list')
    response = api_client.post(url, feeder, format='json')
    return response


@pytest.fixture
def create_transformer(api_client_feeder,create_location):
    """ 
    Fixture for json serilaized of transformer model
    """
    feeder_json=api_client_feeder.data
    feeder_id=feeder_json['id']
    location=create_location
    transformer = {
        "tag_name": "Transformer A",
        "rating": "50 KVA",
        "cooling": "Oil",
        "feeder": feeder_id,  
        "created_at": "2024-11-18T10:00:00Z",  
        "manufacturing_date": "2020-01-01",
        "property_of": "EEU",  
        "location": location
        }
    return transformer



@pytest.fixture
def api_client_transformer(create_transformer,api_client):
    """"
    api  post of transformer model
    """
    transformer=create_transformer
    url=reverse('transformer-list')
    response=api_client.post(url,transformer,format='json')
    return response


@pytest.fixture
def create_pole(api_client_transformer,create_location):
    """"
    serialized pole 
    """
    transformer_json=api_client_transformer.data
    transformer_id=transformer_json['id']
    location=create_location
    pole = {
            "tag_name": "Pole A",
            "transformer": transformer_id,
            "created_at": "2024-11-18",
            "voltage_level": "MV",
            "height": 12,
            "location": location
        }
    return pole


@pytest.fixture
def api_client_pole(create_pole,api_client):
    
    """"
    pole api post fixture
    """
    pole=create_pole
    url=reverse('pole-list')
    response=api_client.post(url,pole,format='json')
    return response


@pytest.fixture
def create_customer(api_client_pole):
    """"
    serialized pole 
    """
    pole_json=api_client_pole.data
    pole_id=pole_json['id']
    customer={
        
    "contract_account": "CA123456",
    "phone_number": "+251912345678",
    "business_partner": "BP789012",
    "pole":pole_id
    }
    return customer

@pytest.fixture
def api_client_customer(create_customer,api_client):
    
    """"
    pole api post fixture
    """
    customer=create_customer
    url=reverse('customer-list')
    response=api_client.post(url,customer,format='json')
    return response


@pytest.fixture
def create_interruption(api_client_pole):
    related_type='pole'
    related_json=api_client_pole.data
    related_id=related_json['id']
    interruption={
        "related_type":related_type,
        "related_id":related_id
    }
    return interruption

@pytest.fixture
def api_client_interruption(create_interruption,api_client):
    
    """"
    pole api post fixture
    """
    interruption=create_interruption
    url=reverse('interruption-list')
    response=api_client.post(url,interruption,format='json')
    return response

@pytest.fixture
def create_interruption_detail(api_client_interruption):
    interruption=api_client_interruption.data['id']
    interruption_detail={
        "interruption":interruption,
        "reason": "over-load",
        "handled_by": "Elias",
        "start_datetime": "2024-11-21T14:50:00Z",
        "end_datetime": "2024-11-21T19:50:00Z",
        "created_at": "2024-11-21T11:51:06.646237Z",
        "updated_at": "2024-11-21T11:51:06.646237Z"
        
    }
    
    return interruption_detail

@pytest.fixture
def api_client_interruption_detail(create_interruption_detail,api_client):
    
    """"
    interruption_detail api post fixture
    """
    interruption_id=create_interruption_detail['interruption']
    interruption_detail=create_interruption_detail
    url=reverse('interruption-detail-list',kwargs={'interruption_pk':interruption_id})
    response=api_client.post(url,interruption_detail,format='json')
    print(response.data)
    return response


@pytest.fixture
def create_interruption(api_client_pole):
    related_type = 'pole'
    related_json = api_client_pole.data
    related_id = related_json['id']
    interruption = {
        "related_type": related_type,
        "related_id": related_id
    }
    return interruption


@pytest.fixture
def api_client_interruption(create_interruption, api_client):
    """
    Fixture to post an interruption and return the response
    """
    interruption = create_interruption
    url = reverse('interruption-list')
    response = api_client.post(url, interruption, format='json')
    return response


@pytest.fixture
def create_interruption_detail(api_client_interruption):
    interruption = api_client_interruption.data['id']
    print(interruption)
    interruption_detail = {
        "interruption": interruption,
        "reason": "over-load",
        "handled_by": "Elias",
        "start_datetime": "2024-11-21T14:50:00Z",
        "end_datetime": "2024-11-21T19:50:00Z",
        "created_at": "2024-11-21T11:51:06.646237Z",
        "updated_at": "2024-11-21T11:51:06.646237Z"
    }
    return interruption_detail


@pytest.fixture
def api_client_interruption_detail(create_interruption_detail, api_client):
    """
    Fixture to post an interruption_detail and return the response
    """
    interruption_id = create_interruption_detail['interruption']
    interruption_detail = create_interruption_detail
    url = reverse('interruption-detail-list', kwargs={'interruption_pk': interruption_id})
    response = api_client.post(url, interruption_detail, format='json')
    
    
    return response
