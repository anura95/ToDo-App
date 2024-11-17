import React, { useState } from 'react';
import './Auth.css';
import { Link, useNavigate } from 'react-router-dom';
import { notification } from 'antd';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    const registrationData = {
      name,
      email,
      password,
    };

    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });

      const data = await response.json();

      if (response.ok) {
        notification.success({
          message: 'Registration Successful.',
        });
        navigate('/login');
      } else {
        setErrorMessage(data.msg || 'An error occurred during registration');
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
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Sign up to get started</p>

        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <form onSubmit={handleRegister} className="auth-form">
          <div className="input-group">
            <label htmlFor="name" className="auth-label">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="auth-input"
              required
            />
          </div>

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
            {isLoading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>

        <p className="login-text">
          Already have an account? <Link to="/login" className="login-link">Log in here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
