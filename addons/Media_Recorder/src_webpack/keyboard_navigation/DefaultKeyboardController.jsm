import {BaseKeyboardController} from "./BaseKeyboardController.jsm";
import {CSS_CLASSES} from "../view/CssClasses.jsm";

export class DefaultKeyboardController extends BaseKeyboardController {

    markDefaultRecordingPlayButton() {
        this.markCurrentElement(0);
    };

    markRecordingButton() {
        this.markCurrentElement(1);
    };

    markPlayButton() {
        this.markCurrentElement(2);
    };

    readElement(element) {
        let $element = this.getTarget(element, false);

        if ($element.hasClass(CSS_CLASSES.DEFAULT_RECORDING_PLAY_BUTTON)) {
            this._speakDefaultRecordingPlayButtonTTS($element);
        } else if ($element.hasClass(CSS_CLASSES.RECORDING_BUTTON)) {
            this._speakRecordingButtonTTS($element);
        } else if ($element.hasClass(CSS_CLASSES.PLAY_BUTTON)) {
            this._speakPlayButtonTTS($element);
        }
    };

    _speakDefaultRecordingPlayButtonTTS($element) {
        let textVoiceObject = [];

        this._pushMessageToTextVoiceObjectWithLanguageFromLesson(
            textVoiceObject, this.speechTexts.DefaultRecordingPlayButton
        );

        if (this._activationState.isInactive()) {
            this._pushMessageToTextVoiceObjectWithLanguageFromLesson(
                textVoiceObject, this.speechTexts.Disabled
            );
        }

        this._speak(textVoiceObject);
    };
}
