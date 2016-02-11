'esversion: 6';

require("./scss/main.scss");

import Bacon from 'baconjs';
import $ from 'jquery';
import BJQ from 'bacon.jquery';
import google from 'google';

if ($('body').is('#stops-page')) {
  let $notice = $(".notice").text("Please wait, finding your location...");
  let geoLocalize = Bacon.fromCallback(navigator.geolocation, 'getCurrentPosition');

  geoLocalize.onError( e => {
    $notice.text("We are sorry, we were not able to localize you. You can search in the box on the left, or try some sample location below!");
    $('.sample-locations').show();
  });

  let position = Bacon.Model.combine({
    lat: Bacon.$.textFieldValue($('#lat')),
    lon: Bacon.$.textFieldValue($('#lon'))
  });

  let addressField = Bacon.$.textFieldValue($('#address'));
  $('#address').focusE().onValue(e => {
    addressField.set("");
  });

  geoLocalize.onValue(it => {
    position.set({lat: it.coords.latitude, lon: it.coords.longitude});
  });

  let map = new google.maps.Map(document.getElementById('map-container'), {
    zoom: 16, minZoom: 15,
    disableDoubleClickZoom: false
  });

  map.addListener('bounds_changed', () => {
    let center = map.getCenter();
    position.set({lat: center.lat(), lon: center.lng()});
  });

  let geocoder = new google.maps.Geocoder();

  let positionStream = position.changes().throttle(1000)
    .filter(it => it.lat !== "" && it.lon !== "");

  let geoRequest = positionStream.map( it =>
    ({ url: '/api/stops',
      data: {lat: it.lat, lon: it.lon}
    })
  ).ajax();

  positionStream.onValue(it => {
    $(".notice").text("Please wait, loading results...");
    let latlng = new google.maps.LatLng(it.lat, it.lon);
    map.setCenter(latlng);
    geocoder.geocode({'location': latlng}, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          addressField.set(results[0].formatted_address);
        }
      }
    });
  });

  let markers = [];

  geoRequest.onValue(v => {
    $(".notice").text("");
    for (let marker of markers) {
      marker.setMap(null);
    }
    for (let stop of v) {
      let marker = new google.maps.Marker({
        position: new google.maps.LatLng(stop.lat, stop.lon),
        map: map,
        title: `${stop.name} - ${stop.indicator}`
      });
      markers.push(marker);
    }
  });

  $('#address-form').submitE().onValue( e => {
    e.preventDefault();
    let address = addressField.get();
    if (address === "") { return; }
    geocoder.geocode({address: addressField.get()}, (result, status) => {
      if (status == google.maps.GeocoderStatus.OK) {
        map.setCenter(result[0].geometry.location);
      }
    });
  });
}

