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

//post create
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


/*GET edits articles*/
router.get("/edit-article/:articleId", async (req, res) => {
  let isLogged = false
  if(req.session.existingUser){
      isLogged = true
    }
  const articleToEdit = await Article.findById(req.params.articleId)
  res.render("articles/editarticle", {articleToEdit, isLogged})
})

router.post("/edit-article/:articleId", async (req, res) => {
  const updatedArt = await Article.findByIdAndUpdate(req.params.articleId, req.body, {new: true})
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
    if (req.session.existingUser) {
      isLogged = true;
    }
    const article = await Article.findById(req.params.articleId).populate('createdBy', 'username');
    if (!article) {
      res.redirect('/articles');
    } else {
      res.render('articles/onearticle', { article: article, isLogged });
    }
  } catch (error) {
    console.log(error);
  }
});



module.exports = router;
