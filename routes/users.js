const express= require('express');
const bcrypt=require('bcryptjs');
const passport= require('passport');
const mongoose= require('mongoose');
const router= express.Router();


//load models
require('../models/User');
const User= mongoose.model('users');

//route to the registration page
router.get('/register', (req, res) => {
    res.render('users/register')
});

//route to the login page
router.get('/login', (req, res) => {
    res.render('users/login')
});

//processing the login page for authentication
router.post('/login', (req, res, next) =>{
    passport.authenticate('local', {
        successRedirect: '/bible/account',
        failureRedirect: '/user/login'
    })(req,res,next)
});


//functionality to register the user details to database
router.post('/register', (req, res, next) => {
    const newUser= new User ({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        phone:  req.body.phone,
        password: req.body.password,
    });

    bcrypt.genSalt(10,(err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {

            newUser.password= hash;
            newUser.save()
                .then(user => {
                    res.redirect('/user/login')
                })
                .catch(err => {
                    console.log(err);
                });
        });
    });
});


//route for logging out
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/')
});


module.exports=router;