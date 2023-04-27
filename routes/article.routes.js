const express = require('express');
const router = express.Router();

/* GET home page */
router.get("/create", (req, res, next) => {
  res.render("articles/createarticle");
});

module.exports = router;