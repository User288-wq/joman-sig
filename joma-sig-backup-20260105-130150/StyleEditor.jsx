// StyleEditor.jsx
import React, { useState } from 'react';

const StyleEditor = ({ feature, onStyleChange }) => {
  const [style, setStyle] = useState({
    fillColor: '#3b82f6',
    strokeColor: '#1d4ed8',
    strokeWidth: 2,
    fillOpacity: 0.3,
    pointRadius: 6,
    pointSymbol: 'circle', // circle, square, triangle, star
    lineDash: [0, 0], // solid, dashed, dotted
    labelField: null,
    labelSize: 12,
    labelColor: '#000000'
  });

  const SYMBOLS = [
    { value: 'circle', icon: '⚫', name: 'Cercle' },
    { value: 'square', icon: '◼', name: 'Carré' },
    { value: 'triangle', icon: '▲', name: 'Triangle' },
    { value: 'star', icon: '★', name: 'Étoile' },
    { value: 'cross', icon: '✚', name: 'Croix' }
  ];

  const LINE_STYLES = [
    { value: [0, 0], name: 'Continue', preview: '━━━━━━' },
    { value: [5, 5], name: 'Tiretée', preview: '┄┄┄┄┄' },
    { value: [2, 2], name: 'Pointillée', preview: '·····' },
    { value: [10, 5, 2, 5], name: 'Mixte', preview: '┄··┄··' }
  ];

  return (
    <div className="style-editor">
      <h3>🎨 Style avancé</h3>
      
      {/* Sélecteur de couleur */}
      <div className="style-section">
        <label>Couleur de remplissage:</label>
        <input 
          type="color" 
          value={style.fillColor}
          onChange={(e) => {
            const newStyle = { ...style, fillColor: e.target.value };
            setStyle(newStyle);
            onStyleChange(newStyle);
          }}
        />
        <input 
          type="range" 
          min="0" max="1" step="0.1"
          value={style.fillOpacity}
          onChange={(e) => {
            const newStyle = { ...style, fillOpacity: parseFloat(e.target.value) };
            setStyle(newStyle);
            onStyleChange(newStyle);
          }}
        />
        <span>Opacité: {(style.fillOpacity * 100).toFixed(0)}%</span>
      </div>

      {/* Sélecteur de symbole pour points */}
      <div className="style-section">
        <label>Symbole:</label>
        <div className="symbol-grid">
          {SYMBOLS.map(symbol => (
            <button
              key={symbol.value}
              className={`symbol-btn ${style.pointSymbol === symbol.value ? 'active' : ''}`}
              onClick={() => {
                const newStyle = { ...style, pointSymbol: symbol.value };
                setStyle(newStyle);
                onStyleChange(newStyle);
              }}
              title={symbol.name}
            >
              {symbol.icon}
            </button>
          ))}
        </div>
      </div>

      {/* Style des lignes */}
      <div className="style-section">
        <label>Style de ligne:</label>
        <select 
          value={JSON.stringify(style.lineDash)}
          onChange={(e) => {
            const newStyle = { ...style, lineDash: JSON.parse(e.target.value) };
            setStyle(newStyle);
            onStyleChange(newStyle);
          }}
        >
          {LINE_STYLES.map(lineStyle => (
            <option key={lineStyle.name} value={JSON.stringify(lineStyle.value)}>
              {lineStyle.preview} {lineStyle.name}
            </option>
          ))}
        </select>
      </div>

      {/* Étiquettes */}
      <div className="style-section">
        <label>Étiquettes:</label>
        <select 
          value={style.labelField || ''}
          onChange={(e) => {
            const newStyle = { ...style, labelField: e.target.value || null };
            setStyle(newStyle);
            onStyleChange(newStyle);
          }}
        >
          <option value="">Aucune étiquette</option>
          {feature && Object.keys(feature.properties || {}).map(key => (
            <option key={key} value={key}>{key}</option>
          ))}
        </select>
        
        {style.labelField && (
          <div className="label-settings">
            <input 
              type="number" 
              min="8" max="48"
              value={style.labelSize}
              onChange={(e) => {
                const newStyle = { ...style, labelSize: parseInt(e.target.value) };
                setStyle(newStyle);
                onStyleChange(newStyle);
              }}
              placeholder="Taille"
            />
            <input 
              type="color" 
              value={style.labelColor}
              onChange={(e) => {
                const newStyle = { ...style, labelColor: e.target.value };
                setStyle(newStyle);
                onStyleChange(newStyle);
              }}
            />
          </div>
        )}
      </div>

      {/* Style conditionnel */}
      <div className="style-section">
        <label>Style conditionnel:</label>
        <button className="btn-secondary">
          + Ajouter une règle
        </button>
      </div>
    </div>
  );
};