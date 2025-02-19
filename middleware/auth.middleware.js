const isLoggedIn = (req, res, next) => {
  if (!req.session.existingUser) {
    return res.redirect('/auth/login');
  }
  next();
};

module.exports = { isLoggedIn }; 