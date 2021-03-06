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

    }

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
            openLessonInCurrentTab: ModelValidationUtils.validateBoolean(model.OpenLessonInCurrentTab)
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

    presenter.upgradeModel = function AddonCross_Lesson_upgradeModel (model) {
        var upgradedModel = presenter.upgradeOpenLessonInCurrentTab(model);
        return upgradedModel;
    };

    return presenter;
}