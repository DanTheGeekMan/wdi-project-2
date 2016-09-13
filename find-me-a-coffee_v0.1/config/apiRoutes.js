const express  = require('express');
const router   = express.Router();

const auths    = require('../controllers/auths');
const users    = require('../controllers/users');

router.route('/register')
  .post(auths.register);
router.route('/login')
  .post(auths.login);

  // router.route('/users')
  //   .get(users.index);
  // router.route('/users/:id')
  //   .get(users.show)
  //   .put(users.update)
  //   .delete(users.delete);

module.exports = router;
