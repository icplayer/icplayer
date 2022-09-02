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
/******/ 	return __webpack_require__(__webpack_require__.s = 16);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

Object.defineProperty(exports, "__esModule", {
    value: true
});
var CSS_CLASSES = exports.CSS_CLASSES = {
    PLAYER_WRAPPER: "media-recorder-player-wrapper",
    PLAYER_LOADER: "media-recorder-player-loader",
    AUDIO_LOADER: "audio-loader",
    WRAPPER: "media-recorder-wrapper",
    WRAPPER_BROWSER_NOT_SUPPORTED: "media-recorder-wrapper-browser-not-supported",
    DEFAULT_RECORDING_PLAY_BUTTON: "media-recorder-default-recording-play-button",
    RECORDING_BUTTON: "media-recorder-recording-button",
    PLAY_BUTTON: "media-recorder-play-button",
    RESET_BUTTON: "media-recorder-reset-button",
    DOWNLOAD_BUTTON: "media-recorder-download-button",
    PROGRESS_BAR: "media-recorder-progress-bar",
    PROGRESS_BAR_SLIDER: "media-recorder-progress-bar-slider",
    TIMER: "media-recorder-timer",
    SOUND_INTENSITY: "media-recorder-sound-intensity",
    DOTTED_SOUND_INTENSITY: "media-recorder-dotted-sound-intensity",
    TALL_DOT: "tall-dot",
    SHORT_DOT: "short-dot",
    SOUND_INTENSITY_DOT: "sound-intensity-dot",
    RESET_DIALOG: "media-recorder-reset-dialog",
    DIALOG_TEXT: "dialog-text",
    CONFIRM_BUTTON: "confirm-button",
    DENY_BUTTON: "deny-button",
    EXTENDED_MODE: "extended-mode",
    SELECTED: "selected",
    DISABLED: "disabled"
};

/***/ }),
/* 1 */
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
/* 2 */,
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.RecordButton = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _Button2 = __webpack_require__(1);

var _CssClasses = __webpack_require__(0);

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

        _this._keyboardController = null;

        _this.state = state;
        return _this;
    }

    _createClass(RecordButton, [{
        key: "destroy",
        value: function destroy() {
            _get(RecordButton.prototype.__proto__ || Object.getPrototypeOf(RecordButton.prototype), "destroy", this).call(this);
            this._keyboardController = null;
            this.state = null;
        }
    }, {
        key: "reset",
        value: function reset() {
            this.$view.removeClass(_CssClasses.CSS_CLASSES.SELECTED);
            this.onResetCallback();
        }
    }, {
        key: "setUnclickView",
        value: function setUnclickView() {
            this.$view.removeClass(_CssClasses.CSS_CLASSES.SELECTED);
        }
    }, {
        key: "_eventHandler",
        value: function _eventHandler() {
            if (this.state.isNew() || this.state.isLoaded() || this.state.isLoadedDefaultRecording() || this.state.isBlockedSafari()) this._startRecording();else if (this.state.isRecording()) this._stopRecording();
        }
    }, {
        key: "_startRecording",
        value: function _startRecording() {
            this.$view.addClass(_CssClasses.CSS_CLASSES.SELECTED);
            this.onStartRecordingCallback();
        }
    }, {
        key: "_stopRecording",
        value: function _stopRecording() {
            this.$view.removeClass(_CssClasses.CSS_CLASSES.SELECTED);
            this.onStopRecordingCallback();
        }
    }, {
        key: "setKeyboardController",
        value: function setKeyboardController(keyboardController) {
            this._keyboardController = keyboardController;
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
/* 4 */
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
    }, {
        key: "getMp3BlobFromDecodedData",
        value: function getMp3BlobFromDecodedData(decodedData) {
            var left = this._convertFloat32ToInt16Array(decodedData.getChannelData(0));
            var right = left;
            if (decodedData.numberOfChannels === 2) {
                right = this._convertFloat32ToInt16Array(decodedData.getChannelData(1));
            }

            return this._encode(decodedData.numberOfChannels, decodedData.sampleRate, decodedData.length, left, right);
        }
    }, {
        key: "_encode",
        value: function _encode(channels, sampleRate, sampleLen, left, right) {
            var buffer = [];
            var mp3enc = new lamejs.Mp3Encoder(channels, sampleRate, 320);

            var maxSamples = 1152;
            for (var i = 0; i < sampleLen; i += maxSamples) {
                var leftChunk = left.subarray(i, i + maxSamples);
                var rightChunk = right.subarray(i, i + maxSamples);

                var mp3buf = mp3enc.encodeBuffer(leftChunk, rightChunk);
                if (mp3buf.length > 0) {
                    buffer.push(new Int8Array(mp3buf));
                }
            }
            var d = mp3enc.flush();
            if (d.length > 0) {
                buffer.push(new Int8Array(d));
            }

            var blob = new Blob(buffer, { type: 'audio/mpeg-3' });
            return blob;
        }

        //lamejs require int16 array
        //see more at - https://github.com/zhuker/lamejs/issues/10#issuecomment-141718262

    }, {
        key: "_convertFloat32ToInt16Array",
        value: function _convertFloat32ToInt16Array(data) {
            var len = data.length,
                i = 0;
            var dataAsInt16Array = new Int16Array(len);

            while (i < len) {
                dataAsInt16Array[i] = convert(data[i++]);
            }
            function convert(n) {
                var v = n < 0 ? n * 32768 : n * 32767; // convert in range [-32768, 32767]
                return Math.max(-32768, Math.min(32768, v)); // clamp
            }
            return dataAsInt16Array;
        }
    }]);

    return BlobService;
}();

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SoundIntensity = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _CssClasses = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SoundIntensity = exports.SoundIntensity = function () {
    function SoundIntensity($view) {
        _classCallCheck(this, SoundIntensity);

        this.$view = $view;
        this.volumeLevels = 6;
        this.interval = null;
        this.enableAnalyser = true;
        this.shouldBeVisible = true;
    }

    _createClass(SoundIntensity, [{
        key: 'setEnableAnalyser',
        value: function setEnableAnalyser(enableAnalyser) {
            this.enableAnalyser = enableAnalyser;
            if (this.shouldBeVisible) {
                if (this.enableAnalyser) {
                    this.show();
                } else {
                    this.hide();
                }
            }
        }
    }, {
        key: 'startAnalyzing',
        value: function startAnalyzing(analyser) {
            var _this = this;

            this.interval = setInterval(function () {
                return _this._updateIntensity(analyser);
            }, 100);
        }
    }, {
        key: 'stopAnalyzing',
        value: function stopAnalyzing() {
            if (this.interval) clearInterval(this.interval);
            this._clearIntensity();
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            this.stopAnalyzing();
            this.interval = null;
            this.$view.remove();
            this.$view = null;
        }
    }, {
        key: 'show',
        value: function show() {
            if (this.enableAnalyser) {
                this.$view.css('display', '');
            }
            this.shouldBeVisible = true;
        }
    }, {
        key: 'hide',
        value: function hide() {
            this.$view.css('display', 'none');
            this.shouldBeVisible = false;
        }
    }, {
        key: 'setEventBus',
        value: function setEventBus(eventBus, sourceID) {
            this.eventBus = eventBus;
            this.sourceID = sourceID;
        }
    }, {
        key: '_updateIntensity',
        value: function _updateIntensity(analyser) {
            var frequencyArray = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(frequencyArray);
            var avgVolume = this._calculateAvgVolume(frequencyArray);
            var raisedVolume = this._raiseVolume(avgVolume);
            var alignedVolume = this._alignVolume(raisedVolume);
            var intensity = alignedVolume * this.volumeLevels;
            this._setIntensity(intensity);
            if (this.eventBus) {
                this._handleEvents(intensity);
            }
        }
    }, {
        key: '_handleEvents',
        value: function _handleEvents(intensity) {
            if (this.lastIntensityLevel === undefined) {
                this.lastIntensityLevel = 0;
                return;
            }
            var newIntensityLevel = Math.floor(intensity);
            if (newIntensityLevel !== this.lastIntensityLevel) {
                this.lastIntensityLevel = newIntensityLevel;
                var eventData = {
                    'source': this.sourceID,
                    'item': 'intensity',
                    'value': newIntensityLevel,
                    'score': ''
                };
                this.eventBus.sendEvent('ValueChanged', eventData);
            }
        }
    }, {
        key: '_calculateAvgVolume',
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
        key: '_raiseVolume',
        value: function _raiseVolume(volume) {
            return volume > 0 ? volume * 1.2 : volume;
        }
    }, {
        key: '_alignVolume',
        value: function _alignVolume(volume) {
            volume = volume > 0 ? volume : 0;
            volume = volume < 64 ? volume : 64;
            return volume / 64;
        }
    }, {
        key: '_setIntensity',
        value: function _setIntensity(intensity) {
            this._clearIntensity();
            for (var currentLevel = 1; currentLevel <= intensity; currentLevel++) {
                var levelId = "#sound-intensity-" + currentLevel;
                var $level = this.$view.find(levelId);
                $level.addClass(_CssClasses.CSS_CLASSES.SELECTED);
            }
        }
    }, {
        key: '_clearIntensity',
        value: function _clearIntensity() {
            for (var currentLevel = 1; currentLevel <= this.volumeLevels; currentLevel++) {
                var levelId = "#sound-intensity-" + currentLevel;
                var $level = this.$view.find(levelId);
                $level.removeClass(_CssClasses.CSS_CLASSES.SELECTED);
            }
        }
    }]);

    return SoundIntensity;
}();

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.BaseKeyboardController = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _CssClasses = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BaseKeyboardController = exports.BaseKeyboardController = function (_KeyboardController) {
    _inherits(BaseKeyboardController, _KeyboardController);

    function BaseKeyboardController(elements, columnsCount, model, mediaState, activationState, speak, speakAndExecuteCallback) {
        _classCallCheck(this, BaseKeyboardController);

        var _this = _possibleConstructorReturn(this, (BaseKeyboardController.__proto__ || Object.getPrototypeOf(BaseKeyboardController)).call(this, elements, columnsCount));

        _this._isRecording = false;
        _this.DEFAULT_TTS_PHRASES = {
            DEFAULT_RECORDING_PLAY_BUTTON: "Default recording play button",
            RECORDING_BUTTON: "Recording button",
            PLAY_BUTTON: "Play button",
            RESET_BUTTON: "Reset button",
            DOWNLOAD_BUTTON: "Download button",
            RESET_DIALOG: "Reset dialog",
            START_RECORDING: "Start recording",
            STOP_RECORDING: "Recording stopped",
            DISABLED: "Disabled"
        };


        if (_this.constructor === BaseKeyboardController) throw new Error("Cannot create an instance of KeyboardController abstract class");

        _this._langTag = model.langAttribute;
        _this._mediaState = mediaState;
        _this._activationState = activationState;
        _this._speak = speak;
        _this._speakAndExecuteCallback = speakAndExecuteCallback;
        return _this;
    }

    _createClass(BaseKeyboardController, [{
        key: "setSpeechTexts",
        value: function setSpeechTexts(speechTexts) {
            this.speechTexts = {
                DefaultRecordingPlayButton: this.DEFAULT_TTS_PHRASES.DEFAULT_RECORDING_PLAY_BUTTON,
                RecordingButton: this.DEFAULT_TTS_PHRASES.RECORDING_BUTTON,
                PlayButton: this.DEFAULT_TTS_PHRASES.PLAY_BUTTON,
                ResetButton: this.DEFAULT_TTS_PHRASES.RESET_BUTTON,
                DownloadButton: this.DEFAULT_TTS_PHRASES.DOWNLOAD_BUTTON,
                ResetDialog: this.DEFAULT_TTS_PHRASES.RESET_DIALOG,
                StartRecording: this.DEFAULT_TTS_PHRASES.START_RECORDING,
                StopRecording: this.DEFAULT_TTS_PHRASES.STOP_RECORDING,
                Disabled: this.DEFAULT_TTS_PHRASES.DISABLED
            };

            if (!speechTexts || $.isEmptyObject(speechTexts)) {
                return;
            };

            this.speechTexts = {
                DefaultRecordingPlayButton: TTSUtils.getSpeechTextProperty(speechTexts.DefaultRecordingPlayButton.DefaultRecordingPlayButton, this.speechTexts.DefaultRecordingPlayButton),
                RecordingButton: TTSUtils.getSpeechTextProperty(speechTexts.RecordingButton.RecordingButton, this.speechTexts.RecordingButton),
                PlayButton: TTSUtils.getSpeechTextProperty(speechTexts.PlayButton.PlayButton, this.speechTexts.PlayButton),
                ResetButton: TTSUtils.getSpeechTextProperty(speechTexts.ResetButton.ResetButton, this.speechTexts.ResetButton),
                DownloadButton: TTSUtils.getSpeechTextProperty(speechTexts.DownloadButton.DownloadButton, this.speechTexts.DownloadButton),
                ResetDialog: TTSUtils.getSpeechTextProperty(speechTexts.ResetDialog.ResetDialog, this.speechTexts.ResetDialog),
                StartRecording: TTSUtils.getSpeechTextProperty(speechTexts.StartRecording.StartRecording, this.speechTexts.StartRecording),
                StopRecording: TTSUtils.getSpeechTextProperty(speechTexts.StopRecording.StopRecording, this.speechTexts.StopRecording),
                Disabled: TTSUtils.getSpeechTextProperty(speechTexts.Disabled.Disabled, this.speechTexts.Disabled)
            };
        }
    }, {
        key: "getTarget",
        value: function getTarget(element, willBeClicked) {
            return $(element);
        }
    }, {
        key: "switchElement",
        value: function switchElement(move) {
            _get(BaseKeyboardController.prototype.__proto__ || Object.getPrototypeOf(BaseKeyboardController.prototype), "switchElement", this).call(this, move);
            if (!this._isCurrentElementNotDisplayed()) {
                this.readCurrentElement();
            }
        }
    }, {
        key: "nextElement",
        value: function nextElement(event) {
            if (event) {
                event.preventDefault();
            }

            if (this._isKeyboardNavigationBlocked()) {
                return;
            }

            this.switchElement(1);

            if (this._isCurrentElementNotDisplayed()) {
                this.nextElement();
            }
        }
    }, {
        key: "previousElement",
        value: function previousElement(event) {
            if (event) {
                event.preventDefault();
            }

            if (this._isKeyboardNavigationBlocked()) {
                return;
            }

            this.switchElement(-1);

            if (this._isCurrentElementNotDisplayed()) {
                this.previousElement();
            }
        }
    }, {
        key: "nextRow",
        value: function nextRow(event) {
            if (event) {
                event.preventDefault();
            }

            if (this._isKeyboardNavigationBlocked()) {
                return;
            }

            this.switchElement(this.columnsCount);

            if (this._isCurrentElementNotDisplayed()) {
                this.nextRow();
            }
        }
    }, {
        key: "previousRow",
        value: function previousRow(event) {
            if (event) {
                event.preventDefault();
            }

            if (this._isKeyboardNavigationBlocked()) {
                return;
            }

            this.switchElement(-this.columnsCount);

            if (this._isCurrentElementNotDisplayed()) {
                this.previousRow();
            }
        }
    }, {
        key: "enter",
        value: function enter(event) {
            if (event) {
                event.preventDefault();
            }

            if (!this.keyboardNavigationActive) {
                this._performFirstEnterEvent();
            } else {
                this._performNotFirstEnterEvent();
            }
        }
    }, {
        key: "_performFirstEnterEvent",
        value: function _performFirstEnterEvent() {
            this.keyboardNavigationActive = true;

            if (this._isKeyboardNavigationBlocked()) {
                this._markActiveElement();
            } else {
                this._markAndReadFirstDisplayedElement();
            }
        }
    }, {
        key: "_markActiveElement",
        value: function _markActiveElement() {
            if (this._mediaState.isPlayingDefaultRecording()) {
                this.markDefaultRecordingPlayButton();
            } else if (this._mediaState.isRecording() || this._isRecording) {
                this.markRecordingButton();
            } else if (this._mediaState.isPlaying()) {
                this.markPlayButton();
            }
        }
    }, {
        key: "markDefaultRecordingPlayButton",
        value: function markDefaultRecordingPlayButton() {
            throw new Error("readElement method is not implemented");
        }
    }, {
        key: "markRecordingButton",
        value: function markRecordingButton() {
            throw new Error("readElement method is not implemented");
        }
    }, {
        key: "markPlayButton",
        value: function markPlayButton() {
            throw new Error("readElement method is not implemented");
        }
    }, {
        key: "_markAndReadFirstDisplayedElement",
        value: function _markAndReadFirstDisplayedElement() {
            this.markCurrentElement(0);
            if (this._isCurrentElementNotDisplayed()) {
                this.nextElement();
            } else {
                this.readCurrentElement();
            }
        }
    }, {
        key: "_performNotFirstEnterEvent",
        value: function _performNotFirstEnterEvent() {
            if (!this._isKeyboardNavigationBlocked()) {
                this.readCurrentElement();
            }
        }
    }, {
        key: "select",
        value: function select(event) {
            if (this._isAddonDisabled() && !this._getCurrentElement().hasClass(_CssClasses.CSS_CLASSES.DIALOG_TEXT)) {
                var textVoiceObject = [];

                this._pushDisabledMessageToTextVoiceObject(textVoiceObject);

                this._speak(textVoiceObject);
            }

            _get(BaseKeyboardController.prototype.__proto__ || Object.getPrototypeOf(BaseKeyboardController.prototype), "select", this).call(this, event);
        }
    }, {
        key: "exitWCAGMode",
        value: function exitWCAGMode() {
            this._isRecording = false;
            _get(BaseKeyboardController.prototype.__proto__ || Object.getPrototypeOf(BaseKeyboardController.prototype), "exitWCAGMode", this).call(this);
        }
    }, {
        key: "_isAddonDisabled",
        value: function _isAddonDisabled() {
            return this._activationState.isInactive();
        }
    }, {
        key: "_isKeyboardNavigationBlocked",
        value: function _isKeyboardNavigationBlocked() {
            return this._mediaState.isPlayingDefaultRecording() || this._mediaState.isRecording() || this._mediaState.isPlaying() || this._isRecording;
        }
    }, {
        key: "_isCurrentElementNotDisplayed",
        value: function _isCurrentElementNotDisplayed() {
            return this._getCurrentElement().style("display") === "none";
        }
    }, {
        key: "_getCurrentElement",
        value: function _getCurrentElement() {
            return this.getTarget(this.keyboardNavigationCurrentElement, false);
        }
    }, {
        key: "readCurrentElement",
        value: function readCurrentElement() {
            this.readElement(this.keyboardNavigationCurrentElement);
        }
    }, {
        key: "readElement",
        value: function readElement(element) {
            throw new Error("readElement method is not implemented");
        }
    }, {
        key: "_speakRecordingButtonTTS",
        value: function _speakRecordingButtonTTS($element) {
            var textVoiceObject = [];

            this._pushMessageToTextVoiceObjectWithLanguageFromLesson(textVoiceObject, this.speechTexts.RecordingButton);

            if (this._isAddonDisabled()) {
                this._pushDisabledMessageToTextVoiceObject(textVoiceObject);
            }

            this._speak(textVoiceObject);
        }
    }, {
        key: "_speakPlayButtonTTS",
        value: function _speakPlayButtonTTS($element) {
            var textVoiceObject = [];

            this._pushMessageToTextVoiceObjectWithLanguageFromLesson(textVoiceObject, this.speechTexts.PlayButton);

            if (this._isAddonDisabled()) {
                this._pushDisabledMessageToTextVoiceObject(textVoiceObject);
            }

            this._speak(textVoiceObject);
        }
    }, {
        key: "onStartRecording",
        value: function onStartRecording(callbackFunction) {
            this._isRecording = true;
            this._speakStartRecordingTTS(callbackFunction);
        }
    }, {
        key: "onStartRecordingWhenSoundEffect",
        value: function onStartRecordingWhenSoundEffect() {
            this._isRecording = true;
        }
    }, {
        key: "_speakStartRecordingTTS",
        value: function _speakStartRecordingTTS(callbackFunction) {
            var textVoiceObject = [];

            this._pushMessageToTextVoiceObjectWithLanguageFromLesson(textVoiceObject, this.speechTexts.StartRecording);

            this._speakAndExecuteCallback(textVoiceObject, callbackFunction);
        }
    }, {
        key: "onStopRecording",
        value: function onStopRecording() {
            this._isRecording = false;
            this._speakStopRecordingTTS();
        }
    }, {
        key: "onStopRecordingWhenSoundEffect",
        value: function onStopRecordingWhenSoundEffect() {
            this._isRecording = false;
        }
    }, {
        key: "_speakStopRecordingTTS",
        value: function _speakStopRecordingTTS() {
            var textVoiceObject = [];

            this._pushMessageToTextVoiceObjectWithLanguageFromLesson(textVoiceObject, this.speechTexts.StopRecording);

            this._speak(textVoiceObject);
        }
    }, {
        key: "_pushDisabledMessageToTextVoiceObject",
        value: function _pushDisabledMessageToTextVoiceObject(textVoiceObject) {
            this._pushMessageToTextVoiceObjectWithLanguageFromLesson(textVoiceObject, this.speechTexts.Disabled);
        }
    }, {
        key: "_pushMessageToTextVoiceObjectWithLanguageFromLesson",
        value: function _pushMessageToTextVoiceObjectWithLanguageFromLesson(textVoiceObject, message) {
            this._pushMessageToTextVoiceObject(textVoiceObject, message, false);
        }
    }, {
        key: "_pushMessageToTextVoiceObjectWithLanguageFromPresenter",
        value: function _pushMessageToTextVoiceObjectWithLanguageFromPresenter(textVoiceObject, message) {
            this._pushMessageToTextVoiceObject(textVoiceObject, message, true);
        }
    }, {
        key: "_pushMessageToTextVoiceObject",
        value: function _pushMessageToTextVoiceObject(textVoiceObject, message) {
            var usePresenterLangTag = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

            if (usePresenterLangTag) {
                textVoiceObject.push(window.TTSUtils.getTextVoiceObject(message, this._langTag));
            } else {
                textVoiceObject.push(window.TTSUtils.getTextVoiceObject(message));
            }
        }
    }]);

    return BaseKeyboardController;
}(KeyboardController);

/***/ }),
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

var _MediaRecorder = __webpack_require__(17);

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

    presenter.isEmpty = function isEmpty() {
        return presenter.mediaRecorder.isEmpty();
    };

    presenter.getMP3File = function getMP3File() {
        return presenter.mediaRecorder.getMP3File();
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
        presenter.mediaRecorder.stopPlaying();
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
        if (!presenter.mediaRecorder.model.enableInErrorCheckingMode) {
            presenter.mediaRecorder.deactivate();
        }
    };

    presenter.setWorkMode = function setWorkMode() {
        presenter.mediaRecorder.activate();
    };

    presenter.setWCAGStatus = function (isWCAGOn) {
        presenter.mediaRecorder.setWCAGStatus(isWCAGOn);
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

    presenter.keyboardController = function (keycode, isShiftKeyDown, event) {
        presenter.mediaRecorder.keyboardControllerObject.handle(keycode, isShiftKeyDown, event);
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
        if (event.target === presenter.view) {
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

    presenter._internalUpgradeModel = function (model) {
        return this.mediaRecorder._upgradeModel(model);
    };

    function handleDestroyEvent(view) {
        view.addEventListener('DOMNodeRemoved', presenter.destroy);
    }

    return presenter;
}

window.AddonMedia_Recorder_create = AddonMedia_Recorder_create;

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MediaRecorder = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _validateModel = __webpack_require__(18);

var _ActivationState = __webpack_require__(20);

var _MediaState = __webpack_require__(21);

var _Errors = __webpack_require__(22);

var _PlayButton = __webpack_require__(23);

var _RecordButton = __webpack_require__(3);

var _ResetButton = __webpack_require__(24);

var _ResetDialog = __webpack_require__(25);

var _DownloadButton = __webpack_require__(26);

var _Timer = __webpack_require__(27);

var _ProgressBar = __webpack_require__(28);

var _AddonState = __webpack_require__(29);

var _RecordingTimeLimiter = __webpack_require__(30);

var _SoundIntensity = __webpack_require__(5);

var _DottedSoundIntensity = __webpack_require__(31);

var _MediaAnalyserService = __webpack_require__(32);

var _AudioLoader = __webpack_require__(34);

var _SoundEffect = __webpack_require__(36);

var _RecordButtonSoundEffect = __webpack_require__(37);

var _AddonViewService = __webpack_require__(38);

var _AudioResourcesProvider = __webpack_require__(39);

var _AudioRecorder = __webpack_require__(41);

var _AudioPlayer = __webpack_require__(44);

var _DefaultRecordingPlayButton = __webpack_require__(47);

var _DefaultKeyboardController = __webpack_require__(48);

var _ExtendedKeyboardController = __webpack_require__(49);

var _CssClasses = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MediaRecorder = exports.MediaRecorder = function () {
    function MediaRecorder() {
        _classCallCheck(this, MediaRecorder);

        this.enableAnalyser = true;
        this.isMlibro = false;
        this.isWCAGOn = false;
        this.keyboardControllerObject = null;
    }

    _createClass(MediaRecorder, [{
        key: "run",
        value: function run(view, model) {
            var upgradedModel = this._upgradeModel(model);
            var validatedModel = (0, _validateModel.validateModel)(upgradedModel);

            var isSafari = DevicesUtils.getBrowserVersion().toLowerCase().indexOf("safari") > -1;
            if (isSafari) {
                this.enableAnalyser = false;
            }

            if (this._isBrowserNotSupported()) {
                this._showBrowserError(view);
            } else if (validatedModel.isValid) this._runAddon(view, validatedModel.value);else this._showError(view, validatedModel);

            this._executeNotification(JSON.stringify({ type: "platform", target: this.model.ID }));
            this._buildKeyboardController();
            this.keyboardControllerObject.setSpeechTexts(upgradedModel['speechTexts']);
            this.recordButton.setKeyboardController(this.keyboardControllerObject);
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

            var context = playerController.getContextMetadata();
            this.isMlibro = false;
            if (context != null && "ismLibro" in context) {
                this.isMlibro = context["ismLibro"];
            }
        }
    }, {
        key: "isEmpty",
        value: function isEmpty() {
            return this.addonState.isEmpty();
        }
    }, {
        key: "getMP3File",
        value: function getMP3File() {
            return this.addonState.getMP3File();
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
                if (_this.model.extendedMode) {
                    _this.setEMRecordedStateView();
                }
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
            this.downloadButton = null;
            this.resetButton = null;
            this.progressBar = null;
            this.stopRecordingSoundEffect = null;
            this.startRecordingSoundEffect = null;
            this.loader = null;
            this.addonViewService = null;
            this.mediaAnalyserService = null;
            this.addonState = null;
            this.mediaState = null;
            this.activationState = null;
            this.extendedModeButtonList = null;

            this.playerController = null;
            this.keyboardControllerObject = null;
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
            if (this.model.isResetRemovesRecording) {
                this.resetRecording();
            }
            this.activate();
            this.setVisibility(this.model["Is Visible"]);
            this._setEnableState(!this.model.isDisabled);
        }
    }, {
        key: "resetRecording",
        value: function resetRecording() {
            this.recordButton.reset();
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
            if (this.model.extendedMode) {
                this._prepareExtendedModeView();
                this.setEMDefaultStateView();
            }
            if (this.model.disableRecording) {
                this._hidePlayAndTimerWidgets();
            }
            this.mediaState = new _MediaState.MediaState();
            this.activationState = new _ActivationState.ActivationState();
            this.addonState = new _AddonState.AddonState();
        }
    }, {
        key: "_loadViewHandlers",
        value: function _loadViewHandlers(view) {
            return {
                $wrapperView: $(view).find("." + _CssClasses.CSS_CLASSES.WRAPPER),
                $playerView: $(view).find("." + _CssClasses.CSS_CLASSES.PLAYER_WRAPPER),
                $loaderView: $(view).find("." + _CssClasses.CSS_CLASSES.PLAYER_LOADER),
                $defaultRecordingPlayButtonView: $(view).find("." + _CssClasses.CSS_CLASSES.DEFAULT_RECORDING_PLAY_BUTTON),
                $recordButtonView: $(view).find("." + _CssClasses.CSS_CLASSES.RECORDING_BUTTON),
                $playButtonView: $(view).find("." + _CssClasses.CSS_CLASSES.PLAY_BUTTON),
                $timerView: $(view).find("." + _CssClasses.CSS_CLASSES.TIMER),
                $soundIntensityView: $(view).find("." + _CssClasses.CSS_CLASSES.SOUND_INTENSITY),
                $dottedSoundIntensityView: $(view).find("." + _CssClasses.CSS_CLASSES.DOTTED_SOUND_INTENSITY),
                $progressBarWrapperView: $(view).find("." + _CssClasses.CSS_CLASSES.PROGRESS_BAR),
                $progressBarSliderView: $(view).find("." + _CssClasses.CSS_CLASSES.PROGRESS_BAR_SLIDER),
                $resetButtonView: $(view).find("." + _CssClasses.CSS_CLASSES.RESET_BUTTON),
                $downloadButtonView: $(view).find("." + _CssClasses.CSS_CLASSES.DOWNLOAD_BUTTON),
                $resetDialogView: $(view).find("." + _CssClasses.CSS_CLASSES.RESET_DIALOG)
            };
        }
    }, {
        key: "_prepareExtendedModeView",
        value: function _prepareExtendedModeView() {
            this.viewHandlers.$wrapperView.addClass(_CssClasses.CSS_CLASSES.EXTENDED_MODE);
            this.viewHandlers.$timerView.insertBefore(this.viewHandlers.$playButtonView);
        }
    }, {
        key: "_hidePlayAndTimerWidgets",
        value: function _hidePlayAndTimerWidgets() {
            this.viewHandlers.$playButtonView.hide();
            this.viewHandlers.$defaultRecordingPlayButtonView.hide();
            this.viewHandlers.$timerView.hide();
        }
    }, {
        key: "_loadMediaElements",
        value: function _loadMediaElements() {
            this.recorder = new _AudioRecorder.AudioRecorder();
            this.player = new _AudioPlayer.AudioPlayer(this.viewHandlers.$playerView, this.isMlibro);
            this.player.setIsMlibro(this.isMlibro);
            this.defaultRecordingPlayer = new _AudioPlayer.AudioPlayer(this.viewHandlers.$playerView, this.isMlibro);
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
            this.eventBus = eventBus;
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

            this.extendedModeButtonList = [];
            if (this.model.extendedMode) {
                this.downloadButton = new _DownloadButton.DownloadButton({
                    $view: this.viewHandlers.$downloadButtonView,
                    addonState: this.addonState
                });
                this.resetButton = new _ResetButton.ResetButton(this.viewHandlers.$resetButtonView);
                this.resetDialog = new _ResetDialog.ResetDialog(this.viewHandlers.$resetDialogView, this.model.resetDialogLabels);
                this.progressBar = new _ProgressBar.ProgressBar(this.viewHandlers.$progressBarWrapperView);
                this.extendedModeButtonList.push(this.downloadButton);
                this.extendedModeButtonList.push(this.resetButton);
            }

            this.loader = new _AudioLoader.AudioLoader(this.viewHandlers.$loaderView);

            this.timer = new _Timer.Timer(this.viewHandlers.$timerView);
            if (this.model.extendedMode) {
                this.soundIntensity = new _DottedSoundIntensity.DottedSoundIntensity(this.viewHandlers.$dottedSoundIntensityView);
                this.viewHandlers.$soundIntensityView.css('display', 'none');
            } else {
                this.soundIntensity = new _SoundIntensity.SoundIntensity(this.viewHandlers.$soundIntensityView);
                this.viewHandlers.$dottedSoundIntensityView.css('display', 'none');
            }
            if (this.eventBus && this.model.enableIntensityChangeEvents) {
                this.soundIntensity.setEventBus(this.eventBus, this.model.ID);
            }
            this.soundIntensity.setEnableAnalyser(this.enableAnalyser);

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
        key: "setEMDefaultStateView",
        value: function setEMDefaultStateView() {
            this.viewHandlers.$defaultRecordingPlayButtonView.css('display', 'none');
            this.viewHandlers.$recordButtonView.css('display', '');
            if (this.model.disableRecording) {
                this.viewHandlers.$timerView.css('display', 'none');
            } else {
                this.viewHandlers.$timerView.css('display', '');
            }
            if (this.soundIntensity) {
                this.soundIntensity.show();
            }
            this.viewHandlers.$playButtonView.css('display', 'none');
            this.viewHandlers.$progressBarWrapperView.css('display', 'none');
            this.viewHandlers.$progressBarWrapperView.css('visibility', 'hidden');
            this.viewHandlers.$resetButtonView.css('display', 'none');
            this.viewHandlers.$downloadButtonView.css('display', 'none');
        }
    }, {
        key: "setEMRecordedStateView",
        value: function setEMRecordedStateView() {
            this.viewHandlers.$defaultRecordingPlayButtonView.css('display', 'none');
            this.viewHandlers.$recordButtonView.css('display', 'none');
            this.viewHandlers.$timerView.css('display', '');
            if (this.soundIntensity) {
                this.soundIntensity.hide();
            }
            this.viewHandlers.$playButtonView.css('display', '');
            this.viewHandlers.$progressBarWrapperView.css('display', 'block');
            this.viewHandlers.$progressBarWrapperView.css('visibility', 'visible');
            this.viewHandlers.$resetButtonView.css('display', 'block');
            this.viewHandlers.$downloadButtonView.css('display', 'block');
        }
    }, {
        key: "setEMPlayingStateView",
        value: function setEMPlayingStateView() {
            this.viewHandlers.$defaultRecordingPlayButtonView.css('display', 'none');
            this.viewHandlers.$recordButtonView.css('display', 'none');
            this.viewHandlers.$timerView.css('display', '');
            if (this.soundIntensity) {
                this.soundIntensity.hide();
            }
            this.viewHandlers.$playButtonView.css('display', '');
            this.viewHandlers.$progressBarWrapperView.css('display', 'block');
            this.viewHandlers.$progressBarWrapperView.css('visibility', 'visible');
            this.viewHandlers.$resetButtonView.css('display', 'block');
            this.viewHandlers.$downloadButtonView.css('display', 'block');
        }
    }, {
        key: "_loadLogic",
        value: function _loadLogic() {
            var _this2 = this;

            this.recordButton.onStartRecording = function () {
                _this2.mediaState.setBlocked();
                if (_this2.platform === 'mlibro') {
                    _this2._handleMlibroStartRecording();
                } else {
                    _this2.resourcesProvider.getMediaResources().then(function (stream) {
                        var isSafari = window.DevicesUtils.getBrowserVersion().toLowerCase().indexOf("safari") > -1;
                        if (isSafari) {
                            _this2.mediaState.setBlockedSafari();
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
                    if (_this2.enableAnalyser) {
                        _this2.mediaAnalyserService.closeAnalyzing();
                    }
                    if (!_this2.model.disableRecording) {
                        _this2.recorder.stopRecording().then(function (blob) {
                            _this2.addonState.setRecordingBlob(blob);
                            var recording = URL.createObjectURL(blob);
                            _this2.player.reset();
                            _this2.player.setRecording(recording);
                        });
                    }
                    _this2.resourcesProvider.destroy();
                }
                if (_this2.model.extendedMode) {
                    if (_this2.model.disableRecording) {
                        _this2.setEMDefaultStateView();
                    } else {
                        _this2.setEMRecordedStateView();
                    }
                }
                if (_this2.model.disableRecording) {
                    _this2.mediaState.setLoaded();
                }
            };

            this.recordButton.onReset = function () {
                _this2.mediaState.setLoading();
                _this2.timer.stopCountdown();
                _this2.recordingTimeLimiter.stopCountdown();
                _this2.soundIntensity.stopAnalyzing();
                if (_this2.enableAnalyser) {
                    _this2.mediaAnalyserService.closeAnalyzing();
                }
                _this2.recorder.stopRecording();
                _this2.resourcesProvider.destroy();
            };

            if (this.model.extendedMode) {
                this.resetButton.onReset = function () {
                    _this2.resetDialog.open();
                    _this2.keyboardControllerObject.setElements(_this2._getElementsForResetDialogKeyboardNavigation());
                    if (_this2.keyboardControllerObject.keyboardNavigationActive) {
                        _this2.keyboardControllerObject.markDialogTextAndReadResetDialogTTS();
                    }
                };
                this.resetDialog.onConfirm = function () {
                    _this2.timer.startCountdown();
                    _this2.resetRecording();
                    if (_this2.model.extendedMode) {
                        _this2.setEMDefaultStateView();
                    }
                    _this2.progressBar.setProgress(0.0);
                    _this2.keyboardControllerObject.setElements(_this2._getElementsForExtendedKeyboardNavigation());
                    if (_this2.keyboardControllerObject.keyboardNavigationActive) {
                        _this2.keyboardControllerObject.markRecordingButton();
                        _this2.keyboardControllerObject.readCurrentElement();
                    }
                };
                this.resetDialog.onDeny = function () {
                    _this2.keyboardControllerObject.setElements(_this2._getElementsForExtendedKeyboardNavigation());
                    if (_this2.keyboardControllerObject.keyboardNavigationActive) {
                        _this2.keyboardControllerObject.markResetButton();
                        _this2.keyboardControllerObject.readCurrentElement();
                    }
                };

                this.progressBar.onStartDragging = function () {
                    if (_this2.mediaState.isPlaying()) {
                        _this2.player.pausePlaying();
                        _this2.playButton.forceClick();
                    }
                };

                this.progressBar.onStopDragging = function (progress) {
                    _this2.player.setProgress(progress);
                };
            }

            this.playButton.onStartPlaying = function () {
                _this2.mediaState.setPlaying();
                if (_this2.enableAnalyser) {
                    _this2.player.startPlaying().then(function (htmlMediaElement) {
                        return _this2.mediaAnalyserService.createAnalyserFromElement(htmlMediaElement).then(function (analyser) {
                            return _this2.soundIntensity.startAnalyzing(analyser);
                        });
                    });
                } else {
                    _this2.player.startPlaying();
                }
            };

            this.playButton.onStopPlaying = function () {
                _this2.mediaState.setLoaded();
                if (_this2.model.extendedMode) {
                    _this2.player.pausePlaying();
                } else {
                    _this2.player.stopPlaying();
                }
                _this2.soundIntensity.stopAnalyzing();
                if (_this2.enableAnalyser) {
                    _this2.mediaAnalyserService.closeAnalyzing();
                }
            };

            this.defaultRecordingPlayButton.onStartPlaying = function () {
                _this2.mediaState.setPlayingDefaultRecording();
                _this2.timer.setDuration(_this2.defaultRecordingPlayer.duration);
                _this2.timer.startCountdown();
                if (_this2.enableAnalyser) {
                    _this2.defaultRecordingPlayer.startPlaying().then(function (htmlMediaElement) {
                        return _this2.mediaAnalyserService.createAnalyserFromElement(htmlMediaElement).then(function (analyser) {
                            return _this2.soundIntensity.startAnalyzing(analyser);
                        });
                    });
                } else {
                    _this2.defaultRecordingPlayer.startPlaying();
                }
            };

            this.defaultRecordingPlayButton.onStopPlaying = function () {
                if (_this2.player.hasRecording) {
                    _this2.mediaState.setLoaded();
                    _this2.timer.setDuration(_this2.player.duration);
                } else {
                    _this2.mediaState.setLoadedDefaultRecording();
                }

                _this2.defaultRecordingPlayer.stopPlaying();
                _this2.timer.stopCountdown();
                _this2.soundIntensity.stopAnalyzing();
                if (_this2.enableAnalyser) {
                    _this2.mediaAnalyserService.closeAnalyzing();
                }
            };

            this.player.onStartLoading = function () {
                _this2.mediaState.setLoading();
                _this2.loader.show();
            };

            this.player.onEndLoading = function () {
                if (_this2.mediaState.isLoading()) {
                    _this2.mediaState.setLoaded();
                    _this2.loader.hide();
                }
            };

            var player = this.player;
            var timer = this.timer;
            var progressBar = this.progressBar;
            function timeUpdateCallback(event) {
                var currentTime = player.getCurrentTime();
                timer.setTime(currentTime);
                if (progressBar) {
                    player._getDuration().then(function (duration) {
                        progressBar.setProgress(currentTime / duration);
                    });
                }
            }

            this.player.onDurationChange = function (duration) {
                return _this2.timer.setDuration(duration);
            };
            this.player.onTimeUpdate = function (event) {
                return timeUpdateCallback(event);
            };
            this.player.onEndPlaying = function () {
                return _this2.playButton.forceClick();
            };

            this.defaultRecordingPlayer.onStartLoading = function () {
                _this2.mediaState.setLoading();
                _this2.loader.show();
            };

            this.defaultRecordingPlayer.onEndLoading = function () {
                if (_this2.player.hasRecording) {
                    _this2.mediaState.setLoaded();
                } else {
                    _this2.mediaState.setLoadedDefaultRecording();
                }
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
            if (!this.model.disableRecording) {
                this.recorder.startRecording(stream);
                this.timer.reset();
                this.timer.startDecrementalCountdown(this.recordingTimeLimiter.maxTime);
                this.recordingTimeLimiter.startCountdown();
            }
            if (this.enableAnalyser) {
                this.mediaAnalyserService.createAnalyserFromStream(stream).then(function (analyser) {
                    return _this3.soundIntensity.startAnalyzing(analyser);
                });
            }
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
            if (!this.model.disableRecording) {
                this.playButton.activate();
            }
            this.defaultRecordingPlayButton.activate();
            if (this.model.extendedMode) {
                for (var i = 0; i < this.extendedModeButtonList.length; i++) {
                    this.extendedModeButtonList[i].activate();
                }
            }
        }
    }, {
        key: "_deactivateButtons",
        value: function _deactivateButtons() {
            this.recordButton.deactivate();
            this.playButton.deactivate();
            this.defaultRecordingPlayButton.deactivate();
            if (this.model.extendedMode) {
                for (var i = 0; i < this.extendedModeButtonList.length; i++) {
                    this.extendedModeButtonList[i].deactivate();
                }
            }
        }
    }, {
        key: "_stopActions",
        value: function _stopActions() {
            if (this.mediaState.isRecording()) {
                this.recordButton.forceClick();
            }
            if (this.mediaState.isPlaying()) {
                this.playButton.forceClick();
            }
            if (this.mediaState.isPlayingDefaultRecording()) {
                this.defaultRecordingPlayButton.forceClick();
            }
            if (this.mediaState.isLoaded()) {
                this.timer.setTime(0);
            }
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
                AudioPlayer: _AudioPlayer.AudioPlayer,
                DownloadButton: _DownloadButton.DownloadButton,
                SoundIntensity: _SoundIntensity.SoundIntensity
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
            var $wrapper = $(view).find("." + _CssClasses.CSS_CLASSES.WRAPPER);
            $wrapper.addClass(_CssClasses.CSS_CLASSES.WRAPPER_BROWSER_NOT_SUPPORTED);
            $wrapper.text(_Errors.Errors["not_supported_browser"] + window.DevicesUtils.getBrowserVersion());
        }
    }, {
        key: "_updatePreview",
        value: function _updatePreview(view, validatedModel) {
            var valid_model = validatedModel.value;
            var timerViewHandler = $(view).find("." + _CssClasses.CSS_CLASSES.TIMER);
            var defaultButtonViewHandler = $(view).find("." + _CssClasses.CSS_CLASSES.DEFAULT_RECORDING_PLAY_BUTTON);
            var $wrapperViewHandler = $(view).find("." + _CssClasses.CSS_CLASSES.WRAPPER);
            var intensityView = $(view).find("." + _CssClasses.CSS_CLASSES.SOUND_INTENSITY);
            var dottedSoundIntensityView = $(view).find("." + _CssClasses.CSS_CLASSES.DOTTED_SOUND_INTENSITY);
            var playButton = $(view).find("." + _CssClasses.CSS_CLASSES.PLAY_BUTTON);

            if (valid_model.extendedMode) {
                intensityView.css('display', 'none');
                playButton.css('display', 'none');
                dottedSoundIntensityView.css('display', '');
                defaultButtonViewHandler.hide();
                timerViewHandler.text('00:00');
                $wrapperViewHandler.addClass(_CssClasses.CSS_CLASSES.EXTENDED_MODE);
            } else {
                intensityView.css('display', '');
                dottedSoundIntensityView.css('display', 'none');

                if (valid_model.isShowedTimer == false) timerViewHandler.hide();else timerViewHandler.show();

                if (!valid_model.isShowedDefaultRecordingButton) defaultButtonViewHandler.hide();else defaultButtonViewHandler.show();

                if (valid_model.isDisabled) {
                    this.addonViewService = new _AddonViewService.AddonViewService($wrapperViewHandler);
                    this.addonViewService.deactivate();
                }
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
        key: "_loadWebViewMessageListener",
        value: function _loadWebViewMessageListener() {
            var _this4 = this;

            window.addEventListener('message', function (event) {
                try {
                    var eventData = JSON.parse(event.data);
                    var isTypePlatform = eventData.type ? eventData.type.toLowerCase() === 'platform' : false;
                    var isValueMlibro = eventData.value ? eventData.value.toLowerCase().includes('mlibro') : false;
                    if (isTypePlatform && isValueMlibro) _this4._handleWebViewBehaviour();
                } catch (e) {
                    if (e instanceof SyntaxError) {
                        return;
                    }
                }
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
        key: "_executeNotification",
        value: function _executeNotification(notifyInput) {
            try {
                if (mLibroChromium != undefined) {
                    mLibroChromium.notify(notifyInput);
                } else {
                    window.external.notify(notifyInput);
                }
            } catch (e) {
                // silent message
                // can't use a conditional expression
                // https://social.msdn.microsoft.com/Forums/en-US/1a8b3295-cd4d-4916-9cf6-666de1d3e26c/windowexternalnotify-always-undefined?forum=winappswithcsharp
            }
        }
    }, {
        key: "_handleMlibroStartRecording",
        value: function _handleMlibroStartRecording() {
            this.mediaState.setRecording();
            this.timer.reset();
            this.timer.startDecrementalCountdown(this.recordingTimeLimiter.maxTime);
            this.recordingTimeLimiter.startCountdown();
            this._executeNotification(JSON.stringify({ type: "mediaRecord", target: this.model.ID }));
        }
    }, {
        key: "_handleMlibroStopRecording",
        value: function _handleMlibroStopRecording() {
            this.mediaState.setLoading();
            this.timer.stopCountdown();
            this.recordingTimeLimiter.stopCountdown();
            this._executeNotification(JSON.stringify({ type: "mediaStop", target: this.model.ID }));
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
            upgradedModel = this._upgradeEnableInErrorCheckigMode(upgradedModel);
            upgradedModel = this._upgradeExtendedMode(upgradedModel);
            upgradedModel = this._upgradeResetDialog(upgradedModel);
            upgradedModel = this._upgradeDisableRecording(upgradedModel);
            upgradedModel = this._upgradeEnableIntensityChangeEvents(upgradedModel);
            upgradedModel = this._upgradeLangTag(upgradedModel);
            upgradedModel = this._upgradeSpeechTexts(upgradedModel);
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
    }, {
        key: "_upgradeEnableInErrorCheckigMode",
        value: function _upgradeEnableInErrorCheckigMode(model) {
            var upgradedModel = {};
            $.extend(true, upgradedModel, model);

            if (!upgradedModel["enableInErrorCheckingMode"]) {
                upgradedModel["enableInErrorCheckingMode"] = "False";
            }

            return upgradedModel;
        }
    }, {
        key: "_upgradeExtendedMode",
        value: function _upgradeExtendedMode(model) {
            var upgradedModel = {};
            $.extend(true, upgradedModel, model);

            if (!upgradedModel["extendedMode"]) {
                upgradedModel["extendedMode"] = "False";
            }

            return upgradedModel;
        }
    }, {
        key: "_upgradeResetDialog",
        value: function _upgradeResetDialog(model) {
            var upgradedModel = {};
            $.extend(true, upgradedModel, model);

            if (!upgradedModel["resetDialogLabels"]) {
                upgradedModel["resetDialogLabels"] = {
                    "resetDialogText": { "resetDialogLabel": "" },
                    "resetDialogConfirm": { "resetDialogLabel": "" },
                    "resetDialogDeny": { "resetDialogLabel": "" }
                };
            }

            return upgradedModel;
        }
    }, {
        key: "_upgradeDisableRecording",
        value: function _upgradeDisableRecording(model) {
            var upgradedModel = {};
            $.extend(true, upgradedModel, model);

            if (!upgradedModel["disableRecording"]) {
                upgradedModel["disableRecording"] = "False";
            }

            return upgradedModel;
        }
    }, {
        key: "_upgradeEnableIntensityChangeEvents",
        value: function _upgradeEnableIntensityChangeEvents(model) {
            var upgradedModel = {};
            $.extend(true, upgradedModel, model);

            if (!upgradedModel["enableIntensityChangeEvents"]) {
                upgradedModel["enableIntensityChangeEvents"] = "False";
            }

            return upgradedModel;
        }
    }, {
        key: "_upgradeLangTag",
        value: function _upgradeLangTag(model) {
            var upgradedModel = {};
            $.extend(true, upgradedModel, model);

            if (!upgradedModel["langAttribute"]) {
                upgradedModel["langAttribute"] = "";
            }

            return upgradedModel;
        }
    }, {
        key: "_upgradeSpeechTexts",
        value: function _upgradeSpeechTexts(model) {
            var upgradedModel = {};
            $.extend(true, upgradedModel, model);

            if (!upgradedModel["speechTexts"]) {
                upgradedModel["speechTexts"] = {};
            }
            if (!upgradedModel["speechTexts"]["DefaultRecordingPlayButton"]) {
                upgradedModel["speechTexts"]["DefaultRecordingPlayButton"] = { DefaultRecordingPlayButton: "" };
            }
            if (!upgradedModel["speechTexts"]["RecordingButton"]) {
                upgradedModel["speechTexts"]["RecordingButton"] = { RecordingButton: "" };
            }
            if (!upgradedModel["speechTexts"]["PlayButton"]) {
                upgradedModel["speechTexts"]["PlayButton"] = { PlayButton: "" };
            }
            if (!upgradedModel["speechTexts"]["ResetButton"]) {
                upgradedModel["speechTexts"]["ResetButton"] = { ResetButton: "" };
            }
            if (!upgradedModel["speechTexts"]["DownloadButton"]) {
                upgradedModel["speechTexts"]["DownloadButton"] = { DownloadButton: "" };
            }
            if (!upgradedModel["speechTexts"]["ResetDialog"]) {
                upgradedModel["speechTexts"]["ResetDialog"] = { ResetDialog: "" };
            }
            if (!upgradedModel["speechTexts"]["StartRecording"]) {
                upgradedModel["speechTexts"]["StartRecording"] = { StartRecording: "" };
            }
            if (!upgradedModel["speechTexts"]["StopRecording"]) {
                upgradedModel["speechTexts"]["StopRecording"] = { StopRecording: "" };
            }
            if (!upgradedModel["speechTexts"]["Disabled"]) {
                upgradedModel["speechTexts"]["Disabled"] = { Disabled: "" };
            }

            return upgradedModel;
        }
    }, {
        key: "setWCAGStatus",
        value: function setWCAGStatus(isWCAGOn) {
            this.isWCAGOn = isWCAGOn;
        }
    }, {
        key: "_buildKeyboardController",
        value: function _buildKeyboardController() {
            var columnsCount = 1;
            var model = this.model;
            var mediaState = this.mediaState;
            var activationState = this.activationState;
            var speak = this._speak.bind(this);
            var speakAndExecuteCallback = this._speakAndExecuteCallback.bind(this);

            if (this.model.extendedMode) {
                this.keyboardControllerObject = new _ExtendedKeyboardController.ExtendedKeyboardController(this._getElementsForExtendedKeyboardNavigation(), columnsCount, model, mediaState, activationState, speak, speakAndExecuteCallback);
            } else {
                this.keyboardControllerObject = new _DefaultKeyboardController.DefaultKeyboardController(this._getElementsForDefaultKeyboardNavigation(), columnsCount, model, mediaState, activationState, speak, speakAndExecuteCallback);
            }
        }
    }, {
        key: "getKeyboardController",
        value: function getKeyboardController() {
            return this.keyboardControllerObject;
        }
    }, {
        key: "_getElementsForDefaultKeyboardNavigation",
        value: function _getElementsForDefaultKeyboardNavigation() {
            return $(this.view).find("\n            ." + _CssClasses.CSS_CLASSES.DEFAULT_RECORDING_PLAY_BUTTON + ",\n            ." + _CssClasses.CSS_CLASSES.RECORDING_BUTTON + ",\n            ." + _CssClasses.CSS_CLASSES.PLAY_BUTTON + "\n        ");
        }
    }, {
        key: "_getElementsForExtendedKeyboardNavigation",
        value: function _getElementsForExtendedKeyboardNavigation() {
            return $(this.view).find("\n            ." + _CssClasses.CSS_CLASSES.RECORDING_BUTTON + ",\n            ." + _CssClasses.CSS_CLASSES.PLAY_BUTTON + ",\n            ." + _CssClasses.CSS_CLASSES.RESET_BUTTON + ",\n            ." + _CssClasses.CSS_CLASSES.DOWNLOAD_BUTTON + "\n        ");
        }
    }, {
        key: "_getElementsForResetDialogKeyboardNavigation",
        value: function _getElementsForResetDialogKeyboardNavigation() {
            return $(this.view).find("\n            ." + _CssClasses.CSS_CLASSES.DIALOG_TEXT + ",\n            ." + _CssClasses.CSS_CLASSES.CONFIRM_BUTTON + ",\n            ." + _CssClasses.CSS_CLASSES.DENY_BUTTON + "\n        ");
        }
    }, {
        key: "_speak",
        value: function _speak(data) {
            var tts = this.keyboardControllerObject.getTextToSpeechOrNull(this.playerController);
            if (tts && this.isWCAGOn) {
                tts.speak(data);
            }
        }
    }, {
        key: "_speakAndExecuteCallback",
        value: function _speakAndExecuteCallback(data, callbackFunction) {
            var tts = this.keyboardControllerObject.getTextToSpeechOrNull(this.playerController);
            if (tts && this.isWCAGOn) {
                tts.speakWithCallback(data, callbackFunction);
            } else {
                callbackFunction();
            }
        }
    }]);

    return MediaRecorder;
}();

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.validateModel = validateModel;

var _DefaultValues = __webpack_require__(19);

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
    }), ModelValidators.Boolean("isResetRemovesRecording"), ModelValidators.Boolean("isShowedTimer"), ModelValidators.Boolean("isShowedDefaultRecordingButton"), ModelValidators.Boolean("enableInErrorCheckingMode"), ModelValidators.Boolean("isDisabled"), ModelValidators.Boolean("extendedMode"), ModelValidators.Boolean("disableRecording"), ModelValidators.Boolean("enableIntensityChangeEvents"), ModelValidators.StaticList('resetDialogLabels', {
        'resetDialogText': [ModelValidators.String('resetDialogLabel', { default: 'Are you sure you want to reset the recording?' })],
        'resetDialogConfirm': [ModelValidators.String('resetDialogLabel', { default: 'Yes' })],
        'resetDialogDeny': [ModelValidators.String('resetDialogLabel', { default: 'No' })]
    }), ModelValidators.String("langAttribute", {
        trim: true,
        default: ""
    })]);
}

/***/ }),
/* 19 */
/***/ (function(module, exports) {

Object.defineProperty(exports, "__esModule", {
    value: true
});
var DefaultValues = exports.DefaultValues = {
    MAX_TIME: 30 * 60,
    DEFAULT_MAX_TIME: 10
};

/***/ }),
/* 20 */
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
/* 21 */
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
/* 22 */
/***/ (function(module, exports) {

Object.defineProperty(exports, "__esModule", {
    value: true
});
var Errors = exports.Errors = {
    "maxTime_INT02": "Time value contains non numerical characters",
    "maxTime_INT03": "Recording can not take more than 30 minutes",
    "maxTime_INT04": "Time in seconds cannot be negative value",
    "type_EV01": "Selected type is not supported",
    "not_supported_browser": "Your browser is not supported: ",
    "safari_select_recording_button_again": "Please click start recording button again. First time we tried to access your microphone. Now we will record it."
};

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.PlayButton = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _Button2 = __webpack_require__(1);

var _CssClasses = __webpack_require__(0);

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
            this.$view.addClass(_CssClasses.CSS_CLASSES.SELECTED);
            this.onStartPlayingCallback();
        }
    }, {
        key: "_stopPlaying",
        value: function _stopPlaying() {
            this.$view.removeClass(_CssClasses.CSS_CLASSES.SELECTED);
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
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ResetButton = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Button2 = __webpack_require__(1);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ResetButton = exports.ResetButton = function (_Button) {
    _inherits(ResetButton, _Button);

    function ResetButton($view) {
        _classCallCheck(this, ResetButton);

        return _possibleConstructorReturn(this, (ResetButton.__proto__ || Object.getPrototypeOf(ResetButton)).call(this, $view));
    }

    _createClass(ResetButton, [{
        key: "_eventHandler",
        value: function _eventHandler() {
            if (this.onResetCallback != null) {
                this.onResetCallback();
            }
        }
    }, {
        key: "onReset",
        set: function set(callback) {
            this.onResetCallback = callback;
        }
    }]);

    return ResetButton;
}(_Button2.Button);

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ResetDialog = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _CssClasses = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ResetDialog = exports.ResetDialog = function () {
    function ResetDialog($view, resetDialogLabels) {
        _classCallCheck(this, ResetDialog);

        this.$view = $view;
        this.labels = {
            text: resetDialogLabels['resetDialogText']['resetDialogLabel'],
            confirm: resetDialogLabels['resetDialogConfirm']['resetDialogLabel'],
            deny: resetDialogLabels['resetDialogDeny']['resetDialogLabel']
        };
        this._createView();
    }

    _createClass(ResetDialog, [{
        key: 'open',
        value: function open() {
            this.$view.css('display', 'block');
            this.$view.css('left', '');
            this.$view.css('top', '');
        }
    }, {
        key: 'close',
        value: function close() {
            this.$view.css('display', 'none');
        }
    }, {
        key: '_createView',
        value: function _createView() {
            this.$view.find("." + _CssClasses.CSS_CLASSES.DIALOG_TEXT).text(this.labels.text);
            this.$view.find("." + _CssClasses.CSS_CLASSES.CONFIRM_BUTTON).text(this.labels.confirm);
            this.$view.find("." + _CssClasses.CSS_CLASSES.DENY_BUTTON).text(this.labels.deny);
            this.$view.draggable({});
            var self = this;
            this.$view.find("." + _CssClasses.CSS_CLASSES.CONFIRM_BUTTON).click(function () {
                self.close();
                if (self.onConfirmCallback) self.onConfirmCallback();
            });
            this.$view.find("." + _CssClasses.CSS_CLASSES.DENY_BUTTON).click(function () {
                self.close();
                if (self.onDenyCallback) self.onDenyCallback();
            });
        }
    }, {
        key: 'onConfirm',
        set: function set(callback) {
            this.onConfirmCallback = callback;
        }
    }, {
        key: 'onDeny',
        set: function set(callback) {
            this.onDenyCallback = callback;
        }
    }]);

    return ResetDialog;
}();

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DownloadButton = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Button2 = __webpack_require__(1);

var _BlobService = __webpack_require__(4);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DownloadButton = exports.DownloadButton = function (_Button) {
    _inherits(DownloadButton, _Button);

    function DownloadButton(_ref) {
        var $view = _ref.$view,
            addonState = _ref.addonState;

        _classCallCheck(this, DownloadButton);

        var _this = _possibleConstructorReturn(this, (DownloadButton.__proto__ || Object.getPrototypeOf(DownloadButton)).call(this, $view));

        _this.addonState = addonState;
        return _this;
    }

    _createClass(DownloadButton, [{
        key: "_eventHandler",
        value: function _eventHandler() {
            if (this.addonState.recording) {
                this.downloadRecording();
            }
        }
    }, {
        key: "downloadRecording",
        value: function downloadRecording() {
            var _this2 = this;

            var element = document.createElement("a");
            element.setAttribute("id", "dl");
            element.setAttribute("download", "recording.mp3");
            element.setAttribute("href", "#");

            this.addonState.getRecordingBlob().then(function (blob) {
                File.prototype.arrayBuffer = File.prototype.arrayBuffer || _this2._fixArrayBuffer;
                Blob.prototype.arrayBuffer = Blob.prototype.arrayBuffer || _this2._fixArrayBuffer;

                return blob.arrayBuffer();
            }).then(function (arrayBuffer) {
                window.AudioContext = window.AudioContext || window.webkitAudioContext;
                var context = new AudioContext();
                return context.decodeAudioData(arrayBuffer);
            }).then(function (decodedData) {
                var mp3Blob = _BlobService.BlobService.getMp3BlobFromDecodedData(decodedData);
                return _BlobService.BlobService.serialize(mp3Blob);
            }).then(function (b64Recording) {
                function handleDownloadRecording() {
                    var data = b64Recording;
                    data = data.replace(/^data:audio\/[^;]*/, 'data:application/octet-stream');
                    data = data.replace(/^data:application\/octet-stream/, 'data:application/octet-stream;headers=Content-Disposition%3A%20attachment%3B%20filename=recording.mp3');
                    this.href = data;
                }
                element.onclick = handleDownloadRecording;
                element.click();
            });
        }

        //for some reason there is a bug in some lower Safari versions <14, it cause arrayBuffer() undefined
        //https://gist.github.com/hanayashiki/8dac237671343e7f0b15de617b0051bd

    }, {
        key: "_fixArrayBuffer",
        value: function _fixArrayBuffer() {
            var _this3 = this;

            return new Promise(function (resolve) {
                var fr = new FileReader();
                fr.onload = function () {
                    resolve(fr.result);
                };
                fr.readAsArrayBuffer(_this3);
            });
        }
    }]);

    return DownloadButton;
}(_Button2.Button);

/***/ }),
/* 27 */
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
        this.duration = 0;
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
            if (this.interval != null) {
                clearInterval(this.interval);
                this.interval = null;
            }
            this._clearCurrentTime();
            this._updateText();
        }
    }, {
        key: "setDuration",
        value: function setDuration(duration) {
            this.duration = duration;
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

            if (this.currentSeconds < 0) {
                this.currentSeconds = 59;
                this.currentMinutes--;
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
    }, {
        key: "setTime",
        value: function setTime(seconds) {
            this.currentMinutes = parseInt(seconds / 60);
            this.currentSeconds = parseInt(seconds % 60);
            this._updateText();
        }
    }]);

    return Timer;
}();

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ProgressBar = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _CssClasses = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ProgressBar = exports.ProgressBar = function () {
    function ProgressBar($view) {
        _classCallCheck(this, ProgressBar);

        this.$view = $view;
        this.progress = 0.0;
        this.$slider = $view.find("." + _CssClasses.CSS_CLASSES.PROGRESS_BAR_SLIDER);
        this.maxWidth = $view[0].offsetWidth - this.$slider[0].offsetWidth;
        var self = this;
        this.$slider.draggable({
            axis: "x",
            containment: "parent",
            start: function start(event, ui) {
                self._startDragging();
            },
            stop: function stop(event, ui) {
                self._stopDragging();
            }
        });
    }

    _createClass(ProgressBar, [{
        key: "setProgress",
        value: function setProgress(progress) {
            this.progress = progress;
            if (this.progress > 1.0) this.progress = 1.0;
            if (this.progress < 0.0) this.progress = 0.0;
            this._updateView();
        }
    }, {
        key: "reset",
        value: function reset() {
            this.setProgress(0.0);
        }
    }, {
        key: "_updateView",
        value: function _updateView() {
            this._updateMaxWidth();
            var left = Math.round(this.maxWidth * this.progress);
            this.$slider.css('left', left + 'px');
        }
    }, {
        key: "_updateMaxWidth",
        value: function _updateMaxWidth() {
            if (this.maxWidth === 0) {
                this.maxWidth = this.$view[0].offsetWidth - this.$slider[0].offsetWidth;
            }
        }
    }, {
        key: "_startDragging",
        value: function _startDragging() {
            if (this.onStartDraggingCallback) {
                this.onStartDraggingCallback();
            }
        }
    }, {
        key: "_stopDragging",
        value: function _stopDragging() {
            if (this.onStopDraggingCallback) {
                this._updateMaxWidth();
                this.progress = this.$slider[0].offsetLeft / this.maxWidth;
                this.onStopDraggingCallback(this.progress);
            }
        }
    }, {
        key: "onStartDragging",
        set: function set(callback) {
            this.onStartDraggingCallback = callback;
        }
    }, {
        key: "onStopDragging",
        set: function set(callback) {
            this.onStopDraggingCallback = callback;
        }
    }]);

    return ProgressBar;
}();

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AddonState = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BlobService = __webpack_require__(4);

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
        key: "isEmpty",
        value: function isEmpty() {
            return this.recording == null;
        }
    }, {
        key: "getMP3File",
        value: function getMP3File() {
            var _this3 = this;

            return this.getRecordingBlob().then(function (blob) {
                File.prototype.arrayBuffer = File.prototype.arrayBuffer || _this3._fixArrayBuffer;
                Blob.prototype.arrayBuffer = Blob.prototype.arrayBuffer || _this3._fixArrayBuffer;

                return blob.arrayBuffer();
            }).then(function (arrayBuffer) {
                window.AudioContext = window.AudioContext || window.webkitAudioContext;
                var context = new AudioContext();
                return context.decodeAudioData(arrayBuffer);
            }).then(function (decodedData) {
                var mp3Blob = _BlobService.BlobService.getMp3BlobFromDecodedData(decodedData);
                return new File([mp3Blob], "recording.mp3");
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
/* 30 */
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
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DottedSoundIntensity = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _SoundIntensity2 = __webpack_require__(5);

var _CssClasses = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DottedSoundIntensity = exports.DottedSoundIntensity = function (_SoundIntensity) {
    _inherits(DottedSoundIntensity, _SoundIntensity);

    function DottedSoundIntensity() {
        _classCallCheck(this, DottedSoundIntensity);

        return _possibleConstructorReturn(this, (DottedSoundIntensity.__proto__ || Object.getPrototypeOf(DottedSoundIntensity)).apply(this, arguments));
    }

    _createClass(DottedSoundIntensity, [{
        key: "_setIntensity",
        value: function _setIntensity(intensity) {
            this._clearIntensity();
            var cappedIntensity = intensity;
            if (cappedIntensity > this.volumeLevels) cappedIntensity = this.volumeLevels;
            var heightPercent = cappedIntensity / this.volumeLevels;
            var heightDiff = heightPercent * (this.$view[0].offsetHeight - 6);
            var tallDotNewHeight = Math.round(6 + heightDiff);
            var shortDotNewHeight = Math.round(6 + heightDiff / 2);
            this.$view.find("." + _CssClasses.CSS_CLASSES.TALL_DOT).css('height', tallDotNewHeight + 'px');
            this.$view.find("." + _CssClasses.CSS_CLASSES.SHORT_DOT).css('height', shortDotNewHeight + 'px');
        }
    }, {
        key: "_clearIntensity",
        value: function _clearIntensity() {
            this.$view.find("." + _CssClasses.CSS_CLASSES.SOUND_INTENSITY_DOT).css('height', '');
        }
    }]);

    return DottedSoundIntensity;
}(_SoundIntensity2.SoundIntensity);

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MediaAnalyserService = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _AnalyserProvider = __webpack_require__(33);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MediaAnalyserService = exports.MediaAnalyserService = function () {
    function MediaAnalyserService() {
        _classCallCheck(this, MediaAnalyserService);

        this.audioContext = AudioContextSingleton.getOrCreate();
        this.mediaStreamSource = null;
        this.mediaElementSource = null;
    }

    _createClass(MediaAnalyserService, [{
        key: "createAnalyserFromStream",
        value: function createAnalyserFromStream(stream) {
            var _this = this;

            return new Promise(function (resolve) {
                // on Chrome when user hasn't interacted with the page before AudioContext was created it will be created in suspended state
                // this will happen if MediaRecorder is on the first page user visits (constructor call will happen before user interaction)
                // resume is then needed to unblock AudioContext (see https://goo.gl/7K7WLu)
                _this.audioContext.resume().then(function () {
                    _this.mediaStreamSource = _this.audioContext.createMediaStreamSource(stream);

                    var analyser = _AnalyserProvider.AnalyserProvider.create(_this.audioContext);
                    _this.mediaStreamSource.connect(analyser);

                    resolve(analyser);
                });
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
            AudioContextSingleton.close();
            this.audioContext = null;
            this.mediaElementSource = null;
            this.mediaStreamSource = null;
        }
    }]);

    return MediaAnalyserService;
}();

/***/ }),
/* 33 */
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
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AudioLoader = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Loader2 = __webpack_require__(35);

var _CssClasses = __webpack_require__(0);

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
            this.$view.addClass(_CssClasses.CSS_CLASSES.AUDIO_LOADER);
        }
    }, {
        key: "hide",
        value: function hide() {
            this.$view.removeClass(_CssClasses.CSS_CLASSES.AUDIO_LOADER);
        }
    }]);

    return AudioLoader;
}(_Loader2.Loader);

/***/ }),
/* 35 */
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
/* 36 */
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
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.RecordButtonSoundEffect = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _RecordButton2 = __webpack_require__(3);

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
            if (this.startRecordingSoundEffect.isValid()) {
                this._recordWithSoundEffect();
            } else if (this._isKeyboardControllerNavigationActive()) {
                this._recordWithTTS();
            } else {
                _get(RecordButtonSoundEffect.prototype.__proto__ || Object.getPrototypeOf(RecordButtonSoundEffect.prototype), "_startRecording", this).call(this);
            }
        }
    }, {
        key: "_recordWithSoundEffect",
        value: function _recordWithSoundEffect() {
            this.startRecordingSoundEffect.onStartCallback = function () {};
            this.startRecordingSoundEffect.onStopCallback = function () {};
            _get(RecordButtonSoundEffect.prototype.__proto__ || Object.getPrototypeOf(RecordButtonSoundEffect.prototype), "_startRecording", this).call(this);
            this._playStartRecordingSoundEffect();

            if (this._isKeyboardControllerNavigationActive()) {
                this._keyboardController.onStartRecordingWhenSoundEffect();
            }
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
        key: "_recordWithTTS",
        value: function _recordWithTTS() {
            var callbackFunction = _get(RecordButtonSoundEffect.prototype.__proto__ || Object.getPrototypeOf(RecordButtonSoundEffect.prototype), "_startRecording", this).bind(this);
            this._keyboardController.onStartRecording(callbackFunction);
        }
    }, {
        key: "_stopRecording",
        value: function _stopRecording() {
            if (this.stopRecordingSoundEffect.isValid()) {
                this._onStopRecordingWithSoundEffect();
            } else if (this._isKeyboardControllerNavigationActive()) {
                this._onStopRecordingWithTTS();
            } else {
                _get(RecordButtonSoundEffect.prototype.__proto__ || Object.getPrototypeOf(RecordButtonSoundEffect.prototype), "_stopRecording", this).call(this);
            }
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

            if (this._isKeyboardControllerNavigationActive()) {
                this._keyboardController.onStopRecordingWhenSoundEffect();
            }
        }
    }, {
        key: "_onStopRecordingWithTTS",
        value: function _onStopRecordingWithTTS() {
            _get(RecordButtonSoundEffect.prototype.__proto__ || Object.getPrototypeOf(RecordButtonSoundEffect.prototype), "_stopRecording", this).call(this);
            this._keyboardController.onStopRecording();
        }
    }, {
        key: "_isKeyboardControllerNavigationActive",
        value: function _isKeyboardControllerNavigationActive() {
            return this._keyboardController.keyboardNavigationActive === true;
        }
    }]);

    return RecordButtonSoundEffect;
}(_RecordButton2.RecordButton);

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AddonViewService = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _CssClasses = __webpack_require__(0);

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
            this.$view.removeClass(_CssClasses.CSS_CLASSES.DISABLED);
        }
    }, {
        key: 'deactivate',
        value: function deactivate() {
            this.$view.addClass(_CssClasses.CSS_CLASSES.DISABLED);
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
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AudioResourcesProvider = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ResourcesProvider2 = __webpack_require__(40);

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
/* 40 */
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
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AudioRecorder = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BaseRecorder2 = __webpack_require__(42);

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
        key: '_getOptions',
        value: function _getOptions() {
            var isEdge = DevicesUtils.isEdge();

            return {
                type: 'audio',
                mimeType: 'audio/wav',
                numberOfAudioChannels: isEdge ? 1 : 2,
                checkForInactiveTracks: true,
                bufferSize: 16384,
                disableLogs: true,
                recorderType: RecordRTC.StereoAudioRecorder
            };
        }
    }]);

    return AudioRecorder;
}(_BaseRecorder2.BaseRecorder);

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.BaseRecorder = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Recorder2 = __webpack_require__(43);

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
/* 43 */
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
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AudioPlayer = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BasePlayer2 = __webpack_require__(45);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AudioPlayer = exports.AudioPlayer = function (_BasePlayer) {
    _inherits(AudioPlayer, _BasePlayer);

    function AudioPlayer($view, isMlibro) {
        _classCallCheck(this, AudioPlayer);

        var _this = _possibleConstructorReturn(this, (AudioPlayer.__proto__ || Object.getPrototypeOf(AudioPlayer)).call(this, $view, isMlibro));

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
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.BasePlayer = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Player2 = __webpack_require__(46);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BasePlayer = exports.BasePlayer = function (_Player) {
    _inherits(BasePlayer, _Player);

    function BasePlayer($view, isMlibro) {
        _classCallCheck(this, BasePlayer);

        var _this = _possibleConstructorReturn(this, (BasePlayer.__proto__ || Object.getPrototypeOf(BasePlayer)).call(this));

        if (_this.constructor === BasePlayer) throw new Error("Cannot create an instance of BasePlayer abstract class");
        _this.isMlibro = isMlibro;
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
            this.hasRecording = true;
            this._getDuration().then(function (duration) {
                _this2.onDurationChangeCallback(duration);
                _this2.duration = duration;
            }).catch(function (e) {
                _this2.hasRecording = false;
            });
        }
    }, {
        key: "startPlaying",
        value: function startPlaying() {
            var _this3 = this;

            return new Promise(function (resolve) {
                _this3.mediaNode.muted = false;
                if (_this3.onTimeUpdateCallback) {
                    _this3.mediaNode.addEventListener('timeupdate', _this3.onTimeUpdateCallback);
                    _this3.mediaNode.addEventListener('ended', _this3.onTimeUpdateCallback);
                }
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
                if (_this4.onTimeUpdateCallback) {
                    _this4.mediaNode.removeEventListener('timeupdate', _this4.onTimeUpdateCallback);
                    _this4.mediaNode.removeEventListener('ended', _this4.onTimeUpdateCallback);
                }
                resolve();
            });
        }
    }, {
        key: "pausePlaying",
        value: function pausePlaying() {
            var _this5 = this;

            return new Promise(function (resolve) {
                _this5.mediaNode.pause();
                if (_this5.onTimeUpdateCallback) {
                    _this5.mediaNode.removeEventListener('timeupdate', _this5.onTimeUpdateCallback);
                    _this5.mediaNode.removeEventListener('ended', _this5.onTimeUpdateCallback);
                }
                resolve();
            });
        }
    }, {
        key: "setProgress",
        value: function setProgress(progress) {
            var _this6 = this;

            return new Promise(function (resolve) {
                _this6.mediaNode.currentTime = Math.round(_this6.duration * progress);
                resolve();
            });
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
        key: "getCurrentTime",
        value: function getCurrentTime() {
            return this.mediaNode.currentTime;
        }
    }, {
        key: "setIsMlibro",
        value: function setIsMlibro(isMlibro) {
            this.isMlibro = isMlibro;
        }
    }, {
        key: "_enableEventsHandling",
        value: function _enableEventsHandling() {
            var _this7 = this;

            this.mediaNode.onloadstart = function () {
                return _this7.onStartLoadingCallback();
            };
            this.mediaNode.onended = function () {
                return _this7.onEndPlayingCallback();
            };
            this.mediaNode.onplay = function () {
                return _this7._onPlayCallback();
            };
            this.mediaNode.onpause = function () {
                return _this7._onPausedCallback();
            };

            if (this._isMobileSafari() || this._isIosMlibro() || this._isIOSWebViewUsingAppleWebKit()) {
                this.mediaNode.onloadedmetadata = function () {
                    return _this7.onEndLoadingCallback();
                };
            } else {
                this.mediaNode.oncanplay = function () {
                    return _this7.onEndLoadingCallback();
                };
            }
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
            var _this8 = this;

            // faster resolution then
            // this.mediaNode.ondurationchange = () => this.onDurationChangeCallback(this.mediaNode.duration)
            return new Promise(function (resolve) {
                var playerMock = new Audio(_this8.mediaNode.src);
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
        key: "_isIOSWebViewUsingAppleWebKit",
        value: function _isIOSWebViewUsingAppleWebKit() {
            var userAgent = window.navigator.userAgent.toLowerCase(),
                safari = /safari/.test(userAgent),
                ios = /iphone|ipod|ipad/.test(userAgent),
                appleWebKit = /applewebkit/.test(userAgent);
            var webView = ios && !safari;

            return webView && appleWebKit;
        }
    }, {
        key: "_isMobileSafari",
        value: function _isMobileSafari() {
            return window.DevicesUtils.getBrowserVersion().toLowerCase().indexOf("safari") > -1 && window.MobileUtils.isSafariMobile(navigator.userAgent);
        }
    }, {
        key: "_isIosMlibro",
        value: function _isIosMlibro() {
            return this.isMlibro && window.MobileUtils.isSafariMobile(navigator.userAgent);
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
            this._sendEventCallback('stop');
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
    }, {
        key: "_onTimeUpdateEvent",
        value: function _onTimeUpdateEvent(event) {
            if (this.onTimeUpdateCallback) {
                this.onTimeUpdateCallback(event);
            }
        }
    }]);

    return BasePlayer;
}(_Player2.Player);

/***/ }),
/* 46 */
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
        key: "pausePlaying",
        value: function pausePlaying() {
            throw new Error("pausePlaying method is not implemented");
        }
    }, {
        key: "setProgress",
        value: function setProgress(progress) {
            throw new Error("setProgress method is not implemented");
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
        key: "getCurrentTime",
        value: function getCurrentTime() {
            throw new Error("getCurrentTime method is not implemented");
        }
    }, {
        key: "setEventBus",
        value: function setEventBus(eventBus, sourceID) {
            throw new Error("setEventBus method is not implemented");
        }
    }, {
        key: "setIsMlibro",
        value: function setIsMlibro(isMlibro) {
            throw new Error("setIsMlibro method is not implemented");
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
    }, {
        key: "onTimeUpdate",
        set: function set(callback) {
            this.onTimeUpdateCallback = function (event) {
                return callback(event);
            };
        }
    }]);

    return Player;
}();

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DefaultRecordingPlayButton = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _Button2 = __webpack_require__(1);

var _CssClasses = __webpack_require__(0);

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
            this.$view.addClass(_CssClasses.CSS_CLASSES.SELECTED);
            this.onStartPlayingCallback();
        }
    }, {
        key: "_stopPlaying",
        value: function _stopPlaying() {
            this.$view.removeClass(_CssClasses.CSS_CLASSES.SELECTED);
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
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DefaultKeyboardController = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BaseKeyboardController = __webpack_require__(6);

var _CssClasses = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DefaultKeyboardController = exports.DefaultKeyboardController = function (_BaseKeyboardControll) {
    _inherits(DefaultKeyboardController, _BaseKeyboardControll);

    function DefaultKeyboardController() {
        _classCallCheck(this, DefaultKeyboardController);

        return _possibleConstructorReturn(this, (DefaultKeyboardController.__proto__ || Object.getPrototypeOf(DefaultKeyboardController)).apply(this, arguments));
    }

    _createClass(DefaultKeyboardController, [{
        key: "markDefaultRecordingPlayButton",
        value: function markDefaultRecordingPlayButton() {
            this.markCurrentElement(0);
        }
    }, {
        key: "markRecordingButton",
        value: function markRecordingButton() {
            this.markCurrentElement(1);
        }
    }, {
        key: "markPlayButton",
        value: function markPlayButton() {
            this.markCurrentElement(2);
        }
    }, {
        key: "readElement",
        value: function readElement(element) {
            var $element = this.getTarget(element, false);

            if ($element.hasClass(_CssClasses.CSS_CLASSES.DEFAULT_RECORDING_PLAY_BUTTON)) {
                this._speakDefaultRecordingPlayButtonTTS($element);
            } else if ($element.hasClass(_CssClasses.CSS_CLASSES.RECORDING_BUTTON)) {
                this._speakRecordingButtonTTS($element);
            } else if ($element.hasClass(_CssClasses.CSS_CLASSES.PLAY_BUTTON)) {
                this._speakPlayButtonTTS($element);
            }
        }
    }, {
        key: "_speakDefaultRecordingPlayButtonTTS",
        value: function _speakDefaultRecordingPlayButtonTTS($element) {
            var textVoiceObject = [];

            this._pushMessageToTextVoiceObjectWithLanguageFromLesson(textVoiceObject, this.speechTexts.DefaultRecordingPlayButton);

            if (this._activationState.isInactive()) {
                this._pushDisabledMessageToTextVoiceObject(textVoiceObject);
            }

            this._speak(textVoiceObject);
        }
    }]);

    return DefaultKeyboardController;
}(_BaseKeyboardController.BaseKeyboardController);

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ExtendedKeyboardController = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _BaseKeyboardController = __webpack_require__(6);

var _CssClasses = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ExtendedKeyboardController = exports.ExtendedKeyboardController = function (_BaseKeyboardControll) {
    _inherits(ExtendedKeyboardController, _BaseKeyboardControll);

    function ExtendedKeyboardController(elements, columnsCount, model, mediaState, activationState, speak, speakAndExecuteCallback) {
        _classCallCheck(this, ExtendedKeyboardController);

        var _this = _possibleConstructorReturn(this, (ExtendedKeyboardController.__proto__ || Object.getPrototypeOf(ExtendedKeyboardController)).call(this, elements, columnsCount, model, mediaState, activationState, speak, speakAndExecuteCallback));

        _this._resetDialogLabels = model.resetDialogLabels;
        _this._disableRecording = model.disableRecording;
        return _this;
    }

    _createClass(ExtendedKeyboardController, [{
        key: "markRecordingButton",
        value: function markRecordingButton() {
            this.markCurrentElement(0);
        }
    }, {
        key: "markPlayButton",
        value: function markPlayButton() {
            this.markCurrentElement(1);
        }
    }, {
        key: "markResetButton",
        value: function markResetButton() {
            this.markCurrentElement(2);
        }
    }, {
        key: "markDownloadButton",
        value: function markDownloadButton() {
            this.markCurrentElement(3);
        }
    }, {
        key: "_performFirstEnterEvent",
        value: function _performFirstEnterEvent() {
            this.keyboardNavigationActive = true;
            var $element = this.getTarget(this.keyboardNavigationElements[0], false);

            if (this._isKeyboardNavigationBlocked()) {
                this._markActiveElement();
            } else if ($element.hasClass(_CssClasses.CSS_CLASSES.DIALOG_TEXT)) {
                this.markDialogTextAndReadResetDialogTTS();
            } else {
                this._markAndReadFirstDisplayedElement();
            }
        }
    }, {
        key: "markDialogTextAndReadResetDialogTTS",
        value: function markDialogTextAndReadResetDialogTTS() {
            this.markCurrentElement(0);
            this._speakResetDialogTTS();
        }
    }, {
        key: "readElement",
        value: function readElement(element) {
            var $element = this.getTarget(element, false);

            if ($element.hasClass(_CssClasses.CSS_CLASSES.RECORDING_BUTTON)) {
                this._speakRecordingButtonTTS($element);
            } else if ($element.hasClass(_CssClasses.CSS_CLASSES.PLAY_BUTTON)) {
                this._speakPlayButtonTTS($element);
            } else if ($element.hasClass(_CssClasses.CSS_CLASSES.RESET_BUTTON)) {
                this._speakResetButtonTTS($element);
            } else if ($element.hasClass(_CssClasses.CSS_CLASSES.DOWNLOAD_BUTTON)) {
                this._speakDownloadButtonTTS($element);
            } else if ($element.hasClass(_CssClasses.CSS_CLASSES.DIALOG_TEXT)) {
                this._speakDialogTextTTS($element);
            } else if ($element.hasClass(_CssClasses.CSS_CLASSES.CONFIRM_BUTTON)) {
                this._speakConfirmButtonTTS($element);
            } else if ($element.hasClass(_CssClasses.CSS_CLASSES.DENY_BUTTON)) {
                this._speakDenyButtonTTS($element);
            }
        }
    }, {
        key: "_speakResetButtonTTS",
        value: function _speakResetButtonTTS($element) {
            var textVoiceObject = [];

            this._pushMessageToTextVoiceObjectWithLanguageFromLesson(textVoiceObject, this.speechTexts.ResetButton);

            if (this._activationState.isInactive()) {
                this._pushMessageToTextVoiceObjectWithLanguageFromLesson(textVoiceObject, this.speechTexts.Disabled);
            }

            this._speak(textVoiceObject);
        }
    }, {
        key: "_speakDownloadButtonTTS",
        value: function _speakDownloadButtonTTS($element) {
            var textVoiceObject = [];

            this._pushMessageToTextVoiceObjectWithLanguageFromLesson(textVoiceObject, this.speechTexts.DownloadButton);

            if (this._activationState.isInactive()) {
                this._pushMessageToTextVoiceObjectWithLanguageFromLesson(textVoiceObject, this.speechTexts.Disabled);
            }

            this._speak(textVoiceObject);
        }
    }, {
        key: "_speakResetDialogTTS",
        value: function _speakResetDialogTTS() {
            var textVoiceObject = [];

            this._pushResetDialogTextMessageToTextVoiceObject(textVoiceObject);
            this._pushResetDialogConfirmMessageToTextVoiceObject(textVoiceObject);
            this._pushResetDialogDenyMessageToTextVoiceObject(textVoiceObject);

            if (this._isAddonDisabled()) {
                this._pushDisabledMessageToTextVoiceObject(textVoiceObject);
            }

            this._speak(textVoiceObject);
        }
    }, {
        key: "_speakDialogTextTTS",
        value: function _speakDialogTextTTS($element) {
            var textVoiceObject = [];

            this._pushMessageToTextVoiceObjectWithLanguageFromLesson(textVoiceObject, this.speechTexts.ResetDialog);

            this._pushResetDialogTextMessageToTextVoiceObject(textVoiceObject);

            if (this._isAddonDisabled()) {
                this._pushDisabledMessageToTextVoiceObject(textVoiceObject);
            }

            this._speak(textVoiceObject);
        }
    }, {
        key: "_pushResetDialogTextMessageToTextVoiceObject",
        value: function _pushResetDialogTextMessageToTextVoiceObject(textVoiceObject) {
            this._pushMessageToTextVoiceObjectWithLanguageFromPresenter(textVoiceObject, this._resetDialogLabels.resetDialogText.resetDialogLabel);
        }
    }, {
        key: "_speakConfirmButtonTTS",
        value: function _speakConfirmButtonTTS($element) {
            var textVoiceObject = [];

            this._pushResetDialogConfirmMessageToTextVoiceObject(textVoiceObject);

            if (this._isAddonDisabled()) {
                this._pushDisabledMessageToTextVoiceObject(textVoiceObject);
            }

            this._speak(textVoiceObject);
        }
    }, {
        key: "_pushResetDialogConfirmMessageToTextVoiceObject",
        value: function _pushResetDialogConfirmMessageToTextVoiceObject(textVoiceObject) {
            this._pushMessageToTextVoiceObjectWithLanguageFromPresenter(textVoiceObject, this._resetDialogLabels.resetDialogConfirm.resetDialogLabel);
        }
    }, {
        key: "_speakDenyButtonTTS",
        value: function _speakDenyButtonTTS($element) {
            var textVoiceObject = [];

            this._pushResetDialogDenyMessageToTextVoiceObject(textVoiceObject);

            if (this._isAddonDisabled()) {
                this._pushDisabledMessageToTextVoiceObject(textVoiceObject);
            }

            this._speak(textVoiceObject);
        }
    }, {
        key: "_pushResetDialogDenyMessageToTextVoiceObject",
        value: function _pushResetDialogDenyMessageToTextVoiceObject(textVoiceObject) {
            this._pushMessageToTextVoiceObjectWithLanguageFromPresenter(textVoiceObject, this._resetDialogLabels.resetDialogDeny.resetDialogLabel);
        }
    }, {
        key: "onStopRecording",
        value: function onStopRecording() {
            _get(ExtendedKeyboardController.prototype.__proto__ || Object.getPrototypeOf(ExtendedKeyboardController.prototype), "onStopRecording", this).call(this);

            if (!this._disableRecording) {
                this.nextElement();
            }
        }
    }, {
        key: "onStopRecordingWhenSoundEffect",
        value: function onStopRecordingWhenSoundEffect() {
            _get(ExtendedKeyboardController.prototype.__proto__ || Object.getPrototypeOf(ExtendedKeyboardController.prototype), "onStopRecordingWhenSoundEffect", this).call(this);

            if (!this._disableRecording) {
                this.nextElement();
            }
        }
    }]);

    return ExtendedKeyboardController;
}(_BaseKeyboardController.BaseKeyboardController);

/***/ })
/******/ ]);