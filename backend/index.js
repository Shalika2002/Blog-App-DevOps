import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import User from './user.js';
import Post from './post.js';

const app = express();
const port = 3000;

mongoose.connect('mongodb://mongo:27017/database').then(() => {
    console.log('Successfully connected to MongoDB');
}).catch(err => {
    console.error('Connection error', err);
    process.exit();
});

app.use(cors());
app.use(express.json());
// Serve uploaded images statically
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Multer storage config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});
const upload = multer({ storage });


app.post('/signup', async (req, res) => {
    try {
        const { username, password } = req.body;

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ message: 'Username already taken' });
        }

        const user = new User({ username, password });
        await user.save();

        res.status(201).json({ message: 'Sign up successful', user});
    } catch (e) {
        console.error(e);
        res.status(500).send('Error signing up');
    }
});


app.post('/signin', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({
           username: username,
           password: password,
        });

        if (user) {
            res.json({ message: 'Sign in successful', user });
        } else {
            res.status(401).send('Invalid credentials');
        }
    } catch (e) {
         console.error(e);
        res.status(500).send('Error signing in');
    }
});

// Create a post (text + optional image)
app.post('/posts', upload.single('image'), async (req, res) => {
    try {
        const { text, username } = req.body;
        if (!text) {
            return res.status(400).json({ message: 'Text is required' });
        }
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
        const post = new Post({ text, imageUrl, username: username || 'Anonymous' });
        await post.save();
        res.status(201).json({ message: 'Post created', post });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Error creating post' });
    }
});

// List posts newest first
app.get('/posts', async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 }).limit(100);
        res.json(posts);
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Error fetching posts' });
    }
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
