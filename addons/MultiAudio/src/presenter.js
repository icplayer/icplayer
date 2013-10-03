function AddonMultiAudio_create(){
    var presenter = function(){};
    var AUDIO_FILES_MISSING = "This addon needs at least 1 audio file.";
    var eventBus;
    var currentTimeAlreadySent;
    presenter.currentAudio = 0;
    presenter.audio = {};
    presenter.files = [];
    presenter.visible = true;
    presenter.defaultVisibility = true;
    presenter.globalView = null;
    presenter.globalModel = null;
    presenter.playerController = null;
    presenter.addonID = null;

    presenter.setPlayerController = function(controller) {
        presenter.playerController = controller;
    };

    presenter.createEventData = function (data) {
        return {
            source : presenter.addonID,
            item : '',
            value : '' + data.currentTime,
            score : ''
        };
    };

    presenter.sendEventAndSetCurrentTimeAlreadySent = function (eventData, currentTime) {
        eventBus.sendEvent('ValueChanged', eventData);
        currentTimeAlreadySent = currentTime;
    };

    presenter.getAudioCurrentTime = function () {
        return this.audio.currentTime;
    };

    presenter.onTimeUpdateSendEventCallback = function() {
        var currentTime = presenter.formatTime(presenter.getAudioCurrentTime());
        if (currentTime !== currentTimeAlreadySent) { // to prevent duplicated value
            var eventData = presenter.createEventData({'currentTime' : currentTime});
            presenter.sendEventAndSetCurrentTimeAlreadySent(eventData, currentTime);
        }
    };

    presenter.addAttributeLoop = function(audio) {
        $(audio).on("ended", function() {
            this.currentTime = 0;
            this.play();
        });
    };

    presenter.prepareAudio = function(){
        this.audio = document.createElement("audio");
        var audioWrapper = presenter.globalView.find(".wrapper-addon-audio");
        audioWrapper.html("");
        audioWrapper.append(this.audio);
        return audioWrapper;
    };

    presenter.createView = function(view, model){
        var interfaceType = model["Interface"];
        var audioWrapper = this.prepareAudio();
        this.audio.addEventListener('timeupdate', presenter.onTimeUpdateSendEventCallback, false);
        this.audio.addEventListener('click', function(e) {
            e.stopPropagation();
        }, false);

        switch(interfaceType) {
            case "Default controls":
                $(this.audio).attr("controls", "controls").attr("preload", "auto");
                break;
            case "Display time":
                this.createCurrentAndDuration(audioWrapper);
                this.audio.addEventListener('loadeddata', onLoadedMetadataCallback, false);
                this.audio.addEventListener('timeupdate', onTimeUpdateCallback, false);
                break;
        }
    };

    presenter.createCurrentAndDuration = function(audioWrapper) {
        var currentTime = document.createElement("span");
        var durationTime = document.createElement("span");
        $(currentTime).attr("id", "currentTime");
        $(durationTime).attr("id", "durationTime");
        audioWrapper.html(currentTime).append(durationTime);
    };

    presenter.formatTime = function(seconds) {
        var minutes = Math.floor(seconds / 60);
        minutes = (minutes >= 10) ? minutes : "0" + minutes;
        seconds = Math.floor(seconds % 60);
        seconds = (seconds >= 10) ? seconds : "0" + seconds;
        return minutes + ":" + seconds;
    };

    function onLoadedMetadataCallback() {
        var duration = parseInt(presenter.audio.duration, 10);
        duration = isNaN(duration) ? 0 : duration;
        presenter.displayTimer(0, duration);
    }

    function onTimeUpdateCallback() {
        var duration = parseInt(presenter.audio.duration, 10);
        duration = isNaN(duration) ? 0 : duration;
        var currentTime = presenter.audio.currentTime;
        presenter.displayTimer(currentTime, duration);
    }

    presenter.displayTimer = function(current, duration) {
        presenter.globalView.find('#currentTime').html(presenter.formatTime(current) + ' / ');
        presenter.globalView.find('#durationTime').html(presenter.formatTime(duration));
    };

    presenter.loadFiles = function(audio, model){
        this.files = model["Files"];
        var oggFile = this.files[this.currentAudio]["Ogg"];
        var mp3File = this.files[this.currentAudio]["Mp3"];
        var loop = !!(this.files[this.currentAudio]["Enable loop"] == "True");
        var canPlayMp3 = false;
        var canPlayOgg = false;

        var validated = this.validateFiles(this.files[this.currentAudio]);

        if (!validated) {
            this.globalView.find(".wrapper-addon-audio").html(AUDIO_FILES_MISSING);
        }

        if (loop) {
            presenter.addAttributeLoop(audio);
        }

        if(audio.canPlayType) {
            canPlayMp3 = !!audio.canPlayType && "" != audio.canPlayType('audio/mpeg');
            canPlayOgg = !!audio.canPlayType && "" != audio.canPlayType('audio/ogg; codecs="vorbis"');

            if(canPlayMp3){
                $(audio).attr("src", mp3File);
            } else if (canPlayOgg) {
                $(audio).attr("src", oggFile);
            }

        } else {
            $(audio).append("Your browser doesn't support audio.");
        }

        audio.load();
    };

    presenter.run = function(view, model){
        this.initialize(view, model, false);
        eventBus = presenter.playerController.getEventBus();
        presenter.addonID = model.ID;
    };

    presenter.createPreview = function(view, model){
        this.initialize(view, model, true);
    };

    presenter.initialize = function(view, model, isPreview) {
        this.globalModel = model;
        this.globalView = $(view);
        this.createView(view, model);
        
        if (!isPreview) {
        	this.loadFiles(this.audio, model);	
        }
        
        this.visible = !!(model['Is Visible'] == 'True');
        this.defaultVisibility = this.visible;
    };

    presenter.executeCommand = function(name, params) {
        var commands = {
            'show': presenter.show,
            'hide': presenter.hide,
            'play': presenter.play,
            'stop': presenter.stop,
            'next': presenter.next,
            'previous': presenter.previous,
            'jumpTo': presenter.jumpToCommand,
            'jumpToID': presenter.jumpToIDCommand
        };

        Commands.dispatch(commands, name, params, presenter);
    };

    presenter.setVisibility = function(isVisible) {
        $(presenter.globalView).css("visibility", isVisible ? "visible" : "hidden");
    };

    presenter.play = function() {
        if (!this.audio.playing) {
            this.audio.play();
        }
    };

    presenter.stop = function() {
        if (!presenter.audio.paused) {
            presenter.audio.pause();
            presenter.audio.currentTime = 0;
        }
    };

    presenter.show = function() {
        this.setVisibility(true);
        this.visible = true;
        if(audioStarted(this.audio)) {
            this.audio.play();
        }
    };

    presenter.hide = function() {
        this.setVisibility(false);
        this.visible = false;
        if(audioStarted(this.audio)){
            this.audio.pause();
        }
    };

    function audioStarted(audio) {
        return audio.currentTime > 0;
    }

    presenter.reset = function() {
        this.visible = this.defaultVisibility;
        if (this.visible) {
            this.show();
        } else {
            this.hide();
        }
        this.currentAudio = 0;
        this.stop();
    };

    presenter.jumpTo = function(audioNumber) {
        var newAudio = parseInt(audioNumber, 10) - 1;
        if (0 <= newAudio && newAudio < this.files.length) {
            this.currentAudio = newAudio;
            this.initialize(this.globalView, this.globalModel);
        }
    };

    presenter.jumpToCommand = function(params) {
        presenter.jumpTo(params[0]);
    };

    presenter.previous = function() {
        if (this.currentAudio > 0) {
            this.currentAudio--;
            this.initialize(this.globalView, this.globalModel);
        }
    };

    presenter.next = function() {
        if (this.currentAudio < this.files.length - 1) {
            this.currentAudio++;
            this.initialize(this.globalView, this.globalModel);
        }
    };

    presenter.jumpToID = function(id) {
        for (var i = 0; i < this.files.length; i++) {
            if (id === this.files[i].ID) {
                this.jumpTo(i + 1);  // Audio numbers are counted from 1 to n
                break;
            }
        }
    };

    presenter.jumpToIDCommand = function(params) {
        presenter.jumpToID(params[0]);
    };

    presenter.getState = function() {
        this.audio.pause();
        var state = {
            'visible' : "" + this.visible,
            'currentAudio' : "" + this.currentAudio,
            'currentTime'   : "" + this.audio.currentTime
        };
        return this.convertStateToString(state);
    };

    presenter.convertStateToString = function(state) {
        var stateString = "";
        $.each(state, function(key, value){
            stateString += "[" + key + ":" + value + "]";
        });
        return stateString;
    };

    presenter.convertStringToState = function(stateString) {
        var state = {};
        var pattern = /\w+:\w+/g;
        var stateElements = stateString.match(pattern);
        for (var i = 0; i < stateElements.length; i++) {
            var keyAndValue = stateElements[i].split(":");
            var key = keyAndValue[0];
            state[key] = keyAndValue[1];
        }
        return state;
    };

    presenter.setState = function(stateString) {
        var state = this.convertStringToState(stateString);
        var visible = !!(state["visible"] == "true");
        var currentAudio = parseInt(state["currentAudio"]);
        var currentTime = parseInt(state["currentTime"]);

        if (visible) {
            this.show();
        } else {
            this.hide();
        }

        this.currentAudio = currentAudio;

        $(this.audio).on('canplay', function() {
            if(presenter.audio.currentTime < currentTime){
                presenter.audio.currentTime = currentTime;
                presenter.audio.play();
                $(this).off('canplay');
            }
        });
    };

    presenter.validateFiles = function(files) {
        return !(!files["Ogg"] && !files["Mp3"]);
    };

    return presenter;
}