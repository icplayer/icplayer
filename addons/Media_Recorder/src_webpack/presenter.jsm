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
        handleDestroy(view);
    };

    presenter.createPreview = function (view, model) {
        mediaRecorder.createPreview(view, model);
        handleDestroy(view);
    };

    presenter.getState = function () {
        return mediaRecorder.getState();
    };

    presenter.setState = function (state) {
        mediaRecorder.setState(state);
    };

    presenter.getErrorCount = function () {
        return 0;
    };

    presenter.getMaxScore = function () {
        return 0;
    };

    presenter.getScore = function () {
        return 0;
    };

    presenter.destroy = function(event) {
        event.target.removeEventListener('DOMNodeRemoved', presenter.destroy);
        mediaRecorder.destroy();
        event.target = null;
        mediaRecorder = null;
    };

    function handleDestroy (view) {
        view.addEventListener('DOMNodeRemoved', presenter.destroy);
    }

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
    // presenter.setShowErrorsMode = function () {
    //     console.log("setShowErrorsMode");
    // };
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
    //
    // presenter.isAllOk = function(){
    //
    // };
    //
    // presenter.disable= function(){
    //
    // };
    // presenter.enable= function(){
    //
    // };


    // isDisabled
    // Oznacza, że addon jest praktycznie wyłączony.
    // nie wysyła eventów
    // nie koloruje ( nie nadaje klas ) poprawnych/złych odpowiedzi
    // jest nieklikalny i/lub nie można wprowadzać do niego żadnych wartości
    // powinien dostać klasę disable

    // isActivity lub isNotActivity
    // W tym stanie addon nie jest brany pod uwagę podczas sprawdzania wyników.
    // metody getScore, getMaxScore, getErrorsCount powinny zwracać 0
    // kolorowanie ( nadawanie klas ) poprawnych/złych odpowiedzi nie jest wykonywane
    // eventy powinny być wysyłane!

    // Tryb Sprawdzania (setShowErrorsMode)
    // W tym trybie addon powinien być disabled.

    return presenter;
}

window.AddonMedia_Recorder_create = AddonMedia_Recorder_create;