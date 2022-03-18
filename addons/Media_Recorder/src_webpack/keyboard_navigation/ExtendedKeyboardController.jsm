import {BaseKeyboardController} from "./BaseKeyboardController.jsm";
import {CSS_CLASSES} from "../view/CssClasses.jsm";

export class ExtendedKeyboardController extends BaseKeyboardController {

    constructor(elements, columnsCount, model, mediaState, activationState, speak, speakWithCallback) {
        super(elements, columnsCount, model, mediaState, activationState, speak, speakWithCallback);
        this._resetDialogLabels = model.resetDialogLabels;
        this._disableRecording = model.disableRecording;
    };

    markRecordingButton() {
        this.markCurrentElement(0);
    };

    markPlayButton() {
        this.markCurrentElement(1);
    };

    markResetButton() {
        this.markCurrentElement(2);
    };

    markDownloadButton() {
        this.markCurrentElement(3);
    };

    speakStopRecordingTTS() {
        super.speakStopRecordingTTS();
        this.nextElement();
    };

    readElement(element) {
        let $element = this.getTarget(element, false);

        if ($element.hasClass(CSS_CLASSES.RECORDING_BUTTON)) {
            this._speakRecordingButtonTTS($element);
        } else if ($element.hasClass(CSS_CLASSES.PLAY_BUTTON)) {
            this._speakPlayButtonTTS($element);
        } else if ($element.hasClass(CSS_CLASSES.RESET_BUTTON)) {
            this._speakResetButtonTTS($element);
        } else if ($element.hasClass(CSS_CLASSES.DOWNLOAD_BUTTON)) {
            this._speakDownloadButtonTTS($element);
        } else if ($element.hasClass(CSS_CLASSES.DIALOG_TEXT)) {
            this._speakResetDialogTTS($element);
        } else if ($element.hasClass(CSS_CLASSES.CONFIRM_BUTTON)) {
            this._speakConfirmButtonTTS($element);
        } else if ($element.hasClass(CSS_CLASSES.DENY_BUTTON)) {
            this._speakDenyButtonTTS($element);
        }
    };

    _speakResetButtonTTS($element) {
        let textVoiceObject = [];

        this._pushMessageToTextVoiceObjectWithLanguageFromLesson(
            textVoiceObject, this.speechTexts.ResetButton
        );

        if (this._activationState.isInactive()) {
            this._pushMessageToTextVoiceObjectWithLanguageFromLesson(
                textVoiceObject, this.speechTexts.Disabled
            );
        }

        this._speak(textVoiceObject);
    };

    _speakDownloadButtonTTS($element) {
        let textVoiceObject = [];

        this._pushMessageToTextVoiceObjectWithLanguageFromLesson(
            textVoiceObject, this.speechTexts.DownloadButton
        );

        if (this._activationState.isInactive()) {
            this._pushMessageToTextVoiceObjectWithLanguageFromLesson(
                textVoiceObject, this.speechTexts.Disabled
            );
        }

        this._speak(textVoiceObject);
    };

    _speakResetDialogTTS($element) {
        let textVoiceObject = [];

        this._pushMessageToTextVoiceObjectWithLanguageFromLesson(
            textVoiceObject, this.speechTexts.ResetDialog
        );

        this._pushMessageToTextVoiceObjectWithLanguageFromPresenter(
            textVoiceObject, this._resetDialogLabels.resetDialogText.resetDialogLabel
        );

        this._speak(textVoiceObject);
    };

    _speakConfirmButtonTTS($element) {
        let textVoiceObject = [];

        this._pushMessageToTextVoiceObjectWithLanguageFromPresenter(
            textVoiceObject, this._resetDialogLabels.resetDialogConfirm.resetDialogLabel
        );

        this._speak(textVoiceObject);
    };

    _speakDenyButtonTTS($element) {
        let textVoiceObject = [];

        this._pushMessageToTextVoiceObjectWithLanguageFromPresenter(
            textVoiceObject, this._resetDialogLabels.resetDialogDeny.resetDialogLabel
        );

        this._speak(textVoiceObject);
    };

    onStopRecording() {
        super.onStopRecording();

        if (!this._disableRecording) {
            this.nextElement();
        }
    };

    onStopRecordingWhenSoundEffect() {
        super.onStopRecordingWhenSoundEffect();

        if (!this._disableRecording) {
            this.nextElement();
        }
    };
}
