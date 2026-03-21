import React, { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

const RestaurantOnboardingForm = ({ show, onHide, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    owner_email: '',
    owner_password: '',
    location: '',
    subscription_plan: 'Standard',
    subscription_expiry: '',
  });

  const [errors, setErrors] = useState({});

  const subscriptionPlans = [
    { value: 'Basic', label: 'Basic ($99/month)' },
    { value: 'Standard', label: 'Standard ($199/month)' },
    { value: 'Premium', label: 'Premium ($399/month)' },
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Restaurant name is required';
    }

    if (!formData.owner_email.trim()) {
      newErrors.owner_email = 'Owner email is required';
    } else if (!isValidEmail(formData.owner_email)) {
      newErrors.owner_email = 'Please enter a valid email';
    }

    if (!formData.owner_password.trim()) {
      newErrors.owner_password = 'Password is required';
    } else if (formData.owner_password.length < 8) {
      newErrors.owner_password = 'Password must be at least 8 characters';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.subscription_expiry) {
      newErrors.subscription_expiry = 'Expiry date is required';
    }

    return newErrors;
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const generatePassword = () => {
    const length = 12;
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setFormData(prev => ({
      ...prev,
      owner_password: password,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);

    setFormData({
      name: '',
      owner_email: '',
      owner_password: '',
      location: '',
      subscription_plan: 'Standard',
      subscription_expiry: '',
    });
    setErrors({});
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton className="border-bottom-2 bg-light">
        <Modal.Title className="fw-bold">Restaurant Onboarding</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        <Form onSubmit={handleSubmit}>

          {/* Restaurant Name */}
          <Form.Group className="mb-4">
            <Form.Label className="fw-bold">Restaurant Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter restaurant name"
              className={errors.name ? 'is-invalid' : ''}
            />
            {errors.name && <Form.Text className="text-danger">{errors.name}</Form.Text>}
          </Form.Group>

          {/* Owner Email */}
          <Form.Group className="mb-4">
            <Form.Label className="fw-bold">Owner Email</Form.Label>
            <Form.Control
              type="email"
              name="owner_email"
              value={formData.owner_email}
              onChange={handleChange}
              placeholder="owner@restaurant.com"
              className={errors.owner_email ? 'is-invalid' : ''}
            />
            {errors.owner_email && (
              <Form.Text className="text-danger">{errors.owner_email}</Form.Text>
            )}
          </Form.Group>

          {/* Password */}
          <Form.Group className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <Form.Label className="fw-bold mb-0">Temporary Password</Form.Label>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={generatePassword}
                type="button"
              >
                Generate
              </Button>
            </div>
            <Form.Control
              type="text"
              name="owner_password"
              value={formData.owner_password}
              onChange={handleChange}
              placeholder="Temporary password"
              className={errors.owner_password ? 'is-invalid' : ''}
            />
            {errors.owner_password && (
              <Form.Text className="text-danger">{errors.owner_password}</Form.Text>
            )}
            <Form.Text className="text-muted">
              The owner will change this on their first login
            </Form.Text>
          </Form.Group>

          {/* Location */}
          <Form.Group className="mb-4">
            <Form.Label className="fw-bold">Location</Form.Label>
            <Form.Control
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Mumbai, Maharashtra"
              className={errors.location ? 'is-invalid' : ''}
            />
            {errors.location && (
              <Form.Text className="text-danger">{errors.location}</Form.Text>
            )}
          </Form.Group>

          {/* Subscription Plan */}
          <Form.Group className="mb-4">
            <Form.Label className="fw-bold">Subscription Plan</Form.Label>
            <Form.Select
              name="subscription_plan"
              value={formData.subscription_plan}
              onChange={handleChange}
            >
              {subscriptionPlans.map(plan => (
                <option key={plan.value} value={plan.value}>
                  {plan.label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {/* Subscription Expiry Date */}
          <Form.Group className="mb-4">
            <Form.Label className="fw-bold">Subscription Expiry Date</Form.Label>
            <Form.Control
              type="date"
              name="subscription_expiry"
              value={formData.subscription_expiry}
              onChange={handleChange}
              className={errors.subscription_expiry ? 'is-invalid' : ''}
            />
            {errors.subscription_expiry && (
              <Form.Text className="text-danger">{errors.subscription_expiry}</Form.Text>
            )}
          </Form.Group>

          <div className="d-flex gap-2 justify-content-end">
            <Button variant="secondary" onClick={onHide}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Create Restaurant Account
            </Button>
          </div>

        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default RestaurantOnboardingForm;