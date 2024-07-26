(async function () {
  document.addEventListener("DOMContentLoaded", (event) => {
    const nameValidation = document.getElementById("namebad");
    const emailValidation = document.getElementById("emailbad");

    //form
    const formBtn = document.getElementById("sign-up-btn");
    const formWrap = document.querySelectorAll(".form-wrap")[0];
    formBtn.addEventListener("click", () => {
      formWrap.classList.add("open-form");
      formBtn.classList.add("hidden");
    });
    const form = document.getElementById("userForm");
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      nameValidation.classList.remove("show");
      emailValidation.classList.remove("show");
      var data = this;
      const fData = new FormData(data);
      const nameData = fData.get("name");
      const nameTest = /^[a-zA-Z]+$/.test(nameData);
      const usernameData = fData.get("username");

      if (usernameData) {
        return;
      }
      if (nameData === "" || !isNaN(nameData) || !nameTest) {
        nameValidation.classList.add("show");
        return;
      }
      fetch(data.getAttribute("action"), {
        method: data.getAttribute("method"),
        body: fData,
      })
        .then((res) => res.text())
        .then(function (data) {
          const response = fetch("/thanks")
            .then((res) => res.text())
            .then(function (data) {
              formWrap.innerHTML = data;
            });
        });
    });
  });
})();
