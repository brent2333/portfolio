(function () {
  document.addEventListener("DOMContentLoaded", (event) => {
    const loginbtn = document.getElementById("login-btn");
    const loginModal = document.getElementById("login-modal");
    const loginForm = document.getElementById("ulf");
    loginbtn.addEventListener("click", (event) => {
      loginModal.classList.add("show-login");
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
          } else {
            loginForm.innerHTML = "<p>Sorry your login failed</p>";
          }
        });
    });
  });
})();
