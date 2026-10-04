import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

loadHeaderFooter();

const checkoutProcess = new CheckoutProcess("so-cart", ".checkout-summary");
checkoutProcess.init();

document.querySelector("#zip").addEventListener("blur", () => {
  checkoutProcess.calculateOrdersTotal();
});

document.querySelector("#checkoutSubmit").addEventListener("click", (e) => {
  e.preventDefault();
  const form = document.querySelector("#checkoutForm");

  const isValid = form.checkValidity();
  form.reportValidity();

  if (isValid) {
    checkoutProcess.checkout(form);
  }
});
