// get search params
const searchParams = new URLSearchParams(window.location.search);
const client = searchParams.get('client') || '';
const dz = searchParams.get('dz') || '';
const locale = searchParams.get('locale') || 'en_US';
const env = searchParams.get('env') || 'qa';
let message = '';
let generalMessage = '';

const validateScout = async (url) => {
  try {
    const response = await fetch(url);
    if (response.ok) {
      return true;
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
      
      // load bv.js
      const script = document.createElement('script');
      script.src = scoutfile;
      document.head.appendChild(script);

      // load product
      const productDIV = document.createElement('div');
      productDIV.id = 'product';
      productDIV.setAttribute('data-bv-show', 'reviews');
      productDIV.setAttribute('data-bv-product-id', 'product1');
      document.body.appendChild(productDIV);
    } else {
      messageDiv.classList.add('error');
      messageDiv.innerHTML = 'Something is wrong! bv.js failed to load!';
      message = 'failed';
    }
    document.body.appendChild(messageDiv)
  });
}

document.body.innerHTML = `<h1>${message}</h1>`;

