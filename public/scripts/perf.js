(() => {
  let displayDataString = "";
  document.addEventListener("DOMContentLoaded", (event) => {
    const perfDataContainer = document.getElementById("resource-data");
    const perfWrap = document.getElementById("resource-data-wrap");
    const resourceBtn = document.getElementById("resource-timing-btn");
    const closeIcon = document.getElementsByClassName("close-icon")[0];
    let resourceList;

    addVitals = (data) => {
      perfDataContainer.innerHTML =
        `<div>${data.name}: ${data.value.toFixed(2)}, ${data.rating}</div>` +
        perfDataContainer.innerHTML;
    };
    resourceBtn.addEventListener("click", () => {
      perfWrap.classList.add("show");
    });
    closeIcon.addEventListener("click", () => {
      perfWrap.classList.remove("show");
    });

    const buildDisplay = (list) => {
      if (list && list.length) {
        list.forEach((entry) => {
          let isCache = '<span class="red">No</span>';
          const request = entry.responseStart - entry.requestStart;
          if (request > 0) {
            if (entry.deliveryType === "cache") {
              isCache = '<span class="green">Yes</span>';
            }
            displayDataString += `<div class="databox">
                    <div class="green"><span class="default-text">Name:</span> ${entry.name
                      .split("/")
                      .pop()}</div>
                    <div class="orange"><span class="default-text">Size:</span> ${(
                      entry.decodedBodySize / 1000
                    ).toFixed(2)} KB</div>
                    <div class="blue"><span class="default-text">Timing:</span> ${request.toFixed(
                      2
                    )}ms</div>
                    <div><span class="default-text">Cache:</span> ${isCache}</div>
                    </div>`;
          }
        });
        perfDataContainer.innerHTML = displayDataString;
      }
    };

    const ttfb = webVitals.onTTFB(addVitals);
    const fid = webVitals.onFID(addVitals);
    const lcp = webVitals.onLCP(addVitals);

    const observer = new PerformanceObserver((list) => {
      resourceList = list.getEntries();
      buildDisplay(resourceList);
    });

    observer.observe({ type: "resource", buffered: true });
    setTimeout(() => {
      observer.disconnect();
    }, 1000);
  });
})();
