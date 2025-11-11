import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import User from './user.js';

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


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
