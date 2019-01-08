const mongoose= require('mongoose');
const express= require('express');
const User=mongoose.model('users');
const {ensureAuthenticated}= require('../helpers/auth');
const router=express.Router();

//loading the bible model
require('../models/Bible');
const Bible=mongoose.model('bible');

//Route to the bible page
router.get('/', ensureAuthenticated, (req, res) => {
   res.render('bible/add')
});

//route to my account page
router.get('/account', ensureAuthenticated, (req, res) => {
    Bible.find({user: req.user.id})
        .sort({date: 'desc'})
        .then(verse => {
            res.render('bible/account',{
                verse:verse
            })
        });
});


//route to the edit page
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Bible.findOne({
        _id: req.params.id
    })
        .populate('user')
        .then(verse=> {
        if (verse.user === req.user.id){
            res.redirect('/bible/verse')
        } else {
            res.render('bible/edit', {
                verse: verse
            });
        }
    });
});


//route to display all verses
router.get('/verse', (req, res) => {
    Bible.find({})
        .sort({date: 'desc'})
        .then(verses => {
            res.render('bible/verse', {
                verses: verses
            })
        })
});


//route to display one verse
router.get('/show/:id', (req, res) => {
   Bible.findOne({
       _id: req.params.id
   })
       .populate('user')
       .then(verse => {
       res.render('bible/show', {
           verse: verse
       })
   });
});


//route to save the verse to database
router.post('/', ensureAuthenticated, (req, res) => {
    const newVerse= {
        title: req.body.title,
        content: req.body.content,
        user: req.user.id
    };

    new Bible(newVerse)
        .save()
        .then(verse=> {
            res.redirect('/bible/verse')
        });
});

//the process of editing the verses and saving them
router.put('/:id', ensureAuthenticated, (req, res) => {
   Bible.findOne({
       _id: req.params.id
   })
       .then(verse => {
           //The new values
           verse.title= req.body.title;
           verse.content= req.body.content;

           verse.save()
               .then(verse => {
                   res.redirect('/bible/verse')
               });
       });
});


//the process of deleting a verse
router.delete('/:id', (req, res) =>{
    Bible.remove({_id: req.params.id})
        .then(verse => {
            res.redirect('/bible/account')
        })
});


module.exports= router;