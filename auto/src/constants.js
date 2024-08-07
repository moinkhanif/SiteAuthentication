//export named variable
export const V2_HTML_CONTAINER = (scoutFile, appVersion) => {

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
  return v2HTML;
}
return V1HTML
}