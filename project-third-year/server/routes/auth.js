const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto'); // Built-in Node.js module
const User = require('../models/User');
const authMiddleware = require('../middleware/auth'); // Your "security guard" file
const sendEmail = require('../utils/emailService'); // The email service

// @route   POST api/auth/register
// @desc    Register a user
// @access  Public
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }
        user = new User({ name, email, password });
        await user.save(); // Password will be hashed by the .pre('save') hook in your User.js
        res.status(201).json({ msg: 'User registered successfully. Please log in.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }
        const payload = { user: { id: user.id } };
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '5h' }, // Token expires in 5 hours
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/auth/user
// @desc    Get logged in user's data
// @access  Private
router.get('/user', authMiddleware, async (req, res) => {
    try {
        // req.user.id is attached by the authMiddleware
        const user = await User.findById(req.user.id).select('-password'); // -password means "don't select the password"
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// =======================================================
// === NEW FORGOT PASSWORD LOGIC ===
// =======================================================

// @route   POST api/auth/forgot-password
// @desc    Send password reset email
// @access  Public
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    // IMPORTANT: For security, always send a success response
    // This prevents attackers from guessing which emails are registered
    if (!user) {
      return res.status(200).json({ message: 'If an account with that email exists, a reset link has been sent.' });
    }

    // 1. Generate the un-hashed token (this is what's emailed)
    const resetToken = crypto.randomBytes(32).toString('hex');

    // 2. Hash the token (this is what's stored in the DB)
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    
    // 3. Set token expiry (1 hour)
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    await user.save();

    // 4. Create reset URL for the email
    // This URL must point to your REACT app
    // const resetURL = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;
    // This is the correct, production-ready code:
const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    // 5. Create email message
    const message = `
      <h1>You have requested a password reset for StreamHub</h1>
      <p>Please click the link below to reset your password. This link will expire in 1 hour.</p>
      <a href="${resetURL}" style="padding: 10px 15px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
      <p>If you did not request this, please ignore this email.</p>
    `;

    // 6. Send the email
    await sendEmail({
      to: user.email,
      subject: 'StreamHub - Password Reset Request',
      html: message
    });

    res.status(200).json({ message: ' Reset link has been sent successfully.' });

  } catch (err) {
    console.error(err.message);
    // Clear the token if anything failed
    if (user) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
    }
    res.status(500).send('Server Error');
  }
});


// @route   POST api/auth/reset-password/:token
// @desc    Reset user's password
// @access  Public
router.post('/reset-password/:token', async (req, res) => {
  const { password } = req.body;
  try {
    // 1. Get the un-hashed token from the URL (req.params.token) and hash it
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    // 2. Find the user by the HASHED token and check if it's expired
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() } // $gt means "greater than now"
    });

    // 3. If no user, the token is invalid or expired
    if (!user) {
      return res.status(400).json({ msg: 'Token is invalid or has expired.' });
    }

    // 4. Set the new password
    // The .pre('save') hook in your User.js model will automatically hash this
    user.password = password;

    // 5. Clear the token fields (making it one-time-use)
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: 'Password has been reset successfully. Please log in.' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;

