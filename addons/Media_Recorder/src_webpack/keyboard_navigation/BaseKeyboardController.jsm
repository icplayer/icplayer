import {CSS_CLASSES} from "../view/CssClasses.jsm";

export class BaseKeyboardController extends KeyboardController {

    _isRecording = false;

    DEFAULT_TTS_PHRASES = {
        DEFAULT_RECORDING_PLAY_BUTTON: "Default recording play button",
        RECORDING_BUTTON: "Recording button",
        PLAY_BUTTON: "Play button",
        RESET_BUTTON: "Reset button",
        DOWNLOAD_BUTTON: "Download button",
        RESET_DIALOG: "Reset dialog",
        START_RECORDING: "Start recording",
        STOP_RECORDING: "Stop recording",
        DISABLED: "Disabled",
    };

    constructor(elements, columnsCount, model, mediaState, activationState, speak, speakWithCallback) {
        super(elements, columnsCount);

        if (this.constructor === BaseKeyboardController)
            throw new Error("Cannot create an instance of KeyboardController abstract class");

        this._langTag = model.langAttribute;
        this._mediaState = mediaState;
        this._activationState = activationState;
        this._speak = speak;
        this._speakWithCallback = speakWithCallback;
    };

    setSpeechTexts(speechTexts) {
        this.speechTexts = {
            DefaultRecordingPlayButton: this.DEFAULT_TTS_PHRASES.DEFAULT_RECORDING_PLAY_BUTTON,
            RecordingButton: this.DEFAULT_TTS_PHRASES.RECORDING_BUTTON,
            PlayButton: this.DEFAULT_TTS_PHRASES.PLAY_BUTTON,
            ResetButton: this.DEFAULT_TTS_PHRASES.RESET_BUTTON,
            DownloadButton: this.DEFAULT_TTS_PHRASES.DOWNLOAD_BUTTON,
            ResetDialog: this.DEFAULT_TTS_PHRASES.RESET_DIALOG,
            StartRecording: this.DEFAULT_TTS_PHRASES.START_RECORDING,
            StopRecording: this.DEFAULT_TTS_PHRASES.STOP_RECORDING,
            Disabled: this.DEFAULT_TTS_PHRASES.DISABLED,
        };

        if (!speechTexts || $.isEmptyObject(speechTexts)) {
            return;
        };

        this.speechTexts = {
            DefaultRecordingPlayButton: TTSUtils.getSpeechTextProperty(
                speechTexts.DefaultRecordingPlayButton.DefaultRecordingPlayButton,
                this.speechTexts.DefaultRecordingPlayButton),
            RecordingButton: TTSUtils.getSpeechTextProperty(
                speechTexts.RecordingButton.RecordingButton,
                this.speechTexts.RecordingButton),
            PlayButton: TTSUtils.getSpeechTextProperty(
                speechTexts.PlayButton.PlayButton,
                this.speechTexts.PlayButton),
            ResetButton: TTSUtils.getSpeechTextProperty(
                speechTexts.ResetButton.ResetButton,
                this.speechTexts.ResetButton),
            DownloadButton: TTSUtils.getSpeechTextProperty(
                speechTexts.DownloadButton.DownloadButton,
                this.speechTexts.DownloadButton),
            ResetDialog: TTSUtils.getSpeechTextProperty(
                speechTexts.ResetDialog.ResetDialog,
                this.speechTexts.ResetDialog),
            StartRecording: TTSUtils.getSpeechTextProperty(
                speechTexts.StartRecording.StartRecording,
                this.speechTexts.StartRecording),
            StopRecording: TTSUtils.getSpeechTextProperty(
                speechTexts.StopRecording.StopRecording,
                this.speechTexts.StopRecording),
            Disabled: TTSUtils.getSpeechTextProperty(
                speechTexts.Disabled.Disabled,
                this.speechTexts.Disabled),
        };
    };

    getTarget(element, willBeClicked) {
        return $(element);
    };

    switchElement(move) {
        super.switchElement(move);
        if (!this._isCurrentElementNotDisplayed()) {
            this.readCurrentElement();
        }
    };

    nextElement(event) {
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
    };

    previousElement(event) {
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
    };

    nextRow(event) {
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
    };

    previousRow(event) {
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
    };

    enter(event) {
        if (event) {
            event.preventDefault();
        }

        if (!this.keyboardNavigationActive) {
            this._performFirstEnterEvent();
        } else {
            this._performNotFirstEnterEvent();
        }
    };

    _performFirstEnterEvent() {
        this.keyboardNavigationActive = true;

        if (this._isKeyboardNavigationBlocked()) {
            this._markActiveElement();
        } else {
            this._markAndReadFirstDisplayedElement();
        }
    };

    _markActiveElement() {
        if (this._mediaState.isPlayingDefaultRecording()) {
            this.markDefaultRecordingPlayButton();
        } else if (this._mediaState.isRecording() || this._isRecording) {
            this.markRecordingButton();
        } else if (this._mediaState.isPlaying()) {
            this.markPlayButton();
        }
    };

    markDefaultRecordingPlayButton() {
        throw new Error("readElement method is not implemented");
    };

    markRecordingButton() {
        throw new Error("readElement method is not implemented");
    };

    markPlayButton() {
        throw new Error("readElement method is not implemented");
    };

    _markAndReadFirstDisplayedElement() {
        this.markCurrentElement(0);
        if (this._isCurrentElementNotDisplayed()) {
            this.nextElement();
        } else {
            this.readCurrentElement();
        }
    };

    _performNotFirstEnterEvent() {
        if (!this._isKeyboardNavigationBlocked()) {
            this.readCurrentElement();
        }
    };

    select(event) {
        if (this._isAddonDisabled()) {
            let textVoiceObject = [];

            this._pushMessageToTextVoiceObjectWithLanguageFromLesson(
                textVoiceObject, this.speechTexts.Disabled
            );

            this._speak(textVoiceObject);
        }

        super.select(event);
    };

    exitWCAGMode(){
        this._isRecording = false;
        super.exitWCAGMode();
    };

    _isAddonDisabled() {
        return this._activationState.isInactive();
    }

    _isKeyboardNavigationBlocked() {
        return (
            this._mediaState.isPlayingDefaultRecording()
            || this._mediaState.isRecording()
            || this._mediaState.isPlaying()
            || this._isRecording
        );
    };

    _isCurrentElementNotDisplayed() {
        return this._getCurrentElement().style("display") === "none";
    };

    _getCurrentElement() {
        return this.getTarget(this.keyboardNavigationCurrentElement, false);
    };

    readCurrentElement() {
        this.readElement(this.keyboardNavigationCurrentElement);
    };

    readElement(element) {
        throw new Error("readElement method is not implemented");
    };

    _speakRecordingButtonTTS($element) {
        let textVoiceObject = [];

        this._pushMessageToTextVoiceObjectWithLanguageFromLesson(
            textVoiceObject, this.speechTexts.RecordingButton
        );

        if (this._isAddonDisabled()) {
            this._pushMessageToTextVoiceObjectWithLanguageFromLesson(
                textVoiceObject, this.speechTexts.Disabled
            );
        }

        this._speak(textVoiceObject);
    };

    _speakPlayButtonTTS($element) {
        let textVoiceObject = [];

        this._pushMessageToTextVoiceObjectWithLanguageFromLesson(
            textVoiceObject, this.speechTexts.PlayButton
        );

        if (this._isAddonDisabled()) {
            this._pushMessageToTextVoiceObjectWithLanguageFromLesson(
                textVoiceObject, this.speechTexts.Disabled
            );
        }

        this._speak(textVoiceObject);
    };

    onStartRecording(callbackFunction) {
        this._isRecording = true;
        this._speakStartRecordingTTS(callbackFunction)
    };

    onStartRecordingWhenSoundEffect() {
        this._isRecording = true;
    };

    _speakStartRecordingTTS(callbackFunction) {
        let textVoiceObject = [];

        this._pushMessageToTextVoiceObjectWithLanguageFromLesson(
            textVoiceObject, this.speechTexts.StartRecording
        );

        this._speakWithCallback(textVoiceObject, callbackFunction);
    };

    onStopRecording() {
        this._isRecording = false;
        this._speakStopRecordingTTS()
    };

    onStopRecordingWhenSoundEffect() {
        this._isRecording = false;
    };

    _speakStopRecordingTTS() {
        let textVoiceObject = [];

        this._pushMessageToTextVoiceObjectWithLanguageFromLesson(
            textVoiceObject, this.speechTexts.StopRecording
        );

        this._speak(textVoiceObject);
    };

    _pushMessageToTextVoiceObjectWithLanguageFromLesson(textVoiceObject, message) {
        this._pushMessageToTextVoiceObject(textVoiceObject, message, false);
    };

    _pushMessageToTextVoiceObjectWithLanguageFromPresenter(textVoiceObject, message) {
        this._pushMessageToTextVoiceObject(textVoiceObject, message, true);
    };

    _pushMessageToTextVoiceObject(textVoiceObject, message, usePresenterLangTag = false) {
        if (usePresenterLangTag) {
            textVoiceObject.push(window.TTSUtils.getTextVoiceObject(message, this._langTag));
        } else {
            textVoiceObject.push(window.TTSUtils.getTextVoiceObject(message));
        }
    };
}
