// { "framework": "Vue" }

(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["npm/weex-ui/index"] = factory();
	else
		root["npm/weex-ui/index"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 12);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var required = __webpack_require__(24),
    qs = __webpack_require__(25),
    protocolre = /^([a-z][a-z0-9.+-]*:)?(\/\/)?([\S\s]*)/i,
    slashes = /^[A-Za-z][A-Za-z0-9+-.]*:\/\//;

/**
 * These are the parse rules for the URL parser, it informs the parser
 * about:
 *
 * 0. The char it Needs to parse, if it's a string it should be done using
 *    indexOf, RegExp using exec and NaN means set as current value.
 * 1. The property we should set when parsing this value.
 * 2. Indication if it's backwards or forward parsing, when set as number it's
 *    the value of extra chars that should be split off.
 * 3. Inherit from location if non existing in the parser.
 * 4. `toLowerCase` the resulting value.
 */
var rules = [['#', 'hash'], // Extract from the back.
['?', 'query'], // Extract from the back.
['/', 'pathname'], // Extract from the back.
['@', 'auth', 1], // Extract from the front.
[NaN, 'host', undefined, 1, 1], // Set left over value.
[/:(\d+)$/, 'port', undefined, 1], // RegExp the back.
[NaN, 'hostname', undefined, 1, 1] // Set left over.
];

/**
 * These properties should not be copied or inherited from. This is only needed
 * for all non blob URL's as a blob URL does not include a hash, only the
 * origin.
 *
 * @type {Object}
 * @private
 */
var ignore = { hash: 1, query: 1 };

/**
 * The location object differs when your code is loaded through a normal page,
 * Worker or through a worker using a blob. And with the blobble begins the
 * trouble as the location object will contain the URL of the blob, not the
 * location of the page where our code is loaded in. The actual origin is
 * encoded in the `pathname` so we can thankfully generate a good "default"
 * location from it so we can generate proper relative URL's again.
 *
 * @param {Object|String} loc Optional default location object.
 * @returns {Object} lolcation object.
 * @api public
 */
function lolcation(loc) {
  loc = loc || {}.location || {};

  var finaldestination = {},
      type = typeof loc === 'undefined' ? 'undefined' : _typeof(loc),
      key;

  if ('blob:' === loc.protocol) {
    finaldestination = new URL(unescape(loc.pathname), {});
  } else if ('string' === type) {
    finaldestination = new URL(loc, {});
    for (key in ignore) {
      delete finaldestination[key];
    }
  } else if ('object' === type) {
    for (key in loc) {
      if (key in ignore) continue;
      finaldestination[key] = loc[key];
    }

    if (finaldestination.slashes === undefined) {
      finaldestination.slashes = slashes.test(loc.href);
    }
  }

  return finaldestination;
}

/**
 * @typedef ProtocolExtract
 * @type Object
 * @property {String} protocol Protocol matched in the URL, in lowercase.
 * @property {Boolean} slashes `true` if protocol is followed by "//", else `false`.
 * @property {String} rest Rest of the URL that is not part of the protocol.
 */

/**
 * Extract protocol information from a URL with/without double slash ("//").
 *
 * @param {String} address URL we want to extract from.
 * @return {ProtocolExtract} Extracted information.
 * @api private
 */
function extractProtocol(address) {
  var match = protocolre.exec(address);

  return {
    protocol: match[1] ? match[1].toLowerCase() : '',
    slashes: !!match[2],
    rest: match[3]
  };
}

/**
 * Resolve a relative URL pathname against a base URL pathname.
 *
 * @param {String} relative Pathname of the relative URL.
 * @param {String} base Pathname of the base URL.
 * @return {String} Resolved pathname.
 * @api private
 */
function resolve(relative, base) {
  var path = (base || '/').split('/').slice(0, -1).concat(relative.split('/')),
      i = path.length,
      last = path[i - 1],
      unshift = false,
      up = 0;

  while (i--) {
    if (path[i] === '.') {
      path.splice(i, 1);
    } else if (path[i] === '..') {
      path.splice(i, 1);
      up++;
    } else if (up) {
      if (i === 0) unshift = true;
      path.splice(i, 1);
      up--;
    }
  }

  if (unshift) path.unshift('');
  if (last === '.' || last === '..') path.push('');

  return path.join('/');
}

/**
 * The actual URL instance. Instead of returning an object we've opted-in to
 * create an actual constructor as it's much more memory efficient and
 * faster and it pleases my OCD.
 *
 * @constructor
 * @param {String} address URL we want to parse.
 * @param {Object|String} location Location defaults for relative paths.
 * @param {Boolean|Function} parser Parser for the query string.
 * @api public
 */
function URL(address, location, parser) {
  if (!(this instanceof URL)) {
    return new URL(address, location, parser);
  }

  var relative,
      extracted,
      parse,
      instruction,
      index,
      key,
      instructions = rules.slice(),
      type = typeof location === 'undefined' ? 'undefined' : _typeof(location),
      url = this,
      i = 0;

  //
  // The following if statements allows this module two have compatibility with
  // 2 different API:
  //
  // 1. Node.js's `url.parse` api which accepts a URL, boolean as arguments
  //    where the boolean indicates that the query string should also be parsed.
  //
  // 2. The `URL` interface of the browser which accepts a URL, object as
  //    arguments. The supplied object will be used as default values / fall-back
  //    for relative paths.
  //
  if ('object' !== type && 'string' !== type) {
    parser = location;
    location = null;
  }

  if (parser && 'function' !== typeof parser) parser = qs.parse;

  location = lolcation(location);

  //
  // Extract protocol information before running the instructions.
  //
  extracted = extractProtocol(address || '');
  relative = !extracted.protocol && !extracted.slashes;
  url.slashes = extracted.slashes || relative && location.slashes;
  url.protocol = extracted.protocol || location.protocol || '';
  address = extracted.rest;

  //
  // When the authority component is absent the URL starts with a path
  // component.
  //
  if (!extracted.slashes) instructions[2] = [/(.*)/, 'pathname'];

  for (; i < instructions.length; i++) {
    instruction = instructions[i];
    parse = instruction[0];
    key = instruction[1];

    if (parse !== parse) {
      url[key] = address;
    } else if ('string' === typeof parse) {
      if (~(index = address.indexOf(parse))) {
        if ('number' === typeof instruction[2]) {
          url[key] = address.slice(0, index);
          address = address.slice(index + instruction[2]);
        } else {
          url[key] = address.slice(index);
          address = address.slice(0, index);
        }
      }
    } else if (index = parse.exec(address)) {
      url[key] = index[1];
      address = address.slice(0, index.index);
    }

    url[key] = url[key] || (relative && instruction[3] ? location[key] || '' : '');

    //
    // Hostname, host and protocol should be lowercased so they can be used to
    // create a proper `origin`.
    //
    if (instruction[4]) url[key] = url[key].toLowerCase();
  }

  //
  // Also parse the supplied query string in to an object. If we're supplied
  // with a custom parser as function use that instead of the default build-in
  // parser.
  //
  if (parser) url.query = parser(url.query);

  //
  // If the URL is relative, resolve the pathname against the base URL.
  //
  if (relative && location.slashes && url.pathname.charAt(0) !== '/' && (url.pathname !== '' || location.pathname !== '')) {
    url.pathname = resolve(url.pathname, location.pathname);
  }

  //
  // We should not add port numbers if they are already the default port number
  // for a given protocol. As the host also contains the port number we're going
  // override it with the hostname which contains no port number.
  //
  if (!required(url.port, url.protocol)) {
    url.host = url.hostname;
    url.port = '';
  }

  //
  // Parse down the `auth` for the username and password.
  //
  url.username = url.password = '';
  if (url.auth) {
    instruction = url.auth.split(':');
    url.username = instruction[0] || '';
    url.password = instruction[1] || '';
  }

  url.origin = url.protocol && url.host && url.protocol !== 'file:' ? url.protocol + '//' + url.host : 'null';

  //
  // The href is just the compiled result.
  //
  url.href = url.toString();
}

/**
 * This is convenience method for changing properties in the URL instance to
 * insure that they all propagate correctly.
 *
 * @param {String} part          Property we need to adjust.
 * @param {Mixed} value          The newly assigned value.
 * @param {Boolean|Function} fn  When setting the query, it will be the function
 *                               used to parse the query.
 *                               When setting the protocol, double slash will be
 *                               removed from the final url if it is true.
 * @returns {URL}
 * @api public
 */
function set(part, value, fn) {
  var url = this;

  switch (part) {
    case 'query':
      if ('string' === typeof value && value.length) {
        value = (fn || qs.parse)(value);
      }

      url[part] = value;
      break;

    case 'port':
      url[part] = value;

      if (!required(value, url.protocol)) {
        url.host = url.hostname;
        url[part] = '';
      } else if (value) {
        url.host = url.hostname + ':' + value;
      }

      break;

    case 'hostname':
      url[part] = value;

      if (url.port) value += ':' + url.port;
      url.host = value;
      break;

    case 'host':
      url[part] = value;

      if (/:\d+$/.test(value)) {
        value = value.split(':');
        url.port = value.pop();
        url.hostname = value.join(':');
      } else {
        url.hostname = value;
        url.port = '';
      }

      break;

    case 'protocol':
      url.protocol = value.toLowerCase();
      url.slashes = !fn;
      break;

    case 'pathname':
      url.pathname = value.length && value.charAt(0) !== '/' ? '/' + value : value;

      break;

    default:
      url[part] = value;
  }

  for (var i = 0; i < rules.length; i++) {
    var ins = rules[i];

    if (ins[4]) url[ins[1]] = url[ins[1]].toLowerCase();
  }

  url.origin = url.protocol && url.host && url.protocol !== 'file:' ? url.protocol + '//' + url.host : 'null';

  url.href = url.toString();

  return url;
}

/**
 * Transform the properties back in to a valid and full URL string.
 *
 * @param {Function} stringify Optional query stringify function.
 * @returns {String}
 * @api public
 */
function toString(stringify) {
  if (!stringify || 'function' !== typeof stringify) stringify = qs.stringify;

  var query,
      url = this,
      protocol = url.protocol;

  if (protocol && protocol.charAt(protocol.length - 1) !== ':') protocol += ':';

  var result = protocol + (url.slashes ? '//' : '');

  if (url.username) {
    result += url.username;
    if (url.password) result += ':' + url.password;
    result += '@';
  }

  result += url.host + url.pathname;

  query = 'object' === _typeof(url.query) ? stringify(url.query) : url.query;
  if (query) result += '?' !== query.charAt(0) ? '?' + query : query;

  if (url.hash) result += url.hash;

  return result;
}

URL.prototype = { set: set, toString: toString };

//
// Expose the URL parser and some additional properties that might be useful for
// others or testing.
//
URL.extractProtocol = extractProtocol;
URL.location = lolcation;
URL.qs = qs;

module.exports = URL;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = __webpack_require__(19);

Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_index).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = __webpack_require__(75);

Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_index).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Created by Tw93 on 2017/6/26.
 */
var UrlParser = __webpack_require__(0);
var Utils = {
  UrlParser: UrlParser,
  /**
   * 对象类型
   * @memberOf Utils
   * @param obj
   * @returns {string}
   * @private
   */
  _typeof: function _typeof(obj) {
    return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
  },


  /**
   * 判断 obj 是否为 `object`
   * @memberOf Utils
   * @param obj
   * @returns {boolean}
   * @example
   *
   * const { Utils } = require('@ali/wxv-bridge');
   * const { isPlainObject } = Utils;
   * console.log(isPlainObject({})); // true
   * console.log(isPlainObject('')); // false
   */
  isPlainObject: function isPlainObject(obj) {
    return Utils._typeof(obj) === 'object';
  },


  /**
   * 判断 obj 是否为 `string`
   * @memberOf Utils
   * @param obj
   * @returns {boolean}
   * @example
   *
   * const { Utils } = require('@ali/wxv-bridge');
   * const { isString } = Utils;
   * console.log(isString({})); // false
   * console.log(isString('')); // true
   */
  isString: function isString(obj) {
    return typeof obj === 'string';
  },


  /**
   * 判断 obj 是否为 `非空数组`
   * @memberOf Utils
   * @param obj
   * @returns {boolean}
   * @example
   *
   * const { Utils } = require('@ali/wxv-bridge');
   * const { isNonEmptyArray } = Utils;
   * console.log(isNonEmptyArray([])); // false
   * console.log(isNonEmptyArray([1,1,1,1])); // true
   */
  isNonEmptyArray: function isNonEmptyArray() {
    var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    return obj && obj.length > 0 && Array.isArray(obj) && typeof obj !== 'undefined';
  },
  appendProtocol: function appendProtocol(url) {
    if (/^\/\//.test(url)) {
      var bundleUrl = weex.config.bundleUrl;

      return 'http' + (/^https:/.test(bundleUrl) ? 's' : '') + ':' + url;
    }
    return url;
  },
  encodeURLParams: function encodeURLParams(url) {
    var parsedUrl = new UrlParser(url, true);
    return parsedUrl.toString();
  },
  goToH5Page: function goToH5Page(jumpUrl) {
    var animated = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    var Navigator = weex.requireModule('navigator');
    var jumpUrlObj = new Utils.UrlParser(jumpUrl, true);
    var url = appendProtocol(jumpUrlObj.toString());
    Navigator.push({
      url: Utils.encodeURLParams(url),
      animated: animated
    }, callback);
  }
};
module.exports = Utils;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = []

/* styles */
__vue_styles__.push(__webpack_require__(152)
)

/* script */
__vue_exports__ = __webpack_require__(153)

/* template */
var __vue_template__ = __webpack_require__(154)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.__file = "/Users/Tw93/www/github/weex-ui/packages/wxc-rich-text/wxc-rich-text-text.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-7a7c04cc"
__vue_options__.style = __vue_options__.style || {}
__vue_styles__.forEach(function (module) {
  for (var name in module) {
    __vue_options__.style[name] = module[name]
  }
})
if (typeof __register_static_styles__ === "function") {
  __register_static_styles__(__vue_options__._scopeId, __vue_styles__)
}

module.exports = __vue_exports__


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = []

/* styles */
__vue_styles__.push(__webpack_require__(28)
)

/* script */
__vue_exports__ = __webpack_require__(29)

/* template */
var __vue_template__ = __webpack_require__(31)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.__file = "/Users/Tw93/www/github/weex-ui/packages/wxc-checkbox/index.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-5f56b30c"
__vue_options__.style = __vue_options__.style || {}
__vue_styles__.forEach(function (module) {
  for (var name in module) {
    __vue_options__.style[name] = module[name]
  }
})
if (typeof __register_static_styles__ === "function") {
  __register_static_styles__(__vue_options__._scopeId, __vue_styles__)
}

module.exports = __vue_exports__


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = __webpack_require__(72);

Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_index).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Created by Tw93 on 2016/10/29.
 */
module.exports = {
  GIF: "//img.alicdn.com/tfs/TB1aks3PpXXXXcXXFXXXXXXXXXX-150-150.gif",
  BLACK_GIF: "//img.alicdn.com/tfs/TB1Ep_9NVXXXXb8XVXXXXXXXXXX-74-74.gif",
  PNG: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEsAAABLCAMAAAAPkIrYAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAI6UExURUxpcf///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////5U/27QAAAC9dFJOUwBCaz78AvsB/f7E4Egk9tCgLbAfVSmu7AjtC/HqvQQoDpSeNzMbswYhieZk9fkNuuVY93UZStFFr5tpqzysK7VOyLLLCpoD1n6GGnoYjRLp+GwPmRx9Q9J/8+cVIsrcHdsHbfITbtVNw5f0cyCRDKaMBbmkikA/gkldpXseUceTt5iiFuSLtDifhLw7JipSFICpg3jZ092+zDFau3I0lW/G2t4JEIHJYKNqrV7o4WVGpyV8Zzac7i/Y4sJUOVnIpSYAAAM1SURBVFjD7ZjVWxtBFMUDJFlCgACBAAlQ3IprgVJaChRanCLFoVCgQN3d3d3d3f38b72B9mOzzCY7+8JL7tueud9vNzNzz52JRuMOd8xV5I3kTlp6jJ3f/L3hPLKccsxNQVlQHOXyoOWtJnBFtRxp4UX9dIbt1+Tw7z8TXc1hOkmKIA567w42KfDAFCct8eVHQdGsJgDaaNZAdNHUNF/PDlO8QvOBpSzdy0ggbewZntW2ACkMeYX9oxaEcG2cpNXA3VlqVCWRQoM5N2E20DsbFUSoyFreDf0AaJVqQgChAjbyojyAnC6pWEOoDdxlJtwAWqSir4FmXeBm0YbwT5CWcQRQsI4bdT4cuBYTE7NbLK4HIsz8TnLiXz3uEpcgPRfyo7z+13axSOwBNqkwOF9PimEtEDijbQUM8Wodsw1IFS3aMaBEtfvSFt8vsj4DvOepRSVTDYt+033AR/Vn1QH7RI8+wGW1qAl/YPHMo1XvsBB8UU5OKDiU51u1KHIcQ5zYAYExlajAtUClWCCz+awOVdsLrLGKlVHAQxXK3A+scnR06hfdalBffgKN+Y4a+cYQPynqKS1/jq9ETQeSuFGnr9obTZtUJv5jblYpoTLzZsnU4FZys24DlxiW3gB852Y9BFh28EPFntClw8A6cmQCvM1a00cGyNK/AoMqnJ5pU+PABxV98YXMO97wsl4B4yzdSi57lg81QP7gxxwhX23iY+WTP7BHcoFEPlYLUMMe8QNnH8ogO4iTGYsEDvGwOoB+uTPRXkCfrBxVbwNuyQ1WLQMOKmelAO062dEROokrrskQx5bIqskIhcbTfAVY4izh8BFKUOSuQiI1jEVOU46TUxcpOa9up+56zkVOMZluqdWlbx2ltJMuXxhLWaY9znOiyyipTOfaKrdQXsM2Zyl+tHdQUqFkWnc2UqpFdl7rU9Jori4ovATEdRLMezPTTTKqbfYrqnI3T7DYT9j6U3ck974nwbHh9hHTTZ6yLSyYPrEbx955JA+FDfTF5z/vGNVOaaGeVbyH9kgD867/aLBCwx/m3Gda6Z8Z97wEjcrIeP8pwMcYmqO1pbYH1b3u1rjDHXMbfwFhDJatfL699wAAAABJRU5ErkJggg==",
  PART: '//gtms02.alicdn.com/tfs/TB1y4QbSXXXXXbgapXXXXXXXXXX-50-50.gif'
};

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = __webpack_require__(92);

Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_index).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.isIOS = isIOS;
exports.isWeb = isWeb;
exports.getPageHeight = getPageHeight;
/**
 * Created by Tw93 on 2017/6/26.
 */

function isIOS() {
  var platform = weex.config.env.platform;

  return platform.toLowerCase() === 'ios';
}

function isWeb() {
  var platform = weex.config.env.platform;

  return (typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && platform.toLowerCase() === 'web';
}

function getPageHeight() {
  var env = weex.config.env;

  var navHeight = isWeb() ? 0 : 130;
  return env.deviceHeight / env.deviceWidth * 750 - navHeight;
}

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = []

/* styles */
__vue_styles__.push(__webpack_require__(158)
)

/* script */
__vue_exports__ = __webpack_require__(159)

/* template */
var __vue_template__ = __webpack_require__(160)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.__file = "/Users/Tw93/www/github/weex-ui/packages/wxc-rich-text/wxc-rich-text-icon.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-eb5b13d0"
__vue_options__.style = __vue_options__.style || {}
__vue_styles__.forEach(function (module) {
  for (var name in module) {
    __vue_options__.style[name] = module[name]
  }
})
if (typeof __register_static_styles__ === "function") {
  __register_static_styles__(__vue_options__._scopeId, __vue_styles__)
}

module.exports = __vue_exports__


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = []

/* styles */
__vue_styles__.push(__webpack_require__(161)
)

/* script */
__vue_exports__ = __webpack_require__(162)

/* template */
var __vue_template__ = __webpack_require__(163)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.__file = "/Users/Tw93/www/github/weex-ui/packages/wxc-rich-text/wxc-rich-text-tag.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-676c9ccb"
__vue_options__.style = __vue_options__.style || {}
__vue_styles__.forEach(function (module) {
  for (var name in module) {
    __vue_options__.style[name] = module[name]
  }
})
if (typeof __register_static_styles__ === "function") {
  __register_static_styles__(__vue_options__._scopeId, __vue_styles__)
}

module.exports = __vue_exports__


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WxcTag = exports.WxcTabPage = exports.WxcStepper = exports.WxcSliderBar = exports.WxcSlideNav = exports.WxcSimpleFlow = exports.WxcSearchbar = exports.WxcSpecialRichText = exports.WxcRichText = exports.WxcResult = exports.WxcRadio = exports.WxcProgress = exports.WxcPopup = exports.WxcPageCalendar = exports.WxcOverlay = exports.WxcNoticebar = exports.WxcLotteryRain = exports.WxcMinibar = exports.WxcMask = exports.WxcPartLoading = exports.WxcLoading = exports.WxcLightbox = exports.WxcIndexlist = exports.WxcGridSelect = exports.WxcEpSlider = exports.WxcDialog = exports.WxcCountdown = exports.WxcCheckboxList = exports.WxcCheckbox = exports.WxcCell = exports.WxcButton = undefined;

var _wxcButton = __webpack_require__(13);

var _wxcButton2 = _interopRequireDefault(_wxcButton);

var _wxcCell = __webpack_require__(1);

var _wxcCell2 = _interopRequireDefault(_wxcCell);

var _wxcCheckbox = __webpack_require__(27);

var _wxcCheckbox2 = _interopRequireDefault(_wxcCheckbox);

var _wxcCheckboxList = __webpack_require__(32);

var _wxcCheckboxList2 = _interopRequireDefault(_wxcCheckboxList);

var _wxcCountdown = __webpack_require__(37);

var _wxcCountdown2 = _interopRequireDefault(_wxcCountdown);

var _wxcDialog = __webpack_require__(42);

var _wxcDialog2 = _interopRequireDefault(_wxcDialog);

var _wxcEpSlider = __webpack_require__(48);

var _wxcEpSlider2 = _interopRequireDefault(_wxcEpSlider);

var _wxcGridSelect = __webpack_require__(54);

var _wxcGridSelect2 = _interopRequireDefault(_wxcGridSelect);

var _wxcIndexlist = __webpack_require__(62);

var _wxcIndexlist2 = _interopRequireDefault(_wxcIndexlist);

var _wxcLightbox = __webpack_require__(68);

var _wxcLightbox2 = _interopRequireDefault(_wxcLightbox);

var _wxcLoading = __webpack_require__(82);

var _wxcLoading2 = _interopRequireDefault(_wxcLoading);

var _wxcPartLoading = __webpack_require__(88);

var _wxcPartLoading2 = _interopRequireDefault(_wxcPartLoading);

var _wxcMask = __webpack_require__(6);

var _wxcMask2 = _interopRequireDefault(_wxcMask);

var _wxcMinibar = __webpack_require__(8);

var _wxcMinibar2 = _interopRequireDefault(_wxcMinibar);

var _wxcLotteryRain = __webpack_require__(97);

var _wxcLotteryRain2 = _interopRequireDefault(_wxcLotteryRain);

var _wxcNoticebar = __webpack_require__(109);

var _wxcNoticebar2 = _interopRequireDefault(_wxcNoticebar);

var _wxcOverlay = __webpack_require__(2);

var _wxcOverlay2 = _interopRequireDefault(_wxcOverlay);

var _wxcPageCalendar = __webpack_require__(116);

var _wxcPageCalendar2 = _interopRequireDefault(_wxcPageCalendar);

var _wxcPopup = __webpack_require__(122);

var _wxcPopup2 = _interopRequireDefault(_wxcPopup);

var _wxcProgress = __webpack_require__(127);

var _wxcProgress2 = _interopRequireDefault(_wxcProgress);

var _wxcRadio = __webpack_require__(132);

var _wxcRadio2 = _interopRequireDefault(_wxcRadio);

var _wxcResult = __webpack_require__(142);

var _wxcResult2 = _interopRequireDefault(_wxcResult);

var _wxcRichText = __webpack_require__(148);

var _wxcRichText2 = _interopRequireDefault(_wxcRichText);

var _wxcSpecialRichText = __webpack_require__(165);

var _wxcSpecialRichText2 = _interopRequireDefault(_wxcSpecialRichText);

var _wxcSearchbar = __webpack_require__(170);

var _wxcSearchbar2 = _interopRequireDefault(_wxcSearchbar);

var _wxcSimpleFlow = __webpack_require__(176);

var _wxcSimpleFlow2 = _interopRequireDefault(_wxcSimpleFlow);

var _wxcSlideNav = __webpack_require__(181);

var _wxcSlideNav2 = _interopRequireDefault(_wxcSlideNav);

var _wxcSliderBar = __webpack_require__(186);

var _wxcSliderBar2 = _interopRequireDefault(_wxcSliderBar);

var _wxcStepper = __webpack_require__(192);

var _wxcStepper2 = _interopRequireDefault(_wxcStepper);

var _wxcTabPage = __webpack_require__(197);

var _wxcTabPage2 = _interopRequireDefault(_wxcTabPage);

var _wxcTag = __webpack_require__(203);

var _wxcTag2 = _interopRequireDefault(_wxcTag);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.WxcButton = _wxcButton2.default;
exports.WxcCell = _wxcCell2.default;
exports.WxcCheckbox = _wxcCheckbox2.default;
exports.WxcCheckboxList = _wxcCheckboxList2.default;
exports.WxcCountdown = _wxcCountdown2.default;
exports.WxcDialog = _wxcDialog2.default;
exports.WxcEpSlider = _wxcEpSlider2.default;
exports.WxcGridSelect = _wxcGridSelect2.default;
exports.WxcIndexlist = _wxcIndexlist2.default;
exports.WxcLightbox = _wxcLightbox2.default;
exports.WxcLoading = _wxcLoading2.default;
exports.WxcPartLoading = _wxcPartLoading2.default;
exports.WxcMask = _wxcMask2.default;
exports.WxcMinibar = _wxcMinibar2.default;
exports.WxcLotteryRain = _wxcLotteryRain2.default;
exports.WxcNoticebar = _wxcNoticebar2.default;
exports.WxcOverlay = _wxcOverlay2.default;
exports.WxcPageCalendar = _wxcPageCalendar2.default;
exports.WxcPopup = _wxcPopup2.default;
exports.WxcProgress = _wxcProgress2.default;
exports.WxcRadio = _wxcRadio2.default;
exports.WxcResult = _wxcResult2.default;
exports.WxcRichText = _wxcRichText2.default;
exports.WxcSpecialRichText = _wxcSpecialRichText2.default;
exports.WxcSearchbar = _wxcSearchbar2.default;
exports.WxcSimpleFlow = _wxcSimpleFlow2.default;
exports.WxcSlideNav = _wxcSlideNav2.default;
exports.WxcSliderBar = _wxcSliderBar2.default;
exports.WxcStepper = _wxcStepper2.default;
exports.WxcTabPage = _wxcTabPage2.default;
exports.WxcTag = _wxcTag2.default; /**
                                    * CopyRight (C) 2017-2022 Alibaba Group Holding Limited.
                                    * Created by Tw93 on 17/09/25
                                    */

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = __webpack_require__(14);

Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_index).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = []

/* styles */
__vue_styles__.push(__webpack_require__(15)
)

/* script */
__vue_exports__ = __webpack_require__(16)

/* template */
var __vue_template__ = __webpack_require__(18)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.__file = "/Users/Tw93/www/github/weex-ui/packages/wxc-button/index.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-e0facbae"
__vue_options__.style = __vue_options__.style || {}
__vue_styles__.forEach(function (module) {
  for (var name in module) {
    __vue_options__.style[name] = module[name]
  }
})
if (typeof __register_static_styles__ === "function") {
  __register_static_styles__(__vue_options__._scopeId, __vue_styles__)
}

module.exports = __vue_exports__


/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = {
  "wxc-btn": {
    "width": 702,
    "height": 88,
    "alignItems": "center",
    "justifyContent": "center",
    "borderRadius": 12
  },
  "btn-text": {
    "textOverflow": "ellipsis",
    "lines": 1,
    "fontSize": 36,
    "color": "#FFFFFF"
  }
}

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; //
//
//
//
//
//
//
//
//
//
//

var _type = __webpack_require__(17);

exports.default = {
  props: {
    text: {
      type: String,
      default: '确认'
    },
    type: {
      type: String,
      default: 'taobao'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    btnStyle: Object,
    textStyle: Object
  },
  computed: {
    mrBtnStyle: function mrBtnStyle() {
      var type = this.type,
          disabled = this.disabled,
          btnStyle = this.btnStyle;

      var mrBtnStyle = _extends({}, _type.STYLE_MAP[type], btnStyle);
      return disabled ? _extends({}, mrBtnStyle, {
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 0
      }) : mrBtnStyle;
    },
    mrTextStyle: function mrTextStyle() {
      var type = this.type,
          disabled = this.disabled,
          textStyle = this.textStyle;

      var mrTextStyle = _extends({}, _type.TEXT_STYLE_MAP[type], textStyle);
      return disabled ? _extends({}, mrTextStyle, { color: '#FFFFFF' }) : mrTextStyle;
    }
  },
  methods: {
    onClicked: function onClicked(e) {
      var type = this.type,
          disabled = this.disabled;

      this.$emit('wxcButtonClicked', { e: e, type: type, disabled: disabled });
    }
  }
};

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var STYLE_MAP = exports.STYLE_MAP = {
  taobao: {
    backgroundColor: '#FF5000'
  },
  fliggy: {
    backgroundColor: '#FFC900'
  },
  normal: {
    backgroundColor: '#FFFFFF',
    borderColor: '#A5A5A5',
    borderWidth: '1px'
  },
  highlight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#EE9900',
    borderWidth: '1px'
  }
};

var TEXT_STYLE_MAP = exports.TEXT_STYLE_MAP = {
  taobao: {
    color: '#FFFFFF'
  },
  fliggy: {
    color: '#3D3D3D'
  },
  normal: {
    color: '#3D3D3D'
  },
  highlight: {
    color: '#EE9900'
  }
};

/***/ }),
/* 18 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: ["wxc-btn"],
    style: _vm.mrBtnStyle,
    on: {
      "click": _vm.onClicked
    }
  }, [_c('text', {
    staticClass: ["btn-text"],
    style: _vm.mrTextStyle
  }, [_vm._v(_vm._s(_vm.text))])])
},staticRenderFns: []}
module.exports.render._withStripped = true

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = []

/* styles */
__vue_styles__.push(__webpack_require__(20)
)

/* script */
__vue_exports__ = __webpack_require__(21)

/* template */
var __vue_template__ = __webpack_require__(26)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.__file = "/Users/Tw93/www/github/weex-ui/packages/wxc-cell/index.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-6eea314e"
__vue_options__.style = __vue_options__.style || {}
__vue_styles__.forEach(function (module) {
  for (var name in module) {
    __vue_options__.style[name] = module[name]
  }
})
if (typeof __register_static_styles__ === "function") {
  __register_static_styles__(__vue_options__._scopeId, __vue_styles__)
}

module.exports = __vue_exports__


/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = {
  "wxc-cell": {
    "height": 100,
    "position": "relative",
    "flexDirection": "row",
    "alignItems": "center",
    "paddingLeft": 24,
    "paddingRight": 24,
    "backgroundColor": "#ffffff"
  },
  "cell-margin": {
    "marginBottom": 24
  },
  "cell-title": {
    "flex": 1
  },
  "cell-indent": {
    "paddingBottom": 30,
    "paddingTop": 30
  },
  "has-desc": {
    "paddingBottom": 18,
    "paddingTop": 18
  },
  "cell-top-border": {
    "borderTopColor": "#e2e2e2",
    "borderTopWidth": 1
  },
  "cell-bottom-border": {
    "borderBottomColor": "#e2e2e2",
    "borderBottomWidth": 1
  },
  "cell-label-text": {
    "fontSize": 30,
    "color": "#666666",
    "width": 188,
    "marginRight": 10
  },
  "cell-arrow-icon": {
    "width": 22,
    "height": 22,
    "position": "absolute",
    "top": 41,
    "right": 24
  },
  "cell-content": {
    "color": "#333333",
    "fontSize": 30,
    "lineHeight": 40
  },
  "cell-desc-text": {
    "color": "#999999",
    "fontSize": 24,
    "lineHeight": 30,
    "marginTop": 4
  }
}

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

var icon = __webpack_require__(22);
var Utils = __webpack_require__(23);
module.exports = {
  props: {
    label: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    desc: {
      type: String,
      default: ''
    },
    link: {
      type: String,
      default: ''
    },
    hasTopBorder: {
      type: Boolean,
      default: false
    },
    hasMargin: {
      type: Boolean,
      default: false
    },
    hasBottomBorder: {
      type: Boolean,
      default: true
    },
    hasArrow: {
      type: Boolean,
      default: false
    },
    hasVerticalIndent: {
      type: Boolean,
      default: true
    },
    cellStyle: {
      type: Object,
      default: function _default() {
        return {};
      }
    }
  },
  data: function data() {
    return {
      arrowIcon: icon.arrowIcon
    };
  },
  methods: {
    cellClicked: function cellClicked(e) {
      var link = this.link;
      this.$emit('wxcCellDivClick', { e: e });
      link && Utils.goToH5Page(link, true);
    }
  }
};

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Created by Tw93 on 2016/10/29.
 */
module.exports = {
  arrowIcon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWBAMAAAA2mnEIAAAAMFBMVEUAAAAgIyUgIyUgIyUgIyUgIyUgIyUgIyUgIyUgIyUgIyUgIyUgIyUgIyUgIyUgIyXxqNxkAAAAEHRSTlMATEYxFA4CPTgqCUMlIhsZEJGcAQAAAE5JREFUGNNjAIKLDxjgQFAewT4o6ABncwqKICQmIkkwC6oiJAyFArBKsDUKLYBzMgR3ISQKxTHZCDUIvQgzMe1CCCPchnAzwi+YfkT4HQA98hAFt122dQAAAABJRU5ErkJggg==",
  extendIcon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAJCAMAAAA1k+1bAAAAM1BMVEUAAACYmJiXl5eZmZmampqYmJiYmJiXl5eZmZmYmJiYmJiZmZmZmZmYmJibm5ubm5uZmZlAoLvfAAAAEHRSTlMA9fZuSmhhUfhzVziEQ0IhhORZQgAAAEJJREFUCNdFyzkSwCAMQ1Ehg9my6P6nTeF4eI3mFwJsTjNrrbn7hS2NUX4CHipxAajM6sDpUhE6o9KieOPYil96Yz7ijwK/GAbG3wAAAABJRU5ErkJggg=="
};

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Created by Tw93 on 2017/6/26.
 */
var UrlParser = __webpack_require__(0);
var Utils = {
  UrlParser: UrlParser,
  appendProtocol: function appendProtocol(url) {
    if (/^\/\//.test(url)) {
      var bundleUrl = weex.config.bundleUrl;

      return 'http' + (/^https:/.test(bundleUrl) ? 's' : '') + ':' + url;
    }
    return url;
  },
  encodeURLParams: function encodeURLParams(url) {
    var parsedUrl = new UrlParser(url, true);
    return parsedUrl.toString();
  },
  goToH5Page: function goToH5Page(jumpUrl) {
    var animated = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    var Navigator = weex.requireModule('navigator');
    var jumpUrlObj = new Utils.UrlParser(jumpUrl, true);
    var url = Utils.appendProtocol(jumpUrlObj.toString());
    Navigator.push({
      url: Utils.encodeURLParams(url),
      animated: animated
    }, callback);
  }
};
module.exports = Utils;

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Check if we're required to add a port number.
 *
 * @see https://url.spec.whatwg.org/#default-port
 * @param {Number|String} port Port number we need to check
 * @param {String} protocol Protocol we need to check against.
 * @returns {Boolean} Is it a default port for the given protocol
 * @api private
 */

module.exports = function required(port, protocol) {
  protocol = protocol.split(':')[0];
  port = +port;

  if (!port) return false;

  switch (protocol) {
    case 'http':
    case 'ws':
      return port !== 80;

    case 'https':
    case 'wss':
      return port !== 443;

    case 'ftp':
      return port !== 21;

    case 'gopher':
      return port !== 70;

    case 'file':
      return false;
  }

  return port !== 0;
};

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var has = Object.prototype.hasOwnProperty;

/**
 * Decode a URI encoded string.
 *
 * @param {String} input The URI encoded string.
 * @returns {String} The decoded string.
 * @api private
 */
function decode(input) {
  return decodeURIComponent(input.replace(/\+/g, ' '));
}

/**
 * Simple query string parser.
 *
 * @param {String} query The query string that needs to be parsed.
 * @returns {Object}
 * @api public
 */
function querystring(query) {
  var parser = /([^=?&]+)=?([^&]*)/g,
      result = {},
      part;

  //
  // Little nifty parsing hack, leverage the fact that RegExp.exec increments
  // the lastIndex property so we can continue executing this loop until we've
  // parsed all results.
  //
  for (; part = parser.exec(query); result[decode(part[1])] = decode(part[2])) {}

  return result;
}

/**
 * Transform a query string to an object.
 *
 * @param {Object} obj Object that should be transformed.
 * @param {String} prefix Optional prefix.
 * @returns {String}
 * @api public
 */
function querystringify(obj, prefix) {
  prefix = prefix || '';

  var pairs = [];

  //
  // Optionally prefix with a '?' if needed
  //
  if ('string' !== typeof prefix) prefix = '?';

  for (var key in obj) {
    if (has.call(obj, key)) {
      pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
    }
  }

  return pairs.length ? prefix + pairs.join('&') : '';
}

//
// Expose the module.
//
exports.stringify = querystringify;
exports.parse = querystring;

/***/ }),
/* 26 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    class: ['wxc-cell', _vm.hasTopBorder && 'cell-top-border', _vm.hasBottomBorder && 'cell-bottom-border', _vm.hasMargin && 'cell-margin', _vm.hasVerticalIndent && 'cell-indent', _vm.desc && 'has-desc'],
    style: _vm.cellStyle,
    attrs: {
      "link": _vm.link
    },
    on: {
      "click": _vm.cellClicked
    }
  }, [_vm._t("label", [(_vm.label) ? _c('div', [_c('text', {
    staticClass: ["cell-label-text"]
  }, [_vm._v(_vm._s(_vm.label))])]) : _vm._e()]), _c('div', {
    staticClass: ["cell-title"]
  }, [_vm._t("title", [_c('text', {
    staticClass: ["cell-content"]
  }, [_vm._v(_vm._s(_vm.title))]), (_vm.desc) ? _c('text', {
    staticClass: ["cell-desc-text"]
  }, [_vm._v(_vm._s(_vm.desc))]) : _vm._e()])], 2), _vm._t("value"), _vm._t("default"), (_vm.hasArrow) ? _c('image', {
    staticClass: ["cell-arrow-icon"],
    attrs: {
      "src": _vm.arrowIcon
    }
  }) : _vm._e()], 2)
},staticRenderFns: []}
module.exports.render._withStripped = true

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = __webpack_require__(5);

Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_index).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 28 */
/***/ (function(module, exports) {

module.exports = {
  "checkbox": {
    "width": 48,
    "height": 48
  },
  "title-text": {
    "fontSize": 30
  }
}

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _wxcCell = __webpack_require__(1);

var _wxcCell2 = _interopRequireDefault(_wxcCell);

var _iconBase = __webpack_require__(30);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

exports.default = {
  components: { WxcCell: _wxcCell2.default },
  props: {
    hasTopBorder: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      require: true
    },
    value: {
      type: [String, Number, Object],
      require: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    checked: {
      type: Boolean,
      default: false
    }
  },
  data: function data() {
    return {
      icon: [_iconBase.CHECKED, _iconBase.UNCHECKED, _iconBase.CHECKED_DISABLED, _iconBase.UNCHECKED_DISABLED],
      color: '#3D3D3D',
      innerChecked: false
    };
  },
  computed: {
    checkIcon: function checkIcon() {
      var icon = this.icon,
          disabled = this.disabled,
          innerChecked = this.innerChecked;

      if (disabled) {
        return icon[innerChecked ? 2 : 3];
      } else {
        return icon[innerChecked ? 0 : 1];
      }
    }
  },
  created: function created() {
    var checked = this.checked,
        disabled = this.disabled;

    this.innerChecked = checked;
    this.color = checked && !disabled ? '#EE9900' : '#3D3D3D';
  },

  methods: {
    wxcCellDivClick: function wxcCellDivClick() {
      var disabled = this.disabled,
          innerChecked = this.innerChecked,
          value = this.value;

      if (!disabled) {
        this.innerChecked = !innerChecked;
        this.color = this.innerChecked ? '#EE9900' : '#3D3D3D';
        this.$emit('wxcCheckBoxItemChecked', { value: value, checked: this.innerChecked });
      }
    }
  }
};

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
  CHECKED: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAEjUExURUxpce2YAO2ZAAAAANuSAO6YAO6ZAO2XAO2ZAICAAOyXAO2YAO6ZAO6ZAO6YAOyVAO6ZAOyWAO2XAO6ZAO6ZAOyZAO6ZAOyYAOiLAO2YAO2YAOuWAO6XAOOOAO6ZAOuTAOqVAO6ZAO2YAO2ZAO6ZAO6YAL+AAMyZAO6YAO6YAOyYAO6YAO6ZAO6ZAO2UAOyXAO6YAO2ZAOuJAO2YAOuXAOyYAOyYAO6ZAOOOAO2YANWAAOyXAO2YAOyXAOyYAO2YAO6ZAO2YAO6ZAO2SAO6WAO6ZAOyZAO6ZAO6YAO6ZAO6ZAKpVAOqYAOuXAO6ZAO6ZAO6ZAOmWAO2YAO2YAOuYAO6ZAO2YAO6YAO2ZAO2ZAO2ZAOmWAOyZAO2ZAO6XAO2YAO6ZAJf2tK4AAABgdFJOUwDa9wEHsvmAfwJs8bQe/SmHRGJ4/G4tQwvpYz8sEvAaDMya8vq/BAX43WqzadwrG5XlDctbXHn+CUUGQlddXirAkEsOSe1foqHPsQM+QK88kyKNtU3N9t+R2eMuiZhYmUNfjO0AAAF/SURBVFjD7ZhnV8IwFIYpKbRNgCqtE9nLCQKKDPfee8/8/18hiHqObQMJqccP5v2e5/TJvfe0tx6PiIgnqkNDZY4B9agFpC9KCDMHSQu6BQQlc4kdhE0JWkBGDK8rzMnimGEBqRgr7DfrcEqABEiAXAJp+a1azg1QYfdgo57jBmnDQ4c7+5t5XpA2GvaFvHvb3E80MT7mnxxo5jnvqOXl808FBoOcVet4BaZl3vJ3vEZkzj6yefUJsnv1CbJ79QYFj5sXwMFrbuaHV2/QiXJ5XXbympXZhhZKt5X5hGbx8lq9eoPq96hUWS2AbvWiAsUjUjrjWyl3qxcVCMiRFMokv+xIXhTlB8XXVPrTjlAv2j76tiPVixbUtou17Z7IXnSdDYrLb+lSEj6TvWhHJB55QGbykexFC/qwM0NkL+qhbdm93N2cEr0Ypj9+dnUebrjwggRHiVpDfEQIkAD9OQgo9lMGwlnWHVtRsxhVf2s5dm1dj67BKvuW7fADQeRf5h2SyMmxXTU0BgAAAABJRU5ErkJggg==',

  UNCHECKED: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAA8UExURUxpcd/f39XV1eDg4N/f3+Dg4N/f39/f39/f397e3t/f3+Dg4N7e3t3d3d/f39/f39/f39vb2wAAAODg4FDIs8gAAAATdFJOUwDxEvzaKXiAf2y//lxb8HnAKgHBpjqJAAAAeElEQVRYw+3YOxaAIAxEUb4JQQU1+9+rPdLkHG10Xp9b0A3OIeRCFirmSHIYoLwmr+Z82vIASYqLHdKYZICo6c7mqjYaoKLK9pedXAECBAgQIECAAAECBAgQoA9BJ9+vyGu1bmwuVX1/axw/NtfDId2+sicfCOiXXfhNK3VzfJS4AAAAAElFTkSuQmCC',

  CHECKED_DISABLED: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAACZUExURUxpceDg4N/f3+Dg4OXm5t7e3t/f3+Xm5t/f39/f39PT0+Dh4d3d3d/f393d3d/f39vb2+Hh4eDg4PLz9PHy8+Xl5uzt7u7v8OLi4u3u7/Dw8eHh4erq6+jo6ePk5O/w8evs7Ofn6Orr7PHy8urr6+vr7Ofo6O3t7uvs7eLi4+fn5+bn5/Dx8uzt7e/w8OPj4+np6uTl5eHh4kIni68AAAASdFJOUwBLuP7eqvrfwL8j85a5l/5N85cf5NYAAAFDSURBVFjD7ZhtUoMwFAAhEGjBWn0+IBQKrQpVa/26/+G0VhmFhiSEjj/MHmCH5SUTgmUZDFZgUzJVhlA7aInsc88BZRzvzG6JqAeD8GhLROZw6SsTwpy0RFMA/0oZF2BiREZkRKcRIeIjjiFKqud6g9oiTPIo2+60RXizigC2+k+U3GYAy1j3He274D6KF5pTO3RF16g7/lbXUFGna6Co2zVQ1O0SixZp/IRHutjvLrEofal3KO4Si3KWFQ+Ioi6xaFMDK6oE++YlJSpT9tFRoaBLLEJM1wBNHa9LYvxY3q2/6zjzkl1HTV1Pl5SoqevpklvZX3X5kt8lu0U+6wrG75IVHep6uqQ37b7ureB3Kez+Mn2tVzjCAfnzLDQfEUZkRH8nQr8rIg6EriK+G4IzO9XleLTrenBBZxNljvxAMPxL3gERb+o/eS/XGwAAAABJRU5ErkJggg==',

  UNCHECKED_DISABLED: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAABCUExURUxpceDg4N/f39/f3+zu7t7e3t/f3+zu7t/f39/f39XV1eDg4OXm5t3d3eDg4N7e3t/f39/f39vb2+Xm5uDg4PLz9Kf8uvkAAAAUdFJOUwApePG+bNq/gH8S/M5b/lzweSrPOXjjsgAAAHZJREFUWMPt2DsWgCAQQ1EYGFDEf9z/Vu3RZs7RRvMWcPvEOcZc8Sq9OVFfGsjPKcBcSKNvIE3DZIcwJG0gWbBncxWLNFAP5MNcBDpChAgRIkSIECFChAgRIvRhKF8hCajRWI4VYX1rHD8218uma2fu5kBgv+wEo835c4Jy4u8AAAAASUVORK5CYII='
};

/***/ }),
/* 31 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('wxc-cell', {
    attrs: {
      "hasTopBorder": _vm.hasTopBorder
    },
    on: {
      "wxcCellDivClick": _vm.wxcCellDivClick
    }
  }, [_c('text', {
    staticClass: ["title-text"],
    style: {
      color: _vm.color
    },
    slot: "title"
  }, [_vm._v(_vm._s(_vm.title))]), _c('image', {
    staticClass: ["checkbox"],
    attrs: {
      "src": _vm.checkIcon
    },
    slot: "value"
  })])
},staticRenderFns: []}
module.exports.render._withStripped = true

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = __webpack_require__(33);

Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_index).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = []

/* styles */
__vue_styles__.push(__webpack_require__(34)
)

/* script */
__vue_exports__ = __webpack_require__(35)

/* template */
var __vue_template__ = __webpack_require__(36)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.__file = "/Users/Tw93/www/github/weex-ui/packages/wxc-checkbox-list/index.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-d3b0c8b2"
__vue_options__.style = __vue_options__.style || {}
__vue_styles__.forEach(function (module) {
  for (var name in module) {
    __vue_options__.style[name] = module[name]
  }
})
if (typeof __register_static_styles__ === "function") {
  __register_static_styles__(__vue_options__._scopeId, __vue_styles__)
}

module.exports = __vue_exports__


/***/ }),
/* 34 */
/***/ (function(module, exports) {

module.exports = {}

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = __webpack_require__(5);

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  components: { WxcCheckbox: _index2.default },
  props: {
    list: {
      type: Array,
      default: function _default() {
        return [];
      }
    }
  },
  data: function data() {
    return {
      checkedList: []
    };
  },
  created: function created() {
    var _this = this;

    var list = this.list;

    if (list && list.length > 0) {
      list.forEach(function (item, i) {
        item.checked && _this.checkedList.push(item.value);
      });
    }
  },

  methods: {
    wxcCheckBoxItemChecked: function wxcCheckBoxItemChecked(e) {
      if (e.checked) {
        this.checkedList.push(e.value);
      } else {
        var index = this.checkedList.indexOf(e.value);
        this.checkedList.splice(index, 1);
      }
      this.$emit('wxcCheckBoxListChecked', { checkedList: this.checkedList });
    }
  }
}; //
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/***/ }),
/* 36 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', _vm._l((_vm.list), function(item, i) {
    return _c('wxc-checkbox', _vm._b({
      key: i,
      on: {
        "wxcCheckBoxItemChecked": _vm.wxcCheckBoxItemChecked
      }
    }, 'wxc-checkbox', item, false))
  }))
},staticRenderFns: []}
module.exports.render._withStripped = true

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = __webpack_require__(38);

Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_index).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = []

/* styles */
__vue_styles__.push(__webpack_require__(39)
)

/* script */
__vue_exports__ = __webpack_require__(40)

/* template */
var __vue_template__ = __webpack_require__(41)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.__file = "/Users/Tw93/www/github/weex-ui/packages/wxc-countdown/index.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-5e9a2430"
__vue_options__.style = __vue_options__.style || {}
__vue_styles__.forEach(function (module) {
  for (var name in module) {
    __vue_options__.style[name] = module[name]
  }
})
if (typeof __register_static_styles__ === "function") {
  __register_static_styles__(__vue_options__._scopeId, __vue_styles__)
}

module.exports = __vue_exports__


/***/ }),
/* 39 */
/***/ (function(module, exports) {

module.exports = {
  "time-dot-wrap": {
    "flexDirection": "row",
    "alignItems": "center"
  }
}

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

exports.default = {
  props: {
    // 时间戳
    time: {
      type: Number,
      default: 1501200000000
    },
    // 倒计时的间隔,单位为"毫秒"
    interval: {
      type: Number,
      default: 1000
    },
    tpl: {
      type: String,
      default: '{h}:{m}:{s}'
    },
    // 最外层包裹 style
    timeWrapStyle: Object,
    // 数字盒子 style
    timeBoxStyle: Object,
    // : 盒子Style
    dotBoxStyle: Object,
    // 数字文字 Style
    timeTextStyle: Object,
    // : 文字Style
    dotTextStyle: Object
  },
  data: function data() {
    return {
      NOW_DATE: new Date().getTime(),
      completed: false,
      TIME_WRAP_STYLE: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: '12px',
        marginRight: '12px'
      },
      TIME_BOX_STYLE: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#333333',
        height: '30px',
        width: '30px'
      },
      DOT_BOX_STYLE: {
        width: '18px',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
      },
      TIME_TEXT_STYLE: {
        color: '#FFCC80',
        fontSize: '18px'
      },
      DOT_TEXT_STYLE: {
        color: '#333333',
        fontSize: '18px',
        fontWeight: 'bold'
      }
    };
  },
  mounted: function mounted() {
    var _this = this;

    setInterval(function () {
      _this.NOW_DATE = new Date().getTime();
    }, this.interval);
  },

  computed: {
    mrTimeWrapStyle: function mrTimeWrapStyle() {
      return _extends({}, this.TIME_WRAP_STYLE, this.timeWrapStyle);
    },
    mrTimeBoxStyle: function mrTimeBoxStyle() {
      return _extends({}, this.TIME_BOX_STYLE, this.timeBoxStyle);
    },
    mrDotBoxStyle: function mrDotBoxStyle() {
      return _extends({}, this.DOT_BOX_STYLE, this.dotBoxStyle);
    },
    mrTimeTextStyle: function mrTimeTextStyle() {
      return _extends({}, this.TIME_TEXT_STYLE, this.timeTextStyle);
    },
    mrDotTextStyle: function mrDotTextStyle() {
      return _extends({}, this.DOT_TEXT_STYLE, this.dotTextStyle);
    },
    countDownData: function countDownData() {
      var timeSpacing = this.time - this.NOW_DATE;

      // 倒计时结束了
      if (timeSpacing < 0) {
        if (this.completed === false) {
          this.$emit('wxcOnComplete');
        }
        this.completed = true;
        return {
          hour: '00',
          minute: '00',
          second: '00'
        };
      }

      // 计算小时
      var hours = Math.floor(timeSpacing / (3600 * 1000));

      // 计算分钟(去除小时)
      var minute = Math.floor(timeSpacing % (3600 * 1000) / (60 * 1000));

      // 计算秒数(去除分钟)
      var second = Math.floor(timeSpacing % (60 * 1000) / 1000);

      return {
        hour: hours < 10 ? '0' + hours : hours,
        minute: minute < 10 ? '0' + minute : minute,
        second: second < 10 ? '0' + second : second
      };
    }
  },

  methods: {
    // 分析模板
    tplObj: function tplObj() {
      var tplIndexOfHours = this.tpl.indexOf('h');
      var tplIndexOfMinutes = this.tpl.indexOf('m');
      var tplIndexOfSeconds = this.tpl.indexOf('s');

      return {
        firstDot: this.tpl.slice(tplIndexOfHours + 2, tplIndexOfMinutes - 1),
        secondDot: this.tpl.slice(tplIndexOfMinutes + 2, tplIndexOfSeconds - 1)
      };
    }
  }
};

/***/ }),
/* 41 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    style: _vm.mrTimeWrapStyle
  }, [_c('div', {
    staticClass: ["time-dot-wrap"]
  }, [_c('div', {
    style: _vm.mrTimeBoxStyle
  }, [_c('text', {
    style: _vm.mrTimeTextStyle
  }, [_vm._v(_vm._s(_vm.countDownData.hour))])]), _c('div', {
    style: _vm.mrDotBoxStyle
  }, [_c('text', {
    style: _vm.mrDotTextStyle
  }, [_vm._v(_vm._s(_vm.tplObj().firstDot))])]), _c('div', {
    style: _vm.mrTimeBoxStyle
  }, [_c('text', {
    style: _vm.mrTimeTextStyle
  }, [_vm._v(_vm._s(_vm.countDownData.minute))])]), _c('div', {
    style: _vm.mrDotBoxStyle
  }, [_c('text', {
    style: _vm.mrDotTextStyle
  }, [_vm._v(_vm._s(_vm.tplObj().secondDot))])]), _c('div', {
    style: _vm.mrTimeBoxStyle
  }, [_c('text', {
    style: _vm.mrTimeTextStyle
  }, [_vm._v(_vm._s(_vm.countDownData.second))])])])])
},staticRenderFns: []}
module.exports.render._withStripped = true

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = __webpack_require__(43);

Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_index).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = []

/* styles */
__vue_styles__.push(__webpack_require__(44)
)

/* script */
__vue_exports__ = __webpack_require__(45)

/* template */
var __vue_template__ = __webpack_require__(47)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.__file = "/Users/Tw93/www/github/weex-ui/packages/wxc-dialog/index.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-5ae36682"
__vue_options__.style = __vue_options__.style || {}
__vue_styles__.forEach(function (module) {
  for (var name in module) {
    __vue_options__.style[name] = module[name]
  }
})
if (typeof __register_static_styles__ === "function") {
  __register_static_styles__(__vue_options__._scopeId, __vue_styles__)
}

module.exports = __vue_exports__


/***/ }),
/* 44 */
/***/ (function(module, exports) {

module.exports = {
  "container": {
    "width": 750
  },
  "mask": {
    "top": 0,
    "width": 750,
    "height": 1344,
    "justifyContent": "center",
    "alignItems": "center"
  },
  "dialog-box": {
    "backgroundColor": "#FFFFFF",
    "width": 558
  },
  "dialog-content": {
    "paddingTop": 36,
    "paddingBottom": 36,
    "paddingLeft": 36,
    "paddingRight": 36
  },
  "content-title": {
    "color": "#333333",
    "fontSize": 36,
    "textAlign": "center",
    "marginBottom": 24
  },
  "content-subtext": {
    "color": "#666666",
    "fontSize": 26,
    "lineHeight": 36,
    "textAlign": "center"
  },
  "dialog-footer": {
    "flexDirection": "row",
    "alignItems": "center",
    "borderTopColor": "#F3F3F3",
    "borderTopWidth": 1,
    "borderTop": "1px solid #F3F3F3"
  },
  "footer-btn": {
    "flexDirection": "row",
    "alignItems": "center",
    "justifyContent": "center",
    "flex": 1,
    "height": 90
  },
  "cancel": {
    "borderRightColor": "#F3F3F3",
    "borderRightWidth": 1,
    "borderRight": "1px solid #F3F3F3"
  },
  "btn-text": {
    "fontSize": 36,
    "color": "#666666"
  },
  "no-prompt": {
    "width": 486,
    "alignItems": "center",
    "justifyContent": "center",
    "flexDirection": "row",
    "marginTop": 24
  },
  "no-prompt-icon": {
    "width": 24,
    "height": 24,
    "marginRight": 12
  },
  "no-prompt-text": {
    "fontSize": 24,
    "color": "#A5A5A5"
  }
}

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

var icon = __webpack_require__(46);
module.exports = {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    single: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    content: {
      type: String,
      default: ''
    },
    cancelText: {
      type: String,
      default: '取消'
    },
    confirmText: {
      type: String,
      default: '确定'
    },
    mainBtnColor: {
      type: String,
      default: '#EE9900'
    },
    secondBtnColor: {
      type: String,
      default: '#666666'
    },
    showNoPrompt: {
      type: Boolean,
      default: true
    },
    noPromptText: {
      type: String,
      default: '不再提示'
    },
    isChecked: {
      type: Boolean,
      default: false
    },
    maskBgColor: {
      type: String,
      default: 'rgba(0,0,0,0.6)'
    }
  },
  data: function data() {
    return {
      noPromptIcon: icon.unChecked,
      ref: 'viewport',
      pageHeight: 1334
    };
  },
  created: function created() {
    var env = weex.config.env;

    this.pageHeight = env.deviceHeight / env.deviceWidth * 750;
  },

  methods: {
    secondaryClicked: function secondaryClicked() {
      this.$emit('wxcDialogCancelBtnClicked', {
        type: 'cancel'
      });
    },
    primaryClicked: function primaryClicked(e) {
      this.$emit('wxcDialogConfirmBtnClicked', {
        type: 'confirm'
      });
    },
    noPromptClicked: function noPromptClicked(e) {
      var isChecked = !this.isChecked;
      this.noPromptIcon = isChecked ? icon.checked : icon.unChecked;
      this.$emit('wxcDialogNoPromptClicked', { isChecked: isChecked });
    }
  }
};

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Created by Tw93 on 2016/10/29.
 */
module.exports = {
  checked: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAADsUlEQVRYCe2Za4hNURTH/3vf91teMwx5k7xf4zGRPJopJCVfaDDKK4R88EnKB4UiMh4pCfFB+TBDEVFKJmHIUIy3YR7mjjn3zr1zH+ccrX2diUz3njuOO1fd/eGeffZae63fXevsszt7MfxsNXth7dN32AbO+UpVxRjG4NZkmbyqKoKMoUZRlItNjW9OjdmLKPln9PPpxIACO3NUMmBiJqFS+VKB6nY1vHjgps91jCLZN39EFUFy32A4p++CtWAWmLVbAgo1GkS07j5CVYegtL4HwTbWv57OGsuHbeWcHyVI37Ir4DZvqj+aEbkSkdB6dbmAVRRlG6dnkjxTJLMFkniIhZhEn/OVnBYO3VC6s61pTMTItdXdXc9ksuBoTMTIkylmkywHanQ2chHNRdToCKSyF6t/DP/5IgRubkmlKuRmXVoGK8UbnyFwfR3UWBtiDU90Wc/4Yop/ewHpWpmAhNkBz4Ij2Qca97+GdG0t1KgEmGzwlpyEpd+07AKVv7+FVFkKtb0F4BZ4isthKZipC5KUMpJ6WfoIqWI11HAzwM3wLDwG68DZuiEzAioH6iBVlEIJNQDMBPf8w7AOnpcWZNqgqhxLy4HcVp+ADH4BGId73kHYhhanZUNT1p361opS+M8VIvrhjjY36VUJNSUgA5/Ep5lr7n7Yhi9OOieZUDeoIn0AYm0I3NiMSG1FMptQwn5IlavFZwQpuubsg33ksqRzUgl1g3pKToM5egOqjODtXWh/cblT20qkVbyC5JZaIXcV7YF99IpOddMZ1A1q7jUKvqWXwN39Aahou7cH4adnfvOlRIMJyOaXYtw5YzfsY1f9ptPVG92g5MDkGwTv0svgviHCX+jBAYQeJnYW2g4D18sgNz0XMkfhTjgmlHWV6495ae/1Jne+iCztMHLzS4Qfl4PSLftfId5QnYCcsgXOSRv/cPY3A2lFVHPEHT3hXXIB5rzJYihScxHxrw9F3z5xPZxTt2mqhl27BEreuc0D76KzsAwo6oCxj1sD189v8Y5Bgzppp/5Xv8zigKfkFMKPjoPZe8Axfu2vYkP7fwVKJMxkhbNwh6FQnRnrcuo7M/Yvx3KgRkc3F1HDI0pn5mSUTnqzrWlMxEjHjjUESMfR2dY0JmLkVH0gQHFmHpGyhpWOxomJGjGa1kxrqXa5ey1B5Ht+9N1NcFceTK488SLvDmpRbPh4F8Fb2zuKDU0NtRv/m/KNeD1RHYdKJFR9AFClLbBuiWhicVcRCzERG3H8AAOtX+I/9HP9AAAAAElFTkSuQmCC",

  unChecked: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAABmElEQVRYCe2ZoU7DUBSGz7mi6ZaR4FEz25Ia3F4AiUHvAVCgeQQ0jgfoGyB5gTpMkw3R1uBJaNqmYof8S5tULWE9HVtyrlhFc//75eu5E+cwNSuOY280Gt0z84qZAyKatO+O/MxFJBaRsCzL1yAIapzP+NlsNlee570x8/WRofYeJyIfdV3fzufzL4bJ8XgcAVJEPpn5qaqq98Vi8bM3ZaCX6/X6wvf9GxF5ZuYZYIuiWHKSJA/OuRdAEtFyOp1+D8Twp9g0TS+JCAJn2+320aEmkQCTpwIJHrCAqWFbARQXh/C58Tyl1TKB0bW3+79qcp+YDtMEoGexDFT7M5lRM6ptQDvPatSMahvQzrMaNaPaBrTzrEbNqLYB7TyrUTOqbUA7z2rUjGob0M6zGh3CaI5QdHq1w/vmdZhyh8Y+AtGO7husvb9lAiNAQxyAnnnTjtY+76A8sICpYQsdRiRo6KNXjp55lmV3HeUHHdJnE84GQ9u/BxsYz2Z8s/t7whwHIxJMH0QkIqLdBetjpsdeDMQisIAJbMj6Bdz9uoyhg7P4AAAAAElFTkSuQmCC"
};

/***/ }),
/* 47 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: ["container"]
  }, [(_vm.show) ? _c('mask', {
    staticClass: ["mask"],
    style: {
      backgroundColor: _vm.maskBgColor,
      height: _vm.pageHeight + 'px'
    }
  }, [_c('div', {
    staticClass: ["dialog-box"]
  }, [_c('div', {
    staticClass: ["dialog-content"]
  }, [_vm._t("title", [_c('text', {
    staticClass: ["content-title"]
  }, [_vm._v(_vm._s(_vm.title))])]), _vm._t("content", [_c('text', {
    staticClass: ["content-subtext"]
  }, [_vm._v(_vm._s(_vm.content))])]), (_vm.showNoPrompt) ? _c('div', {
    staticClass: ["no-prompt"],
    on: {
      "click": _vm.noPromptClicked
    }
  }, [_c('image', {
    staticClass: ["no-prompt-icon"],
    attrs: {
      "src": _vm.noPromptIcon
    }
  }), _c('text', {
    staticClass: ["no-prompt-text"]
  }, [_vm._v(_vm._s(_vm.noPromptText))])]) : _vm._e()], 2), _c('div', {
    staticClass: ["dialog-footer"]
  }, [(!_vm.single) ? _c('div', {
    staticClass: ["footer-btn", "cancel"],
    on: {
      "click": _vm.secondaryClicked
    }
  }, [_c('text', {
    staticClass: ["btn-text"],
    style: {
      color: _vm.secondBtnColor
    }
  }, [_vm._v(_vm._s(_vm.cancelText))])]) : _vm._e(), _c('div', {
    staticClass: ["footer-btn", "confirm"],
    on: {
      "click": _vm.primaryClicked
    }
  }, [_c('text', {
    staticClass: ["btn-text"],
    style: {
      color: _vm.mainBtnColor
    }
  }, [_vm._v(_vm._s(_vm.confirmText))])])])])]) : _vm._e()], 1)
},staticRenderFns: []}
module.exports.render._withStripped = true

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = __webpack_require__(49);

Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_index).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = []

/* styles */
__vue_styles__.push(__webpack_require__(50)
)

/* script */
__vue_exports__ = __webpack_require__(51)

/* template */
var __vue_template__ = __webpack_require__(53)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.__file = "/Users/Tw93/www/github/weex-ui/packages/wxc-ep-slider/index.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-cafda07c"
__vue_options__.style = __vue_options__.style || {}
__vue_styles__.forEach(function (module) {
  for (var name in module) {
    __vue_options__.style[name] = module[name]
  }
})
if (typeof __register_static_styles__ === "function") {
  __register_static_styles__(__vue_options__._scopeId, __vue_styles__)
}

module.exports = __vue_exports__


/***/ }),
/* 50 */
/***/ (function(module, exports) {

module.exports = {
  "slider-content": {
    "position": "relative"
  },
  "slider": {
    "position": "absolute",
    "top": 0
  }
}

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

var expressionBinding = weex.requireModule('expressionBinding');
var animation = weex.requireModule('animation');
var Utils = __webpack_require__(52);

exports.default = {
  props: {
    sliderId: {
      type: [String, Number],
      default: 1
    },
    panOffset: {
      type: Number,
      default: 80
    },
    cardLength: {
      type: Number,
      default: 1
    },
    selectIndex: {
      type: Number,
      default: 0
    },
    enableSwipe: {
      type: Boolean,
      default: true
    },
    containerS: {
      type: Object,
      default: function _default() {
        return {
          position: 'relative',
          width: 750,
          height: 352,
          overflow: 'hidden'
        };
      }
    },
    cardS: {
      type: Object,
      default: function _default() {
        return {
          width: 360,
          height: 300,
          spacing: 0,
          scale: 0.75
        };
      }
    }
  },
  data: function data() {
    return {
      preventMove: true,
      moving: false,
      firstTouch: true,
      startX: 0,
      startTime: 0,
      currentIndex: 0
    };
  },
  computed: {
    cardList: function cardList() {
      return new Array(this.cardLength + 1).join().split('');
    },
    cardWidth: function cardWidth() {
      return (this.cardLength - 1) * this.cardS.width + this.containerS.width + 235 + 'px';
    }
  },
  created: function created() {
    this.currentIndex = this.selectIndex;
  },
  mounted: function mounted() {
    var _this = this;

    setTimeout(function () {
      var sliderCtn = _this.$refs['sliderCtn_' + _this.sliderId];
      if (Utils.env.supportsEB() && sliderCtn && sliderCtn.ref) {
        expressionBinding.enableBinding(sliderCtn.ref, 'pan');
      }
    }, 10);
  },

  methods: {
    onTouchStart: function onTouchStart(e) {
      if (Utils.env.supportsEB()) {
        return;
      }
      this.startX = e.changedTouches[0].clientX;
      this.startTime = Date.now();
    },
    onTouchMove: function onTouchMove(e) {
      if (Utils.env.supportsEB()) {
        return;
      }
      var moveX = e.changedTouches[0].clientX - this.startX;
      var index = this.loopedIndex(this.currentIndex, this.cardLength);
      var cardLength = this.cardLength;
      var currentCardLeft = this.currentIndex * (this.cardS.width + this.cardS.spacing);
      var sliderCtn = this.$refs['sliderCtn_' + this.sliderId];
      animation.transition(sliderCtn, {
        styles: {
          transform: 'translateX(' + (moveX - currentCardLeft) + 'px)'
        },
        timingFunction: 'ease',
        delay: 0,
        duration: 0
      }, function () {});
      if (this.cardS.scale !== 1) {
        var currentCard = this.$refs['card' + this.loopedIndex(index, cardLength) + '_' + this.sliderId][0];
        animation.transition(currentCard, {
          styles: {
            transform: 'scale(' + (1 - Math.abs(moveX) / this.cardS.width * (1 - this.cardS.scale)) + ')'
          },
          timingFunction: 'ease',
          delay: 0,
          duration: 0
        }, function () {});
        // 左边的卡片
        var leftCard = this.$refs['card' + this.loopedIndex(index - 1, cardLength) + '_' + this.sliderId][0];
        // loop 函数负数返回 0，这里有点冲突
        if (leftCard && index !== 0) {
          animation.transition(leftCard, {
            styles: {
              transform: 'scale(' + (1 - Math.abs(moveX - this.cardS.width) / this.cardS.width * (1 - this.cardS.scale)) + ')'
            },
            timingFunction: 'ease',
            delay: 0,
            duration: 0
          }, function () {});
        }
        // 右边卡片
        var rightCard = this.$refs['card' + this.loopedIndex(index + 1, cardLength) + '_' + this.sliderId][0];
        if (rightCard) {
          animation.transition(rightCard, {
            styles: {
              transform: 'scale(' + (1 - Math.abs(this.cardS.width + moveX) / this.cardS.width * (1 - this.cardS.scale)) + ')'
            },
            timingFunction: 'ease',
            delay: 0,
            duration: 0
          }, function () {});
        }
      }
    },
    onTouchEnd: function onTouchEnd(e) {
      if (Utils.env.supportsEB()) {
        return;
      }
      this.moving = true;
      var moveX = e.changedTouches[0].clientX - this.startX;
      var originIndex = this.currentIndex;
      var cardLength = this.cardLength;
      var selectIndex = originIndex;
      var panOffset = this.panOffset || this.cardS.width / 2;

      if (moveX < -panOffset) {
        if (this.loop || selectIndex !== cardLength - 1) {
          selectIndex++;
        }
      } else if (moveX > panOffset) {
        if (this.loop || selectIndex !== 0) {
          selectIndex--;
        }
      }
      this.slideTo(originIndex, selectIndex);
    },
    onEpTouchStart: function onEpTouchStart(e) {
      if (Utils.env.supportsEB() && e.state === 'start' || e.state === 'move' && this.firstTouch) {
        this.firstTouch = false;
        var sliderCtn = this.$refs['sliderCtn_' + this.sliderId];
        this.bindExp(sliderCtn);
      }
    },
    panEnd: function panEnd(e) {
      if (e.state === 'end' || e.state === 'cancel' || e.state === 'exit') {
        this.firstTouch = true;
        this.moving = true;
        var moveX = e.deltaX;
        var originIndex = this.currentIndex;
        var selectIndex = originIndex;
        var duration = Date.now() - this.startTime;
        var panOffset = this.panOffset || this.cardS.width / 2;
        if (moveX < -panOffset || this.enableSwipe && moveX < -10 && duration < 200) {
          if (selectIndex !== this.cardLength - 1) {
            selectIndex++;
          }
        } else if (moveX > panOffset || this.enableSwipe && moveX > 10 && duration < 500) {
          if (selectIndex !== 0) {
            selectIndex--;
          }
        }
        this.slideTo(originIndex, selectIndex);
      }
    },
    slideTo: function slideTo(originIndex, selectIndex) {
      var _this2 = this;

      var currentCardScale = 1;
      var rightCardScale = this.cardS.scale;
      var leftCardScale = this.cardS.scale;
      this.$emit('wxcEpSliderCurrentIndexSelected', { currentIndex: selectIndex });
      if (originIndex < selectIndex) {
        currentCardScale = this.cardS.scale;
        rightCardScale = 1;
      } else if (originIndex > selectIndex) {
        currentCardScale = this.cardS.scale;
        leftCardScale = 1;
      }
      var currentCard = this.$refs['card' + this.loopedIndex(originIndex, this.cardLength) + '_' + this.sliderId][0];
      animation.transition(currentCard, {
        styles: {
          transform: 'scale(' + currentCardScale + ')'
        },
        timingFunction: 'ease',
        delay: 0,
        duration: 300
      }, function () {});
      var leftCard = this.$refs['card' + this.loopedIndex(originIndex - 1, this.cardLength) + '_' + this.sliderId][0];
      if (leftCard && originIndex !== 0) {
        animation.transition(leftCard, {
          styles: {
            transform: 'scale(' + leftCardScale + ')'
          },
          timingFunction: 'ease',
          delay: 0,
          duration: 300
        }, function () {});
      }
      var rightCard = this.$refs['card' + this.loopedIndex(originIndex + 1, this.cardLength) + '_' + this.sliderId][0];
      if (rightCard && originIndex !== this.cardLength - 1) {
        animation.transition(rightCard, {
          styles: {
            transform: 'scale(' + rightCardScale + ')'
          },
          timingFunction: 'ease',
          delay: 0,
          duration: 300
        }, function () {});
      }
      var sliderCtn = this.$refs['sliderCtn_' + this.sliderId];
      animation.transition(sliderCtn, {
        styles: {
          transform: 'translateX(-' + selectIndex * (this.cardS.width + this.cardS.spacing) + 'px)'
        },
        timingFunction: 'ease',
        delay: 0,
        duration: 300
      }, function () {
        _this2.moving = false;
        if (originIndex !== selectIndex) {
          _this2.currentIndex = selectIndex;
        }
      });
    },

    // 使index维持在0-length之间循环
    loopedIndex: function loopedIndex(index, total) {
      if (index < 0) {
        index = index + (1 - index / total) * total;
      }
      return index % total;
    },
    bindExp: function bindExp(element) {
      var _this3 = this;

      if (element && element.ref && !this.moving) {
        this.startTime = Date.now();
        var index = this.loopedIndex(this.currentIndex, this.cardLength);
        var sliderCtn = this.$refs['sliderCtn_' + this.sliderId];
        var currentCard = this.$refs['card' + index + '_' + this.sliderId][0];
        var rightCard = null;
        var leftCard = null;
        var currentCardLeft = this.currentIndex * (this.cardS.width + this.cardS.spacing);
        // 卡片容器
        // x - currentCardLeft
        var sliderCtnExpOri = 'x - ' + currentCardLeft;
        var sliderCtnExp = '{"type":"-","children":[{"type":"Identifier","value":"x"},{"type":"NumericLiteral","value":' + currentCardLeft + '}]}';
        var args = [{
          element: sliderCtn.ref,
          property: 'transform.translateX',
          expression: sliderCtnExp,
          'ori_expression': sliderCtnExpOri
        }];

        if (this.cardS.scale !== 1) {
          // 当前显示的卡片
          // 1-abs(x)/588*${1-this.cardS.scale}
          var currentCardExpOri = '1-abs(x)/' + this.cardS.width + '*' + (1 - this.cardS.scale);
          var currentCardExp = '{"type":"-","children":[{"type":"NumericLiteral","value":1},{"type":"*","children":[{"type":"/","children":[{"type":"CallExpression","children":[{"type":"Identifier","value":"abs"},{"type":"Arguments","children":[{"type":"Identifier","value":"x"}]}]},{"type":"NumericLiteral","value":' + this.cardS.width + '}]},{"type":"NumericLiteral","value":' + (1 - this.cardS.scale) + '}]}]}';
          args.push({
            element: currentCard.ref,
            property: 'transform.scale',
            expression: currentCardExp,
            'ori_expression': currentCardExpOri
          });

          if (index === 0) {
            // 右边卡片
            rightCard = this.$refs['card' + (index + 1) + '_' + this.sliderId][0];
            // 1-abs(588+x)/588*${1-this.cardS.scale}
            var rightCardExpOri = '{sx: 1-abs(' + this.cardS.width + '+x)/' + this.cardS.width + '*' + (1 - this.cardS.scale) + ', sy: 1-abs(' + this.cardS.width + '+x)/' + this.cardS.width + '*' + (1 - this.cardS.scale) + '}';
            var rightCardExp = '{"type":"-","children":[{"type":"NumericLiteral","value":1},{"type":"*","children":[{"type":"/","children":[{"type":"CallExpression","children":[{"type":"Identifier","value":"abs"},{"type":"Arguments","children":[{"type":"+","children":[{"type":"NumericLiteral","value":' + this.cardS.width + '},{"type":"Identifier","value":"x"}]}]}]},{"type":"NumericLiteral","value":' + this.cardS.width + '}]},{"type":"NumericLiteral","value":' + (1 - this.cardS.scale) + '}]}]}';
            args.push({
              element: rightCard.ref,
              property: 'transform.scale',
              expression: rightCardExp,
              'ori_expression': rightCardExpOri
            });
          } else if (index === this.cardLength - 1) {
            // 左边的卡片
            leftCard = this.$refs['card' + (index - 1) + '_' + this.sliderId][0];
            // 1-abs(x-${this.cardS.width})/${this.cardS.width}*${1-this.cardS.scale}
            var leftCardExpOri = '{sx: 1-abs(x-' + this.cardS.width + ')/' + this.cardS.width + '*' + (1 - this.cardS.scale) + ', sy: 1-abs(x-' + this.cardS.width + ')/' + this.cardS.width + '*' + (1 - this.cardS.scale) + '}';
            var leftCardExp = '{"type":"-","children":[{"type":"NumericLiteral","value":1},{"type":"*","children":[{"type":"/","children":[{"type":"CallExpression","children":[{"type":"Identifier","value":"abs"},{"type":"Arguments","children":[{"type":"-","children":[{"type":"Identifier","value":"x"},{"type":"NumericLiteral","value":' + this.cardS.width + '}]}]}]},{"type":"NumericLiteral","value":' + this.cardS.width + '}]},{"type":"NumericLiteral","value":' + (1 - this.cardS.scale) + '}]}]}';
            args.push({
              element: leftCard.ref,
              property: 'transform.scale',
              expression: leftCardExp,
              'ori_expression': leftCardExpOri
            });
          } else {
            // 左边卡片
            leftCard = this.$refs['card' + (index - 1) + '_' + this.sliderId][0];
            // 1-abs(x-${this.cardS.width})/${this.cardS.width}*${1-this.cardS.scale}
            var _leftCardExpOri = '{sx: 1-abs(x-' + this.cardS.width + ')/' + this.cardS.width + '*' + (1 - this.cardS.scale) + ', sy: 1-abs(x-' + this.cardS.width + ')/' + this.cardS.width + '*' + (1 - this.cardS.scale) + '}';
            var _leftCardExp = '{"type":"-","children":[{"type":"NumericLiteral","value":1},{"type":"*","children":[{"type":"/","children":[{"type":"CallExpression","children":[{"type":"Identifier","value":"abs"},{"type":"Arguments","children":[{"type":"-","children":[{"type":"Identifier","value":"x"},{"type":"NumericLiteral","value":' + this.cardS.width + '}]}]}]},{"type":"NumericLiteral","value":' + this.cardS.width + '}]},{"type":"NumericLiteral","value":' + (1 - this.cardS.scale) + '}]}]}';

            args.push({
              element: leftCard.ref,
              property: 'transform.scale',
              expression: _leftCardExp,
              'ori_expression': _leftCardExpOri
            });

            // 右边卡片
            rightCard = this.$refs['card' + (index + 1) + '_' + this.sliderId][0];
            // 1-abs(${this.cardS.width}+x)/${this.cardS.width}*${1-this.cardS.scale}
            var _rightCardExpOri = '{sx: 1-abs(' + this.cardS.width + '+x)/' + this.cardS.width + '*' + (1 - this.cardS.scale) + ', sy: 1-abs(' + this.cardS.width + '+x)/' + this.cardS.width + '*' + (1 - this.cardS.scale) + '}';
            var _rightCardExp = '{"type":"-","children":[{"type":"NumericLiteral","value":1},{"type":"*","children":[{"type":"/","children":[{"type":"CallExpression","children":[{"type":"Identifier","value":"abs"},{"type":"Arguments","children":[{"type":"+","children":[{"type":"NumericLiteral","value":' + this.cardS.width + '},{"type":"Identifier","value":"x"}]}]}]},{"type":"NumericLiteral","value":' + this.cardS.width + '}]},{"type":"NumericLiteral","value":' + (1 - this.cardS.scale) + '}]}]}';
            args.push({
              element: rightCard.ref,
              property: 'transform.scale',
              expression: _rightCardExp,
              'ori_expression': _rightCardExpOri
            });
          }
        }
        expressionBinding.createBinding(element.ref, 'pan', '', args, function (e) {
          if (!_this3.moving) {
            _this3.panEnd(e);
          }
        });
      }
    }
  }
};

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * 工具方法库
 * @namespace Utils
 * @example
 */
var Utils = {

  /**
   * 环境判断辅助 API
   * @namespace Utils.env
   * @example
   *
   *
   * const { env } = Utils;
   */
  env: {

    /**
     * 是否是手淘容器
     * @method
     * @memberOf Utils.env
     * @returns {boolean}
     * @example
     *
     * const isTaobao = env.isTaobao();
     */
    isTaobao: function isTaobao() {
      var appName = weex.config.env.appName;

      return (/(tb|taobao|淘宝)/i.test(appName)
      );
    },


    /**
     * 是否是旅客容器
     * @memberOf Utils.env
     * @method
     * @returns {boolean}
     * @example
     *
     * const isTrip = env.isTrip();
     */
    isTrip: function isTrip() {
      var appName = weex.config.env.appName;

      return appName === 'LX';
    },

    /**
     * 是否是 web 环境
     * @memberOf Utils.env
     * @method
     * @returns {boolean}
     * @example
     *
     * const isWeb = env.isWeb();
     */
    isWeb: function isWeb() {
      var platform = weex.config.env.platform;

      return (typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && platform.toLowerCase() === 'web';
    },

    /**
     * 是否是 iOS 系统
     * @memberOf Utils.env
     * @method
     * @returns {boolean}
     * @example
     *
     * const isIOS = env.isIOS();
     */
    isIOS: function isIOS() {
      var platform = weex.config.env.platform;

      return platform.toLowerCase() === 'ios';
    },

    /**
     * 是否是 Android 系统
     * @memberOf Utils.env
     * @method
     * @returns {boolean}
     * @example
     *
     * const isAndroid = env.isAndroid();
     */
    isAndroid: function isAndroid() {
      var platform = weex.config.env.platform;

      return platform.toLowerCase() === 'android';
    },


    /**
     * 是否是支付宝容器
     * @memberOf Utils.env
     * @method
     * @returns {boolean}
     * @example
     *
     * const isAlipay = env.isAlipay();
     */
    isAlipay: function isAlipay() {
      var appName = weex.config.env.appName;

      return appName === 'AP';
    },


    /**
     * 是否是支付宝H5容器(防止以后支付宝接入weex)
     * @memberOf Utils.env
     * @method
     * @returns {boolean}
     * @example
     *
     * const isAlipayWeb = env.isAlipayWeb();
     */
    isAlipayWeb: function isAlipayWeb() {
      return Utils.env.isAlipay() && Utils.env.isWeb();
    },


    /**
     * 判断是否支持expressionBinding
     * 当weex版本大于0.10.1.6，为客户端即可以支持expressionBinding
     * @returns {Boolean}
     */
    supportsEB: function supportsEB() {
      var weexVersion = weex.config.env.weexVersion || '0';
      var isHighWeex = Utils.compareVersion(weexVersion, '0.10.1.4') && (Utils.env.isIOS() || Utils.env.isAndroid());
      var expressionBinding = weex.requireModule('expressionBinding');
      return expressionBinding && expressionBinding.enableBinding && isHighWeex;
    },


    /**
     * 判断Android容器是否支持是否支持expressionBinding(处理方式很不一致)
     * @returns {boolean}
     */
    supportsEBForAndroid: function supportsEBForAndroid() {
      return Utils.env.isAndroid() && Utils.env.supportsEB();
    },


    /**
     * 判断IOS容器是否支持是否支持expressionBinding
     * @returns {boolean}
     */
    supportsEBForIos: function supportsEBForIos() {
      return Utils.env.isIOS() && Utils.env.supportsEB();
    },


    /**
     * 获取weex屏幕真实的设置高度，需要减去导航栏高度
     * @returns {Number}
     */
    getPageHeight: function getPageHeight() {
      var env = weex.config.env;

      var navHeight = Utils.env.isWeb() ? 0 : 130;
      return env.deviceHeight / env.deviceWidth * 750 - navHeight;
    }
  },

  /**
   * 版本号比较
   * @memberOf Utils
   * @param currVer {string}
   * @param promoteVer {string}
   * @returns {boolean}
   * @example
   *
   * const { Utils } = require('@ali/wx-bridge');
   * const { compareVersion } = Utils;
   * console.log(compareVersion('0.1.100', '0.1.11')); // 'true'
   */
  compareVersion: function compareVersion() {
    var currVer = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "0.0.0";
    var promoteVer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "0.0.0";

    if (currVer === promoteVer) return true;
    var currVerArr = currVer.split(".");
    var promoteVerArr = promoteVer.split(".");
    var len = Math.max(currVerArr.length, promoteVerArr.length);
    for (var i = 0; i < len; i++) {
      var proVal = ~~promoteVerArr[i];
      var curVal = ~~currVerArr[i];
      if (proVal < curVal) {
        return true;
      } else if (proVal > curVal) {
        return false;
      }
    }
    return false;
  }
};

module.exports = Utils;

/***/ }),
/* 53 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    style: _vm.containerS
  }, [_c('div', {
    ref: ("sliderCtn_" + _vm.sliderId),
    staticClass: ["slider-content"],
    style: {
      width: _vm.cardWidth,
      height: _vm.cardS.height + 'px',
      transform: ("translateX(-" + (_vm.currentIndex * (_vm.cardS.width + _vm.cardS.spacing)) + "px)")
    },
    attrs: {
      "preventMoveEvent": _vm.preventMove
    },
    on: {
      "panstart": _vm.onTouchStart,
      "panmove": _vm.onTouchMove,
      "panend": _vm.onTouchEnd,
      "horizontalpan": _vm.onEpTouchStart
    }
  }, _vm._l((_vm.cardList), function(v, index) {
    return _c('div', {
      ref: ("card" + index + "_" + _vm.sliderId),
      refInFor: true,
      staticClass: ["slider"],
      style: {
        transform: ("scale(" + (index===_vm.currentIndex ? 1 : _vm.cardS.scale) + ")"),
        left: ((index * _vm.cardS.width) + "px"),
        marginLeft: (((_vm.containerS.width - _vm.cardS.width) / 2) + "px"),
        width: _vm.cardS.width + 'px',
        height: _vm.cardS.height + 'px'
      }
    }, [_vm._t(("card" + index + "_" + _vm.sliderId))], 2)
  }))])
},staticRenderFns: []}
module.exports.render._withStripped = true

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = []

/* styles */
__vue_styles__.push(__webpack_require__(55)
)

/* script */
__vue_exports__ = __webpack_require__(56)

/* template */
var __vue_template__ = __webpack_require__(61)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.__file = "/Users/Tw93/www/github/weex-ui/packages/wxc-grid-select/index.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-d231103c"
__vue_options__.style = __vue_options__.style || {}
__vue_styles__.forEach(function (module) {
  for (var name in module) {
    __vue_options__.style[name] = module[name]
  }
})
if (typeof __register_static_styles__ === "function") {
  __register_static_styles__(__vue_options__._scopeId, __vue_styles__)
}

module.exports = __vue_exports__


/***/ }),
/* 55 */
/***/ (function(module, exports) {

module.exports = {
  "grid-select": {
    "flexDirection": "row",
    "justifyContent": "space-between",
    "flexWrap": "wrap"
  }
}

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; //
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

var _option = __webpack_require__(57);

var _option2 = _interopRequireDefault(_option);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  components: { Option: _option2.default },
  props: {
    // 列数
    cols: {
      type: Number,
      default: 4
    },
    // 是否单选
    single: {
      type: Boolean,
      default: false
    },
    // 数据
    list: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    // 选择个数限制
    limit: {
      type: Number
    },
    // 用户自定义样式，用于个性化设置option样式
    customStyles: {
      type: Object,
      default: function _default() {
        return {};
      }
    }
  },
  data: function data() {
    return {
      dList: this.initList()
    };
  },

  computed: {
    cHackList: function cHackList() {
      var list = this.list,
          cols = this.cols;

      var remainder = list.length % cols;
      var len = remainder ? cols - remainder : 0;

      return Array.apply(null, { length: len });
    }
  },
  watch: {
    list: function list() {
      this.dList = this.initList();
    }
  },
  created: function created() {
    // 行间距
    this.lineSpacing = this.customStyles.lineSpacing || '12px';
  },

  methods: {
    onSelect: function onSelect(index) {
      var checked = this.dList[index].checked;
      if (this.limit <= this.checkedCount && !checked) {
        this.$emit('overLimit', this.limit);
      } else {
        this.updateList(index);
        this.$emit('select', {
          selectIndex: index,
          checked: !checked,
          checkedList: this.dList.filter(function (item) {
            return item.checked;
          })
        });
      }
    },
    initList: function initList() {
      var single = this.single;
      var checkedCount = 0;

      var dList = this.list.map(function (item, i) {
        var checked = item.checked,
            disabled = item.disabled;

        disabled = !!disabled;
        // disabled为true时认为checked无效，同时单选模式下只认为第一个checked为true的为有效值
        checked = !disabled && !!checked && (!single || checkedCount === 0);
        if (item.checked) checkedCount += 1;
        return _extends({}, item, {
          checked: checked,
          disabled: disabled
        });
      });

      this.checkedCount = checkedCount;
      return dList;
    },
    updateList: function updateList(index) {
      var single = this.single;
      var checkedCount = 0;
      this.dList = this.dList.map(function (item, i) {
        if (single) {
          item.checked = index === i && !item.checked;
        } else {
          if (i === index) item.checked = !item.checked;
        }
        if (item.checked) checkedCount += 1;
        return item;
      });
      this.checkedCount = checkedCount;
    }
  }
};

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = []

/* styles */
__vue_styles__.push(__webpack_require__(58)
)

/* script */
__vue_exports__ = __webpack_require__(59)

/* template */
var __vue_template__ = __webpack_require__(60)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.__file = "/Users/Tw93/www/github/weex-ui/packages/wxc-grid-select/option.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-6dfe5215"
__vue_options__.style = __vue_options__.style || {}
__vue_styles__.forEach(function (module) {
  for (var name in module) {
    __vue_options__.style[name] = module[name]
  }
})
if (typeof __register_static_styles__ === "function") {
  __register_static_styles__(__vue_options__._scopeId, __vue_styles__)
}

module.exports = __vue_exports__


/***/ }),
/* 58 */
/***/ (function(module, exports) {

module.exports = {
  "grid-option": {
    "justifyContent": "center",
    "borderRadius": 8,
    "borderWidth": 2,
    "paddingLeft": 6,
    "paddingRight": 6
  },
  "text-title": {
    "lines": 2,
    "lineHeight": 30,
    "textOverflow": "ellipsis",
    "textAlign": "center",
    "fontSize": 26
  },
  "image-checked": {
    "position": "absolute",
    "right": 0,
    "bottom": 0,
    "width": 38,
    "height": 34
  }
}

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
//
//
//
//
//
//
//
//
//
//
//
//
//

exports.default = {
  props: {
    index: {
      type: Number,
      default: -1
    },
    // 是否选中
    checked: {
      type: Boolean,
      default: false
    },
    // 是否可选
    disabled: {
      type: Boolean,
      default: false
    },
    // 标题
    title: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: '166px'
    },
    height: {
      type: String,
      default: '72px'
    },
    // 默认 x
    icon: {
      type: String,
      default: '//gw.alicdn.com/tfs/TB1IAByhgMPMeJjy1XdXXasrXXa-38-34.png'
    },
    // 正常状态文字色值
    color: {
      type: String,
      default: '#3d3d3d'
    },
    // 选中状态文字色值
    checkedColor: {
      type: String,
      default: '#3d3d3d'
    },
    // 不可选状态文字色值
    disabledColor: {
      type: String,
      default: '#9b9b9b'
    },
    // 正常状态边框色值
    borderColor: {
      type: String,
      default: 'transparent'
    },
    // 选中状态边框色值
    checkedBorderColor: {
      type: String,
      default: '#ffb200'
    },
    // 不可选状态边框色值
    disabledBorderColor: {
      type: String,
      default: 'transparent'
    },
    // 正常状态背景色值
    backgroundColor: {
      type: String,
      default: '#f6f6f6'
    },
    // 选中状态背景色值
    checkedBackgroundColor: {
      type: String,
      default: '#fff'
    },
    // 不可选状态背景色值
    disabledBackgroundColor: {
      type: String,
      default: '#f6f6f6'
    }
  },
  computed: {
    cWrapperStyle: function cWrapperStyle() {
      var checked = this.checked,
          disabled = this.disabled,
          width = this.width,
          height = this.height,
          borderColor = this.borderColor,
          checkedBorderColor = this.checkedBorderColor,
          disabledBorderColor = this.disabledBorderColor,
          backgroundColor = this.backgroundColor,
          checkedBackgroundColor = this.checkedBackgroundColor,
          disabledBackgroundColor = this.disabledBackgroundColor;

      return {
        width: width,
        height: height,
        borderColor: disabled ? disabledBorderColor : checked ? checkedBorderColor : borderColor,
        backgroundColor: disabled ? disabledBackgroundColor : checked ? checkedBackgroundColor : backgroundColor
      };
    },
    cTitleStyle: function cTitleStyle() {
      var checked = this.checked,
          disabled = this.disabled,
          color = this.color,
          checkedColor = this.checkedColor,
          disabledColor = this.disabledColor;

      return {
        color: disabled ? disabledColor : checked ? checkedColor : color
      };
    }
  },
  methods: {
    onClick: function onClick() {
      if (!this.disabled) {
        this.$emit('select', this.index);
      }
    }
  }
};

/***/ }),
/* 60 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: ["grid-option"],
    style: _vm.cWrapperStyle,
    on: {
      "click": _vm.onClick
    }
  }, [(_vm.title) ? _c('text', {
    staticClass: ["text-title"],
    style: _vm.cTitleStyle
  }, [_vm._v(_vm._s(_vm.title))]) : _vm._e(), (_vm.checked && _vm.icon) ? _c('image', {
    staticClass: ["image-checked"],
    attrs: {
      "src": _vm.icon
    }
  }) : _vm._e()])
},staticRenderFns: []}
module.exports.render._withStripped = true

/***/ }),
/* 61 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: ["grid-select"]
  }, [_vm._l((_vm.dList), function(item, index) {
    return _c('option', _vm._b({
      key: index,
      style: {
        marginTop: index >= _vm.cols ? _vm.lineSpacing : null
      },
      attrs: {
        "index": index
      },
      on: {
        "select": function($event) {
          _vm.onSelect(index)
        }
      }
    }, 'option', Object.assign({}, _vm.customStyles, item), false))
  }), _vm._l((_vm.cHackList), function(item, index) {
    return _c('option', _vm._b({
      key: index,
      style: {
        opacity: 0,
        marginTop: _vm.dList.length >= _vm.cols ? _vm.lineSpacing : null
      }
    }, 'option', Object.assign({}, _vm.customStyles, item), false))
  })], 2)
},staticRenderFns: []}
module.exports.render._withStripped = true

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = __webpack_require__(63);

Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_index).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = []

/* styles */
__vue_styles__.push(__webpack_require__(64)
)

/* script */
__vue_exports__ = __webpack_require__(65)

/* template */
var __vue_template__ = __webpack_require__(67)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.__file = "/Users/Tw93/www/github/weex-ui/packages/wxc-indexlist/index.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-607d6baf"
__vue_options__.style = __vue_options__.style || {}
__vue_styles__.forEach(function (module) {
  for (var name in module) {
    __vue_options__.style[name] = module[name]
  }
})
if (typeof __register_static_styles__ === "function") {
  __register_static_styles__(__vue_options__._scopeId, __vue_styles__)
}

module.exports = __vue_exports__


/***/ }),
/* 64 */
/***/ (function(module, exports) {

module.exports = {
  "wxc-index-list": {
    "position": "relative"
  },
  "index-list": {
    "width": 750,
    "height": 1334
  },
  "index-list-title": {
    "borderBottomWidth": 1,
    "borderColor": "rgba(32,35,37,0.15)",
    "backgroundColor": "#FBFBFB",
    "fontSize": 24,
    "color": "#666666",
    "paddingBottom": 14,
    "paddingTop": 14,
    "paddingLeft": 23,
    "width": 750
  },
  "group-title": {
    "borderBottomWidth": 0,
    "paddingBottom": 0,
    "paddingTop": 24
  },
  "index-list-item": {
    "width": 750,
    "flexDirection": "row",
    "alignItems": "center",
    "borderBottomWidth": 1,
    "borderBottomColor": "#e0e0e0",
    "height": 92,
    "paddingLeft": 24,
    "paddingRight": 24,
    "backgroundColor": "#FFFFFF"
  },
  "title": {
    "fontSize": 32,
    "color": "#3D3D3D"
  },
  "desc": {
    "fontSize": 24,
    "color": "#A5A5A5",
    "marginLeft": 30
  },
  "index-list-nav": {
    "position": "absolute",
    "top": 0,
    "right": 0,
    "marginBottom": 60,
    "marginTop": 60,
    "paddingBottom": 20,
    "paddingTop": 20,
    "width": 70
  },
  "list-nav-key": {
    "textAlign": "center",
    "fontSize": 24,
    "height": 40,
    "color": "#666666"
  },
  "index-list-pop": {
    "position": "fixed",
    "top": 550,
    "left": 316,
    "width": 118,
    "height": 118,
    "textAlign": "center",
    "justifyContent": "center",
    "backgroundColor": "rgba(32,35,37,0.6)",
    "borderRadius": 59,
    "paddingLeft": 0,
    "paddingRight": 0,
    "paddingTop": 35,
    "paddingBottom": 35,
    "color": "#ffffff",
    "opacity": 1
  },
  "list-pop-text": {
    "fontSize": 40,
    "textAlign": "center",
    "color": "#ffffff"
  },
  "group": {
    "paddingBottom": 18,
    "paddingRight": 70,
    "backgroundColor": "#FBFBFB"
  },
  "group-list": {
    "flexDirection": "row",
    "marginLeft": 18,
    "marginTop": 18,
    "backgroundColor": "#FBFBFB"
  },
  "group-item": {
    "width": 146,
    "height": 64,
    "borderWidth": 1,
    "borderColor": "#e0e0e0",
    "marginRight": 18,
    "flexDirection": "row",
    "alignItems": "center",
    "justifyContent": "center",
    "backgroundColor": "#FFFFFF"
  },
  "item-content": {
    "flexDirection": "column"
  },
  "item-name": {
    "fontSize": 24,
    "lineHeight": 26,
    "color": "#333333"
  },
  "item-desc": {
    "marginTop": 2,
    "color": "#999999",
    "fontSize": 20,
    "textAlign": "center"
  },
  "location-icon": {
    "width": 32,
    "height": 32,
    "marginRight": 8
  }
}

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

var dom = weex.requireModule('dom');
var Util = __webpack_require__(66);
module.exports = {
  props: {
    height: {
      type: [Number, String],
      default: Util.getPageHeight()
    },
    normalList: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    onlyShowList: {
      type: Boolean,
      default: false
    },
    showIndex: {
      type: Boolean,
      default: true
    },
    navStyle: {
      type: Object,
      default: function _default() {
        return {};
      }
    },
    hotListConfig: {
      type: Object,
      default: function _default() {
        return {};
      }
    },
    // 城市选择子组件 特殊情况支持
    cityLocationConfig: {
      type: Object,
      default: function _default() {
        return {};
      }
    }
  },
  computed: {
    formatList: function formatList() {
      var normalList = this.normalList,
          hotListConfig = this.hotListConfig,
          cityLocationConfig = this.cityLocationConfig;

      return Util.formatTotalList(normalList, hotListConfig, cityLocationConfig);
    }
  },
  data: function data() {
    return {
      popKeyShow: false,
      popKey: '',
      navOffsetY: 0
    };
  },
  methods: {
    itemClicked: function itemClicked(item) {
      var self = this;
      self.$emit('wxcIndexlistItemClicked', {
        item: item
      });
    },
    go2Key: function go2Key(key) {
      var self = this;
      var keyEl = self.$refs['index-item-title-' + key][0];
      dom.scrollToElement(keyEl, {
        offset: 0
      });
      self.popKey = key;
      self.popKeyShow = true;
      setTimeout(function () {
        self.popKeyShow = false;
      }, 600);
    }
  }
};

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.formatTotalList = formatTotalList;
exports.arrayChunk = arrayChunk;
exports.getSpecialData = getSpecialData;
exports.getPageHeight = getPageHeight;
exports.isWeb = isWeb;
/**
 * 根据26个字母取每一项首字母对数据进行排序,处理数据变换
 * @param  {object}
 * @return {[array]}
 */
function formatTotalList(source, hotListConfig, cityLocationConfig) {
  var LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var res = [];
  LETTERS.split('').forEach(function (letter) {
    var _data = source.filter(function (item) {
      if (item.pinYin) {
        return item.pinYin.slice(0, 1).toLowerCase() === letter.toLowerCase();
      } else if (item.py) {
        return item.py.slice(0, 1).toLowerCase() === letter.toLowerCase();
      } else {
        return false;
      }
    });
    if (_data.length) {
      res.push({
        title: letter,
        data: _data,
        type: 'list'
      });
    }
  });

  // 处理热门数据
  var hotList = getSpecialData(hotListConfig);
  hotList && res.unshift(hotList);

  // 处理特殊定位数据
  var cityLocation = getSpecialData(cityLocationConfig);
  cityLocation && res.unshift(cityLocation);

  return res;
}

/**
 * 分割数组
 * @param arr 被分割数组
 * @param size 分割数组的长度
 * @returns {Array}
 */
function arrayChunk() {
  var arr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var size = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;

  var groups = [];
  if (arr && arr.length > 0) {
    groups = arr.map(function (e, i) {
      return i % size === 0 ? arr.slice(i, i + size) : null;
    }).filter(function (e) {
      return e;
    });
  }
  return groups;
}

function getSpecialData(data) {
  if (data && data.type && data.list && data.list.length > 0) {
    var type = data.type,
        title = data.title,
        list = data.list;

    var res = {
      title: title,
      type: type,
      data: type === 'group' ? arrayChunk(list) : list
    };
    return res;
  } else {
    return null;
  }
}

function getPageHeight() {
  var env = weex.config.env;

  var navHeight = isWeb() ? 0 : 130;
  return env.deviceHeight / env.deviceWidth * 750 - navHeight;
}

function isWeb() {
  var platform = weex.config.env.platform;

  return (typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && platform.toLowerCase() === 'web';
}

/***/ }),
/* 67 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: ["wxc-index-list"]
  }, [_c('list', {
    staticClass: ["index-list"],
    style: {
      height: _vm.height + 'px'
    }
  }, _vm._l((_vm.formatList), function(v, i) {
    return _c('cell', {
      key: i,
      ref: 'index-item-title-' + v.title,
      refInFor: true,
      appendAsTree: true,
      attrs: {
        "append": "tree"
      }
    }, [(!_vm.onlyShowList) ? _c('text', {
      class: ['index-list-title', v.type && v.type == 'group' && 'group-title']
    }, [_vm._v(_vm._s(v.title))]) : _vm._e(), (v.type && v.type == 'group' && !_vm.onlyShowList) ? _c('div', {
      staticClass: ["group"]
    }, _vm._l((v.data), function(group, index) {
      return _c('div', {
        key: index,
        staticClass: ["group-list"]
      }, _vm._l((group), function(item, i) {
        return _c('div', {
          key: i,
          staticClass: ["group-item"],
          on: {
            "click": function($event) {
              _vm.itemClicked(item)
            }
          }
        }, [(item.isLocation) ? _c('image', {
          staticClass: ["location-icon"],
          attrs: {
            "src": "//gw.alicdn.com/tfs/TB1JUiUPFXXXXXUXXXXXXXXXXXX-32-32.png"
          }
        }) : _vm._e(), _c('div', {
          staticClass: ["item-content"]
        }, [_c('text', {
          staticClass: ["item-name"]
        }, [_vm._v(_vm._s(item.name))]), (item.desc) ? _c('text', {
          staticClass: ["item-desc"]
        }, [_vm._v(_vm._s(item.desc))]) : _vm._e()])])
      }))
    })) : _vm._e(), _vm._l((v.data), function(item, index) {
      return (v.type == 'list') ? _c('div', {
        key: index,
        staticClass: ["index-list-item"],
        on: {
          "click": function($event) {
            _vm.itemClicked(item)
          }
        }
      }, [_c('text', {
        staticClass: ["title"]
      }, [_vm._v(_vm._s(item.name))]), _c('text', {
        staticClass: ["desc"]
      }, [_vm._v(_vm._s(item.desc))])]) : _vm._e()
    })], 2)
  })), (_vm.showIndex && !_vm.onlyShowList) ? _c('div', {
    staticClass: ["index-list-nav"],
    style: _vm.navStyle
  }, _vm._l((_vm.formatList), function(item, index) {
    return _c('text', {
      key: index,
      staticClass: ["list-nav-key"],
      attrs: {
        "title": item.title
      },
      on: {
        "click": function($event) {
          _vm.go2Key(item.title)
        }
      }
    }, [_vm._v(_vm._s(item.title))])
  })) : _vm._e(), (_vm.popKeyShow) ? _c('div', {
    staticClass: ["index-list-pop"]
  }, [_c('text', {
    staticClass: ["list-pop-text"]
  }, [_vm._v(_vm._s(_vm.popKey))])]) : _vm._e()])
},staticRenderFns: []}
module.exports.render._withStripped = true

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = __webpack_require__(69);

Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_index).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = []

/* styles */
__vue_styles__.push(__webpack_require__(70)
)

/* script */
__vue_exports__ = __webpack_require__(71)

/* template */
var __vue_template__ = __webpack_require__(81)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.__file = "/Users/Tw93/www/github/weex-ui/packages/wxc-lightbox/index.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-7f585d2c"
__vue_options__.style = __vue_options__.style || {}
__vue_styles__.forEach(function (module) {
  for (var name in module) {
    __vue_options__.style[name] = module[name]
  }
})
if (typeof __register_static_styles__ === "function") {
  __register_static_styles__(__vue_options__._scopeId, __vue_styles__)
}

module.exports = __vue_exports__


/***/ }),
/* 70 */
/***/ (function(module, exports) {

module.exports = {
  "indicator": {
    "position": "absolute",
    "itemColor": "rgba(255, 195, 0, .5)",
    "itemSelectedColor": "#ffc300",
    "itemSize": 20,
    "height": 20,
    "bottom": 24
  }
}

/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; //
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

var _wxcMask = __webpack_require__(6);

var _wxcMask2 = _interopRequireDefault(_wxcMask);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  components: {
    WxcMask: _wxcMask2.default
  },
  props: {
    width: {
      type: [Number, String],
      default: 750
    },
    height: {
      type: [Number, String],
      default: 750
    },
    show: {
      type: Boolean,
      default: false
    },
    imageList: Array,
    indicatorColor: {
      type: Object,
      default: function _default() {
        return {
          'item-color': 'rgba(255, 195, 0, .5)',
          'item-selected-color': '#ffc300',
          'item-size': '20px'
        };
      }
    }
  },
  computed: {
    indicatorStyle: function indicatorStyle() {
      return _extends({
        width: this.width + 'px'
      }, this.indicatorColor);
    }
  },
  data: function data() {
    return {
      showClose: false
    };
  },
  methods: {
    maskOverlayClick: function maskOverlayClick() {
      this.$emit('wxcLightboxOverlayClicked', {});
    }
  }
};

/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = []

/* styles */
__vue_styles__.push(__webpack_require__(73)
)

/* script */
__vue_exports__ = __webpack_require__(74)

/* template */
var __vue_template__ = __webpack_require__(80)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.__file = "/Users/Tw93/www/github/weex-ui/packages/wxc-mask/index.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-fbc0ff3a"
__vue_options__.style = __vue_options__.style || {}
__vue_styles__.forEach(function (module) {
  for (var name in module) {
    __vue_options__.style[name] = module[name]
  }
})
if (typeof __register_static_styles__ === "function") {
  __register_static_styles__(__vue_options__._scopeId, __vue_styles__)
}

module.exports = __vue_exports__


/***/ }),
/* 73 */
/***/ (function(module, exports) {

module.exports = {
  "container": {
    "position": "fixed",
    "width": 750,
    "zIndex": 99999
  },
  "wxc-mask": {
    "position": "fixed",
    "top": 300,
    "left": 60,
    "width": 702,
    "height": 800
  },
  "mask-bottom": {
    "width": 100,
    "height": 100,
    "backgroundColor": "rgba(0,0,0,0)",
    "justifyContent": "center",
    "alignItems": "center"
  },
  "mask-close-icon": {
    "width": 64,
    "height": 64
  }
}

/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _wxcOverlay = __webpack_require__(2);

var _wxcOverlay2 = _interopRequireDefault(_wxcOverlay);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

var animation = weex.requireModule('animation');
var icon = __webpack_require__(79);

module.exports = {
  components: { WxcOverlay: _wxcOverlay2.default },
  props: {
    height: {
      type: [String, Number],
      default: 800
    },
    width: {
      type: [String, Number],
      default: 702
    },
    show: {
      type: Boolean,
      default: false
    },
    showClose: {
      type: Boolean,
      default: false
    },
    duration: {
      type: [String, Number],
      default: 300
    },
    hasOverlay: {
      type: Boolean,
      default: true
    },
    hasAnimation: {
      type: Boolean,
      default: true
    },
    timingFunction: {
      type: Array,
      default: function _default() {
        return ['ease-in', 'ease-out'];
      }
    },
    overlayCfg: {
      type: Object,
      default: function _default() {
        return {
          hasAnimation: true,
          timingFunction: ['ease-in', 'ease-out'],
          duration: 300,
          opacity: 0.6
        };
      }
    },
    borderRadius: {
      type: [String, Number],
      default: 0
    },
    overlayCanClose: {
      type: Boolean,
      default: true
    },
    maskBgColor: {
      type: String,
      default: '#ffffff'
    }
  },
  data: function data() {
    return {
      closeIcon: icon.closeIcon,
      maskTop: 264,
      opacity: 0
    };
  },
  computed: {
    mergeOverlayCfg: function mergeOverlayCfg() {
      return _extends({}, this.overlayCfg, {
        hasAnimation: this.hasAnimation
      });
    },
    maskStyle: function maskStyle() {
      var width = this.width,
          height = this.height,
          showClose = this.showClose,
          hasAnimation = this.hasAnimation,
          opacity = this.opacity;

      var newHeight = showClose ? height - 0 + 100 : height;
      var _weex$config$env = weex.config.env,
          deviceHeight = _weex$config$env.deviceHeight,
          deviceWidth = _weex$config$env.deviceWidth,
          platform = _weex$config$env.platform;

      var _deviceHeight = deviceHeight || 1334;
      var isWeb = (typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && platform.toLowerCase() === 'web';
      var navHeight = isWeb ? 0 : 130;
      var pageHeight = _deviceHeight / deviceWidth * 750 - navHeight;
      return {
        width: width + 'px',
        height: newHeight + 'px',
        left: (750 - width) / 2 + 'px',
        top: (pageHeight - height) / 2 + 'px',
        opacity: hasAnimation ? opacity : 1
      };
    },
    contentStyle: function contentStyle() {
      return {
        width: this.width + 'px',
        backgroundColor: this.maskBgColor,
        height: this.height + 'px',
        borderRadius: this.borderRadius + 'px'
      };
    },
    shouldShow: function shouldShow() {
      var _this = this;

      var show = this.show,
          hasAnimation = this.hasAnimation;

      hasAnimation && setTimeout(function () {
        _this.appearMask(show);
      }, 50);
      return show;
    }
  },
  methods: {
    closeIconClicked: function closeIconClicked() {
      this.appearMask(false);
    },
    wxcOverlayBodyClicking: function wxcOverlayBodyClicking() {
      if (this.hasAnimation) {
        this.appearMask(false);
        this.$emit('wxcOverlayBodyClicking', {});
      }
    },
    wxcOverlayBodyClicked: function wxcOverlayBodyClicked() {
      if (!this.hasAnimation) {
        this.appearMask(false);
        this.$emit('wxcOverlayBodyClicked', {});
      }
    },
    needEmit: function needEmit() {
      var bool = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      !bool && this.$emit('wxcMaskSetHidden', {});
    },
    appearMask: function appearMask(bool) {
      var _this2 = this;

      var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.duration;
      var hasAnimation = this.hasAnimation,
          timingFunction = this.timingFunction;

      var maskEl = this.$refs['wxc-mask'];
      if (hasAnimation && maskEl) {
        animation.transition(maskEl, {
          styles: {
            opacity: bool ? 1 : 0
          },
          duration: duration,
          timingFunction: timingFunction[bool ? 0 : 1],
          delay: 0
        }, function () {
          _this2.needEmit(bool);
        });
      } else {
        this.needEmit(bool);
      }
    }
  }
};

/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = []

/* styles */
__vue_styles__.push(__webpack_require__(76)
)

/* script */
__vue_exports__ = __webpack_require__(77)

/* template */
var __vue_template__ = __webpack_require__(78)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.__file = "/Users/Tw93/www/github/weex-ui/packages/wxc-overlay/index.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-a52a1ee2"
__vue_options__.style = __vue_options__.style || {}
__vue_styles__.forEach(function (module) {
  for (var name in module) {
    __vue_options__.style[name] = module[name]
  }
})
if (typeof __register_static_styles__ === "function") {
  __register_static_styles__(__vue_options__._scopeId, __vue_styles__)
}

module.exports = __vue_exports__


/***/ }),
/* 76 */
/***/ (function(module, exports) {

module.exports = {
  "wxc-overlay": {
    "width": 750,
    "position": "fixed",
    "left": 0,
    "top": 0,
    "bottom": 0,
    "right": 0
  }
}

/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

var animation = weex.requireModule('animation');
module.exports = {
  props: {
    show: {
      type: Boolean,
      default: true
    },
    hasAnimation: {
      type: Boolean,
      default: true
    },
    duration: {
      type: [Number, String],
      default: 300
    },
    timingFunction: {
      type: Array,
      default: function _default() {
        return ['ease-in', 'ease-out'];
      }
    },
    opacity: {
      type: [Number, String],
      default: 0.6
    },
    canAutoClose: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    overlayStyle: function overlayStyle() {
      return {
        opacity: this.hasAnimation ? 0 : 1,
        backgroundColor: 'rgba(0, 0, 0,' + this.opacity + ')'
      };
    },
    shouldShow: function shouldShow() {
      var _this = this;

      var show = this.show,
          hasAnimation = this.hasAnimation;

      hasAnimation && setTimeout(function () {
        _this.appearOverlay(show);
      }, 50);
      return show;
    }
  },
  methods: {
    overlayClicked: function overlayClicked(e) {
      this.canAutoClose ? this.appearOverlay(false) : this.$emit('wxcOverlayBodyClicked', {});
    },
    appearOverlay: function appearOverlay(bool) {
      var _this2 = this;

      var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.duration;
      var hasAnimation = this.hasAnimation,
          timingFunction = this.timingFunction,
          canAutoClose = this.canAutoClose;

      var needEmit = !bool && canAutoClose;
      needEmit && this.$emit('wxcOverlayBodyClicking', {});
      var overlayEl = this.$refs['wxc-overlay'];
      if (hasAnimation && overlayEl) {
        animation.transition(overlayEl, {
          styles: {
            opacity: bool ? 1 : 0
          },
          duration: duration,
          timingFunction: timingFunction[bool ? 0 : 1],
          delay: 0
        }, function () {
          needEmit && _this2.$emit('wxcOverlayBodyClicked', {});
        });
      } else {
        needEmit && this.$emit('wxcOverlayBodyClicked', {});
      }
    }
  }
};

/***/ }),
/* 78 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [(_vm.show) ? _c('div', {
    ref: "wxc-overlay",
    staticClass: ["wxc-overlay"],
    style: _vm.overlayStyle,
    attrs: {
      "hack": _vm.shouldShow
    },
    on: {
      "click": _vm.overlayClicked
    }
  }) : _vm._e()])
},staticRenderFns: []}
module.exports.render._withStripped = true

/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Created by Tw93 on 2016/10/29.
 */
module.exports = {
  closeIcon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAGIElEQVR4Xu1b3VUbRxSe0ex7nAqCKwhCs8/BFdhUEFyBoQLjCgwVBFcQqMDwvCNkVxBRQeBd0s35dGZ1VqP53xEiB+YcHmytdu797v+POHvhh79w/tkrAK8a8AQITCaT/fl8/gdjbJ8xttf5694+ZYxNiegH53wqhLgdDoc/tk3e1kygaZr3nPNjxtghY+xNJiMPjLEbIrqs6/o68x3erxUFYDKZvFksFp+I6KQH0y6CHzjn54PB4GI4HAKYIqcIAFtm3GS0KBC9AVBKfWCMfdV27ZLKo1Zl2PRNVVUPpn3DT8xmM5jKIeccvgKm84tHzPAZp1LKqz6q0AuApmm+cs6h7rYDpq+EEOe5zkw7T7wfIFvBIKLzuq5Pc0HIAgAqP5vNvmtJmXc/gqiqqsB4EVvV951osDeAQOSoqupdzn3JAGip/O1Q+QshxFkOITESBBDz+fyMMfbJfF6D8DFV25IA0Mx/t3j4eyHEh9TLY5i2PaPpgO3/Znz+IISAJkTnD9EAaPQnFslfCyGOtyV1F0iankvG2PvuM6nmEA1A0zQTi81/k1Ii2dnZUUoBhD9NEOq6HsYQFQWAUurcYnc7Z75l0AYCY+xCSumKUCtsggDoOA+n1z3XUkqEpmdzlFLwCaY5vKvr+sZHpBcAh93D4e0/tc2HkNa0wvl1HSOKqqGPVi8ATdOccc4/dy/XL4z2siHCS36uowMc9eoQ0Ze6rhE6rccJgEb0HyPkRdlVSaZS32XxVwiNb11a4ATAIv1HIcReSPW1FFAbMI2+1wZDDLbvI6I3VVUFEx0tONQJq4zRpwVOAJRS/3alH1KljkeGefze/ptz/nE0GiFUJR9L4vUgpfw19CKL8JzfswJg8fxR0gdhSimgv5ah5YDgyjqllMHIZdMCxtiRrXJ0AWCGlOiYPx6Pj4noL1NKKSC4mE95hyU3sPLgAmBN/VM9vwsEIgrG5RLMA/ymadBXQN3SHqsZbABgCSWPUsrknp4DBG+xUor5jj9COb5yhjZBbgAwHo9PiGjpxfXJzvpSQCjNvPZHa6bMOT8djUZI61dnAwDTdmK9v8szx4CwDea1GZiJ3EYeswFA0zQ3nHP08Jcnxm5DYckHwmKx2O/rNF33m36AiG7rukav0asByP4wvFieVAeYqgm29nmKt/eBb3GEUynl2xAA1H0gJu6GNKD93BUd1gjqkTjZ6FBKefmx+YCtAQACfSCUknwXiP8TAMn9vBjNe1YARJhAcRByAFjL5bfsBG1CLAaCxQneSylXDh6X7zIMMti8DrVm7VAEhNwwuNZl3VIitGS+LZNjkqUYezefsZTF4UToCVLhNeYDIbKXJpiN0qhU2FIMRTUhTPRzyuLSmmA2daKKITCilApWUT6VzGG+tCZYHKC1qn2WDZESmtC3IYKhR3cY4u2sGpnXmvYsQ01GeusAYSOXt2mio6Md3xKzmUFsNDDNJ4d5nznE1Ca2jrarqZPSFo/SAt1QbZsOJ31XWLqaYPPipgbYpJ/VFnd0VncyGAEtYDQ0k9Caaw5yvR3t19GYL5zlDhxzsra+38kd5AaHDI7x+JWU8qgv0SW/r5RC1Fob2ce084IAOOwK/30ppVwWM7s+SikUU+amSpS/igJAg7A289NM7xwEB/M/pZRYtgyeaAC0jWHSuxp86rdjGRJT2yI7gUGK9QOaHqj9WpeXMfZTCHEYS080ALhXF0oAwVxWxCbGUcp6WiyjjkwP6/e2XUWEPDAfvcCRBEAHBPQMTE3ADAEbol9i0U8FQW+Mfnas50LyWNeLZh73JwOgQcDGps0c8HHRbe72vsAafpLad4HPAqB9gWN9rv0YPuGKiL6FNrVcmqBLWuwAIry5BrRR3t51Ry8AdHQAcUg/zbXV7p3LX35wzvFzmOXKzMHBwW33gbu7u+U4jogOiahdl/dNpe+J6DgX3Pbu3gC0KjqbzZzb3Km2Hni+6DZ6EQBagkNr7T2BKMp4UQ2wMaZT6PZHU75ffvhwWf7oAn99y+qt+YAYqSJ/WCwWsO092DfnHMMJ02fApqfaT0wHg8FNakiLocV8pqgJ5BCw6++8ArBrCez6/hevAf8BQp52fZ98hnoAAAAASUVORK5CYII="
};

/***/ }),
/* 80 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: ["container"]
  }, [(_vm.show) ? _c('wxc-overlay', _vm._b({
    attrs: {
      "show": _vm.show && _vm.hasOverlay
    },
    on: {
      "wxcOverlayBodyClicking": _vm.wxcOverlayBodyClicking,
      "wxcOverlayBodyClicked": _vm.wxcOverlayBodyClicked
    }
  }, 'wxc-overlay', _vm.mergeOverlayCfg, false)) : _vm._e(), (_vm.show) ? _c('div', {
    ref: "wxc-mask",
    staticClass: ["wxc-mask"],
    style: _vm.maskStyle,
    attrs: {
      "hack": _vm.shouldShow
    }
  }, [_c('div', {
    style: _vm.contentStyle
  }, [_vm._t("default")], 2), (_vm.showClose) ? _c('div', {
    staticClass: ["mask-bottom"],
    style: {
      width: _vm.width + 'px'
    },
    on: {
      "click": _vm.closeIconClicked
    }
  }, [_c('image', {
    staticClass: ["mask-close-icon"],
    attrs: {
      "src": _vm.closeIcon
    }
  })]) : _vm._e()]) : _vm._e()], 1)
},staticRenderFns: []}
module.exports.render._withStripped = true

/***/ }),
/* 81 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('wxc-mask', {
    attrs: {
      "width": _vm.width,
      "height": _vm.height,
      "maskBgColor": "transparent",
      "overlayOpacity": "0.8",
      "show": _vm.show,
      "showClose": _vm.showClose
    },
    on: {
      "wxcMaskSetHidden": _vm.maskOverlayClick
    }
  }, [(_vm.show) ? _c('slider', {
    style: {
      height: _vm.height + 'px'
    },
    attrs: {
      "autoPlay": "false"
    }
  }, [_vm._l((_vm.imageList), function(v, index) {
    return _c('div', {
      key: index,
      style: {
        height: _vm.height + 'px'
      }
    }, [_c('image', {
      style: {
        height: _vm.height + 'px',
        width: _vm.width + 'px'
      },
      attrs: {
        "resize": "cover",
        "src": v.src
      }
    })])
  }), _c('indicator', {
    staticClass: ["indicator"],
    style: _vm.indicatorStyle
  })], 2) : _vm._e()])], 1)
},staticRenderFns: []}
module.exports.render._withStripped = true

/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = __webpack_require__(83);

Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_index).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = []

/* styles */
__vue_styles__.push(__webpack_require__(84)
)

/* script */
__vue_exports__ = __webpack_require__(85)

/* template */
var __vue_template__ = __webpack_require__(87)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.__file = "/Users/Tw93/www/github/weex-ui/packages/wxc-loading/index.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-216d530a"
__vue_options__.style = __vue_options__.style || {}
__vue_styles__.forEach(function (module) {
  for (var name in module) {
    __vue_options__.style[name] = module[name]
  }
})
if (typeof __register_static_styles__ === "function") {
  __register_static_styles__(__vue_options__._scopeId, __vue_styles__)
}

module.exports = __vue_exports__


/***/ }),
/* 84 */
/***/ (function(module, exports) {

module.exports = {
  "wxc-loading": {
    "position": "fixed",
    "left": 287,
    "top": 500,
    "zIndex": 9999
  },
  "loading-box": {
    "alignItems": "center",
    "justifyContent": "center",
    "borderRadius": 20,
    "width": 175,
    "height": 175,
    "backgroundColor": "rgba(0,0,0,0.8)"
  },
  "trip-loading": {
    "backgroundColor": "rgba(0,0,0,0.2)"
  },
  "loading-trip-image": {
    "height": 75,
    "width": 75
  },
  "loading-text": {
    "color": "#ffffff",
    "fontSize": 24,
    "lineHeight": 30,
    "height": 30,
    "marginTop": 8,
    "textOverflow": "ellipsis",
    "width": 140,
    "textAlign": "center"
  }
}

/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _icon = __webpack_require__(7);

var Util = __webpack_require__(86); //
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

var appVersion = weex.config.env.appVersion || '0';
var needShowPng = Util.compareVersion('8.2.4', appVersion) && Util.isTrip() && Util.isAndroid();
module.exports = {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    loadingText: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'default'
    },
    interval: {
      type: [Number, String],
      default: 0
    }
  },
  data: function data() {
    return {
      showLoading: false,
      tid: 0
    };
  },
  computed: {
    showText: function showText() {
      return this.loadingText || needShowPng;
    },
    hackText: function hackText() {
      return this.loadingText ? this.loadingText : needShowPng ? '正在加载中...' : '';
    },
    loading: function loading() {
      var loading = {};
      switch (this.type) {
        case 'trip':
          loading = {
            url: needShowPng ? _icon.PNG : _icon.GIF,
            class: 'trip-loading'
          };
          break;
        default:
          loading = {
            url: _icon.BLACK_GIF,
            class: 'default-loading'
          };
      }
      return loading;
    },
    topPosition: function topPosition() {
      return (Util.getPageHeight() - 200) / 2;
    },
    needShow: function needShow() {
      this.setShow();
      return this.show;
    }
  },
  methods: {
    setShow: function setShow() {
      var _this = this;

      var interval = this.interval,
          show = this.show,
          showLoading = this.showLoading;

      var stInterval = parseInt(interval);
      clearTimeout(this.tid);
      if (show) {
        if (showLoading) {
          return;
        }
        if (stInterval === 0) {
          this.showLoading = true;
        } else {
          this.tid = setTimeout(function () {
            _this.showLoading = true;
          }, stInterval);
        }
      } else {
        this.showLoading = false;
      }
    }
  }
};

/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.compareVersion = compareVersion;
exports.isTrip = isTrip;
exports.isAndroid = isAndroid;
exports.isWeb = isWeb;
exports.getPageHeight = getPageHeight;
/**
 * Created by Tw93 on 2017/6/26.
 */

function compareVersion() {
  var currVer = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "0.0.0";
  var promoteVer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "0.0.0";

  if (currVer === promoteVer) return true;
  var currVerArr = currVer.split(".");
  var promoteVerArr = promoteVer.split(".");
  var len = Math.max(currVerArr.length, promoteVerArr.length);
  for (var i = 0; i < len; i++) {
    var proVal = ~~promoteVerArr[i];
    var curVal = ~~currVerArr[i];
    if (proVal < curVal) {
      return true;
    } else if (proVal > curVal) {
      return false;
    }
  }
  return false;
}

function isTrip() {
  var appName = weex.config.env.appName;

  return appName === 'LX';
}

function isAndroid() {
  var platform = weex.config.env.platform;

  return platform.toLowerCase() === 'android';
}

function isWeb() {
  var platform = weex.config.env.platform;

  return (typeof window === "undefined" ? "undefined" : _typeof(window)) === 'object' && platform.toLowerCase() === 'web';
}

function getPageHeight() {
  var env = weex.config.env;

  var navHeight = isWeb() ? 0 : 130;
  return env.deviceHeight / env.deviceWidth * 750 - navHeight;
}

/***/ }),
/* 87 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    attrs: {
      "hackShow": _vm.needShow
    }
  }, [(_vm.showLoading) ? _c('div', {
    staticClass: ["wxc-loading"],
    style: {
      top: _vm.topPosition + 'px'
    }
  }, [_c('div', {
    class: ['loading-box', _vm.loading.class]
  }, [_c('image', {
    staticClass: ["loading-trip-image"],
    attrs: {
      "src": _vm.loading.url,
      "resize": "contain",
      "quality": "original"
    }
  }), (_vm.showText) ? _c('text', {
    staticClass: ["loading-text"]
  }, [_vm._v(_vm._s(_vm.hackText) + " ")]) : _vm._e()])]) : _vm._e()])
},staticRenderFns: []}
module.exports.render._withStripped = true

/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = __webpack_require__(89);

Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_index).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = []

/* script */
__vue_exports__ = __webpack_require__(90)

/* template */
var __vue_template__ = __webpack_require__(91)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.__file = "/Users/Tw93/www/github/weex-ui/packages/wxc-part-loading/index.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__.style = __vue_options__.style || {}
__vue_styles__.forEach(function (module) {
  for (var name in module) {
    __vue_options__.style[name] = module[name]
  }
})
if (typeof __register_static_styles__ === "function") {
  __register_static_styles__(__vue_options__._scopeId, __vue_styles__)
}

module.exports = __vue_exports__


/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _icon = __webpack_require__(7);

module.exports = {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    width: {
      type: [Number, String],
      default: 36
    },
    height: {
      type: [Number, String],
      default: 36
    }
  },
  data: function data() {
    return {
      PART: _icon.PART
    };
  },
  computed: {
    loadingStyle: function loadingStyle() {
      var height = this.height,
          width = this.width;

      return {
        height: height + 'px',
        width: width + 'px'
      };
    }
  }
}; //
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/***/ }),
/* 91 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [(_vm.show) ? _c('image', {
    style: _vm.loadingStyle,
    attrs: {
      "src": _vm.PART,
      "resize": "contain",
      "quality": "original"
    }
  }) : _vm._e()])
},staticRenderFns: []}
module.exports.render._withStripped = true

/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = []

/* styles */
__vue_styles__.push(__webpack_require__(93)
)

/* script */
__vue_exports__ = __webpack_require__(94)

/* template */
var __vue_template__ = __webpack_require__(96)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.__file = "/Users/Tw93/www/github/weex-ui/packages/wxc-minibar/index.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-6c3a719b"
__vue_options__.style = __vue_options__.style || {}
__vue_styles__.forEach(function (module) {
  for (var name in module) {
    __vue_options__.style[name] = module[name]
  }
})
if (typeof __register_static_styles__ === "function") {
  __register_static_styles__(__vue_options__._scopeId, __vue_styles__)
}

module.exports = __vue_exports__


/***/ }),
/* 93 */
/***/ (function(module, exports) {

module.exports = {
  "wxc-minibar": {
    "width": 750,
    "height": 90,
    "flexDirection": "row",
    "justifyContent": "space-between",
    "alignItems": "center",
    "backgroundColor": "#009ff0"
  },
  "left": {
    "width": 90
  },
  "middle-title": {
    "fontSize": 30,
    "color": "#ffffff",
    "height": 36,
    "lineHeight": 34
  },
  "right": {
    "width": 80
  },
  "left-button": {
    "width": 21,
    "height": 36,
    "marginLeft": 40
  },
  "right-button": {
    "width": 32,
    "height": 32,
    "marginRight": 16
  },
  "right-text": {
    "width": 80,
    "marginRight": 20,
    "fontSize": 28,
    "textAlign": "left",
    "color": "#ffffff"
  }
}

/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

var icon = __webpack_require__(95);
var Navigator = weex.requireModule('navigator');

module.exports = {
  props: {
    backgroundColor: {
      type: String,
      default: '#FFC900'
    },
    leftButton: {
      type: String,
      default: icon.iconArrow
    },
    textColor: {
      type: String,
      default: '#3D3D3D'
    },
    rightButton: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: '阿里旅行'
    },
    rightText: {
      type: String,
      default: ''
    },
    useDefaultReturn: {
      type: Boolean,
      default: true
    },
    show: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    leftButtonClicked: function leftButtonClicked() {
      var self = this;
      if (self.useDefaultReturn) {
        Navigator.pop({}, function (e) {});
      }
      self.$emit('minibarLeftButtonClick', {});
    },
    rightButtonClicked: function rightButtonClicked() {
      var self = this;
      if (self.rightText || self.rightButton) {
        self.$emit('minibarRightButtonClick', {});
      }
    }
  }
};

/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Created by Tw93 on 2016/10/29.
 */
module.exports = {
  iconArrow: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAkCAMAAABR74GsAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAhUExURUxpcTw8PD09PQAAADw8PDw8PDMzMz09PTw8PDw8PD09PWFW+gwAAAAKdFJOUwCAoAJ4/gWX8prBgCgwAAAAMElEQVQoz2NgQAcsHJwYYgyMXFysbFgEudixCTIxjwqSIYhDdFSYKsLsRKZqSA4AAKEHBO9H54HuAAAAAElFTkSuQmCC"
};

/***/ }),
/* 96 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return (_vm.show) ? _c('div', {
    staticClass: ["wxc-minibar"],
    style: {
      backgroundColor: _vm.backgroundColor
    }
  }, [_c('div', {
    staticClass: ["left"],
    on: {
      "click": _vm.leftButtonClicked
    }
  }, [_c('image', {
    staticClass: ["left-button"],
    attrs: {
      "src": _vm.leftButton
    }
  })]), _c('text', {
    staticClass: ["middle-title"],
    style: {
      color: _vm.textColor
    }
  }, [_vm._v(_vm._s(_vm.title))]), _c('div', {
    staticClass: ["right"],
    on: {
      "click": _vm.rightButtonClicked
    }
  }, [(_vm.rightText) ? _c('text', {
    staticClass: ["right-text"],
    style: {
      color: _vm.textColor
    }
  }, [_vm._v(_vm._s(_vm.rightText))]) : _vm._e(), (_vm.rightButton) ? _c('image', {
    staticClass: ["right-button"],
    attrs: {
      "src": _vm.rightButton
    }
  }) : _vm._e()])]) : _vm._e()
},staticRenderFns: []}
module.exports.render._withStripped = true

/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = __webpack_require__(98);

Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_index).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = []

/* styles */
__vue_styles__.push(__webpack_require__(99)
)

/* script */
__vue_exports__ = __webpack_require__(100)

/* template */
var __vue_template__ = __webpack_require__(108)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.__file = "/Users/Tw93/www/github/weex-ui/packages/wxc-lottery-rain/index.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-2b6e320f"
__vue_options__.style = __vue_options__.style || {}
__vue_styles__.forEach(function (module) {
  for (var name in module) {
    __vue_options__.style[name] = module[name]
  }
})
if (typeof __register_static_styles__ === "function") {
  __register_static_styles__(__vue_options__._scopeId, __vue_styles__)
}

module.exports = __vue_exports__


/***/ }),
/* 99 */
/***/ (function(module, exports) {

module.exports = {
  "wxc-lottery-rain": {
    "position": "absolute",
    "top": 0,
    "left": 0,
    "right": 0,
    "bottom": 0,
    "backgroundColor": "rgba(133,11,11,0.8)"
  }
}

/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _rainItem = __webpack_require__(101);

var _rainItem2 = _interopRequireDefault(_rainItem);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  components: { RainItem: _rainItem2.default },
  props: {
    picList: Array,
    config: Object,
    wrapStyle: Object
  },
  methods: {
    wxcLotteryRainCaught: function wxcLotteryRainCaught(e) {
      this.$emit('wxcLotteryRainCaught', { rainId: e.rainId });
    },
    destroy: function destroy() {
      var picList = this.picList;

      var length = picList.length;
      for (var i = 0; i < length; i++) {
        this.$refs['rain-item-' + i][0].destroy();
      }
    }
  }
}; //
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = []

/* styles */
__vue_styles__.push(__webpack_require__(102)
)

/* script */
__vue_exports__ = __webpack_require__(103)

/* template */
var __vue_template__ = __webpack_require__(107)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.__file = "/Users/Tw93/www/github/weex-ui/packages/wxc-lottery-rain/rain-item.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-007dc12e"
__vue_options__.style = __vue_options__.style || {}
__vue_styles__.forEach(function (module) {
  for (var name in module) {
    __vue_options__.style[name] = module[name]
  }
})
if (typeof __register_static_styles__ === "function") {
  __register_static_styles__(__vue_options__._scopeId, __vue_styles__)
}

module.exports = __vue_exports__


/***/ }),
/* 102 */
/***/ (function(module, exports) {

module.exports = {
  "rain-item": {
    "position": "absolute",
    "opacity": 0
  }
}

/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

var Ani = __webpack_require__(104);
var Region = __webpack_require__(105);
var CFG = __webpack_require__(106);

exports.default = {
  props: {
    src: String,
    rainId: [String, Number],
    config: {
      type: Object,
      default: function _default() {
        return {};
      }
    }
  },
  computed: {
    // 合并用户配置和默认
    cfg: function cfg() {
      return _extends({}, CFG.DEFAULT, this.config);
    }
  },
  data: function data() {
    return {
      showItem: false,
      hiding: false,
      pos: {},
      showTimer: null,
      hideTimer: null,
      intervalTimer: null
    };
  },
  created: function created() {
    var _cfg = this.cfg,
        width = _cfg.width,
        height = _cfg.height;

    this.pos = Region.get(width, height);
  },
  mounted: function mounted() {
    this.start();
  },

  methods: {
    start: function start() {
      var _this = this;

      var cfg = this.cfg;

      var random = Math.round(Math.random() * cfg.randomTime);
      var showTime = cfg.showTime + random;
      var intervalTime = Math.max(cfg.intervalTime, cfg.showAniTime + showTime + cfg.hideAniTime) + random;

      this.onShow = function () {
        _this.hideTimer = setTimeout(function () {
          _this.hide();
        }, showTime);
      };

      this.onHide = function () {
        Region.remove(_this.pos);
        _this.pos = {};
        _this.showItem = false;
        _this.hiding = false;
        var _cfg2 = _this.cfg,
            width = _cfg2.width,
            height = _cfg2.height;

        _this.pos = Region.get(width, height);
      };

      this.showTimer = setTimeout(function () {
        _this.show();
      }, random);

      this.intervalTimer = setInterval(function () {
        _this.show();
      }, intervalTime);
    },
    hide: function hide() {
      var cfg = this.cfg,
          rainId = this.rainId;

      this.hiding = true;
      clearTimeout(this.showTimer);
      clearTimeout(this.hideTimer);
      Ani.hidePig(this.$refs['rain-item-' + rainId], cfg.hideAniTime, this.onHide);
    },
    show: function show() {
      var cfg = this.cfg,
          rainId = this.rainId;

      this.showItem = true;
      Ani.showPig(this.$refs['rain-item-' + rainId], cfg.showAniTime, this.onShow);
    },
    caught: function caught() {
      var _this2 = this;

      var rainId = this.rainId,
          hiding = this.hiding;

      if (hiding) return;
      clearTimeout(this.showTimer);
      clearTimeout(this.hideTimer);
      Ani.shakePig(this.$refs['rain-item-' + rainId], function () {
        _this2.hide();
      });
      this.$emit('wxcLotteryRainCaught', { rainId: rainId });
    },
    destroy: function destroy() {
      Region.remove(this.pos);
      clearTimeout(this.showTimer);
      clearTimeout(this.hideTimer);
      clearInterval(this.intervalTimer);
      this.showItem = false;
    }
  }
};

/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.showPig = showPig;
exports.hidePig = hidePig;
exports.shakePig = shakePig;
/**
 * Created by Tw93 on 2017/09/06.
 * 红包雨动画类
 */

var animation = weex.requireModule('animation');
var Util = __webpack_require__(9);
var isIos = Util.isIOS();

function showPig(ref, duration, callback) {
  ref && animation.transition(ref, {
    styles: {
      transform: 'translate(0, -140px)',
      opacity: 1
    },
    duration: duration,
    timingFunction: 'ease-in'
  }, function () {
    callback && callback();
  });
}

function hidePig(ref, duration, callback) {
  ref && animation.transition(ref, {
    styles: {
      transform: 'translate(0, 0)',
      opacity: 0
    },
    duration: duration,
    timingFunction: 'ease-out'
  }, function () {
    callback && callback();
  });
}

function shakePig(ref, callback) {
  var duration = isIos ? 20 : 10;
  ref && animation.transition(ref, {
    styles: {
      transform: 'rotate(12deg) translate(0, -140px)'
    },
    duration: duration,
    timingFunction: 'ease-in'
  }, function () {
    animation.transition(ref, {
      styles: {
        transform: 'rotate(0) translate(0, -140px)'
      },
      duration: duration,
      timingFunction: 'ease-out'
    }, function () {
      animation.transition(ref, {
        styles: {
          transform: 'rotate(-12deg) translate(0, -140px)'
        },
        duration: duration,
        timingFunction: 'ease-in'
      }, function () {
        animation.transition(ref, {
          styles: {
            transform: 'rotate(0) translate(0, -140px)'
          },
          duration: duration,
          timingFunction: 'ease-out'
        }, function () {
          callback && callback();
        });
      });
    });
  });
}

/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Created by Tw93 on 2017/09/06.
 * 红包雨区域检测类
 */

var Util = __webpack_require__(9);

var Region = {
  regions: [],
  isCross: function isCross(region) {
    var regions = this.regions;


    region.right = region.left + region.width;
    region.bottom = region.top + region.height;

    for (var i = 0; i < regions.length; i++) {
      var curRegion = regions[i];
      // 两区域相交
      curRegion.right = curRegion.left + curRegion.width;
      curRegion.bottom = curRegion.top + curRegion.height;
      if (!(region.left > curRegion.right || region.right < curRegion.left || region.bottom < curRegion.top || region.top > curRegion.bottom)) {
        return true;
      }
    }
    return false;
  },
  get: function get(width, height) {
    if (!width || !height) {
      return;
    }
    var i = 1000;
    var viewWidth = 750;
    var viewHeight = Util.getPageHeight();
    var wrapWidth = viewWidth - width;
    var wrapHeight = viewHeight - height - 140;
    wrapHeight = wrapHeight < 0 ? 0 : wrapHeight;
    wrapWidth = wrapWidth < 0 ? 0 : wrapWidth;

    var region = {
      left: -9999,
      top: -9999,
      width: width,
      height: height
    };
    while (i--) {
      region.left = Math.round(Math.random() * wrapWidth);
      region.top = Math.round(Math.random() * wrapHeight + height);
      if (!this.isCross(region)) {
        this.add(region);
        return region;
      }
    }
  },
  buildRandom: function buildRandom() {
    var random = new Date().getTime() + '_' + parseInt(Math.random() * 1000000);
    return random;
  },
  add: function add(region) {
    var regions = this.regions;

    region.id = this.buildRandom();
    regions.push(region);
  },
  remove: function remove(region) {
    var regions = this.regions;

    if (!region) return;
    for (var i = 0; i < regions.length; i++) {
      if (region.id === regions[i].id) {
        regions.splice(i, 1);
      }
    }
  }
};
module.exports = Region;

/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var DEFAULT = exports.DEFAULT = {
  intervalTime: 400,
  hideAniTime: 300,
  showAniTime: 300,
  showTime: 400,
  randomTime: 300,
  width: 241,
  height: 206
};

/***/ }),
/* 107 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return (_vm.showItem && _vm.src) ? _c('image', {
    ref: ("rain-item-" + _vm.rainId),
    staticClass: ["rain-item"],
    style: _vm.pos,
    attrs: {
      "src": _vm.src
    },
    on: {
      "click": _vm.caught
    }
  }) : _vm._e()
},staticRenderFns: []}
module.exports.render._withStripped = true

/***/ }),
/* 108 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: ["wxc-lottery-rain"],
    style: _vm.wrapStyle
  }, _vm._l((_vm.picList), function(src, i) {
    return _c('rain-item', {
      key: "i",
      ref: ("rain-item-" + i),
      refInFor: true,
      attrs: {
        "src": src,
        "rainId": i
      },
      on: {
        "wxcLotteryRainCaught": _vm.wxcLotteryRainCaught
      }
    })
  }))
},staticRenderFns: []}
module.exports.render._withStripped = true

/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = __webpack_require__(110);

Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_index).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = []

/* styles */
__vue_styles__.push(__webpack_require__(111)
)

/* script */
__vue_exports__ = __webpack_require__(112)

/* template */
var __vue_template__ = __webpack_require__(115)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.__file = "/Users/Tw93/www/github/weex-ui/packages/wxc-noticebar/index.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-1747c08c"
__vue_options__.style = __vue_options__.style || {}
__vue_styles__.forEach(function (module) {
  for (var name in module) {
    __vue_options__.style[name] = module[name]
  }
})
if (typeof __register_static_styles__ === "function") {
  __register_static_styles__(__vue_options__._scopeId, __vue_styles__)
}

module.exports = __vue_exports__


/***/ }),
/* 111 */
/***/ (function(module, exports) {

module.exports = {
  "wxc-noticebar": {
    "width": 750,
    "paddingTop": 10,
    "paddingBottom": 10,
    "paddingLeft": 24,
    "backgroundColor": "#FFF7D6",
    "borderBottomWidth": 1,
    "borderTopWidth": 1,
    "borderColor": "#FFEEAE",
    "borderStyle": "solid",
    "flexDirection": "row",
    "justifyContent": "space-between",
    "alignItems": "center"
  },
  "noticebar-content": {
    "color": "#EE9900",
    "fontSize": 26,
    "lineHeight": 36,
    "width": 592,
    "textOverflow": "ellipsis"
  },
  "more-click-content": {
    "width": 64,
    "alignItems": "center",
    "justifyContent": "center"
  },
  "mode-icon": {
    "width": 32,
    "height": 32
  },
  "type-icon": {
    "width": 32,
    "height": 32
  }
}

/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

var icon = __webpack_require__(113);
var Utils = __webpack_require__(114);

module.exports = {
  props: {
    notice: {
      type: String,
      default: ''
    },
    noticeUrl: {
      type: String,
      default: ''
    },
    mode: {
      type: String,
      default: ''
    },
    lines: {
      type: [Number, String],
      default: 1
    },
    type: {
      type: String,
      default: ''
    },
    spm: {
      type: String,
      default: ''
    }
  },
  computed: {
    contentWidth: function contentWidth() {
      return this.mode ? 605 : 683;
    },
    modeIcon: function modeIcon() {
      var modeIcon = void 0;
      switch (this.mode) {
        case 'link':
          modeIcon = icon.linkIcon;
          break;
        case 'closable':
          modeIcon = icon.closeIcon;
          break;
        default:
          modeIcon = '';
      }
      return modeIcon;
    },
    typeIcon: function typeIcon() {
      var typeIcon = void 0;
      switch (this.type) {
        case 'success':
          typeIcon = icon.successIcon;
          break;
        case 'error':
          typeIcon = icon.errorIcon;
          break;
        case 'info':
          typeIcon = icon.infoIcon;
          break;
        case 'question':
          typeIcon = icon.questionIcon;
          break;
        case 'warn':
          typeIcon = icon.warnIcon;
          break;
        case 'time':
          typeIcon = icon.timeIcon;
          break;
        case 'redbag':
          typeIcon = icon.redbag;
          break;
        default:
          typeIcon = '';
      }
      return typeIcon;
    }
  },
  data: function data() {
    return {
      show: true
    };
  },
  methods: {
    noticeBarClicked: function noticeBarClicked() {
      var mode = this.mode,
          noticeUrl = this.noticeUrl,
          spm = this.spm;

      if (mode === 'link' && noticeUrl) {
        var ttid = weex.config.env.ttid;

        Utils.goToH5Page(noticeUrl, spm, ttid, true);
        this.$emit('wxcNoticebarLinkClicked', { url: noticeUrl });
      }
    },
    noticeIconClicked: function noticeIconClicked() {
      var mode = this.mode;

      if (mode === 'closable') {
        this.show = false;
        this.$emit('wxcNoticebarCloseClicked', {});
      } else {
        this.noticeBarClicked();
      }
    }
  }
};

/***/ }),
/* 113 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Created by Tw93 on 2016/10/29.
 */
module.exports = {
  closeIcon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAiklEQVR42u3Uuw2DQBBF0VeCS6AEujWQ4Ab5dADa1JIDfCyLYF5CxJ4bTWq1226b0v/srTmPyz+sY45lyKz4MubV3vr6xxahePumzSMc9wjHPcJxj3DcIxz3CMc9AnGPQNwD8Fj5hYNj5Xj8YjoOEY5DhOMQ4ThEOA4Rjv8tYnume8cxYk+tVvuwE8W1BhjijgxwAAAAAElFTkSuQmCC",

  linkIcon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAaUlEQVR42u2XsQ2AMAwEbwRGYjRGoCOu4k0YgUkSRgClywLECvprXN5VLxkxDffBShTF8Go8JZFjAhJ7C4iNMFwRilCEIuaKMDZGcmeWmjj7gLFy4+rkLrnkkkv+5cR62Ma3G/uYiD/yAlUn8FXOOtT+AAAAAElFTkSuQmCC",

  infoIcon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAByUlEQVR42sVX7U3DMBC9ERihI7ABbAAb0A1gA9iA/iPmT9mg3YBu0GzQLNC6G4R7yC8KOQlybmIsWYmS3Pe754t4VnyX6xjk+RRkc6rkU68RO91v8A7fyJQrruUKitXIQY20Yza+hQxkLzNeyWOKkorrYyUrVX4f3+SWBnCve4l3+l3Tcybq80VW1CmtNLyFkbHycFDldpBlSbzGme4zlEmRReNB9kw3U1xsMe2ljbNuT0z7jMYJ2IVJPdHuARvKhayJY7E7fgR5DPKCF3r9yFDWemTYHbDZr/3BGT3lamxvCUhWwwd1MbCDrMgRTD9YTAqtxJgtgN/VxEs4BCF2RicsybB0wNTfD0I/DmC7AyDaopQDqD0d6JSQHIo7APT/ZwkKY8CC0LRhCQfAuGxDw0wFHIBcJBEZZsp2wF//xhxGmSdbmzNzAAfD4/jsZUQAGEDyzIpm5jBZ4Fk98QLPQPevQSKa5MQeTsw0a27/mojrqZxg5I5B1zgRTbr8hBNHGLdOsBzsDtePSSV3RDtHPejMjaDp//OpslcYUM64gVJwx/d9kAdl0/XgH7JBBi8GEDqEZRm5G8jIHK0E/k5cvuNQSj7AOy+bfgEoV4MBqNi7tQAAAABJRU5ErkJggg==",

  warnIcon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABXklEQVR42u1W7WnDMBR8I3SEjNARPEJH8AjdIBmh/2rnT7pBs0G9QbJBvUArb9Dq4B0UmwMb+ZkG8kAgyUjv7n2cbHe7Wftq7fDd2CdGam2/vfPWfv4O7NkWll5tR6eZ+VNe11zjm0VbDvnZGb9xD3PuRbOvnO0AtqOoDB6FKo59ax3zLeuisY8o9sx1n0724Om45vUFc+whCqyNCPa9h7jmHotvDBKtGdJ2YIy1AkCga7YlQ5tYYBLAtFATzpazb+zFL+yw1gCmxYqzq4kO5jMAiHMFbacFRgOgOPn392LRQS6XAsCZInFCxatq1gC0OBWKznIAjMJIP+a1HYRkdEhGCWMOGdwpyMi3vjNhAemUolNuWpx06+DNn6MR/CXDfHFLl4oHU+Wv33ORqJH9EvlMR3v0Cu8FYCHrIgoCXdj/pAQAZhZkuJt+ZHiih0wz2sNBDIHOB/iAL7vbf7FfHwI9GrUaFUcAAAAASUVORK5CYII=",

  successIcon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAB00lEQVR42r2X4VHDMAyFNQIjMAIbwAYwQjcgG8AG8I+EP7BB2YBsUDZoFmidDYq/u8jnq6CJncS+812ayHqypPdqS8pw73LjGnk6NrI91vLt557JM+/4ho0sOdyHXOEYIA9ymjKxZQ1r54HX8ugdush5d6jl1Tt/cG9y5+c1IMPz5tDIJzaRvcMma9ekNHLUAjJ1PbasYS0lyQHfDcA9u5UCw4LX8qPpKzboZgUnmKLgrpFK077mzrV5Teq12zGQFUdgR5xhT59n7XZZeSg7wIxrvy+xey2BilWQVxWZhZm0vZCFTjUipB+FWwp8rJxgYUPjh5ogOMuAj9MYrMHuKwRAbdYFt30AdmjAkc7dAoDjueAMdCAEgPDw49JCHGOjQeSD2wBGS6BA50HkgdsSmCacGkQmuAaw0SY0NEwIIgPc0jAWol1Cx7fMRHCjvGAHZSolxZTaKK+WgfNAqTMH6T9Pa6/NWGD3PZj/HUhcam0TuO8ubhJa/CU4hf6kLNdzj2b5Um2DcDBjZs2dAU/g+knZkXox0W5XxcNn7km5j+98nrIvrpZ7LyK3OKVMPPOOb2d3yB7ZXeJyWqlYTZwd2rI0m/R6Xg1saakrk2feAZp6F/wF56nCjOMHayAAAAAASUVORK5CYII=",

  errorIcon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAB4UlEQVR42r1X7U3DMBC9ERghI7ABbEBHYAPYADaAfyT9AxskG5AN0g2aBVpnA/CT/CLrFQkfIbFk1WrO9+7j3dk2zwh7uw6NPZ0ba8+1fWLGdUi/Lb5Bxv5zhHe7guIIcowgXyUTstiDvcvAa3uAh5ny8VTba1S+C292G2cFkLS+PzX2AZlMPkDmT14jpJmiHiCl+2Eg9mAvU+IFHxLwBGW2yVDw2g4M32YDbCY4CbTFYN4eGfY1wUnei9CT7STbWmOujtzJWD7PZLutPFgdiHie++MW3jMFbFbzH2wyhSQdhCNaQW1BFMbkcDWHHx2uwIADZGmEgpemEVhMQ56TXUmfUCMI7ilftO0k35m2TK8RTnBNe28sP370GuEF57E+G0AlDgWSc+WE34DeU4Kac+GEOwVuEmrOlRNeErrKUMF/4gR6xW96cHFhGeb5GAr6QKfgagRkChwJrDzpTNu1YmDKYcTwbXPnAA+UXBPJuBY4dPPOYRwaBZ7VK4S+gm7x/pJkvpr2Ny5UgOuwWQruPazUiADWLsx5EPAyq9khWR0eQyBLtrPjCbjrpjzlb76Yw5dQ213Y2w2UglxY4z98kzfkBMItziEqhM2qcI4w3uG163mOqPSYiStjWnf45n0LfgON7uEBnQHWwwAAAABJRU5ErkJggg==",

  questionIcon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACDklEQVR42r2X700CQRDFpwRLsAQ7kA60A+lAO9AO5BuHX7AD6IDrADqQBmDtAPeX8HKXTdjZ5Q43mYTczd83b+YWqzlhbvehsddDY8tjY5u+HBb2yTt0bMwTlnYXFvYeg/wcF3YqlG20eRkefG7TJPBvrPSb51EmiUx5h470sY2JPF9VNTD3ArcEKbUnaLTZyx5fVcGBUBXjbBCCHSJbfJcHb2w3BqHClz0IDXxnlWPQtYKTzJhEJolsO4BLsKtyh5ybqBvOJF2Fxp48JNQOtTXNMPBSZPNadEFW6GTI+abpsP6J4/Mhtjst2vVQmlIVaOGYZ0oi50OtwD59qOrdFlGlB3F+REXIzpAHe696OfcgZiHlfClR0BP8sHPmGJ2QXI9xqB7nfJEgeiRs9F3wewggznRMPDSFlIr2E6jffCCwLky07Qg4cPFolMWTGyXgfzXVptIEBrUA0iWLqaWQf0tAtqCoxaJTSkJ3DAeOpj+GWkT08BoEHMb7i6i/iknGbnyYkJSsagMPN3bjQ2B9jNIZFiyTGmc1SRNUpL3IzCiBhGpIWHE1C6o+eyXTBbIQgXXNRZcJyCritDSJ8sq7i26ZQZdEgBMDGR+qL7ooqh2ajppE0MUGW8FejaaImf7V4k9oROkRYZEg/OZWzDt9lCpWtI8Ge0LLqlD22NjYB37g+NyelkD0VisZxGq36R/zARfV9nDdlgAAAABJRU5ErkJggg==",

  timeIcon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAABvElEQVR42sWXv0rEQBDGB0XBTuwEQSGbp7DR3lb0CWzs7Q7yBB4cXHLPIPoOVlYWHmhlYWF1brRWRHR/mpGTNZdcwpKBgfyZbz5mM/vtROrY9ZEs2Szey0fxIB+ZK5uZibt+w7nmGe+IIVba2kN/a9UlTuwoti7xZx0nFgzYRqRPw+iAajShq2bsvOee7dj+5vpdIss41zzjHTEaD5YctQnP9mXRgdKpBJeTLNquiycWzBQ+JWclqQu++AZl8XuemmNpaGDJ8ZPLnM8kLyol8MUOo11paeQgl1ZeQhodaqWzSB9PN1ZoHhd3UpdcK+ebe92rjVSxvBCvFd/veZ5l14b70+1UoI3kw9oTY9pwcP2Kg+5TOjIUMbl1n8MpqE2xT28ICEWM6T6HU5C64qYXmhgOsHAKOssN6hOaGA6wcIp2M9IXmhgO7W7hhOEG3Q1NDAdYODsjbr7Umflw2Pv/3H3D26qlbt5c5U6u1zL51OaaezsliSw4zTWzfDIwUdV2mhaQsQQzX0B8yQxivmT6h0QY8w+J+seib62PRR3uvEGgtfmDQNejjz/sMZiFHva6H2+7H+i7/4UJ/9P2Bb6l6yB4ISjfAAAAAElFTkSuQmCC",

  redbag: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACJUlEQVR42u1WPWgUURB+MVEJIWIQMUUKtUuj2Fh5FoZ9u5uDwxQbCPt2PU85sYhgb3FNQtJ6hcUZQrqQLhwhRARFMcEqpEg4GysFkQQOTvwJ0fF7e8fTg929PXLLNjfwsbPvzex8M2+Yt6wrXSGiHnJ4noT2lmx+QLZGsULw33h+RrwSuRPnGJSi3EgEQltjUGoJEvjBpJIkWBtsV0kYUyT4xxCblyT0SdhUOk0AMMYYBA17CYE++QafNk8zCPSZGCrANyifP1knkR7F+9d/+3wTxAa8PdsckQQ7TEBluUIrVq8XyDWvYa2K4NuUvX3WW7ufuQCbD+31QNa4iHNLI6MX0Zz0RTk76iT063TXPO/pD9ND+MZOxET2UbFH5BpX2P+CxacRP1Bs8stlBlGJ9xGzrlIufZn5iWwiGHwP6IEKCC4oIHvlJ3QX+88bWJIZhpCfY2ECgz2f4D/RXGdYRAEhI5CAw+8FO2bHh+Ws9nV0jRtt3C1PQipQ8ndEJ8sLqcX51RQEX/f8CtYp6N8U1BEGgR+Ry00VGE42OntenVuw4yzd4TcVhH5VZSz0lILDb8G23CKRP7BZRswHLOqlQYVCXxs9kIpjED0DJhQQhEFA7ETTuqNZIPyqMwTCq/Ja9YDffvwE+LvG8BpIiIB2SI4xDiKF4xL4AlBCqKr5nwx4mdFjqx/l3Erif1DdhvJHQ45PLO7KIRFz1r9I8DfeZdaVrkD+Amv10kibNVl3AAAAAElFTkSuQmCC"
};

/***/ }),
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Created by Tw93 on 2017/6/26.
 */
var UrlParser = __webpack_require__(0);
var Utils = {
  UrlParser: UrlParser,
  appendProtocol: function appendProtocol(url) {
    if (/^\/\//.test(url)) {
      var bundleUrl = weex.config.bundleUrl;

      return 'http' + (/^https:/.test(bundleUrl) ? 's' : '') + ':' + url;
    }
    return url;
  },
  encodeURLParams: function encodeURLParams(url) {
    var parsedUrl = new UrlParser(url, true);
    return parsedUrl.toString();
  },
  goToH5Page: function goToH5Page(jumpUrl) {
    var animated = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    var Navigator = weex.requireModule('navigator');
    var jumpUrlObj = new Utils.UrlParser(jumpUrl, true);
    var url = appendProtocol(jumpUrlObj.toString());
    Navigator.push({
      url: Utils.encodeURLParams(url),
      animated: animated
    }, callback);
  }
};
module.exports = Utils;

/***/ }),
/* 115 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [(_vm.show) ? _c('div', {
    staticClass: ["wxc-noticebar"],
    on: {
      "click": _vm.noticeBarClicked
    }
  }, [(_vm.typeIcon) ? _c('image', {
    staticClass: ["type-icon"],
    attrs: {
      "src": _vm.typeIcon
    }
  }) : _vm._e(), _c('text', {
    staticClass: ["noticebar-content"],
    style: {
      width: _vm.contentWidth + 'px',
      lines: _vm.lines
    }
  }, [_vm._v(_vm._s(_vm.notice))]), (_vm.modeIcon) ? _c('div', {
    staticClass: ["more-click-content"],
    attrs: {
      "mode": _vm.mode
    },
    on: {
      "click": _vm.noticeIconClicked
    }
  }, [_c('image', {
    staticClass: ["mode-icon"],
    attrs: {
      "src": _vm.modeIcon
    }
  })]) : _vm._e()]) : _vm._e()])
},staticRenderFns: []}
module.exports.render._withStripped = true

/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = __webpack_require__(117);

Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_index).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 117 */
/***/ (function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = []

/* styles */
__vue_styles__.push(__webpack_require__(118)
)

/* script */
__vue_exports__ = __webpack_require__(119)

/* template */
var __vue_template__ = __webpack_require__(121)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.__file = "/Users/Tw93/www/github/weex-ui/packages/wxc-page-calendar/index.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-c4e7920a"
__vue_options__.style = __vue_options__.style || {}
__vue_styles__.forEach(function (module) {
  for (var name in module) {
    __vue_options__.style[name] = module[name]
  }
})
if (typeof __register_static_styles__ === "function") {
  __register_static_styles__(__vue_options__._scopeId, __vue_styles__)
}

module.exports = __vue_exports__


/***/ }),
/* 118 */
/***/ (function(module, exports) {

module.exports = {
  "wxc-page-calendar": {
    "position": "fixed",
    "top": 0,
    "right": -750,
    "width": 750,
    "color": "#333333",
    "backgroundColor": "#ffffff"
  },
  "flex-item": {
    "flex": 1,
    "textAlign": "center"
  },
  "calendar-weekday": {
    "height": 60,
    "backgroundColor": "#ffffff",
    "borderBottomWidth": 1,
    "borderTopWidth": 1,
    "borderColor": "#e2e2e2",
    "flexDirection": "row",
    "justifyContent": "space-around",
    "alignItems": "center"
  },
  "weekday-text": {
    "color": "#000000",
    "flex": 1,
    "textAlign": "center"
  },
  "calendar-list": {
    "flexDirection": "column"
  },
  "calendar-month": {
    "height": 60,
    "justifyContent": "center",
    "alignItems": "center",
    "backgroundColor": "#f2f3f4"
  },
  "month-text": {
    "fontSize": 32
  },
  "calendar-row": {
    "height": 140,
    "flexDirection": "row",
    "borderBottomWidth": 1,
    "borderColor": "#f2f3f4",
    "alignItems": "center",
    "justifyContent": "space-between",
    "position": "relative"
  },
  "row-item": {
    "flex": 1,
    "height": 140,
    "background": "#ffffff",
    "borderWidth": 0,
    "paddingTop": 10,
    "paddingBottom": 10
  },
  "calendar-note": {
    "height": 36,
    "lineHeight": 36,
    "fontSize": 24,
    "color": "#000000",
    "textAlign": "center"
  },
  "calendar-item": {
    "justifyContent": "center",
    "alignItems": "center",
    "height": 120
  },
  "calendar-day": {
    "height": 48,
    "lineHeight": 48,
    "fontSize": 36,
    "color": "#000000",
    "textAlign": "center"
  },
  "calendar-ext": {
    "height": 36,
    "lineHeight": 36,
    "color": "#999999",
    "textAlign": "center",
    "fontSize": 24,
    "overflow": "hidden",
    "textOverflow": "ellipsis"
  },
  "calendar-holiday": {
    "color": "#FF5000"
  },
  "calendar-rest": {
    "color": "#FF5000"
  },
  "item-row-selected": {
    "color": "#ffffff",
    "backgroundColor": "#FFC900",
    "textAlign": "center"
  },
  "item-text-selected": {
    "color": "#3d3d3d",
    "textAlign": "center"
  },
  "calendar-disabled": {
    "color": "#CCCCCC"
  },
  "cell-disabled": {
    "backgroundColor": "#FBFBFB"
  },
  "calendar-day-include": {
    "backgroundColor": "#FFF7D6"
  }
}

/***/ }),
/* 119 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _util = __webpack_require__(120);

var Util = _interopRequireWildcard(_util);

var _wxcMinibar = __webpack_require__(8);

var _wxcMinibar2 = _interopRequireDefault(_wxcMinibar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var animation = weex.requireModule('animation'); //
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

var dom = weex.requireModule('dom');

module.exports = {
  components: { WxcMinibar: _wxcMinibar2.default },
  props: {
    selectedDate: Array,
    dateRange: {
      type: Array,
      required: true,
      default: function _default() {
        return [];
      }
    },
    minibarCfg: {
      type: Object,
      default: function _default() {
        return {
          'title': '选择日期',
          'background-color': '#FFC900',
          'text-color': '#3D3D3D'
        };
      }
    },
    selectedNote: {
      type: Array,
      default: function _default() {
        return ['开始', '到达', '往返'];
      }
    },
    isRange: {
      type: Boolean,
      default: false
    },
    needDestroy: {
      type: Boolean,
      default: false
    },
    descList: {
      type: Array,
      default: function _default() {
        return [];
      }
    }
  },
  data: function data() {
    return {
      isShow: false,
      reSelect: true,
      useDefaultReturn: false,
      showHeader: Util.isWeb(),
      today: Util.getToDay(),
      calendarHeight: 1040,
      pageHeight: 1334,
      departDate: '',
      arriveDate: ''
    };
  },
  computed: {
    monthsArray: function monthsArray() {
      var range = this.dateRange,
          today = this.today,
          departDate = this.departDate,
          arriveDate = this.arriveDate,
          selectedNote = this.selectedNote,
          descList = this.descList;

      var param = { range: range, today: today, departDate: departDate, arriveDate: arriveDate, selectedNote: selectedNote, descList: descList };
      return Util.generateDateCell(param);
    }
  },
  created: function created() {
    var self = this;
    var env = weex.config.env;
    self.pageHeight = env.deviceHeight / env.deviceWidth * 750;
    self.calendarHeight = self.pageHeight - (this.showHeader ? 100 : 120) - 60;
    self.detectShow();
  },

  methods: {
    minibarLeftButtonClick: function minibarLeftButtonClick() {
      var _this = this;

      setTimeout(function () {
        _this.hide();
        _this.$emit('wxcPageCalendarBackClicked', {});
      }, 100);
    },
    onClickDate: function onClickDate(datConfig) {
      var self = this;
      if (datConfig.disabled || datConfig.isEmpty) return;

      if (self.reSelect) {
        self.departDate = '';
        self.arriveDate = '';
        self.reSelect = false;
      }

      if (self.isRange) {
        if (self.departDate && Date.parse(self.departDate) <= Date.parse(datConfig.date)) {
          self.arriveDate = datConfig.date;
        } else {
          self.departDate = datConfig.date;
        }
        if (self.departDate && self.arriveDate) {
          self.dispatchDateChange([self.departDate, self.arriveDate]);
        }
      } else {
        self.departDate = datConfig.date;
        self.dispatchDateChange([self.departDate]);
      }
    },
    scrollToDate: function scrollToDate() {
      if (this.departDate) {
        var el = this.$refs.departDate[0];
        dom.getComponentRect && dom.getComponentRect(el, function (e) {
          if (e && e.result) {
            var bottom = e.size.bottom;
            var env = weex.config.env;
            // 误差

            var height = env.deviceHeight / env.deviceWidth * 750 - 50;
            if (bottom > height || bottom === 0) {
              dom.scrollToElement(el, { offset: -146, animated: false });
            }
          }
        });
      }
    },
    dispatchDateChange: function dispatchDateChange(dateArr) {
      var _this2 = this;

      setTimeout(function () {
        _this2.hide();
      }, 600);
      this.$emit('wxcPageCalendarDateSelected', {
        date: dateArr
      });
    },
    detectShow: function detectShow() {
      !this.needDestroy && (this.isShow = true);
      if (this.isRange && this.selectedDate.length >= 2) {
        this.departDate = this.selectedDate[0];
        this.arriveDate = this.selectedDate[1];
      } else if (this.selectedDate.length >= 1) {
        this.departDate = this.selectedDate[0];
        this.arriveDate = '';
      }
    },
    _animate: function _animate() {
      var width = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

      animation.transition(this.$refs.pageCalendar, {
        styles: {
          transform: 'translateX(' + -width + 'px)'
        },
        timingFunction: 'ease-out',
        duration: 300
      }, function () {});
    },
    show: function show() {
      var _this3 = this;

      this.needDestroy && (this.isShow = true);
      this.reSelect = true;
      this.detectShow();
      this._animate(750);
      // 防止没有渲染完成
      setTimeout(function () {
        _this3.scrollToDate();
      }, 1);
    },
    hide: function hide() {
      this.needDestroy && (this.isShow = false);
      this.reSelect = false;
      this._animate(0);
      this.$emit('wxcPageCalendarHide', {});
    }
  }
};

/***/ }),
/* 120 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports._getTraditionalHoliday = _getTraditionalHoliday;
exports._isDate = _isDate;
exports._checkHash = _checkHash;
exports.getTime = getTime;
exports._isInRange = _isInRange;
exports._isInSelectRange = _isInSelectRange;
exports._fixNum = _fixNum;
exports._isWeekend = _isWeekend;
exports._isToday = _isToday;
exports._getMonthDays = _getMonthDays;
exports._getPadding = _getPadding;
exports._unique = _unique;
exports.getToDay = getToDay;
exports.getWeekRows = getWeekRows;
exports.generateDateCell = generateDateCell;
exports.isWeb = isWeb;
//国际节日
var GLOBAL_HOLIDAY = exports.GLOBAL_HOLIDAY = {
  '01-01': '元旦',
  '02-14': '情人',
  '05-01': '劳动',
  '06-01': '儿童',
  '10-01': '国庆',
  '12-25': '圣诞'
};

//传统节日
var TRADITIONAL_HOLIDAY = {
  '除夕': ['2015-02-18', '2016-02-07', '2017-01-27', '2018-02-15', '2019-02-04', '2020-01-24'],
  '春节': ['2015-02-19', '2016-02-08', '2017-01-28', '2018-02-16', '2019-02-05', '2020-01-25'],
  '元宵': ['2015-03-05', '2016-02-22', '2017-02-11', '2018-03-02', '2019-02-19', '2020-02-08'],
  '清明': ['2015-04-05', '2016-04-04', '2017-04-04', '2018-04-05', '2019-04-05', '2020-04-04'],
  '端午': ['2015-06-20', '2016-06-09', '2017-05-30', '2018-06-18', '2019-06-07', '2020-06-25'],
  '中秋': ['2015-09-27', '2016-09-15', '2017-10-04', '2018-09-24', '2019-09-13', '2020-10-01'],
  '重阳': ['2015-10-21', '2016-10-09', '2017-10-28', '2018-10-17', '2019-10-07', '2020-10-25']
};

// 放假日
var REST_DAYS = ['2017-10-01', '2017-10-02', '2017-10-03', '2017-10-04', '2017-10-05', '2017-10-06', '2017-10-07', '2017-10-08'];

// 工作日
var WORK_DAYS = ['2017-09-30'];

function _getTraditionalHoliday() {
  var HOLIDAY_TEMP = {};

  var keys = Object.keys(TRADITIONAL_HOLIDAY);
  keys.forEach(function (k, index) {
    var arr = TRADITIONAL_HOLIDAY[k];
    arr.forEach(function (i) {
      HOLIDAY_TEMP[i] = k;
    });
  });

  return HOLIDAY_TEMP;
}

function _isDate(obj) {
  var type = obj == null ? String(obj) : {}.toString.call(obj) || 'object';
  return type == '[object date]';
}

/**
 * 检测Hash
 *
 * @method _checkHash
 * @private
 */
function _checkHash(url, hash) {
  return url && url.match(/#/) && url.replace(/^.*#/, '') === hash;
}
/**
 * 获取当前日期的毫秒数
 * @method getTime
 * @param {String} date
 * @return {Number}
 */
function getTime(date) {
  if (_isDate(date)) {
    return new Date(date).getTime();
  } else {
    try {
      return new Date(date.replace(/-/g, '/')).getTime();
    } catch (e) {
      return 0;
    }
  }
}

function _isInRange(range, date) {
  var start = getTime(range[0]),
      end = getTime(range[1]),
      date = getTime(date);
  return start <= date && end >= date;
}
function _isInSelectRange(range, date) {
  var start = getTime(range[0]),
      end = getTime(range[1]),
      date = getTime(date);
  return start < date && end > date;
}

function _fixNum(num) {
  return (num < 10 ? '0' : '') + num;
}
/**
 * 是否是周末
 * @method isWeekend
 * @param {String} date
 * @return {Boolean}
 */
function _isWeekend(date) {
  var day = new Date(date.replace(/-/g, '/')).getDay();
  return day === 0 || day === 6;
}

/**
 * 是否是今天
 * @method isToday
 * @param {String} date
 * @return {Boolean}
 */
function _isToday(_today, date) {
  return getTime(_today) === getTime(date);
}

/**
 * 检查是否是闰年
 * @method _checkLeapYear
 * @param {Number} y 年份
 * @param {Date} t today
 * @protected
 */
function _getMonthDays(y, t) {
  var MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  var y = y || t.getFullYear(),
      isLeapYear = false;

  if (y % 100) {
    isLeapYear = !(y % 4);
  } else {
    isLeapYear = !(y % 400);
  }

  if (isLeapYear) {
    MONTH_DAYS[1] = 29;
  } else {
    MONTH_DAYS[1] = 28;
  }
  return MONTH_DAYS;
}
/**
 * 当月1号前面有多少空格
 * @method _getPadding
 * @protected
 */
function _getPadding(year, month) {
  var date = new Date(year + '/' + month + '/1'),
      day = date.getDay();
  return day;
}

function _unique(array) {
  return Array.prototype.filter.call(array, function (item, index) {
    return array.indexOf(item) == index;
  });
}

function getToDay() {
  return new Date().getFullYear() + '-' + _fixNum(new Date().getMonth() + 1) + '-' + _fixNum(new Date().getDate());
}

function getWeekRows(y, m, today, dateRange, departDate, arriveDate, selectedNote, descList) {
  var monthDays = _getMonthDays(y, today);
  var padding = _getPadding(y, m, 7);
  var num = monthDays[m - 1] + padding;
  var rows = Math.ceil(num / 7);
  var remain = num % 7;
  var rowsData = [];

  for (var i = 1; i <= rows; i++) {
    var row = {
      index: i,
      cells: []
    };

    for (var j = 1; j <= 7; j++) {
      var cell = {};
      // 前后空格
      if (i === 1 && j <= padding || remain && i === rows && j > remain) {
        cell.isEmpty = true;
      } else {
        (function () {
          var d = (i - 1) * 7 + j - padding;
          var date = y + '-' + _fixNum(m) + '-' + _fixNum(d);
          var cls = [];
          var ref = '';
          var cellClass = [];
          var isInRange = _isInRange(dateRange, date);
          var disabled = false;
          var global = _fixNum(m) + '-' + _fixNum(d);
          var note = '';
          var ext = '';

          if (descList && descList.length > 0) {
            var nowDesc = descList.filter(function (item) {
              return item.date == date;
            });
            if (nowDesc && nowDesc.length > 0) {
              ext = nowDesc[0].value;
              if (nowDesc[0].emphasize) {
                cls.push('calendar-holiday');
              }
            }
          }

          // 国际节日
          if (GLOBAL_HOLIDAY[global]) {
            note = GLOBAL_HOLIDAY[global];
            cls.push('calendar-holiday');
          }

          var tHolidy = _getTraditionalHoliday()[date];

          // 传统节日
          if (tHolidy) {
            note = tHolidy;
            cls.push('calendar-holiday');
          }
          // 放假日
          if (REST_DAYS.indexOf(date) > -1) {
            cls.push('calendar-holiday');
          }

          // 工作日
          if (WORK_DAYS.indexOf(date) > -1) {
            cls.push('calendar-work');
          }

          // 周末
          if (_isWeekend(date)) {
            cls.push('calendar-holiday');
          }

          // 今天
          if (_isToday(today, date)) {
            cls.push('calendar-today');
            note = '今天';
          }

          // 不在日期范围内
          if (!isInRange) {
            disabled = true;
          }

          if (disabled) {
            cls = [];
            cls.push('calendar-disabled');
            cellClass.push('cell-disabled');
          }

          if (!ext && disabled && isInRange) {
            ext = '不可选';
          }

          if (departDate === date || arriveDate === date) {
            note = departDate === date ? selectedNote[0] : selectedNote[1];
            ref = departDate === date ? 'departDate' : 'arriveDate';
            if (departDate === arriveDate && selectedNote.length >= 3) {
              note = selectedNote[2];
            }
            cls.push('item-text-selected');
            cellClass.push('item-row-selected');
          }

          if (departDate && arriveDate && _isInSelectRange([departDate, arriveDate], date)) {
            cellClass.push('calendar-day-include');
          }

          cell = {
            isEmpty: false,
            ref: ref,
            cls: _unique(cls).join(' '),
            cellClass: _unique(cellClass).join(' '),
            note: note,
            date: date,
            ext: ext,
            disabled: disabled,
            year: y,
            month: m,
            day: d,
            text: d
          };
        })();
      }
      row.cells.push(cell);
    }

    rowsData.push(row);
  }

  return rowsData;
}

function generateDateCell(_ref) {
  var range = _ref.range,
      today = _ref.today,
      departDate = _ref.departDate,
      arriveDate = _ref.arriveDate,
      selectedNote = _ref.selectedNote,
      descList = _ref.descList;

  var start = new Date(range[0].replace(/-/g, '/'));
  var end = new Date(range[1].replace(/-/g, '/'));
  var startYear = start.getFullYear();
  var startMonth = start.getMonth() + 1;
  var startDate = start.getDate();
  var endYear = end.getFullYear();
  var endMonth = end.getMonth() + 1;
  var endDate = end.getDate();
  var i = 0;
  var l = (endYear - startYear) * 12 + endMonth - startMonth + 1;
  var y = startYear;
  var n = startMonth;
  var months = [];

  for (; i < l; i++) {
    if (n > 12) {
      n = 1;
      y++;
    }
    months.push({
      title: y + '-' + _fixNum(n),
      year: y,
      month: n,
      startDate: i === 0 ? startDate : false,
      endDate: i === l - 1 ? endDate : false,
      rowsData: getWeekRows(y, n, today, range, departDate, arriveDate, selectedNote, descList)
    });
    n++;
  }
  return months;
}

function isWeb() {
  var platform = weex.config.env.platform;

  return (typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && platform.toLowerCase() === 'web';
}

/***/ }),
/* 121 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    ref: "pageCalendar",
    staticClass: ["wxc-page-calendar"],
    style: {
      height: _vm.pageHeight + 'px'
    }
  }, [_c('wxc-minibar', _vm._b({
    attrs: {
      "show": _vm.showHeader,
      "useDefaultReturn": _vm.useDefaultReturn
    },
    on: {
      "minibarLeftButtonClick": _vm.minibarLeftButtonClick
    }
  }, 'wxc-minibar', _vm.minibarCfg, false)), (_vm.isShow) ? _c('div', {
    staticClass: ["calendar-weekday"]
  }, _vm._l((['日', '一', '二', '三', '四', '五', '六']), function(week, k) {
    return _c('text', {
      key: k,
      staticClass: ["flex-item", "weekday-text"]
    }, [_vm._v(_vm._s(week))])
  })) : _vm._e(), (_vm.isShow) ? _c('list', {
    staticClass: ["calendar-list"],
    style: {
      height: _vm.calendarHeight + 'px'
    }
  }, _vm._l((_vm.monthsArray), function(month, index) {
    return _c('cell', {
      key: index,
      appendAsTree: true,
      attrs: {
        "append": "tree"
      }
    }, [_c('div', {
      staticClass: ["calendar-month"]
    }, [_c('text', {
      staticClass: ["month-text"]
    }, [_vm._v(_vm._s(month.title))])]), _vm._l((month.rowsData), function(row, rowIndex) {
      return _c('div', {
        key: rowIndex,
        staticClass: ["calendar-row"]
      }, _vm._l((row.cells), function(cell, index) {
        return _c('div', {
          key: index,
          ref: cell.ref,
          refInFor: true,
          class: ['row-item', cell.cellClass],
          on: {
            "click": function($event) {
              _vm.onClickDate(cell)
            }
          }
        }, [(cell.isEmpty) ? _c('div') : _vm._e(), (!cell.isEmpty) ? _c('div', {
          staticClass: ["calendar-item"]
        }, [_c('text', {
          class: ['calendar-note', cell.cls]
        }, [_vm._v(_vm._s(cell.note))]), _c('text', {
          class: ['calendar-day', cell.cls]
        }, [_vm._v(_vm._s(cell.text))]), _c('text', {
          class: ['calendar-ext', cell.cls]
        }, [_vm._v(_vm._s(cell.ext))])]) : _vm._e()])
      }))
    })], 2)
  })) : _vm._e()], 1)
},staticRenderFns: []}
module.exports.render._withStripped = true

/***/ }),
/* 122 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = __webpack_require__(123);

Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_index).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 123 */
/***/ (function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = []

/* styles */
__vue_styles__.push(__webpack_require__(124)
)

/* script */
__vue_exports__ = __webpack_require__(125)

/* template */
var __vue_template__ = __webpack_require__(126)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.__file = "/Users/Tw93/www/github/weex-ui/packages/wxc-popup/index.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-0f235a2a"
__vue_options__.style = __vue_options__.style || {}
__vue_styles__.forEach(function (module) {
  for (var name in module) {
    __vue_options__.style[name] = module[name]
  }
})
if (typeof __register_static_styles__ === "function") {
  __register_static_styles__(__vue_options__._scopeId, __vue_styles__)
}

module.exports = __vue_exports__


/***/ }),
/* 124 */
/***/ (function(module, exports) {

module.exports = {
  "wxc-popup": {
    "position": "fixed",
    "width": 750
  },
  "top": {
    "left": 0,
    "right": 0
  },
  "bottom": {
    "left": 0,
    "right": 0
  },
  "left": {
    "bottom": 0,
    "top": 0
  },
  "right": {
    "bottom": 0,
    "top": 0
  }
}

/***/ }),
/* 125 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _wxcOverlay = __webpack_require__(2);

var _wxcOverlay2 = _interopRequireDefault(_wxcOverlay);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

var animation = weex.requireModule('animation');
var platform = weex.config.env.platform;

var isWeb = (typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && platform.toLowerCase() === 'web';

module.exports = {
  components: { WxcOverlay: _wxcOverlay2.default },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    pos: {
      type: String,
      default: 'bottom'
    },
    popupColor: {
      type: String,
      default: '#FFFFFF'
    },
    overlayCfg: {
      type: Object,
      default: function _default() {
        return {
          hasAnimation: true,
          timingFunction: ['ease-in', 'ease-out'],
          duration: 300,
          opacity: 0.6
        };
      }
    },
    height: {
      type: [Number, String],
      default: 840
    },
    standOut: {
      type: [Number, String],
      default: 0
    },
    width: {
      type: [Number, String],
      default: 750
    },
    animation: {
      type: Object,
      default: function _default() {
        return {
          timingFunction: 'ease-in'
        };
      }
    }
  },
  data: function data() {
    return {
      haveOverlay: true,
      isOverShow: true
    };
  },
  computed: {
    isNeedShow: function isNeedShow() {
      var _this = this;

      setTimeout(function () {
        _this.appearPopup(_this.show);
      }, 50);
      return this.show;
    },
    _height: function _height() {
      this.appearPopup(this.show, 150);
      return this.height;
    },
    transformValue: function transformValue() {
      return this.getTransform(this.pos, this.width, this.height, true);
    },
    padStyle: function padStyle() {
      var pos = this.pos,
          width = this.width,
          height = this.height,
          popupColor = this.popupColor;

      var style = {
        width: width + 'px',
        backgroundColor: popupColor
      };
      pos === 'top' && (style = _extends({}, style, {
        top: -height + 'px',
        height: height + 'px'
      }));
      pos === 'bottom' && (style = _extends({}, style, {
        bottom: -height + 'px',
        height: height + 'px'
      }));
      pos === 'left' && (style = _extends({}, style, {
        left: -width + 'px'
      }));
      pos === 'right' && (style = _extends({}, style, {
        right: -width + 'px'
      }));
      return style;
    }
  },
  methods: {
    handleTouchEnd: function handleTouchEnd(e) {
      // 在支付宝上面有点击穿透问题
      var platform = weex.config.env.platform;

      platform === 'Web' && e.preventDefault && e.preventDefault();
    },
    hide: function hide() {
      this.appearPopup(false);
      this.$refs.overlay.appearOverlay(false);
    },
    wxcOverlayBodyClicking: function wxcOverlayBodyClicking() {
      this.isShow && this.appearPopup(false);
    },
    appearPopup: function appearPopup(bool) {
      var _this2 = this;

      var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 300;

      this.isShow = bool;
      var popupEl = this.$refs['wxc-popup'];
      if (!popupEl) {
        return;
      }
      animation.transition(popupEl, _extends({
        styles: {
          transform: this.getTransform(this.pos, this.width, this.height, !bool)
        },
        duration: duration,
        delay: 0
      }, this.animation), function () {
        if (!bool) {
          _this2.$emit('wxcPopupOverlayClicked', { pos: _this2.pos });
        }
      });
    },
    getTransform: function getTransform(pos, width, height, bool) {
      var _size = pos === 'top' || pos === 'bottom' ? height : width;
      var _transform = void 0;
      if (isWeb) {
        _size -= this.standOut;
      }
      bool && (_size = 0);
      switch (pos) {
        case 'top':
          _transform = 'translateY(' + _size + 'px)';
          break;
        case 'bottom':
          _transform = 'translateY(-' + _size + 'px)';
          break;
        case 'left':
          _transform = 'translateX(' + _size + 'px)';
          break;
        case 'right':
          _transform = 'translateX(-' + _size + 'px)';
          break;
      }
      return _transform;
    }
  }
};

/***/ }),
/* 126 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('div', {
    on: {
      "touchend": _vm.handleTouchEnd
    }
  }, [(_vm.show) ? _c('wxc-overlay', _vm._b({
    ref: "overlay",
    attrs: {
      "show": _vm.haveOverlay && _vm.isOverShow
    },
    on: {
      "wxcOverlayBodyClicking": _vm.wxcOverlayBodyClicking
    }
  }, 'wxc-overlay', _vm.overlayCfg, false)) : _vm._e()], 1), (_vm.show) ? _c('div', {
    ref: "wxc-popup",
    class: ['wxc-popup', _vm.pos],
    style: _vm.padStyle,
    attrs: {
      "height": _vm._height,
      "hack": _vm.isNeedShow
    },
    on: {
      "click": function () {}
    }
  }, [_vm._t("default")], 2) : _vm._e()])
},staticRenderFns: []}
module.exports.render._withStripped = true

/***/ }),
/* 127 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = __webpack_require__(128);

Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_index).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 128 */
/***/ (function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = []

/* styles */
__vue_styles__.push(__webpack_require__(129)
)

/* script */
__vue_exports__ = __webpack_require__(130)

/* template */
var __vue_template__ = __webpack_require__(131)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.__file = "/Users/Tw93/www/github/weex-ui/packages/wxc-progress/index.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-5868d064"
__vue_options__.style = __vue_options__.style || {}
__vue_styles__.forEach(function (module) {
  for (var name in module) {
    __vue_options__.style[name] = module[name]
  }
})
if (typeof __register_static_styles__ === "function") {
  __register_static_styles__(__vue_options__._scopeId, __vue_styles__)
}

module.exports = __vue_exports__


/***/ }),
/* 129 */
/***/ (function(module, exports) {

module.exports = {
  "wxc-progress": {
    "position": "relative",
    "backgroundColor": "#f2f3f4"
  },
  "progress": {
    "position": "absolute",
    "backgroundColor": "#FFC900"
  }
}

/***/ }),
/* 130 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

exports.default = {
  props: {
    barColor: {
      type: String,
      default: '#FFC900'
    },
    barWidth: {
      type: Number,
      default: 600
    },
    barHeight: {
      type: Number,
      default: 8
    },
    value: {
      type: Number,
      default: 0
    }
  },
  computed: {
    runWayStyle: function runWayStyle() {
      var barWidth = this.barWidth,
          barHeight = this.barHeight;

      return {
        width: barWidth + 'px',
        height: barHeight + 'px'
      };
    },
    progressStyle: function progressStyle() {
      var value = this.value,
          barWidth = this.barWidth,
          barHeight = this.barHeight,
          barColor = this.barColor;

      var newValue = value < 0 ? 0 : value > 100 ? 100 : value;
      return {
        backgroundColor: barColor,
        height: barHeight + 'px',
        width: newValue / 100 * barWidth + 'px'
      };
    }
  }
};

/***/ }),
/* 131 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: ["wxc-progress"],
    style: _vm.runWayStyle
  }, [_c('div', {
    staticClass: ["progress"],
    style: _vm.progressStyle
  })])
},staticRenderFns: []}
module.exports.render._withStripped = true

/***/ }),
/* 132 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = __webpack_require__(133);

Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_index).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 133 */
/***/ (function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = []

/* styles */
__vue_styles__.push(__webpack_require__(134)
)

/* script */
__vue_exports__ = __webpack_require__(135)

/* template */
var __vue_template__ = __webpack_require__(141)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.__file = "/Users/Tw93/www/github/weex-ui/packages/wxc-radio/index.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-32a75f7a"
__vue_options__.style = __vue_options__.style || {}
__vue_styles__.forEach(function (module) {
  for (var name in module) {
    __vue_options__.style[name] = module[name]
  }
})
if (typeof __register_static_styles__ === "function") {
  __register_static_styles__(__vue_options__._scopeId, __vue_styles__)
}

module.exports = __vue_exports__


/***/ }),
/* 134 */
/***/ (function(module, exports) {

module.exports = {}

/***/ }),
/* 135 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _item = __webpack_require__(136);

var _item2 = _interopRequireDefault(_item);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  components: { wxcRadio: _item2.default },
  props: {
    list: {
      type: Array,
      default: function _default() {
        return [];
      }
    }
  },
  data: function data() {
    return {
      checkedIndex: -1
    };
  },
  computed: {
    updateList: function updateList() {
      var checkedIndex = this.checkedIndex,
          list = this.list;

      var updateList = [];
      list && list.forEach(function (item, i) {
        item.checked = i === checkedIndex;
        updateList.push(item);
      });
      return updateList;
    }
  },
  created: function created() {
    var _this = this;

    var list = this.list;

    if (list && list.length > 0) {
      list.forEach(function (item, i) {
        item.checked && (_this.checkedIndex = i);
      });
    }
  },

  methods: {
    wxcRadioItemChecked: function wxcRadioItemChecked(i, e) {
      var oldIndex = this.checkedIndex;
      var _list$i = this.list[i],
          value = _list$i.value,
          title = _list$i.title;

      this.checkedIndex = i;
      this.$emit('wxcRadioListChecked', { value: value, title: title, oldIndex: oldIndex, index: i });
    }
  }
}; //
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/***/ }),
/* 136 */
/***/ (function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = []

/* styles */
__vue_styles__.push(__webpack_require__(137)
)

/* script */
__vue_exports__ = __webpack_require__(138)

/* template */
var __vue_template__ = __webpack_require__(140)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.__file = "/Users/Tw93/www/github/weex-ui/packages/wxc-radio/item.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-0f804d1b"
__vue_options__.style = __vue_options__.style || {}
__vue_styles__.forEach(function (module) {
  for (var name in module) {
    __vue_options__.style[name] = module[name]
  }
})
if (typeof __register_static_styles__ === "function") {
  __register_static_styles__(__vue_options__._scopeId, __vue_styles__)
}

module.exports = __vue_exports__


/***/ }),
/* 137 */
/***/ (function(module, exports) {

module.exports = {
  "radio": {
    "width": 48,
    "height": 48
  },
  "title-text": {
    "fontSize": 30
  }
}

/***/ }),
/* 138 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _wxcCell = __webpack_require__(1);

var _wxcCell2 = _interopRequireDefault(_wxcCell);

var _iconBase = __webpack_require__(139);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

exports.default = {
  components: { WxcCell: _wxcCell2.default },
  props: {
    hasTopBorder: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      require: true
    },
    value: {
      type: [String, Number, Object],
      require: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    checked: {
      type: Boolean,
      default: false
    }
  },
  data: function data() {
    return {
      icon: [_iconBase.CHECKED, _iconBase.UNCHECKED]
    };
  },
  computed: {
    radioIcon: function radioIcon() {
      var icon = this.icon,
          disabled = this.disabled,
          checked = this.checked;

      return checked ? icon[disabled ? 1 : 0] : '';
    },
    backgroundColor: function backgroundColor() {
      var disabled = this.disabled;

      return disabled ? '#F2F3F4' : '#FFFFFF';
    },
    color: function color() {
      var disabled = this.disabled,
          checked = this.checked;

      return checked && !disabled ? '#EE9900' : '#3D3D3D';
    }
  },
  methods: {
    wxcCellDivClick: function wxcCellDivClick() {
      var disabled = this.disabled,
          value = this.value;

      if (!disabled) {
        this.$emit('wxcRadioItemChecked', { value: value, disabled: disabled });
      }
    }
  }
};

/***/ }),
/* 139 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
  CHECKED: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAADzUExURUxpce2ZAOuJAAAAAOuTAO6YAO2YAO6ZAKpVAN+AAO2YANWAAO6YAOuUAOuWAO6ZAO2YAO2SAO2YAOuWAO2YAICAAO2ZAO6XAO6ZAO6ZAL+AAOqVAOqXAOyYAO6ZAO2ZAO6YAO6YAO6ZAO2YAO2ZAO2SAO2ZAO2YAO2YAO6ZAO2XAO6ZAOaZAO2VAO6YAOOOAO2YAOqVAO2YAOuXAOmYAOqWAOyYAO2ZAO2YAOqYAO6ZAO6YAOmQAOiLAO6ZAOyZAO6YAOyZAOyZAO6YAO6ZAO2ZAO2YAO2YAOuZAO6ZAO6YAO2YAO6ZAO6YAO6ZAO2ZAO6ZAE03vp0AAABQdFJOUwDmDQEa3YP6Awh0BtAmP+BFDuknxAK2O3W0BDAxamn37Pv+rn8cc/a3r2LbCjqzCZwMtUAvPUOMcj5m7hcLk1+jN4lo3qDJ0xn8wn7q38/Kd0v3qQAAARZJREFUWMPt1sdywjAQgGEwxYDpPaJjWgihJqF3UiChvP/TMMOA40mwkL26sf9Zs6NPe5HJhGEYhilZWuMajzmCpy1PGvA5Ab999TGDX8nhsfvEz3fwICEUNotu15cF7jIHba5nJw+XrW518nFZ0WXURQhhdj1QXOT1rUN4uBrdZrNfZHLFY7R3FtzDTMErwfclDdr58mNVYnBFqAtzvPSiuSfZWwS5TiVSWZGiu70v5aSQrmjr2FznScmSpo7ZdUPH7qLr9LhoOp0uTZ1el5ZOv+u6zpDris6Y67/OqOuvDuBS6zo1gEutq3zvAS6Vbrv5Abl+dYc1yKXoouKuBHJddNPFcg69z6nWiEQ4fTfxx41h2B13BDc5Jq/erDtTAAAAAElFTkSuQmCC",
  UNCHECKED: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAADzUExURUxpceDg4NjY2AAAANjY2ODg4ODg4N/f36qqqt/f397e3tXV1d/f393d3d/f397e3t/f39vb29/f397e3uDg4ICAgN/f39zc3N7e3uDg4N/f37+/v+Dg4ODg4N/f39/f3+Dg4ODg4ODg4Nvb29/f39/f3+Dg4ODg4N/f39/f3+Dg4ODg4MzMzNzc3ODg4ODg4MbGxtXV1d/f39/f397e3t7e3t7e3t3d3eDg4ODg4N/f397e3t7e3tHR0d/f3+Dg4N/f3+Dg4N/f39/f39bW1t/f39/f3+Dg4ODg4N/f39/f3+Dg4N/f39/f39/f39/f3+Dg4KlnnBMAAABQdFJOUwDmDQEa3YP6Awh0BtAmP0XgDuknxAK2O3W0MAQxamn3/uz7HK5/c/a3r2LbCjqznAkMtUAvPYxD7nJmPhcLX5M3o4loGaDJ3tPfz/zCfurKXXWIkwAAARlJREFUWMPt1ltzwUAUwHESEhFCL5RuL24N2igS9F7qTkt9/0/TGdNGpmRtcvbN+T/vnNnfnpcNBDAMwzA7sflm8JgjxM1StwGfc5SQJuMP+JUicSkpT0fgQcLJaVCORYci3BU8DkdrCg9X+D6k8HGF0OXXRQhhdmUpLtJ+sAgPV6NTr78UmVyZM9o7C7HH6xtNhe9LfTZz5eqtyuBKURcWaT2lC3clrQhyrTu/zMsU3f592SeFq4q7js31O+lCd9Uxu/bo2F10nRcXTefR5arz6nLTeXft1vly7dD5c23r/Lr+6wAup84yAC6nrrL4BrgcutnXEuTa6FafIJetS8tzHeT60733Bz3ofdY1X0mK03cTf9wYhh1wP1u5Jq9N5fwAAAAAAElFTkSuQmCC"
};

/***/ }),
/* 140 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('wxc-cell', {
    attrs: {
      "hasTopBorder": _vm.hasTopBorder,
      "cellStyle": {
        backgroundColor: _vm.backgroundColor
      }
    },
    on: {
      "wxcCellDivClick": _vm.wxcCellDivClick
    }
  }, [_c('text', {
    staticClass: ["title-text"],
    style: {
      color: _vm.color
    },
    slot: "title"
  }, [_vm._v(_vm._s(_vm.title))]), (_vm.radioIcon) ? _c('image', {
    staticClass: ["radio"],
    attrs: {
      "src": _vm.radioIcon
    },
    slot: "value"
  }) : _vm._e()])
},staticRenderFns: []}
module.exports.render._withStripped = true

/***/ }),
/* 141 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', _vm._l((_vm.updateList), function(item, i) {
    return _c('wxc-radio', _vm._b({
      key: i,
      on: {
        "wxcRadioItemChecked": function($event) {
          _vm.wxcRadioItemChecked(i, $event)
        }
      }
    }, 'wxc-radio', item, false))
  }))
},staticRenderFns: []}
module.exports.render._withStripped = true

/***/ }),
/* 142 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = __webpack_require__(143);

Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_index).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 143 */
/***/ (function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = []

/* styles */
__vue_styles__.push(__webpack_require__(144)
)

/* script */
__vue_exports__ = __webpack_require__(145)

/* template */
var __vue_template__ = __webpack_require__(147)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.__file = "/Users/Tw93/www/github/weex-ui/packages/wxc-result/index.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-7dd65154"
__vue_options__.style = __vue_options__.style || {}
__vue_styles__.forEach(function (module) {
  for (var name in module) {
    __vue_options__.style[name] = module[name]
  }
})
if (typeof __register_static_styles__ === "function") {
  __register_static_styles__(__vue_options__._scopeId, __vue_styles__)
}

module.exports = __vue_exports__


/***/ }),
/* 144 */
/***/ (function(module, exports) {

module.exports = {
  "wrap": {
    "position": "absolute",
    "top": 0,
    "left": 0,
    "right": 0,
    "bottom": 0
  },
  "wxc-result": {
    "width": 750,
    "flex": 1,
    "alignItems": "center",
    "backgroundColor": "#f2f3f4"
  },
  "result-image": {
    "width": 320,
    "height": 320
  },
  "result-content": {
    "marginTop": 36,
    "alignItems": "center"
  },
  "content-text": {
    "fontSize": 30,
    "color": "#A5A5A5",
    "height": 42,
    "lineHeight": 42,
    "textAlign": "center"
  },
  "content-desc": {
    "marginTop": 10
  },
  "result-button": {
    "marginTop": 60,
    "borderWidth": 1,
    "borderColor": "#979797",
    "backgroundColor": "#FFFFFF",
    "borderRadius": 6,
    "width": 240,
    "height": 72,
    "flexDirection": "row",
    "alignItems": "center",
    "justifyContent": "center"
  },
  "button-text": {
    "color": "#666666",
    "fontSize": 30
  }
}

/***/ }),
/* 145 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

var TYPES = __webpack_require__(146);
module.exports = {
  props: {
    type: {
      type: String,
      default: 'errorPage'
    },
    show: {
      type: Boolean,
      default: true
    },
    wrapStyle: Object,
    paddingTop: {
      type: [Number, String],
      default: 232
    },
    customSet: {
      type: Object,
      default: function _default() {
        return {};
      }
    }
  },
  computed: {
    resultType: function resultType() {
      var type = this.type,
          customSet = this.customSet;

      var allTypes = this.isEmptyObject(customSet) ? TYPES : this.mergeDeep(TYPES, customSet);
      var types = allTypes['errorPage'];
      if (['errorPage', 'noGoods', 'noNetwork', 'errorLocation'].indexOf(type) > -1) {
        types = allTypes[type];
      }
      return types;
    },
    setPaddingTop: function setPaddingTop() {
      var paddingTop = this.paddingTop;
      return paddingTop + 'px';
    }
  },
  methods: {
    handleTouchEnd: function handleTouchEnd(e) {
      // 在支付宝上面有点击穿透问题
      var platform = weex.config.env.platform;

      platform === 'Web' && e.preventDefault && e.preventDefault();
    },
    onClick: function onClick() {
      var type = this.type;
      this.$emit('wxcResultButtonClicked', { type: type });
    },
    isObject: function isObject(item) {
      return item && (typeof item === 'undefined' ? 'undefined' : _typeof(item)) === 'object' && !Array.isArray(item);
    },
    isEmptyObject: function isEmptyObject(obj) {
      return Object.keys(obj).length === 0 && obj.constructor === Object;
    },
    mergeDeep: function mergeDeep(target) {
      for (var _len = arguments.length, sources = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        sources[_key - 1] = arguments[_key];
      }

      if (!sources.length) return target;
      var source = sources.shift();
      if (this.isObject(target) && this.isObject(source)) {
        for (var key in source) {
          if (this.isObject(source[key])) {
            if (!target[key]) {
              Object.assign(target, _defineProperty({}, key, {}));
            }
            this.mergeDeep(target[key], source[key]);
          } else {
            Object.assign(target, _defineProperty({}, key, source[key]));
          }
        }
      }
      return this.mergeDeep.apply(this, [target].concat(sources));
    }
  }
};

/***/ }),
/* 146 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Created by Tw93 on 2016/11/4.
 */
module.exports = {
  errorPage: {
    pic: '//gtms01.alicdn.com/tfs/TB1HH4TSpXXXXauXVXXXXXXXXXX-320-320.png',
    content: '抱歉出错了，飞猪正在全力解决中',
    button: '再试一次',
    title: '出错啦'
  },
  noGoods: {
    pic: '//gw.alicdn.com/tfs/TB1QXlEQXXXXXcNXFXXXXXXXXXX-320-320.png',
    content: '主人，这里什么都没有找到',
    button: '再试一次',
    title: '暂无商品'
  },
  noNetwork: {
    pic: '//gw.alicdn.com/tfs/TB1rs83QXXXXXcBXpXXXXXXXXXX-320-320.png',
    content: '哎呀，没有网络了......',
    button: '刷新一下',
    title: '无网络'
  },
  errorLocation: {
    pic: '//gw.alicdn.com/tfs/TB1rs83QXXXXXcBXpXXXXXXXXXX-320-320.png',
    content: '哎呀，定位失败了......',
    button: '刷新一下',
    title: '定位失败'
  }
};

/***/ }),
/* 147 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return (_vm.show) ? _c('div', {
    staticClass: ["wrap"],
    style: _vm.wrapStyle
  }, [_c('div', {
    staticClass: ["wxc-result"],
    style: {
      paddingTop: _vm.setPaddingTop
    }
  }, [_c('image', {
    staticClass: ["result-image"],
    attrs: {
      "src": _vm.resultType.pic
    }
  }), (_vm.resultType.content) ? _c('div', {
    staticClass: ["result-content"]
  }, [_c('text', {
    staticClass: ["content-text"]
  }, [_vm._v(_vm._s(_vm.resultType.content))]), (_vm.resultType.desc) ? _c('text', {
    staticClass: ["content-text", "content-desc"]
  }, [_vm._v(_vm._s(_vm.resultType.desc))]) : _vm._e()]) : _vm._e(), (_vm.resultType.button) ? _c('div', {
    staticClass: ["result-button"],
    on: {
      "touchend": _vm.handleTouchEnd,
      "click": _vm.onClick
    }
  }, [_c('text', {
    staticClass: ["button-text"]
  }, [_vm._v(_vm._s(_vm.resultType.button))])]) : _vm._e()])]) : _vm._e()
},staticRenderFns: []}
module.exports.render._withStripped = true

/***/ }),
/* 148 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = __webpack_require__(149);

Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_index).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 149 */
/***/ (function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = []

/* styles */
__vue_styles__.push(__webpack_require__(150)
)

/* script */
__vue_exports__ = __webpack_require__(151)

/* template */
var __vue_template__ = __webpack_require__(164)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.__file = "/Users/Tw93/www/github/weex-ui/packages/wxc-rich-text/index.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-40bf793d"
__vue_options__.style = __vue_options__.style || {}
__vue_styles__.forEach(function (module) {
  for (var name in module) {
    __vue_options__.style[name] = module[name]
  }
})
if (typeof __register_static_styles__ === "function") {
  __register_static_styles__(__vue_options__._scopeId, __vue_styles__)
}

module.exports = __vue_exports__


/***/ }),
/* 150 */
/***/ (function(module, exports) {

module.exports = {
  "wxc-rich-text": {
    "justifyContent": "flex-start",
    "alignItems": "center",
    "flexWrap": "wrap",
    "flexDirection": "row",
    "flexShrink": 1
  },
  "default-text": {
    "color": "#A5A5A5",
    "fontSize": 24,
    "lineHeight": 30
  }
}

/***/ }),
/* 151 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

var Utils = __webpack_require__(3);
module.exports = {
  components: {
    WxcRichTextText: __webpack_require__(4),
    WxcRichTextLink: __webpack_require__(155),
    WxcRichTextIcon: __webpack_require__(10),
    WxcRichTextTag: __webpack_require__(11)
  },
  props: {
    configList: {
      type: [Array, String],
      default: function _default() {
        return [];
      }
    },
    hasTextMargin: {
      type: Boolean,
      default: true
    }
  },
  data: function data() {
    return {};
  },
  computed: {
    isNotEmptyArray: function isNotEmptyArray() {
      return Utils.isNonEmptyArray(this.configList);
    },
    isString: function isString() {
      return Utils.isString(this.configList);
    }
  }
};

/***/ }),
/* 152 */
/***/ (function(module, exports) {

module.exports = {
  "wxc-text": {
    "fontSize": 24,
    "color": "#3d3d3d"
  },
  "black": {
    "color": "#3D3D3D"
  },
  "yellow": {
    "color": "#EE9900"
  },
  "gray": {
    "color": "#A5A5A5"
  },
  "red": {
    "color": "#FF5000"
  },
  "margin-text": {
    "marginRight": 6
  }
}

/***/ }),
/* 153 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

module.exports = {
  props: {
    textValue: {
      type: String,
      default: ''
    },
    textTheme: {
      type: String,
      default: 'gray'
    },
    textStyle: {
      type: Object,
      default: function _default() {
        return {};
      }
    },
    hasTextMargin: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    themeStyle: function themeStyle() {
      var style = {};
      var textStyle = this.textStyle;
      if (textStyle && textStyle.fontSize) {
        style = _extends({}, style, {
          fontSize: textStyle.fontSize + 'px',
          height: textStyle.fontSize * 1.2 + 'px'
        });
      }
      if (textStyle && textStyle.color) {
        style = _extends({}, style, {
          color: textStyle.color
        });
      }
      return style;
    }
  }
};

/***/ }),
/* 154 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('text', {
    class: ['wxc-text', _vm.textTheme, _vm.hasTextMargin ? 'margin-text' : ''],
    style: _vm.themeStyle
  }, [_vm._v(_vm._s(_vm.textValue))])
},staticRenderFns: []}
module.exports.render._withStripped = true

/***/ }),
/* 155 */
/***/ (function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = []

/* script */
__vue_exports__ = __webpack_require__(156)

/* template */
var __vue_template__ = __webpack_require__(157)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.__file = "/Users/Tw93/www/github/weex-ui/packages/wxc-rich-text/wxc-rich-text-link.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__.style = __vue_options__.style || {}
__vue_styles__.forEach(function (module) {
  for (var name in module) {
    __vue_options__.style[name] = module[name]
  }
})
if (typeof __register_static_styles__ === "function") {
  __register_static_styles__(__vue_options__._scopeId, __vue_styles__)
}

module.exports = __vue_exports__


/***/ }),
/* 156 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _wxcRichTextText = __webpack_require__(4);

var _wxcRichTextText2 = _interopRequireDefault(_wxcRichTextText);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//
//
//
//
//
//
//
//
//
//
//
//
//

var Utils = __webpack_require__(3);

module.exports = {
  components: { WxcRichTextText: _wxcRichTextText2.default },
  props: {
    linkValue: {
      type: [String, Number],
      default: ''
    },
    hasTextMargin: {
      type: Boolean,
      default: true
    },
    linkHref: {
      type: String,
      default: ''
    },
    linkTheme: {
      type: String,
      default: 'black'
    },
    linkStyle: {
      type: Object,
      default: function _default() {
        return {};
      }
    }
  },
  data: function data() {
    return {
      defObj: {}
    };
  },
  methods: {
    onLinkClick: function onLinkClick(e) {
      var self = this;
      Utils.goToH5Page(self.linkHref);
      self.$emit('wxcRichTextLinkClick', { element: e, href: self.linkHref });
    }
  }
};

/***/ }),
/* 157 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    on: {
      "click": _vm.onLinkClick
    }
  }, [_c('wxc-rich-text-text', {
    attrs: {
      "textValue": _vm.linkValue,
      "hasTextMargin": _vm.hasTextMargin,
      "textStyle": _vm.linkStyle ? _vm.linkStyle : _vm.defObj,
      "textTheme": _vm.linkTheme ? _vm.linkTheme : 'black'
    }
  })], 1)
},staticRenderFns: []}
module.exports.render._withStripped = true

/***/ }),
/* 158 */
/***/ (function(module, exports) {

module.exports = {
  "wxc-image": {
    "width": 90,
    "height": 24,
    "marginRight": 6
  }
}

/***/ }),
/* 159 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

module.exports = {
  props: {
    iconSrc: {
      type: String,
      default: ''
    },
    iconStyle: {
      type: Object,
      default: function _default() {
        return {
          height: 24
        };
      }
    }
  },
  data: function data() {
    return {
      width: 90
    };
  },
  computed: {
    computedStyle: function computedStyle() {
      var width = this.width,
          iconStyle = this.iconStyle;

      if (iconStyle && iconStyle.width && iconStyle.height) {
        return {
          width: iconStyle.width + 'px',
          height: iconStyle.height + 'px'
        };
      } else {
        return {
          width: width + 'px',
          height: iconStyle.height + 'px'
        };
      }
    }
  },
  methods: {
    onLoad: function onLoad(e) {
      if (e.success && e.size && e.size.naturalWidth > 0) {
        var width = e.size.naturalWidth;
        var height = e.size.naturalHeight;
        this.width = width * (this.iconStyle.height / height);
      }
    }
  }
};

/***/ }),
/* 160 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('image', {
    staticClass: ["wxc-image"],
    style: {
      width: _vm.computedStyle.width,
      height: _vm.computedStyle.height
    },
    attrs: {
      "src": _vm.iconSrc
    },
    on: {
      "load": _vm.onLoad
    }
  })
},staticRenderFns: []}
module.exports.render._withStripped = true

/***/ }),
/* 161 */
/***/ (function(module, exports) {

module.exports = {
  "wxc-tag": {
    "borderColor": "#3d3d3d",
    "borderWidth": 2,
    "borderRadius": 4,
    "marginRight": 6,
    "backgroundColor": "rgba(0,0,0,0)",
    "paddingLeft": 6,
    "paddingRight": 6,
    "height": 26,
    "justifyContent": "center",
    "alignItems": "center"
  },
  "tag-text": {
    "fontSize": 20,
    "color": "#3d3d3d"
  },
  "black": {
    "color": "#3D3D3D"
  },
  "yellow": {
    "color": "#EE9900"
  },
  "blue": {
    "color": "#30A0FF"
  },
  "gray": {
    "color": "#A5A5A5"
  },
  "red": {
    "color": "#FF5000"
  },
  "border-black": {
    "borderColor": "#A5A5A5"
  },
  "border-yellow": {
    "borderColor": "#EE9900"
  },
  "border-gray": {
    "borderColor": "#A5A5A5"
  },
  "border-red": {
    "borderColor": "#FF5000"
  }
}

/***/ }),
/* 162 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

module.exports = {
  props: {
    tagValue: {
      type: [String, Number],
      default: ''
    },
    tagTheme: {
      type: String,
      default: 'blue'
    },
    tagStyle: {
      type: Object,
      default: function _default() {
        return {};
      }
    }
  },
  computed: {
    newTheme: function newTheme() {
      var tagStyle = this.tagStyle;
      var tagValue = this.tagValue;
      var divStyle = {};
      var textStyle = {};
      if (tagStyle && tagStyle.fontSize) {
        textStyle = _extends({}, textStyle, {
          fontSize: tagStyle.fontSize + 'px'
        });
      }
      if (tagStyle && tagStyle.color) {
        textStyle = _extends({}, textStyle, {
          color: tagStyle.color
        });
      }

      if (tagStyle && tagStyle.borderColor) {
        divStyle = _extends({}, divStyle, {
          borderColor: tagStyle.borderColor
        });
      }

      if (tagStyle && tagStyle.borderWidth) {
        divStyle = _extends({}, divStyle, {
          borderWidth: tagStyle.borderWidth + 'px'
        });
      }

      if (tagStyle && tagStyle.borderRadius) {
        divStyle = _extends({}, divStyle, {
          borderRadius: tagStyle.borderRadius + 'px'
        });
      }

      if (tagStyle && tagStyle.backgroundColor) {
        divStyle = _extends({}, divStyle, {
          backgroundColor: tagStyle.backgroundColor
        });
      }

      if (tagStyle && tagStyle.height) {
        divStyle = _extends({}, divStyle, {
          height: tagStyle.height + 'px'
        });
      }

      if (tagStyle && tagStyle.width) {
        divStyle = _extends({}, divStyle, {
          width: tagStyle.width + 'px'
        });
      }

      if (tagValue && tagValue.length === 1) {
        divStyle = _extends({}, divStyle, {
          paddingLeft: 0,
          paddingRight: 0
        });
      }

      return {
        divStyle: divStyle,
        textStyle: textStyle
      };
    }
  }
};

/***/ }),
/* 163 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    class: ['wxc-tag', 'border-' + _vm.tagTheme],
    style: _vm.newTheme.divStyle
  }, [_c('text', {
    class: ['tag-text', _vm.tagTheme],
    style: _vm.newTheme.textStyle
  }, [_vm._v(_vm._s(_vm.tagValue))])])
},staticRenderFns: []}
module.exports.render._withStripped = true

/***/ }),
/* 164 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [(_vm.isNotEmptyArray) ? _c('div', {
    staticClass: ["wxc-rich-text"]
  }, _vm._l((_vm.configList), function(v) {
    return _c('div', [(v.type == 'text' && v.value) ? _c('wxc-rich-text-text', {
      attrs: {
        "textValue": v.value,
        "textStyle": v.style,
        "hasTextMargin": _vm.hasTextMargin,
        "textTheme": v.theme
      }
    }) : _vm._e(), (v.type == 'link' && v.href && v.value) ? _c('wxc-rich-text-link', {
      attrs: {
        "linkValue": v.value,
        "linkHref": v.href,
        "linkStyle": v.style,
        "hasTextMargin": _vm.hasTextMargin,
        "linkTheme": v.theme
      }
    }) : _vm._e(), (v.type == 'icon' && v.src) ? _c('wxc-rich-text-icon', {
      attrs: {
        "iconSrc": v.src,
        "iconStyle": v.style
      }
    }) : _vm._e(), (v.type == 'tag' && v.value) ? _c('wxc-rich-text-tag', {
      attrs: {
        "tagValue": v.value,
        "tagTheme": v.theme,
        "tagStyle": v.style
      }
    }) : _vm._e()], 1)
  })) : _vm._e(), (_vm.isString) ? _c('text', {
    staticClass: ["default-text"]
  }, [_vm._v(_vm._s(_vm.configList))]) : _vm._e()])
},staticRenderFns: []}
module.exports.render._withStripped = true

/***/ }),
/* 165 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = __webpack_require__(166);

Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_index).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 166 */
/***/ (function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = []

/* styles */
__vue_styles__.push(__webpack_require__(167)
)

/* script */
__vue_exports__ = __webpack_require__(168)

/* template */
var __vue_template__ = __webpack_require__(169)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.__file = "/Users/Tw93/www/github/weex-ui/packages/wxc-special-rich-text/index.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-d95723ae"
__vue_options__.style = __vue_options__.style || {}
__vue_styles__.forEach(function (module) {
  for (var name in module) {
    __vue_options__.style[name] = module[name]
  }
})
if (typeof __register_static_styles__ === "function") {
  __register_static_styles__(__vue_options__._scopeId, __vue_styles__)
}

module.exports = __vue_exports__


/***/ }),
/* 167 */
/***/ (function(module, exports) {

module.exports = {
  "wxc-special-rich-text": {
    "position": "relative"
  },
  "tag-div": {
    "position": "absolute",
    "top": 0,
    "left": 0,
    "color": "#A5A5A5",
    "fontSize": 24,
    "lineHeight": 30
  },
  "wxc-text": {
    "fontSize": 24,
    "color": "#3d3d3d",
    "lines": 2,
    "textOverflow": "ellipsis",
    "overflow": "hidden"
  },
  "black": {
    "color": "#3D3D3D"
  },
  "yellow": {
    "color": "#EE9900"
  },
  "gray": {
    "color": "#A5A5A5"
  },
  "red": {
    "color": "#FF5000"
  },
  "margin-text": {
    "marginRight": 6
  }
}

/***/ }),
/* 168 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

var Utils = __webpack_require__(3);
module.exports = {
  components: {
    WxcRichTextText: __webpack_require__(4),
    WxcRichTextIcon: __webpack_require__(10),
    WxcRichTextTag: __webpack_require__(11)
  },
  props: {
    configList: {
      type: [Array, String],
      default: function _default() {
        return {};
      }
    }
  },
  computed: {
    newList: function newList() {
      var configList = this.configList;

      if (Utils.isNonEmptyArray(configList) && configList.length === 2) {
        var r1 = configList[0];
        var r2 = configList[1];
        var iconStyle = r1.style;
        var textStyle = r2.style;
        var style = {};
        var fontSize = 24;
        var tagWidth = iconStyle && iconStyle.width ? iconStyle.width : 24;

        if (textStyle && textStyle.fontSize) {
          fontSize = textStyle.fontSize;
          style = {
            fontSize: textStyle.fontSize + 'px',
            lineHeight: textStyle.fontSize * 1.4 + 'px'
          };
        }

        if (textStyle && textStyle.color) {
          style = _extends({}, style, {
            color: textStyle.color
          });
        }

        if (r1.type === 'tag' && iconStyle && iconStyle.width) {
          r1 = _extends({}, r1, {
            style: _extends({}, iconStyle, { width: null })
          });
        }
        var newValue = r2.value ? new Array(Math.ceil(tagWidth / fontSize) + 1).join('    ') + (' ' + r2.value) : '';
        r2 = _extends({}, r2, {
          style: style,
          value: newValue
        });
        return [r1, r2];
      } else {
        return [];
      }
    },
    top: function top() {
      var configList = this.configList;

      if (Utils.isNonEmptyArray(configList) && configList.length === 2) {
        var iconStyle = configList[0].style;
        var textStyle = configList[1].style;
        var fontSize = 24;
        var tagHeight = iconStyle && iconStyle.height ? iconStyle.height : 26;
        if (textStyle && textStyle.fontSize) {
          fontSize = textStyle.fontSize;
        }
        return Math.ceil((fontSize * 1.3 - tagHeight) / 2);
      } else {
        return 0;
      }
    }
  }
};

/***/ }),
/* 169 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: ["wxc-special-rich-text"]
  }, [_c('div', {
    staticClass: ["tag-div"],
    style: {
      top: _vm.top + 'px'
    }
  }, [(_vm.newList[0].type == 'icon' && _vm.newList[0].src) ? _c('wxc-rich-text-icon', {
    attrs: {
      "iconSrc": _vm.newList[0].src,
      "iconStyle": _vm.newList[0].style
    }
  }) : _vm._e(), (_vm.newList[0].type == 'tag' && _vm.newList[0].value) ? _c('wxc-rich-text-tag', {
    attrs: {
      "tagValue": _vm.newList[0].value,
      "tagTheme": _vm.newList[0].theme,
      "tagStyle": _vm.newList[0].style
    }
  }) : _vm._e()], 1), (_vm.newList[1].value) ? _c('text', {
    class: ['wxc-text', _vm.newList[1].theme],
    style: _vm.newList[1].style
  }, [_vm._v(_vm._s(_vm.newList[1].value))]) : _vm._e()])
},staticRenderFns: []}
module.exports.render._withStripped = true

/***/ }),
/* 170 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = __webpack_require__(171);

Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_index).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 171 */
/***/ (function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = []

/* styles */
__vue_styles__.push(__webpack_require__(172)
)

/* script */
__vue_exports__ = __webpack_require__(173)

/* template */
var __vue_template__ = __webpack_require__(175)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.__file = "/Users/Tw93/www/github/weex-ui/packages/wxc-searchbar/index.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-3bc83a2c"
__vue_options__.style = __vue_options__.style || {}
__vue_styles__.forEach(function (module) {
  for (var name in module) {
    __vue_options__.style[name] = module[name]
  }
})
if (typeof __register_static_styles__ === "function") {
  __register_static_styles__(__vue_options__._scopeId, __vue_styles__)
}

module.exports = __vue_exports__


/***/ }),
/* 172 */
/***/ (function(module, exports) {

module.exports = {
  "wxc-search-bar": {
    "paddingLeft": 20,
    "paddingRight": 20,
    "backgroundColor": "#ffffff",
    "width": 750,
    "height": 84,
    "flexDirection": "row"
  },
  "wxc-search-bar-yellow": {
    "backgroundColor": "#ffc900"
  },
  "search-bar-input": {
    "position": "absolute",
    "top": 10,
    "paddingTop": 0,
    "paddingBottom": 0,
    "paddingRight": 40,
    "paddingLeft": 60,
    "fontSize": 26,
    "width": 624,
    "height": 64,
    "lineHeight": 64,
    "backgroundColor": "#E5E5E5",
    "outline": "none",
    "borderRadius": 6
  },
  "search-bar-input-yellow": {
    "backgroundColor": "#fff6d6",
    "placeholderColor": "#666666"
  },
  "search-bar-icon": {
    "position": "absolute",
    "width": 30,
    "height": 30,
    "left": 34,
    "top": 28
  },
  "search-bar-close": {
    "position": "absolute",
    "width": 30,
    "height": 30,
    "right": 120,
    "top": 28
  },
  "search-bar-button": {
    "width": 94,
    "height": 36,
    "fontSize": 30,
    "textAlign": "center",
    "backgroundColor": "#ffffff",
    "marginTop": 16,
    "marginRight": 0,
    "color": "#333333",
    "position": "absolute",
    "right": 8,
    "top": 9
  },
  "search-bar-button-yellow": {
    "backgroundColor": "#FFC900"
  },
  "input-has-dep": {
    "paddingLeft": 240,
    "width": 710
  },
  "bar-dep": {
    "width": 170,
    "paddingRight": 12,
    "paddingLeft": 12,
    "height": 42,
    "alignItems": "center",
    "flexDirection": "row",
    "position": "absolute",
    "left": 24,
    "top": 22,
    "borderRightStyle": "solid",
    "borderRightWidth": 1,
    "borderRightColor": "#C7C7C7"
  },
  "bar-dep-yellow": {
    "borderRightColor": "#C7C7C7"
  },
  "dep-text": {
    "flex": 1,
    "textAlign": "center",
    "fontSize": 26,
    "color": "#666666",
    "marginRight": 6,
    "lines": 1,
    "textOverflow": "ellipsis"
  },
  "dep-arrow": {
    "width": 24,
    "height": 24
  },
  "icon-has-dep": {
    "left": 214
  },
  "disabled-input": {
    "width": 750,
    "height": 64,
    "position": "absolute",
    "left": 0,
    "backgroundColor": "rgba(0,0,0,0)"
  },
  "has-dep-disabled": {
    "width": 550,
    "left": 200
  }
}

/***/ }),
/* 173 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

var icon = __webpack_require__(174);
module.exports = {
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    alwaysShowCancel: {
      type: Boolean,
      default: false
    },
    inputType: {
      type: String,
      default: 'text'
    },
    mod: {
      type: String,
      default: 'default'
    },
    autofocus: {
      type: Boolean,
      default: false
    },
    theme: {
      type: String,
      default: 'gray'
    },
    defaultValue: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '搜索'
    },
    depName: {
      type: String,
      default: '杭州'
    }
  },
  computed: {
    needShowCancel: function needShowCancel() {
      return this.alwaysShowCancel || this.showCancel;
    }
  },
  data: function data() {
    return {
      inputIcon: icon.inputIcon,
      closeIcon: icon.closeIcon,
      arrowIcon: icon.arrowIcon,
      showCancel: false,
      showClose: false,
      value: ''
    };
  },
  created: function created() {
    this.defaultValue && (this.value = this.defaultValue);
    if (this.disabled) {
      this.showCancel = false;
      this.showClose = false;
    }
  },

  methods: {
    onBlur: function onBlur() {
      var self = this;
      setTimeout(function () {
        self.showCancel = false;
        self.detectShowClose();
        self.$emit('searchbarInputOnblur', { value: self.value });
      }, 10);
    },
    autoBlur: function autoBlur() {
      this.$refs['search-input'].blur();
    },
    onFocus: function onFocus() {
      this.showCancel = true;
      this.detectShowClose();
      this.$emit('searchbarInputOnfocus', { value: this.value });
    },
    closeClicked: function closeClicked() {
      this.value = '';
      this.showCancel && (this.showCancel = false);
      this.showClose && (this.showClose = false);
      this.$emit('searchbarCloseClick', { value: this.value });
      this.$emit('searchbarInputOninput', { value: this.value });
    },
    onInput: function onInput(e) {
      this.value = e.value;
      this.showCancel = true;
      this.detectShowClose();
      this.$emit('searchbarInputOninput', { value: this.value });
    },
    onSubmit: function onSubmit(e) {
      this.onBlur();
      this.value = e.value;
      this.showCancel = true;
      this.detectShowClose();
      this.$emit('searchbarInputOnReturn', { value: this.value });
    },
    cancelClicked: function cancelClicked() {
      this.showCancel && (this.showCancel = false);
      this.showClose && (this.showClose = false);
      this.$emit('searchbarCancelClick', { value: this.value });
    },
    detectShowClose: function detectShowClose() {
      this.showClose = this.value.length > 0 && this.showCancel;
    },
    depClicked: function depClicked() {
      this.$emit('searchbarDepChooseClick', {});
    },
    inputDisabledClicked: function inputDisabledClicked() {
      this.$emit('searchbarInputDisabledOnclick', {});
    },
    setValue: function setValue(value) {
      this.value = value;
    }
  }
};

/***/ }),
/* 174 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Created by Tw93 on 2016/10/31.
 */

module.exports = {
  inputIcon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAMAAAAM7l6QAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAByUExURUxpcWdnZ2dnZ2ZmZmZmZmdnZ4CAgGZmZmZmZmZmZmdnZ3R0dGdnZ2dnZ2ZmZmdnZ2ZmZmdnZ2ZmZmlpaW1tbWdnZ2dnZ2pqamdnZ2ZmZmdnZ2hoaGdnZ2dnZ2dnZ2hoaGZmZmhoaGZmZmlpaWdnZ2ZmZkA5lL8AAAAldFJOUwDdmfcF6QT5S+ZcC4toHs6YzLlJB2aGNclw5FHQl7pCjGevP67QWKJRAAAA4klEQVQoz62S2RaCMAxEy9ZSFtkXRcVt/v8XrRRQWk6ezNPQS9IkHcZ01FVeSCGLvKqZFbyRWEI23KCHTB17pdu6padUdtjQLgCcKJ50HDlA0P3mKpr466efKP7N56pyuqmWqvrr/XeVa/Si8ptlIgnHN7DvQM7zVUBkDRoBlVY5vNjCsYdcqwKlvSZWotBCwt3BLqQWAu0ObiHo7IC6+4oz3fmFnnsgt3Zazhp75zfgSL5Yz6n33vxvuQUQ4a7Xrh+v9anY8l+nno6chQaffR6cL8PUhcWN+Acfaf4iMBsfzzdtFxehXooN0gAAAABJRU5ErkJggg==",

  closeIcon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAABFUExURUxpcWZmZmZmZmlpaWZmZmZmZmdnZ2dnZ2ZmZmxsbG1tbWZmZmZmZmZmZuXl5XJycv///2lpaeTk5Hh4eHd3d/39/XNzc2EMiGIAAAANdFJOUwD8a07Zm/P9thoc8m5QAlfPAAAAn0lEQVQoz3VS6RrEEBCbKuro0KJ9/0dddXx0dyc/HMkgAkCFYYpLyRUzMEOLBRsWoQe/Wpxg187vG76w7a3+i89KWaMt/sA+54gyTGelzlg6kX0WP/EK/unvcKXizQCrheFwWfHuCHUpA1W3yJTzpalzBRyHMnjkIHEog0dJC+RW5OEvu/dkl7xgiyT2SFKPhA6RjJ1+KPpp6c/w7/t8AFQ8F1LEfZUoAAAAAElFTkSuQmCC",

  arrowIcon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAABdUExURUxpcWxsbGhoaGZmZmZmZmZmZmZmZmdnZ2ZmZm9vb3FxcWtra2ZmZmdnZ3R0dICAgICAgGZmZmZmZmdnZ2dnZ2ZmZmZmZmZmZmhoaGlpaWdnZ2dnZ2dnZ2ZmZmZmZpgUTqAAAAAedFJOUwAaIOUj3tvTrxcSK+3HCwIGN5uruon5/FNEwsHz9AT339MAAABsSURBVCjP3ZFXDoAwDEM7KB0UCmWW4fsfEyHE5gKQr2dFkW2FkB+NGvQhdK92lojZxiyG3BeRAE9WTDhEdJxTCVssUFhIenYxKaZASBiRmqt/VqHpugZVdk+Wl2hblPkzs/OAd6916vq7r5gBMI0EqzF/qlIAAAAASUVORK5CYII="
};

/***/ }),
/* 175 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [(_vm.mod === 'default') ? _c('div', {
    class: ['wxc-search-bar', 'wxc-search-bar-' + _vm.theme]
  }, [_c('input', {
    ref: "search-input",
    class: ['search-bar-input', 'search-bar-input-' + _vm.theme],
    style: {
      width: _vm.needShowCancel ? '624px' : '710px'
    },
    attrs: {
      "autofocus": _vm.autofocus,
      "disabled": _vm.disabled,
      "value": _vm.value,
      "type": _vm.inputType,
      "placeholder": _vm.placeholder
    },
    on: {
      "blur": _vm.onBlur,
      "focus": _vm.onFocus,
      "input": _vm.onInput,
      "return": _vm.onSubmit
    }
  }), (_vm.disabled) ? _c('div', {
    staticClass: ["disabled-input"],
    on: {
      "click": _vm.inputDisabledClicked
    }
  }) : _vm._e(), _c('image', {
    staticClass: ["search-bar-icon"],
    attrs: {
      "src": _vm.inputIcon
    }
  }), (_vm.showClose) ? _c('image', {
    staticClass: ["search-bar-close"],
    attrs: {
      "src": _vm.closeIcon
    },
    on: {
      "click": _vm.closeClicked
    }
  }) : _vm._e(), (_vm.needShowCancel) ? _c('text', {
    class: ['search-bar-button', 'search-bar-button-' + _vm.theme],
    on: {
      "click": _vm.cancelClicked
    }
  }, [_vm._v("取消 ")]) : _vm._e()]) : _vm._e(), (_vm.mod === 'hasDep') ? _c('div', {
    class: ['wxc-search-bar', 'wxc-search-bar-' + _vm.theme]
  }, [_c('input', {
    class: ['search-bar-input', 'input-has-dep', 'search-bar-input-' + _vm.theme],
    attrs: {
      "disabled": _vm.disabled,
      "autofocus": _vm.autofocus,
      "value": _vm.value,
      "type": _vm.inputType,
      "placeholder": _vm.placeholder
    },
    on: {
      "blur": _vm.onBlur,
      "focus": _vm.onFocus,
      "input": _vm.onInput,
      "return": _vm.onSubmit
    }
  }), (_vm.disabled) ? _c('div', {
    staticClass: ["disabled-input", "has-dep-disabled"],
    on: {
      "click": _vm.inputDisabledClicked
    }
  }) : _vm._e(), _c('div', {
    class: ['bar-dep', '.bar-dep-' + _vm.theme],
    on: {
      "click": _vm.depClicked
    }
  }, [_c('text', {
    staticClass: ["dep-text"]
  }, [_vm._v(_vm._s(_vm.depName))]), _c('image', {
    staticClass: ["dep-arrow"],
    attrs: {
      "src": _vm.arrowIcon
    }
  })]), _c('image', {
    staticClass: ["search-bar-icon", "icon-has-dep"],
    attrs: {
      "src": _vm.inputIcon
    }
  })]) : _vm._e()])
},staticRenderFns: []}
module.exports.render._withStripped = true

/***/ }),
/* 176 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = __webpack_require__(177);

Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_index).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 177 */
/***/ (function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = []

/* styles */
__vue_styles__.push(__webpack_require__(178)
)

/* script */
__vue_exports__ = __webpack_require__(179)

/* template */
var __vue_template__ = __webpack_require__(180)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.__file = "/Users/Tw93/www/github/weex-ui/packages/wxc-simple-flow/index.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-afc9c130"
__vue_options__.style = __vue_options__.style || {}
__vue_styles__.forEach(function (module) {
  for (var name in module) {
    __vue_options__.style[name] = module[name]
  }
})
if (typeof __register_static_styles__ === "function") {
  __register_static_styles__(__vue_options__._scopeId, __vue_styles__)
}

module.exports = __vue_exports__


/***/ }),
/* 178 */
/***/ (function(module, exports) {

module.exports = {
  "flex-row": {
    "flexDirection": "row"
  },
  "full-rest": {
    "flex": 1
  },
  "root": {
    "paddingTop": 28,
    "paddingBottom": 24,
    "backgroundColor": "#ffffff"
  },
  "title": {
    "height": 40,
    "paddingLeft": 70,
    "paddingRight": 70
  },
  "content": {
    "paddingTop": 9,
    "paddingBottom": 42,
    "paddingLeft": 70,
    "paddingRight": 70
  },
  "last-one-content": {
    "paddingBottom": 0
  },
  "line": {
    "position": "absolute",
    "top": 0,
    "bottom": 0,
    "left": 38,
    "width": 2,
    "backgroundColor": "#FFC300"
  },
  "first-one-title-line": {
    "top": 20
  },
  "last-one-title-line": {
    "bottom": 20
  },
  "last-one-content-line": {
    "width": 0
  },
  "point": {
    "position": "absolute",
    "top": 13,
    "left": 32,
    "width": 14,
    "height": 14,
    "backgroundColor": "#FFF0BD",
    "borderStyle": "solid",
    "borderWidth": 2,
    "borderColor": "#EE9900",
    "borderRadius": 100
  },
  "highlight-point": {
    "top": 7,
    "left": 26,
    "width": 26,
    "height": 26,
    "backgroundColor": "#EE9900",
    "borderStyle": "solid",
    "borderWidth": 6,
    "borderColor": "#FFE78D"
  },
  "text-title": {
    "fontSize": 30,
    "color": "#3d3d3d"
  },
  "text-highlight-title": {
    "color": "#EE9900"
  },
  "text-desc": {
    "fontSize": 24,
    "color": "#a5a5a5",
    "marginBottom": 12
  },
  "text-date": {
    "fontSize": 24,
    "color": "#a5a5a5"
  }
}

/***/ }),
/* 179 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

exports.default = {
  props: {
    list: {
      type: Array,
      required: true
    },
    themeColor: {
      type: Object,
      default: function _default() {
        return {};
      }
    }
  },
  computed: {
    cItems: function cItems() {
      return this.adapter(this.list);
    }
  },
  methods: {
    adapter: function adapter(items) {
      var _themeColor = this.themeColor,
          lineColor = _themeColor.lineColor,
          pointInnerColor = _themeColor.pointInnerColor,
          pointBorderColor = _themeColor.pointBorderColor,
          highlightTitleColor = _themeColor.highlightTitleColor,
          highlightPointInnerColor = _themeColor.highlightPointInnerColor,
          highlightPointBorderColor = _themeColor.highlightPointBorderColor;

      var len = items.length;
      var pre = Date.now();

      return items.map(function (item, index) {
        item.key = pre + '_' + index;
        item.__titleLineClass__ = [];
        item.__contentClass__ = [];
        item.__contentLineClass__ = [];
        item.__pointClass__ = [];
        item.__titleTextClass__ = [];
        item.__pointStyle__ = {};
        item.__lineStyle__ = {};
        item.__titleStyle__ = {};

        if (lineColor) item.__lineStyle__.backgroundColor = lineColor;
        if (pointInnerColor) item.__pointStyle__.backgroundColor = pointInnerColor;
        if (pointBorderColor) item.__pointStyle__.borderColor = pointBorderColor;

        if (index === 0) {
          item.__titleLineClass__.push('first-one-title-line');
        }

        if (index === len - 1) {
          item.__titleLineClass__.push('last-one-title-line');
          item.__contentClass__.push('last-one-content');
          item.__contentLineClass__.push('last-one-content-line');
        }

        if (item.highlight) {
          item.__pointClass__.push('highlight-point');
          item.__titleTextClass__.push('text-highlight-title');
          if (highlightTitleColor) item.__titleStyle__.color = highlightTitleColor;
          if (highlightPointInnerColor) item.__pointStyle__.backgroundColor = highlightPointInnerColor;
          if (highlightPointBorderColor) item.__pointStyle__.borderColor = highlightPointBorderColor;
        }
        return item;
      });
    }
  }
};

/***/ }),
/* 180 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: ["root"]
  }, _vm._l((_vm.cItems), function(item, index) {
    return _c('div', {
      key: item.key
    }, [_c('div', {
      staticClass: ["title", "flex-row"]
    }, [_c('div', {
      staticClass: ["line"],
      class: item.__titleLineClass__,
      style: item.__lineStyle__
    }), _c('div', {
      staticClass: ["point"],
      class: item.__pointClass__,
      style: item.__pointStyle__
    }), _c('text', {
      staticClass: ["text-title", "full-rest"],
      class: item.__titleTextClass__,
      style: item.__titleStyle__
    }, [_vm._v(_vm._s(item.title))])]), _c('div', {
      staticClass: ["content", "flex-row"],
      class: item.__contentClass__
    }, [_c('div', {
      staticClass: ["line"],
      class: item.__contentLineClass__,
      style: item.__lineStyle__
    }), _c('div', {
      staticClass: ["full-rest"]
    }, [(item.desc) ? _c('text', {
      staticClass: ["text-desc"]
    }, [_vm._v(_vm._s(item.desc))]) : _vm._e(), (item.date) ? _c('text', {
      staticClass: ["text-date"]
    }, [_vm._v(_vm._s(item.date))]) : _vm._e()])])])
  }))
},staticRenderFns: []}
module.exports.render._withStripped = true

/***/ }),
/* 181 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = __webpack_require__(182);

Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_index).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 182 */
/***/ (function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = []

/* styles */
__vue_styles__.push(__webpack_require__(183)
)

/* script */
__vue_exports__ = __webpack_require__(184)

/* template */
var __vue_template__ = __webpack_require__(185)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.__file = "/Users/Tw93/www/github/weex-ui/packages/wxc-slide-nav/index.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-ce8354f4"
__vue_options__.style = __vue_options__.style || {}
__vue_styles__.forEach(function (module) {
  for (var name in module) {
    __vue_options__.style[name] = module[name]
  }
})
if (typeof __register_static_styles__ === "function") {
  __register_static_styles__(__vue_options__._scopeId, __vue_styles__)
}

module.exports = __vue_exports__


/***/ }),
/* 183 */
/***/ (function(module, exports) {

module.exports = {
  "slide-nav": {
    "position": "absolute",
    "zIndex": 1000
  }
}

/***/ }),
/* 184 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

var DOM = weex.requireModule('dom');
// const Modal = weex.requireModule('modal');
var Animation = weex.requireModule('animation');
var OFFSET_ACCURACY = 10;
var SCALE = weex.config.env.platform.toLowerCase() === 'web' ? 2 : 1;

function _toNum(str) {
  return typeof str === 'number' ? str : parseFloat((str || '').replace(/px$/i, ''));
}

function _getHeight(element, callback) {
  if (!element) {
    return;
  }
  if (element.__cacheHeight) {
    element.__cacheHeight && callback && callback(element.__cacheHeight);
  } else {
    DOM.getComponentRect(element, function (res) {
      var height = (parseFloat(res && res.size && res.size.height) || 0) / SCALE;
      height && callback && callback(element.__cacheHeight = height);
    });
  }
}

exports.default = {

  props: {
    position: {
      'type': String,
      'default': 'top'
    },

    height: [String, Number]
  },

  data: function data() {
    return {
      visible: true
    };
  },


  watch: {
    visible: function visible(newVal) {
      newVal ? this._slideIn() : this._slideOut();
    }
  },

  created: function created() {
    this._height = _toNum(this.height) || 0;
    this._isBottom = this.position === 'bottom';
    this._direction = this._isBottom ? 1 : -1;
  },


  methods: {
    _slideOut: function _slideOut() {
      var _this = this;

      this.getHeight(function (height) {
        _this.$emit('slideOut');
        _this.slideY(height * _this._direction * SCALE, function () {
          _this.$emit('slideOutEnd');
        });
      });
    },
    _slideIn: function _slideIn() {
      var _this2 = this;

      this.getHeight(function (height) {
        _this2.$emit('slideIn');
        _this2.slideY(0, function () {
          _this2.$emit('slideInEnd');
        });
      });
    },
    getHeight: function getHeight(callback) {
      return _getHeight(this.$refs.wrapper, callback);
    },
    slideOut: function slideOut() {
      this.visible = false;
    },
    slideIn: function slideIn() {
      this.visible = true;
    },
    slideY: function slideY(y, callback) {
      Animation.transition(this.$refs.wrapper, {
        styles: { transform: 'translateY(' + y + 'px)' },
        duration: 150, //ms
        timingFunction: 'ease',
        delay: 0 //ms
      }, callback);
    }
  },

  handleTouchStart: function handleTouchStart(e) {
    var touch = e.changedTouches[0];
    this._touchParams = {
      pageY: touch.screenY,
      startY: touch.screenY,
      lastPageY: touch.screenY,
      timeStamp: e.timeStamp,
      direction: -1
    };
  },
  handleTouchMove: function handleTouchMove(e, bottomNav) {
    var tp = this._touchParams;
    var touch = e.changedTouches[0];
    var offsetY = void 0;

    // 安卓下滚动的时候经常不触发touchstart事件
    if (!tp || tp.hasEnd) {
      return this._touchParams = {
        pageY: touch.screenY,
        startY: touch.screenY,
        lastPageY: touch.screenY,
        timeStamp: e.timeStamp,
        direction: -1
      };
    }

    offsetY = touch.screenY - tp.pageY;

    tp.lastPageY = tp.pageY;
    tp.lastDirection = tp.direction;
    tp.direction = offsetY > 0 ? 1 : -1;

    if (tp.lastDirection !== tp.direction) {
      tp.startY = tp.lastPageY;
    }

    tp.pageY = touch.screenY;
    tp.offsetY = tp.pageY - tp.startY;

    if (!this.__scrollable && bottomNav) {
      if (tp.offsetY <= -OFFSET_ACCURACY) {
        bottomNav.slideOut();
      } else if (tp.offsetY >= OFFSET_ACCURACY) {
        bottomNav.slideIn();
      }
    }
  },
  handleTouchEnd: function handleTouchEnd() {
    var tp = this._touchParams;
    tp && (tp.hasEnd = true);
  },
  handleScroll: function handleScroll(e, scroller, topNav, bottomNav, startThreshold) {
    var _this3 = this;

    var moveThreshold = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 5;

    var scrollY = e.contentOffset.y;
    var nav = topNav || bottomNav;
    var scrollFn = function scrollFn(maxScrollY) {
      if (-scrollY > maxScrollY) {
        return;
      }
      maxScrollY = Math.abs(maxScrollY);
      if (Math.abs(scrollY) < startThreshold) {
        if (Math.abs(scrollY) >= maxScrollY - OFFSET_ACCURACY) {
          var tp = _this3._touchParams;
          if (!tp) {
            return;
          }
          var offsetY = tp.offsetY;
          if (offsetY < -OFFSET_ACCURACY) {
            bottomNav && bottomNav.slideOut();
          } else if (offsetY > OFFSET_ACCURACY) {
            bottomNav && bottomNav.slideIn();
          }
        } else {
          topNav && topNav.slideIn();
          bottomNav && bottomNav.slideIn();
        }
      } else {
        var _tp = _this3._touchParams;
        if (!_tp) {
          return;
        }
        var _offsetY = _tp.offsetY;
        if (Math.abs(_offsetY) >= moveThreshold) {
          if (_offsetY > 0) {
            topNav && topNav.slideIn();
            bottomNav && bottomNav.slideIn();
          } else {
            topNav && topNav.slideOut();
            bottomNav && bottomNav.slideOut();
          }
        }
      }
    };

    var maxScrollYCheck = function maxScrollYCheck(maxScrollY) {
      if (!_this3.__scrollable) {
        return;
      }
      if (startThreshold) {
        scrollFn(maxScrollY);
      } else {
        nav.getHeight(function (navHeight) {
          startThreshold = navHeight;
          scrollFn(maxScrollY);
        });
      }
    };

    if (!nav) {
      return;
    }

    _getHeight(scroller, function (scrollerHeight) {
      var maxScrollY = e.contentSize.height - scrollerHeight;
      _this3.__scrollable = maxScrollY >= OFFSET_ACCURACY;

      if (bottomNav) {
        bottomNav.getHeight(function (height) {
          _this3.__scrollable = maxScrollY >= height;
          maxScrollYCheck(maxScrollY);
        });
      } else {
        maxScrollYCheck(maxScrollY);
      }
    });
  }
};

/***/ }),
/* 185 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    ref: "wrapper",
    staticClass: ["slide-nav"]
  }, [_vm._t("default")], 2)
},staticRenderFns: []}
module.exports.render._withStripped = true

/***/ }),
/* 186 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = __webpack_require__(187);

Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_index).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 187 */
/***/ (function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = []

/* styles */
__vue_styles__.push(__webpack_require__(188)
)

/* script */
__vue_exports__ = __webpack_require__(189)

/* template */
var __vue_template__ = __webpack_require__(191)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.__file = "/Users/Tw93/www/github/weex-ui/packages/wxc-slider-bar/index.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-221cc7de"
__vue_options__.style = __vue_options__.style || {}
__vue_styles__.forEach(function (module) {
  for (var name in module) {
    __vue_options__.style[name] = module[name]
  }
})
if (typeof __register_static_styles__ === "function") {
  __register_static_styles__(__vue_options__._scopeId, __vue_styles__)
}

module.exports = __vue_exports__


/***/ }),
/* 188 */
/***/ (function(module, exports) {

module.exports = {
  "wxc-slider-bar": {
    "userSelect": "none"
  },
  "slider-bar-container": {
    "height": 56,
    "display": "flex",
    "justifyContent": "center",
    "alignItems": "center"
  },
  "value-bar": {
    "height": 4
  },
  "slide-block": {
    "width": 56,
    "height": 56,
    "backgroundColor": "#ffffff",
    "borderRadius": 28,
    "borderWidth": 1,
    "borderColor": "rgba(0,0,0,0.1)",
    "boxShadow": "0 6px 12px rgba(0, 0, 0, 0.05)",
    "position": "absolute",
    "left": 0,
    "bottom": 0
  }
}

/***/ }),
/* 189 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

var Utils = __webpack_require__(190);
var EB = weex.requireModule('expressionBinding');
var animation = weex.requireModule('animation');
var dom = weex.requireModule('dom');

exports.default = {
  data: function data() {
    return {
      env: 'weex',
      diffX1: 0,
      diffX2: 0,
      barWidth: 0,
      preventMoveEvent: true,
      timeout: 100,
      minDiffX: 0,
      selectRange: [0, 0]
    };
  },
  props: {
    length: {
      type: Number,
      default: 500
    },
    height: {
      type: Number,
      default: 4
    },
    // 是否双滑块模式
    range: {
      type: Boolean,
      default: false
    },
    // 最小值
    min: {
      type: Number,
      default: 0
    },
    // 最大值
    max: {
      type: Number,
      default: 100
    },
    // 最小取值范围，用于范围选择范围最小差值
    minDiff: {
      type: Number,
      default: 5
    },
    // 设置当前取值。当 range 为 false 时，使用 number，否则用 [number, number]
    value: {
      type: [Number, Array],
      default: 0
    },
    // 设置初始取值。当 range 为 false 时，使用 number，否则用 [number, number]
    defaultValue: {
      type: [Number, Array],
      default: 0
    },
    // 值为 true 时，滑块为禁用状态
    disabled: {
      type: Boolean,
      default: false
    },
    invalidColor: {
      type: String,
      default: '#E0E0E0'
    },
    validColor: {
      type: String,
      default: '#EE9900'
    },
    disabledColor: {
      type: String,
      default: '#AAA'
    }
  },
  created: function created() {
    if (Utils.env.isWeb()) {
      this.env = 'web';
    }
  },
  mounted: function mounted() {
    var _this = this;

    this.block1 = this.$refs['slide-block-1']; // 左侧滑块
    this.block2 = this.$refs['slide-block-2']; // 右侧滑块
    this.valueBar = this.$refs['value-bar']; // 黄色值条
    this.barContainer = this.$refs['bar-container']; // 滚动条容器

    if (!this.range) {
      this.diffX1 = this._getDiffX(this.value || this.defaultValue);
    } else {
      this.diffX1 = this._getDiffX(this.value[0] || this.defaultValue[0]);
      this.diffX2 = this._getDiffX(this.value[1] || this.defaultValue[1]);
      this.barWidth = this.diffX2 - this.diffX1;
    }
    // 是否支持expresstionBinding
    if (Utils.env.supportsEB()) {
      this.block1 && EB.enableBinding(this.block1.ref, 'pan');
      this.block2 && EB.enableBinding(this.block2.ref, 'pan');
      this.valueBar && EB.enableBinding(this.valueBar.ref, 'pan');
    }
    if (Utils.env.isAndroid()) {
      this.timeout = 250;
    }
    if (this.range) {
      this.selectRange = this.value || this.defaultValue; // 初始化范围选择返回数据
      this.minDiffX = this.minDiff / (this.max - this.min) * this.length; // 滑块1、2之前最小间距
    }
    // 由于weex在mounted后渲染是异步的不能确保元素渲染完成，需要异步执行
    setTimeout(function () {
      dom.getComponentRect(_this.barContainer, function (option) {
        var left = option.size.left;

        _this.leftDiffX = left;
      });
    }, 100);

    this.bindExp();
  },

  computed: {
    containerStyle: function containerStyle() {
      return {
        width: this.length + 56 + 'px',
        height: '56px'
      };
    },
    rangeBarStyle: function rangeBarStyle() {
      return {
        width: this.length + 'px',
        height: this.height + 'px',
        flexDirection: 'row',
        backgroundColor: this.invalidColor,
        overflow: 'hidden'
      };
    },
    valueBarStyle: function valueBarStyle() {
      var left = 0;
      var width = 0;
      if (!this.range) {
        width = this.diffX1;
      } else {
        left = this.diffX1;
        width = this.diffX2 - this.diffX1;
      }
      return {
        width: width + 'px',
        height: this.height + 'px',
        transform: 'translateX(' + left + 'px)',
        backgroundColor: this.disabled ? this.disabledColor : this.validColor
      };
    },
    blockStyle1: function blockStyle1() {
      return {
        transform: 'translateX(' + this.diffX1 + 'px)'
      };
    },
    blockStyle2: function blockStyle2() {
      return {
        transform: 'translateX(' + this.diffX2 + 'px)'
      };
    }
  },
  methods: {
    dispatchPan: function dispatchPan() {},


    // 更新单选值或最小值
    _weexStartHandler1: function _weexStartHandler1() {
      var _this2 = this;

      this.firstInterval = setInterval(function () {
        if (!_this2.range) {
          dom.getComponentRect(_this2.valueBar, function (option) {
            var width = option.size.width;

            var value = _this2._getValue(width);
            _this2.$emit('updateValue', value);
          });
        } else {
          dom.getComponentRect(_this2.block1, function (option) {
            var left = option.size.left;

            _this2.selectRange[0] = _this2._getValue(left - _this2.leftDiffX);
            _this2.$emit('updateValue', _this2.selectRange);
          });
        }
      }, this.timeout);
    },


    // 更新最大值
    _weexStartHandler2: function _weexStartHandler2() {
      var _this3 = this;

      this.secondInterval = setInterval(function () {
        dom.getComponentRect(_this3.block2, function (option) {
          var left = option.size.left;

          _this3.selectRange[1] = _this3._getValue(left - _this3.leftDiffX);
          _this3.$emit('updateValue', _this3.selectRange);
        });
      }, this.timeout);
    },


    // 清除定时器
    _weexEndHandler: function _weexEndHandler() {
      this.firstInterval && clearInterval(this.firstInterval);
      this.secondInterval && clearInterval(this.secondInterval);
    },
    _webStartHandler: function _webStartHandler(e) {
      if (this.env === 'weex') {
        return;
      }
      this.startX = e.touch.clientX;
      this.startDiffX1 = this.diffX1;
      this.startDiffX2 = this.diffX2;
    },
    _webMoveHandler1: function _webMoveHandler1(e) {
      if (this.env === 'weex' || this.disabled) {
        return;
      }
      var deltaX = e.touch.clientX - this.startX;
      var diff = this.startDiffX1 + deltaX;
      var max = this.length;
      if (this.range) {
        max = this.diffX2 - this.minDiffX;
      }
      if (diff > 0 && diff < max) {
        this.diffX1 = diff;
        animation.transition(this.block1, {
          styles: {
            transform: 'translateX(' + this.diffX1 + 'px)'
          }
        }, function () {});
        if (!this.range) {
          this.$emit('updateValue', this._getValue(this.diffX1));
        } else {
          this.selectRange[0] = this._getValue(this.diffX1);
          this.$emit('updateValue', this.selectRange);
        }
      }
    },
    _webMoveHandler2: function _webMoveHandler2(e) {
      if (this.env === 'weex' || this.disabled) {
        return;
      }
      var deltaX = e.touch.clientX - this.startX;
      var diff = this.startDiffX2 + deltaX;
      var min = this.diffX1 + this.minDiffX;
      var max = this.length;
      if (diff > min && diff < max) {
        this.diffX2 = diff;
        animation.transition(this.block2, {
          styles: {
            transform: 'translateX(' + this.diffX2 + 'px)'
          }
        }, function () {});
        if (!this.range) {
          this.$emit('updateValue', this._getValue(this.diffX2));
        } else {
          this.selectRange[1] = this._getValue(this.diffX2);
          this.$emit('updateValue', this.selectRange);
        }
      }
    },
    bindExp: function bindExp() {
      var self = this;

      // 如果禁用，不行进行表达式绑定
      if (self.disabled) {
        return;
      }

      // 初始化按钮&条的大小范围
      var blockMax1 = 0;
      if (self.range) {
        blockMax1 = self.diffX2 - self.minDiffX;
      } else {
        blockMax1 = self.length;
      }

      var blockMax2 = self.length;
      var blockMin2 = self.diffX1 + self.minDiffX;
      var barMax1 = self.diffX2;
      var barMax2 = self.length - self.diffX1;

      // 滑块1表达式
      var expBlock1 = '{"type":"CallExpression","children":[{"type":"Identifier","value":"min"},{"type":"Arguments","children":[{"type":"NumericLiteral","value":' + blockMax1 + '},{"type":"CallExpression","children":[{"type":"Identifier","value":"max"},{"type":"Arguments","children":[{"type":"+","children":[{"type":"Identifier","value":"x"},{"type":"NumericLiteral","value":' + self.diffX1 + '}]},{"type":"NumericLiteral","value":0}]}]}]}]}';
      // 滑块2表达式
      var expBlock2 = '{"type":"CallExpression","children":[{"type":"Identifier","value":"min"},{"type":"Arguments","children":[{"type":"NumericLiteral","value":' + blockMax2 + '},{"type":"CallExpression","children":[{"type":"Identifier","value":"max"},{"type":"Arguments","children":[{"type":"+","children":[{"type":"Identifier","value":"x"},{"type":"NumericLiteral","value":' + self.diffX2 + '}]},{"type":"NumericLiteral","value":' + blockMin2 + '}]}]}]}]}';
      // valuebar表达式
      var expBar1 = '{"type":"CallExpression","children":[{"type":"Identifier","value":"min"},{"type":"Arguments","children":[{"type":"NumericLiteral","value":' + barMax1 + '},{"type":"CallExpression","children":[{"type":"Identifier","value":"max"},{"type":"Arguments","children":[{"type":"NumericLiteral","value":0},{"type":"-","children":[{"type":"NumericLiteral","value":' + self.barWidth + '},{"type":"Identifier","value":"x"}]}]}]}]}]}';
      // valuebar 范围表达式
      var expBar2 = '{"type":"CallExpression","children":[{"type":"Identifier","value":"min"},{"type":"Arguments","children":[{"type":"NumericLiteral","value":' + barMax2 + '},{"type":"CallExpression","children":[{"type":"Identifier","value":"max"},{"type":"Arguments","children":[{"type":"NumericLiteral","value":0},{"type":"+","children":[{"type":"NumericLiteral","value":' + self.barWidth + '},{"type":"Identifier","value":"x"}]}]}]}]}]}';

      if (!self.range) {
        // 单选
        var args = [{
          element: self.block1.ref,
          property: 'transform.translateX',
          expression: expBlock1
        }, {
          element: self.valueBar.ref,
          property: 'width',
          expression: expBlock1
        }];
        EB && EB.createBinding(self.block1.ref, 'pan', '', args, function (e) {
          if (e.state === 'end') {
            var range = self.getRange();
            // 限制diffX1范围
            self.diffX1 = self._restrictValue(range.rangeX1, self.diffX1 + e.deltaX);
            self.bindExp();
          }
        });
      } else {
        // 选范围
        var _args = [{
          element: self.block1.ref,
          property: 'transform.translateX',
          expression: expBlock1
        }, {
          element: self.valueBar.ref,
          property: 'transform.translateX',
          expression: expBlock1
        }, {
          element: self.valueBar.ref,
          property: 'width',
          expression: expBar1
        }];

        var args2 = [{
          element: self.block2.ref,
          property: 'transform.translateX',
          expression: expBlock2
        }, {
          element: self.valueBar.ref,
          property: 'width',
          expression: expBar2
        }];

        EB && EB.createBinding(self.block1.ref, 'pan', '', _args, function (e) {
          if (e.state === 'end') {
            var range = self.getRange();
            self.barWidth = self._restrictValue(range.rangeX1, self.barWidth - e.deltaX);
            self.diffX1 = self._restrictValue(range.rangeX1, self.diffX1 + e.deltaX);
            self.bindExp();
          }
        });

        EB && EB.createBinding(self.block2.ref, 'pan', '', args2, function (e) {
          if (e.state === 'end') {
            var range = self.getRange();
            self.diffX2 = self._restrictValue(range.rangeX2, self.diffX2 + e.deltaX);
            self.barWidth = self._restrictValue([0, self.length - self.diffX1], self.barWidth + e.deltaX);
            self.bindExp();
          }
        });
      }
    },


    // 获取diffx1 diffx2 取值范围
    getRange: function getRange(deltaX) {
      if (!this.range) {
        return {
          rangeX1: [0, this.length]
        };
      } else {
        return {
          rangeX1: [0, this.diffX2 - this.minDiffX],
          rangeX2: [this.diffX1 + this.minDiffX, this.length]
        };
      }
    },


    // 限制取值范围
    _restrictValue: function _restrictValue(range, value) {
      if (range && range.length && range.length === 2) {
        if (value < range[0]) {
          return range[0];
        } else if (value > range[1]) {
          return range[1];
        } else {
          return value;
        }
      }
      return;
    },


    // 根据x方向偏移量计算value
    _getValue: function _getValue(diffX) {
      return Math.round(diffX / this.length * (this.max - this.min) + this.min);
    },


    // 根据value和length计算x方向偏移值
    _getDiffX: function _getDiffX(value) {
      return (value - this.min) / (this.max - this.min) * this.length;
    }
  }
};

/***/ }),
/* 190 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * 工具方法库
 * @namespace Utils
 * @example
 *
 */
var Utils = {

  env: {

    /**
     * 是否是手淘容器
     * @method
     * @memberOf Utils.env
     * @returns {boolean}
     * @example
     *
     * const isTaobao = env.isTaobao();
     */
    isTaobao: function isTaobao() {
      var appName = weex.config.env.appName;

      return (/(tb|taobao|淘宝)/i.test(appName)
      );
    },


    /**
     * 是否是旅客容器
     * @memberOf Utils.env
     * @method
     * @returns {boolean}
     * @example
     *
     * const isTrip = env.isTrip();
     */
    isTrip: function isTrip() {
      var appName = weex.config.env.appName;

      return appName === 'LX';
    },

    /**
     * 是否是 web 环境
     * @memberOf Utils.env
     * @method
     * @returns {boolean}
     * @example
     *
     * const isWeb = env.isWeb();
     */
    isWeb: function isWeb() {
      var platform = weex.config.env.platform;

      return (typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && platform.toLowerCase() === 'web';
    },

    /**
     * 是否是 iOS 系统
     * @memberOf Utils.env
     * @method
     * @returns {boolean}
     * @example
     *
     * const isIOS = env.isIOS();
     */
    isIOS: function isIOS() {
      var platform = weex.config.env.platform;

      return platform.toLowerCase() === 'ios';
    },

    /**
     * 是否是 Android 系统
     * @memberOf Utils.env
     * @method
     * @returns {boolean}
     * @example
     *
     * const isAndroid = env.isAndroid();
     */
    isAndroid: function isAndroid() {
      var platform = weex.config.env.platform;

      return platform.toLowerCase() === 'android';
    },


    /**
     * 是否是支付宝容器
     * @memberOf Utils.env
     * @method
     * @returns {boolean}
     * @example
     *
     * const isAlipay = env.isAlipay();
     */
    isAlipay: function isAlipay() {
      var appName = weex.config.env.appName;

      return appName === 'AP';
    },


    /**
     * 是否是支付宝H5容器(防止以后支付宝接入weex)
     * @memberOf Utils.env
     * @method
     * @returns {boolean}
     * @example
     *
     * const isAlipayWeb = env.isAlipayWeb();
     */
    isAlipayWeb: function isAlipayWeb() {
      return Utils.env.isAlipay() && Utils.env.isWeb();
    },


    /**
     * 判断是否支持expressionBinding
     * 当weex版本大于0.10.1.6，为客户端即可以支持expressionBinding
     * @returns {Boolean}
     */
    supportsEB: function supportsEB() {
      var weexVersion = weex.config.env.weexVersion || '0';
      var isHighWeex = Utils.compareVersion(weexVersion, '0.10.1.4') && (Utils.env.isIOS() || Utils.env.isAndroid());
      var expressionBinding = weex.requireModule('expressionBinding');
      return expressionBinding && expressionBinding.enableBinding && isHighWeex;
    },


    /**
     * 判断Android容器是否支持是否支持expressionBinding(处理方式很不一致)
     * @returns {boolean}
     */
    supportsEBForAndroid: function supportsEBForAndroid() {
      return Utils.env.isAndroid() && Utils.env.supportsEB();
    },


    /**
     * 判断IOS容器是否支持是否支持expressionBinding
     * @returns {boolean}
     */
    supportsEBForIos: function supportsEBForIos() {
      return Utils.env.isIOS() && Utils.env.supportsEB();
    },


    /**
     * 获取weex屏幕真实的设置高度，需要减去导航栏高度
     * @returns {Number}
     */
    getPageHeight: function getPageHeight() {
      var env = weex.config.env;

      var navHeight = Utils.env.isWeb() ? 0 : 130;
      return env.deviceHeight / env.deviceWidth * 750 - navHeight;
    }
  },

  /**
   * 版本号比较
   * @memberOf Utils
   * @param currVer {string}
   * @param promoteVer {string}
   * @returns {boolean}
   * @example
   *
   * const { compareVersion } = Utils;
   * console.log(compareVersion('0.1.100', '0.1.11')); // 'true'
   */
  compareVersion: function compareVersion() {
    var currVer = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "0.0.0";
    var promoteVer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "0.0.0";

    if (currVer === promoteVer) return true;
    var currVerArr = currVer.split(".");
    var promoteVerArr = promoteVer.split(".");
    var len = Math.max(currVerArr.length, promoteVerArr.length);
    for (var i = 0; i < len; i++) {
      var proVal = ~~promoteVerArr[i];
      var curVal = ~~currVerArr[i];
      if (proVal < curVal) {
        return true;
      } else if (proVal > curVal) {
        return false;
      }
    }
    return false;
  }
};

module.exports = Utils;

/***/ }),
/* 191 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: ["wxc-slider-bar"]
  }, [_c('div', {
    ref: "bar-container",
    staticClass: ["slider-bar-container"],
    style: _vm.containerStyle
  }, [_c('div', {
    staticClass: ["range-bar"],
    style: _vm.rangeBarStyle
  }, [_c('div', {
    ref: "value-bar",
    staticClass: ["value-bar"],
    style: _vm.valueBarStyle
  }, [_c('div')])]), _c('div', {
    ref: "slide-block-1",
    staticClass: ["slide-block"],
    style: _vm.blockStyle1,
    attrs: {
      "preventMoveEvent": _vm.preventMoveEvent
    },
    on: {
      "touchstart": _vm._weexStartHandler1,
      "panstart": _vm._webStartHandler,
      "panmove": _vm._webMoveHandler1,
      "touchend": _vm._weexEndHandler,
      "horizontalpan": _vm.dispatchPan
    }
  }, [_c('div')]), (_vm.range) ? _c('div', {
    ref: "slide-block-2",
    staticClass: ["slide-block"],
    style: _vm.blockStyle2,
    attrs: {
      "preventMoveEvent": _vm.preventMoveEvent
    },
    on: {
      "touchstart": _vm._weexStartHandler2,
      "panstart": _vm._webStartHandler,
      "panmove": _vm._webMoveHandler2,
      "touchend": _vm._weexEndHandler,
      "horizontalpan": _vm.dispatchPan
    }
  }, [_c('div')]) : _vm._e()])])
},staticRenderFns: []}
module.exports.render._withStripped = true

/***/ }),
/* 192 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = __webpack_require__(193);

Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_index).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 193 */
/***/ (function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = []

/* styles */
__vue_styles__.push(__webpack_require__(194)
)

/* script */
__vue_exports__ = __webpack_require__(195)

/* template */
var __vue_template__ = __webpack_require__(196)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.__file = "/Users/Tw93/www/github/weex-ui/packages/wxc-stepper/index.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-2fc4e5d0"
__vue_options__.style = __vue_options__.style || {}
__vue_styles__.forEach(function (module) {
  for (var name in module) {
    __vue_options__.style[name] = module[name]
  }
})
if (typeof __register_static_styles__ === "function") {
  __register_static_styles__(__vue_options__._scopeId, __vue_styles__)
}

module.exports = __vue_exports__


/***/ }),
/* 194 */
/***/ (function(module, exports) {

module.exports = {
  "wxc-stepper": {
    "flexDirection": "row"
  },
  "stepper-plus": {
    "width": 56,
    "height": 56,
    "backgroundColor": "#ededed",
    "alignItems": "center",
    "justifyContent": "center",
    "borderRadius": 6
  },
  "stepper-minus": {
    "width": 56,
    "height": 56,
    "backgroundColor": "#ededed",
    "alignItems": "center",
    "justifyContent": "center",
    "borderRadius": 6
  },
  "stepper-input": {
    "borderWidth": 0,
    "outline": "none",
    "textAlign": "center",
    "color": "#3d3d3d",
    "fontSize": 30,
    "lineHeight": 56,
    "width": 86
  },
  "stepper-icon": {
    "fontSize": 36,
    "color": "#666666",
    "marginTop": -4
  }
}

/***/ }),
/* 195 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

module.exports = {
  props: {
    min: {
      type: [String, Number],
      default: 1
    },
    max: {
      type: [String, Number],
      default: 100
    },
    step: {
      type: [String, Number],
      default: 1
    },
    disabled: {
      type: Boolean,
      default: false
    },
    defaultValue: {
      type: [String, Number],
      default: 1
    },
    readOnly: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    disableStyle: function disableStyle() {
      if (this.disabled) {
        return {
          color: '#cccccc'
        };
      }
    },
    valueString: function valueString() {
      return this.value.toString();
    }
  },
  data: function data() {
    return {
      value: 1,
      isLess: false,
      isOver: false
    };
  },
  created: function created() {
    var self = this;
    self.value = parseInt(self.defaultValue, 10);
    if (self.disabled) {
      self.isLess = true;
      self.isOver = true;
    }
  },

  methods: {
    minusClicked: function minusClicked() {
      var self = this;
      if (self.disabled) {
        return;
      }
      var isMinOver = self.value <= self.min;
      var nowNum = self.value - parseInt(self.step, 10);
      if (isMinOver) {
        self.$emit('wxcStepperValueIsMinOver', { value: self.value });
      } else {
        self.value = nowNum;
        self.resetDisabledStyle();
      }
      // 由于此处已经减step
      if (nowNum <= self.min) {
        self.value = parseInt(self.min, 10);
        self.isLess = true;
      }
      self.$emit('wxcStepperValueChanged', { value: self.value });
    },
    plusClicked: function plusClicked() {
      var self = this;
      if (self.disabled) {
        return;
      }
      var isMaxOver = self.value >= self.max;
      var nowNum = self.value + parseInt(self.step, 10);
      if (isMaxOver) {
        self.$emit('wxcStepperValueIsMaxOver', { value: self.value });
      } else {
        self.value = nowNum;
        self.resetDisabledStyle();
      }
      // 由于此处已经加step
      if (nowNum >= self.max) {
        self.value = parseInt(self.max, 10);
        self.isOver = true;
      }
      self.$emit('wxcStepperValueChanged', { value: self.value });
    },
    onInput: function onInput(e) {
      this.correctInputValue(e.value);
    },
    onBlur: function onBlur(e) {
      this.correctInputValue(e.value);
    },
    correctInputValue: function correctInputValue(v) {
      var self = this;
      if (/^[1-9]\d{0,}$/.test(v) && parseInt(v, 10) >= self.min && parseInt(v, 10) <= self.max) {
        self.value = parseInt(v, 10);
      }
      self.$emit('wxcStepperValueChanged', { value: self.value });
    },
    resetDisabledStyle: function resetDisabledStyle() {
      this.isLess = false;
      this.isOver = false;
    }
  }
};

/***/ }),
/* 196 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: ["wxc-stepper"]
  }, [_c('div', {
    staticClass: ["stepper-minus"],
    on: {
      "click": _vm.minusClicked
    }
  }, [_c('text', {
    staticClass: ["stepper-icon"],
    style: {
      color: _vm.isLess ? '#cccccc' : '#666666'
    }
  }, [_vm._v("-")])]), _c('input', {
    staticClass: ["stepper-input"],
    style: _vm.disableStyle,
    attrs: {
      "type": "number",
      "value": _vm.valueString,
      "disabled": _vm.disabled || _vm.readOnly
    },
    on: {
      "input": _vm.onInput,
      "blur": _vm.onBlur
    }
  }), _c('div', {
    staticClass: ["stepper-plus"],
    on: {
      "click": _vm.plusClicked
    }
  }, [_c('text', {
    staticClass: ["stepper-icon"],
    style: {
      color: _vm.isOver ? '#cccccc' : '#666666'
    }
  }, [_vm._v("+")])])])
},staticRenderFns: []}
module.exports.render._withStripped = true

/***/ }),
/* 197 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = __webpack_require__(198);

Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_index).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 198 */
/***/ (function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = []

/* styles */
__vue_styles__.push(__webpack_require__(199)
)

/* script */
__vue_exports__ = __webpack_require__(200)

/* template */
var __vue_template__ = __webpack_require__(202)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.__file = "/Users/Tw93/www/github/weex-ui/packages/wxc-tab-page/index.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-40ad0f7e"
__vue_options__.style = __vue_options__.style || {}
__vue_styles__.forEach(function (module) {
  for (var name in module) {
    __vue_options__.style[name] = module[name]
  }
})
if (typeof __register_static_styles__ === "function") {
  __register_static_styles__(__vue_options__._scopeId, __vue_styles__)
}

module.exports = __vue_exports__


/***/ }),
/* 199 */
/***/ (function(module, exports) {

module.exports = {
  "wxc-tab-page": {
    "width": 750,
    "flexDirection": "column",
    "backgroundColor": "#f2f3f4"
  },
  "tab-title-list": {
    "flexDirection": "row"
  },
  "title-item": {
    "justifyContent": "center",
    "alignItems": "center",
    "flexDirection": "column",
    "borderBottomStyle": "solid",
    "position": "relative"
  },
  "border-bottom": {
    "position": "absolute",
    "bottom": 0
  },
  "tab-page-wrap": {
    "width": 750,
    "overflow": "hidden",
    "position": "relative"
  },
  "tab-container": {
    "flex": 1,
    "flexDirection": "row",
    "position": "absolute"
  },
  "tab-text": {
    "lines": 1,
    "textOverflow": "ellipsis"
  }
}

/***/ }),
/* 200 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

var dom = weex.requireModule('dom');
var animation = weex.requireModule('animation');
var swipeBack = weex.requireModule('swipeBack');
var expressionBinding = weex.requireModule('expressionBinding');

var Utils = __webpack_require__(201);
var supportsEB = Utils.env.supportsEB();
var supportsEBForIos = Utils.env.supportsEBForIos();
var isIos = Utils.env.isIOS();

module.exports = {
  props: {
    tabTitles: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    panDist: {
      type: Number,
      default: 200
    },
    spmC: {
      type: [String, Number],
      default: ''
    },
    tabStyles: {
      type: Object,
      default: function _default() {
        return {
          bgColor: '#FFFFFF',
          titleColor: '#666666',
          activeTitleColor: '#3D3D3D',
          activeBgColor: '#FFFFFF',
          isActiveTitleBold: true,
          iconWidth: 70,
          iconHeight: 70,
          width: 160,
          height: 120,
          fontSize: 24,
          hasActiveBottom: true,
          activeBottomColor: '#FFC900',
          activeBottomWidth: 120,
          activeBottomHeight: 6,
          textPaddingLeft: 10,
          textPaddingRight: 10
        };
      }
    },
    titleType: {
      type: String,
      default: 'icon'
    },
    tabPageHeight: {
      type: [String, Number],
      default: 1334
    },
    isTabView: {
      type: Boolean,
      default: true
    },
    needSlider: {
      type: Boolean,
      default: true
    },
    duration: {
      type: [Number, String],
      default: 300
    },
    timingFunction: {
      type: String,
      default: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    }
  },
  data: function data() {
    return {
      currentPage: 0,
      isMoving: false,
      startTime: 0,
      deltaX: 0,
      translateX: 0,
      startPosX: 0,
      startPosY: 0,
      judge: 'INITIAL'
    };
  },
  mounted: function mounted() {
    var _this = this;

    if (swipeBack && swipeBack.forbidSwipeBack) {
      swipeBack.forbidSwipeBack(true);
    }
    if (supportsEBForIos && this.needSlider && this.isTabView) {
      setTimeout(function () {
        var tabPageEl = _this.$refs['tab-page-wrap'];
        tabPageEl && tabPageEl.ref && _this.bindExp(tabPageEl);
      }, 20);
    }
  },

  methods: {
    next: function next() {
      var page = this.currentPage;
      if (page < this.tabTitles.length - 1) {
        page++;
      }
      this.setPage(page);
    },
    prev: function prev() {
      var page = this.currentPage;
      if (page > 0) {
        page--;
      }
      this.setPage(page);
    },
    startHandler: function startHandler(e) {
      var _this2 = this;

      if (supportsEBForIos && e.state === 'start' && this.isTabView && this.needSlider) {
        // list下拉和到最下面问题修复
        setTimeout(function () {
          _this2.bindExp(_this2.$refs['tab-page-wrap']);
        }, 0);
      }
    },
    bindExp: function bindExp(element) {
      var _this3 = this;

      if (!this.isMoving && element && element.ref) {
        var tabElement = this.$refs['tab-container'];
        var currentPage = this.currentPage,
            panDist = this.panDist;

        var dist = currentPage * 750;
        // x-dist
        var args = [{
          element: tabElement.ref,
          property: 'transform.translateX',
          expression: '{"type":"-","children":[{"type":"Identifier","value":"x"},{"type":"NumericLiteral","value":' + dist + '}]}'
        }];
        expressionBinding.enableBinding(element.ref, 'pan');
        expressionBinding.createBinding(element.ref, 'pan', '', args, function (e) {
          var deltaX = e.deltaX,
              state = e.state;

          if (state === 'end') {
            if (deltaX < -panDist) {
              _this3.next();
            } else if (deltaX > panDist) {
              _this3.prev();
            } else {
              _this3.setPage(currentPage);
            }
          }
        });
      }
    },
    setPage: function setPage(page) {
      var _this4 = this;

      var url = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      if (!this.isTabView) {
        this.jumpOut(url);
        return;
      }
      if (this.isMoving === true) {
        return;
      }
      this.isMoving = true;
      var previousPage = this.currentPage;
      var currentTabEl = this.$refs['wxc-tab-title-' + page][0];
      var width = this.tabStyles.width;

      var appearNum = parseInt(750 / width);
      var tabsNum = this.tabTitles.length;
      var computedPage = tabsNum > appearNum ? 2 : page;
      var offset = page > appearNum ? -(750 - width) / 2 : -width * computedPage;

      (previousPage > appearNum || page > 1) && dom.scrollToElement(currentTabEl, {
        offset: offset
      });

      page <= 1 && previousPage > page && dom.scrollToElement(currentTabEl, {
        offset: -width * page
      });

      if (isIos) {
        // 高版本ios 手淘上面会有不固定情况，hack一下
        setTimeout(function () {
          _this4._animateTransformX(page);
        }, 10);
      } else {
        this._animateTransformX(page);
      }

      this.isMoving = false;
      this.currentPage = page;
      this.$emit('wxcTabPageCurrentTabSelected', { page: page });
    },
    jumpOut: function jumpOut(url) {
      url && Utils.goToH5Page(url);
    },
    _animateTransformX: function _animateTransformX(page) {
      var duration = this.duration,
          timingFunction = this.timingFunction;

      var containerEl = this.$refs['tab-container'];
      var dist = page * 750;
      animation.transition(containerEl, {
        styles: {
          transform: 'translateX(' + -dist + 'px)'
        },
        duration: duration,
        timingFunction: timingFunction,
        delay: 0
      }, function () {});
    },
    _onTouchStart: function _onTouchStart(e) {
      if (supportsEB || !this.isTabView || !this.needSlider) {
        return;
      }
      this.startPosX = this._getTouchXPos(e);
      this.startPosY = this._getTouchYPos(e);
      this.deltaX = 0;
      this.startTime = new Date().getTime();
    },
    _onTouchMove: function _onTouchMove(e) {
      if (supportsEB || !this.isTabView || !this.needSlider) {
        return;
      }
      this.deltaX = this._getTouchXPos(e) - this.startPosX;
      this.deltaY = Math.abs(this._getTouchYPos(e) - this.startPosY + 1);
      if (this.judge === 'INITIAL' && Math.abs(this.deltaX) / this.deltaY > 1.73) {
        this.judge = 'SLIDE_ING';
      }
    },
    _onTouchEnd: function _onTouchEnd() {
      if (supportsEB || !this.isTabView || !this.needSlider) {
        return;
      }
      if (this.judge === 'SLIDE_ING') {
        if (this.deltaX < -50) {
          this.next();
        } else if (this.deltaX > 50) {
          this.prev();
        }
      }
      this.judge = 'INITIAL';
    },
    _getTouchXPos: function _getTouchXPos(e) {
      return e.changedTouches[0]['pageX'];
    },
    _getTouchYPos: function _getTouchYPos(e) {
      return e.changedTouches[0]['pageY'];
    }
  }
};

/***/ }),
/* 201 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var UrlParser = __webpack_require__(0);

/**
 * 工具方法库
 * @namespace Utils
 * @example
 *
 */
var Utils = {
  UrlParser: UrlParser,
  isNonEmptyArray: function isNonEmptyArray() {
    var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    return obj && obj.length > 0 && Array.isArray(obj) && typeof obj !== 'undefined';
  },
  appendProtocol: function appendProtocol(url) {
    if (/^\/\//.test(url)) {
      var bundleUrl = weex.config.bundleUrl;

      return 'http' + (/^https:/.test(bundleUrl) ? 's' : '') + ':' + url;
    }
    return url;
  },
  encodeURLParams: function encodeURLParams(url) {
    var parsedUrl = new UrlParser(url, true);
    return parsedUrl.toString();
  },
  goToH5Page: function goToH5Page(jumpUrl) {
    var animated = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    var Navigator = weex.requireModule('navigator');
    var jumpUrlObj = new Utils.UrlParser(jumpUrl, true);
    var url = appendProtocol(jumpUrlObj.toString());
    Navigator.push({
      url: Utils.encodeURLParams(url),
      animated: animated
    }, callback);
  },

  /**
   * 环境判断辅助 API
   * @namespace Utils.env
   * @example
   *
   * const { Utils } = require('@ali/wxv-bridge');
   * const { env } = Utils;
   */
  env: {

    /**
     * 是否是手淘容器
     * @method
     * @memberOf Utils.env
     * @returns {boolean}
     * @example
     *
     * const isTaobao = env.isTaobao();
     */
    isTaobao: function isTaobao() {
      var appName = weex.config.env.appName;

      return (/(tb|taobao|淘宝)/i.test(appName)
      );
    },


    /**
     * 是否是旅客容器
     * @memberOf Utils.env
     * @method
     * @returns {boolean}
     * @example
     *
     * const isTrip = env.isTrip();
     */
    isTrip: function isTrip() {
      var appName = weex.config.env.appName;

      return appName === 'LX';
    },

    /**
     * 是否是 web 环境
     * @memberOf Utils.env
     * @method
     * @returns {boolean}
     * @example
     *
     * const isWeb = env.isWeb();
     */
    isWeb: function isWeb() {
      var platform = weex.config.env.platform;

      return (typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && platform.toLowerCase() === 'web';
    },

    /**
     * 是否是 iOS 系统
     * @memberOf Utils.env
     * @method
     * @returns {boolean}
     * @example
     *
     * const isIOS = env.isIOS();
     */
    isIOS: function isIOS() {
      var platform = weex.config.env.platform;

      return platform.toLowerCase() === 'ios';
    },

    /**
     * 是否是 Android 系统
     * @memberOf Utils.env
     * @method
     * @returns {boolean}
     * @example
     *
     * const isAndroid = env.isAndroid();
     */
    isAndroid: function isAndroid() {
      var platform = weex.config.env.platform;

      return platform.toLowerCase() === 'android';
    },


    /**
     * 是否是支付宝容器
     * @memberOf Utils.env
     * @method
     * @returns {boolean}
     * @example
     *
     * const isAlipay = env.isAlipay();
     */
    isAlipay: function isAlipay() {
      var appName = weex.config.env.appName;

      return appName === 'AP';
    },


    /**
     * 是否是支付宝H5容器(防止以后支付宝接入weex)
     * @memberOf Utils.env
     * @method
     * @returns {boolean}
     * @example
     *
     * const isAlipayWeb = env.isAlipayWeb();
     */
    isAlipayWeb: function isAlipayWeb() {
      return Utils.env.isAlipay() && Utils.env.isWeb();
    },


    /**
     * 判断是否支持expressionBinding
     * 当weex版本大于0.10.1.6，为客户端即可以支持expressionBinding
     * @returns {Boolean}
     */
    supportsEB: function supportsEB() {
      var weexVersion = weex.config.env.weexVersion || '0';
      var isHighWeex = Utils.compareVersion(weexVersion, '0.10.1.4') && (Utils.env.isIOS() || Utils.env.isAndroid());
      var expressionBinding = weex.requireModule('expressionBinding');
      return expressionBinding && expressionBinding.enableBinding && isHighWeex;
    },


    /**
     * 判断Android容器是否支持是否支持expressionBinding(处理方式很不一致)
     * @returns {boolean}
     */
    supportsEBForAndroid: function supportsEBForAndroid() {
      return Utils.env.isAndroid() && Utils.env.supportsEB();
    },


    /**
     * 判断IOS容器是否支持是否支持expressionBinding
     * @returns {boolean}
     */
    supportsEBForIos: function supportsEBForIos() {
      return Utils.env.isIOS() && Utils.env.supportsEB();
    },


    /**
     * 获取weex屏幕真实的设置高度，需要减去导航栏高度
     * @returns {Number}
     */
    getPageHeight: function getPageHeight() {
      var env = weex.config.env;

      var navHeight = Utils.env.isWeb() ? 0 : 130;
      return env.deviceHeight / env.deviceWidth * 750 - navHeight;
    }
  },

  /**
   * 版本号比较
   * @memberOf Utils
   * @param currVer {string}
   * @param promoteVer {string}
   * @returns {boolean}
   * @example
   *
   * const { Utils } = require('@ali/wx-bridge');
   * const { compareVersion } = Utils;
   * console.log(compareVersion('0.1.100', '0.1.11')); // 'true'
   */
  compareVersion: function compareVersion() {
    var currVer = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "0.0.0";
    var promoteVer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "0.0.0";

    if (currVer === promoteVer) return true;
    var currVerArr = currVer.split(".");
    var promoteVerArr = promoteVer.split(".");
    var len = Math.max(currVerArr.length, promoteVerArr.length);
    for (var i = 0; i < len; i++) {
      var proVal = ~~promoteVerArr[i];
      var curVal = ~~currVerArr[i];
      if (proVal < curVal) {
        return true;
      } else if (proVal > curVal) {
        return false;
      }
    }
    return false;
  }
};

module.exports = Utils;

/***/ }),
/* 202 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: ["wxc-tab-page"],
    style: {
      height: (_vm.tabPageHeight) + 'px'
    }
  }, [_c('scroller', {
    ref: "tab-title-list",
    staticClass: ["tab-title-list"],
    style: {
      backgroundColor: _vm.tabStyles.bgColor,
      height: (_vm.tabStyles.height) + 'px'
    },
    attrs: {
      "showScrollbar": false,
      "scrollDirection": "horizontal",
      "dataSpm": _vm.spmC
    }
  }, _vm._l((_vm.tabTitles), function(v, index) {
    return _c('div', {
      key: index,
      ref: 'wxc-tab-title-' + index,
      refInFor: true,
      staticClass: ["title-item"],
      style: {
        width: _vm.tabStyles.width + 'px',
        height: _vm.tabStyles.height + 'px',
        backgroundColor: _vm.currentPage == index ? _vm.tabStyles.activeBgColor : _vm.tabStyles.bgColor
      },
      attrs: {
        "dataSpmClick": ("gostr=/tbtrip;locaid=d" + (v.dataSpm!==undefined ? v.dataSpm : '996' + index))
      },
      on: {
        "click": function($event) {
          _vm.setPage(index, v.url)
        }
      }
    }, [(_vm.titleType == 'icon') ? _c('image', {
      style: {
        width: _vm.tabStyles.iconWidth + 'px',
        height: _vm.tabStyles.iconHeight + 'px'
      },
      attrs: {
        "src": _vm.currentPage == index ? v.activeIcon : v.icon
      }
    }) : _vm._e(), _c('text', {
      staticClass: ["tab-text"],
      style: {
        fontSize: _vm.tabStyles.fontSize + 'px',
        fontWeight: (_vm.currentPage == index && _vm.tabStyles.isActiveTitleBold) ? 'bold' : 'normal',
        color: _vm.currentPage == index ? _vm.tabStyles.activeTitleColor : _vm.tabStyles.titleColor,
        paddingLeft: _vm.tabStyles.textPaddingLeft + 'px',
        paddingRight: _vm.tabStyles.textPaddingRight + 'px'
      }
    }, [_vm._v(_vm._s(v.title))]), (_vm.tabStyles.hasActiveBottom) ? _c('div', {
      staticClass: ["border-bottom"],
      style: {
        width: _vm.tabStyles.activeBottomWidth + 'px',
        left: (_vm.tabStyles.width - _vm.tabStyles.activeBottomWidth) / 2 + 'px',
        height: _vm.tabStyles.activeBottomHeight + 'px',
        backgroundColor: _vm.currentPage == index ? _vm.tabStyles.activeBottomColor : 'transparent'
      }
    }) : _vm._e()])
  })), _c('div', {
    ref: "tab-page-wrap",
    staticClass: ["tab-page-wrap"],
    style: {
      height: (_vm.tabPageHeight - _vm.tabStyles.height) + 'px'
    },
    attrs: {
      "preventMoveEvent": true
    },
    on: {
      "panstart": _vm._onTouchStart,
      "panmove": _vm._onTouchMove,
      "panend": _vm._onTouchEnd,
      "horizontalpan": _vm.startHandler
    }
  }, [_c('div', {
    ref: "tab-container",
    staticClass: ["tab-container"]
  }, [_vm._t("default")], 2)])])
},staticRenderFns: []}
module.exports.render._withStripped = true

/***/ }),
/* 203 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = __webpack_require__(204);

Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_index).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 204 */
/***/ (function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = []

/* styles */
__vue_styles__.push(__webpack_require__(205)
)

/* script */
__vue_exports__ = __webpack_require__(206)

/* template */
var __vue_template__ = __webpack_require__(207)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.__file = "/Users/Tw93/www/github/weex-ui/packages/wxc-tag/index.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-5a408959"
__vue_options__.style = __vue_options__.style || {}
__vue_styles__.forEach(function (module) {
  for (var name in module) {
    __vue_options__.style[name] = module[name]
  }
})
if (typeof __register_static_styles__ === "function") {
  __register_static_styles__(__vue_options__._scopeId, __vue_styles__)
}

module.exports = __vue_exports__


/***/ }),
/* 205 */
/***/ (function(module, exports) {

module.exports = {
  "wxc-tag": {
    "alignItems": "flex-start"
  },
  "tag-item": {
    "height": 24,
    "justifyContent": "center",
    "alignItems": "center",
    "overflow": "hidden",
    "paddingBottom": 2
  },
  "tag-border": {
    "borderBottomLeftRadius": 4,
    "borderBottomRightRadius": 4,
    "borderTopLeftRadius": 4,
    "borderTopRightRadius": 4
  },
  "tag-hollow": {
    "borderWidth": 1
  },
  "tag-image": {
    "height": 24
  },
  "tag-special": {
    "borderWidth": 1,
    "flexDirection": "row"
  },
  "left-image": {
    "width": 20,
    "height": 20
  },
  "tag-left": {
    "width": 24,
    "height": 24,
    "alignItems": "center",
    "justifyContent": "center"
  },
  "tag-text": {
    "fontSize": 20,
    "height": 22,
    "lineHeight": 22,
    "paddingLeft": 6,
    "paddingRight": 6
  }
}

/***/ }),
/* 206 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

exports.default = {
  props: {
    type: {
      type: String,
      default: 'solid'
    },
    value: {
      type: [String, Number],
      default: '测试测试'
    },
    tagColor: {
      type: String,
      default: '#ff5000'
    },
    fontColor: {
      type: String,
      default: '#333'
    },
    specialIcon: {
      type: String,
      default: ''
    },
    img: {
      type: String,
      default: ''
    }
  },
  computed: {
    showSolid: function showSolid() {
      var type = this.type,
          value = this.value;

      return type === 'solid' && value !== '';
    },
    showHollow: function showHollow() {
      var type = this.type,
          value = this.value;

      return type === 'hollow' && value !== '';
    },
    showSpecial: function showSpecial() {
      var type = this.type,
          value = this.value,
          specialIcon = this.specialIcon;

      return type === 'special' && value !== '' && specialIcon !== '';
    },
    showImage: function showImage() {
      var type = this.type,
          img = this.img;

      return type === 'image' && img !== '';
    },
    tagTextStyle: function tagTextStyle() {
      var tagColor = this.tagColor,
          showSolid = this.showSolid;

      return showSolid ? { backgroundColor: tagColor } : { borderColor: tagColor };
    }
  },
  data: function data() {
    return {
      imgWidth: 90
    };
  },
  methods: {
    onLoad: function onLoad(e) {
      if (e.success && e.size && e.size.naturalWidth > 0) {
        var width = e.size.naturalWidth;
        var height = e.size.naturalHeight;
        this.imgWidth = width * (24 / height);
      }
    }
  }
};

/***/ }),
/* 207 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: ["wxc-tag"]
  }, [(_vm.showSolid || _vm.showHollow) ? _c('div', {
    class: ['tag-item', 'tag-border', _vm.showHollow && 'tag-hollow'],
    style: _vm.tagTextStyle
  }, [_c('text', {
    staticClass: ["tag-text"],
    style: {
      color: _vm.fontColor
    }
  }, [_vm._v(_vm._s(_vm.value))])]) : _vm._e(), (_vm.showImage) ? _c('image', {
    staticClass: ["tag-image"],
    style: {
      width: _vm.imgWidth
    },
    attrs: {
      "src": _vm.img
    },
    on: {
      "load": _vm.onLoad
    }
  }) : _vm._e(), (_vm.showSpecial) ? _c('div', {
    staticClass: ["tag-special", "tag-border"],
    style: {
      borderColor: _vm.tagColor
    }
  }, [_c('div', {
    staticClass: ["tag-left"],
    style: {
      backgroundColor: _vm.tagColor
    }
  }, [_c('image', {
    staticClass: ["left-image"],
    attrs: {
      "src": _vm.specialIcon
    }
  })]), _c('text', {
    staticClass: ["tag-text"],
    style: {
      color: _vm.fontColor
    }
  }, [_vm._v(_vm._s(_vm.value))])]) : _vm._e()])
},staticRenderFns: []}
module.exports.render._withStripped = true

/***/ })
/******/ ]);
});
//# sourceMappingURL=index.native.js.map