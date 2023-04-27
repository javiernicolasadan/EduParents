const express = require('express');
const Article = require('../models/Article.model');
const router = express.Router();


router.get("/",  (req, res, next) => {
  res.render("articles/allarticles")
 });

 
/* GET create page */
router.get("/create", (req, res, next) => {
  res.render("articles/createarticle");
});




//post create
router.post("/create", async(req, res, next) => {
  try {
    const newArticle = await Article.create({...req.body})
    //console.log(newArticle)
    res.redirect("/articles") 
    //console.log({...req.body})
  } catch (error) {
    console.log(error)
    
  }

})

module.exports = router;