(function () {
  const formatArticle = (text) => {
    let splitText = text.split(/\r?\n|\r|\n/g);
    const pMap = splitText.map((p) => {
      return `<p>${p}</p>`;
    });
    return pMap.join("");
  };

  document.addEventListener("DOMContentLoaded", (event) => {
    const postForm = document.getElementById("blog-post-form");
    const postResult = document.getElementById("post-result");
    postForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const pFormData = new FormData(postForm);
      const title = pFormData.get("title");
      const article = pFormData.get("article");
      const paragraphs = formatArticle(article);
      pFormData.append("body", paragraphs);
      fetch("/posts/create", {
        method: "POST",
        body: pFormData,
      })
        .then((res) => res.text())
        .then(function (data) {
          postResult.innerHTML = data;
        });
    });
  });
})();
