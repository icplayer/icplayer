function AddonHeading_create () {

    function getErrorObject (ec) { return { isValid: false, errorCode: ec }; }

    var isVisibleByDefault = true;
    var isWCAGOn = false;
    var playerController = null;
    var textParser = null;

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

        model = presenter.upgradeModel(model);
        presenter.configuration = presenter.validateModel(model);
        if (!presenter.configuration.isValid) {
            DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, presenter.configuration.errorCode);
            return;
        }

        var headingString = '<[tag]></[tag]]>'.replace('[tag]', presenter.configuration.heading);
        var $heading = $(headingString);

        var parsedContent = presenter.configuration.content;
        if (textParser != null) {
            parsedContent = textParser.parseAltTexts(parsedContent);
        } else if (isPreview) {
            parsedContent = parsedContent.replace(/\\alt{([^{}|]*?)\|[^{}|]*?}(\[[a-zA-Z0-9_\- ]*?\])*/g, '$1'); // replace \alt{a|b}[c] with
            parsedContent = parsedContent.replace(/\\alt{([^|{}]*?)\|[^|{}]*?}/g, '$1'); // replace \alt{a|b} with a
        }
        $heading.html(parsedContent);

        if (presenter.configuration.isTabindexEnabled) {
            $heading.attr("tabindex", "0");
        }

        presenter.$view.append($heading);
    };

    presenter.upgradeModel = function (model) {
        return presenter.upgradeFrom_01(model);
    };

    presenter.upgradeFrom_01 = function (model) {
        var upgradedModel = {};
        $.extend(true, upgradedModel, model); // Deep copy of model object

        if (!upgradedModel["langAttribute"]) {
            upgradedModel["langAttribute"] = "";
        }

        return upgradedModel;
    };

    presenter.validateModel = function (model) {
        if (ModelValidationUtils.isStringEmpty(model.Content)) {
            return getErrorObject('C01');
        }

        return {
            heading: ModelValidationUtils.validateOption(presenter.HEADINGS, model['Heading']).toLowerCase(),
            content: model.Content,

            ID: model.ID,
            isValid: true,
            isVisible: ModelValidationUtils.validateBoolean(model['Is Visible']),
            isTabindexEnabled: ModelValidationUtils.validateBoolean(model['Is Tabindex Enabled']),
            langTag: model['langAttribute']
        };
    };

    presenter.executeCommand = function (name, params) {
        if (!presenter.configuration.isValid) {
            return;
        }

        isVisibleByDefault = presenter.configuration.isVisible;

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

    presenter.reset = function () {
        presenter.setVisibility(isVisibleByDefault);
    };

    presenter.getState = function () {
        return JSON.stringify({
            isVisible: presenter.configuration.isVisible
        });
    };

    presenter.setState = function (state) {
        if (ModelValidationUtils.isStringEmpty(state)) return;

        var parsed = JSON.parse(state);
        var isVisible = parsed.isVisible;
        presenter.setVisibility(isVisible);
    };

    presenter.setPlayerController = function (controller) {

        playerController = controller;

        textParser = new TextParserProxy(controller.getTextParser());
    };

    presenter.getTextToSpeechOrNull = function (playerController) {
        if (playerController) {
            return playerController.getModule('Text_To_Speech1');
        }

        return null;
    };

    presenter.setWCAGStatus = function (isOn) {
        isWCAGOn = isOn;
    };

    presenter.keyboardController = function(keyCode, isShift, event) {
        event.preventDefault();
        if (keyCode == window.KeyboardControllerKeys.ENTER || keyCode == window.KeyboardControllerKeys.SPACE) {
            presenter.readContent();
        }
    };

    function speak (data) {
        var tts = presenter.getTextToSpeechOrNull(playerController);

        if (tts && isWCAGOn) {
            tts.speak(data);
        }
    }

    presenter.readContent = function() {
        var ttr = window.TTSUtils.getTextVoiceArrayFromElement(presenter.$view,presenter.configuration.langTag);
        speak(ttr);
    };

    presenter.isEnterable = function(){ return false;};

    presenter.getPrintableHTML = function (model, showAnswers) {
        var model = presenter.upgradeModel(model);
        var configuration = presenter.validateModel(model);

        var $root = $('<div></div>');
        $root.attr('id',configuration.ID);
        $root.addClass('printable_addon_Heading');
        $root.css("max-width", model["Width"]+"px");
        $root.css("min-height", model["Height"]+"px");

        var $heading = $('<[tag]></[tag]]>'.replace('[tag]', configuration.heading));
        var parsedContent = configuration.content;
        parsedContent = parsedContent.replace(/\\alt{([^{}|]*?)\|[^{}|]*?}(\[[a-zA-Z0-9_\- ]*?\])*/g, '$1'); // replace \alt{a|b}[c] with
        parsedContent = parsedContent.replace(/\\alt{([^|{}]*?)\|[^|{}]*?}/g, '$1'); // replace \alt{a|b} with a
        $heading.html(parsedContent);
        $root.append($heading);

        return $root[0].outerHTML;
    };

    return presenter;
}
