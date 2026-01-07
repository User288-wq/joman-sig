import React from 'react';

const StatusBar = ({ projectName, projectStatus, mapViewMode, activeLayersCount }) => {
  return (
    <div style={{
      background: '#1e293b',
      color: '#94a3b8',
      padding: '8px 16px',
      borderTop: '1px solid #334155',
      fontSize: '12px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div>
        {projectName} • {projectStatus === 'draft' ? '📝 Brouillon' : '✅ Sauvegardé'}
      </div>
      
      <div style={{ display: 'flex', gap: '20px' }}>
        <span>Mode: {mapViewMode}</span>
        <span>Couches: {activeLayersCount} visibles</span>
        <span>JOMA SIG Pro v2.1.0</span>
      </div>
    </div>
  );
};

export default StatusBar;