/* Post Controller */
const Post = require('./model');
const User = require('./../user/model');
const findPlaylist = require('./../../tools/spotify-client').findPlaylist;

/* Returns a new created post. */
const createPost = (request) => {
  return new Promise((resolve, reject) => {
    const newPost = createNewPost(request.user, request.body);
    newPost.then((post) => {
      post.save((error) => {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          resolve(post);
        }
      });
    }).catch(
      error => reject(error)
    );
  });
};

/* Returns a new created post. */
const createNewPost = (authUser, post) => {
  return new Promise((resolve, reject) => {
    findPlaylist(authUser, post.playlistUri).then(
      (playlist) => {
        console.log('playlist found is:');
        console.log(playlist);
        const newPost = new Post({
          user: authUser._id,
          title: post.title,
          content: post.content,
          playlistUri: post.playlistUri,
          'spotify.image': playlist.images[0].url,
          'spotify.url': playlist.external_urls.spotify,
          'spotify.name': playlist.name
        });
        resolve(newPost);
      },
      (error) => {
        console.log('couldnt find playlist mate');
        console.log(error);
        reject(error);
      }
    ).catch(
      error => {
        console.log('create new post error');
        console.log(error);
        reject(error);
      }
    );
  });
};



/* Returns a promise with a post given the title and its creator. */
const findPost = (postId) => {
  return new Promise((resolve, reject) => {
    Post.findById(postId, (error, post) => {
      if (error) {
        console.log('id or some shit');
        reject(error);
      } else if (post) {
        resolve(post);
      } else {
        reject(new Error("User does not exist."));
      }
    });
  });
}

/* Finds post given a user, then resolves a promise. */
const getPostFromUser = (resolve, reject, user, postTitle) => {
   Post.findOne( {'user': user, 'title': postTitle }, (error, post) => {
    if (error) {
      reject(error);
    } else if (post) {
      resolve(post);
    } else {
      reject(new Error('Post not found. ' + user.spotify.username + ' does not have that post.'));
    }
  });
};


const getUsernamePosts = (username) => {
  return new Promise((resolve, reject) => {
    User.findOne({ 'spotify.username': username }, (error, user) => {
      if (error) {
        reject(error);
      } else if (user) {
        getUserPosts(resolve, reject, user);
      } else {
        reject(new Error("User does not exist."));
      }
    });
  });
};

const getUserPosts = (resolve, reject, user) => {
  console.log(user._id);
  Post.find( {'user': user}, (error, posts) => {
   if (error) {
     reject(error);
   } else if (posts) {
     resolve(posts);
   } else {
     reject(new Error(user.spotify.username + ' has not created any posts.'));
   }
 });
};

/* Get all posts. */
const getAllPosts = () => {
  return new Promise((resolve, reject) => {
    Post.find({})
        .populate('user')
        .exec((error, posts) => {
          if (error) reject(error);
          else if (posts) resolve(posts);
          else reject(new Error('No posts exists at this time.'));
        });
  });
}

module.exports = {
  createPost,
  findPost,
  getUsernamePosts,
  getAllPosts
};
