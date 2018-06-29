function AddonMathText_create() {
    var presenter = function() {};
    presenter.isShowAnswers = false;

    presenter.EMPTY_MATHTEXT = '<math xmlns="http://www.w3.org/1998/Math/MathML"/>';

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
            $view.html(validatedModel.errorCode);
        } else {
            presenter.makeRequestForImage($view, validatedModel.value);
        }
    };

    presenter.makeRequestForImage = function ($view, model) {
        // TODO Optimalize image getting
        var xmlhttp = new XMLHttpRequest();
        var mathMlParam = model.text;
        var imgTypeParam = model.imageType;

        var url = "http://www.wiris.net/demo/editor/render?mml=" + mathMlParam + "&format=" + imgTypeParam;


        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == XMLHttpRequest.DONE) {
                if (xmlhttp.status == 200) {
                    presenter.handleResponse(xmlhttp.response, $view, imgTypeParam);
                    // $view.html(xmlhttp.response);
                } else if (xmlhttp.status == 400) {
                    $view.html("Problem with getting image" + xmlhttp.response);
                } else {
                    $view.html("Something went wrong: \n" + xmlhttp.response);
               }
            }
        };

        xmlhttp.open("GET", url, true);
        xmlhttp.send();
    };

    presenter.handleResponse = function (response, $view, imgType) {
        console.log(imgType);
        if (imgType === 'png') {
            var img = document.createElement('img');
            img.setAttribute('src', response);
            $view.append(img);
        } else {
            $view.html(response);
        }
    };

    presenter.validateModel = function MathText_validateModel(model) {
        var modelValidator = new ModelValidator();

        var validatedModel = modelValidator.validate(model, [
            ModelValidators.Boolean("isUserFilled"),
            ModelValidators.String("text", {default: presenter.EMPTY_MATHTEXT}),
            ModelValidators.Enum("imageType", {default: 'svg', values: ['png', 'svg', 'svf']})
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

        if (!presenter.configuration.isUserFilled) {
            presenter.createPreview(view, model);
        } else {
            presenter.initializeEditor(presenter.configuration.text);
        }
    };

    presenter.initializeEditor = function (initialMathML) {
        presenter.editor = window.com.wiris.jsEditor.JsEditor.newInstance({});

        var wrapper = presenter.view.getElementsByClassName('wrapper');
        presenter.editor.insertInto(wrapper[0]);
        presenter.editor.setMathML(initialMathML);
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
        if (eventName == "ShowAnswers") {
            presenter.showAnswers();
        }
        if (eventName == "HideAnswers") {
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


    return presenter;
}