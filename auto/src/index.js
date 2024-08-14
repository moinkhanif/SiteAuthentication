import { V2_HTML_CONTAINER } from "./constants";
import {
  appendCapabilities,
  generateInputForm,
  generateScoutURL,
  loadScoutAndProduct,
  validateScout,
} from "./utils.js";

// get search params
const searchParams = new URLSearchParams(window.location.search);
const params = [
  { name: "client", default: "" },
  { name: "dz", default: "" },
  { name: "locale", default: "en_US" },
  { name: "env", default: "qa" },
  { name: "productId", default: "product1" },
  { name: "appName", default: "reviews" },
  { name: "containerPage", default: "false" },
  { name: "appVersion", default: "v2" },
  { name: "rawHTML", default: "" },
];

const extractedParams = params.reduce((acc, param) => {
  acc[param.name] = searchParams.get(param.name) || param.default;
  return acc;
}, {});

const {
  client,
  dz,
  locale,
  env,
  productId,
  appName,
  containerPage,
  appVersion,
  rawHTML,
} = extractedParams;

let message = "";
let generalMessage = "";

// create a form with the input fields from the params
const form = document.createElement("form");
form.id = "inputForm";
params.forEach((param) => {
  const input = document.createElement("input");
  input.type = "text";
  input.name = param.name;
  input.placeholder = param.default;
  input.value = extractedParams[param.name];
  form.appendChild(input);
});
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const client = formData.get("client");
  const dz = formData.get("dz");
  const locale = formData.get("locale");
  const env = formData.get("env");
  const productId = formData.get("productId");
  const appName = formData.get("appName");
  const containerPage = formData.get("containerPage");
  const appVersion = formData.get("appVersion");
  const rawHTML = formData.get("rawHTML");
  window.location.search = `?client=${client}&dz=${dz}&locale=${locale}&env=${env}&productId=${productId}&appName=${appName}&containerPage=${containerPage}&appVersion=${appVersion}&rawHTML=${rawHTML}`;
});
document.body.appendChild(form);

if (client === "" || dz === "") {
  message = "client and dz are required";
  console.error(message);
} else {
  const scoutfile = generateScoutURL(client, dz, env, locale, appVersion);

  if (appVersion === "v2") {
    validateScout(scoutfile).then((result) => {
      const messageDiv = document.createElement("p");
      messageDiv.classList.add("message");
      if (result || appVersion === "v1") {
        if (containerPage === "true") {
          V2_HTML_CONTAINER(scoutfile, appVersion);
          return;
        }
        messageDiv.classList.add("success");
        messageDiv.innerHTML = "bv.js loaded successfully!";
        message = "success";
        document.body.appendChild(messageDiv);

        // add the bv.js url to page
        const urlDiv = document.createElement("a");
        urlDiv.href = scoutfile;
        urlDiv.innerHTML = scoutfile;
        document.body.appendChild(urlDiv);

        // add description of the response
        // remove all stars from text
        const filedata = result.filedata.replace(/\*/g, "");
        const descriptionList = filedata.split("\n");
        const descriptionDiv = document.createElement("ul");
        descriptionDiv.classList.add("description");

        appendCapabilities(descriptionList, descriptionDiv);
        document.body.appendChild(descriptionDiv);

        // add input form area for any raw html the user wants to append to the body
        document.body.appendChild(generateInputForm(rawHTML));
        if (rawHTML && rawHTML !== "") {
          const rawHTMLDiv = document.createElement("div");
          rawHTMLDiv.innerHTML = rawHTML;
          document.body.appendChild(rawHTMLDiv);
        }
        loadScoutAndProduct(scoutfile, productId, appName);
      } else {
        messageDiv.classList.add("error");
        messageDiv.innerHTML = `Something is wrong! bv.js does not exist for this combination!
      <br>Constructed URL:
      <br>
      <a target="_blank" href="${scoutfile}">${scoutfile}</a>`;
        message = "failed";
        document.body.appendChild(messageDiv);
      }
    });
  } else if (appVersion === "v1") {
    if (containerPage === "true") {
      V2_HTML_CONTAINER(scoutfile, appVersion);
    } else {
      loadScoutAndProduct(scoutfile, productId, appName);
    }
  }

  document.body.innerHTML = `<h1>${message}</h1>`;
}
