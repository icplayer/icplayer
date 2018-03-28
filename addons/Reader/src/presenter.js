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
/******/ 	return __webpack_require__(__webpack_require__.s = 11);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */,
/* 1 */,
/* 2 */
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
     * @param {{imageElement: string}[]} imagesList
     * @param {{HTMLDIVElement}[]} imagesWrappers
     */
    function ShowingManager(imagesList, imagesWrappers) {
        _classCallCheck(this, ShowingManager);

        this.ELEMENTS_ON_LEFT = 5;
        this.ELEMENTS_ON_RIGHT = 5;
        this.imagesList = [];
        this.loaderQueue = null;
        this.actualElement = 0;

        this.loaderQueue = new _loaderQueue.LoaderQueue(imagesWrappers);
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

            this.__garbage();
        }
    }, {
        key: 'previous',
        value: function previous() {
            if (this.actualElement > 0) {
                this.actualElement--;
                this.__update_queue();
            }

            this.__garbage();
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
         * @param {{imageElement: string}[]} imagesList
         */

    }, {
        key: '__buildImagesList',
        value: function __buildImagesList(imagesList) {
            var list = [];
            imagesList.forEach(function (el, index) {
                list.push({
                    id: index,
                    url: el.imageElement
                });
            });

            this.imagesList = list;
        }
    }, {
        key: '__garbage',
        value: function __garbage() {
            var loadedElements = this.loaderQueue.getLoadedElements();

            if (loadedElements > 15) {
                for (var i = 0; i < this.imagesList.length; i++) {
                    if (i > this.actualElement - this.ELEMENTS_ON_LEFT && i < this.actualElement + this.ELEMENTS_ON_RIGHT) {
                        continue;
                    }

                    this.loaderQueue.remove(i);
                }
            }
        }
    }]);

    return ShowingManager;
}();

/***/ }),
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

var _validation = __webpack_require__(12);

var _manager = __webpack_require__(2);

var _viewer = __webpack_require__(14);

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
        presenter.connectHandlers();
    };

    presenter.createPreview = function (view, model) {};

    presenter.initialize = function (view, model) {
        configuration = (0, _validation.validateModel)(model).value;

        state.imageWrapper = $(view).find(".reader-wrapper")[0];
        state.leftArea = $(view).find(".left.area")[0];
        state.rightArea = $(view).find(".right.area")[0];

        var viewerConfig = {
            width: configuration.Width,
            height: configuration.Height
        };

        state.viewer = new _viewer.Viewer(state.imageWrapper, configuration.list, viewerConfig);
    };

    presenter.connectHandlers = function () {
        if (MobileUtils.isEventSupported('touchstart')) {
            state.leftArea.addEventListener('touchstart', presenter.onLeftClick);
            state.rightArea.addEventListener('touchstart', presenter.onRightClick);
        } else {
            state.leftArea.addEventListener('click', presenter.onLeftClick);
            state.rightArea.addEventListener('click', presenter.onRightClick);
        }
    };

    presenter.setShowErrorsMode = function () {};

    presenter.setWorkMode = function () {};

    presenter.reset = function () {};

    presenter.getErrorCount = function () {};

    presenter.getMaxScore = function () {};

    presenter.getScore = function () {};

    presenter.getState = function () {};

    presenter.setState = function (state) {};

    presenter.onRightClick = function (event) {
        presenter.next();
        event.stopPropagation();
        event.preventDefault();
    };

    presenter.onLeftClick = function (event) {
        presenter.previous();
        event.stopPropagation();
        event.preventDefault();
    };

    presenter.next = function () {
        state.viewer.next();
    };

    presenter.previous = function () {
        state.viewer.previous();
    };

    return presenter;
}

window.AddonReader_create = AddonReader_create;

/***/ }),
/* 12 */
/***/ (function(module, exports) {

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.validateModel = validateModel;
/**
 *
 * @param model {{imagesList: string}}
 * @returns {{imagesList: string[] | Array | *, isValid: boolean}}
 */
function validateModel(model) {
    var modelValidator = new ModelValidator();
    var validatedModel = modelValidator.validate(model, [ModelValidators.List("list", [ModelValidators.String("imageElement")]), ModelValidators.Integer("Width"), ModelValidators.Integer("Height")]);

    return validatedModel;
}

/***/ }),
/* 13 */
/***/ (function(module, exports) {

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LoaderQueue = exports.LoaderQueue = function () {
    /**
     * @type {HTMLDivElement[]}
     */
    function LoaderQueue(imagesWrappers) {
        _classCallCheck(this, LoaderQueue);

        this.elements = {};
        this.isLoadedOrLoadingElements = {};
        this.toLoadQueue = [];
        this.MAX_ELEMENTS_TO_LOAD = 2;
        this.whileLoadingElements = 0;
        this.imagesWrappers = [];
        this.loadedElements = 0;

        this.imagesWrappers = imagesWrappers;
    }

    /**
     * Add as last element to queue image
     * @param {{id: Number, url: string}}image
     */

    /**
     * @type {{id: Number, url: string}[]} toLoadQueue
     */


    _createClass(LoaderQueue, [{
        key: "appendToQueue",
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
            this.imagesWrappers[elementToLoad.id].appendChild(this.elements[elementToLoad.id]);

            this.whileLoadingElements++;
        }
    }, {
        key: "__on_load",
        value: function __on_load(id) {
            if (this.whileLoadingElements > 0) {
                this.whileLoadingElements--;
            }
            this.loadedElements++;

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
    }, {
        key: "getLoadedElements",
        value: function getLoadedElements() {
            return this.loadedElements;
        }
    }, {
        key: "remove",
        value: function remove(id) {
            if (!this.elements[id]) {
                return;
            }

            this.loadedElements--;
            this.elements[id].parentNode.removeChild(this.elements[id]);
            delete this.elements[id];
            this.isLoadedOrLoadingElements[id] = false;
        }
    }]);

    return LoaderQueue;
}();

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Viewer = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _manager = __webpack_require__(2);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @typedef {{width: Number, height: Number}|{}} ViewerConfig
 */

var Viewer = exports.Viewer = function () {

    /**
     * @param {HTMLDivElement} container
     * @param  {{imageElement: string}[]} imagesList
     * @param {ViewerConfig} config
     */

    /**
     * @type {ViewerConfig}
     */
    function Viewer(container, imagesList, config) {
        _classCallCheck(this, Viewer);

        this.manager = null;
        this.elementsCount = 0;
        this.container = null;
        this.config = {};
        this.imagesWrapper = document.createElement("div");
        this.images = [];
        this.timeoutID = null;
        this.actualPosition = 0;
        this.nextPosition = 0;

        this.elementsCount = imagesList.length;
        this.container = container;
        this.config = config;
        this.__build_view();

        this.manager = new _manager.ShowingManager(imagesList, this.images);
        this.__actualize_view();
    }

    //Animator

    /**
     * @type {HTMLDivElement}
     */


    _createClass(Viewer, [{
        key: "next",
        value: function next() {
            this.manager.next();
            this.nextPosition -= this.config.width;
            this.nextPosition = Math.max(this.nextPosition, this.elementsCount * this.config.width * -1);
        }
    }, {
        key: "previous",
        value: function previous() {
            this.manager.previous();
            this.nextPosition += this.config.width;
            this.nextPosition = Math.min(this.nextPosition, 0);
        }
    }, {
        key: "__build_view",
        value: function __build_view() {
            for (var i = 0; i < this.elementsCount; i++) {
                var element = document.createElement("div");
                element.classList.add("imageElement");
                element.style.width = this.config.width + "px";
                element.style.height = this.config.height + "px";

                this.imagesWrapper.appendChild(element);
                this.images.push(element);
            }

            this.imagesWrapper.classList.add("imagesWrapper");
            this.imagesWrapper.style.width = this.elementsCount * this.config.width + "px";
            this.imagesWrapper.style.height = this.config.height + "px";
            this.container.appendChild(this.imagesWrapper);
        }
    }, {
        key: "__actualize_view",
        value: function __actualize_view() {
            if (this.actualPosition === this.nextPosition) {
                this.timeoutID = setTimeout(this.__actualize_view.bind(this), 100);
                return;
            }

            this.actualPosition = this.nextPosition;
            this.imagesWrapper.style.left = this.actualPosition + "px";

            this.timeoutID = setTimeout(this.__actualize_view.bind(this), 17);
        }
    }]);

    return Viewer;
}();

/***/ })
/******/ ]);