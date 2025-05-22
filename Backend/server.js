require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const User = require("./models/User");
const bcrypt = require("bcrypt");

const app = express();

app.use(
    cors({
        origin: process.env.CLIENT_URL || "*",
        methods: ["GET","POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

// Connect Database
connectDB();


//Middleware
app.use(express.json());

// Register user
app.post("/auth/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Check if user exists in database
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(409).json({ message: "User already exists" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        // Return user data
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" })
    }
})

// Login user
app.post("/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // check if email is registered
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(409).json({ message: "User doesn't exist" });
        }

        // Check password 
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        } 

        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            notes: user.notes
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
})


// Create new note
app.post("/notes/:userId", async (req, res) => {
    try {
        const {userId} = req.params;
        const { title, content, color } = req.body;

        // Validate user
        if (!title || !content ) {
            res.status(409).json({ message: "Both title and content are required" })
        }


        // Create a new note
        const newNote = {
            title,
            content
        };

        // Find user
        const user = await User.findByIdAndUpdate(
            userId, 
            { $push: { notes: newNote }}, // Push newNote to notes array
            { new: true } // Return the updated notes array
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        const addedNote = user.notes[user.notes.length - 1];
        res.status(201).json(addedNote);
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Server Error" });
    }
});

// Get notes
app.get("/notes/:userId", async (req, res) => {
    try {
        const {userId} = req.params;
        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ message: "User not found" })
        }
        res.status(200).json(user.notes.sort((a,b) => b.createdAt - a.createdAt))
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Server Error" })
    } 
})

// Get a specific note
app.get("/notes/:userId/:noteId", async (req, res) => {
    try {
        const { userId, noteId } = req.params;
        
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const note = user.notes.id(noteId);
        if (!note) return res.status(404).json({ message: "Note not found" });

        res.status(200).json(note);
    } catch (error) {
        res.status(500).json({ message: "Server Error" })
    }
})

// Update notes
app.put("/notes/:userId/:noteId", async (req, res) => {
    try {
        const { userId, noteId } = req.params;
        const { title, content, color } = req.body;
        
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const note = user.notes.id(noteId);
        if (!note) return res.status(404).json({ message: "Note not found" });

        
        note.title = title || note.title;
        note.content = content || note.content;
        note.color = color || note.color;

        await user.save();

        res.status(200).json({ message: "Note updated successfully", note})
        
    } catch (error) {
        res.status(500).json({ message: "Server Error" })
    }
})

// Delete note
app.delete("/notes/:userId/:noteId", async (req, res) => {
    try {
        const { userId, noteId } = req.params;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const note = user.notes.id(noteId);
        if (!note) return res.status(404).json({ message: "Note not found" });

        user.notes.pull({ _id: noteId });

        await user.save();

        res.status(200).json({ message: "Note deleted successfully" })

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
})

//Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));