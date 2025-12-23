import React, { useState } from 'react';
import './DockWidgets.css';

const DockWidgets = ({ children }) => {
  const [dockPosition, setDockPosition] = useState('right');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const widgets = [
    { id: 'layers', title: 'Couches', icon: '', content: children?.layers },
    { id: 'legend', title: 'LÃƒÆ’Ã‚Â©gende', icon: '', content: children?.legend },
    { id: 'attributes', title: 'Attributs', icon: '', content: children?.attributes },
    { id: 'console', title: 'Console', icon: '', content: children?.console }
  ];

  return (
    <div className={`dock-widgets dock-${dockPosition} ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="dock-header">
        <div className="dock-title">Outils</div>
        <div className="dock-controls">
          <button onClick={() => setIsCollapsed(!isCollapsed)}>
            {isCollapsed ? '' : ''}
          </button>
          <button onClick={() => setDockPosition(dockPosition === 'right' ? 'left' : 'right')}>
            ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬Â¢
          </button>
        </div>
      </div>
      
      {!isCollapsed && (
        <div className="dock-content">
          {widgets.map(widget => (
            <div key={widget.id} className="dock-widget">
              <div className="widget-header">
                <span className="widget-icon">{widget.icon}</span>
                <span className="widget-title">{widget.title}</span>
              </div>
              <div className="widget-body">
                {widget.content || <div className="widget-placeholder">Contenu de {widget.title}</div>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DockWidgets;
