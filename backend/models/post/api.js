/* Post API and Routes. */
const postControl = require('./controller');
const createPost = postControl.createPost;
const isLoggedIn = require('./../../tools/helper').isLoggedIn;
const getMyPlaylists = require('./../../tools/spotify-client').getMyPlaylists;


const postAPI = (app) => {
  app.post('/api/post/new', (req, res) => {
    if (req.user) {
      createPost(req).then(
        (post) => { res.redirect('http://google.com'); },
        (error) => { console.log(error); res.send(error); }
      );
    } else {
      console.log('Login to Spotify.');
      res.redirect('/login');
    }
  });

  app.get('/post/new', isLoggedIn, (req, res) => {
    getMyPlaylists(req.user).then(
      (data) => {
        console.log(data);
        res.render('newPost.ejs', {user: req.user, playlists: data})
      },
      (error) => {
        res.render('newPost.ejs', {user: req.user, playlists: error})
      }
    );
  });
}

module.exports = postAPI;
