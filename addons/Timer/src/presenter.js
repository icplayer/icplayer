function AddonTimer_create(){

	var presenter = function(){};
	presenter.keyboardControllerObject = null;
	presenter.isWCAGOn = false;

	presenter.configuration = {
		isValid: true,
		mode: "",
		isFired: false,
		time: 0,
		alarmTime: 0,
		immediateStart: false,
		sendEvent: false,
		isVisible: false,
		showHours: false,
		enableReset: false,
		errorCode: "Z01",
		addonID: ""
	};

	presenter.state = {
		isFired: false,
		isVisible: false,
		currentTime: 0,
		interval: null,
		nowStart: false,
		showHours: false
	};

	presenter.ERROR_CODES = {
		"Z01": "None",
        "T01": "Wrong time"
    };

	presenter.MODE = {
        'Timer': 'Timer',
		'Stopwatch': 'Stopwatch',
        DEFAULT: 'Timer'
    };

	presenter.DEFAULT_TTS_PHRASES = {
        TIMER_STARTED: "Timer started",
        TIMER_STOPPED: "Timer stopped",
        TIMER_ENDED: "Timer ended",
        STOPWATCH_STARTED: "Stopwatch started",
        STOPWATCH_STOPPED: "Stopwatch stopped",
        HOURS: "Hours",
        MINUTES: "Minutes",
        SECONDS: "Seconds"
    };

	presenter.setPlayerController = function(controller) {
        presenter.playerController = controller;
        presenter.eventBus = presenter.playerController.getEventBus();
    };

	presenter.createEventData = function(value) {
        return {
            source : presenter.configuration.addonID,
            value : value
        };
    };

	presenter.triggerEvent = function(value) {
        var eventData = presenter.createEventData(value);
        presenter.eventBus.sendEvent('ValueChanged', eventData);
		if (value === 'end') {
			presenter.readOnEnd();
		}
    };

	presenter.executeCommand = function (name, params) {

		var commands = {
			'start': presenter.start,
			'stop': presenter.stop,
			'show': presenter.show,
			'hide': presenter.hide,
			'reset': presenter.reset,
			'getTime': presenter.getTime,
			'addTime': presenter.addTime,
			'setTime': presenter.setTime,
			'showHoursPart': presenter.showHoursPart,
			'hideHoursPart': presenter.hideHoursPart
		};

		Commands.dispatch(commands, name, params, presenter);
	};

	presenter.start = function(shouldReadTTS = true) {
        presenter.countDown();
		presenter.state.nowStart = true;
		if (shouldReadTTS) {
			presenter.readOnStart();
		}
    };

	presenter.stop = function(shouldReadTTS = true) {
        clearInterval(presenter.state.interval);
		presenter.state.isFired = false;
		presenter.state.nowStart = false;
		if (shouldReadTTS) {
			presenter.readOnStop();
		}
    };

	presenter.show = function() {
		presenter.displayhhmmss(presenter.state.currentTime);
        presenter.setVisibility(true);
		if (presenter.state.showHours) {
			presenter.showHoursPart();
		}
    };

    presenter.hide = function() {
        presenter.setVisibility(false);
		presenter.$view.find('.timer-wrapper .hours').css("visibility", "hidden");
		presenter.$view.find('.timer-wrapper .hours-separator').css("visibility", "hidden");
    };

	presenter.updateVisibility = function() {
        (presenter.state.isVisible) ? presenter.show() : presenter.hide();
    };

	presenter.reset = function() {
		if (presenter.configuration.enableReset) {
			clearInterval(presenter.state.interval);
			presenter.state.isFired = false;
			presenter.state.currentTime = presenter.configuration.time;
			presenter.displayhhmmss(presenter.state.currentTime);
			presenter.state.isVisible = presenter.configuration.isVisible;
			presenter.setVisibility(presenter.state.isVisible);
			presenter.state.nowStart = presenter.configuration.immediateStart;
			if (presenter.state.nowStart) {
				presenter.start();
			}
		}
    };

	presenter.getTime = function() {
		var newTime = timeToHMMSS(presenter.state.currentTime);
		var time = (newTime.hours > 0|| presenter.state.showHours) ? (newTime.hours +':') : ('');
		time += newTime.minutes+':'+newTime.seconds;
		return time;
    };

	presenter.setTime = function(time) {
		var timeInSeconds = validateTime('Timer',time,false);
		if (timeInSeconds.isValid) {
			presenter.state.currentTime = timeInSeconds.time;
			presenter.displayhhmmss(presenter.state.currentTime);
		}
    };

	presenter.addTime = function(time) {
		if (!isNaN(time)) {
			presenter.state.currentTime += parseInt(time);
			presenter.displayhhmmss(presenter.state.currentTime);
		}
    };

	presenter.showHoursPart = function() {
        presenter.state.showHours = true;
		presenter.$view.find('.timer-wrapper .hours').css("visibility", "visible");
		presenter.$view.find('.timer-wrapper .hours-separator').css("visibility", "visible");
    };

	presenter.hideHoursPart = function() {
        presenter.state.showHours = false;
		presenter.$view.find('.timer-wrapper .hours').css("visibility", "hidden");
		presenter.$view.find('.timer-wrapper .hours-separator').css("visibility", "hidden");
    };

    presenter.setVisibility = function(isVisible) {
        presenter.state.isVisible = isVisible;
        presenter.$view.css("visibility", isVisible ? "visible" : "hidden");
    };

	var validateTime = function (mode,time,isAlarm) {
		if ((mode === 'Timer' && isAlarm === true) || (mode === 'Stopwatch' && isAlarm === false) || (mode === 'Stopwatch' && isAlarm === true && time === '')) {
			return {
				time: 0,
				isValid: true
			}
		}
		var parts = time.split(':');
		var timeInSeconds;

		if (parts.length !== 2 && parts.length !== 3) {
			return {
				isValid: false,
				errorCode: "T01"
			}
		} else {
			$.each(parts, function(k,v){
				if(v !== parseInt(v) || v < 0 || v > 59) {
					return {
						isValid: false,
						errorCode: "T01"
					}
				}
			});
		}
		if (parts.length === 2) {
			timeInSeconds = parseInt(parts[0])*60 + parseInt(parts[1]);
		} else {
			timeInSeconds = parseInt(parts[0])*3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
		}
		return {
			time: timeInSeconds,
			isValid: true
		};
	};

	presenter.displayhhmmss = function (totalSeconds) {
		var newTime = timeToHMMSS(totalSeconds);
		presenter.$view.find('.timer-wrapper .hours').html(newTime.hours);
		presenter.$view.find('.timer-wrapper .minutes').html(newTime.minutes);
		presenter.$view.find('.timer-wrapper .seconds').html(newTime.seconds);
	};

	var timeToHMMSS = function (totalSeconds) {
		var hour = Math.floor(totalSeconds / 3600);
		var minute = Math.floor((totalSeconds - (hour * 3600)) / 60);
		var second = totalSeconds - (hour * 3600) - (minute * 60);
		if (minute < 10) {
			minute = '0' + minute;
		}
		if (second < 10) {
			second = '0' + second;
		}
		return {
			hours: hour,
			minutes: minute,
			seconds: second
		}
	};

	presenter.countDown = function () {
		if (!presenter.state.isFired) {
			presenter.state.isFired = true;
			presenter.state.interval = setInterval(function() {
				if (presenter.configuration.mode === 'Timer' && presenter.state.currentTime > 0) {
					presenter.state.currentTime--
				} else if (presenter.configuration.mode === 'Stopwatch') {
					presenter.state.currentTime++;
				}
				var newTime = timeToHMMSS(presenter.state.currentTime);
				if (presenter.state.isVisible) {
					presenter.displayhhmmss(presenter.state.currentTime);
				}
				if (presenter.configuration.sendEvent) {
					var eventTime = (newTime.hours > 0) ? (newTime.hours +':') : ('');
					eventTime += newTime.minutes+':'+newTime.seconds;
					presenter.triggerEvent(eventTime);
				}
				if (presenter.configuration.mode === 'Timer' && presenter.state.currentTime === 0) {
					presenter.triggerEvent('end');
					presenter.state.isFired = false;
					presenter.state.nowStart = false;
					clearInterval(presenter.state.interval);
				}
				if (presenter.configuration.mode === 'Stopwatch' && presenter.configuration.alarmTime === presenter.state.currentTime) {
					presenter.triggerEvent('time');
				}
			}, 1000);
		}
	};

	presenter.upgradeModel = function (model) {
		return presenter.upgradeModelWithSpeechTexts(model);
	};

	presenter.upgradeModelWithSpeechTexts = function (model) {
		const upgradedModel = {};
		const defaultValue = {
			TimerStarted: {TimerStarted: ''},
			TimerStopped: {TimerStopped: ''},
			TimerEnded: {TimerEnded: ''},
			StopwatchStarted: {StopwatchStarted: ''},
			StopwatchStopped: {StopwatchStopped: ''},
			Hours: {Hours: ''},
			Minutes: {Minutes: ''},
			Seconds: {Seconds: ''}
		};
        $.extend(true, upgradedModel, model);

		if (!upgradedModel.hasOwnProperty('speechTexts')) {
			upgradedModel['speechTexts'] = defaultValue;
		}

		return upgradedModel;
	};

	presenter.validateModel = function(model) {
		var mode = ModelValidationUtils.validateOption(presenter.MODE, model.Mode);
		var validatedTime = validateTime(mode,model['Time'],false);
		if (!validatedTime.isValid) {
			return {
				isValid: false,
				errorCode: validatedTime.errorCode
			};
		}
		var validatedAlarm = validateTime(mode,model['Time'],true);
		if (!validatedAlarm.isValid) {
			return {
				isValid: false,
				errorCode: validatedAlarm.errorCode
			};
		}
		return {
			isValid: true,
			mode: mode,
			isFired: false,
			time: validatedTime.time,
			alarmTime: validatedAlarm.time,
			immediateStart: ModelValidationUtils.validateBoolean(model['Immediate start']),
			sendEvent: ModelValidationUtils.validateBoolean(model['Send event every second']),
			isVisible: ModelValidationUtils.validateBoolean(model["Is Visible"]),
			showHours: ModelValidationUtils.validateBoolean(model["Show hours"]),
			enableReset: ModelValidationUtils.validateBoolean(model["Enable reset"]),
			addonID: model['ID']
		};
	};

	presenter.initiate = function(view, model, isPreview) {
		const upgradedModel = presenter.upgradeModel(model);
		const validatedModel = presenter.validateModel(model);
		if (!validatedModel.isValid) {
			DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, validatedModel.errorCode);
			return;
		}
		presenter.configuration = validatedModel;
		presenter.view = view;
		presenter.$view = $(view);
		presenter.state.currentTime = presenter.configuration.time;
		presenter.state.nowStart = presenter.configuration.immediateStart;
		presenter.state.showHours = presenter.configuration.showHours;
		if (!presenter.state.showHours) {
			presenter.$view.find('.timer-wrapper .hours').css("visibility", "hidden");
			presenter.$view.find('.timer-wrapper .hours-separator').css("visibility", "hidden");
		}
        presenter.state.isVisible = presenter.configuration.isVisible;
		presenter.displayhhmmss(presenter.state.currentTime);
		if (!isPreview && presenter.state.nowStart) {
			presenter.countDown();
		}
		MutationObserverService.createDestroyObserver(presenter.configuration.addonID, presenter.destroy, presenter.view);
		MutationObserverService.setObserver();
		presenter.setSpeechTexts(upgradedModel);
		presenter.buildKeyboardController();
	};

	presenter.destroy = function () {
        clearInterval(presenter.state.interval);
    };

	presenter.run = function(view, model){
		presenter.initiate(view, model,false);
	};

	presenter.createPreview = function(view, model){
		presenter.initiate(view, model,true);
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

	presenter.getState = function(){
		return JSON.stringify({
            currentTime : presenter.state.currentTime,
            visible : presenter.state.isVisible,
			nowStart : presenter.state.nowStart,
			showHours : presenter.state.showHours
        });
	};

	presenter.setState = function(state){
		var parsedState = JSON.parse(state);
		presenter.state.isVisible = parsedState.visible;
		presenter.state.showHours = parsedState.showHours;
		presenter.state.currentTime = parsedState.currentTime;
		presenter.displayhhmmss(presenter.state.currentTime);
		presenter.state.nowStart = parsedState.nowStart;
		if (presenter.state.nowStart) {
			presenter.start(false);
		} else {
			presenter.stop(false);
		}
		presenter.updateVisibility();
		if (presenter.state.isVisible && presenter.state.showHours) {
			presenter.showHoursPart();
		}
	};

	presenter.setWCAGStatus = function(isWCAGOn) {
        presenter.isWCAGOn = isWCAGOn;
    };

	presenter.keyboardController = function (keycode, isShiftKeyDown, event) {
		presenter.keyboardControllerObject.handle(keycode, isShiftKeyDown, event);
	};
	
	presenter.buildKeyboardController = function () {
		const elements = presenter.getElementsForKeyboardNavigation();
		presenter.keyboardControllerObject =
			new TimerKeyboardController(elements);
	};

	presenter.setSpeechTexts = function (model) {
		const speechTexts = model['speechTexts'];
		presenter.speechTexts = {
			TimerStarted: presenter.DEFAULT_TTS_PHRASES.TIMER_STARTED,
			TimerStopped: presenter.DEFAULT_TTS_PHRASES.TIMER_STOPPED,
			TimerEnded: presenter.DEFAULT_TTS_PHRASES.TIMER_ENDED,
			StopwatchStarted: presenter.DEFAULT_TTS_PHRASES.STOPWATCH_STARTED,
			StopwatchStopped: presenter.DEFAULT_TTS_PHRASES.STOPWATCH_STOPPED,
			Hours: presenter.DEFAULT_TTS_PHRASES.HOURS,
			Minutes: presenter.DEFAULT_TTS_PHRASES.MINUTES,
			Seconds: presenter.DEFAULT_TTS_PHRASES.SECONDS,
		};

		if(!speechTexts || $.isEmptyObject(speechTexts)) {
			return;
		}

		presenter.speechTexts = {
			TimerStarted: TTSUtils.getSpeechTextProperty(
				speechTexts.TimerStarted.TimerStarted,
				presenter.speechTexts.TimerStarted
			),
			TimerStopped: TTSUtils.getSpeechTextProperty(
				speechTexts.TimerStopped.TimerStopped,
				presenter.speechTexts.TimerStopped
			),
			TimerEnded: TTSUtils.getSpeechTextProperty(
				speechTexts.TimerEnded.TimerEnded,
				presenter.speechTexts.TimerEnded
			),
			StopwatchStarted: TTSUtils.getSpeechTextProperty(
				speechTexts.StopwatchStarted.StopwatchStarted,
				presenter.speechTexts.StopwatchStarted
			),
			StopwatchStopped: TTSUtils.getSpeechTextProperty(
				speechTexts.StopwatchStopped.StopwatchStopped,
				presenter.speechTexts.StopwatchStopped
			),
			Hours: TTSUtils.getSpeechTextProperty(
				speechTexts.Hours.Hours,
				presenter.speechTexts.Hours
			),
			Minutes: TTSUtils.getSpeechTextProperty(
				speechTexts.Minutes.Minutes,
				presenter.speechTexts.Minutes
			),
			Seconds: TTSUtils.getSpeechTextProperty(
				speechTexts.Seconds.Seconds,
				presenter.speechTexts.Seconds
			),
		};
	};

	presenter.getElementsForKeyboardNavigation = function () {
		return presenter.$view.find('.timer-wrapper');
	};

	function TimerKeyboardController(elements) {
		KeyboardController.call(this, elements, 1);
	}

	TimerKeyboardController.prototype = Object.create(window.KeyboardController.prototype);
	TimerKeyboardController.prototype.constructor = TimerKeyboardController;

	TimerKeyboardController.prototype.getCurrentElement = function () {
		return this.getTarget(this.keyboardNavigationCurrentElement, false);
	};

	TimerKeyboardController.prototype.getTarget = function (element, willBeClicked) {
        return $(element);
    };

	TimerKeyboardController.prototype.select = function (event) {
		if (event){
			event.preventDefault();
		}

		this.selectAction();
	};

	TimerKeyboardController.prototype.enter = function (event) {
		KeyboardController.prototype.enter.call(this, event);
		this.readCurrentElement();
	};

	TimerKeyboardController.prototype.readCurrentElement = function () {
		presenter.speak(presenter.getTextToRead());
	};

	presenter.readOnStart = function () {
		const textToRead = presenter.configuration.mode === 'Timer' ?
			presenter.speechTexts.TimerStarted : presenter.speechTexts.StopwatchStarted;

		presenter.speak(textToRead, true);
	};


	presenter.readOnEnd = function () {
		presenter.speak(presenter.speechTexts.TimerEnded);
	};

	presenter.readOnStop = function () {
		const textToRead = presenter.configuration.mode === 'Timer' ?
			presenter.speechTexts.TimerStopped : presenter.speechTexts.StopwatchStopped;

		presenter.speak(textToRead, true);
	};
	
	presenter.speak = function (data, shouldRunWithOffset = false) {
		const tts = presenter.getTextToSpeechOrNull();
		const isWCAGActive = presenter.playerController.isWCAGOn();
		if (!(tts && isWCAGActive)) { return; }

		if (shouldRunWithOffset) {
			setTimeout(() => {
				presenter.waitForEndSpeaking(tts.speak, data);
			}, 400);
		} else {
			tts.speak(data);
		}
	};

	presenter.waitForEndSpeaking = function(callback, data, timeout = 5000) {
        const startTime = Date.now();

        let interval = setInterval(() => {
            if (!window.speechSynthesis.speaking) {
                clearInterval(interval);
                callback(data);
            } else if (Date.now() - startTime > timeout) {
                clearInterval(interval);
            }
        }, 100);
    };

	presenter.getTextToSpeechOrNull = function () {
		if (presenter.playerController) {
			return presenter.playerController.getModule('Text_To_Speech1');
		}

		return null;
	};

	presenter.getTextToRead = function () {
		if (presenter.state.currentTime === 0) {
			return `0 ${presenter.speechTexts.Seconds}`;
		}

		const timerValues = presenter.getTime().split(':');
		let hours, minutes, seconds = 0;
		let text = '';
		if (timerValues.length > 2) {
			hours = +timerValues[0];
			minutes = +timerValues[1];
			seconds = +timerValues[2];
		} else {
			minutes = +timerValues[0];
			seconds = +timerValues[1];
		}

		if (hours && +hours > 0) {
			text += `${hours} ${presenter.speechTexts.Hours},`;
		}

		if (minutes && +minutes > 0 || !text) {
			text += `${minutes} ${presenter.speechTexts.Minutes},`;
		}

		if (seconds && +seconds > 0 || !text) {
			text += `${seconds} ${presenter.speechTexts.Seconds}`;
		}

		return text;
	};

	presenter.isSelectable = function(isWCAGOn) {
	    return isWCAGOn;
	}

	return presenter;
}