function AddonTimer_create(){

	var presenter = function(){};

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
    };

	presenter.ERROR_CODES = {
		"Z01": "None",
        "T01": "Wrong time"
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

	presenter.MODE = {
        'Timer': 'Timer',
		'Stopwatch': 'Stopwatch',
        DEFAULT: 'Timer'
    };

	presenter.start = function() {
        presenter.countDown();
		presenter.state.nowStart = true;
    };

	presenter.stop = function() {
        clearInterval(presenter.state.interval);
		presenter.state.isFired = false;
		presenter.state.nowStart = false;
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

	presenter.validateModel = function(model) {
		var mode = ModelValidationUtils.validateOption(presenter.MODE, model.Mode);
		var validatedTime = validateTime(mode,model['Time'],false);
		if (!validatedTime.isValid) {
			return {
				isValid: false,
				errorCode: validatedTime.errorCode
			}
		}
		var validatedAlarm = validateTime(mode,model['Time'],true);
		if (!validatedAlarm.isValid) {
			return {
				isValid: false,
				errorCode: validatedAlarm.errorCode
			}
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
		}
	};

	presenter.initiate = function(view, model, isPreview) {
		var validatedModel = presenter.validateModel(model);
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
		presenter.view.addEventListener('DOMNodeRemoved', function onDOMNodeRemoved(event) {
            if (event.target === this) {
                presenter.destroy();
            }
        });
	};

	presenter.destroy = function (event) {
        presenter.view.removeEventListener('DOMNodeRemoved', presenter.destroy);
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
			presenter.start()
		} else {
			presenter.stop();
		}
		presenter.updateVisibility();
		if (presenter.state.isVisible && presenter.state.showHours) {
			presenter.showHoursPart();
		}
	};

	return presenter;
}