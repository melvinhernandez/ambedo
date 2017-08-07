const User = require('./models/user/model');
const postAPI = require('./models/post/api');
const userAPI = require('./models/user/api');
const isLoggedIn = require('./tools/helper').isLoggedIn;

// Routes
const routes = (app, passport) => {

  // Root
  app.get('/', (req, res) => {
    res.render("index.ejs", {user: req.user});
  });

  app.get('/signup', (req, res) => {
    res.render('signup.ejs', { message: req.flash('signupMessage') })
  });


  /* Signup using local strategy example. */
  // app.post('/signup', passport.authenticate('local-signup', {
  //   successRedirect: '/',
  //   successFlash: true,
  //   failureRedirect: '/signup',
  //   failureFlash: true
  // }))

  /* LOGIN ROUTES */
  /* Signup using spotify strategy. */
  // ToDo: Figure out the scopes needed: https://developer.spotify.com/web-api/using-scopes/#tablepress-78
  app.get('/auth/spotify',
    passport.authenticate('spotify', {scope: ['user-read-email', 'user-read-private', 'playlist-read-private'	] }, { showsDialog: true }),
    (req, res) => {
      /* This function is not called. */
    }
  );

  app.get('/auth/spotify/callback',
    passport.authenticate('spotify', {  successRedirect: '/',
                                        failureRedirect: '/login' })
  );

  app.get('/login', (req, res) => {
    res.render('login.ejs');
  });

  app.get('/profile', isLoggedIn, (req, res) => {
    res.redirect('http://google.com');
  });


  /* POST ROUTES */
  postAPI(app);

  /* USER ROUTES */
  userAPI(app);

}

module.exports = routes;
