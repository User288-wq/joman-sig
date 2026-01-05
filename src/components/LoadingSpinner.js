import React from "react";

const LoadingSpinner = ({ size = 40, color = '#60a5fa', message = 'Chargement...' }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '20px'
    }}>
      <div
        style={{
          width: size,
          height: size,
          border: `4px solid rgba(96, 165, 250, 0.2)`,
          borderTopColor: color,
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}
      />
      {message && (
        <div style={{
          color: color,
          fontSize: '14px',
          fontWeight: '600',
          textAlign: 'center'
        }}>
          {message}
        </div>
      )}
    </div>
  );
};

export default LoadingSpinner;
