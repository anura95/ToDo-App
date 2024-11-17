import React, { useState, useEffect } from 'react';
import { Modal, Input, Button, Select, Checkbox, Card, Tag, Empty, notification } from 'antd';
import { Menu } from 'antd';
import { HomeOutlined, AppstoreAddOutlined, FileDoneOutlined } from '@ant-design/icons';
import './Todos.css';
import Sidebar from '../../components/Sidebar/Sidebar';

const { Option } = Select;

const Todos = () => {
  const [todos, setTodos] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTodo, setCurrentTodo] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState('home');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://todo-app-backend-l829.onrender.com/todos', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const handleDelete = async (todoId) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`https://todo-app-backend-l829.onrender.com/todos/${todoId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchTodos();
      notification.success({ message: 'Todo deleted successfully' });
    } catch (error) {
      console.error('Error deleting todo:', error);
      notification.error({ message: 'Error deleting todo' });
    }
  };

  const handleEdit = (todo) => {
    setIsEditing(true);
    setCurrentTodo(todo);
  };

  const handleUpdate = async () => {
    const { title, description, status } = currentTodo;
    try {
      const token = localStorage.getItem('token');
      await fetch(`https://todo-app-backend-l829.onrender.com/todos/${currentTodo._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description, status }),
      });
      setIsEditing(false);
      setCurrentTodo(null);
      fetchTodos();
      notification.success({ message: 'Todo updated successfully' });
    } catch (error) {
      console.error('Error updating todo:', error);
      notification.error({ message: 'Error updating todo' });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentTodo({
      ...currentTodo,
      [name]: value,
    });
  };

  const handleStatusChange = (value) => {
    setCurrentTodo({
      ...currentTodo,
      status: value,
    });
  };

  const toggleTodoStatus = async (todo) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`https://todo-app-backend-l829.onrender.com/todos/${todo._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: todo.status === 'completed' ? 'notcompleted' : 'completed' }),
      });
      fetchTodos();
      notification.success({ message: 'Todo status updated successfully' });
    } catch (error) {
      console.error('Error updating todo status:', error);
      notification.error({ message: 'Error updating todo status' });
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setCurrentTodo(null);
  };

  const handleMenuClick = (e) => {
    setSelectedMenu(e.key);
  };

  return (
    <div className="todos-page">
      <Sidebar/>
      {/* Main Content */}
      <div className="todos-container">
        <h2>Todos</h2>

        {/* Modal for Editing Todo */}
        <Modal
          title="Edit Todo"
          open={isEditing}
          onCancel={handleCancelEdit}
          onOk={handleUpdate}
          footer={[
            <Button key="cancel" onClick={handleCancelEdit}>
              Cancel
            </Button>,
            <Button key="submit" type="primary" onClick={handleUpdate}>
              Update Todo
            </Button>,
          ]}
        >
          <Input
            type="text"
            name="title"
            value={currentTodo?.title}
            onChange={handleChange}
            placeholder="Todo Title"
            style={{ marginBottom: 10 }}
            height={80}
          />
          <Input.TextArea
            name="description"
            value={currentTodo?.description}
            onChange={handleChange}
            placeholder="Todo Description"
            style={{ marginBottom: 10 }}
          />
          <Select
            value={currentTodo?.status}
            onChange={handleStatusChange}
            style={{ width: '100%' }}
            placeholder="Select Status"
          >
            <Option value="completed">Completed</Option>
            <Option value="notcompleted">Not Completed</Option>
          </Select>
        </Modal>

        {/* List of Todos */}
        <div className="todos-list">
          {todos.length > 0 ? (
            todos.map((todo) => (
              <Card
                key={todo._id}
                title={todo.title}
                extra={
                  <>
                    <Button onClick={() => handleEdit(todo)} type="link">
                      Edit
                    </Button>
                    <Button onClick={() => handleDelete(todo._id)} type="link" danger>
                      Delete
                    </Button>
                  </>
                }
                style={{ width: 300, marginBottom: 20 }}
              >
                <p>{todo.description}</p>
                <Tag color={todo.status === 'completed' ? 'green' : 'red'}>
                  {todo.status === 'completed' ? 'Completed' : 'Not Completed'}
                </Tag>
                <Checkbox
                  checked={todo.status === 'completed'}
                  onChange={() => toggleTodoStatus(todo)}
                  style={{ marginTop: 10 }}
                >
                  Mark as Completed
                </Checkbox>
              </Card>
            ))
          ) : (
            <Empty description="No Todos Available" style={{margin:'auto'}}/>
          )}
        </div>
      </div>
    </div>
  );
};

export default Todos;
