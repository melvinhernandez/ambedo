/* Fetches current user's playlist. */
const axios = require('axios');

// Set config defaults when creating the instance




const getMyPlaylists = (user) => {
  return new Promise((resolve, reject) => {
    axios.get('http://api.spotify.com/v1/me/playlists', {
      headers: {
        'Authorization': 'Bearer ' + user.spotify.token
      },
      params: {
        limit: '50'
      }
    }).then(
      (playlists) => { resolve(playlists.data); },
      (error) => { reject(error); }
    ).catch((error) => {
      reject(error);
    });
  });
};

module.exports = {
  getMyPlaylists
};
