(function () {
  document.addEventListener("DOMContentLoaded", (event) => {
    const loginbtn = document.getElementById("login-btn");
    const loginModal = document.getElementById("login-modal");
    const loginForm = document.getElementById("ulf");
    const loginResult = document.getElementById("login-result");
    if (sessionStorage.getItem("loggedin") === "true") {
      loginbtn.innerHTML = "Log Out";
      loginbtn.dataset.loginState = "loggedin";
    }
    loginbtn.addEventListener("click", (event) => {
      if (sessionStorage.getItem("loggedin") === "true") {
        sessionStorage.setItem("loggedin", false);
        loginbtn.innerHTML = "Login";
        return;
      } else {
        loginModal.classList.add("show-login");
      }
    });
    loginModal.addEventListener("click", (event) => {
      if (event.target.id === "login-modal") {
        loginModal.classList.remove("show-login");
      }
    });
    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const lFormData = new FormData(loginForm);
      fetch("/users/login", {
        method: "POST",
        body: lFormData,
      })
        .then((res) => res.json())
        .then(function (data) {
          if (data && data.msg === "Login success") {
            sessionStorage.setItem("loggedin", true);
            loginModal.classList.remove("show-login");
            loginbtn.innerHTML = "Log Out";
            loginbtn.dataset.loginState = "loggedin";
          } else {
            loginResult.innerHTML = "<p>Sorry your login failed</p>";
          }
        });
    });
  });
})();
