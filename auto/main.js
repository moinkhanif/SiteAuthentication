// get search params
const searchParams = new URLSearchParams(window.location.search);
const client = searchParams.get('client') || '';
const dz = searchParams.get('dz') || '';
const locale = searchParams.get('locale') || 'en_US';
const env = searchParams.get('env') || 'qa';
const productId = searchParams.get('productId') || 'product1';
let message = '';
let generalMessage = '';

const validateScout = async (url) => {
  try {
    const response = await fetch(url);
    if (response.ok) {
      // console.log response in object format
      // response is a js file with comment and function
      const responseText = await response.text();
      // get the text within /* and */
      const filedata = responseText.match(/\/\*([\s\S]*?)\*\//)[1];
      return { filedata }
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
    return false;
  }
}
if (client === '' || dz === '') {
  message = 'client and dz are required';
  console.error(message);
} else {
  const constructSubENV = env === 'qa' ? `-${env}` : '';
  const constructENV = env == 'stg' ? 'staging' : 'production';
  
  const scoutfile = `https://apps${constructSubENV}.bazaarvoice.com/deployments/${client}/${dz}/${constructENV}/${locale}/bv.js`
  
  validateScout(scoutfile).then((result) => {
    const messageDiv = document.createElement('p');
    messageDiv.classList.add('message');
    if (result) {
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
      let reachedCap = false;
      let capabilitiesList = null;
      descriptionList.forEach((description, i) => {
        //  if description container @ symbol or Bazaarvoice bv-loader text or Capabilities or GMT text, render the list. Stop rendering after list has 'Copyright' text
        if (description.includes('@') || description.includes('bv-loader') || description.includes('Capabilities') || description.includes('GMT')) {
        // if reached Capabilities, render list within list
        if (reachedCap) {
          const capabilityItem = document.createElement('li');
          capabilityItem.innerHTML = description;
          capabilitiesList.appendChild(capabilityItem);
        } else {
        const descriptionItem = document.createElement('li');
        if (description.includes('Capabilities')) {
          reachedCap = true;
          const capTextNode = document.createTextNode('Capabilities');
          descriptionItem.appendChild(capTextNode);
          const innerList = document.createElement('ul');
          capabilitiesList = innerList;
          descriptionItem.appendChild(innerList);
        } 
        else if (description.includes('GMT')) {
          description = `Last Deployed: ${description}`;
        } else if (description.includes('bv-loader')) {
          // get version from text bv-loader v13.25.7 using regex
          const version = description.match(/v\d+\.\d+\.\d+/);
          description = `BV Loader Version: ${version}`;
        }
        if(!description.includes('Capabilities')) {
        descriptionItem.appendChild(document.createTextNode(description));
        }
        descriptionDiv.appendChild(descriptionItem);
      }}
      });
      document.body.appendChild(descriptionDiv);
  
      // load bv.js
      const script = document.createElement('script');
      script.src = scoutfile;
      document.head.appendChild(script);

      // load product
      const productDIV = document.createElement('div');
      productDIV.id = 'product';
      productDIV.setAttribute('data-bv-show', 'reviews');
      productDIV.setAttribute('data-bv-product-id', productId);
      document.body.appendChild(productDIV);
    } else {
      messageDiv.classList.add('error');
      messageDiv.innerHTML = 'Something is wrong! bv.js failed to load!';
      message = 'failed';
      document.body.appendChild(messageDiv);
    }
  });
}

document.body.innerHTML = `<h1>${message}</h1>`;

