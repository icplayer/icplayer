function AddonMathText_create() {
    var presenter = function() {};

    presenter.state = {
        isVisible: false,
        isShowAnswers: false,
        isCheckAnswers: false,
        currentAnswer: presenter.EMPTY_MATHTEXT
    };
    presenter.editor = null;
    presenter.answerObject = null;

    presenter.EMPTY_MATHTEXT = '<math xmlns="http://www.w3.org/1998/Math/MathML"></math>';
    presenter.ERROR_CODES = {
        'isActivtiy_BL01': "Value provided to isActivity property is not a valid string",
        'initialText_STR02': "Value provided to text property is not a valid string.",
        'correctAnswer_STR02': "Value provided to text property is not a valid string.",
        'width_INT04': "Value provided to width property must be bigger than 500px.",
        'height_INT04': "Value provided to height property must be bigger than 200px.",
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

    presenter.makeRequestForImage = function AddonMathText_makeRequestForImage (text) {
        var xmlhttp = new XMLHttpRequest();
        var mathMlParam = encodeURIComponent(text);
        var imgTypeParam = 'svg';

        var url = "https://www.wiris.net/demo/editor/render?mml=" +  mathMlParam + "&format=" + imgTypeParam;

        if (presenter.loadingImageView) {
            var loadingSrc = DOMOperationsUtils.getResourceFullPath(presenter.playerController, "media/loading.gif");
            if (loadingSrc ) {
                presenter.loadingImageView.setAttribute("src", loadingSrc);
                presenter.loadingImageView.style.visibility = "visible";
            }
        }

        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == XMLHttpRequest.DONE) {
                if (xmlhttp.status === 200) {
                    $(presenter.wrapper).html(xmlhttp.response);
                } else if (xmlhttp.status === 400) {
                    $(presenter.wrapper).html("Server returned 400: " + xmlhttp.response);
                } else if (xmlhttp.status === 0) {
                    // MDN: It is worth noting that browsers report a status of 0 in case of XMLHttpRequest errors too
                    $(presenter.wrapper).html("Request status 0. Problem with request parameters.");
                } else {
                    $(presenter.wrapper).html("Server returned: " + xmlhttp.response);
                }

                $(presenter.wrapper).css('color', presenter.configuration.formulaColor);
                $(presenter.wrapper).find('svg').css('fill', presenter.configuration.formulaColor);
                $(presenter.wrapper).css('background-color', presenter.configuration.backgroundColor);

                if (presenter.loadingImageView) {
                    presenter.loadingImageView.style.visibility = "hidden";
                }
            }
        };

        xmlhttp.open("GET", url, true);
        xmlhttp.send();
    };

    presenter.validateModel = function MathText_validateModel(model) {
        var modelValidator = new ModelValidator();


        // when not in activity mode, width/height can be any value
        var widthConfig = new ConfigurationGenerator(function (validatedModel) {
            return {
                minValue: validatedModel["isActivity"] ? 500 : 0
            };
        });

        var heightConfig = new ConfigurationGenerator(function (validatedModel) {
            return {
                minValue: validatedModel["isActivity"] ? 200 : 0
            };
        });

        var availableLanugagesCodes = {
            // TODO zmienić na słowniki może
            'Polish': 'pl',
            'English': 'en',
            'Spanish': 'es',
            'Arabic': 'ar',
            'French': 'fr'
        };

        var validatedModel = modelValidator.validate(model, [
            ModelValidators.String("ID"),
            ModelValidators.Boolean("isActivity"),
            ModelValidators.String("initialText", {default: presenter.EMPTY_MATHTEXT}),
            ModelValidators.String("correctAnswer", {default: presenter.EMPTY_MATHTEXT}),
            ModelValidators.utils.FieldRename("Is Visible", "isVisible", ModelValidators.Boolean("isVisible")),
            ModelValidators.utils.FieldRename("Width", "width", ModelValidators.Integer("width", widthConfig)),
            ModelValidators.utils.FieldRename("Height", "height", ModelValidators.Integer("height", heightConfig)),
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
        presenter.loadingImageView = presenter.view.getElementsByClassName('loading-image')[0];

        var validatedModel = presenter.validateModel(model);

        if (!validatedModel.isValid) {
            DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, validatedModel.fieldName.join("|") + "_" + validatedModel.errorCode);
            return;
        }
        presenter.configuration = validatedModel.value;

        // when preview, addon always should be visible, when in lesson it should depend on configuration
        presenter.setVisibility(isPreview || presenter.configuration.isVisible);

        presenter.initializeView(isPreview);

        if (!isPreview) {
            presenter.addHandlers();
        }
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
        presenter.makeRequestForImage(presenter.configuration.initialText);
    };

    presenter.initializationState = function AddonMathText_initializationState () {
        presenter.state.isVisible = presenter.configuration.isVisible;
    };

    presenter.addHandlers = function AddonMathText_addHandlers () {
        if (presenter.eventBus) {
            presenter.eventBus.addEventListener('ShowAnswers', this);
            presenter.eventBus.addEventListener('HideAnswers', this);
        }

        if (presenter.configuration.isActivity) {
            presenter.editorListener = {
                caretPositionChanged: function(){},
                clipboardChanged: function () {},
                styleChanged: function () {},
                transformationReceived: function(){},
                contentChanged: presenter.sendValueChangedEvent
            };

            presenter.editor.getEditorModel().addEditorListener(presenter.editorListener);
        }

        presenter.view.addEventListener("DOMNodeRemoved", presenter.removeHandlers);
    };

    presenter.destroy = function AddonMathText_removeHandler () {
        if (presenter.configuration.isActivity) {
            presenter.editor.getEditorModel().addEditorListener(presenter.editorListener);
        }

        presenter.view.removeEventListener("DOMNodeRemoved", presenter.removeHandlers);
    };

    presenter.initializeEditor = function AddonMathText_initializeEditor (isPreview) {
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

        if (isPreview) {
            presenter.$view.find('.wrs_focusElementContainer').css('display', 'none');
            presenter.$view.find('.wrs_handWrapper').css('display', 'none');
        } else {
            var builder = window.com.wiris.quizzes.api.QuizzesBuilder.getInstance();
            var conf = builder.getConfiguration();
            conf.set(window.com.wiris.quizzes.api.ConfigurationKeys.RESOURCES_URL, '/media/icplayer/addons/resources/');
            presenter.answerObject = builder.readQuestion(presenter.configuration.correctAnswer);
        }
    };

    presenter.showAnswers = function AddonMathText_showAnswers () {
        if (presenter.state.isCheckAnswers) {
            presenter.setWorkMode();
        }

        if (presenter.configuration.isActivity && !presenter.state.isShowAnswers) {
            presenter.state.isShowAnswers = true;
            presenter.$view.find('input').attr('disabled', true);
            presenter.state.currentAnswer = presenter.editor.getMathML();
            presenter.editor.setMathML(presenter.answerObject.getCorrectAnswer(0));
            presenter.editor.setToolbarHidden(true);
        }
    };

    presenter.hideAnswers = function AddonMathText_hideAnswers () {
        if (presenter.configuration.isActivity && presenter.state.isShowAnswers) {
            presenter.state.isShowAnswers = false;
            presenter.$view.find('input').removeAttr('disabled');
            presenter.editor.setMathML(presenter.state.currentAnswer);
            presenter.editor.setToolbarHidden(false);
        }
    };

     presenter.setShowErrorsMode = function AddonMathText_setShowErrorsMode () {
        if (presenter.state.isShowAnswers) {
            presenter.hideAnswers();
        }
        if (presenter.configuration.isActivity && !presenter.state.isCheckAnswers) {
            presenter.state.isCheckAnswers = true;
            presenter.state.currentAnswer = presenter.editor.getMathML();

            presenter.$view.find('input').attr('disabled', true);

            presenter.editor.setToolbarHidden(true);
            var correct = presenter.checkIfAnswerIsCorrect();

            if (correct) {
                presenter.wrapper.classList.add('correct');
            } else {
                presenter.wrapper.classList.add('wrong');
            }
        }
    };

    presenter.setWorkMode = function AddonMathText_setWorkMode () {
        if (presenter.state.isCheckAnswers) {
            presenter.state.isCheckAnswers = false;

            presenter.wrapper.classList.remove('correct');
            presenter.wrapper.classList.remove('wrong');

            if (presenter.configuration.isActivity) {
                presenter.$view.find('input').removeAttr('disabled');
                presenter.editor.setMathML(presenter.state.currentAnswer);
                presenter.editor.setToolbarHidden(false);
            }
        }
    };

    presenter.reset = function () {
        presenter.setVisibility(presenter.configuration.isVisible);
        presenter.hideAnswers();

        presenter.state.isShowAnswers = false;
        presenter.setWorkMode();
    };

    presenter.onEventReceived = function AddonMathText_onEventReceived (eventName) {
        if (eventName === "ShowAnswers") {
            presenter.showAnswers();
        }
        else if (eventName === "HideAnswers") {
            presenter.hideAnswers();
        }
    };

    presenter.checkIfAnswerIsCorrect = function() {
        if (!presenter.configuration.isActivity) {
            return false;
        }

        var currentText = presenter.editor.getMathML();

        return presenter.requestForQuizzesCorrectness(currentText);
    };

    presenter.requestForQuizzesCorrectness = function (text) {
        var builder = window.com.wiris.quizzes.api.QuizzesBuilder.getInstance();
        var request = builder.newEvalRequest(presenter.answerObject.getCorrectAnswer(0), text, presenter.answerObject, null);
        var service = builder.getQuizzesService();
        var response = service.execute(request);
        // Get the response into this useful object.
        var instance = builder.newQuestionInstance();
        instance.update(response);
        // Ask for the correctness of the 0th response.
        return instance.isAnswerCorrect(0);
    };

     presenter.setVisibility = function AddonMathText_setVisibility (isVisible) {
         presenter.state.isVisible= isVisible;
         presenter.$view.css("visibility", isVisible ? "visible" : "hidden");
    };

     presenter.setState = function (state) {
         var parsedState = JSON.parse(state);

         if (presenter.configuration.isActivity) {
             presenter.editor.setMathML(parsedState.text);
             presenter.state.currentAnswer = parsedState.text;
         }

         presenter.setVisibility(parsedState.isVisible);
     };


    presenter.getState = function() {
        var currentText = presenter.configuration.initialText;

        if (presenter.configuration.isActivity) {
            currentText = presenter.editor.getMathML();
        }

        return JSON.stringify({
            'text': currentText,
            'isVisible': presenter.state.isVisible
        })
    };

    presenter.getScore = function() {
        if (presenter.configuration.isActivity) {
            return presenter.checkIfAnswerIsCorrect() ? 1 : 0;
        }
        return 0;
    };

    presenter.getErrorCount = function () {
        if (presenter.isActivity) {
            return presenter.checkIfAnswerIsCorrect() ? 0 : 1;
        }
        return 0;
    };

    presenter.getMaxScore = function () {
        return presenter.configuration.isActivity ? 1 : 0;
    };

    presenter.sendValueChangedEvent = function () {
        if (!presenter.state.isCheckAnswers && !presenter.state.isShowAnswers) {
            presenter.eventBus.sendEvent('ValueChanged', {
                source: presenter.configuration.ID,
                item: '0',
                value: '',
                score: presenter.getScore()
            });
        }
    };


    return presenter;
}