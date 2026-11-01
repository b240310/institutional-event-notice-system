import React from 'react';

const DataTable = ({
  columns,
  data,
  keyField = '_id',
  emptyMessage = 'No records found'
}) => {
  if (!data || data.length === 0) {
    return (
      <div
        style={{
          padding: '2rem',
          textAlign: 'center',
          color: 'var(--text-muted)',
          background: 'var(--surface)',
          borderRadius: 'var(--radius)',
          border: '1px solid var(--border)'
        }}
      >
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th
                key={index}
                style={{
                  width: col.width || 'auto',
                  textAlign: col.align || 'left'
                }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row[keyField]}>
              {columns.map((col, cIndex) => (
                <td
                  key={cIndex}
                  style={{
                    textAlign: col.align || 'left'
                  }}
                >
                  {col.render ? col.render(row) : row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;

