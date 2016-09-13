module.exports = {
  port   : process.env.PORT || 3300,
  db     : 'mongodb://localhost/find-me-a-coffee',
  secret : process.env.SECRET || 'this is a secret'
};
