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
        handleDestroy(view);
    };

    presenter.createPreview = function createPreview(view, model) {
        presenter.view = view;

        presenter.mediaRecorder.createPreview(view, model);
        handleDestroy(view);
    };

    presenter.getState = function getState() {
        return presenter.mediaRecorder.getState();
    };

    presenter.setState = function setState(state) {
        presenter.mediaRecorder.setState(state);
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

    presenter.destroy = function destroy(event) {
        if (event.target == presenter.view) {
            event.target.removeEventListener('DOMNodeRemoved', presenter.destroy);
            presenter.mediaRecorder.destroy();
            event.target = null;
            presenter.mediaRecorder = null;
            presenter.validateModel = null;
        }
    };

    function handleDestroy(view) {
        view.addEventListener('DOMNodeRemoved', presenter.destroy);
    }

    presenter.setVisibility = function (isVisible) {
        $(presenter.view).css('visibility', isVisible ? 'visible' : 'hidden');
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

    presenter._internalElements = function () {
        return this.mediaRecorder._internalElements();
    };

    return presenter;
}

window.AddonMedia_Recorder_create = AddonMedia_Recorder_create;