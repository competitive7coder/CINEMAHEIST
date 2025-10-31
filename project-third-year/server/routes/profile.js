const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const upload = require('../config/cloudinary'); 

// @route   PUT api/profile/update-name
// @desc    Update user's name
router.put('/update-name', auth, async (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ msg: 'Name is required' });
    try {
        const user = await User.findById(req.user.id);
        user.name = name;
        await user.save();
        res.json({ msg: 'Name updated successfully', user: { name: user.name } });
    } catch (err) { res.status(500).send('Server Error'); }
});

// @route   PUT api/profile/update-password
// @desc    Update user's password
router.put('/update-password', auth, async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    try {
        const user = await User.findById(req.user.id);
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Current password is incorrect' });
        if (newPassword.length < 6) return res.status(400).json({ msg: 'New password must be at least 6 characters' });
        
        user.password = newPassword;
        await user.save();
        res.json({ msg: 'Password updated successfully' });
    } catch (err) { res.status(500).send('Server Error'); }
});

// @route   POST api/profile/picture
// @desc    Upload or update user profile picture
router.post('/picture', [auth, upload.single('profilePicture')], async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ msg: 'No file uploaded.' });
        }
        const user = await User.findById(req.user.id);
        user.profilePicture = req.file.path; // Save the image URL from Cloudinary
        await user.save();
        res.json({ msg: 'Profile picture updated!', profilePicture: user.profilePicture });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/profile/bio
// @desc    Update user's bio
router.put('/bio', auth, async (req, res) => {
    const { bio } = req.body;
    try {
        const user = await User.findById(req.user.id);
        user.bio = bio || '';
        await user.save();
        res.json({ msg: 'Bio updated!', bio: user.bio });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;