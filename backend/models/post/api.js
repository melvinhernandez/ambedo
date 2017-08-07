/* Post API and Routes. */
const postControl = require('./controller');
const createPost = postControl.createPost;


const postAPI = (app) => {
  app.post('/api/post/new', (req, res) => {
    if (req.user) {
      createPost(req).then(
        (post) => { res.redirect('http://google.com'); },
        (error) => { console.log(error); res.send(error); }
      );
    } else {
      console.log("USER IS NOT LOGGED IN.");
    }
  });
}

module.exports = postAPI;
