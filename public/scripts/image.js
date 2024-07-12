(function () {
  document.addEventListener("DOMContentLoaded", (event) => {
    const form = document.getElementById("imageform");
    const input = document.getElementById("input");
    const userNameInput = document.getElementById("imageuser");
    const button = document.getElementById("button");
    const imageTag = document.getElementById("dalleresult");
    const loader = document.getElementById("loading");
    const imgReqMessage = document.getElementById("img-request-message");

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const sessionRequests = sessionStorage.getItem("imageRequests");
      if (sessionRequests) {
        if (parseInt(sessionRequests) >= 2) {
          imgReqMessage.innerHTML =
            "<p>Sorry, too many requests. Two per user, please.</p>";
          return;
        } else {
          sessionStorage.setItem("imageRequests", Number(sessionRequests) + 1);
        }
      } else {
        sessionStorage.setItem("imageRequests", 1);
      }
      const usernameData = userNameInput.value;
      if (usernameData) {
        return;
      }
      loader.classList.add("processing");
      const text = input.value;
      if (!text) {
        alert("Please enter a text description");
        return;
      }
      button.disabled = true;
      try {
        const url = "/dalle-image";
        const params = new URLSearchParams({ text });
        await fetch(`${url}?${params}`)
          .then(function (response) {
            return response.text();
          })
          .then(function (data) {
            imageTag.src = data;
            imageTag.classList.add("show");
            loader.classList.remove("processing");
          });
      } catch (error) {
        console.error(error);
        alert(error.message);
      } finally {
        button.disabled = false;
      }
    });
  });
})();
