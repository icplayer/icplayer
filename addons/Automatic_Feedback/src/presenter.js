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
        CORRECT: "correct-feedback",
        INCORRECT: "incorrect-feedback",
        PARTIAL: "partial-feedback",
        EMPTY: "empty-feedback"
    }

    var POPUP_FEEDBACK_CLASS = "automatic-feedback-popup";
    var AUTOMATIC_FEEDBACK_DIALOG_CLASS = "automatic-feedback-dialog";
    var REMAIN_OPEN_CLASS = "remain-open";

    var ActivityTypeDict = null;
    presenter.initializeActivityTypeDict = function() {
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
        presenter.view = view;
        presenter.$view = $(view);
        presenter.initializeActivityTypeDict();
        presenter.configuration = presenter.validateModel(model);

        if (!presenter.configuration.isValid) {
            view.innerHTML = ERROR_MESSAGES[presenter.configuration.errorCode];
            return;
        }

        presenter.$content = $(view).find('.automatic_feedback_wrapper');
        presenter.tooltipElements = [];
        presenter.activityHandler = new activityTypeDict[presenter.configuration.activityType](this);

        if (presenter.configuration.displayMode == DISPLAY_MODES.POPUP) {
            presenter.$popup = $('<div></div>');
            presenter.$content.append(presenter.$popup);
            presenter.$popup.addClass(POPUP_FEEDBACK_CLASS);
            presenter.$popup.dialog({
                modal: true,
                autoOpen: false,
                draggable: false,
                minHeight: 'auto',
                resizable: false,
                width: presenter.configuration.width
            });
            if (presenter.configuration.displayFeedbackButtons) {
                presenter.activityHandler.createTooltips();
            }
        } else if (presenter.configuration.displayMode == DISPLAY_MODES.TOOLTIPS) {
            presenter.activityHandler.createTooltips();
        }

        presenter.isLoaded = true;
    }

    presenter.validateModel = function(model) {

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
        if (!feedbacks.isValid) return {isValid: false, errorCode: feedbacks.errorCode};

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
        if (presenter.configuration.reactTo == REACT_TO.CHECK) {
            presenter.activityHandler.onShowErrorsMode();
        } else {
            if (!presenter.configuration.displayMode === DISPLAY_MODES.BLOCK || presenter.configuration.displayFeedbackButtons) {
                presenter.activityHandler.clearFeedback();
            }
        }
    }

    presenter.setWorkMode = function () {
        if (!presenter.configuration.displayMode === DISPLAY_MODES.BLOCK
            || presenter.configuration.displayFeedbackButtons
            || !presenter.configuration.reactTo == REACT_TO.VALUE_CHANGED) {
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
        if (!presenter.isLoaded) return;
        if (eventName == "ValueChanged") presenter.onValueChanged(data);
    }

    presenter.onValueChanged = function(data) {
        if (presenter.configuration.reactTo == REACT_TO.VALUE_CHANGED) {
            if (data.source == presenter.configuration.activityModuleID) {
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
        presenter.clearFeedbackClasses(presenter.$content);
        presenter.$content.addClass(_class);
        presenter.$content.html(feedback);
        if (presenter.configuration.displayFeedbackButtons) {
            presenter.wrapElementInButton(presenter.$content, false);
        }
    }

    presenter.clearBlockFeedback = function() {
        presenter.clearFeedbackClasses(presenter.$content);
        presenter.$content.html("");
        if (presenter.configuration.displayFeedbackButtons) {
            presenter.$content.parent().find('.automatic_feedback_button').remove();
        }
    }

    presenter.clearFeedbackClasses = function($element) {
        $element.removeClass(FEEDBACK_CLASSES.CORRECT);
        $element.removeClass(FEEDBACK_CLASSES.INCORRECT);
        $element.removeClass(FEEDBACK_CLASSES.PARTIAL);
        $element.removeClass(FEEDBACK_CLASSES.EMPTY);
    }

    presenter.showPopupFeedback = function(feedback, _class) {
        $('.' + POPUP_FEEDBACK_CLASS).dialog("close");
        presenter.clearFeedbackClasses(presenter.$popup.parent());
        presenter.$popup.parent().addClass(_class);
        presenter.$popup.parent().addClass(AUTOMATIC_FEEDBACK_DIALOG_CLASS);
        presenter.$popup.html(feedback);
        presenter.$popup.dialog('open');
        presenter.scaleDialog(presenter.$popup);
    }

    presenter.scaleDialog = function ($dialog) {
        var scaleInfo = presenter.playerController.getScaleInformation();
        if(scaleInfo.scaleY !== 1.0) {
            var $icpage = presenter.findICPage();
            if ($icpage != null) {
                var presentationPosition = $icpage.offset();
                var presentationWidth = $icpage.outerWidth();
                var dialogWidth = $dialog.outerWidth();
                var presentationHorizontalOffset = parseInt((presentationWidth - dialogWidth) * scaleInfo.scaleY / 2, 10);
                var leftPosition = presentationPosition.left + presentationHorizontalOffset;
                $dialog.parent().css('transform', scaleInfo.transform);
                $dialog.parent().css('transform-origin', scaleInfo.transformOrigin);
                $dialog.parent().css('left',leftPosition+'px')
            }
        }
    }

    presenter.findICPage = function () {
        var $icpage = $(presenter.$view.parent('.ic_page:first')[0]);
        if ($icpage.offset() == null){
            $icpage = $(presenter.$view.parent('.ic_popup_page:first')[0]);
        }
        if ($icpage.offset() == null){
            $icpage = $(presenter.$view.parent('.ic_header:first')[0]);
        }
        if ($icpage.offset() == null){
            $icpage = $(presenter.$view.parent('.ic_footer:first')[0]);
        }
        return $icpage;
    };

    function getFeedbackClassFromElement($element) {
        if ($element.hasClass(FEEDBACK_CLASSES.CORRECT)) {
            return FEEDBACK_CLASSES.CORRECT;
        } else if ($element.hasClass(FEEDBACK_CLASSES.INCORRECT)) {
            return FEEDBACK_CLASSES.INCORRECT;
        } else if ($element.hasClass(FEEDBACK_CLASSES.EMPTY)) {
            return FEEDBACK_CLASSES.EMPTY;
        } else if ($element.hasClass(FEEDBACK_CLASSES.PARTIAL)) {
            return FEEDBACK_CLASSES.PARTIAL;
        } else {
            return '';
        }
    }

    presenter.wrapElementInButton = function($element, isDialog) {
        var $parent = $element.parent();
        if (isDialog) {
            $parent.find('.ui-dialog-titlebar').css('display', 'none');
            if (!$parent.attr('data-original-width')) {
                $parent.attr('data-original-width', $parent.css('width'));
            }
            originalWidth = $element.parent().css('width');
            $parent.css('width', 'auto');
        }
        $element.css('display','none');

        var $buttons = $parent.find('.automatic_feedback_button');

        if($buttons.length == 0) {
            var $button = $('<button></button>');
            $button.addClass('automatic_feedback_button');
            var _class = getFeedbackClassFromElement($parent);
            $button.addClass(_class);
            $parent.append($button);
            if (presenter.configuration.displayMode == DISPLAY_MODES.POPUP) {
                $button.click(function(){
                    presenter.showPopupFeedback($element.html(), _class);
                });
            } else {
                $button.click(function(){
                    $element.css('display','');
                    if (isDialog) {
                        $parent.find('.ui-dialog-titlebar').css('display', '');
                        $parent.css('width', $parent.attr('data-original-width'));
                    }
                    $button.remove();
                });
            }
        } else {
            var $button = $buttons.first();
            presenter.clearFeedbackClasses($button);
            var _class = getFeedbackClassFromElement($parent);
            $button.addClass(_class);
        }
    }

    presenter.isScoreCorrect = function(score, maxScore, errorCount) {
        return score == maxScore && errorCount == 0;
    }

    presenter.isScoreIncorrect = function(score, maxScore, errorCount) {
        return errorCount > 0;
    }

    presenter.isScoreEmpty = function(score, maxScore, errorCount) {
        return score == 0 && maxScore > 0 && errorCount == 0;
    }

    presenter.isScorePartial = function(score, maxScore, errorCount) {
        return score != 0 && score < maxScore && errorCount == 0;
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

        createTooltips() {
            throw "createTooltips must be implemented";
        }

    }

    class DefaultActivity extends AbstractActivity {

        onCorrectAnswer(itemID) {
            this.onShowErrorsMode();
        }

        onIncorrectAnswer(itemID) {
            this.onShowErrorsMode();
        }

        onEmptyAnswer(itemID) {
            this.onShowErrorsMode();
        }

        onPartialAnswer(itemID) {
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

            var feedbackObject = this.presenter.configuration.defaultFeedback;
            var feedback = "";
            var _class = "";
            if (this.presenter.isScoreIncorrect(score, maxScore, errorCount)) {
                feedback = feedbackObject.incorrect;
                _class = FEEDBACK_CLASSES.INCORRECT;
            } else if (this.presenter.isScoreCorrect(score, maxScore, errorCount)) {
                feedback = feedbackObject.correct;
                _class = FEEDBACK_CLASSES.CORRECT;
            } else if (this.presenter.isScoreEmpty(score, maxScore, errorCount)) {
                feedback = feedbackObject.empty;
                _class = FEEDBACK_CLASSES.EMPTY;
            } else {
                feedback = feedbackObject.partial;
                _class = FEEDBACK_CLASSES.PARTIAL;
            }
            this.displayFeedback(feedback, _class);
        }

        displayFeedback(feedback, _class) {
            if (this.presenter.configuration.displayMode == DISPLAY_MODES.BLOCK) {
                this.presenter.showBlockFeedback(feedback, _class);
            } else if (this.presenter.configuration.displayMode == DISPLAY_MODES.POPUP) {
                if (this.presenter.configuration.displayFeedbackButtons) {
                    if (this.$tooltip == null) {this.createTooltips();};
                    if (this.$tooltip != null) this.showTooltipFeedback(feedback, _class);
                } else {
                    this.presenter.showPopupFeedback(feedback, _class);
                }
            } else {
                if (this.$tooltip == null) {this.createTooltips();};
                if (this.$tooltip != null) this.showTooltipFeedback(feedback, _class);
            }
        }

        clearFeedback() {
            if (this.presenter.configuration.displayMode == DISPLAY_MODES.BLOCK) {
                this.presenter.clearBlockFeedback();
            } else if (this.presenter.configuration.displayMode == DISPLAY_MODES.POPUP) {
                this.presenter.$popup.removeClass(REMAIN_OPEN_CLASS);
                this.presenter.$popup.dialog('close');
                if (this.presenter.configuration.displayFeedbackButtons) {
                    this.$tooltip.removeClass(REMAIN_OPEN_CLASS);
                    this.$tooltip.dialog('close');
                }
            } else {
                if (this.$tooltip) {
                    this.$tooltip.removeClass(REMAIN_OPEN_CLASS);
                    this.$tooltip.dialog('close');
                }
            }
        }

        createTooltips() {
            var activityModuleView = $('#'+this.presenter.configuration.activityModuleID)[0];
            if (activityModuleView == null) return;
            var $tooltipElement = $('<div></div>');
            this.presenter.$content.append($tooltipElement);
            this.$tooltip = $tooltipElement.dialog({
                modal: false,
                autoOpen: false,
                draggable: false,
                minHeight: 'auto',
                resizable: false,
                position: {
                    my: "left center",
                    at: "right center",
                    of: activityModuleView
                }
            });
            var self = this;
            this.$tooltip.on('dialogbeforeclose', function(event, ui){
                if (self.$tooltip.hasClass('remain-open')) {
                    self.presenter.wrapElementInButton(self.$tooltip, true);
                    return false;
                }
                return true;
                });
            this.$tooltip.addClass('automatic_feedback_tooltip_body');
            this.$tooltip.parent().find('.ui-dialog-titlebar').addClass('automatic_feedback_tooltip_title');
        }

        showTooltipFeedback = function(feedback, _class) {
            this.presenter.clearFeedbackClasses(this.$tooltip.parent());
            this.$tooltip.parent().addClass(_class);
            this.$tooltip.parent().addClass(AUTOMATIC_FEEDBACK_DIALOG_CLASS);
            this.$tooltip.html(feedback);
            this.$tooltip.dialog('open');
            this.presenter.scaleDialog(this.$tooltip);
            if (this.presenter.configuration.displayFeedbackButtons) {
                this.$tooltip.addClass(REMAIN_OPEN_CLASS);
                this.presenter.wrapElementInButton(this.$tooltip, true);
            }
        }

    }

    return presenter;
}