import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="container">
      <div className="header">
        <h1>ClipSync</h1>
        <p>Simple Multi-Note Clipboard</p>
      </div>

      <div className="form">
        <h2 style={{ marginBottom: "20px", color: "#fff" }}>Get Started</h2>
        <p style={{ marginBottom: "30px", color: "#ccc" }}>
          Create a new clipboard workspace or access an existing one.
        </p>

        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          <Link to="/create" className="btn btn-primary">
            Create New Clipboard
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ color: "#888" }}>or go to</span>
            <code
              style={{
                backgroundColor: "#222",
                padding: "4px 8px",
                borderRadius: "4px",
                color: "#ccc",
                border: "1px solid #444",
              }}
            >
              /clip/your-id
            </code>
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: "40px",
          padding: "20px",
          backgroundColor: "#111",
          borderRadius: "8px",
          border: "1px solid #333",
        }}
      >
        <h3 style={{ marginBottom: "15px", color: "#fff" }}>How it works:</h3>
        <ul style={{ color: "#ccc", paddingLeft: "20px" }}>
          <li style={{ marginBottom: "8px" }}>
            Create a clipboard workspace with a name and password
          </li>
          <li style={{ marginBottom: "8px" }}>
            Get started with a unique URL like <code>/clip/your-id</code>
          </li>
          <li style={{ marginBottom: "8px" }}>
            Add, edit, and delete multiple text notes
          </li>
          <li style={{ marginBottom: "8px" }}>
            Share the URL and password with others to collaborate
          </li>
          <li>All data is stored securely in the cloud</li>
        </ul>
      </div>
    </div>
  );
};

export default Home;
