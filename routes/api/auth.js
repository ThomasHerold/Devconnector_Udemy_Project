const express = require('express');
const auth = require('../../middleware/auth');
const router = express.Router();
const User = require('../../models/User');
const { check, validationResult } = require('express-validator');
const config = require('config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// @route  GET api/auth
// @desc   Test Route
// @access Public
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password'); // search by Id because our token was setup to contain a payload using user id
        return res.json(user);
    } catch (error) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route  POST api/auth
// @desc   Authenticate user & get token
// @access Public
router.post('/', [
    check('email', 'Please include a valid email')
        .isEmail(),
    check('password', 'Password is required')
        .exists()
], 
async (req, res) => {
    // req is what the user is sending to the API, which in this case is the email and password credentials
    const errors = validationResult(req);
    const { email, password } = req.body;

    // If there are errors, return array containing error messages
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    
    try{
        // See if user exists
        let user = await User.findOne({ email });
        if(!user) {
           return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] }); // Error is formatted this way to match the errors.array format during validation
        }

        // Match email and password
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
        }

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