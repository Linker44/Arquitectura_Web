import axios from "axios";

// Set the base URL for the API (adjust with your actual backend URL)
const API_URL = "http://127.0.0.1:8000/api/";

const getToken = () => localStorage.getItem("access_token");

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const fetchTodoLists = async (id) => {
  try {
    const response = await api.get(`todolists/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching TodoList:", error);
    throw error;
  }
};

// Todo Lists
export const fetchTodoList = async (id) => {
  try {
    const response = await api.get(`todolists/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching TodoList:", error);
    throw error;
  }
};

export const createTodo = async (title) => {
  try {
    const response = await api.post("todolists/", { title: title });
    return response.data;
  } catch (error) {
    console.error("Error creating new todo item:", error);
    throw error;
  }
};

export const deleteTodo = async (id) => {
  try {
    const response = await api.delete(`todolists/${id}/`);
    return response.status === 204;
  } catch (error) {
    console.error("Error deleting todo item:", error);
    throw error;
  }
};

export const updateTodo = async (id, data) => {
  const response = await api.patch(`todolists/${id}/`, data);
  return response.data;
};

// Tasks
export const createTask = async (id, title) => {
  try {
    const response = await api.post("tasks/", {
      title: title,
      todolist_id: id,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating new task:", error);
    throw error;
  }
};

export const deleteTask = async (id) => {
  try {
    const response = await api.delete(`tasks/${id}/`);
    return response.status === 204;
  } catch (error) {
    console.error("Error deleting todo item:", error);
    throw error;
  }
};

export const updateTask = async (id, data) => {
  const response = await api.patch(`tasks/${id}/`, data);
  return response.data;
};
