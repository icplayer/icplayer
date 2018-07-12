function AddonMathText_create() {
    var presenter = function() {};
    presenter.isShowAnswers = false;
    presenter.state = {
        isVisible: false
    };
    presenter.editor = null;

    presenter.EMPTY_MATHTEXT = '<math xmlns="http://www.w3.org/1998/Math/MathML"/>';
    presenter.ERROR_CODES = {
        'isActivtiy_BL01': "Value provided to isActivity property is not a valid string",
        'initialText_STR02': "Value provided to text property is not a valid string.",
        'correctAnswer_STR02': "Value provided to text property is not a valid string.",
        'Width_INT04': "Value provided to width property must be bigger than 500px.",
        'Height_INT04': "Value provided to height property must be bigger than 200px.",
        "formulaColor_RGB01": "Formula color is not valid string.",
        "formulaColor_RGB02": "Formula color is too long for hex color.",
        "formulaColor_RGB03": "Formula color is not valid hex color.",
        "backgroundColor_RGB01": "Background color is not valid string.",
        "backgroundColor_RGB02": "Background color is too long for hex color.",
        "backgroundColor_RGB03": "Background color is not valid hex color."
    };

    presenter.run = function AddonMathText_run (view, model) {
        presenter.presenterLogic(view, model, false);
    };

    presenter.setPlayerController = function AddonMathText_setPlayerController (playerController) {
        presenter.playerController = playerController;
        presenter.eventBus = playerController.getEventBus();
    };

    presenter.createPreview = function AddonMathText_createPreview (view, model) {
        presenter.presenterLogic(view, model, true);
    };

    presenter.makeRequestForImage = function AddonMathText_makeRequestForImage () {
        // TODO Optimalize image getting
        // TODO przenieść do MathTextPropertyProvider, przy zapisywaniu automatyczne pobieranie obrazków?
        var xmlhttp = new XMLHttpRequest();
        var mathMlParam = presenter.configuration.initialText;
        var imgTypeParam = 'svg';

        var url = "https://www.wiris.net/demo/editor/render?mml=" + mathMlParam + "&format=" + imgTypeParam;


        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == XMLHttpRequest.DONE) {
                if (xmlhttp.status === 200) {
                    presenter.$view.html(xmlhttp.response);
                } else if (xmlhttp.status === 400) {
                    presenter.$view.html("Server returned 400: " + xmlhttp.response);
                } else if (xmlhttp.status === 0) {
                    // MDN: It is worth noting that browsers report a status of 0 in case of XMLHttpRequest errors too
                    presenter.$view.html("Request status 0. Problem with request parameters.");
                } else {
                    presenter.$view.html("Server returned: " + xmlhttp.response);
               }
            }
        };

        xmlhttp.open("GET", url, true);
        xmlhttp.send();
    };

    presenter.validateModel = function MathText_validateModel(model) {
        var modelValidator = new ModelValidator();

        var availableLanugagesCodes = {
            // TODO zmienić na słowniki może
            'Polish': 'pl',
            'English': 'en',
            'Spanish': 'es',
            'Arabic': 'ar',
            'French': 'fr'
        };

        var validatedModel = modelValidator.validate(model, [
            ModelValidators.Boolean("isActivity"),
            ModelValidators.String("initialText", {default: presenter.EMPTY_MATHTEXT}),
            ModelValidators.String("correctAnswer", {default: presenter.EMPTY_MATHTEXT}),
            ModelValidators.utils.FieldRename("Is Visible", "isVisible", ModelValidators.Boolean("isVisible")),
            ModelValidators.utils.FieldRename("Width", "width", ModelValidators.Integer("width", {minValue: 500})),
            ModelValidators.utils.FieldRename("Height", "height", ModelValidators.Integer("height", {minValue: 200})),
            ModelValidators.utils.EnumChangeValues("language", availableLanugagesCodes, ModelValidators.Enum("language", {"default": "English", values: ["Polish", "English", "Spanish", "Arabic", "French"]})),
            ModelValidators.HEXColor("formulaColor", {"default": "#000000", canBeShort: true}),
            ModelValidators.HEXColor("backgroundColor", {"default": "#FFFFFF", canBeShort: false})
        ]);

        return validatedModel;
    };

    presenter.presenterLogic = function AddonMathText_presenterLogic (view, model, isPreview) {
        presenter.view = view;
        presenter.$view = $(view);
        presenter.wrapper = presenter.view.getElementsByClassName('mathtext-editor-wrapper')[0];

        var validatedModel = presenter.validateModel(model);

        if (!validatedModel.isValid) {
            DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, validatedModel.fieldName.join("|") + "_" + validatedModel.errorCode);
            return;
        }
        presenter.configuration = validatedModel.value;

        presenter.initializeView(isPreview);
    };

    presenter.initializeView = function AddonMathText_initializeView (isPreview) {
        presenter.wrapper.style.width = presenter.configuration.width + 'px';
        presenter.wrapper.style.height = presenter.configuration.height + 'px';


        if (!presenter.configuration.isActivity) {
            presenter.initializeText();
        } else {
            presenter.initializeEditor(isPreview);
        }
    };

    presenter.initializeText = function AddonMathText_initializeText() {
        presenter.makeRequestForImage();
    };

    presenter.initializationState = function AddonMathText_initializationState () {
        presenter.state.isVisible = presenter.configuration.isVisible;
    };

    presenter.addHandlers = function AddonMathText_addHandlers () {
        if (presenter.eventBus) {
            presenter.eventBus.addEventListener('ShowAnswers', this);
            presenter.eventBus.addEventListener('HideAnswers', this);
        }
    };

    presenter.initializeEditor = function AddonMathText_initializeEditor (isPreview) {
        console.log(presenter.configuration.formulaColor, presenter.configuration.backgroundColor);
        presenter.editor = window.com.wiris.jsEditor.JsEditor.newInstance(
            {
                'language': presenter.configuration.language,
                'mml': presenter.configuration.initialText,
                'readOnly': isPreview,
                'color': presenter.configuration.formulaColor,
                'backgroundColor': presenter.configuration.backgroundColor
            }
        );

        presenter.editor.insertInto(presenter.wrapper);
    };

    presenter.showAnswers = function AddonMathText_showAnswers () {
        presenter.state.currentAnswer = presenter.editor.getMathML();
        presenter.editor.setMathML(presenter.configuration.correctAnswer);
    };

    presenter.hideAnswers = function AddonMathText_hideAnswers () {
        presenter.editor.setMathML(presenter.state.currentAnswer);
    };


    presenter.reset = function () {
        presenter.setVisibility(presenter.configuration.isVisible);
        if (presenter.configuration.isActivity) {
            presenter.editor.setMathML(presenter.configuration.initialText);
        }
    };

    presenter.onEventReceived = function AddonMathText_onEventReceived (eventName) {
        if (eventName === "ShowAnswers") {
            presenter.showAnswers();
        }
        else if (eventName === "HideAnswers") {
            presenter.hideAnswers();
        }
    };

    presenter.setShowErrorsMode = function AddonMathText_setShowErrorsMode () {
        presenter.currentUserText = presenter.editor.getMathML();

        var builder = window.com.wiris.quizzes.api.QuizzesBuilder.getInstance();
        var request = builder.newEvalRequest(presenter.configuration.correctAnswer, presenter.currentUserText, null, null);
        var service = builder.getQuizzesService();
		var response = service.execute(request);
		// Get the response into this useful object.
		var instance = builder.newQuestionInstance();
		instance.update(response);
		// Ask for the correctness of the 0th response.
		var correct = instance.isAnswerCorrect(0);

		 if (correct) {
            presenter.view.classList.add('correct');
        } else {
            presenter.view.classList.add('wrong');
        }
    };

     presenter.setWorkMode = function AddonMathText_setWorkMode () {
        presenter.view.classList.remove('correct');
        presenter.view.classList.remove('wrong');
    };

     presenter.setVisibility = function AddonMathText_setVisibility (isVisible) {
        presenter.$view.css("visibility", isVisible ? "visible" : "hidden");
        presenter.state.isVisible= isVisible;
    };

     presenter.setState = function (state) {
         var parsedState = JSON.parse(state);

         presenter.editor.setMathML(parsedState.text);
         presenter.setVisibility(parsedState.isVisible);
     };


    presenter.getState = function() {
        var currentText = presenter.configuration.initialText;
        if (presenter.configuration.isActivity && presenter.editor) {
            currentText = presenter.editor.getMathML();
        }
        return JSON.stringify({
            'text': currentText,
            'isVisible': presenter.state.isVisible
        })
    };


    return presenter;
}