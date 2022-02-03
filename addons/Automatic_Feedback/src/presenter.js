function AddonAutomatic_Feedback_create() {
    var presenter = function() {};

    presenter.activityHandler = null;
    presenter.playerController = null;
    presenter.isLoaded = false;

    var ERROR_MESSAGES = {
        AM01: "Activity module ID cannot be empty",
        AT01: "Activity type not implemented",
        F01: "Incorrect Activity item syntax",
    }

    var DISPLAY_MODES = {
        BLOCK: "block",
        TOOLTIPS: "tooltips",
        POPUP: "popup"
    };

    var REACT_TO = {
        VALUE_CHANGED: "ValueChanged",
        CHECK: "Check"
    }

    var FEEDBACK_CLASSES = {
        CORRECT: "correct_feedback",
        INCORRECT: "incorrect_feedback",
        PARTIAL: "partial",
        EMPTY: "empty"
    }

    var ActivityTypeDict = null;
    function initializeActivityTypeDict() {
        activityTypeDict = {
            "Default": DefaultActivity,
        };
    }

    presenter.run = function (view, model) {
        presenter.initialize(view, model, false);
    };

    presenter.createPreview = function (view, model) {
        presenter.initialize(view, model, true);
    };

    presenter.initialize = function (view, model, isPreview) {
        initializeActivityTypeDict();
        presenter.view = view;
        presenter.configuration = validateModel(model);
        console.log(presenter.configuration);

        if (!presenter.configuration.isValid) {
            view.innerHTML = ERROR_MESSAGES[presenter.configuration.errorCode];
            return;
        }

        presenter.$content = $(view).find('.automatic_feedback_wrapper');
        presenter.activityHandler = new activityTypeDict[presenter.configuration.activityType](this);

        presenter.isLoaded = true;
    }

    function validateModel(model) {

        if (model["ActivityModuleID"].trim().length === 0) {
            return {isValid: false, errorCode: "AM01"};
        }

        var activityType = "Default";
        if (model["ActivityType"].length > 0) activityType = model["ActivityType"];
        if(Object.keys(activityTypeDict).indexOf(activityType) === -1) {
            return {isValid: false, errorCode: "AT01"};
        }

        var displayMode = DISPLAY_MODES.BLOCK;
        if (model["Display"].length > 0) displayMode = model["Display"];

        var reactTo = REACT_TO.CHECK;
        if (model["ReactTo"].length > 0) reactTo = model["ReactTo"];


        var feedbacks = generateFeedbacks(model);

        return {
            ID: model.ID,
            isValid: true,
            width: parseInt(model["Width"], 10),
            height: parseInt(model["Height"], 10),
            activityModuleID: model["ActivityModuleID"],
            activityType: activityType,
            displayFeedbackButtons: ModelValidationUtils.validateBoolean(model["DisplayFeedbackButtons"]),
            defaultFeedback: feedbacks.defaultFeedback,
            itemFeedbacks: feedbacks.itemFeedbacks,
            displayMode: displayMode,
            reactTo: reactTo
        }
    }

    function generateFeedbacks(model) {
        var feedbacks = {
            defaultFeedback: createEmptyFeedbackObject(),
            itemFeedbacks: {},
            isValid: true
        };
        feedbacks = fillFeedbackObjects(feedbacks, 'correct', model['CorrectFeedback']);
        feedbacks = fillFeedbackObjects(feedbacks, 'incorrect', model['IncorrectFeedback']);
        feedbacks = fillFeedbackObjects(feedbacks, 'empty', model['EmptyFeedback']);
        feedbacks = fillFeedbackObjects(feedbacks, 'partial', model['PartialFeedback']);
        return feedbacks;
    }

    function fillFeedbackObjects(feedbacks, fieldName, feedbackModelList) {
        if (!feedbacks.isValid) return feedbacks;

        for (var i = 0; i < feedbackModelList.length; i++) {
            var feedbackModel = feedbackModelList[i];
            if (feedbackModel['Feedback'].trim() === 0) continue;
            if (feedbackModel['ActivityItem'].trim().length === 0) {
                feedbacks.defaultFeedback[fieldName] = feedbackModel['Feedback'];
            } else {
                activityItems = feedbackModel['ActivityItem'].split(',');
                for (var j = 0; j < activityItems.length; j++) {
                    var activityItem = activityItems[j];
                    var range = activityItem.split('-');
                    if (range.length === 1 || range.length === 2) {
                        var r1, r2;
                        r1 = range[0].trim();
                        if (range.length == 2) {
                            r2 = range[1].trim();
                        } else {
                            r2 = r1;
                        }
                        if (isNaN(r1) || isNaN(r2)) {
                            feedbacks.isValid = false;
                            feedbacks.errorCode = "F01";
                            return feedbacks;
                        }
                        r1 = parseInt(r1);
                        r2 = parseInt(r2) + 1;
                        if (r2 <= r1) {
                            feedbacks.isValid = false;
                            feedbacks.errorCode = "F01";
                            return feedbacks;
                        }
                        for (var k = r1; k < r2; k++) {
                            if (feedbacks.itemFeedbacks[k] === undefined) feedbacks.itemFeedbacks[k] = createEmptyFeedbackObject();
                            feedbacks.itemFeedbacks[k][fieldName] = feedbackModel['Feedback'];
                        }
                    } else {
                        feedbacks.isValid = false;
                        feedbacks.errorCode = "F01";
                        return feedbacks;
                    }
                }
            }
        }
        return feedbacks;
    }

    function createEmptyFeedbackObject() {
        return {
            correct: "",
            incorrect: "",
            empty: "",
            partial: ""
        }
    }

    presenter.setShowErrorsMode = function () {
        console.log("show answers mode");
        if (presenter.configuration.reactTo == REACT_TO.CHECK) {
            presenter.activityHandler.onShowErrorsMode();
        }
    }

    presenter.setWorkMode = function () {
        if (presenter.configuration.reactTo == REACT_TO.CHECK) {
            presenter.activityHandler.clearFeedback();
        }
    }

    presenter.reset = function () {
        presenter.activityHandler.clearFeedback();
    }

    presenter.setPlayerController = function (controller) {
        presenter.playerController = controller;
    };

    presenter.setEventBus = function (wrappedEventBus) {
        eventBus = wrappedEventBus;
        eventBus.addEventListener("ValueChanged", this);
    }

    presenter.onEventReceived = function (eventName, data) {
        console.log("onEventReceived");
        if (!presenter.isLoaded) return;
        if (eventName == "ValueChanged") presenter.onValueChanged(data);
    }

    presenter.onValueChanged = function(data) {
        if (presenter.configuration.reactTo == REACT_TO.VALUE_CHANGED) {
            if (data.source == presenter.configuration.activityModuleID) {
                console.log("value changed in my addon");
                console.log(data);
                if (data.value.length === 0 || data.value == '---') {
                    presenter.activityHandler.onEmptyAnswer(data.item);
                } else if (data.score == 0) {
                    presenter.activityHandler.onIncorrectAnswer(data.item);
                } else {
                    presenter.activityHandler.onCorrectAnswer(data.item);
                }
            } else {
                presenter.activityHandler.clearFeedback();
            }
        }
    }

    presenter.showBlockFeedback = function(feedback, _class) {
        presenter.clearBlockFeedbackClasses();
        presenter.$content.addClass(_class);
        presenter.$content.html(feedback);
    }

    presenter.clearBlockFeedback = function(clear) {
        presenter.clearBlockFeedbackClasses();
        presenter.$content.html("");
    }

    presenter.clearBlockFeedbackClasses = function() {
        presenter.$content.removeClass(FEEDBACK_CLASSES.CORRECT);
        presenter.$content.removeClass(FEEDBACK_CLASSES.INCORRECT);
        presenter.$content.removeClass(FEEDBACK_CLASSES.PARTIAL);
        presenter.$content.removeClass(FEEDBACK_CLASSES.EMPTY);
    }

    class AbstractActivity {

        constructor (presenter) {
            this.presenter = presenter;
        }

        onCorrectAnswer(itemID) {
            throw "onCorrectAnswer must be implemented";
        }

        onIncorrectAnswer(itemID) {
            throw "onIncorrectAnswer must be implemented";
        }

        onEmptyAnswer(itemID) {
            throw "onEmptyAnswer must be implemented";
        }

        onPartialAnswer(itemID) {
            throw "onPartialAnswer must be implemented";
        }

        onShowErrorsMode() {
            throw "onShowErrorsMode must be implemented";
        }

        clearFeedback() {
            throw "clearFeedback must be implemented";
        }

    }

    class DefaultActivity extends AbstractActivity {

        onCorrectAnswer(itemID) {
            console.log("onCorrectAnswer");
            this.onShowErrorsMode();
        }

        onIncorrectAnswer(itemID) {
            console.log("onIncorrectAnswer");
            this.onShowErrorsMode();
        }

        onEmptyAnswer(itemID) {
            console.log("onEmptyAnswer");
            this.onShowErrorsMode();
        }

        onPartialAnswer(itemID) {
            console.log("onPartialAnswer");
            this.onShowErrorsMode();
        }

        onShowErrorsMode() {
            if (!this.presenter.isLoaded || this.presenter.playerController == null) return;
            var module = this.presenter.playerController.getModule(this.presenter.configuration.activityModuleID);
            if (module == null) return;
            if (!module.hasOwnProperty("getScore")
                || !module.hasOwnProperty("getMaxScore")
                || !module.hasOwnProperty("getErrorCount")) return;
            var score = module.getScore();
            var maxScore = module.getMaxScore();
            var errorCount = module.getErrorCount();
            console.log(score,maxScore,errorCount);

            var feedbackObject = this.presenter.configuration.defaultFeedback;
            var feedback = "";
            var _class = "";
            if (errorCount > 0) {
                feedback = feedbackObject.incorrect;
                _class = FEEDBACK_CLASSES.INCORRECT;
            } else if (score == maxScore) {
                feedback = feedbackObject.correct;
                _class = FEEDBACK_CLASSES.CORRECT;
            } else if (score == 0) {
                feedback = feedbackObject.empty;
                _class = FEEDBACK_CLASSES.EMPTY;
            } else {
                feedback = feedbackObject.partial;
                _class = FEEDBACK_CLASSES.PARTIAL;
            }
            this.displayFeedback(feedback, _class);
        }

        displayFeedback(feedback) {
            this.presenter.showBlockFeedback(feedback);
        }

        clearFeedback() {
            this.presenter.clearBlockFeedback();
        }
    }

    return presenter;
}