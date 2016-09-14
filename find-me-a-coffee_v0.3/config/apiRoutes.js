const express  = require("express");
const router   = express.Router();

const authentications = require("../controllers/authentications");
const users           = require("../controllers/users");
const coffees         = require("../controllers/coffees");

router.route("/register")
  .post(authentications.register);
router.route("/login")
  .post(authentications.login);

router.route('/users')
  .get(users.index);
router.route('/users/:id')
  .get(users.show)
  .put(users.update)
  .delete(users.delete);
  
router.route('/coffee/:id')
  .get(coffees.data);

module.exports = router;
