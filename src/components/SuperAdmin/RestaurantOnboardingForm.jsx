import { useState } from "react";

const INIT = {
  name: "",
  owner_email: "",
  owner_password: "",
  location: "",
  subscription_plan: "Standard",
  subscription_expiry: "",
};

export default function RestaurantOnboardingForm({ onClose, showToast }) {
  const [form, setForm] = useState(INIT);
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  // 🔐 Generate Password
  const generatePassword = () => {
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";
    let pass = "";
    for (let i = 0; i < 12; i++) {
      pass += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setForm((f) => ({ ...f, owner_password: pass }));
  };

  // 🚀 API CALL
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!form.name || !form.owner_email || !form.subscription_expiry) {
      showToast && showToast("Please fill all required fields", "warning");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/restaurants/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          owner_email: form.owner_email,
          owner_password: form.owner_password,
          location: form.location,
          subscription_plan: form.subscription_plan,
          subscription_expiry: form.subscription_expiry,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        showToast &&
          showToast("Restaurant created successfully ✅", "success");

        setForm(INIT);
        if (onClose) onClose();
      } else {
        showToast &&
          showToast(data.message || "Something went wrong ❌", "error");
      }
    } catch (error) {
      console.error(error);
      showToast && showToast("Server error ❌", "error");
    } finally {
      setLoading(false);
    }
  };

  // 🎨 Styles (clean UI)
  const styles = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0,0,0,0.4)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
      padding: "20px",
    },
    modal: {
      width: "100%",
      maxWidth: "600px",
      backgroundColor: "white",
      borderRadius: "8px",
      overflow: "hidden",
      boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
    },
    header: {
      backgroundColor: "#3386c4",
      color: "white",
      padding: "15px 20px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      fontSize: "18px",
      fontWeight: "500",
    },
    body: { padding: "25px 30px" },
    group: {
      marginBottom: "20px",
      display: "flex",
      flexDirection: "column",
    },
    label: {
      fontWeight: "600",
      color: "#444",
      marginBottom: "8px",
      fontSize: "14px",
    },
    input: {
      padding: "10px 12px",
      border: "1px solid #ced4da",
      borderRadius: "6px",
      fontSize: "15px",
      outline: "none",
      width: "100%",
    },
    footer: {
      display: "flex",
      justifyContent: "flex-end",
      gap: "10px",
      marginTop: "10px",
    },
    btnCancel: {
      padding: "10px 20px",
      borderRadius: "6px",
      border: "none",
      backgroundColor: "#6c757d",
      color: "white",
      cursor: "pointer",
    },
    btnSubmit: {
      padding: "10px 20px",
      borderRadius: "6px",
      border: "none",
      backgroundColor: "#3386c4",
      color: "white",
      fontWeight: "500",
      cursor: "pointer",
    },
  };

  return (
    <div
      style={styles.overlay}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={styles.modal}>
        {/* Header */}
        <div style={styles.header}>
          <span>Restaurant Onboarding</span>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "white",
              fontSize: "22px",
              cursor: "pointer",
            }}
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div style={styles.body}>
          {/* Name */}
          <div style={styles.group}>
            <label style={styles.label}>Restaurant Name</label>
            <input
              style={styles.input}
              placeholder="Enter restaurant name"
              value={form.name}
              onChange={set("name")}
            />
          </div>

          {/* Email */}
          <div style={styles.group}>
            <label style={styles.label}>Owner Email</label>
            <input
              style={styles.input}
              type="email"
              placeholder="owner@restaurant.com"
              value={form.owner_email}
              onChange={set("owner_email")}
            />
          </div>

          {/* Password (FIXED UI) */}
          <div style={styles.group}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <label style={{ ...styles.label, marginBottom: 0 }}>
                Temporary Password
              </label>

              <button
                type="button"
                onClick={generatePassword}
                style={{
                  padding: "4px 10px",
                  fontSize: "13px",
                  color: "#3386c4",
                  border: "1px solid #3386c4",
                  borderRadius: "4px",
                  background: "none",
                  cursor: "pointer",
                }}
              >
                Generate
              </button>
            </div>

            <input
              style={styles.input}
              placeholder="Temporary password"
              value={form.owner_password}
              onChange={set("owner_password")}
            />

            <span style={{ fontSize: "12px", color: "#6c757d" }}>
              The owner will change this on first login
            </span>
          </div>

          {/* Location */}
          <div style={styles.group}>
            <label style={styles.label}>Location</label>
            <input
              style={styles.input}
              placeholder="e.g., Mumbai"
              value={form.location}
              onChange={set("location")}
            />
          </div>

          {/* Plan */}
          <div style={styles.group}>
            <label style={styles.label}>Subscription Plan</label>
            <select
              style={styles.input}
              value={form.subscription_plan}
              onChange={set("subscription_plan")}
            >
              <option>Basic</option>
              <option>Standard</option>
              <option>Premium</option>
            </select>
          </div>

          {/* Expiry */}
          <div style={styles.group}>
            <label style={styles.label}>Subscription Expiry Date</label>
            <input
              type="date"
              style={styles.input}
              value={form.subscription_expiry}
              onChange={set("subscription_expiry")}
            />
          </div>

          {/* Buttons */}
          <div style={styles.footer}>
            <button style={styles.btnCancel} onClick={onClose}>
              Cancel
            </button>
            <button
              style={styles.btnSubmit}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Restaurant"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}