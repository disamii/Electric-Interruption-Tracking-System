## decortors
    @classmethod->static method
        need to pass cls to indicate it works on class not on object
## save and create
    save(): Ideal for scenarios where you need to update or insert data with additional processing or validation.
    create(): Convenient for straightforward record creation and saving  without additional logic
    Model create(): Use this method to define how new instances of a model are created with custom logic or default values. This method is used outside of the serializer context, typically for internal model operations.
    Serializer create(): Use this method to handle the creation of model instances from validated input data in the context of an API request. This method integrates with the DRF framework to process and save incoming data.
    By using these methods appropriately, yo.    
## GCBV
    ListCreateAPIView: For listing and creating resources.
    RetrieveUpdateDestroyAPIView: For retrieving, updating, and deleting a single resource.
    GenericAPIView: For custom CRUD operations with more control.
    APIView: requires you to define the logic for each HTTP method explicitlly
## permission
    To implement a custom permission, override BasePermission and implement either, or both, of the following methods:

    .has_permission(self, request, view)
    .has_object_permission(self, request, view, obj)