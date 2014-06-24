function AddonAudio_create(){
    var presenter = function(){};
    var AUDIO_FILES_MISSING = "This addon needs at least 1 audio file.";
    var mp3File;
    var oggFile;
    var eventBus;
    var currentTimeAlreadySent;

    presenter.audio = {
        readyState : 0
    };
    presenter.playerController = null;
    presenter.addonID = null;

    presenter.setPlayerController = function(controller) {
        presenter.playerController = controller;
    };

    presenter.upgradeModel = function(model) {
        return presenter.upgradeEnableLoop(model);
    };

    presenter.upgradeEnableLoop = function (model) {
        var upgradedModel = {};
        $.extend(true, upgradedModel, model); // Deep copy of model object

        if (!upgradedModel["enableLoop"]) {
            upgradedModel["enableLoop"] = "";
        }

        return upgradedModel;
    };

    presenter.createTimeUpdateEventData = function (data) {
        return {
            source : presenter.addonID,
            item : '',
            value : '' + data.currentTime,
            score : ''
        };
    };

    presenter.createOnEndEventData = function () {
        return {
            source : presenter.addonID,
            item : 'end',
            value : '',
            score : ''
        };
    };

    presenter.getAudioCurrentTime = function () {
        return this.audio.currentTime;
    };

    function formatTime(seconds) {
        var minutes = Math.floor(seconds / 60);
        minutes = (minutes >= 10) ? minutes : "0" + minutes;
        seconds = Math.floor(seconds % 60);
        seconds = (seconds >= 10) ? seconds : "0" + seconds;
        return minutes + ":" + seconds;
    }

    function onLoadedMetadataCallback() {
        var duration = parseInt(presenter.audio.duration, 10);
        duration = isNaN(duration) ? 0 : duration;
        displayTimer(0, duration);
    }

    presenter.sendEventAndSetCurrentTimeAlreadySent = function (eventData, currentTime) {
        eventBus.sendEvent('ValueChanged', eventData);
        currentTimeAlreadySent = currentTime;
    };

    presenter.sendOnEndEvent = function () {
        var eventData = presenter.createOnEndEventData();
        eventBus.sendEvent('ValueChanged', eventData);
    };

    presenter.onTimeUpdateSendEventCallback = function() {
        var currentTime = formatTime(presenter.getAudioCurrentTime());
        if (currentTime !== currentTimeAlreadySent) { // to prevent duplicated value
            var eventData = presenter.createTimeUpdateEventData({'currentTime' : currentTime});
            presenter.sendEventAndSetCurrentTimeAlreadySent(eventData, currentTime);
        }
    };

    function onTimeUpdateCallback() {
        var duration = parseInt(presenter.audio.duration, 10);
        duration = isNaN(duration) ? 0 : duration;
        var currentTime = presenter.audio.currentTime;
        displayTimer(currentTime, duration);
    }

    function displayTimer(current, duration) {
        presenter.$view.find('#currentTime').html(formatTime(current) + ' / ');
        presenter.$view.find('#durationTime').html(formatTime(duration));
    }

    function createView(view, model, isPreview){
        mp3File = model.mp3;
        oggFile = model.ogg;

        if (!oggFile && !mp3File) {
            $(view).html(AUDIO_FILES_MISSING);
        }

        var audio = document.createElement("audio");

        if (presenter.configuration.defaultControls){
            $(audio).attr("controls", "controls").attr("preload", "auto");
        }

        var currentTime = document.createElement("span");
        var durationTime = document.createElement("span");
        $(currentTime).attr("id", "currentTime");
        $(durationTime).attr("id", "durationTime");

        var audioWrapper = presenter.$view.find(".wrapper-addon-audio");
        audioWrapper.append(audio);
        if (presenter.configuration.displayTime) {
            audioWrapper.append(currentTime).append(durationTime);
            audio.addEventListener('loadeddata', onLoadedMetadataCallback, false);
            audio.addEventListener('timeupdate', onTimeUpdateCallback, false);
        }
        if (!isPreview) {
            audio.addEventListener('timeupdate', presenter.onTimeUpdateSendEventCallback, false);
        }

        presenter.audio = audio;
    }

    function attachEventListeners(audio) {
        audio.addEventListener('ended', function() {
            if (presenter.configuration.enableLoop) {
                this.currentTime = 0;
                this.play();
            } else {
                presenter.executeOnEndEvent();
                presenter.sendOnEndEvent();
                presenter.stop();
            }
        }, false);

        audio.addEventListener('click', function(e) {
            e.stopPropagation();
        }, false);
    }

    function loadFiles(){
        var canPlayMp3 = false;
        var canPlayOgg = false;
        var audio = presenter.audio;

        if(audio.canPlayType) {
            canPlayMp3 = audio.canPlayType && "" != audio.canPlayType('audio/mpeg');
            canPlayOgg = audio.canPlayType && "" != audio.canPlayType('audio/ogg; codecs="vorbis"');

            if(canPlayMp3){
                $(audio).attr("src", mp3File);
            } else if (canPlayOgg) {
                $(audio).attr("src", oggFile);
            }

        } else {
            $(audio).append("Your browser doesn't support audio.");
        }

        $(audio).load();

        attachEventListeners(audio);
    }

    presenter.run = function(view, model){
        presenter.initialize(view, model, false);
        eventBus = presenter.playerController.getEventBus();
        presenter.addonID = model.ID;
    };

    presenter.createPreview = function(view, model){
        presenter.initialize(view, model, true);
    };

    presenter.initialize = function(view, model, isPreview) {
        var upgradedModel = presenter.upgradeModel(model);

        presenter.$view = $(view);
        presenter.configuration = presenter.validateModel(upgradedModel);

        createView(view, upgradedModel, isPreview);
        
        if (!isPreview) {
        	loadFiles();	
        }

    };

    presenter.validateModel = function (model) {
        var isVisible = ModelValidationUtils.validateBoolean(model["Is Visible"]);

        return {
            isVisible: isVisible,
            isVisibleByDefault: isVisible,
            onEndEventCode: model.onEnd,
            enableLoop: ModelValidationUtils.validateBoolean(model.enableLoop),
            displayTime: ModelValidationUtils.validateBoolean(model.displayTime),
            defaultControls: ModelValidationUtils.validateBoolean(model.defaultControls)
        };
    };

    presenter.executeCommand = function(name, params) {
        var commands = {
            'play': presenter.play,
            'stop': presenter.stop,
            'show': presenter.show,
            'hide': presenter.hide
        };

        Commands.dispatch(commands, name, params, presenter);
    };

    presenter.setVisibility = function(isVisible) {
        presenter.$view.css("visibility", isVisible ? "visible" : "hidden");
    };

    presenter.play = function() {
        if(this.audio.src && this.audio.paused) {
            this.stop();
            this.audio.play();
        }
    };

    presenter.stop = function() {
        if(presenter.audio.readyState > 0 && !presenter.audio.paused) {
            presenter.audio.pause();
            presenter.audio.currentTime = 0;
        }
    };

    presenter.show = function() {
        this.setVisibility(true);
        this.configuration.isVisible = true;
    };

    presenter.hideAddon = function() {
        this.setVisibility(false);
        this.configuration.isVisible = false;
    };

    presenter.hide = function () {
        this.stop();
        this.hideAddon();
    };

    presenter.reset = function() {
        presenter.stop();

        presenter.configuration.isVisible = presenter.configuration.isVisibleByDefault;
        if (presenter.configuration.isVisible) {
            presenter.show();
        } else {
            presenter.hideAddon();
        }
    };

    presenter.getState = function() {

        //presenter.stop();

        return JSON.stringify({
            isVisible : presenter.configuration.isVisible
        });
    };

    presenter.setState = function(stateString) {
        if (ModelValidationUtils.isStringEmpty(stateString)) return false;

        presenter.stop();

        if (JSON.parse(stateString).isVisible) {
            this.show();
        } else {
            this.hideAddon();
        }

        return false;
    };

    presenter.executeOnEndEvent = function () {
        if (presenter.configuration.onEndEventCode) {
            presenter.playerController.getCommands().executeEventCode(presenter.configuration.onEndEventCode);
        }
    };

    return presenter;
}