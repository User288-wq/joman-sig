// AttributeTable.jsx
import React, { useState, useMemo } from 'react';

const AttributeTable = ({ layer }) => {
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [filter, setFilter] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);

  // Récupérer les features de la couche
  const features = useMemo(() => {
    if (!layer || !layer.getSource) return [];
    return layer.getSource().getFeatures();
  }, [layer]);

  // Extraire les colonnes
  const columns = useMemo(() => {
    if (features.length === 0) return [];
    
    const allKeys = new Set();
    features.forEach(feature => {
      const props = feature.getProperties();
      Object.keys(props).forEach(key => {
        if (key !== 'geometry') allKeys.add(key);
      });
    });
    
    return Array.from(allKeys);
  }, [features]);

  // Données triées et filtrées
  const processedData = useMemo(() => {
    let data = features.map((feature, index) => {
      const props = feature.getProperties();
      return {
        id: feature.getId() || index,
        feature,
        ...props
      };
    });

    // Filtrer
    if (filter) {
      data = data.filter(row => 
        columns.some(col => 
          String(row[col] || '').toLowerCase().includes(filter.toLowerCase())
        )
      );
    }

    // Trier
    if (sortField) {
      data.sort((a, b) => {
        const aVal = a[sortField];
        const bVal = b[sortField];
        
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
        }
        
        const aStr = String(aVal || '');
        const bStr = String(bVal || '');
        return sortDirection === 'asc' 
          ? aStr.localeCompare(bStr)
          : bStr.localeCompare(aStr);
      });
    }

    return data;
  }, [features, columns, filter, sortField, sortDirection]);

  // Gestion de la sélection
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedRows(processedData.map(row => row.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleRowSelect = (id, checked) => {
    if (checked) {
      setSelectedRows(prev => [...prev, id]);
    } else {
      setSelectedRows(prev => prev.filter(rowId => rowId !== id));
    }
  };

  // Zoom sur la sélection
  const zoomToSelection = () => {
    const selectedFeatures = processedData
      .filter(row => selectedRows.includes(row.id))
      .map(row => row.feature);
    
    if (selectedFeatures.length > 0) {
      const extent = boundingExtent(
        selectedFeatures.map(f => f.getGeometry().getExtent())
      );
      // Ici, vous ajusteriez la vue de la carte
      console.log('Zoom sur:', selectedFeatures.length, 'entités');
    }
  };

  // Export CSV
  const exportToCSV = () => {
    const headers = ['id', ...columns];
    const csvRows = [
      headers.join(','),
      ...processedData.map(row => 
        headers.map(header => 
          `"${String(row[header] || '').replace(/"/g, '""')}"`
        ).join(',')
      )
    ];
    
    const csv = csvRows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `table-attributs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Statistiques
  const columnStats = useMemo(() => {
    const stats = {};
    columns.forEach(col => {
      const values = processedData.map(row => row[col]);
      const numericValues = values.filter(v => !isNaN(parseFloat(v)) && v !== null && v !== '');
      
      if (numericValues.length > 0) {
        const nums = numericValues.map(v => parseFloat(v));
        stats[col] = {
          min: Math.min(...nums).toFixed(2),
          max: Math.max(...nums).toFixed(2),
          avg: (nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(2),
          count: numericValues.length,
          total: processedData.length
        };
      }
    });
    return stats;
  }, [columns, processedData]);

  return (
    <div className="attribute-table">
      <div className="table-header">
        <h3>📊 Table des attributs</h3>
        <div className="table-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Rechercher dans la table..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>
          
          <div className="table-actions">
            <button 
              onClick={zoomToSelection}
              disabled={selectedRows.length === 0}
              className="btn-primary"
            >
              🎯 Zoom sélection ({selectedRows.length})
            </button>
            
            <button 
              onClick={exportToCSV}
              className="btn-secondary"
            >
              📥 Export CSV
            </button>
            
            <div className="table-info">
              {processedData.length} entités • {columns.length} colonnes
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques rapides */}
      {Object.keys(columnStats).length > 0 && (
        <div className="quick-stats">
          <h4>📈 Statistiques</h4>
          <div className="stats-grid">
            {Object.entries(columnStats).slice(0, 3).map(([col, stat]) => (
              <div key={col} className="stat-item">
                <div className="stat-header">{col}</div>
                <div className="stat-values">
                  <span title="Minimum">Min: {stat.min}</span>
                  <span title="Maximum">Max: {stat.max}</span>
                  <span title="Moyenne">Moy: {stat.avg}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Table principale */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectedRows.length === processedData.length && processedData.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  title="Sélectionner tout"
                />
              </th>
              <th>#</th>
              {columns.map(col => (
                <th 
                  key={col}
                  onClick={() => {
                    if (sortField === col) {
                      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                    } else {
                      setSortField(col);
                      setSortDirection('asc');
                    }
                  }}
                  className={`sortable ${sortField === col ? 'sorted' : ''}`}
                >
                  {col}
                  {sortField === col && (
                    <span className="sort-direction">
                      {sortDirection === 'asc' ? ' ↑' : ' ↓'}
                    </span>
                  )}
                </th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {processedData.map((row, index) => (
              <tr 
                key={row.id}
                className={`${selectedRows.includes(row.id) ? 'selected' : ''} ${index % 2 === 0 ? 'even' : 'odd'}`}
              >
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(row.id)}
                    onChange={(e) => handleRowSelect(row.id, e.target.checked)}
                  />
                </td>
                <td className="row-number">{index + 1}</td>
                {columns.map(col => (
                  <td key={col} title={String(row[col] || '')}>
                    {String(row[col] || '').substring(0, 30)}
                    {String(row[col] || '').length > 30 ? '...' : ''}
                  </td>
                ))}
                <td className="row-actions">
                  <button 
                    onClick={() => console.log('Zoom sur ligne', row.id)}
                    title="Zoom sur cette entité"
                  >
                    🔍
                  </button>
                  <button 
                    onClick={() => {
                      // Ici: Sélectionner la feature sur la carte
                      console.log('Sélectionner feature', row.id);
                    }}
                    title="Sélectionner sur la carte"
                  >
                    🎯
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {processedData.length > 50 && (
        <div className="table-pagination">
          <button disabled>◀ Précédent</button>
          <span>Page 1 sur {Math.ceil(processedData.length / 50)}</span>
          <button>Suivant ▶</button>
          <select>
            <option>50 lignes</option>
            <option>100 lignes</option>
            <option>500 lignes</option>
            <option>Toutes</option>
          </select>
        </div>
      )}
    </div>
  );
};