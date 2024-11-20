from django.shortcuts import render
from rest_framework import viewsets
from api.models import Task, TodoList
from rest_framework.permissions import IsAuthenticated
from api.serializers import TaskSerializer, TodoListSerializer
from rest_framework import mixins
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import ValidationError
# Create your views here.


class TaskViewSet(viewsets.GenericViewSet, mixins.CreateModelMixin, mixins.RetrieveModelMixin, mixins.DestroyModelMixin, mixins.UpdateModelMixin):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(todo_list__user=self.request.user)

    def create(self, serializer):
        todo_list_id = self.request.data.get("todolist_id")
        title = self.request.data.get("title")

        if not todo_list_id:
            raise ValidationError({"todolist_id": "This field is required."})

        try:
            todo_list = TodoList.objects.get(
                id=todo_list_id, user=self.request.user)
        except TodoList.DoesNotExist:
            raise ValidationError(
                {"todolist_id": "Invalid or unauthorized TodoList ID."})

        task = Task.objects.create(
            todo_list=todo_list, title=title)
        serializer = self.get_serializer(task)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class TodoListViewSet(viewsets.ModelViewSet):
    queryset = TodoList.objects.all()
    serializer_class = TodoListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    def create(self, request):

        print(request.data)
        data = request.data
        title = data.get("title")

        if not title:
            return Response(
                {"error": "The 'title' field is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        todo_list = TodoList.objects.create(title=title, user=request.user)

        serializer = self.get_serializer(todo_list)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
