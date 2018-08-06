import {MediaRecorder} from "./mediaRecorder.jsm";
import {validateModel} from "./modelValidator.jsm";

function AddonMedia_Recorder_create() {

    let presenter = function () {
    };

    presenter.validateModel = validateModel;
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

    presenter.setShowErrorsMode = function setShowErrorsMode() {
        presenter.mediaRecorder.deactivate();
    };

    presenter.setWorkMode = function setWorkMode() {
        presenter.mediaRecorder.activate();
    };

    presenter.reset = function reset() {
        presenter.mediaRecorder.reset();
    };

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

    presenter._internalElements = function () {
        return this.mediaRecorder._internalElements();
    };

    return presenter;
}

window.AddonMedia_Recorder_create = AddonMedia_Recorder_create;