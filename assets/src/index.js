'esversion: 6';

require("./scss/main.scss");

import Bacon from 'baconjs';
import $ from 'jquery';
import BJQ from 'bacon.jquery';

if ($('body').is('#stops-page')) {
  let geoLocalize = Bacon.fromCallback(navigator.geolocation, 'getCurrentPosition');
  let geoRequest = geoLocalize.map( it =>
    ({ url: '/api/stops', data: { lat: it.coords.latitude, lon: it.coords.longitude } })
  ).ajax();

  geoLocalize.onValue(it => {
    $('#lat').val(it.coords.latitude);
    $('#lon').val(it.coords.longitude);
  });

  geoRequest.onValue(v => console.log(v));
}

