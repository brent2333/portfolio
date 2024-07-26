(async function () {
  function setDocumentClasses(themeClass) {
    const html = document.getElementsByTagName("html");
    html[0].classList = [themeClass];
  }
  function setThemeFromLocalStorageOrMediaPreference() {
    const theme = localStorage.getItem("themeSetting") || "auto";

    switch (theme) {
      case "dark":
        setDocumentClasses("dark");
        break;
      case "light":
        setDocumentClasses("light");
        break;
      case "auto":
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
          setDocumentClasses("dark");
        } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
          setDocumentClasses("light");
        }
        break;
    }
  }

  document.addEventListener("DOMContentLoaded", (event) => {
    setThemeFromLocalStorageOrMediaPreference();

    document.querySelectorAll("#theme-wrap input").forEach((toggle) => {
      toggle.addEventListener(
        "change",
        (e) => {
          if (e.target.checked) {
            if (e.target.value == "auto") {
              localStorage.removeItem("themeSetting");
            } else {
              localStorage.setItem("themeSetting", e.target.value);
            }
          }

          setThemeFromLocalStorageOrMediaPreference();
        },
        false
      );
    });

    // handle other tabs changing local storage
    window.addEventListener("storage", (e) => {
      if (e.key == "themeSetting") {
        setThemeFromLocalStorageOrMediaPreference();
      }
    });
  });
})();
