/* Post Controller */
const Post = require('./model');

/* Returns a new created post. */
const createPost = (request) => {
  return new Promise((resolve, reject) => {
    const newPost = createNewPost(request.user, request.body);

    newPost.save((error) => {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        resolve(newPost);
      }
    });
  });
}

/* Returns a new created post. */
const createNewPost = (authUser, post) => {
  const newPost = new Post({
    title: post.title,
    content: post.content,
    playlistUrl: post.playlistUrl,
    user_id: authUser._id
  });
  return newPost;
};

module.exports = {
  createPost
};
