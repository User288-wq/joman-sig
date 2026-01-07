import React from "react";
import { FaCheckCircle, FaExclamationCircle, FaExclamationTriangle, FaInfoCircle, FaTimes } from 'react-icons/fa';

const Notification = ({ type, message, onClose, duration = 5000 }) => {
  const icons = {
    success: <FaCheckCircle />,
    error: <FaExclamationCircle />,
    warning: <FaExclamationTriangle />,
    info: <FaInfoCircle />
  };

  const colors = {
    success: '#48bb78',
    error: '#e53e3e',
    warning: '#ed8936',
    info: '#4299e1'
  };

  React.useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <div style={{
      background: '#1e293b',
      borderLeft: `4px solid ${colors[type]}`,
      color: 'white',
      padding: '12px 20px',
      borderRadius: '8px',
      marginBottom: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      minWidth: '300px',
      maxWidth: '400px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
      animation: 'slideIn 0.3s ease-out'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ color: colors[type], fontSize: '20px' }}>
          {icons[type]}
        </div>
        <div style={{ fontSize: '14px' }}>{message}</div>
      </div>
      <button
        onClick={onClose}
        style={{
          background: 'transparent',
          border: 'none',
          color: '#94a3b8',
          cursor: 'pointer',
          padding: '4px',
          borderRadius: '4px',
          transition: 'all 0.2s',
          '&:hover': {
            background: 'rgba(255, 255, 255, 0.1)',
            color: 'white'
          }
        }}
      >
        <FaTimes />
      </button>
    </div>
  );
};

export default Notification;
