import React, { useState, useEffect } from 'react';
import './AttributeTable.css';

// DonnÃƒÆ’Ã‚Â©es d'exemple
const sampleData = [
  { id: 1, name: 'Paris', type: 'Capitale', population: 2148000, area: 105.4, country: 'France' },
  { id: 2, name: 'Lyon', type: 'Ville', population: 522250, area: 47.87, country: 'France' },
  { id: 3, name: 'Marseille', type: 'Ville', population: 870731, area: 240.62, country: 'France' },
  { id: 4, name: 'Bordeaux', type: 'Ville', population: 260958, area: 49.36, country: 'France' },
  { id: 5, name: 'Lille', type: 'Ville', population: 233098, area: 34.83, country: 'France' },
  { id: 6, name: 'Toulouse', type: 'Ville', population: 493465, area: 118.3, country: 'France' },
  { id: 7, name: 'Nice', type: 'Ville', population: 342637, area: 71.92, country: 'France' },
  { id: 8, name: 'Nantes', type: 'Ville', population: 320732, area: 65.19, country: 'France' }
];

const AttributeTable = () => {
  const [data, setData] = useState(sampleData);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });
  const [filter, setFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [editingCell, setEditingCell] = useState(null);

  // Colonnes de la table
  const columns = [
    { key: 'id', label: 'ID', width: '80px' },
    { key: 'name', label: 'Nom', width: '150px' },
    { key: 'type', label: 'Type', width: '120px' },
    { key: 'population', label: 'Population', width: '120px' },
    { key: 'area', label: 'Superficie (kmÃƒâ€šÃ‚Â²)', width: '140px' },
    { key: 'country', label: 'Pays', width: '120px' }
  ];

  // Trier les donnÃƒÆ’Ã‚Â©es
  const sortedData = [...data].sort((a, b) => {
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  // Filtrer les donnÃƒÆ’Ã‚Â©es
  const filteredData = sortedData.filter(row => 
    Object.values(row).some(value => 
      value.toString().toLowerCase().includes(filter.toLowerCase())
    )
  );

  // Pagination
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + rowsPerPage);

  // Gestion du tri
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // SÃƒÆ’Ã‚Â©lection/dÃƒÆ’Ã‚Â©sÃƒÆ’Ã‚Â©lection
  const toggleRow = (id) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  };

  const selectAll = () => {
    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(paginatedData.map(row => row.id)));
    }
  };

  // ÃƒÆ’Ã¢â‚¬Â°dition de cellule
  const handleCellEdit = (rowId, columnKey, value) => {
    setData(prev => prev.map(row => 
      row.id === rowId ? { ...row, [columnKey]: value } : row
    ));
  };

  // Exporter les donnÃƒÆ’Ã‚Â©es
  const exportToCSV = () => {
    const csv = [
      columns.map(col => col.label).join(','),
      ...data.map(row => 
        columns.map(col => row[col.key]).join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'donnees_attributaires.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="attribute-table">
      <div className="table-header">
        <h3> Table attributaire</h3>
        <div className="table-stats">
          <span>{filteredData.length} entrÃƒÆ’Ã‚Â©es</span>
          <span>{selectedRows.size} sÃƒÆ’Ã‚Â©lectionnÃƒÆ’Ã‚Â©s</span>
        </div>
      </div>

      <div className="table-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Rechercher dans la table..."
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="search-input"
          />
          <span className="search-icon"></span>
        </div>

        <div className="control-buttons">
          <button 
            className="btn-select-all"
            onClick={selectAll}
            title="Tout sÃƒÆ’Ã‚Â©lectionner"
          >
            {selectedRows.size === paginatedData.length ? '' : ''}
          </button>
          <button className="btn-export" onClick={exportToCSV}>
             Exporter CSV
          </button>
          <button className="btn-print">
             Imprimer
          </button>
          <select 
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="rows-selector"
          >
            <option value={5}>5 lignes</option>
            <option value={10}>10 lignes</option>
            <option value={20}>20 lignes</option>
            <option value={50}>50 lignes</option>
          </select>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '50px' }}>
                <input
                  type="checkbox"
                  checked={selectedRows.size === paginatedData.length && paginatedData.length > 0}
                  onChange={selectAll}
                />
              </th>
              {columns.map(col => (
                <th 
                  key={col.key}
                  style={{ width: col.width }}
                  onClick={() => handleSort(col.key)}
                  className="sortable"
                >
                  {col.label}
                  {sortConfig.key === col.key && (
                    <span className="sort-indicator">
                      {sortConfig.direction === 'asc' ? ' ' : ' '}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map(row => (
              <tr 
                key={row.id}
                className={selectedRows.has(row.id) ? 'selected' : ''}
              >
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.has(row.id)}
                    onChange={() => toggleRow(row.id)}
                  />
                </td>
                {columns.map(col => (
                  <td key={col.key}>
                    {editingCell?.rowId === row.id && editingCell?.columnKey === col.key ? (
                      <input
                        type="text"
                        defaultValue={row[col.key]}
                        onBlur={(e) => {
                          handleCellEdit(row.id, col.key, e.target.value);
                          setEditingCell(null);
                        }}
                        autoFocus
                      />
                    ) : (
                      <div 
                        className="cell-content"
                        onDoubleClick={() => setEditingCell({ rowId: row.id, columnKey: col.key })}
                      >
                        {row[col.key]}
                      </div>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {paginatedData.length === 0 && (
        <div className="no-data">
          Aucune donnÃƒÆ’Ã‚Â©e ÃƒÆ’Ã‚Â  afficher
        </div>
      )}

      <div className="table-footer">
        <div className="pagination">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            
          </button>
          
          <span className="page-info">
            Page {currentPage} sur {totalPages}
          </span>
          
          <button 
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            
          </button>
        </div>

        <div className="selection-info">
          {selectedRows.size > 0 && (
            <span>{selectedRows.size} ÃƒÆ’Ã‚Â©lÃƒÆ’Ã‚Â©ment(s) sÃƒÆ’Ã‚Â©lectionnÃƒÆ’Ã‚Â©(s)</span>
          )}
        </div>
      </div>

      <div className="table-actions">
        <button className="btn-zoom-to"> Zoom sur sÃƒÆ’Ã‚Â©lection</button>
        <button className="btn-highlight"> Surligner</button>
        <button className="btn-statistics"> Statistiques</button>
      </div>
    </div>
  );
};

export default AttributeTable;
