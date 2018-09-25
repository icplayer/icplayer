function AddonMathText_create() {
    var presenter = function() {};

    presenter.state = {
        isVisible: false,
        isDisabled: false,
        isShowAnswers: false,
        isCheckAnswers: false,
        currentAnswer: presenter.EMPTY_MATHTEXT,
        wasChanged: false, // for checking if user has made changes since last answer check
        lastScore: 0,
        hasUserInteracted: false // for checking if user has interacted with addon
    };
    presenter.editor = null;
    presenter.answerObject = null;

    presenter.TYPES_DEFINITIONS = {
        TEXT: 'text',
        EDITOR: 'editor',
        ACTIVITY: 'activity'
    };

    presenter.EMPTY_MATHTEXT = '<math xmlns="http://www.w3.org/1998/Math/MathML"/>';
    presenter.WIRIS_RENDER_URL = "https://www.wiris.net/demo/editor/render?";
    presenter.ERROR_CODES = {
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

        var url = presenter.WIRIS_RENDER_URL + "mml=" +  mathMlParam + "&format=" + imgTypeParam;

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

        // when not showing wiris editor, width/height can be any value
        var widthConfig = new ConfigurationGenerator(function (validatedModel) {
            return {
                minValue: validatedModel["type"] !== presenter.TYPES_DEFINITIONS.TEXT ? 500 : 0
            };
        });

        var heightConfig = new ConfigurationGenerator(function (validatedModel) {
            return {
                minValue: validatedModel["type"] !== presenter.TYPES_DEFINITIONS.TEXT ? 200 : 0
            };
        });

        var availableLanugagesCodes = {
            'Polish': 'pl',
            'English': 'en',
            'Spanish': 'es',
            'Arabic': 'ar',
            'French': 'fr'
        };

        var validatedModel = modelValidator.validate(model, [
            ModelValidators.String("ID"),
            ModelValidators.Enum("type", {"default": "activity", values: ["text", "editor", "activity"]}),
            ModelValidators.Boolean("isDisabled"),
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

    presenter.setAdditionalConfigBasedOnType = function(type) {
        if (type === presenter.TYPES_DEFINITIONS.TEXT) {
            presenter.configuration.isActivity = false;
            presenter.configuration.showEditor = false;
        } else if (type === presenter.TYPES_DEFINITIONS.EDITOR) {
            presenter.configuration.isActivity = false;
            presenter.configuration.showEditor = true;
        } else if (type === presenter.TYPES_DEFINITIONS.ACTIVITY){
            presenter.configuration.isActivity = true;
            presenter.configuration.showEditor = true;
        }
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

        presenter.setAdditionalConfigBasedOnType(presenter.configuration['type']);

        presenter.initializeView(isPreview);

        // when preview, addon always should be visible, when in lesson it should depend on configuration
        presenter.setVisibility(isPreview || presenter.configuration.isVisible);
        presenter.setDisabled(presenter.configuration.isDisabled);

        if (!isPreview) {
            presenter.addHandlers();
        }

        // added in preview too, so it won't slow editor down
        if (presenter.configuration.showEditor) {
            presenter.view.addEventListener("DOMNodeRemoved", presenter.destroy);
        }
    };

    presenter.initializeView = function AddonMathText_initializeView (isPreview) {
        presenter.wrapper.style.width = presenter.configuration.width + 'px';
        presenter.wrapper.style.height = presenter.configuration.height + 'px';


        if (presenter.configuration.showEditor) {
            presenter.initializeEditor(isPreview);
        } else {
            presenter.initializeText();
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

        if (presenter.configuration.showEditor) {
            presenter.editorListener = {
                caretPositionChanged: function() {},
                clipboardChanged: function () {},
                styleChanged: function () {},
                transformationReceived: function(){},
                contentChanged: function(editor) {
                    // comparing texts fixes problem with userInteraction and hideAnswer
                    // when using setMathML WIRIS editor needs to make request to WIRIS API,
                    // so this callback will be called asynchronusly after request response,
                    // but after state.isShowAnswers was already changed in normal execution
                    var currentText = editor.getMathML();
                    if (presenter.editor.isReady() &&
                        !presenter.state.isShowAnswers &&
                        !presenter.state.isCheckAnswers &&
                        currentText !== presenter.state.currentAnswer
                    ) {
                        presenter.state.wasChanged = true;
                        presenter.state.hasUserInteracted = true;
                    }
                }
            };

            presenter.editor.getEditorModel().addEditorListener(presenter.editorListener);
        }
    };

    presenter.destroy = function AddonMathText_removeHandler (event) {
        if (event.target !== this) {
            return;
        }

        if (presenter.configuration.showEditor) {
            presenter.editor.getEditorModel().removeEditorListener(presenter.editorListener);
            presenter.removeWIRISEditor();
        }
        presenter.view.removeEventListener("DOMNodeRemoved", presenter.destroy);
    };

    presenter.removeWIRISEditor = function () {
        window.com.wiris.jsEditor.JsEditor.removeInstance(presenter.wrapper);
    };

    presenter.getWIRISEditor = function() {
        return window.com.wiris.jsEditor.JsEditor.getInstance(presenter.wrapper);
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
            presenter.answerObject = builder.readQuestion(presenter.configuration.correctAnswer);

            // when initial text is correct answer
            presenter.state.lastScore = presenter.checkIfAnswerIsCorrect(presenter.configuration.initialText) ? 1 : 0;
        }
    };

    presenter.showAnswers = function AddonMathText_showAnswers () {
        if (presenter.state.isCheckAnswers) {
            presenter.setWorkMode();
        }

        if (presenter.configuration.isActivity && presenter.configuration.showEditor && !presenter.state.isShowAnswers) {
            presenter.state.isShowAnswers = true;
            presenter.$view.find('input').attr('disabled', true);
            presenter.state.currentAnswer = presenter.editor.getMathML();
            presenter.editor.setMathML(presenter.answerObject.getCorrectAnswer(0));
            presenter.editor.setToolbarHidden(true);
        }
    };

    presenter.hideAnswers = function AddonMathText_hideAnswers () {
        if (presenter.configuration.isActivity && presenter.configuration.showEditor && presenter.state.isShowAnswers) {
            presenter.editor.setMathML(presenter.state.currentAnswer);
            presenter.editor.setToolbarHidden(false);
            presenter.$view.find('input').removeAttr('disabled');
            presenter.state.isShowAnswers = false;
            presenter.setDisabled(presenter.state.isDisabled);
        }
    };

     presenter.setShowErrorsMode = function AddonMathText_setShowErrorsMode () {
        if (presenter.state.isShowAnswers) {
            presenter.hideAnswers();
        }

        if (presenter.configuration.isActivity && presenter.configuration.showEditor && !presenter.state.isCheckAnswers) {
            presenter.state.isCheckAnswers = true;

            presenter.state.currentAnswer = presenter.editor.getMathML();

            if (presenter.state.hasUserInteracted) {
                presenter.$view.find('input').attr('disabled', true);
                presenter.editor.setToolbarHidden(true);
                var score = presenter.getScore();

                if (score === 1) {
                    presenter.wrapper.classList.add('correct');
                } else {
                    presenter.wrapper.classList.add('wrong');
                }
            }
        }
    };

    presenter.setWorkMode = function AddonMathText_setWorkMode () {
        if (presenter.state.isCheckAnswers) {
            presenter.wrapper.classList.remove('correct');
            presenter.wrapper.classList.remove('wrong');

            if (presenter.configuration.isActivity && presenter.configuration.showEditor) {
                presenter.$view.find('input').removeAttr('disabled');
                presenter.editor.setToolbarHidden(false);
            }

            presenter.state.isCheckAnswers = false;
            presenter.setDisabled(presenter.state.isDisabled);
        }
    };

    presenter.reset = function () {
        presenter.setVisibility(presenter.configuration.isVisible);
        presenter.setDisabled(presenter.configuration.isDisabled);

        presenter.state.isCheckAnswers = false;
        presenter.state.isShowAnswers = false;

        presenter.wrapper.classList.remove('correct');
        presenter.wrapper.classList.remove('wrong');

        presenter.state.wasChanged = false;
        presenter.state.hasUserInteracted = false;

        if (presenter.configuration.isActivity && presenter.configuration.showEditor) {
            presenter.editor.setMathML(presenter.configuration.initialText);
            presenter.editor.setToolbarHidden(false);
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

    presenter.checkIfAnswerIsCorrect = function(userText) {
        if (!presenter.configuration.isActivity) {
            return false;
        }

        // special case - user defined empty text as correct answer and userText is string equal to empty mathml
        var correctAnswerText = presenter.answerObject.getCorrectAnswer(0);
        if (correctAnswerText === '' && userText === presenter.EMPTY_MATHTEXT) {
            return true;
        } else if (correctAnswerText === null) { // correct answer isn't defined
            return false;
        }

        return presenter.requestForQuizzesCorrectness(correctAnswerText, userText);
    };

    presenter.requestForQuizzesCorrectness = function (correctAnwser, userText) {
        var builder = window.com.wiris.quizzes.api.QuizzesBuilder.getInstance();

        var request = builder.newEvalRequest(correctAnwser, userText, presenter.answerObject, null);
        var service = builder.getQuizzesService();
        var response = service.execute(request);
        // Get the response into this useful object.
        var instance = builder.newQuestionInstance();
        instance.update(response);
        // Ask for the correctness of the 0th response.
        return instance.isAnswerCorrect(0);
    };

     presenter.setVisibility = function AddonMathText_setVisibility (isVisible) {
         presenter.state.isVisible = isVisible;
         presenter.$view.css("visibility", isVisible ? "visible" : "hidden");
    };

     presenter.setDisabled = function(value) {
         if (presenter.configuration.isActivity) {
             presenter.setWorkMode();
             presenter.hideAnswers();

             presenter.state.isDisabled = value;

             if (value) {
                 presenter.$view.find('input').attr('disabled', true);
             } else {
                 presenter.$view.find('input').removeAttr('disabled');
             }

             if (presenter.configuration.showEditor) {
                 presenter.editor.setToolbarHidden(value);
             }
         }
    };

     presenter.setState = function (state) {
         var parsedState = JSON.parse(state);

         if (presenter.configuration.isActivity) {
             presenter.editor.setMathML(parsedState.text);
             presenter.state.currentAnswer = parsedState.text;
         }

         presenter.state.hasUserInteracted = parsedState.hasUserInteracted;
         presenter.setVisibility(parsedState.isVisible);
         presenter.setDisabled(parsedState.isDisabled)
     };


    presenter.getState = function() {
        var currentText = presenter.configuration.initialText;

        if (presenter.configuration.isActivity) {
            currentText = presenter.editor.getMathML();
        }

        return JSON.stringify({
            'text': currentText,
            'isVisible': presenter.state.isVisible,
            'hasUserInteracted': presenter.state.hasUserInteracted,
            'isDisabled': presenter.state.isDisabled
        })
    };

    presenter.getScore = function() {
        if (presenter.state.isShowAnswers) {
            presenter.hideAnswers();
        }

        var score = 0;
        if (presenter.configuration.isActivity && presenter.configuration.showEditor) {
            if (presenter.state.wasChanged) {
                score = presenter.checkIfAnswerIsCorrect(presenter.editor.getMathML()) ? 1 : 0;
                presenter.state.wasChanged = false;
                presenter.state.lastScore = score;
                presenter.sendScoreChangedEvent(score);
            } else {
                score = presenter.state.lastScore;
            }
        }

        return score;
    };

    presenter.getErrorCount = function () {
        if (presenter.configuration.isActivity) {
            return 1 - presenter.getScore();
        }
        return 0;
    };

    presenter.getMaxScore = function () {
        return presenter.configuration.isActivity ? 1 : 0;
    };

    presenter.sendScoreChangedEvent = function (score) {
        var eventData = {
                source: presenter.configuration.ID,
                item: '0',
                value: 1,
                score: score
        };

        presenter.sendValueChangedEvent(eventData);
    };

    presenter.sendValueChangedEvent = function (eventData) {
        presenter.eventBus.sendEvent('ValueChanged', eventData);
    };

    presenter.show = function () {
        presenter.setVisibility(true);
    };

    presenter.hide = function () {
        presenter.setVisibility(false);
    };

    presenter.disable = function() {
        presenter.setDisabled(true);
    };

    presenter.enable = function() {
        presenter.setDisabled(false);
    };

    presenter.executeCommand = function(name, params) {
        var commands = {
            'show': presenter.show,
            'hide': presenter.hide,
            'showAnswers' : presenter.showAnswers,
            'hideAnswers' : presenter.hideAnswers,
            'enable': presenter.enable,
            'disable': presenter.disable
        };

        Commands.dispatch(commands, name, params, presenter);
    };


    return presenter;
}