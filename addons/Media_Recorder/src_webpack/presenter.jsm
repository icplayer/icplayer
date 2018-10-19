import {MediaRecorder} from "./MediaRecorder.jsm";

function AddonMedia_Recorder_create() {

    let presenter = function () {
    };

    presenter.mediaRecorder = new MediaRecorder();

    presenter.setPlayerController = function (controller) {
        presenter.mediaRecorder.setPlayerController(controller)
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
        presenter.mediaRecorder.deactivate();
    };

    presenter.setWorkMode = function setWorkMode() {
        presenter.mediaRecorder.activate();
    };

    presenter.reset = function reset() {
        presenter.mediaRecorder.reset();
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
            'hide': presenter.hide
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