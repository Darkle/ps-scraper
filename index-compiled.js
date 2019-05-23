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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _path = __webpack_require__(1);

var _path2 = _interopRequireDefault(_path);

var _os = __webpack_require__(2);

var _os2 = _interopRequireDefault(_os);

var _nightmare = __webpack_require__(3);

var _nightmare2 = _interopRequireDefault(_nightmare);

var _pMap = __webpack_require__(4);

var _pMap2 = _interopRequireDefault(_pMap);

var _download = __webpack_require__(5);

var _download2 = _interopRequireDefault(_download);

var _ora = __webpack_require__(6);

var _ora2 = _interopRequireDefault(_ora);

var _delay = __webpack_require__(7);

var _delay2 = _interopRequireDefault(_delay);

var _spawnPromise = __webpack_require__(8);

var _spawnPromise2 = _interopRequireDefault(_spawnPromise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

__webpack_require__(9).config();

const nightmare = (0, _nightmare2.default)({ show: false });
const numDownloadsAtATime = Number(process.env.NUM_DOWNLOADS_AT_A_TIME) || 1;
const useragent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36';

let numberOfVideos = 0;

const spinner = (0, _ora2.default)('Logging in').start();

nightmare.goto('https://app.pluralsight.com/id/').insert('#Username', process.env.EMAIL).insert('#Password', process.env.PASSWORD).click('#login').wait(1000).goto(process.env.COURSE_TO_SCRAPE).wait(3000).evaluate(function () {
  var _ref;

  const courseTitle = document.title.replace(" | Pluralsight", "").replace(/[^a-z ]/ig, ""); // so safe foldername
  return [...(_ref = document.querySelectorAll('a[class^="clipListTitle"'), _ref === void 0 ? [] : _ref)].map(function (videoLink) {
    return {
      videoName: videoLink.textContent.replace(/[^a-z ]/ig, ""), // so safe filename
      videoPageUrl: videoLink.href,
      courseTitle
    };
  }).filter(function (video) {
    return video.videoPageUrl.length > 0;
  });
}).then(function (videos) {
  numberOfVideos = videos.length;
  spinner.text = 'Scraping video links';
  return (0, _pMap2.default)(videos, getVideoSrcUrls, { concurrency: 1 });
}).then(function (videos) {
  return (0, _pMap2.default)(videos, downloadVideo, { concurrency: numDownloadsAtATime });
}).then(function () {
  return nightmare.end();
}).then(notifyFinishedOnWindows).then(function () {
  return process.exit(0);
}).catch(e => {
  console.error(e);
  return notifyFinishedOnWindows().then(() => process.exit(1));
});

function getVideoSrcUrls(video, index) {
  return randomDelay().then(function () {
    spinner.text = `Scraping [${index + 1}/${numberOfVideos}]: ${video.videoName}`;
    return nightmare.useragent(useragent).goto(video.videoPageUrl).wait("video").wait(1500).evaluate(function () {
      return document.querySelector("video").src;
    }).then(function (videoSrcUrl) {
      return _extends({}, video, { videoSrcUrl });
    });
  });
}function downloadVideo({ videoSrcUrl, courseTitle, videoName }, index) {
  return randomDelay().then(function () {
    spinner.text = `Downloading [${index + 1}/${numberOfVideos}]: ${videoName}`;
    return (0, _download2.default)(videoSrcUrl, _path2.default.join('videos', courseTitle), { filename: `${index + 1}. ${videoName}.webm` }).then(function () {
      return spinner.text = `Download [${index + 1}/${numberOfVideos}]: ${videoName} completed`;
    });
  });
}function randomDelay() {
  return (0, _delay2.default)(getRandomInt(1, 15) * 1000);
}function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}function notifyFinishedOnWindows() {
  if (_os2.default.platform() === 'win32') {
    const psfile = _path2.default.join(__dirname, 'win-tts-notify.ps1');
    return (0, _spawnPromise2.default)('powershell.exe', [psfile]);
  }return Promise.resolve();
}

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("os");

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("nightmare");

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("p-map");

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("download");

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("ora");

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("delay");

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = require("@ahmadnassri/spawn-promise");

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("dotenv");

/***/ })
/******/ ]);