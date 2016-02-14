import Bacon from 'baconjs';
import $ from 'jquery';
import BJQ from 'bacon.jquery';
import google from 'google';

if ($("#page").is('.stops-page')) {
  let $notice = $(".notice");
  let position = Bacon.Model.combine({
    lat: Bacon.$.textFieldValue($('#lat')),
    lon: Bacon.$.textFieldValue($('#lon'))
  });
  let map = new google.maps.Map(document.getElementById('map-container'), {
    zoom: 16, minZoom: 15,
    disableDoubleClickZoom: false, scrollwheel: false
  });
  let geocoder = new google.maps.Geocoder();

  let positionStream = position.toEventStream()
    .filter(it => it.lat !== "" && it.lon !== "")
    .map(it => ({lat: parseFloat(it.lat).toFixed(4), lon: parseFloat(it.lon).toFixed(4)}))
    .skipDuplicates((v1, v2) => (v1.lat == v2.lat && v1.lon == v2.lon))
    .debounce(500);

  let stopsRequest = positionStream.map( it =>
    ({ url: '/api/stops',
      data: {lat: it.lat, lon: it.lon}
    })
  ).ajax();
  let markers = [];
  if (position.get().lat === "" && position.get().lon === "") {
    $notice.text("Please wait, finding your location...");
    let geoLocalize = Bacon.fromCallback(navigator.geolocation, 'getCurrentPosition');
    geoLocalize.onValue(it => {
      position.set({lat: it.coords.latitude, lon: it.coords.longitude});
    });
    geoLocalize.onError( e => {
      $notice.text("We are sorry, we were not able to localize you. You can search in the box on the left, or try some sample location below!");
      $('.sample-locations').show();
    });
  }

  $('body').on('click', 'a[data-latlon]', (e) => {
    let latlon = $(e.target).data('latlon').split(",").map( v => parseFloat(v));
    position.set({lat: latlon[0], lon: latlon[1]});
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

  let addressField = Bacon.$.textFieldValue($('#address'));
  $('#address').focusE().onValue(e => {
    addressField.set("");
  });

  map.addListener('bounds_changed', () => {
    let center = map.getCenter();
    position.set({lat: center.lat(), lon: center.lng()});
  });

  positionStream.onValue(it => {
    $(".notice").text("Please wait, loading stops...");
    $('.sample-locations').hide();
    $('.results').empty();
    history.replaceState({}, "", `?lat=${it.lat}&lon=${it.lon}`);
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

  let showNoResults = () => {
    $(".notice").text("Sorry, we could not find any stops around here. You could try some of the sample locations below!");
    $('.sample-locations').show();
  };

  stopsRequest.onValue(v => {
    $(".notice").text("");
    for (let marker of markers) {
      marker.setMap(null);
    }
    $('.results').empty();
    if (v.stops.length === 0) {
      showNoResults();
      return;
    }
    let $ul = $('<ul/>');
    $('.results').append(
      $('<h3/>').text("Stops near your location")
    ).append($ul);
    for (let stop of v.stops) {
      let stopName = stop.name;
      if (stop.indicator !== ""){ stopName += ` - ${stop.indicator}`; }
      let stopTarget = `/${stop.provider}/arrivals/${stop.id}`;
      let marker = new google.maps.Marker({
        position: new google.maps.LatLng(stop.lat, stop.lon),
        map: map,
        title: stopName
      });
      marker.addListener('click', e => {document.location.href = stopTarget;});
      markers.push(marker);
      let lines = stop.lines.map(v => v.name).join(", ");
      $ul.append(
        $('<li/>').append(
          $("<a/>").text(stopName)
            .attr("href", stopTarget)
        ).append(
          $('<div class="lines"/>').text(lines)
        ).mouseenter(e => {
          marker.setAnimation(google.maps.Animation.BOUNCE);
          setTimeout(() => marker.setAnimation(null), 600);
        })
      );
    }
  });

  stopsRequest.onError(showNoResults);

}
