// middleware/route-guard.js
let isLoggedInLet = false
// checks if the user is logged in when trying to access a specific page
const isLoggedIn = (req, res, next) => {
    if (!req.session.existingUser) {
      return res.redirect('/auth/login');
    }else{
      isLoggedInLet = true
      next();
    }
    
  };
  
  // if an already logged in user tries to access the login page it
  // redirects the user to the home page
  const isLoggedOut = (req, res, next) => {
    if (req.session.existingUser) {
      isLoggedInLet = true
      return res.redirect('/');
    }else{
      isLoggedInLet = false
      next();
    }
    
  };
  
  module.exports = {
    isLoggedIn,
    isLoggedOut
  };

  