import React from 'react';
import './MenuBar.css';

const MenuBar = () => {
  const menuItems = [
    { id: 'file', label: 'Fichier' },
    { id: 'edit', label: 'ÃƒÆ’Ã¢â‚¬Â°dition' },
    { id: 'view', label: 'Vue' },
    { id: 'tools', label: 'Outils' },
    { id: 'help', label: 'Aide' }
  ];

  return (
    <div className="menu-bar">
      <div className="menu-logo">
        <span className="logo-text">Joma SIG</span>
      </div>
      <div className="menu-items">
        {menuItems.map(item => (
          <button key={item.id} className="menu-item">
            {item.label}
          </button>
        ))}
      </div>
      <div className="menu-actions">
        <button className="btn-login">Connexion</button>
        <button className="btn-settings">ÃƒÂ¢Ã…Â¡Ã¢â€žÂ¢ÃƒÂ¯Ã‚Â¸Ã‚Â</button>
      </div>
    </div>
  );
};

export default MenuBar;
