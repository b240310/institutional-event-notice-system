import React from 'react';
import { FolderOpen } from 'lucide-react';

const EmptyState = ({
  icon: Icon = FolderOpen,
  title = 'No items found',
  description = 'There is currently no data to display.',
  action = null
}) => {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '3.5rem 1.5rem',
        background: 'var(--surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px dashed var(--border)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '1.5rem 0'
      }}
    >
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: '#f1f5f9',
          color: 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1rem'
        }}
      >
        <Icon size={28} />
      </div>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.35rem' }}>
        {title}
      </h3>
      <p
        style={{
          color: 'var(--text-muted)',
          fontSize: '0.9rem',
          maxWidth: '420px',
          marginBottom: action ? '1.25rem' : '0'
        }}
      >
        {description}
      </p>
      {action}
    </div>
  );
};

export default EmptyState;

