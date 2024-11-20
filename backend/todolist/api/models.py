from django.db import models
from django.contrib.auth.models import User


class TodoList(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="todo_lists"
    )
    title = models.CharField(max_length=200)

    def __str__(self):
        return self.title


class Task(models.Model):

    title = models.CharField(max_length=200)
    todo_list = models.ForeignKey(
        TodoList, on_delete=models.CASCADE, related_name="tasks")

    def __str__(self):
        return self.title
