/**
 * @module VideoAddon
 * @class VideoAddon
 * @constructor
 */
function Addonvideo_create() {
    var presenter = function () {
    };

    var deferredSyncQueue = window.DecoratorUtils.DeferredSyncQueue(deferredQueueDecoratorChecker);
    var currentTime;

    var escapedSeparator = '&&separator&&';

    presenter.currentMovie = 0;
    presenter.videoContainer = null;
    presenter.$view = null;
    presenter.files = [];
    presenter.video = null;
    presenter.hlsPlayer = null;
    presenter.isHLSValue = null;
    presenter.controlBar = null;
    presenter.isVideoSpeedControllerAdded = false;
    presenter.isCurrentlyVisible = true;
    presenter.isVideoLoaded = false;
    presenter.metadadaLoaded = false;
    presenter.isPreview = false;
    presenter.captions = [];
    presenter.captionDivs = [];
    presenter.descriptions = [];
    presenter.descriptionsDivs = [];
    presenter.speechTexts = [];
    presenter.metadataQueue = [];
    presenter.areSubtitlesHidden = false;
    presenter.calledFullScreen = false;
    presenter.playTriggered = false;
    presenter.playerController = null;
    presenter.posterPlayButton = null;
    presenter.videoView = null;
    presenter.isAudioDescriptionEnabled = null;
    presenter.prevTime = -0.001;
    presenter.usedStop = false;
    presenter.stylesBeforeFullscreen = {
        changedStyles: false,
        style: null,
        moduleWidth: 0,
        moduleHeight: 0,
        actualTime: -1,
        className: ''
    };

    presenter.originalVideoSize = {
        width: 0,
        height: 0
    };

    presenter.captionsOffset = {
        left: 0,
        top: 0
    };

    presenter.captionsScale = {
        xScale: 1.0,
        yScale: 1.0
    };

    presenter.lastWidthAndHeightValues = {
        width: 0,
        height: 0
    };

    presenter.addedVideoURLS = {};

    presenter.configuration = {
        isValid: false,
        addonSize: {
            width: 0,
            height: 0
        },
        addonID: null,
        isVisibleByDefault: null,
        shouldHideSubtitles: null,
        defaultControls: null,
        files: [],
        height: 0,
        showPlayButton: false,
        offlineMessage: "",
        baseDimensions: {
            width: 0,
            height: 0
        }
    };

    presenter.lastSentCurrentTime = 0;

    function deferredQueueDecoratorChecker() {
        return presenter.isVideoLoaded;
    }

    presenter.metadataLoadedDecorator = function (fn) {
        return function () {
            if (presenter.metadadaLoaded) {
                return fn.apply(this, arguments);
            } else {
                presenter.pushToMetadataQueue(fn, arguments);
            }
        }
    };

    presenter.pushToMetadataQueue = function (fn, providedArguments) {
        presenter.metadataQueue.push({
            function: fn,
            arguments: providedArguments,
            self: this
        });
    };

    presenter.upgradeShowPlayButton = function (model) {
        if (!model['Show play button']) {
            model['Show play button'] = 'False';
        }

        return model;
    };

    presenter.upgradeTimeLabels = function (model) {
        var upgradedModel = {};
        $.extend(true, upgradedModel, model); // Deep copy

        for (var i = 0; i < model.Files.length; i++) {
            if (!upgradedModel.Files[i].time_labels) {
                upgradedModel.Files[i].time_labels = "";
            }
        }

        return upgradedModel;
    };

    presenter.upgradeHLS = function (model) {
        var upgradedModel = {};
        $.extend(true, upgradedModel, model); // Deep copy

        for (var i = 0; i < model.Files.length; i++) {
            if (!upgradedModel.Files[i]['m3u8 video']) {
                upgradedModel.Files[i]['m3u8 video'] = "";
            }
        }

        return upgradedModel;
    };

    presenter.upgradeModel = function (model) {
        var upgradedModel = presenter.upgradePoster(model);
        upgradedModel = presenter.upgradeTimeLabels(upgradedModel);
        upgradedModel = presenter.upgradeSpeechTexts(upgradedModel);
        upgradedModel = presenter.upgradeOfflineMessage(upgradedModel);
        upgradedModel = presenter.upgradeVideoSpeedController(upgradedModel);
        upgradedModel = presenter.upgradeShowPlayButton(upgradedModel);
        upgradedModel = presenter.upgradeBaseDimensions(upgradedModel);
        upgradedModel = presenter.removeShowVideoFromModel(upgradedModel);
        return presenter.upgradeHLS(upgradedModel);
    };

    presenter.upgradePoster = function (model) {
        var upgradedModel = {};
        $.extend(true, upgradedModel, model); // Deep copy of model object

        for (var i = 0; i < model.Files.length; i++) {
            if (!upgradedModel.Files[i].Poster) {
                upgradedModel.Files[i].Poster = "";
            }
        }

        return upgradedModel;
    };

    presenter.upgradeSpeechTexts = function (model) {
        var upgradedModel = {};
        $.extend(true, upgradedModel, model); // Deep copy of model object

        for (var i = 0; i < model.Files.length; i++) {
            if (!upgradedModel.Files[i]["Audio Description"]) {
                upgradedModel.Files[i]["Audio Description"] = "";
            }
        }

        if (!model.speechTexts) {
            upgradedModel.speechTexts = {
                AudioDescriptionEnabled: {AudioDescriptionEnabled: "Audio description enabled"},
                AudioDescriptionDisabled: {AudioDescriptionDisabled: "Audio description disabled"}
            }
        }

        return upgradedModel;
    };

    presenter.upgradeOfflineMessage = function (model) {
        var upgradedModel = {};
        $.extend(true, upgradedModel, model);

        if (!upgradedModel["offlineMessage"]) {
            upgradedModel["offlineMessage"] = "This video is not available offline. Please connect to the Internet to watch it."
        }

        return upgradedModel;
    };

    presenter.upgradeVideoSpeedController = function(model) {
        var upgradedModel = {};
        $.extend(true, upgradedModel, model);

        if (!upgradedModel.hasOwnProperty('enableVideoSpeedController')) {
            upgradedModel['enableVideoSpeedController'] = 'False';
        }

        return upgradedModel;
    }

    presenter.upgradeBaseDimensions = function(model) {
        var upgradedModel = {};
        $.extend(true, upgradedModel, model);

        if (!upgradedModel.hasOwnProperty('Base width')) {
            upgradedModel['Base width'] = '';
        }

        if (!upgradedModel.hasOwnProperty('Base height')) {
            upgradedModel['Base height'] = '';
        }

        return upgradedModel;
    }

    presenter.removeShowVideoFromModel = function(model) {
        const upgradedModel = {};
        $.extend(true, upgradedModel, model);

        if (upgradedModel.hasOwnProperty("Show video")) {
            delete upgradedModel["Show video"];
        }

        return upgradedModel;
    };

    presenter.callMetadataLoadedQueue = function () {
        for (var i = 0; i < presenter.metadataQueue.length; i++) {
            var queueElement = presenter.metadataQueue[i];
            queueElement.function.apply(queueElement.self, queueElement.arguments);
        }

        presenter.metadataQueue = [];
    };

    presenter.ERROR_CODES = {
        'MEDIA_ERR_ABORTED': 1,
        'MEDIA_ERR_DECODE': 2,
        'MEDIA_ERR_NETWORK': 3,
        'MEDIA_ERR_SRC_NOT_SUPPORTED': [4, 'Ups ! Looks like your browser doesn\'t support this codecs. Go <a href="https://tools.google.com/dlpage/webmmf/" > -here- </a> to download WebM plugin'],
        'NVT01': "Not valid data format in time labels property",
        'NVD01': "Base width and height must be either positive integers or empty"
    };

    presenter.getVideoErrorMessage = function (errorCode) {
        var errorMessage = 'We are terribly sorry, but an error has occurred: ';

        switch (errorCode) {
            case presenter.ERROR_CODES.MEDIA_ERR_ABORTED:
                errorMessage += 'you aborted the video playback.';
                break;
            case presenter.ERROR_CODES.MEDIA_ERR_NETWORK:
                errorMessage += 'a network error caused the video download to fail part-way.';
                break;
            case presenter.ERROR_CODES.MEDIA_ERR_DECODE:
                errorMessage += 'the video playback was aborted due to a corruption problem or because the video used features your browser did not support.';
                break;
            case presenter.ERROR_CODES.MEDIA_ERR_SRC_NOT_SUPPORTED:
                errorMessage += 'the video could not be loaded, either because the server or network failed or because the format is not supported.';
                break;
            default:
                errorMessage += 'unknown.';
                break;
        }

        return errorMessage + ' Please refresh page.';
    };

    presenter.videoTypes = [
        {name: 'MP4 video', type: 'video/mp4'},
        {name: 'Ogg video', type: 'video/ogg'},
        {name: 'WebM video', type: 'video/webm'},
        {name: 'm3u8 video', type: 'application/x-mpegURL'}
    ];

    presenter.VIDEO_STATE = {
        STOPPED: 0,
        PLAYING: 1,
        PAUSED: 2
    };

    function fullScreenChange() {
        if (presenter.configuration.isFullScreen) {
            $(presenter.videoContainer).css({
                width: "100%",
                height: "100%"
            });

            $(presenter.videoObject).css({
                width: "100%",
                height: "100%",
                position: 'fixed',
                left: '0px',
                top: '0px'
            });

            if (presenter.configuration.defaultControls) {
                $(presenter.controlBar.getMainElement()).css('position', "fixed");
            }

            presenter.$posterWrapper.hide();

        } else {
            $(presenter.videoContainer).css({
                width: presenter.configuration.dimensions.container.width + 'px',
                height: presenter.configuration.dimensions.container.height + 'px',
                position: presenter.isHLS() ? 'absolute' : 'relative'
            });
            $(presenter.videoObject).css({
                width: presenter.configuration.dimensions.video.width + 'px',
                height: presenter.configuration.dimensions.video.height + 'px',
                position: presenter.isHLS() ? 'absolute' : 'relative'
            });

            if (presenter.configuration.defaultControls) {
                $(presenter.controlBar.getMainElement()).css('position', "absolute");
            }

        }

        $(presenter.videoObject).on("loadedmetadata", function onLoadedMeta() {
            presenter.$view.find(".poster-wrapper").show();
            $(presenter.videoObject).off("loadedmetadata");
        });

        $(presenter.videoObject).on("canplay", function onCanPlay() {
            $(presenter.videoObject).off("canplay");
        });
    }

    presenter.registerHook = function () {
        presenter.mathJaxHook = MathJax.Hub.Register.MessageHook("End Process", function mathJaxResolve(message) {
            if ($(message[1]).hasClass('ic_page')) {
                presenter.mathJaxProcessEndedDeferred.resolve();
            }
        });
    };

    presenter.setPlayerController = function (controller) {
        var mathJaxDeferred = new jQuery.Deferred();
        presenter.mathJaxProcessEndedDeferred = mathJaxDeferred;
        presenter.mathJaxProcessEnded = mathJaxDeferred.promise();
        presenter.playerController = controller;
        presenter.registerHook();

        presenter.eventBus = controller.getEventBus();
        presenter.eventBus.addEventListener('PageLoaded', this);

        var pageLoadedDeferred = new jQuery.Deferred();
        presenter.pageLoadedDeferred = pageLoadedDeferred;
        presenter.pageLoaded = pageLoadedDeferred.promise();
    };

    presenter.onEventReceived = function (eventName, eventData) {
        presenter.pageLoadedDeferred.resolve();
        if (eventData.value === 'dropdownClicked' && !presenter.videoObject.playing && !isTemporarilyPaused()) {
            presenter.metadadaLoaded = false;
            presenter.videoObject.load();
        }
    };

    function isTemporarilyPaused() {
        return (presenter.videoObject.paused
            && presenter.videoObject.readyState > 2
            && presenter.videoObject.currentTime > 0
            && !presenter.videoObject.ended
        );
    }

    presenter.createEndedEventData = function (currentVideo) {
        return {
            source: presenter.configuration.addonID,
            item: '' + (currentVideo + 1),
            value: 'ended'
        };
    };

    presenter.formatTime = function addonVideo_formatTime(seconds) {
        if (seconds < 0 || isNaN(seconds)) {
            return "00:00";
        }
        var minutes = Math.floor(seconds / 60);
        minutes = (minutes >= 10) ? minutes : "0" + minutes;
        seconds = Math.floor(seconds % 60);
        seconds = (seconds >= 10) ? seconds : "0" + seconds;
        return minutes + ":" + seconds;
    };

    presenter.sendTimeUpdateEvent = function Video_sendTimeUpdate(formattedTime) {
        presenter.eventBus.sendEvent('ValueChanged', {
            source: presenter.configuration.addonID,
            item: (presenter.currentMovie + 1),
            value: formattedTime
        });
    };

    presenter.sendVideoEndedEvent = function () {
        var eventData = presenter.createEndedEventData(presenter.currentMovie);
        presenter.eventBus.sendEvent('ValueChanged', eventData);
    };

    presenter.stopPropagationOnClickEvent = function (e) {
        e.stopPropagation();
    };

    presenter.setMetaDataOnMetaDataLoadedEvent = function () {
        if (DevicesUtils.isFirefox()) {
            presenter.$view.find(".video-container").prepend(presenter.videoObject);
        }

        presenter.metadadaLoaded = true;
        presenter.originalVideoSize = presenter.getVideoSize(presenter.configuration.addonSize, presenter.videoObject);
        presenter.calculateCaptionsOffset(presenter.configuration.addonSize, true);

        if (presenter.configuration.defaultControls) {
            presenter.$view.find('.video-container').append(presenter.controlBar.getMainElement());
            presenter.controlBar.setMaxDurationTime(presenter.videoObject.duration);
            if (presenter.stylesBeforeFullscreen.actualTime !== -1) {
                presenter.videoObject.currentTime = presenter.stylesBeforeFullscreen.actualTime;
                presenter.play();
                presenter.stylesBeforeFullscreen.actualTime = -1;
            }
        }

        presenter.callMetadataLoadedQueue();
    };

    presenter.calculateCaptionsOffset = function (size, changeWidth) {
        var videoSize = presenter.getVideoSize(size, presenter.videoObject);

        presenter.captionsOffset.left = Math.abs(size.width - videoSize.width) / 2;
        presenter.captionsOffset.top = Math.abs(size.height - videoSize.height) / 2;

        presenter.$captionsContainer.css({
            top: presenter.captionsOffset.top,
            left: presenter.captionsOffset.left,
            position: "absolute"
        });

        if (changeWidth) {
            presenter.$captionsContainer.css({
                width: videoSize.width / presenter.captionsScale.xScale,
                height: videoSize.height / presenter.captionsScale.yScale
            });
        }
    };

    /**
     * @param  {{width: Number, height:Number}} size
     * @param  {HTMLVideoElement} video
     * @returns {{width: Number, height:Number}} calculated video size
     */
    presenter.getVideoSize = function (size, video) {
        //https://stackoverflow.com/questions/17056654/getting-the-real-html5-video-width-and-height
        var videoRatio = video.videoWidth / video.videoHeight;
        var width = size.width, height = size.height;
        var elementRatio = width / height;

        if (elementRatio > videoRatio) {
            width = height * videoRatio;
        } else {
            height = width / videoRatio;
        }

        return {
            width: width,
            height: height
        };
    };

    function setVideoStateOnPlayEvent() {
        presenter.videoState = presenter.VIDEO_STATE.PLAYING;
        presenter.addClassToView('playing');
    }

    function setVideoStateOnPauseEvent() {
        if (!presenter.isHideExecuted) {
            presenter.videoState = presenter.VIDEO_STATE.PAUSED;
            presenter.removeClassFromView('playing');
        }

        delete presenter.isHideExecuted;
    }

    presenter.removeMathJaxHook = function () {
        MathJax.Hub.signal.hooks["End Process"].Remove(presenter.mathJaxHook);
    };

    presenter.destroy = function () {
        var view = document.getElementsByClassName('ic_page');

        if (presenter.hlsPlayer != null) {
            presenter.hlsPlayer.off('click');
            presenter.hlsPlayer.off('error');
            presenter.hlsPlayer.off('loadedmetadata');
            presenter.hlsPlayer.off('play');
            presenter.hlsPlayer.off('pause');
            presenter.hlsPlayer.off('playing');

            presenter.hlsPlayer.off('canplay');
            presenter.hlsPlayer.dispose();
            presenter.hlsPlayer = null;
        }

        if (presenter.configuration.defaultControls) {
            presenter.controlBar.destroy();
        }

        presenter.stop();

        presenter.videoObject.removeEventListener('click', presenter.stopPropagationOnClickEvent);
        presenter.videoObject.removeEventListener('loadedmetadata', presenter.setMetaDataOnMetaDataLoadedEvent);
        presenter.videoObject.removeEventListener('play', setVideoStateOnPlayEvent);
        presenter.videoObject.removeEventListener('pause', setVideoStateOnPauseEvent);
        presenter.videoObject.removeEventListener('stalled', presenter.onStalledEventHandler);
        presenter.videoObject.removeEventListener('webkitfullscreenchange', fullScreenChange);
        $(document).off('webkitfullscreenchange mozfullscreenchange fullscreenchange MSFullscreenChange');
        document.removeEventListener("mozfullscreenchange", fullScreenChange);

        presenter.$videoObject.unbind("ended");
        presenter.$videoObject.unbind("error");
        presenter.$videoObject.unbind("canplay");
        presenter.$videoObject.unbind('timeupdate');

        presenter.removeMathJaxHook();
        presenter.$view.off();

        presenter.videoObject.src = '';
        presenter.mathJaxHook = null;
        presenter.eventBus = null;
        presenter.view = null;
        presenter.viewObject = null;
        presenter.videoObject = null;

        $(view).off('click');
        $(window).off('click');
    };

    presenter.resizeVideoToWindow = function () {
        var body = document.getElementsByTagName('body')[0];

        var video = presenter.videoContainer.get(0);
        presenter.stylesBeforeFullscreen.actualTime = presenter.videoObject.currentTime;
        presenter.stylesBeforeFullscreen.style = {
            position: video.style.position,
            top: video.style.top,
            left: video.style.left,
            zIndex: video.style.zIndex,
            className: video.className
        };

        presenter.stylesBeforeFullscreen.changedStyles = true;
        video.style.position = "fixed";
        video.style.top = "0";
        video.style.left = "0";
        video.style.zIndex = 20000;
        video.className = video.className + " " + presenter.$view[0].className;
        body.appendChild(video);
        presenter.metadadaLoaded = false;
        presenter.videoObject.load();
        presenter.scalePosterToWindowSize();
        presenter.scaleCaptionsContainerToVideoNewVideoSize();
    };

    presenter.scalePosterToWindowSize = presenter.metadataLoadedDecorator(function () {
        var size = {
            width: $(presenter.videoObject).width(),
            height: $(presenter.videoObject).height()
        };

        presenter.calculatePosterSize(presenter.videoObject, size);
    });

    presenter.fullScreen = function () {
        var requestMethod = requestFullscreen(presenter.videoContainer);
        presenter.stylesBeforeFullscreen.moduleWidth = presenter.$view.width();
        presenter.stylesBeforeFullscreen.moduleHeight = presenter.$view.height();
        if (requestMethod === null) {
            presenter.resizeVideoToWindow();
        } else {
            presenter.scaleCaptionsContainerToScreenSize();

            var size = {
                width: screen.width,
                height: screen.height
            };
            presenter.calculatePosterSize(presenter.videoObject, size);
        }

        presenter.configuration.isFullScreen = true;
        presenter.playerController.setAbleChangeLayout(false);
        fullScreenChange();
    };

    presenter.closeFullscreen = function () {
        if (presenter.stylesBeforeFullscreen.changedStyles === true) {
            presenter.stylesBeforeFullscreen.actualTime = presenter.videoObject.currentTime;
            presenter.stylesBeforeFullscreen.changedStyles = false;
            var video = presenter.videoContainer.get(0);
            presenter.videoView.appendChild(video);
            presenter.metadadaLoaded = false;
            presenter.videoObject.load();
            video.style.position = presenter.stylesBeforeFullscreen.style.position;
            video.style.top = presenter.stylesBeforeFullscreen.style.top;
            video.style.left = presenter.stylesBeforeFullscreen.style.left;
            video.style.zIndex = presenter.stylesBeforeFullscreen.style.zIndex;
            video.className = presenter.stylesBeforeFullscreen.style.className;
        } else {
            exitFullscreen();
        }
        presenter.configuration.isFullScreen = false;
        presenter.removeScaleFromCaptionsContainer();
        fullScreenChange();

        presenter.calculatePosterSize(presenter.videoObject, presenter.configuration.addonSize);
        presenter.playerController.setAbleChangeLayout(true);
    };

    presenter.switchAudioDescriptionEnabled = function() {
        if (presenter.isAudioDescriptionEnabled == null) {
            setAudioDescriptionEnabled(false);
        } else {
            setAudioDescriptionEnabled(!presenter.isAudioDescriptionEnabled);
        }
    };

    function setAudioDescriptionEnabled(isEnabled) {
        presenter.isAudioDescriptionEnabled = isEnabled;
        if (presenter.isAudioDescriptionEnabled) {
            speak([window.TTSUtils.getTextVoiceObject(presenter.speechTexts.audioDescriptionEnabled)]);
        } else {
            speak([window.TTSUtils.getTextVoiceObject(presenter.speechTexts.audioDescriptionDisabled)]);
            setAudioDescriptionDisabled();
        }
    }

    function setAudioDescriptionDisabled(){
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
        if (window.responsiveVoice && window.responsiveVoice.isPlaying()) {
            audioDescriptionEndedCallback();
            window.responsiveVoice.cancel();
        }
        for ( var i = 0; i < presenter.descriptions.length; i++) {
            var description = presenter.descriptions[i];
            $(description.element).css('visibility', 'hidden');
            $(description.element).attr('visibility', 'hidden');
        }
    }

    presenter.showAudioDescription = function() {
        setAudioDescriptionEnabled(true);
    };

    presenter.hideAudioDescription = function() {
        setAudioDescriptionEnabled(false);
    };


    presenter.keyboardController = function (keycode, isShift, event) {
        event.preventDefault();

        function increasedVolume() {
            var val = Math.round((presenter.videoObject.volume + 0.1) * 10) / 10;

            return val > 1 ? 1 : val;
        }

        function decreasedVolume() {
            var val = Math.round((presenter.videoObject.volume - 0.1) * 10) / 10;

            return val < 0 ? 0 : val;
        }

        function forward() {
            presenter.videoObject.currentTime += 15;
        }

        function backward() {
            presenter.videoObject.currentTime -= 15;
        }

        function playPause() {
            if (presenter.videoObject.paused) {
                presenter.play();
            } else {
                presenter.pause();
            }
        }

        function nextTimeLabel() {
            var currentTime = presenter.videoObject.currentTime;
            var currentElement = presenter.configuration.files[presenter.currentMovie],
                /**
                 * @type {{title: String, time: Number}[]}
                 */
                timeLabels = currentElement.timeLabels;


            for (var i = 0; i < timeLabels.length; i++) {
                var element = timeLabels[i];

                if (element.time > currentTime) {
                    presenter.seek(element.time);
                    break;
                }
            }
        }

        function previousTimeLabel() {
            var currentTime = presenter.videoObject.currentTime - 2;
            var currentElement = presenter.configuration.files[presenter.currentMovie],
                /**
                 * @type {{title: String, time: Number}[]}
                 */
                timeLabels = currentElement.timeLabels;

            for (var i = timeLabels.length - 1; i >= 0; i--) {
                var element = timeLabels[i];

                if (element.time < currentTime) {
                    presenter.seek(element.time);
                    break;
                }
            }
        }

        switch (keycode) {
            case 32:
                playPause();
                break;
            case 38:
                presenter.videoObject.volume = increasedVolume();
                break;
            case 40:
                presenter.videoObject.volume = decreasedVolume();
                break;
            case 37:
                if (!isShift) {
                    backward();
                } else {
                    previousTimeLabel();
                }
                break;
            case 39:
                if (!isShift) {
                    forward();
                } else {
                    nextTimeLabel();
                }
                break;
            case 27:
                presenter.pause();
                break;
            case 70:
                presenter.fullScreen();
                break;
            case 65: // A
                presenter.switchAudioDescriptionEnabled();
                break;
        }
    };

    /**
     *
     * @param {String} timeLabel
     */
    presenter.validateTimeLabel = function (timeLabel, index) {
        var title = timeLabel.split(' ').slice(1).join(' '),
            time = timeLabel.split(' ')[0],
            //[Sec, Min, Hour]
            timeMultiplication = [1, 60, 60 * 60],
            timeElements = time.split(':'),
            i;

        if (timeElements.length === 0 || timeElements.length > 3) {
            return {
                isValid: false,
                errorCode: "NVT01"
            };
        }

        for (i = 0; i < timeElements.length; i++) {
            if (!timeElements[i].match(/^[0-9]+$/g)) {
                return {
                    isValid: false,
                    errorCode: "NVT01"
                };
            }
        }

        if (title.trim() === '') {
            title = index + ". " + time;
        }

        var timeInSeconds = 0;

        timeElements = timeElements.reverse();
        for (i = timeElements.length - 1; i >= 0; i--) {
            timeInSeconds += parseInt(timeElements[i], 10) * timeMultiplication[i];
        }

        if (isNaN(timeInSeconds)) {
            return {
                isValid: false,
                errorCode: "NVT01"
            };
        }

        return {
            isValid: true,
            title: title,
            time: timeInSeconds
        };
    };

    presenter.validateTimeLabels = function (file) {
        var timeLabelsText = file['time_labels'],
            timeLabels = timeLabelsText.match(/[^\r\n]+/g) || [],  //https://stackoverflow.com/questions/5034781/js-regex-to-split-by-line
            validatedTimeLabels = [];

        for (var i = 0; i < timeLabels.length; i++) {
            var validatedTimeLabel = presenter.validateTimeLabel(timeLabels[i], i + 1);
            if (!validatedTimeLabel.isValid) {
                return validatedTimeLabel;
            }

            validatedTimeLabels.push(validatedTimeLabel);
        }

        validatedTimeLabels = validatedTimeLabels.sort(function (a, b) {
            return a.time - b.time;
        });

        return {
            isValid: true,
            value: validatedTimeLabels
        }
    };

    presenter.validateFile = function (file) {
        var validatedTimeLabels = presenter.validateTimeLabels(file);
        if (!validatedTimeLabels.isValid) {
            return validatedTimeLabels;
        }

        var fileToReturn = {
            "Ogg video": file['Ogg video'],
            "MP4 video": file['MP4 video'],
            "WebM video": file['WebM video'],
            "m3u8 video": file['m3u8 video'],
            "Subtitles": file['Subtitles'],
            "Audiodescription": file['Audio Description'],
            "Poster": file['Poster'],
            "ID": file['ID'],
            "AlternativeText": file['AlternativeText'],
            "Loop video": ModelValidationUtils.validateBoolean(file['Loop video']),
            timeLabels: validatedTimeLabels.value
        };

        return {
            isValid: true,
            file: fileToReturn
        };

    };

    presenter.validateFiles = function (model) {
        var modelFiles = model.Files;
        var files = [];

        for (var i = 0; i < modelFiles.length; i++) {
            var validatedFile = presenter.validateFile(modelFiles[i]);
            if (!validatedFile.isValid) {
                return validatedFile;
            }

            files.push(validatedFile.file);
        }

        return {
            isValid: true,
            files: files
        };
    };

    function getSpeechTextProperty (rawValue, defaultValue) {
        var value = rawValue.trim();

        if (value === undefined || value === null || value === '') {
            return defaultValue;
        }

        return value;
    }

    function setSpeechTexts (speechTexts) {
        presenter.speechTexts = {
            audioDescriptionEnabled:  'Audio description enabled',
            audioDescriptionDisabled: 'Audio description disabled'
        };

        if (!speechTexts) {
            return;
        }

        presenter.speechTexts = {
            audioDescriptionEnabled: getSpeechTextProperty(speechTexts['AudioDescriptionEnabled']['AudioDescriptionEnabled'], presenter.speechTexts.audioDescriptionEnabled),
            audioDescriptionDisabled: getSpeechTextProperty(speechTexts['AudioDescriptionDisabled']['AudioDescriptionDisabled'], presenter.speechTexts.audioDescriptionDisabled)
        };
    }

    presenter.validateModel = function (model) {
        var validatedFiles = presenter.validateFiles(model);
        setSpeechTexts(model["speechTexts"]);
        if (!validatedFiles.isValid) {
            return validatedFiles;
        }

        var baseDimensions = {
            width: 0,
            height: 0
        };
        if (model['Base width'].trim().length !== 0) {
            var validatedBaseWidth = ModelValidationUtils.validatePositiveInteger(model['Base width']);
            if (validatedBaseWidth.isValid) {
                baseDimensions.width = validatedBaseWidth.value;
            } else {
                validatedBaseWidth.errorCode = 'NVD01';
                return validatedBaseWidth;
            }
        }
        if (model['Base height'].trim().length !== 0) {
            var validatedBaseHeight = ModelValidationUtils.validatePositiveInteger(model['Base height']);
            if (validatedBaseHeight.isValid) {
                baseDimensions.height = validatedBaseHeight.value;
            } else {
                validatedBaseHeight.errorCode = 'NVD01';
                return validatedBaseHeight;
            }
        }

        return {
            isValid: true,
            addonSize: {
                width: parseInt(model.Width, 10),
                height: parseInt(model.Height, 10)
            },
            addonID: model.ID,
            isVisibleByDefault: ModelValidationUtils.validateBoolean(model["Is Visible"]),
            shouldHideSubtitles: ModelValidationUtils.validateBoolean(model["Hide subtitles"]),
            defaultControls: !ModelValidationUtils.validateBoolean(model['Hide default controls']),
            files: validatedFiles.files,
            height: parseInt(model.Height, 10),
            showPlayButton: ModelValidationUtils.validateBoolean(model['Show play button']),
            isTabindexEnabled: ModelValidationUtils.validateBoolean(model["Is Tabindex Enabled"]),
            offlineMessage: model["offlineMessage"],
            enableVideoSpeedController: ModelValidationUtils.validateBoolean(model["enableVideoSpeedController"]),
            baseDimensions: baseDimensions
        }
    };

    presenter.checkPlayButtonVisibility = function () {
        if (!presenter.configuration.showPlayButton) {
            presenter.$view.find('.video-poster-play').hide();
        }
    };

    presenter.cachePosters = function () {
        for (var fileNumber = 0; fileNumber < presenter.configuration.files.length; fileNumber++) {
            presenter.cachePoster(fileNumber);
        }
    };

    presenter.cachePoster = function (fileNumber) {
        var posterSource = presenter.configuration.files[fileNumber].Poster;
        if (posterSource) {
            var image = new Image();
            image.src = posterSource;

            presenter.configuration.files[fileNumber].Poster = image;
        }
    };


    presenter.showPlayButton = function () {
        if (presenter.configuration.showPlayButton) {
            presenter.posterPlayButton.show();
        }
    };

    presenter.hidePlayButton = function () {
        if (presenter.configuration.showPlayButton) {
            presenter.posterPlayButton.hide();
        }
    };

    presenter.setBurgerMenu = function () {
        var BURGER_MENU = "time_labels";
        if (!presenter.configuration.defaultControls) {
            return;
        }

        presenter.controlBar.removeBurgerMenu(BURGER_MENU);

        var currentElement = presenter.configuration.files[presenter.currentMovie],
            /**
             * @type {{title: String, time: Number}[]}
             */
            labels = currentElement.timeLabels;

        if (labels.length === 0) {
            return;
        }

        var elementsForBurger = labels.map(function (value) {
            return {
                title: value.title,
                callback: function () {
                    presenter.seek(value.time);
                }
            };
        });

        presenter.controlBar.addBurgerMenu(BURGER_MENU, elementsForBurger);
    };

    presenter.addVideoSpeedController = function () {
        if (!presenter.configuration.defaultControls || !presenter.configuration.enableVideoSpeedController) {
            return;
        }

        presenter.isVideoSpeedControllerAdded = true;
        presenter.controlBar.addVideoSpeedController(presenter.setPlaybackRate);
    };

    presenter.resetVideoSpeedController = function () {
        if (!presenter.configuration.defaultControls || !presenter.configuration.enableVideoSpeedController) {
            return;
        }

        presenter.controlBar.resetPlaybackRateSelectValue();
        presenter.setPlaybackRate(1.0);
    };

    presenter.run = function (view, model) {
        var upgradedModel = presenter.upgradeModel(model);
        var validatedModel = presenter.validateModel(upgradedModel);
        if (!validatedModel.isValid) {
            DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, validatedModel.errorCode);
            return;
        }

        presenter.configuration = $.extend(presenter.configuration, validatedModel);

        presenter.cachePosters();

        presenter.videoState = presenter.VIDEO_STATE.STOPPED;
        presenter.videoView = view;
        presenter.$view = $(view);

        presenter.posterPlayButton = $(view).find('.video-poster-play');
        presenter.videoContainer = $(view).find('.video-container:first');
        presenter.$captionsContainer = presenter.$view.find(".captions-container:first");
        presenter.$posterWrapper = presenter.$view.find('.poster-wrapper');
        presenter.$mask = presenter.$view.find('.video-container-mask');

        presenter.videoObject = presenter.videoContainer.find('video')[0];
        presenter.$videoObject = $(presenter.videoObject);

        Object.defineProperty(presenter.videoObject, 'playing', {
           get: function () {
               return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2);
           }
        });

        presenter.setDimensions();

        presenter.checkPlayButtonVisibility();

        if (presenter.configuration.defaultControls) {
            presenter.buildControlsBars();
        } else {
            presenter.videoContainer.on("click", function () {
                presenter.videoObject = presenter.videoContainer.find('video')[0];
                if (presenter.videoObject.paused) {
                    presenter.play();
                } else {
                    presenter.pause();
                }
            });
        }

        presenter.addTabindex(presenter.configuration.isTabindexEnabled);

        if (presenter.isHLS()) presenter.loadHLSPlayer();

        presenter.connectHandlers();
        presenter.reload();

        if (!presenter.configuration.isVisibleByDefault) {
            presenter.hide();
        }

        presenter.eventBus.addEventListener('ValueChanged', this);

        if (presenter.configuration.shouldHideSubtitles) {
            presenter.hideSubtitles();
        } else {
            presenter.showSubtitles();
        }

        presenter.videoObject.setAttribute('webkit-playsinline', 'webkit-playsinline');
        presenter.videoObject.setAttribute('playsinline', 'playsinline');
    };

    presenter.connectHandlers = function () {
        if (!presenter.isHLS()) {
            presenter.videoObject.addEventListener('click', presenter.stopPropagationOnClickEvent);
            presenter.videoObject.addEventListener('error', function () {
                presenter.handleErrorCode(this.error);
            }, true);
            presenter.videoObject.addEventListener('loadedmetadata', presenter.setMetaDataOnMetaDataLoadedEvent);
            presenter.videoObject.addEventListener('play', setVideoStateOnPlayEvent);
            presenter.videoObject.addEventListener('pause', setVideoStateOnPauseEvent);
            presenter.videoObject.addEventListener('playing', presenter.onVideoPlaying, false);
        }
        $(document).on('webkitfullscreenchange mozfullscreenchange fullscreenchange MSFullscreenChange', presenter.fullscreenChangedEventReceived);

        MutationObserverService.createDestroyObserver(presenter.configuration.addonID, presenter.destroy, presenter.$view.get(0));
		MutationObserverService.setObserver();

        presenter.addClickListener();
    };

    presenter.addClickListener = function () {
        var view = document.getElementsByClassName('ic_page');
        $(view[0]).on('click', function (event) {
            if (presenter.configuration.defaultControls && presenter.controlBar.isSelectorOpen && !event.target.localName.includes('select')) {
                presenter.controlBar.isSelectorOpen = false;
                presenter.controlBar.hideControls();
            }
            event.preventDefault();
            event.stopPropagation();
        });

        $(window).on('click', function (event) {
            if (presenter.configuration.defaultControls && presenter.controlBar.isSelectorOpen) {
                presenter.controlBar.isSelectorOpen = false;
                presenter.controlBar.hideControls();
            }
            event.preventDefault();
            event.stopPropagation();
        });
    }

    presenter.isHLS = function() {
        if (window.videojs === undefined) return false;
        if (presenter.isHLSValue == null) {
            presenter.isHLSValue = false;
            for (var i = 0; i < presenter.configuration.files.length; i++) {
                var videoFile = presenter.configuration.files[i];
                if (videoFile["m3u8 video"].trim().length > 0) presenter.isHLSValue = true;
            }
        }
        return presenter.isHLSValue;
    }

    presenter.loadHLSPlayer = function() {
        presenter.$videoObject.addClass('video-js vjs-theme-sea vjs-big-play-centered');
        presenter.$videoObject.attr({
            preload: presenter.isHLS() ? 'metadata' : 'auto',
            fluid: "true",
            "data-setup": '{}'
        });
        var videoID = 'videojs-player-' + presenter.configuration.addonID;
        presenter.$videoObject.attr('id', videoID);
        presenter.hlsPlayer = window.videojs(videoID);
        presenter.hlsPlayer.ready(() => {
            presenter.hlsPlayer.on('click', presenter.stopPropagationOnClickEvent);
            presenter.hlsPlayer.on('error', function () {
                presenter.handleErrorCode(this.error);
            });
            presenter.hlsPlayer.on('loadedmetadata', presenter.setMetaDataOnMetaDataLoadedEvent);
            presenter.hlsPlayer.on('play', setVideoStateOnPlayEvent);
            presenter.hlsPlayer.on('pause', setVideoStateOnPauseEvent);
            presenter.hlsPlayer.on('playing', presenter.onVideoPlaying);

            presenter.hlsPlayer.on('loadedmetadata', function onLoadedMetadata() {
                presenter.isVideoLoaded = true;
                presenter.callTasksFromDeferredQueue();

                $(presenter.videoObject).unbind("canplay");

                if (presenter.areSubtitlesHidden) {
                    presenter.hideSubtitles();
                } else {
                    presenter.showSubtitles();
                }
                }
            );
        });
    }

    presenter.fullscreenChangedEventReceived = function () {
        if (!isVideoInFullscreen() && presenter.configuration.isFullScreen) {
            presenter.configuration.isFullScreen = false;
            presenter.removeScaleFromCaptionsContainer();
            fullScreenChange();
            presenter.configuration.defaultControls && presenter.controlBar.showFullscreenButton();

            presenter.calculatePosterSize(presenter.videoObject, presenter.configuration.addonSize);
            presenter.playerController.setAbleChangeLayout(true);
        }
    };

    presenter.checkAddonSize = function () {
        if (presenter.videoContainer.width() !== presenter.lastWidthAndHeightValues.width
            || presenter.videoContainer.height() !== presenter.lastWidthAndHeightValues.height) {

            presenter.lastWidthAndHeightValues.width = presenter.videoContainer.width();
            presenter.lastWidthAndHeightValues.height = presenter.videoContainer.height();

            presenter.calculateCaptionsOffset(presenter.lastWidthAndHeightValues, false);
            presenter.scaleCaptionsContainerToVideoNewVideoSize();
        }
    };

    presenter.buildControlsBars = function () {
        var config = {
            videoObject: presenter.videoObject,
            parentElement: presenter.videoContainer[0],
            isVolumeEnabled: !MobileUtils.isSafariMobile(navigator.userAgent)
        };

        var controls = new window.CustomControlsBar(config);

        controls.addPlayCallback(presenter.play);
        controls.addPauseCallback(presenter.pause);
        controls.addStopCallback(presenter.stop);
        controls.addFullscreenCallback(presenter.fullScreen);
        controls.addCloseFullscreenCallback(presenter.closeFullscreen);
        controls.addProgressChangedCallback(presenter.seekFromPercent);
        controls.addVolumeChangedCallback(presenter.setVolume);
        controls.addCallbackToBuildInTimer(presenter.checkAddonSize);

        presenter.$view.find('.video-container').append(controls.getMainElement());

        presenter.controlBar = controls;
    };

    presenter.scaleCaptionsContainerToVideoNewVideoSize = presenter.metadataLoadedDecorator(function () {
        var size = {
            width: $(presenter.videoObject).width(),
            height: $(presenter.videoObject).height()
        };

        var newVideoSize = presenter.getVideoSize(size, presenter.videoObject);

        var xScale = newVideoSize.width / presenter.originalVideoSize.width;
        var yScale = newVideoSize.height / presenter.originalVideoSize.height;

        if (presenter.configuration.baseDimensions.width != 0) {
            xScale = xScale * (presenter.configuration.addonSize.width/presenter.configuration.baseDimensions.width);
        }
        if (presenter.configuration.baseDimensions.height != 0) {
            yScale = yScale * (presenter.configuration.addonSize.height/presenter.configuration.baseDimensions.height);
        }

        presenter.$captionsContainer.css(generateTransformDict(xScale, yScale));
        presenter.captionsScale.xScale = xScale;
        presenter.captionsScale.yScale = yScale;

        presenter.calculateCaptionsOffset(size, true);
    });

    presenter.scaleCaptionsContainerToScreenSize = presenter.metadataLoadedDecorator(function () {
        var size = {
            width: screen.width,
            height: screen.height
        };

        var newVideoSize = presenter.getVideoSize(size, presenter.videoObject);

        var xScale = newVideoSize.width / presenter.originalVideoSize.width;
        var yScale = newVideoSize.height / presenter.originalVideoSize.height;


        presenter.$captionsContainer.css(generateTransformDict(xScale, yScale));
        presenter.captionsScale.xScale = xScale;
        presenter.captionsScale.yScale = yScale;

        presenter.calculateCaptionsOffset(size, false);
    });

    presenter.removeScaleFromCaptionsContainer = presenter.metadataLoadedDecorator(function () {
        presenter.$captionsContainer.css(generateTransformDict(1, 1));
        presenter.captionsScale.xScale = 1.0;
        presenter.captionsScale.yScale = 1.0;

        presenter.calculateCaptionsOffset(presenter.configuration.addonSize, false);
    });

    presenter.sendOnPlayingEvent = function () {
        var eventData = {
            'source': presenter.configuration.addonID,
            'item': (presenter.currentMovie + 1),
            'value': 'playing',
            'score': ''
        };

        presenter.eventBus.sendEvent('ValueChanged', eventData);
    };

    presenter.onVideoPlaying = function AddonVideo_onVideoPlaying() {
        presenter.sendOnPlayingEvent();

        if (presenter.videoObject.currentTime === 0) {
            presenter.sendTimeUpdateEvent(presenter.formatTime(presenter.videoObject.currentTime))
        }
    };

    presenter.convertTimeStringToNumber = function (timeString) {
        timeString = timeString.split(':');
        var minutes = parseInt(timeString[0] * 60, 10);
        var seconds = parseInt(timeString[1], 10);
        return {isCorrect: true, value: (minutes + seconds)};
    };

    presenter.handleErrorCode = function (error) {
        if (!error) return;

        presenter.$view.html(presenter.getVideoErrorMessage(error.code));
    };

    presenter.createPreview = function (view, model) {
        presenter.isPreview = true;

        var upgradedModel = presenter.upgradeModel(model);
        var validatedModel = presenter.validateModel(upgradedModel);
        if (!validatedModel.isValid) {
            DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, validatedModel.errorCode);
            return;
        }

        presenter.configuration = $.extend(presenter.configuration, validatedModel);

        presenter.$view = $(view);
        presenter.videoContainer = $(view).find('.video-container:first');

        presenter.setVideo();
        presenter.setDimensions();
    };

    presenter.showCaptions = function (time) {
        if (!presenter.configuration.dimensions) return ; // No captions to show when video wasn't loaded properly
        for (var i = 0; i < presenter.captions.length; i++) {
            var caption = presenter.captions[i];
            if (caption.start <= time && caption.end >= time) {
                $(caption.element).attr('visibility', 'visible');
                $(caption.element).css('visibility', presenter.isCurrentlyVisible ? 'visible' : 'hidden');
            } else {
                $(caption.element).css('visibility', 'hidden');
                $(caption.element).attr('visibility', 'hidden');
            }
        }
    };

    function getAudioDescriptionEnabled() {
        if (presenter.isAudioDescriptionEnabled != null) {
            return presenter.isAudioDescriptionEnabled;
        }
        if (presenter.playerController && presenter.playerController.isWCAGOn()) {
            return presenter.playerController.isWCAGOn();
        }
        return false;
    }

    function audioDescriptionEndedCallback() {
        if (presenter) {
            if(!presenter.usedStop) {
                presenter.play();
            }
        }
    }

    presenter.readAudioDescriptions = function (time) {
        if (!presenter.configuration.dimensions) return false;
        if (!presenter.playerController || !getAudioDescriptionEnabled()) return false;
        if ((time < presenter.prevTime) || ((time - presenter.prevTime) > 1.0)) {
            presenter.prevTime = time - 0.001;
            return false;
        }

        var isSpeaking = false;
        for ( var i = 0; i < presenter.descriptions.length; i++) {
            var description = presenter.descriptions[i];
            if (presenter.prevTime < description.start && description.start <= time) {
                isSpeaking = true;
                presenter.pause();
                $(description.element).attr('visibility', 'visible');
                $(description.element).css('visibility', presenter.isCurrentlyVisible ? 'visible' : 'hidden');
                speakWithCallback([window.TTSUtils.getTextVoiceObject(description.text,description.langTag)], audioDescriptionEndedCallback);
            } else {
                $(description.element).css('visibility', 'hidden');
                $(description.element).attr('visibility', 'hidden');
            }
        }

        presenter.prevTime = time;

        if (isSpeaking) {
            for (var i = 0; i < presenter.captions.length; i++) {
                var caption = presenter.captions[i];
                $(caption.element).css('visibility', 'hidden');
                $(caption.element).attr('visibility', 'hidden');
            }
        }
        return isSpeaking;
    };

    presenter.reload = function () {
        presenter.showPlayButton();
        presenter.isVideoLoaded = false;
        $(presenter.videoContainer).find('.captions').remove();
        presenter.setVideo();
        presenter.loadSubtitles();
        presenter.loadAudioDescription();
        presenter.setBurgerMenu();
        if (presenter.isVideoSpeedControllerAdded) {
            presenter.resetVideoSpeedController();
        } else {
            presenter.addVideoSpeedController();
        }
        $(presenter.videoObject).unbind('timeupdate');
        $(presenter.videoObject).bind("timeupdate", function () {
            onTimeUpdate(this);
        });
        presenter.removeClassFromView('playing');
        presenter.posterPlayButton.removeClass('video-poster-pause');
    };

    presenter.sendTimeUpdate = function Video_sendTime() {
        var actualVideoTime = parseInt(presenter.videoObject.currentTime, 10);
        if (actualVideoTime !== presenter.lastSentCurrentTime) {
            var formattedTime = presenter.formatTime(actualVideoTime, 10);
            presenter.sendTimeUpdateEvent(formattedTime);
            presenter.lastSentCurrentTime = actualVideoTime;
        }
    };

    function onTimeUpdate(video) {
        if (!presenter.videoObject) return;
        if (!presenter.videoObject.paused) {
            var isSpeaking = presenter.readAudioDescriptions(presenter.videoObject.currentTime);
            if (!isSpeaking) {
                presenter.showCaptions(presenter.videoObject.currentTime);
            }
        }

        presenter.sendTimeUpdate();

        var currentTime = Math.round(video.currentTime * 10) / 10,
            videoDuration = Math.round(video.duration * 10) / 10,
            isFullScreen = document.mozFullScreen || document.webkitIsFullScreen;

        var shouldSetAbleChangeLayout = false;
        if (currentTime >= videoDuration) {
            presenter.sendVideoEndedEvent();
            presenter.showWaterMark();
            presenter.prevTime = -0.001;
            if (document.exitFullscreen && document.fullscreenElement) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            } else if (presenter.configuration.isFullScreen) {
                presenter.configuration.isFullScreen = false;
                presenter.removeScaleFromCaptionsContainer();
                presenter.configuration.defaultControls && presenter.controlBar.showFullscreenButton();
                presenter.closeFullscreen();
                shouldSetAbleChangeLayout = true;

            }

            if (!presenter.configuration.defaultControls) {
                presenter.seek(0); // sets the current time to 0
                presenter.$posterWrapper.show();
                if (presenter.configuration.showPlayButton) {
                    presenter.posterPlayButton.show();
                }
                presenter.videoObject.pause();
            }

            $(presenter.videoObject).on("canplay", function onCanPlay() {
                currentTime = 0;
                presenter.videoObject.currentTime = currentTime;
                presenter.pause();
                $(presenter.videoObject).off("canplay");
            });

            presenter.lastSentCurrentTime = 0;

            if(shouldSetAbleChangeLayout) {
                presenter.playerController.setAbleChangeLayout(true);
            }
        }
    }

    presenter.getState = function () {
        var isPaused = presenter.videoObject.paused;
        return JSON.stringify({
            files: "deprecated",        //Removed from state.
            videoURLS: presenter.addedVideoURLS,
            currentTime: presenter.videoObject.currentTime,
            isCurrentlyVisible: presenter.isCurrentlyVisible,
            isPaused: isPaused,
            currentMovie: presenter.currentMovie,
            areSubtitlesHidden: presenter.areSubtitlesHidden,
            isAudioDescriptionEnabled: presenter.isAudioDescriptionEnabled
        });
    };

    presenter.setState = function (stateString) {
        if (ModelValidationUtils.isStringEmpty(stateString)) {
            return;
        }
        var state = JSON.parse(stateString);
        var currentTime = state.currentTime;

        if (state.videoURLS) {  //This was added later than rest of state
            for (var i in state.videoURLS) {
                if (state.videoURLS.hasOwnProperty(i)) {
                    var element = state.videoURLS[i];
                    presenter._setVideoURL(element.url, element.index);
                }
            }
        }

        presenter.isCurrentlyVisible = state.isCurrentlyVisible;

        if (presenter.isCurrentlyVisible !== (presenter.$view.css('visibility') !== 'hidden')) {
            presenter.setVisibility(presenter.isCurrentlyVisible);
        }

        presenter.currentMovie = state.currentMovie;
        presenter.reload();

        var eventType = presenter.isHLS() ? 'loadedmetadata' : 'canplay';
        $(presenter.videoObject).on(eventType, function onVideoCanPlay() {
            if (presenter.videoObject.currentTime < currentTime) {
                presenter.currentTime = currentTime;
                presenter.videoObject.currentTime = currentTime;
                presenter.startTime = currentTime;
                presenter.videoState = presenter.VIDEO_STATE.PAUSED;
                $(this).off('canplay');
            }

            if (state.areSubtitlesHidden != undefined) {
                if (state.areSubtitlesHidden) {
                    presenter.hideSubtitles();
                } else {
                    presenter.showSubtitles();
                }
            }
        });

        presenter.isAudioDescriptionEnabled = state.isAudioDescriptionEnabled;
    };

    presenter.getIOSVersion = function (userAgent) {
        var match = /CPU OS ([\d_]+) like Mac OS X/.exec(userAgent);
        return match === null ? '' : match[1];
    };

    /**
     * Setting poster for video.
     *
     * Attribute poster is not used because safari wont reload poster while reloading video.
     * @param  {HTMLVideoElement} video
     * @param  {String} posterSource
     */
    presenter.addAttributePoster = presenter.metadataLoadedDecorator(function (video, poster) {
        presenter.$posterWrapper.find("img").remove();
        var $video = $(video);

        if (poster) {
            presenter.$posterWrapper.prepend(poster);

            presenter.calculatePosterSize(video, presenter.configuration.addonSize);

            presenter.$posterWrapper.show();
        } else {
            presenter.$posterWrapper.hide();
            $video.attr('poster', '');
        }
    });

    presenter.calculatePosterSize = presenter.metadataLoadedDecorator(function (video, toSize) {
        var $poster = presenter.$posterWrapper.find("img");

        var calculatedVideoSize = presenter.getVideoSize(toSize, video);

        var left = (toSize.width - calculatedVideoSize.width) / 2;
        var top = (toSize.height - calculatedVideoSize.height) / 2;

        $poster.width(calculatedVideoSize.width);
        $poster.height(calculatedVideoSize.height);
        $poster.css({
            left: left,
            top: top
        });
    });

    presenter.setAltText = function () {
        var files = presenter.configuration.files;
        presenter.$view.find('.video-container-mask').text(files[presenter.currentMovie].AlternativeText);
        presenter.$view.find('.video-container-video').text(files[presenter.currentMovie].AlternativeText);
    };

    presenter.isOnlineResourceOnly = function() {
        for (var i = 0; i < presenter.configuration.files.length; i++) {
            var videoFile = presenter.configuration.files[i];
            var isMP4Local = videoFile["MP4 video"] && videoFile["MP4 video"].trim().indexOf("file:/") == 0;
            var isOggLocal = videoFile["Ogg video"] && videoFile["Ogg video"].trim().indexOf("file:/") == 0;
            var isWebMLocal = videoFile["WebM video"] && videoFile["WebM video"].trim().indexOf("file:/") == 0;
            if (!isMP4Local && !isOggLocal && !isWebMLocal) {
                return true;
            }
            return false;
        }
    };

    presenter.setVideo = function () {
        if (!window.navigator.onLine) {
            isOnlineResourceOnly().then(function (responses){
                setVideo();
            }).catch(function(error){
                presenter.$view.html(presenter.configuration.offlineMessage);
            });
        } else {
            setVideo();
        }
    };

    function isOnlineResourceOnly() {
        let endpointsToFetch = [];
        for (let i = 0; i < presenter.configuration.files.length; i++) {
            const videoFile = presenter.configuration.files[i];
            !!videoFile["MP4 video"] && endpointsToFetch.push(videoFile["MP4 video"].trim());
            !!videoFile["Ogg video"] && endpointsToFetch.push(videoFile["Ogg video"].trim());
            !!videoFile["WebM video"] && endpointsToFetch.push(videoFile["WebM video"].trim());
        }
        return Promise.all(endpointsToFetch.map(function(fetchURL) {
            // method: "Head" - used to check if addon have a connection to video (not for download video)
            // method: "no-cache" - mLibro has a cache. Added to avoid the situation that once there is video and
            //      once there is not, when user is offline. Such behavior would be inconsistent with the documentation.
            return fetch(fetchURL, {method: "Head", cache: "no-cache"});
        }));
    }

    function setVideo() {
        if (presenter.videoObject) {
            $(presenter.videoObject).unbind("ended");
            $(presenter.videoObject).unbind("error");
            $(presenter.videoObject).unbind("canplay");

            presenter.videoObject.pause();
        }

        presenter.videoObject = presenter.videoContainer.find('video')[0];
        if (!presenter.videoObject) return;
        if (presenter.isHLS() && !!presenter.controlBar && !!presenter.controlBar.configuration) {
            presenter.controlBar.configuration.videoObject = presenter.videoObject;
        }
        if (!presenter.videoObject.hasOwnProperty('playing')) {
            Object.defineProperty(presenter.videoObject, 'playing', {
               get: function () {
                   return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2);
               }
            });
        }

        presenter.videoState = presenter.VIDEO_STATE.STOPPED;
        var $video = $(presenter.videoObject);
        var files = presenter.configuration.files;

        presenter.videoContainer.find('source').remove();
        presenter.addAttributePoster($video[0], files[presenter.currentMovie].Poster);

        if (!presenter.isHLS()) presenter.setAltText();
        if (presenter.isPreview) {
            $video.attr('preload', 'none');
        } else {
            $video.attr('preload', presenter.isHLS() ? 'metadata' : 'auto');
            var isNewHLSSourceSet = false;
            for (var vtype in presenter.videoTypes) {
                if (files[presenter.currentMovie][presenter.videoTypes[vtype].name] && (presenter.videoObject.canPlayType(presenter.videoTypes[vtype].type) || presenter.videoTypes[vtype].type == "application/x-mpegURL")) {
                    var source = $('<source>');
                    source.attr('type', presenter.videoTypes[vtype].type);
                    source.attr('src', files[presenter.currentMovie][presenter.videoTypes[vtype].name]);
                    $video.append(source);
                    if (presenter.hlsPlayer != null && !isNewHLSSourceSet) {
                        isNewHLSSourceSet = true;
                        presenter.hlsPlayer.src({
                            'type': presenter.videoTypes[vtype].type,
                            'src': files[presenter.currentMovie][presenter.videoTypes[vtype].name]
                        });
                    }
                }
            }

            // "ended" event doesn't work on Safari
            $(presenter.videoObject).unbind('timeupdate');
            $(presenter.videoObject).bind("timeupdate", function () {
                onTimeUpdate(presenter);
            });

            $(presenter.videoObject).bind("error", function onError() {
                $(this).unbind("error");
                presenter.reload();
                if (presenter.configuration.isFullScreen) {
                    fullScreenChange();
                }
            });

            $(presenter.videoObject).bind("canplay", function onCanPlay() {
                presenter.isVideoLoaded = true;
                presenter.callTasksFromDeferredQueue();

                $(this).unbind("canplay");

                if (presenter.areSubtitlesHidden) {
                    presenter.hideSubtitles();
                } else {
                    presenter.showSubtitles();
                }
            });
            // Android devices have problem with loading content.
            presenter.videoObject.addEventListener("stalled", presenter.onStalledEventHandler, false);
            presenter.videoObject.load();
            presenter.metadadaLoaded = false;

            if (files[presenter.currentMovie]['Loop video']) {
                if (typeof presenter.videoObject.loop == 'boolean') {
                    presenter.videoObject.loop = true;
                } else {
                    $(presenter.videoObject).on('ended', function () {
                        presenter.currentTime = 0;
                        presenter.play();
                    }, false);
                }

                presenter.isAborted = false;

                $(presenter.videoObject).on('abort', function () {
                    presenter.isAborted = true;
                });

                $(presenter.videoObject).on('canplay', function () {
                    if (presenter.isAborted && presenter.playTriggered) {
                        presenter.play();
                    }
                });
            }
        }
    }

    /**
     * Creates DIV element containing caption text.
     *
     * @param caption - used text, top and left properties
     * @return reference do newly created element
     */
    function createCaptionElement(caption, isAudioDescription) {
        const captionElement = document.createElement('div');

        $(captionElement).addClass('captions');
        if(isAudioDescription) {
            $(captionElement).addClass('audio-description');
        }
        $(captionElement).addClass(caption.cssClass);
        const sanitizedText = window.xssUtils.sanitize(caption.text);
        $(captionElement).html(window.TTSUtils.parsePreviewAltText(sanitizedText));
        $(captionElement).css({
            top: caption.top,
            left: caption.left
        });

        $(captionElement).css('visibility', 'hidden');
        $(captionElement).attr('visibility', 'hidden');
        presenter.$captionsContainer.append(captionElement);

        return captionElement;
    }

    presenter.convertLinesToCaptions = function (lines) {
        presenter.captions = [];

        for (var i = 0; i < lines.length; i++) {
            var parts = lines[i].split('|');
            if (parts.length == 6) {
                var caption = {
                    start: parts[0],
                    end: parts[1],
                    top: (StringUtils.endsWith(parts[2], 'px') ? parts[2] : parts[2] + 'px'),
                    left: (StringUtils.endsWith(parts[3], 'px') ? parts[3] : parts[3] + 'px'),
                    cssClass: parts[4],
                    text: parts[5]
                };

                caption.element = createCaptionElement(caption, false);
                presenter.captions.push(caption);

                presenter.captionDivs.push(caption.element);
            }
        }
    };

    presenter.loadSubtitles = function () {
        var subtitlesLoadedDeferred = new $.Deferred(),
            subtitles = presenter.configuration.files[presenter.currentMovie].Subtitles;

        if (subtitles) {
            if (StringUtils.startsWith(subtitles, "/file")) {
                $.get(subtitles, function (data) {
                    subtitlesLoadedDeferred.resolve(data);
                });
            } else {
                subtitlesLoadedDeferred.resolve(subtitles);
            }

            presenter.convertLinesToCaptions(Helpers.splitLines(subtitles));
            $.when(subtitlesLoadedDeferred.promise(), presenter.mathJaxProcessEnded, presenter.pageLoaded).then(function onSubtitlesLoaded(data) {
                presenter.convertLinesToCaptions(Helpers.splitLines(data));
                MathJax.Hub.Queue(["Typeset", MathJax.Hub, presenter.captionDivs])();
            });
        }
    };

    presenter.loadAudioDescription = function () {
        var descriptionsLoadedDeferred = new $.Deferred(),
            descriptions = presenter.configuration.files[presenter.currentMovie].Audiodescription;

        if (descriptions) {
            if (StringUtils.startsWith(descriptions, "/file")) {
                $.get(descriptions, function (data) {
                    descriptionsLoadedDeferred.resolve(data);
                });
            } else {
                descriptionsLoadedDeferred.resolve(descriptions);
            }

            presenter.convertLinesToAudioDescriptions(Helpers.splitLines(descriptions));
            $.when(descriptionsLoadedDeferred.promise(), presenter.mathJaxProcessEnded, presenter.pageLoaded).then(function onDescriptionsLoaded(data) {
                presenter.convertLinesToAudioDescriptions(Helpers.splitLines(data));
                MathJax.Hub.Queue(["Typeset", MathJax.Hub, presenter.descriptionsDivs])();
            });
        }
    };

    presenter.escapeAltText = function(text) {
        function replacer(match, p1, offset, string) {
          return '[' + p1.replace(/\|/g, escapedSeparator) + ']';
        }
        return text.replace(/\[(.*?)\]/g, replacer);
    };
    
    presenter.unescapeAndConvertAltText = function(text) {
        function replacer(match, p1, offset, string) {
          var parts = p1.split(escapedSeparator);
          if (parts.length === 2) {
              return '\\alt{' + parts[0] + '|' + parts[1] + '}';
          }
          if (parts.length === 3) {
              return '\\alt{' + parts[0] + '|' + parts[1] + '}[lang ' + parts[2] + ']';
          }
          return '[' + parts.join('|') + ']';
        }
        return text.replace(/\[(.*?)\]/g, replacer);
    };

    presenter.convertLinesToAudioDescriptions = function (lines) {
        presenter.descriptions = [];

        for (var i = 0; i < lines.length; i++) {
            var line = presenter.escapeAltText(lines[i]);
            var parts = line.split('|');
            if (parts.length == 6) {
                var description = {
                    start: parts[0],
                    top: (StringUtils.endsWith(parts[2], 'px') ? parts[1] : parts[1] + 'px'),
                    left: (StringUtils.endsWith(parts[3], 'px') ? parts[2] : parts[2] + 'px'),
                    cssClass: parts[3],
                    langTag: parts[4],
                    text: presenter.unescapeAndConvertAltText(parts[5])
                };

                description.element = createCaptionElement(description, true);
                presenter.descriptions.push(description);

                presenter.descriptionsDivs.push(description.element);
            }
        }
    };

    presenter.calculateVideoContainerHeight = function ($container, moduleHeight) {
        var borderBottom = $container.css('border-bottom-width'),
            borderTop = $container.css('border-top-width'),
            marginTop = $container.css('margin-top'),
            marginBottom = $container.css('margin-bottom');

        if (ModelValidationUtils.isStringEmpty(borderTop)) borderTop = "0px";
        if (ModelValidationUtils.isStringEmpty(borderBottom)) borderBottom = "0px";
        if (ModelValidationUtils.isStringEmpty(marginTop)) marginTop = "0px";
        if (ModelValidationUtils.isStringEmpty(marginBottom)) marginBottom = "0px";

        return moduleHeight - parseInt(borderBottom, 10) -
            parseInt(borderTop, 10) -
            parseInt(marginTop, 10) -
            parseInt(marginBottom, 10);
    };

    presenter.setDimensions = function () {
        var video = presenter.getVideo();

        presenter.videoContainer.css('height', presenter.calculateVideoContainerHeight(presenter.videoContainer, presenter.configuration.height) + 'px');

        video.css("width", "100%")
            .attr('height', presenter.videoContainer.height());

        presenter.configuration.dimensions = {
            video: {
                width: $(video).width(),
                height: $(video).height()
            },
            container: {
                width: $(presenter.videoContainer).width(),
                height: $(presenter.videoContainer).height()
            }
        };
    };

    presenter.showSubtitles = function () {
        presenter.$view.find('.captions:not(.audio-description)').show();
        presenter.areSubtitlesHidden = false;
    };

    presenter.hideSubtitles = function () {
        presenter.$view.find('.captions:not(.audio-description)').hide();
        presenter.areSubtitlesHidden = true;
    };

    presenter.executeCommand = function (name, params) {
        var commands = {
            'show': presenter.show,
            'hide': presenter.hide,
            'next': presenter.next,
            'previous': presenter.previous,
            'jumpTo': presenter.jumpToCommand,
            'jumpToID': presenter.jumpToIDCommand,
            'seek': presenter.seekCommand,
            'play': presenter.play,
            'stop': presenter.stop,
            'pause': presenter.pause,
            'showSubtitles': presenter.showSubtitles,
            'hideSubtitles': presenter.hideSubtitles,
            'showAudioDescription': presenter.showAudioDescription,
            'hideAudioDescription': presenter.hideAudioDescription,
            'setVideoURL': presenter.setVideoURLCommand
        };

        Commands.dispatch(commands, name, params, presenter);
    };

    presenter.setVideoURLCommand = function (params) {
        presenter.setVideoURL(params[0], params[1]);
    };

    presenter._setVideoURL = function (url, index) {
        var key;
        var videoFile;
        var mapper = {
            "oggFormat": "Ogg video",
            "mp4Format": "MP4 video",
            "webMFormat": "WebM video",
            "poster": "Poster",
            "subtitles": "Subtitles",
            "id": "ID",
            "altText": "AlternativeText",
            "loop": "Loop video"
        };

        if (index >= presenter.configuration.files.length) {
            return false;
        }

        videoFile = presenter.configuration.files[index];

        for (key in mapper) {
            if (mapper.hasOwnProperty(key)) {
                videoFile[mapper[key]] = url[key] || videoFile[mapper[key]];
            }
        }

        presenter.addedVideoURLS[index] = {
            url: url,
            index: index
        };

        return true;
    };

    /*
        Set video url and jump to this video.
        index: video index counted from 0
        url: object {
            "oggFormat": "Ogg video",
            "mp4Format": "MP4 video",
            "webMFormat": "WebM video",
            "poster": "Poster",
            "subtitles": "Subtitles",
            "id": "ID",
            "altText": "AlternativeText",
            "loop": "Loop video"
        }
    */
    presenter.setVideoURL = function (url, index) {
        index = (index || 1) - 1;

        if (presenter._setVideoURL(url, index)) {
            presenter.jumpTo(index + 1);
        }
    };

    presenter.setVisibility = function (isVisible) {
        presenter.$view.css("visibility", isVisible ? "visible" : "hidden");

        var $captions = presenter.$view.find('.captions');
        if (!isVisible) {
            $captions.each(function hideVisibility() {
                $(this).css('visibility', 'hidden');
            });
        } else {
            $captions.each(function showVisibility() {
                if ($(this).attr('visibility') === 'visible') {
                    $(this).css('visibility', 'visible');
                }
            });
        }
    };

    presenter.seek = deferredSyncQueue.decorate(function (seconds) {
        presenter.videoObject.currentTime = seconds;
        if (seconds > presenter.videoObject.duration) {
            presenter.posterPlayButton.removeClass('video-poster-pause');
        }
    });

    presenter.seekFromPercent = function (percent) {
        presenter.seek(presenter.videoObject.duration * (percent / 100));
    };

    presenter.seekCommand = function (params) {
        presenter.seek(params[0]);
    };

    presenter.show = function () {
        if (presenter.isCurrentlyVisible) return;
        if (presenter.VIDEO_STATE.PLAYING == presenter.videoState) {
            presenter.videoObject.play();
        }
        presenter.isCurrentlyVisible = true;
        presenter.setVisibility(true);
    };

    presenter.hide = function () {
        if (!presenter.isCurrentlyVisible) return;

        if (presenter.VIDEO_STATE.PLAYING == presenter.videoState) {
            presenter.videoObject.pause();
            presenter.videoState = presenter.VIDEO_STATE.PLAYING;
            presenter.isHideExecuted = true;
        }
        presenter.isCurrentlyVisible = false;
        presenter.setVisibility(false);
    };

    presenter.jumpTo = function (movieNumber) {
        var newMovie = parseInt(movieNumber, 10) - 1;
        if (0 <= newMovie && newMovie < presenter.configuration.files.length) {
            presenter.currentMovie = newMovie;
            presenter.reload();
        }
    };

    presenter.jumpToCommand = function (params) {
        presenter.jumpTo(params[0]);
    };

    presenter.jumpToID = function (id) {
        for (var i = 0; i < presenter.configuration.files.length; i++) {
            if (id === presenter.configuration.files[i].ID) {
                presenter.jumpTo(i + 1);  // Video numbers are counted from 1 to n
                break;
            }
        }
    };

    presenter.jumpToIDCommand = function (params) {
        presenter.jumpToID(params[0]);
    };

    presenter.onStalledEventHandler = function () {
        var video = this;

        if (video.readyState >= 2) {
            presenter.isVideoLoaded = true;
            presenter.callTasksFromDeferredQueue();
        }
    };

    presenter.callTasksFromDeferredQueue = function () {
        deferredSyncQueue.resolve();
    };

    presenter.removeWaterMark = function () {
        presenter.$view.find('.poster-wrapper').hide();
    };

    presenter.showWaterMark = function () {
        presenter.$view.find(".poster-wrapper").show();
    };

    presenter.loadVideoAtPlayOnMobiles = function () {
        if (MobileUtils.isSafariMobile(navigator.userAgent)) {
            if (!presenter.isVideoLoaded) {
                presenter.videoObject.load();
                presenter.metadadaLoaded = false;
            }
        }
        if (!presenter.isVideoLoaded) {
            presenter.videoObject.load();
            presenter.metadadaLoaded = false;
        }
    };

    presenter.addClassToView = function (className) {
        presenter.$view.addClass(className);
    };

    presenter.removeClassFromView = function (className) {
        presenter.$view.removeClass(className);
    };

    presenter.play = deferredSyncQueue.decorate(function () {
        presenter.removeWaterMark();
        presenter.hidePlayButton();
        presenter.loadVideoAtPlayOnMobiles();
        presenter.videoObject = presenter.videoContainer.find('video')[0];
        if (presenter.videoObject.paused) {
            presenter.videoObject.play();
            presenter.addClassToView('playing');
        }
        presenter.usedStop = false;
        presenter.playTriggered = true;
    });

    presenter.stop = deferredSyncQueue.decorate(function () {
            presenter.showPlayButton();
            presenter.seek(0);
            presenter.prevTime = -0.001;
            presenter.videoObject.pause();
            presenter.usedStop = true;
            if(presenter.descriptions.length > 0){
                setAudioDescriptionDisabled();
            }
            presenter.removeClassFromView('playing');
            presenter.posterPlayButton.removeClass('video-poster-pause');
    });

    presenter.pause = deferredSyncQueue.decorate(function () {
        if (!presenter.videoObject.paused) {
            presenter.posterPlayButton.addClass('video-poster-pause');
            presenter.showPlayButton();
            presenter.videoObject.pause();
            presenter.removeClassFromView('playing');
        }
        presenter.usedStop = false;
    });

    presenter.previous = function () {
        if (presenter.currentMovie > 0) {
            presenter.currentMovie--;
            presenter.reload();
        }
    };

    presenter.next = function () {
        if (presenter.currentMovie < presenter.configuration.files.length - 1) {
            presenter.currentMovie++;
            presenter.reload();
        }
    };

    presenter.setVolume = function (percent) {
        presenter.videoObject.volume = percent / 100;
    };

    presenter.reset = function () {
        presenter.configuration.isVisibleByDefault ? presenter.show() : presenter.hide();
        presenter.videoState = presenter.VIDEO_STATE.STOPPED;
        presenter.videoObject.currentTime = 0;
        presenter.currentMovie = 0;
        if (presenter.metadadaLoaded) {
            presenter.videoObject.pause();
        }

        presenter.reload();

        if (presenter.configuration.shouldHideSubtitles) {
            presenter.hideSubtitles();
        } else {
            presenter.showSubtitles();
        }
    };

    presenter.setPlaybackRate = function (playbackRate) {
        presenter.videoObject.playbackRate = parseFloat(playbackRate);
    }

    presenter.getVideo = function () {
        return presenter.videoContainer.find('video:first');
    };

    function generateTransformDict(scaleX, scaleY) {
        var scale = "scale(" + scaleX + "," + scaleY + ")";
        return {
            'transform': scale,
            '-ms-transform': scale,
            '-webkit-transform': scale,
            '-o-transform': scale,
            '-moz-transform': scale,
            "-webkit-transform-origin": "top left",
            "-ms-transform-origin": "top left",
            "transform-origin": "top left"
        }
    }

    function requestFullscreen($element) {
        var DomElement = $element.get(0);

        var requestMethod = DomElement.requestFullscreen || DomElement.mozRequestFullScreen ||
            DomElement.msRequestFullscreen || DomElement.webkitRequestFullScreen ||
            DomElement.webkitEnterFullscreen || null;
        if (requestMethod) {
            requestMethod.call(DomElement);
        }
        return requestMethod;
    }

    function exitFullscreen() {
        var exitMethod = document.exitFullscreen || document.mozCancelFullScreen ||
            document.msExitFullscreen || document.webkitExitFullscreen || null;

        if (exitMethod) {
            exitMethod.call(document);
        }
    }

    function isVideoInFullscreen() {
        if (document.fullscreenElement
            || document.mozFullScreenElement
            || document.webkitFullscreenElement
            || document.msFullscreenElement
            || document.webkitCurrentFullScreenElement
            || document.fullscreen
            || document.webkitIsFullScreen
            || document.mozFullScreen) {
            return true;
        }

        return false;
    }

    presenter.addTabindex = function (isTabindexEnabled) {
        var value = isTabindexEnabled ? "0" : "-1";
        presenter.videoContainer.attr("tabindex", value);
    };

    presenter.getTextToSpeechOrNull = function (playerController) {
        if (playerController) {
            return playerController.getModule('Text_To_Speech1');
        }

        return null;
    };

    function speak (data) {
        var tts = presenter.getTextToSpeechOrNull(presenter.playerController);
        if (tts && presenter.playerController.isWCAGOn()) {
            tts.speak(data);
        }
    }

    function speakWithCallback (data, callbackFunction) {
        var tts = presenter.getTextToSpeechOrNull(presenter.playerController);
        if (tts) {
            tts.speakWithCallback(data, callbackFunction);
        }
    }

    presenter.isWCAGOn = function(isWCAGOn) {
        //This method has been added to enable the addon's detection by the autofill option of TTS
    };

    return presenter;
}
