from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from api.models import Task, TodoList
from django.contrib.auth.models import User


from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from api.models import Task, TodoList
from django.contrib.auth.models import User


class TaskViewSetTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser', password='testpass')
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        self.todo_list = TodoList.objects.create(
            title="Test List", user=self.user)
        self.task = Task.objects.create(
            title="Test Task", todo_list=self.todo_list)

    def test_create_task(self):
        url = '/api/tasks/'
        data = {"todolist_id": self.todo_list.id, "title": "Test Task"}
        response = self.client.post(url, data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['title'], "Test Task")

    def test_create_task_missing_todolist(self):
        url = '/api/tasks/'
        data = {"title": "Test Task"}
        response = self.client.post(url, data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("todolist_id", response.data)

    def test_update_task(self):
        url = f'/api/tasks/{self.task.id}/'
        data = {"title": "Updated Task"}
        response = self.client.patch(url, data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], "Updated Task")

    def test_remove_task(self):
        url = f'/api/tasks/{self.task.id}/'
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Task.objects.filter(id=self.task.id).exists())

    def test_retrieve_task(self):
        task = Task.objects.create(
            title="Retrieve Task", todo_list=self.todo_list)
        url = f'/api/tasks/{task.id}/'
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], "Retrieve Task")


class TodoListViewSetTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser', password='testpass')
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        self.todo_list = TodoList.objects.create(
            title="Test List", user=self.user)

    def test_create_todolist(self):
        url = '/api/todolists/'
        data = {"title": "New TodoList"}
        response = self.client.post(url, data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['title'], "New TodoList")

    def test_update_todolist(self):
        url = f'/api/todolists/{self.todo_list.id}/'
        data = {"title": "Updated TodoList"}
        response = self.client.patch(url, data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], "Updated TodoList")

    def test_remove_todolist(self):
        url = f'/api/todolists/{self.todo_list.id}/'
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(TodoList.objects.filter(
            id=self.todo_list.id).exists())

    def test_get_todolists(self):
        TodoList.objects.create(title="Test List 1", user=self.user)

        url = '/api/todolists/'
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_create_todolist_missing_title(self):
        url = '/api/todolists/'
        data = {}
        response = self.client.post(url, data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)
