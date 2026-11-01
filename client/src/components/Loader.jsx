import React from 'react';

const Loader = ({ message = 'Loading...', fullScreen = false }) => {
  if (fullScreen) {
    return (
      <div
        style={{
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem'
        }}
      >
        <div className="spinner"></div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: 500 }}>
          {message}
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2.5rem',
        gap: '0.85rem'
      }}
    >
      <div className="spinner" style={{ width: '28px', height: '28px' }}></div>
      <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{message}</span>
    </div>
  );
};

export default Loader;

