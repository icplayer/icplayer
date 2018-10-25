function AddonTask_Overlay_create(){

	var presenter = function(){};


	presenter.state = {
		completion: -1,
		attempts: 1,
		buttonState: 0,
		cover: true
	};


	presenter.completedCodes = {
		done: 5,
		done_partially: 4,
		done_incorrectly: 3,
		correct: 2,
		partial: 1,
		neutral: 0,
		not_attempted: -1,
		wrong: -2
	};

	presenter.moduleResults = {
		correct: 2,
		partial: 1,
		wrong: 0,
		not_attempted: -1
	};

	presenter.buttonStates = {
		inactive: 0,
		validate: 1,
		retry: 2,
		show_answer: 3,
		next: 4
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
    };

    presenter.hide = function() {
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

	function scrollTo()	{
		if (presenter.iframeSize && window.frameElement) { // set scrollTop while in iframe
			var top = presenter.$view.offset().top;// + presenter.iframeSize.frameOffset;
			parent.postMessage('SCROLLTOP:'+top,"*");

		} else { // set scrollTop while outside of iframe
			var top = presenter.$view.offset().top;
			window.scrollTo(0,top);
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
		}
		presenter.view.addEventListener('DOMNodeRemoved', function onDOMNodeRemoved(event) {
            if (event.target === this) {
                presenter.destroy();
            }
        });
	}

	presenter.onEventReceived = function(eventName, eventData) {
		var buttonState = presenter.state.buttonState;
		if(presenter.configuration.worksWith.indexOf(eventData.source) != -1
			&& (buttonState == presenter.buttonStates.inactive || buttonState == presenter.buttonStates.retry)) {
			presenter.state.buttonState = presenter.buttonStates.validate;
			activateButton();
			presenter.updateView();
			return;
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
		if (!$el.hasClass('disabled')) $el.addClass('disabled');
	}

	function destroyEventListeners() {
		window.removeEventListener('message', getMessage);
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
			ShowAnswers: 'Show Answers'
		};

        function validateStaticText(model, propertyName) {
        	return model.texts[propertyName]!= null && model.texts[propertyName][propertyName].trim().length > 0;
		}

        if(validateStaticText(model, 'Attempts')) texts.Attempts = model.texts['Attempts']['Attempts'];
        if(validateStaticText(model, 'Validate')) texts.Validate = model.texts['Validate']['Validate'];
        if(validateStaticText(model, 'Continue')) texts.Continue = model.texts['Continue']['Continue'];
        if(validateStaticText(model, 'Retry')) texts.Retry = model.texts['Retry']['Retry'];
        if(validateStaticText(model, 'ShowAnswers')) texts.ShowAnswers = model.texts['ShowAnswers']['ShowAnswers'];

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
			defaultUncover: ModelValidationUtils.validateBoolean(model['uncoverOnDefault'])
		}
	};

	function limitedShowAnswers() {
		sendLimitedEvent('ShowAnswers');
	}

	function limitedHideAnswers() {
		sendLimitedEvent('HideAnswers');
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

	function setImage(url, alt, $wrapper) {
		var $image = $('<img>');
        $image.attr("src", url);
        $image.attr("height", presenter.configuration.height);
        $image.attr("width", presenter.configuration.width);
        $image.attr("alt", alt);
        $wrapper.append($image);
	}

	presenter.initiate = function(view, model, isPreview) {
		var validatedModel = presenter.validateModel(model);
		if (!validatedModel.isValid) {
			DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, validatedModel.errorCode);
			return;
		}
		presenter.configuration = validatedModel;

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
			$wrongIcon: $(view).find('.feedback-icon-wrong')
		};

        setImage(presenter.configuration.curtainImage, 'Blocked', presenter.viewHandlers.$curtainImageWrapper);

		createEventListeners();
		presenter.viewHandlers.$proceedButton.text(presenter.configuration.texts.Validate);

		if (presenter.configuration.defaultUncover) {
			presenter.state.cover = false;
		}

		presenter.updateView();
    };

	presenter.destroy = function() {
		destroyEventListeners();
	};

	presenter.run = function(view, model){
		presenter.initiate(view, model,false);
	};

	presenter.createPreview = function(view, model){
		return;
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
        if (!presenter.configuration.onFinished) return;

        presenter.playerController.getCommands().executeEventCode(presenter.configuration.onFinished);
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
		if (maxScore == score) return presenter.moduleResults.correct;
		if (score == 0) return presenter.moduleResults.wrong;
		return presenter.moduleResults.partial;


	}

	function buttonHandler() {
		var results = getModulesResults();
		if (presenter.state.buttonState == presenter.buttonStates.validate) {
			limitedCheck();
			if (results == presenter.moduleResults.correct) {
				presenter.state.buttonState = presenter.buttonStates.next;
				presenter.state.completion = presenter.completedCodes.correct;
			} else {
				if (presenter.state.attempts == presenter.configuration.maxAttempts) {
					presenter.state.buttonState = presenter.buttonStates.show_answer;
					if (results == presenter.moduleResults.partial) {
						presenter.state.completion = presenter.completedCodes.partial;
					} else {
						presenter.state.completion = presenter.completedCodes.wrong;
					}
				} else {
					presenter.state.buttonState = presenter.buttonStates.retry;
					if (results == presenter.moduleResults.partial) {
						presenter.state.completion = presenter.completedCodes.partial;
					} else {
						presenter.state.completion = presenter.completedCodes.neutral;
					}
					presenter.state.attempts += 1;
				}
			}
		} else if (presenter.state.buttonState == presenter.buttonStates.retry) {
			limitedUncheck();
			presenter.state.buttonState = presenter.buttonStates.validate;
		} else if (presenter.state.buttonState == presenter.buttonStates.show_answer) {
			presenter.state.buttonState = presenter.buttonStates.next;
			limitedShowAnswers();
		} else if (presenter.state.buttonState == presenter.buttonStates.next) {
			limitedHideAnswers();
			limitedCheck();
			presenter.state.completion = presenter.completedCodes.done;
			executeCommandOnFinished();
		}

		presenter.updateView();
	};

	presenter.updateView = function() {
		var buttonState = presenter.state.buttonState;
		if (buttonState == presenter.buttonStates.inactive) {
			deactivateButton();
		} else if (buttonState == presenter.buttonStates.validate) {
			activateButton();
			presenter.viewHandlers.$proceedButton.text(presenter.configuration.texts.Validate);
		} else if (buttonState == presenter.buttonStates.retry) {
			activateButton();
			presenter.viewHandlers.$proceedButton.text(presenter.configuration.texts.Retry);
		} else if (buttonState == presenter.buttonStates.show_answer) {
			activateButton();
			presenter.viewHandlers.$proceedButton.text(presenter.configuration.texts.ShowAnswers);
		}else if (buttonState == presenter.buttonStates.next) {
			presenter.viewHandlers.$proceedButton.text(presenter.configuration.texts.Continue);
		}

		var completion = presenter.state.completion;

		if (completion == presenter.completedCodes.done || completion == presenter.completedCodes.done_partially
			|| completion == presenter.completedCodes.done_incorrectly) {
			setOffFeedback();
		} else if (completion == presenter.completedCodes.partial) {
			setPartialCorrectFeedback();
		} else if (completion == presenter.completedCodes.correct) {
			setCorrectFeedback();
		} else if (completion == presenter.completedCodes.wrong) {
			setWrongFeedback();
		} else {
			setNeutralFeedback();
		}

		if (presenter.state.cover) {
			presenter.viewHandlers.$curtainImageWrapper.css('display', '');
			presenter.viewHandlers.$taskOverlayWrapper.css('display', 'none');
			presenter.$view.css('z-index','100');
		} else {
			presenter.viewHandlers.$curtainImageWrapper.css('display', 'none');
			presenter.viewHandlers.$taskOverlayWrapper.css('display', '');
			presenter.$view.css('z-index','');
		}

		updateAttemptText();

	};

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
        if (completion == presenter.completedCodes.done_partially) {
            presenter.viewHandlers.$partialCorrectIcon.removeClass('hidden');
        } else if (completion == presenter.completedCodes.done) {
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
		presenter.viewHandlers.$attemptsField.text(presenter.configuration.texts.Attempts +
			' ' + presenter.state.attempts + '/' + presenter.configuration.maxAttempts);
	}

	return presenter;
}