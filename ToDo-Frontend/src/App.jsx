import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import LandingPage from "./pages/LandingPage/LandingPage";
import CreateTodo from "./pages/CreateTodo/CreateTodo";
import Todos from "./pages/Todo/Todos";

const App = () => {
  
  const isLoggedIn = !!localStorage.getItem('token'); 

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/add-todos"
          element={isLoggedIn ? <CreateTodo /> : <Navigate to="/login" />}
        />
        <Route
          path="/todos"
          element={isLoggedIn ? <Todos /> : <Navigate to="/login" />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
