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
            res.render('auth/register', {errorMessage: 'this email already exists', data: {email: req.body.email}})
        }else{
            const foundUsername = await User.findOne({username: req.body.username})
            if (foundUsername){//if the username exists
                res.render('auth/register', {errorMessage: 'this username already exists', data: {username: req.body.username}})
            }
        }

        const salt = bcryptjs.genSaltSync(saltRounds)
        const passwordHash = bcryptjs.hashSync(req.body.password, salt)
        const newUser = await User.create({username: req.body.username, email:req.body.email, passwordHash: passwordHash})
        res.redirect('/auth/login')
    }
    catch(err){
        console.log(err)
    }
  });



/* GET login */
router.get("/login", (req, res, next) => {
    res.render("auth/login");
  });


module.exports = router;
