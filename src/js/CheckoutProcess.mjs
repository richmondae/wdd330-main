import { getLocalStorage, setLocalStorage, alertMessage, formDataToJSON } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

const externalServices = new ExternalServices();

// convert the cart's full product objects into the simplified
// { id, name, price, quantity } shape the server expects, grouping
// duplicate product ids into a single line item with a quantity.
function packageItems(items) {
  const grouped = [];

  items.forEach((item) => {
    const existing = grouped.find((entry) => entry.id === item.Id);
    if (existing) {
      existing.quantity += 1;
    } else {
      grouped.push({
        id: item.Id,
        name: item.Name,
        price: item.FinalPrice,
        quantity: 1,
      });
    }
  });

  return grouped;
}

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }

  init() {
    this.list = getLocalStorage(this.key) || [];
    this.calculateItemSummary();
  }

  calculateItemSummary() {
    this.itemTotal = this.list.reduce((sum, item) => sum + item.FinalPrice, 0);
    const subtotalElement = document.querySelector(
      `${this.outputSelector} #checkoutSubtotal`,
    );
    subtotalElement.textContent = `$${this.itemTotal.toFixed(2)}`;
  }

  calculateOrdersTotal() {
    const itemCount = this.list.length;
    this.shipping = itemCount > 0 ? 10 + (itemCount - 1) * 2 : 0;
    this.tax = this.itemTotal * 0.06;
    this.orderTotal = this.itemTotal + this.tax + this.shipping;
    this.displayOrderTotals();
  }

  displayOrderTotals() {
    document.querySelector(`${this.outputSelector} #checkoutTax`).textContent =
      `$${this.tax.toFixed(2)}`;
    document.querySelector(
      `${this.outputSelector} #checkoutShipping`,
    ).textContent = `$${this.shipping.toFixed(2)}`;
    document.querySelector(
      `${this.outputSelector} #checkoutOrderTotal`,
    ).textContent = `$${this.orderTotal.toFixed(2)}`;
  }

  async checkout(form) {
    const orderData = formDataToJSON(form);

    orderData.orderDate = new Date().toISOString();
    orderData.orderTotal = this.orderTotal.toFixed(2);
    orderData.tax = this.tax.toFixed(2);
    orderData.shipping = this.shipping;
    orderData.items = packageItems(this.list);

    try {
      await externalServices.checkout(orderData);
      setLocalStorage(this.key, []);
      window.location.href = "/checkout/success.html";
    } catch (err) {
      const serverMessage =
        err?.message?.message || err?.message || "Unknown error";
      alertMessage(
        `We were unable to process your order: ${serverMessage}. Please check your information and try again.`,
      );
    }
  }
}
