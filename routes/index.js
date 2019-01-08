const express= require('express');
const router= express.Router();


//route to the home page
router.get('/', (req, res) => {
   res.render('index');
});

//route to the about page
router.get('/about', (req, res) => {
   res.render('index/about')
});
router.get('/contact', (req, res) => {
   res.render('index/contact')
});

module.exports = router;