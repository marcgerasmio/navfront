import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Modal, Button } from 'react-bootstrap';

function Trial() {
  const [notificationCount, setNotificationCount] = useState(0);

  // Function to simulate receiving new notifications
  const receiveNewNotification = () => {
    setNotificationCount(notificationCount + 1);
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {/* Bell icon */}
      <div className="notification-bell" onClick={receiveNewNotification}>
        <i className="fas fa-bell"></i>
        {/* Notification badge with count */}
        {notificationCount > 0 && <div className="notification-badge">{notificationCount}</div>}
      </div>
      
      {/* Button to simulate receiving new notifications */}
      <button onClick={receiveNewNotification}>Receive New Notification</button>
    </div>
  );
}

export default Trial;
