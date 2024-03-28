var idSite = 6;
var matomoTrackingApiUrl = 'https://usekeyp.matomo.cloud/matomo.php';

var _paq = window._paq = window._paq || [];
_paq.push(['setTrackerUrl', matomoTrackingApiUrl]);
_paq.push(['setSiteId', idSite]);
_paq.push(['trackPageView']);
_paq.push(['enableLinkTracking']);
