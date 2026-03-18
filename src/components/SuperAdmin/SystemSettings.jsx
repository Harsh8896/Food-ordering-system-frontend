import React, { useState } from 'react';
import { Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';

const SystemSettings = () => {
  const [settings, setSettings] = useState({
    platform_currency: 'USD',
    currency_symbol: '$',
    brand_name: 'FoodSys',
    brand_logo_url: '',
    support_email: 'support@foodsys.com',
    support_phone: '+1-800-FOODSYS',
    platform_timezone: 'America/New_York',
    maintenance_mode: false,
    enable_restaurant_registration: true,
    max_restaurants: 500,
  });

  const [savedAlert, setSavedAlert] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = () => {
    console.log('Saving settings:', settings);
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 3000);
  };

  const currencies = [
    { value: 'USD', label: 'US Dollar ($)' },
    { value: 'EUR', label: 'Euro (€)' },
    { value: 'GBP', label: 'British Pound (£)' },
    { value: 'INR', label: 'Indian Rupee (₹)' },
    { value: 'JPY', label: 'Japanese Yen (¥)' },
  ];

  const timezones = [
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Asia/Tokyo',
    'Asia/Dubai',
    'Asia/Kolkata',
    'Australia/Sydney',
  ];

  return (
    <div className="system-settings">
      {savedAlert && (
        <Alert variant="success" dismissible onClose={() => setSavedAlert(false)}>
          ✓ Settings saved successfully!
        </Alert>
      )}

      {/* Basic Settings */}
      <Card className="settings-card shadow-sm mb-4">
        <Card.Header className="bg-primary text-white">
          <h5 className="mb-0">🏢 Branding Settings</h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Platform Name</Form.Label>
                <Form.Control
                  type="text"
                  name="brand_name"
                  value={settings.brand_name}
                  onChange={handleChange}
                  placeholder="e.g., FoodSys"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Brand Logo URL</Form.Label>
                <Form.Control
                  type="url"
                  name="brand_logo_url"
                  value={settings.brand_logo_url}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Currency Settings */}
      <Card className="settings-card shadow-sm mb-4">
        <Card.Header className="bg-success text-white">
          <h5 className="mb-0">💰 Currency Settings</h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Platform Currency</Form.Label>
                <Form.Select
                  name="platform_currency"
                  value={settings.platform_currency}
                  onChange={handleChange}
                >
                  {currencies.map(currency => (
                    <option key={currency.value} value={currency.value}>
                      {currency.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Currency Symbol</Form.Label>
                <Form.Control
                  type="text"
                  name="currency_symbol"
                  value={settings.currency_symbol}
                  onChange={handleChange}
                  maxLength="3"
                  placeholder="$"
                />
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Support Settings */}
      <Card className="settings-card shadow-sm mb-4">
        <Card.Header className="bg-info text-white">
          <h5 className="mb-0">📞 Support Settings</h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Support Email</Form.Label>
                <Form.Control
                  type="email"
                  name="support_email"
                  value={settings.support_email}
                  onChange={handleChange}
                  placeholder="support@example.com"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Support Phone</Form.Label>
                <Form.Control
                  type="tel"
                  name="support_phone"
                  value={settings.support_phone}
                  onChange={handleChange}
                  placeholder="+1-800-000-0000"
                />
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Localization Settings */}
      <Card className="settings-card shadow-sm mb-4">
        <Card.Header className="bg-warning text-dark">
          <h5 className="mb-0">🌍 Localization Settings</h5>
        </Card.Header>
        <Card.Body>
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Platform Timezone</Form.Label>
            <Form.Select
              name="platform_timezone"
              value={settings.platform_timezone}
              onChange={handleChange}
            >
              {timezones.map(tz => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Card.Body>
      </Card>

      {/* Platform Settings */}
      <Card className="settings-card shadow-sm mb-4">
        <Card.Header className="bg-secondary text-white">
          <h5 className="mb-0">⚙️ Platform Settings</h5>
        </Card.Header>
        <Card.Body>
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Maximum Restaurants</Form.Label>
            <Form.Control
              type="number"
              name="max_restaurants"
              value={settings.max_restaurants}
              onChange={handleChange}
              min="1"
            />
            <Form.Text className="text-muted small">
              Limit the maximum number of restaurants that can register on the platform
            </Form.Text>
          </Form.Group>

          <Form.Check
            type="switch"
            id="enable-registration"
            name="enable_restaurant_registration"
            label="Enable Restaurant Registration"
            checked={settings.enable_restaurant_registration}
            onChange={handleChange}
            className="mb-3"
          />

          <Form.Check
            type="switch"
            id="maintenance-mode"
            name="maintenance_mode"
            label="Maintenance Mode (Platform will be unavailable to restaurants)"
            checked={settings.maintenance_mode}
            onChange={handleChange}
            className={settings.maintenance_mode ? 'text-danger' : ''}
          />
        </Card.Body>
      </Card>

      {/* System Info */}
      <Card className="settings-card shadow-sm mb-4">
        <Card.Header className="bg-dark text-white">
          <h5 className="mb-0">ℹ️ System Information</h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <div className="system-info-item mb-3">
                <p className="text-muted small mb-1">Platform Version</p>
                <p className="fw-bold">v1.0.0</p>
              </div>
              <div className="system-info-item mb-3">
                <p className="text-muted small mb-1">API Endpoint</p>
                <p className="fw-bold">api.foodsys.com</p>
              </div>
            </Col>
            <Col md={6}>
              <div className="system-info-item mb-3">
                <p className="text-muted small mb-1">Last Updated</p>
                <p className="fw-bold">{new Date().toLocaleDateString()}</p>
              </div>
              <div className="system-info-item mb-3">
                <p className="text-muted small mb-1">Database Status</p>
                <p className="fw-bold text-success">✓ Connected</p>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Action Buttons */}
      <div className="d-flex gap-2 mb-4">
        <Button variant="primary" size="lg" onClick={handleSave}>
          💾 Save Settings
        </Button>
        <Button variant="outline-secondary" size="lg" onClick={() => window.location.reload()}>
          🔄 Reset to Defaults
        </Button>
      </div>

      {/* Danger Zone */}
      <Card className="settings-card shadow-sm border-danger">
        <Card.Header className="bg-danger text-white">
          <h5 className="mb-0">⚠️ Danger Zone</h5>
        </Card.Header>
        <Card.Body>
          <p className="text-danger fw-bold mb-3">
            These actions cannot be undone. Proceed with caution.
          </p>
          <div className="d-flex gap-2">
            <Button variant="outline-danger">
              🗑️ Clear All Data
            </Button>
            <Button variant="outline-danger">
              🔐 Reset Admin Password
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default SystemSettings;
