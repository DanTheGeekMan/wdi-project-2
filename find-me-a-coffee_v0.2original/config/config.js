module.exports = {
  port: process.env.PORT || 3300,
  db: 'mongodb://localhost/express-authentication-jwt',
  secret: process.env.SECRET || "gosh this is so secret... shhh..."
};
