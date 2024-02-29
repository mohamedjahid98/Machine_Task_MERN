const express = require('express');
const router = express.Router();
const SignupModel = require('../Models/Signup');
const bcrypt = require('bcrypt');

// Unique Id Create
async function getNextId() {
    const lastSignup = await SignupModel.findOne({}, {}, { sort: { 'id': -1 } });
    console.log('Last Signup:', lastSignup);
    return (lastSignup && lastSignup.id) ? lastSignup.id + 1 : 1;
}

// All Signup data's
router.get('/signupdata', (req, res) => {
    SignupModel.find({})
    .then(signup=>res.json(signup))
    .catch(err=>res.json(err))
});

// All Signup by Id data's
router.get('/signupid', (req, res) => {
    SignupModel.find({}, { id: 1, _id: 0 }) 
        .then(signup => res.json(signup))
        .catch(err => res.json(err))
});



// Create Signup for User
router.post('/signup', async (req, res) => {
    const { email } = req.body;
    // Check if the email is already registered
    const existingUser = await SignupModel.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ success: false, message: 'Email is already registered' });
    }
    try {
        req.body.createdDate = new Date();
        const newSignup = await SignupModel.create({
            ...req.body,
            updatedDate: new Date(),
            id: await getNextId()
        });
        res.json({ success: true, message: 'Signup successful', user: newSignup });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
    }
});


// Get By Id of User
router.get('/getUserProfile/:id', (req, res) => {
    const id = req.params.id;
    SignupModel.findOne({ id: id }, { _id: 0, __v: 0 })
        .then(signup => {
            if (signup) {
                res.json({ id: signup.id, username: signup.username, email: signup.email, password: signup.password });
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        })
        .catch(err => res.json(err));
});



// Update Signup for User
router.put('/updateUserProfile/:id', (req, res) => {
    const id = req.params.id;
    req.body.updatedDate = new Date();

    SignupModel.findOneAndUpdate({ id: id }, req.body, { new: true })
        .then(signup => res.json(signup))
        .catch(err => res.json(err));
});


// Check Login For User
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the email exists in the database
        const user = await SignupModel.findOne({ email });

        if (user) {
            // Email exists, now check the password
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (passwordMatch) {
                res.json({ success: true, message: 'Login successful', user: user });
            } else {
                res.status(401).json({ success: false, message: 'Invalid password' });
            }
        } else {
            // Email does not exist in the database
            res.status(401).json({ success: false, message: 'Email not registered' });
        }
    } catch (error) {
        // Handle other errors (e.g., database error)
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});


module.exports = router;
