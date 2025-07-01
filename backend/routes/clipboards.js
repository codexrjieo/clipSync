const express = require("express");
const bcrypt = require("bcryptjs");
const Clipboard = require("../models/Clipboard");

const router = express.Router();

// Generate random note ID
function generateNoteId() {
  return "note_" + Math.random().toString(36).substring(2, 15);
}

// Create new clipboard (user-defined clipId)
router.post("/create", async (req, res) => {
  try {
    console.log("CREATE REQUEST:", req.body);

    const { clipId, password } = req.body;

    if (!clipId || !password) {
      console.log("Missing clipId or password");
      return res
        .status(400)
        .json({ error: "clipId and password are required." });
    }

    const exists = await Clipboard.findOne({ clipId });
    if (exists) {
      console.log("Clipboard already exists:", clipId);
      return res.status(409).json({ error: "Workspace already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const clipboard = new Clipboard({
      clipId,
      name: clipId,
      password: hashedPassword,
      notes: [],
    });

    await clipboard.save();

    console.log("Clipboard saved:", clipId);
    res
      .status(201)
      .json({ clipId, message: "Clipboard created successfully." });
  } catch (error) {
    console.error("Server crash error:", error);
    res
      .status(500)
      .json({ error: "Failed to create clipboard", details: error.message });
  }
});

// Verify clipboard access
router.post("/:clipId/verify", async (req, res) => {
  try {
    const { clipId } = req.params;
    const { password } = req.body;

    const clipboard = await Clipboard.findOne({ clipId });
    if (!clipboard) {
      return res.status(404).json({ error: "Clipboard not found." });
    }

    const isValid = await bcrypt.compare(password, clipboard.password);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid password." });
    }

    res.json({
      name: clipboard.name,
      notes: clipboard.notes,
      message: "Access granted",
    });
  } catch (error) {
    console.error("Error verifying clipboard:", error.message);
    res.status(500).json({ error: "Failed to verify clipboard" });
  }
});

// Get clipboard (no password check)
router.get("/:clipId", async (req, res) => {
  try {
    const { clipId } = req.params;

    const clipboard = await Clipboard.findOne({ clipId });
    if (!clipboard) {
      return res.status(404).json({ error: "Clipboard not found." });
    }

    res.json({
      name: clipboard.name,
      notes: clipboard.notes,
    });
  } catch (error) {
    console.error("Error fetching clipboard:", error.message);
    res.status(500).json({ error: "Failed to fetch clipboard" });
  }
});

// Add a note
router.post("/:clipId/notes", async (req, res) => {
  try {
    const { clipId } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: "Content is required." });
    }

    const clipboard = await Clipboard.findOne({ clipId });
    if (!clipboard) {
      return res.status(404).json({ error: "Clipboard not found." });
    }

    const newNote = {
      id: generateNoteId(),
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    clipboard.notes.push(newNote);
    await clipboard.save();

    res.status(201).json(newNote);
  } catch (error) {
    console.error("Error adding note:", error.message);
    res.status(500).json({ error: "Failed to add note" });
  }
});

// Update a note
router.put("/:clipId/notes/:noteId", async (req, res) => {
  try {
    const { clipId, noteId } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: "Content is required." });
    }

    const clipboard = await Clipboard.findOne({ clipId });
    if (!clipboard) {
      return res.status(404).json({ error: "Clipboard not found." });
    }

    const note = clipboard.notes.find((n) => n.id === noteId);
    if (!note) {
      return res.status(404).json({ error: "Note not found." });
    }

    note.content = content;
    note.updatedAt = new Date();

    await clipboard.save();
    res.json(note);
  } catch (error) {
    console.error("Error updating note:", error.message);
    res.status(500).json({ error: "Failed to update note" });
  }
});

// Delete a note
router.delete("/:clipId/notes/:noteId", async (req, res) => {
  try {
    const { clipId, noteId } = req.params;

    const clipboard = await Clipboard.findOne({ clipId });
    if (!clipboard) {
      return res.status(404).json({ error: "Clipboard not found." });
    }

    clipboard.notes = clipboard.notes.filter((n) => n.id !== noteId);
    await clipboard.save();

    res.json({ message: "Note deleted successfully." });
  } catch (error) {
    console.error("Error deleting note:", error.message);
    res.status(500).json({ error: "Failed to delete note" });
  }
});

module.exports = router;
