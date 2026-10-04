import ExternalServices from "./ExternalServices.mjs";
import ProductList from "./ProductList.mjs";
import { qs, loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

const dataSource = new ExternalServices();
const listElement = qs(".product-list");

const myList = new ProductList("tents", dataSource, listElement);
myList.init();
