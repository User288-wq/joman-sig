import React from "react";
import { FaSort, FaSortUp, FaSortDown, FaFilter, FaDownload } from 'react-icons/fa';

const AttributeTable = ({ data, columns, onRowClick, selectedRow }) => {
  const [sortColumn, setSortColumn] = React.useState(null);
  const [sortDirection, setSortDirection] = React.useState('asc');
  const [filter, setFilter] = React.useState('');

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const filteredData = data.filter(row => 
    columns.some(col => 
      String(row[col.key]).toLowerCase().includes(filter.toLowerCase())
    )
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0;
    
    const aVal = a[sortColumn];
    const bVal = b[sortColumn];
    
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortDirection === 'asc' 
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }
    
    return sortDirection === 'asc' 
      ? (aVal || 0) - (bVal || 0)
      : (bVal || 0) - (aVal || 0);
  });

  const handleExport = () => {
    const csv = [
      columns.map(col => `"${col.label}"`).join(','),
      ...sortedData.map(row => 
        columns.map(col => `"${row[col.key] || ''}"`).join(',')
      )
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attributs-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
  };

  return (
    <div style={{
      background: '#1e293b',
      borderRadius: '8px',
      border: '1px solid #334155',
      overflow: 'hidden'
    }}>
      {/* En-tête */}
      <div style={{
        padding: '16px',
        background: '#0f172a',
        borderBottom: '1px solid #334155',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ position: 'relative' }}>
            <FaFilter style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Filtrer..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{
                padding: '8px 12px 8px 36px',
                background: '#334155',
                border: '1px solid #475569',
                borderRadius: '6px',
                color: 'white',
                fontSize: '14px',
                width: '200px'
              }}
            />
          </div>
          <div style={{ fontSize: '12px', color: '#94a3b8' }}>
            {sortedData.length} ligne{sortedData.length !== 1 ? 's' : ''}
          </div>
        </div>
        
        <button
          onClick={handleExport}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            background: '#38a169',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            '&:hover': {
              background: '#2f855a'
            }
          }}
        >
          <FaDownload /> Exporter CSV
        </button>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto', maxHeight: '400px' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '13px'
        }}>
          <thead>
            <tr style={{
              background: '#0f172a',
              borderBottom: '1px solid #334155'
            }}>
              {columns.map(column => (
                <th
                  key={column.key}
                  onClick={() => handleSort(column.key)}
                  style={{
                    padding: '12px 16px',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    userSelect: 'none',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {column.label}
                    {sortColumn === column.key ? (
                      sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />
                    ) : (
                      <FaSort style={{ opacity: 0.3 }} />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, index) => (
              <tr
                key={index}
                onClick={() => onRowClick && onRowClick(row)}
                style={{
                  background: selectedRow === row.id ? 'rgba(96, 165, 250, 0.1)' : 'transparent',
                  borderBottom: '1px solid #334155',
                  cursor: onRowClick ? 'pointer' : 'default',
                  transition: 'background 0.2s',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.05)'
                  }
                }}
              >
                {columns.map(column => (
                  <td
                    key={column.key}
                    style={{
                      padding: '12px 16px',
                      color: '#f8fafc',
                      borderBottom: '1px solid #334155'
                    }}
                  >
                    {column.format ? column.format(row[column.key]) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
            
            {sortedData.length === 0 && (
              <tr>
                <td 
                  colSpan={columns.length}
                  style={{
                    padding: '40px 16px',
                    textAlign: 'center',
                    color: '#94a3b8'
                  }}
                >
                  Aucune donnée disponible
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttributeTable;
