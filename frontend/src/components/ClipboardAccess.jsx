import React, { useState, useEffect } from "react";
import {
  Link,
  useParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { clipboardAPI } from "../services/api";
import ClipboardWorkspace from "./ClipboardWorkspace";

const ClipboardAccess = () => {
  const { clipId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [clipboardData, setClipboardData] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const isNewlyCreated = searchParams.get("created") === "true";

  useEffect(() => {
    if (!clipId) {
      navigate("/");
    }
  }, [clipId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password.trim()) {
      setError("Password is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await clipboardAPI.verifyClipboard(clipId, password);
      setClipboardData(result);
      setIsAuthenticated(true);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to access clipboard");
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated && clipboardData) {
    return (
      <ClipboardWorkspace
        clipId={clipId}
        clipboardData={clipboardData}
        onLogout={() => {
          setIsAuthenticated(false);
          setClipboardData(null);
          setPassword("");
        }}
      />
    );
  }

  return (
    <div className="container">
      <Link to="/" className="back-button">
        ← Back to Home
      </Link>

      <div className="header">
        <h1>Access Clipboard</h1>
        <p>
          Enter password for: <code>{clipId}</code>
        </p>
      </div>

      {isNewlyCreated && (
        <div className="success">
          <strong>Clipboard created successfully!</strong>
          <br />
          Your clipboard URL is:{" "}
          <code>
            {window.location.origin}/clip/{clipId}
          </code>
          <br />
          Save this URL and share it with others who need access.
        </div>
      )}

      <form onSubmit={handleSubmit} className="form">
        {error && <div className="error">{error}</div>}

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter clipboard password"
            disabled={loading}
            autoFocus
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
          style={{ opacity: loading ? 0.6 : 1 }}
        >
          {loading ? "Verifying..." : "Access Clipboard"}
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
        <h3 style={{ marginBottom: "15px", color: "#fff" }}>Need help?</h3>
        <ul style={{ color: "#ccc", paddingLeft: "20px" }}>
          <li style={{ marginBottom: "8px" }}>
            Make sure you have the correct password
          </li>
          <li style={{ marginBottom: "8px" }}>
            Check that the clipboard ID in the URL is correct
          </li>
          <li>
            Contact the person who shared this clipboard if you're having
            trouble
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ClipboardAccess;
