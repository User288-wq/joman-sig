import React from 'react';

const MenuBar = ({ activeTab, setActiveTab }) => {
  const menuItems = ['Fichier', 'Édition', 'Vue', 'Outils', 'Aide'];
  
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      background: '#1e3c72',
      color: 'white',
      padding: '0 20px',
      height: '60px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginRight: '30px' }}>
        Joma SIG
      </div>
      
      <div style={{ display: 'flex', gap: '20px' }}>
        {menuItems.map(item => (
          <button
            key={item}
            onClick={() => setActiveTab(item)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'white',
              padding: '10px',
              cursor: 'pointer',
              borderBottom: activeTab === item ? '2px solid white' : 'none'
            }}
          >
            {item}
          </button>
        ))}
      </div>
      
      <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px' }}>
        <button style={{
          background: '#4CAF50',
          color: 'white',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '4px',
          cursor: 'pointer'
        }}>
          Connexion
        </button>
      </div>
    </div>
  );
};

export default MenuBar;
