function AddonMathText_create() {
    var presenter = function() {};
    presenter.isShowAnswers = false;
    presenter.state = {
        isVisible: false
    };
    presenter.editor = null;

    presenter.EMPTY_MATHTEXT = '<math xmlns="http://www.w3.org/1998/Math/MathML"/>';
    presenter.ERROR_CODES = {
        'BL01': "Value provided to boolean property is not a valid string",
        'STR02': "Value provided in property is not a valid string."
    };

    presenter.setPlayerController = function (controller) {
        presenter.playerController = controller;
    };

    presenter.run = function (view, model) {
        presenter.presenterLogic(view, model);
    };

    presenter.setPlayerController = function AddonMathText_setPlayerController(playerController) {
        presenter.playerController = playerController;
        presenter.eventBus = playerController.getEventBus();
    };

    presenter.createPreview = function (view, model) {
        var $view = $(view);
        var validatedModel = presenter.validateModel(model);
        if (!validatedModel.isValid) {
            $view.html(validatedModel.errorCode + ': ' + presenter.ERROR_CODES[validatedModel.errorCode]);
        } else {
            presenter.makeRequestForImage($view, validatedModel.value);
        }
    };

    presenter.makeRequestForImage = function ($view, model) {
        // TODO Optimalize image getting
        var xmlhttp = new XMLHttpRequest();
        var mathMlParam = model.text;
        var imgTypeParam = 'svg';

        var url = "https://www.wiris.net/demo/editor/render?mml=" + mathMlParam + "&format=" + imgTypeParam;


        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == XMLHttpRequest.DONE) {
                if (xmlhttp.status === 200) {
                    $view.html(xmlhttp.response);
                } else if (xmlhttp.status === 400) {
                    $view.html("Server returned 400: " + xmlhttp.response);
                } else if (xmlhttp.status === 0) {
                    // MDN: It is worth noting that browsers report a status of 0 in case of XMLHttpRequest errors too
                    $view.html("Request status 0. Problem with request parameters.");
                } else {
                    $view.html("Server returned: " + xmlhttp.response);
               }
            }
        };

        xmlhttp.open("GET", url, true);
        xmlhttp.send();
    };

    presenter.validateModel = function MathText_validateModel(model) {
        var modelValidator = new ModelValidator();

        var validatedModel = modelValidator.validate(model, [
            ModelValidators.Boolean("isActivity"),
            ModelValidators.String("text", {default: presenter.EMPTY_MATHTEXT}),
            ModelValidators.utils.FieldRename("Is Visible", "isVisible", ModelValidators.Boolean("isVisible"))
        ]);

        return validatedModel;
    };

    presenter.presenterLogic = function (view, model) {
        presenter.view = view;
        presenter.$view = $(view);

        var validatedModel = presenter.validateModel(model);

        if (validatedModel.isValid) {
            presenter.configuration = validatedModel.value;
        } else {
            presenter.$view.html(validatedModel.errorCode);
            return;
        }

        if (presenter.eventBus) {
            presenter.eventBus.addEventListener('ShowAnswers', this);
            presenter.eventBus.addEventListener('HideAnswers', this);
        }

        presenter.state.isVisible = presenter.configuration.isVisible;

        if (!presenter.configuration.isActivity) {
            presenter.createPreview(view, model);
        } else {
            presenter.initializeEditor(presenter.configuration.text);
        }
    };

    presenter.initializeEditor = function (initialMathML) {
        presenter.editor = window.com.wiris.jsEditor.JsEditor.newInstance({'display': 'inline', 'mml': initialMathML});

        var wrapper = presenter.view.getElementsByClassName('wrapper');
        presenter.editor.insertInto(wrapper[0]);
    };

    presenter.showAnswers = function () {
        // TODO in future
        return false;
    };

    presenter.hideAnswers = function () {
        // TODO in future
        return false;
    };


    presenter.onEventReceived = function (eventName) {
        if (eventName === "ShowAnswers") {
            presenter.showAnswers();
        }
        else if (eventName === "HideAnswers") {
            presenter.hideAnswers();
        }
    };

    presenter.setShowErrorsMode = function () {
        // TODO in future
        return false;

        /*
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
        } */
    };

     presenter.setWorkMode = function () {
        presenter.view.classList.remove('correct');
        presenter.view.classList.remove('wrong');
    };

     presenter.setVisibility = function(isVisible) {
        presenter.$view.css("visibility", isVisible ? "visible" : "hidden");
        presenter.state.isVisible= isVisible;
    };

     presenter.setState = function (state) {
         var parsedState = JSON.parse(state);
         console.log('a ' + parsedState);
         if (presenter.configuration.isActivity) {
             presenter.editor.setMathML(parsedState.text);
         }

         presenter.setVisibility(parsedState.isVisible);
     };


    presenter.getState = function() {
        var currentText = presenter.EMPTY_MATHTEXT;
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