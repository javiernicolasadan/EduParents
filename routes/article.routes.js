const express = require('express');
const Article = require('../models/Article.model');
const router = express.Router();


/*GET all articles*/
router.get("/",  async (req, res, next) => {
  try {
    const allArticles = await Article.find()
    console.log(allArticles)
    res.render("articles/allarticles", {data: allArticles})
  } catch (error) {
    console.log(error)
  }
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

/* GET one recipe */
router.get('/:articleId', async (req, res) => {
  const { articleId } = req.params
 try {
   const article = await Article.findById(articleId)
   console.log(article)
   
    if (!article) {
     res.redirect('/articles')
   } else {
     res.render('articles/onearticle', article)
   } 
 } catch (error) {
   console.log(error)
 }
})  

module.exports = router;