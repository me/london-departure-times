/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	'esversion: 6';

	__webpack_require__(2);
	__webpack_require__(3);
	__webpack_require__(18);

/***/ },
/* 2 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _baconjs = __webpack_require__(4);

	var _baconjs2 = _interopRequireDefault(_baconjs);

	var _jquery = __webpack_require__(8);

	var _jquery2 = _interopRequireDefault(_jquery);

	var _bacon = __webpack_require__(9);

	var _bacon2 = _interopRequireDefault(_bacon);

	var _google = __webpack_require__(17);

	var _google2 = _interopRequireDefault(_google);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	if ((0, _jquery2.default)("#page").is('.stops-page')) {
	  (function () {
	    var $notice = (0, _jquery2.default)(".notice");
	    var position = _baconjs2.default.Model.combine({
	      lat: _baconjs2.default.$.textFieldValue((0, _jquery2.default)('#lat')),
	      lon: _baconjs2.default.$.textFieldValue((0, _jquery2.default)('#lon'))
	    });
	    var map = new _google2.default.maps.Map(document.getElementById('map-container'), {
	      zoom: 16, minZoom: 15,
	      disableDoubleClickZoom: false
	    });
	    var geocoder = new _google2.default.maps.Geocoder();

	    var positionStream = position.toEventStream().filter(function (it) {
	      return it.lat !== "" && it.lon !== "";
	    }).map(function (it) {
	      return { lat: parseFloat(it.lat).toFixed(4), lon: parseFloat(it.lon).toFixed(4) };
	    }).skipDuplicates(function (v1, v2) {
	      return v1.lat == v2.lat && v1.lon == v2.lon;
	    }).throttle(1000);

	    var stopsRequest = positionStream.map(function (it) {
	      return { url: '/api/stops',
	        data: { lat: it.lat, lon: it.lon }
	      };
	    }).ajax();
	    var markers = [];
	    if (position.get().lat === "" && position.get().lon === "") {
	      $notice.text("Please wait, finding your location...");
	      var geoLocalize = _baconjs2.default.fromCallback(navigator.geolocation, 'getCurrentPosition');
	      geoLocalize.onValue(function (it) {
	        position.set({ lat: it.coords.latitude, lon: it.coords.longitude });
	      });
	      geoLocalize.onError(function (e) {
	        $notice.text("We are sorry, we were not able to localize you. You can search in the box on the left, or try some sample location below!");
	        (0, _jquery2.default)('.sample-locations').show();
	      });
	    }

	    (0, _jquery2.default)('body').on('click', 'a[data-latlon]', function (e) {
	      var latlon = (0, _jquery2.default)(e.target).data('latlon').split(",").map(function (v) {
	        return parseFloat(v);
	      });
	      position.set({ lat: latlon[0], lon: latlon[1] });
	    });

	    (0, _jquery2.default)('#address-form').submitE().onValue(function (e) {
	      e.preventDefault();
	      var address = addressField.get();
	      if (address === "") {
	        return;
	      }
	      geocoder.geocode({ address: addressField.get() }, function (result, status) {
	        if (status == _google2.default.maps.GeocoderStatus.OK) {
	          map.setCenter(result[0].geometry.location);
	        }
	      });
	    });

	    var addressField = _baconjs2.default.$.textFieldValue((0, _jquery2.default)('#address'));
	    (0, _jquery2.default)('#address').focusE().onValue(function (e) {
	      addressField.set("");
	    });

	    map.addListener('bounds_changed', function () {
	      var center = map.getCenter();
	      position.set({ lat: center.lat(), lon: center.lng() });
	    });

	    positionStream.onValue(function (it) {
	      (0, _jquery2.default)(".notice").text("Please wait, loading results...");
	      (0, _jquery2.default)('.sample-locations').hide();
	      (0, _jquery2.default)('.results').empty();
	      history.replaceState({}, "", '?lat=' + it.lat + '&lon=' + it.lon);
	      var latlng = new _google2.default.maps.LatLng(it.lat, it.lon);
	      map.setCenter(latlng);
	      geocoder.geocode({ 'location': latlng }, function (results, status) {
	        if (status === _google2.default.maps.GeocoderStatus.OK) {
	          if (results[0]) {
	            addressField.set(results[0].formatted_address);
	          }
	        }
	      });
	    });

	    var showNoResults = function showNoResults() {
	      (0, _jquery2.default)(".notice").text("Sorry, we could not find any stops around here. You could try some of the sample locations below!");
	      (0, _jquery2.default)('.sample-locations').show();
	    };

	    stopsRequest.onValue(function (v) {
	      (0, _jquery2.default)(".notice").text("");
	      var _iteratorNormalCompletion = true;
	      var _didIteratorError = false;
	      var _iteratorError = undefined;

	      try {
	        for (var _iterator = markers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	          var marker = _step.value;

	          marker.setMap(null);
	        }
	      } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion && _iterator.return) {
	            _iterator.return();
	          }
	        } finally {
	          if (_didIteratorError) {
	            throw _iteratorError;
	          }
	        }
	      }

	      (0, _jquery2.default)('.results').empty();
	      if (v.stops.length === 0) {
	        showNoResults();
	      }
	      var _iteratorNormalCompletion2 = true;
	      var _didIteratorError2 = false;
	      var _iteratorError2 = undefined;

	      try {
	        var _loop = function _loop() {
	          var stop = _step2.value;

	          var stopName = stop.name;
	          if (stop.indicator !== "") {
	            stopName += ' - ' + stop.indicator;
	          }
	          var stopTarget = '/' + stop.provider + '/arrivals/' + stop.id;
	          var marker = new _google2.default.maps.Marker({
	            position: new _google2.default.maps.LatLng(stop.lat, stop.lon),
	            map: map,
	            title: stopName
	          });
	          marker.addListener('click', function (e) {
	            document.location.href = stopTarget;
	          });
	          markers.push(marker);
	          var lines = stop.lines.map(function (v) {
	            return v.name;
	          }).join(", ");
	          (0, _jquery2.default)('.results').append((0, _jquery2.default)('<li/>').append((0, _jquery2.default)("<a/>").text(stopName).attr("href", stopTarget)).append((0, _jquery2.default)('<div class="lines"/>').text(lines)).mouseenter(function (e) {
	            marker.setAnimation(_google2.default.maps.Animation.BOUNCE);
	            setTimeout(function () {
	              return marker.setAnimation(null);
	            }, 600);
	          }));
	        };

	        for (var _iterator2 = v.stops[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	          _loop();
	        }
	      } catch (err) {
	        _didIteratorError2 = true;
	        _iteratorError2 = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion2 && _iterator2.return) {
	            _iterator2.return();
	          }
	        } finally {
	          if (_didIteratorError2) {
	            throw _iteratorError2;
	          }
	        }
	      }
	    });

	    stopsRequest.onError(showNoResults);
	  })();
	}

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(global, module) {"use strict";

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	(function () {
	  var _slice = Array.prototype.slice;
	  var Bacon = {
	    toString: function toString() {
	      return "Bacon";
	    }
	  };

	  Bacon.version = '0.7.83';

	  var Exception = (typeof global !== "undefined" && global !== null ? global : this).Error;
	  var nop = function nop() {};
	  var latter = function latter(_, x) {
	    return x;
	  };
	  var former = function former(x, _) {
	    return x;
	  };
	  var cloneArray = function cloneArray(xs) {
	    return xs.slice(0);
	  };
	  var assert = function assert(message, condition) {
	    if (!condition) {
	      throw new Exception(message);
	    }
	  };
	  var assertObservableIsProperty = function assertObservableIsProperty(x) {
	    if ((x != null ? x._isObservable : void 0) && !(x != null ? x._isProperty : void 0)) {
	      throw new Exception("Observable is not a Property : " + x);
	    }
	  };
	  var assertEventStream = function assertEventStream(event) {
	    if (!(event != null ? event._isEventStream : void 0)) {
	      throw new Exception("not an EventStream : " + event);
	    }
	  };

	  var assertObservable = function assertObservable(event) {
	    if (!(event != null ? event._isObservable : void 0)) {
	      throw new Exception("not an Observable : " + event);
	    }
	  };
	  var assertFunction = function assertFunction(f) {
	    return assert("not a function : " + f, _.isFunction(f));
	  };
	  var isArray = function isArray(xs) {
	    return xs instanceof Array;
	  };
	  var isObservable = function isObservable(x) {
	    return x && x._isObservable;
	  };
	  var assertArray = function assertArray(xs) {
	    if (!isArray(xs)) {
	      throw new Exception("not an array : " + xs);
	    }
	  };
	  var assertNoArguments = function assertNoArguments(args) {
	    return assert("no arguments supported", args.length === 0);
	  };
	  var assertString = function assertString(x) {
	    if (typeof x === "string") {
	      throw new Exception("not a string : " + x);
	    }
	  };

	  var extend = function extend(target) {
	    var length = arguments.length;
	    for (var i = 1; 1 < length ? i < length : i > length; 1 < length ? i++ : i--) {
	      for (var prop in arguments[i]) {
	        target[prop] = arguments[i][prop];
	      }
	    }
	    return target;
	  };

	  var inherit = function inherit(child, parent) {
	    var hasProp = {}.hasOwnProperty;
	    var ctor = function ctor() {};
	    ctor.prototype = parent.prototype;
	    child.prototype = new ctor();
	    for (var key in parent) {
	      if (hasProp.call(parent, key)) {
	        child[key] = parent[key];
	      }
	    }
	    return child;
	  };

	  var _ = {
	    indexOf: function () {
	      if (Array.prototype.indexOf) {
	        return function (xs, x) {
	          return xs.indexOf(x);
	        };
	      } else {
	        return function (xs, x) {
	          for (var i = 0, y; i < xs.length; i++) {
	            y = xs[i];
	            if (x === y) {
	              return i;
	            }
	          }
	          return -1;
	        };
	      }
	    }(),
	    indexWhere: function indexWhere(xs, f) {
	      for (var i = 0, y; i < xs.length; i++) {
	        y = xs[i];
	        if (f(y)) {
	          return i;
	        }
	      }
	      return -1;
	    },
	    head: function head(xs) {
	      return xs[0];
	    },
	    always: function always(x) {
	      return function () {
	        return x;
	      };
	    },
	    negate: function negate(f) {
	      return function (x) {
	        return !f(x);
	      };
	    },
	    empty: function empty(xs) {
	      return xs.length === 0;
	    },
	    tail: function tail(xs) {
	      return xs.slice(1, xs.length);
	    },
	    filter: function filter(f, xs) {
	      var filtered = [];
	      for (var i = 0, x; i < xs.length; i++) {
	        x = xs[i];
	        if (f(x)) {
	          filtered.push(x);
	        }
	      }
	      return filtered;
	    },
	    map: function map(f, xs) {
	      return function () {
	        var result = [];
	        for (var i = 0, x; i < xs.length; i++) {
	          x = xs[i];
	          result.push(f(x));
	        }
	        return result;
	      }();
	    },
	    each: function each(xs, f) {
	      for (var key in xs) {
	        if (Object.prototype.hasOwnProperty.call(xs, key)) {
	          var value = xs[key];
	          f(key, value);
	        }
	      }
	    },
	    toArray: function toArray(xs) {
	      return isArray(xs) ? xs : [xs];
	    },
	    contains: function contains(xs, x) {
	      return _.indexOf(xs, x) !== -1;
	    },
	    id: function id(x) {
	      return x;
	    },
	    last: function last(xs) {
	      return xs[xs.length - 1];
	    },
	    all: function all(xs) {
	      var f = arguments.length <= 1 || arguments[1] === undefined ? _.id : arguments[1];

	      for (var i = 0, x; i < xs.length; i++) {
	        x = xs[i];
	        if (!f(x)) {
	          return false;
	        }
	      }
	      return true;
	    },
	    any: function any(xs) {
	      var f = arguments.length <= 1 || arguments[1] === undefined ? _.id : arguments[1];

	      for (var i = 0, x; i < xs.length; i++) {
	        x = xs[i];
	        if (f(x)) {
	          return true;
	        }
	      }
	      return false;
	    },
	    without: function without(x, xs) {
	      return _.filter(function (y) {
	        return y !== x;
	      }, xs);
	    },
	    remove: function remove(x, xs) {
	      var i = _.indexOf(xs, x);
	      if (i >= 0) {
	        return xs.splice(i, 1);
	      }
	    },
	    fold: function fold(xs, seed, f) {
	      for (var i = 0, x; i < xs.length; i++) {
	        x = xs[i];
	        seed = f(seed, x);
	      }
	      return seed;
	    },
	    flatMap: function flatMap(f, xs) {
	      return _.fold(xs, [], function (ys, x) {
	        return ys.concat(f(x));
	      });
	    },
	    cached: function cached(f) {
	      var value = None;
	      return function () {
	        if (typeof value !== "undefined" && value !== null ? value._isNone : undefined) {
	          value = f();
	          f = undefined;
	        }
	        return value;
	      };
	    },
	    bind: function bind(fn, me) {
	      return function () {
	        return fn.apply(me, arguments);
	      };
	    },
	    isFunction: function isFunction(f) {
	      return typeof f === "function";
	    },
	    toString: function toString(obj) {
	      var internals, key, value;
	      var hasProp = {}.hasOwnProperty;
	      try {
	        recursionDepth++;
	        if (obj == null) {
	          return "undefined";
	        } else if (_.isFunction(obj)) {
	          return "function";
	        } else if (isArray(obj)) {
	          if (recursionDepth > 5) {
	            return "[..]";
	          }
	          return "[" + _.map(_.toString, obj).toString() + "]";
	        } else if ((obj != null ? obj.toString : void 0) != null && obj.toString !== Object.prototype.toString) {
	          return obj.toString();
	        } else if ((typeof obj === "undefined" ? "undefined" : _typeof(obj)) === "object") {
	          if (recursionDepth > 5) {
	            return "{..}";
	          }
	          internals = function () {
	            var results = [];
	            for (key in obj) {
	              if (!hasProp.call(obj, key)) continue;
	              value = function () {
	                var error;
	                try {
	                  return obj[key];
	                } catch (error) {
	                  return error;
	                }
	              }();
	              results.push(_.toString(key) + ":" + _.toString(value));
	            }
	            return results;
	          }();
	          return "{" + internals + "}";
	        } else {
	          return obj;
	        }
	      } finally {
	        recursionDepth--;
	      }
	    }
	  };

	  var recursionDepth = 0;

	  Bacon._ = _;

	  var UpdateBarrier = Bacon.UpdateBarrier = function () {
	    var rootEvent;
	    var waiterObs = [];
	    var waiters = {};
	    var afters = [];
	    var aftersIndex = 0;
	    var flushed = {};

	    var afterTransaction = function afterTransaction(f) {
	      if (rootEvent) {
	        return afters.push(f);
	      } else {
	        return f();
	      }
	    };

	    var whenDoneWith = function whenDoneWith(obs, f) {
	      if (rootEvent) {
	        var obsWaiters = waiters[obs.id];
	        if (!(typeof obsWaiters !== "undefined" && obsWaiters !== null)) {
	          obsWaiters = waiters[obs.id] = [f];
	          return waiterObs.push(obs);
	        } else {
	          return obsWaiters.push(f);
	        }
	      } else {
	        return f();
	      }
	    };

	    var flush = function flush() {
	      while (waiterObs.length > 0) {
	        flushWaiters(0, true);
	      }
	      flushed = {};
	    };

	    var flushWaiters = function flushWaiters(index, deps) {
	      var obs = waiterObs[index];
	      var obsId = obs.id;
	      var obsWaiters = waiters[obsId];
	      waiterObs.splice(index, 1);
	      delete waiters[obsId];
	      if (deps && waiterObs.length > 0) {
	        flushDepsOf(obs);
	      }
	      for (var i = 0, f; i < obsWaiters.length; i++) {
	        f = obsWaiters[i];
	        f();
	      }
	    };

	    var flushDepsOf = function flushDepsOf(obs) {
	      if (flushed[obs.id]) return;
	      var deps = obs.internalDeps();
	      for (var i = 0, dep; i < deps.length; i++) {
	        dep = deps[i];
	        flushDepsOf(dep);
	        if (waiters[dep.id]) {
	          var index = _.indexOf(waiterObs, dep);
	          flushWaiters(index, false);
	        }
	      }
	      flushed[obs.id] = true;
	    };

	    var inTransaction = function inTransaction(event, context, f, args) {
	      if (rootEvent) {
	        return f.apply(context, args);
	      } else {
	        rootEvent = event;
	        try {
	          var result = f.apply(context, args);

	          flush();
	        } finally {
	          rootEvent = undefined;
	          while (aftersIndex < afters.length) {
	            var after = afters[aftersIndex];
	            aftersIndex++;
	            after();
	          }
	          aftersIndex = 0;
	          afters = [];
	        }
	        return result;
	      }
	    };

	    var currentEventId = function currentEventId() {
	      return rootEvent ? rootEvent.id : undefined;
	    };

	    var wrappedSubscribe = function wrappedSubscribe(obs, sink) {
	      var unsubd = false;
	      var shouldUnsub = false;
	      var doUnsub = function doUnsub() {
	        shouldUnsub = true;
	        return shouldUnsub;
	      };
	      var unsub = function unsub() {
	        unsubd = true;
	        return doUnsub();
	      };
	      doUnsub = obs.dispatcher.subscribe(function (event) {
	        return afterTransaction(function () {
	          if (!unsubd) {
	            var reply = sink(event);
	            if (reply === Bacon.noMore) {
	              return unsub();
	            }
	          }
	        });
	      });
	      if (shouldUnsub) {
	        doUnsub();
	      }
	      return unsub;
	    };

	    var hasWaiters = function hasWaiters() {
	      return waiterObs.length > 0;
	    };

	    return { whenDoneWith: whenDoneWith, hasWaiters: hasWaiters, inTransaction: inTransaction, currentEventId: currentEventId, wrappedSubscribe: wrappedSubscribe, afterTransaction: afterTransaction };
	  }();

	  function Source(obs, sync) {
	    var lazy = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

	    this.obs = obs;
	    this.sync = sync;
	    this.lazy = lazy;
	    this.queue = [];
	  }

	  extend(Source.prototype, {
	    _isSource: true,

	    subscribe: function subscribe(sink) {
	      return this.obs.dispatcher.subscribe(sink);
	    },
	    toString: function toString() {
	      return this.obs.toString();
	    },
	    markEnded: function markEnded() {
	      this.ended = true;
	      return true;
	    },
	    consume: function consume() {
	      if (this.lazy) {
	        return { value: _.always(this.queue[0]) };
	      } else {
	        return this.queue[0];
	      }
	    },
	    push: function push(x) {
	      this.queue = [x];
	      return [x];
	    },
	    mayHave: function mayHave() {
	      return true;
	    },
	    hasAtLeast: function hasAtLeast() {
	      return this.queue.length;
	    },
	    flatten: true
	  });

	  function ConsumingSource() {
	    Source.apply(this, arguments);
	  }

	  inherit(ConsumingSource, Source);
	  extend(ConsumingSource.prototype, {
	    consume: function consume() {
	      return this.queue.shift();
	    },
	    push: function push(x) {
	      return this.queue.push(x);
	    },
	    mayHave: function mayHave(c) {
	      return !this.ended || this.queue.length >= c;
	    },
	    hasAtLeast: function hasAtLeast(c) {
	      return this.queue.length >= c;
	    },
	    flatten: false
	  });

	  function BufferingSource(obs) {
	    Source.call(this, obs, true);
	  }

	  inherit(BufferingSource, Source);
	  extend(BufferingSource.prototype, {
	    consume: function consume() {
	      var values = this.queue;
	      this.queue = [];
	      return {
	        value: function value() {
	          return values;
	        }
	      };
	    },
	    push: function push(x) {
	      return this.queue.push(x.value());
	    },
	    hasAtLeast: function hasAtLeast() {
	      return true;
	    }
	  });

	  Source.isTrigger = function (s) {
	    if (s != null ? s._isSource : void 0) {
	      return s.sync;
	    } else {
	      return s != null ? s._isEventStream : void 0;
	    }
	  };

	  Source.fromObservable = function (s) {
	    if (s != null ? s._isSource : void 0) {
	      return s;
	    } else if (s != null ? s._isProperty : void 0) {
	      return new Source(s, false);
	    } else {
	      return new ConsumingSource(s, true);
	    }
	  };

	  function Desc(context, method, args) {
	    this.context = context;
	    this.method = method;
	    this.args = args;
	  }

	  extend(Desc.prototype, {
	    _isDesc: true,
	    deps: function deps() {
	      if (!this.cached) {
	        this.cached = findDeps([this.context].concat(this.args));
	      }
	      return this.cached;
	    },
	    toString: function toString() {
	      return _.toString(this.context) + "." + _.toString(this.method) + "(" + _.map(_.toString, this.args) + ")";
	    }
	  });

	  var describe = function describe(context, method) {
	    var ref = context || method;
	    if (ref && ref._isDesc) {
	      return context || method;
	    } else {
	      for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
	        args[_key - 2] = arguments[_key];
	      }

	      return new Desc(context, method, args);
	    }
	  };

	  var withDesc = function withDesc(desc, obs) {
	    obs.desc = desc;
	    return obs;
	  };

	  var findDeps = function findDeps(x) {
	    if (isArray(x)) {
	      return _.flatMap(findDeps, x);
	    } else if (isObservable(x)) {
	      return [x];
	    } else if (typeof x !== "undefined" && x !== null ? x._isSource : undefined) {
	      return [x.obs];
	    } else {
	      return [];
	    }
	  };

	  Bacon.Desc = Desc;
	  Bacon.Desc.empty = new Bacon.Desc("", "", []);

	  var withMethodCallSupport = function withMethodCallSupport(wrapped) {
	    return function (f) {
	      for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
	        args[_key2 - 1] = arguments[_key2];
	      }

	      if ((typeof f === "undefined" ? "undefined" : _typeof(f)) === "object" && args.length) {
	        var context = f;
	        var methodName = args[0];
	        f = function f() {
	          return context[methodName].apply(context, arguments);
	        };
	        args = args.slice(1);
	      }
	      return wrapped.apply(undefined, [f].concat(args));
	    };
	  };

	  var makeFunctionArgs = function makeFunctionArgs(args) {
	    args = Array.prototype.slice.call(args);
	    return makeFunction_.apply(undefined, args);
	  };

	  var partiallyApplied = function partiallyApplied(f, applied) {
	    return function () {
	      for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
	        args[_key3] = arguments[_key3];
	      }

	      return f.apply(undefined, applied.concat(args));
	    };
	  };

	  var toSimpleExtractor = function toSimpleExtractor(args) {
	    return function (key) {
	      return function (value) {
	        if (!(typeof value !== "undefined" && value !== null)) {
	          return;
	        } else {
	          var fieldValue = value[key];
	          if (_.isFunction(fieldValue)) {
	            return fieldValue.apply(value, args);
	          } else {
	            return fieldValue;
	          }
	        }
	      };
	    };
	  };

	  var toFieldExtractor = function toFieldExtractor(f, args) {
	    var parts = f.slice(1).split(".");
	    var partFuncs = _.map(toSimpleExtractor(args), parts);
	    return function (value) {
	      for (var i = 0, f; i < partFuncs.length; i++) {
	        f = partFuncs[i];
	        value = f(value);
	      }
	      return value;
	    };
	  };

	  var isFieldKey = function isFieldKey(f) {
	    return typeof f === "string" && f.length > 1 && f.charAt(0) === ".";
	  };

	  var makeFunction_ = withMethodCallSupport(function (f) {
	    for (var _len4 = arguments.length, args = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
	      args[_key4 - 1] = arguments[_key4];
	    }

	    if (_.isFunction(f)) {
	      if (args.length) {
	        return partiallyApplied(f, args);
	      } else {
	        return f;
	      }
	    } else if (isFieldKey(f)) {
	      return toFieldExtractor(f, args);
	    } else {
	      return _.always(f);
	    }
	  });

	  var makeFunction = function makeFunction(f, args) {
	    return makeFunction_.apply(undefined, [f].concat(args));
	  };

	  var convertArgsToFunction = function convertArgsToFunction(obs, f, args, method) {
	    if (typeof f !== "undefined" && f !== null ? f._isProperty : undefined) {
	      var sampled = f.sampledBy(obs, function (p, s) {
	        return [p, s];
	      });
	      return method.call(sampled, function (_ref) {
	        var p = _ref[0];
	        var s = _ref[1];
	        return p;
	      }).map(function (_ref2) {
	        var p = _ref2[0];
	        var s = _ref2[1];
	        return s;
	      });
	    } else {
	      f = makeFunction(f, args);
	      return method.call(obs, f);
	    }
	  };

	  var toCombinator = function toCombinator(f) {
	    if (_.isFunction(f)) {
	      return f;
	    } else if (isFieldKey(f)) {
	      var key = toFieldKey(f);
	      return function (left, right) {
	        return left[key](right);
	      };
	    } else {
	      throw new Exception("not a function or a field key: " + f);
	    }
	  };

	  var toFieldKey = function toFieldKey(f) {
	    return f.slice(1);
	  };

	  function Some(value) {
	    this.value = value;
	  }

	  extend(Some.prototype, {
	    _isSome: true,
	    getOrElse: function getOrElse() {
	      return this.value;
	    },
	    get: function get() {
	      return this.value;
	    },
	    filter: function filter(f) {
	      if (f(this.value)) {
	        return new Some(this.value);
	      } else {
	        return None;
	      }
	    },
	    map: function map(f) {
	      return new Some(f(this.value));
	    },
	    forEach: function forEach(f) {
	      return f(this.value);
	    },
	    isDefined: true,
	    toArray: function toArray() {
	      return [this.value];
	    },
	    inspect: function inspect() {
	      return "Some(" + this.value + ")";
	    },
	    toString: function toString() {
	      return this.inspect();
	    }
	  });

	  var None = {
	    _isNone: true,
	    getOrElse: function getOrElse(value) {
	      return value;
	    },
	    filter: function filter() {
	      return None;
	    },
	    map: function map() {
	      return None;
	    },
	    forEach: function forEach() {},
	    isDefined: false,
	    toArray: function toArray() {
	      return [];
	    },
	    inspect: function inspect() {
	      return "None";
	    },
	    toString: function toString() {
	      return this.inspect();
	    }
	  };

	  var toOption = function toOption(v) {
	    if ((typeof v !== "undefined" && v !== null ? v._isSome : undefined) || (typeof v !== "undefined" && v !== null ? v._isNone : undefined)) {
	      return v;
	    } else {
	      return new Some(v);
	    }
	  };

	  Bacon.noMore = "<no-more>";
	  Bacon.more = "<more>";

	  var eventIdCounter = 0;

	  function Event() {
	    this.id = ++eventIdCounter;
	  }

	  Event.prototype._isEvent = true;
	  Event.prototype.isEvent = function () {
	    return true;
	  };
	  Event.prototype.isEnd = function () {
	    return false;
	  };
	  Event.prototype.isInitial = function () {
	    return false;
	  };
	  Event.prototype.isNext = function () {
	    return false;
	  };
	  Event.prototype.isError = function () {
	    return false;
	  };
	  Event.prototype.hasValue = function () {
	    return false;
	  };
	  Event.prototype.filter = function () {
	    return true;
	  };
	  Event.prototype.inspect = function () {
	    return this.toString();
	  };
	  Event.prototype.log = function () {
	    return this.toString();
	  };

	  function Next(valueF, eager) {
	    if (!(this instanceof Next)) {
	      return new Next(valueF, eager);
	    }

	    Event.call(this);

	    if (!eager && _.isFunction(valueF) || (valueF != null ? valueF._isNext : void 0)) {
	      this.valueF = valueF;
	      this.valueInternal = void 0;
	    } else {
	      this.valueF = void 0;
	      this.valueInternal = valueF;
	    }
	  }

	  inherit(Next, Event);

	  Next.prototype.isNext = function () {
	    return true;
	  };
	  Next.prototype.hasValue = function () {
	    return true;
	  };
	  Next.prototype.value = function () {
	    var ref;
	    if ((ref = this.valueF) != null ? ref._isNext : void 0) {
	      this.valueInternal = this.valueF.value();
	      this.valueF = void 0;
	    } else if (this.valueF) {
	      this.valueInternal = this.valueF();
	      this.valueF = void 0;
	    }
	    return this.valueInternal;
	  };

	  Next.prototype.fmap = function (f) {
	    var event, value;
	    if (this.valueInternal) {
	      value = this.valueInternal;
	      return this.apply(function () {
	        return f(value);
	      });
	    } else {
	      event = this;
	      return this.apply(function () {
	        return f(event.value());
	      });
	    }
	  };

	  Next.prototype.apply = function (value) {
	    return new Next(value);
	  };
	  Next.prototype.filter = function (f) {
	    return f(this.value());
	  };
	  Next.prototype.toString = function () {
	    return _.toString(this.value());
	  };
	  Next.prototype.log = function () {
	    return this.value();
	  };
	  Next.prototype._isNext = true;

	  function Initial(valueF, eager) {
	    if (!(this instanceof Initial)) {
	      return new Initial(valueF, eager);
	    }
	    Next.call(this, valueF, eager);
	  }

	  inherit(Initial, Next);
	  Initial.prototype._isInitial = true;
	  Initial.prototype.isInitial = function () {
	    return true;
	  };
	  Initial.prototype.isNext = function () {
	    return false;
	  };
	  Initial.prototype.apply = function (value) {
	    return new Initial(value);
	  };
	  Initial.prototype.toNext = function () {
	    return new Next(this);
	  };

	  function End() {
	    if (!(this instanceof End)) {
	      return new End();
	    }
	    Event.call(this);
	  }

	  inherit(End, Event);
	  End.prototype.isEnd = function () {
	    return true;
	  };
	  End.prototype.fmap = function () {
	    return this;
	  };
	  End.prototype.apply = function () {
	    return this;
	  };
	  End.prototype.toString = function () {
	    return "<end>";
	  };

	  function Error(error) {
	    if (!(this instanceof Error)) {
	      return new Error(error);
	    }
	    this.error = error;
	    Event.call(this);
	  }

	  inherit(Error, Event);
	  Error.prototype.isError = function () {
	    return true;
	  };
	  Error.prototype.fmap = function () {
	    return this;
	  };
	  Error.prototype.apply = function () {
	    return this;
	  };
	  Error.prototype.toString = function () {
	    return "<error> " + _.toString(this.error);
	  };

	  Bacon.Event = Event;
	  Bacon.Initial = Initial;
	  Bacon.Next = Next;
	  Bacon.End = End;
	  Bacon.Error = Error;

	  var initialEvent = function initialEvent(value) {
	    return new Initial(value, true);
	  };
	  var nextEvent = function nextEvent(value) {
	    return new Next(value, true);
	  };
	  var endEvent = function endEvent() {
	    return new End();
	  };
	  var toEvent = function toEvent(x) {
	    if (x && x._isEvent) {
	      return x;
	    } else {
	      return nextEvent(x);
	    }
	  };

	  var idCounter = 0;
	  var registerObs = function registerObs() {};

	  function Observable(desc) {
	    this.desc = desc;
	    this.id = ++idCounter;
	    this.initialDesc = this.desc;
	  }

	  extend(Observable.prototype, {
	    _isObservable: true,

	    subscribe: function subscribe(sink) {
	      return UpdateBarrier.wrappedSubscribe(this, sink);
	    },

	    subscribeInternal: function subscribeInternal(sink) {
	      return this.dispatcher.subscribe(sink);
	    },

	    onValue: function onValue() {
	      var f = makeFunctionArgs(arguments);
	      return this.subscribe(function (event) {
	        if (event.hasValue()) {
	          return f(event.value());
	        }
	      });
	    },

	    onValues: function onValues(f) {
	      return this.onValue(function (args) {
	        return f.apply(undefined, args);
	      });
	    },

	    onError: function onError() {
	      var f = makeFunctionArgs(arguments);
	      return this.subscribe(function (event) {
	        if (event.isError()) {
	          return f(event.error);
	        }
	      });
	    },

	    onEnd: function onEnd() {
	      var f = makeFunctionArgs(arguments);
	      return this.subscribe(function (event) {
	        if (event.isEnd()) {
	          return f();
	        }
	      });
	    },

	    name: function name(_name) {
	      this._name = _name;
	      return this;
	    },

	    withDescription: function withDescription() {
	      this.desc = describe.apply(undefined, arguments);
	      return this;
	    },

	    toString: function toString() {
	      if (this._name) {
	        return this._name;
	      } else {
	        return this.desc.toString();
	      }
	    },

	    internalDeps: function internalDeps() {
	      return this.initialDesc.deps();
	    }
	  });

	  Observable.prototype.assign = Observable.prototype.onValue;
	  Observable.prototype.forEach = Observable.prototype.onValue;
	  Observable.prototype.inspect = Observable.prototype.toString;

	  Bacon.Observable = Observable;

	  function CompositeUnsubscribe() {
	    var ss = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

	    this.unsubscribe = _.bind(this.unsubscribe, this);
	    this.unsubscribed = false;
	    this.subscriptions = [];
	    this.starting = [];
	    for (var i = 0, s; i < ss.length; i++) {
	      s = ss[i];
	      this.add(s);
	    }
	  }

	  extend(CompositeUnsubscribe.prototype, {
	    add: function add(subscription) {
	      var _this2 = this;

	      if (this.unsubscribed) {
	        return;
	      }
	      var ended = false;
	      var unsub = nop;
	      this.starting.push(subscription);
	      var unsubMe = function unsubMe() {
	        if (_this2.unsubscribed) {
	          return;
	        }
	        ended = true;
	        _this2.remove(unsub);
	        return _.remove(subscription, _this2.starting);
	      };
	      unsub = subscription(this.unsubscribe, unsubMe);
	      if (!(this.unsubscribed || ended)) {
	        this.subscriptions.push(unsub);
	      } else {
	        unsub();
	      }
	      _.remove(subscription, this.starting);
	      return unsub;
	    },

	    remove: function remove(unsub) {
	      if (this.unsubscribed) {
	        return;
	      }
	      if (_.remove(unsub, this.subscriptions) !== undefined) {
	        return unsub();
	      }
	    },

	    unsubscribe: function unsubscribe() {
	      if (this.unsubscribed) {
	        return;
	      }
	      this.unsubscribed = true;
	      var iterable = this.subscriptions;
	      for (var i = 0; i < iterable.length; i++) {
	        iterable[i]();
	      }
	      this.subscriptions = [];
	      this.starting = [];
	      return [];
	    },

	    count: function count() {
	      if (this.unsubscribed) {
	        return 0;
	      }
	      return this.subscriptions.length + this.starting.length;
	    },

	    empty: function empty() {
	      return this.count() === 0;
	    }
	  });

	  Bacon.CompositeUnsubscribe = CompositeUnsubscribe;

	  function Dispatcher(_subscribe, _handleEvent) {
	    this._subscribe = _subscribe;
	    this._handleEvent = _handleEvent;
	    this.subscribe = _.bind(this.subscribe, this);
	    this.handleEvent = _.bind(this.handleEvent, this);
	    this.pushing = false;
	    this.ended = false;
	    this.prevError = undefined;
	    this.unsubSrc = undefined;
	    this.subscriptions = [];
	    this.queue = [];
	  }

	  Dispatcher.prototype.hasSubscribers = function () {
	    return this.subscriptions.length > 0;
	  };

	  Dispatcher.prototype.removeSub = function (subscription) {
	    this.subscriptions = _.without(subscription, this.subscriptions);
	    return this.subscriptions;
	  };

	  Dispatcher.prototype.push = function (event) {
	    if (event.isEnd()) {
	      this.ended = true;
	    }
	    return UpdateBarrier.inTransaction(event, this, this.pushIt, [event]);
	  };

	  Dispatcher.prototype.pushToSubscriptions = function (event) {
	    try {
	      var tmp = this.subscriptions;
	      var len = tmp.length;
	      for (var i = 0; i < len; i++) {
	        var sub = tmp[i];
	        var reply = sub.sink(event);
	        if (reply === Bacon.noMore || event.isEnd()) {
	          this.removeSub(sub);
	        }
	      }
	      return true;
	    } catch (error) {
	      this.pushing = false;
	      this.queue = [];
	      throw error;
	    }
	  };

	  Dispatcher.prototype.pushIt = function (event) {
	    if (!this.pushing) {
	      if (event === this.prevError) {
	        return;
	      }
	      if (event.isError()) {
	        this.prevError = event;
	      }
	      this.pushing = true;
	      this.pushToSubscriptions(event);
	      this.pushing = false;
	      while (this.queue.length) {
	        event = this.queue.shift();
	        this.push(event);
	      }
	      if (this.hasSubscribers()) {
	        return Bacon.more;
	      } else {
	        this.unsubscribeFromSource();
	        return Bacon.noMore;
	      }
	    } else {
	      this.queue.push(event);
	      return Bacon.more;
	    }
	  };

	  Dispatcher.prototype.handleEvent = function (event) {
	    if (this._handleEvent) {
	      return this._handleEvent(event);
	    } else {
	      return this.push(event);
	    }
	  };

	  Dispatcher.prototype.unsubscribeFromSource = function () {
	    if (this.unsubSrc) {
	      this.unsubSrc();
	    }
	    this.unsubSrc = undefined;
	  };

	  Dispatcher.prototype.subscribe = function (sink) {
	    var subscription;
	    if (this.ended) {
	      sink(endEvent());
	      return nop;
	    } else {
	      assertFunction(sink);
	      subscription = {
	        sink: sink
	      };
	      this.subscriptions.push(subscription);
	      if (this.subscriptions.length === 1) {
	        this.unsubSrc = this._subscribe(this.handleEvent);
	        assertFunction(this.unsubSrc);
	      }
	      return function (_this) {
	        return function () {
	          _this.removeSub(subscription);
	          if (!_this.hasSubscribers()) {
	            return _this.unsubscribeFromSource();
	          }
	        };
	      }(this);
	    }
	  };

	  Bacon.Dispatcher = Dispatcher;

	  function EventStream(desc, subscribe, handler) {
	    if (!(this instanceof EventStream)) {
	      return new EventStream(desc, subscribe, handler);
	    }
	    if (_.isFunction(desc)) {
	      handler = subscribe;
	      subscribe = desc;
	      desc = Desc.empty;
	    }
	    Observable.call(this, desc);
	    assertFunction(subscribe);
	    this.dispatcher = new Dispatcher(subscribe, handler);
	    registerObs(this);
	  }

	  inherit(EventStream, Observable);
	  extend(EventStream.prototype, {
	    _isEventStream: true,

	    toProperty: function toProperty(initValue_) {
	      var initValue = arguments.length === 0 ? None : toOption(function () {
	        return initValue_;
	      });
	      var disp = this.dispatcher;
	      var desc = new Bacon.Desc(this, "toProperty", [initValue_]);
	      return new Property(desc, function (sink) {
	        var initSent = false;
	        var subbed = false;
	        var unsub = nop;
	        var reply = Bacon.more;
	        var sendInit = function sendInit() {
	          if (!initSent) {
	            return initValue.forEach(function (value) {
	              initSent = true;
	              reply = sink(new Initial(value));
	              if (reply === Bacon.noMore) {
	                unsub();
	                unsub = nop;
	                return nop;
	              }
	            });
	          }
	        };

	        unsub = disp.subscribe(function (event) {
	          if (event.hasValue()) {
	            if (event.isInitial() && !subbed) {
	              initValue = new Some(function () {
	                return event.value();
	              });
	              return Bacon.more;
	            } else {
	              if (!event.isInitial()) {
	                sendInit();
	              }
	              initSent = true;
	              initValue = new Some(event);
	              return sink(event);
	            }
	          } else {
	            if (event.isEnd()) {
	              reply = sendInit();
	            }
	            if (reply !== Bacon.noMore) {
	              return sink(event);
	            }
	          }
	        });
	        subbed = true;
	        sendInit();
	        return unsub;
	      });
	    },

	    toEventStream: function toEventStream() {
	      return this;
	    },

	    withHandler: function withHandler(handler) {
	      return new EventStream(new Bacon.Desc(this, "withHandler", [handler]), this.dispatcher.subscribe, handler);
	    }
	  });

	  Bacon.EventStream = EventStream;

	  Bacon.never = function () {
	    return new EventStream(describe(Bacon, "never"), function (sink) {
	      sink(endEvent());
	      return nop;
	    });
	  };

	  Bacon.when = function () {
	    if (arguments.length === 0) {
	      return Bacon.never();
	    }
	    var len = arguments.length;
	    var usage = "when: expecting arguments in the form (Observable+,function)+";

	    assert(usage, len % 2 === 0);
	    var sources = [];
	    var pats = [];
	    var i = 0;
	    var patterns = [];
	    while (i < len) {
	      patterns[i] = arguments[i];
	      patterns[i + 1] = arguments[i + 1];
	      var patSources = _.toArray(arguments[i]);
	      var f = constantToFunction(arguments[i + 1]);
	      var pat = { f: f, ixs: [] };
	      var triggerFound = false;
	      for (var j = 0, s; j < patSources.length; j++) {
	        s = patSources[j];
	        var index = _.indexOf(sources, s);
	        if (!triggerFound) {
	          triggerFound = Source.isTrigger(s);
	        }
	        if (index < 0) {
	          sources.push(s);
	          index = sources.length - 1;
	        }
	        for (var k = 0, ix; k < pat.ixs.length; k++) {
	          ix = pat.ixs[k];
	          if (ix.index === index) {
	            ix.count++;
	          }
	        }
	        pat.ixs.push({ index: index, count: 1 });
	      }

	      assert("At least one EventStream required", triggerFound || !patSources.length);

	      if (patSources.length > 0) {
	        pats.push(pat);
	      }
	      i = i + 2;
	    }

	    if (!sources.length) {
	      return Bacon.never();
	    }

	    sources = _.map(Source.fromObservable, sources);
	    var needsBarrier = _.any(sources, function (s) {
	      return s.flatten;
	    }) && containsDuplicateDeps(_.map(function (s) {
	      return s.obs;
	    }, sources));

	    var desc = new Bacon.Desc(Bacon, "when", patterns);
	    var resultStream = new EventStream(desc, function (sink) {
	      var triggers = [];
	      var ends = false;
	      var match = function match(p) {
	        for (var i1 = 0, i; i1 < p.ixs.length; i1++) {
	          i = p.ixs[i1];
	          if (!sources[i.index].hasAtLeast(i.count)) {
	            return false;
	          }
	        }
	        return true;
	      };
	      var cannotSync = function cannotSync(source) {
	        return !source.sync || source.ended;
	      };
	      var cannotMatch = function cannotMatch(p) {
	        for (var i1 = 0, i; i1 < p.ixs.length; i1++) {
	          i = p.ixs[i1];
	          if (!sources[i.index].mayHave(i.count)) {
	            return true;
	          }
	        }
	      };
	      var nonFlattened = function nonFlattened(trigger) {
	        return !trigger.source.flatten;
	      };
	      var part = function part(source) {
	        return function (unsubAll) {
	          var flushLater = function flushLater() {
	            return UpdateBarrier.whenDoneWith(resultStream, flush);
	          };
	          var flushWhileTriggers = function flushWhileTriggers() {
	            if (triggers.length > 0) {
	              var reply = Bacon.more;
	              var trigger = triggers.pop();
	              for (var i1 = 0, p; i1 < pats.length; i1++) {
	                p = pats[i1];
	                if (match(p)) {
	                  var events = function () {
	                    var result = [];
	                    for (var i2 = 0, i; i2 < p.ixs.length; i2++) {
	                      i = p.ixs[i2];
	                      result.push(sources[i.index].consume());
	                    }
	                    return result;
	                  }();
	                  reply = sink(trigger.e.apply(function () {
	                    var _p;

	                    var values = function () {
	                      var result = [];
	                      for (var i2 = 0, event; i2 < events.length; i2++) {
	                        event = events[i2];
	                        result.push(event.value());
	                      }
	                      return result;
	                    }();

	                    return (_p = p).f.apply(_p, values);
	                  }));
	                  if (triggers.length) {
	                    triggers = _.filter(nonFlattened, triggers);
	                  }
	                  if (reply === Bacon.noMore) {
	                    return reply;
	                  } else {
	                    return flushWhileTriggers();
	                  }
	                }
	              }
	            } else {
	              return Bacon.more;
	            }
	          };
	          var flush = function flush() {
	            var reply = flushWhileTriggers();
	            if (ends) {
	              if (_.all(sources, cannotSync) || _.all(pats, cannotMatch)) {
	                reply = Bacon.noMore;
	                sink(endEvent());
	              }
	            }
	            if (reply === Bacon.noMore) {
	              unsubAll();
	            }

	            return reply;
	          };
	          return source.subscribe(function (e) {
	            if (e.isEnd()) {
	              ends = true;
	              source.markEnded();
	              flushLater();
	            } else if (e.isError()) {
	              var reply = sink(e);
	            } else {
	              source.push(e);
	              if (source.sync) {
	                triggers.push({ source: source, e: e });
	                if (needsBarrier || UpdateBarrier.hasWaiters()) {
	                  flushLater();
	                } else {
	                  flush();
	                }
	              }
	            }
	            if (reply === Bacon.noMore) {
	              unsubAll();
	            }
	            return reply || Bacon.more;
	          });
	        };
	      };

	      return new Bacon.CompositeUnsubscribe(function () {
	        var result = [];
	        for (var i1 = 0, s; i1 < sources.length; i1++) {
	          s = sources[i1];
	          result.push(part(s));
	        }
	        return result;
	      }()).unsubscribe;
	    });
	    return resultStream;
	  };

	  var containsDuplicateDeps = function containsDuplicateDeps(observables) {
	    var state = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

	    var checkObservable = function checkObservable(obs) {
	      if (_.contains(state, obs)) {
	        return true;
	      } else {
	        var deps = obs.internalDeps();
	        if (deps.length) {
	          state.push(obs);
	          return _.any(deps, checkObservable);
	        } else {
	          state.push(obs);
	          return false;
	        }
	      }
	    };

	    return _.any(observables, checkObservable);
	  };

	  var constantToFunction = function constantToFunction(f) {
	    if (_.isFunction(f)) {
	      return f;
	    } else {
	      return _.always(f);
	    }
	  };

	  Bacon.groupSimultaneous = function () {
	    for (var _len5 = arguments.length, streams = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
	      streams[_key5] = arguments[_key5];
	    }

	    if (streams.length === 1 && isArray(streams[0])) {
	      streams = streams[0];
	    }
	    var sources = function () {
	      var result = [];
	      for (var i = 0, s; i < streams.length; i++) {
	        s = streams[i];
	        result.push(new BufferingSource(s));
	      }
	      return result;
	    }();
	    return withDesc(new Bacon.Desc(Bacon, "groupSimultaneous", streams), Bacon.when(sources, function () {
	      for (var _len6 = arguments.length, xs = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
	        xs[_key6] = arguments[_key6];
	      }

	      return xs;
	    }));
	  };

	  function PropertyDispatcher(property, subscribe, handleEvent) {
	    Dispatcher.call(this, subscribe, handleEvent);
	    this.property = property;
	    this.subscribe = _.bind(this.subscribe, this);
	    this.current = None;
	    this.currentValueRootId = undefined;
	    this.propertyEnded = false;
	  }

	  inherit(PropertyDispatcher, Dispatcher);
	  extend(PropertyDispatcher.prototype, {
	    push: function push(event) {
	      if (event.isEnd()) {
	        this.propertyEnded = true;
	      }
	      if (event.hasValue()) {
	        this.current = new Some(event);
	        this.currentValueRootId = UpdateBarrier.currentEventId();
	      }
	      return Dispatcher.prototype.push.call(this, event);
	    },

	    maybeSubSource: function maybeSubSource(sink, reply) {
	      if (reply === Bacon.noMore) {
	        return nop;
	      } else if (this.propertyEnded) {
	        sink(endEvent());
	        return nop;
	      } else {
	        return Dispatcher.prototype.subscribe.call(this, sink);
	      }
	    },

	    subscribe: function subscribe(sink) {
	      var _this3 = this;

	      var initSent = false;

	      var reply = Bacon.more;

	      if (this.current.isDefined && (this.hasSubscribers() || this.propertyEnded)) {
	        var dispatchingId = UpdateBarrier.currentEventId();
	        var valId = this.currentValueRootId;
	        if (!this.propertyEnded && valId && dispatchingId && dispatchingId !== valId) {
	          UpdateBarrier.whenDoneWith(this.property, function () {
	            if (_this3.currentValueRootId === valId) {
	              return sink(initialEvent(_this3.current.get().value()));
	            }
	          });

	          return this.maybeSubSource(sink, reply);
	        } else {
	          UpdateBarrier.inTransaction(undefined, this, function () {
	            reply = sink(initialEvent(this.current.get().value()));
	            return reply;
	          }, []);
	          return this.maybeSubSource(sink, reply);
	        }
	      } else {
	        return this.maybeSubSource(sink, reply);
	      }
	    }
	  });

	  function Property(desc, subscribe, handler) {
	    Observable.call(this, desc);
	    assertFunction(subscribe);
	    this.dispatcher = new PropertyDispatcher(this, subscribe, handler);
	    registerObs(this);
	  }

	  inherit(Property, Observable);
	  extend(Property.prototype, {
	    _isProperty: true,

	    changes: function changes() {
	      var _this4 = this;

	      return new EventStream(new Bacon.Desc(this, "changes", []), function (sink) {
	        return _this4.dispatcher.subscribe(function (event) {
	          if (!event.isInitial()) {
	            return sink(event);
	          }
	        });
	      });
	    },

	    withHandler: function withHandler(handler) {
	      return new Property(new Bacon.Desc(this, "withHandler", [handler]), this.dispatcher.subscribe, handler);
	    },

	    toProperty: function toProperty() {
	      assertNoArguments(arguments);
	      return this;
	    },

	    toEventStream: function toEventStream() {
	      var _this5 = this;

	      return new EventStream(new Bacon.Desc(this, "toEventStream", []), function (sink) {
	        return _this5.dispatcher.subscribe(function (event) {
	          if (event.isInitial()) {
	            event = event.toNext();
	          }
	          return sink(event);
	        });
	      });
	    }
	  });

	  Bacon.Property = Property;

	  Bacon.constant = function (value) {
	    return new Property(new Bacon.Desc(Bacon, "constant", [value]), function (sink) {
	      sink(initialEvent(value));
	      sink(endEvent());
	      return nop;
	    });
	  };

	  Bacon.fromBinder = function (binder) {
	    var eventTransformer = arguments.length <= 1 || arguments[1] === undefined ? _.id : arguments[1];

	    var desc = new Bacon.Desc(Bacon, "fromBinder", [binder, eventTransformer]);
	    return new EventStream(desc, function (sink) {
	      var unbound = false;
	      var shouldUnbind = false;
	      var unbind = function unbind() {
	        if (!unbound) {
	          if (typeof unbinder !== "undefined" && unbinder !== null) {
	            unbinder();
	            return unbound = true;
	          } else {
	            return shouldUnbind = true;
	          }
	        }
	      };
	      var unbinder = binder(function () {
	        var ref;

	        for (var _len7 = arguments.length, args = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
	          args[_key7] = arguments[_key7];
	        }

	        var value = eventTransformer.apply(this, args);
	        if (!(isArray(value) && ((ref = _.last(value)) != null ? ref._isEvent : undefined))) {
	          value = [value];
	        }
	        var reply = Bacon.more;
	        for (var i = 0, event; i < value.length; i++) {
	          event = value[i];
	          reply = sink(event = toEvent(event));
	          if (reply === Bacon.noMore || event.isEnd()) {
	            unbind();
	            return reply;
	          }
	        }
	        return reply;
	      });
	      if (shouldUnbind) {
	        unbind();
	      }
	      return unbind;
	    });
	  };

	  Bacon.Observable.prototype.map = function (p) {
	    for (var _len8 = arguments.length, args = Array(_len8 > 1 ? _len8 - 1 : 0), _key8 = 1; _key8 < _len8; _key8++) {
	      args[_key8 - 1] = arguments[_key8];
	    }

	    return convertArgsToFunction(this, p, args, function (f) {
	      return withDesc(new Bacon.Desc(this, "map", [f]), this.withHandler(function (event) {
	        return this.push(event.fmap(f));
	      }));
	    });
	  };

	  var argumentsToObservables = function argumentsToObservables(args) {
	    if (isArray(args[0])) {
	      return args[0];
	    } else {
	      return Array.prototype.slice.call(args);
	    }
	  };

	  var argumentsToObservablesAndFunction = function argumentsToObservablesAndFunction(args) {
	    if (_.isFunction(args[0])) {
	      return [argumentsToObservables(Array.prototype.slice.call(args, 1)), args[0]];
	    } else {
	      return [argumentsToObservables(Array.prototype.slice.call(args, 0, args.length - 1)), _.last(args)];
	    }
	  };

	  Bacon.combineAsArray = function () {
	    var streams = argumentsToObservables(arguments);
	    for (var index = 0, stream; index < streams.length; index++) {
	      stream = streams[index];
	      if (!isObservable(stream)) {
	        streams[index] = Bacon.constant(stream);
	      }
	    }
	    if (streams.length) {
	      var sources = function () {
	        var result = [];
	        for (var i = 0, s; i < streams.length; i++) {
	          s = streams[i];
	          result.push(new Source(s, true));
	        }
	        return result;
	      }();
	      return withDesc(new Bacon.Desc(Bacon, "combineAsArray", streams), Bacon.when(sources, function () {
	        for (var _len9 = arguments.length, xs = Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
	          xs[_key9] = arguments[_key9];
	        }

	        return xs;
	      }).toProperty());
	    } else {
	      return Bacon.constant([]);
	    }
	  };

	  Bacon.onValues = function () {
	    for (var _len10 = arguments.length, streams = Array(_len10), _key10 = 0; _key10 < _len10; _key10++) {
	      streams[_key10] = arguments[_key10];
	    }

	    return Bacon.combineAsArray(streams.slice(0, streams.length - 1)).onValues(streams[streams.length - 1]);
	  };

	  Bacon.combineWith = function () {
	    var _argumentsToObservablesAndFunction = argumentsToObservablesAndFunction(arguments);

	    var streams = _argumentsToObservablesAndFunction[0];
	    var f = _argumentsToObservablesAndFunction[1];

	    var desc = new Bacon.Desc(Bacon, "combineWith", [f].concat(streams));
	    return withDesc(desc, Bacon.combineAsArray(streams).map(function (values) {
	      return f.apply(undefined, values);
	    }));
	  };

	  Bacon.Observable.prototype.combine = function (other, f) {
	    var combinator = toCombinator(f);
	    var desc = new Bacon.Desc(this, "combine", [other, f]);
	    return withDesc(desc, Bacon.combineAsArray(this, other).map(function (values) {
	      return combinator(values[0], values[1]);
	    }));
	  };

	  Bacon.Observable.prototype.withStateMachine = function (initState, f) {
	    var state = initState;
	    var desc = new Bacon.Desc(this, "withStateMachine", [initState, f]);
	    return withDesc(desc, this.withHandler(function (event) {
	      var fromF = f(state, event);
	      var newState = fromF[0];
	      var outputs = fromF[1];

	      state = newState;
	      var reply = Bacon.more;
	      for (var i = 0, output; i < outputs.length; i++) {
	        output = outputs[i];
	        reply = this.push(output);
	        if (reply === Bacon.noMore) {
	          return reply;
	        }
	      }
	      return reply;
	    }));
	  };

	  var equals = function equals(a, b) {
	    return a === b;
	  };

	  var isNone = function isNone(object) {
	    return typeof object !== "undefined" && object !== null ? object._isNone : false;
	  };

	  Bacon.Observable.prototype.skipDuplicates = function () {
	    var isEqual = arguments.length <= 0 || arguments[0] === undefined ? equals : arguments[0];

	    var desc = new Bacon.Desc(this, "skipDuplicates", []);
	    return withDesc(desc, this.withStateMachine(None, function (prev, event) {
	      if (!event.hasValue()) {
	        return [prev, [event]];
	      } else if (event.isInitial() || isNone(prev) || !isEqual(prev.get(), event.value())) {
	        return [new Some(event.value()), [event]];
	      } else {
	        return [prev, []];
	      }
	    }));
	  };

	  Bacon.Observable.prototype.awaiting = function (other) {
	    var desc = new Bacon.Desc(this, "awaiting", [other]);
	    return withDesc(desc, Bacon.groupSimultaneous(this, other).map(function (values) {
	      return values[1].length === 0;
	    }).toProperty(false).skipDuplicates());
	  };

	  Bacon.Observable.prototype.not = function () {
	    return withDesc(new Bacon.Desc(this, "not", []), this.map(function (x) {
	      return !x;
	    }));
	  };

	  Bacon.Property.prototype.and = function (other) {
	    return withDesc(new Bacon.Desc(this, "and", [other]), this.combine(other, function (x, y) {
	      return x && y;
	    }));
	  };

	  Bacon.Property.prototype.or = function (other) {
	    return withDesc(new Bacon.Desc(this, "or", [other]), this.combine(other, function (x, y) {
	      return x || y;
	    }));
	  };

	  Bacon.scheduler = {
	    setTimeout: function (_setTimeout) {
	      function setTimeout(_x, _x2) {
	        return _setTimeout.apply(this, arguments);
	      }

	      setTimeout.toString = function () {
	        return _setTimeout.toString();
	      };

	      return setTimeout;
	    }(function (f, d) {
	      return setTimeout(f, d);
	    }),
	    setInterval: function (_setInterval) {
	      function setInterval(_x3, _x4) {
	        return _setInterval.apply(this, arguments);
	      }

	      setInterval.toString = function () {
	        return _setInterval.toString();
	      };

	      return setInterval;
	    }(function (f, i) {
	      return setInterval(f, i);
	    }),
	    clearInterval: function (_clearInterval) {
	      function clearInterval(_x5) {
	        return _clearInterval.apply(this, arguments);
	      }

	      clearInterval.toString = function () {
	        return _clearInterval.toString();
	      };

	      return clearInterval;
	    }(function (id) {
	      return clearInterval(id);
	    }),
	    clearTimeout: function (_clearTimeout) {
	      function clearTimeout(_x6) {
	        return _clearTimeout.apply(this, arguments);
	      }

	      clearTimeout.toString = function () {
	        return _clearTimeout.toString();
	      };

	      return clearTimeout;
	    }(function (id) {
	      return clearTimeout(id);
	    }),
	    now: function now() {
	      return new Date().getTime();
	    }
	  };

	  Bacon.EventStream.prototype.bufferWithTime = function (delay) {
	    return withDesc(new Bacon.Desc(this, "bufferWithTime", [delay]), this.bufferWithTimeOrCount(delay, Number.MAX_VALUE));
	  };

	  Bacon.EventStream.prototype.bufferWithCount = function (count) {
	    return withDesc(new Bacon.Desc(this, "bufferWithCount", [count]), this.bufferWithTimeOrCount(undefined, count));
	  };

	  Bacon.EventStream.prototype.bufferWithTimeOrCount = function (delay, count) {
	    var flushOrSchedule = function flushOrSchedule(buffer) {
	      if (buffer.values.length === count) {
	        return buffer.flush();
	      } else if (delay !== undefined) {
	        return buffer.schedule();
	      }
	    };
	    var desc = new Bacon.Desc(this, "bufferWithTimeOrCount", [delay, count]);
	    return withDesc(desc, this.buffer(delay, flushOrSchedule, flushOrSchedule));
	  };

	  Bacon.EventStream.prototype.buffer = function (delay) {
	    var onInput = arguments.length <= 1 || arguments[1] === undefined ? nop : arguments[1];
	    var onFlush = arguments.length <= 2 || arguments[2] === undefined ? nop : arguments[2];

	    var buffer = {
	      scheduled: null,
	      end: undefined,
	      values: [],
	      flush: function flush() {
	        if (this.scheduled) {
	          Bacon.scheduler.clearTimeout(this.scheduled);
	          this.scheduled = null;
	        }
	        if (this.values.length > 0) {
	          var valuesToPush = this.values;
	          this.values = [];
	          var reply = this.push(nextEvent(valuesToPush));
	          if (this.end != null) {
	            return this.push(this.end);
	          } else if (reply !== Bacon.noMore) {
	            return onFlush(this);
	          }
	        } else {
	          if (this.end != null) {
	            return this.push(this.end);
	          }
	        }
	      },
	      schedule: function schedule() {
	        var _this6 = this;

	        if (!this.scheduled) {
	          return this.scheduled = delay(function () {
	            return _this6.flush();
	          });
	        }
	      }
	    };
	    var reply = Bacon.more;
	    if (!_.isFunction(delay)) {
	      var delayMs = delay;
	      delay = function delay(f) {
	        return Bacon.scheduler.setTimeout(f, delayMs);
	      };
	    }
	    return withDesc(new Bacon.Desc(this, "buffer", []), this.withHandler(function (event) {
	      var _this7 = this;

	      buffer.push = function (event) {
	        return _this7.push(event);
	      };
	      if (event.isError()) {
	        reply = this.push(event);
	      } else if (event.isEnd()) {
	        buffer.end = event;
	        if (!buffer.scheduled) {
	          buffer.flush();
	        }
	      } else {
	        buffer.values.push(event.value());

	        onInput(buffer);
	      }
	      return reply;
	    }));
	  };

	  Bacon.Observable.prototype.filter = function (f) {
	    assertObservableIsProperty(f);

	    for (var _len11 = arguments.length, args = Array(_len11 > 1 ? _len11 - 1 : 0), _key11 = 1; _key11 < _len11; _key11++) {
	      args[_key11 - 1] = arguments[_key11];
	    }

	    return convertArgsToFunction(this, f, args, function (f) {
	      return withDesc(new Bacon.Desc(this, "filter", [f]), this.withHandler(function (event) {
	        if (event.filter(f)) {
	          return this.push(event);
	        } else {
	          return Bacon.more;
	        }
	      }));
	    });
	  };

	  Bacon.once = function (value) {
	    return new EventStream(new Desc(Bacon, "once", [value]), function (sink) {
	      sink(toEvent(value));
	      sink(endEvent());
	      return nop;
	    });
	  };

	  Bacon.EventStream.prototype.concat = function (right) {
	    var left = this;
	    return new EventStream(new Bacon.Desc(left, "concat", [right]), function (sink) {
	      var unsubRight = nop;
	      var unsubLeft = left.dispatcher.subscribe(function (e) {
	        if (e.isEnd()) {
	          unsubRight = right.dispatcher.subscribe(sink);
	          return unsubRight;
	        } else {
	          return sink(e);
	        }
	      });
	      return function () {
	        return unsubLeft(), unsubRight();
	      };
	    });
	  };

	  Bacon.Observable.prototype.flatMap = function () {
	    return flatMap_(this, makeSpawner(arguments));
	  };

	  Bacon.Observable.prototype.flatMapFirst = function () {
	    return flatMap_(this, makeSpawner(arguments), true);
	  };

	  var makeSpawner = function makeSpawner(args) {
	    if (args.length === 1 && isObservable(args[0])) {
	      return _.always(args[0]);
	    } else {
	      return makeFunctionArgs(args);
	    }
	  };

	  var makeObservable = function makeObservable(x) {
	    if (isObservable(x)) {
	      return x;
	    } else {
	      return Bacon.once(x);
	    }
	  };

	  var flatMap_ = function flatMap_(root, f, firstOnly, limit) {
	    var rootDep = [root];
	    var childDeps = [];
	    var desc = new Bacon.Desc(root, "flatMap" + (firstOnly ? "First" : ""), [f]);
	    var result = new EventStream(desc, function (sink) {
	      var composite = new CompositeUnsubscribe();
	      var queue = [];
	      var spawn = function spawn(event) {
	        var child = makeObservable(f(event.value()));
	        childDeps.push(child);
	        return composite.add(function (unsubAll, unsubMe) {
	          return child.dispatcher.subscribe(function (event) {
	            if (event.isEnd()) {
	              _.remove(child, childDeps);
	              checkQueue();
	              checkEnd(unsubMe);
	              return Bacon.noMore;
	            } else {
	              if (typeof event !== "undefined" && event !== null ? event._isInitial : undefined) {
	                event = event.toNext();
	              }
	              var reply = sink(event);
	              if (reply === Bacon.noMore) {
	                unsubAll();
	              }
	              return reply;
	            }
	          });
	        });
	      };
	      var checkQueue = function checkQueue() {
	        var event = queue.shift();
	        if (event) {
	          return spawn(event);
	        }
	      };
	      var checkEnd = function checkEnd(unsub) {
	        unsub();
	        if (composite.empty()) {
	          return sink(endEvent());
	        }
	      };
	      composite.add(function (__, unsubRoot) {
	        return root.dispatcher.subscribe(function (event) {
	          if (event.isEnd()) {
	            return checkEnd(unsubRoot);
	          } else if (event.isError()) {
	            return sink(event);
	          } else if (firstOnly && composite.count() > 1) {
	            return Bacon.more;
	          } else {
	            if (composite.unsubscribed) {
	              return Bacon.noMore;
	            }
	            if (limit && composite.count() > limit) {
	              return queue.push(event);
	            } else {
	              return spawn(event);
	            }
	          }
	        });
	      });
	      return composite.unsubscribe;
	    });
	    result.internalDeps = function () {
	      if (childDeps.length) {
	        return rootDep.concat(childDeps);
	      } else {
	        return rootDep;
	      }
	    };
	    return result;
	  };

	  Bacon.Observable.prototype.flatMapWithConcurrencyLimit = function (limit) {
	    for (var _len12 = arguments.length, args = Array(_len12 > 1 ? _len12 - 1 : 0), _key12 = 1; _key12 < _len12; _key12++) {
	      args[_key12 - 1] = arguments[_key12];
	    }

	    var desc = new Bacon.Desc(this, "flatMapWithConcurrencyLimit", [limit].concat(args));
	    return withDesc(desc, flatMap_(this, makeSpawner(args), false, limit));
	  };

	  Bacon.Observable.prototype.flatMapConcat = function () {
	    var desc = new Bacon.Desc(this, "flatMapConcat", Array.prototype.slice.call(arguments, 0));
	    return withDesc(desc, this.flatMapWithConcurrencyLimit.apply(this, [1].concat(_slice.call(arguments))));
	  };

	  Bacon.later = function (delay, value) {
	    return withDesc(new Bacon.Desc(Bacon, "later", [delay, value]), Bacon.fromBinder(function (sink) {
	      var sender = function sender() {
	        return sink([value, endEvent()]);
	      };
	      var id = Bacon.scheduler.setTimeout(sender, delay);
	      return function () {
	        return Bacon.scheduler.clearTimeout(id);
	      };
	    }));
	  };

	  Bacon.Observable.prototype.bufferingThrottle = function (minimumInterval) {
	    var desc = new Bacon.Desc(this, "bufferingThrottle", [minimumInterval]);
	    return withDesc(desc, this.flatMapConcat(function (x) {
	      return Bacon.once(x).concat(Bacon.later(minimumInterval).filter(false));
	    }));
	  };

	  Bacon.Property.prototype.bufferingThrottle = function () {
	    return Bacon.Observable.prototype.bufferingThrottle.apply(this, arguments).toProperty();
	  };

	  function Bus() {
	    if (!(this instanceof Bus)) {
	      return new Bus();
	    }

	    this.unsubAll = _.bind(this.unsubAll, this);
	    this.subscribeAll = _.bind(this.subscribeAll, this);
	    this.guardedSink = _.bind(this.guardedSink, this);

	    this.sink = undefined;
	    this.subscriptions = [];
	    this.ended = false;
	    EventStream.call(this, new Bacon.Desc(Bacon, "Bus", []), this.subscribeAll);
	  }

	  inherit(Bus, EventStream);
	  extend(Bus.prototype, {
	    unsubAll: function unsubAll() {
	      var iterable = this.subscriptions;
	      for (var i = 0, sub; i < iterable.length; i++) {
	        sub = iterable[i];
	        if (typeof sub.unsub === "function") {
	          sub.unsub();
	        }
	      }
	    },

	    subscribeAll: function subscribeAll(newSink) {
	      if (this.ended) {
	        newSink(endEvent());
	      } else {
	        this.sink = newSink;
	        var iterable = cloneArray(this.subscriptions);
	        for (var i = 0, subscription; i < iterable.length; i++) {
	          subscription = iterable[i];
	          this.subscribeInput(subscription);
	        }
	      }
	      return this.unsubAll;
	    },

	    guardedSink: function guardedSink(input) {
	      var _this8 = this;

	      return function (event) {
	        if (event.isEnd()) {
	          _this8.unsubscribeInput(input);
	          return Bacon.noMore;
	        } else {
	          return _this8.sink(event);
	        }
	      };
	    },

	    subscribeInput: function subscribeInput(subscription) {
	      subscription.unsub = subscription.input.dispatcher.subscribe(this.guardedSink(subscription.input));
	      return subscription.unsub;
	    },

	    unsubscribeInput: function unsubscribeInput(input) {
	      var iterable = this.subscriptions;
	      for (var i = 0, sub; i < iterable.length; i++) {
	        sub = iterable[i];
	        if (sub.input === input) {
	          if (typeof sub.unsub === "function") {
	            sub.unsub();
	          }
	          this.subscriptions.splice(i, 1);
	          return;
	        }
	      }
	    },

	    plug: function plug(input) {
	      var _this9 = this;

	      assertObservable(input);
	      if (this.ended) {
	        return;
	      }
	      var sub = { input: input };
	      this.subscriptions.push(sub);
	      if (typeof this.sink !== "undefined") {
	        this.subscribeInput(sub);
	      }
	      return function () {
	        return _this9.unsubscribeInput(input);
	      };
	    },

	    end: function end() {
	      this.ended = true;
	      this.unsubAll();
	      if (typeof this.sink === "function") {
	        return this.sink(endEvent());
	      }
	    },

	    push: function push(value) {
	      if (!this.ended && typeof this.sink === "function") {
	        return this.sink(nextEvent(value));
	      }
	    },

	    error: function error(_error) {
	      if (typeof this.sink === "function") {
	        return this.sink(new Error(_error));
	      }
	    }
	  });

	  Bacon.Bus = Bus;

	  var liftCallback = function liftCallback(desc, wrapped) {
	    return withMethodCallSupport(function (f) {
	      var stream = partiallyApplied(wrapped, [function (values, callback) {
	        return f.apply(undefined, values.concat([callback]));
	      }]);

	      for (var _len13 = arguments.length, args = Array(_len13 > 1 ? _len13 - 1 : 0), _key13 = 1; _key13 < _len13; _key13++) {
	        args[_key13 - 1] = arguments[_key13];
	      }

	      return withDesc(new Bacon.Desc(Bacon, desc, [f].concat(args)), Bacon.combineAsArray(args).flatMap(stream));
	    });
	  };

	  Bacon.fromCallback = liftCallback("fromCallback", function (f) {
	    for (var _len14 = arguments.length, args = Array(_len14 > 1 ? _len14 - 1 : 0), _key14 = 1; _key14 < _len14; _key14++) {
	      args[_key14 - 1] = arguments[_key14];
	    }

	    return Bacon.fromBinder(function (handler) {
	      makeFunction(f, args)(handler);
	      return nop;
	    }, function (value) {
	      return [value, endEvent()];
	    });
	  });

	  Bacon.fromNodeCallback = liftCallback("fromNodeCallback", function (f) {
	    for (var _len15 = arguments.length, args = Array(_len15 > 1 ? _len15 - 1 : 0), _key15 = 1; _key15 < _len15; _key15++) {
	      args[_key15 - 1] = arguments[_key15];
	    }

	    return Bacon.fromBinder(function (handler) {
	      makeFunction(f, args)(handler);
	      return nop;
	    }, function (error, value) {
	      if (error) {
	        return [new Error(error), endEvent()];
	      }
	      return [value, endEvent()];
	    });
	  });

	  Bacon.combineTemplate = function (template) {
	    function current(ctxStack) {
	      return ctxStack[ctxStack.length - 1];
	    }
	    function setValue(ctxStack, key, value) {
	      current(ctxStack)[key] = value;
	      return value;
	    }
	    function applyStreamValue(key, index) {
	      return function (ctxStack, values) {
	        return setValue(ctxStack, key, values[index]);
	      };
	    }
	    function constantValue(key, value) {
	      return function (ctxStack) {
	        return setValue(ctxStack, key, value);
	      };
	    }

	    function mkContext(template) {
	      return isArray(template) ? [] : {};
	    }

	    function pushContext(key, value) {
	      return function (ctxStack) {
	        var newContext = mkContext(value);
	        setValue(ctxStack, key, newContext);
	        return ctxStack.push(newContext);
	      };
	    }

	    function compile(key, value) {
	      if (isObservable(value)) {
	        streams.push(value);
	        return funcs.push(applyStreamValue(key, streams.length - 1));
	      } else if (value && (value.constructor == Object || value.constructor == Array)) {
	        var popContext = function popContext(ctxStack) {
	          return ctxStack.pop();
	        };
	        funcs.push(pushContext(key, value));
	        compileTemplate(value);
	        return funcs.push(popContext);
	      } else {
	        return funcs.push(constantValue(key, value));
	      }
	    }

	    function combinator(values) {
	      var rootContext = mkContext(template);
	      var ctxStack = [rootContext];
	      for (var i = 0, f; i < funcs.length; i++) {
	        f = funcs[i];
	        f(ctxStack, values);
	      }
	      return rootContext;
	    }

	    function compileTemplate(template) {
	      return _.each(template, compile);
	    }

	    var funcs = [];
	    var streams = [];

	    compileTemplate(template);

	    return withDesc(new Bacon.Desc(Bacon, "combineTemplate", [template]), Bacon.combineAsArray(streams).map(combinator));
	  };

	  var addPropertyInitValueToStream = function addPropertyInitValueToStream(property, stream) {
	    var justInitValue = new EventStream(describe(property, "justInitValue"), function (sink) {
	      var value = undefined;
	      var unsub = property.dispatcher.subscribe(function (event) {
	        if (!event.isEnd()) {
	          value = event;
	        }
	        return Bacon.noMore;
	      });
	      UpdateBarrier.whenDoneWith(justInitValue, function () {
	        if (typeof value !== "undefined" && value !== null) {
	          sink(value);
	        }
	        return sink(endEvent());
	      });
	      return unsub;
	    });
	    return justInitValue.concat(stream).toProperty();
	  };

	  Bacon.Observable.prototype.mapEnd = function () {
	    var f = makeFunctionArgs(arguments);
	    return withDesc(new Bacon.Desc(this, "mapEnd", [f]), this.withHandler(function (event) {
	      if (event.isEnd()) {
	        this.push(nextEvent(f(event)));
	        this.push(endEvent());
	        return Bacon.noMore;
	      } else {
	        return this.push(event);
	      }
	    }));
	  };

	  Bacon.Observable.prototype.skipErrors = function () {
	    return withDesc(new Bacon.Desc(this, "skipErrors", []), this.withHandler(function (event) {
	      if (event.isError()) {
	        return Bacon.more;
	      } else {
	        return this.push(event);
	      }
	    }));
	  };

	  Bacon.EventStream.prototype.takeUntil = function (stopper) {
	    var endMarker = {};
	    return withDesc(new Bacon.Desc(this, "takeUntil", [stopper]), Bacon.groupSimultaneous(this.mapEnd(endMarker), stopper.skipErrors()).withHandler(function (event) {
	      if (!event.hasValue()) {
	        return this.push(event);
	      } else {
	        var _event$value = event.value();

	        var data = _event$value[0];
	        var stopper = _event$value[1];

	        if (stopper.length) {
	          return this.push(endEvent());
	        } else {
	          var reply = Bacon.more;
	          for (var i = 0, value; i < data.length; i++) {
	            value = data[i];
	            if (value === endMarker) {
	              reply = this.push(endEvent());
	            } else {
	              reply = this.push(nextEvent(value));
	            }
	          }
	          return reply;
	        }
	      }
	    }));
	  };

	  Bacon.Property.prototype.takeUntil = function (stopper) {
	    var changes = this.changes().takeUntil(stopper);
	    return withDesc(new Bacon.Desc(this, "takeUntil", [stopper]), addPropertyInitValueToStream(this, changes));
	  };

	  Bacon.Observable.prototype.flatMapLatest = function () {
	    var f = makeSpawner(arguments);
	    var stream = this.toEventStream();
	    return withDesc(new Bacon.Desc(this, "flatMapLatest", [f]), stream.flatMap(function (value) {
	      return makeObservable(f(value)).takeUntil(stream);
	    }));
	  };

	  Bacon.Property.prototype.delayChanges = function (desc, f) {
	    return withDesc(desc, addPropertyInitValueToStream(this, f(this.changes())));
	  };

	  Bacon.EventStream.prototype.delay = function (delay) {
	    return withDesc(new Bacon.Desc(this, "delay", [delay]), this.flatMap(function (value) {
	      return Bacon.later(delay, value);
	    }));
	  };

	  Bacon.Property.prototype.delay = function (delay) {
	    return this.delayChanges(new Bacon.Desc(this, "delay", [delay]), function (changes) {
	      return changes.delay(delay);
	    });
	  };

	  Bacon.EventStream.prototype.debounce = function (delay) {
	    return withDesc(new Bacon.Desc(this, "debounce", [delay]), this.flatMapLatest(function (value) {
	      return Bacon.later(delay, value);
	    }));
	  };

	  Bacon.Property.prototype.debounce = function (delay) {
	    return this.delayChanges(new Bacon.Desc(this, "debounce", [delay]), function (changes) {
	      return changes.debounce(delay);
	    });
	  };

	  Bacon.EventStream.prototype.debounceImmediate = function (delay) {
	    return withDesc(new Bacon.Desc(this, "debounceImmediate", [delay]), this.flatMapFirst(function (value) {
	      return Bacon.once(value).concat(Bacon.later(delay).filter(false));
	    }));
	  };

	  Bacon.Observable.prototype.decode = function (cases) {
	    return withDesc(new Bacon.Desc(this, "decode", [cases]), this.combine(Bacon.combineTemplate(cases), function (key, values) {
	      return values[key];
	    }));
	  };

	  Bacon.Observable.prototype.scan = function (seed, f) {
	    var _this10 = this;

	    var resultProperty;
	    f = toCombinator(f);
	    var acc = toOption(seed);
	    var initHandled = false;
	    var subscribe = function subscribe(sink) {
	      var initSent = false;
	      var unsub = nop;
	      var reply = Bacon.more;
	      var sendInit = function sendInit() {
	        if (!initSent) {
	          return acc.forEach(function (value) {
	            initSent = initHandled = true;
	            reply = sink(new Initial(function () {
	              return value;
	            }));
	            if (reply === Bacon.noMore) {
	              unsub();
	              unsub = nop;
	              return unsub;
	            }
	          });
	        }
	      };
	      unsub = _this10.dispatcher.subscribe(function (event) {
	        if (event.hasValue()) {
	          if (initHandled && event.isInitial()) {
	            return Bacon.more;
	          } else {
	            if (!event.isInitial()) {
	              sendInit();
	            }
	            initSent = initHandled = true;
	            var prev = acc.getOrElse(undefined);
	            var next = f(prev, event.value());

	            acc = new Some(next);
	            return sink(event.apply(function () {
	              return next;
	            }));
	          }
	        } else {
	          if (event.isEnd()) {
	            reply = sendInit();
	          }
	          if (reply !== Bacon.noMore) {
	            return sink(event);
	          }
	        }
	      });
	      UpdateBarrier.whenDoneWith(resultProperty, sendInit);
	      return unsub;
	    };
	    resultProperty = new Property(new Bacon.Desc(this, "scan", [seed, f]), subscribe);
	    return resultProperty;
	  };

	  Bacon.Observable.prototype.diff = function (start, f) {
	    f = toCombinator(f);
	    return withDesc(new Bacon.Desc(this, "diff", [start, f]), this.scan([start], function (prevTuple, next) {
	      return [next, f(prevTuple[0], next)];
	    }).filter(function (tuple) {
	      return tuple.length === 2;
	    }).map(function (tuple) {
	      return tuple[1];
	    }));
	  };

	  Bacon.Observable.prototype.doAction = function () {
	    var f = makeFunctionArgs(arguments);
	    return withDesc(new Bacon.Desc(this, "doAction", [f]), this.withHandler(function (event) {
	      if (event.hasValue()) {
	        f(event.value());
	      }
	      return this.push(event);
	    }));
	  };

	  Bacon.Observable.prototype.doEnd = function () {
	    var f = makeFunctionArgs(arguments);
	    return withDesc(new Bacon.Desc(this, "doEnd", [f]), this.withHandler(function (event) {
	      if (event.isEnd()) {
	        f();
	      }
	      return this.push(event);
	    }));
	  };

	  Bacon.Observable.prototype.doError = function () {
	    var f = makeFunctionArgs(arguments);
	    return withDesc(new Bacon.Desc(this, "doError", [f]), this.withHandler(function (event) {
	      if (event.isError()) {
	        f(event.error);
	      }
	      return this.push(event);
	    }));
	  };

	  Bacon.Observable.prototype.doLog = function () {
	    for (var _len16 = arguments.length, args = Array(_len16), _key16 = 0; _key16 < _len16; _key16++) {
	      args[_key16] = arguments[_key16];
	    }

	    return withDesc(new Bacon.Desc(this, "doLog", args), this.withHandler(function (event) {
	      if (typeof console !== "undefined" && console !== null && typeof console.log === "function") {
	        console.log.apply(console, args.concat([event.log()]));
	      }
	      return this.push(event);
	    }));
	  };

	  Bacon.Observable.prototype.endOnError = function (f) {
	    if (!(typeof f !== "undefined" && f !== null)) {
	      f = true;
	    }

	    for (var _len17 = arguments.length, args = Array(_len17 > 1 ? _len17 - 1 : 0), _key17 = 1; _key17 < _len17; _key17++) {
	      args[_key17 - 1] = arguments[_key17];
	    }

	    return convertArgsToFunction(this, f, args, function (f) {
	      return withDesc(new Bacon.Desc(this, "endOnError", []), this.withHandler(function (event) {
	        if (event.isError() && f(event.error)) {
	          this.push(event);
	          return this.push(endEvent());
	        } else {
	          return this.push(event);
	        }
	      }));
	    });
	  };

	  Observable.prototype.errors = function () {
	    return withDesc(new Bacon.Desc(this, "errors", []), this.filter(function () {
	      return false;
	    }));
	  };

	  Bacon.Observable.prototype.take = function (count) {
	    if (count <= 0) {
	      return Bacon.never();
	    }
	    return withDesc(new Bacon.Desc(this, "take", [count]), this.withHandler(function (event) {
	      if (!event.hasValue()) {
	        return this.push(event);
	      } else {
	        count--;
	        if (count > 0) {
	          return this.push(event);
	        } else {
	          if (count === 0) {
	            this.push(event);
	          }
	          this.push(endEvent());
	          return Bacon.noMore;
	        }
	      }
	    }));
	  };

	  Bacon.Observable.prototype.first = function () {
	    return withDesc(new Bacon.Desc(this, "first", []), this.take(1));
	  };

	  Bacon.Observable.prototype.mapError = function () {
	    var f = makeFunctionArgs(arguments);
	    return withDesc(new Bacon.Desc(this, "mapError", [f]), this.withHandler(function (event) {
	      if (event.isError()) {
	        return this.push(nextEvent(f(event.error)));
	      } else {
	        return this.push(event);
	      }
	    }));
	  };

	  Bacon.Observable.prototype.flatMapError = function (fn) {
	    var desc = new Bacon.Desc(this, "flatMapError", [fn]);
	    return withDesc(desc, this.mapError(function (err) {
	      return new Error(err);
	    }).flatMap(function (x) {
	      if (x instanceof Error) {
	        return fn(x.error);
	      } else {
	        return Bacon.once(x);
	      }
	    }));
	  };

	  Bacon.EventStream.prototype.sampledBy = function (sampler, combinator) {
	    return withDesc(new Bacon.Desc(this, "sampledBy", [sampler, combinator]), this.toProperty().sampledBy(sampler, combinator));
	  };

	  Bacon.Property.prototype.sampledBy = function (sampler, combinator) {
	    var lazy = false;
	    if (typeof combinator !== "undefined" && combinator !== null) {
	      combinator = toCombinator(combinator);
	    } else {
	      lazy = true;
	      combinator = function combinator(f) {
	        return f.value();
	      };
	    }
	    var thisSource = new Source(this, false, lazy);
	    var samplerSource = new Source(sampler, true, lazy);
	    var stream = Bacon.when([thisSource, samplerSource], combinator);
	    var result = sampler._isProperty ? stream.toProperty() : stream;
	    return withDesc(new Bacon.Desc(this, "sampledBy", [sampler, combinator]), result);
	  };

	  Bacon.Property.prototype.sample = function (interval) {
	    return withDesc(new Bacon.Desc(this, "sample", [interval]), this.sampledBy(Bacon.interval(interval, {})));
	  };

	  Bacon.Observable.prototype.map = function (p) {
	    if (p && p._isProperty) {
	      return p.sampledBy(this, former);
	    } else {
	      for (var _len18 = arguments.length, args = Array(_len18 > 1 ? _len18 - 1 : 0), _key18 = 1; _key18 < _len18; _key18++) {
	        args[_key18 - 1] = arguments[_key18];
	      }

	      return convertArgsToFunction(this, p, args, function (f) {
	        return withDesc(new Bacon.Desc(this, "map", [f]), this.withHandler(function (event) {
	          return this.push(event.fmap(f));
	        }));
	      });
	    }
	  };

	  Bacon.Observable.prototype.fold = function (seed, f) {
	    return withDesc(new Bacon.Desc(this, "fold", [seed, f]), this.scan(seed, f).sampledBy(this.filter(false).mapEnd().toProperty()));
	  };

	  Observable.prototype.reduce = Observable.prototype.fold;

	  var eventMethods = [["addEventListener", "removeEventListener"], ["addListener", "removeListener"], ["on", "off"], ["bind", "unbind"]];

	  var findHandlerMethods = function findHandlerMethods(target) {
	    var pair;
	    for (var i = 0; i < eventMethods.length; i++) {
	      pair = eventMethods[i];
	      var methodPair = [target[pair[0]], target[pair[1]]];
	      if (methodPair[0] && methodPair[1]) {
	        return methodPair;
	      }
	    }
	    for (var j = 0; j < eventMethods.length; j++) {
	      pair = eventMethods[j];
	      var addListener = target[pair[0]];
	      if (addListener) {
	        return [addListener, function () {}];
	      }
	    }
	    throw new Error("No suitable event methods in " + target);
	  };

	  Bacon.fromEventTarget = function (target, eventName, eventTransformer) {
	    var _findHandlerMethods = findHandlerMethods(target);

	    var sub = _findHandlerMethods[0];
	    var unsub = _findHandlerMethods[1];

	    var desc = new Bacon.Desc(Bacon, "fromEvent", [target, eventName]);
	    return withDesc(desc, Bacon.fromBinder(function (handler) {
	      sub.call(target, eventName, handler);
	      return function () {
	        return unsub.call(target, eventName, handler);
	      };
	    }, eventTransformer));
	  };

	  Bacon.fromEvent = Bacon.fromEventTarget;

	  Bacon.fromPoll = function (delay, poll) {
	    var desc = new Bacon.Desc(Bacon, "fromPoll", [delay, poll]);
	    return withDesc(desc, Bacon.fromBinder(function (handler) {
	      var id = Bacon.scheduler.setInterval(handler, delay);
	      return function () {
	        return Bacon.scheduler.clearInterval(id);
	      };
	    }, poll));
	  };

	  function valueAndEnd(value) {
	    return [value, endEvent()];
	  }

	  Bacon.fromPromise = function (promise, abort) {
	    var eventTransformer = arguments.length <= 2 || arguments[2] === undefined ? valueAndEnd : arguments[2];

	    return withDesc(new Bacon.Desc(Bacon, "fromPromise", [promise]), Bacon.fromBinder(function (handler) {
	      var bound = promise.then(handler, function (e) {
	        return handler(new Error(e));
	      });
	      if (bound && typeof bound.done === "function") {
	        bound.done();
	      }

	      if (abort) {
	        return function () {
	          if (typeof promise.abort === "function") {
	            return promise.abort();
	          }
	        };
	      } else {
	        return function () {};
	      }
	    }, eventTransformer));
	  };

	  Bacon.Observable.prototype.groupBy = function (keyF) {
	    var limitF = arguments.length <= 1 || arguments[1] === undefined ? Bacon._.id : arguments[1];

	    var streams = {};
	    var src = this;
	    return src.filter(function (x) {
	      return !streams[keyF(x)];
	    }).map(function (x) {
	      var key = keyF(x);
	      var similar = src.filter(function (x) {
	        return keyF(x) === key;
	      });
	      var data = Bacon.once(x).concat(similar);
	      var limited = limitF(data, x).withHandler(function (event) {
	        this.push(event);
	        if (event.isEnd()) {
	          return delete streams[key];
	        }
	      });
	      streams[key] = limited;
	      return limited;
	    });
	  };

	  Bacon.fromArray = function (values) {
	    assertArray(values);
	    if (!values.length) {
	      return withDesc(new Bacon.Desc(Bacon, "fromArray", values), Bacon.never());
	    } else {
	      var i = 0;
	      return new EventStream(new Bacon.Desc(Bacon, "fromArray", [values]), function (sink) {
	        var unsubd = false;
	        var reply = Bacon.more;
	        var pushing = false;
	        var pushNeeded = false;
	        var push = function push() {
	          pushNeeded = true;
	          if (pushing) {
	            return;
	          }
	          pushing = true;
	          while (pushNeeded) {
	            pushNeeded = false;
	            if (reply !== Bacon.noMore && !unsubd) {
	              var value = values[i++];
	              reply = sink(toEvent(value));
	              if (reply !== Bacon.noMore) {
	                if (i === values.length) {
	                  sink(endEvent());
	                } else {
	                  UpdateBarrier.afterTransaction(push);
	                }
	              }
	            }
	          }
	          pushing = false;
	          return pushing;
	        };

	        push();
	        return function () {
	          unsubd = true;
	          return unsubd;
	        };
	      });
	    }
	  };

	  Bacon.EventStream.prototype.holdWhen = function (valve) {
	    var onHold = false;
	    var bufferedValues = [];
	    var src = this;
	    return new EventStream(new Bacon.Desc(this, "holdWhen", [valve]), function (sink) {
	      var composite = new CompositeUnsubscribe();
	      var subscribed = false;
	      var endIfBothEnded = function endIfBothEnded(unsub) {
	        if (typeof unsub === "function") {
	          unsub();
	        }
	        if (composite.empty() && subscribed) {
	          return sink(endEvent());
	        }
	      };
	      composite.add(function (unsubAll, unsubMe) {
	        return valve.subscribeInternal(function (event) {
	          if (event.hasValue()) {
	            onHold = event.value();
	            if (!onHold) {
	              var toSend = bufferedValues;
	              bufferedValues = [];
	              return function () {
	                var result = [];
	                for (var i = 0, value; i < toSend.length; i++) {
	                  value = toSend[i];
	                  result.push(sink(nextEvent(value)));
	                }
	                return result;
	              }();
	            }
	          } else if (event.isEnd()) {
	            return endIfBothEnded(unsubMe);
	          } else {
	            return sink(event);
	          }
	        });
	      });
	      composite.add(function (unsubAll, unsubMe) {
	        return src.subscribeInternal(function (event) {
	          if (onHold && event.hasValue()) {
	            return bufferedValues.push(event.value());
	          } else if (event.isEnd() && bufferedValues.length) {
	            return endIfBothEnded(unsubMe);
	          } else {
	            return sink(event);
	          }
	        });
	      });
	      subscribed = true;
	      endIfBothEnded();
	      return composite.unsubscribe;
	    });
	  };

	  Bacon.interval = function (delay) {
	    var value = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	    return withDesc(new Bacon.Desc(Bacon, "interval", [delay, value]), Bacon.fromPoll(delay, function () {
	      return nextEvent(value);
	    }));
	  };

	  Bacon.$ = {};
	  Bacon.$.asEventStream = function (eventName, selector, eventTransformer) {
	    var _this11 = this;

	    if (_.isFunction(selector)) {
	      eventTransformer = selector;
	      selector = undefined;
	    }

	    return withDesc(new Bacon.Desc(this.selector || this, "asEventStream", [eventName]), Bacon.fromBinder(function (handler) {
	      _this11.on(eventName, selector, handler);
	      return function () {
	        return _this11.off(eventName, selector, handler);
	      };
	    }, eventTransformer));
	  };

	  if (typeof jQuery !== "undefined" && jQuery) {
	    jQuery.fn.asEventStream = Bacon.$.asEventStream;
	  }

	  if (typeof Zepto !== "undefined" && Zepto) {
	    Zepto.fn.asEventStream = Bacon.$.asEventStream;
	  }

	  Bacon.Observable.prototype.last = function () {
	    var lastEvent;

	    return withDesc(new Bacon.Desc(this, "last", []), this.withHandler(function (event) {
	      if (event.isEnd()) {
	        if (lastEvent) {
	          this.push(lastEvent);
	        }
	        this.push(endEvent());
	        return Bacon.noMore;
	      } else {
	        lastEvent = event;
	      }
	    }));
	  };

	  Bacon.Observable.prototype.log = function () {
	    for (var _len19 = arguments.length, args = Array(_len19), _key19 = 0; _key19 < _len19; _key19++) {
	      args[_key19] = arguments[_key19];
	    }

	    this.subscribe(function (event) {
	      if (typeof console !== "undefined" && typeof console.log === "function") {
	        console.log.apply(console, args.concat([event.log()]));
	      }
	    });
	    return this;
	  };

	  Bacon.EventStream.prototype.merge = function (right) {
	    assertEventStream(right);
	    var left = this;
	    return withDesc(new Bacon.Desc(left, "merge", [right]), Bacon.mergeAll(this, right));
	  };

	  Bacon.mergeAll = function () {
	    var streams = argumentsToObservables(arguments);
	    if (streams.length) {
	      return new EventStream(new Bacon.Desc(Bacon, "mergeAll", streams), function (sink) {
	        var ends = 0;
	        var smartSink = function smartSink(obs) {
	          return function (unsubBoth) {
	            return obs.dispatcher.subscribe(function (event) {
	              if (event.isEnd()) {
	                ends++;
	                if (ends === streams.length) {
	                  return sink(endEvent());
	                } else {
	                  return Bacon.more;
	                }
	              } else {
	                var reply = sink(event);
	                if (reply === Bacon.noMore) {
	                  unsubBoth();
	                }
	                return reply;
	              }
	            });
	          };
	        };
	        var sinks = _.map(smartSink, streams);
	        return new Bacon.CompositeUnsubscribe(sinks).unsubscribe;
	      });
	    } else {
	      return Bacon.never();
	    }
	  };

	  Bacon.repeatedly = function (delay, values) {
	    var index = 0;
	    return withDesc(new Bacon.Desc(Bacon, "repeatedly", [delay, values]), Bacon.fromPoll(delay, function () {
	      return values[index++ % values.length];
	    }));
	  };

	  Bacon.repeat = function (generator) {
	    var index = 0;
	    return Bacon.fromBinder(function (sink) {
	      var flag = false;
	      var reply = Bacon.more;
	      var unsub = function unsub() {};
	      function handleEvent(event) {
	        if (event.isEnd()) {
	          if (!flag) {
	            return flag = true;
	          } else {
	            return subscribeNext();
	          }
	        } else {
	          return reply = sink(event);
	        }
	      };
	      function subscribeNext() {
	        var next;
	        flag = true;
	        while (flag && reply !== Bacon.noMore) {
	          next = generator(index++);
	          flag = false;
	          if (next) {
	            unsub = next.subscribeInternal(handleEvent);
	          } else {
	            sink(endEvent());
	          }
	        }
	        return flag = true;
	      };
	      subscribeNext();
	      return function () {
	        return unsub();
	      };
	    });
	  };

	  Bacon.retry = function (options) {
	    if (!_.isFunction(options.source)) {
	      throw new Exception("'source' option has to be a function");
	    }
	    var source = options.source;
	    var retries = options.retries || 0;
	    var maxRetries = options.maxRetries || retries;
	    var delay = options.delay || function () {
	      return 0;
	    };
	    var isRetryable = options.isRetryable || function () {
	      return true;
	    };
	    var finished = false;
	    var error = null;

	    return withDesc(new Bacon.Desc(Bacon, "retry", [options]), Bacon.repeat(function () {
	      function valueStream() {
	        return source().endOnError().withHandler(function (event) {
	          if (event.isError()) {
	            error = event;
	            if (!(isRetryable(error.error) && retries > 0)) {
	              finished = true;
	              return this.push(event);
	            }
	          } else {
	            if (event.hasValue()) {
	              error = null;
	              finished = true;
	            }
	            return this.push(event);
	          }
	        });
	      }

	      if (finished) {
	        return null;
	      } else if (error) {
	        var context = {
	          error: error.error,
	          retriesDone: maxRetries - retries
	        };
	        var pause = Bacon.later(delay(context)).filter(false);
	        retries = retries - 1;
	        return pause.concat(Bacon.once().flatMap(valueStream));
	      } else {
	        return valueStream();
	      }
	    }));
	  };

	  Bacon.sequentially = function (delay, values) {
	    var index = 0;
	    return withDesc(new Bacon.Desc(Bacon, "sequentially", [delay, values]), Bacon.fromPoll(delay, function () {
	      var value = values[index++];
	      if (index < values.length) {
	        return value;
	      } else if (index === values.length) {
	        return [value, endEvent()];
	      } else {
	        return endEvent();
	      }
	    }));
	  };

	  Bacon.Observable.prototype.skip = function (count) {
	    return withDesc(new Bacon.Desc(this, "skip", [count]), this.withHandler(function (event) {
	      if (!event.hasValue()) {
	        return this.push(event);
	      } else if (count > 0) {
	        count--;
	        return Bacon.more;
	      } else {
	        return this.push(event);
	      }
	    }));
	  };

	  Bacon.EventStream.prototype.skipUntil = function (starter) {
	    var started = starter.take(1).map(true).toProperty(false);
	    return withDesc(new Bacon.Desc(this, "skipUntil", [starter]), this.filter(started));
	  };

	  Bacon.EventStream.prototype.skipWhile = function (f) {
	    assertObservableIsProperty(f);
	    var ok = false;

	    for (var _len20 = arguments.length, args = Array(_len20 > 1 ? _len20 - 1 : 0), _key20 = 1; _key20 < _len20; _key20++) {
	      args[_key20 - 1] = arguments[_key20];
	    }

	    return convertArgsToFunction(this, f, args, function (f) {
	      return withDesc(new Bacon.Desc(this, "skipWhile", [f]), this.withHandler(function (event) {
	        if (ok || !event.hasValue() || !f(event.value())) {
	          if (event.hasValue()) {
	            ok = true;
	          }
	          return this.push(event);
	        } else {
	          return Bacon.more;
	        }
	      }));
	    });
	  };

	  Bacon.Observable.prototype.slidingWindow = function (n) {
	    var minValues = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

	    return withDesc(new Bacon.Desc(this, "slidingWindow", [n, minValues]), this.scan([], function (window, value) {
	      return window.concat([value]).slice(-n);
	    }).filter(function (values) {
	      return values.length >= minValues;
	    }));
	  };

	  var spies = [];
	  var registerObs = function registerObs(obs) {
	    if (spies.length) {
	      if (!registerObs.running) {
	        try {
	          registerObs.running = true;
	          spies.forEach(function (spy) {
	            spy(obs);
	          });
	        } finally {
	          delete registerObs.running;
	        }
	      }
	    }
	  };

	  Bacon.spy = function (spy) {
	    return spies.push(spy);
	  };

	  Bacon.Property.prototype.startWith = function (seed) {
	    return withDesc(new Bacon.Desc(this, "startWith", [seed]), this.scan(seed, function (prev, next) {
	      return next;
	    }));
	  };

	  Bacon.EventStream.prototype.startWith = function (seed) {
	    return withDesc(new Bacon.Desc(this, "startWith", [seed]), Bacon.once(seed).concat(this));
	  };

	  Bacon.Observable.prototype.takeWhile = function (f) {
	    assertObservableIsProperty(f);

	    for (var _len21 = arguments.length, args = Array(_len21 > 1 ? _len21 - 1 : 0), _key21 = 1; _key21 < _len21; _key21++) {
	      args[_key21 - 1] = arguments[_key21];
	    }

	    return convertArgsToFunction(this, f, args, function (f) {
	      return withDesc(new Bacon.Desc(this, "takeWhile", [f]), this.withHandler(function (event) {
	        if (event.filter(f)) {
	          return this.push(event);
	        } else {
	          this.push(endEvent());
	          return Bacon.noMore;
	        }
	      }));
	    });
	  };

	  Bacon.EventStream.prototype.throttle = function (delay) {
	    return withDesc(new Bacon.Desc(this, "throttle", [delay]), this.bufferWithTime(delay).map(function (values) {
	      return values[values.length - 1];
	    }));
	  };

	  Bacon.Property.prototype.throttle = function (delay) {
	    return this.delayChanges(new Bacon.Desc(this, "throttle", [delay]), function (changes) {
	      return changes.throttle(delay);
	    });
	  };

	  Observable.prototype.firstToPromise = function (PromiseCtr) {
	    var _this12 = this;

	    if (typeof PromiseCtr !== "function") {
	      if (typeof Promise === "function") {
	        PromiseCtr = Promise;
	      } else {
	        throw new Exception("There isn't default Promise, use shim or parameter");
	      }
	    }

	    return new PromiseCtr(function (resolve, reject) {
	      return _this12.subscribe(function (event) {
	        if (event.hasValue()) {
	          resolve(event.value());
	        }
	        if (event.isError()) {
	          reject(event.error);
	        }

	        return Bacon.noMore;
	      });
	    });
	  };

	  Observable.prototype.toPromise = function (PromiseCtr) {
	    return this.last().firstToPromise(PromiseCtr);
	  };

	  Bacon["try"] = function (f) {
	    return function (value) {
	      try {
	        return Bacon.once(f(value));
	      } catch (e) {
	        return new Bacon.Error(e);
	      }
	    };
	  };

	  Bacon.update = function (initial) {
	    function lateBindFirst(f) {
	      return function () {
	        for (var _len23 = arguments.length, args = Array(_len23), _key23 = 0; _key23 < _len23; _key23++) {
	          args[_key23] = arguments[_key23];
	        }

	        return function (i) {
	          return f.apply(undefined, [i].concat(args));
	        };
	      };
	    }

	    for (var _len22 = arguments.length, patterns = Array(_len22 > 1 ? _len22 - 1 : 0), _key22 = 1; _key22 < _len22; _key22++) {
	      patterns[_key22 - 1] = arguments[_key22];
	    }

	    var i = patterns.length - 1;
	    while (i > 0) {
	      if (!(patterns[i] instanceof Function)) {
	        patterns[i] = _.always(patterns[i]);
	      }
	      patterns[i] = lateBindFirst(patterns[i]);
	      i = i - 2;
	    }
	    return withDesc(new Bacon.Desc(Bacon, "update", [initial].concat(patterns)), Bacon.when.apply(Bacon, patterns).scan(initial, function (x, f) {
	      return f(x);
	    }));
	  };

	  Bacon.zipAsArray = function () {
	    for (var _len24 = arguments.length, args = Array(_len24), _key24 = 0; _key24 < _len24; _key24++) {
	      args[_key24] = arguments[_key24];
	    }

	    var streams = argumentsToObservables(args);
	    return withDesc(new Bacon.Desc(Bacon, "zipAsArray", streams), Bacon.zipWith(streams, function () {
	      for (var _len25 = arguments.length, xs = Array(_len25), _key25 = 0; _key25 < _len25; _key25++) {
	        xs[_key25] = arguments[_key25];
	      }

	      return xs;
	    }));
	  };

	  Bacon.zipWith = function () {
	    for (var _len26 = arguments.length, args = Array(_len26), _key26 = 0; _key26 < _len26; _key26++) {
	      args[_key26] = arguments[_key26];
	    }

	    var observablesAndFunction = argumentsToObservablesAndFunction(args);
	    var streams = observablesAndFunction[0];
	    var f = observablesAndFunction[1];

	    streams = _.map(function (s) {
	      return s.toEventStream();
	    }, streams);
	    return withDesc(new Bacon.Desc(Bacon, "zipWith", [f].concat(streams)), Bacon.when(streams, f));
	  };

	  Bacon.Observable.prototype.zip = function (other, f) {
	    return withDesc(new Bacon.Desc(this, "zip", [other]), Bacon.zipWith([this, other], f || Array));
	  };

	  if ("function" !== "undefined" && __webpack_require__(6) !== null && __webpack_require__(7) != null) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
	      return Bacon;
	    }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    if (typeof this !== "undefined" && this !== null) {
	      this.Bacon = Bacon;
	    }
	  } else if (typeof module !== "undefined" && module !== null && module.exports != null) {
	    module.exports = Bacon;
	    Bacon.Bacon = Bacon;
	  } else {
	    this.Bacon = Bacon;
	  }
	}).call(undefined);
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(5)(module)))

/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function (module) {
		if (!module.webpackPolyfill) {
			module.deprecate = function () {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	};

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = function() { throw new Error("define cannot be used indirect"); };


/***/ },
/* 7 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {module.exports = __webpack_amd_options__;

	/* WEBPACK VAR INJECTION */}.call(exports, {}))

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module) {"use strict";var _typeof=typeof Symbol==="function"&&typeof Symbol.iterator==="symbol"?function(obj){return typeof obj;}:function(obj){return obj&&typeof Symbol==="function"&&obj.constructor===Symbol?"symbol":typeof obj;}; /*!
	 * jQuery JavaScript Library v2.2.0
	 * http://jquery.com/
	 *
	 * Includes Sizzle.js
	 * http://sizzlejs.com/
	 *
	 * Copyright jQuery Foundation and other contributors
	 * Released under the MIT license
	 * http://jquery.org/license
	 *
	 * Date: 2016-01-08T20:02Z
	 */(function(global,factory){if(( false?"undefined":_typeof(module))==="object"&&_typeof(module.exports)==="object"){ // For CommonJS and CommonJS-like environments where a proper `window`
	// is present, execute the factory and get jQuery.
	// For environments that do not have a `window` with a `document`
	// (such as Node.js), expose a factory as module.exports.
	// This accentuates the need for the creation of a real `window`.
	// e.g. var jQuery = require("jquery")(window);
	// See ticket #14549 for more info.
	module.exports=global.document?factory(global,true):function(w){if(!w.document){throw new Error("jQuery requires a window with a document");}return factory(w);};}else {factory(global);} // Pass this if window is not defined yet
	})(typeof window!=="undefined"?window:undefined,function(window,noGlobal){ // Support: Firefox 18+
	// Can't be in strict mode, several libs including ASP.NET trace
	// the stack via arguments.caller.callee and Firefox dies if
	// you try to trace through "use strict" call chains. (#13335)
	//"use strict";
	var arr=[];var document=window.document;var _slice=arr.slice;var concat=arr.concat;var push=arr.push;var indexOf=arr.indexOf;var class2type={};var toString=class2type.toString;var hasOwn=class2type.hasOwnProperty;var support={};var version="2.2.0", // Define a local copy of jQuery
	jQuery=function jQuery(selector,context){ // The jQuery object is actually just the init constructor 'enhanced'
	// Need init if jQuery is called (just allow error to be thrown if not included)
	return new jQuery.fn.init(selector,context);}, // Support: Android<4.1
	// Make sure we trim BOM and NBSP
	rtrim=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, // Matches dashed string for camelizing
	rmsPrefix=/^-ms-/,rdashAlpha=/-([\da-z])/gi, // Used by jQuery.camelCase as callback to replace()
	fcamelCase=function fcamelCase(all,letter){return letter.toUpperCase();};jQuery.fn=jQuery.prototype={ // The current version of jQuery being used
	jquery:version,constructor:jQuery, // Start with an empty selector
	selector:"", // The default length of a jQuery object is 0
	length:0,toArray:function toArray(){return _slice.call(this);}, // Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get:function get(num){return num!=null? // Return just the one element from the set
	num<0?this[num+this.length]:this[num]: // Return all the elements in a clean array
	_slice.call(this);}, // Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack:function pushStack(elems){ // Build a new jQuery matched element set
	var ret=jQuery.merge(this.constructor(),elems); // Add the old object onto the stack (as a reference)
	ret.prevObject=this;ret.context=this.context; // Return the newly-formed element set
	return ret;}, // Execute a callback for every element in the matched set.
	each:function each(callback){return jQuery.each(this,callback);},map:function map(callback){return this.pushStack(jQuery.map(this,function(elem,i){return callback.call(elem,i,elem);}));},slice:function slice(){return this.pushStack(_slice.apply(this,arguments));},first:function first(){return this.eq(0);},last:function last(){return this.eq(-1);},eq:function eq(i){var len=this.length,j=+i+(i<0?len:0);return this.pushStack(j>=0&&j<len?[this[j]]:[]);},end:function end(){return this.prevObject||this.constructor();}, // For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push:push,sort:arr.sort,splice:arr.splice};jQuery.extend=jQuery.fn.extend=function(){var options,name,src,copy,copyIsArray,clone,target=arguments[0]||{},i=1,length=arguments.length,deep=false; // Handle a deep copy situation
	if(typeof target==="boolean"){deep=target; // Skip the boolean and the target
	target=arguments[i]||{};i++;} // Handle case when target is a string or something (possible in deep copy)
	if((typeof target==="undefined"?"undefined":_typeof(target))!=="object"&&!jQuery.isFunction(target)){target={};} // Extend jQuery itself if only one argument is passed
	if(i===length){target=this;i--;}for(;i<length;i++){ // Only deal with non-null/undefined values
	if((options=arguments[i])!=null){ // Extend the base object
	for(name in options){src=target[name];copy=options[name]; // Prevent never-ending loop
	if(target===copy){continue;} // Recurse if we're merging plain objects or arrays
	if(deep&&copy&&(jQuery.isPlainObject(copy)||(copyIsArray=jQuery.isArray(copy)))){if(copyIsArray){copyIsArray=false;clone=src&&jQuery.isArray(src)?src:[];}else {clone=src&&jQuery.isPlainObject(src)?src:{};} // Never move original objects, clone them
	target[name]=jQuery.extend(deep,clone,copy); // Don't bring in undefined values
	}else if(copy!==undefined){target[name]=copy;}}}} // Return the modified object
	return target;};jQuery.extend({ // Unique for each copy of jQuery on the page
	expando:"jQuery"+(version+Math.random()).replace(/\D/g,""), // Assume jQuery is ready without the ready module
	isReady:true,error:function error(msg){throw new Error(msg);},noop:function noop(){},isFunction:function isFunction(obj){return jQuery.type(obj)==="function";},isArray:Array.isArray,isWindow:function isWindow(obj){return obj!=null&&obj===obj.window;},isNumeric:function isNumeric(obj){ // parseFloat NaNs numeric-cast false positives (null|true|false|"")
	// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
	// subtraction forces infinities to NaN
	// adding 1 corrects loss of precision from parseFloat (#15100)
	var realStringObj=obj&&obj.toString();return !jQuery.isArray(obj)&&realStringObj-parseFloat(realStringObj)+1>=0;},isPlainObject:function isPlainObject(obj){ // Not plain objects:
	// - Any object or value whose internal [[Class]] property is not "[object Object]"
	// - DOM nodes
	// - window
	if(jQuery.type(obj)!=="object"||obj.nodeType||jQuery.isWindow(obj)){return false;}if(obj.constructor&&!hasOwn.call(obj.constructor.prototype,"isPrototypeOf")){return false;} // If the function hasn't returned already, we're confident that
	// |obj| is a plain object, created by {} or constructed with new Object
	return true;},isEmptyObject:function isEmptyObject(obj){var name;for(name in obj){return false;}return true;},type:function type(obj){if(obj==null){return obj+"";} // Support: Android<4.0, iOS<6 (functionish RegExp)
	return (typeof obj==="undefined"?"undefined":_typeof(obj))==="object"||typeof obj==="function"?class2type[toString.call(obj)]||"object":typeof obj==="undefined"?"undefined":_typeof(obj);}, // Evaluates a script in a global context
	globalEval:function globalEval(code){var script,indirect=eval;code=jQuery.trim(code);if(code){ // If the code includes a valid, prologue position
	// strict mode pragma, execute code by injecting a
	// script tag into the document.
	if(code.indexOf("use strict")===1){script=document.createElement("script");script.text=code;document.head.appendChild(script).parentNode.removeChild(script);}else { // Otherwise, avoid the DOM node creation, insertion
	// and removal by using an indirect global eval
	indirect(code);}}}, // Convert dashed to camelCase; used by the css and data modules
	// Support: IE9-11+
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase:function camelCase(string){return string.replace(rmsPrefix,"ms-").replace(rdashAlpha,fcamelCase);},nodeName:function nodeName(elem,name){return elem.nodeName&&elem.nodeName.toLowerCase()===name.toLowerCase();},each:function each(obj,callback){var length,i=0;if(isArrayLike(obj)){length=obj.length;for(;i<length;i++){if(callback.call(obj[i],i,obj[i])===false){break;}}}else {for(i in obj){if(callback.call(obj[i],i,obj[i])===false){break;}}}return obj;}, // Support: Android<4.1
	trim:function trim(text){return text==null?"":(text+"").replace(rtrim,"");}, // results is for internal usage only
	makeArray:function makeArray(arr,results){var ret=results||[];if(arr!=null){if(isArrayLike(Object(arr))){jQuery.merge(ret,typeof arr==="string"?[arr]:arr);}else {push.call(ret,arr);}}return ret;},inArray:function inArray(elem,arr,i){return arr==null?-1:indexOf.call(arr,elem,i);},merge:function merge(first,second){var len=+second.length,j=0,i=first.length;for(;j<len;j++){first[i++]=second[j];}first.length=i;return first;},grep:function grep(elems,callback,invert){var callbackInverse,matches=[],i=0,length=elems.length,callbackExpect=!invert; // Go through the array, only saving the items
	// that pass the validator function
	for(;i<length;i++){callbackInverse=!callback(elems[i],i);if(callbackInverse!==callbackExpect){matches.push(elems[i]);}}return matches;}, // arg is for internal usage only
	map:function map(elems,callback,arg){var length,value,i=0,ret=[]; // Go through the array, translating each of the items to their new values
	if(isArrayLike(elems)){length=elems.length;for(;i<length;i++){value=callback(elems[i],i,arg);if(value!=null){ret.push(value);}} // Go through every key on the object,
	}else {for(i in elems){value=callback(elems[i],i,arg);if(value!=null){ret.push(value);}}} // Flatten any nested arrays
	return concat.apply([],ret);}, // A global GUID counter for objects
	guid:1, // Bind a function to a context, optionally partially applying any
	// arguments.
	proxy:function proxy(fn,context){var tmp,args,proxy;if(typeof context==="string"){tmp=fn[context];context=fn;fn=tmp;} // Quick check to determine if target is callable, in the spec
	// this throws a TypeError, but we will just return undefined.
	if(!jQuery.isFunction(fn)){return undefined;} // Simulated bind
	args=_slice.call(arguments,2);proxy=function proxy(){return fn.apply(context||this,args.concat(_slice.call(arguments)));}; // Set the guid of unique handler to the same of original handler, so it can be removed
	proxy.guid=fn.guid=fn.guid||jQuery.guid++;return proxy;},now:Date.now, // jQuery.support is not used in Core but other projects attach their
	// properties to it so it needs to exist.
	support:support}); // JSHint would error on this code due to the Symbol not being defined in ES5.
	// Defining this global in .jshintrc would create a danger of using the global
	// unguarded in another place, it seems safer to just disable JSHint for these
	// three lines.
	/* jshint ignore: start */if(typeof Symbol==="function"){jQuery.fn[Symbol.iterator]=arr[Symbol.iterator];} /* jshint ignore: end */ // Populate the class2type map
	jQuery.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "),function(i,name){class2type["[object "+name+"]"]=name.toLowerCase();});function isArrayLike(obj){ // Support: iOS 8.2 (not reproducible in simulator)
	// `in` check used to prevent JIT error (gh-2145)
	// hasOwn isn't used here due to false negatives
	// regarding Nodelist length in IE
	var length=!!obj&&"length" in obj&&obj.length,type=jQuery.type(obj);if(type==="function"||jQuery.isWindow(obj)){return false;}return type==="array"||length===0||typeof length==="number"&&length>0&&length-1 in obj;}var Sizzle= /*!
	 * Sizzle CSS Selector Engine v2.2.1
	 * http://sizzlejs.com/
	 *
	 * Copyright jQuery Foundation and other contributors
	 * Released under the MIT license
	 * http://jquery.org/license
	 *
	 * Date: 2015-10-17
	 */function(window){var i,support,Expr,getText,isXML,tokenize,compile,select,outermostContext,sortInput,hasDuplicate, // Local document vars
	setDocument,document,docElem,documentIsHTML,rbuggyQSA,rbuggyMatches,matches,contains, // Instance-specific data
	expando="sizzle"+1*new Date(),preferredDoc=window.document,dirruns=0,done=0,classCache=createCache(),tokenCache=createCache(),compilerCache=createCache(),sortOrder=function sortOrder(a,b){if(a===b){hasDuplicate=true;}return 0;}, // General-purpose constants
	MAX_NEGATIVE=1<<31, // Instance methods
	hasOwn={}.hasOwnProperty,arr=[],pop=arr.pop,push_native=arr.push,push=arr.push,slice=arr.slice, // Use a stripped-down indexOf as it's faster than native
	// http://jsperf.com/thor-indexof-vs-for/5
	indexOf=function indexOf(list,elem){var i=0,len=list.length;for(;i<len;i++){if(list[i]===elem){return i;}}return -1;},booleans="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped", // Regular expressions
	// http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace="[\\x20\\t\\r\\n\\f]", // http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier="(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+", // Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
	attributes="\\["+whitespace+"*("+identifier+")(?:"+whitespace+ // Operator (capture 2)
	"*([*^$|!~]?=)"+whitespace+ // "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
	"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|("+identifier+"))|)"+whitespace+"*\\]",pseudos=":("+identifier+")(?:\\(("+ // To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
	// 1. quoted (capture 3; capture 4 or capture 5)
	"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|"+ // 2. simple (capture 6)
	"((?:\\\\.|[^\\\\()[\\]]|"+attributes+")*)|"+ // 3. anything else (capture 2)
	".*"+")\\)|)", // Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rwhitespace=new RegExp(whitespace+"+","g"),rtrim=new RegExp("^"+whitespace+"+|((?:^|[^\\\\])(?:\\\\.)*)"+whitespace+"+$","g"),rcomma=new RegExp("^"+whitespace+"*,"+whitespace+"*"),rcombinators=new RegExp("^"+whitespace+"*([>+~]|"+whitespace+")"+whitespace+"*"),rattributeQuotes=new RegExp("="+whitespace+"*([^\\]'\"]*?)"+whitespace+"*\\]","g"),rpseudo=new RegExp(pseudos),ridentifier=new RegExp("^"+identifier+"$"),matchExpr={"ID":new RegExp("^#("+identifier+")"),"CLASS":new RegExp("^\\.("+identifier+")"),"TAG":new RegExp("^("+identifier+"|[*])"),"ATTR":new RegExp("^"+attributes),"PSEUDO":new RegExp("^"+pseudos),"CHILD":new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+whitespace+"*(even|odd|(([+-]|)(\\d*)n|)"+whitespace+"*(?:([+-]|)"+whitespace+"*(\\d+)|))"+whitespace+"*\\)|)","i"),"bool":new RegExp("^(?:"+booleans+")$","i"), // For use in libraries implementing .is()
	// We use this for POS matching in `select`
	"needsContext":new RegExp("^"+whitespace+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+whitespace+"*((?:-\\d)?\\d*)"+whitespace+"*\\)|)(?=[^-]|$)","i")},rinputs=/^(?:input|select|textarea|button)$/i,rheader=/^h\d$/i,rnative=/^[^{]+\{\s*\[native \w/, // Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,rsibling=/[+~]/,rescape=/'|\\/g, // CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape=new RegExp("\\\\([\\da-f]{1,6}"+whitespace+"?|("+whitespace+")|.)","ig"),funescape=function funescape(_,escaped,escapedWhitespace){var high="0x"+escaped-0x10000; // NaN means non-codepoint
	// Support: Firefox<24
	// Workaround erroneous numeric interpretation of +"0x"
	return high!==high||escapedWhitespace?escaped:high<0? // BMP codepoint
	String.fromCharCode(high+0x10000): // Supplemental Plane codepoint (surrogate pair)
	String.fromCharCode(high>>10|0xD800,high&0x3FF|0xDC00);}, // Used for iframes
	// See setDocument()
	// Removing the function wrapper causes a "Permission Denied"
	// error in IE
	unloadHandler=function unloadHandler(){setDocument();}; // Optimize for push.apply( _, NodeList )
	try{push.apply(arr=slice.call(preferredDoc.childNodes),preferredDoc.childNodes); // Support: Android<4.0
	// Detect silently failing push.apply
	arr[preferredDoc.childNodes.length].nodeType;}catch(e){push={apply:arr.length? // Leverage slice if possible
	function(target,els){push_native.apply(target,slice.call(els));}: // Support: IE<9
	// Otherwise append directly
	function(target,els){var j=target.length,i=0; // Can't trust NodeList.length
	while(target[j++]=els[i++]){}target.length=j-1;}};}function Sizzle(selector,context,results,seed){var m,i,elem,nid,nidselect,match,groups,newSelector,newContext=context&&context.ownerDocument, // nodeType defaults to 9, since context defaults to document
	nodeType=context?context.nodeType:9;results=results||[]; // Return early from calls with invalid selector or context
	if(typeof selector!=="string"||!selector||nodeType!==1&&nodeType!==9&&nodeType!==11){return results;} // Try to shortcut find operations (as opposed to filters) in HTML documents
	if(!seed){if((context?context.ownerDocument||context:preferredDoc)!==document){setDocument(context);}context=context||document;if(documentIsHTML){ // If the selector is sufficiently simple, try using a "get*By*" DOM method
	// (excepting DocumentFragment context, where the methods don't exist)
	if(nodeType!==11&&(match=rquickExpr.exec(selector))){ // ID selector
	if(m=match[1]){ // Document context
	if(nodeType===9){if(elem=context.getElementById(m)){ // Support: IE, Opera, Webkit
	// TODO: identify versions
	// getElementById can match elements by name instead of ID
	if(elem.id===m){results.push(elem);return results;}}else {return results;} // Element context
	}else { // Support: IE, Opera, Webkit
	// TODO: identify versions
	// getElementById can match elements by name instead of ID
	if(newContext&&(elem=newContext.getElementById(m))&&contains(context,elem)&&elem.id===m){results.push(elem);return results;}} // Type selector
	}else if(match[2]){push.apply(results,context.getElementsByTagName(selector));return results; // Class selector
	}else if((m=match[3])&&support.getElementsByClassName&&context.getElementsByClassName){push.apply(results,context.getElementsByClassName(m));return results;}} // Take advantage of querySelectorAll
	if(support.qsa&&!compilerCache[selector+" "]&&(!rbuggyQSA||!rbuggyQSA.test(selector))){if(nodeType!==1){newContext=context;newSelector=selector; // qSA looks outside Element context, which is not what we want
	// Thanks to Andrew Dupont for this workaround technique
	// Support: IE <=8
	// Exclude object elements
	}else if(context.nodeName.toLowerCase()!=="object"){ // Capture the context ID, setting it first if necessary
	if(nid=context.getAttribute("id")){nid=nid.replace(rescape,"\\$&");}else {context.setAttribute("id",nid=expando);} // Prefix every selector in the list
	groups=tokenize(selector);i=groups.length;nidselect=ridentifier.test(nid)?"#"+nid:"[id='"+nid+"']";while(i--){groups[i]=nidselect+" "+toSelector(groups[i]);}newSelector=groups.join(","); // Expand context for sibling selectors
	newContext=rsibling.test(selector)&&testContext(context.parentNode)||context;}if(newSelector){try{push.apply(results,newContext.querySelectorAll(newSelector));return results;}catch(qsaError){}finally {if(nid===expando){context.removeAttribute("id");}}}}}} // All others
	return select(selector.replace(rtrim,"$1"),context,results,seed);} /**
	 * Create key-value caches of limited size
	 * @returns {function(string, object)} Returns the Object data after storing it on itself with
	 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
	 *	deleting the oldest entry
	 */function createCache(){var keys=[];function cache(key,value){ // Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
	if(keys.push(key+" ")>Expr.cacheLength){ // Only keep the most recent entries
	delete cache[keys.shift()];}return cache[key+" "]=value;}return cache;} /**
	 * Mark a function for special use by Sizzle
	 * @param {Function} fn The function to mark
	 */function markFunction(fn){fn[expando]=true;return fn;} /**
	 * Support testing using an element
	 * @param {Function} fn Passed the created div and expects a boolean result
	 */function assert(fn){var div=document.createElement("div");try{return !!fn(div);}catch(e){return false;}finally { // Remove from its parent by default
	if(div.parentNode){div.parentNode.removeChild(div);} // release memory in IE
	div=null;}} /**
	 * Adds the same handler for all of the specified attrs
	 * @param {String} attrs Pipe-separated list of attributes
	 * @param {Function} handler The method that will be applied
	 */function addHandle(attrs,handler){var arr=attrs.split("|"),i=arr.length;while(i--){Expr.attrHandle[arr[i]]=handler;}} /**
	 * Checks document order of two siblings
	 * @param {Element} a
	 * @param {Element} b
	 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
	 */function siblingCheck(a,b){var cur=b&&a,diff=cur&&a.nodeType===1&&b.nodeType===1&&(~b.sourceIndex||MAX_NEGATIVE)-(~a.sourceIndex||MAX_NEGATIVE); // Use IE sourceIndex if available on both nodes
	if(diff){return diff;} // Check if b follows a
	if(cur){while(cur=cur.nextSibling){if(cur===b){return -1;}}}return a?1:-1;} /**
	 * Returns a function to use in pseudos for input types
	 * @param {String} type
	 */function createInputPseudo(type){return function(elem){var name=elem.nodeName.toLowerCase();return name==="input"&&elem.type===type;};} /**
	 * Returns a function to use in pseudos for buttons
	 * @param {String} type
	 */function createButtonPseudo(type){return function(elem){var name=elem.nodeName.toLowerCase();return (name==="input"||name==="button")&&elem.type===type;};} /**
	 * Returns a function to use in pseudos for positionals
	 * @param {Function} fn
	 */function createPositionalPseudo(fn){return markFunction(function(argument){argument=+argument;return markFunction(function(seed,matches){var j,matchIndexes=fn([],seed.length,argument),i=matchIndexes.length; // Match elements found at the specified indexes
	while(i--){if(seed[j=matchIndexes[i]]){seed[j]=!(matches[j]=seed[j]);}}});});} /**
	 * Checks a node for validity as a Sizzle context
	 * @param {Element|Object=} context
	 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
	 */function testContext(context){return context&&typeof context.getElementsByTagName!=="undefined"&&context;} // Expose support vars for convenience
	support=Sizzle.support={}; /**
	 * Detects XML nodes
	 * @param {Element|Object} elem An element or a document
	 * @returns {Boolean} True iff elem is a non-HTML XML node
	 */isXML=Sizzle.isXML=function(elem){ // documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement=elem&&(elem.ownerDocument||elem).documentElement;return documentElement?documentElement.nodeName!=="HTML":false;}; /**
	 * Sets document-related variables once based on the current document
	 * @param {Element|Object} [doc] An element or document object to use to set the document
	 * @returns {Object} Returns the current document
	 */setDocument=Sizzle.setDocument=function(node){var hasCompare,parent,doc=node?node.ownerDocument||node:preferredDoc; // Return early if doc is invalid or already selected
	if(doc===document||doc.nodeType!==9||!doc.documentElement){return document;} // Update global variables
	document=doc;docElem=document.documentElement;documentIsHTML=!isXML(document); // Support: IE 9-11, Edge
	// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
	if((parent=document.defaultView)&&parent.top!==parent){ // Support: IE 11
	if(parent.addEventListener){parent.addEventListener("unload",unloadHandler,false); // Support: IE 9 - 10 only
	}else if(parent.attachEvent){parent.attachEvent("onunload",unloadHandler);}} /* Attributes
		---------------------------------------------------------------------- */ // Support: IE<8
	// Verify that getAttribute really returns attributes and not properties
	// (excepting IE8 booleans)
	support.attributes=assert(function(div){div.className="i";return !div.getAttribute("className");}); /* getElement(s)By*
		---------------------------------------------------------------------- */ // Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName=assert(function(div){div.appendChild(document.createComment(""));return !div.getElementsByTagName("*").length;}); // Support: IE<9
	support.getElementsByClassName=rnative.test(document.getElementsByClassName); // Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programatically-set names,
	// so use a roundabout getElementsByName test
	support.getById=assert(function(div){docElem.appendChild(div).id=expando;return !document.getElementsByName||!document.getElementsByName(expando).length;}); // ID find and filter
	if(support.getById){Expr.find["ID"]=function(id,context){if(typeof context.getElementById!=="undefined"&&documentIsHTML){var m=context.getElementById(id);return m?[m]:[];}};Expr.filter["ID"]=function(id){var attrId=id.replace(runescape,funescape);return function(elem){return elem.getAttribute("id")===attrId;};};}else { // Support: IE6/7
	// getElementById is not reliable as a find shortcut
	delete Expr.find["ID"];Expr.filter["ID"]=function(id){var attrId=id.replace(runescape,funescape);return function(elem){var node=typeof elem.getAttributeNode!=="undefined"&&elem.getAttributeNode("id");return node&&node.value===attrId;};};} // Tag
	Expr.find["TAG"]=support.getElementsByTagName?function(tag,context){if(typeof context.getElementsByTagName!=="undefined"){return context.getElementsByTagName(tag); // DocumentFragment nodes don't have gEBTN
	}else if(support.qsa){return context.querySelectorAll(tag);}}:function(tag,context){var elem,tmp=[],i=0, // By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
	results=context.getElementsByTagName(tag); // Filter out possible comments
	if(tag==="*"){while(elem=results[i++]){if(elem.nodeType===1){tmp.push(elem);}}return tmp;}return results;}; // Class
	Expr.find["CLASS"]=support.getElementsByClassName&&function(className,context){if(typeof context.getElementsByClassName!=="undefined"&&documentIsHTML){return context.getElementsByClassName(className);}}; /* QSA/matchesSelector
		---------------------------------------------------------------------- */ // QSA and matchesSelector support
	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches=[]; // qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See http://bugs.jquery.com/ticket/13378
	rbuggyQSA=[];if(support.qsa=rnative.test(document.querySelectorAll)){ // Build QSA regex
	// Regex strategy adopted from Diego Perini
	assert(function(div){ // Select is set to empty string on purpose
	// This is to test IE's treatment of not explicitly
	// setting a boolean content attribute,
	// since its presence should be enough
	// http://bugs.jquery.com/ticket/12359
	docElem.appendChild(div).innerHTML="<a id='"+expando+"'></a>"+"<select id='"+expando+"-\r\\' msallowcapture=''>"+"<option selected=''></option></select>"; // Support: IE8, Opera 11-12.16
	// Nothing should be selected when empty strings follow ^= or $= or *=
	// The test attribute must be unknown in Opera but "safe" for WinRT
	// http://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
	if(div.querySelectorAll("[msallowcapture^='']").length){rbuggyQSA.push("[*^$]="+whitespace+"*(?:''|\"\")");} // Support: IE8
	// Boolean attributes and "value" are not treated correctly
	if(!div.querySelectorAll("[selected]").length){rbuggyQSA.push("\\["+whitespace+"*(?:value|"+booleans+")");} // Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
	if(!div.querySelectorAll("[id~="+expando+"-]").length){rbuggyQSA.push("~=");} // Webkit/Opera - :checked should return selected option elements
	// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
	// IE8 throws error here and will not see later tests
	if(!div.querySelectorAll(":checked").length){rbuggyQSA.push(":checked");} // Support: Safari 8+, iOS 8+
	// https://bugs.webkit.org/show_bug.cgi?id=136851
	// In-page `selector#id sibing-combinator selector` fails
	if(!div.querySelectorAll("a#"+expando+"+*").length){rbuggyQSA.push(".#.+[+~]");}});assert(function(div){ // Support: Windows 8 Native Apps
	// The type and name attributes are restricted during .innerHTML assignment
	var input=document.createElement("input");input.setAttribute("type","hidden");div.appendChild(input).setAttribute("name","D"); // Support: IE8
	// Enforce case-sensitivity of name attribute
	if(div.querySelectorAll("[name=d]").length){rbuggyQSA.push("name"+whitespace+"*[*^$|!~]?=");} // FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
	// IE8 throws error here and will not see later tests
	if(!div.querySelectorAll(":enabled").length){rbuggyQSA.push(":enabled",":disabled");} // Opera 10-11 does not throw on post-comma invalid pseudos
	div.querySelectorAll("*,:x");rbuggyQSA.push(",.*:");});}if(support.matchesSelector=rnative.test(matches=docElem.matches||docElem.webkitMatchesSelector||docElem.mozMatchesSelector||docElem.oMatchesSelector||docElem.msMatchesSelector)){assert(function(div){ // Check to see if it's possible to do matchesSelector
	// on a disconnected node (IE 9)
	support.disconnectedMatch=matches.call(div,"div"); // This should fail with an exception
	// Gecko does not error, returns false instead
	matches.call(div,"[s!='']:x");rbuggyMatches.push("!=",pseudos);});}rbuggyQSA=rbuggyQSA.length&&new RegExp(rbuggyQSA.join("|"));rbuggyMatches=rbuggyMatches.length&&new RegExp(rbuggyMatches.join("|")); /* Contains
		---------------------------------------------------------------------- */hasCompare=rnative.test(docElem.compareDocumentPosition); // Element contains another
	// Purposefully self-exclusive
	// As in, an element does not contain itself
	contains=hasCompare||rnative.test(docElem.contains)?function(a,b){var adown=a.nodeType===9?a.documentElement:a,bup=b&&b.parentNode;return a===bup||!!(bup&&bup.nodeType===1&&(adown.contains?adown.contains(bup):a.compareDocumentPosition&&a.compareDocumentPosition(bup)&16));}:function(a,b){if(b){while(b=b.parentNode){if(b===a){return true;}}}return false;}; /* Sorting
		---------------------------------------------------------------------- */ // Document order sorting
	sortOrder=hasCompare?function(a,b){ // Flag for duplicate removal
	if(a===b){hasDuplicate=true;return 0;} // Sort on method existence if only one input has compareDocumentPosition
	var compare=!a.compareDocumentPosition-!b.compareDocumentPosition;if(compare){return compare;} // Calculate position if both inputs belong to the same document
	compare=(a.ownerDocument||a)===(b.ownerDocument||b)?a.compareDocumentPosition(b): // Otherwise we know they are disconnected
	1; // Disconnected nodes
	if(compare&1||!support.sortDetached&&b.compareDocumentPosition(a)===compare){ // Choose the first element that is related to our preferred document
	if(a===document||a.ownerDocument===preferredDoc&&contains(preferredDoc,a)){return -1;}if(b===document||b.ownerDocument===preferredDoc&&contains(preferredDoc,b)){return 1;} // Maintain original order
	return sortInput?indexOf(sortInput,a)-indexOf(sortInput,b):0;}return compare&4?-1:1;}:function(a,b){ // Exit early if the nodes are identical
	if(a===b){hasDuplicate=true;return 0;}var cur,i=0,aup=a.parentNode,bup=b.parentNode,ap=[a],bp=[b]; // Parentless nodes are either documents or disconnected
	if(!aup||!bup){return a===document?-1:b===document?1:aup?-1:bup?1:sortInput?indexOf(sortInput,a)-indexOf(sortInput,b):0; // If the nodes are siblings, we can do a quick check
	}else if(aup===bup){return siblingCheck(a,b);} // Otherwise we need full lists of their ancestors for comparison
	cur=a;while(cur=cur.parentNode){ap.unshift(cur);}cur=b;while(cur=cur.parentNode){bp.unshift(cur);} // Walk down the tree looking for a discrepancy
	while(ap[i]===bp[i]){i++;}return i? // Do a sibling check if the nodes have a common ancestor
	siblingCheck(ap[i],bp[i]): // Otherwise nodes in our document sort first
	ap[i]===preferredDoc?-1:bp[i]===preferredDoc?1:0;};return document;};Sizzle.matches=function(expr,elements){return Sizzle(expr,null,null,elements);};Sizzle.matchesSelector=function(elem,expr){ // Set document vars if needed
	if((elem.ownerDocument||elem)!==document){setDocument(elem);} // Make sure that attribute selectors are quoted
	expr=expr.replace(rattributeQuotes,"='$1']");if(support.matchesSelector&&documentIsHTML&&!compilerCache[expr+" "]&&(!rbuggyMatches||!rbuggyMatches.test(expr))&&(!rbuggyQSA||!rbuggyQSA.test(expr))){try{var ret=matches.call(elem,expr); // IE 9's matchesSelector returns false on disconnected nodes
	if(ret||support.disconnectedMatch|| // As well, disconnected nodes are said to be in a document
	// fragment in IE 9
	elem.document&&elem.document.nodeType!==11){return ret;}}catch(e){}}return Sizzle(expr,document,null,[elem]).length>0;};Sizzle.contains=function(context,elem){ // Set document vars if needed
	if((context.ownerDocument||context)!==document){setDocument(context);}return contains(context,elem);};Sizzle.attr=function(elem,name){ // Set document vars if needed
	if((elem.ownerDocument||elem)!==document){setDocument(elem);}var fn=Expr.attrHandle[name.toLowerCase()], // Don't get fooled by Object.prototype properties (jQuery #13807)
	val=fn&&hasOwn.call(Expr.attrHandle,name.toLowerCase())?fn(elem,name,!documentIsHTML):undefined;return val!==undefined?val:support.attributes||!documentIsHTML?elem.getAttribute(name):(val=elem.getAttributeNode(name))&&val.specified?val.value:null;};Sizzle.error=function(msg){throw new Error("Syntax error, unrecognized expression: "+msg);}; /**
	 * Document sorting and removing duplicates
	 * @param {ArrayLike} results
	 */Sizzle.uniqueSort=function(results){var elem,duplicates=[],j=0,i=0; // Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate=!support.detectDuplicates;sortInput=!support.sortStable&&results.slice(0);results.sort(sortOrder);if(hasDuplicate){while(elem=results[i++]){if(elem===results[i]){j=duplicates.push(i);}}while(j--){results.splice(duplicates[j],1);}} // Clear input after sorting to release objects
	// See https://github.com/jquery/sizzle/pull/225
	sortInput=null;return results;}; /**
	 * Utility function for retrieving the text value of an array of DOM nodes
	 * @param {Array|Element} elem
	 */getText=Sizzle.getText=function(elem){var node,ret="",i=0,nodeType=elem.nodeType;if(!nodeType){ // If no nodeType, this is expected to be an array
	while(node=elem[i++]){ // Do not traverse comment nodes
	ret+=getText(node);}}else if(nodeType===1||nodeType===9||nodeType===11){ // Use textContent for elements
	// innerText usage removed for consistency of new lines (jQuery #11153)
	if(typeof elem.textContent==="string"){return elem.textContent;}else { // Traverse its children
	for(elem=elem.firstChild;elem;elem=elem.nextSibling){ret+=getText(elem);}}}else if(nodeType===3||nodeType===4){return elem.nodeValue;} // Do not include comment or processing instruction nodes
	return ret;};Expr=Sizzle.selectors={ // Can be adjusted by the user
	cacheLength:50,createPseudo:markFunction,match:matchExpr,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:true}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:true},"~":{dir:"previousSibling"}},preFilter:{"ATTR":function ATTR(match){match[1]=match[1].replace(runescape,funescape); // Move the given value to match[3] whether quoted or unquoted
	match[3]=(match[3]||match[4]||match[5]||"").replace(runescape,funescape);if(match[2]==="~="){match[3]=" "+match[3]+" ";}return match.slice(0,4);},"CHILD":function CHILD(match){ /* matches from matchExpr["CHILD"]
					1 type (only|nth|...)
					2 what (child|of-type)
					3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
					4 xn-component of xn+y argument ([+-]?\d*n|)
					5 sign of xn-component
					6 x of xn-component
					7 sign of y-component
					8 y of y-component
				*/match[1]=match[1].toLowerCase();if(match[1].slice(0,3)==="nth"){ // nth-* requires argument
	if(!match[3]){Sizzle.error(match[0]);} // numeric x and y parameters for Expr.filter.CHILD
	// remember that false/true cast respectively to 0/1
	match[4]=+(match[4]?match[5]+(match[6]||1):2*(match[3]==="even"||match[3]==="odd"));match[5]=+(match[7]+match[8]||match[3]==="odd"); // other types prohibit arguments
	}else if(match[3]){Sizzle.error(match[0]);}return match;},"PSEUDO":function PSEUDO(match){var excess,unquoted=!match[6]&&match[2];if(matchExpr["CHILD"].test(match[0])){return null;} // Accept quoted arguments as-is
	if(match[3]){match[2]=match[4]||match[5]||""; // Strip excess characters from unquoted arguments
	}else if(unquoted&&rpseudo.test(unquoted)&&( // Get excess from tokenize (recursively)
	excess=tokenize(unquoted,true))&&( // advance to the next closing parenthesis
	excess=unquoted.indexOf(")",unquoted.length-excess)-unquoted.length)){ // excess is a negative index
	match[0]=match[0].slice(0,excess);match[2]=unquoted.slice(0,excess);} // Return only captures needed by the pseudo filter method (type and argument)
	return match.slice(0,3);}},filter:{"TAG":function TAG(nodeNameSelector){var nodeName=nodeNameSelector.replace(runescape,funescape).toLowerCase();return nodeNameSelector==="*"?function(){return true;}:function(elem){return elem.nodeName&&elem.nodeName.toLowerCase()===nodeName;};},"CLASS":function CLASS(className){var pattern=classCache[className+" "];return pattern||(pattern=new RegExp("(^|"+whitespace+")"+className+"("+whitespace+"|$)"))&&classCache(className,function(elem){return pattern.test(typeof elem.className==="string"&&elem.className||typeof elem.getAttribute!=="undefined"&&elem.getAttribute("class")||"");});},"ATTR":function ATTR(name,operator,check){return function(elem){var result=Sizzle.attr(elem,name);if(result==null){return operator==="!=";}if(!operator){return true;}result+="";return operator==="="?result===check:operator==="!="?result!==check:operator==="^="?check&&result.indexOf(check)===0:operator==="*="?check&&result.indexOf(check)>-1:operator==="$="?check&&result.slice(-check.length)===check:operator==="~="?(" "+result.replace(rwhitespace," ")+" ").indexOf(check)>-1:operator==="|="?result===check||result.slice(0,check.length+1)===check+"-":false;};},"CHILD":function CHILD(type,what,argument,first,last){var simple=type.slice(0,3)!=="nth",forward=type.slice(-4)!=="last",ofType=what==="of-type";return first===1&&last===0? // Shortcut for :nth-*(n)
	function(elem){return !!elem.parentNode;}:function(elem,context,xml){var cache,uniqueCache,outerCache,node,nodeIndex,start,dir=simple!==forward?"nextSibling":"previousSibling",parent=elem.parentNode,name=ofType&&elem.nodeName.toLowerCase(),useCache=!xml&&!ofType,diff=false;if(parent){ // :(first|last|only)-(child|of-type)
	if(simple){while(dir){node=elem;while(node=node[dir]){if(ofType?node.nodeName.toLowerCase()===name:node.nodeType===1){return false;}} // Reverse direction for :only-* (if we haven't yet done so)
	start=dir=type==="only"&&!start&&"nextSibling";}return true;}start=[forward?parent.firstChild:parent.lastChild]; // non-xml :nth-child(...) stores cache data on `parent`
	if(forward&&useCache){ // Seek `elem` from a previously-cached index
	// ...in a gzip-friendly way
	node=parent;outerCache=node[expando]||(node[expando]={}); // Support: IE <9 only
	// Defend against cloned attroperties (jQuery gh-1709)
	uniqueCache=outerCache[node.uniqueID]||(outerCache[node.uniqueID]={});cache=uniqueCache[type]||[];nodeIndex=cache[0]===dirruns&&cache[1];diff=nodeIndex&&cache[2];node=nodeIndex&&parent.childNodes[nodeIndex];while(node=++nodeIndex&&node&&node[dir]||( // Fallback to seeking `elem` from the start
	diff=nodeIndex=0)||start.pop()){ // When found, cache indexes on `parent` and break
	if(node.nodeType===1&&++diff&&node===elem){uniqueCache[type]=[dirruns,nodeIndex,diff];break;}}}else { // Use previously-cached element index if available
	if(useCache){ // ...in a gzip-friendly way
	node=elem;outerCache=node[expando]||(node[expando]={}); // Support: IE <9 only
	// Defend against cloned attroperties (jQuery gh-1709)
	uniqueCache=outerCache[node.uniqueID]||(outerCache[node.uniqueID]={});cache=uniqueCache[type]||[];nodeIndex=cache[0]===dirruns&&cache[1];diff=nodeIndex;} // xml :nth-child(...)
	// or :nth-last-child(...) or :nth(-last)?-of-type(...)
	if(diff===false){ // Use the same loop as above to seek `elem` from the start
	while(node=++nodeIndex&&node&&node[dir]||(diff=nodeIndex=0)||start.pop()){if((ofType?node.nodeName.toLowerCase()===name:node.nodeType===1)&&++diff){ // Cache the index of each encountered element
	if(useCache){outerCache=node[expando]||(node[expando]={}); // Support: IE <9 only
	// Defend against cloned attroperties (jQuery gh-1709)
	uniqueCache=outerCache[node.uniqueID]||(outerCache[node.uniqueID]={});uniqueCache[type]=[dirruns,diff];}if(node===elem){break;}}}}} // Incorporate the offset, then check against cycle size
	diff-=last;return diff===first||diff%first===0&&diff/first>=0;}};},"PSEUDO":function PSEUDO(pseudo,argument){ // pseudo-class names are case-insensitive
	// http://www.w3.org/TR/selectors/#pseudo-classes
	// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
	// Remember that setFilters inherits from pseudos
	var args,fn=Expr.pseudos[pseudo]||Expr.setFilters[pseudo.toLowerCase()]||Sizzle.error("unsupported pseudo: "+pseudo); // The user may use createPseudo to indicate that
	// arguments are needed to create the filter function
	// just as Sizzle does
	if(fn[expando]){return fn(argument);} // But maintain support for old signatures
	if(fn.length>1){args=[pseudo,pseudo,"",argument];return Expr.setFilters.hasOwnProperty(pseudo.toLowerCase())?markFunction(function(seed,matches){var idx,matched=fn(seed,argument),i=matched.length;while(i--){idx=indexOf(seed,matched[i]);seed[idx]=!(matches[idx]=matched[i]);}}):function(elem){return fn(elem,0,args);};}return fn;}},pseudos:{ // Potentially complex pseudos
	"not":markFunction(function(selector){ // Trim the selector passed to compile
	// to avoid treating leading and trailing
	// spaces as combinators
	var input=[],results=[],matcher=compile(selector.replace(rtrim,"$1"));return matcher[expando]?markFunction(function(seed,matches,context,xml){var elem,unmatched=matcher(seed,null,xml,[]),i=seed.length; // Match elements unmatched by `matcher`
	while(i--){if(elem=unmatched[i]){seed[i]=!(matches[i]=elem);}}}):function(elem,context,xml){input[0]=elem;matcher(input,null,xml,results); // Don't keep the element (issue #299)
	input[0]=null;return !results.pop();};}),"has":markFunction(function(selector){return function(elem){return Sizzle(selector,elem).length>0;};}),"contains":markFunction(function(text){text=text.replace(runescape,funescape);return function(elem){return (elem.textContent||elem.innerText||getText(elem)).indexOf(text)>-1;};}), // "Whether an element is represented by a :lang() selector
	// is based solely on the element's language value
	// being equal to the identifier C,
	// or beginning with the identifier C immediately followed by "-".
	// The matching of C against the element's language value is performed case-insensitively.
	// The identifier C does not have to be a valid language name."
	// http://www.w3.org/TR/selectors/#lang-pseudo
	"lang":markFunction(function(lang){ // lang value must be a valid identifier
	if(!ridentifier.test(lang||"")){Sizzle.error("unsupported lang: "+lang);}lang=lang.replace(runescape,funescape).toLowerCase();return function(elem){var elemLang;do {if(elemLang=documentIsHTML?elem.lang:elem.getAttribute("xml:lang")||elem.getAttribute("lang")){elemLang=elemLang.toLowerCase();return elemLang===lang||elemLang.indexOf(lang+"-")===0;}}while((elem=elem.parentNode)&&elem.nodeType===1);return false;};}), // Miscellaneous
	"target":function target(elem){var hash=window.location&&window.location.hash;return hash&&hash.slice(1)===elem.id;},"root":function root(elem){return elem===docElem;},"focus":function focus(elem){return elem===document.activeElement&&(!document.hasFocus||document.hasFocus())&&!!(elem.type||elem.href||~elem.tabIndex);}, // Boolean properties
	"enabled":function enabled(elem){return elem.disabled===false;},"disabled":function disabled(elem){return elem.disabled===true;},"checked":function checked(elem){ // In CSS3, :checked should return both checked and selected elements
	// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
	var nodeName=elem.nodeName.toLowerCase();return nodeName==="input"&&!!elem.checked||nodeName==="option"&&!!elem.selected;},"selected":function selected(elem){ // Accessing this property makes selected-by-default
	// options in Safari work properly
	if(elem.parentNode){elem.parentNode.selectedIndex;}return elem.selected===true;}, // Contents
	"empty":function empty(elem){ // http://www.w3.org/TR/selectors/#empty-pseudo
	// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
	//   but not by others (comment: 8; processing instruction: 7; etc.)
	// nodeType < 6 works because attributes (2) do not appear as children
	for(elem=elem.firstChild;elem;elem=elem.nextSibling){if(elem.nodeType<6){return false;}}return true;},"parent":function parent(elem){return !Expr.pseudos["empty"](elem);}, // Element/input types
	"header":function header(elem){return rheader.test(elem.nodeName);},"input":function input(elem){return rinputs.test(elem.nodeName);},"button":function button(elem){var name=elem.nodeName.toLowerCase();return name==="input"&&elem.type==="button"||name==="button";},"text":function text(elem){var attr;return elem.nodeName.toLowerCase()==="input"&&elem.type==="text"&&( // Support: IE<8
	// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
	(attr=elem.getAttribute("type"))==null||attr.toLowerCase()==="text");}, // Position-in-collection
	"first":createPositionalPseudo(function(){return [0];}),"last":createPositionalPseudo(function(matchIndexes,length){return [length-1];}),"eq":createPositionalPseudo(function(matchIndexes,length,argument){return [argument<0?argument+length:argument];}),"even":createPositionalPseudo(function(matchIndexes,length){var i=0;for(;i<length;i+=2){matchIndexes.push(i);}return matchIndexes;}),"odd":createPositionalPseudo(function(matchIndexes,length){var i=1;for(;i<length;i+=2){matchIndexes.push(i);}return matchIndexes;}),"lt":createPositionalPseudo(function(matchIndexes,length,argument){var i=argument<0?argument+length:argument;for(;--i>=0;){matchIndexes.push(i);}return matchIndexes;}),"gt":createPositionalPseudo(function(matchIndexes,length,argument){var i=argument<0?argument+length:argument;for(;++i<length;){matchIndexes.push(i);}return matchIndexes;})}};Expr.pseudos["nth"]=Expr.pseudos["eq"]; // Add button/input type pseudos
	for(i in {radio:true,checkbox:true,file:true,password:true,image:true}){Expr.pseudos[i]=createInputPseudo(i);}for(i in {submit:true,reset:true}){Expr.pseudos[i]=createButtonPseudo(i);} // Easy API for creating new setFilters
	function setFilters(){}setFilters.prototype=Expr.filters=Expr.pseudos;Expr.setFilters=new setFilters();tokenize=Sizzle.tokenize=function(selector,parseOnly){var matched,match,tokens,type,soFar,groups,preFilters,cached=tokenCache[selector+" "];if(cached){return parseOnly?0:cached.slice(0);}soFar=selector;groups=[];preFilters=Expr.preFilter;while(soFar){ // Comma and first run
	if(!matched||(match=rcomma.exec(soFar))){if(match){ // Don't consume trailing commas as valid
	soFar=soFar.slice(match[0].length)||soFar;}groups.push(tokens=[]);}matched=false; // Combinators
	if(match=rcombinators.exec(soFar)){matched=match.shift();tokens.push({value:matched, // Cast descendant combinators to space
	type:match[0].replace(rtrim," ")});soFar=soFar.slice(matched.length);} // Filters
	for(type in Expr.filter){if((match=matchExpr[type].exec(soFar))&&(!preFilters[type]||(match=preFilters[type](match)))){matched=match.shift();tokens.push({value:matched,type:type,matches:match});soFar=soFar.slice(matched.length);}}if(!matched){break;}} // Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly?soFar.length:soFar?Sizzle.error(selector): // Cache the tokens
	tokenCache(selector,groups).slice(0);};function toSelector(tokens){var i=0,len=tokens.length,selector="";for(;i<len;i++){selector+=tokens[i].value;}return selector;}function addCombinator(matcher,combinator,base){var dir=combinator.dir,checkNonElements=base&&dir==="parentNode",doneName=done++;return combinator.first? // Check against closest ancestor/preceding element
	function(elem,context,xml){while(elem=elem[dir]){if(elem.nodeType===1||checkNonElements){return matcher(elem,context,xml);}}}: // Check against all ancestor/preceding elements
	function(elem,context,xml){var oldCache,uniqueCache,outerCache,newCache=[dirruns,doneName]; // We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
	if(xml){while(elem=elem[dir]){if(elem.nodeType===1||checkNonElements){if(matcher(elem,context,xml)){return true;}}}}else {while(elem=elem[dir]){if(elem.nodeType===1||checkNonElements){outerCache=elem[expando]||(elem[expando]={}); // Support: IE <9 only
	// Defend against cloned attroperties (jQuery gh-1709)
	uniqueCache=outerCache[elem.uniqueID]||(outerCache[elem.uniqueID]={});if((oldCache=uniqueCache[dir])&&oldCache[0]===dirruns&&oldCache[1]===doneName){ // Assign to newCache so results back-propagate to previous elements
	return newCache[2]=oldCache[2];}else { // Reuse newcache so results back-propagate to previous elements
	uniqueCache[dir]=newCache; // A match means we're done; a fail means we have to keep checking
	if(newCache[2]=matcher(elem,context,xml)){return true;}}}}}};}function elementMatcher(matchers){return matchers.length>1?function(elem,context,xml){var i=matchers.length;while(i--){if(!matchers[i](elem,context,xml)){return false;}}return true;}:matchers[0];}function multipleContexts(selector,contexts,results){var i=0,len=contexts.length;for(;i<len;i++){Sizzle(selector,contexts[i],results);}return results;}function condense(unmatched,map,filter,context,xml){var elem,newUnmatched=[],i=0,len=unmatched.length,mapped=map!=null;for(;i<len;i++){if(elem=unmatched[i]){if(!filter||filter(elem,context,xml)){newUnmatched.push(elem);if(mapped){map.push(i);}}}}return newUnmatched;}function setMatcher(preFilter,selector,matcher,postFilter,postFinder,postSelector){if(postFilter&&!postFilter[expando]){postFilter=setMatcher(postFilter);}if(postFinder&&!postFinder[expando]){postFinder=setMatcher(postFinder,postSelector);}return markFunction(function(seed,results,context,xml){var temp,i,elem,preMap=[],postMap=[],preexisting=results.length, // Get initial elements from seed or context
	elems=seed||multipleContexts(selector||"*",context.nodeType?[context]:context,[]), // Prefilter to get matcher input, preserving a map for seed-results synchronization
	matcherIn=preFilter&&(seed||!selector)?condense(elems,preMap,preFilter,context,xml):elems,matcherOut=matcher? // If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
	postFinder||(seed?preFilter:preexisting||postFilter)? // ...intermediate processing is necessary
	[]: // ...otherwise use results directly
	results:matcherIn; // Find primary matches
	if(matcher){matcher(matcherIn,matcherOut,context,xml);} // Apply postFilter
	if(postFilter){temp=condense(matcherOut,postMap);postFilter(temp,[],context,xml); // Un-match failing elements by moving them back to matcherIn
	i=temp.length;while(i--){if(elem=temp[i]){matcherOut[postMap[i]]=!(matcherIn[postMap[i]]=elem);}}}if(seed){if(postFinder||preFilter){if(postFinder){ // Get the final matcherOut by condensing this intermediate into postFinder contexts
	temp=[];i=matcherOut.length;while(i--){if(elem=matcherOut[i]){ // Restore matcherIn since elem is not yet a final match
	temp.push(matcherIn[i]=elem);}}postFinder(null,matcherOut=[],temp,xml);} // Move matched elements from seed to results to keep them synchronized
	i=matcherOut.length;while(i--){if((elem=matcherOut[i])&&(temp=postFinder?indexOf(seed,elem):preMap[i])>-1){seed[temp]=!(results[temp]=elem);}}} // Add elements to results, through postFinder if defined
	}else {matcherOut=condense(matcherOut===results?matcherOut.splice(preexisting,matcherOut.length):matcherOut);if(postFinder){postFinder(null,results,matcherOut,xml);}else {push.apply(results,matcherOut);}}});}function matcherFromTokens(tokens){var checkContext,matcher,j,len=tokens.length,leadingRelative=Expr.relative[tokens[0].type],implicitRelative=leadingRelative||Expr.relative[" "],i=leadingRelative?1:0, // The foundational matcher ensures that elements are reachable from top-level context(s)
	matchContext=addCombinator(function(elem){return elem===checkContext;},implicitRelative,true),matchAnyContext=addCombinator(function(elem){return indexOf(checkContext,elem)>-1;},implicitRelative,true),matchers=[function(elem,context,xml){var ret=!leadingRelative&&(xml||context!==outermostContext)||((checkContext=context).nodeType?matchContext(elem,context,xml):matchAnyContext(elem,context,xml)); // Avoid hanging onto element (issue #299)
	checkContext=null;return ret;}];for(;i<len;i++){if(matcher=Expr.relative[tokens[i].type]){matchers=[addCombinator(elementMatcher(matchers),matcher)];}else {matcher=Expr.filter[tokens[i].type].apply(null,tokens[i].matches); // Return special upon seeing a positional matcher
	if(matcher[expando]){ // Find the next relative operator (if any) for proper handling
	j=++i;for(;j<len;j++){if(Expr.relative[tokens[j].type]){break;}}return setMatcher(i>1&&elementMatcher(matchers),i>1&&toSelector( // If the preceding token was a descendant combinator, insert an implicit any-element `*`
	tokens.slice(0,i-1).concat({value:tokens[i-2].type===" "?"*":""})).replace(rtrim,"$1"),matcher,i<j&&matcherFromTokens(tokens.slice(i,j)),j<len&&matcherFromTokens(tokens=tokens.slice(j)),j<len&&toSelector(tokens));}matchers.push(matcher);}}return elementMatcher(matchers);}function matcherFromGroupMatchers(elementMatchers,setMatchers){var bySet=setMatchers.length>0,byElement=elementMatchers.length>0,superMatcher=function superMatcher(seed,context,xml,results,outermost){var elem,j,matcher,matchedCount=0,i="0",unmatched=seed&&[],setMatched=[],contextBackup=outermostContext, // We must always have either seed elements or outermost context
	elems=seed||byElement&&Expr.find["TAG"]("*",outermost), // Use integer dirruns iff this is the outermost matcher
	dirrunsUnique=dirruns+=contextBackup==null?1:Math.random()||0.1,len=elems.length;if(outermost){outermostContext=context===document||context||outermost;} // Add elements passing elementMatchers directly to results
	// Support: IE<9, Safari
	// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
	for(;i!==len&&(elem=elems[i])!=null;i++){if(byElement&&elem){j=0;if(!context&&elem.ownerDocument!==document){setDocument(elem);xml=!documentIsHTML;}while(matcher=elementMatchers[j++]){if(matcher(elem,context||document,xml)){results.push(elem);break;}}if(outermost){dirruns=dirrunsUnique;}} // Track unmatched elements for set filters
	if(bySet){ // They will have gone through all possible matchers
	if(elem=!matcher&&elem){matchedCount--;} // Lengthen the array for every element, matched or not
	if(seed){unmatched.push(elem);}}} // `i` is now the count of elements visited above, and adding it to `matchedCount`
	// makes the latter nonnegative.
	matchedCount+=i; // Apply set filters to unmatched elements
	// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
	// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
	// no element matchers and no seed.
	// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
	// case, which will result in a "00" `matchedCount` that differs from `i` but is also
	// numerically zero.
	if(bySet&&i!==matchedCount){j=0;while(matcher=setMatchers[j++]){matcher(unmatched,setMatched,context,xml);}if(seed){ // Reintegrate element matches to eliminate the need for sorting
	if(matchedCount>0){while(i--){if(!(unmatched[i]||setMatched[i])){setMatched[i]=pop.call(results);}}} // Discard index placeholder values to get only actual matches
	setMatched=condense(setMatched);} // Add matches to results
	push.apply(results,setMatched); // Seedless set matches succeeding multiple successful matchers stipulate sorting
	if(outermost&&!seed&&setMatched.length>0&&matchedCount+setMatchers.length>1){Sizzle.uniqueSort(results);}} // Override manipulation of globals by nested matchers
	if(outermost){dirruns=dirrunsUnique;outermostContext=contextBackup;}return unmatched;};return bySet?markFunction(superMatcher):superMatcher;}compile=Sizzle.compile=function(selector,match /* Internal Use Only */){var i,setMatchers=[],elementMatchers=[],cached=compilerCache[selector+" "];if(!cached){ // Generate a function of recursive functions that can be used to check each element
	if(!match){match=tokenize(selector);}i=match.length;while(i--){cached=matcherFromTokens(match[i]);if(cached[expando]){setMatchers.push(cached);}else {elementMatchers.push(cached);}} // Cache the compiled function
	cached=compilerCache(selector,matcherFromGroupMatchers(elementMatchers,setMatchers)); // Save selector and tokenization
	cached.selector=selector;}return cached;}; /**
	 * A low-level selection function that works with Sizzle's compiled
	 *  selector functions
	 * @param {String|Function} selector A selector or a pre-compiled
	 *  selector function built with Sizzle.compile
	 * @param {Element} context
	 * @param {Array} [results]
	 * @param {Array} [seed] A set of elements to match against
	 */select=Sizzle.select=function(selector,context,results,seed){var i,tokens,token,type,find,compiled=typeof selector==="function"&&selector,match=!seed&&tokenize(selector=compiled.selector||selector);results=results||[]; // Try to minimize operations if there is only one selector in the list and no seed
	// (the latter of which guarantees us context)
	if(match.length===1){ // Reduce context if the leading compound selector is an ID
	tokens=match[0]=match[0].slice(0);if(tokens.length>2&&(token=tokens[0]).type==="ID"&&support.getById&&context.nodeType===9&&documentIsHTML&&Expr.relative[tokens[1].type]){context=(Expr.find["ID"](token.matches[0].replace(runescape,funescape),context)||[])[0];if(!context){return results; // Precompiled matchers will still verify ancestry, so step up a level
	}else if(compiled){context=context.parentNode;}selector=selector.slice(tokens.shift().value.length);} // Fetch a seed set for right-to-left matching
	i=matchExpr["needsContext"].test(selector)?0:tokens.length;while(i--){token=tokens[i]; // Abort if we hit a combinator
	if(Expr.relative[type=token.type]){break;}if(find=Expr.find[type]){ // Search, expanding context for leading sibling combinators
	if(seed=find(token.matches[0].replace(runescape,funescape),rsibling.test(tokens[0].type)&&testContext(context.parentNode)||context)){ // If seed is empty or no tokens remain, we can return early
	tokens.splice(i,1);selector=seed.length&&toSelector(tokens);if(!selector){push.apply(results,seed);return results;}break;}}}} // Compile and execute a filtering function if one is not provided
	// Provide `match` to avoid retokenization if we modified the selector above
	(compiled||compile(selector,match))(seed,context,!documentIsHTML,results,!context||rsibling.test(selector)&&testContext(context.parentNode)||context);return results;}; // One-time assignments
	// Sort stability
	support.sortStable=expando.split("").sort(sortOrder).join("")===expando; // Support: Chrome 14-35+
	// Always assume duplicates if they aren't passed to the comparison function
	support.detectDuplicates=!!hasDuplicate; // Initialize against the default document
	setDocument(); // Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
	// Detached nodes confoundingly follow *each other*
	support.sortDetached=assert(function(div1){ // Should return 1, but returns 4 (following)
	return div1.compareDocumentPosition(document.createElement("div"))&1;}); // Support: IE<8
	// Prevent attribute/property "interpolation"
	// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
	if(!assert(function(div){div.innerHTML="<a href='#'></a>";return div.firstChild.getAttribute("href")==="#";})){addHandle("type|href|height|width",function(elem,name,isXML){if(!isXML){return elem.getAttribute(name,name.toLowerCase()==="type"?1:2);}});} // Support: IE<9
	// Use defaultValue in place of getAttribute("value")
	if(!support.attributes||!assert(function(div){div.innerHTML="<input/>";div.firstChild.setAttribute("value","");return div.firstChild.getAttribute("value")==="";})){addHandle("value",function(elem,name,isXML){if(!isXML&&elem.nodeName.toLowerCase()==="input"){return elem.defaultValue;}});} // Support: IE<9
	// Use getAttributeNode to fetch booleans when getAttribute lies
	if(!assert(function(div){return div.getAttribute("disabled")==null;})){addHandle(booleans,function(elem,name,isXML){var val;if(!isXML){return elem[name]===true?name.toLowerCase():(val=elem.getAttributeNode(name))&&val.specified?val.value:null;}});}return Sizzle;}(window);jQuery.find=Sizzle;jQuery.expr=Sizzle.selectors;jQuery.expr[":"]=jQuery.expr.pseudos;jQuery.uniqueSort=jQuery.unique=Sizzle.uniqueSort;jQuery.text=Sizzle.getText;jQuery.isXMLDoc=Sizzle.isXML;jQuery.contains=Sizzle.contains;var dir=function dir(elem,_dir,until){var matched=[],truncate=until!==undefined;while((elem=elem[_dir])&&elem.nodeType!==9){if(elem.nodeType===1){if(truncate&&jQuery(elem).is(until)){break;}matched.push(elem);}}return matched;};var _siblings=function _siblings(n,elem){var matched=[];for(;n;n=n.nextSibling){if(n.nodeType===1&&n!==elem){matched.push(n);}}return matched;};var rneedsContext=jQuery.expr.match.needsContext;var rsingleTag=/^<([\w-]+)\s*\/?>(?:<\/\1>|)$/;var risSimple=/^.[^:#\[\.,]*$/; // Implement the identical functionality for filter and not
	function winnow(elements,qualifier,not){if(jQuery.isFunction(qualifier)){return jQuery.grep(elements,function(elem,i){ /* jshint -W018 */return !!qualifier.call(elem,i,elem)!==not;});}if(qualifier.nodeType){return jQuery.grep(elements,function(elem){return elem===qualifier!==not;});}if(typeof qualifier==="string"){if(risSimple.test(qualifier)){return jQuery.filter(qualifier,elements,not);}qualifier=jQuery.filter(qualifier,elements);}return jQuery.grep(elements,function(elem){return indexOf.call(qualifier,elem)>-1!==not;});}jQuery.filter=function(expr,elems,not){var elem=elems[0];if(not){expr=":not("+expr+")";}return elems.length===1&&elem.nodeType===1?jQuery.find.matchesSelector(elem,expr)?[elem]:[]:jQuery.find.matches(expr,jQuery.grep(elems,function(elem){return elem.nodeType===1;}));};jQuery.fn.extend({find:function find(selector){var i,len=this.length,ret=[],self=this;if(typeof selector!=="string"){return this.pushStack(jQuery(selector).filter(function(){for(i=0;i<len;i++){if(jQuery.contains(self[i],this)){return true;}}}));}for(i=0;i<len;i++){jQuery.find(selector,self[i],ret);} // Needed because $( selector, context ) becomes $( context ).find( selector )
	ret=this.pushStack(len>1?jQuery.unique(ret):ret);ret.selector=this.selector?this.selector+" "+selector:selector;return ret;},filter:function filter(selector){return this.pushStack(winnow(this,selector||[],false));},not:function not(selector){return this.pushStack(winnow(this,selector||[],true));},is:function is(selector){return !!winnow(this, // If this is a positional/relative selector, check membership in the returned set
	// so $("p:first").is("p:last") won't return true for a doc with two "p".
	typeof selector==="string"&&rneedsContext.test(selector)?jQuery(selector):selector||[],false).length;}}); // Initialize a jQuery object
	// A central reference to the root jQuery(document)
	var rootjQuery, // A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	rquickExpr=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,init=jQuery.fn.init=function(selector,context,root){var match,elem; // HANDLE: $(""), $(null), $(undefined), $(false)
	if(!selector){return this;} // Method init() accepts an alternate rootjQuery
	// so migrate can support jQuery.sub (gh-2101)
	root=root||rootjQuery; // Handle HTML strings
	if(typeof selector==="string"){if(selector[0]==="<"&&selector[selector.length-1]===">"&&selector.length>=3){ // Assume that strings that start and end with <> are HTML and skip the regex check
	match=[null,selector,null];}else {match=rquickExpr.exec(selector);} // Match html or make sure no context is specified for #id
	if(match&&(match[1]||!context)){ // HANDLE: $(html) -> $(array)
	if(match[1]){context=context instanceof jQuery?context[0]:context; // Option to run scripts is true for back-compat
	// Intentionally let the error be thrown if parseHTML is not present
	jQuery.merge(this,jQuery.parseHTML(match[1],context&&context.nodeType?context.ownerDocument||context:document,true)); // HANDLE: $(html, props)
	if(rsingleTag.test(match[1])&&jQuery.isPlainObject(context)){for(match in context){ // Properties of context are called as methods if possible
	if(jQuery.isFunction(this[match])){this[match](context[match]); // ...and otherwise set as attributes
	}else {this.attr(match,context[match]);}}}return this; // HANDLE: $(#id)
	}else {elem=document.getElementById(match[2]); // Support: Blackberry 4.6
	// gEBID returns nodes no longer in the document (#6963)
	if(elem&&elem.parentNode){ // Inject the element directly into the jQuery object
	this.length=1;this[0]=elem;}this.context=document;this.selector=selector;return this;} // HANDLE: $(expr, $(...))
	}else if(!context||context.jquery){return (context||root).find(selector); // HANDLE: $(expr, context)
	// (which is just equivalent to: $(context).find(expr)
	}else {return this.constructor(context).find(selector);} // HANDLE: $(DOMElement)
	}else if(selector.nodeType){this.context=this[0]=selector;this.length=1;return this; // HANDLE: $(function)
	// Shortcut for document ready
	}else if(jQuery.isFunction(selector)){return root.ready!==undefined?root.ready(selector): // Execute immediately if ready is not present
	selector(jQuery);}if(selector.selector!==undefined){this.selector=selector.selector;this.context=selector.context;}return jQuery.makeArray(selector,this);}; // Give the init function the jQuery prototype for later instantiation
	init.prototype=jQuery.fn; // Initialize central reference
	rootjQuery=jQuery(document);var rparentsprev=/^(?:parents|prev(?:Until|All))/, // Methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique={children:true,contents:true,next:true,prev:true};jQuery.fn.extend({has:function has(target){var targets=jQuery(target,this),l=targets.length;return this.filter(function(){var i=0;for(;i<l;i++){if(jQuery.contains(this,targets[i])){return true;}}});},closest:function closest(selectors,context){var cur,i=0,l=this.length,matched=[],pos=rneedsContext.test(selectors)||typeof selectors!=="string"?jQuery(selectors,context||this.context):0;for(;i<l;i++){for(cur=this[i];cur&&cur!==context;cur=cur.parentNode){ // Always skip document fragments
	if(cur.nodeType<11&&(pos?pos.index(cur)>-1: // Don't pass non-elements to Sizzle
	cur.nodeType===1&&jQuery.find.matchesSelector(cur,selectors))){matched.push(cur);break;}}}return this.pushStack(matched.length>1?jQuery.uniqueSort(matched):matched);}, // Determine the position of an element within the set
	index:function index(elem){ // No argument, return index in parent
	if(!elem){return this[0]&&this[0].parentNode?this.first().prevAll().length:-1;} // Index in selector
	if(typeof elem==="string"){return indexOf.call(jQuery(elem),this[0]);} // Locate the position of the desired element
	return indexOf.call(this, // If it receives a jQuery object, the first element is used
	elem.jquery?elem[0]:elem);},add:function add(selector,context){return this.pushStack(jQuery.uniqueSort(jQuery.merge(this.get(),jQuery(selector,context))));},addBack:function addBack(selector){return this.add(selector==null?this.prevObject:this.prevObject.filter(selector));}});function sibling(cur,dir){while((cur=cur[dir])&&cur.nodeType!==1){}return cur;}jQuery.each({parent:function parent(elem){var parent=elem.parentNode;return parent&&parent.nodeType!==11?parent:null;},parents:function parents(elem){return dir(elem,"parentNode");},parentsUntil:function parentsUntil(elem,i,until){return dir(elem,"parentNode",until);},next:function next(elem){return sibling(elem,"nextSibling");},prev:function prev(elem){return sibling(elem,"previousSibling");},nextAll:function nextAll(elem){return dir(elem,"nextSibling");},prevAll:function prevAll(elem){return dir(elem,"previousSibling");},nextUntil:function nextUntil(elem,i,until){return dir(elem,"nextSibling",until);},prevUntil:function prevUntil(elem,i,until){return dir(elem,"previousSibling",until);},siblings:function siblings(elem){return _siblings((elem.parentNode||{}).firstChild,elem);},children:function children(elem){return _siblings(elem.firstChild);},contents:function contents(elem){return elem.contentDocument||jQuery.merge([],elem.childNodes);}},function(name,fn){jQuery.fn[name]=function(until,selector){var matched=jQuery.map(this,fn,until);if(name.slice(-5)!=="Until"){selector=until;}if(selector&&typeof selector==="string"){matched=jQuery.filter(selector,matched);}if(this.length>1){ // Remove duplicates
	if(!guaranteedUnique[name]){jQuery.uniqueSort(matched);} // Reverse order for parents* and prev-derivatives
	if(rparentsprev.test(name)){matched.reverse();}}return this.pushStack(matched);};});var rnotwhite=/\S+/g; // Convert String-formatted options into Object-formatted ones
	function createOptions(options){var object={};jQuery.each(options.match(rnotwhite)||[],function(_,flag){object[flag]=true;});return object;} /*
	 * Create a callback list using the following parameters:
	 *
	 *	options: an optional list of space-separated options that will change how
	 *			the callback list behaves or a more traditional option object
	 *
	 * By default a callback list will act like an event callback list and can be
	 * "fired" multiple times.
	 *
	 * Possible options:
	 *
	 *	once:			will ensure the callback list can only be fired once (like a Deferred)
	 *
	 *	memory:			will keep track of previous values and will call any callback added
	 *					after the list has been fired right away with the latest "memorized"
	 *					values (like a Deferred)
	 *
	 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
	 *
	 *	stopOnFalse:	interrupt callings when a callback returns false
	 *
	 */jQuery.Callbacks=function(options){ // Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options=typeof options==="string"?createOptions(options):jQuery.extend({},options);var  // Flag to know if list is currently firing
	firing, // Last fire value for non-forgettable lists
	memory, // Flag to know if list was already fired
	_fired, // Flag to prevent firing
	_locked, // Actual callback list
	list=[], // Queue of execution data for repeatable lists
	queue=[], // Index of currently firing callback (modified by add/remove as needed)
	firingIndex=-1, // Fire callbacks
	fire=function fire(){ // Enforce single-firing
	_locked=options.once; // Execute callbacks for all pending executions,
	// respecting firingIndex overrides and runtime changes
	_fired=firing=true;for(;queue.length;firingIndex=-1){memory=queue.shift();while(++firingIndex<list.length){ // Run callback and check for early termination
	if(list[firingIndex].apply(memory[0],memory[1])===false&&options.stopOnFalse){ // Jump to end and forget the data so .add doesn't re-fire
	firingIndex=list.length;memory=false;}}} // Forget the data if we're done with it
	if(!options.memory){memory=false;}firing=false; // Clean up if we're done firing for good
	if(_locked){ // Keep an empty list if we have data for future add calls
	if(memory){list=[]; // Otherwise, this object is spent
	}else {list="";}}}, // Actual Callbacks object
	self={ // Add a callback or a collection of callbacks to the list
	add:function add(){if(list){ // If we have memory from a past run, we should fire after adding
	if(memory&&!firing){firingIndex=list.length-1;queue.push(memory);}(function add(args){jQuery.each(args,function(_,arg){if(jQuery.isFunction(arg)){if(!options.unique||!self.has(arg)){list.push(arg);}}else if(arg&&arg.length&&jQuery.type(arg)!=="string"){ // Inspect recursively
	add(arg);}});})(arguments);if(memory&&!firing){fire();}}return this;}, // Remove a callback from the list
	remove:function remove(){jQuery.each(arguments,function(_,arg){var index;while((index=jQuery.inArray(arg,list,index))>-1){list.splice(index,1); // Handle firing indexes
	if(index<=firingIndex){firingIndex--;}}});return this;}, // Check if a given callback is in the list.
	// If no argument is given, return whether or not list has callbacks attached.
	has:function has(fn){return fn?jQuery.inArray(fn,list)>-1:list.length>0;}, // Remove all callbacks from the list
	empty:function empty(){if(list){list=[];}return this;}, // Disable .fire and .add
	// Abort any current/pending executions
	// Clear all callbacks and values
	disable:function disable(){_locked=queue=[];list=memory="";return this;},disabled:function disabled(){return !list;}, // Disable .fire
	// Also disable .add unless we have memory (since it would have no effect)
	// Abort any pending executions
	lock:function lock(){_locked=queue=[];if(!memory){list=memory="";}return this;},locked:function locked(){return !!_locked;}, // Call all callbacks with the given context and arguments
	fireWith:function fireWith(context,args){if(!_locked){args=args||[];args=[context,args.slice?args.slice():args];queue.push(args);if(!firing){fire();}}return this;}, // Call all the callbacks with the given arguments
	fire:function fire(){self.fireWith(this,arguments);return this;}, // To know if the callbacks have already been called at least once
	fired:function fired(){return !!_fired;}};return self;};jQuery.extend({Deferred:function Deferred(func){var tuples=[ // action, add listener, listener list, final state
	["resolve","done",jQuery.Callbacks("once memory"),"resolved"],["reject","fail",jQuery.Callbacks("once memory"),"rejected"],["notify","progress",jQuery.Callbacks("memory")]],_state="pending",_promise={state:function state(){return _state;},always:function always(){deferred.done(arguments).fail(arguments);return this;},then:function then() /* fnDone, fnFail, fnProgress */{var fns=arguments;return jQuery.Deferred(function(newDefer){jQuery.each(tuples,function(i,tuple){var fn=jQuery.isFunction(fns[i])&&fns[i]; // deferred[ done | fail | progress ] for forwarding actions to newDefer
	deferred[tuple[1]](function(){var returned=fn&&fn.apply(this,arguments);if(returned&&jQuery.isFunction(returned.promise)){returned.promise().progress(newDefer.notify).done(newDefer.resolve).fail(newDefer.reject);}else {newDefer[tuple[0]+"With"](this===_promise?newDefer.promise():this,fn?[returned]:arguments);}});});fns=null;}).promise();}, // Get a promise for this deferred
	// If obj is provided, the promise aspect is added to the object
	promise:function promise(obj){return obj!=null?jQuery.extend(obj,_promise):_promise;}},deferred={}; // Keep pipe for back-compat
	_promise.pipe=_promise.then; // Add list-specific methods
	jQuery.each(tuples,function(i,tuple){var list=tuple[2],stateString=tuple[3]; // promise[ done | fail | progress ] = list.add
	_promise[tuple[1]]=list.add; // Handle state
	if(stateString){list.add(function(){ // state = [ resolved | rejected ]
	_state=stateString; // [ reject_list | resolve_list ].disable; progress_list.lock
	},tuples[i^1][2].disable,tuples[2][2].lock);} // deferred[ resolve | reject | notify ]
	deferred[tuple[0]]=function(){deferred[tuple[0]+"With"](this===deferred?_promise:this,arguments);return this;};deferred[tuple[0]+"With"]=list.fireWith;}); // Make the deferred a promise
	_promise.promise(deferred); // Call given func if any
	if(func){func.call(deferred,deferred);} // All done!
	return deferred;}, // Deferred helper
	when:function when(subordinate /* , ..., subordinateN */){var i=0,resolveValues=_slice.call(arguments),length=resolveValues.length, // the count of uncompleted subordinates
	remaining=length!==1||subordinate&&jQuery.isFunction(subordinate.promise)?length:0, // the master Deferred.
	// If resolveValues consist of only a single Deferred, just use that.
	deferred=remaining===1?subordinate:jQuery.Deferred(), // Update function for both resolve and progress values
	updateFunc=function updateFunc(i,contexts,values){return function(value){contexts[i]=this;values[i]=arguments.length>1?_slice.call(arguments):value;if(values===progressValues){deferred.notifyWith(contexts,values);}else if(! --remaining){deferred.resolveWith(contexts,values);}};},progressValues,progressContexts,resolveContexts; // Add listeners to Deferred subordinates; treat others as resolved
	if(length>1){progressValues=new Array(length);progressContexts=new Array(length);resolveContexts=new Array(length);for(;i<length;i++){if(resolveValues[i]&&jQuery.isFunction(resolveValues[i].promise)){resolveValues[i].promise().progress(updateFunc(i,progressContexts,progressValues)).done(updateFunc(i,resolveContexts,resolveValues)).fail(deferred.reject);}else {--remaining;}}} // If we're not waiting on anything, resolve the master
	if(!remaining){deferred.resolveWith(resolveContexts,resolveValues);}return deferred.promise();}}); // The deferred used on DOM ready
	var readyList;jQuery.fn.ready=function(fn){ // Add the callback
	jQuery.ready.promise().done(fn);return this;};jQuery.extend({ // Is the DOM ready to be used? Set to true once it occurs.
	isReady:false, // A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait:1, // Hold (or release) the ready event
	holdReady:function holdReady(hold){if(hold){jQuery.readyWait++;}else {jQuery.ready(true);}}, // Handle when the DOM is ready
	ready:function ready(wait){ // Abort if there are pending holds or we're already ready
	if(wait===true?--jQuery.readyWait:jQuery.isReady){return;} // Remember that the DOM is ready
	jQuery.isReady=true; // If a normal DOM Ready event fired, decrement, and wait if need be
	if(wait!==true&&--jQuery.readyWait>0){return;} // If there are functions bound, to execute
	readyList.resolveWith(document,[jQuery]); // Trigger any bound ready events
	if(jQuery.fn.triggerHandler){jQuery(document).triggerHandler("ready");jQuery(document).off("ready");}}}); /**
	 * The ready event handler and self cleanup method
	 */function completed(){document.removeEventListener("DOMContentLoaded",completed);window.removeEventListener("load",completed);jQuery.ready();}jQuery.ready.promise=function(obj){if(!readyList){readyList=jQuery.Deferred(); // Catch cases where $(document).ready() is called
	// after the browser event has already occurred.
	// Support: IE9-10 only
	// Older IE sometimes signals "interactive" too soon
	if(document.readyState==="complete"||document.readyState!=="loading"&&!document.documentElement.doScroll){ // Handle it asynchronously to allow scripts the opportunity to delay ready
	window.setTimeout(jQuery.ready);}else { // Use the handy event callback
	document.addEventListener("DOMContentLoaded",completed); // A fallback to window.onload, that will always work
	window.addEventListener("load",completed);}}return readyList.promise(obj);}; // Kick off the DOM ready check even if the user does not
	jQuery.ready.promise(); // Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
	var access=function access(elems,fn,key,value,chainable,emptyGet,raw){var i=0,len=elems.length,bulk=key==null; // Sets many values
	if(jQuery.type(key)==="object"){chainable=true;for(i in key){access(elems,fn,i,key[i],true,emptyGet,raw);} // Sets one value
	}else if(value!==undefined){chainable=true;if(!jQuery.isFunction(value)){raw=true;}if(bulk){ // Bulk operations run against the entire set
	if(raw){fn.call(elems,value);fn=null; // ...except when executing function values
	}else {bulk=fn;fn=function fn(elem,key,value){return bulk.call(jQuery(elem),value);};}}if(fn){for(;i<len;i++){fn(elems[i],key,raw?value:value.call(elems[i],i,fn(elems[i],key)));}}}return chainable?elems: // Gets
	bulk?fn.call(elems):len?fn(elems[0],key):emptyGet;};var acceptData=function acceptData(owner){ // Accepts only:
	//  - Node
	//    - Node.ELEMENT_NODE
	//    - Node.DOCUMENT_NODE
	//  - Object
	//    - Any
	/* jshint -W018 */return owner.nodeType===1||owner.nodeType===9||! +owner.nodeType;};function Data(){this.expando=jQuery.expando+Data.uid++;}Data.uid=1;Data.prototype={register:function register(owner,initial){var value=initial||{}; // If it is a node unlikely to be stringify-ed or looped over
	// use plain assignment
	if(owner.nodeType){owner[this.expando]=value; // Otherwise secure it in a non-enumerable, non-writable property
	// configurability must be true to allow the property to be
	// deleted with the delete operator
	}else {Object.defineProperty(owner,this.expando,{value:value,writable:true,configurable:true});}return owner[this.expando];},cache:function cache(owner){ // We can accept data for non-element nodes in modern browsers,
	// but we should not, see #8335.
	// Always return an empty object.
	if(!acceptData(owner)){return {};} // Check if the owner object already has a cache
	var value=owner[this.expando]; // If not, create one
	if(!value){value={}; // We can accept data for non-element nodes in modern browsers,
	// but we should not, see #8335.
	// Always return an empty object.
	if(acceptData(owner)){ // If it is a node unlikely to be stringify-ed or looped over
	// use plain assignment
	if(owner.nodeType){owner[this.expando]=value; // Otherwise secure it in a non-enumerable property
	// configurable must be true to allow the property to be
	// deleted when data is removed
	}else {Object.defineProperty(owner,this.expando,{value:value,configurable:true});}}}return value;},set:function set(owner,data,value){var prop,cache=this.cache(owner); // Handle: [ owner, key, value ] args
	if(typeof data==="string"){cache[data]=value; // Handle: [ owner, { properties } ] args
	}else { // Copy the properties one-by-one to the cache object
	for(prop in data){cache[prop]=data[prop];}}return cache;},get:function get(owner,key){return key===undefined?this.cache(owner):owner[this.expando]&&owner[this.expando][key];},access:function access(owner,key,value){var stored; // In cases where either:
	//
	//   1. No key was specified
	//   2. A string key was specified, but no value provided
	//
	// Take the "read" path and allow the get method to determine
	// which value to return, respectively either:
	//
	//   1. The entire cache object
	//   2. The data stored at the key
	//
	if(key===undefined||key&&typeof key==="string"&&value===undefined){stored=this.get(owner,key);return stored!==undefined?stored:this.get(owner,jQuery.camelCase(key));} // When the key is not a string, or both a key and value
	// are specified, set or extend (existing objects) with either:
	//
	//   1. An object of properties
	//   2. A key and value
	//
	this.set(owner,key,value); // Since the "set" path can have two possible entry points
	// return the expected data based on which path was taken[*]
	return value!==undefined?value:key;},remove:function remove(owner,key){var i,name,camel,cache=owner[this.expando];if(cache===undefined){return;}if(key===undefined){this.register(owner);}else { // Support array or space separated string of keys
	if(jQuery.isArray(key)){ // If "name" is an array of keys...
	// When data is initially created, via ("key", "val") signature,
	// keys will be converted to camelCase.
	// Since there is no way to tell _how_ a key was added, remove
	// both plain key and camelCase key. #12786
	// This will only penalize the array argument path.
	name=key.concat(key.map(jQuery.camelCase));}else {camel=jQuery.camelCase(key); // Try the string as a key before any manipulation
	if(key in cache){name=[key,camel];}else { // If a key with the spaces exists, use it.
	// Otherwise, create an array by matching non-whitespace
	name=camel;name=name in cache?[name]:name.match(rnotwhite)||[];}}i=name.length;while(i--){delete cache[name[i]];}} // Remove the expando if there's no more data
	if(key===undefined||jQuery.isEmptyObject(cache)){ // Support: Chrome <= 35-45+
	// Webkit & Blink performance suffers when deleting properties
	// from DOM nodes, so set to undefined instead
	// https://code.google.com/p/chromium/issues/detail?id=378607
	if(owner.nodeType){owner[this.expando]=undefined;}else {delete owner[this.expando];}}},hasData:function hasData(owner){var cache=owner[this.expando];return cache!==undefined&&!jQuery.isEmptyObject(cache);}};var dataPriv=new Data();var dataUser=new Data(); //	Implementation Summary
	//
	//	1. Enforce API surface and semantic compatibility with 1.9.x branch
	//	2. Improve the module's maintainability by reducing the storage
	//		paths to a single mechanism.
	//	3. Use the same single mechanism to support "private" and "user" data.
	//	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
	//	5. Avoid exposing implementation details on user objects (eg. expando properties)
	//	6. Provide a clear path for implementation upgrade to WeakMap in 2014
	var rbrace=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,rmultiDash=/[A-Z]/g;function dataAttr(elem,key,data){var name; // If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if(data===undefined&&elem.nodeType===1){name="data-"+key.replace(rmultiDash,"-$&").toLowerCase();data=elem.getAttribute(name);if(typeof data==="string"){try{data=data==="true"?true:data==="false"?false:data==="null"?null: // Only convert to a number if it doesn't change the string
	+data+""===data?+data:rbrace.test(data)?jQuery.parseJSON(data):data;}catch(e){} // Make sure we set the data so it isn't changed later
	dataUser.set(elem,key,data);}else {data=undefined;}}return data;}jQuery.extend({hasData:function hasData(elem){return dataUser.hasData(elem)||dataPriv.hasData(elem);},data:function data(elem,name,_data){return dataUser.access(elem,name,_data);},removeData:function removeData(elem,name){dataUser.remove(elem,name);}, // TODO: Now that all calls to _data and _removeData have been replaced
	// with direct calls to dataPriv methods, these can be deprecated.
	_data:function _data(elem,name,data){return dataPriv.access(elem,name,data);},_removeData:function _removeData(elem,name){dataPriv.remove(elem,name);}});jQuery.fn.extend({data:function data(key,value){var i,name,data,elem=this[0],attrs=elem&&elem.attributes; // Gets all values
	if(key===undefined){if(this.length){data=dataUser.get(elem);if(elem.nodeType===1&&!dataPriv.get(elem,"hasDataAttrs")){i=attrs.length;while(i--){ // Support: IE11+
	// The attrs elements can be null (#14894)
	if(attrs[i]){name=attrs[i].name;if(name.indexOf("data-")===0){name=jQuery.camelCase(name.slice(5));dataAttr(elem,name,data[name]);}}}dataPriv.set(elem,"hasDataAttrs",true);}}return data;} // Sets multiple values
	if((typeof key==="undefined"?"undefined":_typeof(key))==="object"){return this.each(function(){dataUser.set(this,key);});}return access(this,function(value){var data,camelKey; // The calling jQuery object (element matches) is not empty
	// (and therefore has an element appears at this[ 0 ]) and the
	// `value` parameter was not undefined. An empty jQuery object
	// will result in `undefined` for elem = this[ 0 ] which will
	// throw an exception if an attempt to read a data cache is made.
	if(elem&&value===undefined){ // Attempt to get data from the cache
	// with the key as-is
	data=dataUser.get(elem,key)|| // Try to find dashed key if it exists (gh-2779)
	// This is for 2.2.x only
	dataUser.get(elem,key.replace(rmultiDash,"-$&").toLowerCase());if(data!==undefined){return data;}camelKey=jQuery.camelCase(key); // Attempt to get data from the cache
	// with the key camelized
	data=dataUser.get(elem,camelKey);if(data!==undefined){return data;} // Attempt to "discover" the data in
	// HTML5 custom data-* attrs
	data=dataAttr(elem,camelKey,undefined);if(data!==undefined){return data;} // We tried really hard, but the data doesn't exist.
	return;} // Set the data...
	camelKey=jQuery.camelCase(key);this.each(function(){ // First, attempt to store a copy or reference of any
	// data that might've been store with a camelCased key.
	var data=dataUser.get(this,camelKey); // For HTML5 data-* attribute interop, we have to
	// store property names with dashes in a camelCase form.
	// This might not apply to all properties...*
	dataUser.set(this,camelKey,value); // *... In the case of properties that might _actually_
	// have dashes, we need to also store a copy of that
	// unchanged property.
	if(key.indexOf("-")>-1&&data!==undefined){dataUser.set(this,key,value);}});},null,value,arguments.length>1,null,true);},removeData:function removeData(key){return this.each(function(){dataUser.remove(this,key);});}});jQuery.extend({queue:function queue(elem,type,data){var queue;if(elem){type=(type||"fx")+"queue";queue=dataPriv.get(elem,type); // Speed up dequeue by getting out quickly if this is just a lookup
	if(data){if(!queue||jQuery.isArray(data)){queue=dataPriv.access(elem,type,jQuery.makeArray(data));}else {queue.push(data);}}return queue||[];}},dequeue:function dequeue(elem,type){type=type||"fx";var queue=jQuery.queue(elem,type),startLength=queue.length,fn=queue.shift(),hooks=jQuery._queueHooks(elem,type),next=function next(){jQuery.dequeue(elem,type);}; // If the fx queue is dequeued, always remove the progress sentinel
	if(fn==="inprogress"){fn=queue.shift();startLength--;}if(fn){ // Add a progress sentinel to prevent the fx queue from being
	// automatically dequeued
	if(type==="fx"){queue.unshift("inprogress");} // Clear up the last queue stop function
	delete hooks.stop;fn.call(elem,next,hooks);}if(!startLength&&hooks){hooks.empty.fire();}}, // Not public - generate a queueHooks object, or return the current one
	_queueHooks:function _queueHooks(elem,type){var key=type+"queueHooks";return dataPriv.get(elem,key)||dataPriv.access(elem,key,{empty:jQuery.Callbacks("once memory").add(function(){dataPriv.remove(elem,[type+"queue",key]);})});}});jQuery.fn.extend({queue:function queue(type,data){var setter=2;if(typeof type!=="string"){data=type;type="fx";setter--;}if(arguments.length<setter){return jQuery.queue(this[0],type);}return data===undefined?this:this.each(function(){var queue=jQuery.queue(this,type,data); // Ensure a hooks for this queue
	jQuery._queueHooks(this,type);if(type==="fx"&&queue[0]!=="inprogress"){jQuery.dequeue(this,type);}});},dequeue:function dequeue(type){return this.each(function(){jQuery.dequeue(this,type);});},clearQueue:function clearQueue(type){return this.queue(type||"fx",[]);}, // Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise:function promise(type,obj){var tmp,count=1,defer=jQuery.Deferred(),elements=this,i=this.length,resolve=function resolve(){if(! --count){defer.resolveWith(elements,[elements]);}};if(typeof type!=="string"){obj=type;type=undefined;}type=type||"fx";while(i--){tmp=dataPriv.get(elements[i],type+"queueHooks");if(tmp&&tmp.empty){count++;tmp.empty.add(resolve);}}resolve();return defer.promise(obj);}});var pnum=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source;var rcssNum=new RegExp("^(?:([+-])=|)("+pnum+")([a-z%]*)$","i");var cssExpand=["Top","Right","Bottom","Left"];var isHidden=function isHidden(elem,el){ // isHidden might be called from jQuery#filter function;
	// in that case, element will be second argument
	elem=el||elem;return jQuery.css(elem,"display")==="none"||!jQuery.contains(elem.ownerDocument,elem);};function adjustCSS(elem,prop,valueParts,tween){var adjusted,scale=1,maxIterations=20,currentValue=tween?function(){return tween.cur();}:function(){return jQuery.css(elem,prop,"");},initial=currentValue(),unit=valueParts&&valueParts[3]||(jQuery.cssNumber[prop]?"":"px"), // Starting value computation is required for potential unit mismatches
	initialInUnit=(jQuery.cssNumber[prop]||unit!=="px"&&+initial)&&rcssNum.exec(jQuery.css(elem,prop));if(initialInUnit&&initialInUnit[3]!==unit){ // Trust units reported by jQuery.css
	unit=unit||initialInUnit[3]; // Make sure we update the tween properties later on
	valueParts=valueParts||[]; // Iteratively approximate from a nonzero starting point
	initialInUnit=+initial||1;do { // If previous iteration zeroed out, double until we get *something*.
	// Use string for doubling so we don't accidentally see scale as unchanged below
	scale=scale||".5"; // Adjust and apply
	initialInUnit=initialInUnit/scale;jQuery.style(elem,prop,initialInUnit+unit); // Update scale, tolerating zero or NaN from tween.cur()
	// Break the loop if scale is unchanged or perfect, or if we've just had enough.
	}while(scale!==(scale=currentValue()/initial)&&scale!==1&&--maxIterations);}if(valueParts){initialInUnit=+initialInUnit||+initial||0; // Apply relative offset (+=/-=) if specified
	adjusted=valueParts[1]?initialInUnit+(valueParts[1]+1)*valueParts[2]:+valueParts[2];if(tween){tween.unit=unit;tween.start=initialInUnit;tween.end=adjusted;}}return adjusted;}var rcheckableType=/^(?:checkbox|radio)$/i;var rtagName=/<([\w:-]+)/;var rscriptType=/^$|\/(?:java|ecma)script/i; // We have to close these tags to support XHTML (#13200)
	var wrapMap={ // Support: IE9
	option:[1,"<select multiple='multiple'>","</select>"], // XHTML parsers do not magically insert elements in the
	// same way that tag soup parsers do. So we cannot shorten
	// this by omitting <tbody> or other required elements.
	thead:[1,"<table>","</table>"],col:[2,"<table><colgroup>","</colgroup></table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:[0,"",""]}; // Support: IE9
	wrapMap.optgroup=wrapMap.option;wrapMap.tbody=wrapMap.tfoot=wrapMap.colgroup=wrapMap.caption=wrapMap.thead;wrapMap.th=wrapMap.td;function getAll(context,tag){ // Support: IE9-11+
	// Use typeof to avoid zero-argument method invocation on host objects (#15151)
	var ret=typeof context.getElementsByTagName!=="undefined"?context.getElementsByTagName(tag||"*"):typeof context.querySelectorAll!=="undefined"?context.querySelectorAll(tag||"*"):[];return tag===undefined||tag&&jQuery.nodeName(context,tag)?jQuery.merge([context],ret):ret;} // Mark scripts as having already been evaluated
	function setGlobalEval(elems,refElements){var i=0,l=elems.length;for(;i<l;i++){dataPriv.set(elems[i],"globalEval",!refElements||dataPriv.get(refElements[i],"globalEval"));}}var rhtml=/<|&#?\w+;/;function buildFragment(elems,context,scripts,selection,ignored){var elem,tmp,tag,wrap,contains,j,fragment=context.createDocumentFragment(),nodes=[],i=0,l=elems.length;for(;i<l;i++){elem=elems[i];if(elem||elem===0){ // Add nodes directly
	if(jQuery.type(elem)==="object"){ // Support: Android<4.1, PhantomJS<2
	// push.apply(_, arraylike) throws on ancient WebKit
	jQuery.merge(nodes,elem.nodeType?[elem]:elem); // Convert non-html into a text node
	}else if(!rhtml.test(elem)){nodes.push(context.createTextNode(elem)); // Convert html into DOM nodes
	}else {tmp=tmp||fragment.appendChild(context.createElement("div")); // Deserialize a standard representation
	tag=(rtagName.exec(elem)||["",""])[1].toLowerCase();wrap=wrapMap[tag]||wrapMap._default;tmp.innerHTML=wrap[1]+jQuery.htmlPrefilter(elem)+wrap[2]; // Descend through wrappers to the right content
	j=wrap[0];while(j--){tmp=tmp.lastChild;} // Support: Android<4.1, PhantomJS<2
	// push.apply(_, arraylike) throws on ancient WebKit
	jQuery.merge(nodes,tmp.childNodes); // Remember the top-level container
	tmp=fragment.firstChild; // Ensure the created nodes are orphaned (#12392)
	tmp.textContent="";}}} // Remove wrapper from fragment
	fragment.textContent="";i=0;while(elem=nodes[i++]){ // Skip elements already in the context collection (trac-4087)
	if(selection&&jQuery.inArray(elem,selection)>-1){if(ignored){ignored.push(elem);}continue;}contains=jQuery.contains(elem.ownerDocument,elem); // Append to fragment
	tmp=getAll(fragment.appendChild(elem),"script"); // Preserve script evaluation history
	if(contains){setGlobalEval(tmp);} // Capture executables
	if(scripts){j=0;while(elem=tmp[j++]){if(rscriptType.test(elem.type||"")){scripts.push(elem);}}}}return fragment;}(function(){var fragment=document.createDocumentFragment(),div=fragment.appendChild(document.createElement("div")),input=document.createElement("input"); // Support: Android 4.0-4.3, Safari<=5.1
	// Check state lost if the name is set (#11217)
	// Support: Windows Web Apps (WWA)
	// `name` and `type` must use .setAttribute for WWA (#14901)
	input.setAttribute("type","radio");input.setAttribute("checked","checked");input.setAttribute("name","t");div.appendChild(input); // Support: Safari<=5.1, Android<4.2
	// Older WebKit doesn't clone checked state correctly in fragments
	support.checkClone=div.cloneNode(true).cloneNode(true).lastChild.checked; // Support: IE<=11+
	// Make sure textarea (and checkbox) defaultValue is properly cloned
	div.innerHTML="<textarea>x</textarea>";support.noCloneChecked=!!div.cloneNode(true).lastChild.defaultValue;})();var rkeyEvent=/^key/,rmouseEvent=/^(?:mouse|pointer|contextmenu|drag|drop)|click/,rtypenamespace=/^([^.]*)(?:\.(.+)|)/;function returnTrue(){return true;}function returnFalse(){return false;} // Support: IE9
	// See #13393 for more info
	function safeActiveElement(){try{return document.activeElement;}catch(err){}}function _on(elem,types,selector,data,fn,one){var origFn,type; // Types can be a map of types/handlers
	if((typeof types==="undefined"?"undefined":_typeof(types))==="object"){ // ( types-Object, selector, data )
	if(typeof selector!=="string"){ // ( types-Object, data )
	data=data||selector;selector=undefined;}for(type in types){_on(elem,type,selector,data,types[type],one);}return elem;}if(data==null&&fn==null){ // ( types, fn )
	fn=selector;data=selector=undefined;}else if(fn==null){if(typeof selector==="string"){ // ( types, selector, fn )
	fn=data;data=undefined;}else { // ( types, data, fn )
	fn=data;data=selector;selector=undefined;}}if(fn===false){fn=returnFalse;}else if(!fn){return this;}if(one===1){origFn=fn;fn=function fn(event){ // Can use an empty set, since event contains the info
	jQuery().off(event);return origFn.apply(this,arguments);}; // Use same guid so caller can remove using origFn
	fn.guid=origFn.guid||(origFn.guid=jQuery.guid++);}return elem.each(function(){jQuery.event.add(this,types,fn,data,selector);});} /*
	 * Helper functions for managing events -- not part of the public interface.
	 * Props to Dean Edwards' addEvent library for many of the ideas.
	 */jQuery.event={global:{},add:function add(elem,types,handler,data,selector){var handleObjIn,eventHandle,tmp,events,t,handleObj,special,handlers,type,namespaces,origType,elemData=dataPriv.get(elem); // Don't attach events to noData or text/comment nodes (but allow plain objects)
	if(!elemData){return;} // Caller can pass in an object of custom data in lieu of the handler
	if(handler.handler){handleObjIn=handler;handler=handleObjIn.handler;selector=handleObjIn.selector;} // Make sure that the handler has a unique ID, used to find/remove it later
	if(!handler.guid){handler.guid=jQuery.guid++;} // Init the element's event structure and main handler, if this is the first
	if(!(events=elemData.events)){events=elemData.events={};}if(!(eventHandle=elemData.handle)){eventHandle=elemData.handle=function(e){ // Discard the second event of a jQuery.event.trigger() and
	// when an event is called after a page has unloaded
	return typeof jQuery!=="undefined"&&jQuery.event.triggered!==e.type?jQuery.event.dispatch.apply(elem,arguments):undefined;};} // Handle multiple events separated by a space
	types=(types||"").match(rnotwhite)||[""];t=types.length;while(t--){tmp=rtypenamespace.exec(types[t])||[];type=origType=tmp[1];namespaces=(tmp[2]||"").split(".").sort(); // There *must* be a type, no attaching namespace-only handlers
	if(!type){continue;} // If event changes its type, use the special event handlers for the changed type
	special=jQuery.event.special[type]||{}; // If selector defined, determine special event api type, otherwise given type
	type=(selector?special.delegateType:special.bindType)||type; // Update special based on newly reset type
	special=jQuery.event.special[type]||{}; // handleObj is passed to all event handlers
	handleObj=jQuery.extend({type:type,origType:origType,data:data,handler:handler,guid:handler.guid,selector:selector,needsContext:selector&&jQuery.expr.match.needsContext.test(selector),namespace:namespaces.join(".")},handleObjIn); // Init the event handler queue if we're the first
	if(!(handlers=events[type])){handlers=events[type]=[];handlers.delegateCount=0; // Only use addEventListener if the special events handler returns false
	if(!special.setup||special.setup.call(elem,data,namespaces,eventHandle)===false){if(elem.addEventListener){elem.addEventListener(type,eventHandle);}}}if(special.add){special.add.call(elem,handleObj);if(!handleObj.handler.guid){handleObj.handler.guid=handler.guid;}} // Add to the element's handler list, delegates in front
	if(selector){handlers.splice(handlers.delegateCount++,0,handleObj);}else {handlers.push(handleObj);} // Keep track of which events have ever been used, for event optimization
	jQuery.event.global[type]=true;}}, // Detach an event or set of events from an element
	remove:function remove(elem,types,handler,selector,mappedTypes){var j,origCount,tmp,events,t,handleObj,special,handlers,type,namespaces,origType,elemData=dataPriv.hasData(elem)&&dataPriv.get(elem);if(!elemData||!(events=elemData.events)){return;} // Once for each type.namespace in types; type may be omitted
	types=(types||"").match(rnotwhite)||[""];t=types.length;while(t--){tmp=rtypenamespace.exec(types[t])||[];type=origType=tmp[1];namespaces=(tmp[2]||"").split(".").sort(); // Unbind all events (on this namespace, if provided) for the element
	if(!type){for(type in events){jQuery.event.remove(elem,type+types[t],handler,selector,true);}continue;}special=jQuery.event.special[type]||{};type=(selector?special.delegateType:special.bindType)||type;handlers=events[type]||[];tmp=tmp[2]&&new RegExp("(^|\\.)"+namespaces.join("\\.(?:.*\\.|)")+"(\\.|$)"); // Remove matching events
	origCount=j=handlers.length;while(j--){handleObj=handlers[j];if((mappedTypes||origType===handleObj.origType)&&(!handler||handler.guid===handleObj.guid)&&(!tmp||tmp.test(handleObj.namespace))&&(!selector||selector===handleObj.selector||selector==="**"&&handleObj.selector)){handlers.splice(j,1);if(handleObj.selector){handlers.delegateCount--;}if(special.remove){special.remove.call(elem,handleObj);}}} // Remove generic event handler if we removed something and no more handlers exist
	// (avoids potential for endless recursion during removal of special event handlers)
	if(origCount&&!handlers.length){if(!special.teardown||special.teardown.call(elem,namespaces,elemData.handle)===false){jQuery.removeEvent(elem,type,elemData.handle);}delete events[type];}} // Remove data and the expando if it's no longer used
	if(jQuery.isEmptyObject(events)){dataPriv.remove(elem,"handle events");}},dispatch:function dispatch(event){ // Make a writable jQuery.Event from the native event object
	event=jQuery.event.fix(event);var i,j,ret,matched,handleObj,handlerQueue=[],args=_slice.call(arguments),handlers=(dataPriv.get(this,"events")||{})[event.type]||[],special=jQuery.event.special[event.type]||{}; // Use the fix-ed jQuery.Event rather than the (read-only) native event
	args[0]=event;event.delegateTarget=this; // Call the preDispatch hook for the mapped type, and let it bail if desired
	if(special.preDispatch&&special.preDispatch.call(this,event)===false){return;} // Determine handlers
	handlerQueue=jQuery.event.handlers.call(this,event,handlers); // Run delegates first; they may want to stop propagation beneath us
	i=0;while((matched=handlerQueue[i++])&&!event.isPropagationStopped()){event.currentTarget=matched.elem;j=0;while((handleObj=matched.handlers[j++])&&!event.isImmediatePropagationStopped()){ // Triggered event must either 1) have no namespace, or 2) have namespace(s)
	// a subset or equal to those in the bound event (both can have no namespace).
	if(!event.rnamespace||event.rnamespace.test(handleObj.namespace)){event.handleObj=handleObj;event.data=handleObj.data;ret=((jQuery.event.special[handleObj.origType]||{}).handle||handleObj.handler).apply(matched.elem,args);if(ret!==undefined){if((event.result=ret)===false){event.preventDefault();event.stopPropagation();}}}}} // Call the postDispatch hook for the mapped type
	if(special.postDispatch){special.postDispatch.call(this,event);}return event.result;},handlers:function handlers(event,_handlers){var i,matches,sel,handleObj,handlerQueue=[],delegateCount=_handlers.delegateCount,cur=event.target; // Support (at least): Chrome, IE9
	// Find delegate handlers
	// Black-hole SVG <use> instance trees (#13180)
	//
	// Support: Firefox<=42+
	// Avoid non-left-click in FF but don't block IE radio events (#3861, gh-2343)
	if(delegateCount&&cur.nodeType&&(event.type!=="click"||isNaN(event.button)||event.button<1)){for(;cur!==this;cur=cur.parentNode||this){ // Don't check non-elements (#13208)
	// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
	if(cur.nodeType===1&&(cur.disabled!==true||event.type!=="click")){matches=[];for(i=0;i<delegateCount;i++){handleObj=_handlers[i]; // Don't conflict with Object.prototype properties (#13203)
	sel=handleObj.selector+" ";if(matches[sel]===undefined){matches[sel]=handleObj.needsContext?jQuery(sel,this).index(cur)>-1:jQuery.find(sel,this,null,[cur]).length;}if(matches[sel]){matches.push(handleObj);}}if(matches.length){handlerQueue.push({elem:cur,handlers:matches});}}}} // Add the remaining (directly-bound) handlers
	if(delegateCount<_handlers.length){handlerQueue.push({elem:this,handlers:_handlers.slice(delegateCount)});}return handlerQueue;}, // Includes some event props shared by KeyEvent and MouseEvent
	props:("altKey bubbles cancelable ctrlKey currentTarget detail eventPhase "+"metaKey relatedTarget shiftKey target timeStamp view which").split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function filter(event,original){ // Add which for key events
	if(event.which==null){event.which=original.charCode!=null?original.charCode:original.keyCode;}return event;}},mouseHooks:{props:("button buttons clientX clientY offsetX offsetY pageX pageY "+"screenX screenY toElement").split(" "),filter:function filter(event,original){var eventDoc,doc,body,button=original.button; // Calculate pageX/Y if missing and clientX/Y available
	if(event.pageX==null&&original.clientX!=null){eventDoc=event.target.ownerDocument||document;doc=eventDoc.documentElement;body=eventDoc.body;event.pageX=original.clientX+(doc&&doc.scrollLeft||body&&body.scrollLeft||0)-(doc&&doc.clientLeft||body&&body.clientLeft||0);event.pageY=original.clientY+(doc&&doc.scrollTop||body&&body.scrollTop||0)-(doc&&doc.clientTop||body&&body.clientTop||0);} // Add which for click: 1 === left; 2 === middle; 3 === right
	// Note: button is not normalized, so don't use it
	if(!event.which&&button!==undefined){event.which=button&1?1:button&2?3:button&4?2:0;}return event;}},fix:function fix(event){if(event[jQuery.expando]){return event;} // Create a writable copy of the event object and normalize some properties
	var i,prop,copy,type=event.type,originalEvent=event,fixHook=this.fixHooks[type];if(!fixHook){this.fixHooks[type]=fixHook=rmouseEvent.test(type)?this.mouseHooks:rkeyEvent.test(type)?this.keyHooks:{};}copy=fixHook.props?this.props.concat(fixHook.props):this.props;event=new jQuery.Event(originalEvent);i=copy.length;while(i--){prop=copy[i];event[prop]=originalEvent[prop];} // Support: Cordova 2.5 (WebKit) (#13255)
	// All events should have a target; Cordova deviceready doesn't
	if(!event.target){event.target=document;} // Support: Safari 6.0+, Chrome<28
	// Target should not be a text node (#504, #13143)
	if(event.target.nodeType===3){event.target=event.target.parentNode;}return fixHook.filter?fixHook.filter(event,originalEvent):event;},special:{load:{ // Prevent triggered image.load events from bubbling to window.load
	noBubble:true},focus:{ // Fire native event if possible so blur/focus sequence is correct
	trigger:function trigger(){if(this!==safeActiveElement()&&this.focus){this.focus();return false;}},delegateType:"focusin"},blur:{trigger:function trigger(){if(this===safeActiveElement()&&this.blur){this.blur();return false;}},delegateType:"focusout"},click:{ // For checkbox, fire native event so checked state will be right
	trigger:function trigger(){if(this.type==="checkbox"&&this.click&&jQuery.nodeName(this,"input")){this.click();return false;}}, // For cross-browser consistency, don't fire native .click() on links
	_default:function _default(event){return jQuery.nodeName(event.target,"a");}},beforeunload:{postDispatch:function postDispatch(event){ // Support: Firefox 20+
	// Firefox doesn't alert if the returnValue field is not set.
	if(event.result!==undefined&&event.originalEvent){event.originalEvent.returnValue=event.result;}}}}};jQuery.removeEvent=function(elem,type,handle){ // This "if" is needed for plain objects
	if(elem.removeEventListener){elem.removeEventListener(type,handle);}};jQuery.Event=function(src,props){ // Allow instantiation without the 'new' keyword
	if(!(this instanceof jQuery.Event)){return new jQuery.Event(src,props);} // Event object
	if(src&&src.type){this.originalEvent=src;this.type=src.type; // Events bubbling up the document may have been marked as prevented
	// by a handler lower down the tree; reflect the correct value.
	this.isDefaultPrevented=src.defaultPrevented||src.defaultPrevented===undefined&& // Support: Android<4.0
	src.returnValue===false?returnTrue:returnFalse; // Event type
	}else {this.type=src;} // Put explicitly provided properties onto the event object
	if(props){jQuery.extend(this,props);} // Create a timestamp if incoming event doesn't have one
	this.timeStamp=src&&src.timeStamp||jQuery.now(); // Mark it as fixed
	this[jQuery.expando]=true;}; // jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
	// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
	jQuery.Event.prototype={constructor:jQuery.Event,isDefaultPrevented:returnFalse,isPropagationStopped:returnFalse,isImmediatePropagationStopped:returnFalse,preventDefault:function preventDefault(){var e=this.originalEvent;this.isDefaultPrevented=returnTrue;if(e){e.preventDefault();}},stopPropagation:function stopPropagation(){var e=this.originalEvent;this.isPropagationStopped=returnTrue;if(e){e.stopPropagation();}},stopImmediatePropagation:function stopImmediatePropagation(){var e=this.originalEvent;this.isImmediatePropagationStopped=returnTrue;if(e){e.stopImmediatePropagation();}this.stopPropagation();}}; // Create mouseenter/leave events using mouseover/out and event-time checks
	// so that event delegation works in jQuery.
	// Do the same for pointerenter/pointerleave and pointerover/pointerout
	//
	// Support: Safari 7 only
	// Safari sends mouseenter too often; see:
	// https://code.google.com/p/chromium/issues/detail?id=470258
	// for the description of the bug (it existed in older Chrome versions as well).
	jQuery.each({mouseenter:"mouseover",mouseleave:"mouseout",pointerenter:"pointerover",pointerleave:"pointerout"},function(orig,fix){jQuery.event.special[orig]={delegateType:fix,bindType:fix,handle:function handle(event){var ret,target=this,related=event.relatedTarget,handleObj=event.handleObj; // For mouseenter/leave call the handler if related is outside the target.
	// NB: No relatedTarget if the mouse left/entered the browser window
	if(!related||related!==target&&!jQuery.contains(target,related)){event.type=handleObj.origType;ret=handleObj.handler.apply(this,arguments);event.type=fix;}return ret;}};});jQuery.fn.extend({on:function on(types,selector,data,fn){return _on(this,types,selector,data,fn);},one:function one(types,selector,data,fn){return _on(this,types,selector,data,fn,1);},off:function off(types,selector,fn){var handleObj,type;if(types&&types.preventDefault&&types.handleObj){ // ( event )  dispatched jQuery.Event
	handleObj=types.handleObj;jQuery(types.delegateTarget).off(handleObj.namespace?handleObj.origType+"."+handleObj.namespace:handleObj.origType,handleObj.selector,handleObj.handler);return this;}if((typeof types==="undefined"?"undefined":_typeof(types))==="object"){ // ( types-object [, selector] )
	for(type in types){this.off(type,selector,types[type]);}return this;}if(selector===false||typeof selector==="function"){ // ( types [, fn] )
	fn=selector;selector=undefined;}if(fn===false){fn=returnFalse;}return this.each(function(){jQuery.event.remove(this,types,fn,selector);});}});var rxhtmlTag=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:-]+)[^>]*)\/>/gi, // Support: IE 10-11, Edge 10240+
	// In IE/Edge using regex groups here causes severe slowdowns.
	// See https://connect.microsoft.com/IE/feedback/details/1736512/
	rnoInnerhtml=/<script|<style|<link/i, // checked="checked" or checked
	rchecked=/checked\s*(?:[^=]|=\s*.checked.)/i,rscriptTypeMasked=/^true\/(.*)/,rcleanScript=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;function manipulationTarget(elem,content){if(jQuery.nodeName(elem,"table")&&jQuery.nodeName(content.nodeType!==11?content:content.firstChild,"tr")){return elem.getElementsByTagName("tbody")[0]||elem;}return elem;} // Replace/restore the type attribute of script elements for safe DOM manipulation
	function disableScript(elem){elem.type=(elem.getAttribute("type")!==null)+"/"+elem.type;return elem;}function restoreScript(elem){var match=rscriptTypeMasked.exec(elem.type);if(match){elem.type=match[1];}else {elem.removeAttribute("type");}return elem;}function cloneCopyEvent(src,dest){var i,l,type,pdataOld,pdataCur,udataOld,udataCur,events;if(dest.nodeType!==1){return;} // 1. Copy private data: events, handlers, etc.
	if(dataPriv.hasData(src)){pdataOld=dataPriv.access(src);pdataCur=dataPriv.set(dest,pdataOld);events=pdataOld.events;if(events){delete pdataCur.handle;pdataCur.events={};for(type in events){for(i=0,l=events[type].length;i<l;i++){jQuery.event.add(dest,type,events[type][i]);}}}} // 2. Copy user data
	if(dataUser.hasData(src)){udataOld=dataUser.access(src);udataCur=jQuery.extend({},udataOld);dataUser.set(dest,udataCur);}} // Fix IE bugs, see support tests
	function fixInput(src,dest){var nodeName=dest.nodeName.toLowerCase(); // Fails to persist the checked state of a cloned checkbox or radio button.
	if(nodeName==="input"&&rcheckableType.test(src.type)){dest.checked=src.checked; // Fails to return the selected option to the default selected state when cloning options
	}else if(nodeName==="input"||nodeName==="textarea"){dest.defaultValue=src.defaultValue;}}function domManip(collection,args,callback,ignored){ // Flatten any nested arrays
	args=concat.apply([],args);var fragment,first,scripts,hasScripts,node,doc,i=0,l=collection.length,iNoClone=l-1,value=args[0],isFunction=jQuery.isFunction(value); // We can't cloneNode fragments that contain checked, in WebKit
	if(isFunction||l>1&&typeof value==="string"&&!support.checkClone&&rchecked.test(value)){return collection.each(function(index){var self=collection.eq(index);if(isFunction){args[0]=value.call(this,index,self.html());}domManip(self,args,callback,ignored);});}if(l){fragment=buildFragment(args,collection[0].ownerDocument,false,collection,ignored);first=fragment.firstChild;if(fragment.childNodes.length===1){fragment=first;} // Require either new content or an interest in ignored elements to invoke the callback
	if(first||ignored){scripts=jQuery.map(getAll(fragment,"script"),disableScript);hasScripts=scripts.length; // Use the original fragment for the last item
	// instead of the first because it can end up
	// being emptied incorrectly in certain situations (#8070).
	for(;i<l;i++){node=fragment;if(i!==iNoClone){node=jQuery.clone(node,true,true); // Keep references to cloned scripts for later restoration
	if(hasScripts){ // Support: Android<4.1, PhantomJS<2
	// push.apply(_, arraylike) throws on ancient WebKit
	jQuery.merge(scripts,getAll(node,"script"));}}callback.call(collection[i],node,i);}if(hasScripts){doc=scripts[scripts.length-1].ownerDocument; // Reenable scripts
	jQuery.map(scripts,restoreScript); // Evaluate executable scripts on first document insertion
	for(i=0;i<hasScripts;i++){node=scripts[i];if(rscriptType.test(node.type||"")&&!dataPriv.access(node,"globalEval")&&jQuery.contains(doc,node)){if(node.src){ // Optional AJAX dependency, but won't run scripts if not present
	if(jQuery._evalUrl){jQuery._evalUrl(node.src);}}else {jQuery.globalEval(node.textContent.replace(rcleanScript,""));}}}}}}return collection;}function _remove(elem,selector,keepData){var node,nodes=selector?jQuery.filter(selector,elem):elem,i=0;for(;(node=nodes[i])!=null;i++){if(!keepData&&node.nodeType===1){jQuery.cleanData(getAll(node));}if(node.parentNode){if(keepData&&jQuery.contains(node.ownerDocument,node)){setGlobalEval(getAll(node,"script"));}node.parentNode.removeChild(node);}}return elem;}jQuery.extend({htmlPrefilter:function htmlPrefilter(html){return html.replace(rxhtmlTag,"<$1></$2>");},clone:function clone(elem,dataAndEvents,deepDataAndEvents){var i,l,srcElements,destElements,clone=elem.cloneNode(true),inPage=jQuery.contains(elem.ownerDocument,elem); // Fix IE cloning issues
	if(!support.noCloneChecked&&(elem.nodeType===1||elem.nodeType===11)&&!jQuery.isXMLDoc(elem)){ // We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
	destElements=getAll(clone);srcElements=getAll(elem);for(i=0,l=srcElements.length;i<l;i++){fixInput(srcElements[i],destElements[i]);}} // Copy the events from the original to the clone
	if(dataAndEvents){if(deepDataAndEvents){srcElements=srcElements||getAll(elem);destElements=destElements||getAll(clone);for(i=0,l=srcElements.length;i<l;i++){cloneCopyEvent(srcElements[i],destElements[i]);}}else {cloneCopyEvent(elem,clone);}} // Preserve script evaluation history
	destElements=getAll(clone,"script");if(destElements.length>0){setGlobalEval(destElements,!inPage&&getAll(elem,"script"));} // Return the cloned set
	return clone;},cleanData:function cleanData(elems){var data,elem,type,special=jQuery.event.special,i=0;for(;(elem=elems[i])!==undefined;i++){if(acceptData(elem)){if(data=elem[dataPriv.expando]){if(data.events){for(type in data.events){if(special[type]){jQuery.event.remove(elem,type); // This is a shortcut to avoid jQuery.event.remove's overhead
	}else {jQuery.removeEvent(elem,type,data.handle);}}} // Support: Chrome <= 35-45+
	// Assign undefined instead of using delete, see Data#remove
	elem[dataPriv.expando]=undefined;}if(elem[dataUser.expando]){ // Support: Chrome <= 35-45+
	// Assign undefined instead of using delete, see Data#remove
	elem[dataUser.expando]=undefined;}}}}});jQuery.fn.extend({ // Keep domManip exposed until 3.0 (gh-2225)
	domManip:domManip,detach:function detach(selector){return _remove(this,selector,true);},remove:function remove(selector){return _remove(this,selector);},text:function text(value){return access(this,function(value){return value===undefined?jQuery.text(this):this.empty().each(function(){if(this.nodeType===1||this.nodeType===11||this.nodeType===9){this.textContent=value;}});},null,value,arguments.length);},append:function append(){return domManip(this,arguments,function(elem){if(this.nodeType===1||this.nodeType===11||this.nodeType===9){var target=manipulationTarget(this,elem);target.appendChild(elem);}});},prepend:function prepend(){return domManip(this,arguments,function(elem){if(this.nodeType===1||this.nodeType===11||this.nodeType===9){var target=manipulationTarget(this,elem);target.insertBefore(elem,target.firstChild);}});},before:function before(){return domManip(this,arguments,function(elem){if(this.parentNode){this.parentNode.insertBefore(elem,this);}});},after:function after(){return domManip(this,arguments,function(elem){if(this.parentNode){this.parentNode.insertBefore(elem,this.nextSibling);}});},empty:function empty(){var elem,i=0;for(;(elem=this[i])!=null;i++){if(elem.nodeType===1){ // Prevent memory leaks
	jQuery.cleanData(getAll(elem,false)); // Remove any remaining nodes
	elem.textContent="";}}return this;},clone:function clone(dataAndEvents,deepDataAndEvents){dataAndEvents=dataAndEvents==null?false:dataAndEvents;deepDataAndEvents=deepDataAndEvents==null?dataAndEvents:deepDataAndEvents;return this.map(function(){return jQuery.clone(this,dataAndEvents,deepDataAndEvents);});},html:function html(value){return access(this,function(value){var elem=this[0]||{},i=0,l=this.length;if(value===undefined&&elem.nodeType===1){return elem.innerHTML;} // See if we can take a shortcut and just use innerHTML
	if(typeof value==="string"&&!rnoInnerhtml.test(value)&&!wrapMap[(rtagName.exec(value)||["",""])[1].toLowerCase()]){value=jQuery.htmlPrefilter(value);try{for(;i<l;i++){elem=this[i]||{}; // Remove element nodes and prevent memory leaks
	if(elem.nodeType===1){jQuery.cleanData(getAll(elem,false));elem.innerHTML=value;}}elem=0; // If using innerHTML throws an exception, use the fallback method
	}catch(e){}}if(elem){this.empty().append(value);}},null,value,arguments.length);},replaceWith:function replaceWith(){var ignored=[]; // Make the changes, replacing each non-ignored context element with the new content
	return domManip(this,arguments,function(elem){var parent=this.parentNode;if(jQuery.inArray(this,ignored)<0){jQuery.cleanData(getAll(this));if(parent){parent.replaceChild(elem,this);}} // Force callback invocation
	},ignored);}});jQuery.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(name,original){jQuery.fn[name]=function(selector){var elems,ret=[],insert=jQuery(selector),last=insert.length-1,i=0;for(;i<=last;i++){elems=i===last?this:this.clone(true);jQuery(insert[i])[original](elems); // Support: QtWebKit
	// .get() because push.apply(_, arraylike) throws
	push.apply(ret,elems.get());}return this.pushStack(ret);};});var iframe,elemdisplay={ // Support: Firefox
	// We have to pre-define these values for FF (#10227)
	HTML:"block",BODY:"block"}; /**
	 * Retrieve the actual display of a element
	 * @param {String} name nodeName of the element
	 * @param {Object} doc Document object
	 */ // Called only from within defaultDisplay
	function actualDisplay(name,doc){var elem=jQuery(doc.createElement(name)).appendTo(doc.body),display=jQuery.css(elem[0],"display"); // We don't have any data stored on the element,
	// so use "detach" method as fast way to get rid of the element
	elem.detach();return display;} /**
	 * Try to determine the default display value of an element
	 * @param {String} nodeName
	 */function defaultDisplay(nodeName){var doc=document,display=elemdisplay[nodeName];if(!display){display=actualDisplay(nodeName,doc); // If the simple way fails, read from inside an iframe
	if(display==="none"||!display){ // Use the already-created iframe if possible
	iframe=(iframe||jQuery("<iframe frameborder='0' width='0' height='0'/>")).appendTo(doc.documentElement); // Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
	doc=iframe[0].contentDocument; // Support: IE
	doc.write();doc.close();display=actualDisplay(nodeName,doc);iframe.detach();} // Store the correct default display
	elemdisplay[nodeName]=display;}return display;}var rmargin=/^margin/;var rnumnonpx=new RegExp("^("+pnum+")(?!px)[a-z%]+$","i");var getStyles=function getStyles(elem){ // Support: IE<=11+, Firefox<=30+ (#15098, #14150)
	// IE throws on elements created in popups
	// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
	var view=elem.ownerDocument.defaultView;if(!view.opener){view=window;}return view.getComputedStyle(elem);};var swap=function swap(elem,options,callback,args){var ret,name,old={}; // Remember the old values, and insert the new ones
	for(name in options){old[name]=elem.style[name];elem.style[name]=options[name];}ret=callback.apply(elem,args||[]); // Revert the old values
	for(name in options){elem.style[name]=old[name];}return ret;};var documentElement=document.documentElement;(function(){var pixelPositionVal,boxSizingReliableVal,pixelMarginRightVal,reliableMarginLeftVal,container=document.createElement("div"),div=document.createElement("div"); // Finish early in limited (non-browser) environments
	if(!div.style){return;} // Support: IE9-11+
	// Style of cloned element affects source element cloned (#8908)
	div.style.backgroundClip="content-box";div.cloneNode(true).style.backgroundClip="";support.clearCloneStyle=div.style.backgroundClip==="content-box";container.style.cssText="border:0;width:8px;height:0;top:0;left:-9999px;"+"padding:0;margin-top:1px;position:absolute";container.appendChild(div); // Executing both pixelPosition & boxSizingReliable tests require only one layout
	// so they're executed at the same time to save the second computation.
	function computeStyleTests(){div.style.cssText= // Support: Firefox<29, Android 2.3
	// Vendor-prefix box-sizing
	"-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;"+"position:relative;display:block;"+"margin:auto;border:1px;padding:1px;"+"top:1%;width:50%";div.innerHTML="";documentElement.appendChild(container);var divStyle=window.getComputedStyle(div);pixelPositionVal=divStyle.top!=="1%";reliableMarginLeftVal=divStyle.marginLeft==="2px";boxSizingReliableVal=divStyle.width==="4px"; // Support: Android 4.0 - 4.3 only
	// Some styles come back with percentage values, even though they shouldn't
	div.style.marginRight="50%";pixelMarginRightVal=divStyle.marginRight==="4px";documentElement.removeChild(container);}jQuery.extend(support,{pixelPosition:function pixelPosition(){ // This test is executed only once but we still do memoizing
	// since we can use the boxSizingReliable pre-computing.
	// No need to check if the test was already performed, though.
	computeStyleTests();return pixelPositionVal;},boxSizingReliable:function boxSizingReliable(){if(boxSizingReliableVal==null){computeStyleTests();}return boxSizingReliableVal;},pixelMarginRight:function pixelMarginRight(){ // Support: Android 4.0-4.3
	// We're checking for boxSizingReliableVal here instead of pixelMarginRightVal
	// since that compresses better and they're computed together anyway.
	if(boxSizingReliableVal==null){computeStyleTests();}return pixelMarginRightVal;},reliableMarginLeft:function reliableMarginLeft(){ // Support: IE <=8 only, Android 4.0 - 4.3 only, Firefox <=3 - 37
	if(boxSizingReliableVal==null){computeStyleTests();}return reliableMarginLeftVal;},reliableMarginRight:function reliableMarginRight(){ // Support: Android 2.3
	// Check if div with explicit width and no margin-right incorrectly
	// gets computed margin-right based on width of container. (#3333)
	// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
	// This support function is only executed once so no memoizing is needed.
	var ret,marginDiv=div.appendChild(document.createElement("div")); // Reset CSS: box-sizing; display; margin; border; padding
	marginDiv.style.cssText=div.style.cssText= // Support: Android 2.3
	// Vendor-prefix box-sizing
	"-webkit-box-sizing:content-box;box-sizing:content-box;"+"display:block;margin:0;border:0;padding:0";marginDiv.style.marginRight=marginDiv.style.width="0";div.style.width="1px";documentElement.appendChild(container);ret=!parseFloat(window.getComputedStyle(marginDiv).marginRight);documentElement.removeChild(container);div.removeChild(marginDiv);return ret;}});})();function curCSS(elem,name,computed){var width,minWidth,maxWidth,ret,style=elem.style;computed=computed||getStyles(elem); // Support: IE9
	// getPropertyValue is only needed for .css('filter') (#12537)
	if(computed){ret=computed.getPropertyValue(name)||computed[name];if(ret===""&&!jQuery.contains(elem.ownerDocument,elem)){ret=jQuery.style(elem,name);} // A tribute to the "awesome hack by Dean Edwards"
	// Android Browser returns percentage for some values,
	// but width seems to be reliably pixels.
	// This is against the CSSOM draft spec:
	// http://dev.w3.org/csswg/cssom/#resolved-values
	if(!support.pixelMarginRight()&&rnumnonpx.test(ret)&&rmargin.test(name)){ // Remember the original values
	width=style.width;minWidth=style.minWidth;maxWidth=style.maxWidth; // Put in the new values to get a computed value out
	style.minWidth=style.maxWidth=style.width=ret;ret=computed.width; // Revert the changed values
	style.width=width;style.minWidth=minWidth;style.maxWidth=maxWidth;}}return ret!==undefined? // Support: IE9-11+
	// IE returns zIndex value as an integer.
	ret+"":ret;}function addGetHookIf(conditionFn,hookFn){ // Define the hook, we'll check on the first run if it's really needed.
	return {get:function get(){if(conditionFn()){ // Hook not needed (or it's not possible to use it due
	// to missing dependency), remove it.
	delete this.get;return;} // Hook needed; redefine it so that the support test is not executed again.
	return (this.get=hookFn).apply(this,arguments);}};}var  // Swappable if display is none or starts with table
	// except "table", "table-cell", or "table-caption"
	// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap=/^(none|table(?!-c[ea]).+)/,cssShow={position:"absolute",visibility:"hidden",display:"block"},cssNormalTransform={letterSpacing:"0",fontWeight:"400"},cssPrefixes=["Webkit","O","Moz","ms"],emptyStyle=document.createElement("div").style; // Return a css property mapped to a potentially vendor prefixed property
	function vendorPropName(name){ // Shortcut for names that are not vendor prefixed
	if(name in emptyStyle){return name;} // Check for vendor prefixed names
	var capName=name[0].toUpperCase()+name.slice(1),i=cssPrefixes.length;while(i--){name=cssPrefixes[i]+capName;if(name in emptyStyle){return name;}}}function setPositiveNumber(elem,value,subtract){ // Any relative (+/-) values have already been
	// normalized at this point
	var matches=rcssNum.exec(value);return matches? // Guard against undefined "subtract", e.g., when used as in cssHooks
	Math.max(0,matches[2]-(subtract||0))+(matches[3]||"px"):value;}function augmentWidthOrHeight(elem,name,extra,isBorderBox,styles){var i=extra===(isBorderBox?"border":"content")? // If we already have the right measurement, avoid augmentation
	4: // Otherwise initialize for horizontal or vertical properties
	name==="width"?1:0,val=0;for(;i<4;i+=2){ // Both box models exclude margin, so add it if we want it
	if(extra==="margin"){val+=jQuery.css(elem,extra+cssExpand[i],true,styles);}if(isBorderBox){ // border-box includes padding, so remove it if we want content
	if(extra==="content"){val-=jQuery.css(elem,"padding"+cssExpand[i],true,styles);} // At this point, extra isn't border nor margin, so remove border
	if(extra!=="margin"){val-=jQuery.css(elem,"border"+cssExpand[i]+"Width",true,styles);}}else { // At this point, extra isn't content, so add padding
	val+=jQuery.css(elem,"padding"+cssExpand[i],true,styles); // At this point, extra isn't content nor padding, so add border
	if(extra!=="padding"){val+=jQuery.css(elem,"border"+cssExpand[i]+"Width",true,styles);}}}return val;}function getWidthOrHeight(elem,name,extra){ // Start with offset property, which is equivalent to the border-box value
	var valueIsBorderBox=true,val=name==="width"?elem.offsetWidth:elem.offsetHeight,styles=getStyles(elem),isBorderBox=jQuery.css(elem,"boxSizing",false,styles)==="border-box"; // Support: IE11 only
	// In IE 11 fullscreen elements inside of an iframe have
	// 100x too small dimensions (gh-1764).
	if(document.msFullscreenElement&&window.top!==window){ // Support: IE11 only
	// Running getBoundingClientRect on a disconnected node
	// in IE throws an error.
	if(elem.getClientRects().length){val=Math.round(elem.getBoundingClientRect()[name]*100);}} // Some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if(val<=0||val==null){ // Fall back to computed then uncomputed css if necessary
	val=curCSS(elem,name,styles);if(val<0||val==null){val=elem.style[name];} // Computed unit is not pixels. Stop here and return.
	if(rnumnonpx.test(val)){return val;} // Check for style in case a browser which returns unreliable values
	// for getComputedStyle silently falls back to the reliable elem.style
	valueIsBorderBox=isBorderBox&&(support.boxSizingReliable()||val===elem.style[name]); // Normalize "", auto, and prepare for extra
	val=parseFloat(val)||0;} // Use the active box-sizing model to add/subtract irrelevant styles
	return val+augmentWidthOrHeight(elem,name,extra||(isBorderBox?"border":"content"),valueIsBorderBox,styles)+"px";}function showHide(elements,show){var display,elem,hidden,values=[],index=0,length=elements.length;for(;index<length;index++){elem=elements[index];if(!elem.style){continue;}values[index]=dataPriv.get(elem,"olddisplay");display=elem.style.display;if(show){ // Reset the inline display of this element to learn if it is
	// being hidden by cascaded rules or not
	if(!values[index]&&display==="none"){elem.style.display="";} // Set elements which have been overridden with display: none
	// in a stylesheet to whatever the default browser style is
	// for such an element
	if(elem.style.display===""&&isHidden(elem)){values[index]=dataPriv.access(elem,"olddisplay",defaultDisplay(elem.nodeName));}}else {hidden=isHidden(elem);if(display!=="none"||!hidden){dataPriv.set(elem,"olddisplay",hidden?display:jQuery.css(elem,"display"));}}} // Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	for(index=0;index<length;index++){elem=elements[index];if(!elem.style){continue;}if(!show||elem.style.display==="none"||elem.style.display===""){elem.style.display=show?values[index]||"":"none";}}return elements;}jQuery.extend({ // Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks:{opacity:{get:function get(elem,computed){if(computed){ // We should always get a number back from opacity
	var ret=curCSS(elem,"opacity");return ret===""?"1":ret;}}}}, // Don't automatically add "px" to these possibly-unitless properties
	cssNumber:{"animationIterationCount":true,"columnCount":true,"fillOpacity":true,"flexGrow":true,"flexShrink":true,"fontWeight":true,"lineHeight":true,"opacity":true,"order":true,"orphans":true,"widows":true,"zIndex":true,"zoom":true}, // Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps:{"float":"cssFloat"}, // Get and set the style property on a DOM Node
	style:function style(elem,name,value,extra){ // Don't set styles on text and comment nodes
	if(!elem||elem.nodeType===3||elem.nodeType===8||!elem.style){return;} // Make sure that we're working with the right name
	var ret,type,hooks,origName=jQuery.camelCase(name),style=elem.style;name=jQuery.cssProps[origName]||(jQuery.cssProps[origName]=vendorPropName(origName)||origName); // Gets hook for the prefixed version, then unprefixed version
	hooks=jQuery.cssHooks[name]||jQuery.cssHooks[origName]; // Check if we're setting a value
	if(value!==undefined){type=typeof value==="undefined"?"undefined":_typeof(value); // Convert "+=" or "-=" to relative numbers (#7345)
	if(type==="string"&&(ret=rcssNum.exec(value))&&ret[1]){value=adjustCSS(elem,name,ret); // Fixes bug #9237
	type="number";} // Make sure that null and NaN values aren't set (#7116)
	if(value==null||value!==value){return;} // If a number was passed in, add the unit (except for certain CSS properties)
	if(type==="number"){value+=ret&&ret[3]||(jQuery.cssNumber[origName]?"":"px");} // Support: IE9-11+
	// background-* props affect original clone's values
	if(!support.clearCloneStyle&&value===""&&name.indexOf("background")===0){style[name]="inherit";} // If a hook was provided, use that value, otherwise just set the specified value
	if(!hooks||!("set" in hooks)||(value=hooks.set(elem,value,extra))!==undefined){style[name]=value;}}else { // If a hook was provided get the non-computed value from there
	if(hooks&&"get" in hooks&&(ret=hooks.get(elem,false,extra))!==undefined){return ret;} // Otherwise just get the value from the style object
	return style[name];}},css:function css(elem,name,extra,styles){var val,num,hooks,origName=jQuery.camelCase(name); // Make sure that we're working with the right name
	name=jQuery.cssProps[origName]||(jQuery.cssProps[origName]=vendorPropName(origName)||origName); // Try prefixed name followed by the unprefixed name
	hooks=jQuery.cssHooks[name]||jQuery.cssHooks[origName]; // If a hook was provided get the computed value from there
	if(hooks&&"get" in hooks){val=hooks.get(elem,true,extra);} // Otherwise, if a way to get the computed value exists, use that
	if(val===undefined){val=curCSS(elem,name,styles);} // Convert "normal" to computed value
	if(val==="normal"&&name in cssNormalTransform){val=cssNormalTransform[name];} // Make numeric if forced or a qualifier was provided and val looks numeric
	if(extra===""||extra){num=parseFloat(val);return extra===true||isFinite(num)?num||0:val;}return val;}});jQuery.each(["height","width"],function(i,name){jQuery.cssHooks[name]={get:function get(elem,computed,extra){if(computed){ // Certain elements can have dimension info if we invisibly show them
	// but it must have a current display style that would benefit
	return rdisplayswap.test(jQuery.css(elem,"display"))&&elem.offsetWidth===0?swap(elem,cssShow,function(){return getWidthOrHeight(elem,name,extra);}):getWidthOrHeight(elem,name,extra);}},set:function set(elem,value,extra){var matches,styles=extra&&getStyles(elem),subtract=extra&&augmentWidthOrHeight(elem,name,extra,jQuery.css(elem,"boxSizing",false,styles)==="border-box",styles); // Convert to pixels if value adjustment is needed
	if(subtract&&(matches=rcssNum.exec(value))&&(matches[3]||"px")!=="px"){elem.style[name]=value;value=jQuery.css(elem,name);}return setPositiveNumber(elem,value,subtract);}};});jQuery.cssHooks.marginLeft=addGetHookIf(support.reliableMarginLeft,function(elem,computed){if(computed){return (parseFloat(curCSS(elem,"marginLeft"))||elem.getBoundingClientRect().left-swap(elem,{marginLeft:0},function(){return elem.getBoundingClientRect().left;}))+"px";}}); // Support: Android 2.3
	jQuery.cssHooks.marginRight=addGetHookIf(support.reliableMarginRight,function(elem,computed){if(computed){return swap(elem,{"display":"inline-block"},curCSS,[elem,"marginRight"]);}}); // These hooks are used by animate to expand properties
	jQuery.each({margin:"",padding:"",border:"Width"},function(prefix,suffix){jQuery.cssHooks[prefix+suffix]={expand:function expand(value){var i=0,expanded={}, // Assumes a single number if not a string
	parts=typeof value==="string"?value.split(" "):[value];for(;i<4;i++){expanded[prefix+cssExpand[i]+suffix]=parts[i]||parts[i-2]||parts[0];}return expanded;}};if(!rmargin.test(prefix)){jQuery.cssHooks[prefix+suffix].set=setPositiveNumber;}});jQuery.fn.extend({css:function css(name,value){return access(this,function(elem,name,value){var styles,len,map={},i=0;if(jQuery.isArray(name)){styles=getStyles(elem);len=name.length;for(;i<len;i++){map[name[i]]=jQuery.css(elem,name[i],false,styles);}return map;}return value!==undefined?jQuery.style(elem,name,value):jQuery.css(elem,name);},name,value,arguments.length>1);},show:function show(){return showHide(this,true);},hide:function hide(){return showHide(this);},toggle:function toggle(state){if(typeof state==="boolean"){return state?this.show():this.hide();}return this.each(function(){if(isHidden(this)){jQuery(this).show();}else {jQuery(this).hide();}});}});function Tween(elem,options,prop,end,easing){return new Tween.prototype.init(elem,options,prop,end,easing);}jQuery.Tween=Tween;Tween.prototype={constructor:Tween,init:function init(elem,options,prop,end,easing,unit){this.elem=elem;this.prop=prop;this.easing=easing||jQuery.easing._default;this.options=options;this.start=this.now=this.cur();this.end=end;this.unit=unit||(jQuery.cssNumber[prop]?"":"px");},cur:function cur(){var hooks=Tween.propHooks[this.prop];return hooks&&hooks.get?hooks.get(this):Tween.propHooks._default.get(this);},run:function run(percent){var eased,hooks=Tween.propHooks[this.prop];if(this.options.duration){this.pos=eased=jQuery.easing[this.easing](percent,this.options.duration*percent,0,1,this.options.duration);}else {this.pos=eased=percent;}this.now=(this.end-this.start)*eased+this.start;if(this.options.step){this.options.step.call(this.elem,this.now,this);}if(hooks&&hooks.set){hooks.set(this);}else {Tween.propHooks._default.set(this);}return this;}};Tween.prototype.init.prototype=Tween.prototype;Tween.propHooks={_default:{get:function get(tween){var result; // Use a property on the element directly when it is not a DOM element,
	// or when there is no matching style property that exists.
	if(tween.elem.nodeType!==1||tween.elem[tween.prop]!=null&&tween.elem.style[tween.prop]==null){return tween.elem[tween.prop];} // Passing an empty string as a 3rd parameter to .css will automatically
	// attempt a parseFloat and fallback to a string if the parse fails.
	// Simple values such as "10px" are parsed to Float;
	// complex values such as "rotate(1rad)" are returned as-is.
	result=jQuery.css(tween.elem,tween.prop,""); // Empty strings, null, undefined and "auto" are converted to 0.
	return !result||result==="auto"?0:result;},set:function set(tween){ // Use step hook for back compat.
	// Use cssHook if its there.
	// Use .style if available and use plain properties where available.
	if(jQuery.fx.step[tween.prop]){jQuery.fx.step[tween.prop](tween);}else if(tween.elem.nodeType===1&&(tween.elem.style[jQuery.cssProps[tween.prop]]!=null||jQuery.cssHooks[tween.prop])){jQuery.style(tween.elem,tween.prop,tween.now+tween.unit);}else {tween.elem[tween.prop]=tween.now;}}}}; // Support: IE9
	// Panic based approach to setting things on disconnected nodes
	Tween.propHooks.scrollTop=Tween.propHooks.scrollLeft={set:function set(tween){if(tween.elem.nodeType&&tween.elem.parentNode){tween.elem[tween.prop]=tween.now;}}};jQuery.easing={linear:function linear(p){return p;},swing:function swing(p){return 0.5-Math.cos(p*Math.PI)/2;},_default:"swing"};jQuery.fx=Tween.prototype.init; // Back Compat <1.8 extension point
	jQuery.fx.step={};var fxNow,timerId,rfxtypes=/^(?:toggle|show|hide)$/,rrun=/queueHooks$/; // Animations created synchronously will run synchronously
	function createFxNow(){window.setTimeout(function(){fxNow=undefined;});return fxNow=jQuery.now();} // Generate parameters to create a standard animation
	function genFx(type,includeWidth){var which,i=0,attrs={height:type}; // If we include width, step value is 1 to do all cssExpand values,
	// otherwise step value is 2 to skip over Left and Right
	includeWidth=includeWidth?1:0;for(;i<4;i+=2-includeWidth){which=cssExpand[i];attrs["margin"+which]=attrs["padding"+which]=type;}if(includeWidth){attrs.opacity=attrs.width=type;}return attrs;}function createTween(value,prop,animation){var tween,collection=(Animation.tweeners[prop]||[]).concat(Animation.tweeners["*"]),index=0,length=collection.length;for(;index<length;index++){if(tween=collection[index].call(animation,prop,value)){ // We're done with this property
	return tween;}}}function defaultPrefilter(elem,props,opts){ /* jshint validthis: true */var prop,value,toggle,tween,hooks,oldfire,display,checkDisplay,anim=this,orig={},style=elem.style,hidden=elem.nodeType&&isHidden(elem),dataShow=dataPriv.get(elem,"fxshow"); // Handle queue: false promises
	if(!opts.queue){hooks=jQuery._queueHooks(elem,"fx");if(hooks.unqueued==null){hooks.unqueued=0;oldfire=hooks.empty.fire;hooks.empty.fire=function(){if(!hooks.unqueued){oldfire();}};}hooks.unqueued++;anim.always(function(){ // Ensure the complete handler is called before this completes
	anim.always(function(){hooks.unqueued--;if(!jQuery.queue(elem,"fx").length){hooks.empty.fire();}});});} // Height/width overflow pass
	if(elem.nodeType===1&&("height" in props||"width" in props)){ // Make sure that nothing sneaks out
	// Record all 3 overflow attributes because IE9-10 do not
	// change the overflow attribute when overflowX and
	// overflowY are set to the same value
	opts.overflow=[style.overflow,style.overflowX,style.overflowY]; // Set display property to inline-block for height/width
	// animations on inline elements that are having width/height animated
	display=jQuery.css(elem,"display"); // Test default display if display is currently "none"
	checkDisplay=display==="none"?dataPriv.get(elem,"olddisplay")||defaultDisplay(elem.nodeName):display;if(checkDisplay==="inline"&&jQuery.css(elem,"float")==="none"){style.display="inline-block";}}if(opts.overflow){style.overflow="hidden";anim.always(function(){style.overflow=opts.overflow[0];style.overflowX=opts.overflow[1];style.overflowY=opts.overflow[2];});} // show/hide pass
	for(prop in props){value=props[prop];if(rfxtypes.exec(value)){delete props[prop];toggle=toggle||value==="toggle";if(value===(hidden?"hide":"show")){ // If there is dataShow left over from a stopped hide or show
	// and we are going to proceed with show, we should pretend to be hidden
	if(value==="show"&&dataShow&&dataShow[prop]!==undefined){hidden=true;}else {continue;}}orig[prop]=dataShow&&dataShow[prop]||jQuery.style(elem,prop); // Any non-fx value stops us from restoring the original display value
	}else {display=undefined;}}if(!jQuery.isEmptyObject(orig)){if(dataShow){if("hidden" in dataShow){hidden=dataShow.hidden;}}else {dataShow=dataPriv.access(elem,"fxshow",{});} // Store state if its toggle - enables .stop().toggle() to "reverse"
	if(toggle){dataShow.hidden=!hidden;}if(hidden){jQuery(elem).show();}else {anim.done(function(){jQuery(elem).hide();});}anim.done(function(){var prop;dataPriv.remove(elem,"fxshow");for(prop in orig){jQuery.style(elem,prop,orig[prop]);}});for(prop in orig){tween=createTween(hidden?dataShow[prop]:0,prop,anim);if(!(prop in dataShow)){dataShow[prop]=tween.start;if(hidden){tween.end=tween.start;tween.start=prop==="width"||prop==="height"?1:0;}}} // If this is a noop like .hide().hide(), restore an overwritten display value
	}else if((display==="none"?defaultDisplay(elem.nodeName):display)==="inline"){style.display=display;}}function propFilter(props,specialEasing){var index,name,easing,value,hooks; // camelCase, specialEasing and expand cssHook pass
	for(index in props){name=jQuery.camelCase(index);easing=specialEasing[name];value=props[index];if(jQuery.isArray(value)){easing=value[1];value=props[index]=value[0];}if(index!==name){props[name]=value;delete props[index];}hooks=jQuery.cssHooks[name];if(hooks&&"expand" in hooks){value=hooks.expand(value);delete props[name]; // Not quite $.extend, this won't overwrite existing keys.
	// Reusing 'index' because we have the correct "name"
	for(index in value){if(!(index in props)){props[index]=value[index];specialEasing[index]=easing;}}}else {specialEasing[name]=easing;}}}function Animation(elem,properties,options){var result,stopped,index=0,length=Animation.prefilters.length,deferred=jQuery.Deferred().always(function(){ // Don't match elem in the :animated selector
	delete tick.elem;}),tick=function tick(){if(stopped){return false;}var currentTime=fxNow||createFxNow(),remaining=Math.max(0,animation.startTime+animation.duration-currentTime), // Support: Android 2.3
	// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
	temp=remaining/animation.duration||0,percent=1-temp,index=0,length=animation.tweens.length;for(;index<length;index++){animation.tweens[index].run(percent);}deferred.notifyWith(elem,[animation,percent,remaining]);if(percent<1&&length){return remaining;}else {deferred.resolveWith(elem,[animation]);return false;}},animation=deferred.promise({elem:elem,props:jQuery.extend({},properties),opts:jQuery.extend(true,{specialEasing:{},easing:jQuery.easing._default},options),originalProperties:properties,originalOptions:options,startTime:fxNow||createFxNow(),duration:options.duration,tweens:[],createTween:function createTween(prop,end){var tween=jQuery.Tween(elem,animation.opts,prop,end,animation.opts.specialEasing[prop]||animation.opts.easing);animation.tweens.push(tween);return tween;},stop:function stop(gotoEnd){var index=0, // If we are going to the end, we want to run all the tweens
	// otherwise we skip this part
	length=gotoEnd?animation.tweens.length:0;if(stopped){return this;}stopped=true;for(;index<length;index++){animation.tweens[index].run(1);} // Resolve when we played the last frame; otherwise, reject
	if(gotoEnd){deferred.notifyWith(elem,[animation,1,0]);deferred.resolveWith(elem,[animation,gotoEnd]);}else {deferred.rejectWith(elem,[animation,gotoEnd]);}return this;}}),props=animation.props;propFilter(props,animation.opts.specialEasing);for(;index<length;index++){result=Animation.prefilters[index].call(animation,elem,props,animation.opts);if(result){if(jQuery.isFunction(result.stop)){jQuery._queueHooks(animation.elem,animation.opts.queue).stop=jQuery.proxy(result.stop,result);}return result;}}jQuery.map(props,createTween,animation);if(jQuery.isFunction(animation.opts.start)){animation.opts.start.call(elem,animation);}jQuery.fx.timer(jQuery.extend(tick,{elem:elem,anim:animation,queue:animation.opts.queue})); // attach callbacks from options
	return animation.progress(animation.opts.progress).done(animation.opts.done,animation.opts.complete).fail(animation.opts.fail).always(animation.opts.always);}jQuery.Animation=jQuery.extend(Animation,{tweeners:{"*":[function(prop,value){var tween=this.createTween(prop,value);adjustCSS(tween.elem,prop,rcssNum.exec(value),tween);return tween;}]},tweener:function tweener(props,callback){if(jQuery.isFunction(props)){callback=props;props=["*"];}else {props=props.match(rnotwhite);}var prop,index=0,length=props.length;for(;index<length;index++){prop=props[index];Animation.tweeners[prop]=Animation.tweeners[prop]||[];Animation.tweeners[prop].unshift(callback);}},prefilters:[defaultPrefilter],prefilter:function prefilter(callback,prepend){if(prepend){Animation.prefilters.unshift(callback);}else {Animation.prefilters.push(callback);}}});jQuery.speed=function(speed,easing,fn){var opt=speed&&(typeof speed==="undefined"?"undefined":_typeof(speed))==="object"?jQuery.extend({},speed):{complete:fn||!fn&&easing||jQuery.isFunction(speed)&&speed,duration:speed,easing:fn&&easing||easing&&!jQuery.isFunction(easing)&&easing};opt.duration=jQuery.fx.off?0:typeof opt.duration==="number"?opt.duration:opt.duration in jQuery.fx.speeds?jQuery.fx.speeds[opt.duration]:jQuery.fx.speeds._default; // Normalize opt.queue - true/undefined/null -> "fx"
	if(opt.queue==null||opt.queue===true){opt.queue="fx";} // Queueing
	opt.old=opt.complete;opt.complete=function(){if(jQuery.isFunction(opt.old)){opt.old.call(this);}if(opt.queue){jQuery.dequeue(this,opt.queue);}};return opt;};jQuery.fn.extend({fadeTo:function fadeTo(speed,to,easing,callback){ // Show any hidden elements after setting opacity to 0
	return this.filter(isHidden).css("opacity",0).show() // Animate to the value specified
	.end().animate({opacity:to},speed,easing,callback);},animate:function animate(prop,speed,easing,callback){var empty=jQuery.isEmptyObject(prop),optall=jQuery.speed(speed,easing,callback),doAnimation=function doAnimation(){ // Operate on a copy of prop so per-property easing won't be lost
	var anim=Animation(this,jQuery.extend({},prop),optall); // Empty animations, or finishing resolves immediately
	if(empty||dataPriv.get(this,"finish")){anim.stop(true);}};doAnimation.finish=doAnimation;return empty||optall.queue===false?this.each(doAnimation):this.queue(optall.queue,doAnimation);},stop:function stop(type,clearQueue,gotoEnd){var stopQueue=function stopQueue(hooks){var stop=hooks.stop;delete hooks.stop;stop(gotoEnd);};if(typeof type!=="string"){gotoEnd=clearQueue;clearQueue=type;type=undefined;}if(clearQueue&&type!==false){this.queue(type||"fx",[]);}return this.each(function(){var dequeue=true,index=type!=null&&type+"queueHooks",timers=jQuery.timers,data=dataPriv.get(this);if(index){if(data[index]&&data[index].stop){stopQueue(data[index]);}}else {for(index in data){if(data[index]&&data[index].stop&&rrun.test(index)){stopQueue(data[index]);}}}for(index=timers.length;index--;){if(timers[index].elem===this&&(type==null||timers[index].queue===type)){timers[index].anim.stop(gotoEnd);dequeue=false;timers.splice(index,1);}} // Start the next in the queue if the last step wasn't forced.
	// Timers currently will call their complete callbacks, which
	// will dequeue but only if they were gotoEnd.
	if(dequeue||!gotoEnd){jQuery.dequeue(this,type);}});},finish:function finish(type){if(type!==false){type=type||"fx";}return this.each(function(){var index,data=dataPriv.get(this),queue=data[type+"queue"],hooks=data[type+"queueHooks"],timers=jQuery.timers,length=queue?queue.length:0; // Enable finishing flag on private data
	data.finish=true; // Empty the queue first
	jQuery.queue(this,type,[]);if(hooks&&hooks.stop){hooks.stop.call(this,true);} // Look for any active animations, and finish them
	for(index=timers.length;index--;){if(timers[index].elem===this&&timers[index].queue===type){timers[index].anim.stop(true);timers.splice(index,1);}} // Look for any animations in the old queue and finish them
	for(index=0;index<length;index++){if(queue[index]&&queue[index].finish){queue[index].finish.call(this);}} // Turn off finishing flag
	delete data.finish;});}});jQuery.each(["toggle","show","hide"],function(i,name){var cssFn=jQuery.fn[name];jQuery.fn[name]=function(speed,easing,callback){return speed==null||typeof speed==="boolean"?cssFn.apply(this,arguments):this.animate(genFx(name,true),speed,easing,callback);};}); // Generate shortcuts for custom animations
	jQuery.each({slideDown:genFx("show"),slideUp:genFx("hide"),slideToggle:genFx("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(name,props){jQuery.fn[name]=function(speed,easing,callback){return this.animate(props,speed,easing,callback);};});jQuery.timers=[];jQuery.fx.tick=function(){var timer,i=0,timers=jQuery.timers;fxNow=jQuery.now();for(;i<timers.length;i++){timer=timers[i]; // Checks the timer has not already been removed
	if(!timer()&&timers[i]===timer){timers.splice(i--,1);}}if(!timers.length){jQuery.fx.stop();}fxNow=undefined;};jQuery.fx.timer=function(timer){jQuery.timers.push(timer);if(timer()){jQuery.fx.start();}else {jQuery.timers.pop();}};jQuery.fx.interval=13;jQuery.fx.start=function(){if(!timerId){timerId=window.setInterval(jQuery.fx.tick,jQuery.fx.interval);}};jQuery.fx.stop=function(){window.clearInterval(timerId);timerId=null;};jQuery.fx.speeds={slow:600,fast:200, // Default speed
	_default:400}; // Based off of the plugin by Clint Helfers, with permission.
	// http://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/
	jQuery.fn.delay=function(time,type){time=jQuery.fx?jQuery.fx.speeds[time]||time:time;type=type||"fx";return this.queue(type,function(next,hooks){var timeout=window.setTimeout(next,time);hooks.stop=function(){window.clearTimeout(timeout);};});};(function(){var input=document.createElement("input"),select=document.createElement("select"),opt=select.appendChild(document.createElement("option"));input.type="checkbox"; // Support: iOS<=5.1, Android<=4.2+
	// Default value for a checkbox should be "on"
	support.checkOn=input.value!==""; // Support: IE<=11+
	// Must access selectedIndex to make default options select
	support.optSelected=opt.selected; // Support: Android<=2.3
	// Options inside disabled selects are incorrectly marked as disabled
	select.disabled=true;support.optDisabled=!opt.disabled; // Support: IE<=11+
	// An input loses its value after becoming a radio
	input=document.createElement("input");input.value="t";input.type="radio";support.radioValue=input.value==="t";})();var boolHook,attrHandle=jQuery.expr.attrHandle;jQuery.fn.extend({attr:function attr(name,value){return access(this,jQuery.attr,name,value,arguments.length>1);},removeAttr:function removeAttr(name){return this.each(function(){jQuery.removeAttr(this,name);});}});jQuery.extend({attr:function attr(elem,name,value){var ret,hooks,nType=elem.nodeType; // Don't get/set attributes on text, comment and attribute nodes
	if(nType===3||nType===8||nType===2){return;} // Fallback to prop when attributes are not supported
	if(typeof elem.getAttribute==="undefined"){return jQuery.prop(elem,name,value);} // All attributes are lowercase
	// Grab necessary hook if one is defined
	if(nType!==1||!jQuery.isXMLDoc(elem)){name=name.toLowerCase();hooks=jQuery.attrHooks[name]||(jQuery.expr.match.bool.test(name)?boolHook:undefined);}if(value!==undefined){if(value===null){jQuery.removeAttr(elem,name);return;}if(hooks&&"set" in hooks&&(ret=hooks.set(elem,value,name))!==undefined){return ret;}elem.setAttribute(name,value+"");return value;}if(hooks&&"get" in hooks&&(ret=hooks.get(elem,name))!==null){return ret;}ret=jQuery.find.attr(elem,name); // Non-existent attributes return null, we normalize to undefined
	return ret==null?undefined:ret;},attrHooks:{type:{set:function set(elem,value){if(!support.radioValue&&value==="radio"&&jQuery.nodeName(elem,"input")){var val=elem.value;elem.setAttribute("type",value);if(val){elem.value=val;}return value;}}}},removeAttr:function removeAttr(elem,value){var name,propName,i=0,attrNames=value&&value.match(rnotwhite);if(attrNames&&elem.nodeType===1){while(name=attrNames[i++]){propName=jQuery.propFix[name]||name; // Boolean attributes get special treatment (#10870)
	if(jQuery.expr.match.bool.test(name)){ // Set corresponding property to false
	elem[propName]=false;}elem.removeAttribute(name);}}}}); // Hooks for boolean attributes
	boolHook={set:function set(elem,value,name){if(value===false){ // Remove boolean attributes when set to false
	jQuery.removeAttr(elem,name);}else {elem.setAttribute(name,name);}return name;}};jQuery.each(jQuery.expr.match.bool.source.match(/\w+/g),function(i,name){var getter=attrHandle[name]||jQuery.find.attr;attrHandle[name]=function(elem,name,isXML){var ret,handle;if(!isXML){ // Avoid an infinite loop by temporarily removing this function from the getter
	handle=attrHandle[name];attrHandle[name]=ret;ret=getter(elem,name,isXML)!=null?name.toLowerCase():null;attrHandle[name]=handle;}return ret;};});var rfocusable=/^(?:input|select|textarea|button)$/i,rclickable=/^(?:a|area)$/i;jQuery.fn.extend({prop:function prop(name,value){return access(this,jQuery.prop,name,value,arguments.length>1);},removeProp:function removeProp(name){return this.each(function(){delete this[jQuery.propFix[name]||name];});}});jQuery.extend({prop:function prop(elem,name,value){var ret,hooks,nType=elem.nodeType; // Don't get/set properties on text, comment and attribute nodes
	if(nType===3||nType===8||nType===2){return;}if(nType!==1||!jQuery.isXMLDoc(elem)){ // Fix name and attach hooks
	name=jQuery.propFix[name]||name;hooks=jQuery.propHooks[name];}if(value!==undefined){if(hooks&&"set" in hooks&&(ret=hooks.set(elem,value,name))!==undefined){return ret;}return elem[name]=value;}if(hooks&&"get" in hooks&&(ret=hooks.get(elem,name))!==null){return ret;}return elem[name];},propHooks:{tabIndex:{get:function get(elem){ // elem.tabIndex doesn't always return the
	// correct value when it hasn't been explicitly set
	// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
	// Use proper attribute retrieval(#12072)
	var tabindex=jQuery.find.attr(elem,"tabindex");return tabindex?parseInt(tabindex,10):rfocusable.test(elem.nodeName)||rclickable.test(elem.nodeName)&&elem.href?0:-1;}}},propFix:{"for":"htmlFor","class":"className"}});if(!support.optSelected){jQuery.propHooks.selected={get:function get(elem){var parent=elem.parentNode;if(parent&&parent.parentNode){parent.parentNode.selectedIndex;}return null;}};}jQuery.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){jQuery.propFix[this.toLowerCase()]=this;});var rclass=/[\t\r\n\f]/g;function getClass(elem){return elem.getAttribute&&elem.getAttribute("class")||"";}jQuery.fn.extend({addClass:function addClass(value){var classes,elem,cur,curValue,clazz,j,finalValue,i=0;if(jQuery.isFunction(value)){return this.each(function(j){jQuery(this).addClass(value.call(this,j,getClass(this)));});}if(typeof value==="string"&&value){classes=value.match(rnotwhite)||[];while(elem=this[i++]){curValue=getClass(elem);cur=elem.nodeType===1&&(" "+curValue+" ").replace(rclass," ");if(cur){j=0;while(clazz=classes[j++]){if(cur.indexOf(" "+clazz+" ")<0){cur+=clazz+" ";}} // Only assign if different to avoid unneeded rendering.
	finalValue=jQuery.trim(cur);if(curValue!==finalValue){elem.setAttribute("class",finalValue);}}}}return this;},removeClass:function removeClass(value){var classes,elem,cur,curValue,clazz,j,finalValue,i=0;if(jQuery.isFunction(value)){return this.each(function(j){jQuery(this).removeClass(value.call(this,j,getClass(this)));});}if(!arguments.length){return this.attr("class","");}if(typeof value==="string"&&value){classes=value.match(rnotwhite)||[];while(elem=this[i++]){curValue=getClass(elem); // This expression is here for better compressibility (see addClass)
	cur=elem.nodeType===1&&(" "+curValue+" ").replace(rclass," ");if(cur){j=0;while(clazz=classes[j++]){ // Remove *all* instances
	while(cur.indexOf(" "+clazz+" ")>-1){cur=cur.replace(" "+clazz+" "," ");}} // Only assign if different to avoid unneeded rendering.
	finalValue=jQuery.trim(cur);if(curValue!==finalValue){elem.setAttribute("class",finalValue);}}}}return this;},toggleClass:function toggleClass(value,stateVal){var type=typeof value==="undefined"?"undefined":_typeof(value);if(typeof stateVal==="boolean"&&type==="string"){return stateVal?this.addClass(value):this.removeClass(value);}if(jQuery.isFunction(value)){return this.each(function(i){jQuery(this).toggleClass(value.call(this,i,getClass(this),stateVal),stateVal);});}return this.each(function(){var className,i,self,classNames;if(type==="string"){ // Toggle individual class names
	i=0;self=jQuery(this);classNames=value.match(rnotwhite)||[];while(className=classNames[i++]){ // Check each className given, space separated list
	if(self.hasClass(className)){self.removeClass(className);}else {self.addClass(className);}} // Toggle whole class name
	}else if(value===undefined||type==="boolean"){className=getClass(this);if(className){ // Store className if set
	dataPriv.set(this,"__className__",className);} // If the element has a class name or if we're passed `false`,
	// then remove the whole classname (if there was one, the above saved it).
	// Otherwise bring back whatever was previously saved (if anything),
	// falling back to the empty string if nothing was stored.
	if(this.setAttribute){this.setAttribute("class",className||value===false?"":dataPriv.get(this,"__className__")||"");}}});},hasClass:function hasClass(selector){var className,elem,i=0;className=" "+selector+" ";while(elem=this[i++]){if(elem.nodeType===1&&(" "+getClass(elem)+" ").replace(rclass," ").indexOf(className)>-1){return true;}}return false;}});var rreturn=/\r/g;jQuery.fn.extend({val:function val(value){var hooks,ret,isFunction,elem=this[0];if(!arguments.length){if(elem){hooks=jQuery.valHooks[elem.type]||jQuery.valHooks[elem.nodeName.toLowerCase()];if(hooks&&"get" in hooks&&(ret=hooks.get(elem,"value"))!==undefined){return ret;}ret=elem.value;return typeof ret==="string"? // Handle most common string cases
	ret.replace(rreturn,""): // Handle cases where value is null/undef or number
	ret==null?"":ret;}return;}isFunction=jQuery.isFunction(value);return this.each(function(i){var val;if(this.nodeType!==1){return;}if(isFunction){val=value.call(this,i,jQuery(this).val());}else {val=value;} // Treat null/undefined as ""; convert numbers to string
	if(val==null){val="";}else if(typeof val==="number"){val+="";}else if(jQuery.isArray(val)){val=jQuery.map(val,function(value){return value==null?"":value+"";});}hooks=jQuery.valHooks[this.type]||jQuery.valHooks[this.nodeName.toLowerCase()]; // If set returns undefined, fall back to normal setting
	if(!hooks||!("set" in hooks)||hooks.set(this,val,"value")===undefined){this.value=val;}});}});jQuery.extend({valHooks:{option:{get:function get(elem){ // Support: IE<11
	// option.value not trimmed (#14858)
	return jQuery.trim(elem.value);}},select:{get:function get(elem){var value,option,options=elem.options,index=elem.selectedIndex,one=elem.type==="select-one"||index<0,values=one?null:[],max=one?index+1:options.length,i=index<0?max:one?index:0; // Loop through all the selected options
	for(;i<max;i++){option=options[i]; // IE8-9 doesn't update selected after form reset (#2551)
	if((option.selected||i===index)&&( // Don't return options that are disabled or in a disabled optgroup
	support.optDisabled?!option.disabled:option.getAttribute("disabled")===null)&&(!option.parentNode.disabled||!jQuery.nodeName(option.parentNode,"optgroup"))){ // Get the specific value for the option
	value=jQuery(option).val(); // We don't need an array for one selects
	if(one){return value;} // Multi-Selects return an array
	values.push(value);}}return values;},set:function set(elem,value){var optionSet,option,options=elem.options,values=jQuery.makeArray(value),i=options.length;while(i--){option=options[i];if(option.selected=jQuery.inArray(jQuery.valHooks.option.get(option),values)>-1){optionSet=true;}} // Force browsers to behave consistently when non-matching value is set
	if(!optionSet){elem.selectedIndex=-1;}return values;}}}}); // Radios and checkboxes getter/setter
	jQuery.each(["radio","checkbox"],function(){jQuery.valHooks[this]={set:function set(elem,value){if(jQuery.isArray(value)){return elem.checked=jQuery.inArray(jQuery(elem).val(),value)>-1;}}};if(!support.checkOn){jQuery.valHooks[this].get=function(elem){return elem.getAttribute("value")===null?"on":elem.value;};}}); // Return jQuery for attributes-only inclusion
	var rfocusMorph=/^(?:focusinfocus|focusoutblur)$/;jQuery.extend(jQuery.event,{trigger:function trigger(event,data,elem,onlyHandlers){var i,cur,tmp,bubbleType,ontype,handle,special,eventPath=[elem||document],type=hasOwn.call(event,"type")?event.type:event,namespaces=hasOwn.call(event,"namespace")?event.namespace.split("."):[];cur=tmp=elem=elem||document; // Don't do events on text and comment nodes
	if(elem.nodeType===3||elem.nodeType===8){return;} // focus/blur morphs to focusin/out; ensure we're not firing them right now
	if(rfocusMorph.test(type+jQuery.event.triggered)){return;}if(type.indexOf(".")>-1){ // Namespaced trigger; create a regexp to match event type in handle()
	namespaces=type.split(".");type=namespaces.shift();namespaces.sort();}ontype=type.indexOf(":")<0&&"on"+type; // Caller can pass in a jQuery.Event object, Object, or just an event type string
	event=event[jQuery.expando]?event:new jQuery.Event(type,(typeof event==="undefined"?"undefined":_typeof(event))==="object"&&event); // Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
	event.isTrigger=onlyHandlers?2:3;event.namespace=namespaces.join(".");event.rnamespace=event.namespace?new RegExp("(^|\\.)"+namespaces.join("\\.(?:.*\\.|)")+"(\\.|$)"):null; // Clean up the event in case it is being reused
	event.result=undefined;if(!event.target){event.target=elem;} // Clone any incoming data and prepend the event, creating the handler arg list
	data=data==null?[event]:jQuery.makeArray(data,[event]); // Allow special events to draw outside the lines
	special=jQuery.event.special[type]||{};if(!onlyHandlers&&special.trigger&&special.trigger.apply(elem,data)===false){return;} // Determine event propagation path in advance, per W3C events spec (#9951)
	// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
	if(!onlyHandlers&&!special.noBubble&&!jQuery.isWindow(elem)){bubbleType=special.delegateType||type;if(!rfocusMorph.test(bubbleType+type)){cur=cur.parentNode;}for(;cur;cur=cur.parentNode){eventPath.push(cur);tmp=cur;} // Only add window if we got to document (e.g., not plain obj or detached DOM)
	if(tmp===(elem.ownerDocument||document)){eventPath.push(tmp.defaultView||tmp.parentWindow||window);}} // Fire handlers on the event path
	i=0;while((cur=eventPath[i++])&&!event.isPropagationStopped()){event.type=i>1?bubbleType:special.bindType||type; // jQuery handler
	handle=(dataPriv.get(cur,"events")||{})[event.type]&&dataPriv.get(cur,"handle");if(handle){handle.apply(cur,data);} // Native handler
	handle=ontype&&cur[ontype];if(handle&&handle.apply&&acceptData(cur)){event.result=handle.apply(cur,data);if(event.result===false){event.preventDefault();}}}event.type=type; // If nobody prevented the default action, do it now
	if(!onlyHandlers&&!event.isDefaultPrevented()){if((!special._default||special._default.apply(eventPath.pop(),data)===false)&&acceptData(elem)){ // Call a native DOM method on the target with the same name name as the event.
	// Don't do default actions on window, that's where global variables be (#6170)
	if(ontype&&jQuery.isFunction(elem[type])&&!jQuery.isWindow(elem)){ // Don't re-trigger an onFOO event when we call its FOO() method
	tmp=elem[ontype];if(tmp){elem[ontype]=null;} // Prevent re-triggering of the same event, since we already bubbled it above
	jQuery.event.triggered=type;elem[type]();jQuery.event.triggered=undefined;if(tmp){elem[ontype]=tmp;}}}}return event.result;}, // Piggyback on a donor event to simulate a different one
	simulate:function simulate(type,elem,event){var e=jQuery.extend(new jQuery.Event(),event,{type:type,isSimulated:true // Previously, `originalEvent: {}` was set here, so stopPropagation call
	// would not be triggered on donor event, since in our own
	// jQuery.event.stopPropagation function we had a check for existence of
	// originalEvent.stopPropagation method, so, consequently it would be a noop.
	//
	// But now, this "simulate" function is used only for events
	// for which stopPropagation() is noop, so there is no need for that anymore.
	//
	// For the compat branch though, guard for "click" and "submit"
	// events is still used, but was moved to jQuery.event.stopPropagation function
	// because `originalEvent` should point to the original event for the constancy
	// with other events and for more focused logic
	});jQuery.event.trigger(e,null,elem);if(e.isDefaultPrevented()){event.preventDefault();}}});jQuery.fn.extend({trigger:function trigger(type,data){return this.each(function(){jQuery.event.trigger(type,data,this);});},triggerHandler:function triggerHandler(type,data){var elem=this[0];if(elem){return jQuery.event.trigger(type,data,elem,true);}}});jQuery.each(("blur focus focusin focusout load resize scroll unload click dblclick "+"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave "+"change select submit keydown keypress keyup error contextmenu").split(" "),function(i,name){ // Handle event binding
	jQuery.fn[name]=function(data,fn){return arguments.length>0?this.on(name,null,data,fn):this.trigger(name);};});jQuery.fn.extend({hover:function hover(fnOver,fnOut){return this.mouseenter(fnOver).mouseleave(fnOut||fnOver);}});support.focusin="onfocusin" in window; // Support: Firefox
	// Firefox doesn't have focus(in | out) events
	// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
	//
	// Support: Chrome, Safari
	// focus(in | out) events fire after focus & blur events,
	// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
	// Related ticket - https://code.google.com/p/chromium/issues/detail?id=449857
	if(!support.focusin){jQuery.each({focus:"focusin",blur:"focusout"},function(orig,fix){ // Attach a single capturing handler on the document while someone wants focusin/focusout
	var handler=function handler(event){jQuery.event.simulate(fix,event.target,jQuery.event.fix(event));};jQuery.event.special[fix]={setup:function setup(){var doc=this.ownerDocument||this,attaches=dataPriv.access(doc,fix);if(!attaches){doc.addEventListener(orig,handler,true);}dataPriv.access(doc,fix,(attaches||0)+1);},teardown:function teardown(){var doc=this.ownerDocument||this,attaches=dataPriv.access(doc,fix)-1;if(!attaches){doc.removeEventListener(orig,handler,true);dataPriv.remove(doc,fix);}else {dataPriv.access(doc,fix,attaches);}}};});}var location=window.location;var nonce=jQuery.now();var rquery=/\?/; // Support: Android 2.3
	// Workaround failure to string-cast null input
	jQuery.parseJSON=function(data){return JSON.parse(data+"");}; // Cross-browser xml parsing
	jQuery.parseXML=function(data){var xml;if(!data||typeof data!=="string"){return null;} // Support: IE9
	try{xml=new window.DOMParser().parseFromString(data,"text/xml");}catch(e){xml=undefined;}if(!xml||xml.getElementsByTagName("parsererror").length){jQuery.error("Invalid XML: "+data);}return xml;};var rhash=/#.*$/,rts=/([?&])_=[^&]*/,rheaders=/^(.*?):[ \t]*([^\r\n]*)$/mg, // #7653, #8125, #8152: local protocol detection
	rlocalProtocol=/^(?:about|app|app-storage|.+-extension|file|res|widget):$/,rnoContent=/^(?:GET|HEAD)$/,rprotocol=/^\/\//, /* Prefilters
		 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
		 * 2) These are called:
		 *    - BEFORE asking for a transport
		 *    - AFTER param serialization (s.data is a string if s.processData is true)
		 * 3) key is the dataType
		 * 4) the catchall symbol "*" can be used
		 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
		 */prefilters={}, /* Transports bindings
		 * 1) key is the dataType
		 * 2) the catchall symbol "*" can be used
		 * 3) selection will start with transport dataType and THEN go to "*" if needed
		 */transports={}, // Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes="*/".concat("*"), // Anchor tag for parsing the document origin
	originAnchor=document.createElement("a");originAnchor.href=location.href; // Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
	function addToPrefiltersOrTransports(structure){ // dataTypeExpression is optional and defaults to "*"
	return function(dataTypeExpression,func){if(typeof dataTypeExpression!=="string"){func=dataTypeExpression;dataTypeExpression="*";}var dataType,i=0,dataTypes=dataTypeExpression.toLowerCase().match(rnotwhite)||[];if(jQuery.isFunction(func)){ // For each dataType in the dataTypeExpression
	while(dataType=dataTypes[i++]){ // Prepend if requested
	if(dataType[0]==="+"){dataType=dataType.slice(1)||"*";(structure[dataType]=structure[dataType]||[]).unshift(func); // Otherwise append
	}else {(structure[dataType]=structure[dataType]||[]).push(func);}}}};} // Base inspection function for prefilters and transports
	function inspectPrefiltersOrTransports(structure,options,originalOptions,jqXHR){var inspected={},seekingTransport=structure===transports;function inspect(dataType){var selected;inspected[dataType]=true;jQuery.each(structure[dataType]||[],function(_,prefilterOrFactory){var dataTypeOrTransport=prefilterOrFactory(options,originalOptions,jqXHR);if(typeof dataTypeOrTransport==="string"&&!seekingTransport&&!inspected[dataTypeOrTransport]){options.dataTypes.unshift(dataTypeOrTransport);inspect(dataTypeOrTransport);return false;}else if(seekingTransport){return !(selected=dataTypeOrTransport);}});return selected;}return inspect(options.dataTypes[0])||!inspected["*"]&&inspect("*");} // A special extend for ajax options
	// that takes "flat" options (not to be deep extended)
	// Fixes #9887
	function ajaxExtend(target,src){var key,deep,flatOptions=jQuery.ajaxSettings.flatOptions||{};for(key in src){if(src[key]!==undefined){(flatOptions[key]?target:deep||(deep={}))[key]=src[key];}}if(deep){jQuery.extend(true,target,deep);}return target;} /* Handles responses to an ajax request:
	 * - finds the right dataType (mediates between content-type and expected dataType)
	 * - returns the corresponding response
	 */function ajaxHandleResponses(s,jqXHR,responses){var ct,type,finalDataType,firstDataType,contents=s.contents,dataTypes=s.dataTypes; // Remove auto dataType and get content-type in the process
	while(dataTypes[0]==="*"){dataTypes.shift();if(ct===undefined){ct=s.mimeType||jqXHR.getResponseHeader("Content-Type");}} // Check if we're dealing with a known content-type
	if(ct){for(type in contents){if(contents[type]&&contents[type].test(ct)){dataTypes.unshift(type);break;}}} // Check to see if we have a response for the expected dataType
	if(dataTypes[0] in responses){finalDataType=dataTypes[0];}else { // Try convertible dataTypes
	for(type in responses){if(!dataTypes[0]||s.converters[type+" "+dataTypes[0]]){finalDataType=type;break;}if(!firstDataType){firstDataType=type;}} // Or just use first one
	finalDataType=finalDataType||firstDataType;} // If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if(finalDataType){if(finalDataType!==dataTypes[0]){dataTypes.unshift(finalDataType);}return responses[finalDataType];}} /* Chain conversions given the request and the original response
	 * Also sets the responseXXX fields on the jqXHR instance
	 */function ajaxConvert(s,response,jqXHR,isSuccess){var conv2,current,conv,tmp,prev,converters={}, // Work with a copy of dataTypes in case we need to modify it for conversion
	dataTypes=s.dataTypes.slice(); // Create converters map with lowercased keys
	if(dataTypes[1]){for(conv in s.converters){converters[conv.toLowerCase()]=s.converters[conv];}}current=dataTypes.shift(); // Convert to each sequential dataType
	while(current){if(s.responseFields[current]){jqXHR[s.responseFields[current]]=response;} // Apply the dataFilter if provided
	if(!prev&&isSuccess&&s.dataFilter){response=s.dataFilter(response,s.dataType);}prev=current;current=dataTypes.shift();if(current){ // There's only work to do if current dataType is non-auto
	if(current==="*"){current=prev; // Convert response if prev dataType is non-auto and differs from current
	}else if(prev!=="*"&&prev!==current){ // Seek a direct converter
	conv=converters[prev+" "+current]||converters["* "+current]; // If none found, seek a pair
	if(!conv){for(conv2 in converters){ // If conv2 outputs current
	tmp=conv2.split(" ");if(tmp[1]===current){ // If prev can be converted to accepted input
	conv=converters[prev+" "+tmp[0]]||converters["* "+tmp[0]];if(conv){ // Condense equivalence converters
	if(conv===true){conv=converters[conv2]; // Otherwise, insert the intermediate dataType
	}else if(converters[conv2]!==true){current=tmp[0];dataTypes.unshift(tmp[1]);}break;}}}} // Apply converter (if not an equivalence)
	if(conv!==true){ // Unless errors are allowed to bubble, catch and return them
	if(conv&&s.throws){response=conv(response);}else {try{response=conv(response);}catch(e){return {state:"parsererror",error:conv?e:"No conversion from "+prev+" to "+current};}}}}}}return {state:"success",data:response};}jQuery.extend({ // Counter for holding the number of active queries
	active:0, // Last-Modified header cache for next request
	lastModified:{},etag:{},ajaxSettings:{url:location.href,type:"GET",isLocal:rlocalProtocol.test(location.protocol),global:true,processData:true,async:true,contentType:"application/x-www-form-urlencoded; charset=UTF-8", /*
			timeout: 0,
			data: null,
			dataType: null,
			username: null,
			password: null,
			cache: null,
			throws: false,
			traditional: false,
			headers: {},
			*/accepts:{"*":allTypes,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/\bxml\b/,html:/\bhtml/,json:/\bjson\b/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"}, // Data converters
	// Keys separate source (or catchall "*") and destination types with a single space
	converters:{ // Convert anything to text
	"* text":String, // Text to html (true = no transformation)
	"text html":true, // Evaluate text as a json expression
	"text json":jQuery.parseJSON, // Parse text as xml
	"text xml":jQuery.parseXML}, // For options that shouldn't be deep extended:
	// you can add your own custom options here if
	// and when you create one that shouldn't be
	// deep extended (see ajaxExtend)
	flatOptions:{url:true,context:true}}, // Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup:function ajaxSetup(target,settings){return settings? // Building a settings object
	ajaxExtend(ajaxExtend(target,jQuery.ajaxSettings),settings): // Extending ajaxSettings
	ajaxExtend(jQuery.ajaxSettings,target);},ajaxPrefilter:addToPrefiltersOrTransports(prefilters),ajaxTransport:addToPrefiltersOrTransports(transports), // Main method
	ajax:function ajax(url,options){ // If url is an object, simulate pre-1.5 signature
	if((typeof url==="undefined"?"undefined":_typeof(url))==="object"){options=url;url=undefined;} // Force options to be an object
	options=options||{};var transport, // URL without anti-cache param
	cacheURL, // Response headers
	responseHeadersString,responseHeaders, // timeout handle
	timeoutTimer, // Url cleanup var
	urlAnchor, // To know if global events are to be dispatched
	fireGlobals, // Loop variable
	i, // Create the final options object
	s=jQuery.ajaxSetup({},options), // Callbacks context
	callbackContext=s.context||s, // Context for global events is callbackContext if it is a DOM node or jQuery collection
	globalEventContext=s.context&&(callbackContext.nodeType||callbackContext.jquery)?jQuery(callbackContext):jQuery.event, // Deferreds
	deferred=jQuery.Deferred(),completeDeferred=jQuery.Callbacks("once memory"), // Status-dependent callbacks
	_statusCode=s.statusCode||{}, // Headers (they are sent all at once)
	requestHeaders={},requestHeadersNames={}, // The jqXHR state
	state=0, // Default abort message
	strAbort="canceled", // Fake xhr
	jqXHR={readyState:0, // Builds headers hashtable if needed
	getResponseHeader:function getResponseHeader(key){var match;if(state===2){if(!responseHeaders){responseHeaders={};while(match=rheaders.exec(responseHeadersString)){responseHeaders[match[1].toLowerCase()]=match[2];}}match=responseHeaders[key.toLowerCase()];}return match==null?null:match;}, // Raw string
	getAllResponseHeaders:function getAllResponseHeaders(){return state===2?responseHeadersString:null;}, // Caches the header
	setRequestHeader:function setRequestHeader(name,value){var lname=name.toLowerCase();if(!state){name=requestHeadersNames[lname]=requestHeadersNames[lname]||name;requestHeaders[name]=value;}return this;}, // Overrides response content-type header
	overrideMimeType:function overrideMimeType(type){if(!state){s.mimeType=type;}return this;}, // Status-dependent callbacks
	statusCode:function statusCode(map){var code;if(map){if(state<2){for(code in map){ // Lazy-add the new callback in a way that preserves old ones
	_statusCode[code]=[_statusCode[code],map[code]];}}else { // Execute the appropriate callbacks
	jqXHR.always(map[jqXHR.status]);}}return this;}, // Cancel the request
	abort:function abort(statusText){var finalText=statusText||strAbort;if(transport){transport.abort(finalText);}done(0,finalText);return this;}}; // Attach deferreds
	deferred.promise(jqXHR).complete=completeDeferred.add;jqXHR.success=jqXHR.done;jqXHR.error=jqXHR.fail; // Remove hash character (#7531: and string promotion)
	// Add protocol if not provided (prefilters might expect it)
	// Handle falsy url in the settings object (#10093: consistency with old signature)
	// We also use the url parameter if available
	s.url=((url||s.url||location.href)+"").replace(rhash,"").replace(rprotocol,location.protocol+"//"); // Alias method option to type as per ticket #12004
	s.type=options.method||options.type||s.method||s.type; // Extract dataTypes list
	s.dataTypes=jQuery.trim(s.dataType||"*").toLowerCase().match(rnotwhite)||[""]; // A cross-domain request is in order when the origin doesn't match the current origin.
	if(s.crossDomain==null){urlAnchor=document.createElement("a"); // Support: IE8-11+
	// IE throws exception if url is malformed, e.g. http://example.com:80x/
	try{urlAnchor.href=s.url; // Support: IE8-11+
	// Anchor's host property isn't correctly set when s.url is relative
	urlAnchor.href=urlAnchor.href;s.crossDomain=originAnchor.protocol+"//"+originAnchor.host!==urlAnchor.protocol+"//"+urlAnchor.host;}catch(e){ // If there is an error parsing the URL, assume it is crossDomain,
	// it can be rejected by the transport if it is invalid
	s.crossDomain=true;}} // Convert data if not already a string
	if(s.data&&s.processData&&typeof s.data!=="string"){s.data=jQuery.param(s.data,s.traditional);} // Apply prefilters
	inspectPrefiltersOrTransports(prefilters,s,options,jqXHR); // If request was aborted inside a prefilter, stop there
	if(state===2){return jqXHR;} // We can fire global events as of now if asked to
	// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
	fireGlobals=jQuery.event&&s.global; // Watch for a new set of requests
	if(fireGlobals&&jQuery.active++===0){jQuery.event.trigger("ajaxStart");} // Uppercase the type
	s.type=s.type.toUpperCase(); // Determine if request has content
	s.hasContent=!rnoContent.test(s.type); // Save the URL in case we're toying with the If-Modified-Since
	// and/or If-None-Match header later on
	cacheURL=s.url; // More options handling for requests with no content
	if(!s.hasContent){ // If data is available, append data to url
	if(s.data){cacheURL=s.url+=(rquery.test(cacheURL)?"&":"?")+s.data; // #9682: remove data so that it's not used in an eventual retry
	delete s.data;} // Add anti-cache in url if needed
	if(s.cache===false){s.url=rts.test(cacheURL)? // If there is already a '_' parameter, set its value
	cacheURL.replace(rts,"$1_="+nonce++): // Otherwise add one to the end
	cacheURL+(rquery.test(cacheURL)?"&":"?")+"_="+nonce++;}} // Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
	if(s.ifModified){if(jQuery.lastModified[cacheURL]){jqXHR.setRequestHeader("If-Modified-Since",jQuery.lastModified[cacheURL]);}if(jQuery.etag[cacheURL]){jqXHR.setRequestHeader("If-None-Match",jQuery.etag[cacheURL]);}} // Set the correct header, if data is being sent
	if(s.data&&s.hasContent&&s.contentType!==false||options.contentType){jqXHR.setRequestHeader("Content-Type",s.contentType);} // Set the Accepts header for the server, depending on the dataType
	jqXHR.setRequestHeader("Accept",s.dataTypes[0]&&s.accepts[s.dataTypes[0]]?s.accepts[s.dataTypes[0]]+(s.dataTypes[0]!=="*"?", "+allTypes+"; q=0.01":""):s.accepts["*"]); // Check for headers option
	for(i in s.headers){jqXHR.setRequestHeader(i,s.headers[i]);} // Allow custom headers/mimetypes and early abort
	if(s.beforeSend&&(s.beforeSend.call(callbackContext,jqXHR,s)===false||state===2)){ // Abort if not done already and return
	return jqXHR.abort();} // Aborting is no longer a cancellation
	strAbort="abort"; // Install callbacks on deferreds
	for(i in {success:1,error:1,complete:1}){jqXHR[i](s[i]);} // Get transport
	transport=inspectPrefiltersOrTransports(transports,s,options,jqXHR); // If no transport, we auto-abort
	if(!transport){done(-1,"No Transport");}else {jqXHR.readyState=1; // Send global event
	if(fireGlobals){globalEventContext.trigger("ajaxSend",[jqXHR,s]);} // If request was aborted inside ajaxSend, stop there
	if(state===2){return jqXHR;} // Timeout
	if(s.async&&s.timeout>0){timeoutTimer=window.setTimeout(function(){jqXHR.abort("timeout");},s.timeout);}try{state=1;transport.send(requestHeaders,done);}catch(e){ // Propagate exception as error if not done
	if(state<2){done(-1,e); // Simply rethrow otherwise
	}else {throw e;}}} // Callback for when everything is done
	function done(status,nativeStatusText,responses,headers){var isSuccess,success,error,response,modified,statusText=nativeStatusText; // Called once
	if(state===2){return;} // State is "done" now
	state=2; // Clear timeout if it exists
	if(timeoutTimer){window.clearTimeout(timeoutTimer);} // Dereference transport for early garbage collection
	// (no matter how long the jqXHR object will be used)
	transport=undefined; // Cache response headers
	responseHeadersString=headers||""; // Set readyState
	jqXHR.readyState=status>0?4:0; // Determine if successful
	isSuccess=status>=200&&status<300||status===304; // Get response data
	if(responses){response=ajaxHandleResponses(s,jqXHR,responses);} // Convert no matter what (that way responseXXX fields are always set)
	response=ajaxConvert(s,response,jqXHR,isSuccess); // If successful, handle type chaining
	if(isSuccess){ // Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
	if(s.ifModified){modified=jqXHR.getResponseHeader("Last-Modified");if(modified){jQuery.lastModified[cacheURL]=modified;}modified=jqXHR.getResponseHeader("etag");if(modified){jQuery.etag[cacheURL]=modified;}} // if no content
	if(status===204||s.type==="HEAD"){statusText="nocontent"; // if not modified
	}else if(status===304){statusText="notmodified"; // If we have data, let's convert it
	}else {statusText=response.state;success=response.data;error=response.error;isSuccess=!error;}}else { // Extract error from statusText and normalize for non-aborts
	error=statusText;if(status||!statusText){statusText="error";if(status<0){status=0;}}} // Set data for the fake xhr object
	jqXHR.status=status;jqXHR.statusText=(nativeStatusText||statusText)+""; // Success/Error
	if(isSuccess){deferred.resolveWith(callbackContext,[success,statusText,jqXHR]);}else {deferred.rejectWith(callbackContext,[jqXHR,statusText,error]);} // Status-dependent callbacks
	jqXHR.statusCode(_statusCode);_statusCode=undefined;if(fireGlobals){globalEventContext.trigger(isSuccess?"ajaxSuccess":"ajaxError",[jqXHR,s,isSuccess?success:error]);} // Complete
	completeDeferred.fireWith(callbackContext,[jqXHR,statusText]);if(fireGlobals){globalEventContext.trigger("ajaxComplete",[jqXHR,s]); // Handle the global AJAX counter
	if(! --jQuery.active){jQuery.event.trigger("ajaxStop");}}}return jqXHR;},getJSON:function getJSON(url,data,callback){return jQuery.get(url,data,callback,"json");},getScript:function getScript(url,callback){return jQuery.get(url,undefined,callback,"script");}});jQuery.each(["get","post"],function(i,method){jQuery[method]=function(url,data,callback,type){ // Shift arguments if data argument was omitted
	if(jQuery.isFunction(data)){type=type||callback;callback=data;data=undefined;} // The url can be an options object (which then must have .url)
	return jQuery.ajax(jQuery.extend({url:url,type:method,dataType:type,data:data,success:callback},jQuery.isPlainObject(url)&&url));};});jQuery._evalUrl=function(url){return jQuery.ajax({url:url, // Make this explicit, since user can override this through ajaxSetup (#11264)
	type:"GET",dataType:"script",async:false,global:false,"throws":true});};jQuery.fn.extend({wrapAll:function wrapAll(html){var wrap;if(jQuery.isFunction(html)){return this.each(function(i){jQuery(this).wrapAll(html.call(this,i));});}if(this[0]){ // The elements to wrap the target around
	wrap=jQuery(html,this[0].ownerDocument).eq(0).clone(true);if(this[0].parentNode){wrap.insertBefore(this[0]);}wrap.map(function(){var elem=this;while(elem.firstElementChild){elem=elem.firstElementChild;}return elem;}).append(this);}return this;},wrapInner:function wrapInner(html){if(jQuery.isFunction(html)){return this.each(function(i){jQuery(this).wrapInner(html.call(this,i));});}return this.each(function(){var self=jQuery(this),contents=self.contents();if(contents.length){contents.wrapAll(html);}else {self.append(html);}});},wrap:function wrap(html){var isFunction=jQuery.isFunction(html);return this.each(function(i){jQuery(this).wrapAll(isFunction?html.call(this,i):html);});},unwrap:function unwrap(){return this.parent().each(function(){if(!jQuery.nodeName(this,"body")){jQuery(this).replaceWith(this.childNodes);}}).end();}});jQuery.expr.filters.hidden=function(elem){return !jQuery.expr.filters.visible(elem);};jQuery.expr.filters.visible=function(elem){ // Support: Opera <= 12.12
	// Opera reports offsetWidths and offsetHeights less than zero on some elements
	// Use OR instead of AND as the element is not visible if either is true
	// See tickets #10406 and #13132
	return elem.offsetWidth>0||elem.offsetHeight>0||elem.getClientRects().length>0;};var r20=/%20/g,rbracket=/\[\]$/,rCRLF=/\r?\n/g,rsubmitterTypes=/^(?:submit|button|image|reset|file)$/i,rsubmittable=/^(?:input|select|textarea|keygen)/i;function buildParams(prefix,obj,traditional,add){var name;if(jQuery.isArray(obj)){ // Serialize array item.
	jQuery.each(obj,function(i,v){if(traditional||rbracket.test(prefix)){ // Treat each array item as a scalar.
	add(prefix,v);}else { // Item is non-scalar (array or object), encode its numeric index.
	buildParams(prefix+"["+((typeof v==="undefined"?"undefined":_typeof(v))==="object"&&v!=null?i:"")+"]",v,traditional,add);}});}else if(!traditional&&jQuery.type(obj)==="object"){ // Serialize object item.
	for(name in obj){buildParams(prefix+"["+name+"]",obj[name],traditional,add);}}else { // Serialize scalar item.
	add(prefix,obj);}} // Serialize an array of form elements or a set of
	// key/values into a query string
	jQuery.param=function(a,traditional){var prefix,s=[],add=function add(key,value){ // If value is a function, invoke it and return its value
	value=jQuery.isFunction(value)?value():value==null?"":value;s[s.length]=encodeURIComponent(key)+"="+encodeURIComponent(value);}; // Set traditional to true for jQuery <= 1.3.2 behavior.
	if(traditional===undefined){traditional=jQuery.ajaxSettings&&jQuery.ajaxSettings.traditional;} // If an array was passed in, assume that it is an array of form elements.
	if(jQuery.isArray(a)||a.jquery&&!jQuery.isPlainObject(a)){ // Serialize the form elements
	jQuery.each(a,function(){add(this.name,this.value);});}else { // If traditional, encode the "old" way (the way 1.3.2 or older
	// did it), otherwise encode params recursively.
	for(prefix in a){buildParams(prefix,a[prefix],traditional,add);}} // Return the resulting serialization
	return s.join("&").replace(r20,"+");};jQuery.fn.extend({serialize:function serialize(){return jQuery.param(this.serializeArray());},serializeArray:function serializeArray(){return this.map(function(){ // Can add propHook for "elements" to filter or add form elements
	var elements=jQuery.prop(this,"elements");return elements?jQuery.makeArray(elements):this;}).filter(function(){var type=this.type; // Use .is( ":disabled" ) so that fieldset[disabled] works
	return this.name&&!jQuery(this).is(":disabled")&&rsubmittable.test(this.nodeName)&&!rsubmitterTypes.test(type)&&(this.checked||!rcheckableType.test(type));}).map(function(i,elem){var val=jQuery(this).val();return val==null?null:jQuery.isArray(val)?jQuery.map(val,function(val){return {name:elem.name,value:val.replace(rCRLF,"\r\n")};}):{name:elem.name,value:val.replace(rCRLF,"\r\n")};}).get();}});jQuery.ajaxSettings.xhr=function(){try{return new window.XMLHttpRequest();}catch(e){}};var xhrSuccessStatus={ // File protocol always yields status code 0, assume 200
	0:200, // Support: IE9
	// #1450: sometimes IE returns 1223 when it should be 204
	1223:204},xhrSupported=jQuery.ajaxSettings.xhr();support.cors=!!xhrSupported&&"withCredentials" in xhrSupported;support.ajax=xhrSupported=!!xhrSupported;jQuery.ajaxTransport(function(options){var _callback,errorCallback; // Cross domain only allowed if supported through XMLHttpRequest
	if(support.cors||xhrSupported&&!options.crossDomain){return {send:function send(headers,complete){var i,xhr=options.xhr();xhr.open(options.type,options.url,options.async,options.username,options.password); // Apply custom fields if provided
	if(options.xhrFields){for(i in options.xhrFields){xhr[i]=options.xhrFields[i];}} // Override mime type if needed
	if(options.mimeType&&xhr.overrideMimeType){xhr.overrideMimeType(options.mimeType);} // X-Requested-With header
	// For cross-domain requests, seeing as conditions for a preflight are
	// akin to a jigsaw puzzle, we simply never set it to be sure.
	// (it can always be set on a per-request basis or even using ajaxSetup)
	// For same-domain requests, won't change header if already provided.
	if(!options.crossDomain&&!headers["X-Requested-With"]){headers["X-Requested-With"]="XMLHttpRequest";} // Set headers
	for(i in headers){xhr.setRequestHeader(i,headers[i]);} // Callback
	_callback=function callback(type){return function(){if(_callback){_callback=errorCallback=xhr.onload=xhr.onerror=xhr.onabort=xhr.onreadystatechange=null;if(type==="abort"){xhr.abort();}else if(type==="error"){ // Support: IE9
	// On a manual native abort, IE9 throws
	// errors on any property access that is not readyState
	if(typeof xhr.status!=="number"){complete(0,"error");}else {complete( // File: protocol always yields status 0; see #8605, #14207
	xhr.status,xhr.statusText);}}else {complete(xhrSuccessStatus[xhr.status]||xhr.status,xhr.statusText, // Support: IE9 only
	// IE9 has no XHR2 but throws on binary (trac-11426)
	// For XHR2 non-text, let the caller handle it (gh-2498)
	(xhr.responseType||"text")!=="text"||typeof xhr.responseText!=="string"?{binary:xhr.response}:{text:xhr.responseText},xhr.getAllResponseHeaders());}}};}; // Listen to events
	xhr.onload=_callback();errorCallback=xhr.onerror=_callback("error"); // Support: IE9
	// Use onreadystatechange to replace onabort
	// to handle uncaught aborts
	if(xhr.onabort!==undefined){xhr.onabort=errorCallback;}else {xhr.onreadystatechange=function(){ // Check readyState before timeout as it changes
	if(xhr.readyState===4){ // Allow onerror to be called first,
	// but that will not handle a native abort
	// Also, save errorCallback to a variable
	// as xhr.onerror cannot be accessed
	window.setTimeout(function(){if(_callback){errorCallback();}});}};} // Create the abort callback
	_callback=_callback("abort");try{ // Do send the request (this may raise an exception)
	xhr.send(options.hasContent&&options.data||null);}catch(e){ // #14683: Only rethrow if this hasn't been notified as an error yet
	if(_callback){throw e;}}},abort:function abort(){if(_callback){_callback();}}};}}); // Install script dataType
	jQuery.ajaxSetup({accepts:{script:"text/javascript, application/javascript, "+"application/ecmascript, application/x-ecmascript"},contents:{script:/\b(?:java|ecma)script\b/},converters:{"text script":function textScript(text){jQuery.globalEval(text);return text;}}}); // Handle cache's special case and crossDomain
	jQuery.ajaxPrefilter("script",function(s){if(s.cache===undefined){s.cache=false;}if(s.crossDomain){s.type="GET";}}); // Bind script tag hack transport
	jQuery.ajaxTransport("script",function(s){ // This transport only deals with cross domain requests
	if(s.crossDomain){var script,_callback2;return {send:function send(_,complete){script=jQuery("<script>").prop({charset:s.scriptCharset,src:s.url}).on("load error",_callback2=function callback(evt){script.remove();_callback2=null;if(evt){complete(evt.type==="error"?404:200,evt.type);}}); // Use native DOM manipulation to avoid our domManip AJAX trickery
	document.head.appendChild(script[0]);},abort:function abort(){if(_callback2){_callback2();}}};}});var oldCallbacks=[],rjsonp=/(=)\?(?=&|$)|\?\?/; // Default jsonp settings
	jQuery.ajaxSetup({jsonp:"callback",jsonpCallback:function jsonpCallback(){var callback=oldCallbacks.pop()||jQuery.expando+"_"+nonce++;this[callback]=true;return callback;}}); // Detect, normalize options and install callbacks for jsonp requests
	jQuery.ajaxPrefilter("json jsonp",function(s,originalSettings,jqXHR){var callbackName,overwritten,responseContainer,jsonProp=s.jsonp!==false&&(rjsonp.test(s.url)?"url":typeof s.data==="string"&&(s.contentType||"").indexOf("application/x-www-form-urlencoded")===0&&rjsonp.test(s.data)&&"data"); // Handle iff the expected data type is "jsonp" or we have a parameter to set
	if(jsonProp||s.dataTypes[0]==="jsonp"){ // Get callback name, remembering preexisting value associated with it
	callbackName=s.jsonpCallback=jQuery.isFunction(s.jsonpCallback)?s.jsonpCallback():s.jsonpCallback; // Insert callback into url or form data
	if(jsonProp){s[jsonProp]=s[jsonProp].replace(rjsonp,"$1"+callbackName);}else if(s.jsonp!==false){s.url+=(rquery.test(s.url)?"&":"?")+s.jsonp+"="+callbackName;} // Use data converter to retrieve json after script execution
	s.converters["script json"]=function(){if(!responseContainer){jQuery.error(callbackName+" was not called");}return responseContainer[0];}; // Force json dataType
	s.dataTypes[0]="json"; // Install callback
	overwritten=window[callbackName];window[callbackName]=function(){responseContainer=arguments;}; // Clean-up function (fires after converters)
	jqXHR.always(function(){ // If previous value didn't exist - remove it
	if(overwritten===undefined){jQuery(window).removeProp(callbackName); // Otherwise restore preexisting value
	}else {window[callbackName]=overwritten;} // Save back as free
	if(s[callbackName]){ // Make sure that re-using the options doesn't screw things around
	s.jsonpCallback=originalSettings.jsonpCallback; // Save the callback name for future use
	oldCallbacks.push(callbackName);} // Call if it was a function and we have a response
	if(responseContainer&&jQuery.isFunction(overwritten)){overwritten(responseContainer[0]);}responseContainer=overwritten=undefined;}); // Delegate to script
	return "script";}}); // Support: Safari 8+
	// In Safari 8 documents created via document.implementation.createHTMLDocument
	// collapse sibling forms: the second one becomes a child of the first one.
	// Because of that, this security measure has to be disabled in Safari 8.
	// https://bugs.webkit.org/show_bug.cgi?id=137337
	support.createHTMLDocument=function(){var body=document.implementation.createHTMLDocument("").body;body.innerHTML="<form></form><form></form>";return body.childNodes.length===2;}(); // Argument "data" should be string of html
	// context (optional): If specified, the fragment will be created in this context,
	// defaults to document
	// keepScripts (optional): If true, will include scripts passed in the html string
	jQuery.parseHTML=function(data,context,keepScripts){if(!data||typeof data!=="string"){return null;}if(typeof context==="boolean"){keepScripts=context;context=false;} // Stop scripts or inline event handlers from being executed immediately
	// by using document.implementation
	context=context||(support.createHTMLDocument?document.implementation.createHTMLDocument(""):document);var parsed=rsingleTag.exec(data),scripts=!keepScripts&&[]; // Single tag
	if(parsed){return [context.createElement(parsed[1])];}parsed=buildFragment([data],context,scripts);if(scripts&&scripts.length){jQuery(scripts).remove();}return jQuery.merge([],parsed.childNodes);}; // Keep a copy of the old load method
	var _load=jQuery.fn.load; /**
	 * Load a url into a page
	 */jQuery.fn.load=function(url,params,callback){if(typeof url!=="string"&&_load){return _load.apply(this,arguments);}var selector,type,response,self=this,off=url.indexOf(" ");if(off>-1){selector=jQuery.trim(url.slice(off));url=url.slice(0,off);} // If it's a function
	if(jQuery.isFunction(params)){ // We assume that it's the callback
	callback=params;params=undefined; // Otherwise, build a param string
	}else if(params&&(typeof params==="undefined"?"undefined":_typeof(params))==="object"){type="POST";} // If we have elements to modify, make the request
	if(self.length>0){jQuery.ajax({url:url, // If "type" variable is undefined, then "GET" method will be used.
	// Make value of this field explicit since
	// user can override it through ajaxSetup method
	type:type||"GET",dataType:"html",data:params}).done(function(responseText){ // Save response for use in complete callback
	response=arguments;self.html(selector? // If a selector was specified, locate the right elements in a dummy div
	// Exclude scripts to avoid IE 'Permission Denied' errors
	jQuery("<div>").append(jQuery.parseHTML(responseText)).find(selector): // Otherwise use the full result
	responseText); // If the request succeeds, this function gets "data", "status", "jqXHR"
	// but they are ignored because response was set above.
	// If it fails, this function gets "jqXHR", "status", "error"
	}).always(callback&&function(jqXHR,status){self.each(function(){callback.apply(self,response||[jqXHR.responseText,status,jqXHR]);});});}return this;}; // Attach a bunch of functions for handling common AJAX events
	jQuery.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(i,type){jQuery.fn[type]=function(fn){return this.on(type,fn);};});jQuery.expr.filters.animated=function(elem){return jQuery.grep(jQuery.timers,function(fn){return elem===fn.elem;}).length;}; /**
	 * Gets a window from an element
	 */function getWindow(elem){return jQuery.isWindow(elem)?elem:elem.nodeType===9&&elem.defaultView;}jQuery.offset={setOffset:function setOffset(elem,options,i){var curPosition,curLeft,curCSSTop,curTop,curOffset,curCSSLeft,calculatePosition,position=jQuery.css(elem,"position"),curElem=jQuery(elem),props={}; // Set position first, in-case top/left are set even on static elem
	if(position==="static"){elem.style.position="relative";}curOffset=curElem.offset();curCSSTop=jQuery.css(elem,"top");curCSSLeft=jQuery.css(elem,"left");calculatePosition=(position==="absolute"||position==="fixed")&&(curCSSTop+curCSSLeft).indexOf("auto")>-1; // Need to be able to calculate position if either
	// top or left is auto and position is either absolute or fixed
	if(calculatePosition){curPosition=curElem.position();curTop=curPosition.top;curLeft=curPosition.left;}else {curTop=parseFloat(curCSSTop)||0;curLeft=parseFloat(curCSSLeft)||0;}if(jQuery.isFunction(options)){ // Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
	options=options.call(elem,i,jQuery.extend({},curOffset));}if(options.top!=null){props.top=options.top-curOffset.top+curTop;}if(options.left!=null){props.left=options.left-curOffset.left+curLeft;}if("using" in options){options.using.call(elem,props);}else {curElem.css(props);}}};jQuery.fn.extend({offset:function offset(options){if(arguments.length){return options===undefined?this:this.each(function(i){jQuery.offset.setOffset(this,options,i);});}var docElem,win,elem=this[0],box={top:0,left:0},doc=elem&&elem.ownerDocument;if(!doc){return;}docElem=doc.documentElement; // Make sure it's not a disconnected DOM node
	if(!jQuery.contains(docElem,elem)){return box;}box=elem.getBoundingClientRect();win=getWindow(doc);return {top:box.top+win.pageYOffset-docElem.clientTop,left:box.left+win.pageXOffset-docElem.clientLeft};},position:function position(){if(!this[0]){return;}var offsetParent,offset,elem=this[0],parentOffset={top:0,left:0}; // Fixed elements are offset from window (parentOffset = {top:0, left: 0},
	// because it is its only offset parent
	if(jQuery.css(elem,"position")==="fixed"){ // Assume getBoundingClientRect is there when computed position is fixed
	offset=elem.getBoundingClientRect();}else { // Get *real* offsetParent
	offsetParent=this.offsetParent(); // Get correct offsets
	offset=this.offset();if(!jQuery.nodeName(offsetParent[0],"html")){parentOffset=offsetParent.offset();} // Add offsetParent borders
	// Subtract offsetParent scroll positions
	parentOffset.top+=jQuery.css(offsetParent[0],"borderTopWidth",true)-offsetParent.scrollTop();parentOffset.left+=jQuery.css(offsetParent[0],"borderLeftWidth",true)-offsetParent.scrollLeft();} // Subtract parent offsets and element margins
	return {top:offset.top-parentOffset.top-jQuery.css(elem,"marginTop",true),left:offset.left-parentOffset.left-jQuery.css(elem,"marginLeft",true)};}, // This method will return documentElement in the following cases:
	// 1) For the element inside the iframe without offsetParent, this method will return
	//    documentElement of the parent window
	// 2) For the hidden or detached element
	// 3) For body or html element, i.e. in case of the html node - it will return itself
	//
	// but those exceptions were never presented as a real life use-cases
	// and might be considered as more preferable results.
	//
	// This logic, however, is not guaranteed and can change at any point in the future
	offsetParent:function offsetParent(){return this.map(function(){var offsetParent=this.offsetParent;while(offsetParent&&jQuery.css(offsetParent,"position")==="static"){offsetParent=offsetParent.offsetParent;}return offsetParent||documentElement;});}}); // Create scrollLeft and scrollTop methods
	jQuery.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(method,prop){var top="pageYOffset"===prop;jQuery.fn[method]=function(val){return access(this,function(elem,method,val){var win=getWindow(elem);if(val===undefined){return win?win[prop]:elem[method];}if(win){win.scrollTo(!top?val:win.pageXOffset,top?val:win.pageYOffset);}else {elem[method]=val;}},method,val,arguments.length);};}); // Support: Safari<7-8+, Chrome<37-44+
	// Add the top/left cssHooks using jQuery.fn.position
	// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
	// Blink bug: https://code.google.com/p/chromium/issues/detail?id=229280
	// getComputedStyle returns percent when specified for top/left/bottom/right;
	// rather than make the css module depend on the offset module, just check for it here
	jQuery.each(["top","left"],function(i,prop){jQuery.cssHooks[prop]=addGetHookIf(support.pixelPosition,function(elem,computed){if(computed){computed=curCSS(elem,prop); // If curCSS returns percentage, fallback to offset
	return rnumnonpx.test(computed)?jQuery(elem).position()[prop]+"px":computed;}});}); // Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
	jQuery.each({Height:"height",Width:"width"},function(name,type){jQuery.each({padding:"inner"+name,content:type,"":"outer"+name},function(defaultExtra,funcName){ // Margin is only for outerHeight, outerWidth
	jQuery.fn[funcName]=function(margin,value){var chainable=arguments.length&&(defaultExtra||typeof margin!=="boolean"),extra=defaultExtra||(margin===true||value===true?"margin":"border");return access(this,function(elem,type,value){var doc;if(jQuery.isWindow(elem)){ // As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
	// isn't a whole lot we can do. See pull request at this URL for discussion:
	// https://github.com/jquery/jquery/pull/764
	return elem.document.documentElement["client"+name];} // Get document width or height
	if(elem.nodeType===9){doc=elem.documentElement; // Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
	// whichever is greatest
	return Math.max(elem.body["scroll"+name],doc["scroll"+name],elem.body["offset"+name],doc["offset"+name],doc["client"+name]);}return value===undefined? // Get width or height on the element, requesting but not forcing parseFloat
	jQuery.css(elem,type,extra): // Set width or height on the element
	jQuery.style(elem,type,value,extra);},type,chainable?margin:undefined,chainable,null);};});});jQuery.fn.extend({bind:function bind(types,data,fn){return this.on(types,null,data,fn);},unbind:function unbind(types,fn){return this.off(types,null,fn);},delegate:function delegate(selector,types,data,fn){return this.on(types,selector,data,fn);},undelegate:function undelegate(selector,types,fn){ // ( namespace ) or ( selector, types [, fn] )
	return arguments.length===1?this.off(selector,"**"):this.off(types,selector||"**",fn);},size:function size(){return this.length;}});jQuery.fn.andSelf=jQuery.fn.addBack; // Register as a named AMD module, since jQuery can be concatenated with other
	// files that may use define, but not via a proper concatenation script that
	// understands anonymous AMD modules. A named AMD is safest and most robust
	// way to register. Lowercase jquery is used because AMD module names are
	// derived from file names, and jQuery is normally delivered in a lowercase
	// file name. Do this after creating the global so that if an AMD module wants
	// to call noConflict to hide this version of jQuery, it will work.
	// Note that for maximum portability, libraries that are not jQuery should
	// declare themselves as anonymous modules, and avoid setting a global if an
	// AMD loader is present. jQuery is a special case. For more information, see
	// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon
	if(true){!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function(){return jQuery;}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));}var  // Map over jQuery in case of overwrite
	_jQuery=window.jQuery, // Map over the $ in case of overwrite
	_$=window.$;jQuery.noConflict=function(deep){if(window.$===jQuery){window.$=_$;}if(deep&&window.jQuery===jQuery){window.jQuery=_jQuery;}return jQuery;}; // Expose jQuery and $ identifiers, even in AMD
	// (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
	// and CommonJS for browser emulators (#13566)
	if(!noGlobal){window.jQuery=window.$=jQuery;}return jQuery;});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5)(module)))

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module) {"use strict";

	(function () {
	  var $,
	      Bacon,
	      BaconModel,
	      init,
	      __slice = [].slice;

	  init = function init(Bacon, BaconModel, $) {
	    var asJQueryObject, assertArrayOrJQueryObject, e, effectNames, effects, eventNames, events, nonEmpty, _, _fn, _fn1, _i, _j, _len, _len1;
	    nonEmpty = function nonEmpty(x) {
	      return x.length > 0;
	    };
	    assertArrayOrJQueryObject = function assertArrayOrJQueryObject(x) {
	      if (!(x instanceof jQuery || x instanceof Array)) {
	        throw new Error('Value must be either a jQuery object or an Array of jQuery objects');
	      }
	    };
	    asJQueryObject = function asJQueryObject(x) {
	      var element, obj, _i, _len;
	      if (x instanceof jQuery) {
	        return x;
	      } else {
	        obj = $();
	        for (_i = 0, _len = x.length; _i < _len; _i++) {
	          element = x[_i];
	          if (element instanceof jQuery) {
	            obj = obj.add(element);
	          }
	        }
	        return obj;
	      }
	    };
	    _ = {
	      indexOf: Array.prototype.indexOf ? function (xs, x) {
	        return xs.indexOf(x);
	      } : function (xs, x) {
	        var i, y, _i, _len;
	        for (i = _i = 0, _len = xs.length; _i < _len; i = ++_i) {
	          y = xs[i];
	          if (x === y) {
	            return i;
	          }
	        }
	        return -1;
	      }
	    };
	    Bacon.$.Model = Bacon.Model;
	    Bacon.$.textFieldValue = function (element, initValue) {
	      var autofillPoller, events, get;
	      get = function get() {
	        return element.val() || "";
	      };
	      autofillPoller = function autofillPoller() {
	        return Bacon.interval(50).take(10).map(get).filter(nonEmpty).take(1);
	      };
	      events = element.asEventStream("keyup input change").merge(element.asEventStream("cut paste").delay(1)).merge(autofillPoller());
	      return Bacon.Binding({
	        initValue: initValue,
	        get: get,
	        events: events,
	        set: function set(value) {
	          return element.val(value);
	        }
	      });
	    };
	    Bacon.$.checkBoxValue = function (element, initValue) {
	      return Bacon.Binding({
	        initValue: initValue,
	        get: function get() {
	          return element.prop("checked") || false;
	        },
	        events: element.asEventStream("change"),
	        set: function set(value) {
	          return element.prop("checked", value);
	        }
	      });
	    };
	    Bacon.$.selectValue = function (element, initValue) {
	      return Bacon.Binding({
	        initValue: initValue,
	        get: function get() {
	          return element.val();
	        },
	        events: element.asEventStream("change"),
	        set: function set(value) {
	          return element.val(value);
	        }
	      });
	    };
	    Bacon.$.radioGroupValue = function (radios, initValue) {
	      assertArrayOrJQueryObject(radios);
	      radios = asJQueryObject(radios);
	      return Bacon.Binding({
	        initValue: initValue,
	        get: function get() {
	          return radios.filter(":checked").first().val();
	        },
	        events: radios.asEventStream("change"),
	        set: function set(value) {
	          return radios.each(function (i, elem) {
	            return $(elem).prop("checked", elem.value === value);
	          });
	        }
	      });
	    };
	    Bacon.$.intRadioGroupValue = function (radios, initValue) {
	      var radioGroupValue;
	      radioGroupValue = Bacon.$.radioGroupValue(radios);
	      return Bacon.Binding({
	        initValue: initValue,
	        get: function get() {
	          var value;
	          value = radioGroupValue.get();
	          if (value != null) {
	            return parseInt(value);
	          } else {
	            return value;
	          }
	        },
	        events: radioGroupValue.syncEvents(),
	        set: function set(value) {
	          var strValue;
	          strValue = value != null ? Number(value).toString() : value;
	          return radioGroupValue.set(strValue);
	        }
	      });
	    };
	    Bacon.$.checkBoxGroupValue = function (checkBoxes, initValue) {
	      assertArrayOrJQueryObject(checkBoxes);
	      checkBoxes = asJQueryObject(checkBoxes);
	      return Bacon.Binding({
	        initValue: initValue,
	        get: function get() {
	          return checkBoxes.filter(":checked").map(function (i, elem) {
	            return $(elem).val();
	          }).toArray();
	        },
	        events: checkBoxes.asEventStream("change"),
	        set: function set(value) {
	          return checkBoxes.each(function (i, elem) {
	            return $(elem).prop("checked", _.indexOf(value, $(elem).val()) >= 0);
	          });
	        }
	      });
	    };
	    Bacon.$.ajax = function (params, abort) {
	      return Bacon.fromPromise($.ajax(params), abort);
	    };
	    Bacon.$.ajaxGet = function (url, data, dataType, abort) {
	      return Bacon.$.ajax({
	        url: url,
	        dataType: dataType,
	        data: data
	      }, abort);
	    };
	    Bacon.$.ajaxGetJSON = function (url, data, abort) {
	      return Bacon.$.ajax({
	        url: url,
	        dataType: "json",
	        data: data
	      }, abort);
	    };
	    Bacon.$.ajaxPost = function (url, data, dataType, abort) {
	      return Bacon.$.ajax({
	        url: url,
	        dataType: dataType,
	        data: data,
	        type: "POST"
	      }, abort);
	    };
	    Bacon.$.ajaxGetScript = function (url, abort) {
	      return Bacon.$.ajax({
	        url: url,
	        dataType: "script"
	      }, abort);
	    };
	    Bacon.$.lazyAjax = function (params) {
	      return Bacon.once(params).flatMap(Bacon.$.ajax);
	    };
	    Bacon.Observable.prototype.ajax = function () {
	      return this.flatMapLatest(Bacon.$.ajax);
	    };
	    Bacon.Observable.prototype.toDeferred = function () {
	      var dfd, value;
	      value = void 0;
	      dfd = $.Deferred();
	      this.take(1).endOnError().subscribe(function (evt) {
	        if (evt.hasValue()) {
	          value = evt.value();
	          return dfd.notify(value);
	        } else if (evt.isError()) {
	          return dfd.reject(evt.error);
	        } else if (evt.isEnd()) {
	          return dfd.resolve(value);
	        }
	      });
	      return dfd;
	    };
	    eventNames = ["keydown", "keyup", "keypress", "click", "dblclick", "mousedown", "mouseup", "mouseenter", "mouseleave", "mousemove", "mouseout", "mouseover", "dragstart", "drag", "dragenter", "dragleave", "dragover", "drop", "dragend", "resize", "scroll", "select", "change", "submit", "blur", "focus", "focusin", "focusout", "load", "unload"];
	    events = {};
	    _fn = function _fn(e) {
	      return events[e + 'E'] = function () {
	        var args;
	        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	        return this.asEventStream.apply(this, [e].concat(__slice.call(args)));
	      };
	    };
	    for (_i = 0, _len = eventNames.length; _i < _len; _i++) {
	      e = eventNames[_i];
	      _fn(e);
	    }
	    effectNames = ["animate", "show", "hide", "toggle", "fadeIn", "fadeOut", "fadeTo", "fadeToggle", "slideDown", "slideUp", "slideToggle"];
	    effects = {};
	    _fn1 = function _fn1(e) {
	      return effects[e + 'E'] = function () {
	        var args;
	        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	        return Bacon.fromPromise(this[e].apply(this, args).promise());
	      };
	    };
	    for (_j = 0, _len1 = effectNames.length; _j < _len1; _j++) {
	      e = effectNames[_j];
	      _fn1(e);
	    }
	    if ($ != null ? $.fn : void 0) {
	      $.fn.extend(events);
	      $.fn.extend(effects);
	      $.fn.asEventStream = Bacon.$.asEventStream;
	    }
	    return Bacon.$;
	  };

	  if (typeof module !== "undefined" && module !== null) {
	    Bacon = __webpack_require__(4);
	    BaconModel = __webpack_require__(10);
	    $ = __webpack_require__(8);
	    module.exports = init(Bacon, BaconModel, $);
	  } else {
	    if (true) {
	      !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(11), __webpack_require__(10), __webpack_require__(8)], __WEBPACK_AMD_DEFINE_FACTORY__ = (init), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else {
	      init(this.Bacon, this.BaconModel, this.$);
	    }
	  }
	}).call(undefined);
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5)(module)))

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module) {"use strict";

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	(function () {
	  var Bacon,
	      init,
	      __slice = [].slice;

	  init = function init(Bacon) {
	    var Lens, Model, defaultEquals, fold, globalModCount, id, idCounter, isModel, nonEmpty, sameValue, shallowCopy, valueLens;
	    id = function id(x) {
	      return x;
	    };
	    nonEmpty = function nonEmpty(x) {
	      return x.length > 0;
	    };
	    fold = function fold(xs, seed, f) {
	      var x, _i, _len;
	      for (_i = 0, _len = xs.length; _i < _len; _i++) {
	        x = xs[_i];
	        seed = f(seed, x);
	      }
	      return seed;
	    };
	    isModel = function isModel(obj) {
	      return obj instanceof Bacon.Property;
	    };
	    globalModCount = 0;
	    idCounter = 1;
	    defaultEquals = function defaultEquals(a, b) {
	      return a === b;
	    };
	    sameValue = function sameValue(eq) {
	      return function (a, b) {
	        return !a.initial && eq(a.value, b.value);
	      };
	    };
	    Model = Bacon.Model = function (initValue) {
	      var currentValue, eq, model, modificationBus, myId, myModCount, syncBus, valueWithSource;
	      myId = idCounter++;
	      eq = defaultEquals;
	      myModCount = 0;
	      modificationBus = new Bacon.Bus();
	      syncBus = new Bacon.Bus();
	      currentValue = void 0;
	      valueWithSource = Bacon.update({
	        initial: true
	      }, [modificationBus], function (_arg, _arg1) {
	        var changed, f, modStack, newValue, source, value;
	        value = _arg.value;
	        source = _arg1.source, f = _arg1.f;
	        newValue = f(value);
	        modStack = [myId];
	        changed = newValue !== value;
	        return {
	          source: source,
	          value: newValue,
	          modStack: modStack,
	          changed: changed
	        };
	      }, [syncBus], function (_, syncEvent) {
	        return syncEvent;
	      }).skipDuplicates(sameValue(eq)).changes().toProperty();
	      model = valueWithSource.map(".value").skipDuplicates(eq);
	      model.dispatcher.subscribe(function (event) {
	        if (event.hasValue()) {
	          return currentValue = event.value();
	        }
	      });
	      if (!model.id) {
	        model.id = myId;
	      }
	      model.addSyncSource = function (syncEvents) {
	        return syncBus.plug(syncEvents.filter(function (e) {
	          return e.changed && !Bacon._.contains(e.modStack, myId);
	        }).doAction(function () {
	          return Bacon.Model.syncCount++;
	        }).map(function (e) {
	          return shallowCopy(e, "modStack", e.modStack.concat([myId]));
	        }).map(function (e) {
	          return valueLens.set(e, model.syncConverter(valueLens.get(e)));
	        }));
	      };
	      model.apply = function (source) {
	        modificationBus.plug(source.toEventStream().map(function (f) {
	          return {
	            source: source,
	            f: f
	          };
	        }));
	        return valueWithSource.changes().filter(function (change) {
	          return change.source !== source;
	        }).map(function (change) {
	          return change.value;
	        });
	      };
	      model.addSource = function (source) {
	        return model.apply(source.map(function (v) {
	          return function () {
	            return v;
	          };
	        }));
	      };
	      model.modify = function (f) {
	        return model.apply(Bacon.once(f));
	      };
	      model.set = function (value) {
	        return model.modify(function () {
	          return value;
	        });
	      };
	      model.get = function () {
	        return currentValue;
	      };
	      model.syncEvents = function () {
	        return valueWithSource.toEventStream();
	      };
	      model.bind = function (other) {
	        this.addSyncSource(other.syncEvents());
	        return other.addSyncSource(this.syncEvents());
	      };
	      model.lens = function (lens) {
	        var lensed;
	        lens = Lens(lens);
	        lensed = Model();
	        this.addSyncSource(model.sampledBy(lensed.syncEvents(), function (full, lensedSync) {
	          return valueLens.set(lensedSync, lens.set(full, lensedSync.value));
	        }));
	        lensed.addSyncSource(this.syncEvents().map(function (e) {
	          return valueLens.set(e, lens.get(e.value));
	        }));
	        return lensed;
	      };
	      model.syncConverter = id;
	      if (arguments.length >= 1) {
	        model.set(initValue);
	      }
	      return model;
	    };
	    Bacon.Model.syncCount = 0;
	    Model.combine = function (template) {
	      var initValue, key, lens, lensedModel, model, value;
	      if ((typeof template === "undefined" ? "undefined" : _typeof(template)) !== "object") {
	        return Model(template);
	      } else if (isModel(template)) {
	        return template;
	      } else {
	        initValue = template instanceof Array ? [] : {};
	        model = Model(initValue);
	        for (key in template) {
	          value = template[key];
	          lens = Lens.objectLens(key);
	          lensedModel = model.lens(lens);
	          lensedModel.bind(Model.combine(value));
	        }
	        return model;
	      }
	    };
	    Bacon.Binding = function (_arg) {
	      var events, externalChanges, get, initValue, inputs, model, set;
	      initValue = _arg.initValue, get = _arg.get, events = _arg.events, set = _arg.set;
	      inputs = events.map(get);
	      if (initValue != null) {
	        set(initValue);
	      } else {
	        initValue = get();
	      }
	      model = Bacon.Model(initValue);
	      externalChanges = model.addSource(inputs);
	      externalChanges.assign(set);
	      return model;
	    };
	    Lens = Bacon.Lens = function (lens) {
	      if ((typeof lens === "undefined" ? "undefined" : _typeof(lens)) === "object") {
	        return lens;
	      } else {
	        return Lens.objectLens(lens);
	      }
	    };
	    Lens.id = Lens({
	      get: function get(x) {
	        return x;
	      },
	      set: function set(context, value) {
	        return value;
	      }
	    });
	    Lens.objectLens = function (path) {
	      var keys, objectKeyLens;
	      objectKeyLens = function objectKeyLens(key) {
	        return Lens({
	          get: function get(x) {
	            return x != null ? x[key] : void 0;
	          },
	          set: function set(context, value) {
	            return shallowCopy(context, key, value);
	          }
	        });
	      };
	      keys = Bacon._.filter(nonEmpty, path.split("."));
	      return Lens.compose.apply(Lens, Bacon._.map(objectKeyLens, keys));
	    };
	    Lens.compose = function () {
	      var args, compose2;
	      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	      compose2 = function compose2(outer, inner) {
	        return Lens({
	          get: function get(x) {
	            return inner.get(outer.get(x));
	          },
	          set: function set(context, value) {
	            var innerContext, newInnerContext;
	            innerContext = outer.get(context);
	            newInnerContext = inner.set(innerContext, value);
	            return outer.set(context, newInnerContext);
	          }
	        });
	      };
	      return fold(args, Lens.id, compose2);
	    };
	    valueLens = Lens.objectLens("value");
	    shallowCopy = function shallowCopy(x, key, value) {
	      var copy, k, v;
	      copy = x instanceof Array ? [] : {};
	      for (k in x) {
	        v = x[k];
	        copy[k] = v;
	      }
	      if (key != null) {
	        copy[key] = value;
	      }
	      return copy;
	    };
	    return Bacon;
	  };

	  if (typeof module !== "undefined" && module !== null) {
	    Bacon = __webpack_require__(4);
	    module.exports = init(Bacon);
	  } else {
	    if (true) {
	      !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(11)], __WEBPACK_AMD_DEFINE_FACTORY__ = (init), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else {
	      init(this.Bacon);
	    }
	  }
	}).call(undefined);
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5)(module)))

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	(function () {
	    var bacon = __webpack_require__(12);

	    exports.using = bacon.using;
	    exports.to = bacon.to;
	})();

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {'use strict';

	(function () {

				var _indexOf = function _indexOf(buffer, pattern, i) {
							var length, good;

							if (!Buffer.isBuffer(pattern)) pattern = new Buffer(pattern);
							if (typeof i == 'undefined') i = 0;

							var length = buffer.length - pattern.length;
							while (i <= length) {
										good = true;

										for (var j = 0; j < pattern.length; j++) {
													if (buffer[i + j] !== pattern[j]) {
																good = false;
																break;
													}
										}

										if (good) return i;
										i++;
							}

							return -1;
				};

				var _concat = function _concat(buffers) {
							var _buffers = [];
							buffers.forEach(function (buffer) {
										if (!Buffer.isBuffer(buffer)) {
													buffer = new Buffer(buffer);
										}

										_buffers.push(buffer);
							});

							return Buffer.concat(_buffers);
				};

				var to = function to(obj) {
							if (!Array.isArray(obj)) {
										obj = Array.prototype.slice.call(arguments);
							}

							return new to_wrapper(obj);
				};

				var to_wrapper = function to_wrapper(obj) {
							this._wrapped = obj;
				};

				to_wrapper.prototype.append = function (buffers) {
							if (!Array.isArray(buffers)) {
										buffers = Array.prototype.slice.call(arguments);
							}

							var _buffers = [];
							this._wrapped.forEach(function (buffer) {
										_buffers.push(_concat([buffer].concat(buffers)));
							});

							return _buffers;
				};

				to_wrapper.prototype.prepend = function (buffers) {
							if (!Array.isArray(buffers)) {
										buffers = Array.prototype.slice.call(arguments);
							}

							var _buffers = [];
							this._wrapped.forEach(function (buffer) {
										_buffers.push(_concat(buffers.concat(buffer)));
							});

							return _buffers;
				};

				var using = function using(obj) {
							return new using_wrapper(obj);
				};

				var using_wrapper = function using_wrapper(obj) {
							this._wrapped = obj;
				};

				using_wrapper.prototype.split = function (buffer) {
							var pattern = this._wrapped,
							    buffers = [];
							var _buffer,
							    i = 0,
							    j = 0;

							if (!Buffer.isBuffer(buffer)) {
										buffer = new Buffer(buffer);
							}

							while (i > -1) {
										i = _indexOf(buffer, pattern, j);
										if (i == -1) {
													buffers.push(buffer.slice(j));
													break;
										}

										_buffer = buffer.slice(j, i);
										buffers.push(_buffer);
										j += _buffer.length + pattern.length;
							}

							return buffers.length > 0 ? buffers : [buffer];
				};

				using_wrapper.prototype.join = function (buffers) {
							if (!Array.isArray(buffers)) {
										buffers = Array.prototype.slice.call(arguments);
							}

							var glue = this._wrapped,
							    _buffers = [];
							buffers.forEach(function (buffer) {
										_buffers.push(buffer);
										if (_buffers.length < buffers.length + (buffers.length - 1)) {
													_buffers.push(glue);
													return;
										}
							});

							return _concat(_buffers);
				};

				exports.using = using;
				exports.to = to;
	})();
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(13).Buffer))

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer, global) {/*!
	 * The buffer module from node.js, for the browser.
	 *
	 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
	 * @license  MIT
	 */
	/* eslint-disable no-proto */

	'use strict';

	var base64 = __webpack_require__(14);
	var ieee754 = __webpack_require__(15);
	var isArray = __webpack_require__(16);

	exports.Buffer = Buffer;
	exports.SlowBuffer = SlowBuffer;
	exports.INSPECT_MAX_BYTES = 50;
	Buffer.poolSize = 8192; // not used by this implementation

	var rootParent = {};

	/**
	 * If `Buffer.TYPED_ARRAY_SUPPORT`:
	 *   === true    Use Uint8Array implementation (fastest)
	 *   === false   Use Object implementation (most compatible, even IE6)
	 *
	 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
	 * Opera 11.6+, iOS 4.2+.
	 *
	 * Due to various browser bugs, sometimes the Object implementation will be used even
	 * when the browser supports typed arrays.
	 *
	 * Note:
	 *
	 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
	 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
	 *
	 *   - Safari 5-7 lacks support for changing the `Object.prototype.constructor` property
	 *     on objects.
	 *
	 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
	 *
	 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
	 *     incorrect length in some situations.

	 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
	 * get the Object implementation, which is slower but behaves correctly.
	 */
	Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined ? global.TYPED_ARRAY_SUPPORT : typedArraySupport();

	function typedArraySupport() {
	  function Bar() {}
	  try {
	    var arr = new Uint8Array(1);
	    arr.foo = function () {
	      return 42;
	    };
	    arr.constructor = Bar;
	    return arr.foo() === 42 && // typed array instances can be augmented
	    arr.constructor === Bar && // constructor can be set
	    typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
	    arr.subarray(1, 1).byteLength === 0; // ie10 has broken `subarray`
	  } catch (e) {
	    return false;
	  }
	}

	function kMaxLength() {
	  return Buffer.TYPED_ARRAY_SUPPORT ? 0x7fffffff : 0x3fffffff;
	}

	/**
	 * Class: Buffer
	 * =============
	 *
	 * The Buffer constructor returns instances of `Uint8Array` that are augmented
	 * with function properties for all the node `Buffer` API functions. We use
	 * `Uint8Array` so that square bracket notation works as expected -- it returns
	 * a single octet.
	 *
	 * By augmenting the instances, we can avoid modifying the `Uint8Array`
	 * prototype.
	 */
	function Buffer(arg) {
	  if (!(this instanceof Buffer)) {
	    // Avoid going through an ArgumentsAdaptorTrampoline in the common case.
	    if (arguments.length > 1) return new Buffer(arg, arguments[1]);
	    return new Buffer(arg);
	  }

	  if (!Buffer.TYPED_ARRAY_SUPPORT) {
	    this.length = 0;
	    this.parent = undefined;
	  }

	  // Common case.
	  if (typeof arg === 'number') {
	    return fromNumber(this, arg);
	  }

	  // Slightly less common case.
	  if (typeof arg === 'string') {
	    return fromString(this, arg, arguments.length > 1 ? arguments[1] : 'utf8');
	  }

	  // Unusual.
	  return fromObject(this, arg);
	}

	function fromNumber(that, length) {
	  that = allocate(that, length < 0 ? 0 : checked(length) | 0);
	  if (!Buffer.TYPED_ARRAY_SUPPORT) {
	    for (var i = 0; i < length; i++) {
	      that[i] = 0;
	    }
	  }
	  return that;
	}

	function fromString(that, string, encoding) {
	  if (typeof encoding !== 'string' || encoding === '') encoding = 'utf8';

	  // Assumption: byteLength() return value is always < kMaxLength.
	  var length = byteLength(string, encoding) | 0;
	  that = allocate(that, length);

	  that.write(string, encoding);
	  return that;
	}

	function fromObject(that, object) {
	  if (Buffer.isBuffer(object)) return fromBuffer(that, object);

	  if (isArray(object)) return fromArray(that, object);

	  if (object == null) {
	    throw new TypeError('must start with number, buffer, array or string');
	  }

	  if (typeof ArrayBuffer !== 'undefined') {
	    if (object.buffer instanceof ArrayBuffer) {
	      return fromTypedArray(that, object);
	    }
	    if (object instanceof ArrayBuffer) {
	      return fromArrayBuffer(that, object);
	    }
	  }

	  if (object.length) return fromArrayLike(that, object);

	  return fromJsonObject(that, object);
	}

	function fromBuffer(that, buffer) {
	  var length = checked(buffer.length) | 0;
	  that = allocate(that, length);
	  buffer.copy(that, 0, 0, length);
	  return that;
	}

	function fromArray(that, array) {
	  var length = checked(array.length) | 0;
	  that = allocate(that, length);
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255;
	  }
	  return that;
	}

	// Duplicate of fromArray() to keep fromArray() monomorphic.
	function fromTypedArray(that, array) {
	  var length = checked(array.length) | 0;
	  that = allocate(that, length);
	  // Truncating the elements is probably not what people expect from typed
	  // arrays with BYTES_PER_ELEMENT > 1 but it's compatible with the behavior
	  // of the old Buffer constructor.
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255;
	  }
	  return that;
	}

	function fromArrayBuffer(that, array) {
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    array.byteLength;
	    that = Buffer._augment(new Uint8Array(array));
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    that = fromTypedArray(that, new Uint8Array(array));
	  }
	  return that;
	}

	function fromArrayLike(that, array) {
	  var length = checked(array.length) | 0;
	  that = allocate(that, length);
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255;
	  }
	  return that;
	}

	// Deserialize { type: 'Buffer', data: [1,2,3,...] } into a Buffer object.
	// Returns a zero-length buffer for inputs that don't conform to the spec.
	function fromJsonObject(that, object) {
	  var array;
	  var length = 0;

	  if (object.type === 'Buffer' && isArray(object.data)) {
	    array = object.data;
	    length = checked(array.length) | 0;
	  }
	  that = allocate(that, length);

	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255;
	  }
	  return that;
	}

	if (Buffer.TYPED_ARRAY_SUPPORT) {
	  Buffer.prototype.__proto__ = Uint8Array.prototype;
	  Buffer.__proto__ = Uint8Array;
	} else {
	  // pre-set for values that may exist in the future
	  Buffer.prototype.length = undefined;
	  Buffer.prototype.parent = undefined;
	}

	function allocate(that, length) {
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    that = Buffer._augment(new Uint8Array(length));
	    that.__proto__ = Buffer.prototype;
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    that.length = length;
	    that._isBuffer = true;
	  }

	  var fromPool = length !== 0 && length <= Buffer.poolSize >>> 1;
	  if (fromPool) that.parent = rootParent;

	  return that;
	}

	function checked(length) {
	  // Note: cannot use `length < kMaxLength` here because that fails when
	  // length is NaN (which is otherwise coerced to zero.)
	  if (length >= kMaxLength()) {
	    throw new RangeError('Attempt to allocate Buffer larger than maximum ' + 'size: 0x' + kMaxLength().toString(16) + ' bytes');
	  }
	  return length | 0;
	}

	function SlowBuffer(subject, encoding) {
	  if (!(this instanceof SlowBuffer)) return new SlowBuffer(subject, encoding);

	  var buf = new Buffer(subject, encoding);
	  delete buf.parent;
	  return buf;
	}

	Buffer.isBuffer = function isBuffer(b) {
	  return !!(b != null && b._isBuffer);
	};

	Buffer.compare = function compare(a, b) {
	  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
	    throw new TypeError('Arguments must be Buffers');
	  }

	  if (a === b) return 0;

	  var x = a.length;
	  var y = b.length;

	  var i = 0;
	  var len = Math.min(x, y);
	  while (i < len) {
	    if (a[i] !== b[i]) break;

	    ++i;
	  }

	  if (i !== len) {
	    x = a[i];
	    y = b[i];
	  }

	  if (x < y) return -1;
	  if (y < x) return 1;
	  return 0;
	};

	Buffer.isEncoding = function isEncoding(encoding) {
	  switch (String(encoding).toLowerCase()) {
	    case 'hex':
	    case 'utf8':
	    case 'utf-8':
	    case 'ascii':
	    case 'binary':
	    case 'base64':
	    case 'raw':
	    case 'ucs2':
	    case 'ucs-2':
	    case 'utf16le':
	    case 'utf-16le':
	      return true;
	    default:
	      return false;
	  }
	};

	Buffer.concat = function concat(list, length) {
	  if (!isArray(list)) throw new TypeError('list argument must be an Array of Buffers.');

	  if (list.length === 0) {
	    return new Buffer(0);
	  }

	  var i;
	  if (length === undefined) {
	    length = 0;
	    for (i = 0; i < list.length; i++) {
	      length += list[i].length;
	    }
	  }

	  var buf = new Buffer(length);
	  var pos = 0;
	  for (i = 0; i < list.length; i++) {
	    var item = list[i];
	    item.copy(buf, pos);
	    pos += item.length;
	  }
	  return buf;
	};

	function byteLength(string, encoding) {
	  if (typeof string !== 'string') string = '' + string;

	  var len = string.length;
	  if (len === 0) return 0;

	  // Use a for loop to avoid recursion
	  var loweredCase = false;
	  for (;;) {
	    switch (encoding) {
	      case 'ascii':
	      case 'binary':
	      // Deprecated
	      case 'raw':
	      case 'raws':
	        return len;
	      case 'utf8':
	      case 'utf-8':
	        return utf8ToBytes(string).length;
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return len * 2;
	      case 'hex':
	        return len >>> 1;
	      case 'base64':
	        return base64ToBytes(string).length;
	      default:
	        if (loweredCase) return utf8ToBytes(string).length; // assume utf8
	        encoding = ('' + encoding).toLowerCase();
	        loweredCase = true;
	    }
	  }
	}
	Buffer.byteLength = byteLength;

	function slowToString(encoding, start, end) {
	  var loweredCase = false;

	  start = start | 0;
	  end = end === undefined || end === Infinity ? this.length : end | 0;

	  if (!encoding) encoding = 'utf8';
	  if (start < 0) start = 0;
	  if (end > this.length) end = this.length;
	  if (end <= start) return '';

	  while (true) {
	    switch (encoding) {
	      case 'hex':
	        return hexSlice(this, start, end);

	      case 'utf8':
	      case 'utf-8':
	        return utf8Slice(this, start, end);

	      case 'ascii':
	        return asciiSlice(this, start, end);

	      case 'binary':
	        return binarySlice(this, start, end);

	      case 'base64':
	        return base64Slice(this, start, end);

	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return utf16leSlice(this, start, end);

	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding);
	        encoding = (encoding + '').toLowerCase();
	        loweredCase = true;
	    }
	  }
	}

	Buffer.prototype.toString = function toString() {
	  var length = this.length | 0;
	  if (length === 0) return '';
	  if (arguments.length === 0) return utf8Slice(this, 0, length);
	  return slowToString.apply(this, arguments);
	};

	Buffer.prototype.equals = function equals(b) {
	  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer');
	  if (this === b) return true;
	  return Buffer.compare(this, b) === 0;
	};

	Buffer.prototype.inspect = function inspect() {
	  var str = '';
	  var max = exports.INSPECT_MAX_BYTES;
	  if (this.length > 0) {
	    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ');
	    if (this.length > max) str += ' ... ';
	  }
	  return '<Buffer ' + str + '>';
	};

	Buffer.prototype.compare = function compare(b) {
	  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer');
	  if (this === b) return 0;
	  return Buffer.compare(this, b);
	};

	Buffer.prototype.indexOf = function indexOf(val, byteOffset) {
	  if (byteOffset > 0x7fffffff) byteOffset = 0x7fffffff;else if (byteOffset < -0x80000000) byteOffset = -0x80000000;
	  byteOffset >>= 0;

	  if (this.length === 0) return -1;
	  if (byteOffset >= this.length) return -1;

	  // Negative offsets start from the end of the buffer
	  if (byteOffset < 0) byteOffset = Math.max(this.length + byteOffset, 0);

	  if (typeof val === 'string') {
	    if (val.length === 0) return -1; // special case: looking for empty string always fails
	    return String.prototype.indexOf.call(this, val, byteOffset);
	  }
	  if (Buffer.isBuffer(val)) {
	    return arrayIndexOf(this, val, byteOffset);
	  }
	  if (typeof val === 'number') {
	    if (Buffer.TYPED_ARRAY_SUPPORT && Uint8Array.prototype.indexOf === 'function') {
	      return Uint8Array.prototype.indexOf.call(this, val, byteOffset);
	    }
	    return arrayIndexOf(this, [val], byteOffset);
	  }

	  function arrayIndexOf(arr, val, byteOffset) {
	    var foundIndex = -1;
	    for (var i = 0; byteOffset + i < arr.length; i++) {
	      if (arr[byteOffset + i] === val[foundIndex === -1 ? 0 : i - foundIndex]) {
	        if (foundIndex === -1) foundIndex = i;
	        if (i - foundIndex + 1 === val.length) return byteOffset + foundIndex;
	      } else {
	        foundIndex = -1;
	      }
	    }
	    return -1;
	  }

	  throw new TypeError('val must be string, number or Buffer');
	};

	// `get` is deprecated
	Buffer.prototype.get = function get(offset) {
	  console.log('.get() is deprecated. Access using array indexes instead.');
	  return this.readUInt8(offset);
	};

	// `set` is deprecated
	Buffer.prototype.set = function set(v, offset) {
	  console.log('.set() is deprecated. Access using array indexes instead.');
	  return this.writeUInt8(v, offset);
	};

	function hexWrite(buf, string, offset, length) {
	  offset = Number(offset) || 0;
	  var remaining = buf.length - offset;
	  if (!length) {
	    length = remaining;
	  } else {
	    length = Number(length);
	    if (length > remaining) {
	      length = remaining;
	    }
	  }

	  // must be an even number of digits
	  var strLen = string.length;
	  if (strLen % 2 !== 0) throw new Error('Invalid hex string');

	  if (length > strLen / 2) {
	    length = strLen / 2;
	  }
	  for (var i = 0; i < length; i++) {
	    var parsed = parseInt(string.substr(i * 2, 2), 16);
	    if (isNaN(parsed)) throw new Error('Invalid hex string');
	    buf[offset + i] = parsed;
	  }
	  return i;
	}

	function utf8Write(buf, string, offset, length) {
	  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length);
	}

	function asciiWrite(buf, string, offset, length) {
	  return blitBuffer(asciiToBytes(string), buf, offset, length);
	}

	function binaryWrite(buf, string, offset, length) {
	  return asciiWrite(buf, string, offset, length);
	}

	function base64Write(buf, string, offset, length) {
	  return blitBuffer(base64ToBytes(string), buf, offset, length);
	}

	function ucs2Write(buf, string, offset, length) {
	  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length);
	}

	Buffer.prototype.write = function write(string, offset, length, encoding) {
	  // Buffer#write(string)
	  if (offset === undefined) {
	    encoding = 'utf8';
	    length = this.length;
	    offset = 0;
	    // Buffer#write(string, encoding)
	  } else if (length === undefined && typeof offset === 'string') {
	      encoding = offset;
	      length = this.length;
	      offset = 0;
	      // Buffer#write(string, offset[, length][, encoding])
	    } else if (isFinite(offset)) {
	        offset = offset | 0;
	        if (isFinite(length)) {
	          length = length | 0;
	          if (encoding === undefined) encoding = 'utf8';
	        } else {
	          encoding = length;
	          length = undefined;
	        }
	        // legacy write(string, encoding, offset, length) - remove in v0.13
	      } else {
	          var swap = encoding;
	          encoding = offset;
	          offset = length | 0;
	          length = swap;
	        }

	  var remaining = this.length - offset;
	  if (length === undefined || length > remaining) length = remaining;

	  if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) {
	    throw new RangeError('attempt to write outside buffer bounds');
	  }

	  if (!encoding) encoding = 'utf8';

	  var loweredCase = false;
	  for (;;) {
	    switch (encoding) {
	      case 'hex':
	        return hexWrite(this, string, offset, length);

	      case 'utf8':
	      case 'utf-8':
	        return utf8Write(this, string, offset, length);

	      case 'ascii':
	        return asciiWrite(this, string, offset, length);

	      case 'binary':
	        return binaryWrite(this, string, offset, length);

	      case 'base64':
	        // Warning: maxLength not taken into account in base64Write
	        return base64Write(this, string, offset, length);

	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return ucs2Write(this, string, offset, length);

	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding);
	        encoding = ('' + encoding).toLowerCase();
	        loweredCase = true;
	    }
	  }
	};

	Buffer.prototype.toJSON = function toJSON() {
	  return {
	    type: 'Buffer',
	    data: Array.prototype.slice.call(this._arr || this, 0)
	  };
	};

	function base64Slice(buf, start, end) {
	  if (start === 0 && end === buf.length) {
	    return base64.fromByteArray(buf);
	  } else {
	    return base64.fromByteArray(buf.slice(start, end));
	  }
	}

	function utf8Slice(buf, start, end) {
	  end = Math.min(buf.length, end);
	  var res = [];

	  var i = start;
	  while (i < end) {
	    var firstByte = buf[i];
	    var codePoint = null;
	    var bytesPerSequence = firstByte > 0xEF ? 4 : firstByte > 0xDF ? 3 : firstByte > 0xBF ? 2 : 1;

	    if (i + bytesPerSequence <= end) {
	      var secondByte, thirdByte, fourthByte, tempCodePoint;

	      switch (bytesPerSequence) {
	        case 1:
	          if (firstByte < 0x80) {
	            codePoint = firstByte;
	          }
	          break;
	        case 2:
	          secondByte = buf[i + 1];
	          if ((secondByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0x1F) << 0x6 | secondByte & 0x3F;
	            if (tempCodePoint > 0x7F) {
	              codePoint = tempCodePoint;
	            }
	          }
	          break;
	        case 3:
	          secondByte = buf[i + 1];
	          thirdByte = buf[i + 2];
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | thirdByte & 0x3F;
	            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
	              codePoint = tempCodePoint;
	            }
	          }
	          break;
	        case 4:
	          secondByte = buf[i + 1];
	          thirdByte = buf[i + 2];
	          fourthByte = buf[i + 3];
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | fourthByte & 0x3F;
	            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
	              codePoint = tempCodePoint;
	            }
	          }
	      }
	    }

	    if (codePoint === null) {
	      // we did not generate a valid codePoint so insert a
	      // replacement char (U+FFFD) and advance only 1 byte
	      codePoint = 0xFFFD;
	      bytesPerSequence = 1;
	    } else if (codePoint > 0xFFFF) {
	      // encode to utf16 (surrogate pair dance)
	      codePoint -= 0x10000;
	      res.push(codePoint >>> 10 & 0x3FF | 0xD800);
	      codePoint = 0xDC00 | codePoint & 0x3FF;
	    }

	    res.push(codePoint);
	    i += bytesPerSequence;
	  }

	  return decodeCodePointsArray(res);
	}

	// Based on http://stackoverflow.com/a/22747272/680742, the browser with
	// the lowest limit is Chrome, with 0x10000 args.
	// We go 1 magnitude less, for safety
	var MAX_ARGUMENTS_LENGTH = 0x1000;

	function decodeCodePointsArray(codePoints) {
	  var len = codePoints.length;
	  if (len <= MAX_ARGUMENTS_LENGTH) {
	    return String.fromCharCode.apply(String, codePoints); // avoid extra slice()
	  }

	  // Decode in chunks to avoid "call stack size exceeded".
	  var res = '';
	  var i = 0;
	  while (i < len) {
	    res += String.fromCharCode.apply(String, codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH));
	  }
	  return res;
	}

	function asciiSlice(buf, start, end) {
	  var ret = '';
	  end = Math.min(buf.length, end);

	  for (var i = start; i < end; i++) {
	    ret += String.fromCharCode(buf[i] & 0x7F);
	  }
	  return ret;
	}

	function binarySlice(buf, start, end) {
	  var ret = '';
	  end = Math.min(buf.length, end);

	  for (var i = start; i < end; i++) {
	    ret += String.fromCharCode(buf[i]);
	  }
	  return ret;
	}

	function hexSlice(buf, start, end) {
	  var len = buf.length;

	  if (!start || start < 0) start = 0;
	  if (!end || end < 0 || end > len) end = len;

	  var out = '';
	  for (var i = start; i < end; i++) {
	    out += toHex(buf[i]);
	  }
	  return out;
	}

	function utf16leSlice(buf, start, end) {
	  var bytes = buf.slice(start, end);
	  var res = '';
	  for (var i = 0; i < bytes.length; i += 2) {
	    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
	  }
	  return res;
	}

	Buffer.prototype.slice = function slice(start, end) {
	  var len = this.length;
	  start = ~ ~start;
	  end = end === undefined ? len : ~ ~end;

	  if (start < 0) {
	    start += len;
	    if (start < 0) start = 0;
	  } else if (start > len) {
	    start = len;
	  }

	  if (end < 0) {
	    end += len;
	    if (end < 0) end = 0;
	  } else if (end > len) {
	    end = len;
	  }

	  if (end < start) end = start;

	  var newBuf;
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    newBuf = Buffer._augment(this.subarray(start, end));
	  } else {
	    var sliceLen = end - start;
	    newBuf = new Buffer(sliceLen, undefined);
	    for (var i = 0; i < sliceLen; i++) {
	      newBuf[i] = this[i + start];
	    }
	  }

	  if (newBuf.length) newBuf.parent = this.parent || this;

	  return newBuf;
	};

	/*
	 * Need to make sure that buffer isn't trying to write out of bounds.
	 */
	function checkOffset(offset, ext, length) {
	  if (offset % 1 !== 0 || offset < 0) throw new RangeError('offset is not uint');
	  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length');
	}

	Buffer.prototype.readUIntLE = function readUIntLE(offset, byteLength, noAssert) {
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) checkOffset(offset, byteLength, this.length);

	  var val = this[offset];
	  var mul = 1;
	  var i = 0;
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul;
	  }

	  return val;
	};

	Buffer.prototype.readUIntBE = function readUIntBE(offset, byteLength, noAssert) {
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) {
	    checkOffset(offset, byteLength, this.length);
	  }

	  var val = this[offset + --byteLength];
	  var mul = 1;
	  while (byteLength > 0 && (mul *= 0x100)) {
	    val += this[offset + --byteLength] * mul;
	  }

	  return val;
	};

	Buffer.prototype.readUInt8 = function readUInt8(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length);
	  return this[offset];
	};

	Buffer.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length);
	  return this[offset] | this[offset + 1] << 8;
	};

	Buffer.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length);
	  return this[offset] << 8 | this[offset + 1];
	};

	Buffer.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);

	  return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 0x1000000;
	};

	Buffer.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);

	  return this[offset] * 0x1000000 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
	};

	Buffer.prototype.readIntLE = function readIntLE(offset, byteLength, noAssert) {
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) checkOffset(offset, byteLength, this.length);

	  var val = this[offset];
	  var mul = 1;
	  var i = 0;
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul;
	  }
	  mul *= 0x80;

	  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

	  return val;
	};

	Buffer.prototype.readIntBE = function readIntBE(offset, byteLength, noAssert) {
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) checkOffset(offset, byteLength, this.length);

	  var i = byteLength;
	  var mul = 1;
	  var val = this[offset + --i];
	  while (i > 0 && (mul *= 0x100)) {
	    val += this[offset + --i] * mul;
	  }
	  mul *= 0x80;

	  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

	  return val;
	};

	Buffer.prototype.readInt8 = function readInt8(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length);
	  if (!(this[offset] & 0x80)) return this[offset];
	  return (0xff - this[offset] + 1) * -1;
	};

	Buffer.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length);
	  var val = this[offset] | this[offset + 1] << 8;
	  return val & 0x8000 ? val | 0xFFFF0000 : val;
	};

	Buffer.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length);
	  var val = this[offset + 1] | this[offset] << 8;
	  return val & 0x8000 ? val | 0xFFFF0000 : val;
	};

	Buffer.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);

	  return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
	};

	Buffer.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);

	  return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
	};

	Buffer.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);
	  return ieee754.read(this, offset, true, 23, 4);
	};

	Buffer.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);
	  return ieee754.read(this, offset, false, 23, 4);
	};

	Buffer.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length);
	  return ieee754.read(this, offset, true, 52, 8);
	};

	Buffer.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length);
	  return ieee754.read(this, offset, false, 52, 8);
	};

	function checkInt(buf, value, offset, ext, max, min) {
	  if (!Buffer.isBuffer(buf)) throw new TypeError('buffer must be a Buffer instance');
	  if (value > max || value < min) throw new RangeError('value is out of bounds');
	  if (offset + ext > buf.length) throw new RangeError('index out of range');
	}

	Buffer.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0);

	  var mul = 1;
	  var i = 0;
	  this[offset] = value & 0xFF;
	  while (++i < byteLength && (mul *= 0x100)) {
	    this[offset + i] = value / mul & 0xFF;
	  }

	  return offset + byteLength;
	};

	Buffer.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0);

	  var i = byteLength - 1;
	  var mul = 1;
	  this[offset + i] = value & 0xFF;
	  while (--i >= 0 && (mul *= 0x100)) {
	    this[offset + i] = value / mul & 0xFF;
	  }

	  return offset + byteLength;
	};

	Buffer.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0);
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
	  this[offset] = value & 0xff;
	  return offset + 1;
	};

	function objectWriteUInt16(buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffff + value + 1;
	  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; i++) {
	    buf[offset + i] = (value & 0xff << 8 * (littleEndian ? i : 1 - i)) >>> (littleEndian ? i : 1 - i) * 8;
	  }
	}

	Buffer.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = value & 0xff;
	    this[offset + 1] = value >>> 8;
	  } else {
	    objectWriteUInt16(this, value, offset, true);
	  }
	  return offset + 2;
	};

	Buffer.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = value >>> 8;
	    this[offset + 1] = value & 0xff;
	  } else {
	    objectWriteUInt16(this, value, offset, false);
	  }
	  return offset + 2;
	};

	function objectWriteUInt32(buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffffffff + value + 1;
	  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; i++) {
	    buf[offset + i] = value >>> (littleEndian ? i : 3 - i) * 8 & 0xff;
	  }
	}

	Buffer.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset + 3] = value >>> 24;
	    this[offset + 2] = value >>> 16;
	    this[offset + 1] = value >>> 8;
	    this[offset] = value & 0xff;
	  } else {
	    objectWriteUInt32(this, value, offset, true);
	  }
	  return offset + 4;
	};

	Buffer.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = value >>> 24;
	    this[offset + 1] = value >>> 16;
	    this[offset + 2] = value >>> 8;
	    this[offset + 3] = value & 0xff;
	  } else {
	    objectWriteUInt32(this, value, offset, false);
	  }
	  return offset + 4;
	};

	Buffer.prototype.writeIntLE = function writeIntLE(value, offset, byteLength, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1);

	    checkInt(this, value, offset, byteLength, limit - 1, -limit);
	  }

	  var i = 0;
	  var mul = 1;
	  var sub = value < 0 ? 1 : 0;
	  this[offset] = value & 0xFF;
	  while (++i < byteLength && (mul *= 0x100)) {
	    this[offset + i] = (value / mul >> 0) - sub & 0xFF;
	  }

	  return offset + byteLength;
	};

	Buffer.prototype.writeIntBE = function writeIntBE(value, offset, byteLength, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1);

	    checkInt(this, value, offset, byteLength, limit - 1, -limit);
	  }

	  var i = byteLength - 1;
	  var mul = 1;
	  var sub = value < 0 ? 1 : 0;
	  this[offset + i] = value & 0xFF;
	  while (--i >= 0 && (mul *= 0x100)) {
	    this[offset + i] = (value / mul >> 0) - sub & 0xFF;
	  }

	  return offset + byteLength;
	};

	Buffer.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80);
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
	  if (value < 0) value = 0xff + value + 1;
	  this[offset] = value & 0xff;
	  return offset + 1;
	};

	Buffer.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = value & 0xff;
	    this[offset + 1] = value >>> 8;
	  } else {
	    objectWriteUInt16(this, value, offset, true);
	  }
	  return offset + 2;
	};

	Buffer.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = value >>> 8;
	    this[offset + 1] = value & 0xff;
	  } else {
	    objectWriteUInt16(this, value, offset, false);
	  }
	  return offset + 2;
	};

	Buffer.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = value & 0xff;
	    this[offset + 1] = value >>> 8;
	    this[offset + 2] = value >>> 16;
	    this[offset + 3] = value >>> 24;
	  } else {
	    objectWriteUInt32(this, value, offset, true);
	  }
	  return offset + 4;
	};

	Buffer.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
	  if (value < 0) value = 0xffffffff + value + 1;
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = value >>> 24;
	    this[offset + 1] = value >>> 16;
	    this[offset + 2] = value >>> 8;
	    this[offset + 3] = value & 0xff;
	  } else {
	    objectWriteUInt32(this, value, offset, false);
	  }
	  return offset + 4;
	};

	function checkIEEE754(buf, value, offset, ext, max, min) {
	  if (value > max || value < min) throw new RangeError('value is out of bounds');
	  if (offset + ext > buf.length) throw new RangeError('index out of range');
	  if (offset < 0) throw new RangeError('index out of range');
	}

	function writeFloat(buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38);
	  }
	  ieee754.write(buf, value, offset, littleEndian, 23, 4);
	  return offset + 4;
	}

	Buffer.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
	  return writeFloat(this, value, offset, true, noAssert);
	};

	Buffer.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
	  return writeFloat(this, value, offset, false, noAssert);
	};

	function writeDouble(buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308);
	  }
	  ieee754.write(buf, value, offset, littleEndian, 52, 8);
	  return offset + 8;
	}

	Buffer.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
	  return writeDouble(this, value, offset, true, noAssert);
	};

	Buffer.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
	  return writeDouble(this, value, offset, false, noAssert);
	};

	// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
	Buffer.prototype.copy = function copy(target, targetStart, start, end) {
	  if (!start) start = 0;
	  if (!end && end !== 0) end = this.length;
	  if (targetStart >= target.length) targetStart = target.length;
	  if (!targetStart) targetStart = 0;
	  if (end > 0 && end < start) end = start;

	  // Copy 0 bytes; we're done
	  if (end === start) return 0;
	  if (target.length === 0 || this.length === 0) return 0;

	  // Fatal error conditions
	  if (targetStart < 0) {
	    throw new RangeError('targetStart out of bounds');
	  }
	  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds');
	  if (end < 0) throw new RangeError('sourceEnd out of bounds');

	  // Are we oob?
	  if (end > this.length) end = this.length;
	  if (target.length - targetStart < end - start) {
	    end = target.length - targetStart + start;
	  }

	  var len = end - start;
	  var i;

	  if (this === target && start < targetStart && targetStart < end) {
	    // descending copy from end
	    for (i = len - 1; i >= 0; i--) {
	      target[i + targetStart] = this[i + start];
	    }
	  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
	    // ascending copy from start
	    for (i = 0; i < len; i++) {
	      target[i + targetStart] = this[i + start];
	    }
	  } else {
	    target._set(this.subarray(start, start + len), targetStart);
	  }

	  return len;
	};

	// fill(value, start=0, end=buffer.length)
	Buffer.prototype.fill = function fill(value, start, end) {
	  if (!value) value = 0;
	  if (!start) start = 0;
	  if (!end) end = this.length;

	  if (end < start) throw new RangeError('end < start');

	  // Fill 0 bytes; we're done
	  if (end === start) return;
	  if (this.length === 0) return;

	  if (start < 0 || start >= this.length) throw new RangeError('start out of bounds');
	  if (end < 0 || end > this.length) throw new RangeError('end out of bounds');

	  var i;
	  if (typeof value === 'number') {
	    for (i = start; i < end; i++) {
	      this[i] = value;
	    }
	  } else {
	    var bytes = utf8ToBytes(value.toString());
	    var len = bytes.length;
	    for (i = start; i < end; i++) {
	      this[i] = bytes[i % len];
	    }
	  }

	  return this;
	};

	/**
	 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
	 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
	 */
	Buffer.prototype.toArrayBuffer = function toArrayBuffer() {
	  if (typeof Uint8Array !== 'undefined') {
	    if (Buffer.TYPED_ARRAY_SUPPORT) {
	      return new Buffer(this).buffer;
	    } else {
	      var buf = new Uint8Array(this.length);
	      for (var i = 0, len = buf.length; i < len; i += 1) {
	        buf[i] = this[i];
	      }
	      return buf.buffer;
	    }
	  } else {
	    throw new TypeError('Buffer.toArrayBuffer not supported in this browser');
	  }
	};

	// HELPER FUNCTIONS
	// ================

	var BP = Buffer.prototype;

	/**
	 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
	 */
	Buffer._augment = function _augment(arr) {
	  arr.constructor = Buffer;
	  arr._isBuffer = true;

	  // save reference to original Uint8Array set method before overwriting
	  arr._set = arr.set;

	  // deprecated
	  arr.get = BP.get;
	  arr.set = BP.set;

	  arr.write = BP.write;
	  arr.toString = BP.toString;
	  arr.toLocaleString = BP.toString;
	  arr.toJSON = BP.toJSON;
	  arr.equals = BP.equals;
	  arr.compare = BP.compare;
	  arr.indexOf = BP.indexOf;
	  arr.copy = BP.copy;
	  arr.slice = BP.slice;
	  arr.readUIntLE = BP.readUIntLE;
	  arr.readUIntBE = BP.readUIntBE;
	  arr.readUInt8 = BP.readUInt8;
	  arr.readUInt16LE = BP.readUInt16LE;
	  arr.readUInt16BE = BP.readUInt16BE;
	  arr.readUInt32LE = BP.readUInt32LE;
	  arr.readUInt32BE = BP.readUInt32BE;
	  arr.readIntLE = BP.readIntLE;
	  arr.readIntBE = BP.readIntBE;
	  arr.readInt8 = BP.readInt8;
	  arr.readInt16LE = BP.readInt16LE;
	  arr.readInt16BE = BP.readInt16BE;
	  arr.readInt32LE = BP.readInt32LE;
	  arr.readInt32BE = BP.readInt32BE;
	  arr.readFloatLE = BP.readFloatLE;
	  arr.readFloatBE = BP.readFloatBE;
	  arr.readDoubleLE = BP.readDoubleLE;
	  arr.readDoubleBE = BP.readDoubleBE;
	  arr.writeUInt8 = BP.writeUInt8;
	  arr.writeUIntLE = BP.writeUIntLE;
	  arr.writeUIntBE = BP.writeUIntBE;
	  arr.writeUInt16LE = BP.writeUInt16LE;
	  arr.writeUInt16BE = BP.writeUInt16BE;
	  arr.writeUInt32LE = BP.writeUInt32LE;
	  arr.writeUInt32BE = BP.writeUInt32BE;
	  arr.writeIntLE = BP.writeIntLE;
	  arr.writeIntBE = BP.writeIntBE;
	  arr.writeInt8 = BP.writeInt8;
	  arr.writeInt16LE = BP.writeInt16LE;
	  arr.writeInt16BE = BP.writeInt16BE;
	  arr.writeInt32LE = BP.writeInt32LE;
	  arr.writeInt32BE = BP.writeInt32BE;
	  arr.writeFloatLE = BP.writeFloatLE;
	  arr.writeFloatBE = BP.writeFloatBE;
	  arr.writeDoubleLE = BP.writeDoubleLE;
	  arr.writeDoubleBE = BP.writeDoubleBE;
	  arr.fill = BP.fill;
	  arr.inspect = BP.inspect;
	  arr.toArrayBuffer = BP.toArrayBuffer;

	  return arr;
	};

	var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g;

	function base64clean(str) {
	  // Node strips out invalid characters like \n and \t from the string, base64-js does not
	  str = stringtrim(str).replace(INVALID_BASE64_RE, '');
	  // Node converts strings with length < 2 to ''
	  if (str.length < 2) return '';
	  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
	  while (str.length % 4 !== 0) {
	    str = str + '=';
	  }
	  return str;
	}

	function stringtrim(str) {
	  if (str.trim) return str.trim();
	  return str.replace(/^\s+|\s+$/g, '');
	}

	function toHex(n) {
	  if (n < 16) return '0' + n.toString(16);
	  return n.toString(16);
	}

	function utf8ToBytes(string, units) {
	  units = units || Infinity;
	  var codePoint;
	  var length = string.length;
	  var leadSurrogate = null;
	  var bytes = [];

	  for (var i = 0; i < length; i++) {
	    codePoint = string.charCodeAt(i);

	    // is surrogate component
	    if (codePoint > 0xD7FF && codePoint < 0xE000) {
	      // last char was a lead
	      if (!leadSurrogate) {
	        // no lead yet
	        if (codePoint > 0xDBFF) {
	          // unexpected trail
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
	          continue;
	        } else if (i + 1 === length) {
	          // unpaired lead
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
	          continue;
	        }

	        // valid lead
	        leadSurrogate = codePoint;

	        continue;
	      }

	      // 2 leads in a row
	      if (codePoint < 0xDC00) {
	        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
	        leadSurrogate = codePoint;
	        continue;
	      }

	      // valid surrogate pair
	      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000;
	    } else if (leadSurrogate) {
	      // valid bmp char, but last char was a lead
	      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
	    }

	    leadSurrogate = null;

	    // encode utf8
	    if (codePoint < 0x80) {
	      if ((units -= 1) < 0) break;
	      bytes.push(codePoint);
	    } else if (codePoint < 0x800) {
	      if ((units -= 2) < 0) break;
	      bytes.push(codePoint >> 0x6 | 0xC0, codePoint & 0x3F | 0x80);
	    } else if (codePoint < 0x10000) {
	      if ((units -= 3) < 0) break;
	      bytes.push(codePoint >> 0xC | 0xE0, codePoint >> 0x6 & 0x3F | 0x80, codePoint & 0x3F | 0x80);
	    } else if (codePoint < 0x110000) {
	      if ((units -= 4) < 0) break;
	      bytes.push(codePoint >> 0x12 | 0xF0, codePoint >> 0xC & 0x3F | 0x80, codePoint >> 0x6 & 0x3F | 0x80, codePoint & 0x3F | 0x80);
	    } else {
	      throw new Error('Invalid code point');
	    }
	  }

	  return bytes;
	}

	function asciiToBytes(str) {
	  var byteArray = [];
	  for (var i = 0; i < str.length; i++) {
	    // Node's code seems to be doing this and not & 0x7F..
	    byteArray.push(str.charCodeAt(i) & 0xFF);
	  }
	  return byteArray;
	}

	function utf16leToBytes(str, units) {
	  var c, hi, lo;
	  var byteArray = [];
	  for (var i = 0; i < str.length; i++) {
	    if ((units -= 2) < 0) break;

	    c = str.charCodeAt(i);
	    hi = c >> 8;
	    lo = c % 256;
	    byteArray.push(lo);
	    byteArray.push(hi);
	  }

	  return byteArray;
	}

	function base64ToBytes(str) {
	  return base64.toByteArray(base64clean(str));
	}

	function blitBuffer(src, dst, offset, length) {
	  for (var i = 0; i < length; i++) {
	    if (i + offset >= dst.length || i >= src.length) break;
	    dst[i + offset] = src[i];
	  }
	  return i;
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(13).Buffer, (function() { return this; }())))

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

	;(function (exports) {
		'use strict';

		var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;

		var PLUS = '+'.charCodeAt(0);
		var SLASH = '/'.charCodeAt(0);
		var NUMBER = '0'.charCodeAt(0);
		var LOWER = 'a'.charCodeAt(0);
		var UPPER = 'A'.charCodeAt(0);
		var PLUS_URL_SAFE = '-'.charCodeAt(0);
		var SLASH_URL_SAFE = '_'.charCodeAt(0);

		function decode(elt) {
			var code = elt.charCodeAt(0);
			if (code === PLUS || code === PLUS_URL_SAFE) return 62; // '+'
			if (code === SLASH || code === SLASH_URL_SAFE) return 63; // '/'
			if (code < NUMBER) return -1; //no match
			if (code < NUMBER + 10) return code - NUMBER + 26 + 26;
			if (code < UPPER + 26) return code - UPPER;
			if (code < LOWER + 26) return code - LOWER + 26;
		}

		function b64ToByteArray(b64) {
			var i, j, l, tmp, placeHolders, arr;

			if (b64.length % 4 > 0) {
				throw new Error('Invalid string. Length must be a multiple of 4');
			}

			// the number of equal signs (place holders)
			// if there are two placeholders, than the two characters before it
			// represent one byte
			// if there is only one, then the three characters before it represent 2 bytes
			// this is just a cheap hack to not do indexOf twice
			var len = b64.length;
			placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0;

			// base64 is 4/3 + up to two characters of the original data
			arr = new Arr(b64.length * 3 / 4 - placeHolders);

			// if there are placeholders, only get up to the last complete 4 chars
			l = placeHolders > 0 ? b64.length - 4 : b64.length;

			var L = 0;

			function push(v) {
				arr[L++] = v;
			}

			for (i = 0, j = 0; i < l; i += 4, j += 3) {
				tmp = decode(b64.charAt(i)) << 18 | decode(b64.charAt(i + 1)) << 12 | decode(b64.charAt(i + 2)) << 6 | decode(b64.charAt(i + 3));
				push((tmp & 0xFF0000) >> 16);
				push((tmp & 0xFF00) >> 8);
				push(tmp & 0xFF);
			}

			if (placeHolders === 2) {
				tmp = decode(b64.charAt(i)) << 2 | decode(b64.charAt(i + 1)) >> 4;
				push(tmp & 0xFF);
			} else if (placeHolders === 1) {
				tmp = decode(b64.charAt(i)) << 10 | decode(b64.charAt(i + 1)) << 4 | decode(b64.charAt(i + 2)) >> 2;
				push(tmp >> 8 & 0xFF);
				push(tmp & 0xFF);
			}

			return arr;
		}

		function uint8ToBase64(uint8) {
			var i,
			    extraBytes = uint8.length % 3,
			    // if we have 1 byte left, pad 2 bytes
			output = "",
			    temp,
			    length;

			function encode(num) {
				return lookup.charAt(num);
			}

			function tripletToBase64(num) {
				return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F);
			}

			// go through the array every three bytes, we'll deal with trailing stuff later
			for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
				temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + uint8[i + 2];
				output += tripletToBase64(temp);
			}

			// pad the end with zeros, but make sure to not forget the extra bytes
			switch (extraBytes) {
				case 1:
					temp = uint8[uint8.length - 1];
					output += encode(temp >> 2);
					output += encode(temp << 4 & 0x3F);
					output += '==';
					break;
				case 2:
					temp = (uint8[uint8.length - 2] << 8) + uint8[uint8.length - 1];
					output += encode(temp >> 10);
					output += encode(temp >> 4 & 0x3F);
					output += encode(temp << 2 & 0x3F);
					output += '=';
					break;
			}

			return output;
		}

		exports.toByteArray = b64ToByteArray;
		exports.fromByteArray = uint8ToBase64;
	})( false ? undefined.base64js = {} : exports);

/***/ },
/* 15 */
/***/ function(module, exports) {

	"use strict";

	exports.read = function (buffer, offset, isLE, mLen, nBytes) {
	  var e, m;
	  var eLen = nBytes * 8 - mLen - 1;
	  var eMax = (1 << eLen) - 1;
	  var eBias = eMax >> 1;
	  var nBits = -7;
	  var i = isLE ? nBytes - 1 : 0;
	  var d = isLE ? -1 : 1;
	  var s = buffer[offset + i];

	  i += d;

	  e = s & (1 << -nBits) - 1;
	  s >>= -nBits;
	  nBits += eLen;
	  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

	  m = e & (1 << -nBits) - 1;
	  e >>= -nBits;
	  nBits += mLen;
	  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

	  if (e === 0) {
	    e = 1 - eBias;
	  } else if (e === eMax) {
	    return m ? NaN : (s ? -1 : 1) * Infinity;
	  } else {
	    m = m + Math.pow(2, mLen);
	    e = e - eBias;
	  }
	  return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
	};

	exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
	  var e, m, c;
	  var eLen = nBytes * 8 - mLen - 1;
	  var eMax = (1 << eLen) - 1;
	  var eBias = eMax >> 1;
	  var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
	  var i = isLE ? 0 : nBytes - 1;
	  var d = isLE ? 1 : -1;
	  var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;

	  value = Math.abs(value);

	  if (isNaN(value) || value === Infinity) {
	    m = isNaN(value) ? 1 : 0;
	    e = eMax;
	  } else {
	    e = Math.floor(Math.log(value) / Math.LN2);
	    if (value * (c = Math.pow(2, -e)) < 1) {
	      e--;
	      c *= 2;
	    }
	    if (e + eBias >= 1) {
	      value += rt / c;
	    } else {
	      value += rt * Math.pow(2, 1 - eBias);
	    }
	    if (value * c >= 2) {
	      e++;
	      c /= 2;
	    }

	    if (e + eBias >= eMax) {
	      m = 0;
	      e = eMax;
	    } else if (e + eBias >= 1) {
	      m = (value * c - 1) * Math.pow(2, mLen);
	      e = e + eBias;
	    } else {
	      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
	      e = 0;
	    }
	  }

	  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

	  e = e << mLen | m;
	  eLen += mLen;
	  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

	  buffer[offset + i - d] |= s * 128;
	};

/***/ },
/* 16 */
/***/ function(module, exports) {

	'use strict';

	var toString = {}.toString;

	module.exports = Array.isArray || function (arr) {
	  return toString.call(arr) == '[object Array]';
	};

/***/ },
/* 17 */
/***/ function(module, exports) {

	module.exports = google;

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _baconjs = __webpack_require__(4);

	var _baconjs2 = _interopRequireDefault(_baconjs);

	var _jquery = __webpack_require__(8);

	var _jquery2 = _interopRequireDefault(_jquery);

	var _bacon = __webpack_require__(9);

	var _bacon2 = _interopRequireDefault(_bacon);

	var _google = __webpack_require__(17);

	var _google2 = _interopRequireDefault(_google);

	var _moment = __webpack_require__(19);

	var _moment2 = _interopRequireDefault(_moment);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	if ((0, _jquery2.default)("#page").is(".arrivals-page")) {
	  (function () {
	    var stopId = window.location.pathname.split('/').pop();
	    var $results = (0, _jquery2.default)(".results");
	    var poller = _baconjs2.default.interval(2000, true).map(function (v) {
	      return { url: '/api/tfl/arrivals/' + stopId };
	    }).ajax();

	    poller.onValue(function (v) {
	      $results.empty();
	      if (v.arrivals === null) {
	        return;
	      }
	      var arrivals = v.arrivals.sort(function (a, b) {
	        if (a.expected < b.expected) {
	          return -1;
	        } else if (a.expected > b.expected) {
	          return 1;
	        } else {
	          return 0;
	        }
	      });
	      var _iteratorNormalCompletion = true;
	      var _didIteratorError = false;
	      var _iteratorError = undefined;

	      try {
	        for (var _iterator = arrivals[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	          var arrival = _step.value;

	          var expected = (0, _moment2.default)(arrival.expected);
	          if (expected.isBefore((0, _moment2.default)().add(1, 'minutes'))) {
	            expected = "due";
	          } else {
	            expected = expected.fromNow();
	          }
	          var description = arrival.line;
	          if (arrival.vehicle.destination !== "") {
	            description += ' to ' + arrival.vehicle.destination;
	          }
	          $results.append((0, _jquery2.default)("<li/>").append((0, _jquery2.default)("<span />").text(description + ' ' + expected)));
	        }
	      } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion && _iterator.return) {
	            _iterator.return();
	          }
	        } finally {
	          if (_didIteratorError) {
	            throw _iteratorError;
	          }
	        }
	      }
	    });
	  })();
	}

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module) {'use strict';var _typeof=typeof Symbol==="function"&&typeof Symbol.iterator==="symbol"?function(obj){return typeof obj;}:function(obj){return obj&&typeof Symbol==="function"&&obj.constructor===Symbol?"symbol":typeof obj;}; //! moment.js
	//! version : 2.11.2
	//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
	//! license : MIT
	//! momentjs.com
	;(function(global,factory){( false?'undefined':_typeof(exports))==='object'&&typeof module!=='undefined'?module.exports=factory(): true?!(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)):global.moment=factory();})(undefined,function(){'use strict';var hookCallback;function utils_hooks__hooks(){return hookCallback.apply(null,arguments);} // This is done to register the method called with moment()
	// without creating circular dependencies.
	function setHookCallback(callback){hookCallback=callback;}function isArray(input){return Object.prototype.toString.call(input)==='[object Array]';}function isDate(input){return input instanceof Date||Object.prototype.toString.call(input)==='[object Date]';}function map(arr,fn){var res=[],i;for(i=0;i<arr.length;++i){res.push(fn(arr[i],i));}return res;}function hasOwnProp(a,b){return Object.prototype.hasOwnProperty.call(a,b);}function extend(a,b){for(var i in b){if(hasOwnProp(b,i)){a[i]=b[i];}}if(hasOwnProp(b,'toString')){a.toString=b.toString;}if(hasOwnProp(b,'valueOf')){a.valueOf=b.valueOf;}return a;}function create_utc__createUTC(input,format,locale,strict){return createLocalOrUTC(input,format,locale,strict,true).utc();}function defaultParsingFlags(){ // We need to deep clone this object.
	return {empty:false,unusedTokens:[],unusedInput:[],overflow:-2,charsLeftOver:0,nullInput:false,invalidMonth:null,invalidFormat:false,userInvalidated:false,iso:false};}function getParsingFlags(m){if(m._pf==null){m._pf=defaultParsingFlags();}return m._pf;}function valid__isValid(m){if(m._isValid==null){var flags=getParsingFlags(m);m._isValid=!isNaN(m._d.getTime())&&flags.overflow<0&&!flags.empty&&!flags.invalidMonth&&!flags.invalidWeekday&&!flags.nullInput&&!flags.invalidFormat&&!flags.userInvalidated;if(m._strict){m._isValid=m._isValid&&flags.charsLeftOver===0&&flags.unusedTokens.length===0&&flags.bigHour===undefined;}}return m._isValid;}function valid__createInvalid(flags){var m=create_utc__createUTC(NaN);if(flags!=null){extend(getParsingFlags(m),flags);}else {getParsingFlags(m).userInvalidated=true;}return m;}function isUndefined(input){return input===void 0;} // Plugins that add properties should also add the key here (null value),
	// so we can properly clone ourselves.
	var momentProperties=utils_hooks__hooks.momentProperties=[];function copyConfig(to,from){var i,prop,val;if(!isUndefined(from._isAMomentObject)){to._isAMomentObject=from._isAMomentObject;}if(!isUndefined(from._i)){to._i=from._i;}if(!isUndefined(from._f)){to._f=from._f;}if(!isUndefined(from._l)){to._l=from._l;}if(!isUndefined(from._strict)){to._strict=from._strict;}if(!isUndefined(from._tzm)){to._tzm=from._tzm;}if(!isUndefined(from._isUTC)){to._isUTC=from._isUTC;}if(!isUndefined(from._offset)){to._offset=from._offset;}if(!isUndefined(from._pf)){to._pf=getParsingFlags(from);}if(!isUndefined(from._locale)){to._locale=from._locale;}if(momentProperties.length>0){for(i in momentProperties){prop=momentProperties[i];val=from[prop];if(!isUndefined(val)){to[prop]=val;}}}return to;}var updateInProgress=false; // Moment prototype object
	function Moment(config){copyConfig(this,config);this._d=new Date(config._d!=null?config._d.getTime():NaN); // Prevent infinite loop in case updateOffset creates new moment
	// objects.
	if(updateInProgress===false){updateInProgress=true;utils_hooks__hooks.updateOffset(this);updateInProgress=false;}}function isMoment(obj){return obj instanceof Moment||obj!=null&&obj._isAMomentObject!=null;}function absFloor(number){if(number<0){return Math.ceil(number);}else {return Math.floor(number);}}function toInt(argumentForCoercion){var coercedNumber=+argumentForCoercion,value=0;if(coercedNumber!==0&&isFinite(coercedNumber)){value=absFloor(coercedNumber);}return value;} // compare two arrays, return the number of differences
	function compareArrays(array1,array2,dontConvert){var len=Math.min(array1.length,array2.length),lengthDiff=Math.abs(array1.length-array2.length),diffs=0,i;for(i=0;i<len;i++){if(dontConvert&&array1[i]!==array2[i]||!dontConvert&&toInt(array1[i])!==toInt(array2[i])){diffs++;}}return diffs+lengthDiff;}function Locale(){} // internal storage for locale config files
	var locales={};var globalLocale;function normalizeLocale(key){return key?key.toLowerCase().replace('_','-'):key;} // pick the locale from the array
	// try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
	// substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
	function chooseLocale(names){var i=0,j,next,locale,split;while(i<names.length){split=normalizeLocale(names[i]).split('-');j=split.length;next=normalizeLocale(names[i+1]);next=next?next.split('-'):null;while(j>0){locale=loadLocale(split.slice(0,j).join('-'));if(locale){return locale;}if(next&&next.length>=j&&compareArrays(split,next,true)>=j-1){ //the next array item is better than a shallower substring of this one
	break;}j--;}i++;}return null;}function loadLocale(name){var oldLocale=null; // TODO: Find a better way to register and load all the locales in Node
	if(!locales[name]&&typeof module!=='undefined'&&module&&module.exports){try{oldLocale=globalLocale._abbr;!(function webpackMissingModule() { var e = new Error("Cannot find module \"./locale\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()); // because defineLocale currently also sets the global locale, we
	// want to undo that for lazy loaded locales
	locale_locales__getSetGlobalLocale(oldLocale);}catch(e){}}return locales[name];} // This function will load locale and then set the global locale.  If
	// no arguments are passed in, it will simply return the current global
	// locale key.
	function locale_locales__getSetGlobalLocale(key,values){var data;if(key){if(isUndefined(values)){data=locale_locales__getLocale(key);}else {data=defineLocale(key,values);}if(data){ // moment.duration._locale = moment._locale = data;
	globalLocale=data;}}return globalLocale._abbr;}function defineLocale(name,values){if(values!==null){values.abbr=name;locales[name]=locales[name]||new Locale();locales[name].set(values); // backwards compat for now: also set the locale
	locale_locales__getSetGlobalLocale(name);return locales[name];}else { // useful for testing
	delete locales[name];return null;}} // returns locale data
	function locale_locales__getLocale(key){var locale;if(key&&key._locale&&key._locale._abbr){key=key._locale._abbr;}if(!key){return globalLocale;}if(!isArray(key)){ //short-circuit everything else
	locale=loadLocale(key);if(locale){return locale;}key=[key];}return chooseLocale(key);}var aliases={};function addUnitAlias(unit,shorthand){var lowerCase=unit.toLowerCase();aliases[lowerCase]=aliases[lowerCase+'s']=aliases[shorthand]=unit;}function normalizeUnits(units){return typeof units==='string'?aliases[units]||aliases[units.toLowerCase()]:undefined;}function normalizeObjectUnits(inputObject){var normalizedInput={},normalizedProp,prop;for(prop in inputObject){if(hasOwnProp(inputObject,prop)){normalizedProp=normalizeUnits(prop);if(normalizedProp){normalizedInput[normalizedProp]=inputObject[prop];}}}return normalizedInput;}function isFunction(input){return input instanceof Function||Object.prototype.toString.call(input)==='[object Function]';}function makeGetSet(unit,keepTime){return function(value){if(value!=null){get_set__set(this,unit,value);utils_hooks__hooks.updateOffset(this,keepTime);return this;}else {return get_set__get(this,unit);}};}function get_set__get(mom,unit){return mom.isValid()?mom._d['get'+(mom._isUTC?'UTC':'')+unit]():NaN;}function get_set__set(mom,unit,value){if(mom.isValid()){mom._d['set'+(mom._isUTC?'UTC':'')+unit](value);}} // MOMENTS
	function getSet(units,value){var unit;if((typeof units==='undefined'?'undefined':_typeof(units))==='object'){for(unit in units){this.set(unit,units[unit]);}}else {units=normalizeUnits(units);if(isFunction(this[units])){return this[units](value);}}return this;}function zeroFill(number,targetLength,forceSign){var absNumber=''+Math.abs(number),zerosToFill=targetLength-absNumber.length,sign=number>=0;return (sign?forceSign?'+':'':'-')+Math.pow(10,Math.max(0,zerosToFill)).toString().substr(1)+absNumber;}var formattingTokens=/(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g;var localFormattingTokens=/(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g;var formatFunctions={};var formatTokenFunctions={}; // token:    'M'
	// padded:   ['MM', 2]
	// ordinal:  'Mo'
	// callback: function () { this.month() + 1 }
	function addFormatToken(token,padded,ordinal,callback){var func=callback;if(typeof callback==='string'){func=function func(){return this[callback]();};}if(token){formatTokenFunctions[token]=func;}if(padded){formatTokenFunctions[padded[0]]=function(){return zeroFill(func.apply(this,arguments),padded[1],padded[2]);};}if(ordinal){formatTokenFunctions[ordinal]=function(){return this.localeData().ordinal(func.apply(this,arguments),token);};}}function removeFormattingTokens(input){if(input.match(/\[[\s\S]/)){return input.replace(/^\[|\]$/g,'');}return input.replace(/\\/g,'');}function makeFormatFunction(format){var array=format.match(formattingTokens),i,length;for(i=0,length=array.length;i<length;i++){if(formatTokenFunctions[array[i]]){array[i]=formatTokenFunctions[array[i]];}else {array[i]=removeFormattingTokens(array[i]);}}return function(mom){var output='';for(i=0;i<length;i++){output+=array[i] instanceof Function?array[i].call(mom,format):array[i];}return output;};} // format date using native date object
	function formatMoment(m,format){if(!m.isValid()){return m.localeData().invalidDate();}format=expandFormat(format,m.localeData());formatFunctions[format]=formatFunctions[format]||makeFormatFunction(format);return formatFunctions[format](m);}function expandFormat(format,locale){var i=5;function replaceLongDateFormatTokens(input){return locale.longDateFormat(input)||input;}localFormattingTokens.lastIndex=0;while(i>=0&&localFormattingTokens.test(format)){format=format.replace(localFormattingTokens,replaceLongDateFormatTokens);localFormattingTokens.lastIndex=0;i-=1;}return format;}var match1=/\d/; //       0 - 9
	var match2=/\d\d/; //      00 - 99
	var match3=/\d{3}/; //     000 - 999
	var match4=/\d{4}/; //    0000 - 9999
	var match6=/[+-]?\d{6}/; // -999999 - 999999
	var match1to2=/\d\d?/; //       0 - 99
	var match3to4=/\d\d\d\d?/; //     999 - 9999
	var match5to6=/\d\d\d\d\d\d?/; //   99999 - 999999
	var match1to3=/\d{1,3}/; //       0 - 999
	var match1to4=/\d{1,4}/; //       0 - 9999
	var match1to6=/[+-]?\d{1,6}/; // -999999 - 999999
	var matchUnsigned=/\d+/; //       0 - inf
	var matchSigned=/[+-]?\d+/; //    -inf - inf
	var matchOffset=/Z|[+-]\d\d:?\d\d/gi; // +00:00 -00:00 +0000 -0000 or Z
	var matchShortOffset=/Z|[+-]\d\d(?::?\d\d)?/gi; // +00 -00 +00:00 -00:00 +0000 -0000 or Z
	var matchTimestamp=/[+-]?\d+(\.\d{1,3})?/; // 123456789 123456789.123
	// any word (or two) characters or numbers including two/three word month in arabic.
	// includes scottish gaelic two word and hyphenated months
	var matchWord=/[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i;var regexes={};function addRegexToken(token,regex,strictRegex){regexes[token]=isFunction(regex)?regex:function(isStrict,localeData){return isStrict&&strictRegex?strictRegex:regex;};}function getParseRegexForToken(token,config){if(!hasOwnProp(regexes,token)){return new RegExp(unescapeFormat(token));}return regexes[token](config._strict,config._locale);} // Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
	function unescapeFormat(s){return regexEscape(s.replace('\\','').replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g,function(matched,p1,p2,p3,p4){return p1||p2||p3||p4;}));}function regexEscape(s){return s.replace(/[-\/\\^$*+?.()|[\]{}]/g,'\\$&');}var tokens={};function addParseToken(token,callback){var i,func=callback;if(typeof token==='string'){token=[token];}if(typeof callback==='number'){func=function func(input,array){array[callback]=toInt(input);};}for(i=0;i<token.length;i++){tokens[token[i]]=func;}}function addWeekParseToken(token,callback){addParseToken(token,function(input,array,config,token){config._w=config._w||{};callback(input,config._w,config,token);});}function addTimeToArrayFromToken(token,input,config){if(input!=null&&hasOwnProp(tokens,token)){tokens[token](input,config._a,config,token);}}var YEAR=0;var MONTH=1;var DATE=2;var HOUR=3;var MINUTE=4;var SECOND=5;var MILLISECOND=6;var WEEK=7;var WEEKDAY=8;function daysInMonth(year,month){return new Date(Date.UTC(year,month+1,0)).getUTCDate();} // FORMATTING
	addFormatToken('M',['MM',2],'Mo',function(){return this.month()+1;});addFormatToken('MMM',0,0,function(format){return this.localeData().monthsShort(this,format);});addFormatToken('MMMM',0,0,function(format){return this.localeData().months(this,format);}); // ALIASES
	addUnitAlias('month','M'); // PARSING
	addRegexToken('M',match1to2);addRegexToken('MM',match1to2,match2);addRegexToken('MMM',function(isStrict,locale){return locale.monthsShortRegex(isStrict);});addRegexToken('MMMM',function(isStrict,locale){return locale.monthsRegex(isStrict);});addParseToken(['M','MM'],function(input,array){array[MONTH]=toInt(input)-1;});addParseToken(['MMM','MMMM'],function(input,array,config,token){var month=config._locale.monthsParse(input,token,config._strict); // if we didn't find a month name, mark the date as invalid.
	if(month!=null){array[MONTH]=month;}else {getParsingFlags(config).invalidMonth=input;}}); // LOCALES
	var MONTHS_IN_FORMAT=/D[oD]?(\[[^\[\]]*\]|\s+)+MMMM?/;var defaultLocaleMonths='January_February_March_April_May_June_July_August_September_October_November_December'.split('_');function localeMonths(m,format){return isArray(this._months)?this._months[m.month()]:this._months[MONTHS_IN_FORMAT.test(format)?'format':'standalone'][m.month()];}var defaultLocaleMonthsShort='Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_');function localeMonthsShort(m,format){return isArray(this._monthsShort)?this._monthsShort[m.month()]:this._monthsShort[MONTHS_IN_FORMAT.test(format)?'format':'standalone'][m.month()];}function localeMonthsParse(monthName,format,strict){var i,mom,regex;if(!this._monthsParse){this._monthsParse=[];this._longMonthsParse=[];this._shortMonthsParse=[];}for(i=0;i<12;i++){ // make the regex if we don't have it already
	mom=create_utc__createUTC([2000,i]);if(strict&&!this._longMonthsParse[i]){this._longMonthsParse[i]=new RegExp('^'+this.months(mom,'').replace('.','')+'$','i');this._shortMonthsParse[i]=new RegExp('^'+this.monthsShort(mom,'').replace('.','')+'$','i');}if(!strict&&!this._monthsParse[i]){regex='^'+this.months(mom,'')+'|^'+this.monthsShort(mom,'');this._monthsParse[i]=new RegExp(regex.replace('.',''),'i');} // test the regex
	if(strict&&format==='MMMM'&&this._longMonthsParse[i].test(monthName)){return i;}else if(strict&&format==='MMM'&&this._shortMonthsParse[i].test(monthName)){return i;}else if(!strict&&this._monthsParse[i].test(monthName)){return i;}}} // MOMENTS
	function setMonth(mom,value){var dayOfMonth;if(!mom.isValid()){ // No op
	return mom;} // TODO: Move this out of here!
	if(typeof value==='string'){value=mom.localeData().monthsParse(value); // TODO: Another silent failure?
	if(typeof value!=='number'){return mom;}}dayOfMonth=Math.min(mom.date(),daysInMonth(mom.year(),value));mom._d['set'+(mom._isUTC?'UTC':'')+'Month'](value,dayOfMonth);return mom;}function getSetMonth(value){if(value!=null){setMonth(this,value);utils_hooks__hooks.updateOffset(this,true);return this;}else {return get_set__get(this,'Month');}}function getDaysInMonth(){return daysInMonth(this.year(),this.month());}var defaultMonthsShortRegex=matchWord;function monthsShortRegex(isStrict){if(this._monthsParseExact){if(!hasOwnProp(this,'_monthsRegex')){computeMonthsParse.call(this);}if(isStrict){return this._monthsShortStrictRegex;}else {return this._monthsShortRegex;}}else {return this._monthsShortStrictRegex&&isStrict?this._monthsShortStrictRegex:this._monthsShortRegex;}}var defaultMonthsRegex=matchWord;function monthsRegex(isStrict){if(this._monthsParseExact){if(!hasOwnProp(this,'_monthsRegex')){computeMonthsParse.call(this);}if(isStrict){return this._monthsStrictRegex;}else {return this._monthsRegex;}}else {return this._monthsStrictRegex&&isStrict?this._monthsStrictRegex:this._monthsRegex;}}function computeMonthsParse(){function cmpLenRev(a,b){return b.length-a.length;}var shortPieces=[],longPieces=[],mixedPieces=[],i,mom;for(i=0;i<12;i++){ // make the regex if we don't have it already
	mom=create_utc__createUTC([2000,i]);shortPieces.push(this.monthsShort(mom,''));longPieces.push(this.months(mom,''));mixedPieces.push(this.months(mom,''));mixedPieces.push(this.monthsShort(mom,''));} // Sorting makes sure if one month (or abbr) is a prefix of another it
	// will match the longer piece.
	shortPieces.sort(cmpLenRev);longPieces.sort(cmpLenRev);mixedPieces.sort(cmpLenRev);for(i=0;i<12;i++){shortPieces[i]=regexEscape(shortPieces[i]);longPieces[i]=regexEscape(longPieces[i]);mixedPieces[i]=regexEscape(mixedPieces[i]);}this._monthsRegex=new RegExp('^('+mixedPieces.join('|')+')','i');this._monthsShortRegex=this._monthsRegex;this._monthsStrictRegex=new RegExp('^('+longPieces.join('|')+')$','i');this._monthsShortStrictRegex=new RegExp('^('+shortPieces.join('|')+')$','i');}function checkOverflow(m){var overflow;var a=m._a;if(a&&getParsingFlags(m).overflow===-2){overflow=a[MONTH]<0||a[MONTH]>11?MONTH:a[DATE]<1||a[DATE]>daysInMonth(a[YEAR],a[MONTH])?DATE:a[HOUR]<0||a[HOUR]>24||a[HOUR]===24&&(a[MINUTE]!==0||a[SECOND]!==0||a[MILLISECOND]!==0)?HOUR:a[MINUTE]<0||a[MINUTE]>59?MINUTE:a[SECOND]<0||a[SECOND]>59?SECOND:a[MILLISECOND]<0||a[MILLISECOND]>999?MILLISECOND:-1;if(getParsingFlags(m)._overflowDayOfYear&&(overflow<YEAR||overflow>DATE)){overflow=DATE;}if(getParsingFlags(m)._overflowWeeks&&overflow===-1){overflow=WEEK;}if(getParsingFlags(m)._overflowWeekday&&overflow===-1){overflow=WEEKDAY;}getParsingFlags(m).overflow=overflow;}return m;}function warn(msg){if(utils_hooks__hooks.suppressDeprecationWarnings===false&&typeof console!=='undefined'&&console.warn){console.warn('Deprecation warning: '+msg);}}function deprecate(msg,fn){var firstTime=true;return extend(function(){if(firstTime){warn(msg+'\nArguments: '+Array.prototype.slice.call(arguments).join(', ')+'\n'+new Error().stack);firstTime=false;}return fn.apply(this,arguments);},fn);}var deprecations={};function deprecateSimple(name,msg){if(!deprecations[name]){warn(msg);deprecations[name]=true;}}utils_hooks__hooks.suppressDeprecationWarnings=false; // iso 8601 regex
	// 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)
	var extendedIsoRegex=/^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?/;var basicIsoRegex=/^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?/;var tzRegex=/Z|[+-]\d\d(?::?\d\d)?/;var isoDates=[['YYYYYY-MM-DD',/[+-]\d{6}-\d\d-\d\d/],['YYYY-MM-DD',/\d{4}-\d\d-\d\d/],['GGGG-[W]WW-E',/\d{4}-W\d\d-\d/],['GGGG-[W]WW',/\d{4}-W\d\d/,false],['YYYY-DDD',/\d{4}-\d{3}/],['YYYY-MM',/\d{4}-\d\d/,false],['YYYYYYMMDD',/[+-]\d{10}/],['YYYYMMDD',/\d{8}/], // YYYYMM is NOT allowed by the standard
	['GGGG[W]WWE',/\d{4}W\d{3}/],['GGGG[W]WW',/\d{4}W\d{2}/,false],['YYYYDDD',/\d{7}/]]; // iso time formats and regexes
	var isoTimes=[['HH:mm:ss.SSSS',/\d\d:\d\d:\d\d\.\d+/],['HH:mm:ss,SSSS',/\d\d:\d\d:\d\d,\d+/],['HH:mm:ss',/\d\d:\d\d:\d\d/],['HH:mm',/\d\d:\d\d/],['HHmmss.SSSS',/\d\d\d\d\d\d\.\d+/],['HHmmss,SSSS',/\d\d\d\d\d\d,\d+/],['HHmmss',/\d\d\d\d\d\d/],['HHmm',/\d\d\d\d/],['HH',/\d\d/]];var aspNetJsonRegex=/^\/?Date\((\-?\d+)/i; // date from iso format
	function configFromISO(config){var i,l,string=config._i,match=extendedIsoRegex.exec(string)||basicIsoRegex.exec(string),allowTime,dateFormat,timeFormat,tzFormat;if(match){getParsingFlags(config).iso=true;for(i=0,l=isoDates.length;i<l;i++){if(isoDates[i][1].exec(match[1])){dateFormat=isoDates[i][0];allowTime=isoDates[i][2]!==false;break;}}if(dateFormat==null){config._isValid=false;return;}if(match[3]){for(i=0,l=isoTimes.length;i<l;i++){if(isoTimes[i][1].exec(match[3])){ // match[2] should be 'T' or space
	timeFormat=(match[2]||' ')+isoTimes[i][0];break;}}if(timeFormat==null){config._isValid=false;return;}}if(!allowTime&&timeFormat!=null){config._isValid=false;return;}if(match[4]){if(tzRegex.exec(match[4])){tzFormat='Z';}else {config._isValid=false;return;}}config._f=dateFormat+(timeFormat||'')+(tzFormat||'');configFromStringAndFormat(config);}else {config._isValid=false;}} // date from iso format or fallback
	function configFromString(config){var matched=aspNetJsonRegex.exec(config._i);if(matched!==null){config._d=new Date(+matched[1]);return;}configFromISO(config);if(config._isValid===false){delete config._isValid;utils_hooks__hooks.createFromInputFallback(config);}}utils_hooks__hooks.createFromInputFallback=deprecate('moment construction falls back to js Date. This is '+'discouraged and will be removed in upcoming major '+'release. Please refer to '+'https://github.com/moment/moment/issues/1407 for more info.',function(config){config._d=new Date(config._i+(config._useUTC?' UTC':''));});function createDate(y,m,d,h,M,s,ms){ //can't just apply() to create a date:
	//http://stackoverflow.com/questions/181348/instantiating-a-javascript-object-by-calling-prototype-constructor-apply
	var date=new Date(y,m,d,h,M,s,ms); //the date constructor remaps years 0-99 to 1900-1999
	if(y<100&&y>=0&&isFinite(date.getFullYear())){date.setFullYear(y);}return date;}function createUTCDate(y){var date=new Date(Date.UTC.apply(null,arguments)); //the Date.UTC function remaps years 0-99 to 1900-1999
	if(y<100&&y>=0&&isFinite(date.getUTCFullYear())){date.setUTCFullYear(y);}return date;} // FORMATTING
	addFormatToken('Y',0,0,function(){var y=this.year();return y<=9999?''+y:'+'+y;});addFormatToken(0,['YY',2],0,function(){return this.year()%100;});addFormatToken(0,['YYYY',4],0,'year');addFormatToken(0,['YYYYY',5],0,'year');addFormatToken(0,['YYYYYY',6,true],0,'year'); // ALIASES
	addUnitAlias('year','y'); // PARSING
	addRegexToken('Y',matchSigned);addRegexToken('YY',match1to2,match2);addRegexToken('YYYY',match1to4,match4);addRegexToken('YYYYY',match1to6,match6);addRegexToken('YYYYYY',match1to6,match6);addParseToken(['YYYYY','YYYYYY'],YEAR);addParseToken('YYYY',function(input,array){array[YEAR]=input.length===2?utils_hooks__hooks.parseTwoDigitYear(input):toInt(input);});addParseToken('YY',function(input,array){array[YEAR]=utils_hooks__hooks.parseTwoDigitYear(input);});addParseToken('Y',function(input,array){array[YEAR]=parseInt(input,10);}); // HELPERS
	function daysInYear(year){return isLeapYear(year)?366:365;}function isLeapYear(year){return year%4===0&&year%100!==0||year%400===0;} // HOOKS
	utils_hooks__hooks.parseTwoDigitYear=function(input){return toInt(input)+(toInt(input)>68?1900:2000);}; // MOMENTS
	var getSetYear=makeGetSet('FullYear',false);function getIsLeapYear(){return isLeapYear(this.year());} // start-of-first-week - start-of-year
	function firstWeekOffset(year,dow,doy){var  // first-week day -- which january is always in the first week (4 for iso, 1 for other)
	fwd=7+dow-doy, // first-week day local weekday -- which local weekday is fwd
	fwdlw=(7+createUTCDate(year,0,fwd).getUTCDay()-dow)%7;return -fwdlw+fwd-1;} //http://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
	function dayOfYearFromWeeks(year,week,weekday,dow,doy){var localWeekday=(7+weekday-dow)%7,weekOffset=firstWeekOffset(year,dow,doy),dayOfYear=1+7*(week-1)+localWeekday+weekOffset,resYear,resDayOfYear;if(dayOfYear<=0){resYear=year-1;resDayOfYear=daysInYear(resYear)+dayOfYear;}else if(dayOfYear>daysInYear(year)){resYear=year+1;resDayOfYear=dayOfYear-daysInYear(year);}else {resYear=year;resDayOfYear=dayOfYear;}return {year:resYear,dayOfYear:resDayOfYear};}function weekOfYear(mom,dow,doy){var weekOffset=firstWeekOffset(mom.year(),dow,doy),week=Math.floor((mom.dayOfYear()-weekOffset-1)/7)+1,resWeek,resYear;if(week<1){resYear=mom.year()-1;resWeek=week+weeksInYear(resYear,dow,doy);}else if(week>weeksInYear(mom.year(),dow,doy)){resWeek=week-weeksInYear(mom.year(),dow,doy);resYear=mom.year()+1;}else {resYear=mom.year();resWeek=week;}return {week:resWeek,year:resYear};}function weeksInYear(year,dow,doy){var weekOffset=firstWeekOffset(year,dow,doy),weekOffsetNext=firstWeekOffset(year+1,dow,doy);return (daysInYear(year)-weekOffset+weekOffsetNext)/7;} // Pick the first defined of two or three arguments.
	function defaults(a,b,c){if(a!=null){return a;}if(b!=null){return b;}return c;}function currentDateArray(config){ // hooks is actually the exported moment object
	var nowValue=new Date(utils_hooks__hooks.now());if(config._useUTC){return [nowValue.getUTCFullYear(),nowValue.getUTCMonth(),nowValue.getUTCDate()];}return [nowValue.getFullYear(),nowValue.getMonth(),nowValue.getDate()];} // convert an array to a date.
	// the array should mirror the parameters below
	// note: all values past the year are optional and will default to the lowest possible value.
	// [year, month, day , hour, minute, second, millisecond]
	function configFromArray(config){var i,date,input=[],currentDate,yearToUse;if(config._d){return;}currentDate=currentDateArray(config); //compute day of the year from weeks and weekdays
	if(config._w&&config._a[DATE]==null&&config._a[MONTH]==null){dayOfYearFromWeekInfo(config);} //if the day of the year is set, figure out what it is
	if(config._dayOfYear){yearToUse=defaults(config._a[YEAR],currentDate[YEAR]);if(config._dayOfYear>daysInYear(yearToUse)){getParsingFlags(config)._overflowDayOfYear=true;}date=createUTCDate(yearToUse,0,config._dayOfYear);config._a[MONTH]=date.getUTCMonth();config._a[DATE]=date.getUTCDate();} // Default to current date.
	// * if no year, month, day of month are given, default to today
	// * if day of month is given, default month and year
	// * if month is given, default only year
	// * if year is given, don't default anything
	for(i=0;i<3&&config._a[i]==null;++i){config._a[i]=input[i]=currentDate[i];} // Zero out whatever was not defaulted, including time
	for(;i<7;i++){config._a[i]=input[i]=config._a[i]==null?i===2?1:0:config._a[i];} // Check for 24:00:00.000
	if(config._a[HOUR]===24&&config._a[MINUTE]===0&&config._a[SECOND]===0&&config._a[MILLISECOND]===0){config._nextDay=true;config._a[HOUR]=0;}config._d=(config._useUTC?createUTCDate:createDate).apply(null,input); // Apply timezone offset from input. The actual utcOffset can be changed
	// with parseZone.
	if(config._tzm!=null){config._d.setUTCMinutes(config._d.getUTCMinutes()-config._tzm);}if(config._nextDay){config._a[HOUR]=24;}}function dayOfYearFromWeekInfo(config){var w,weekYear,week,weekday,dow,doy,temp,weekdayOverflow;w=config._w;if(w.GG!=null||w.W!=null||w.E!=null){dow=1;doy=4; // TODO: We need to take the current isoWeekYear, but that depends on
	// how we interpret now (local, utc, fixed offset). So create
	// a now version of current config (take local/utc/offset flags, and
	// create now).
	weekYear=defaults(w.GG,config._a[YEAR],weekOfYear(local__createLocal(),1,4).year);week=defaults(w.W,1);weekday=defaults(w.E,1);if(weekday<1||weekday>7){weekdayOverflow=true;}}else {dow=config._locale._week.dow;doy=config._locale._week.doy;weekYear=defaults(w.gg,config._a[YEAR],weekOfYear(local__createLocal(),dow,doy).year);week=defaults(w.w,1);if(w.d!=null){ // weekday -- low day numbers are considered next week
	weekday=w.d;if(weekday<0||weekday>6){weekdayOverflow=true;}}else if(w.e!=null){ // local weekday -- counting starts from begining of week
	weekday=w.e+dow;if(w.e<0||w.e>6){weekdayOverflow=true;}}else { // default to begining of week
	weekday=dow;}}if(week<1||week>weeksInYear(weekYear,dow,doy)){getParsingFlags(config)._overflowWeeks=true;}else if(weekdayOverflow!=null){getParsingFlags(config)._overflowWeekday=true;}else {temp=dayOfYearFromWeeks(weekYear,week,weekday,dow,doy);config._a[YEAR]=temp.year;config._dayOfYear=temp.dayOfYear;}} // constant that refers to the ISO standard
	utils_hooks__hooks.ISO_8601=function(){}; // date from string and format string
	function configFromStringAndFormat(config){ // TODO: Move this to another part of the creation flow to prevent circular deps
	if(config._f===utils_hooks__hooks.ISO_8601){configFromISO(config);return;}config._a=[];getParsingFlags(config).empty=true; // This array is used to make a Date, either with `new Date` or `Date.UTC`
	var string=''+config._i,i,parsedInput,tokens,token,skipped,stringLength=string.length,totalParsedInputLength=0;tokens=expandFormat(config._f,config._locale).match(formattingTokens)||[];for(i=0;i<tokens.length;i++){token=tokens[i];parsedInput=(string.match(getParseRegexForToken(token,config))||[])[0]; // console.log('token', token, 'parsedInput', parsedInput,
	//         'regex', getParseRegexForToken(token, config));
	if(parsedInput){skipped=string.substr(0,string.indexOf(parsedInput));if(skipped.length>0){getParsingFlags(config).unusedInput.push(skipped);}string=string.slice(string.indexOf(parsedInput)+parsedInput.length);totalParsedInputLength+=parsedInput.length;} // don't parse if it's not a known token
	if(formatTokenFunctions[token]){if(parsedInput){getParsingFlags(config).empty=false;}else {getParsingFlags(config).unusedTokens.push(token);}addTimeToArrayFromToken(token,parsedInput,config);}else if(config._strict&&!parsedInput){getParsingFlags(config).unusedTokens.push(token);}} // add remaining unparsed input length to the string
	getParsingFlags(config).charsLeftOver=stringLength-totalParsedInputLength;if(string.length>0){getParsingFlags(config).unusedInput.push(string);} // clear _12h flag if hour is <= 12
	if(getParsingFlags(config).bigHour===true&&config._a[HOUR]<=12&&config._a[HOUR]>0){getParsingFlags(config).bigHour=undefined;} // handle meridiem
	config._a[HOUR]=meridiemFixWrap(config._locale,config._a[HOUR],config._meridiem);configFromArray(config);checkOverflow(config);}function meridiemFixWrap(locale,hour,meridiem){var isPm;if(meridiem==null){ // nothing to do
	return hour;}if(locale.meridiemHour!=null){return locale.meridiemHour(hour,meridiem);}else if(locale.isPM!=null){ // Fallback
	isPm=locale.isPM(meridiem);if(isPm&&hour<12){hour+=12;}if(!isPm&&hour===12){hour=0;}return hour;}else { // this is not supposed to happen
	return hour;}} // date from string and array of format strings
	function configFromStringAndArray(config){var tempConfig,bestMoment,scoreToBeat,i,currentScore;if(config._f.length===0){getParsingFlags(config).invalidFormat=true;config._d=new Date(NaN);return;}for(i=0;i<config._f.length;i++){currentScore=0;tempConfig=copyConfig({},config);if(config._useUTC!=null){tempConfig._useUTC=config._useUTC;}tempConfig._f=config._f[i];configFromStringAndFormat(tempConfig);if(!valid__isValid(tempConfig)){continue;} // if there is any input that was not parsed add a penalty for that format
	currentScore+=getParsingFlags(tempConfig).charsLeftOver; //or tokens
	currentScore+=getParsingFlags(tempConfig).unusedTokens.length*10;getParsingFlags(tempConfig).score=currentScore;if(scoreToBeat==null||currentScore<scoreToBeat){scoreToBeat=currentScore;bestMoment=tempConfig;}}extend(config,bestMoment||tempConfig);}function configFromObject(config){if(config._d){return;}var i=normalizeObjectUnits(config._i);config._a=map([i.year,i.month,i.day||i.date,i.hour,i.minute,i.second,i.millisecond],function(obj){return obj&&parseInt(obj,10);});configFromArray(config);}function createFromConfig(config){var res=new Moment(checkOverflow(prepareConfig(config)));if(res._nextDay){ // Adding is smart enough around DST
	res.add(1,'d');res._nextDay=undefined;}return res;}function prepareConfig(config){var input=config._i,format=config._f;config._locale=config._locale||locale_locales__getLocale(config._l);if(input===null||format===undefined&&input===''){return valid__createInvalid({nullInput:true});}if(typeof input==='string'){config._i=input=config._locale.preparse(input);}if(isMoment(input)){return new Moment(checkOverflow(input));}else if(isArray(format)){configFromStringAndArray(config);}else if(format){configFromStringAndFormat(config);}else if(isDate(input)){config._d=input;}else {configFromInput(config);}if(!valid__isValid(config)){config._d=null;}return config;}function configFromInput(config){var input=config._i;if(input===undefined){config._d=new Date(utils_hooks__hooks.now());}else if(isDate(input)){config._d=new Date(+input);}else if(typeof input==='string'){configFromString(config);}else if(isArray(input)){config._a=map(input.slice(0),function(obj){return parseInt(obj,10);});configFromArray(config);}else if((typeof input==='undefined'?'undefined':_typeof(input))==='object'){configFromObject(config);}else if(typeof input==='number'){ // from milliseconds
	config._d=new Date(input);}else {utils_hooks__hooks.createFromInputFallback(config);}}function createLocalOrUTC(input,format,locale,strict,isUTC){var c={};if(typeof locale==='boolean'){strict=locale;locale=undefined;} // object construction must be done this way.
	// https://github.com/moment/moment/issues/1423
	c._isAMomentObject=true;c._useUTC=c._isUTC=isUTC;c._l=locale;c._i=input;c._f=format;c._strict=strict;return createFromConfig(c);}function local__createLocal(input,format,locale,strict){return createLocalOrUTC(input,format,locale,strict,false);}var prototypeMin=deprecate('moment().min is deprecated, use moment.min instead. https://github.com/moment/moment/issues/1548',function(){var other=local__createLocal.apply(null,arguments);if(this.isValid()&&other.isValid()){return other<this?this:other;}else {return valid__createInvalid();}});var prototypeMax=deprecate('moment().max is deprecated, use moment.max instead. https://github.com/moment/moment/issues/1548',function(){var other=local__createLocal.apply(null,arguments);if(this.isValid()&&other.isValid()){return other>this?this:other;}else {return valid__createInvalid();}}); // Pick a moment m from moments so that m[fn](other) is true for all
	// other. This relies on the function fn to be transitive.
	//
	// moments should either be an array of moment objects or an array, whose
	// first element is an array of moment objects.
	function pickBy(fn,moments){var res,i;if(moments.length===1&&isArray(moments[0])){moments=moments[0];}if(!moments.length){return local__createLocal();}res=moments[0];for(i=1;i<moments.length;++i){if(!moments[i].isValid()||moments[i][fn](res)){res=moments[i];}}return res;} // TODO: Use [].sort instead?
	function min(){var args=[].slice.call(arguments,0);return pickBy('isBefore',args);}function max(){var args=[].slice.call(arguments,0);return pickBy('isAfter',args);}var now=function now(){return Date.now?Date.now():+new Date();};function Duration(duration){var normalizedInput=normalizeObjectUnits(duration),years=normalizedInput.year||0,quarters=normalizedInput.quarter||0,months=normalizedInput.month||0,weeks=normalizedInput.week||0,days=normalizedInput.day||0,hours=normalizedInput.hour||0,minutes=normalizedInput.minute||0,seconds=normalizedInput.second||0,milliseconds=normalizedInput.millisecond||0; // representation for dateAddRemove
	this._milliseconds=+milliseconds+seconds*1e3+ // 1000
	minutes*6e4+ // 1000 * 60
	hours*36e5; // 1000 * 60 * 60
	// Because of dateAddRemove treats 24 hours as different from a
	// day when working around DST, we need to store them separately
	this._days=+days+weeks*7; // It is impossible translate months into days without knowing
	// which months you are are talking about, so we have to store
	// it separately.
	this._months=+months+quarters*3+years*12;this._data={};this._locale=locale_locales__getLocale();this._bubble();}function isDuration(obj){return obj instanceof Duration;} // FORMATTING
	function offset(token,separator){addFormatToken(token,0,0,function(){var offset=this.utcOffset();var sign='+';if(offset<0){offset=-offset;sign='-';}return sign+zeroFill(~ ~(offset/60),2)+separator+zeroFill(~ ~offset%60,2);});}offset('Z',':');offset('ZZ',''); // PARSING
	addRegexToken('Z',matchShortOffset);addRegexToken('ZZ',matchShortOffset);addParseToken(['Z','ZZ'],function(input,array,config){config._useUTC=true;config._tzm=offsetFromString(matchShortOffset,input);}); // HELPERS
	// timezone chunker
	// '+10:00' > ['10',  '00']
	// '-1530'  > ['-15', '30']
	var chunkOffset=/([\+\-]|\d\d)/gi;function offsetFromString(matcher,string){var matches=(string||'').match(matcher)||[];var chunk=matches[matches.length-1]||[];var parts=(chunk+'').match(chunkOffset)||['-',0,0];var minutes=+(parts[1]*60)+toInt(parts[2]);return parts[0]==='+'?minutes:-minutes;} // Return a moment from input, that is local/utc/zone equivalent to model.
	function cloneWithOffset(input,model){var res,diff;if(model._isUTC){res=model.clone();diff=(isMoment(input)||isDate(input)?+input:+local__createLocal(input))-+res; // Use low-level api, because this fn is low-level api.
	res._d.setTime(+res._d+diff);utils_hooks__hooks.updateOffset(res,false);return res;}else {return local__createLocal(input).local();}}function getDateOffset(m){ // On Firefox.24 Date#getTimezoneOffset returns a floating point.
	// https://github.com/moment/moment/pull/1871
	return -Math.round(m._d.getTimezoneOffset()/15)*15;} // HOOKS
	// This function will be called whenever a moment is mutated.
	// It is intended to keep the offset in sync with the timezone.
	utils_hooks__hooks.updateOffset=function(){}; // MOMENTS
	// keepLocalTime = true means only change the timezone, without
	// affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->
	// 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset
	// +0200, so we adjust the time as needed, to be valid.
	//
	// Keeping the time actually adds/subtracts (one hour)
	// from the actual represented time. That is why we call updateOffset
	// a second time. In case it wants us to change the offset again
	// _changeInProgress == true case, then we have to adjust, because
	// there is no such time in the given timezone.
	function getSetOffset(input,keepLocalTime){var offset=this._offset||0,localAdjust;if(!this.isValid()){return input!=null?this:NaN;}if(input!=null){if(typeof input==='string'){input=offsetFromString(matchShortOffset,input);}else if(Math.abs(input)<16){input=input*60;}if(!this._isUTC&&keepLocalTime){localAdjust=getDateOffset(this);}this._offset=input;this._isUTC=true;if(localAdjust!=null){this.add(localAdjust,'m');}if(offset!==input){if(!keepLocalTime||this._changeInProgress){add_subtract__addSubtract(this,create__createDuration(input-offset,'m'),1,false);}else if(!this._changeInProgress){this._changeInProgress=true;utils_hooks__hooks.updateOffset(this,true);this._changeInProgress=null;}}return this;}else {return this._isUTC?offset:getDateOffset(this);}}function getSetZone(input,keepLocalTime){if(input!=null){if(typeof input!=='string'){input=-input;}this.utcOffset(input,keepLocalTime);return this;}else {return -this.utcOffset();}}function setOffsetToUTC(keepLocalTime){return this.utcOffset(0,keepLocalTime);}function setOffsetToLocal(keepLocalTime){if(this._isUTC){this.utcOffset(0,keepLocalTime);this._isUTC=false;if(keepLocalTime){this.subtract(getDateOffset(this),'m');}}return this;}function setOffsetToParsedOffset(){if(this._tzm){this.utcOffset(this._tzm);}else if(typeof this._i==='string'){this.utcOffset(offsetFromString(matchOffset,this._i));}return this;}function hasAlignedHourOffset(input){if(!this.isValid()){return false;}input=input?local__createLocal(input).utcOffset():0;return (this.utcOffset()-input)%60===0;}function isDaylightSavingTime(){return this.utcOffset()>this.clone().month(0).utcOffset()||this.utcOffset()>this.clone().month(5).utcOffset();}function isDaylightSavingTimeShifted(){if(!isUndefined(this._isDSTShifted)){return this._isDSTShifted;}var c={};copyConfig(c,this);c=prepareConfig(c);if(c._a){var other=c._isUTC?create_utc__createUTC(c._a):local__createLocal(c._a);this._isDSTShifted=this.isValid()&&compareArrays(c._a,other.toArray())>0;}else {this._isDSTShifted=false;}return this._isDSTShifted;}function isLocal(){return this.isValid()?!this._isUTC:false;}function isUtcOffset(){return this.isValid()?this._isUTC:false;}function isUtc(){return this.isValid()?this._isUTC&&this._offset===0:false;} // ASP.NET json date format regex
	var aspNetRegex=/^(\-)?(?:(\d*)[. ])?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?\d*)?$/; // from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
	// somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
	var isoRegex=/^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/;function create__createDuration(input,key){var duration=input, // matching against regexp is expensive, do it on demand
	match=null,sign,ret,diffRes;if(isDuration(input)){duration={ms:input._milliseconds,d:input._days,M:input._months};}else if(typeof input==='number'){duration={};if(key){duration[key]=input;}else {duration.milliseconds=input;}}else if(!!(match=aspNetRegex.exec(input))){sign=match[1]==='-'?-1:1;duration={y:0,d:toInt(match[DATE])*sign,h:toInt(match[HOUR])*sign,m:toInt(match[MINUTE])*sign,s:toInt(match[SECOND])*sign,ms:toInt(match[MILLISECOND])*sign};}else if(!!(match=isoRegex.exec(input))){sign=match[1]==='-'?-1:1;duration={y:parseIso(match[2],sign),M:parseIso(match[3],sign),d:parseIso(match[4],sign),h:parseIso(match[5],sign),m:parseIso(match[6],sign),s:parseIso(match[7],sign),w:parseIso(match[8],sign)};}else if(duration==null){ // checks for null or undefined
	duration={};}else if((typeof duration==='undefined'?'undefined':_typeof(duration))==='object'&&('from' in duration||'to' in duration)){diffRes=momentsDifference(local__createLocal(duration.from),local__createLocal(duration.to));duration={};duration.ms=diffRes.milliseconds;duration.M=diffRes.months;}ret=new Duration(duration);if(isDuration(input)&&hasOwnProp(input,'_locale')){ret._locale=input._locale;}return ret;}create__createDuration.fn=Duration.prototype;function parseIso(inp,sign){ // We'd normally use ~~inp for this, but unfortunately it also
	// converts floats to ints.
	// inp may be undefined, so careful calling replace on it.
	var res=inp&&parseFloat(inp.replace(',','.')); // apply sign while we're at it
	return (isNaN(res)?0:res)*sign;}function positiveMomentsDifference(base,other){var res={milliseconds:0,months:0};res.months=other.month()-base.month()+(other.year()-base.year())*12;if(base.clone().add(res.months,'M').isAfter(other)){--res.months;}res.milliseconds=+other-+base.clone().add(res.months,'M');return res;}function momentsDifference(base,other){var res;if(!(base.isValid()&&other.isValid())){return {milliseconds:0,months:0};}other=cloneWithOffset(other,base);if(base.isBefore(other)){res=positiveMomentsDifference(base,other);}else {res=positiveMomentsDifference(other,base);res.milliseconds=-res.milliseconds;res.months=-res.months;}return res;} // TODO: remove 'name' arg after deprecation is removed
	function createAdder(direction,name){return function(val,period){var dur,tmp; //invert the arguments, but complain about it
	if(period!==null&&!isNaN(+period)){deprecateSimple(name,'moment().'+name+'(period, number) is deprecated. Please use moment().'+name+'(number, period).');tmp=val;val=period;period=tmp;}val=typeof val==='string'?+val:val;dur=create__createDuration(val,period);add_subtract__addSubtract(this,dur,direction);return this;};}function add_subtract__addSubtract(mom,duration,isAdding,updateOffset){var milliseconds=duration._milliseconds,days=duration._days,months=duration._months;if(!mom.isValid()){ // No op
	return;}updateOffset=updateOffset==null?true:updateOffset;if(milliseconds){mom._d.setTime(+mom._d+milliseconds*isAdding);}if(days){get_set__set(mom,'Date',get_set__get(mom,'Date')+days*isAdding);}if(months){setMonth(mom,get_set__get(mom,'Month')+months*isAdding);}if(updateOffset){utils_hooks__hooks.updateOffset(mom,days||months);}}var add_subtract__add=createAdder(1,'add');var add_subtract__subtract=createAdder(-1,'subtract');function moment_calendar__calendar(time,formats){ // We want to compare the start of today, vs this.
	// Getting start-of-today depends on whether we're local/utc/offset or not.
	var now=time||local__createLocal(),sod=cloneWithOffset(now,this).startOf('day'),diff=this.diff(sod,'days',true),format=diff<-6?'sameElse':diff<-1?'lastWeek':diff<0?'lastDay':diff<1?'sameDay':diff<2?'nextDay':diff<7?'nextWeek':'sameElse';var output=formats&&(isFunction(formats[format])?formats[format]():formats[format]);return this.format(output||this.localeData().calendar(format,this,local__createLocal(now)));}function clone(){return new Moment(this);}function isAfter(input,units){var localInput=isMoment(input)?input:local__createLocal(input);if(!(this.isValid()&&localInput.isValid())){return false;}units=normalizeUnits(!isUndefined(units)?units:'millisecond');if(units==='millisecond'){return +this>+localInput;}else {return +localInput<+this.clone().startOf(units);}}function isBefore(input,units){var localInput=isMoment(input)?input:local__createLocal(input);if(!(this.isValid()&&localInput.isValid())){return false;}units=normalizeUnits(!isUndefined(units)?units:'millisecond');if(units==='millisecond'){return +this<+localInput;}else {return +this.clone().endOf(units)<+localInput;}}function isBetween(from,to,units){return this.isAfter(from,units)&&this.isBefore(to,units);}function isSame(input,units){var localInput=isMoment(input)?input:local__createLocal(input),inputMs;if(!(this.isValid()&&localInput.isValid())){return false;}units=normalizeUnits(units||'millisecond');if(units==='millisecond'){return +this===+localInput;}else {inputMs=+localInput;return +this.clone().startOf(units)<=inputMs&&inputMs<=+this.clone().endOf(units);}}function isSameOrAfter(input,units){return this.isSame(input,units)||this.isAfter(input,units);}function isSameOrBefore(input,units){return this.isSame(input,units)||this.isBefore(input,units);}function diff(input,units,asFloat){var that,zoneDelta,delta,output;if(!this.isValid()){return NaN;}that=cloneWithOffset(input,this);if(!that.isValid()){return NaN;}zoneDelta=(that.utcOffset()-this.utcOffset())*6e4;units=normalizeUnits(units);if(units==='year'||units==='month'||units==='quarter'){output=monthDiff(this,that);if(units==='quarter'){output=output/3;}else if(units==='year'){output=output/12;}}else {delta=this-that;output=units==='second'?delta/1e3: // 1000
	units==='minute'?delta/6e4: // 1000 * 60
	units==='hour'?delta/36e5: // 1000 * 60 * 60
	units==='day'?(delta-zoneDelta)/864e5: // 1000 * 60 * 60 * 24, negate dst
	units==='week'?(delta-zoneDelta)/6048e5: // 1000 * 60 * 60 * 24 * 7, negate dst
	delta;}return asFloat?output:absFloor(output);}function monthDiff(a,b){ // difference in months
	var wholeMonthDiff=(b.year()-a.year())*12+(b.month()-a.month()), // b is in (anchor - 1 month, anchor + 1 month)
	anchor=a.clone().add(wholeMonthDiff,'months'),anchor2,adjust;if(b-anchor<0){anchor2=a.clone().add(wholeMonthDiff-1,'months'); // linear across the month
	adjust=(b-anchor)/(anchor-anchor2);}else {anchor2=a.clone().add(wholeMonthDiff+1,'months'); // linear across the month
	adjust=(b-anchor)/(anchor2-anchor);}return -(wholeMonthDiff+adjust);}utils_hooks__hooks.defaultFormat='YYYY-MM-DDTHH:mm:ssZ';function toString(){return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');}function moment_format__toISOString(){var m=this.clone().utc();if(0<m.year()&&m.year()<=9999){if(isFunction(Date.prototype.toISOString)){ // native implementation is ~50x faster, use it when we can
	return this.toDate().toISOString();}else {return formatMoment(m,'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');}}else {return formatMoment(m,'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]');}}function format(inputString){var output=formatMoment(this,inputString||utils_hooks__hooks.defaultFormat);return this.localeData().postformat(output);}function from(time,withoutSuffix){if(this.isValid()&&(isMoment(time)&&time.isValid()||local__createLocal(time).isValid())){return create__createDuration({to:this,from:time}).locale(this.locale()).humanize(!withoutSuffix);}else {return this.localeData().invalidDate();}}function fromNow(withoutSuffix){return this.from(local__createLocal(),withoutSuffix);}function to(time,withoutSuffix){if(this.isValid()&&(isMoment(time)&&time.isValid()||local__createLocal(time).isValid())){return create__createDuration({from:this,to:time}).locale(this.locale()).humanize(!withoutSuffix);}else {return this.localeData().invalidDate();}}function toNow(withoutSuffix){return this.to(local__createLocal(),withoutSuffix);} // If passed a locale key, it will set the locale for this
	// instance.  Otherwise, it will return the locale configuration
	// variables for this instance.
	function locale(key){var newLocaleData;if(key===undefined){return this._locale._abbr;}else {newLocaleData=locale_locales__getLocale(key);if(newLocaleData!=null){this._locale=newLocaleData;}return this;}}var lang=deprecate('moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',function(key){if(key===undefined){return this.localeData();}else {return this.locale(key);}});function localeData(){return this._locale;}function startOf(units){units=normalizeUnits(units); // the following switch intentionally omits break keywords
	// to utilize falling through the cases.
	switch(units){case 'year':this.month(0); /* falls through */case 'quarter':case 'month':this.date(1); /* falls through */case 'week':case 'isoWeek':case 'day':this.hours(0); /* falls through */case 'hour':this.minutes(0); /* falls through */case 'minute':this.seconds(0); /* falls through */case 'second':this.milliseconds(0);} // weeks are a special case
	if(units==='week'){this.weekday(0);}if(units==='isoWeek'){this.isoWeekday(1);} // quarters are also special
	if(units==='quarter'){this.month(Math.floor(this.month()/3)*3);}return this;}function endOf(units){units=normalizeUnits(units);if(units===undefined||units==='millisecond'){return this;}return this.startOf(units).add(1,units==='isoWeek'?'week':units).subtract(1,'ms');}function to_type__valueOf(){return +this._d-(this._offset||0)*60000;}function unix(){return Math.floor(+this/1000);}function toDate(){return this._offset?new Date(+this):this._d;}function toArray(){var m=this;return [m.year(),m.month(),m.date(),m.hour(),m.minute(),m.second(),m.millisecond()];}function toObject(){var m=this;return {years:m.year(),months:m.month(),date:m.date(),hours:m.hours(),minutes:m.minutes(),seconds:m.seconds(),milliseconds:m.milliseconds()};}function toJSON(){ // JSON.stringify(new Date(NaN)) === 'null'
	return this.isValid()?this.toISOString():'null';}function moment_valid__isValid(){return valid__isValid(this);}function parsingFlags(){return extend({},getParsingFlags(this));}function invalidAt(){return getParsingFlags(this).overflow;}function creationData(){return {input:this._i,format:this._f,locale:this._locale,isUTC:this._isUTC,strict:this._strict};} // FORMATTING
	addFormatToken(0,['gg',2],0,function(){return this.weekYear()%100;});addFormatToken(0,['GG',2],0,function(){return this.isoWeekYear()%100;});function addWeekYearFormatToken(token,getter){addFormatToken(0,[token,token.length],0,getter);}addWeekYearFormatToken('gggg','weekYear');addWeekYearFormatToken('ggggg','weekYear');addWeekYearFormatToken('GGGG','isoWeekYear');addWeekYearFormatToken('GGGGG','isoWeekYear'); // ALIASES
	addUnitAlias('weekYear','gg');addUnitAlias('isoWeekYear','GG'); // PARSING
	addRegexToken('G',matchSigned);addRegexToken('g',matchSigned);addRegexToken('GG',match1to2,match2);addRegexToken('gg',match1to2,match2);addRegexToken('GGGG',match1to4,match4);addRegexToken('gggg',match1to4,match4);addRegexToken('GGGGG',match1to6,match6);addRegexToken('ggggg',match1to6,match6);addWeekParseToken(['gggg','ggggg','GGGG','GGGGG'],function(input,week,config,token){week[token.substr(0,2)]=toInt(input);});addWeekParseToken(['gg','GG'],function(input,week,config,token){week[token]=utils_hooks__hooks.parseTwoDigitYear(input);}); // MOMENTS
	function getSetWeekYear(input){return getSetWeekYearHelper.call(this,input,this.week(),this.weekday(),this.localeData()._week.dow,this.localeData()._week.doy);}function getSetISOWeekYear(input){return getSetWeekYearHelper.call(this,input,this.isoWeek(),this.isoWeekday(),1,4);}function getISOWeeksInYear(){return weeksInYear(this.year(),1,4);}function getWeeksInYear(){var weekInfo=this.localeData()._week;return weeksInYear(this.year(),weekInfo.dow,weekInfo.doy);}function getSetWeekYearHelper(input,week,weekday,dow,doy){var weeksTarget;if(input==null){return weekOfYear(this,dow,doy).year;}else {weeksTarget=weeksInYear(input,dow,doy);if(week>weeksTarget){week=weeksTarget;}return setWeekAll.call(this,input,week,weekday,dow,doy);}}function setWeekAll(weekYear,week,weekday,dow,doy){var dayOfYearData=dayOfYearFromWeeks(weekYear,week,weekday,dow,doy),date=createUTCDate(dayOfYearData.year,0,dayOfYearData.dayOfYear); // console.log("got", weekYear, week, weekday, "set", date.toISOString());
	this.year(date.getUTCFullYear());this.month(date.getUTCMonth());this.date(date.getUTCDate());return this;} // FORMATTING
	addFormatToken('Q',0,'Qo','quarter'); // ALIASES
	addUnitAlias('quarter','Q'); // PARSING
	addRegexToken('Q',match1);addParseToken('Q',function(input,array){array[MONTH]=(toInt(input)-1)*3;}); // MOMENTS
	function getSetQuarter(input){return input==null?Math.ceil((this.month()+1)/3):this.month((input-1)*3+this.month()%3);} // FORMATTING
	addFormatToken('w',['ww',2],'wo','week');addFormatToken('W',['WW',2],'Wo','isoWeek'); // ALIASES
	addUnitAlias('week','w');addUnitAlias('isoWeek','W'); // PARSING
	addRegexToken('w',match1to2);addRegexToken('ww',match1to2,match2);addRegexToken('W',match1to2);addRegexToken('WW',match1to2,match2);addWeekParseToken(['w','ww','W','WW'],function(input,week,config,token){week[token.substr(0,1)]=toInt(input);}); // HELPERS
	// LOCALES
	function localeWeek(mom){return weekOfYear(mom,this._week.dow,this._week.doy).week;}var defaultLocaleWeek={dow:0, // Sunday is the first day of the week.
	doy:6 // The week that contains Jan 1st is the first week of the year.
	};function localeFirstDayOfWeek(){return this._week.dow;}function localeFirstDayOfYear(){return this._week.doy;} // MOMENTS
	function getSetWeek(input){var week=this.localeData().week(this);return input==null?week:this.add((input-week)*7,'d');}function getSetISOWeek(input){var week=weekOfYear(this,1,4).week;return input==null?week:this.add((input-week)*7,'d');} // FORMATTING
	addFormatToken('D',['DD',2],'Do','date'); // ALIASES
	addUnitAlias('date','D'); // PARSING
	addRegexToken('D',match1to2);addRegexToken('DD',match1to2,match2);addRegexToken('Do',function(isStrict,locale){return isStrict?locale._ordinalParse:locale._ordinalParseLenient;});addParseToken(['D','DD'],DATE);addParseToken('Do',function(input,array){array[DATE]=toInt(input.match(match1to2)[0],10);}); // MOMENTS
	var getSetDayOfMonth=makeGetSet('Date',true); // FORMATTING
	addFormatToken('d',0,'do','day');addFormatToken('dd',0,0,function(format){return this.localeData().weekdaysMin(this,format);});addFormatToken('ddd',0,0,function(format){return this.localeData().weekdaysShort(this,format);});addFormatToken('dddd',0,0,function(format){return this.localeData().weekdays(this,format);});addFormatToken('e',0,0,'weekday');addFormatToken('E',0,0,'isoWeekday'); // ALIASES
	addUnitAlias('day','d');addUnitAlias('weekday','e');addUnitAlias('isoWeekday','E'); // PARSING
	addRegexToken('d',match1to2);addRegexToken('e',match1to2);addRegexToken('E',match1to2);addRegexToken('dd',matchWord);addRegexToken('ddd',matchWord);addRegexToken('dddd',matchWord);addWeekParseToken(['dd','ddd','dddd'],function(input,week,config,token){var weekday=config._locale.weekdaysParse(input,token,config._strict); // if we didn't get a weekday name, mark the date as invalid
	if(weekday!=null){week.d=weekday;}else {getParsingFlags(config).invalidWeekday=input;}});addWeekParseToken(['d','e','E'],function(input,week,config,token){week[token]=toInt(input);}); // HELPERS
	function parseWeekday(input,locale){if(typeof input!=='string'){return input;}if(!isNaN(input)){return parseInt(input,10);}input=locale.weekdaysParse(input);if(typeof input==='number'){return input;}return null;} // LOCALES
	var defaultLocaleWeekdays='Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_');function localeWeekdays(m,format){return isArray(this._weekdays)?this._weekdays[m.day()]:this._weekdays[this._weekdays.isFormat.test(format)?'format':'standalone'][m.day()];}var defaultLocaleWeekdaysShort='Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_');function localeWeekdaysShort(m){return this._weekdaysShort[m.day()];}var defaultLocaleWeekdaysMin='Su_Mo_Tu_We_Th_Fr_Sa'.split('_');function localeWeekdaysMin(m){return this._weekdaysMin[m.day()];}function localeWeekdaysParse(weekdayName,format,strict){var i,mom,regex;if(!this._weekdaysParse){this._weekdaysParse=[];this._minWeekdaysParse=[];this._shortWeekdaysParse=[];this._fullWeekdaysParse=[];}for(i=0;i<7;i++){ // make the regex if we don't have it already
	mom=local__createLocal([2000,1]).day(i);if(strict&&!this._fullWeekdaysParse[i]){this._fullWeekdaysParse[i]=new RegExp('^'+this.weekdays(mom,'').replace('.','\.?')+'$','i');this._shortWeekdaysParse[i]=new RegExp('^'+this.weekdaysShort(mom,'').replace('.','\.?')+'$','i');this._minWeekdaysParse[i]=new RegExp('^'+this.weekdaysMin(mom,'').replace('.','\.?')+'$','i');}if(!this._weekdaysParse[i]){regex='^'+this.weekdays(mom,'')+'|^'+this.weekdaysShort(mom,'')+'|^'+this.weekdaysMin(mom,'');this._weekdaysParse[i]=new RegExp(regex.replace('.',''),'i');} // test the regex
	if(strict&&format==='dddd'&&this._fullWeekdaysParse[i].test(weekdayName)){return i;}else if(strict&&format==='ddd'&&this._shortWeekdaysParse[i].test(weekdayName)){return i;}else if(strict&&format==='dd'&&this._minWeekdaysParse[i].test(weekdayName)){return i;}else if(!strict&&this._weekdaysParse[i].test(weekdayName)){return i;}}} // MOMENTS
	function getSetDayOfWeek(input){if(!this.isValid()){return input!=null?this:NaN;}var day=this._isUTC?this._d.getUTCDay():this._d.getDay();if(input!=null){input=parseWeekday(input,this.localeData());return this.add(input-day,'d');}else {return day;}}function getSetLocaleDayOfWeek(input){if(!this.isValid()){return input!=null?this:NaN;}var weekday=(this.day()+7-this.localeData()._week.dow)%7;return input==null?weekday:this.add(input-weekday,'d');}function getSetISODayOfWeek(input){if(!this.isValid()){return input!=null?this:NaN;} // behaves the same as moment#day except
	// as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
	// as a setter, sunday should belong to the previous week.
	return input==null?this.day()||7:this.day(this.day()%7?input:input-7);} // FORMATTING
	addFormatToken('DDD',['DDDD',3],'DDDo','dayOfYear'); // ALIASES
	addUnitAlias('dayOfYear','DDD'); // PARSING
	addRegexToken('DDD',match1to3);addRegexToken('DDDD',match3);addParseToken(['DDD','DDDD'],function(input,array,config){config._dayOfYear=toInt(input);}); // HELPERS
	// MOMENTS
	function getSetDayOfYear(input){var dayOfYear=Math.round((this.clone().startOf('day')-this.clone().startOf('year'))/864e5)+1;return input==null?dayOfYear:this.add(input-dayOfYear,'d');} // FORMATTING
	function hFormat(){return this.hours()%12||12;}addFormatToken('H',['HH',2],0,'hour');addFormatToken('h',['hh',2],0,hFormat);addFormatToken('hmm',0,0,function(){return ''+hFormat.apply(this)+zeroFill(this.minutes(),2);});addFormatToken('hmmss',0,0,function(){return ''+hFormat.apply(this)+zeroFill(this.minutes(),2)+zeroFill(this.seconds(),2);});addFormatToken('Hmm',0,0,function(){return ''+this.hours()+zeroFill(this.minutes(),2);});addFormatToken('Hmmss',0,0,function(){return ''+this.hours()+zeroFill(this.minutes(),2)+zeroFill(this.seconds(),2);});function meridiem(token,lowercase){addFormatToken(token,0,0,function(){return this.localeData().meridiem(this.hours(),this.minutes(),lowercase);});}meridiem('a',true);meridiem('A',false); // ALIASES
	addUnitAlias('hour','h'); // PARSING
	function matchMeridiem(isStrict,locale){return locale._meridiemParse;}addRegexToken('a',matchMeridiem);addRegexToken('A',matchMeridiem);addRegexToken('H',match1to2);addRegexToken('h',match1to2);addRegexToken('HH',match1to2,match2);addRegexToken('hh',match1to2,match2);addRegexToken('hmm',match3to4);addRegexToken('hmmss',match5to6);addRegexToken('Hmm',match3to4);addRegexToken('Hmmss',match5to6);addParseToken(['H','HH'],HOUR);addParseToken(['a','A'],function(input,array,config){config._isPm=config._locale.isPM(input);config._meridiem=input;});addParseToken(['h','hh'],function(input,array,config){array[HOUR]=toInt(input);getParsingFlags(config).bigHour=true;});addParseToken('hmm',function(input,array,config){var pos=input.length-2;array[HOUR]=toInt(input.substr(0,pos));array[MINUTE]=toInt(input.substr(pos));getParsingFlags(config).bigHour=true;});addParseToken('hmmss',function(input,array,config){var pos1=input.length-4;var pos2=input.length-2;array[HOUR]=toInt(input.substr(0,pos1));array[MINUTE]=toInt(input.substr(pos1,2));array[SECOND]=toInt(input.substr(pos2));getParsingFlags(config).bigHour=true;});addParseToken('Hmm',function(input,array,config){var pos=input.length-2;array[HOUR]=toInt(input.substr(0,pos));array[MINUTE]=toInt(input.substr(pos));});addParseToken('Hmmss',function(input,array,config){var pos1=input.length-4;var pos2=input.length-2;array[HOUR]=toInt(input.substr(0,pos1));array[MINUTE]=toInt(input.substr(pos1,2));array[SECOND]=toInt(input.substr(pos2));}); // LOCALES
	function localeIsPM(input){ // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
	// Using charAt should be more compatible.
	return (input+'').toLowerCase().charAt(0)==='p';}var defaultLocaleMeridiemParse=/[ap]\.?m?\.?/i;function localeMeridiem(hours,minutes,isLower){if(hours>11){return isLower?'pm':'PM';}else {return isLower?'am':'AM';}} // MOMENTS
	// Setting the hour should keep the time, because the user explicitly
	// specified which hour he wants. So trying to maintain the same hour (in
	// a new timezone) makes sense. Adding/subtracting hours does not follow
	// this rule.
	var getSetHour=makeGetSet('Hours',true); // FORMATTING
	addFormatToken('m',['mm',2],0,'minute'); // ALIASES
	addUnitAlias('minute','m'); // PARSING
	addRegexToken('m',match1to2);addRegexToken('mm',match1to2,match2);addParseToken(['m','mm'],MINUTE); // MOMENTS
	var getSetMinute=makeGetSet('Minutes',false); // FORMATTING
	addFormatToken('s',['ss',2],0,'second'); // ALIASES
	addUnitAlias('second','s'); // PARSING
	addRegexToken('s',match1to2);addRegexToken('ss',match1to2,match2);addParseToken(['s','ss'],SECOND); // MOMENTS
	var getSetSecond=makeGetSet('Seconds',false); // FORMATTING
	addFormatToken('S',0,0,function(){return ~ ~(this.millisecond()/100);});addFormatToken(0,['SS',2],0,function(){return ~ ~(this.millisecond()/10);});addFormatToken(0,['SSS',3],0,'millisecond');addFormatToken(0,['SSSS',4],0,function(){return this.millisecond()*10;});addFormatToken(0,['SSSSS',5],0,function(){return this.millisecond()*100;});addFormatToken(0,['SSSSSS',6],0,function(){return this.millisecond()*1000;});addFormatToken(0,['SSSSSSS',7],0,function(){return this.millisecond()*10000;});addFormatToken(0,['SSSSSSSS',8],0,function(){return this.millisecond()*100000;});addFormatToken(0,['SSSSSSSSS',9],0,function(){return this.millisecond()*1000000;}); // ALIASES
	addUnitAlias('millisecond','ms'); // PARSING
	addRegexToken('S',match1to3,match1);addRegexToken('SS',match1to3,match2);addRegexToken('SSS',match1to3,match3);var token;for(token='SSSS';token.length<=9;token+='S'){addRegexToken(token,matchUnsigned);}function parseMs(input,array){array[MILLISECOND]=toInt(('0.'+input)*1000);}for(token='S';token.length<=9;token+='S'){addParseToken(token,parseMs);} // MOMENTS
	var getSetMillisecond=makeGetSet('Milliseconds',false); // FORMATTING
	addFormatToken('z',0,0,'zoneAbbr');addFormatToken('zz',0,0,'zoneName'); // MOMENTS
	function getZoneAbbr(){return this._isUTC?'UTC':'';}function getZoneName(){return this._isUTC?'Coordinated Universal Time':'';}var momentPrototype__proto=Moment.prototype;momentPrototype__proto.add=add_subtract__add;momentPrototype__proto.calendar=moment_calendar__calendar;momentPrototype__proto.clone=clone;momentPrototype__proto.diff=diff;momentPrototype__proto.endOf=endOf;momentPrototype__proto.format=format;momentPrototype__proto.from=from;momentPrototype__proto.fromNow=fromNow;momentPrototype__proto.to=to;momentPrototype__proto.toNow=toNow;momentPrototype__proto.get=getSet;momentPrototype__proto.invalidAt=invalidAt;momentPrototype__proto.isAfter=isAfter;momentPrototype__proto.isBefore=isBefore;momentPrototype__proto.isBetween=isBetween;momentPrototype__proto.isSame=isSame;momentPrototype__proto.isSameOrAfter=isSameOrAfter;momentPrototype__proto.isSameOrBefore=isSameOrBefore;momentPrototype__proto.isValid=moment_valid__isValid;momentPrototype__proto.lang=lang;momentPrototype__proto.locale=locale;momentPrototype__proto.localeData=localeData;momentPrototype__proto.max=prototypeMax;momentPrototype__proto.min=prototypeMin;momentPrototype__proto.parsingFlags=parsingFlags;momentPrototype__proto.set=getSet;momentPrototype__proto.startOf=startOf;momentPrototype__proto.subtract=add_subtract__subtract;momentPrototype__proto.toArray=toArray;momentPrototype__proto.toObject=toObject;momentPrototype__proto.toDate=toDate;momentPrototype__proto.toISOString=moment_format__toISOString;momentPrototype__proto.toJSON=toJSON;momentPrototype__proto.toString=toString;momentPrototype__proto.unix=unix;momentPrototype__proto.valueOf=to_type__valueOf;momentPrototype__proto.creationData=creationData; // Year
	momentPrototype__proto.year=getSetYear;momentPrototype__proto.isLeapYear=getIsLeapYear; // Week Year
	momentPrototype__proto.weekYear=getSetWeekYear;momentPrototype__proto.isoWeekYear=getSetISOWeekYear; // Quarter
	momentPrototype__proto.quarter=momentPrototype__proto.quarters=getSetQuarter; // Month
	momentPrototype__proto.month=getSetMonth;momentPrototype__proto.daysInMonth=getDaysInMonth; // Week
	momentPrototype__proto.week=momentPrototype__proto.weeks=getSetWeek;momentPrototype__proto.isoWeek=momentPrototype__proto.isoWeeks=getSetISOWeek;momentPrototype__proto.weeksInYear=getWeeksInYear;momentPrototype__proto.isoWeeksInYear=getISOWeeksInYear; // Day
	momentPrototype__proto.date=getSetDayOfMonth;momentPrototype__proto.day=momentPrototype__proto.days=getSetDayOfWeek;momentPrototype__proto.weekday=getSetLocaleDayOfWeek;momentPrototype__proto.isoWeekday=getSetISODayOfWeek;momentPrototype__proto.dayOfYear=getSetDayOfYear; // Hour
	momentPrototype__proto.hour=momentPrototype__proto.hours=getSetHour; // Minute
	momentPrototype__proto.minute=momentPrototype__proto.minutes=getSetMinute; // Second
	momentPrototype__proto.second=momentPrototype__proto.seconds=getSetSecond; // Millisecond
	momentPrototype__proto.millisecond=momentPrototype__proto.milliseconds=getSetMillisecond; // Offset
	momentPrototype__proto.utcOffset=getSetOffset;momentPrototype__proto.utc=setOffsetToUTC;momentPrototype__proto.local=setOffsetToLocal;momentPrototype__proto.parseZone=setOffsetToParsedOffset;momentPrototype__proto.hasAlignedHourOffset=hasAlignedHourOffset;momentPrototype__proto.isDST=isDaylightSavingTime;momentPrototype__proto.isDSTShifted=isDaylightSavingTimeShifted;momentPrototype__proto.isLocal=isLocal;momentPrototype__proto.isUtcOffset=isUtcOffset;momentPrototype__proto.isUtc=isUtc;momentPrototype__proto.isUTC=isUtc; // Timezone
	momentPrototype__proto.zoneAbbr=getZoneAbbr;momentPrototype__proto.zoneName=getZoneName; // Deprecations
	momentPrototype__proto.dates=deprecate('dates accessor is deprecated. Use date instead.',getSetDayOfMonth);momentPrototype__proto.months=deprecate('months accessor is deprecated. Use month instead',getSetMonth);momentPrototype__proto.years=deprecate('years accessor is deprecated. Use year instead',getSetYear);momentPrototype__proto.zone=deprecate('moment().zone is deprecated, use moment().utcOffset instead. https://github.com/moment/moment/issues/1779',getSetZone);var momentPrototype=momentPrototype__proto;function moment__createUnix(input){return local__createLocal(input*1000);}function moment__createInZone(){return local__createLocal.apply(null,arguments).parseZone();}var defaultCalendar={sameDay:'[Today at] LT',nextDay:'[Tomorrow at] LT',nextWeek:'dddd [at] LT',lastDay:'[Yesterday at] LT',lastWeek:'[Last] dddd [at] LT',sameElse:'L'};function locale_calendar__calendar(key,mom,now){var output=this._calendar[key];return isFunction(output)?output.call(mom,now):output;}var defaultLongDateFormat={LTS:'h:mm:ss A',LT:'h:mm A',L:'MM/DD/YYYY',LL:'MMMM D, YYYY',LLL:'MMMM D, YYYY h:mm A',LLLL:'dddd, MMMM D, YYYY h:mm A'};function longDateFormat(key){var format=this._longDateFormat[key],formatUpper=this._longDateFormat[key.toUpperCase()];if(format||!formatUpper){return format;}this._longDateFormat[key]=formatUpper.replace(/MMMM|MM|DD|dddd/g,function(val){return val.slice(1);});return this._longDateFormat[key];}var defaultInvalidDate='Invalid date';function invalidDate(){return this._invalidDate;}var defaultOrdinal='%d';var defaultOrdinalParse=/\d{1,2}/;function ordinal(number){return this._ordinal.replace('%d',number);}function preParsePostFormat(string){return string;}var defaultRelativeTime={future:'in %s',past:'%s ago',s:'a few seconds',m:'a minute',mm:'%d minutes',h:'an hour',hh:'%d hours',d:'a day',dd:'%d days',M:'a month',MM:'%d months',y:'a year',yy:'%d years'};function relative__relativeTime(number,withoutSuffix,string,isFuture){var output=this._relativeTime[string];return isFunction(output)?output(number,withoutSuffix,string,isFuture):output.replace(/%d/i,number);}function pastFuture(diff,output){var format=this._relativeTime[diff>0?'future':'past'];return isFunction(format)?format(output):format.replace(/%s/i,output);}function locale_set__set(config){var prop,i;for(i in config){prop=config[i];if(isFunction(prop)){this[i]=prop;}else {this['_'+i]=prop;}} // Lenient ordinal parsing accepts just a number in addition to
	// number + (possibly) stuff coming from _ordinalParseLenient.
	this._ordinalParseLenient=new RegExp(this._ordinalParse.source+'|'+/\d{1,2}/.source);}var prototype__proto=Locale.prototype;prototype__proto._calendar=defaultCalendar;prototype__proto.calendar=locale_calendar__calendar;prototype__proto._longDateFormat=defaultLongDateFormat;prototype__proto.longDateFormat=longDateFormat;prototype__proto._invalidDate=defaultInvalidDate;prototype__proto.invalidDate=invalidDate;prototype__proto._ordinal=defaultOrdinal;prototype__proto.ordinal=ordinal;prototype__proto._ordinalParse=defaultOrdinalParse;prototype__proto.preparse=preParsePostFormat;prototype__proto.postformat=preParsePostFormat;prototype__proto._relativeTime=defaultRelativeTime;prototype__proto.relativeTime=relative__relativeTime;prototype__proto.pastFuture=pastFuture;prototype__proto.set=locale_set__set; // Month
	prototype__proto.months=localeMonths;prototype__proto._months=defaultLocaleMonths;prototype__proto.monthsShort=localeMonthsShort;prototype__proto._monthsShort=defaultLocaleMonthsShort;prototype__proto.monthsParse=localeMonthsParse;prototype__proto._monthsRegex=defaultMonthsRegex;prototype__proto.monthsRegex=monthsRegex;prototype__proto._monthsShortRegex=defaultMonthsShortRegex;prototype__proto.monthsShortRegex=monthsShortRegex; // Week
	prototype__proto.week=localeWeek;prototype__proto._week=defaultLocaleWeek;prototype__proto.firstDayOfYear=localeFirstDayOfYear;prototype__proto.firstDayOfWeek=localeFirstDayOfWeek; // Day of Week
	prototype__proto.weekdays=localeWeekdays;prototype__proto._weekdays=defaultLocaleWeekdays;prototype__proto.weekdaysMin=localeWeekdaysMin;prototype__proto._weekdaysMin=defaultLocaleWeekdaysMin;prototype__proto.weekdaysShort=localeWeekdaysShort;prototype__proto._weekdaysShort=defaultLocaleWeekdaysShort;prototype__proto.weekdaysParse=localeWeekdaysParse; // Hours
	prototype__proto.isPM=localeIsPM;prototype__proto._meridiemParse=defaultLocaleMeridiemParse;prototype__proto.meridiem=localeMeridiem;function lists__get(format,index,field,setter){var locale=locale_locales__getLocale();var utc=create_utc__createUTC().set(setter,index);return locale[field](utc,format);}function list(format,index,field,count,setter){if(typeof format==='number'){index=format;format=undefined;}format=format||'';if(index!=null){return lists__get(format,index,field,setter);}var i;var out=[];for(i=0;i<count;i++){out[i]=lists__get(format,i,field,setter);}return out;}function lists__listMonths(format,index){return list(format,index,'months',12,'month');}function lists__listMonthsShort(format,index){return list(format,index,'monthsShort',12,'month');}function lists__listWeekdays(format,index){return list(format,index,'weekdays',7,'day');}function lists__listWeekdaysShort(format,index){return list(format,index,'weekdaysShort',7,'day');}function lists__listWeekdaysMin(format,index){return list(format,index,'weekdaysMin',7,'day');}locale_locales__getSetGlobalLocale('en',{ordinalParse:/\d{1,2}(th|st|nd|rd)/,ordinal:function ordinal(number){var b=number%10,output=toInt(number%100/10)===1?'th':b===1?'st':b===2?'nd':b===3?'rd':'th';return number+output;}}); // Side effect imports
	utils_hooks__hooks.lang=deprecate('moment.lang is deprecated. Use moment.locale instead.',locale_locales__getSetGlobalLocale);utils_hooks__hooks.langData=deprecate('moment.langData is deprecated. Use moment.localeData instead.',locale_locales__getLocale);var mathAbs=Math.abs;function duration_abs__abs(){var data=this._data;this._milliseconds=mathAbs(this._milliseconds);this._days=mathAbs(this._days);this._months=mathAbs(this._months);data.milliseconds=mathAbs(data.milliseconds);data.seconds=mathAbs(data.seconds);data.minutes=mathAbs(data.minutes);data.hours=mathAbs(data.hours);data.months=mathAbs(data.months);data.years=mathAbs(data.years);return this;}function duration_add_subtract__addSubtract(duration,input,value,direction){var other=create__createDuration(input,value);duration._milliseconds+=direction*other._milliseconds;duration._days+=direction*other._days;duration._months+=direction*other._months;return duration._bubble();} // supports only 2.0-style add(1, 's') or add(duration)
	function duration_add_subtract__add(input,value){return duration_add_subtract__addSubtract(this,input,value,1);} // supports only 2.0-style subtract(1, 's') or subtract(duration)
	function duration_add_subtract__subtract(input,value){return duration_add_subtract__addSubtract(this,input,value,-1);}function absCeil(number){if(number<0){return Math.floor(number);}else {return Math.ceil(number);}}function bubble(){var milliseconds=this._milliseconds;var days=this._days;var months=this._months;var data=this._data;var seconds,minutes,hours,years,monthsFromDays; // if we have a mix of positive and negative values, bubble down first
	// check: https://github.com/moment/moment/issues/2166
	if(!(milliseconds>=0&&days>=0&&months>=0||milliseconds<=0&&days<=0&&months<=0)){milliseconds+=absCeil(monthsToDays(months)+days)*864e5;days=0;months=0;} // The following code bubbles up values, see the tests for
	// examples of what that means.
	data.milliseconds=milliseconds%1000;seconds=absFloor(milliseconds/1000);data.seconds=seconds%60;minutes=absFloor(seconds/60);data.minutes=minutes%60;hours=absFloor(minutes/60);data.hours=hours%24;days+=absFloor(hours/24); // convert days to months
	monthsFromDays=absFloor(daysToMonths(days));months+=monthsFromDays;days-=absCeil(monthsToDays(monthsFromDays)); // 12 months -> 1 year
	years=absFloor(months/12);months%=12;data.days=days;data.months=months;data.years=years;return this;}function daysToMonths(days){ // 400 years have 146097 days (taking into account leap year rules)
	// 400 years have 12 months === 4800
	return days*4800/146097;}function monthsToDays(months){ // the reverse of daysToMonths
	return months*146097/4800;}function as(units){var days;var months;var milliseconds=this._milliseconds;units=normalizeUnits(units);if(units==='month'||units==='year'){days=this._days+milliseconds/864e5;months=this._months+daysToMonths(days);return units==='month'?months:months/12;}else { // handle milliseconds separately because of floating point math errors (issue #1867)
	days=this._days+Math.round(monthsToDays(this._months));switch(units){case 'week':return days/7+milliseconds/6048e5;case 'day':return days+milliseconds/864e5;case 'hour':return days*24+milliseconds/36e5;case 'minute':return days*1440+milliseconds/6e4;case 'second':return days*86400+milliseconds/1000; // Math.floor prevents floating point math errors here
	case 'millisecond':return Math.floor(days*864e5)+milliseconds;default:throw new Error('Unknown unit '+units);}}} // TODO: Use this.as('ms')?
	function duration_as__valueOf(){return this._milliseconds+this._days*864e5+this._months%12*2592e6+toInt(this._months/12)*31536e6;}function makeAs(alias){return function(){return this.as(alias);};}var asMilliseconds=makeAs('ms');var asSeconds=makeAs('s');var asMinutes=makeAs('m');var asHours=makeAs('h');var asDays=makeAs('d');var asWeeks=makeAs('w');var asMonths=makeAs('M');var asYears=makeAs('y');function duration_get__get(units){units=normalizeUnits(units);return this[units+'s']();}function makeGetter(name){return function(){return this._data[name];};}var milliseconds=makeGetter('milliseconds');var seconds=makeGetter('seconds');var minutes=makeGetter('minutes');var hours=makeGetter('hours');var days=makeGetter('days');var months=makeGetter('months');var years=makeGetter('years');function weeks(){return absFloor(this.days()/7);}var round=Math.round;var thresholds={s:45, // seconds to minute
	m:45, // minutes to hour
	h:22, // hours to day
	d:26, // days to month
	M:11 // months to year
	}; // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
	function substituteTimeAgo(string,number,withoutSuffix,isFuture,locale){return locale.relativeTime(number||1,!!withoutSuffix,string,isFuture);}function duration_humanize__relativeTime(posNegDuration,withoutSuffix,locale){var duration=create__createDuration(posNegDuration).abs();var seconds=round(duration.as('s'));var minutes=round(duration.as('m'));var hours=round(duration.as('h'));var days=round(duration.as('d'));var months=round(duration.as('M'));var years=round(duration.as('y'));var a=seconds<thresholds.s&&['s',seconds]||minutes<=1&&['m']||minutes<thresholds.m&&['mm',minutes]||hours<=1&&['h']||hours<thresholds.h&&['hh',hours]||days<=1&&['d']||days<thresholds.d&&['dd',days]||months<=1&&['M']||months<thresholds.M&&['MM',months]||years<=1&&['y']||['yy',years];a[2]=withoutSuffix;a[3]=+posNegDuration>0;a[4]=locale;return substituteTimeAgo.apply(null,a);} // This function allows you to set a threshold for relative time strings
	function duration_humanize__getSetRelativeTimeThreshold(threshold,limit){if(thresholds[threshold]===undefined){return false;}if(limit===undefined){return thresholds[threshold];}thresholds[threshold]=limit;return true;}function humanize(withSuffix){var locale=this.localeData();var output=duration_humanize__relativeTime(this,!withSuffix,locale);if(withSuffix){output=locale.pastFuture(+this,output);}return locale.postformat(output);}var iso_string__abs=Math.abs;function iso_string__toISOString(){ // for ISO strings we do not use the normal bubbling rules:
	//  * milliseconds bubble up until they become hours
	//  * days do not bubble at all
	//  * months bubble up until they become years
	// This is because there is no context-free conversion between hours and days
	// (think of clock changes)
	// and also not between days and months (28-31 days per month)
	var seconds=iso_string__abs(this._milliseconds)/1000;var days=iso_string__abs(this._days);var months=iso_string__abs(this._months);var minutes,hours,years; // 3600 seconds -> 60 minutes -> 1 hour
	minutes=absFloor(seconds/60);hours=absFloor(minutes/60);seconds%=60;minutes%=60; // 12 months -> 1 year
	years=absFloor(months/12);months%=12; // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
	var Y=years;var M=months;var D=days;var h=hours;var m=minutes;var s=seconds;var total=this.asSeconds();if(!total){ // this is the same as C#'s (Noda) and python (isodate)...
	// but not other JS (goog.date)
	return 'P0D';}return (total<0?'-':'')+'P'+(Y?Y+'Y':'')+(M?M+'M':'')+(D?D+'D':'')+(h||m||s?'T':'')+(h?h+'H':'')+(m?m+'M':'')+(s?s+'S':'');}var duration_prototype__proto=Duration.prototype;duration_prototype__proto.abs=duration_abs__abs;duration_prototype__proto.add=duration_add_subtract__add;duration_prototype__proto.subtract=duration_add_subtract__subtract;duration_prototype__proto.as=as;duration_prototype__proto.asMilliseconds=asMilliseconds;duration_prototype__proto.asSeconds=asSeconds;duration_prototype__proto.asMinutes=asMinutes;duration_prototype__proto.asHours=asHours;duration_prototype__proto.asDays=asDays;duration_prototype__proto.asWeeks=asWeeks;duration_prototype__proto.asMonths=asMonths;duration_prototype__proto.asYears=asYears;duration_prototype__proto.valueOf=duration_as__valueOf;duration_prototype__proto._bubble=bubble;duration_prototype__proto.get=duration_get__get;duration_prototype__proto.milliseconds=milliseconds;duration_prototype__proto.seconds=seconds;duration_prototype__proto.minutes=minutes;duration_prototype__proto.hours=hours;duration_prototype__proto.days=days;duration_prototype__proto.weeks=weeks;duration_prototype__proto.months=months;duration_prototype__proto.years=years;duration_prototype__proto.humanize=humanize;duration_prototype__proto.toISOString=iso_string__toISOString;duration_prototype__proto.toString=iso_string__toISOString;duration_prototype__proto.toJSON=iso_string__toISOString;duration_prototype__proto.locale=locale;duration_prototype__proto.localeData=localeData; // Deprecations
	duration_prototype__proto.toIsoString=deprecate('toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)',iso_string__toISOString);duration_prototype__proto.lang=lang; // Side effect imports
	// FORMATTING
	addFormatToken('X',0,0,'unix');addFormatToken('x',0,0,'valueOf'); // PARSING
	addRegexToken('x',matchSigned);addRegexToken('X',matchTimestamp);addParseToken('X',function(input,array,config){config._d=new Date(parseFloat(input,10)*1000);});addParseToken('x',function(input,array,config){config._d=new Date(toInt(input));}); // Side effect imports
	utils_hooks__hooks.version='2.11.2';setHookCallback(local__createLocal);utils_hooks__hooks.fn=momentPrototype;utils_hooks__hooks.min=min;utils_hooks__hooks.max=max;utils_hooks__hooks.now=now;utils_hooks__hooks.utc=create_utc__createUTC;utils_hooks__hooks.unix=moment__createUnix;utils_hooks__hooks.months=lists__listMonths;utils_hooks__hooks.isDate=isDate;utils_hooks__hooks.locale=locale_locales__getSetGlobalLocale;utils_hooks__hooks.invalid=valid__createInvalid;utils_hooks__hooks.duration=create__createDuration;utils_hooks__hooks.isMoment=isMoment;utils_hooks__hooks.weekdays=lists__listWeekdays;utils_hooks__hooks.parseZone=moment__createInZone;utils_hooks__hooks.localeData=locale_locales__getLocale;utils_hooks__hooks.isDuration=isDuration;utils_hooks__hooks.monthsShort=lists__listMonthsShort;utils_hooks__hooks.weekdaysMin=lists__listWeekdaysMin;utils_hooks__hooks.defineLocale=defineLocale;utils_hooks__hooks.weekdaysShort=lists__listWeekdaysShort;utils_hooks__hooks.normalizeUnits=normalizeUnits;utils_hooks__hooks.relativeTimeThreshold=duration_humanize__getSetRelativeTimeThreshold;utils_hooks__hooks.prototype=momentPrototype;var _moment=utils_hooks__hooks;return _moment;});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5)(module)))

/***/ }
/******/ ]);