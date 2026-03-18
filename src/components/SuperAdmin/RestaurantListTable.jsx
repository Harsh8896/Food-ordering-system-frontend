import React, { useState } from 'react';
import { Table, Badge, Button, ButtonGroup, Modal, Form } from 'react-bootstrap';

const RestaurantListTable = ({ restaurants, onEdit, onDelete, onSuspend }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  const handleEditClick = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setEditFormData(restaurant);
    setShowEditModal(true);
  };

  const handleDeleteClick = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (selectedRestaurant) {
      onDelete(selectedRestaurant.id);
      setShowDeleteModal(false);
      setSelectedRestaurant(null);
    }
  };

  const handleSaveEdit = () => {
    if (selectedRestaurant) {
      onEdit(selectedRestaurant.id, editFormData);
      setShowEditModal(false);
      setSelectedRestaurant(null);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const getStatusBadge = (status) => {
    return status === 'active' ? (
      <Badge bg="success">Active</Badge>
    ) : (
      <Badge bg="danger">Suspended</Badge>
    );
  };

  return (
    <>
      <div className="table-responsive restaurant-table-wrapper">
        <Table hover className="restaurant-table">
          <thead>
            <tr>
              <th>Restaurant Name</th>
              <th>Owner Email</th>
              <th>Location</th>
              <th>Plan</th>
              <th>Status</th>
              <th>Created Date</th>
              <th>Revenue</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {restaurants.length > 0 ? (
              restaurants.map(restaurant => (
                <tr key={restaurant.id}>
                  <td className="fw-bold">{restaurant.name}</td>
                  <td>{restaurant.owner_email}</td>
                  <td>{restaurant.location}</td>
                  <td>
                    <Badge bg="info">{restaurant.subscription_plan}</Badge>
                  </td>
                  <td>{getStatusBadge(restaurant.status)}</td>
                  <td>{restaurant.created_date}</td>
                  <td className="text-success fw-bold">{restaurant.revenue}</td>
                  <td>
                    <ButtonGroup size="sm">
                      <Button
                        variant="outline-primary"
                        title="Edit"
                        onClick={() => handleEditClick(restaurant)}
                      >
                        ✏️
                      </Button>
                      <Button
                        variant={
                          restaurant.status === 'active'
                            ? 'outline-warning'
                            : 'outline-success'
                        }
                        title={
                          restaurant.status === 'active' ? 'Suspend' : 'Activate'
                        }
                        onClick={() => onSuspend(restaurant.id)}
                      >
                        {restaurant.status === 'active' ? '🚫' : '✓'}
                      </Button>
                      <Button
                        variant="outline-danger"
                        title="Delete"
                        onClick={() => handleDeleteClick(restaurant)}
                      >
                        🗑️
                      </Button>
                    </ButtonGroup>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center text-muted py-4">
                  No restaurants found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Restaurant</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Restaurant Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={editFormData.name || ''}
                onChange={handleEditChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Owner Email</Form.Label>
              <Form.Control
                type="email"
                name="owner_email"
                value={editFormData.owner_email || ''}
                onChange={handleEditChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                name="location"
                value={editFormData.location || ''}
                onChange={handleEditChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Subscription Plan</Form.Label>
              <Form.Select
                name="subscription_plan"
                value={editFormData.subscription_plan || ''}
                onChange={handleEditChange}
              >
                <option value="Basic">Basic</option>
                <option value="Standard">Standard</option>
                <option value="Premium">Premium</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveEdit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton className="border-danger">
          <Modal.Title className="text-danger">Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Are you sure you want to delete <strong>{selectedRestaurant?.name}</strong>? 
            This action is permanent and cannot be undone.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Delete Restaurant
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default RestaurantListTable;
