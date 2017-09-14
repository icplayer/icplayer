function AddonHeading_create () {

    function getErrorObject (ec) { return { isValid: false, errorCode: ec }; }

    var presenter = function () {};

    presenter.ERROR_CODES = {
        C01: 'Property content cannot be empty.'
    };

    presenter.HEADINGS = {
        'h1': 'H1',
        'h2': 'H2',
        'h3': 'H3',
        'h4': 'H4',
        'h5': 'H5',
        'h6': 'H6',
        DEFAULT: 'h1'
    };

    presenter.run = function (view, model) {
        presenter.presenterLogic(view, model, false);
    };

    presenter.createPreview = function (view, model) {
        presenter.presenterLogic(view, model, true);
    };

    presenter.presenterLogic = function (view, model, isPreview) {
        presenter.$view = $(view);

        presenter.configuration = presenter.validateModel(model);
        if (!presenter.configuration.isValid) {
            DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, presenter.configuration.errorCode);
            return;
        }

        var headingTag = presenter.configuration.heading.toLowerCase();
        var headingString = '<[tag]></[tag]]>'.replace('[tag]', headingTag);
        var $heading = $(headingString);
        $heading.html(presenter.configuration.content);

        presenter.$view.append($heading);
    };

    presenter.validateModel = function (model) {

        if (ModelValidationUtils.isStringEmpty(model.Content)) {
            return getErrorObject('C01');
        }

        return {
            heading: ModelValidationUtils.validateOption(presenter.HEADINGS, model['Heading']),
            content: model.Content,

            ID: model.ID,
            isValid: true,
            isVisible: ModelValidationUtils.validateBoolean(model['Is Visible'])
        };
    };

    presenter.executeCommand = function (name, params) {
        if (!presenter.configuration.isValid) {
            return;
        }

        var commands = {
            'show': presenter.show,
            'hide': presenter.hide
        };

        Commands.dispatch(commands, name, params, presenter);
    };

    presenter.setVisibility = function (isVisible) {
        presenter.configuration.isVisible = isVisible;
        presenter.$view.css("visibility", isVisible ? "visible" : "hidden");
    };

    presenter.show = function () {
        presenter.setVisibility(true);
    };

    presenter.hide = function () {
        presenter.setVisibility(false);
    };

    presenter.reset = function () {};
    presenter.getState = function () {};
    presenter.setState = function (state) {};

    return presenter;
}
