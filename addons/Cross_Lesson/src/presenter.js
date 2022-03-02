function AddonCross_Lesson_create(){
    var presenter = function() {};

    var crossLessonEventType = "crossLesson";

    var errorCodes = {
        "V_01": "Lesson ID is missing",
        "V_02": "Course ID is invalid",
        "V_03": "Type is invalid. Lesson type should be either 'lesson', 'ebook' or 'course'."
    };

    var resourceTypes = {
        lesson: "lesson",
        ebook: "ebook",
        course: "course"
    };

    presenter.DEFAULT_TTS_PHRASES = {
        goToLesson: "Go to lesson"
    };

    presenter.createPreview = function(view, model) {
        presenterLogic(view, model, true);
    };

    presenter.run = function(view, model){
        presenterLogic(view, model, false);
    };

    function presenterLogic(view, model, preview) {
        var upgradedModel = presenter.upgradeModel(model);
        presenter.configuration = presenter.validateModel(upgradedModel);

        if (presenter.configuration.isError) {
            presenter.createErrorView(view, presenter.configuration.errorCode);
            return;
        }

        presenter.createView(view);
        presenter.connectHandlers();
        presenter.setSpeechTexts(upgradedModel["speechTexts"]);
        presenter.buildKeyboardController();
    };

    presenter.validateModel = function (model) {
        var validatedType = presenter.validateType(model['Type']);
        if (!validatedType.isValid) {
            return {isError: true, errorCode: 'V_03'};
        }
        if (
            validatedType.value != resourceTypes.course &&
            ModelValidationUtils.isStringEmpty(model["LessonID"])
          ) {
            return {isError: true, errorCode: 'V_01'};
        }
        var validatedCourseId = presenter.validateId(model['CourseID'], false, validatedType.value);
        if (!validatedCourseId.isValid) {
            return {isError: true, errorCode: 'V_02'};
        }
        return {
            isError: false,
            buttonText: model['Text'],
            lessonID: model['LessonID'],
            courseID: validatedCourseId.value,
            type: validatedType.value,
            page: model['Page'],
            image: model['Image'],
            openLessonInCurrentTab: ModelValidationUtils.validateBoolean(model.OpenLessonInCurrentTab),
            langTag: model['langAttribute']
        }
    };

    presenter.validateId = function(id, isRequired, type) {
        var idReg = /^\d*$/;
        var isValid = false;

        if (id === "") {
            if (type != resourceTypes.course) {
                isValid = !isRequired;
            } else {
                return {
                    isValid: isValid
                }
            }
        } else {
            isValid = idReg.test(id.trim());
        }

        return {
            isValid: isValid,
            value: isValid ? id.trim() : NaN
        }
    };

    presenter.validateType = function(type) {
        if (!type) {
            return {
                isValid: true,
                value: resourceTypes.lesson
            };
        }
        if (type == resourceTypes.lesson || type == resourceTypes.ebook || type == resourceTypes.course) {
            return {
                isValid: true,
                value: type
            };
        } else {
            return {
                isValid: false,
                value: NaN
            };
        }
    };

    presenter.createView = function (view) {
        presenter.$view = $(view);
        presenter.$wrapper = presenter.$view.find('.cross-lesson-wrapper');
        if (presenter.configuration.image) {
            presenter.createImageElement(presenter.$wrapper);
        }
        presenter.createTextElement(presenter.$wrapper);
    };

    presenter.createTextElement = function ($element) {
        var textElement = document.createElement('div');
        $(textElement).addClass('cross-lesson-text');
        $(textElement).text(presenter.configuration.buttonText);
        $element.append(textElement);
    };

    presenter.createImageElement = function ($element) {
        var imageElement = document.createElement('img');
        $(imageElement).addClass('cross-lesson-image');
        $(imageElement).attr('src', presenter.configuration.image);
        $element.append(imageElement);
    };

    presenter.createErrorView = function (view, errorCode) {
        presenter.$view = $(view);
        presenter.$view.html(errorCodes[errorCode]);
    };

    presenter.connectHandlers = function () {
        presenter.$wrapper[0].addEventListener('click', presenter.clickHandler);
        presenter.$wrapper[0].addEventListener('touchend', presenter.clickHandler);
    };

    presenter.clickHandler = function (event) {
        event.preventDefault();
        event.stopPropagation();
        presenter.requestCrossLesson();
    };

    presenter.requestCrossLesson = function () {
        if (presenter.playerController) {
            var data = {
                type: presenter.configuration.type,
                openLessonInCurrentTab: presenter.configuration.openLessonInCurrentTab
            };
            if (presenter.configuration.lessonID) {
                data.lessonID = presenter.configuration.lessonID;
            }
            if (presenter.configuration.page) {
                data.page = presenter.configuration.page;
            }
            if (presenter.configuration.courseID) {
                data.courseID = presenter.configuration.courseID;
            }
            var jsonData = JSON.stringify(data);
            presenter.playerController.sendExternalEvent(crossLessonEventType, jsonData);
        } else {
            console.error("Cannot make a request: no player controller");
        }
    };

    presenter.setPlayerController = function(controller) {
        presenter.playerController = controller;
    };

    presenter.show = function () {
        presenter.setVisibility(true);
    };

    presenter.hide = function () {
        presenter.setVisibility(false);
    };

    presenter.setVisibility = function (isVisible) {
        if (isVisible) {
            presenter.$view.css('display', '');
            presenter.$view.css('visibility', 'visible');
        } else {
            presenter.$view.css('display', 'none');
            presenter.$view.css('visibility', 'hidden');
        }
    };

    presenter.executeCommand = function(name) {
        var commands = {
            'requestCrossLesson': presenter.requestCrossLesson,
            'show': presenter.show,
            'hide': presenter.hide
        };

        Commands.dispatch(commands, name, [], presenter);
    };

    presenter.upgradeOpenLessonInCurrentTab = function (model) {
        var upgradedModel = {};
        $.extend(true, upgradedModel, model); // Deep copy of model object

        if (!upgradedModel["OpenLessonInCurrentTab"]) {
            upgradedModel["OpenLessonInCurrentTab"] = "False";
        }

        return upgradedModel;
    };

    presenter.upgradeLangTag = function (model) {
        var upgradedModel = {};
        jQuery.extend(true, upgradedModel, model); // Deep copy of model object

        if (upgradedModel['langAttribute'] === undefined) {
            upgradedModel['langAttribute'] =  '';
        }

        return upgradedModel;
    };

    presenter.upgradeSpeechTexts = function AddonCross_Lesson_upgradeSpeechTexts (model) {
        var upgradedModel = {};
        jQuery.extend(true, upgradedModel, model); // Deep copy of model object

        if (!model['speechTexts']) {
            upgradedModel['speechTexts'] = {
                GoToLesson: {GoToLesson: ""}
            };
        }

        return upgradedModel;
    };

    presenter.upgradeModel = function AddonCross_Lesson_upgradeModel (model) {
        var upgradedModel = presenter.upgradeOpenLessonInCurrentTab(model);
        upgradedModel = presenter.upgradeLangTag(upgradedModel);
        upgradedModel = presenter.upgradeSpeechTexts(upgradedModel);
        return upgradedModel;
    };

    presenter.setSpeechTexts = function(speechTexts) {
        presenter.speechTexts = {
            GoToLesson: presenter.DEFAULT_TTS_PHRASES.goToLesson
        };

        if (!speechTexts || $.isEmptyObject(speechTexts)) {
            return;
        }

        presenter.speechTexts = {
            GoToLesson: presenter.getSpeechTextProperty(
                speechTexts.GoToLesson.GoToLesson,
                presenter.speechTexts.GoToLesson)
        };
    };

    presenter.getSpeechTextProperty = function (rawValue, defaultValue) {
        if (rawValue === undefined || rawValue === null) {
            return defaultValue;
        }

        var value = rawValue.trim();
        if (value === '') {
            return defaultValue;
        }

        return value;
    };

    function CrossLessonKeyboardController (elements, columnsCount) {
        KeyboardController.call(this, elements, columnsCount);
    }

    CrossLessonKeyboardController.prototype = Object.create(window.KeyboardController.prototype);
    CrossLessonKeyboardController.prototype.constructor = CrossLessonKeyboardController;

    presenter.buildKeyboardController = function () {
        presenter.keyboardControllerObject = new CrossLessonKeyboardController(presenter.getElementsForKeyboardNavigation(), 1);
    };

    presenter.getElementsForKeyboardNavigation = function () {
        return this.$view.find(".cross-lesson-wrapper");
    };

    presenter.keyboardController = function(keycode, isShiftKeyDown, event) {
        presenter.keyboardControllerObject.handle(keycode, isShiftKeyDown, event)
    };

    CrossLessonKeyboardController.prototype.selectAction = function () {
        this.getTarget(this.keyboardNavigationCurrentElement, true)[0].click();
    };

    CrossLessonKeyboardController.prototype.getTarget = function (element, willBeClicked) {
        return $(element);
    };

    CrossLessonKeyboardController.prototype.mark = function (element) {
        return;
    };

    CrossLessonKeyboardController.prototype.unmark = function (element) {
        return;
    };

    CrossLessonKeyboardController.prototype.switchElement = function (move) {
        KeyboardController.prototype.switchElement.call(this, move);
        this.readCurrentElement();
    };

    CrossLessonKeyboardController.prototype.readCurrentElement = function () {
        var text = this.getTarget(this.keyboardNavigationCurrentElement, false)[0].innerText;
        if (text) {
            text = [TTSUtils.getTextVoiceObject(text, presenter.configuration.langTag)];
        } else {
            text = presenter.speechTexts.GoToLesson;
        }
        presenter.speak(text);
    };

    CrossLessonKeyboardController.prototype.enter = function (event) {
        KeyboardController.prototype.enter.call(this, event);
        this.readCurrentElement();
    };

    presenter.speak = function Assessments_Navigation_Bar_speak(data) {
        var tts = presenter.getTextToSpeechOrNull(presenter.playerController);
        if (tts && presenter.isWCAGOn) {
            tts.speak(data);
        }
    };

    presenter.setWCAGStatus = function(isWCAGOn) {
        presenter.isWCAGOn = isWCAGOn;
    };

    presenter.getTextToSpeechOrNull = function Assessments_Navigation_Bar_getTextToSpeechOrNull(playerController) {
        if (playerController) {
            return playerController.getModule('Text_To_Speech1');
        }

        return null;
    };

    return presenter;
}