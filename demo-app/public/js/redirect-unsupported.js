// from https://stackoverflow.com/questions/17907445/how-to-detect-ie11
var ua = window.navigator.userAgent;
var isIE = /MSIE|Trident/.test(ua);

if (isIE) {
  window.location.replace('unsupported-browser.html');
}
