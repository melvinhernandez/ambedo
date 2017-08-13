/* User Controller */
const User = require('./model');
const updateToken = require('./../../tools/spotify-client').updateToken;


/* Returns spotify user as a promise. */
const signInWithSpotify = (profile, accessToken, refreshToken) => {
  console.log('Signing in...');
  return new Promise((resolve, reject) => {
    User.findOne({ 'spotify.id': profile.id}, (error, user) => {
      if (error) {
        reject(error);
      } else if (user) {
        if (Date.now() >= user.spotify.expires) {
          updateToken(user).then(
            updatedUser => resolve(updatedUser),
            updateError => reject(updateError)
          ).catch(
            updateError => reject(updateError)
          );
        } else {
          resolve(user);
        }
      } else {
        const newUser = createUser(profile, accessToken, refreshToken);
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
const createUser = (profile, accessToken, refreshToken) => {
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
  newUser.spotify.refreshToken = refreshToken;
  let expDate = new Date();
  expDate.setTime(expDate.getTime() + 60*60*1000);
  newUser.spotify.expires = expDate;
  return newUser;
}

module.exports = {
  signInWithSpotify,
  findUser
};
