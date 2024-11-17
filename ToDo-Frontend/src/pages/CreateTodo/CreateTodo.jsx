import React, { useState } from 'react';
import { notification } from 'antd';
import './CreateTodo.css';
import Sidebar from '../../components/Sidebar/Sidebar';

const CreateTodo = () => {
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({ title: '', description: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const accessToken = localStorage.getItem('token');

    try {
      const response = await fetch('https://todo-app-backend-l829.onrender.com/add-todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formValues),
      });

      if (response.ok) {
        notification.success({
          message: 'Todo Created',
          description: 'Your todo was successfully created.',
        });
        setFormValues({ title: '', description: '' });
      } else {
        throw new Error('Failed to create todo');
      }
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'An error occurred while creating the todo.',
      });
      console.error('Error creating todo:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-todo-page">
      <Sidebar />
      <div className="create-todo-content">
        {/* <div className="banner-img">
          <img src="/banner.jpg" alt="banner-img" />
        </div> */}
        <div className="create-todo-container">
          <h2>Create New Todo</h2>
          <form className="todo-form" onSubmit={handleSubmit}>
            <div className="form-item">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                placeholder="Enter todo title"
                value={formValues.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-item">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                placeholder="Enter todo description"
                rows="8"
                value={formValues.description}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <div className="form-item">
              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? 'Adding...' : 'Add Todo'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTodo;
