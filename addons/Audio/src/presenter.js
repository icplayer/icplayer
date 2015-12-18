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

    presenter.onEventReceived = function(eventName, eventData) {
        if(eventData.value == 'dropdownClicked') {
            presenter.audio.load();
        }
    };

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
        if (presenter.configuration.displayTime) {
            displayTimer(0, duration);
        }
        if (presenter.configuration.isHtmlPlayer){
            var player_time = presenter.$view.find('.player-time');
            player_time.html('0:00 / ' + formatTime(duration))
        }
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

    presenter.mouseData = {};

    function onTimeUpdateCallback() {
        var duration = parseInt(presenter.audio.duration, 10);
        duration = isNaN(duration) ? 0 : duration;
        var currentTime = presenter.audio.currentTime;
        if (presenter.configuration.displayTime) {
            displayTimer(currentTime, duration);
        }
        if (presenter.configuration.isHtmlPlayer){
            var player_time = presenter.$view.find('.player-time');
            player_time.html(formatTime(currentTime) + ' / ' + formatTime(duration));
            var progress_bar = presenter.$view.find('.audio-progress-bar'),
                slider = progress_bar.find('.audio-slider-btn'),
                bar = progress_bar.find('.audio-bar'),
                bar_width = progress_bar.width() * currentTime / duration;
            bar.width(Math.round(bar_width));
            slider.css('left', Math.round(bar_width));
        }
    }

    function change_volume_class(volume_btn, volume_class) {
        if (volume_btn.hasClass(volume_class)) {
            return;
        }
        for (i=0; i<=3; i++) {
            if (volume_btn.hasClass('audio-volume'+i)) {
                volume_btn.removeClass('audio-volume'+i);
            }
        }
        volume_btn.addClass(volume_class);
    }

    function onVolumeChanged() {
        if (presenter.configuration.isHtmlPlayer){
            var layer = presenter.$view.find('.audio-volume-layer'),
                control = layer.find('.audio-volume-control'),
                volume_btn = presenter.$view.find('.audio-volume-btn'),
                volume = presenter.audio.volume,
                volume_class = '';
            control.css('left', volume * layer.width());
            if (volume < 0.1) {
                volume_class = 'audio-volume0';
                if (volume > 0) {
                    presenter.audio.volume = 0;
                }
            } else if (volume < 0.4) {
                volume_class = 'audio-volume1';
            } else if (volume < 0.7) {
                volume_class = 'audio-volume2';
            } else {
                volume_class = 'audio-volume3';
            }
            change_volume_class(volume_btn, volume_class);
        }
    }

    function playPauseCallback() {
        var playpause_btn = presenter.$view.find(".play-pause-btn");
        if (playpause_btn.hasClass('audio-pause-btn')) {
            presenter.pause();
        }
        else {
            presenter.play();
        }
    }

    function displayTimer(current, duration) {
        presenter.$view.find('#currentTime').html(formatTime(current) + ' / ');
        presenter.$view.find('#durationTime').html(formatTime(duration));
    }

    function progressMouseDownCallback(event) {
        if ($(event.target).hasClass('audio-slider-btn')) {
            presenter.mouseData.oldPosition = event.pageX;
            presenter.mouseData.isMouseDragged = true;
            presenter.mouseData.playedBeforeDragging = !presenter.audio.paused;
            if (!presenter.audio.paused) {
                presenter.pause();
            }
        }
    }

    function progressMouseUpCallback() {
        if (presenter.mouseData.isMouseDragged) {
            var progress_bar = presenter.$view.find('.audio-progress-bar'),
                bar = progress_bar.find('.audio-bar'),
                duration = presenter.audio.duration;
            duration = isNaN(duration) ? 0 : duration;
            var currentTime = duration * bar.width() / progress_bar.width();
            presenter.audio.currentTime = currentTime;
            presenter.mouseData.isMouseDragged = false;
            presenter.mouseData.oldPosition = 0;
            if (presenter.mouseData.playedBeforeDragging) {
                presenter.play();
            }
        }
    }

    function progressMouseMoveCallback(event) {
        if (presenter.mouseData.isMouseDragged){
            var relativeDistance = event.pageX - presenter.mouseData.oldPosition,
                bar_width = 0,
                progress_bar = presenter.$view.find('.audio-progress-bar'),
                bar = progress_bar.find('.audio-bar'),
                slider = progress_bar.find('.audio-slider-btn'),
                oldWidth = bar.width();
            if (oldWidth + relativeDistance < progress_bar.width()) {
                bar_width = oldWidth + relativeDistance;
            }
            else {
                bar_width = progress_bar.width();
            }
            bar.width(bar_width);
            slider.css('left',Math.round(bar_width));
            presenter.mouseData.oldPosition = event.pageX;
        }
    }

    function isMoreThanOneFingerGesture(event) {
        var touch, touchPoints = (typeof event.changedTouches != 'undefined') ? event.changedTouches : [event];
        if (event.hasOwnProperty('touches'))
            touchPoints = event.touches;
        return touchPoints.length> 1;
    }

    function progressTouchStartCallback(event) {
        if (isMoreThanOneFingerGesture(event)) return;
        var touchPoints = (typeof event.changedTouches != 'undefined') ? event.changedTouches : [event];

        if (event.hasOwnProperty('touches'))
            touch = event.touches[0];
        else
            touch = touchPoints[0];
        progressMouseDownCallback(touch);
    }


    function progressTouchEndCallback() {
        progressMouseUpCallback();
    }


    function progressTouchMoveCallback(event) {
        if (isMoreThanOneFingerGesture(event)) return;

        var touch;
        var touchPoints = (typeof event.changedTouches != 'undefined') ? event.changedTouches : [event];

        if (event.hasOwnProperty('touches'))
            touch = event.touches[0];
        else
            touch = touchPoints[0];
        progressMouseMoveCallback(touch);
    }

    function attachProgressListeners($progress_wrapper, customplayer) {
        presenter.isMobileDevice = MobileUtils.isMobileUserAgent(navigator.userAgent) || MobileUtils.isEventSupported('touchend');
        if (MobileUtils.isWindowsMobile(window.navigator)) {
            $progress_wrapper[0].addEventListener("MSPointerDown", progressTouchStartCallback, false);
            $progress_wrapper[0].addEventListener("MSPointerUp", progressTouchEndCallback, false);
            $progress_wrapper[0].addEventListener("MSPointerMove", progressTouchMoveCallback, false);
        }
        else if (presenter.isMobileDevice) {
            $progress_wrapper[0].ontouchstart=progressTouchStartCallback;
            customplayer[0].ontouchend=progressTouchEndCallback;
            $progress_wrapper[0].ontouchmove=progressTouchMoveCallback;
        }
        else {
            $progress_wrapper.on('mousedown', progressMouseDownCallback);
            $progress_wrapper.on('mouseup', progressMouseUpCallback);
            $progress_wrapper.on('mousemove', progressMouseMoveCallback);
        }
    }

    function toogleVolumeLayer(){
        onVolumeChanged();
        presenter.$view.find('.audio-volume-layer').toggle();
        presenter.$view.find('.player-time').toggle();
    }

    function createHtmlPlayer(view) {
        var audioWrapper = presenter.$view.find(".wrapper-addon-audio");
        var customplayer = $('<div>');
        customplayer.addClass('audioplayer');

        var playpause_btn = $('<div>');
        playpause_btn.addClass('play-pause-btn');
        playpause_btn.addClass('audio-play-btn');
        playpause_btn.on('click', playPauseCallback);
        customplayer.append(playpause_btn);

        var stop_btn = $('<div>');
        stop_btn.addClass('audio-stop-btn');
        stop_btn.on('click', presenter.stop);
        customplayer.append(stop_btn);

        var progress_wrapper = $('<div>');
        progress_wrapper.addClass('audio-progress-bar');
        var progress_bar = $('<div>');
        progress_bar.addClass('audio-bar');
        var progress_slider = $('<div>');
        progress_slider.addClass('audio-slider-btn');
        attachProgressListeners(progress_wrapper, customplayer);

        progress_wrapper.append(progress_bar);
        progress_wrapper.append(progress_slider);
        customplayer.append(progress_wrapper)

        if (!MobileUtils.isSafariMobile(navigator.userAgent)) {
            var volume_btn = $('<div>');
            volume_btn.addClass('audio-volume-btn');
            volume_btn.on('click', toogleVolumeLayer);
            customplayer.append(volume_btn);

            var volume_layer = $('<div>');
            volume_layer.addClass('audio-volume-layer');
            volume_layer.append($('<div class="volume-control-background">'));
            volume_layer.append($('<div class="audio-volume-control">'));
            volume_layer.on('click', function (e) {
                presenter.audio.volume = e.offsetX / $(this).width();
            });
            volume_layer.hide();
            customplayer.append(volume_layer);
        }

        var player_time = $('<div>');
        player_time.addClass('player-time');
        player_time.text('00:00 / --:--');
        customplayer.append(player_time);

        audioWrapper.append(customplayer);
    }

    function createView(view, model, isPreview){
        mp3File = model.mp3;
        oggFile = model.ogg;

        if (!oggFile && !mp3File) {
            $(view).html(AUDIO_FILES_MISSING);
        }

        var audio = document.createElement("audio");

        if (presenter.configuration.defaultControls){
            $(audio).attr("preload", "auto");
            if (presenter.configuration.isHtmlPlayer){
                createHtmlPlayer();
            }
            else {
                $(audio).attr("controls", "controls");
            }

        }

        var currentTime = document.createElement("span");
        var durationTime = document.createElement("span");
        $(currentTime).attr("id", "currentTime");
        $(durationTime).attr("id", "durationTime");

        var audioWrapper = presenter.$view.find(".wrapper-addon-audio");
        audioWrapper.append(audio);
        if (presenter.configuration.displayTime) {
            audioWrapper.append(currentTime).append(durationTime);
        }
        if (!isPreview) {
            audio.addEventListener('timeupdate', presenter.onTimeUpdateSendEventCallback, false);
        }

        presenter.audio = audio;
    }

    function attachEventListeners(audio) {
        audio.addEventListener('loadeddata', onLoadedMetadataCallback, false);
        audio.addEventListener('timeupdate', onTimeUpdateCallback, false);
        audio.addEventListener('volumechange', onVolumeChanged, false);
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
        eventBus.addEventListener('ValueChanged', this);
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
        var isVisible = ModelValidationUtils.validateBoolean(model["Is Visible"]),
            defaultControls = ModelValidationUtils.validateBoolean(model.defaultControls),
            useBrowserControls = ModelValidationUtils.validateBoolean(model.useBrowserControls);

        return {
            isVisible: isVisible,
            isVisibleByDefault: isVisible,
            onEndEventCode: model.onEnd,
            enableLoop: ModelValidationUtils.validateBoolean(model.enableLoop),
            displayTime: ModelValidationUtils.validateBoolean(model.displayTime),
            defaultControls: defaultControls,
            useBrowserControls: useBrowserControls,
            isHtmlPlayer: defaultControls && !useBrowserControls
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
            this.audio.play();
            if (presenter.configuration.isHtmlPlayer) {
                var playpause_btn = presenter.$view.find(".play-pause-btn");
                playpause_btn.removeClass('audio-play-btn');
                playpause_btn.addClass('audio-pause-btn');
            }
        }
    };

    presenter.pause = function() {
        if(presenter.audio.readyState > 0) {
            if (!presenter.audio.paused) {
                presenter.audio.pause();
            }
            if (presenter.configuration.isHtmlPlayer) {
                var playpause_btn = presenter.$view.find(".play-pause-btn");
                playpause_btn.removeClass('audio-pause-btn');
                playpause_btn.addClass('audio-play-btn');
            }
        }
    };

    presenter.stop = function() {
        if(presenter.audio.readyState > 0) {
            presenter.pause();
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

        presenter.stop();

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