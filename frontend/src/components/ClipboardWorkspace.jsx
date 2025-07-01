import React, { useState, useEffect } from "react";
import { clipboardAPI } from "../services/api";

const ClipboardWorkspace = ({ clipId, clipboardData, onLogout }) => {
  const [notes, setNotes] = useState(clipboardData.notes || []);
  const [newNoteContent, setNewNoteContent] = useState("");
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAddNote, setShowAddNote] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const handleAddNote = async (e) => {
    e.preventDefault();

    if (!newNoteContent.trim()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const newNote = await clipboardAPI.addNote(clipId, newNoteContent.trim());
      setNotes([...notes, newNote]);
      setNewNoteContent("");
      setShowAddNote(false);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add note");
    } finally {
      setLoading(false);
    }
  };

  const handleEditNote = async (noteId) => {
    if (!editContent.trim()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const updatedNote = await clipboardAPI.updateNote(
        clipId,
        noteId,
        editContent.trim()
      );
      setNotes(notes.map((note) => (note.id === noteId ? updatedNote : note)));
      setEditingNoteId(null);
      setEditContent("");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update note");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!confirm("Are you sure you want to delete this note?")) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      await clipboardAPI.deleteNote(clipId, noteId);
      setNotes(notes.filter((note) => note.id !== noteId));
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete note");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (note) => {
    setEditingNoteId(note.id);
    setEditContent(note.content);
  };

  const cancelEdit = () => {
    setEditingNoteId(null);
    setEditContent("");
  };

  return (
    <div className="container">
      <div className="workspace">
        <div className="workspace-header">
          <div>
            <h1 className="workspace-title">{clipboardData.name}</h1>
            <div className="workspace-url">
              {window.location.origin}/clip/{clipId}
            </div>
          </div>
          <button onClick={onLogout} className="btn">
            Lock Clipboard
          </button>
        </div>

        {error && <div className="error">{error}</div>}

        <div className="notes-section">
          <div className="notes-header">
            <h3>Notes ({notes.length})</h3>
            <button
              onClick={() => setShowAddNote(!showAddNote)}
              className="btn btn-primary"
            >
              {showAddNote ? "Cancel" : "Add Note"}
            </button>
          </div>

          {showAddNote && (
            <form onSubmit={handleAddNote} className="note-form">
              <div className="form-group">
                <label htmlFor="newNote">New Note</label>
                <textarea
                  id="newNote"
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  placeholder="Enter your note content..."
                  rows={6}
                  disabled={loading}
                />
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading || !newNoteContent.trim()}
                >
                  {loading ? "Adding..." : "Add Note"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddNote(false);
                    setNewNoteContent("");
                  }}
                  className="btn"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {notes.length === 0 ? (
            <div className="empty-state">
              <h3>No notes yet</h3>
              <p>Click "Add Note" to create your first note.</p>
            </div>
          ) : (
            <div>
              {notes.map((note) => (
                <div key={note.id} className="note-item">
                  {editingNoteId === note.id ? (
                    <div>
                      <div className="form-group">
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          rows={6}
                          disabled={loading}
                        />
                      </div>
                      <div style={{ display: "flex", gap: "10px" }}>
                        <button
                          onClick={() => handleEditNote(note.id)}
                          className="btn btn-primary btn-small"
                          disabled={loading || !editContent.trim()}
                        >
                          {loading ? "Saving..." : "Save"}
                        </button>
                        <button onClick={cancelEdit} className="btn btn-small">
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="note-content">{note.content}</div>
                      <div className="note-meta">
                        <div>
                          <div>Created: {formatDate(note.createdAt)}</div>
                          {note.updatedAt !== note.createdAt && (
                            <div>Updated: {formatDate(note.updatedAt)}</div>
                          )}
                        </div>
                        <div className="note-actions">
                          <button
                            onClick={() => startEdit(note)}
                            className="btn btn-small"
                            disabled={loading}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteNote(note.id)}
                            className="btn btn-danger btn-small"
                            disabled={loading}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClipboardWorkspace;
