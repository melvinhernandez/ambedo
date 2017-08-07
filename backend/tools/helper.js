/* Middleware: checks if there exists a current user. */
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/login');
  }
}

module.exports = {
  isLoggedIn
}
