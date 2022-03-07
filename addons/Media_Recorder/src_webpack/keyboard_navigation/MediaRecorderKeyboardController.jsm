import {CSS_CLASSES} from "../view/CssClasses.jsm";

export class MediaRecorderKeyboardController extends KeyboardController {

    DEFAULT_TTS_PHRASES = {
        DEFAULT_RECORD_PLAY_BUTTON: "Default record play button",
        DEFAULT_RECORD_STOP_BUTTON: "Default record stop button",
    };

    constructor(elements, columnsCount, speak, speakWithCallback) {
        super(elements, columnsCount);
        this.speak = speak;
        this.speakWithCallback = speakWithCallback;
    };

    setSpeechTexts(speechTexts) {
        this.speechTexts = {
            DefaultRecordPlayButton: this.DEFAULT_TTS_PHRASES.DEFAULT_RECORD_PLAY_BUTTON,
            DefaultRecordStopButton: this.DEFAULT_TTS_PHRASES.DEFAULT_RECORD_STOP_BUTTON,
        };

        if (!speechTexts || $.isEmptyObject(speechTexts)) {
            return;
        };

        this.speechTexts = {
            DefaultRecordPlayButton: this._getSpeechTextProperty(
                speechTexts.DefaultRecordPlayButton.DefaultRecordPlayButton,
                this.speechTexts.DefaultRecordPlayButton),
            DefaultRecordStopButton: this._getSpeechTextProperty(
                speechTexts.DefaultRecordStopButton.DefaultRecordStopButton,
                this.speechTexts.DefaultRecordStopButton)
        };
    };

    _getSpeechTextProperty(rawValue, defaultValue) {
        if (rawValue === undefined || rawValue === null) {
            return defaultValue;
        }

        let value = rawValue.trim();
        if (value === '') {
            return defaultValue;
        }

        return value;
    };

    getTarget(element, willBeClicked) {
        return $(element);
    };

    switchElement(move) {
        super.switchElement(move);
        this.readCurrentElement();
    };

    enter(event) {
        super.enter(event);
        this.readCurrentElement();
    };

    select(event) {
        var currentElement = this.keyboardNavigationCurrentElement;
        var $element = this.getTarget(currentElement, false);

        if (!$element.hasClass(CSS_CLASSES.SELECTED)) {
            this.speakWithCallback("Selected", super.select(event));
        } else {
            super.select(event);
        }
    };

    readCurrentElement() {
        this.readElement(this.keyboardNavigationCurrentElement);
    };

    readElement(element) {
        console.log("readElement", element);
        console.log(element)
        let $element = this.getTarget(element, false);
        console.log($element)

        if ($element.hasClass(CSS_CLASSES.DEFAULT_RECORD_PLAY_BUTTON)) {
            if ($element.hasClass(CSS_CLASSES.SELECTED))
                this.speak(this.speechTexts.DefaultRecordStopButton)
            else
                this.speak(this.speechTexts.DefaultRecordPlayButton)
        }
        // TODO
    };
}