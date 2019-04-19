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
/******/ 	return __webpack_require__(__webpack_require__.s = 12);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Button = exports.Button = function () {
    function Button($view) {
        _classCallCheck(this, Button);

        if (this.constructor === Button) throw new Error("Cannot create an instance of BasePlayer abstract class");

        this.$view = $view;
        this.$view.css("z-index", "100");
    }

    _createClass(Button, [{
        key: "activate",
        value: function activate() {
            var _this = this;

            this.$view.click(function () {
                return _this._eventHandler();
            });
        }
    }, {
        key: "deactivate",
        value: function deactivate() {
            this.$view.unbind();
        }
    }, {
        key: "forceClick",
        value: function forceClick() {
            this.$view.click();
        }
    }, {
        key: "destroy",
        value: function destroy() {
            this.deactivate();
            this.$view.remove();
            this.$view = null;
        }
    }, {
        key: "_eventHandler",
        value: function _eventHandler() {
            throw new Error("EventHandler accessor is not implemented");
        }
    }]);

    return Button;
}();

/***/ }),
/* 1 */,
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.RecordButton = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _Button2 = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RecordButton = exports.RecordButton = function (_Button) {
    _inherits(RecordButton, _Button);

    function RecordButton(_ref) {
        var $view = _ref.$view,
            state = _ref.state;

        _classCallCheck(this, RecordButton);

        var _this = _possibleConstructorReturn(this, (RecordButton.__proto__ || Object.getPrototypeOf(RecordButton)).call(this, $view));

        _this.state = state;
        return _this;
    }

    _createClass(RecordButton, [{
        key: "destroy",
        value: function destroy() {
            _get(RecordButton.prototype.__proto__ || Object.getPrototypeOf(RecordButton.prototype), "destroy", this).call(this);
            this.state = null;
        }
    }, {
        key: "reset",
        value: function reset() {
            this.$view.removeClass("selected");
            this.onResetCallback();
        }
    }, {
        key: "setUnclickView",
        value: function setUnclickView() {
            this.$view.removeClass("selected");
        }
    }, {
        key: "_eventHandler",
        value: function _eventHandler() {
            if (this.state.isNew() || this.state.isLoaded() || this.state.isLoadedDefaultRecording() || this.state.isBlockedSafari()) this._startRecording();else if (this.state.isRecording()) this._stopRecording();
        }
    }, {
        key: "_startRecording",
        value: function _startRecording() {
            this.$view.addClass("selected");
            this.onStartRecordingCallback();
        }
    }, {
        key: "_stopRecording",
        value: function _stopRecording() {
            this.$view.removeClass("selected");
            this.onStopRecordingCallback();
        }
    }, {
        key: "onStartRecording",
        set: function set(callback) {
            this.onStartRecordingCallback = callback;
        }
    }, {
        key: "onStopRecording",
        set: function set(callback) {
            this.onStopRecordingCallback = callback;
        }
    }, {
        key: "onReset",
        set: function set(callback) {
            this.onResetCallback = callback;
        }
    }]);

    return RecordButton;
}(_Button2.Button);

/***/ }),
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

var _MediaRecorder = __webpack_require__(13);

function AddonMedia_Recorder_create() {

    var presenter = function presenter() {};

    presenter.mediaRecorder = new _MediaRecorder.MediaRecorder();

    presenter.setPlayerController = function (controller) {
        presenter.mediaRecorder.setPlayerController(controller);
    };

    presenter.run = function run(view, model) {
        presenter.view = view;
        presenter.mediaRecorder.run(view, model);
        handleDestroyEvent(view);
    };

    presenter.createPreview = function createPreview(view, model) {
        presenter.view = view;
        presenter.mediaRecorder.createPreview(view, model);
        handleDestroyEvent(view);
    };

    presenter.getState = function getState() {
        return presenter.mediaRecorder.getState();
    };

    presenter.setState = function setState(state) {
        presenter.mediaRecorder.setState(state);
    };

    presenter.startRecording = function startRecording() {
        presenter.mediaRecorder.startRecording();
    };

    presenter.stopRecording = function stopRecording() {
        presenter.mediaRecorder.stopRecording();
    };

    presenter.startPlaying = function startPlaying() {
        presenter.mediaRecorder.startPlaying();
    };

    presenter.stopPlaying = function stopPlaying() {
        presenter.mediaRecorder.stopPlaying;
    };

    presenter.getErrorCount = function getErrorCount() {
        return 0;
    };

    presenter.getMaxScore = function getMaxScore() {
        return 0;
    };

    presenter.getScore = function getScore() {
        return 0;
    };

    presenter.show = function () {
        presenter.mediaRecorder.show();
    };

    presenter.hide = function () {
        presenter.mediaRecorder.hide();
    };

    presenter.setShowErrorsMode = function setShowErrorsMode() {
        presenter.mediaRecorder.deactivate();
    };

    presenter.setWorkMode = function setWorkMode() {
        presenter.mediaRecorder.activate();
    };

    presenter.reset = function reset() {
        presenter.mediaRecorder.reset();
    };

    presenter.enable = function enable() {
        presenter.mediaRecorder.enable();
    };

    presenter.disable = function disable() {
        presenter.mediaRecorder.disable();
    };

    presenter.executeCommand = function executeCommand(name, params) {
        var commands = {
            'startRecording': presenter.startRecording,
            'stopRecording': presenter.stopRecording,
            'startPlaying': presenter.startPlaying,
            'stopPlaying': presenter.stopPlaying,
            'setShowErrorsMode': presenter.setShowErrorsMode,
            'setWorkMode': presenter.setWorkMode,
            'reset': presenter.reset,
            'show': presenter.show,
            'hide': presenter.hide,
            'enable': presenter.enable,
            'disable': presenter.disable
        };

        return Commands.dispatch(commands, name, params, presenter);
    };

    presenter.destroy = function destroy(event) {
        if (event.target == presenter.view) {
            event.target.removeEventListener('DOMNodeRemoved', presenter.destroy);
            presenter.mediaRecorder.destroy();
            event.target = null;
            presenter.mediaRecorder = null;
            presenter.validateModel = null;
        }
    };

    presenter._internalElements = function () {
        return this.mediaRecorder._internalElements();
    };

    function handleDestroyEvent(view) {
        view.addEventListener('DOMNodeRemoved', presenter.destroy);
    }

    return presenter;
}

window.AddonMedia_Recorder_create = AddonMedia_Recorder_create;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MediaRecorder = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _validateModel = __webpack_require__(14);

var _ActivationState = __webpack_require__(16);

var _MediaState = __webpack_require__(17);

var _Errors = __webpack_require__(18);

var _PlayButton = __webpack_require__(19);

var _RecordButton = __webpack_require__(2);

var _Timer = __webpack_require__(20);

var _AddonState = __webpack_require__(21);

var _RecordingTimeLimiter = __webpack_require__(23);

var _SoundIntensity = __webpack_require__(24);

var _MediaAnalyserService = __webpack_require__(25);

var _AudioLoader = __webpack_require__(27);

var _SoundEffect = __webpack_require__(29);

var _RecordButtonSoundEffect = __webpack_require__(30);

var _AddonViewService = __webpack_require__(31);

var _AudioResourcesProvider = __webpack_require__(32);

var _AudioRecorder = __webpack_require__(34);

var _AudioPlayer = __webpack_require__(37);

var _DefaultRecordingPlayButton = __webpack_require__(40);

var _SafariRecorderState = __webpack_require__(41);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MediaRecorder = exports.MediaRecorder = function () {
    function MediaRecorder() {
        _classCallCheck(this, MediaRecorder);
    }

    _createClass(MediaRecorder, [{
        key: "run",
        value: function run(view, model) {
            var upgradedModel = this._upgradeModel(model);
            var validatedModel = (0, _validateModel.validateModel)(upgradedModel);

            if (this._isBrowserNotSupported()) {
                this._showBrowserError(view);
            } else if (validatedModel.isValid) this._runAddon(view, validatedModel.value);else this._showError(view, validatedModel);

            this._notifyWebView();
        }
    }, {
        key: "createPreview",
        value: function createPreview(view, model) {
            var upgradedModel = this._upgradeModel(model);
            var validatedModel = (0, _validateModel.validateModel)(upgradedModel);

            if (!validatedModel.isValid) this._showError(view, validatedModel);else this._updatePreview(view, validatedModel);
        }
    }, {
        key: "setPlayerController",
        value: function setPlayerController(playerController) {
            this.playerController = playerController;
            if (this.player && this.recorder) this._loadEventBus();
        }
    }, {
        key: "getState",
        value: function getState() {
            return JSON.stringify(this.addonState);
        }
    }, {
        key: "setState",
        value: function setState(state) {
            var _this = this;

            Object.assign(this.addonState, JSON.parse(state));
            this.addonState.getRecordingBlob().then(function (blob) {
                _this.mediaState.setLoading();
                var recording = URL.createObjectURL(blob);
                _this.player.setRecording(recording);
            });
            this.addonState.getVisibility().then(function (isVisible) {
                _this.setVisibility(isVisible);
            });
            this.addonState.getEnabled().then(function (isEnable) {
                _this._setEnableState(isEnable);
            });
        }
    }, {
        key: "startRecording",
        value: function startRecording() {
            if (this.mediaState.isNew() || this.mediaState.isLoaded()) this.recordButton.forceClick();
        }
    }, {
        key: "stopRecording",
        value: function stopRecording() {
            if (this.mediaState.isRecording()) this.recordButton.forceClick();
        }
    }, {
        key: "startPlaying",
        value: function startPlaying() {
            if (this.mediaState.isLoaded()) this.playButton.forceClick();
        }
    }, {
        key: "stopPlaying",
        value: function stopPlaying() {
            if (this.mediaState.isPlaying()) this.playButton.forceClick();
        }
    }, {
        key: "destroy",
        value: function destroy() {
            this.playButton.destroy();
            this.defaultRecordingPlayButton.destroy();
            this.recordButton.destroy();
            this.recorder.destroy();
            this.player.destroy();
            this.resourcesProvider.destroy();
            this.recordingTimeLimiter.destroy();
            this.soundIntensity.destroy();
            this.timer.destroy();
            this.startRecordingSoundEffect.destroy();
            this.stopRecordingSoundEffect.destroy();
            this.loader.destroy();
            this.addonViewService.destroy();
            this.mediaAnalyserService.destroy();
            this.addonState.destroy();
            this.mediaState.destroy();
            this.safariRecorderState.destroy();
            this.activationState.destroy();

            this.viewHandlers = null;
            this.defaultRecordingPlayButton = null;
            this.recorder = null;
            this.player = null;
            this.resourcesProvider = null;
            this.recordingTimeLimiter = null;
            this.soundIntensity = null;
            this.timer = null;
            this.recordButton = null;
            this.playButton = null;
            this.stopRecordingSoundEffect = null;
            this.startRecordingSoundEffect = null;
            this.loader = null;
            this.addonViewService = null;
            this.mediaAnalyserService = null;
            this.addonState = null;
            this.mediaState = null;
            this.activationState = null;

            this.playerController = null;
            this.view = null;
            this.model = null;
        }
    }, {
        key: "enable",
        value: function enable() {
            this._setEnableState(true);
        }
    }, {
        key: "disable",
        value: function disable() {
            this._setEnableState(false);
        }
    }, {
        key: "activate",
        value: function activate() {
            if (this.activationState.isInactive()) {
                this.activationState.setActive();
                this.addonViewService.activate();
                this._activateButtons();
            }
        }
    }, {
        key: "deactivate",
        value: function deactivate() {
            this._stopActions();
            this._deactivateButtons();
            this.activationState.setInactive();
            this.addonViewService.deactivate();
        }
    }, {
        key: "reset",
        value: function reset() {
            this.deactivate();
            this.activate();
            this.setVisibility(this.model["Is Visible"]);
            this._setEnableState(!this.model.isDisabled);
        }
    }, {
        key: "resetRecording",
        value: function resetRecording() {
            this.player.reset();
            this.addonState.reset();
            this.timer.reset();
            if (this.defaultRecordingPlayer.hasRecording) {
                this.mediaState.setLoadedDefaultRecording();
                this.timer.setDuration(this.defaultRecordingPlayer.duration);
            } else this.mediaState.setNew();
        }
    }, {
        key: "show",
        value: function show() {
            this.setVisibility(true);
            this.addonState.setVisibility(true);
        }
    }, {
        key: "hide",
        value: function hide() {
            this.setVisibility(false);
            this.addonState.setVisibility(false);
        }
    }, {
        key: "setVisibility",
        value: function setVisibility(isVisible) {
            this.addonViewService.setVisibility(isVisible);
        }
    }, {
        key: "_runAddon",
        value: function _runAddon(view, model) {
            this._loadAddon(view, model);
            this._loadLogic();
            this._loadDefaultRecording(this.model);
            this._activateButtons();
            this._loadWebViewMessageListener();
            this.setVisibility(model["Is Visible"]);
            this._setEnableState(!model.isDisabled);
        }
    }, {
        key: "_loadAddon",
        value: function _loadAddon(view, model) {
            this._loadCoreElements(view, model);

            this.mediaAnalyserService = new _MediaAnalyserService.MediaAnalyserService();
            this.recordingTimeLimiter = new _RecordingTimeLimiter.RecordingTimeLimiter(this.model.maxTime);

            this._loadMediaElements();
            this._loadViewElements();
        }
    }, {
        key: "_loadCoreElements",
        value: function _loadCoreElements(view, model) {
            this.view = view;
            this.model = model;
            this.viewHandlers = this._loadViewHandlers(this.view);

            this.mediaState = new _MediaState.MediaState();
            this.activationState = new _ActivationState.ActivationState();
            this.addonState = new _AddonState.AddonState();
            this.safariRecorderState = new _SafariRecorderState.SafariRecorderState();
        }
    }, {
        key: "_loadViewHandlers",
        value: function _loadViewHandlers(view) {
            return {
                $wrapperView: $(view).find(".media-recorder-wrapper"),
                $playerView: $(view).find(".media-recorder-player-wrapper"),
                $loaderView: $(view).find(".media-recorder-player-loader"),
                $defaultRecordingPlayButtonView: $(view).find(".media-recorder-default-recording-play-button"),
                $recordButtonView: $(view).find(".media-recorder-recording-button"),
                $playButtonView: $(view).find(".media-recorder-play-button"),
                $timerView: $(view).find(".media-recorder-timer"),
                $soundIntensityView: $(view).find(".media-recorder-sound-intensity")
            };
        }
    }, {
        key: "_loadMediaElements",
        value: function _loadMediaElements() {
            this.recorder = new _AudioRecorder.AudioRecorder();
            this.player = new _AudioPlayer.AudioPlayer(this.viewHandlers.$playerView);
            this.defaultRecordingPlayer = new _AudioPlayer.AudioPlayer(this.viewHandlers.$playerView);
            this.resourcesProvider = new _AudioResourcesProvider.AudioResourcesProvider(this.viewHandlers.$wrapperView);
            if (this.playerController) this._loadEventBus();
        }
    }, {
        key: "_loadEventBus",
        value: function _loadEventBus() {
            var eventBus = this.playerController.getEventBus();
            this.player.setEventBus(eventBus, this.model.ID, "player");
            this.defaultRecordingPlayer.setEventBus(eventBus, this.model.ID, "default");
            this.recorder.setEventBus(eventBus, this.model.ID);
        }
    }, {
        key: "_loadViewElements",
        value: function _loadViewElements() {
            this.addonViewService = new _AddonViewService.AddonViewService(this.viewHandlers.$wrapperView);
            this.recordButton = this._loadRecordButton();

            this.defaultRecordingPlayButton = new _DefaultRecordingPlayButton.DefaultRecordingPlayButton({
                $view: this.viewHandlers.$defaultRecordingPlayButtonView,
                state: this.mediaState,
                defaultRecording: this.model.defaultRecording
            });

            this.playButton = new _PlayButton.PlayButton({
                $view: this.viewHandlers.$playButtonView,
                state: this.mediaState
            });

            this.loader = new _AudioLoader.AudioLoader(this.viewHandlers.$loaderView);

            this.timer = new _Timer.Timer(this.viewHandlers.$timerView);
            this.soundIntensity = new _SoundIntensity.SoundIntensity(this.viewHandlers.$soundIntensityView);

            this._hideSelectedElements();
        }
    }, {
        key: "_loadRecordButton",
        value: function _loadRecordButton() {
            var recordButton = new _RecordButton.RecordButton({
                $view: this.viewHandlers.$recordButtonView,
                state: this.mediaState
            });

            this.startRecordingSoundEffect = new _SoundEffect.SoundEffect(this.model.startRecordingSound, this.viewHandlers.$playerView);
            this.stopRecordingSoundEffect = new _SoundEffect.SoundEffect(this.model.stopRecordingSound, this.viewHandlers.$playerView);

            return new _RecordButtonSoundEffect.RecordButtonSoundEffect(recordButton, this.startRecordingSoundEffect, this.stopRecordingSoundEffect);
        }
    }, {
        key: "_loadLogic",
        value: function _loadLogic() {
            var _this2 = this;

            this.recordButton.onStartRecording = function () {
                _this2.mediaState.setBlocked();
                if (_this2.safariRecorderState.isAvailableResources()) {
                    var stream = _this2.resourcesProvider.getStream();
                    _this2._handleRecording(stream);
                } else if (_this2.platform === 'mlibro') {
                    _this2._handleMlibroStartRecording();
                } else {
                    _this2.resourcesProvider.getMediaResources().then(function (stream) {
                        var isSafari = window.DevicesUtils.getBrowserVersion().toLowerCase().indexOf("safari") > -1;
                        if (isSafari && _this2.safariRecorderState.isUnavailableResources()) {
                            _this2._handleSafariRecordingInitialization();
                            return;
                        }
                        _this2._handleRecording(stream);
                    });
                }
            };

            this.recordButton.onStopRecording = function () {
                if (_this2.platform === 'mlibro') _this2._handleMlibroStopRecording();else {
                    _this2.mediaState.setLoading();
                    _this2.timer.stopCountdown();
                    _this2.recordingTimeLimiter.stopCountdown();
                    _this2.soundIntensity.stopAnalyzing();
                    _this2.mediaAnalyserService.closeAnalyzing();
                    _this2.player.stopStreaming();
                    _this2.recorder.stopRecording().then(function (blob) {
                        _this2.addonState.setRecordingBlob(blob);
                        var recording = URL.createObjectURL(blob);
                        _this2.player.reset();
                        _this2.player.setRecording(recording);
                    });
                    _this2.resourcesProvider.destroy();
                    _this2.safariRecorderState.setUnavailableResources();
                }
            };

            this.recordButton.onReset = function () {
                _this2.mediaState.setLoading();
                _this2.timer.stopCountdown();
                _this2.recordingTimeLimiter.stopCountdown();
                _this2.soundIntensity.stopAnalyzing();
                _this2.mediaAnalyserService.closeAnalyzing();
                _this2.player.stopStreaming();
                _this2.recorder.stopRecording();
                _this2.resourcesProvider.destroy();
            };

            this.playButton.onStartPlaying = function () {
                _this2.mediaState.setPlaying();
                _this2.timer.startCountdown();
                _this2.player.startPlaying().then(function (htmlMediaElement) {
                    return _this2.mediaAnalyserService.createAnalyserFromElement(htmlMediaElement).then(function (analyser) {
                        return _this2.soundIntensity.startAnalyzing(analyser);
                    });
                });
            };

            this.playButton.onStopPlaying = function () {
                _this2.mediaState.setLoaded();
                _this2.player.stopPlaying();
                _this2.timer.stopCountdown();
                _this2.soundIntensity.stopAnalyzing();
                _this2.mediaAnalyserService.closeAnalyzing();
            };

            this.defaultRecordingPlayButton.onStartPlaying = function () {
                _this2.mediaState.setPlayingDefaultRecording();
                _this2.timer.setDuration(_this2.defaultRecordingPlayer.duration);
                _this2.timer.startCountdown();
                _this2.defaultRecordingPlayer.startPlaying().then(function (htmlMediaElement) {
                    return _this2.mediaAnalyserService.createAnalyserFromElement(htmlMediaElement).then(function (analyser) {
                        return _this2.soundIntensity.startAnalyzing(analyser);
                    });
                });
            };

            this.defaultRecordingPlayButton.onStopPlaying = function () {
                if (_this2.player.hasRecording) {
                    _this2.timer.setDuration(_this2.player.duration);
                    _this2.mediaState.setLoaded();
                } else _this2.mediaState.setLoadedDefaultRecording();

                _this2.defaultRecordingPlayer.stopPlaying();
                _this2.timer.stopCountdown();
                _this2.soundIntensity.stopAnalyzing();
                _this2.mediaAnalyserService.closeAnalyzing();
            };

            this.player.onStartLoading = function () {
                _this2.mediaState.setLoading();
                _this2.loader.show();
            };

            this.player.onEndLoading = function () {
                _this2.mediaState.setLoaded();
                _this2.loader.hide();
            };

            this.player.onDurationChange = function (duration) {
                return _this2.timer.setDuration(duration);
            };
            this.player.onEndPlaying = function () {
                return _this2.playButton.forceClick();
            };

            this.defaultRecordingPlayer.onStartLoading = function () {
                _this2.mediaState.setLoading();
                _this2.loader.show();
            };

            this.defaultRecordingPlayer.onEndLoading = function () {
                if (_this2.player.hasRecording) _this2.mediaState.setLoaded();else _this2.mediaState.setLoadedDefaultRecording();
                _this2.loader.hide();
            };

            this.defaultRecordingPlayer.onDurationChange = function (duration) {
                return _this2.timer.setDuration(duration);
            };
            this.defaultRecordingPlayer.onEndPlaying = function () {
                return _this2.defaultRecordingPlayButton.forceClick();
            };

            this.recordingTimeLimiter.onTimeExpired = function () {
                return _this2.recordButton.forceClick();
            };
        }
    }, {
        key: "_handleRecording",
        value: function _handleRecording(stream) {
            var _this3 = this;

            this.mediaState.setRecording();
            this.player.startStreaming(stream);
            this.recorder.startRecording(stream);
            this.timer.reset();
            this.timer.startDecrementalCountdown(this.recordingTimeLimiter.maxTime);
            this.recordingTimeLimiter.startCountdown();
            this.mediaAnalyserService.createAnalyserFromStream(stream).then(function (analyser) {
                return _this3.soundIntensity.startAnalyzing(analyser);
            });
        }
    }, {
        key: "_loadDefaultRecording",
        value: function _loadDefaultRecording(model) {
            if (_isValid(model.defaultRecording) && model.isShowedDefaultRecordingButton) {
                this.mediaState.setLoading();
                this.defaultRecordingPlayer.setRecording(model.defaultRecording);
            }

            function _isValid(recording) {
                return recording != "" && recording != null && typeof recording != "undefined";
            }
        }
    }, {
        key: "_activateButtons",
        value: function _activateButtons() {
            this.recordButton.activate();
            this.playButton.activate();
            this.defaultRecordingPlayButton.activate();
        }
    }, {
        key: "_deactivateButtons",
        value: function _deactivateButtons() {
            this.recordButton.deactivate();
            this.playButton.deactivate();
            this.defaultRecordingPlayButton.deactivate();
        }
    }, {
        key: "_stopActions",
        value: function _stopActions() {
            if (this.mediaState.isRecording()) if (this.model.isResetRemovesRecording) {
                this.recordButton.reset();
                this.resetRecording();
            } else this.recordButton.forceClick();
            if (this.mediaState.isPlaying()) this.playButton.forceClick();
            if (this.mediaState.isPlayingDefaultRecording()) this.defaultRecordingPlayButton.forceClick();
        }
    }, {
        key: "_internalElements",
        value: function _internalElements() {
            return {
                validateModel: _validateModel.validateModel,
                ActivationState: _ActivationState.ActivationState,
                AudioLoader: _AudioLoader.AudioLoader,
                PlayButton: _PlayButton.PlayButton,
                RecordButton: _RecordButton.RecordButton,
                RecordingTimeLimiter: _RecordingTimeLimiter.RecordingTimeLimiter,
                MediaState: _MediaState.MediaState,
                Timer: _Timer.Timer,
                AudioPlayer: _AudioPlayer.AudioPlayer
            };
        }
    }, {
        key: "_showError",
        value: function _showError(view, validatedModel) {
            DOMOperationsUtils.showErrorMessage(view, _Errors.Errors, validatedModel.fieldName.join("|") + "_" + validatedModel.errorCode);
        }
    }, {
        key: "_showBrowserError",
        value: function _showBrowserError(view) {
            var $wrapper = $(view).find(".media-recorder-wrapper");
            $wrapper.addClass("media-recorder-wrapper-browser-not-supported");
            $wrapper.text(_Errors.Errors["not_supported_browser"] + window.DevicesUtils.getBrowserVersion());
        }
    }, {
        key: "_updatePreview",
        value: function _updatePreview(view, validatedModel) {
            var valid_model = validatedModel.value;
            var timerViewHandler = $(view).find(".media-recorder-timer");
            var defaultButtonViewHandler = $(view).find(".media-recorder-default-recording-play-button");
            var $wrapperViewHandler = $(view).find(".media-recorder-wrapper");

            if (valid_model.isShowedTimer == false) timerViewHandler.hide();else timerViewHandler.show();

            if (valid_model.isShowedDefaultRecordingButton == false) defaultButtonViewHandler.hide();else defaultButtonViewHandler.show();

            if (valid_model.isDisabled) {
                this.addonViewService = new _AddonViewService.AddonViewService($wrapperViewHandler);
                this.addonViewService.deactivate();
            }
        }
    }, {
        key: "_hideSelectedElements",
        value: function _hideSelectedElements() {
            if (this.model.isShowedTimer == false) this.viewHandlers.$timerView.hide();
            if (this.model.isShowedDefaultRecordingButton == false) this.viewHandlers.$defaultRecordingPlayButtonView.hide();
        }
    }, {
        key: "_isBrowserNotSupported",
        value: function _isBrowserNotSupported() {
            var browser = window.DevicesUtils.getBrowserVersion().split(" ")[0].toLowerCase();
            var browserVersion = window.DevicesUtils.getBrowserVersion().split(" ")[1];

            if (browser.indexOf("safari") > -1 && browserVersion < 11) return true;

            if (browser.indexOf("chrome") > -1 && browserVersion < 53) return true;

            if (window.DevicesUtils.isInternetExplorer()) return true;

            return false;
        }
    }, {
        key: "_handleSafariRecordingInitialization",
        value: function _handleSafariRecordingInitialization() {
            this.mediaState.setBlockedSafari();
            this.safariRecorderState.setAvailableResources();
            this.recordButton.setUnclickView();
            alert(_Errors.Errors["safari_select_recording_button_again"]);
        }
    }, {
        key: "_notifyWebView",
        value: function _notifyWebView() {
            try {
                window.external.notify(JSON.stringify({ type: "platform", target: this.model.ID }));
            } catch (e) {
                // silent message
                // can't use a conditional expression
                // https://social.msdn.microsoft.com/Forums/en-US/1a8b3295-cd4d-4916-9cf6-666de1d3e26c/windowexternalnotify-always-undefined?forum=winappswithcsharp
            }
        }
    }, {
        key: "_loadWebViewMessageListener",
        value: function _loadWebViewMessageListener() {
            var _this4 = this;

            window.addEventListener('message', function (event) {
                var eventData = JSON.parse(event.data);
                var isTypePlatform = eventData.type ? eventData.type.toLowerCase() === 'platform' : false;
                var isValueMlibro = eventData.value ? eventData.value.toLowerCase() === 'mlibro' : false;
                if (isTypePlatform && isValueMlibro) _this4._handleWebViewBehaviour();
            }, false);
        }
    }, {
        key: "_handleWebViewBehaviour",
        value: function _handleWebViewBehaviour() {
            var _this5 = this;

            if (this.platform === undefined || this.platform === null) {
                this.platform = 'mlibro';
                window.addEventListener('message', function (event) {
                    var eventData = JSON.parse(event.data);
                    var isTypeRecording = eventData.type ? eventData.type.toLowerCase() === 'recording' : false;
                    var isTargetMe = eventData.target ? eventData.target === _this5.model.ID : false;
                    var isStateLoading = _this5.mediaState.isLoading();
                    if (isTypeRecording && isTargetMe && isStateLoading) {
                        _this5.addonState.setRecordingBase64(eventData.value);
                        _this5.player.reset();
                        _this5.player.setRecording(eventData.value);
                    } else {
                        console.log("The recording has not been received");
                    }
                }, false);
            }
        }
    }, {
        key: "_handleMlibroStartRecording",
        value: function _handleMlibroStartRecording() {
            this.mediaState.setRecording();
            this.timer.reset();
            this.timer.startDecrementalCountdown(this.recordingTimeLimiter.maxTime);
            this.recordingTimeLimiter.startCountdown();
            window.external.notify(JSON.stringify({ type: "mediaRecord", target: this.model.ID }));
        }
    }, {
        key: "_handleMlibroStopRecording",
        value: function _handleMlibroStopRecording() {
            this.mediaState.setLoading();
            this.timer.stopCountdown();
            this.recordingTimeLimiter.stopCountdown();
            window.external.notify(JSON.stringify({ type: "mediaStop", target: this.model.ID }));
        }
    }, {
        key: "_setEnableState",
        value: function _setEnableState(isEnable) {
            if (isEnable) {
                this.addonState.setEnabled(true);
                this.activate();
            } else {
                this.addonState.setEnabled(false);
                this.deactivate();
            }
        }
    }, {
        key: "_upgradeModel",
        value: function _upgradeModel(model) {
            var upgradedModel = this._upgradeIsDisabled(model);
            return upgradedModel;
        }
    }, {
        key: "_upgradeIsDisabled",
        value: function _upgradeIsDisabled(model) {
            var upgradedModel = {};
            $.extend(true, upgradedModel, model);

            if (!upgradedModel["isDisabled"]) {
                upgradedModel["isDisabled"] = "False";
            }

            return upgradedModel;
        }
    }]);

    return MediaRecorder;
}();

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.validateModel = validateModel;

var _DefaultValues = __webpack_require__(15);

function validateModel(model) {
    var modelValidator = new ModelValidator();

    return modelValidator.validate(model, [ModelValidators.DumbString("ID"), ModelValidators.Boolean("Is Visible"), ModelValidators.Integer("maxTime", {
        minValue: 0,
        maxValue: _DefaultValues.DefaultValues.MAX_TIME,
        default: _DefaultValues.DefaultValues.DEFAULT_MAX_TIME
    }), ModelValidators.String("defaultRecording", {
        trim: true,
        default: ""
    }), ModelValidators.String("startRecordingSound", {
        trim: true,
        default: ""
    }), ModelValidators.String("stopRecordingSound", {
        trim: true,
        default: ""
    }), ModelValidators.Boolean("isResetRemovesRecording"), ModelValidators.Boolean("isShowedTimer"), ModelValidators.Boolean("isShowedDefaultRecordingButton"), ModelValidators.Boolean("isDisabled")]);
}

/***/ }),
/* 15 */
/***/ (function(module, exports) {

Object.defineProperty(exports, "__esModule", {
    value: true
});
var DefaultValues = exports.DefaultValues = {
    MAX_TIME: 60,
    DEFAULT_MAX_TIME: 10
};

/***/ }),
/* 16 */
/***/ (function(module, exports) {

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ActivationState = exports.ActivationState = function () {
    function ActivationState() {
        _classCallCheck(this, ActivationState);

        this.values = {
            ACTIVE: 0,
            INACTIVE: 1
        };

        this._value = this.values.ACTIVE;
    }

    _createClass(ActivationState, [{
        key: "isActive",
        value: function isActive() {
            return this._value === this.values.ACTIVE;
        }
    }, {
        key: "isInactive",
        value: function isInactive() {
            return this._value === this.values.INACTIVE;
        }
    }, {
        key: "setActive",
        value: function setActive() {
            this._value = this.values.ACTIVE;
        }
    }, {
        key: "setInactive",
        value: function setInactive() {
            this._value = this.values.INACTIVE;
        }
    }, {
        key: "destroy",
        value: function destroy() {
            this.value = null;
            this.values = null;
        }
    }]);

    return ActivationState;
}();

/***/ }),
/* 17 */
/***/ (function(module, exports) {

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MediaState = exports.MediaState = function () {
    function MediaState() {
        _classCallCheck(this, MediaState);

        this.values = {
            NEW: 0,
            BLOCKED: 1, // waiting for a resources permit
            RECORDING: 2,
            LOADING: 3,
            LOADED: 4,
            PLAYING: 5,
            PLAYING_DEFAULT_RECORDING: 6,
            LOADED_DEFAULT_RECORDING: 7,
            BLOCKED_SAFARI: 8
        };

        this._value = this.values.NEW;
    }

    _createClass(MediaState, [{
        key: "isNew",
        value: function isNew() {
            return this._value === this.values.NEW;
        }
    }, {
        key: "isRecording",
        value: function isRecording() {
            return this._value === this.values.RECORDING;
        }
    }, {
        key: "isLoading",
        value: function isLoading() {
            return this._value === this.values.LOADING;
        }
    }, {
        key: "isLoaded",
        value: function isLoaded() {
            return this._value === this.values.LOADED;
        }
    }, {
        key: "isPlaying",
        value: function isPlaying() {
            return this._value === this.values.PLAYING;
        }
    }, {
        key: "isPlayingDefaultRecording",
        value: function isPlayingDefaultRecording() {
            return this._value === this.values.PLAYING_DEFAULT_RECORDING;
        }
    }, {
        key: "isLoadedDefaultRecording",
        value: function isLoadedDefaultRecording() {
            return this._value === this.values.LOADED_DEFAULT_RECORDING;
        }
    }, {
        key: "isBlockedSafari",
        value: function isBlockedSafari() {
            return this._value === this.values.BLOCKED_SAFARI;
        }
    }, {
        key: "isBlocked",
        value: function isBlocked() {
            return this._value === this.values.BLOCKED;
        }
    }, {
        key: "setNew",
        value: function setNew() {
            this._value = this.values.NEW;
        }
    }, {
        key: "setRecording",
        value: function setRecording() {
            this._value = this.values.RECORDING;
        }
    }, {
        key: "setLoading",
        value: function setLoading() {
            this._value = this.values.LOADING;
        }
    }, {
        key: "setLoaded",
        value: function setLoaded() {
            this._value = this.values.LOADED;
        }
    }, {
        key: "setPlaying",
        value: function setPlaying() {
            this._value = this.values.PLAYING;
        }
    }, {
        key: "setPlayingDefaultRecording",
        value: function setPlayingDefaultRecording() {
            this._value = this.values.PLAYING_DEFAULT_RECORDING;
        }
    }, {
        key: "setLoadedDefaultRecording",
        value: function setLoadedDefaultRecording() {
            this._value = this.values.LOADED_DEFAULT_RECORDING;
        }
    }, {
        key: "setBlocked",
        value: function setBlocked() {
            this._value = this.values.BLOCKED;
        }
    }, {
        key: "setBlockedSafari",
        value: function setBlockedSafari() {
            this._value = this.values.BLOCKED_SAFARI;
        }
    }, {
        key: "destroy",
        value: function destroy() {
            this._value = null;
            this.values = null;
        }
    }]);

    return MediaState;
}();

/***/ }),
/* 18 */
/***/ (function(module, exports) {

Object.defineProperty(exports, "__esModule", {
    value: true
});
var Errors = exports.Errors = {
    "maxTime_INT02": "Time value contains non numerical characters",
    "maxTime_INT03": "Recording can not take more than 60 seconds",
    "maxTime_INT04": "Time in seconds cannot be negative value",
    "type_EV01": "Selected type is not supported",
    "not_supported_browser": "Your browser is not supported: ",
    "safari_select_recording_button_again": "Please click start recording button again. First time we tried to access your microphone. Now we will record it."
};

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.PlayButton = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _Button2 = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PlayButton = exports.PlayButton = function (_Button) {
    _inherits(PlayButton, _Button);

    function PlayButton(_ref) {
        var $view = _ref.$view,
            state = _ref.state;

        _classCallCheck(this, PlayButton);

        var _this = _possibleConstructorReturn(this, (PlayButton.__proto__ || Object.getPrototypeOf(PlayButton)).call(this, $view));

        _this.state = state;
        return _this;
    }

    _createClass(PlayButton, [{
        key: "destroy",
        value: function destroy() {
            _get(PlayButton.prototype.__proto__ || Object.getPrototypeOf(PlayButton.prototype), "destroy", this).call(this);
            this.state = null;
        }
    }, {
        key: "_eventHandler",
        value: function _eventHandler() {
            if (this.state.isLoaded()) this._startPlaying();else if (this.state.isPlaying()) this._stopPlaying();
        }
    }, {
        key: "_startPlaying",
        value: function _startPlaying() {
            this.$view.addClass("selected");
            this.onStartPlayingCallback();
        }
    }, {
        key: "_stopPlaying",
        value: function _stopPlaying() {
            this.$view.removeClass("selected");
            this.onStopPlayingCallback();
        }
    }, {
        key: "onStartPlaying",
        set: function set(callback) {
            this.onStartPlayingCallback = callback;
        }
    }, {
        key: "onStopPlaying",
        set: function set(callback) {
            this.onStopPlayingCallback = callback;
        }
    }]);

    return PlayButton;
}(_Button2.Button);

/***/ }),
/* 20 */
/***/ (function(module, exports) {

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Timer = exports.Timer = function () {
    function Timer($view) {
        _classCallCheck(this, Timer);

        this.$view = $view;
        this.interval = null;
        this.currentMinutes = 0;
        this.currentSeconds = 0;
        this.loadedMinutes = 0;
        this.loadedSeconds = 0;
        this.isLoaded = false;

        this.$view.css("z-index", "100");
        this._updateText();
    }

    _createClass(Timer, [{
        key: "startCountdown",
        value: function startCountdown() {
            var _this = this;

            this._clearCurrentTime();
            this.interval = setInterval(function () {
                _this._incrementTimer();
                _this._updateText();
            }, 1000);
        }
    }, {
        key: "startDecrementalCountdown",
        value: function startDecrementalCountdown(duration) {
            var _this2 = this;

            this._clearCurrentTime();
            this.setDuration(duration);
            this.currentMinutes = this.loadedMinutes;
            this.currentSeconds = this.loadedSeconds;
            this._updateText();
            this.interval = setInterval(function () {
                _this2._decrementTimer();
                _this2._updateText();
            }, 1000);
        }
    }, {
        key: "stopCountdown",
        value: function stopCountdown() {
            clearInterval(this.interval);
            this._clearCurrentTime();
            this._updateText();
        }
    }, {
        key: "setDuration",
        value: function setDuration(duration) {
            this.loadedMinutes = parseInt(duration / 60);
            this.loadedSeconds = parseInt(duration % 60);
            this.isLoaded = true;
            this._updateText();
        }
    }, {
        key: "reset",
        value: function reset() {
            clearInterval(this.interval);
            this.isLoaded = false;
            this._clearCurrentTime();
            this._clearLoadedTime();
            this._updateText();
        }
    }, {
        key: "destroy",
        value: function destroy() {
            clearInterval(this.interval);
            this.interval = null;
            this.$view.remove();
            this.$view = null;
        }
    }, {
        key: "_clearCurrentTime",
        value: function _clearCurrentTime() {
            this.currentMinutes = 0;
            this.currentSeconds = 0;
        }
    }, {
        key: "_clearLoadedTime",
        value: function _clearLoadedTime() {
            this.loadedMinutes = 0;
            this.loadedSeconds = 0;
        }
    }, {
        key: "_incrementTimer",
        value: function _incrementTimer() {
            this.currentSeconds++;

            if (this.currentSeconds >= 60) {
                this.currentSeconds = 0;
                this.currentMinutes++;
            }
        }
    }, {
        key: "_decrementTimer",
        value: function _decrementTimer() {
            this.currentSeconds--;

            if (this.currentSeconds >= 60) {
                this.currentSeconds = 0;
                this.currentMinutes++;
            }
        }
    }, {
        key: "_updateText",
        value: function _updateText() {
            this.$view[0].innerText = this.isLoaded ? this._generateTextTime(this.currentMinutes, this.currentSeconds) + " / " + this._generateTextTime(this.loadedMinutes, this.loadedSeconds) : this._generateTextTime(this.currentMinutes, this.currentSeconds);
        }
    }, {
        key: "_generateTextTime",
        value: function _generateTextTime(minutes, seconds) {
            var text = "";
            text += minutes < 10 ? "0" + minutes : minutes;
            text += ":";
            text += seconds < 10 ? "0" + seconds : seconds;

            return text;
        }
    }]);

    return Timer;
}();

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AddonState = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BlobService = __webpack_require__(22);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AddonState = exports.AddonState = function () {
    function AddonState() {
        _classCallCheck(this, AddonState);

        this.recording = null;
        this.visibility = null;
        this.enabled = null;
    }

    _createClass(AddonState, [{
        key: "setRecordingBlob",
        value: function setRecordingBlob(blob) {
            var _this = this;

            _BlobService.BlobService.serialize(blob).then(function (recording) {
                return _this.recording = recording;
            });
        }
    }, {
        key: "setRecordingBase64",
        value: function setRecordingBase64(recording) {
            this.recording = recording;
        }
    }, {
        key: "getRecordingBlob",
        value: function getRecordingBlob() {
            var _this2 = this;

            return new Promise(function (resolve) {
                if (_this2.recording) resolve(_BlobService.BlobService.deserialize(_this2.recording));
            });
        }
    }, {
        key: "setVisibility",
        value: function setVisibility(isVisible) {
            this.visibility = isVisible ? true : false;
        }
    }, {
        key: "getVisibility",
        value: function getVisibility() {
            var self = this;
            return new Promise(function (resolve) {
                if (self.visibility != null) resolve(self.visibility);
            });
        }
    }, {
        key: "setEnabled",
        value: function setEnabled(isEnable) {
            this.enabled = isEnable ? true : false;
        }
    }, {
        key: "getEnabled",
        value: function getEnabled() {
            var self = this;
            return new Promise(function (resolve) {
                if (self.enabled != null) resolve(self.enabled);
            });
        }
    }, {
        key: "reset",
        value: function reset() {
            this.recording = null;
            this.visibility = null;
            this.enabled = null;
        }
    }, {
        key: "destroy",
        value: function destroy() {
            this.recording = null;
            this.visibility = null;
            this.enabled = null;
        }
    }]);

    return AddonState;
}();

/***/ }),
/* 22 */
/***/ (function(module, exports) {

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BlobService = exports.BlobService = function () {
    function BlobService() {
        _classCallCheck(this, BlobService);
    }

    _createClass(BlobService, null, [{
        key: "serialize",
        value: function serialize(blob) {
            return new Promise(function (resolve) {
                var reader = new FileReader();
                reader.onloadend = function () {
                    return resolve(reader.result);
                };
                reader.readAsDataURL(blob);
            });
        }
    }, {
        key: "deserialize",
        value: function deserialize(base64Data) {
            var mediaSourceData = base64Data.split(",");
            var recording = mediaSourceData[1];
            var contentType = mediaSourceData[0].replace(";base64", "").replace("data:", "");
            return this._b64toBlob(recording, contentType);
        }
    }, {
        key: "_b64toBlob",
        value: function _b64toBlob(b64Data, contentType, sliceSize) {
            contentType = contentType || '';
            sliceSize = sliceSize || 512;

            var byteCharacters = atob(b64Data);
            var byteArrays = [];

            for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                var slice = byteCharacters.slice(offset, offset + sliceSize);

                var byteNumbers = new Array(slice.length);
                for (var i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                }

                var byteArray = new Uint8Array(byteNumbers);

                byteArrays.push(byteArray);
            }

            return new Blob(byteArrays, { type: contentType });
        }
    }]);

    return BlobService;
}();

/***/ }),
/* 23 */
/***/ (function(module, exports) {

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RecordingTimeLimiter = exports.RecordingTimeLimiter = function () {
    function RecordingTimeLimiter(maxTime) {
        _classCallCheck(this, RecordingTimeLimiter);

        this.workingDelay = 0.2;
        this.maxTime = maxTime + this.workingDelay;
        this.counter = 0;
        this.interval;
        this.callback;
    }

    _createClass(RecordingTimeLimiter, [{
        key: "startCountdown",
        value: function startCountdown() {
            var _this = this;

            if (this.maxTime || this.callback) this.interval = setInterval(function () {
                return _this._incrementTimer();
            }, this.workingDelay * 1000);
        }
    }, {
        key: "stopCountdown",
        value: function stopCountdown() {
            clearInterval(this.interval);
            this.counter = 0;
        }
    }, {
        key: "destroy",
        value: function destroy() {
            this.callback = function () {};
            clearInterval(this.interval);
            this.interval = null;
            this.callback = null;
        }
    }, {
        key: "_incrementTimer",
        value: function _incrementTimer() {
            this.counter += this.workingDelay;
            if (this.counter >= this.maxTime) {
                this.stopCountdown();
                this.callback();
            }
        }
    }, {
        key: "onTimeExpired",
        set: function set(callback) {
            this.callback = callback;
        }
    }]);

    return RecordingTimeLimiter;
}();

/***/ }),
/* 24 */
/***/ (function(module, exports) {

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SoundIntensity = exports.SoundIntensity = function () {
    function SoundIntensity($view) {
        _classCallCheck(this, SoundIntensity);

        this.$view = $view;
        this.volumeLevels = 6;
        this.interval = null;
    }

    _createClass(SoundIntensity, [{
        key: "startAnalyzing",
        value: function startAnalyzing(analyser) {
            var _this = this;

            this.interval = setInterval(function () {
                return _this._updateIntensity(analyser);
            }, 100);
        }
    }, {
        key: "stopAnalyzing",
        value: function stopAnalyzing() {
            if (this.interval) clearInterval(this.interval);
            this._clearIntensity();
        }
    }, {
        key: "destroy",
        value: function destroy() {
            this.stopAnalyzing();
            this.interval = null;
            this.$view.remove();
            this.$view = null;
        }
    }, {
        key: "_updateIntensity",
        value: function _updateIntensity(analyser) {
            var frequencyArray = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(frequencyArray);
            var avgVolume = this._calculateAvgVolume(frequencyArray);
            var raisedVolume = this._raiseVolume(avgVolume);
            var alignedVolume = this._alignVolume(raisedVolume);
            var intensity = alignedVolume * this.volumeLevels;

            this._setIntensity(intensity);
        }
    }, {
        key: "_calculateAvgVolume",
        value: function _calculateAvgVolume(volumeArray) {
            var sum = 0;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = volumeArray[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var i = _step.value;

                    sum += i;
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

            return sum / volumeArray.length;
        }
    }, {
        key: "_raiseVolume",
        value: function _raiseVolume(volume) {
            return volume > 0 ? volume * 1.2 : volume;
        }
    }, {
        key: "_alignVolume",
        value: function _alignVolume(volume) {
            volume = volume > 0 ? volume : 0;
            volume = volume < 64 ? volume : 64;
            return volume / 64;
        }
    }, {
        key: "_setIntensity",
        value: function _setIntensity(intensity) {
            this._clearIntensity();
            for (var currentLevel = 1; currentLevel <= intensity; currentLevel++) {
                var levelId = "#sound-intensity-" + currentLevel;
                var $level = this.$view.find(levelId);
                $level.addClass("selected");
            }
        }
    }, {
        key: "_clearIntensity",
        value: function _clearIntensity() {
            for (var currentLevel = 1; currentLevel <= this.volumeLevels; currentLevel++) {
                var levelId = "#sound-intensity-" + currentLevel;
                var $level = this.$view.find(levelId);
                $level.removeClass("selected");
            }
        }
    }]);

    return SoundIntensity;
}();

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MediaAnalyserService = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _AnalyserProvider = __webpack_require__(26);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MediaAnalyserService = exports.MediaAnalyserService = function () {
    function MediaAnalyserService() {
        _classCallCheck(this, MediaAnalyserService);

        this.audioContext = new (AudioContext || webkitAudioContext)();
        this.mediaStreamSource = null;
        this.mediaElementSource = null;
    }

    _createClass(MediaAnalyserService, [{
        key: "createAnalyserFromStream",
        value: function createAnalyserFromStream(stream) {
            var _this = this;

            return new Promise(function (resolve) {
                _this.mediaStreamSource = _this.audioContext.createMediaStreamSource(stream);

                var analyser = _AnalyserProvider.AnalyserProvider.create(_this.audioContext);
                _this.mediaStreamSource.connect(analyser);

                resolve(analyser);
            });
        }
    }, {
        key: "createAnalyserFromElement",
        value: function createAnalyserFromElement(htmlMediaElement) {
            var _this2 = this;

            return new Promise(function (resolve) {
                if (!_this2.mediaElementSource) _this2.mediaElementSource = _this2.audioContext.createMediaElementSource(htmlMediaElement);

                var analyser = _AnalyserProvider.AnalyserProvider.create(_this2.audioContext);
                _this2.mediaElementSource.connect(analyser);
                analyser.connect(_this2.audioContext.destination);

                resolve(analyser);
            });
        }
    }, {
        key: "closeAnalyzing",
        value: function closeAnalyzing() {
            if (this.mediaStreamSource) this.mediaStreamSource.disconnect();
            if (this.mediaElementSource) this.mediaElementSource.disconnect();
        }
    }, {
        key: "destroy",
        value: function destroy() {
            this.closeAnalyzing();
            this.audioContext.close();
            this.mediaElementSource = null;
            this.audioContext = null;
            this.mediaStreamSource = null;
        }
    }]);

    return MediaAnalyserService;
}();

/***/ }),
/* 26 */
/***/ (function(module, exports) {

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AnalyserProvider = exports.AnalyserProvider = function () {
    function AnalyserProvider() {
        _classCallCheck(this, AnalyserProvider);
    }

    _createClass(AnalyserProvider, null, [{
        key: "create",
        value: function create(audioContext) {
            if (DevicesUtils.isFirefox()) return this._createForFirefox(audioContext);else return this._createForOther(audioContext);
        }
    }, {
        key: "_createForFirefox",
        value: function _createForFirefox(audioContext) {
            var analyser = this._createAnalyser(audioContext);
            analyser.connect(audioContext.destination);

            return analyser;
        }
    }, {
        key: "_createForOther",
        value: function _createForOther(audioContext) {
            return this._createAnalyser(audioContext);
        }
    }, {
        key: "_createAnalyser",
        value: function _createAnalyser(audioContext) {
            var analyser = audioContext.createAnalyser();
            analyser.fftSize = 1024;
            analyser.smoothingTimeConstant = 0.3;
            return analyser;
        }
    }]);

    return AnalyserProvider;
}();

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AudioLoader = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Loader2 = __webpack_require__(28);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AudioLoader = exports.AudioLoader = function (_Loader) {
    _inherits(AudioLoader, _Loader);

    function AudioLoader($view) {
        _classCallCheck(this, AudioLoader);

        return _possibleConstructorReturn(this, (AudioLoader.__proto__ || Object.getPrototypeOf(AudioLoader)).call(this, $view));
    }

    _createClass(AudioLoader, [{
        key: "show",
        value: function show() {
            this.$view.addClass("audio-loader");
        }
    }, {
        key: "hide",
        value: function hide() {
            this.$view.removeClass("audio-loader");
        }
    }]);

    return AudioLoader;
}(_Loader2.Loader);

/***/ }),
/* 28 */
/***/ (function(module, exports) {

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Loader = exports.Loader = function () {
    function Loader($view) {
        _classCallCheck(this, Loader);

        if (this.constructor === Loader) throw new Error("Cannot create an instance of Loader abstract class");

        this.$view = $view;
    }

    _createClass(Loader, [{
        key: "show",
        value: function show() {
            throw new Error("Show method is not implemented");
        }
    }, {
        key: "hide",
        value: function hide() {
            throw new Error("Hide method is not implemented");
        }
    }, {
        key: "destroy",
        value: function destroy() {
            this.$view.remove();
            this.$view = null;
        }
    }]);

    return Loader;
}();

/***/ }),
/* 29 */
/***/ (function(module, exports) {

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SoundEffect = exports.SoundEffect = function () {
    function SoundEffect(sound, $wrapper) {
        _classCallCheck(this, SoundEffect);

        this.sound = sound;
        this.$wrapper = $wrapper;
        this.audioNode = document.createElement("audio");
        this.audioNode.src = sound;
        this.audioNode.style.display = "none";
        this.$wrapper.append(this.audioNode);
        this.startCallback = function () {};
        this.stopCallback = function () {};
    }

    _createClass(SoundEffect, [{
        key: "isValid",
        value: function isValid() {
            return this.sound != "" && this.sound != null && typeof this.sound != "undefined";
        }
    }, {
        key: "playSound",
        value: function playSound() {
            this.startCallback();
            var playPromise = this.audioNode.play();
            if (playPromise !== undefined) {
                playPromise.catch(function (error) {
                    console.log(error);
                });
            }
        }
    }, {
        key: "destroy",
        value: function destroy() {
            this.audioNode.pause();
            this.audioNode.src = "";
            this.audioNode.remove();
            this.audioNode = null;
            this.$wrapper.remove();
            this.$wrapper = null;
        }
    }, {
        key: "isBrowserRequiredReloadNode",
        value: function isBrowserRequiredReloadNode() {
            var navU = window.navigator.userAgent;
            return navU.indexOf('Android') > -1 && navU.indexOf('Mozilla/5.0') > -1 && navU.indexOf('AppleWebKit') > -1;
        }
    }, {
        key: "_reloadAudioNode",
        value: function _reloadAudioNode() {
            this.audioNode.remove();
            this.audioNode = document.createElement("audio");
            this.audioNode.src = this.sound;
            this.audioNode.style.display = "none";
            this.$wrapper.append(this.audioNode);
            this.onStopCallback = this.stopCallback;
        }
    }, {
        key: "onStartCallback",
        set: function set(callback) {
            this.startCallback = callback;
        }
    }, {
        key: "onStopCallback",
        set: function set(callback) {
            var _this = this;

            this.stopCallback = callback;
            this.audioNode.onended = function () {
                callback();
                if (_this.isBrowserRequiredReloadNode()) _this._reloadAudioNode();
            };
        }
    }]);

    return SoundEffect;
}();

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.RecordButtonSoundEffect = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _RecordButton2 = __webpack_require__(2);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RecordButtonSoundEffect = exports.RecordButtonSoundEffect = function (_RecordButton) {
    _inherits(RecordButtonSoundEffect, _RecordButton);

    function RecordButtonSoundEffect(recordButton, startRecordingSoundEffect, stopRecordingSoundEffect) {
        _classCallCheck(this, RecordButtonSoundEffect);

        var _this = _possibleConstructorReturn(this, (RecordButtonSoundEffect.__proto__ || Object.getPrototypeOf(RecordButtonSoundEffect)).call(this, { $view: recordButton.$view, state: recordButton.state }));

        _this.startRecordingSoundEffect = startRecordingSoundEffect;
        _this.stopRecordingSoundEffect = stopRecordingSoundEffect;
        return _this;
    }

    _createClass(RecordButtonSoundEffect, [{
        key: "_startRecording",
        value: function _startRecording() {
            if (this.startRecordingSoundEffect.isValid()) this._recordWithSoundEffect();else _get(RecordButtonSoundEffect.prototype.__proto__ || Object.getPrototypeOf(RecordButtonSoundEffect.prototype), "_startRecording", this).call(this);
        }
    }, {
        key: "_recordWithSoundEffect",
        value: function _recordWithSoundEffect() {
            this.startRecordingSoundEffect.onStartCallback = function () {};
            this.startRecordingSoundEffect.onStopCallback = function () {};
            _get(RecordButtonSoundEffect.prototype.__proto__ || Object.getPrototypeOf(RecordButtonSoundEffect.prototype), "_startRecording", this).call(this);
            this._playStartRecordingSoundEffect();
        }
    }, {
        key: "_playStartRecordingSoundEffect",
        value: function _playStartRecordingSoundEffect() {
            var _this2 = this;

            if (this.startRecordingSoundEffect.isBrowserRequiredReloadNode()) setTimeout(function () {
                return _this2.startRecordingSoundEffect.playSound();
            }, 1000);else this.startRecordingSoundEffect.playSound();
        }
    }, {
        key: "_stopRecording",
        value: function _stopRecording() {
            if (this.stopRecordingSoundEffect.isValid()) this._onStopRecordingWithSoundEffect();else _get(RecordButtonSoundEffect.prototype.__proto__ || Object.getPrototypeOf(RecordButtonSoundEffect.prototype), "_stopRecording", this).call(this);
        }
    }, {
        key: "_onStopRecordingWithSoundEffect",
        value: function _onStopRecordingWithSoundEffect() {
            var _this3 = this;

            this.stopRecordingSoundEffect.onStartCallback = function () {
                _get(RecordButtonSoundEffect.prototype.__proto__ || Object.getPrototypeOf(RecordButtonSoundEffect.prototype), "_stopRecording", _this3).call(_this3);
                _this3.deactivate();
            };
            this.stopRecordingSoundEffect.onStopCallback = function () {
                _this3.activate();
            };
            this.stopRecordingSoundEffect.playSound();
        }
    }]);

    return RecordButtonSoundEffect;
}(_RecordButton2.RecordButton);

/***/ }),
/* 31 */
/***/ (function(module, exports) {

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AddonViewService = exports.AddonViewService = function () {
    function AddonViewService($wrapperView) {
        _classCallCheck(this, AddonViewService);

        this.$view = $wrapperView;
    }

    _createClass(AddonViewService, [{
        key: 'setVisibility',
        value: function setVisibility(isVisible) {
            this.$view.css('visibility', isVisible ? 'visible' : 'hidden');
        }
    }, {
        key: 'activate',
        value: function activate() {
            this.$view.removeClass("disabled");
        }
    }, {
        key: 'deactivate',
        value: function deactivate() {
            this.$view.addClass("disabled");
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            this.$view = null;
        }
    }]);

    return AddonViewService;
}();

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AudioResourcesProvider = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ResourcesProvider2 = __webpack_require__(33);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AudioResourcesProvider = exports.AudioResourcesProvider = function (_ResourcesProvider) {
    _inherits(AudioResourcesProvider, _ResourcesProvider);

    function AudioResourcesProvider() {
        _classCallCheck(this, AudioResourcesProvider);

        return _possibleConstructorReturn(this, (AudioResourcesProvider.__proto__ || Object.getPrototypeOf(AudioResourcesProvider)).apply(this, arguments));
    }

    _createClass(AudioResourcesProvider, [{
        key: "_getOptions",
        value: function _getOptions() {
            return {
                audio: DevicesUtils.isEdge() ? true : {
                    echoCancellation: false
                }
            };
        }
    }]);

    return AudioResourcesProvider;
}(_ResourcesProvider2.ResourcesProvider);

/***/ }),
/* 33 */
/***/ (function(module, exports) {

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ResourcesProvider = exports.ResourcesProvider = function () {
    function ResourcesProvider($view) {
        _classCallCheck(this, ResourcesProvider);

        this.RESOURCES_ERROR_MESSAGE = "Multimedia resources not available";

        if (this.constructor === ResourcesProvider) throw new Error("Cannot create an instance of ResourcesProvider abstract class");

        this.$view = $view;
        this.stream = null;
    }

    _createClass(ResourcesProvider, [{
        key: "getMediaResources",
        value: function getMediaResources() {
            var _this = this;

            return new Promise(function (resolve) {
                navigator.mediaDevices.getUserMedia(_this._getOptions()).then(function (stream) {
                    _this.stream = stream;
                    resolve(stream);
                }).catch(function (error) {
                    console.error(error);
                    DOMOperationsUtils.showErrorMessage(_this.$view, [_this.RESOURCES_ERROR_MESSAGE], "0");
                });
            });
        }
    }, {
        key: "getStream",
        value: function getStream() {
            return this.stream;
        }
    }, {
        key: "destroy",
        value: function destroy() {
            if (this.stream) {
                this.stream.stop();
                this.stream = null;
            }
        }
    }, {
        key: "_getOptions",
        value: function _getOptions() {
            throw new Error("GetOptions accessor is not implemented");
        }
    }]);

    return ResourcesProvider;
}();

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AudioRecorder = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BaseRecorder2 = __webpack_require__(35);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AudioRecorder = exports.AudioRecorder = function (_BaseRecorder) {
    _inherits(AudioRecorder, _BaseRecorder);

    function AudioRecorder() {
        _classCallCheck(this, AudioRecorder);

        return _possibleConstructorReturn(this, (AudioRecorder.__proto__ || Object.getPrototypeOf(AudioRecorder)).apply(this, arguments));
    }

    _createClass(AudioRecorder, [{
        key: "_getOptions",
        value: function _getOptions() {
            var isEdge = DevicesUtils.isEdge();
            var isSafari = DevicesUtils.getBrowserVersion().toLowerCase().indexOf("safari") > -1;

            var options = {
                type: 'audio',
                numberOfAudioChannels: isEdge ? 1 : 2,
                checkForInactiveTracks: true,
                bufferSize: 16384,
                disableLogs: true
            };

            if (isSafari) {
                options.recorderType = StereoAudioRecorder;
                options.bufferSize = 4096;
                options.sampleRate = 44100;
            }

            return options;
        }
    }]);

    return AudioRecorder;
}(_BaseRecorder2.BaseRecorder);

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.BaseRecorder = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Recorder2 = __webpack_require__(36);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BaseRecorder = exports.BaseRecorder = function (_Recorder) {
    _inherits(BaseRecorder, _Recorder);

    function BaseRecorder() {
        _classCallCheck(this, BaseRecorder);

        var _this = _possibleConstructorReturn(this, (BaseRecorder.__proto__ || Object.getPrototypeOf(BaseRecorder)).call(this));

        if (_this.constructor === BaseRecorder) throw new Error("Cannot create an instance of Recorder abstract class");

        _this.recorder = null;
        _this.eventBus = null;
        _this.sourceID = '';
        return _this;
    }

    _createClass(BaseRecorder, [{
        key: "startRecording",
        value: function startRecording(stream) {
            this._clearRecorder();
            this.recorder = RecordRTC(stream, this._getOptions());
            this.recorder.startRecording();
            this._onStartRecordingCallback();
        }
    }, {
        key: "stopRecording",
        value: function stopRecording() {
            var self = this;
            var promise = new Promise(function (resolve) {
                return self.recorder.stopRecording(function () {
                    return resolve(self.recorder.getBlob());
                });
            });
            promise.then(function () {
                return self._onStopRecordingCallback(self);
            });

            return promise;
        }
    }, {
        key: "setEventBus",
        value: function setEventBus(eventBus, sourceID) {
            this.eventBus = eventBus;
            this.sourceID = sourceID;
        }
    }, {
        key: "destroy",
        value: function destroy() {
            this.onAvailableRecordingCallback = function (blob) {};

            if (this.recorder) {
                this.recorder.stopRecording();
                this._clearRecorder();
            }
        }
    }, {
        key: "_clearRecorder",
        value: function _clearRecorder() {
            if (this.recorder) {
                this.recorder.destroy();
                this.recorder = null;
            }
        }
    }, {
        key: "_onStartRecordingCallback",
        value: function _onStartRecordingCallback() {
            this._sendEventCallback(this, 'start');
        }
    }, {
        key: "_onStopRecordingCallback",
        value: function _onStopRecordingCallback(self) {
            self._sendEventCallback(self, 'stop');
        }
    }, {
        key: "_sendEventCallback",
        value: function _sendEventCallback(self, value) {
            if (self.eventBus) {
                var eventData = {
                    'source': self.sourceID,
                    'item': 'recorder',
                    'value': value,
                    'score': ''
                };
                self.eventBus.sendEvent('ValueChanged', eventData);
            }
        }
    }, {
        key: "_getOptions",
        value: function _getOptions() {
            throw new Error("GetOptions accessor is not implemented");
        }
    }]);

    return BaseRecorder;
}(_Recorder2.Recorder);

/***/ }),
/* 36 */
/***/ (function(module, exports) {

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Recorder = exports.Recorder = function () {
    function Recorder() {
        _classCallCheck(this, Recorder);

        if (this.constructor === Recorder) throw new Error("Cannot create an instance of Recorder abstract class");
    }

    _createClass(Recorder, [{
        key: "startRecording",
        value: function startRecording(stream) {
            throw new Error("StartRecording method is not implemented");
        }
    }, {
        key: "stopRecording",
        value: function stopRecording() {
            throw new Error("StopRecording method is not implemented");
        }
    }, {
        key: "setEventBus",
        value: function setEventBus(eventBus, sourceID) {
            throw new Error("setEventBus method is not implemented");
        }
    }, {
        key: "destroy",
        value: function destroy() {
            throw new Error("Destroy method is not implemented");
        }
    }]);

    return Recorder;
}();

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AudioPlayer = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BasePlayer2 = __webpack_require__(38);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AudioPlayer = exports.AudioPlayer = function (_BasePlayer) {
    _inherits(AudioPlayer, _BasePlayer);

    function AudioPlayer($view) {
        _classCallCheck(this, AudioPlayer);

        var _this = _possibleConstructorReturn(this, (AudioPlayer.__proto__ || Object.getPrototypeOf(AudioPlayer)).call(this, $view));

        _this.mediaNode.style.display = "hidden";
        return _this;
    }

    _createClass(AudioPlayer, [{
        key: "_createMediaNode",
        value: function _createMediaNode() {
            return document.createElement("audio");
        }
    }]);

    return AudioPlayer;
}(_BasePlayer2.BasePlayer);

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.BasePlayer = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Player2 = __webpack_require__(39);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BasePlayer = exports.BasePlayer = function (_Player) {
    _inherits(BasePlayer, _Player);

    function BasePlayer($view) {
        _classCallCheck(this, BasePlayer);

        var _this = _possibleConstructorReturn(this, (BasePlayer.__proto__ || Object.getPrototypeOf(BasePlayer)).call(this));

        if (_this.constructor === BasePlayer) throw new Error("Cannot create an instance of BasePlayer abstract class");

        _this.$view = $view;
        _this.hasRecording = false;
        _this.duration = null;
        _this.mediaNode = _this._createMediaNode();
        _this.mediaNode.controls = false;
        _this.$view.append(_this.mediaNode);
        _this.eventBus = null;
        _this.sourceID = '';
        _this.item = '';

        _this._enableEventsHandling();
        return _this;
    }

    _createClass(BasePlayer, [{
        key: "setRecording",
        value: function setRecording(source) {
            var _this2 = this;

            this.mediaNode.src = source;
            this._getDuration().then(function (duration) {
                _this2.onDurationChangeCallback(duration);
                _this2.duration = duration;
                _this2.hasRecording = true;
            });
        }
    }, {
        key: "startPlaying",
        value: function startPlaying() {
            var _this3 = this;

            return new Promise(function (resolve) {
                _this3.mediaNode.muted = false;
                if (_this3._isNotOnlineResources(_this3.mediaNode.src)) resolve(_this3.mediaNode);
                _this3.mediaNode.play();
            });
        }
    }, {
        key: "stopPlaying",
        value: function stopPlaying() {
            var _this4 = this;

            return new Promise(function (resolve) {
                _this4.mediaNode.pause();
                _this4.mediaNode.currentTime = 0;
                resolve();
            });
        }
    }, {
        key: "startStreaming",
        value: function startStreaming(stream) {
            this._disableEventsHandling();
            setSrcObject(stream, this.mediaNode);
            this.mediaNode.muted = true;
            this.mediaNode.play();
        }
    }, {
        key: "stopStreaming",
        value: function stopStreaming() {
            if (!this.mediaNode.paused) this.stopNextStopEvent = true;
            this.stopPlaying();
            this._enableEventsHandling();
        }
    }, {
        key: "reset",
        value: function reset() {
            this._disableEventsHandling();
            this.mediaNode.src = "";
            this.mediaNode.remove();
            this.hasRecording = false;
            this.duration = null;
            this.mediaNode = this._createMediaNode();
            this.mediaNode.controls = false;
            this.$view.append(this.mediaNode);
            this._enableEventsHandling();
        }
    }, {
        key: "destroy",
        value: function destroy() {
            this._disableEventsHandling();
            this.stopPlaying();
            this.mediaNode.src = "";
            this.mediaNode.remove();
            this.hasRecording = null;
            this.duration = null;
            this.$view.remove();
            this.mediaNode = null;
            this.$view = null;
        }
    }, {
        key: "setEventBus",
        value: function setEventBus(eventBus, sourceID, item) {
            this.eventBus = eventBus;
            this.sourceID = sourceID;
            this.item = item;
        }
    }, {
        key: "_enableEventsHandling",
        value: function _enableEventsHandling() {
            var _this5 = this;

            var self = this;
            this.mediaNode.onloadstart = function () {
                return _this5.onStartLoadingCallback();
            };
            this.mediaNode.onended = function () {
                return _this5.onEndPlayingCallback();
            };
            this.mediaNode.onplay = function () {
                return _this5._onPlayCallback();
            };
            this.mediaNode.onpause = function () {
                return _this5._onPausedCallback();
            };

            if (this._isMobileSafari()) this.mediaNode.onloadedmetadata = function () {
                self.onEndLoadingCallback();
            };else this.mediaNode.oncanplay = function () {
                return _this5.onEndLoadingCallback();
            };
        }
    }, {
        key: "_disableEventsHandling",
        value: function _disableEventsHandling() {
            this.mediaNode.onloadstart = null;
            this.mediaNode.oncanplay = null;
            this.mediaNode.onended = null;
            this.mediaNode.onplay = function () {
                return null;
            };
            this.mediaNode.onpause = function () {
                return null;
            };
            this.mediaNode.onloadedmetadata = function () {};
        }
    }, {
        key: "_getDuration",
        value: function _getDuration() {
            var _this6 = this;

            // faster resolution then
            // this.mediaNode.ondurationchange = () => this.onDurationChangeCallback(this.mediaNode.duration)
            return new Promise(function (resolve) {
                var playerMock = new Audio(_this6.mediaNode.src);
                playerMock.addEventListener("durationchange", function () {
                    if (this.duration != Infinity) {
                        resolve(this.duration);
                        playerMock.src = "";
                        playerMock.remove();
                    }
                }, false);
                playerMock.load();
                playerMock.currentTime = 24 * 60 * 60; // fake big time
                playerMock.volume = 0;
            });
        }
    }, {
        key: "_isMobileSafari",
        value: function _isMobileSafari() {
            return window.DevicesUtils.getBrowserVersion().toLowerCase().indexOf("safari") > -1 && window.MobileUtils.isSafariMobile(navigator.userAgent);
        }
    }, {
        key: "_isNotOnlineResources",
        value: function _isNotOnlineResources(source) {
            return !(source.startsWith("www.") || source.startsWith("http://") || source.startsWith("https://"));
        }
    }, {
        key: "_onPlayCallback",
        value: function _onPlayCallback() {
            this._sendEventCallback('playing');
        }
    }, {
        key: "_onPausedCallback",
        value: function _onPausedCallback() {
            if (this.stopNextStopEvent) {
                this.stopNextStopEvent = false;
            } else {
                this._sendEventCallback('stop');
            }
        }
    }, {
        key: "_sendEventCallback",
        value: function _sendEventCallback(value) {
            if (this.eventBus) {
                var eventData = {
                    'source': this.sourceID,
                    'item': this.item,
                    'value': value,
                    'score': ''
                };
                this.eventBus.sendEvent('ValueChanged', eventData);
            }
        }
    }, {
        key: "_createMediaNode",
        value: function _createMediaNode() {
            throw new Error("GetMediaNode accessor is not implemented");
        }
    }]);

    return BasePlayer;
}(_Player2.Player);

/***/ }),
/* 39 */
/***/ (function(module, exports) {

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Player = exports.Player = function () {
    function Player() {
        _classCallCheck(this, Player);

        if (this.constructor === Player) throw new Error("Cannot create an instance of Player abstract class");
    }

    _createClass(Player, [{
        key: "setRecording",
        value: function setRecording(source) {
            throw new Error("SetRecording method is not implemented");
        }
    }, {
        key: "startPlaying",
        value: function startPlaying() {
            throw new Error("StartPlaying method is not implemented");
        }
    }, {
        key: "stopPlaying",
        value: function stopPlaying() {
            throw new Error("StopPlaying method is not implemented");
        }
    }, {
        key: "startStreaming",
        value: function startStreaming(stream) {
            throw new Error("StartStreaming method is not implemented");
        }
    }, {
        key: "stopStreaming",
        value: function stopStreaming() {
            throw new Error("StopStreaming method is not implemented");
        }
    }, {
        key: "setEventBus",
        value: function setEventBus(eventBus, sourceID) {
            throw new Error("setEventBus method is not implemented");
        }
    }, {
        key: "reset",
        value: function reset() {
            throw new Error("Reset method is not implemented");
        }
    }, {
        key: "destroy",
        value: function destroy() {
            throw new Error("Destroy method is not implemented");
        }
    }, {
        key: "onStartLoading",
        set: function set(callback) {
            this.onStartLoadingCallback = function () {
                return callback();
            };
        }
    }, {
        key: "onEndLoading",
        set: function set(callback) {
            this.onEndLoadingCallback = function () {
                return callback();
            };
        }
    }, {
        key: "onEndPlaying",
        set: function set(callback) {
            this.onEndPlayingCallback = function () {
                return callback();
            };
        }
    }, {
        key: "onDurationChange",
        set: function set(callback) {
            this.onDurationChangeCallback = function (duration) {
                return callback(duration);
            };
        }
    }]);

    return Player;
}();

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DefaultRecordingPlayButton = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _Button2 = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DefaultRecordingPlayButton = exports.DefaultRecordingPlayButton = function (_Button) {
    _inherits(DefaultRecordingPlayButton, _Button);

    function DefaultRecordingPlayButton(_ref) {
        var $view = _ref.$view,
            state = _ref.state,
            defaultRecording = _ref.defaultRecording;

        _classCallCheck(this, DefaultRecordingPlayButton);

        var _this = _possibleConstructorReturn(this, (DefaultRecordingPlayButton.__proto__ || Object.getPrototypeOf(DefaultRecordingPlayButton)).call(this, $view));

        _this.state = state;
        _this.defaultRecording = defaultRecording;
        return _this;
    }

    _createClass(DefaultRecordingPlayButton, [{
        key: "destroy",
        value: function destroy() {
            _get(DefaultRecordingPlayButton.prototype.__proto__ || Object.getPrototypeOf(DefaultRecordingPlayButton.prototype), "destroy", this).call(this);
            this.state = null;
        }
    }, {
        key: "_eventHandler",
        value: function _eventHandler() {
            if ((this.state.isLoaded() || this.state.isLoadedDefaultRecording()) && this.defaultRecording != "") this._startPlaying();else if (this.state.isPlayingDefaultRecording()) this._stopPlaying();
        }
    }, {
        key: "_startPlaying",
        value: function _startPlaying() {
            this.$view.addClass("selected");
            this.onStartPlayingCallback();
        }
    }, {
        key: "_stopPlaying",
        value: function _stopPlaying() {
            this.$view.removeClass("selected");
            this.onStopPlayingCallback();
        }
    }, {
        key: "onStartPlaying",
        set: function set(callback) {
            this.onStartPlayingCallback = callback;
        }
    }, {
        key: "onStopPlaying",
        set: function set(callback) {
            this.onStopPlayingCallback = callback;
        }
    }]);

    return DefaultRecordingPlayButton;
}(_Button2.Button);

/***/ }),
/* 41 */
/***/ (function(module, exports) {

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SafariRecorderState = exports.SafariRecorderState = function () {
    function SafariRecorderState() {
        _classCallCheck(this, SafariRecorderState);

        this.values = {
            UNAVAILABLE_RESOURCES: 0,
            AVAILABLE_RESOURCES: 1
        };

        this._value = this.values.UNAVAILABLE_RESOURCES;
    }

    _createClass(SafariRecorderState, [{
        key: "isUnavailableResources",
        value: function isUnavailableResources() {
            return this._value === this.values.UNAVAILABLE_RESOURCES;
        }
    }, {
        key: "isAvailableResources",
        value: function isAvailableResources() {
            return this._value === this.values.AVAILABLE_RESOURCES;
        }
    }, {
        key: "setUnavailableResources",
        value: function setUnavailableResources() {
            this._value = this.values.UNAVAILABLE_RESOURCES;
        }
    }, {
        key: "setAvailableResources",
        value: function setAvailableResources() {
            this._value = this.values.AVAILABLE_RESOURCES;
        }
    }, {
        key: "destroy",
        value: function destroy() {
            this._value = null;
            this.values = null;
        }
    }]);

    return SafariRecorderState;
}();

/***/ })
/******/ ]);