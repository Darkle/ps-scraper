/******/ (function(modules) { // webpackBootstrap
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
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./index.lsc");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./index.lsc":
/*!*******************!*\
  !*** ./index.lsc ***!
  \*******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _path = __webpack_require__(/*! path */ "path");

var _path2 = _interopRequireDefault(_path);

var _nightmare = __webpack_require__(/*! nightmare */ "nightmare");

var _nightmare2 = _interopRequireDefault(_nightmare);

var _pMapSeries = __webpack_require__(/*! p-map-series */ "p-map-series");

var _pMapSeries2 = _interopRequireDefault(_pMapSeries);

var _download = __webpack_require__(/*! download */ "download");

var _download2 = _interopRequireDefault(_download);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

__webpack_require__(/*! dotenv */ "dotenv").config();

const nightmare = (0, _nightmare2.default)({ show: true });
const videoLinkSelector = '.table-of-contents__clip-list-item a';

nightmare.goto('https://app.pluralsight.com/id/').insert('#Username', process.env.EMAIL).insert('#Password', process.env.PASSWORD).click('#login').wait(1000).goto(process.env.COURSE_TO_SCRAPE).wait(3000).evaluate(function () {
  return getVideoPageDetails(document);
}, getVideoPageDetails).then(function (videos) {
  return (0, _pMapSeries2.default)(videos, getVideoSrcUrls);
}).then(function (videos) {
  return (0, _pMapSeries2.default)(videos, downloadVideo);
}).catch(function (e) {
  return console.log(e);
});

function getVideoPageDetails(document) {
  var _ref;

  const courseTitle = document.title.replace(" | Pluralsight", "");
  return [...(_ref = document.querySelectorAll(videoLinkSelector), _ref === void 0 ? [] : _ref)].map(function (videoLink) {
    return {
      videoName: videoLink.textContent.replace(/[^a-z]/ig, ""), // so safe filename
      videoPageUrl: videoLink.href,
      courseTitle
    };
  }).filter(function (video) {
    return video.videoPageUrl;
  });
}function getVideoSrcUrls(video) {
  return nightmare.goto(video.videoPageUrl).wait("video").wait(1500).evaluate(function () {
    return document.querySelector("video").src;
  }).then(function (videoSrcUrl) {
    return _extends({}, video, { videoSrcUrl });
  });
}function downloadVideo({ videoSrcUrl, courseTitle, videoName }) {
  return (0, _download2.default)(videoSrcUrl, _path2.default.join('videos', courseTitle), { filename: videoName });
}

/***/ }),

/***/ "dotenv":
/*!*************************!*\
  !*** external "dotenv" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("dotenv");

/***/ }),

/***/ "download":
/*!***************************!*\
  !*** external "download" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("download");

/***/ }),

/***/ "nightmare":
/*!****************************!*\
  !*** external "nightmare" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("nightmare");

/***/ }),

/***/ "p-map-series":
/*!*******************************!*\
  !*** external "p-map-series" ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("p-map-series");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ })

/******/ });
//# sourceMappingURL=index-compiled.js.map