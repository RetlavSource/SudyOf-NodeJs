const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');
const router = express.Router();

// Create a User
router.post('/users', async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch (e) {
        res.status(400).send(e);
    }
});

// Login with a User credentials
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({ user, token });
    } catch (e) {
        res.status(400).send();
    }
});

// Logout a user for the respective token
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        });
        await req.user.save();

        res.send();
    } catch (e) {
        res.status(500).send();
    }
});

// Logout ALL sessions
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();

        res.send();
    } catch (e) {
        res.status(500).send();
    }
});

// Get OWN profile
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user);
});

// Update the User profile
router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update]);
        await req.user.save();
        
        // this way, we can not access the meedleware from the model schema to hash the password before it is saved
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

        res.send(req.user);
    } catch (e) {
        res.status(400).send(e);
    }
});

// Delete the User
router.delete('/users/me', auth, async (req, res) => {
    try {
        req.user.remove();
        res.send(req.user);
    } catch (e) {
        res.status(500).send();
    }
});

module.exports = router;