import React, { useState, useEffect } from "react";
import {
  fetchTodoLists,
  createTodo,
  deleteTodo,
  updateTodo,
} from "./helpers/api";
import { Link } from "react-router-dom";
import "./Todo.css";
import Logout from "../logout/Logout";

const Todo = () => {
  const [todoLists, setTodoLists] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [text, setText] = useState("");
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editingTodoTitle, setEditingTodoTitle] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchTodoLists();
        setTodoLists(data);
      } catch (error) {
        setError("Error fetching TodoLists");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  function addTodo() {
    const createData = async () => {
      try {
        const data = await createTodo(text);
        setTodoLists((prevTodoLists) => [...prevTodoLists, data]);
        setText("");
      } catch (error) {
        setError("Error creating todo item");
      }
    };

    createData();
  }

  function removeTodo(id) {
    const deleteData = async () => {
      try {
        const success = await deleteTodo(id); // Call the API to delete the todo
        if (success) {
          setTodoLists((prevTodoLists) =>
            prevTodoLists.filter((todoList) => todoList.id !== id)
          ); // Remove the item from the state
        } else {
          setError("Failed to delete the todo item");
        }
      } catch (error) {
        setError("Error deleting todo item");
      }
    };

    deleteData();
  }

  function enableEditing(todo) {
    setEditingTodoId(todo.id);
    setEditingTodoTitle(todo.title);
  }

  function saveTodo(todoId) {
    const updateData = async () => {
      try {
        await updateTodo(todoId, { title: editingTodoTitle });
        const data = await fetchTodoLists();
        setTodoLists(data);
      } catch (error) {
        setError("Error updating task");
      } finally {
        setEditingTodoId(null);
      }
    };

    updateData();
  }

  function handleKeyDown(event, taskId) {
    if (event.key === "Enter") {
      saveTodo(taskId);
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
        <h1>Todo Lists</h1>
        <div className="add-button">
          <input value={text} onChange={(e) => setText(e.target.value)} />
          <button onClick={addTodo}>Add</button>
        </div>
        <div className="todolists">
          <ul>
            {todoLists.map((todoList) => (
              <li key={todoList.id}>
                {editingTodoId === todoList.id ? (
                  <input
                    value={editingTodoTitle}
                    onChange={(e) => setEditingTodoTitle(e.target.value)}
                    onBlur={() => saveTodo(todoList.id)}
                    onKeyDown={(e) => handleKeyDown(e, todoList.id)}
                    autoFocus
                  />
                ) : (
                  <Link to={`/todolists/${todoList.id}`}>
                    <strong>{todoList.title}</strong>
                  </Link>
                )}
                <button onClick={() => enableEditing(todoList)}>Edit</button>
                <button onClick={() => removeTodo(todoList.id)}>Remove</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Todo;
