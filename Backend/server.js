require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const User = require("./models/User");
const bcrypt = require("bcrypt");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const Note = require("./models/Note");

const app = express();

// Connect Database
connectDB();

// Trust proxy for secure cookies on Render/Heroku
app.set("trust proxy", 1);
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: {
      secure: false,
      sameSite: "lax",
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7
    },
  })
);

// Register user
app.post("/auth/signup", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });
    req.session.userId = user._id; // Set session
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: "Signup failed" });
  }
});

function requireAuth(req, res, next) {
  console.log("Session ID:", req.session.id);
  console.log("User ID in session:", req.session.userId);
  console.log("Session data:", req.session);
  if (!req.session.userId)
    return res.status(401).json({ error: "Unauthorized" });
  next();
}

// Login user
app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });
    req.session.userId = user._id; // Set session
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

// Check session endpoint
app.get("/auth/session", async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Session expired" });
  }
  try {
    const user = await User.findById(req.session.userId).select("_id email name");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ userId: user._id, email: user.email, name: user.name });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Create new note
app.post("/notes/:userId", requireAuth, async (req, res) => {
  const { title, content } = req.body;
  const { userId } = req.params;
  if (req.session.userId !== userId)
    return res.status(403).json({ error: "Forbidden" });
  try {
    const note = await Note.create({ user: userId, title, content });
    res.status(201).json(note);
  } catch (err) {
    res.status(400).json({ error: "Could not create note" });
  }
});

// Get notes
app.get("/notes/:userId", requireAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    const notes = await Note.find({ user: userId }).sort({ createdAt: -1 });
    if (!notes) {
      return res.status(404).json({ message: "No notes found" });
    }
    res.status(200).json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Get a specific note
app.get("/notes/:userId/:noteId", requireAuth, async (req, res) => {
  try {
    const { userId, noteId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const note = user.notes.id(noteId);
    if (!note) return res.status(404).json({ message: "Note not found" });

    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Update notes
app.put("/notes/:userId/:noteId", requireAuth, async (req, res) => {
  const { userId, noteId } = req.params;
  const { title, content, color } = req.body;
  if (req.session.userId !== userId)
    return res.status(403).json({ error: "Forbidden" });

  try {
    await Note.updateOne(
      { _id: noteId },
      { $set: { title: title, content: content, color: color } }
    );
    res.status(200).json({ message: "Note updated successfully" });
  } catch (err) {
    return res.status(400).json({ error: "Could not update note" });
  }
});

// Delete note
app.delete("/notes/:userId/:noteId", requireAuth, async (req, res) => {
  const { userId, noteId } = req.params;
  if (req.session.userId !== userId)
    return res.status(403).json({ error: "Forbidden" });
  try {
    await Note.deleteOne({ _id: noteId });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: "Could not delete note" });
  }
});

// Example: Root route
app.get("/", (req, res) => {
  res.send("API is running");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
