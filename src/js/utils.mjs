// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// get a parameter value from the current page's URL query string
export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

// render a list of items to the DOM using a supplied template function
export function renderListWithTemplate(
  templateFn,
  parentElement,
  list,
  position = "afterbegin",
  clear = false,
) {
  if (clear) {
    parentElement.innerHTML = "";
  }
  const htmlStrings = list.map(templateFn);
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

// insert a single rendered template into a parent element, then run an optional callback
export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;
  if (callback) {
    callback(data);
  }
}

// fetch an HTML partial file and return its contents as a string
export async function loadTemplate(path) {
  const response = await fetch(path);
  const html = await response.text();
  return html;
}

// convert a form element's data into a plain JSON object
export function formDataToJSON(formElement) {
  const formData = new FormData(formElement);
  const convertedJSON = {};

  formData.forEach(function (value, key) {
    convertedJSON[key] = value;
  });

  return convertedJSON;
}

// show a dismissible alert message near the top of <main>, optionally scrolling it into view
export function alertMessage(message, scroll = true) {
  const alert = document.createElement("div");
  alert.classList.add("alert");
  alert.innerHTML = `<p>${message}</p><span class="alert__close">&times;</span>`;

  const main = document.querySelector("main");
  main.prepend(alert);

  alert.querySelector(".alert__close").addEventListener("click", () => {
    alert.remove();
  });

  if (scroll) {
    window.scrollTo(0, 0);
  }
}

// load the shared header and footer partials into the page
export async function loadHeaderFooter() {
  const headerTemplate = await loadTemplate("/partials/header.html");
  const headerElement = document.querySelector("#header");
  renderWithTemplate(headerTemplate, headerElement);

  const footerTemplate = await loadTemplate("/partials/footer.html");
  const footerElement = document.querySelector("#footer");
  renderWithTemplate(footerTemplate, footerElement);
}
