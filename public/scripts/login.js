(function () {
  document.addEventListener("DOMContentLoaded", (event) => {
    const loginbtn = document.getElementById("login-btn");
    const loginModal = document.getElementById("login-modal");
    const loginForm = document.getElementById("ulf");
    loginbtn.addEventListener("click", (event) => {
      loginModal.classList.add("show-login");
    });
    loginForm.addEventListener("submit", () => {
      event.preventDefault();
      const lFormData = new FormData(loginForm);
      fetch("/users/login", {
        method: "POST",
        body: lFormData,
      })
        .then((res) => res.json())
        .then(function (data) {
          console.log("DATA", data);
        });
    });
  });
})();
