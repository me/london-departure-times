# London Transport Live Arrivals

Just an experiment in Go.

----
## Development
### Requirements
* [Go](https://golang.org) >= 1.5
* [Glide](https://github.com/Masterminds/glide) is used as a dependency manager. This requires ``GO15VENDOREXPERIMENT=1`` to be set.
* To manage assets, the app uses [Webpack](http://webpack.github.io). To recompile the assets, install [Node.js](https://nodejs.org), then run ``npm install webpack -g`` and then, in the app folder, ``npm install``, and then ``webpack``.

### Running

The app requires a set of TFL API credentials, which can be obtained [here](https://api-portal.tfl.gov.uk/). ``TFL_APP_ID`` and ``TFL_APP_KEY`` have to be available as environment variables (or can be added to a ``.env`` file in the app's directory).

----
## Implementation details

The app uses the [gin-gonic](https://gin-gonic.github.io/gin/) framework for serving web requests.

On the client side, [Bacon.js](http://baconjs.github.io) is used, instead of a more traditional MVC framework: I love the reactive approach, and I find it greatly simplifies event-driven code.

To fetch live line updates, the app implements a **poller** that demultiplexes the incoming requests, and allows to have a predetermined concurrency and polling interval. This has been the most interesting part of the implementation, and the ease with which it came together really sold me on Go!

----
## Code structure

* ``main.go`` is the entry point, which starts the poller and the gin router
* ``api.go`` defines the public API structures.
* ``tfl.go`` provides the main TFL client structure, the common TFL API structures, and an initializer which constructs the sub-services (implemented in ``tflstops.go``, ``tflarrivals.go`` and ``tflstoppoints.go``) in charge of calling the specific API endpoints.
* ``tflpoller.go`` is responsible for receiving "arrivals" requests, adding them to a poll loop, and returning the most up-to-date information available (if any).

