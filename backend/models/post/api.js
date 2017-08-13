/* Post API and Routes. */
const postController = require('./controller');
const createPost = postController.createPost;
const findPost = postController.findPost;
const getAllPosts = postController.getAllPosts;
const getUsernamePosts = postController.getUsernamePosts;
const isLoggedIn = require('./../../tools/helper').isLoggedIn;
const getMyPlaylists = require('./../../tools/spotify-client').getMyPlaylists;


const postAPI = (app) => {

  /* Creates a new post. */
  app.post('/api/post/new', isLoggedIn, (req, res) => {
    createPost(req).then(
      (post) => { res.redirect('/posts')},
      // (post) => { res.redirect('/api/'+ req.user.spotify.username
      //                       + '/posts/' + post._id); },
      (error) => { console.log('new error on posting'); res.send(error); }
    );
  });

  /* Shows the new post view. */
  app.get('/post/new', isLoggedIn, (req, res) => {
    getMyPlaylists(req.user).then(
      (data) => {
        res.render('newPost.ejs', {user: req.user, playlists: data})
      },
      (error) => {
        res.render('newPost.ejs', {user: req.user, playlists: error})
      }
    );
  });
  app.get('/api/:username', isLoggedIn, (req, res) => {
    getUsernamePosts(req.params.username).then(
      (data) => {
        console.log(data);
        res.send(data);
      },
      (error) => {
        console.log(error);
        res.send(error);
      }
    );
  });

  app.get('/api/:username/posts/:id', isLoggedIn, (req, res) => {
    console.log("hellooooooo");
    findPost(req.params.id).then(
      (post) => {
        res.render('viewPost.ejs', {  user: req.user,
                                      post: post});
      },
      (error) => {
        console.log('could not find post dude');
        res.send(error);
      }
    ).catch(
      error => {console.log('post catch');res.send(error)}
    );
  });

  app.get('/posts', (req, res) => {
    getAllPosts().then(
      (posts) => {
        res.render('posts.ejs', {user: req.user, posts: posts});
      },
      (error) => {
        console.log('get all error');
        res.send(error);
      }
    );
  });
}

module.exports = postAPI;
