(function(globals) {
  "use strict";

  if (!("App" in globals)) { globals.App = {}; }

  globals.App.initAuth = function(){
    this.apiUrl = "http://localhost:3000/api";
    this.$main = $('main');

    $(".register"). on("click", this.register.bind(this));
    $(".login").on("click", this.login.bind(this));
    $(".logout").on("click", this.logout.bind(this));
    $(".starbucks").on("click", this.starbucks.bind(this));
    this.$main.on("submit", "form", this.handleForm);

    if (this.getToken()) {
      this.loggedInState();
    } else {
      this.loggedOutState();
    }
  };

  globals.App.loggedInState = function(){
    $(".loggedOut").hide();
    $(".loggedIn").show();
    this.$main.html(``);
  };

  globals.App.loggedOutState = function(){
    $(".loggedOut").show();
    $(".loggedIn").hide();
  };

  globals.App.register = function() {
    $('#myModal').modal();
    if (event) event.preventDefault();
    this.$main.html(`
      <div class='formDial'>
        <form method="post" action="/register">
          <div class="form-group">
            <input class="form-control" type="text" name="user[username]" placeholder="Username">
          </div>
          <div class="form-group">
            <input class="form-control" type="email" name="user[email]" placeholder="Email">
          </div>
          <div class="form-group">
            <input class="form-control" type="password" name="user[password]" placeholder="Password">
          </div>
          <div class="form-group">
            <input class="form-control" type="password" name="user[passwordConfirmation]" placeholder="Password Confirmation">
          </div>
          <input class="btn btn-primary" type="submit" value="Register">
        </form>
      </div>
    `);
  };

  globals.App.login = function() {
    event.preventDefault();
    this.$main.html(`
      <div class='formDial'>
        <form method="post" action="/login">
          <div class="form-group">
            <input class="form-control" type="email" name="email" placeholder="Email">
          </div>
          <div class="form-group">
            <input class="form-control" type="password" name="password" placeholder="Password">
          </div>
          <input class="btn btn-primary" type="submit" value="Login">
        </form>
      </div>
    `);
  };

  globals.App.starbucks = function() {
    event.preventDefault();
    this.$main.html(`
      <div class=''>
        <h1>I think this would be a test</h1>
      </div>
    `);
  };

  globals.App.logout = function() {
    event.preventDefault();
    this.removeToken();
    this.loggedOutState();
    $('#myModal').modal('hide');
  };

  globals.App.handleForm = function(){
    event.preventDefault();
    $('#myModal').modal('hide');

    let url    = `${globals.App.apiUrl}${$(this).attr("action")}`;
    let method = $(this).attr("method");
    let data   = $(this).serialize();

    return globals.App.ajaxRequest(url, method, data, (data) => {
      if (data.token) globals.App.setToken(data.token);
      globals.App.loggedInState();

    });
  };

  globals.App.ajaxRequest = function(url, method, data, callback){
    return $.ajax({
      url,
      method,
      data,
      beforeSend: this.setRequestHeader.bind(this)
    })
    .done(callback)
    .fail(data => {
      console.log(data);
    });
  };

  globals.App.setRequestHeader = function(xhr, settings) {
    return xhr.setRequestHeader("Authorization", `Bearer ${this.getToken()}`);
  };

  globals.App.setToken = function(token){
    return window.localStorage.setItem("token", token);
  };

  globals.App.getToken = function(){
    return window.localStorage.getItem("token");
  };

  globals.App.removeToken = function(){
    return window.localStorage.clear();
  };

})(window);
