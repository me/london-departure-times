import Bacon from 'baconjs';
import $ from 'jquery';
import BJQ from 'bacon.jquery';
import google from 'google';
import moment from 'moment';

if ($("#page").is(".arrivals-page")) {
  let stopId = window.location.pathname.split('/').pop();
  let $results = $(".results");
  let poller = Bacon.mergeAll(Bacon.once(true), Bacon.interval(1000, true))
    .map( v => ({url: `/api/tfl/arrivals/${stopId}`}))
    .ajax();
  let arrivals = null;

  poller.onValue(v => {
    $results.empty();
    if (arrivals === null) {
      $(".notice").text("Please wait, loading arrivals...");
    }
    if (v.arrivals === null || v.arrivals.length === 0) {
      setTimeout(() => {
        if (arrivals.length === 0) {
            $(".notice").text("No arrivals found.");
        }
      }, 2000);
      arrivals = [];
      return;
    } else {
      $(".notice").empty();
    }
    arrivals = v.arrivals.sort((a, b) => {
      if (a.expected < b.expected) { return -1; }
      else if (a.expected > b.expected) { return 1; }
      else { return 0; }
    });
    for (let arrival of arrivals) {
      let expected = moment(arrival.expected);
      if (expected.isBefore(moment().add(1, 'minutes'))) {
        expected = "due";
      } else {
        expected = expected.fromNow();
      }
      let description = arrival.line;
      if (arrival.vehicle.destination !== "") {
        description += ` to ${arrival.vehicle.destination}`;
      }
      $results.append(
        $("<li/>").append(
          $("<span />").text(`${description} ${expected}`)
        )
      );
    }
  });
}
