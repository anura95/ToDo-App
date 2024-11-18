import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Sidebar.css';
import { RiMenuUnfold3Fill, RiMenuUnfold4Fill } from "react-icons/ri";
import { FiPlusSquare } from "react-icons/fi";
import { IoListSharp } from "react-icons/io5";
import { FiLogOut } from "react-icons/fi";
import { notification } from 'antd';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLogout = () => {
    notification.success({
      message: 'Logout Successful',
      description: 'You have been logged out successfully.',
      duration: 1,
      onClose: () => {
        localStorage.clear();
        window.location.href = '/login';
      }
    });
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <button onClick={toggleSidebar} className="toggle-btn">
        {isCollapsed ? <RiMenuUnfold3Fill size={35}/> : <RiMenuUnfold4Fill size={35}/>}
      </button>
      <nav className="sidebar-nav">
        <Link to="/add-todos" className='sidebar-link'>
          <span className="icon"><FiPlusSquare size={25}/></span>
          {!isCollapsed && <span className="text">Add Todo</span>}
        </Link>
        <Link to="/todos" className='sidebar-link'>
          <span className="icon"><IoListSharp size={25}/></span>
          {!isCollapsed && <span className="text">Todos</span>}
        </Link>
      </nav>
      <button onClick={handleLogout} className="logout-btn">
        <span className="icon"><FiLogOut size={25}/></span>
        {!isCollapsed && <span className="text">Logout</span>}
      </button>
    </div>
  );
};

export default Sidebar;
