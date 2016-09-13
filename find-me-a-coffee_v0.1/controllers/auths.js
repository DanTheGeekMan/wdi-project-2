module.exports = {
  register : authsReg,
  login    : authsLogin
};

const User   = require('../models/user');
const jwt    = require('jsonwebtoken');
const config = require('../config/config');

function authsReg(req, res) {
  console.log("hello world");
  User.create(req.body.user, (err, user) => {
    if (err) return res.status(500).json({ message: 'Something went wrong.'});

    let token = jwt.sign(user._id, config.secret, { exporesIn: 3600*24 });

    return res.status(201).json({
      message: `Welcome ${user.username}!!!`,
      user,
      token
    });
  });
}

function authsLogin(req, res) {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) return res.status(500).json({ message: `Something went wrong.`});
    if (!user || !user.valPass(req.body.password)) {
      return res.status(401).json({ message: `Unauthorised.`});
    }

    let token = jwt.sign(user._id, config.secret, { expiresIn: 3600*24 });

    return res.status(200).json({
      message: `Welcome back.`,
      user,
      token
    });
  });
}
