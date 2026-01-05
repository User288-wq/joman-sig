import React from 'react';

const JomaMenuBar = ({ onMenuAction, projectStatus, projectName }) => {
  const menuItems = [
    { label: 'Fichier', items: ['new', 'open', 'save', 'import', 'export-geojson'] },
    { label: 'Édition', items: ['undo', 'redo'] },
    { label: 'Vue', items: ['zoom-in', 'zoom-out', 'mode-2d', 'mode-3d'] },
    { label: 'Couches', items: ['add-vector', 'show-all', 'hide-all', 'style'] },
    { label: 'Traitement', items: ['buffer', 'union', 'intersection'] }
  ];

  return (
    <div style={{
      background: '#1e293b',
      color: 'white',
      padding: '8px 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid #334155'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ fontWeight: 'bold', fontSize: '16px' }}>JOMA SIG Pro</div>
        
        {menuItems.map((menu, index) => (
          <div key={index} style={{ position: 'relative', display: 'inline-block' }}>
            <button style={{
              background: 'transparent',
              color: 'white',
              border: 'none',
              padding: '8px 12px',
              cursor: 'pointer',
              fontSize: '14px'
            }}>
              {menu.label}
            </button>
          </div>
        ))}
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ fontSize: '12px', opacity: 0.8 }}>
          {projectName} • {projectStatus === 'draft' ? '📝 Brouillon' : '✅ Sauvegardé'}
        </div>
      </div>
    </div>
  );
};

export default JomaMenuBar;