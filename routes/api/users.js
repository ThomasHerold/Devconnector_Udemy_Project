const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator');

// @route  POST api/users
// @desc   Register user
// @access Public
router.post('/', [
    check('name', 'Name is required')
        .not()
        .isEmpty(),
    check('email', 'Please include a valid email')
        .isEmail(),
    check('password', 'Please enter a password with 6 or more characters')
        .isLength({ min: 6 })
], 
async (req, res) => {
    const errors = validationResult(req);
    const { name, email, password } = req.body;

    // If there are errors, return array containing error messages
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    
    try{
        // See if user exists
        let user = await User.findOne({ email });
        if(user) {
           return res.status(400).json({ errors: [{ msg: 'User already exists' }] }) // Error is formatted this way to match the errors.array format during validation
        }

        // Get user's gravatar - size, rating, default
        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        });

        // Create user 
        user = new User({
            name,
            email,
            avatar,
            password
        });

        // Encrypt password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Save User
        await user.save();

        // Return jsonwebtoken so user can be logged in right away. Token will contain payload of user info so system knows who has registered, then gives them access to protected routes
        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(
            payload, 
            config.get('jwtSecret'),
            { expiresIn: 36000 },
            (err, token) => {
                if(err) throw err;
                return res.json({ token })
            }
        );

    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }

});

module.exports = router;