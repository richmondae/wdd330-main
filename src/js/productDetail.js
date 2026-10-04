import ExternalServices from "./ExternalServices.mjs";
import {
  getLocalStorage,
  setLocalStorage,
  getParam,
  loadHeaderFooter,
  alertMessage,
  qs,
} from "./utils.mjs";

loadHeaderFooter();

const dataSource = new ExternalServices();
const productId = getParam("product");

function addProductToCart(product) {
  const cart = getLocalStorage("so-cart") || [];
  cart.push(product);
  setLocalStorage("so-cart", cart);
}

function renderProductDetails(product) {
  qs("#productImage").src = product.Images.PrimaryLarge;
  qs("#productImage").alt = product.Name;
  qs("#productBrand").textContent = product.Brand.Name;
  qs("#productColor").textContent = product.Colors?.[0]?.ColorName || "";
  qs("#productName").textContent = product.NameWithoutBrand;
  qs("#productPrice").textContent = `$${product.FinalPrice}`;
  qs("#productDescription").innerHTML = product.DescriptionHtmlSimple;

  const addToCartButton = qs("#addToCart");
  addToCartButton.dataset.id = product.Id;
  addToCartButton.addEventListener("click", () => {
    addProductToCart(product);
    alertMessage(`${product.Name} was added to your cart.`, false);
  });

  document.title = `Sleep Outside | ${product.Name}`;
}

async function init() {
  const product = await dataSource.findProductById(productId);
  renderProductDetails(product);
}

init();
