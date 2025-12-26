from rest_framework.permissions import IsAdminUser
from rest_framework import permissions
class CustomIsAdminUser(IsAdminUser):
    
    def has_permission(self, request, view):
        # Allow safe methods like GET, HEAD, OPTIONS
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Ensure the user is authenticated
        if request.user and request.user.is_authenticated:
            # Check if the user has a 'role' attribute and is an admin
            return request.user.role == 'admin' or request.user.is_superuser
        
        # Return False if the user is not authenticated or doesn't have permission
        return False
