import React, { useState } from 'react';

const CancelOrderModal = ({ show, handleClose, orderNumber, paymentMode }) => {
    const [remark, setRemark] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async () => {
        if (!remark.trim()) {
            setError("Please provide a reason for cancellation");
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/cancel_order/${orderNumber}/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ remark })
            });

            const result = await response.json();
            if (response.ok) {
                let msg = result.message;
                if (paymentMode === 'online') {
                    msg += "\nSince you paid online, your amount will be refunded.";
                }
                setMessage(msg);
                setRemark("");
                setError("");
            } else {
                setError(result.message || "Failed to cancel order");
            }
        } catch (err) {
            setError("Something went wrong");
        }
    };

    return (
        <div className={`modal fade ${show ? 'show d-block' : ''}`} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Cancel Order #{orderNumber}</h5>
                        <button type="button" className="btn-close" onClick={handleClose}></button>
                    </div>
                    <div className="modal-body">
                        {message && <div className="alert alert-success">{message}</div>}
                        {error && <div className="alert alert-danger">{error}</div>}
                        <label className="form-label">Reason for cancellation</label>
                        <textarea 
                            className="form-control" 
                            rows="4" 
                            value={remark} 
                            onChange={(e) => setRemark(e.target.value)} 
                            placeholder="Enter reason here..."
                        ></textarea>
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={handleClose}>Close</button>
                        <button className="btn btn-danger" onClick={handleSubmit}>Cancel Order</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CancelOrderModal;