require('dotenv').config();

const config = require('./config.json');
const mongoose = require('mongoose');

mongoose.connect(config.connectionString);

const User = require('./models/user.model');
const Note = require('./models/note.model');

const express = require('express');
const cors = require('cors');
const app = express();

const jwt = require('jsonwebtoken');
const { authenticateToken } = require('./utilities');   


app.use(express.json());

app.use(
    cors({
        origin: "*",
    })
);

app.get('/', (req, res) => {
    res.json({ data: "Hello World!" });
});

// Create Account
app.post("/create-account", async (req, res) => {
    const { fullName, email, password } = req.body;
    if (!fullName) {
        return res
            .status(400)
            .json({ error: true, message: "Full Name is required" });
    }
    if (!email) {
        return res
            .status(400)
            .json({ error: true, message: "Email is required" });
    }
    if (!password) {
        return res
            .status(400)
            .json({ error: true, message: "Password is required" });
    }

    const isUser = await User.findOne({ email: email });
    if (isUser) {
        return res
            .status(400)
            .json({ error: true, message: "User already exists" });
    }

    const user = new User({
        fullName,
        email,
        password,
    });

    await user.save();

    const accessToken = jwt.sign({ _id: user._id, email: user.email }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '36000m',
    });

    return res.json({
        error: false,
        user,
        accessToken,
        message: "Account created successfully",
    });
});

// Login
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email) {
        return res
            .status(400)
            .json({ error: true, message: "Email is required" });
    }
    if (!password) {
        return res
            .status(400)
            .json({ error: true, message: "Password is required" });
    }

    const userInfo = await User.findOne({ email: email });
    if (!userInfo) {
        return res
            .status(400)
            .json({ error: true, message: "User does not exist" });
    }

    if (userInfo.email === email && userInfo.password === password) {
        const accessToken = jwt.sign({ _id: userInfo._id, email: userInfo.email }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '36000m',
        });
        return res.json({
            error: false,
            email,
            accessToken,
        });
    } else {
        return res
            .status(400)
            .json({ error: true, message: "Invalid credentials" });
    }
});

// Add Note
app.post("/add-note", authenticateToken, async (req, res) => {
    const { title, content, tags } = req.body;
    const userId = req.user._id;
    if (!title) {
        return res
            .status(400)
            .json({ error: true, message: "Title is required" });
    }
    if (!content) {
        return res
            .status(400)
            .json({ error: true, message: "Content is required" });
    }
    try {
        const note = new Note({
            title,
            content,
            tags: tags || [],
            userId,
        });
        await note.save();
        return res.json({
            error: false,
            note,
            message: "Note added successfully",
        });
    } catch (error) {
        return res.status(400).json({ error: true, message: error.message });
    }
});

// Delete Note
app.post('/delete-note/:noteId', authenticateToken, async (req, res) => {
    const { noteId } = req.params;
    const { _id } = req.user;

    try {
        const note = await Note.findOne({ _id: noteId, userId: _id });
        if (!note) {
            return res.status(400).json({ error: true, message: 'Note not found' });
        }
        await note.remove();
        return res.json({
            error: false,
            message: 'Note deleted successfully',
        });
    } catch (error) {
        return res.status(500).json({ error: true, message: error.message });
    }
});

// Update IsPinned
app.put('/update-is-pinned/:noteId', authenticateToken, async (req, res) => {
    const { noteId } = req.params;
    const { isPinned } = req.body;
    const { _id } = req.user;

    try {
        const note = await Note.findOne({ _id: noteId, userId: _id });
        if (!note) {
            return res.status(400).json({ error: true, message: 'Note not found' });
        }

        note.isPinned = typeof isPinned === 'boolean' ? isPinned : note.isPinned;
        await note.save();

        return res.json({
            error: false,
            note,
            message: 'Note pinned status updated successfully',
        });
    } catch (error) {
        return res.status(500).json({ error: true, message: error.message });
    }
});

// Get User
app.get('/get-user', authenticateToken, async (req, res) => {
    try {
        console.log("Fetching user from req.user:", req.user);

        // Extract _id from the correct depth in the decoded token
        const { user: { _id } } = req.user.user;

        const isUser = await User.findOne({ _id });
        if (!isUser) {
            return res.status(400).json({ error: true, message: 'User not found' });
        }

        return res.json({
            error: false,
            user: isUser,
            message: 'User fetched successfully',
        });
    } catch (error) {
        console.log("Error in get-user:", error);
        return res.status(500).json({ error: true, message: error.message });
    }
});


app.listen(8000, () => {
    console.log('Server running on port 8000');
});

module.exports = app;
