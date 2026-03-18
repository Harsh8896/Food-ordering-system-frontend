import React from 'react';
import { Card } from 'react-bootstrap';

const StatCard = ({ title, value, icon, color, trend }) => {
  return (
    <Card className={`stat-card stat-card-${color}`}>
      <Card.Body>
        <div className="stat-icon">{icon}</div>
        <div className="stat-content">
          <h6 className="stat-title">{title}</h6>
          <h2 className="stat-value">{value}</h2>
          <p className="stat-trend">{trend}</p>
        </div>
      </Card.Body>
    </Card>
  );
};

export default StatCard;
