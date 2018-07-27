import {MediaRecorder} from "./mediaRecorder.jsm";

function AddonMedia_Recorder_create() {

    let presenter = function () {
    };

    let mediaRecorder = new MediaRecorder();

    presenter.setPlayerController = function (controller) {
        mediaRecorder.setPlayerController(controller)
    };

    presenter.run = function (view, model) {
        mediaRecorder.run(view, model);
    };

    presenter.createPreview = function (view, model) {
        mediaRecorder.createPreview(view, model);
    };

    // presenter.setVisibility = function (isVisible) {
    //     console.log("setVisibility");
    // };
    //
    // presenter.hide = function () {
    //     presenter.setVisibility(false);
    // };
    //
    // presenter.show = function () {
    //     presenter.setVisibility(true);
    // };
    //
    presenter.getState = function () {
        return mediaRecorder.getState();
    };

    presenter.setState = function (state) {
        mediaRecorder.setState(state);
    };
    //
    // presenter.setWorkMode = function () {
    //     console.log("setWorkMode");
    // };
    //
    // presenter.reset = function () {
    //     console.log("reset");
    // };
    //
    // presenter.onEventReceived = function (eventData) {
    //     console.log("onEventReceived");
    // };
    //
    // presenter.executeCommand = function (name, params) {
    //     console.log("executeCommand");
    // };

    return presenter;
}

window.AddonMedia_Recorder_create = AddonMedia_Recorder_create;