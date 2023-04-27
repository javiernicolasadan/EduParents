const express = require('express');
const router = express.Router();
const User = require('../models/User.model')
const bcryptjs = require ('bcryptjs')
const saltRounds = 13
const pwdRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/

/* GET register */
router.get("/register", (req, res, next) => {
  res.render("auth/register");
});

/* POST register */
router.post("/register", async(req, res, next) => { 
    try{
        //check if email exists
        const foundEmail = await User.findOne({email: req.body.email})
        if (foundEmail){//if the email exists
            res.render('auth/register', {errorMessage: 'This email already exists. Go to the Log-In page', data: {email: req.body.email}})
        }else{
            const foundUsername = await User.findOne({username: req.body.username})
            if (foundUsername){//if the username exists
                res.render('auth/register', {errorMessage: 'This username already exists. Please choose a different one', data: {email:req.body.email ,username: req.body.username}})
            }else{//if email does not exist and username does not exist
              //check if password is good enough
              if(pwdRegex.test(req.body.password)){//if password is good enough
                const salt = bcryptjs.genSaltSync(saltRounds)
                const passwordHash = bcryptjs.hashSync(req.body.password, salt)
                const newUser = await User.create({username: req.body.username, email:req.body.email, passwordHash: passwordHash})
                res.redirect('/auth/login')
              }else{//password not good enough
                res.render('auth/register', {errorMessage: 'This password is not strong enough. Please remember that the password must contain at least 8 characters and include at least one letter and one number', data: {email:req.body.email ,username: req.body.username}})
              }
            }
        }
    }
    catch(err){
        console.log(err)
    }
  });



/* GET login */
router.get("/login", (req, res, next) => {
    res.render("auth/login");
  });

  /* POST login */
router.post("/login", (req, res, next) => {

});


module.exports = router;
