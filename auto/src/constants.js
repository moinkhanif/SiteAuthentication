//export named variable
export const V2_HTML_CONTAINER = (scoutFile, appVersion) => {

const generateV1HTML = (scoutFile) => {
  const meta = document.createElement('meta');
  meta.name = 'robots';
  meta.content = 'noindex, nofollow';
  document.head.appendChild(meta);

  const link = document.createElement('link');
  link.rel = 'canonical';
  link.href = 'container.htm';
  document.head.appendChild(link);

  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = scoutFile;
  script.onload = () => {
    $BV.container('global', {});
  };
  document.body.appendChild(script);

  // setTimeout(() => {
  //   $BV.container('global', {} );
  //   // const script2 = document.createElement('script');
  //   // script2.innerHTML = `$BV.container('global', {} );`
  //   // document.body.appendChild(script2);
  // }, 500)
}
const V1HTML = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8"/>
    <title></title>
    <meta name="robots" content="noindex, nofollow">
    <link rel="canonical" href="container.htm"/>
  </head>
  <body>
    <script type="text/javascript" src="${scoutFile}"></script>
    <script>
      $BV.container('global', {} );
    </script>
  </body>
</html>`

const generateV2HTML = (scoutFile) => {
  const meta = document.createElement('meta');
  meta.name = 'robots';
  meta.content = 'noindex, nofollow';
  document.head.appendChild(meta);

  const link = document.createElement('link');
  link.rel = 'canonical';
  link.href = 'container.htm';
  document.head.appendChild(link);

  const metaPageType = document.createElement('meta');
  metaPageType.name = 'bv:pageType';
  metaPageType.content = 'container';

  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = scoutFile;
  document.body.appendChild(script);
}

const v2HTML = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title></title>
    <meta name="robots" content="noindex, nofollow">
    <!-- You can use either the relative or the absolute path to the canonical URL. For example, if the page is hosted -->
    <!-- at http://www.example.com/path/to/container.html, you can enter the canonical URL "container.html" or the full path. -->
    <link rel="canonical" href="container.htm" />
    <meta name="bv:pageType" content="container">
  </head>
  <body>
    <script type="text/javascript" src="${scoutFile}"></script>
  </body>
</html>`;

if (appVersion === 'v2') {
  generateV2HTML(scoutFile)
  return;
}
generateV1HTML(scoutFile)
}