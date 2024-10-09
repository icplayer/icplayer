import {MediaRecorder} from "./MediaRecorder.jsm";

function AddonMedia_Recorder_create() {

    let presenter = function () {
    };

    presenter.mediaRecorder = new MediaRecorder();
    presenter.addonID = null;

    presenter.setPlayerController = function (controller) {
        presenter.mediaRecorder.setPlayerController(controller)
    };

    presenter.run = function run(view, model) {
        presenter.view = view;
        presenter.mediaRecorder.run(view, model);
        presenter.updateAddonID(model);
        handleDestroyEvent();
    };

    presenter.createPreview = function createPreview(view, model) {
        presenter.view = view;
        presenter.mediaRecorder.createPreview(view, model);
        presenter.updateAddonID(model);
        handleDestroyEvent();
    };

    presenter.updateAddonID = function(model) {
        if (model.hasOwnProperty('ID')) {
            presenter.addonID = model['ID'];
        }
    }

    presenter.isEmpty = function isEmpty() {
        return presenter.mediaRecorder.isEmpty();
    };

    presenter.getMP3File = function getMP3File() {
        return presenter.mediaRecorder.getMP3File();
    }

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

    presenter.show = function() {
        presenter.mediaRecorder.show();
    };

    presenter.hide = function() {
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

    presenter.setWCAGStatus = function(isWCAGOn) {
        presenter.mediaRecorder.setWCAGStatus(isWCAGOn);
    };

    presenter.reset = function reset() {
        presenter.mediaRecorder.reset();
    };

    presenter.enable = function enable() {
        presenter.mediaRecorder.enable();
    };

    presenter.isEnabledInGSAMode = function () {
        return true;
    }

    presenter.disable = function disable() {
        presenter.mediaRecorder.disable();
    };

    presenter.keyboardController = function(keycode, isShiftKeyDown, event) {
        presenter.mediaRecorder.keyboardControllerObject.handle(keycode, isShiftKeyDown, event);
    };

    presenter.executeCommand = function executeCommand(name, params) {
        let commands = {
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
            'disable': presenter.disable,
        };

        return Commands.dispatch(commands, name, params, presenter);
    };

    presenter.destroy = function destroy(event) {
        if (event.target === presenter.view) {
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
    }

    function handleDestroyEvent() {
        MutationObserverService.createDestroyObserver(presenter.addonID, presenter.destroy, presenter.view);
        MutationObserverService.setObserver();
    }

    return presenter;
}

window.AddonMedia_Recorder_create = AddonMedia_Recorder_create;