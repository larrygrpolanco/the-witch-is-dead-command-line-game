import React, { useState } from 'react';
import './Sidebar.css';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <button onClick={toggleSidebar} className='toggle-button'>
        {isOpen ? 'Close Sidebar' : 'Open Sidebar'}
      </button>
      {isOpen && (
        <div className='sidebar-content'>
          <h2>Sidebar</h2>
          <p>This is the collapsible sidebar content.</p>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
