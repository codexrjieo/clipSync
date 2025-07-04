import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import CreateClipboard from "./components/CreateClipboard";
import ClipboardAccess from "./components/ClipboardAccess";
import "./styles/App.css";

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateClipboard />} />
          <Route path="/clip/:clipId" element={<ClipboardAccess />} />
          {/* Catch-all route for unknown paths */}
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
