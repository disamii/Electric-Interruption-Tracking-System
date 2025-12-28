from django import forms
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import MyUser

class CustomUserCreationForm(forms.ModelForm):
    class Meta:
        model = MyUser
        fields = ('email', 'first_name', 'last_name', 'dept', 'role','sub_dept','grand_father_name','phone_number')

    def save(self, commit=True):
        user = super().save(commit=False)
        user.username = MyUser.objects.generate_username(self.cleaned_data['first_name'])
        user.set_password(f'{user.username}abcd')
        if commit:
            user.save()
        return user

class CustomUserChangeForm(forms.ModelForm):
    class Meta:
        model = MyUser
        fields = ('username', 'email', 'first_name', 'last_name', 'dept', 'role','sub_dept','phone_number' )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['username'].widget.attrs['readonly'] = True


class CustomUserAdmin(BaseUserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = MyUser
    list_display = ('username', 'email', 'first_name', 'last_name', 'dept', 'role','sub_dept','phone_number')
    list_filter = ('role',)
    fieldsets = (
        (None, {'fields': ('username', 'email', 'password')}),
        ('Personal Info', {'fields': ('first_name', 'last_name', 'dept', 'role', 'sub_dept','phone_number')}),
        ('Permissions', {'fields': ('is_password_changed', 'groups', 'user_permissions')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'first_name', 'last_name', 'dept', 'role','grand_father_name','phone_number')}
        ),
    )
    search_fields = ('email', 'username', 'first_name', 'last_name')
    ordering = ('username', 'email')

admin.site.register(MyUser, CustomUserAdmin)
