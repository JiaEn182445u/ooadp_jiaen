const express = require('express');
const router = express.Router();
const User = require('../models/CUser');
const feedback = require('../models/feedback');
const alertMessage = require('../helpers/messenger');
var bcrypt = require('bcryptjs');
const passport = require('passport');


// Login Form POST => /user/login
router.post('/clogin', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/', // Route to /video/listVideos URL
        failureRedirect: '/cLogin', // Route to /login URL
        failureFlash: true
        /* Setting the failureFlash option to true instructs Passport to flash an error
        message using the message given by the strategy's verify callback, if any.
        When a failure occur passport passes the message object as error */
    })(req, res, next);
});


// User register URL using HTTP post => /user/register
router.post('/cregister', (req, res) => {

    let errors = [];
    // Retrieves fields from register page from request body
    let { name, gender, email,contact,address,password, password2 } = req.body;

    // Checks if both passwords entered are the same
    if (password !== password2) {
        errors.push({ text: 'Passwords do not match' });
    }

    // Checks that password length is more than 4
    if (password.length < 4) {
        errors.push({ text: 'Password must be at least 4 characters' });
    }
    if (errors.length > 0) {
        res.render('cuser/cregister', {
            errors,
            name,
            email,
            gender,
            contact,
            address,
            password,
            password2
        });
    } else {
        // If all is well, checks if user is already registered
        User.findOne({ where: { email: req.body.email } })
            .then(user => {
                if (user) {
                    // If user is found, that means email has already been
                    // registered
                    res.render('cuser/cregister', {
                        error: user.email + ' already registered',
                        name,
                        email,
                        gender,
                        contact,
                        address,
                        password,
                        password2
                    });
                } else {
                    // Encrypt the password
                    var salt = bcrypt.genSaltSync(10);
                    var hashedPassword = bcrypt.hashSync(password, salt);
                    password = hashedPassword;

                    // Create new user record
                    User.create({ name, email,gender,contact,address, password })
                        .then(user => {
                            alertMessage(res, 'success', user.name + ' added. Please login', 'fas fa-sign-in-alt', true);
                            res.redirect('/cLogin');
                        })
                        .catch(err => console.log(err));
                }
            });
    }
});


router.post('/cregister', (req, res) => {
    req.logout();
    res.redirect('/');
});

router.get('/', (req, res) => {
    const title = 'I\'m at the user router!';
    res.render('index', { title: title }) 
});


router.get('/profile/:id', (req, res) => {
    var id=req.param.id;
    res.render('user/customerprofile')
    // User.findAll({
    //     where: {
    //         id: req.params.id
    //     }
       
    // }).then((userinfo) => {
        
    //     res.render('user/customerprofile', {
    //         userinfo
    //     });

    // }).catch(err => console.log(err));
});

module.exports = router;