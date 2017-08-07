/* User Controller */
const User = require('./model');


/* Returns spotify user as a promise. */
const signInWithSpotify = (profile, accessToken) => {
  console.log('Signing in...');
  return new Promise((resolve, reject) => {
    User.findOne({ 'spotify.id': profile.id}, (error, user) => {
      if (error) {
        reject(error);
      } else if (user) {
        resolve(user);
      } else {
        const newUser = createUser(profile, accessToken);
        newUser.save((error) => {
          if (error) {
            reject(error);
          } else {
            resolve(newUser);
          }
        });
      }
    });
  });
};

/* Returns user given a username if it exists. */
const findUser = (username) => {
  return new Promise((resolve, reject) => {
    User.findOne({ 'spotify.username': username }, (error, user) => {
      if (error) {
        reject(error);
      } else if (user) {
        resolve(user);
      } else {
        console.log("User " + username + " does not exist.");
        reject(null);
      }
    });
  });
};

/* Returns a new created user. */
const createUser = (profile, accessToken) => {
  const newUser = new User({
    email: profile.emails[0].value,
    spotify: {
      id: profile.id,
      username: profile.username,
      name: profile.displayName,
      url: profile.profileUrl
    }
  });
  newUser.spotify.token = accessToken;
  return newUser;
}

module.exports = {
  signInWithSpotify,
  findUser
};
