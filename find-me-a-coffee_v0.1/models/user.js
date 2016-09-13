const mongoose  = require("mongoose");
const bcrypt    = require("bcrypt");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  username:     { type: String, unique: true, required: true },
  email:        { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true }
});

userSchema
  .virtual('password')
  .set(setPassword);

userSchema
  .virtual("passwordConfirmation")
  .set(setPasswordConfirmation);

userSchema
  .path("passwordHash")
  .validate(validatePasswordHash);

userSchema
  .path('email')
  .validate(validateEmail);

userSchema.methods.validatePassword = validatePassword;

userSchema.set("toJSON", {
  transform: function(doc, ret) {
    delete ret.passwordHash;
    delete ret.email;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model("User", userSchema);

function setPassword(value){
  this._password    = value;
  this.passwordHash = bcrypt.hashSync(value, bcrypt.genSaltSync(8));
}

function setPasswordConfirmation(passwordConfirmation) {
  this._passwordConfirmation = passwordConfirmation;
}

function validatePasswordHash() {
  if (this.isNew) {
    if (!this._password) {
      return this.invalidate("password", "A password is required.");
    }

    if (this._password.length < 6) {
      this.invalidate('password', 'must be at least 6 characters.');
    }

    if (this._password !== this._passwordConfirmation) {
      return this.invalidate("passwordConfirmation", "Passwords do not match.");
    }
  }
}

function validateEmail(email) {
  if (!validator.isEmail(email)) {
    return this.invalidate('email', 'must be a valid email address');
  }
}

function validatePassword(password){
  return bcrypt.compareSync(password, this.passwordHash);
}


// const mongoose   = require('mongoose') ;
// const bcrypt     = require('bcrypt');
// const validator  = require('validator');
//
// const userSchema = new mongoose.Schema({
//   username:        { type: String, unique: true, required: true },
//   email:           { type: String, unique: true, required: true },
//   passwordHash:    { type: String,               required: true }
// });
//
// userSchema
//   .virtual('pass')
//   .set(setPass);
//
// userSchema
//   .path('passConf')
//   .set(setPassConf);
//
// userSchema
//   .path('passHash')
//   .validate(valPassHash);
//
// userSchema
//   .path('email')
//   .validate(valEmail);
//
// userSchema.methods.valPass = valPass;
//
// userSchema.set('toJSON', {
//   transform: function(doc, ret) {
//     // delete ret.passHash;
//     // delete ret.email;
//     delete ret.__v;
//     return ret;
//   }
// });
//
// module.exports = mongoose.model('user', userSchema);
//
// function setPass(value){
//   this._pass    = value;
//   this.passHash = bcrypt.hashSync(value, bcrypt.genSaltSync(8));
// }
//
// function setPassConf(passConf) {
//   this._passConf = passConf;
// }
//
// function valPassHash() {
//   if (this.isNew) {
//     if (!this._pass){
//       return this.invalidate('pass', 'A password is required.');
//     }
//
//     if (this._pass.length < 8) {
//       this.invalidate('pass', 'must be at least 8 characters.');
//     }
//
//     if (this._pass !== this._passConf) {
//       return this.invalidate('passConf', 'Passwords do not match.');
//     }
//   }
// }
//
//  function valEmail(email){
//   if (!validator.isEmail(email)) {
//     return this.invalidate('email', 'must be a valid email address');
//   }
// }
//
// function valPass(pass) {
//   return bcrypt.compareSync(pass, this.passHash);
// }
