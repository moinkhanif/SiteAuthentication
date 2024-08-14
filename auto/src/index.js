import { V2_HTML_CONTAINER } from "./constants";
import { appendCapabilities, generateScoutURL, loadScoutAndProduct, validateScout } from "./utils.js";

// get search params
const searchParams = new URLSearchParams(window.location.search);
const client = searchParams.get('client') || '';
const dz = searchParams.get('dz') || '';
const locale = searchParams.get('locale') || 'en_US';
const env = searchParams.get('env') || 'qa';
const productId = searchParams.get('productId') || 'product1';
const appName = searchParams.get('appName') || 'reviews';
const containerPage = searchParams.get('containerPage') || 'false';
const appVersion = searchParams.get('appVersion') || 'v2';
const rawHTML = searchParams.get('rawHTML') || '';
console.log('rawHTML11', rawHTML)
let message = '';
let generalMessage = '';

if (client === '' || dz === '') {
  message = 'client and dz are required';
  console.error(message);
} else { 
  // const constructSubENV = env === 'qa' ? `-${env}` : '';
  // const constructENV = env == 'stg' ? 'staging' : 'production';
  
  const scoutfile = generateScoutURL(client, dz, env, locale, appVersion);
  // `https://apps${constructSubENV}.bazaarvoice.com/deployments/${client}/${dz}/${constructENV}/${locale}/bv.js`
  console.log('containerPage', containerPage, typeof containerPage)
  if (appVersion === 'v2') {
    console.log('appVersion', appVersion, scoutfile)
  validateScout(scoutfile).then((result) => {
    console.log('result', result)
    const messageDiv = document.createElement('p');
    messageDiv.classList.add('message');
    if (result || appVersion === 'v1') {
      if (containerPage === 'true') {
        // clear everything inside document with container page
        // document.body.innerHTML = "";
        // document.head.innerHTML = "";
        // load container
        console.log('appVersion', appVersion, scoutfile)
        // document.write(V2_HTML_CONTAINER(scoutfile, appVersion));
        V2_HTML_CONTAINER(scoutfile, appVersion);
        return;
      }
      messageDiv.classList.add('success');
      messageDiv.innerHTML = 'bv.js loaded successfully!';
      message = 'success';
      document.body.appendChild(messageDiv)

      // add the bv.js url to page
      const urlDiv = document.createElement('a');
      urlDiv.href = scoutfile;
      urlDiv.innerHTML = scoutfile;
      document.body.appendChild(urlDiv);

      // add description of the response
      // remove all stars from text
      const filedata = result.filedata.replace(/\*/g, '');
      const descriptionList = filedata.split('\n');
      const descriptionDiv = document.createElement('ul');
      descriptionDiv.classList.add('description');

      appendCapabilities(descriptionList, descriptionDiv);
      document.body.appendChild(descriptionDiv);
  
      // add input form area for any raw html the user wants to append to the body
      const form = document.createElement('form');
      form.id = 'rawHTMLForm';
      form.innerHTML = `<textarea id="rawHTMLInput" rows="10" cols="50">${rawHTML}</textarea>`;
      const submitButton = document.createElement('button');
      submitButton.type = 'submit';
      submitButton.innerHTML = 'Append HTML';
      form.appendChild(submitButton);

      // handle submit
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const rawHTML = document.getElementById('rawHTMLInput').value;
        const rawHTMLDiv = document.createElement('div');
        rawHTMLDiv.innerHTML = rawHTML;
        document.body.appendChild(rawHTMLDiv.innerHTML);
        // also update url so it can be picked later or the form reloaded
        const url = new URL(window.location.href);
        url.searchParams.set('rawHTML', rawHTML);
        window.history.pushState({}, '', url);
      });
      document.body.appendChild(form);
      if (rawHTML && rawHTML !== '') {
        console.log('rawHTML', rawHTML)
        const rawHTMLDiv = document.createElement('div');
        rawHTMLDiv.innerHTML = rawHTML;
        document.body.appendChild(rawHTMLDiv);
      }
      loadScoutAndProduct(scoutfile, productId, appName);
      // // load scout file
      // const script = document.createElement('script');
      // script.src = scoutfile;
      // document.head.appendChild(script);

      // // load product
      // const productDIV = document.createElement('div');
      // productDIV.id = 'product';
      // productDIV.setAttribute('data-bv-show', 'reviews');
      // productDIV.setAttribute('data-bv-product-id', productId);
      // document.body.appendChild(productDIV);
    } else {
      messageDiv.classList.add('error');
      messageDiv.innerHTML = `Something is wrong! bv.js does not exist for this combination!
      <br>Constructed URL:
      <br>
      <a target="_blank" href="${scoutfile}">${scoutfile}</a>`;
      message = 'failed';
      document.body.appendChild(messageDiv);
    }
  });
} else if (appVersion === 'v1') {
  console.log('appVersion', appVersion, scoutfile);
  if (containerPage === 'true') {
    // clear everything inside document with container page
    // document.body.innerHTML = "";
    // document.head.innerHTML = "";
    // load container
    console.log('appVersion', appVersion, scoutfile)
    // document.write(V2_HTML_CONTAINER(scoutfile, appVersion));
    V2_HTML_CONTAINER(scoutfile, appVersion);
  } else {
    loadScoutAndProduct(scoutfile, productId, appName);
  }
}

document.body.innerHTML = `<h1>${message}</h1>`;
}
