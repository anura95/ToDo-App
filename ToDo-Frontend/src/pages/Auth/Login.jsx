import React, { useState } from 'react';
import './Auth.css';
import { Link, useNavigate } from 'react-router-dom';
import { notification } from 'antd';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    const loginData = {
      email,
      password,
    };

    try {
      const response = await fetch('https://todo-app-backend-l829.onrender.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();
      notification.success({
        message: data.msg,
      });
      if (response.ok) {
        localStorage.setItem('token', data.access_token);

        navigate('/add-todos');
      } else {
        setErrorMessage(data.msg || 'An error occurred');
      }
    } catch (error) {
      setErrorMessage('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Log in to continue</p>
        
        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <form onSubmit={handleLogin} className="auth-form">
          <div className="input-group">
            <label htmlFor="email" className="auth-label">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-input"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password" className="auth-label">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input"
              required
            />
          </div>
          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="register-text">
          Don't have an account? <Link to="/register" className="register-link">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
