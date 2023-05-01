const express = require('express');
const Article = require('../models/Article.model');
const router = express.Router();
const {isLoggedIn} = require('../middleware/route.guard')
const User = require('../models/User.model');
const uploader = require('../middleware/cloudinary.config.js');
const defaultImageUrl = "https://acortar.link/0n4qLw"





/* GET create page */
router.get("/create", isLoggedIn, (req, res, next) => {
  res.render("articles/createarticle");
});

//post create
router.post("/create", uploader.single("imageUrl"), async(req, res, next) => {
  try {
    const ownerUser = req.session.existingUser.existingUser
    const ownerId = await User.findOne({username: ownerUser})
    let imageUrl;
    if (req.file) {
      imageUrl = req.file.path
    } else {
      imageUrl = defaultImageUrl
    }
    const newArticle = await Article.create({...req.body, createdBy: ownerId, imageUrl: imageUrl})
    const {_id} = newArticle
    await User.findByIdAndUpdate(ownerId, {$push: {articles:newArticle}}, {new:true})
    console.log('file is: ', req.file)
  
    res.redirect(`/articles/${_id}`) 
  } catch (error) {
    console.log(error)
  }
})


/*GET edits articles*/
router.get("/edit-article/:articleId", async (req, res) => {
  const articleToEdit = await Article.findById(req.params.articleId)
  // console.log("hello", articleToEdit) 
  res.render("articles/editarticle", {articleToEdit})
})

router.post("/edit-/:articleId", async (req, res) => {
  const updatedArt = await Article.findByIdAndUpdate(req.params.articleId, req.body, {new: true})
  //console.log(updatedArt)
  res.redirect(`/articles/${req.params.articleId}` )
})

/*GET all articles*/
router.get("/:ageRange",  async (req, res, next) => {
  try {
    
    console.log("prueba 1000", req.params)
    
    const allArticles = await Article.find(req.params)
     console.log(allArticles) 
     

    res.render("articles/allarticles", {data: allArticles})
  } catch (error) {
    console.log(error)
  }
 });




/* POST one article to delete */
router.get('/:articleId/delete', async (req, res) => {
  try {
    await Article.findByIdAndDelete(req.params.articleId)
    res.redirect('/articles')
  } catch (error) {
    console.log(error)
  }
})

/* GET one article */
router.get('/:ageRange/:articleId', async (req, res) => {
  const { articleId } = req.params
 try {
   const article = await Article.findById(articleId).populate('createdBy', 'username')
   /* console.log(article) */
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