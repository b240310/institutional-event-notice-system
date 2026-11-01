import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div
      style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center'
      }}
    >
      <div style={{ maxWidth: '480px' }}>
        <div
          style={{
            width: '68px',
            height: '68px',
            borderRadius: '50%',
            background: 'var(--danger-bg)',
            color: 'var(--danger)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.25rem'
          }}
        >
          <AlertTriangle size={36} />
        </div>

        <h1 style={{ fontSize: '3.5rem', fontWeight: 900, lineHeight: 1, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
          404
        </h1>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.75rem' }}>
          Page Not Found
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.75rem' }}>
          The requested notice, event, or portal page does not exist or has been relocated.
        </p>

        <Link to="/dashboard" className="btn btn-primary">
          <Home size={18} /> Return to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

