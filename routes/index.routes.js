const express = require('express');
const {isLoggedIn} = require('../middleware/route.guard')
const {isLoggedOut} = require('../middleware/route.guard')
const router = express.Router();
const User = require ('../models/User.model')

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index", {isLoggedIn});
});

/* GET profile page */
router.get("/profile",isLoggedIn, async(req, res, next) => {
  try{
    console.log(req.session)
    const currentUser = await User.findOne({username: req.session.existingUser.existingUser}).populate('articles')
    console.log(currentUser)
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
