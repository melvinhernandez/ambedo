/* Middleware: checks if there exists a current user. */
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/login');
  }
};

const validateUri = uri => {
  let info = uri.split(':');
  return {
    'user': info[2],
    'playlist': info[4]
  };
};

module.exports = {
  isLoggedIn,
  validateUri
}
