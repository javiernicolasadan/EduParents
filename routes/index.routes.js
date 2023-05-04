const express = require('express');
const {isLoggedIn, isLoggedOut} = require('../middleware/route.guard')
const router = express.Router();
const User = require ('../models/User.model')
const Article = require ("../models/Article.model")


/* GET home page */
router.get("/", async (req, res, next) => {
  let isLogged = false
  if(req.session.existingUser){
      isLogged = true
    }
  res.render("index", {isLogged});
});

/* GET profile page */
router.get("/profile",isLoggedIn, async(req, res, next) => {
  try{
    let isLogged = false
  if(req.session.existingUser){
      isLogged = true
    }
    const currentUser = await User.findOne({username: req.session.existingUser.existingUser})
    .populate({
        path: 'articles',
        options: {
            sort: { createdAt: -1 }
        }
    })
    .populate('favorites');
    res.render("profile", {currentUser, isLogged});
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
