import React, { useState } from 'react';
import './AttributeTable.css';

const AttributeTable = () => {
  const [data] = useState([
    { id: 1, name: 'Paris', type: 'Capitale', population: 2148000, area: 105.4 },
    { id: 2, name: 'Lyon', type: 'Ville', population: 522250, area: 47.87 },
    { id: 3, name: 'Marseille', type: 'Ville', population: 870731, area: 240.62 },
  ]);

  const [selectedRows, setSelectedRows] = useState(new Set());

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Nom' },
    { key: 'type', label: 'Type' },
    { key: 'population', label: 'Population' },
    { key: 'area', label: 'Superficie (km²)' }
  ];

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
    if (selectedRows.size === data.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(data.map(row => row.id)));
    }
  };

  return (
    <div className="attribute-table">
      <div className="table-header">
        <h3> Table attributaire</h3>
        <div className="table-stats">
          <span>{data.length} entrées</span>
          <span>{selectedRows.size} sélectionnés</span>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectedRows.size === data.length}
                  onChange={selectAll}
                />
              </th>
              {columns.map(col => (
                <th key={col.key}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map(row => (
              <tr key={row.id} className={selectedRows.has(row.id) ? 'selected' : ''}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.has(row.id)}
                    onChange={() => toggleRow(row.id)}
                  />
                </td>
                {columns.map(col => (
                  <td key={col.key}>{row[col.key]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttributeTable;
