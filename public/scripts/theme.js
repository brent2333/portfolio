(async function () {
  function setDocumentClasses(themeClass) {
    const html = document.getElementsByTagName("html");
    if (!html[0].classList.contains(themeClass)) {
      html[0].classList.remove("dark");
      html[0].classList.remove("light");
      html[0].classList.remove("auto");
      html[0].classList.add(themeClass);
    }
  }
  function setThemeFromLocalStorageOrMediaPreference() {
    const theme = localStorage.getItem("themeSetting") || "auto";

    switch (theme) {
      case "auto":
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
          setDocumentClasses("dark");
        } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
          setDocumentClasses("light");
        }
        break;

      case "dark":
        setDocumentClasses("dark");
        break;

      case "light":
        setDocumentClasses("light");
        break;
    }

    document
      .querySelectorAll(`.theme_toggle input[value='${theme}']`)
      .forEach(function (toggle) {
        toggle.checked = true;
      });
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
