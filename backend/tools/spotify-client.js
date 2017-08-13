/* Fetches current user's playlist. */
const axios = require('axios');
const request = require('superagent');
const querystring = require('querystring');
const { validateUri } = require('./helper');
global.Buffer = global.Buffer || require('buffer').Buffer;


if (typeof btoa === 'undefined') {
  global.btoa = function (str) {
    return new Buffer(str).toString('base64');
  };
}

// Set config defaults when creating the instance



/* Gets all playlists given a user. */
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

/* Finds playlist given a uri. */
const findPlaylist = (user, playlistUri) => {
  return new Promise((resolve, reject) => {
    updateToken(user).then(
      (user) => {
        let uri = validateUri(playlistUri);
        axios.get(`http://api.spotify.com/v1/users/${uri.user}/playlists/${uri.playlist}?fields=external_urls.spotify,images,name`, {
          headers: {
            'Authorization': 'Bearer ' + user.spotify.token
          }
        }).then(
          (playlists) => {
            resolve(playlists.data);
          },
          (error) => {
            reject(error);
          }
        ).catch((error) => {
          reject(error);
        });
      },
      (error) => {
        reject(error);
      }
    ).catch(
      error => reject(error)
    );
  });
};

/* Updates token for the given user. */
const updateToken = (user) => {
  return new Promise((resolve, reject) => {
    console.log("is is past already?", (Date.now() > user.spotify.expires.getTime()));
    console.log("NOW: " + Date.now().toString());
    console.log("EXPIRES: " + user.spotify.expires);
    if (Date.now() > user.spotify.expires.getTime()) {
      console.log('updating token....');
      let reqHeader = 'Basic ' + btoa(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET);
      let parameters = {
          'grant_type': 'refresh_token',
          'refresh_token': user.spotify.refreshToken
        };
      request.post('https://accounts.spotify.com/api/token')
            .type('form')
            .set('Authorization', reqHeader)
            .send(parameters)
            .then(
              (data) => {
                console.log("success! New token is here");
                console.log(data.access_token);
                console.log('with text');
                console.log(data.body.access_token);
                console.log("Melvin expires in: " + user.spotify.expires);
                let newExpiration = new Date();
                newExpiration.setHours(newExpiration.getHours() + 1);
                console.log(newExpiration.toString());
                user.spotify.expires = newExpiration;
                user.spotify.token = data.body.access_token;
                user.save(
                  error => { error ? console.log(error) : console.log('saved!');}
                );
                resolve(user);
              },
              (error) => {
                console.log('sorry,, token fucked up');
                console.log(error);
                reject(error);
              }
            )
            .catch(
              error => {
                    console.log('i catch');
                    console.log(error);
                  }
            );
      // axios.post('https://accounts.spotify.com/api/token', querystring.stringify(parameters)).then(
      //   (data) => {
      //     console.log("success! New token is here");
      //     console.log(data);
      //     user.spotify.token = data.token;
      //     user.spotify.expires = new Date(Date.now() + data.expires_in * 1000);
      //     user.save();
      //     resolve(user);
      //   },
      //   (error) => {
      //     console.log('sorry,, token fucked up');
      //     console.log(error);
      //     reject(error);
      //   }).catch(
      //     error => {
      //       console.log('i catch');
      //       console.log(error);
      //     }
      //   );
    } else {
      console.log('no need for token');
      resolve(user);
    }
  });
};


module.exports = {
  getMyPlaylists,
  findPlaylist,
  updateToken
};
