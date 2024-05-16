function AddonCross_Lesson_create(){
    var presenter = function() {};

    var crossLessonEventType = "crossLesson";
    var crossLessonUserAccessEventType = "crossLessonUserAccess";

    var crossLessonEventReceivedType = "crossLessonHasUserAccess:";

    const errorCodes = {
        "V_01": "Lesson ID is missing",
        "V_02": "Course ID is invalid",
        "V_03": "Type is invalid. Lesson type should be either 'lesson', 'ebook' or 'course'.",
        "V_04": "Access ids given but CheckAccess is not selected.",
        "V_05": "Incorrect values provided in AccessIDs field."
    };

    const resourceTypes = {
        lesson: "lesson",
        ebook: "ebook",
        course: "course"
    };

    presenter.keyboardControllerObject = null;

    presenter.DEFAULT_TTS_PHRASES = {
        GO_TO_LESSON: "Go to lesson"
    };

    presenter.uniqueIdentifier = null;

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
        presenter.accessCacheId = presenter.generateAccessCacheId();
        presenter.createView(view);
        presenter.connectHandlers();
        presenter.setSpeechTexts(upgradedModel["speechTexts"]);
        presenter.buildKeyboardController();
        presenter.setUniqueIdentifier(model.ID);
        presenter.handleUserAccess();
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

        var checkForAccess = ModelValidationUtils.validateBoolean(model.CheckForAccess);

        if (!checkForAccess && model.AccessIDs.trim().length > 0) {
            return {isError: true, errorCode: 'V_04'};
        }

        var checkForLessonIdAccess = false;
        if (checkForAccess && model.AccessIDs.trim().length === 0) {
            model.AccessIDs = validatedCourseId.value
                ? validatedCourseId.value
                : model.LessonID;
            checkForLessonIdAccess = model.AccessIDs == model.LessonID;
        }

        var validatedAccessIds = presenter.validateAccessIds(model.AccessIDs, checkForLessonIdAccess);
        if (checkForAccess && !validatedAccessIds.isValid) {
            return {isError: true, errorCode: 'V_05'};
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
            langTag: model['langAttribute'],
            checkForAccess: checkForAccess,
            accessIds: validatedAccessIds.value
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

    presenter.validateAccessIds = function AddonCross_Lesson_validateAccessIds (raw, isLessonId) {
        const ids = presenter.transformAccessIdsToArray(raw);
        const onlyDigitsRegex = /^\d*$/;

        const filteredIds = ids
            .map(id => id.trim())
            .filter((id) => (id.length > 0 && (onlyDigitsRegex.test(id) || onlyDigitsRegex.test(isLessonId))));

        if (ids.length !== filteredIds.length) {
            return {isValid: false};
        }

        return {isValid: true, value: filteredIds};
    };

    presenter.transformAccessIdsToArray = function (raw) {
        let ids = String(raw).split(",");
        if (ids.length === 1 && ids[0] === "") {
            ids = [];
        }
        return ids;
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
        if (MobileUtils.isMobileUserAgent(navigator.userAgent)) {
            presenter.$wrapper[0].addEventListener('touchend', presenter.clickHandler);
        } else {
            presenter.$wrapper[0].addEventListener('click', presenter.clickHandler);
        }
    };

    presenter.clickHandler = function (event) {
        event.preventDefault();
        event.stopPropagation();
        presenter.requestCrossLesson();
    };

    presenter.onExternalMessage = function AddonCross_Lesson_onExternalMessage (event) {
        const data = event.data;
        if (typeof data === 'string' && data.indexOf(crossLessonEventReceivedType) !== -1 && data.indexOf(presenter.uniqueIdentifier) !== -1) {
            const lenToSlice = crossLessonEventReceivedType.length;
            const lenOfWordTrue = 4;
            const value = data.slice(lenToSlice, lenToSlice + lenOfWordTrue);
            if (value !== 'true') {
                presenter.hide();
            }
            presenter.updateAccessCache(value == 'true');
        }
    };

    presenter.updateAccessCache = function(hasAccess) {
        if (presenter.configuration.accessIds.length == 0) return;
        if (window.crossLessonAccessCache == null) window.crossLessonAccessCache = {};
        window.crossLessonAccessCache[presenter.accessCacheId] = hasAccess;
    }

    presenter.generateAccessCacheId = function() {
        if (presenter.configuration.accessIds.length == 0) return '';
        var sortedIds = presenter.configuration.accessIds.slice().sort();
        return sortedIds.toString();
    }

    presenter.requestCrossLesson = function () {
       const data = presenter.getExternalEventData();
       if (!data) {
           return
       }

       presenter.playerController.sendExternalEvent(crossLessonEventType, data);
    };

    presenter.setUniqueIdentifier = function AddonCross_Lesson_setUniqueIdentifier (modelID){
        if (!presenter.playerController) {
            return;
        }

        const pageIndex = presenter.playerController.getCurrentPageIndex();
        const pageID = presenter.playerController.getPresentation().getPage(pageIndex).getId();
        presenter.uniqueIdentifier = `${modelID}-${pageID}`;

        if (!presenter.$view) {
            return;
        }

        if (presenter.$view.closest('.ic_header').length) {
            presenter.uniqueIdentifier += "-header";
        }

        if (presenter.$view.closest('.ic_footer').length) {
            presenter.uniqueIdentifier += "-footer";
        }
    };

    presenter.handleUserAccess = function AddonCross_Lesson_handleUserAccess () {
        if (!presenter.playerController) {
            return;
        }

        if (!presenter.configuration.checkForAccess) {
            return;
        }

        if (window.crossLessonAccessCache != null) {
            if (window.crossLessonAccessCache[presenter.accessCacheId] !== undefined) {
                if (!window.crossLessonAccessCache[presenter.accessCacheId]) {
                    presenter.hide();
                }
                return;
            }
        }

        const data = {
            "coursesIds": presenter.configuration.accessIds,
            "uniqueId": presenter.uniqueIdentifier
        };

        window.addEventListener("message", presenter.onExternalMessage);
        presenter.playerController.sendExternalEvent(crossLessonUserAccessEventType, JSON.stringify(data));
    };

    presenter.getExternalEventData = function AddonCross_Lesson_getExternalEventData () {
        if (!presenter.playerController) {
            console.error("Cannot make a request: no player controller");
            return;
        }

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

        return JSON.stringify(data);
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
        jQuery.extend(true, upgradedModel, model);

        if (!upgradedModel["speechTexts"]) {
            upgradedModel["speechTexts"] = {};
        }
        if (!upgradedModel["speechTexts"]["GoToLesson"]) {
            upgradedModel["speechTexts"]["GoToLesson"]
              = {GoToLesson: ""};
        }

        return upgradedModel;
    };

    presenter.upgradeCheckForAccess = function AddonCross_Lesson_upgradeCheckForAccess (model) {
        var upgradedModel = {};
        jQuery.extend(true, upgradedModel, model);

        if (upgradedModel['CheckForAccess'] === undefined) {
            upgradedModel['CheckForAccess'] =  "False";
        }

        return upgradedModel;
    };

    presenter.upgradeAccessIds = function AddonCross_Lesson_upgradeAccessIds (model) {
        var upgradedModel = {};
        jQuery.extend(true, upgradedModel, model);

        if (upgradedModel['AccessIDs'] === undefined) {
            upgradedModel['AccessIDs'] =  "";
        }

        return upgradedModel;
    };

    presenter.upgradeModel = function AddonCross_Lesson_upgradeModel (model) {
        var upgradedModel = presenter.upgradeOpenLessonInCurrentTab(model);
        upgradedModel = presenter.upgradeLangTag(upgradedModel);
        upgradedModel = presenter.upgradeSpeechTexts(upgradedModel);
        upgradedModel = presenter.upgradeCheckForAccess(upgradedModel);
        upgradedModel = presenter.upgradeAccessIds(upgradedModel);
        return upgradedModel;
    };

    presenter.setSpeechTexts = function(speechTexts) {
        presenter.speechTexts = {
            GoToLesson: presenter.DEFAULT_TTS_PHRASES.GO_TO_LESSON
        };

        if (!speechTexts || $.isEmptyObject(speechTexts)) {
            return;
        }

        presenter.speechTexts = {
            GoToLesson: TTSUtils.getSpeechTextProperty(
                speechTexts.GoToLesson.GoToLesson,
                presenter.speechTexts.GoToLesson)
        };
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
