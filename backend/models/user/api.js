/* Post API and Routes. */
const userControl = require('./controller');
const findUser = userControl.findUser;


const userAPI = (app) => {
  app.get('/api/user/:username', (req, res) => {
    findUser(req.params.username).then(
      (user) => {
        console.log(user);
        res.send(user);
      },
      (error) => {
        console.log("no user.");
        res.send(error);
      }
    ).catch(
      (error) => {console.log(error);}
    );
  });
}

module.exports = userAPI;
