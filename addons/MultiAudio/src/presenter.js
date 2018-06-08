function AddonMultiAudio_create(){
    var presenter = function(){};
    var AUDIO_FILES_MISSING = "This addon needs at least 1 audio file.";
    var eventBus;
    var currentTimeAlreadySent;
    var deferredSyncQueue = window.DecoratorUtils.DeferredSyncQueue(deferredQueueDecoratorChecker);
    presenter.currentAudio = 0;
    presenter.audio = {};
    presenter.files = [];
    presenter.visible = true;
    presenter.defaultVisibility = true;
    presenter.globalView = null;
    presenter.globalModel = null;
    presenter.playerController = null;
    presenter.addonID = null;
    presenter.type = 'multiaudio';

    presenter.setPlayerController = function(controller) {
        presenter.playerController = controller;
    };
    
    presenter.onEventReceived = function(eventName, eventData) {
    	if(eventData.value == 'dropdownClicked') {
     	   	this.audio.load();
    	}
    };

    function getEventObject(_item, _value, _score) {
    	return {
            source : presenter.addonID,
            item : _item + '',
            value : _value + '',
            score : _score + ''
        };
    }

    function deferredQueueDecoratorChecker () {
        return presenter.isLoaded;
    }
    
    presenter.createEventData = function (data) {
    	return getEventObject(data.currentItem, data.currentTime, '');
    };

    presenter.createOnEndEventData = function (data) {
        return getEventObject(data.currentItem, 'end', '');
    };
    
    presenter.createOnPlayingEventData = function (data) {
        return getEventObject(data.currentItem, 'playing', '');
    };
    
    presenter.sendEventAndSetCurrentTimeAlreadySent = function (eventData, currentTime) {
        eventBus.sendEvent('ValueChanged', eventData);
        currentTimeAlreadySent = currentTime;
    };

    presenter.getAudioCurrentTime = function () {
        return this.audio.currentTime;
    };

    presenter.onTimeUpdateSendEventCallback = function() {

        var ua = navigator.userAgent;
        if( ua.indexOf("Android") >= 0 )
        {
            var androidversion = parseFloat(ua.slice(ua.indexOf("Android")+8));
            if (androidversion == 4.4)
            {
                var duration = parseInt(presenter.audio.duration, 10);
                duration = isNaN(duration) ? 0 : duration;
                var currentTime2 = parseInt(presenter.audio.currentTime, 10);

                if(duration == currentTime2){
                    presenter.sendOnEndEvent();
                }
            }
        }

        var currentTime = presenter.formatTime(presenter.getAudioCurrentTime());
        var currentItem = presenter.currentAudio+1;
        if (currentTime !== currentTimeAlreadySent) { // to prevent duplicated value
            var eventData = presenter.createEventData({'currentTime' : currentTime, 'currentItem': currentItem});
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
    
    presenter.sendOnEndEvent = function () {
        var currentItem = presenter.currentAudio+1;
        var eventData = presenter.createOnEndEventData({'currentItem': currentItem});
        eventBus.sendEvent('ValueChanged', eventData);
    };
    
    presenter.sendOnPlayingEvent = function () {
        var currentItem = presenter.currentAudio+1;
        var eventData = presenter.createOnPlayingEventData({'currentItem': currentItem});
            eventBus.sendEvent('ValueChanged', eventData);
    };

    presenter.playingEventSent = false;
    presenter.createView = function(view, model){
        var interfaceType = model["Interface"];
        var audioWrapper = this.prepareAudio();
        this.audio.addEventListener('timeupdate', function() {
            presenter.onTimeUpdateSendEventCallback();

            var ua = navigator.userAgent;
            if( ua.indexOf("Android") >= 0 )
            {
                var androidversion = parseFloat(ua.slice(ua.indexOf("Android")+8));
                if (androidversion == 5)
                {
                    if(presenter.audio.currentTime > 0 && !presenter.playingEventSent){
                        presenter.sendOnPlayingEvent();
                        presenter.playingEventSent = true;
                    }
                }
            }
        }, false);
        this.audio.addEventListener('playing', function () {
            var ua = navigator.userAgent;
            if( ua.indexOf("Android") >= 0 ){
                var androidversion = parseFloat(ua.slice(ua.indexOf("Android")+8));
                if (androidversion == 5){
                    //do nothing
                }else{
                    presenter.sendOnPlayingEvent();
                }
            }else{
                presenter.sendOnPlayingEvent();
            }
        }, false);
        this.audio.addEventListener('play', function () {
        }, false);
        this.audio.addEventListener('click', function(e) {
            e.stopPropagation();
        }, false);
        this.audio.addEventListener('ended', function() {
            presenter.stop();
            presenter.sendOnEndEvent();
            presenter.playingEventSent = false;
        }, false);

        if (!presenter.isLoaded) {
            this.audio.addEventListener("loadeddata", function() {
                presenter.isLoaded = true;

                deferredSyncQueue.resolve();
            });
        }

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
        eventBus.addEventListener('ValueChanged', this);
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

        presenter.view = view;

        presenter.view.addEventListener('DOMNodeRemoved', presenter.destroy);
    };

    presenter.destroy = function AddonMultiAudio_destroy() {
        presenter.view.removeEventListener('DOMNodeRemoved', presenter.destroy);

        presenter.audio.pause();
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
            'jumpToID': presenter.jumpToIDCommand,
            'pause': presenter.pause
        };

        Commands.dispatch(commands, name, params, presenter);
    };

    presenter.setVisibility = function(isVisible) {
        $(presenter.globalView).css("visibility", isVisible ? "visible" : "hidden");
    };

    presenter.play = deferredSyncQueue.decorate(function() {
        if (!this.audio.playing) {
            this.audio.play();
        }
    });

    presenter.stop = deferredSyncQueue.decorate(function() {
        if (!presenter.audio.paused) {
            presenter.audio.pause();
            presenter.playingEventSent = false;
        }

        presenter.audio.currentTime = 0;
    });

    presenter.pause = function() {
        if (!presenter.audio.paused) {
            presenter.audio.pause();
            presenter.playingEventSent = false;
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
        this.stop();
        this.currentAudio = 0;
        presenter.loadFiles(this.audio, this.globalModel);
    };

    presenter.jumpTo = function(audioNumber) {
        var newAudio = parseInt(audioNumber, 10) - 1;
        if (0 <= newAudio && newAudio < this.files.length) {
            this.currentAudio = newAudio;
            presenter.isLoaded = false;
            presenter.loadFiles(this.audio, this.globalModel);
        }
    };

    presenter.jumpToCommand = function(params) {
        presenter.jumpTo(params[0]);
        presenter.playingEventSent = false;
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
        presenter.loadFiles(this.audio, this.globalModel);
    };

    presenter.validateFiles = function(files) {
        return !(!files["Ogg"] && !files["Mp3"]);
    };

    return presenter;
}