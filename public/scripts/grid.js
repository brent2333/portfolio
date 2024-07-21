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
            <div class="product-img-container" data-prod-link=${gItem.productdata.url}>
                <img src=${gItem.displayImage} alt={name} />
                <div class="retailer-fav"><img alt="retailer logo" src="/assets/img/${gItem.productdata.retailer}.png" /></div>
            </div>
            <div class="product-details-container sans-serif">
                <a href=${gItem.productdata.url} target="_blank"><h3>
                    ${gItem.productdata.title}
                  </h3></a>
                  <div class="product-price">${gItem.productdata.price.value}</div>
            </div>
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
    setTimeout(() => {
      bindImageEvents();
    });
  });
})();