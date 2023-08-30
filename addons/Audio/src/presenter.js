function AddonAudio_create(){
    var presenter = function(){};
    var AUDIO_FILES_MISSING = "This addon needs at least 1 audio file.";
    var mp3File;
    var oggFile;
    var eventBus;
    var currentTimeAlreadySent;
    var deferredSyncQueue = window.DecoratorUtils.DeferredSyncQueue(deferredQueueDecoratorChecker);
    var audioIsLoaded = false;
    var fetchedAudioData;
    var isReadyToReplay = true;

    presenter.playbackRate = 1.0;
    var playbackRateList = [0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0];

    function deferredQueueDecoratorChecker() {
        if (!presenter.configuration.forceLoadAudio) {
            return true;
        }

        return audioIsLoaded;
    }

    presenter.audio = {
        readyState : 0
    };
    presenter.playerController = null;
    presenter.addonID = null;
    presenter.type = 'audio';

    presenter.mouseData = {};

    presenter.onEventReceived = function AddonAudio_onEventReceived (eventName, eventData) {
        if (eventData.value == 'dropdownClicked' && !presenter.audio.playing && !isTemporarilyPaused()) {
            presenter.audio.load();
        }
    };

    function isTemporarilyPaused() {
        return (presenter.audio.paused
            && presenter.audio.readyState > 2
            && presenter.audio.currentTime > 0
            && !presenter.audio.ended
        );
    }

    presenter.setPlayerController = function AddonAudio_setPlayerController (controller) {
        presenter.playerController = controller;
    };

    presenter.upgradeModel = function AddonAudio_upgradeModel (model) {
        var upgradedModel = presenter.upgradeEnableLoop(model);
        upgradedModel = presenter.upgradeForceLoadAudio(upgradedModel);
        upgradedModel = presenter.upgradeEnablePlaybackSpeedControls(upgradedModel);
        return upgradedModel;
    };

    presenter.upgradeForceLoadAudio = function (model) {
        var upgradedModel = {};
        $.extend(true, upgradedModel, model); // Deep copy of model object

        if (!upgradedModel["forceLoadAudio"]) {
            upgradedModel["forceLoadAudio"] = "False";
        }

        return upgradedModel;
    };

    presenter.upgradeEnableLoop = function AddonAudio_upgradeEnableLoop (model) {
        var upgradedModel = {};
        $.extend(true, upgradedModel, model); // Deep copy of model object

        if (!upgradedModel["enableLoop"]) {
            upgradedModel["enableLoop"] = "";
        }

        return upgradedModel;
    };

    presenter.upgradeEnablePlaybackSpeedControls = function (model) {
        var upgradedModel = {};
        $.extend(true, upgradedModel, model); // Deep copy of model object

        if (!upgradedModel["enablePlaybackSpeedControls"]) {
            upgradedModel["enablePlaybackSpeedControls"] = "False";
        }

        return upgradedModel;
    };

    presenter.createTimeUpdateEventData = function AddonAudio_createTimeUpdateEventData (data) {
        return {
            source : presenter.addonID,
            item : '',
            value : '' + data.currentTime,
            score : ''
        };
    };

    presenter.createOnEndEventData = function AddonAudio_createOnEndEventData () {
        return {
            source : presenter.addonID,
            item : 'end',
            value : '',
            score : ''
        };
    };

    presenter.getAudioCurrentTime = function AddonAudio_getAudioCurrentTime () {
        return this.audio.currentTime;
    };

    function addonAudio_formatTime (seconds) {
        return StringUtils.timeFormat(seconds);
    }

    presenter.AddonAudio_onProgressedCallback = function () {
        deferredSyncQueue.resolve();
    };

    presenter.AddonAudio_onLoadedMetadataCallback = function () {
        var duration = parseInt(presenter.audio.duration, 10);
        duration = isNaN(duration) ? 0 : duration;
        if (presenter.configuration.displayTime) {
            AddonAudio_displayTimer(0, duration);
        }
        if (presenter.configuration.isHtmlPlayer){
            presenter.$playerTime.html('0:00 / ' + addonAudio_formatTime(duration))
        }


        deferredSyncQueue.resolve();
    };

    presenter.sendEventAndSetCurrentTimeAlreadySent = function AddonAudio_sendEventAndSetCurrentTimeAlreadySent (eventData, currentTime) {
        eventBus.sendEvent('ValueChanged', eventData);
        currentTimeAlreadySent = currentTime;
    };

    presenter.sendOnEndEvent = function AddonAudio_sendOnEndEvent () {
        var eventData = presenter.createOnEndEventData();
        eventBus.sendEvent('ValueChanged', eventData);
    };

    presenter.onTimeUpdateSendEventCallback = function AddonAudio_onTimeUpdateSendEventCallback () {
        var currentTime = addonAudio_formatTime(presenter.getAudioCurrentTime());
        if (currentTime !== currentTimeAlreadySent) { // to prevent duplicated value
            var eventData = presenter.createTimeUpdateEventData({'currentTime' : currentTime});
            presenter.sendEventAndSetCurrentTimeAlreadySent(eventData, currentTime);
        }
    };

    function AddonAudio_onTimeUpdateCallback() {
        var bar_width, duration = presenter.audio.duration;
        duration = isNaN(duration) ? 0 : duration;
        var currentTime = presenter.audio.currentTime;
        if (presenter.configuration.displayTime) {
            AddonAudio_displayTimer(currentTime, duration);
        }
        if (presenter.configuration.isHtmlPlayer){
            presenter.$playerTime.html(addonAudio_formatTime(currentTime) + ' / ' + addonAudio_formatTime(duration));
            bar_width = presenter.$progressWrapper.width() * currentTime / duration;
            presenter.$progressBar.width(Math.round(bar_width));
            presenter.$progressSlider.css('left', Math.round(bar_width));
        }
    }

    function AddonAudio_change_volume_class(volume_class) {
        if (presenter.$volumeBtn.hasClass(volume_class)) {
            return;
        }
        for (var i=0; i<=3; i++) {
            if (presenter.$volumeBtn.hasClass('audio-volume'+i)) {
                presenter.$volumeBtn.removeClass('audio-volume'+i);
            }
        }
        presenter.$volumeBtn.addClass(volume_class);
    }

    function AddonAudio_onVolumeChanged() {
        if (presenter.configuration.isHtmlPlayer){
            var volume = presenter.audio.volume,
                volume_class = '';
            presenter.$volumeControl.css('left', volume * presenter.$volumeLayer.width());
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
            AddonAudio_change_volume_class(volume_class);
        }
    }

    function AddonAudio_playPauseCallback () {
        if (presenter.$playPauseBtn.hasClass('audio-pause-btn')) {
            presenter.pause();
        }
        else {
            presenter.play();
        }
    }

    function AddonAudio_displayTimer(current, duration) {
        presenter.$view.find('#currentTime').html(addonAudio_formatTime(current) + ' / ');
        presenter.$view.find('#durationTime').html(addonAudio_formatTime(duration));
    }

    function AddonAudio_progressMouseDownCallback(event) {
        if ($(event.target).hasClass('audio-slider-btn')) {
            presenter.mouseData.oldPosition = event.pageX;
            presenter.mouseData.isMouseDragged = true;
            presenter.mouseData.playedBeforeDragging = !presenter.audio.paused;
            if (!presenter.audio.paused) {
                presenter.pause();
            }
        }
    }

    function AddonAudio_progressMouseUpCallback() {
        if (presenter.mouseData.isMouseDragged) {
            var duration = presenter.audio.duration;
            duration = isNaN(duration) ? 0 : duration;
            presenter.audio.currentTime = duration * presenter.$progressBar.width() / presenter.$progressWrapper.width();
            presenter.mouseData.isMouseDragged = false;
            presenter.mouseData.oldPosition = 0;
            if (presenter.mouseData.playedBeforeDragging) {
                presenter.play();
            }
        }
    }

    function AddonAudio_progressMouseMoveCallback(event) {
        if (presenter.mouseData.isMouseDragged){
            var relativeDistance = event.pageX - presenter.mouseData.oldPosition,
                bar_width = 0,
                oldWidth = presenter.$progressBar.width();
            if (oldWidth + relativeDistance < presenter.$progressWrapper.width()) {
                bar_width = oldWidth + relativeDistance;
            }
            else {
                bar_width = presenter.$progressWrapper.width();
            }
            presenter.$progressBar.width(bar_width);
            presenter.$progressSlider.css('left',Math.round(bar_width));
            presenter.mouseData.oldPosition = event.pageX;
        }
    }

    function addonAudio_isMoreThanOneFingerGesture(event) {
        var touchPoints = (typeof event.changedTouches != 'undefined') ? event.changedTouches : [event];
        if (event.hasOwnProperty('touches'))
            touchPoints = event.touches;
        return touchPoints.length> 1;
    }

    function AddonAudio_progressTouchStartCallback(event) {
        var touch, touchPoints;
        if (addonAudio_isMoreThanOneFingerGesture(event)) return;

        touchPoints = (typeof event.changedTouches != 'undefined') ? event.changedTouches : [event];

        if (event.hasOwnProperty('touches'))
            touch = event.touches[0];
        else
            touch = touchPoints[0];
        AddonAudio_progressMouseDownCallback(touch);
    }


    function AddonAudio_progressTouchEndCallback() {
        AddonAudio_progressMouseUpCallback();
    }


    function AddonAudio_progressTouchMoveCallback(event) {
        if (addonAudio_isMoreThanOneFingerGesture(event)) return;

        var touch;
        var touchPoints = (typeof event.changedTouches != 'undefined') ? event.changedTouches : [event];

        if (event.hasOwnProperty('touches'))
            touch = event.touches[0];
        else
            touch = touchPoints[0];
        AddonAudio_progressMouseMoveCallback(touch);
    }

    function AddonAudio_attachProgressListeners() {
        presenter.isMobileDevice = MobileUtils.isMobileUserAgent(navigator.userAgent) || MobileUtils.isEventSupported('touchend');
        if (MobileUtils.isWindowsMobile(window.navigator)) {
            presenter.$progressWrapper[0].addEventListener("MSPointerDown", AddonAudio_progressTouchStartCallback, false);
            presenter.$progressWrapper[0].addEventListener("MSPointerUp", AddonAudio_progressTouchEndCallback, false);
            presenter.$progressWrapper[0].addEventListener("MSPointerMove", AddonAudio_progressTouchMoveCallback, false);
        }
        else if (presenter.isMobileDevice) {
            presenter.$progressWrapper[0].ontouchstart=AddonAudio_progressTouchStartCallback;
            presenter.$customPlayer[0].ontouchend=AddonAudio_progressTouchEndCallback;
            presenter.$progressWrapper[0].ontouchmove=AddonAudio_progressTouchMoveCallback;
        }
        else {
            presenter.$progressWrapper.on('mousedown', AddonAudio_progressMouseDownCallback);
            presenter.$progressWrapper.on('mouseup', AddonAudio_progressMouseUpCallback);
            presenter.$progressWrapper.on('mousemove', AddonAudio_progressMouseMoveCallback);
        }
    }

    function AddonAudio_toogleVolumeLayer(){
        AddonAudio_onVolumeChanged();
        presenter.$volumeLayer.toggle();
        presenter.$playerTime.toggle();
    }

    function AddonAudio_createHtmlPlayer() {
        presenter.$customPlayer = $('<div>').
            addClass('audioplayer');
        if (presenter.configuration.enablePlaybackSpeedControls) {
            presenter.$customPlayer.addClass('playback-speed-control-enabled');
        }

        presenter.$playPauseBtn = $('<div>').
            addClass('play-pause-btn').
            addClass('audio-play-btn').
            on('click', AddonAudio_playPauseCallback);

        presenter.$customPlayer.append(presenter.$playPauseBtn);

        presenter.$stopBtn = $('<div>').
            addClass('audio-stop-btn').
            on('click', presenter.stop);

        presenter.$customPlayer.append(presenter.$stopBtn);

        presenter.$progressWrapper = $('<div>').
            addClass('audio-progress-bar');

        presenter.$progressBar = $('<div>').
            addClass('audio-bar');

        presenter.$progressSlider = $('<div>').
            addClass('audio-slider-btn');

        AddonAudio_attachProgressListeners();

        presenter.$progressWrapper.
            append(presenter.$progressBar).
            append(presenter.$progressSlider);

        presenter.$customPlayer.append(presenter.$progressWrapper);

        if (!MobileUtils.isSafariMobile(navigator.userAgent)) {
            presenter.$volumeBtn = $('<div>').
                addClass('audio-volume-btn').
                on('click', AddonAudio_toogleVolumeLayer);

            presenter.$customPlayer.append(presenter.$volumeBtn);

            presenter.$volumeControlBackground = $('<div>').addClass('volume-control-background');
            presenter.$volumeControl = $('<div>').addClass('audio-volume-control');

            presenter.$volumeLayer = $('<div>').
                addClass('audio-volume-layer').
                append(presenter.$volumeControlBackground).
                append(presenter.$volumeControl).
                on('click', function (e) {
                presenter.audio.volume = e.offsetX / $(this).width();
            });

            presenter.$volumeLayer.hide();

            presenter.$customPlayer.append(presenter.$volumeLayer);
        }

        presenter.$playbackRateControls = null;
        if (presenter.configuration.enablePlaybackSpeedControls) {
            presenter.$playbackRateControls = $('<div>');
            presenter.$playbackRateControls.addClass('audio-playback-rate');
            presenter.$playbackRateControls.append(createPlaybackRateSelectElement());
            displayPlaybackRate();
            presenter.$customPlayer.append(presenter.$playbackRateControls);
        }

        presenter.$playerTime = $('<div>').
            addClass('player-time').
            text('00:00 / --:--');
        presenter.$customPlayer.append(presenter.$playerTime);

        presenter.$customPlayer.on('click mousedown mouseup', function(event){
            event.stopPropagation();
        });
        presenter.$audioWrapper.append(presenter.$customPlayer);
    }

    function createPlaybackRateSelectElement () {
        var $select = $('<select>');
        for (var i = 0; i < playbackRateList.length; i++) {
            var $option = $('<option>');
            $option.text(playbackRateList[i]);
            $option.attr('value', playbackRateList[i]);
            if (playbackRateList[i] == 1) {
                $option.attr('selected', 'selected');
            }
            $select.append($option);
        }

        $select.on('change', function(){
            presenter.setPlaybackRate($select.val());
        })

        return $select;

    }

    function displayPlaybackRate () {
        if (presenter.$playbackRateControls != null) {
            var $select = presenter.$playbackRateControls.find('select');
            if ($select.val() == presenter.playbackRate) {
                if (playbackRateList.indexOf(presenter.playbackRate) != -1) {
                    $select.find('.custom-option').remove();
                }
                return;
            }
            $select.find('.custom-option').remove();
            if (playbackRateList.indexOf(presenter.playbackRate) != -1) {
                $select.val(presenter.playbackRate);
            } else {
                var $customOption = $('<option>');
                $customOption.text(presenter.playbackRate);
                $customOption.attr('value', presenter.playbackRate);
                $customOption.addClass('custom-option');
                $select.append($customOption);
                $select.val(presenter.playbackRate);

            }
        }
    }

    function AddonAudio_createView(view, model, isPreview){
        presenter.$audioWrapper = presenter.$view.find(".wrapper-addon-audio");

        mp3File = model.mp3;
        oggFile = model.ogg;

        if (!oggFile && !mp3File) {
            $(view).html(AUDIO_FILES_MISSING);
        }

        var audio = document.createElement("audio");

        if (presenter.configuration.defaultControls){
            $(audio).attr("preload", "auto");
            if (presenter.configuration.isHtmlPlayer){
                AddonAudio_createHtmlPlayer();
            }
            else {
                $(audio).attr("controls", "controls");
            }

        }

        var currentTime = document.createElement("span");
        var durationTime = document.createElement("span");
        $(currentTime).attr("id", "currentTime");
        $(durationTime).attr("id", "durationTime");

        presenter.$audioWrapper.append(audio);
        if (presenter.configuration.displayTime) {
            presenter.$audioWrapper.append(currentTime).append(durationTime);
        }
        if (!isPreview) {
            audio.addEventListener('timeupdate', presenter.onTimeUpdateSendEventCallback, false);
        }

        Object.defineProperty(audio, 'playing', {
            get: function() {
                return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2);
            }
        });

        presenter.audio = audio;
    }

    presenter.sendOnPLayingEvent = function () {
        var eventData = {
            'source': presenter.configuration.addonID,
            'item': '',
            'value': 'playing',
            'score': ''
        };

        eventBus.sendEvent('ValueChanged', eventData);
    };

    presenter.sendOnPauseEvent = function () {
        var eventData = {
            'source': presenter.configuration.addonID,
            'item': '',
            'value': 'pause',
            'score': ''
        };

        eventBus.sendEvent('ValueChanged', eventData);
    };

    function AddonAudio_onAudioPlaying () {
        presenter.sendOnPLayingEvent();
    }

    function AddonAudio_onAudioPause () {
        presenter.sendOnPauseEvent();
    }

    function AddonAudio_attachEventListeners(audio) {
        audio.addEventListener('loadeddata', presenter.AddonAudio_onLoadedMetadataCallback, false);
        audio.addEventListener('timeupdate', AddonAudio_onTimeUpdateCallback, false);
        audio.addEventListener('volumechange', AddonAudio_onVolumeChanged, false);
        audio.addEventListener('ended', AddonAudio_onAudioEnded , false);
        audio.addEventListener('click', AddonAudio_onAudioClick, false);
        audio.addEventListener('playing', AddonAudio_onAudioPlaying, false);
        audio.addEventListener('pause', AddonAudio_onAudioPause, false);

        if (isMobileIOS()) {
            AddonAudio_attachEventListenersForIOS(audio);
        }
    }

    function AddonAudio_attachEventListenersForIOS(audio) {
        if (presenter.configuration.forceLoadAudio) {
            audio.addEventListener('progress', presenter.AddonAudio_onProgressedCallback, { once: true });
        }
    }

    function AddonAudio_removeEventListeners(audio) {
        presenter.audio.removeEventListener('loadeddata', presenter.AddonAudio_onLoadedMetadataCallback, false);
        presenter.audio.removeEventListener('timeupdate', presenter.onTimeUpdateSendEventCallback, false);
        presenter.audio.removeEventListener('timeupdate', AddonAudio_onTimeUpdateCallback, false);
        presenter.audio.removeEventListener('volumechange', AddonAudio_onVolumeChanged, false);
        presenter.audio.removeEventListener('ended', AddonAudio_onAudioEnded , false);
        presenter.audio.removeEventListener('click', AddonAudio_onAudioClick, false);
        presenter.audio.removeEventListener('playing', AddonAudio_onAudioPlaying, false);
        presenter.audio.removeEventListener('pause', AddonAudio_onAudioPause, false);

        if (isMobileIOS()) {
            AddonAudio_removeEventListenersForIOS(audio);
        }
    }

    function AddonAudio_removeEventListenersForIOS(audio) {
        if (presenter.configuration.forceLoadAudio) {
            audio.removeEventListener('progress', presenter.AddonAudio_onProgressedCallback, { once: true });
        }
    }

    function isMobileIOS() {
        return window.MobileUtils.isSafariMobile(navigator.userAgent);
    }

    function AddonAudio_onAudioEnded () {
        if (presenter.configuration.enableLoop) {
            this.currentTime = 0;
            this.play();
        } else {
            presenter.executeOnEndEvent();
            presenter.sendOnEndEvent();
            presenter.stop();
        }
    }

    function AddonAudio_onAudioClick (e) {
        e.stopPropagation();
    }

    presenter.fetchAudioFromServer = function (src) {
        var req = new XMLHttpRequest();
        req.open('GET', src, true);
        req.responseType = 'blob';
        req.addEventListener("load", presenter.loadAudioDataFromRequest);

        req.send();
    };

    presenter.loadAudioDataFromRequest = function (event) {
        if (event.currentTarget.status == 200 || (isMobileIOS() && event.currentTarget.status == 0)) {
            fetchedAudioData = event.currentTarget.response;
            presenter.audio.src = URL.createObjectURL(fetchedAudioData);
            audioIsLoaded = true;
        }
    };

    function AddonAudio_loadFiles(){
        var canPlayMp3 = false;
        var canPlayOgg = false;
        var audio = presenter.audio;

        AddonAudio_attachEventListeners(audio);

        if(audio.canPlayType) {
            canPlayMp3 = audio.canPlayType && "" != audio.canPlayType('audio/mpeg');
            canPlayOgg = audio.canPlayType && "" != audio.canPlayType('audio/ogg; codecs="vorbis"');
            var audioSrc = "";

            if(canPlayMp3){
                audioSrc = mp3File;
            } else if (canPlayOgg) {
                audioSrc = oggFile;
            }

            if (presenter.configuration.forceLoadAudio) {
                presenter.fetchAudioFromServer(audioSrc);
            } else {
                $(audio).attr("src", audioSrc);
            }

        } else {
            $(audio).append("Your browser doesn't support audio.");
        }

        $(audio).load();
    }

    presenter.run = function AddonAudio_run (view, model){
        presenter.initialize(view, model, false);
        eventBus = presenter.playerController.getEventBus();
        presenter.addonID = model.ID;
        eventBus.addEventListener('ValueChanged', this);
    };

    presenter.createPreview = function AddonAudio_createPreview (view, model){
        presenter.initialize(view, model, true);
    };

    presenter.initialize = function AddonAudio_initialize (view, model, isPreview) {
        var upgradedModel = presenter.upgradeModel(model);

        presenter.view = view;
        presenter.$view = $(view);
        presenter.view.addEventListener('DOMNodeRemoved', presenter.destroy);
        presenter.configuration = presenter.validateModel(upgradedModel);

        AddonAudio_createView(view, upgradedModel, isPreview);
        
        if (!isPreview) {
        	AddonAudio_loadFiles();
            presenter.$view.bind('click', function (event) {
                event.stopPropagation();
            });
        }

    };

    presenter.destroy = function AddonAudio_destroy (event) {
        if (event.target !== presenter.view) {
            return;
        }

        presenter.audio.pause();

        presenter.view.removeEventListener('DOMNodeRemoved', presenter.destroy);

        presenter.playerController = null;

        AddonAudio_removeEventListeners(presenter.audio);
        if (presenter.configuration.forceLoadAudio && audioIsLoaded) {
            URL.revokeObjectURL(presenter.audio.src);
        }
        presenter.audio.setAttribute('src', '');
        presenter.audio.load();
        presenter.audio = null;

        if (presenter.$playPauseBtn) {
            presenter.$playPauseBtn.off();
            presenter.$playPauseBtn = null;
        }
        if (presenter.$stopBtn) {
            presenter.$stopBtn.off();
            presenter.$stopBtn = null;
        }
        if (presenter.$progressWrapper) {
            presenter.$progressWrapper[0].removeEventListener("MSPointerDown", AddonAudio_progressTouchStartCallback, false);
            presenter.$progressWrapper[0].removeEventListener("MSPointerUp", AddonAudio_progressTouchEndCallback, false);
            presenter.$progressWrapper[0].removeEventListener("MSPointerMove", AddonAudio_progressTouchMoveCallback, false);
            presenter.$progressWrapper[0].ontouchstart=null;
            presenter.$progressWrapper[0].ontouchmove=null;
            presenter.$progressWrapper.off();
            presenter.$progressWrapper = null;
        }
        if (presenter.$customPlayer) {
            presenter.$customPlayer.off();
            presenter.$customPlayer[0].ontouchend=null;
            presenter.$customPlayer = null;
        }
        if (presenter.$volumeBtn) {
            presenter.$volumeBtn.off();
            presenter.$volumeBtn = null;
        }
        if (presenter.$volumeLayer) {
            presenter.$volumeLayer.off();
            presenter.$volumeLayer = null;
        }

        presenter.$volumeControlBackground = null;
        presenter.$volumeControl = null;
        presenter.$audioWrapper = null;
        presenter.$playerTime = null;
        presenter.$progressBar = null;
        presenter.$progressSlider = null;

        presenter.mouseData = null;
        presenter.configuration = null;
        presenter.$view.unbind();
        presenter.$view = null;
        presenter.view = null;

        deferredSyncQueue = null;
    };

    presenter.validateModel = function AddonAudio_validateModel (model) {
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
            isHtmlPlayer: defaultControls && !useBrowserControls,
            addonID: model.ID,
            forceLoadAudio: ModelValidationUtils.validateBoolean(model.forceLoadAudio),
            narration: model.Narration,
            enablePlaybackSpeedControls: ModelValidationUtils.validateBoolean(model.enablePlaybackSpeedControls)
        };
    };

    presenter.executeCommand = function AddonAudio_executeCommand (name, params) {
        var commands = {
            'play': presenter.play,
            'stop': presenter.stop,
            'show': presenter.show,
            'hide': presenter.hide,
            'pause': presenter.pause,
            'getNarration': presenter.getNarration,
            'setPlaybackRate': presenter.setPlaybackRate
        };

        return Commands.dispatch(commands, name, params, presenter);
    };

    presenter.setVisibility = function AddonAudio_setVisibility (isVisible) {
        presenter.$view.css("visibility", isVisible ? "visible" : "hidden");
    };

    presenter.play = deferredSyncQueue.decorate(function() {
        if (!presenter.audio) return;
        if(presenter.audio.src && presenter.audio.paused) {
            if (!isReadyToReplay) {
                prepareToReplay();
            }
            presenter.audio.play();
            if (presenter.configuration.isHtmlPlayer) {
                presenter.$playPauseBtn.
                    removeClass('audio-play-btn').
                    addClass('audio-pause-btn');
            }
        }
    });

    presenter.pause = deferredSyncQueue.decorate(function AddonAudio_pause () {
        if (!presenter.audio) return;
        if(presenter.audio.readyState > 0) {
            if (!presenter.audio.paused) {
                presenter.audio.pause();
            }
            if (presenter.configuration.isHtmlPlayer) {
                presenter.$playPauseBtn.
                    removeClass('audio-pause-btn').
                    addClass('audio-play-btn');
            }
        }
    });

    function prepareToReplay() {
        if (isMobileIOS()) {
            prepareToReplayOnMobileIOS()
        }
        isReadyToReplay = true;
    }

    function prepareToReplayOnMobileIOS() {
        if (presenter.configuration.forceLoadAudio) {
            URL.revokeObjectURL(presenter.audio.src);
            presenter.audio.src = URL.createObjectURL(fetchedAudioData);
        }
    }

    presenter.stop = deferredSyncQueue.decorate(function AddonAudio_stop () {
        if (!presenter.audio) return;
        if(presenter.audio.readyState > 0) {
            isReadyToReplay = false;
            presenter.pause();
            presenter.audio.currentTime = 0;
        }
    });

    presenter.setPlaybackRate = function (value) {
        if (!presenter.audio) return;
        if (isNaN(value)) return;
        var parsedValue = parseFloat(value);
        presenter.playbackRate = parsedValue;
        presenter.audio.playbackRate = parsedValue;
        displayPlaybackRate();
    };

    presenter.show = function AddonAudio_show () {
        this.setVisibility(true);
        this.configuration.isVisible = true;
    };

    presenter.hideAddon = function AddonAudio_hideAddon () {
        this.setVisibility(false);
        this.configuration.isVisible = false;
    };

    presenter.hide = function AddonAudio_hide () {
        this.stop();
        this.hideAddon();
    };

    presenter.reset = function AddonAudio_reset () {
        if (!presenter.audio) return;

        presenter.stop();

        presenter.configuration.isVisible = presenter.configuration.isVisibleByDefault;
        if (presenter.configuration.isVisible) {
            presenter.show();
        } else {
            presenter.hideAddon();
        }
    };

    presenter.getState = function AddonAudio_getState () {
        return JSON.stringify({
            isVisible : presenter.configuration.isVisible,
            playbackRate: presenter.playbackRate
        });
    };

    presenter.setState = function addonAudio_setState (stateString) {
        if (ModelValidationUtils.isStringEmpty(stateString)) {
            return false;
        }

        /*
        * The If statement resolves an issue on Mobile Safari, where presenter.stop call from setState would be resolved
        * right after the first presenter.play call. The problem occurs because the deferred queue is resolved
        * on loadedmetadata event and Mobile Safari only downloads the audio/video src file on the first interaction
        * with the tag, rather than when the page itself is loaded.
        * */
        if (audioIsLoaded) {
            presenter.stop();
        };

        var parsedJson = JSON.parse(stateString);
        if (parsedJson.isVisible) {
            this.show();
        } else {
            this.hideAddon();
        }
        if (parsedJson['playbackRate'] != undefined) {
            presenter.setPlaybackRate(parsedJson['playbackRate']);
        }

        return false;
    };

    presenter.executeOnEndEvent = function AddonAudio_executeOnEndEvent () {
        if (presenter.configuration.onEndEventCode) {
            presenter.playerController.getCommands().executeEventCode(presenter.configuration.onEndEventCode);
        }
    };

    presenter.getNarration = function AddonAudio_getNarration() {
        return presenter.configuration.narration;
    };

    presenter.setWCAGStatus = function(isWCAGOn) {
        //This method has been added to enable the addon's detection by the autofill option of TTS
    };

    function forward() {
        presenter.audio.currentTime += 5;
    }

    function backward() {
        presenter.audio.currentTime -= 5;
    }

    function playPause() {
        if (presenter.audio.paused) {
            presenter.play();
        } else {
            presenter.pause();
        }
    }

    function increaseVolume() {
         var volume = presenter.audio.volume;
        volume += 0.1;
        if (volume > 1.0) volume = 1.0;
        presenter.audio.volume = volume;
    }

    function decreaseVolume() {
        var volume = presenter.audio.volume;
        volume -= 0.1;
        if (volume < 0.0) volume = 0.0;
        presenter.audio.volume = volume;
    }

    presenter.keyboardController = function (keycode, isShift, event) {
        event.preventDefault();
        switch (keycode) {
            case 9: // TAB
                if (isShift) {
                    backward();
                } else {
                    forward();
                }
                break;
            case 13: //ENTER
                if (isShift) {
                    presenter.stop();
                }
                break;
            case 32: // SPACE
                playPause();
                break;
            case 38: // UP
                increaseVolume();
                break;
            case 40: // DOWN
                decreaseVolume();
                break;
            case 37: // LEFT
                backward();
                break;
            case 39: // RIGHT
                forward();
                break;
            case 27: // ESC
                presenter.stop();
                break;
        }

    }

    return presenter;
}