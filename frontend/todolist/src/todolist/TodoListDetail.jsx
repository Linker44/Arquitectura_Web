import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  fetchTodoList,
  createTask,
  deleteTask,
  updateTask,
} from "./helpers/api";
import Logout from "../logout/Logout";

const TodoListDetail = () => {
  const { id } = useParams(); // Access the id parameter from the URL
  const [todoList, setTodoList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTaskTitle, setEditingTaskTitle] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchTodoList(id);
        setTodoList(data);
        setTitle("");
      } catch (error) {
        setError("Error fetching TodoList");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  function addTask() {
    const createData = async () => {
      try {
        await createTask(todoList.id, title);
        const data = await fetchTodoList(id);
        setTodoList(data);
      } catch (error) {
        setError("Error creating task");
      } finally {
        setLoading(false);
      }
    };

    createData();
  }

  function removeTask(id) {
    const removeData = async () => {
      try {
        const success = await deleteTask(id);
        if (success) {
          const data = await fetchTodoList(todoList.id);
          setTodoList(data);
        }
      } catch (error) {
        setError("Error creating task");
      } finally {
        setLoading(false);
      }
    };
    removeData();
  }

  function enableEditing(task) {
    setEditingTaskId(task.id);
    setEditingTaskTitle(task.title);
  }

  function saveTask(taskId) {
    const updateData = async () => {
      try {
        await updateTask(taskId, { title: editingTaskTitle });
        const data = await fetchTodoList(todoList.id);
        setTodoList(data);
      } catch (error) {
        setError("Error updating task");
      } finally {
        setEditingTaskId(null);
      }
    };

    updateData();
  }

  function handleKeyDown(event, taskId) {
    if (event.key === "Enter") {
      saveTask(taskId);
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <Logout className="logout-button" />
      <div className="todo-container">
        <h1>{todoList.title}</h1>
        <h2>Tasks:</h2>
        <div className="add-button">
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
          <button onClick={addTask}>Add</button>
        </div>
        <ul>
          {todoList.tasks.map((task) => (
            <li key={task.id}>
              {editingTaskId === task.id ? (
                <input
                  value={editingTaskTitle}
                  onChange={(e) => setEditingTaskTitle(e.target.value)}
                  onBlur={() => saveTask(task.id)}
                  onKeyDown={(e) => handleKeyDown(e, task.id)}
                  autoFocus
                />
              ) : (
                <strong>{task.title}</strong>
              )}
              <button onClick={() => enableEditing(task)}>Edit</button>
              <button onClick={() => removeTask(task.id)}>Remove</button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default TodoListDetail;
