function AddonMathText_create() {
    var presenter = function() {};

    presenter.state = {
        isVisible: false,
        isDisabled: false,
        isShowAnswers: false,
        isCheckAnswers: false,
        currentAnswer: presenter.EMPTY_MATHTEXT,
        wasChanged: true, // for checking if user has made changes since last answer check
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

    presenter.WIRIS_DISABLED_MESSAGE = "This addon requires internet access and enabled Wiris to work correctly";

    presenter.EMPTY_MATHTEXT = '<math xmlns="http://www.w3.org/1998/Math/MathML"/>';
    presenter.WIRIS_RENDER_URL = "https://www.wiris.net/client/editor/render?";
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
                    var sanitizedResponse = window.xssUtils.sanitize(xmlhttp.response);
                    $(presenter.wrapper).html(sanitizedResponse);
                } else {
                    $(presenter.wrapper).html(presenter.WIRIS_DISABLED_MESSAGE);
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

        var mathEditorInPopup = model["mathEditorInPopup"].toLowerCase() == "true";
        var hasMinSize = (model["type"] !== presenter.TYPES_DEFINITIONS.TEXT) && !mathEditorInPopup;
        // when not showing wiris editor, width/height can be any value
        var widthConfig = new ModelValidators.utils.FieldConfigGenerator(function (validatedModel) {
            return {
                minValue: hasMinSize ? 500 : 0
            };
        });

        var heightConfig = new ModelValidators.utils.FieldConfigGenerator(function (validatedModel) {
            return {
                minValue: hasMinSize ? 200 : 0
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
            ModelValidators.HEXColor("backgroundColor", {"default": "#FFFFFF", canBeShort: false}),
            ModelValidators.Boolean("mathEditorInPopup")
        ]);

        if (!validatedModel.isValid) {
            return validatedModel;
        }

        presenter.setAdditionalConfigBasedOnType(validatedModel.value, validatedModel.value['type']);
        presenter.setButtonTextConfig(validatedModel.value, model);

        return validatedModel;
    };

    presenter.setAdditionalConfigBasedOnType = function(configuration, type) {
        // only when type is activity set isActivity to true - addon will return scores and react to commands like show/hide/check/uncheck answers
        if (type === presenter.TYPES_DEFINITIONS.TEXT) {
            configuration.isActivity = false;
            configuration.showEditor = false;
        } else if (type === presenter.TYPES_DEFINITIONS.EDITOR) {
            configuration.isActivity = false;
            configuration.showEditor = true;
        } else if (type === presenter.TYPES_DEFINITIONS.ACTIVITY){
            configuration.isActivity = true;
            configuration.showEditor = true;
        }
    };

    presenter.setButtonTextConfig = function(configuration, model) {
        var buttonTexts = {
            cancel: 'CANCEL',
            save: 'SAVE'
        }
        if (model['popupTexts']) {
            var cancelText = model['popupTexts']['cancel']['cancel'];
            if (cancelText && cancelText.trim().length > 0) {
                buttonTexts.cancel = cancelText;
            }
            var saveText = model['popupTexts']['save']['save'];
            if (saveText && saveText.trim().length > 0) {
                buttonTexts.save = saveText;
            }
        }
        configuration.buttonTexts = buttonTexts;
    }

    presenter.upgradeModel = function(model) {
        return presenter.addMathEditorInPopup(model);
    }

    presenter.addMathEditorInPopup = function(model) {
        var upgradedModel = {};
        $.extend(true, upgradedModel, model);

        if (upgradedModel['mathEditorInPopup'] === undefined) {
            upgradedModel['mathEditorInPopup'] = "False";
        }

        if (upgradedModel['popupTexts'] === undefined) {
            upgradedModel['popupTexts'] = {
                cancel: {cancel: ''},
                save: {save: ''}
            }
        }

        return upgradedModel;
    }

    presenter.presenterLogic = function AddonMathText_presenterLogic (view, model, isPreview) {
        presenter.view = view;
        presenter.$view = $(view);
        presenter.wrapper = presenter.view.getElementsByClassName('mathtext-editor-wrapper')[0];
        presenter.loadingImageView = presenter.view.getElementsByClassName('loading-image')[0];
        var upgradedModel = presenter.upgradeModel(model);
        var validatedModel = presenter.validateModel(upgradedModel);

        if (!validatedModel.isValid) {
            DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, validatedModel.fieldName.join("|") + "_" + validatedModel.errorCode);
            return;
        }
        presenter.configuration = validatedModel.value;

        presenter.initializeView(isPreview);

        // when preview, addon always should be visible, when in lesson it should depend on configuration
        presenter.setVisibility(isPreview || presenter.configuration.isVisible);
        presenter.setDisabled(presenter.configuration.isDisabled);

        if (!isPreview) {
            presenter.addHandlers();
        }

        // added in preview too, so it won't slow editor down
        if (presenter.configuration.showEditor) {
            MutationObserverService.createDestroyObserver(presenter.configuration.ID, presenter.destroy, presenter.view);
            MutationObserverService.setObserver();
        }
    };

    presenter.initializeView = function AddonMathText_initializeView (isPreview) {
        presenter.wrapper.style.width = presenter.configuration.width + 'px';
        presenter.wrapper.style.height = presenter.configuration.height + 'px';


        if (presenter.configuration.showEditor) {
            if (presenter.configuration.mathEditorInPopup) {
                presenter.initializePopupEditor(isPreview);
            } else {
                presenter.initializeEditor(isPreview);
            }
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

        if (!presenter.isWirisEnabled()) return;

        if (presenter.configuration.isActivity) {
            presenter.editorListener = {
                caretPositionChanged: function () {},
                clipboardChanged: function () {},
                styleChanged: function () {},
                transformationReceived: function () {},
                contentChanged: function (editor) {
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
        if (event.target !== presenter.view) {
            return;
        }

        if (presenter.configuration.showEditor && presenter.isWirisEnabled()) {
            presenter.editor.getEditorModel().removeEditorListener(presenter.editorListener);
            presenter.removeWIRISEditor();
        }
    };

    presenter.removeWIRISEditor = function () {
        window.com.wiris.jsEditor.JsEditor.removeInstance(presenter.wrapper);
    };

    presenter.getWIRISEditor = function() {
        return window.com.wiris.jsEditor.JsEditor.getInstance(presenter.wrapper);
    };

    presenter.isWirisEnabled = function() {
        return window.hasOwnProperty('com') && window.com.hasOwnProperty('wiris');
    };

    presenter.initializeEditor = function AddonMathText_initializeEditor (isPreview) {
        if (!presenter.isWirisEnabled()) {
            $(presenter.wrapper).html(presenter.WIRIS_DISABLED_MESSAGE);
            return;
        }

        presenter.editor = createWirisEditor();
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

    presenter.initializePopupEditor = function AddonMathText_initializePopupEditor (isPreview) {
        if (!presenter.isWirisEnabled()) {
            $(presenter.wrapper).html(presenter.WIRIS_DISABLED_MESSAGE);
            return;
        }

        presenter.createWirisPopup(isPreview);
        presenter.editor.insertInto(presenter.editorPopupEditor);
        presenter.wrapper.addEventListener('click', presenter.showPopup);

        if (!isPreview) {
            presenter.resetPopupPosition();
            var builder = window.com.wiris.quizzes.api.QuizzesBuilder.getInstance();
            presenter.answerObject = builder.readQuestion(presenter.configuration.correctAnswer);
            presenter.state.lastScore = presenter.checkIfAnswerIsCorrect(presenter.configuration.initialText) ? 1 : 0;
        }
        presenter.makeRequestForImage(presenter.configuration.initialText);
    };

    presenter.createWirisPopup = function AddonMathText_createWirisPopup (isPreview) {
        presenter.editor = createWirisEditor();

        presenter.editorPopupWrapper = document.createElement('div');
        presenter.editorPopupWrapper.classList.add('mathtext-editor-popup-wrapper');
        presenter.editorPopupEditor = document.createElement('div');
        presenter.editorPopupEditor.classList.add('mathtext-editor-popup-editor');

        var editorPopupButtons = document.createElement('div');
        editorPopupButtons.classList.add('mathtext-editor-popup-buttons');
        presenter.editorPopupCancel = document.createElement('div');
        presenter.editorPopupCancel.classList.add('cancel-button');
        presenter.editorPopupCancel.innerText = presenter.configuration.buttonTexts.cancel;
        presenter.editorPopupSave = document.createElement('div');
        presenter.editorPopupSave.classList.add('save-button');
        presenter.editorPopupSave.innerText = presenter.configuration.buttonTexts.save;
        editorPopupButtons.appendChild(presenter.editorPopupCancel);
        editorPopupButtons.appendChild(presenter.editorPopupSave);

        presenter.editorPopupSave.addEventListener('click', presenter.onSavePopup);
        presenter.editorPopupCancel.addEventListener('click', presenter.onCancelPopup);

        presenter.editorPopupWrapper.appendChild(presenter.editorPopupEditor);
        presenter.editorPopupWrapper.appendChild(editorPopupButtons);
        presenter.view.appendChild(presenter.editorPopupWrapper);
        $(presenter.editorPopupWrapper).draggable({
            cancel: '.mathtext-editor-popup-editor,.cancel-button,.save-button'
        });
    }

    function createWirisEditor(isPreview) {
        return window.com.wiris.jsEditor.JsEditor.newInstance(
            {
                'language': presenter.configuration.language,
                'mml': presenter.configuration.initialText,
                'readOnly': isPreview,
                'color': presenter.configuration.formulaColor,
                'backgroundColor': presenter.configuration.backgroundColor
            }
        );
    }

    presenter.onSavePopup = function AddonMathText_onSavePopup () {
        presenter.state.currentAnswer = presenter.editor.getMathML();
        presenter.makeRequestForImage(presenter.state.currentAnswer);
        presenter.hidePopup();
        presenter.resetPopupPosition();
    }

     presenter.onCancelPopup = function AddonMathText_onCancelPopup () {
        if (presenter.state.currentAnswer && presenter.state.currentAnswer !== presenter.EMPTY_MATHTEXT) {
            presenter.editor.setMathML(presenter.state.currentAnswer);
        } else {
            presenter.editor.setMathML(presenter.configuration.initialText);
        }
        presenter.hidePopup();
        presenter.resetPopupPosition();
    }

    presenter.resetPopupPosition = function AddonMathText_resetPopupPosition () {
        presenter.editorPopupWrapper.style.visibility = 'hidden';
        var oldDisplayValue = presenter.editorPopupWrapper.style.display;
        presenter.editorPopupWrapper.style.display = 'block';
        var pageElement = $(presenter.view).closest('.ic_page_panel')[0];
        var offsetLeft = Math.floor((pageElement.offsetWidth - presenter.editorPopupWrapper.offsetWidth)/2) - presenter.view.offsetLeft;
        presenter.editorPopupWrapper.style.left = offsetLeft + "px";
        presenter.editorPopupWrapper.style.top = '';
        presenter.editorPopupWrapper.style.display = oldDisplayValue;
        presenter.editorPopupWrapper.style.visibility = '';
    }

    presenter.showPopup = function AddonMathText_showPopup () {
        if (!presenter.state.isShowAnswers && !presenter.state.isCheckAnswers && !presenter.state.isDisabled) {
            presenter.editorPopupWrapper.style.display = "block";
        }
    }

    presenter.hidePopup = function AddonMathText_hidePopup () {
        presenter.editorPopupWrapper.style.display = "none";
    }

    presenter.showAnswers = function AddonMathText_showAnswers () {
        if (presenter.state.isCheckAnswers) {
            presenter.setWorkMode();
        }

        if (presenter.configuration.showEditor && !presenter.state.isShowAnswers && presenter.isWirisEnabled()) {
            presenter.state.isShowAnswers = true;
            presenter.$view.find('input').attr('disabled', true);
            presenter.editor.setToolbarHidden(true);

            if (presenter.configuration.isActivity) {
                if (presenter.configuration.mathEditorInPopup) {
                    presenter.hidePopup();
                    presenter.makeRequestForImage(presenter.answerObject.getCorrectAnswer(0));
                } else {
                    presenter.state.currentAnswer = presenter.editor.getMathML();
                    presenter.editor.setMathML(presenter.answerObject.getCorrectAnswer(0));
                }
            }
        }
    };

    presenter.hideAnswers = function AddonMathText_hideAnswers () {
        if (presenter.configuration.showEditor && presenter.state.isShowAnswers && presenter.isWirisEnabled()) {
            presenter.editor.setToolbarHidden(false);
            presenter.$view.find('input').removeAttr('disabled');

            if (presenter.configuration.isActivity) {
                if (presenter.configuration.mathEditorInPopup) {
                    if (!presenter.state.currentAnswer || presenter.state.currentAnswer === presenter.EMPTY_MATHTEXT) {
                        presenter.makeRequestForImage(presenter.configuration.initialText);
                    } else {
                        presenter.makeRequestForImage(presenter.state.currentAnswer);
                    }
                } else {
                    presenter.editor.setMathML(presenter.state.currentAnswer);
                }
            }

            presenter.state.isShowAnswers = false;
            presenter.setDisabled(presenter.state.isDisabled);
        }
    };

     presenter.setShowErrorsMode = function AddonMathText_setShowErrorsMode () {
        if (presenter.state.isShowAnswers) {
            presenter.hideAnswers();
        }

        if (presenter.configuration.showEditor && !presenter.state.isCheckAnswers && presenter.isWirisEnabled()) {
            presenter.state.isCheckAnswers = true;
            presenter.$view.find('input').attr('disabled', true);
            presenter.editor.setToolbarHidden(true);

            if (presenter.configuration.isActivity) {

                if (!presenter.configuration.mathEditorInPopup) {
                    presenter.state.currentAnswer = presenter.editor.getMathML();
                }

                if (presenter.state.hasUserInteracted) {
                    var score = presenter.getScore();

                    if (score === 1) {
                        presenter.wrapper.classList.add('correct');
                    } else {
                        presenter.wrapper.classList.add('wrong');
                    }
                }
            }
        }
    };

    presenter.setWorkMode = function AddonMathText_setWorkMode () {
        if (presenter.state.isCheckAnswers) {
            presenter.wrapper.classList.remove('correct');
            presenter.wrapper.classList.remove('wrong');

            if (presenter.configuration.showEditor && presenter.isWirisEnabled()) {
                presenter.$view.find('input').removeAttr('disabled');
                presenter.editor.setToolbarHidden(false);
            }

            presenter.state.isCheckAnswers = false;
            presenter.setDisabled(presenter.state.isDisabled);
        }
    };

    presenter.reset = function () {
        presenter.state.isCheckAnswers = false;
        presenter.state.isShowAnswers = false;

        presenter.wrapper.classList.remove('correct');
        presenter.wrapper.classList.remove('wrong');

        presenter.setVisibility(presenter.configuration.isVisible);
        presenter.setDisabled(presenter.configuration.isDisabled);

        presenter.state.wasChanged = true;
        presenter.state.hasUserInteracted = false;

        if (presenter.configuration.showEditor && presenter.isWirisEnabled()) {
            presenter.state.currentAnswer = presenter.configuration.initialText;
            presenter.editor.setMathML(presenter.configuration.initialText);
            if (presenter.configuration.mathEditorInPopup) {
                presenter.makeRequestForImage(presenter.configuration.initialText);
            }
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
         presenter.state.isDisabled = value;

         // that means input is disabled, and toolbar is hidden
         if (presenter.state.isShowAnswers || presenter.state.isCheckAnswers) {
             return;
         }

         if (presenter.configuration.showEditor && presenter.isWirisEnabled()) {
             if (value) {
                 presenter.$view.find('input').attr('disabled', true);
             } else {
                 presenter.$view.find('input').removeAttr('disabled');
             }

             presenter.editor.setToolbarHidden(value);
         }
    };

     presenter.setState = function (state) {
         var parsedState = JSON.parse(state);
         if (presenter.configuration.showEditor && presenter.isWirisEnabled()) {
            presenter.editor.setMathML(parsedState.text);
            presenter.state.currentAnswer = parsedState.text;
            if (presenter.configuration.mathEditorInPopup) {
                presenter.makeRequestForImage(parsedState.text);
            }
         }

         presenter.state.hasUserInteracted = parsedState.hasUserInteracted;
         presenter.setVisibility(parsedState.isVisible);
         presenter.setDisabled(parsedState.isDisabled)
     };


    presenter.getState = function() {
        var currentText = presenter.configuration.initialText;

        if (presenter.configuration.showEditor && presenter.isWirisEnabled()) {
            if (!presenter.configuration.mathEditorInPopup) {
                currentText = presenter.editor.getMathML();
            } else {
                if (presenter.state.currentAnswer) {
                    currentText = presenter.state.currentAnswer;
                }
            }
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
        if (presenter.configuration.isActivity && presenter.configuration.showEditor && presenter.isWirisEnabled()) {
            if (presenter.state.wasChanged) {
                var mml = '';
                if (presenter.configuration.mathEditorInPopup) {
                    mml = presenter.state.currentAnswer;
                } else {
                    mml = presenter.editor.getMathML();
                }
                score = presenter.checkIfAnswerIsCorrect(mml) ? 1 : 0;
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
        if (presenter.configuration.isActivity && presenter.state.hasUserInteracted) {
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