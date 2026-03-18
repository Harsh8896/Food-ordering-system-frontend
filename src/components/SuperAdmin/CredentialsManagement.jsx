import React, { useState } from 'react';
import { Card, ListGroup, Button, Badge, Alert, Form, InputGroup } from 'react-bootstrap';

const CredentialsManagement = ({ restaurants }) => {
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [credentialsSent, setCredentialsSent] = useState([]);
  const [copiedId, setCopiedId] = useState(null);

  const handleSendCredentials = (restaurantId) => {
    if (!credentialsSent.includes(restaurantId)) {
      setCredentialsSent([...credentialsSent, restaurantId]);
      setTimeout(() => {
        alert(`Credentials sent to ${restaurants.find(r => r.id === restaurantId)?.owner_email}`);
      }, 500);
    }
  };

  const handleCopyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResendCredentials = (restaurantId) => {
    const restaurant = restaurants.find(r => r.id === restaurantId);
    alert(`Credentials resent to ${restaurant?.owner_email}`);
  };

  return (
    <div className="credentials-management">
      <div className="row">
        <div className="col-md-6">
          <Card className="credentials-card shadow-sm mb-4">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">Select Restaurant</h5>
            </Card.Header>
            <ListGroup variant="flush" className="restaurant-select-list">
              {restaurants.map(restaurant => (
                <ListGroup.Item
                  key={restaurant.id}
                  onClick={() => setSelectedRestaurant(restaurant)}
                  className={`cursor-pointer restaurant-item ${
                    selectedRestaurant?.id === restaurant.id ? 'active' : ''
                  }`}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-1 fw-bold">{restaurant.name}</h6>
                      <p className="mb-0 text-muted small">{restaurant.owner_email}</p>
                    </div>
                    {credentialsSent.includes(restaurant.id) && (
                      <Badge bg="success">✓ Sent</Badge>
                    )}
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        </div>

        <div className="col-md-6">
          {selectedRestaurant ? (
            <Card className="credentials-detail-card shadow-sm">
              <Card.Header className="bg-info text-white">
                <h5 className="mb-0">Credentials Details</h5>
              </Card.Header>
              <Card.Body>
                <div className="mb-4">
                  <h6 className="fw-bold mb-3">
                    {selectedRestaurant.name}
                  </h6>
                  <div className="credential-field mb-4">
                    <label className="text-muted small mb-2 d-block">Email Address</label>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        value={selectedRestaurant.owner_email}
                        readOnly
                        className="credential-input"
                      />
                      <Button
                        variant="outline-secondary"
                        onClick={() =>
                          handleCopyToClipboard(
                            selectedRestaurant.owner_email,
                            'email'
                          )
                        }
                      >
                        {copiedId === 'email' ? '✓ Copied' : '📋 Copy'}
                      </Button>
                    </InputGroup>
                  </div>

                  <div className="credential-field mb-4">
                    <label className="text-muted small mb-2 d-block">Temporary Password</label>
                    <InputGroup>
                      <Form.Control
                        type="password"
                        value="••••••••••••"
                        readOnly
                        className="credential-input"
                      />
                      <Button variant="outline-secondary">
                        👁️ Reveal
                      </Button>
                    </InputGroup>
                    <Form.Text className="text-warning small">
                      Note: Owner will be asked to change password on first login
                    </Form.Text>
                  </div>

                  <div className="credential-field mb-4">
                    <label className="text-muted small mb-2 d-block">Login URL</label>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        value="https://dashboard.foodsys.com/login"
                        readOnly
                        className="credential-input"
                      />
                      <Button
                        variant="outline-secondary"
                        onClick={() =>
                          handleCopyToClipboard(
                            'https://dashboard.foodsys.com/login',
                            'url'
                          )
                        }
                      >
                        {copiedId === 'url' ? '✓ Copied' : '📋 Copy'}
                      </Button>
                    </InputGroup>
                  </div>
                </div>

                {credentialsSent.includes(selectedRestaurant.id) && (
                  <Alert variant="success" className="mb-3">
                    ✓ Credentials were sent on{' '}
                    {new Date().toLocaleDateString()}
                  </Alert>
                )}

                <div className="d-flex gap-2">
                  <Button
                    variant="primary"
                    className="flex-grow-1"
                    onClick={() => handleSendCredentials(selectedRestaurant.id)}
                    disabled={credentialsSent.includes(selectedRestaurant.id)}
                  >
                    {credentialsSent.includes(selectedRestaurant.id)
                      ? '📧 Sent'
                      : '✉️ Send Credentials'}
                  </Button>
                  <Button
                    variant="outline-primary"
                    onClick={() =>
                      handleResendCredentials(selectedRestaurant.id)
                    }
                  >
                    🔄 Resend
                  </Button>
                </div>
              </Card.Body>
            </Card>
          ) : (
            <Card className="credentials-detail-card shadow-sm">
              <Card.Body className="text-center text-muted py-5">
                <p>Select a restaurant to manage credentials</p>
              </Card.Body>
            </Card>
          )}
        </div>
      </div>

      {/* Credentials Template */}
      {selectedRestaurant && (
        <Card className="mt-4 credential-email-template shadow-sm">
          <Card.Header className="bg-secondary text-white">
            <h5 className="mb-0">Email Template Preview</h5>
          </Card.Header>
          <Card.Body>
            <div className="email-template">
              <p>
                <strong>Subject:</strong> Your Restaurant Account Credentials - FoodSys Platform
              </p>
              <hr />
              <p>Dear {selectedRestaurant.name},</p>
              <p>Welcome to the FoodSys Platform! Your restaurant account has been successfully created.</p>
              <div className="template-credentials bg-light p-3 rounded mb-3">
                <p className="mb-2">
                  <strong>Login Email:</strong> {selectedRestaurant.owner_email}
                </p>
                <p className="mb-0">
                  <strong>Temporary Password:</strong> [Will be provided separately]
                </p>
              </div>
              <p>
                <strong>Dashboard URL:</strong>{' '}
                <a href="https://dashboard.foodsys.com/login">
                  https://dashboard.foodsys.com/login
                </a>
              </p>
              <p>
                Please log in with your credentials and update your password on first login.
              </p>
              <p>For support, contact: support@foodsys.com</p>
            </div>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default CredentialsManagement;
