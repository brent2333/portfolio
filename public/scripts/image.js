(function () {
  document.addEventListener("DOMContentLoaded", (event) => {
    const form = document.getElementById("imageform");
    const input = document.getElementById("input");
    const button = document.getElementById("button");
    const imageTag = document.getElementById("dalleresult");
    const loader = document.getElementById("loading");

    form.addEventListener("submit", async (event) => {
      loader.classList.add("processing");
      event.preventDefault();
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
            console.log(data); // this will be a string
          });
      } catch (error) {
        // Handle any errors
        console.error(error);
        alert(error.message);
      } finally {
        // Enable the button again
        button.disabled = false;
      }
    });
  });
})();
