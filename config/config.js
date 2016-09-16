module.exports = {
  port: process.env.PORT || 3000,
  db: process.env.MONGODB_URI || 'mongodb://localhost/find-me-a-coffee2',
  // db: 'mongodb://localhost/express-authentication-jwt',
  secret: process.env.SECRET || "gosh this is so secret... shhh..."
};
