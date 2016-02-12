import Bacon from 'baconjs';
import $ from 'jquery';
import BJQ from 'bacon.jquery';
import google from 'google';
import moment from 'moment';

if ($("#page").is(".arrivals-page")) {
  let stopId = window.location.pathname.split('/').pop();
  let $results = $(".results");
  let poller = Bacon.interval(2000, true)
    .map( v => ({url: `/api/tfl/arrivals/${stopId}`}))
    .ajax();

  poller.onValue(v => {
    $results.empty();
    if (v.arrivals === null) { return; }
    let arrivals = v.arrivals.sort((a, b) => {
      if (a.expected < b.expected) { return -1; }
      else if (a.expected > b.expected) { return 1; }
      else { return 0; }
    });
    for (let arrival of arrivals) {
      let expected = moment(arrival.expected).fromNow();
      let description = `${arrival.line} to ${arrival.vehicle.destination}`;
      $results.append(
        $("<li/>").append(
          $("<span />").text(`${description} ${expected}`)
        )
      );
    }
  });
}
