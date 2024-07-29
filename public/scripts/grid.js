(async function () {
  const bindImageEvents = () => {
    const productImageContainers = document.getElementsByClassName(
      "product-img-container"
    );
    for (const img of productImageContainers) {
      img.addEventListener("click", () => {
        window.open(img.dataset.prodLink, "_blank");
      });
    }
  };

  const createProductCards = (gridItems) => {
    const productHTMLs = gridItems.map((gItem) => {
      return `<div class="product list-item sans-serif">
            <div class="product-img-container" data-prod-link=${
              gItem.productdata.url
            }>
                <img src=${gItem.displayImage} alt={name} />
                <div class="retailer-fav"><img alt="retailer logo" src="/assets/img/${
                  gItem.productdata.retailer
                }.png" /></div>
            </div>
            <div class="product-details-container sans-serif">
                <a href=${gItem.productdata.url} target="_blank"><h3>
                    ${gItem.productdata.title}
                  </h3></a>
                  <div class="product-price">${
                    gItem.productdata.price.value
                  }</div>
                  <div class="ratings-box"><div class="rating"><span style="--ratingnum:${
                    gItem.productdata.rating * 20
                  }%"></span></div><div class="review-count"><span>${
        gItem.productdata.ratingsTotal
      } reviews</span></div></div>
                  <div class="compare-ctrl"><input class="compare-chx" id=${
                    gItem.id
                  } type="checkbox" /><label for=${
        gItem.id
      }> Compare</label></div>
            </div>
            </div>`;
    });
    return productHTMLs.join("");
  };
  const createCompareCards = (gridItems) => {
    const productHTMLs = gridItems.map((gItem) => {
      return `<div class="compare-item sans-serif">
            <div class="product-price">${gItem.productdata.price.value}</div>
            <div class="ratings-box"><div class="rating"><span style="--ratingnum:${
              gItem.productdata.rating * 20
            }%"></span></div><div class="review-count"><span>${
        gItem.productdata.ratingsTotal || 0
      } reviews</span></div></div>
            <div class="product-details-container sans-serif">
                <a href=${gItem.productdata.url} target="_blank"><h3>
                    ${gItem.productdata.title}
                  </h3></a>
            </div>
            <div class="product-img-container" data-prod-link=${
              gItem.productdata.url
            }>
                <img src=${gItem.displayImage} alt={name} />
            </div>
            <div class="retailer-fav bottom-fav"><img alt="retailer logo" src="/assets/img/${
              gItem.productdata.retailer
            }.png" /></div>
            </div>`;
    });
    return productHTMLs.join("");
  };
  const chunk = (arr, size) =>
    arr.reduce(
      (carry, _, index, orig) =>
        !(index % size)
          ? carry.concat([orig.slice(index, index + size)])
          : carry,
      []
    );

  document.addEventListener("DOMContentLoaded", (event) => {
    let chunkedProducts;
    const comparedProducts = [];
    const compareButton = document.getElementById("compare-products");
    const compareModal = document.getElementById("compare-modal");
    const compareCardBox = document.getElementById("compare-cards");
    const compareModalWrapper =
      document.getElementsByClassName("guitar-modal")[1];

    const pGridWrap = document.getElementById("product-grid-wrapper");
    const databox = document.getElementById("ddump");
    const currPage = document.getElementById("current-page");

    const retailerFilter = document.getElementById("retailers");

    const noProductsMesssage = document.getElementById("no-products");
    const backBtn = document.getElementById("back-btn");
    const paginatorEL = document.getElementsByClassName("paginator")[0];
    const bindPaginatorEvents = () => {
      const currPage = document.getElementById("current-page");
      const lPagBtn = document.getElementById("left-p-btn");
      const rPagBtn = document.getElementById("right-p-btn");
      lPagBtn.addEventListener("click", (event) => {
        noProductsMesssage.classList.remove("show");
        if (currPageVal > 1) {
          currPageVal -= 1;
          currPage.innerHTML = currPageVal;
          if (currPageVal > 0) {
            trimProductList(currPageVal);
          }
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
      rPagBtn.addEventListener("click", (event) => {
        noProductsMesssage.classList.remove("show");
        currPageVal += 1;
        if (currPageVal <= chunkLength) {
          currPage.innerHTML = currPageVal;
          trimProductList(currPageVal);
        } else {
          currPageVal -= 1;
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    };

    const updatePaginatorHTML = (pageCount, currPage) => {
      const newPaginatorHTML = `<button class="pag-btn" id="left-p-btn">&larr;</button><div>Page <span id="current-page">${currPage}</span> of <span>${pageCount}</span></div><button class="pag-btn" id="right-p-btn">&rarr;</button>`;
      paginatorEL.innerHTML = newPaginatorHTML;
      currPageVal = currPage;
      setTimeout(() => {
        bindPaginatorEvents();
      });
    };

    const filterNestedChunks = (filterSelection, currPageVal, dataBoxEl) => {
      pData = dataBoxEl.innerHTML;
      parsed = JSON.parse(pData);
      let currPageDisplay;
      let chunks = chunk(parsed, 18);
      let newChunks = chunks
        .map(
          (chunk) =>
            (chunk = chunk.filter(
              (item) => item.productdata.retailer == filterSelection
            ))
        )
        .filter((chunk) => chunk.length > 0);
      chunkedProducts = newChunks;
      chunkLength = newChunks.length;
      currPageDisplay =
        currPageVal > newChunks.length ? newChunks.length : currPageVal;
      updatePaginatorHTML(newChunks.length, currPageDisplay, paginatorEL);
      return newChunks;
    };

    let pData;
    let parsed;
    let chunkLength;
    const trimProductList = async (currPageVal) => {
      const filterVal = retailerFilter.value;
      let gridItems = chunkedProducts[currPageVal - 1];
      if (filterVal) {
        gridItems = gridItems.filter(
          (item) => item.productdata.retailer == filterVal
        );
      }
      if (!gridItems.length) {
        noProductsMesssage.classList.add("show");
        pGridWrap.innerHTML = `<div>¯/\_(ツ)_/¯</div>`;
      } else {
        const newHTML = await createProductCards(gridItems);
        pGridWrap.innerHTML = newHTML;
      }
      bindImageEvents();
    };
    let currPageVal = 1;
    currPage.innerHTML = currPageVal;

    backBtn.addEventListener("click", () => {
      noProductsMesssage.classList.remove("show");
      if (currPageVal > 1) {
        currPageVal -= 1;
        currPage.innerHTML = currPageVal;
        if (currPageVal > 0) {
          trimProductList(currPageVal);
        }
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    fetch("/guitardata")
      .then((res) => res.text())
      .then(function (data) {
        databox.innerHTML = data;
        pData = databox.innerHTML;
        parsed = JSON.parse(pData);
        chunkLength = Math.ceil(parsed.length / 18);
        chunkedProducts = chunk(parsed, 18);
        bindInputs("compareChex");
      });

    const bindInputs = (useCase) => {
      switch (useCase) {
        case "compareChex":
          const compareChex = document.querySelectorAll(".compare-chx");
          let gridItems = chunkedProducts[currPageVal - 1];
          for (const chx of compareChex) {
            chx.addEventListener("click", (event) => {
              let selectedProduct = gridItems.filter(
                (item) => item.id == event.target.id
              );
              comparedProducts.push(selectedProduct[0]);
            });
          }
          break;
      }
    };

    compareButton.addEventListener("click", async () => {
      if (comparedProducts && comparedProducts.length) {
        const compareCards = await createCompareCards(comparedProducts);
        compareCardBox.innerHTML = compareCards;
      } else {
        compareCardBox.innerHTML =
          "<p>Please make some selections to compare.</p>";
      }
      bindImageEvents();
      compareModal.classList.add("show");
    });
    compareModalWrapper.addEventListener("click", (event) => {
      if (event.target.id === "compare-modal") {
        compareModal.classList.remove("show");
      }
    });

    bindPaginatorEvents();

    document.getElementById("retailers").onchange = async function () {
      if (this.value) {
        chunkedProducts = filterNestedChunks(
          this.value,
          currPageVal,
          databox,
          paginatorEL
        );
        const gridItems = chunkedProducts[currPageVal - 1]
          ? chunkedProducts[currPageVal - 1]
          : chunkedProducts[chunkedProducts.length - 1];
        const newGrid = gridItems.filter(
          (item) => item.productdata.retailer == this.value
        );
        if (newGrid.length) {
          const newHTML = await createProductCards(newGrid);
          pGridWrap.innerHTML = newHTML;
        } else {
          noProductsMesssage.classList.add("show");
        }
      } else {
        pData = databox.innerHTML;
        parsed = JSON.parse(pData);
        chunkLength = Math.ceil(parsed.length / 18);
        chunkedProducts = chunk(parsed, 18);
        const gridItems = chunkedProducts[currPageVal - 1];
        const newHTML = await createProductCards(gridItems);
        pGridWrap.innerHTML = newHTML;
        updatePaginatorHTML(chunkedProducts.length, currPageVal);
      }
      bindImageEvents();
    };

    document.getElementById("sort").onchange = async function () {
      let filterVal;
      if (this.value) {
        filterVal = this.value;
        const gridItems = [...chunkedProducts[currPageVal - 1]];
        if (filterVal === "lth") {
          gridItems.sort(
            (a, b) =>
              parseInt(a.productdata.price.value.replace("$", "")) -
              parseInt(b.productdata.price.value.replace("$", ""))
          );
        } else if (filterVal === "htl") {
          gridItems.sort(
            (a, b) =>
              parseInt(b.productdata.price.value.replace("$", "")) -
              parseInt(a.productdata.price.value.replace("$", ""))
          );
        }
        const newHTML = await createProductCards(gridItems);
        pGridWrap.innerHTML = newHTML;
      } else {
        const gridItems = [...chunkedProducts[currPageVal - 1]];
        const newHTML = await createProductCards(gridItems);
        pGridWrap.innerHTML = newHTML;
      }
    };
    setTimeout(() => {
      bindImageEvents();
    });
  });
})();
