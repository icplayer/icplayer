function AddonTask_Overlay_create(){

	var presenter = function(){};


	presenter.state = {
		completion: -1,
		attempts: 1,
		buttonState: 0,
		cover: true,
		isVisible: true,
		isFocused: false
	};


	presenter.COMPLETION_CODES = {
		done: 5,
		done_partially: 4,
		done_incorrectly: 3,
		correct: 2,
		partial: 1,
		neutral: 0,
		not_attempted: -1,
		wrong: -2
	};

	presenter.MODULE_RESULTS = {
		correct: 2,
		partial: 1,
		wrong: 0
	};

	presenter.BUTTON_STATES = {
		inactive: -1,
		validate: 0,
		retry: 1,
		show_answer: 2,
		next: 3
	};



	presenter.configuration = {
		isValid: true,
		addonID: ""
	};

	presenter.viewHandlers = null;
	presenter.playerController = null;
	presenter.eventBus = null;
	presenter.iframeSize = null;
	presenter.buttonActive = false;
	presenter.areModulesVisible = false;
	presenter.baseID = 'Task_Overlay';

	presenter.setPlayerController = function(controller) {
        presenter.playerController = controller;
        presenter.eventBus = presenter.playerController.getEventBus();
    };

	presenter.ERROR_CODES = {
		IMAGE01: 'Image path is invalid',
		ATPT01: 'Number of attempts must be a float'
	};

	presenter.executeCommand = function (name, params) {

		var commands = {
			'show': presenter.show,
			'hide': presenter.hide,
			'reset': presenter.reset,
			'uncover': presenter.uncover,
			'cover': presenter.cover
		};

		Commands.dispatch(commands, name, params, presenter);
	};

	presenter.show = function() {
		presenter.$view.css('display','');
    };

    presenter.hide = function() {
    	presenter.$view.css('display','none');
    };

	presenter.updateVisibility = function() {
        (presenter.state.isVisible) ? presenter.show() : presenter.hide();
    };

	presenter.reset = function() {
    };

	presenter.cover = function() {
		presenter.state.cover = true;
		presenter.updateView();
	};

	presenter.uncover = function() {
		scrollTo();
		presenter.state.cover = false;
		presenter.updateView();
	};

	function scrollTo() {
		var top = presenter.$view.offset().top;
		scrollToOffset(top);
	}

	function scrollToOffset(top)	{
		if (presenter.iframeSize && window.frameElement) { // set scrollTop while in iframe
			window.parent.postMessage('SCROLLTOP:'+top,"*");
		} else { // set scrollTop while outside of iframe
			$('html, body, #scrollableBody').scrollTop(top);
		}

	}

	function getMessage(event) {
		var data = event.data;
		if ((typeof data == 'string' || data instanceof String) && data.indexOf('I_FRAME_SIZES:') === 0) {
			presenter.iframeSize = JSON.parse(data.replace('I_FRAME_SIZES:', ''));
		}
	}
	function createEventListeners() {
		window.addEventListener('message', getMessage, false);
		if (presenter.eventBus) {
			presenter.eventBus.addEventListener('ValueChanged', presenter);
			presenter.eventBus.addEventListener('PageLoaded', presenter);
		}
		presenter.view.addEventListener('DOMNodeRemoved', function onDOMNodeRemoved(event) {
            if (event.target === this) {
                presenter.destroy();
            }
        });
	}

	presenter.onEventReceived = function(eventName, eventData) {
		if (eventName == 'ValueChanged') {
            var buttonState = presenter.state.buttonState;
            if (presenter.configuration.worksWith.indexOf(eventData.source) != -1
                && (buttonState == presenter.BUTTON_STATES.inactive || buttonState == presenter.BUTTON_STATES.retry)) {
                presenter.state.buttonState = presenter.BUTTON_STATES.validate;
                activateButton();
                presenter.updateView();
                return;
            }
        } else if (eventName == 'PageLoaded') {
			if (presenter.state.cover) {
				callModules('hide');
			}
			if (presenter.playerController) {
				var maxScore = getModulesMaxScore();
				if (maxScore == 0) {
                    presenter.state.completion = presenter.COMPLETION_CODES.neutral;
                    presenter.state.buttonState = presenter.BUTTON_STATES.next;
                    presenter.state.attempts = 0;
                    activateButton();
                    presenter.updateView();
                }
			}
			if (presenter.state.completion == presenter.COMPLETION_CODES.done
				|| presenter.state.completion == presenter.COMPLETION_CODES.done_partially
				|| presenter.state.completion == presenter.COMPLETION_CODES.done_incorrectly) {
				limitedShowAnswers();
            }
		}
	};

	function activateButton() {
		if (presenter.buttonActive ==! null && true === presenter.buttonActive) return;
		presenter.buttonActive = true;
		presenter.viewHandlers.$proceedButton.click(buttonHandler);
		presenter.viewHandlers.$proceedButton.removeClass('disabled');
	}

	function deactivateButton() {
		if (presenter.buttonActive ==! null && false === presenter.buttonActive) return;
		presenter.buttonActive = false;
		presenter.viewHandlers.$proceedButton.off('click', buttonHandler);
		var $el = presenter.viewHandlers.$proceedButton;
		if (!$el.hasClass('disabled')) $el.addClass('');
	}

	function destroyEventListeners() {
		window.removeEventListener('message', getMessage);
		presenter.viewHandlers.$proceedButton.off('click', buttonHandler);
		presenter.viewHandlers.$popupButton.off('click', togglePopup);
	}

	function returnErrorObject(ec) { return { isValid: false, errorCode: ec }; }

    function returnCorrectObject(v) { return { isValid: true, value: v }; }

	function parseImage(image) {
        if (ModelValidationUtils.isStringWithPrefixEmpty(image, "/file/")) {
            return returnErrorObject("IMAGE01");
        }

        return returnCorrectObject(image);
    }

	presenter.validateModel = function(model) {
		var validatedCurtainImage = parseImage(model["Curtain image"]);
        if (!validatedCurtainImage.isValid) {
            return returnErrorObject(validatedCurtainImage.errorCode);
        }
		presenter.state.isVisible = ModelValidationUtils.validateBoolean(model['Is Visible']);

        if (model['number_of_attempts'] == null || model['number_of_attempts'].length == 0 || isNaN(model['number_of_attempts'])) {
        	return returnErrorObject('ATPT01');
		}

        var worksWith = [];
        for (var i = 0; i < model.worksWith.length; i++) {
        	worksWith.push(model.worksWith[i].ID);
		}

		var texts = {
        	Attempts: 'Attempts:',
			Validate: 'Validate',
			Continue: 'Continue',
			Retry: 'Retry',
			Comment: 'Comment',
			ShowAnswers: 'Show Answers',
			Wrong: 'All wrong, try again.',
			FinalWrong: 'All wrong, see the answer.',
			Partial: 'Partially correct, try again',
			FinalPartial: 'Partially correct, se the answer',
			Correct: 'Correct'
		};

        function validateStaticText(model, propertyName) {
        	return model.texts[propertyName]!= null && model.texts[propertyName][propertyName].trim().length > 0;
		}

        if(validateStaticText(model, 'Attempts')) texts.Attempts = model.texts['Attempts']['Attempts'];
        if(validateStaticText(model, 'Validate')) texts.Validate = model.texts['Validate']['Validate'];
        if(validateStaticText(model, 'Continue')) texts.Continue = model.texts['Continue']['Continue'];
        if(validateStaticText(model, 'Retry')) texts.Retry = model.texts['Retry']['Retry'];
        if(validateStaticText(model, 'ShowAnswers')) texts.ShowAnswers = model.texts['ShowAnswers']['ShowAnswers'];
		if(validateStaticText(model, 'Comment')) texts.Comment = model.texts['Comment']['Comment'];

        if(validateStaticText(model, 'Wrong')) texts.Wrong = model.texts['Wrong']['Wrong'];
        if(validateStaticText(model, 'FinalWrong')) texts.FinalWrong = model.texts['FinalWrong']['FinalWrong'];
        if(validateStaticText(model, 'Partial')) texts.Partial = model.texts['Partial']['Partial'];
        if(validateStaticText(model, 'FinalPartial')) texts.FinalPartial = model.texts['FinalPartial']['FinalPartial'];
        if(validateStaticText(model, 'Correct')) texts.Correct = model.texts['Correct']['Correct'];

		return {
			isValid: true,
			width: parseInt(model["Width"], 10),
            height: parseInt(model["Height"], 10),
			addonID: model['ID'],
			curtainImage: validatedCurtainImage.value,
			worksWith: worksWith,
			maxAttempts: parseInt(model['number_of_attempts']),
			texts: texts,
			onFinished: model['onFinished'],
			onFinishedNext: ModelValidationUtils.validateBoolean(model['onFinishedNext']),
			defaultUncover: ModelValidationUtils.validateBoolean(model['uncoverOnDefault'])
		}
	};

	presenter.isShownigAnswers = false;

	function limitedShowAnswers() {
		presenter.isShownigAnswers = true;
		sendLimitedEvent('ShowAnswers');
	}

	function sendLimitedEvent (eventName) {
		if (!presenter.playerController) return;

        var eventData = {
            'value': eventName,
            'source': presenter.configuration.addonID,
            'item': JSON.stringify(presenter.configuration.worksWith)
        };

        presenter.eventBus.sendEvent('ValueChanged', eventData);
        presenter.configuration.worksWith.forEach(function (moduleId) {
            var module = presenter.playerController.getModule(moduleId);
            if (module && module.onEventReceived) {
                module.onEventReceived(eventName);
            }
        });
    }

    function limitedCheck() {
		limitedSetMode(true);
	}

	function limitedUncheck() {
		limitedSetMode(false);
	}

	function limitedSetMode (isErrorsMode) {
		if (!presenter.playerController) return;

		var eventName = '';
		if (isErrorsMode) {
			eventName = 'check';
		} else {
			eventName = 'uncheck';
		}

        var eventData = {
            'value': eventName,
            'source': presenter.configuration.addonID,
            'item': JSON.stringify(presenter.configuration.worksWith)
        };

        presenter.eventBus.sendEvent('ValueChanged', eventData);
        presenter.configuration.worksWith.forEach(function (moduleId) {
            presenter.playerController.setModuleMode(moduleId, isErrorsMode);
        });
    }

	function setImage(url, $wrapper) {
		var $image = $('<div>');
        $image.css('background-image', 'url("' + url + '")');
        $image.css('background-size','initial');
        $image.css("height", (presenter.configuration.height - 5));
        $image.css("width", presenter.configuration.width);
        $image.css("display","block");
        $wrapper.append($image);
	}

	function setPopup() {
		presenter.viewHandlers.$popupWrapper.css('display','none');
		presenter.viewHandlers.$popupButton.find('.baloon-button-text').click(togglePopup);
		presenter.viewHandlers.$popupButton.find('.baloon-button-text').text(presenter.configuration.texts.Comment);
		presenter.viewHandlers.$popupWrapper.find('.baloon-popup-close').click(hidePopup);
	}

	function updatePopup(moduleResult) {
		var content = "";
		if (moduleResult == presenter.MODULE_RESULTS.correct) {
			content = presenter.configuration.texts.Correct;
		} else if (moduleResult == presenter.MODULE_RESULTS.partial) {
			if(presenter.state.attempts == presenter.configuration.maxAttempts) {
				content = presenter.configuration.texts.FinalPartial;
			} else {
				content = presenter.configuration.texts.Partial;
			}
		} else {
			if(presenter.state.attempts == presenter.configuration.maxAttempts) {
				content = presenter.configuration.texts.FinalWrong;
			} else {
				content = presenter.configuration.texts.Wrong;
			}
		}
		setPopupValue(moduleResult, content);
	}

	function setResultIcons($el, className) {
		$el.removeClass('right-icon');
		$el.removeClass('wrong-icon');
		$el.removeClass('partial-icon');
		$el.addClass(className);
	}

	function setPopupValue(iconID, content) {
		var wrapper = presenter.viewHandlers.$popupWrapper;
		var $icon = wrapper.find('.baloon-popup-icon');
		var $text = wrapper.find('.baloon-popup-text');

		if (iconID == presenter.MODULE_RESULTS.correct) {
			setResultIcons($icon, 'check-icon');
		} else if (iconID == presenter.MODULE_RESULTS.partial) {
			setResultIcons($icon, 'partial-icon');
		} else {
			setResultIcons($icon, 'wrong-icon');
		}
		$text.text(content);
	}

	function showPopupButton() {
		var $el = presenter.viewHandlers.$popupButton;
		$el.removeClass('hidden');
		showPopup();
	}

	function hidePopupButton() {
		var $el = presenter.viewHandlers.$popupButton;
		if (!$el.hasClass('hidden')) $el.addClass('hidden');
		hidePopup();
	}

	function togglePopup() {
		if (presenter.viewHandlers.$popupWrapper.css('display') == 'none') {
			positionPopup();
        }
        var dir = 'up';
		if (presenter.viewHandlers.$popupWrapper.hasClass('above')) dir='down';

		presenter.viewHandlers.$popupWrapper.toggle('slide', {direction: dir});
	}

	function showPopup() {
		if (presenter.viewHandlers.$popupWrapper.css('display') == 'none') {
			togglePopup();
		}
	}

	function hidePopup() {
		if (presenter.viewHandlers.$popupWrapper.css('display') != 'none') {
			togglePopup();
		}
	}

	function positionPopup() {
		var $toolbar = presenter.viewHandlers.$toolbarContainer;
		var toolbarBottom = $toolbar.offset().top + $toolbar.outerHeight();
		var popupHeight = getPopupOffsetHeight();
		var windowBottom = 0;
		if (presenter.iframeSize) {
			windowBottom = presenter.iframeSize.offsetTop + presenter.iframeSize.windowInnerHeight;
			toolbarBottom += presenter.iframeSize.frameOffset;
		} else {
			windowBottom = $(window).scrollTop() + $(window).height();
		}


		var $wrapper = presenter.viewHandlers.$popupWrapper;
		if (toolbarBottom + popupHeight < windowBottom) {
			$wrapper.removeClass('above');
			if (!$wrapper.hasClass('below')) $wrapper.addClass('below');
		} else {
			$wrapper.removeClass('below');
			if (!$wrapper.hasClass('above')) $wrapper.addClass('above');
		}
	}

	function getPopupOffsetHeight() {
		presenter.viewHandlers.$popupWrapper.css('visibility','hidden');
		presenter.viewHandlers.$popupWrapper.css('display','');
		var height = presenter.viewHandlers.$popupWrapper.outerHeight();
		presenter.viewHandlers.$popupWrapper.css('visibility','');
		presenter.viewHandlers.$popupWrapper.css('display','none');
		return height;
	}

	presenter.initiate = function(view, model, isPreview) {
		var validatedModel = presenter.validateModel(model);
		if (!validatedModel.isValid) {
			DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, validatedModel.errorCode);
			return;
		}

		presenter.configuration = validatedModel;

		if (isPreview) {
			var attemptsText = presenter.configuration.texts.Attempts + " 1/" + presenter.configuration.maxAttempts;
			$(view).find('.attempts-text').text(attemptsText);
			$(view).find('.progress-button').text(presenter.configuration.texts.Validate);
			var width = $(view).find('.task-toolbar').innerWidth();
			$(view).find('.feedback-line').css('width', width);
			return;
		}

		presenter.view = view;
		presenter.$view = $(view);
		presenter.viewHandlers = {
			$view: $(view),
			$curtainImageWrapper: $(view).find('.curtain-image-wrapper'),
			$taskOverlayWrapper: $(view).find('.task-overlay-wrapper'),
			$taskToolbarWrapper: $(view).find('.task-toolbar'),
			$proceedButton: $(view).find('.progress-button'),
			$feedbackLine: $(view).find('.feedback-line'),
			$toolbarContainer: $(view).find('.toolbar-container'),
			$attemptsField: $(view).find('.attempts-text'),
			$correctIcon: $(view).find('.feedback-icon-right'),
			$partialCorrectIcon: $(view).find('.feedback-icon-part-correct'),
			$wrongIcon: $(view).find('.feedback-icon-wrong'),
			$popupButton: $(view).find('.baloon-button'),
			$popupWrapper: $(view).find('.baloon-popup-wrapper')
		};

        setImage(presenter.configuration.curtainImage, presenter.viewHandlers.$curtainImageWrapper);
        setPopup();

		createEventListeners();
		presenter.viewHandlers.$proceedButton.find('.progress-button-text').text(presenter.configuration.texts.Validate);

		if (presenter.configuration.defaultUncover) {
			presenter.state.cover = false;
			presenter.areModulesVisible = true;
		}

		presenter.updateVisibility();
		presenter.updateView();
    };

	presenter.destroy = function() {
		destroyEventListeners();
	};

	presenter.run = function(view, model){
		presenter.initiate(view, model,false);
	};

	presenter.createPreview = function(view, model){
		presenter.initiate(view,model,true);
	};

	presenter.getErrorCount = function(){
		return 0;
	};

	presenter.getMaxScore = function(){
		return 0;
	};

	presenter.getScore = function(){
		return 0;
	};

	function executeCommandOnFinished() {
		if (presenter.playerController == null) return;
        if (presenter.configuration.onFinished) {
            presenter.playerController.getCommands().executeEventCode(presenter.configuration.onFinished);
        }
        if (presenter.configuration.onFinishedNext) {
        	var pageIndex = presenter.playerController.getCurrentPageIndex();
        	var page = presenter.playerController.getPresentation().getPage(pageIndex);
        	if (page == null) return;
        	var modules = page.getModulesAsJS();
        	var tasks = [];
        	modules.forEach(function(module){
        		if (module.indexOf(presenter.baseID) != -1){
        			var index = module.replace(presenter.baseID, '');
        			if (!isNaN(index)) {
        				tasks.push({
							addonID: module,
							addonIndex: parseInt(index)
						})
					}
				}
			});
        	tasks.sort(function(a, b){return a.addonIndex - b.addonIndex});
        	var index = tasks.findIndex(function(el){return 0 == el.addonID.localeCompare(presenter.configuration.addonID)});
        	if (index != -1) {
        		if (index != tasks.length-1) {
                    presenter.playerController.getCommands().executeEventCode(tasks[index + 1].addonID + '.uncover()');
                } else if (pageIndex + 1 < presenter.playerController.getPresentation().getPageCount()) {
        			presenter.playerController.getCommands().gotoPageIndex(pageIndex + 1);
				}
			}
		}
	}

	presenter.areModulesVisible;

	function hideModules() {
		if (presenter.areModulesVisible) {
			presenter.areModulesVisible = false;
            callModules('hide');
        }
	}

	function showModules() {
		if (!presenter.areModulesVisible) {
			presenter.areModulesVisible = true;
			callModules('show');
        }
	}

	function callModules(methodName){
		for(var i = 0; i < presenter.configuration.worksWith.length; i++) {
			var moduleID = presenter.configuration.worksWith[i];
			var module = presenter.playerController.getModule(moduleID);
			if (module != null && module[methodName] != null && !isModuleNumbering(moduleID)) {
				(module[methodName])();
			}
			if(methodName == 'show' && moduleID.includes('task_numbering')){
				var previousNumberID = getPreviousTaskNumberID(moduleID);
				var previousNumberColor = $("[id='task_numbering " + previousNumberID + ".']").css('color');
				var actualNumberColor = $("[id='"+moduleID + "']").css('color');
				$("[id='"+moduleID + "']").css('color', previousNumberColor);
				$("[id='task_numbering " + previousNumberID + ".']").css('color', actualNumberColor);
			}
		}
	}

	function getPreviousTaskNumberID(moduleID){
		var dividedID = moduleID.split(" ");
		var secondPartOfDividedID = dividedID[1].split(".");
		var number = secondPartOfDividedID[0];
		return number - 1;
	}

	function isModuleNumbering(moduleID){
		var moduleView = presenter.$view.closest('.ic_page').find('#'+moduleID);
		if (moduleView == null || !moduleID.includes('task_numbering')) return false;
		return true;
	}

	presenter.getState = function(){
		return JSON.stringify(presenter.state);
	};

	presenter.setState = function(state){
		try {
			var parsedState = JSON.parse(state);
			presenter.state = parsedState;
			presenter.updateView();
		} catch (e) {
			console.error(e);
		}
	};

	function getModulesResults() {
		var maxScore = 0;
		var score = 0;
		for (var i = 0; i < presenter.configuration.worksWith.length; i++) {
            var moduleScore = presenter.playerController.getModuleScore(presenter.configuration.worksWith[i]);
            if (moduleScore != null) {
            	score += moduleScore.score;
            	maxScore +=moduleScore.maxScore;
            }
        }
		if (maxScore == score) return presenter.MODULE_RESULTS.correct;
		if (score == 0) return presenter.MODULE_RESULTS.wrong;
		return presenter.MODULE_RESULTS.partial;
	}

	function getModulesMaxScore() {
		var maxScore = 0;
		for (var i = 0; i < presenter.configuration.worksWith.length; i++) {
            var moduleScore = presenter.playerController.getModuleScore(presenter.configuration.worksWith[i]);
            if (moduleScore != null) {
            	maxScore +=moduleScore.maxScore;
            }
        }
		return maxScore;
	}

	function buttonHandler() {
		var results = getModulesResults();
		if (presenter.state.buttonState == presenter.BUTTON_STATES.validate) {
			updatePopup(results);
			showPopupButton();
			if (results == presenter.MODULE_RESULTS.correct) {
				presenter.state.buttonState = presenter.BUTTON_STATES.next;
				presenter.state.completion = presenter.COMPLETION_CODES.correct;
				limitedCheck();
			} else {
				limitedCheck();
				if (presenter.state.attempts == presenter.configuration.maxAttempts) {
					presenter.state.buttonState = presenter.BUTTON_STATES.show_answer;
					if (results == presenter.MODULE_RESULTS.partial) {
						presenter.state.completion = presenter.COMPLETION_CODES.partial;
					} else {
						presenter.state.completion = presenter.COMPLETION_CODES.wrong;
					}
				} else {
					presenter.state.buttonState = presenter.BUTTON_STATES.retry;
					if (results == presenter.MODULE_RESULTS.partial) {
						presenter.state.completion = presenter.COMPLETION_CODES.partial;
					} else {
						presenter.state.completion = presenter.COMPLETION_CODES.neutral;
					}
					presenter.state.attempts += 1;
				}
			}
		} else if (presenter.state.buttonState == presenter.BUTTON_STATES.retry) {
			limitedUncheck();
			presenter.state.buttonState = presenter.BUTTON_STATES.validate;
		} else if (presenter.state.buttonState == presenter.BUTTON_STATES.show_answer) {
			limitedUncheck();
			hidePopupButton();
			presenter.state.buttonState = presenter.BUTTON_STATES.next;
			limitedShowAnswers();
		} else if (presenter.state.buttonState == presenter.BUTTON_STATES.next) {
			if (results == presenter.MODULE_RESULTS.correct) {
                presenter.state.completion = presenter.COMPLETION_CODES.done;
            } else if (results == presenter.MODULE_RESULTS.partial) {
                presenter.state.completion = presenter.COMPLETION_CODES.done_partially;
            } else {
				presenter.state.completion = presenter.COMPLETION_CODES.done_incorrectly;
			}
			executeCommandOnFinished();
		}

		presenter.updateView();
	};

	presenter.updateView = function() {
		var buttonState = presenter.state.buttonState;
		var buttonText = presenter.viewHandlers.$proceedButton.find('.progress-button-text');
		if (buttonState == presenter.BUTTON_STATES.inactive) {
			deactivateButton();
		} else if (buttonState == presenter.BUTTON_STATES.validate) {
			activateButton();
			buttonText.text(presenter.configuration.texts.Validate);
		} else if (buttonState == presenter.BUTTON_STATES.retry) {
			activateButton();
			buttonText.text(presenter.configuration.texts.Retry);
		} else if (buttonState == presenter.BUTTON_STATES.show_answer) {
			activateButton();
			buttonText.text(presenter.configuration.texts.ShowAnswers);
		}else if (buttonState == presenter.BUTTON_STATES.next) {
			buttonText.text(presenter.configuration.texts.Continue);
		}

		var completion = presenter.state.completion;

		if (completion == presenter.COMPLETION_CODES.done
			|| completion == presenter.COMPLETION_CODES.done_partially
			|| completion == presenter.COMPLETION_CODES.done_incorrectly) {
			setOffFeedback();
		} else if (completion == presenter.COMPLETION_CODES.partial) {
			setPartialCorrectFeedback();
		} else if (completion == presenter.COMPLETION_CODES.correct) {
			setCorrectFeedback();
		} else if (completion == presenter.COMPLETION_CODES.wrong) {
			setWrongFeedback();
		} else {
			setNeutralFeedback();
		}

		if (presenter.state.cover) {
			presenter.viewHandlers.$curtainImageWrapper.css('display', '');
			presenter.viewHandlers.$taskOverlayWrapper.css('display', 'none');
			hideModules();
		} else {
			presenter.viewHandlers.$curtainImageWrapper.css('display', 'none');
			presenter.viewHandlers.$taskOverlayWrapper.css('display', '');
			showModules();
		}

		updateAttemptText();

	};

	function setFeedbackWidth() {
		var width = presenter.viewHandlers.$taskToolbarWrapper.innerWidth();
		presenter.viewHandlers.$feedbackLine.css('width',width);
	}

	function clearFeedbackLine() {
		var $el = presenter.viewHandlers.$feedbackLine;
		$el.removeClass('secondary-color');
		$el.removeClass('correct-color');
		$el.removeClass('wrong-color');
		$el.removeClass('off-color');
		$el.removeClass('hidden');
	}

	function clearFeedbackIcon() {
		var $el = presenter.viewHandlers.$wrongIcon;
		if (!$el.hasClass('hidden')) $el.addClass('hidden');
		$el = presenter.viewHandlers.$partialCorrectIcon;
		if (!$el.hasClass('hidden')) $el.addClass('hidden');
		$el = presenter.viewHandlers.$correctIcon;
		if (!$el.hasClass('hidden')) $el.addClass('hidden');
	}

	function setOffFeedback() {
		clearFeedbackLine();
		var $el = presenter.viewHandlers.$feedbackLine;
		if (!$el.hasClass('off-color')) $el.addClass('off-color');

		var completion = presenter.state.completion;
        if (completion == presenter.COMPLETION_CODES.done_partially) {
            presenter.viewHandlers.$partialCorrectIcon.removeClass('hidden');
        } else if (completion == presenter.COMPLETION_CODES.done) {
            presenter.viewHandlers.$correctIcon.removeClass('hidden');
        } else {
        	presenter.viewHandlers.$wrongIcon.removeClass('hidden');
		}
		hideToolbar();
	}

	function setCorrectFeedback() {
		showFeedbackLine();
		clearFeedbackLine();
		clearFeedbackIcon();
		showToolbar();
		var $el = presenter.viewHandlers.$feedbackLine;
		if (!$el.hasClass('correct-color')) $el.addClass('correct-color');
		presenter.viewHandlers.$correctIcon.removeClass('hidden');
	}

	function setPartialCorrectFeedback() {
		showFeedbackLine();
		clearFeedbackLine();
		clearFeedbackIcon();
		showToolbar();
		var $el = presenter.viewHandlers.$feedbackLine;
		if (!$el.hasClass('secondary-color')) $el.addClass('secondary-color');
		presenter.viewHandlers.$partialCorrectIcon.removeClass('hidden');
	}

	function setWrongFeedback() {
		showFeedbackLine();
		clearFeedbackLine();
		clearFeedbackIcon();
		showToolbar();
		var $el = presenter.viewHandlers.$feedbackLine;
		if (!$el.hasClass('wrong-color')) $el.addClass('wrong-color');
		presenter.viewHandlers.$wrongIcon.removeClass('hidden');
	}

	function setNeutralFeedback() {
		hideFeedbackLine();
		showToolbar();
	}

	function showFeedbackLine() {
		setFeedbackWidth();
		presenter.viewHandlers.$feedbackLine.removeClass('hidden');
	}
	function hideFeedbackLine() {
		if (!presenter.viewHandlers.$feedbackLine.hasClass('hidden'))
			presenter.viewHandlers.$feedbackLine.addClass('hidden');
	}

	function hideToolbar() {
		if (!presenter.viewHandlers.$taskToolbarWrapper.hasClass('hidden'))
			presenter.viewHandlers.$taskToolbarWrapper.addClass('hidden');
		presenter.viewHandlers.$taskOverlayWrapper.removeClass('task-overlay-wrapper-shadow');
		presenter.viewHandlers.$toolbarContainer.removeClass('toolbar-container-shadow');
	}

	function showToolbar() {
		presenter.viewHandlers.$taskToolbarWrapper.removeClass('hidden');
		if (!presenter.viewHandlers.$taskOverlayWrapper.hasClass('task-overlay-wrapper-shadow'))
			presenter.viewHandlers.$taskOverlayWrapper.addClass('task-overlay-wrapper-shadow');
		if (!presenter.viewHandlers.$toolbarContainer.hasClass('toolbar-container-shadow'))
			presenter.viewHandlers.$toolbarContainer.addClass('toolbar-container-shadow');
	}

	function updateAttemptText() {
		if (presenter.state.attempts == 0) {
			presenter.viewHandlers.$attemptsField.addClass('hidden');
		}
		presenter.viewHandlers.$attemptsField.text(presenter.configuration.texts.Attempts +
			' ' + presenter.state.attempts + '/' + presenter.configuration.maxAttempts);
	}

	return presenter;
}