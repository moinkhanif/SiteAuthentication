export function convertTime(utcTimeString) {
  // Parse the UTC time string into a Javascript Date object
  const theDate = new Date(utcTimeString);
  // console.log('utcDate', utcDate)

  // Get the current time in milliseconds
  const currentTime = new Date().getTime();

  // Calculate the difference in milliseconds
  const timeDifference = currentTime - theDate.getTime();

  // Convert the difference to desired unit (hours, minutes, days)
  const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));
  const minutesDifference = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
  const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  // Format the IST time and choose the appropriate unit for difference
  const istTime = theDate.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  let differenceString;
  if (daysDifference > 0) {
    differenceString = `${daysDifference} day(s) ago`;
  } else if (hoursDifference > 0) {
    differenceString = `${hoursDifference} hour(s) ago`;
  } else {
    differenceString = `${minutesDifference} minute(s) ago`;
  }

  // Return the formatted IST time and difference string
  return `Converted Time in IST: ${istTime}, Difference: ${differenceString}`;
}

export const validateScout = async (url, appVersion) => {
  try {
    const response = await fetch(url);
    if (response.ok) {
      // console.log response in object format
      // response is a js file with comment and function
      if(appVersion === 'v1') {
        return true
      }
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

export const appendCapabilities = (descriptionList, descriptionDiv) => {
  console.log('from here')
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
    } else if (description.includes('GMT')) {
      console.log('before time', description)
      const istTime = convertTime(description);
      console.log('after time', istTime)
      description = `Last Deployed: ${istTime}`;
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
  })
}

export const generateScoutURL = (client, dz, env, locale, appVersion) => {
  const subdomain = appVersion === 'v2' ? 'apps' : 'display';

  const constructSubENV = env === 'qa' ? `-${env}` : '';
  const domain = `https://${subdomain}${constructSubENV}.bazaarvoice.com`;

  let scoutBody = '';
  let constructENV = '';
  if (appVersion === 'v2') {
    constructENV = env == 'stg' ? 'staging' : 'production';
    scoutBody = `/deployments/${client}/${dz}/${constructENV}/${locale}/bv.js`;
  } else {
    constructENV = env == 'stg' ? 'bvstaging/' : '';
    scoutBody = `/${constructENV}static/${client}/${dz}/${locale}/bvapi.js`
  }
  return `${domain}${scoutBody}`
}

export const loadScoutAndProduct = (scoutfile, productId, appName) => {
  // load scout file
  const script = document.createElement('script');
  script.src = scoutfile;
  document.head.appendChild(script);

  // load product
  const productDIV = document.createElement('div');
  productDIV.id = 'product';
  productDIV.setAttribute('data-bv-show', appName);
  productDIV.setAttribute('data-bv-product-id', productId);
  document.body.appendChild(productDIV);
}