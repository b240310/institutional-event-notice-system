import React from 'react';

const Card = ({
  children,
  className = '',
  hover = false,
  style = {},
  onClick = null
}) => {
  return (
    <div
      onClick={onClick}
      className={`card ${hover ? 'card-hover' : ''} ${className}`}
      style={{
        cursor: onClick ? 'pointer' : 'default',
        ...style
      }}
    >
      {children}
    </div>
  );
};

export default Card;

