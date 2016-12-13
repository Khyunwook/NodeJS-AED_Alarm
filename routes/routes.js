var configRoutes
    , express = require('express')
    , user_actions = require('../methods/user_actions')
    , resque_actions = require('../methods/resque_actions')
    , situation_actions = require('../methods/situation_actions');

//
  var router = express.Router();

  var sess;
  router.get( '/',user_actions.loginRedirect );
  router.get( '/auth/logout', user_actions.logout );
  router.post( '/auth/login', user_actions.authenticate );
  router.post( '/auth/adduser', user_actions.addNew );

  router.post( '/situation/addPatient', situation_actions.addPatient );
  router.get( '/situation/getAedList' ,situation_actions.getAedList );
  router.post( '/situation/addDB', situation_actions.addDB );
  router.delete( '/situation/removeDB', situation_actions.removeDB );

  router.get( '/rescue/:lat/:lng' ,resque_actions.webapp );


module.exports = {
                  router: router
		};
