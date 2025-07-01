import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { clipboardAPI } from "../services/api";

const CreateClipboard = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !password.trim()) {
      setError("Name and password are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await clipboardAPI.createClipboard(name.trim(), password);
      navigate(`/clip/${result.clipId}?created=true`);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create clipboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <Link to="/" className="back-button">
        ← Back to Home
      </Link>

      <div className="header">
        <h1>Create New Clipboard</h1>
        <p>Set up your workspace name and password</p>
      </div>

      <form onSubmit={handleSubmit} className="form">
        {error && <div className="error">{error}</div>}

        <div className="form-group">
          <label htmlFor="name">Workspace Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter workspace name (e.g., My Project Notes)"
            disabled={loading}
            maxLength={100}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter a secure password"
            disabled={loading}
            minLength={4}
          />
          <small style={{ color: "#888", fontSize: "0.85rem" }}>
            Minimum 4 characters. You'll need this to access your clipboard.
          </small>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
          style={{ opacity: loading ? 0.6 : 1 }}
        >
          {loading ? "Creating..." : "Create Clipboard"}
        </button>
      </form>

      <div
        style={{
          marginTop: "30px",
          padding: "20px",
          backgroundColor: "#111",
          borderRadius: "8px",
          border: "1px solid #333",
        }}
      >
        <h3 style={{ marginBottom: "15px", color: "#fff" }}>
          What happens next?
        </h3>
        <ul style={{ color: "#ccc", paddingLeft: "20px" }}>
          <li style={{ marginBottom: "8px" }}>
            Customize your clipboard URL — like /clip/rohit123
          </li>
          <li style={{ marginBottom: "8px" }}>
            Use this URL to access your notes anytime
          </li>
          <li style={{ marginBottom: "8px" }}>
            Share the URL and password with team members
          </li>
          <li>Your notes are automatically saved to the cloud</li>
        </ul>
      </div>
    </div>
  );
};

export default CreateClipboard;
