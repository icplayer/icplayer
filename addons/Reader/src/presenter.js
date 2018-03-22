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
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 10);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */,
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

var _validation = __webpack_require__(11);

var _manager = __webpack_require__(12);

function AddonReader_create() {
    var presenter = function presenter() {};

    /**
     * @type {{imagesList: Array[string]}}
     */
    var configuration = {
        imagesList: []
    };

    var state = {
        manager: null,
        imageWrapper: null
    };

    presenter.run = function (view, model) {
        presenter.initialize(view, model);
    };

    presenter.createPreview = function (view, model) {};

    presenter.initialize = function (view, model) {
        configuration = (0, _validation.validateModel)(model);

        state.manager = new _manager.ShowingManager(configuration.imagesList);
        state.imageWrapper = $(view).find(".reader-wrapper")[0];
        presenter.actualizeElement();
    };

    presenter.actualizeElement = function () {
        state.imageWrapper.innerHTML = '';
        state.imageWrapper.appendChild(state.manager.getActualElement());
    };

    presenter.setShowErrorsMode = function () {};

    presenter.setWorkMode = function () {};

    presenter.reset = function () {};

    presenter.getErrorCount = function () {};

    presenter.getMaxScore = function () {};

    presenter.getScore = function () {};

    presenter.getState = function () {};

    presenter.setState = function (state) {};

    presenter.next = function () {
        state.manager.next();
        presenter.actualizeElement();
    };

    presenter.previous = function () {
        state.manager.previous();
        presenter.actualizeElement();
    };

    return presenter;
}

window.AddonReader_create = AddonReader_create;

/***/ }),
/* 11 */
/***/ (function(module, exports) {

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.validateModel = validateModel;
/**
 *
 * @param {string} imagesText
 */
function validateImagesList(imagesText) {
    var arrayOfLines = imagesText.match(/[^\r\n]+/g);

    return {
        isValid: true,
        lines: arrayOfLines || []
    };
}

/**
 *
 * @param model {{imagesList: string}}
 * @returns {{imagesList: string[] | Array | *, isValid: boolean}}
 */
function validateModel(model) {
    return {
        imagesList: validateImagesList(model['imagesList']).lines,
        isValid: true
    };
}

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ShowingManager = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _loaderQueue = __webpack_require__(13);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ShowingManager = exports.ShowingManager = function () {

    /**
     * @param {string[]} imagesList
     */
    function ShowingManager(imagesList) {
        _classCallCheck(this, ShowingManager);

        this.ELEMENTS_ON_LEFT = 10;
        this.ELEMENTS_ON_RIGHT = 10;
        this.imagesList = [];
        this.loaderQueue = new _loaderQueue.LoaderQueue();
        this.actualElement = 0;

        this.__buildImagesList(imagesList);
        this.__update_queue();
    }

    /**
     * Get actual visible element
     * @returns {*}
     */

    /**
     * Container for images
     * @type {{id: Number, url: string}[]}
     */


    _createClass(ShowingManager, [{
        key: 'getActualElement',
        value: function getActualElement() {
            return this.loaderQueue.getElement(this.actualElement);
        }
    }, {
        key: 'next',
        value: function next() {
            if (this.actualElement + 1 < this.imagesList.length) {
                this.actualElement++;
                this.__update_queue();
            }
        }
    }, {
        key: 'previous',
        value: function previous() {
            if (this.actualElement > 0) {
                this.actualElement--;
                this.__update_queue();
            }
        }
    }, {
        key: '__update_queue',
        value: function __update_queue() {
            this.loaderQueue.clearQueue();
            this.loaderQueue.appendToQueue(this.imagesList[this.actualElement]);
            for (var i = 1; i < Math.max(this.ELEMENTS_ON_LEFT, this.ELEMENTS_ON_RIGHT); i++) {
                if (i < this.ELEMENTS_ON_RIGHT && this.actualElement + i < this.imagesList.length) {
                    this.loaderQueue.appendToQueue(this.imagesList[this.actualElement + i]);
                }

                if (i < this.ELEMENTS_ON_LEFT && this.actualElement - i > 0) {
                    this.loaderQueue.appendToQueue(this.imagesList[this.actualElement - i]);
                }
            }
        }

        /**
         * @param {string[]} imagesList
         */

    }, {
        key: '__buildImagesList',
        value: function __buildImagesList(imagesList) {
            var list = [];
            imagesList.forEach(function (el, index) {
                list.push({
                    id: index,
                    url: el
                });
            });

            this.imagesList = list;
        }
    }]);

    return ShowingManager;
}();

/***/ }),
/* 13 */
/***/ (function(module, exports) {

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LoaderQueue = exports.LoaderQueue = function () {
    function LoaderQueue() {
        _classCallCheck(this, LoaderQueue);

        this.elements = {};
        this.isLoadedOrLoadingElements = {};
        this.toLoadQueue = [];
        this.MAX_ELEMENTS_TO_LOAD = 2;
        this.whileLoadingElements = 0;
    }
    /**
     * @type {{id: Number, url: string}[]} toLoadQueue
     */


    _createClass(LoaderQueue, [{
        key: "appendToQueue",


        /**
         * Add as last element to queue image
         * @param {{id: Number, url: string}}image
         */
        value: function appendToQueue(image) {
            if (!this.elements[image.id]) {
                var imageWrapper = document.createElement("div");
                imageWrapper.classList.add('image-wrapper');
                this.elements[image.id] = imageWrapper;
            }

            if (!this.isLoadedOrLoadingElements[image.id]) {
                this.toLoadQueue.push(image);
                this.__check_should_load(true);
            }
        }

        /**
         * Remove everything from queue
         */

    }, {
        key: "clearQueue",
        value: function clearQueue() {
            this.toLoadQueue = [];
        }
    }, {
        key: "getElement",
        value: function getElement(id) {
            return this.elements[id];
        }
    }, {
        key: "__check_should_load",
        value: function __check_should_load() {
            if (this.whileLoadingElements > this.MAX_ELEMENTS_TO_LOAD) {
                return;
            }

            if (this.toLoadQueue.length === 0) {
                return;
            }

            var elementToLoad = this.toLoadQueue.shift();
            this.elements[elementToLoad.id].appendChild(this.__create_element(elementToLoad));
            this.whileLoadingElements++;
        }
    }, {
        key: "__on_load",
        value: function __on_load(id) {
            if (this.whileLoadingElements > 0) {
                this.whileLoadingElements--;
            }

            this.__check_should_load();
        }

        /**
         * @param {{id: Number, url: string}}image
         */

    }, {
        key: "__create_element",
        value: function __create_element(image) {
            var imageElement = new Image();
            var self = this;

            this.isLoadedOrLoadingElements[image.id] = true;

            imageElement.onload = function (ev) {
                imageElement.onload = null;
                self.__on_load(image.id);
            };

            imageElement.onerror = function (ev) {
                imageElement.onerror = null;
                imageElement.onload = null;
                self.__on_load(image.id);
            };

            imageElement.src = image.url;
            imageElement.classList.add("image-element");

            return imageElement;
        }
    }]);

    return LoaderQueue;
}();

/***/ })
/******/ ]);