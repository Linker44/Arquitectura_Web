from rest_framework import routers
from api.views import TaskViewSet, TodoListViewSet
from django.urls import path, include

router = routers.DefaultRouter()
router.register(r'tasks', TaskViewSet)
router.register(r'todolists', TodoListViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
