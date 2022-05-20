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
        CHECK: "Check",
        SCRIPT: "Script"
    }

    var FEEDBACK_CLASSES = {
        CORRECT: "correct-feedback",
        INCORRECT: "incorrect-feedback",
        PARTIAL: "partial-feedback",
        EMPTY: "empty-feedback"
    }

    var POPUP_FEEDBACK_CLASS = "automatic-feedback-popup";
    var AUTOMATIC_FEEDBACK_DIALOG_CLASS = "automatic-feedback-dialog";
    var AUTOMATIC_FEEDBACK_BUTTON_CLASS = "automatic_feedback_button";
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

        if (!isPreview) {
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
                } else {
                    presenter.$popup.on('dialogclose', function(event, ui){
                        presenter.activityHandler.popupClosedCallback();
                    });
                }
            } else if (presenter.configuration.displayMode == DISPLAY_MODES.TOOLTIPS) {
                presenter.activityHandler.createTooltips();
            }

            presenter.view.addEventListener("DOMNodeRemoved", presenter.destroy);
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
        } else if (presenter.configuration.reactTo == REACT_TO.VALUE_CHANGED) {
            if (presenter.configuration.displayMode !== DISPLAY_MODES.BLOCK || presenter.configuration.displayFeedbackButtons) {
                presenter.activityHandler.clearFeedback();
            }
        }
    }

    presenter.setWorkMode = function () {
        if (presenter.configuration.displayMode !== DISPLAY_MODES.BLOCK
            || presenter.configuration.displayFeedbackButtons
            || presenter.configuration.reactTo === REACT_TO.CHECK) {
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
                if (presenter.configuration.activityType == "Default") {
                    presenter.activityHandler.onShowErrorsMode();
                } else {
                    if (data.value.length === 0 || data.value == '---') {
                        presenter.activityHandler.onEmptyAnswer(data.item);
                    } else if (data.score == 0) {
                        presenter.activityHandler.onIncorrectAnswer(data.item);
                    } else {
                        presenter.activityHandler.onCorrectAnswer(data.item);
                    }
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
            presenter.$content.parent().find('.' + AUTOMATIC_FEEDBACK_BUTTON_CLASS).remove();
        }
    }

    presenter.isBlockFeedbackWrapped = function() {
        return presenter.$content.parent().find('.' + AUTOMATIC_FEEDBACK_BUTTON_CLASS).length > 0;
    }

    presenter.unwrapBlockFeedback = function() {
        if (presenter.configuration.displayFeedbackButtons) {
            presenter.$content.parent().find('.' + AUTOMATIC_FEEDBACK_BUTTON_CLASS).click();
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

        var currentScrollTop = presenter.playerController.iframeScroll();
        presenter.$popup.dialog('open');
        if (!presenter.playerController.isPlayerInCrossDomain()) {
            $(top.window).scrollTop(currentScrollTop);
        }

        var dialogHeight = presenter.$popup.outerHeight();
        var windowHeight = $(top.window).height();
        var topPosition = parseInt(( windowHeight - dialogHeight) / 3, 10) + currentScrollTop;
        presenter.$popup.parent().css('top',topPosition+'px');

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
                $dialog.parent().css('left',leftPosition+'px');
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

        var $buttons = $parent.find('.' + AUTOMATIC_FEEDBACK_BUTTON_CLASS);

        if($buttons.length == 0) {
            var $button = $('<button></button>');
            $button.addClass(AUTOMATIC_FEEDBACK_BUTTON_CLASS);
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

    presenter.getState = function() {
        var state = presenter.activityHandler.getState();
        return state;
    }

    presenter.setState = function(state) {
        presenter.reset();
        presenter.activityHandler.setState(state);
    }

    presenter.destroy = function AddonAutomatic_Feedback_destroy() {
        presenter.activityHandler.onDestroy();
    }

    presenter.displayFeedback = function (item, type) {
        if (Array.isArray(item) && item.length == 2 && type === undefined) {
            type = item[1];
            item = item[0];
        }
        switch (type.toLowerCase()) {
            case "correct":
                presenter.activityHandler.onCorrectAnswer(item);
                break;
            case "incorrect":
                presenter.activityHandler.onIncorrectAnswer(item);
                break;
            case "partial":
                presenter.activityHandler.onPartialAnswer(item);
                break;
            case "empty":
                presenter.activityHandler.onEmptyAnswer(item);
                break;
        }
    }

    presenter.clearFeedback = function() {
        presenter.activityHandler.clearFeedback();
    }

    presenter.executeCommand = function(name, params) {
        var commands = {
            'displayFeedback': presenter.displayFeedback,
            'clearFeedback': presenter.clearFeedback
        };

        Commands.dispatch(commands, name, params, presenter);
    };

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

        getState() {
            throw "getState must be implemented";
        }

        setState(state) {
            throw "setState must be implemented";
        }

        popupClosedCallback() {
            throw "popupClosedCallback must be implemented";
        }

        onDestroy() {
            throw "onDestroy must be implemented";
        }

    }

    class DefaultActivity extends AbstractActivity {

        isActivated = false;
        lastFeedback = "";
        lastClass = "";

        onCorrectAnswer(itemID) {
            var _class = FEEDBACK_CLASSES.CORRECT;
            var feedback = "";
            if (itemID != null && presenter.configuration.itemFeedbacks[itemID] !== undefined) {
                feedback = presenter.configuration.itemFeedbacks[itemID].correct;
            } else {
                var feedbackObject = this.presenter.configuration.defaultFeedback;
                feedback = feedbackObject.correct;
            }
            this.displayFeedback(feedback, _class);
        }

        onIncorrectAnswer(itemID) {
            var _class = FEEDBACK_CLASSES.INCORRECT;
            var feedback = "";
            if (itemID != null && presenter.configuration.itemFeedbacks[itemID] !== undefined) {
                feedback = presenter.configuration.itemFeedbacks[itemID].incorrect;
            } else {
                var feedbackObject = this.presenter.configuration.defaultFeedback;
                feedback = feedbackObject.incorrect;
            }
            this.displayFeedback(feedback, _class);
        }

        onEmptyAnswer(itemID) {
            var _class = FEEDBACK_CLASSES.EMPTY;
            var feedback = "";
            if (itemID != null && presenter.configuration.itemFeedbacks[itemID] !== undefined) {
                feedback = presenter.configuration.itemFeedbacks[itemID].empty;
            } else {
                var feedbackObject = this.presenter.configuration.defaultFeedback;
                feedback = feedbackObject.empty;
            }
            this.displayFeedback(feedback, _class);
        }

        onPartialAnswer(itemID) {
            var _class = FEEDBACK_CLASSES.PARTIAL;
            var feedback = "";
            if (itemID != null && presenter.configuration.itemFeedbacks[itemID] !== undefined) {
                feedback = presenter.configuration.itemFeedbacks[itemID].partial;
            } else {
                var feedbackObject = this.presenter.configuration.defaultFeedback;
                feedback = feedbackObject.partial;
            }
            this.displayFeedback(feedback, _class);
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
            this.isActivated = true;
            this.lastFeedback = feedback;
            this.lastClass = _class;
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
            this.isActivated = false;
            if (this.presenter.configuration.displayMode == DISPLAY_MODES.BLOCK) {
                this.presenter.clearBlockFeedback();
            } else if (this.presenter.configuration.displayMode == DISPLAY_MODES.POPUP) {
                this.presenter.$popup.removeClass(REMAIN_OPEN_CLASS);
                this.presenter.$popup.dialog('close');
                if (this.presenter.configuration.displayFeedbackButtons) {
                    this.clearTooltips();
                }
            } else {
                if (this.$tooltip) {
                    this.clearTooltips();
                }
            }
        }

        clearTooltips() {
            if (this.$tooltip) {
                this.$tooltip.removeClass(REMAIN_OPEN_CLASS);
                this.$tooltip.dialog('close');
            }
        }

        getActivityModuleView() {
            var $icpanel = this.presenter.$view.closest('.ic_page_panel');
            if ($icpanel.length > 0) {
                return $icpanel.find('#'+this.presenter.configuration.activityModuleID)[0];
            } else {
                return $('#'+this.presenter.configuration.activityModuleID)[0];
            }
        }

        createTooltips() {
            var activityModuleView = this.getActivityModuleView();
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
            if (!this.presenter.configuration.displayFeedbackButtons) {
                this.$tooltip.on('dialogclose', function(event, ui){
                    this.isActivated = false;
                });
            }
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

        getState = function () {
            var state = {
                isActivated: this.isActivated,
                lastFeedback: this.lastFeedback,
                lastClass: this.lastClass,
                isWrapped: this.isWrapped()
            };
            return JSON.stringify(state);
        }

        isWrapped = function () {
            if (!this.presenter.configuration.displayFeedbackButtons) return false;
            if (this.presenter.configuration.displayMode == DISPLAY_MODES.BLOCK) {
                return this.presenter.isBlockFeedbackWrapped();
            } else if (this.presenter.configuration.displayMode == DISPLAY_MODES.POPUP) {
                return !this.presenter.$popup.dialog('isOpen');
            } else {
                if (this.$tooltip) {
                    return this.$tooltip.parent().find('.' + AUTOMATIC_FEEDBACK_BUTTON_CLASS).length > 0;
                } else {
                    return false;
                }
            }
        }


        setState = function (state) {
            var self = this;
            setTimeout(function() {
                // without timeout there are issues with positioning of feedback buttons
                var parsed = JSON.parse(state);
                self.isActivated = parsed.isActivated;
                self.lastFeedback = parsed.lastFeedback;
                self.lastClass = parsed.lastClass;
                if (parsed.isActivated) {
                    self.displayFeedback(parsed.lastFeedback, parsed.lastClass);
                } else {
                    self.clearFeedback();
                }
                if (self.presenter.configuration.displayFeedbackButtons && !parsed.isWrapped) {
                    if (self.presenter.configuration.displayMode == DISPLAY_MODES.BLOCK) {
                        self.presenter.unwrapBlockFeedback();
                    } else if (self.presenter.configuration.displayMode == DISPLAY_MODES.POPUP) {
                        return !self.presenter.$popup.dialog('open');
                    } else {
                        if (self.$tooltip) {
                            self.$tooltip.parent().find('.' + AUTOMATIC_FEEDBACK_BUTTON_CLASS).click();
                        }
                    }
                }
            }, 0);
        }

        popupClosedCallback = function () {
             this.isActivated = false;
        }

        onDestroy() {
            this.clearTooltips();
        }
    }


    return presenter;
}