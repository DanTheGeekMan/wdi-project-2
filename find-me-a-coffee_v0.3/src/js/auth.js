(function(globals) {
  "use strict";

  if (!("App" in globals)) { globals.App = {}; }

  globals.App.initAuth = function(){
    this.apiUrl = "http://localhost:3000/api";
    this.$header  = $("header");
    App.$nav     = $("nav");
    console.log(this);
    $(".register").on("click", this.register.bind(this));
    $(".login").on("click", this.login.bind(this));
    $(".logout").on("click", this.logout.bind(this));
    $(".usersIndex").on("click", this.usersIndex.bind(this));
    this.$header.on("submit", "form", this.handleForm);

    if (this.getToken()) {
      this.loggedInState();
    } else {
      this.loggedOutState();
    }
  };

  globals.App.loggedInState = function(){
    $(".loggedOut").hide();
    $(".loggedIn").show();


    //this.usersIndex();
  };

  globals.App.loggedOutState = function(){
    $(".loggedOut").show();
    $(".loggedIn").hide();
    //this.register();
  };

  globals.App.register = function() {
    if (event) event.preventDefault();
    this.$header.html(`
      <h2>Register</h2>
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
    `);
  };

  globals.App.login = function() {
    event.preventDefault();
    this.$header.html(`
      <div class='loginDial'>
        <h2>Login</h2>
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

  globals.App.logout = function() {
    event.preventDefault();
    this.removeToken();
    this.loggedOutState();
  };

  globals.App.usersIndex = function(){
    if (event) event.preventDefault();
    let url = `${this.apiUrl}/users`;
    return this.ajaxRequest(url, "get", null, (data) => {
      this.$header.html(`
        <div class="card-deck-wrapper">
          <div class="card-deck">
          </div>
        </div>
      `);
      let $container = this.$header.find(".card-deck");
      $.each(data.users, (i, user) => {
        $container.append(`
          <div class="card col-md-4">
           <img class="card-img-top" src="http://fillmurray.com/300/300" alt="Card image cap">
           <div class="card-block">
             <h4 class="card-title">${user.username}</h4>
             <p class="card-text">This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
             <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
           </div>
         </div>`);
      });
    });
  };

  globals.App.handleForm = function(){
    event.preventDefault();

    let url    = `${globals.App.apiUrl}${$(this).attr("action")}`;
    let method = $(this).attr("method");
    let data   = $(this).serialize();

    return globals.App.ajaxRequest(url, method, data, (data) => {
      if (data.token) globals.App.setToken(data.token);
      globals.App.loggedInState();
      $('.loginDial').hide();
      console.log(App.$nav);
      App.$nav.html(`
          <ul>
            <a class='loggedOut register' href='#'>Register</a>
            <a class='loggedOut login'    href='#'>Login</a>
            <a class='loggedIn  logout'   href='#'>Logout</a>
          </ul>
      `);
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
