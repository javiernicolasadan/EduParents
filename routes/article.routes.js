const express = require('express');
const Article = require('../models/Article.model');
const router = express.Router();
const {isLoggedIn} = require('../middleware/route.guard')
const User = require('../models/User.model');
const uploader = require('../middleware/cloudinary.config.js');
const defaultImageUrl = "https://acortar.link/0n4qLw"


/* GET create page */
router.get("/create", isLoggedIn, (req, res, next) => {
  let isLogged = false
  if(req.session.existingUser){
      isLogged = true
    }
  res.render("articles/createarticle", {isLogged});
});

// POST create
router.post("/create", isLoggedIn, uploader.single("imageUrl"), async (req, res, next) => {
  try {
    let isLogged = false;
    if (req.session.existingUser) {
      isLogged = true;
    }
    const ownerUser = req.session.existingUser.existingUser;
    const ownerId = await User.findOne({ username: ownerUser });
    let imageUrl;
    if (req.file) {
      imageUrl = req.file.path;
    } else {
      imageUrl = defaultImageUrl;
    }
    const newArticle = await Article.create({ ...req.body, createdBy: ownerId, imageUrl: imageUrl });
    const { _id, ageRange } = newArticle;
    await User.findByIdAndUpdate(ownerId, { $push: { articles: newArticle } }, { new: true });
    res.redirect(`/articles/${ageRange}/${_id}`);
  } catch (error) {
    console.log(error);
    next(error); // si ocurre un error, lo pasamos al siguiente middleware
  }
});

/* POST one favorite */
router.post('/fav/:articleId', async(req,res,next) =>{
  const articleId = req.params.articleId
  const favArt = await Article.findById(articleId)
  const currentUser = req.session.existingUser.existingUser;
  const currentUserData = await User.findOne({ username: currentUser });
  console.log('currentUser', currentUser, 'CurrentUserData', currentUserData)
  if(!currentUserData.favorites.includes(articleId)){
    const updUserData = await User.findByIdAndUpdate(currentUserData._id, { $push: { favorites: favArt } }, { new: true })
    console.log(updUserData)
  }
  res.redirect('/profile')
})

/* POST one favorite to delete */
router.post('/fav/:articleId/remove', async (req, res) => {
  try {
    const currentUser = req.session.existingUser.existingUser;
    const currentUserData = await User.findOne({ username: currentUser });
    const articleId = req.params.articleId;
    await User.findByIdAndUpdate(currentUserData._id, { $pull: { favorites: articleId } }, { new: true });
    res.redirect('/profile')
  } catch (error) {
    console.log(error)
  }
})

/*GET edits articles*/
router.get("/edit-article/:articleId", async (req, res) => {
  let isLogged = false
  if(req.session.existingUser){
      isLogged = true
    }
  const articleToEdit = await Article.findById(req.params.articleId)
  res.render("articles/editarticle", {articleToEdit, isLogged})
})

router.post("/edit-article/:ageRange/:articleId", uploader.single("imageUrl"), async (req, res) => {
  const ageRange = req.params.ageRange
  const updatedArt = await Article.findByIdAndUpdate(req.params.articleId, {...req.body, imageUrl: req.file.path}, {new: true})
  console.log("estebueno", updatedArt)
  
  res.redirect(`/articles/${req.params.ageRange}/${req.params.articleId}`)
})

/*GET all articles*/
router.get("/:ageRange",  async (req, res, next) => {
  try {
    let isLogged = false
  if(req.session.existingUser){
      isLogged = true
    }
    const allArticles = await Article.find(req.params)
    res.render("articles/allarticles", {data: allArticles, isLogged})
  } catch (error) {
    console.log(error)
  }
 });

/* POST one article to delete */
router.get('/:articleId/delete', async (req, res) => {
  try {
    await Article.findByIdAndDelete(req.params.articleId)
    res.redirect('/profile')
    } catch (error) {
    console.log(error)
  }
})

/* GET one article */
router.get('/:ageRange/:articleId', async (req, res) => {
  try {
    let isLogged = false;
    let currentUser
    if (req.session.existingUser) {
      isLogged = true;
      currentUser = req.session.existingUser.existingUser
    }
    const allArticles = await Article.find({ageRange: req.params.ageRange})
    const article = await Article.findById(req.params.articleId).populate('createdBy', 'username');
    const owner = article.createdBy.username
    if (!article) {
      res.redirect('/articles');
    } else {
      res.render('articles/onearticle', { article: article, isLogged, allArticles, owner, currentUser});
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
