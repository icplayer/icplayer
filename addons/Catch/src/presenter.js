function AddonCatch_create() {
    var presenter = function () {};

    function returnErrorObject (ec) { return { isValid: false, errorCode: ec }; }
    function returnCorrectObject (v) { return { isValid: true, value: v }; }

    presenter.ERROR_CODES = {

    };

    presenter.setPlayerController = function (controller) {
        presenter.playerController = controller;
    };

    function parseTest (text) {
        return returnCorrectObject(text);
    }

    presenter.validateModel = function (model) {
        var validatedTest = parseTest(model['Test']);
        if (!validatedTest.isValid) {
            return returnErrorObject(validatedTest.errorCode);
        }

        return {
            test: validatedTest.value,

            ID: model.ID,
            isVisible: ModelValidationUtils.validateBoolean(model['Is Visible']),
            isValid: true
        }
    };

    presenter.presenterLogic = function (view, model, isPreview) {
        presenter.configuration = presenter.validateModel(model);
    };

    presenter.run = function (view, model) {
        presenter.presenterLogic(view, model, false);
    };

    presenter.createPreview = function (view, model) {
        presenter.presenterLogic(view, model, true);
    };

    presenter.onEventReceived = function (eventName, eventData) {

    };

    presenter.reset = function () {

    };

    presenter.setShowErrorsMode = function () {

    };

    presenter.setWorkMode = function () {

    };

    return presenter;
}