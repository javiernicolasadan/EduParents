const express = require("express");
const Article = require("../models/Article.model");
const router = express.Router();
const { isLoggedIn } = require("../middleware/route.guard");
const User = require("../models/User.model");
const uploader = require("../middleware/cloudinary.config.js");
const defaultImageUrl =
  "https://res.cloudinary.com/dgbg06crz/image/upload/v1683198511/fd3jxotsdqembzxobqn3.jpg";

/* GET create page */
router.get("/create", isLoggedIn, (req, res, next) => {
  let isLogged = false;
  if (req.session.existingUser) {
    isLogged = true;
  }
  res.render("articles/createarticle", { isLogged });
});

// POST create
router.post("/create", isLoggedIn, uploader.single("imageUrl"),
  async (req, res, next) => {
    try {
      const isLogged = req.session?.existingUser ? true : false;
      
      console.log("Session data:", req.session);
      console.log("Request body:", req.body);
      console.log("File data:", req.file);
      

      const ownerUser = req.session?.existingUser?.existingUser;
      if (!ownerUser) {
        throw new Error("El usuario no está disponible en la sesión.");
      }

      const owner = await User.findOne({ username: ownerUser });
      if (!owner) {
        throw new Error("Usuario no encontrado en la base de datos.");
      }
      const ownerId = owner._id;
      console.log("User found:", ownerId);

      const imageUrl = req.file ? req.file.path : defaultImageUrl;

      const newArticle = await Article.create({
        ...req.body,
        createdBy: ownerId,
        imageUrl: imageUrl,
      });
      const { _id, ageRange } = newArticle;
      await User.findByIdAndUpdate(
        ownerId,
        { $push: { articles: newArticle } },
        { new: true }
      );
      res.redirect(`/articles/${ageRange}/${_id}`);
    } catch (error) {
      console.error("Error al crear el artículo:", error.message);
      next(error); // si ocurre un error, lo pasamos al siguiente middleware
    }
  }
);

/* POST one favorite */
router.post("/fav/:articleId", async (req, res, next) => {
  const articleId = req.params.articleId;
  const favArt = await Article.findById(articleId);
  const currentUser = req.session.existingUser.existingUser;
  const currentUserData = await User.findOne({ username: currentUser });
  if (!currentUserData.favorites.includes(articleId)) {
    const updUserData = await User.findByIdAndUpdate(
      currentUserData._id,
      { $push: { favorites: favArt } },
      { new: true }
    );
  }
  res.redirect("/profile");
});

/* POST one favorite to delete */
router.post("/fav/:articleId/remove", async (req, res) => {
  try {
    const currentUser = req.session.existingUser.existingUser;
    const currentUserData = await User.findOne({ username: currentUser });
    const articleId = req.params.articleId;
    await User.findByIdAndUpdate(
      currentUserData._id,
      { $pull: { favorites: articleId } },
      { new: true }
    );
    res.redirect("/profile");
  } catch (error) {
    console.log(error);
  }
});

/*GET edits articles*/
router.get("/edit-article/:articleId", async (req, res) => {
  let isLogged = false;
  if (req.session.existingUser) {
    isLogged = true;
  }
  const articleToEdit = await Article.findById(req.params.articleId);
  res.render("articles/editarticle", { articleToEdit, isLogged });
});

router.post("/edit-article/:ageRange/:articleId", uploader.single("imageUrl"),
  async (req, res) => {
    //console.log("req.params", req.params);
    try {
      // Determinar si hay una nueva imagen o usar la original
      let imageUrl;
      if (req.file) {
        imageUrl = req.file.path;
      } else {
        imageUrl = req.body.originalImageUrl;
      }
      const ageRange = req.params.ageRange;

      // Actualizar el artículo
      const updatedArt = await Article.findByIdAndUpdate(
        req.params.articleId,
        { ...req.body, imageUrl: imageUrl },
        { new: true }
      );

      if (!updatedArt) {
        // Si no se encuentra el artículo, devuelve un error
        return res.status(404).json({ message: "Article not found" });
      }
      const allArticles = await Article.find({ ageRange: req.params.ageRange });
      const article = await Article.findById(req.params.articleId).populate(
        "createdBy"
      );
      const owner = article.createdBy.username;
      const currentUser = req.session.currentUser;
      //console.log("article", article.createdBy.username);
      // Redirigir o responder con los datos actualizados
      res.render("articles/onearticle", {
        article: updatedArt,
        allArticles,
        ageRange,
        owner,
        currentUser,
        isLogged: !!req.session.currentUser,
      });
    } catch (error) {
      console.error("Error updating article:", error);
      res.status(500).json({ message: "Internal Server Error", error });
    }
  }
);

/*GET all articles*/
router.get("/:ageRange", async (req, res, next) => {
  try {
    let isLogged = false;
    if (req.session.existingUser) {
      isLogged = true;
    }
    const allArticles = await Article.find(req.params).sort({ createdAt: -1 });
    res.render("articles/allarticles", { data: allArticles, isLogged });
  } catch (error) {
    console.log(error);
  }
});

/* POST one article to delete */
router.get("/:articleId/delete", async (req, res) => {
  try {
    await Article.findByIdAndDelete(req.params.articleId);
    res.redirect("/profile");
  } catch (error) {
    console.log(error);
  }
});

/* GET one article */
router.get("/:ageRange/:articleId", async (req, res) => {
  try {
    const isLogged = req.session?.existingUser ? true : false;
    const currentUser = req.session?.existingUser?.existingUser || null;

    const allArticles = await Article.find({ ageRange: req.params.ageRange });
    //console.log("allArticles:", allArticles);
    const article = await Article.findById(req.params.articleId).populate(
      "createdBy",
      "username"
    );
    if (!article) {
      return res.redirect("/articles");
    } 
    //console.log("article:", article);
    const owner = article.createdBy ? article.createdBy.username : null;
    console.log("owner:", owner);
    //console.log("createdBy:", article ? article.createdBy : "No creado por nadie");
     
      res.render("articles/onearticle", {
        article: article,
        isLogged,
        allArticles,
        owner,
        currentUser,
      });
    
  } catch (error) {
    console.error("Error al obtener el artículo:", error.message);
    res.redirect("/articles"); 
  }
});

module.exports = router;
