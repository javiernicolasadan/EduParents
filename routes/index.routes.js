const express = require('express');
const {isLoggedIn, isLoggedOut} = require('../middleware/route.guard')
const router = express.Router();
const User = require ('../models/User.model')
const Article = require ("../models/Article.model")

/* GET home page */
router.get("/", async (req, res, next) => {
  res.render("index");
  
  
});

/* GET profile page */
router.get("/profile",isLoggedIn, async(req, res, next) => {
  try{
    
    const currentUser = await User.findOne({username: req.session.existingUser.existingUser}).populate('articles')
    
    res.render("profile", {currentUser});
  }
  catch(error){
    console.log(error)
  }
});

router.get('/logout', (req, res, next) => {
  req.session.destroy(err => {
    if (err) next(err);
    res.redirect('/');
  });
});

module.exports = router;
