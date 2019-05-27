function AddonMathFormula_create() {
    var presenter = function (){};

    var ERROR_CODES = {
        "M1": "The math data is improperly formed"
    };

    presenter.run = function (view, model) {
        presenter.initialize(view, model);
    };

    presenter.createPreview = function (view, model) {
        presenter.initialize(view, model);
    };

    function validateXML(xml) {
        var parser = new DOMParser();
        var parsedDOM = parser.parseFromString(xml, "text/xml");
        var isValid = parsedDOM.getElementsByTagName('parsererror').length == 0;
        return isValid;
    }

    presenter.validateModel = function(model) {
        if (!validateXML(model["math text"])) {
            return {
                isError: true,
                errorCode: "M1"
            }
        }

        return {
            mathML: model["math text"],
            isError: false
        }
    };

    presenter.initialize = function (view, model)  {
        presenter.configuration = presenter.validateModel(model);

        presenter.view = view;
        presenter.$view = $(view);
        presenter.$container = presenter.$view.find(".addon-MathFormula-container");

        if (presenter.configuration.isError) {
            presenter.$container.html(ERROR_CODES[presenter.configuration.errorCode])
        } else {
            presenter.$container.html(presenter.configuration.mathML);
        }
    };

    presenter.destroy = function (event) {
    };


    presenter.setVisibility = function (isVisible) {
        if (isVisible) {
            presenter.$view.css("display", "");
            presenter.$view.css("visibility", "visible");
        } else {
            presenter.$view.css("display", "none");
            presenter.$view.css("visibility", "hidden");
        }
    };

    presenter.show = function () {
        presenter.setVisibility(true);
    };

    presenter.hide = function () {
        presenter.setVisibility(false);
    };

    presenter.executeCommand = function (name, params) {
        var commands = {
            'show': presenter.show,
            'hide': presenter.hide
        };
        Commands.dispatch(commands, name, params, presenter);
    };

    return presenter;
}