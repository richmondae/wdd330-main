import ExternalServices from "./ExternalServices.mjs";
import ProductList from "./ProductList.mjs";
import { loadHeaderFooter, getParam, qs } from "./utils.mjs";

loadHeaderFooter();

// turn "sleeping-bags" into "Sleeping Bags" for display
function formatCategoryName(categoryName) {
  return categoryName
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

const category = getParam("category");

const titleElement = qs("#listTitle");
titleElement.textContent = `Top Products: ${formatCategoryName(category)}`;

const dataSource = new ExternalServices();
const listElement = qs(".product-list");

const myList = new ProductList(category, dataSource, listElement);
myList.init();
