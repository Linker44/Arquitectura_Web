import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./login/Login";
import Todo from "./todolist/Todo";
import TodoListDetail from "./todolist/TodoListDetail";
import ProtectedRoute from "./protected_route/ProtectedRoute";
import "./App.css";

const App = () => {
  localStorage.removeItem("access_token");

  const isAuthenticated = !!localStorage.getItem("access_token");

  return (
    <Router>
      <div>
        <h1>TodoList App</h1>
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/todolists" />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="/login" element={<Login />} />
          <Route
            path="/todolists/"
            element={
              <ProtectedRoute>
                <Todo />
              </ProtectedRoute>
            }
          />
          <Route
            path="/todolists/:id"
            element={
              <ProtectedRoute>
                <TodoListDetail />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
