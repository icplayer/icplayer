function Addonvideo_create() {
    var presenter = function() {};

    presenter.currentMovie = 0;
    presenter.videoContainer = null;
    presenter.$view = null;
    presenter.files = [];
    presenter.video = null;
    presenter.metadadaLoaded = false;
    presenter.isPreview = false;
    presenter.captions = [];
    presenter.configuration = {};
    presenter.captionDivs = [];
    presenter.areSubtitlesHidden = false;

    var height;
    var sentCurrentTime;

    presenter.upgradeModel = function (model) {
        return presenter.upgradePoster(model);
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

    presenter.ERROR_CODES = {
        'MEDIA_ERR_ABORTED' : 1,
        'MEDIA_ERR_DECODE' : 2,
        'MEDIA_ERR_NETWORK' : 3,
        'MEDIA_ERR_SRC_NOT_SUPPORTED' : [4, 'Ups ! Looks like your browser doesn\'t support this codecs. ' +
            'Go <a href="https://tools.google.com/dlpage/webmmf/" > -here- </a> to download WebM plugin']
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
        { name : 'MP4 video', type : 'video/mp4'},
        { name : 'Ogg video', type : 'video/ogg'},
        { name : 'WebM video', type : 'video/webm'}
    ];

    presenter.VIDEO_STATE = {
        STOPPED: 0,
        PLAYING: 1,
        PAUSED: 2
    };

    function fullScreenChange () {
        presenter.configuration.isFullScreen = document.webkitIsFullScreen == true || document.mozFullScreen == true;
        var top, left, newTop, newLeft, i,
            screenWidth = screen.width,
            screenHeight = screen.height,
            moduleWidth = presenter.$view.width(),
            moduleHeight = presenter.$view.height(),
            videoFSWidth = screenWidth,
            videoFSHeight = parseInt(moduleHeight * screenWidth / moduleWidth),
            scale = videoFSWidth / moduleWidth,
            xProportion = screenWidth / moduleWidth,
            yProportion = screenHeight / moduleHeight,
            offsetX, offsetY, $element, transformation;

        if (yProportion < xProportion) {
            videoFSHeight = screenHeight;
            videoFSWidth = parseInt(moduleWidth * yProportion);
            scale = videoFSWidth / moduleWidth;
        } else {
            videoFSWidth = screenWidth;
            videoFSHeight = parseInt(moduleHeight * xProportion);
            scale = videoFSHeight / moduleHeight;
        }

        offsetX = screenWidth - videoFSWidth;
        offsetY = screenHeight - videoFSHeight;
        scale = Math.round(scale * 100) / 100;
        offsetX = Math.round(offsetX * 100) / 100;
        offsetY = Math.round(offsetY * 100) / 100;

        for (i = 0; i < presenter.captions.length; i++) {
            $element = $(presenter.captions[i].element);

            if (presenter.configuration.isFullScreen) {
                if ($element.attr('oldLeft')) continue;

                top = parseInt($element.css('top'), 10);
                left = parseInt($element.css('left'), 10);

                newTop = parseInt(top * scale, 10);
                newLeft = parseInt(left * scale, 10);

                $element.attr({
                    oldTop: top,
                    oldLeft: left,
                    oldWidth: $element.width(),
                    oldHeight: $element.height()
                });
                transformation = 'scale(' + scale + ')';
                $element.css({
                    '-webkit-transform-origin': 'top left',
                    '-moz-transform-origin': 'top left',
                    '-ms-transform-origin': 'top left',
                    'transform-origin': 'top left',
                    position: 'fixed',
                    zIndex: 9999999999,
                    top: (newTop + offsetY / 2) + 'px',
                    left: (newLeft + offsetX / 2) + 'px',
                    '-moz-transform': transformation,
                    '-webkit-transform': transformation,
                    '-ms-transform': transformation,
                    'transform': transformation
                });
            } else {
                newLeft = $element.attr('oldLeft');
                newTop = $element.attr('oldTop');
                transformation = 'scale(1.0)';
                $element.css({
                    width: $element.attr('oldWidth') + 'px',
                    height: $element.attr('oldHeight') + 'px',
                    top: newTop + 'px',
                    left: newLeft + 'px',
                    position: 'absolute',
                    zIndex: '',
                    '-moz-transform': '',
                    '-webkit-transform': '',
                    '-o-transform': '',
                    '-ms-transform': '',
                    'transform': ''
                });

                $element.removeAttr('oldWidth oldHeight oldTop oldLeft');
            }
        }

        if (!presenter.configuration.isFullScreen) {
            $(presenter.videoContainer).css({
                width: presenter.configuration.dimensions.container.width + 'px',
                height: presenter.configuration.dimensions.container.height + 'px'
            });
            $(presenter.video).css({
                width: presenter.configuration.dimensions.video.width + 'px',
                height: presenter.configuration.dimensions.video.height + 'px'
            })
        }
    }

    presenter.registerFullScreenEventCallbacks = function () {
        document.addEventListener("mozfullscreenchange", fullScreenChange, false);
        this.video.addEventListener("webkitfullscreenchange", fullScreenChange, false);
    };

    presenter.registerHook = function() {
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

        presenter.registerHook();

        presenter.eventBus = controller.getEventBus();
        presenter.eventBus.addEventListener('PageLoaded', this);

        var pageLoadedDeferred = new jQuery.Deferred();
        presenter.pageLoadedDeferred = pageLoadedDeferred;
        presenter.pageLoaded = pageLoadedDeferred.promise();
    };

    presenter.onEventReceived = function (eventName, eventData) {
        presenter.pageLoadedDeferred.resolve();
        if(eventData.value == 'dropdownClicked') {
            this.video.load();
        }
    };

    presenter.createEndedEventData = function (currentVideo) {
        return {
            source: presenter.addonID,
            item: '' + (currentVideo + 1),
            value: 'ended'
        };
    };

    function addonVideo_formatTime (seconds) {
        var minutes = Math.floor(seconds / 60);
        minutes = (minutes >= 10) ? minutes : "0" + minutes;
        seconds = Math.floor(seconds % 60);
        seconds = (seconds >= 10) ? seconds : "0" + seconds;
        return minutes + ":" + seconds;
    }

    presenter.sendTimeUpdate = function Video_sendTimeUpdate(currentTime) {
        var eventData = {
            source: presenter.addonID,
            item: '' + (presenter.currentMovie + 1),
            value : currentTime
        };
        sentCurrentTime = currentTime;
        presenter.eventBus.sendEvent('ValueChanged', eventData);
    }

    presenter.sendVideoEndedEvent = function () {
        var eventData = presenter.createEndedEventData(presenter.currentMovie);
        presenter.eventBus.sendEvent('ValueChanged', eventData);
    };

    presenter.stopPropagationOnClickEvent = function(e) {
        e.stopPropagation();
    };

    presenter.setMetaDataOnMetaDataLoadedEvent = function() {
        presenter.metadadaLoaded = true;
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

    presenter.removeMathJaxHook = function() {
        MathJax.Hub.signal.hooks["End Process"].Remove(presenter.mathJaxHook);
    };

    presenter.destroy = function() {
        presenter.videoView.removeEventListener('DOMNodeRemoved', presenter.destroy);
        presenter.videoObject.removeEventListener('click', presenter.stopPropagationOnClickEvent);
        presenter.videoObject.removeEventListener('loadedmetadata', presenter.setMetaDataOnMetaDataLoadedEvent);
        presenter.videoObject.removeEventListener('play', setVideoStateOnPlayEvent);
        presenter.videoObject.removeEventListener('pause', setVideoStateOnPauseEvent);
        presenter.videoObject.removeEventListener('stalled', presenter.onStalledEventHandler);
        presenter.videoObject.removeEventListener('webkitfullscreenchange', fullScreenChange);
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
        presenter.video = null;
    };
    
    presenter.keyboardController = function(keycode) {

        $(document).on('keydown', function(e) {
            e.preventDefault();
            $(this).off('keydown');
        });

        function increasedVolume() {
        	var val = Math.round((presenter.videoObject.volume + 0.1)*10)/10;
        	
        	return val > 1 ? 1 : val;
        }
        
        function decreasedVolume() {
        	var val = Math.round((presenter.videoObject.volume - 0.1)*10)/10;
        	
        	return val < 0 ? 0 : val;
        }
        
        function forward() {
        	presenter.videoObject.currentTime += 15; 
        }
        
        function backward() {
        	presenter.videoObject.currentTime -= 15; 
        }

        function playPause() {
            if (presenter.video.paused) {
                presenter.play();
            } else {
                presenter.pause();
            }
        }

        function fullScreen() {
            if (presenter.videoObject.requestFullscreen) {
                presenter.videoObject.requestFullscreen();
            } else if (presenter.videoObject.mozRequestFullScreen) {
                presenter.videoObject.mozRequestFullScreen();
            } else if (presenter.videoObject.webkitRequestFullscreen) {
                presenter.videoObject.webkitRequestFullscreen();
            }
        }

        switch(keycode) {
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
                backward();
                break;
            case 39:
                forward();
                break;
            case 27:
                presenter.pause();
                break;
            case 70:
                fullScreen();
                break;
        }
    };

    presenter.run = function(view, model) {
        presenter.commandsQueue = CommandsQueueFactory.create(presenter);
        presenter.isVideoLoaded = false;

        presenter.addonID = model.ID;
        presenter.isVisibleByDefault = ModelValidationUtils.validateBoolean(model["Is Visible"]);
        presenter.isCurrentlyVisible = true;
        presenter.shouldHideSubtitles = ModelValidationUtils.validateBoolean(model["Hide subtitles"]);
        var upgradedModel = this.upgradeModel(model);
        presenter.files = upgradedModel.Files;
        presenter.defaultControls = !ModelValidationUtils.validateBoolean(upgradedModel['Hide default controls']);
        presenter.videoContainer = $(view).find('.video-container:first');
        presenter.$view = $(view);
        presenter.videoState = presenter.VIDEO_STATE.STOPPED;
        height = upgradedModel.Height;
        this.setDimensions();
        presenter.reload();

        if (!presenter.isVisibleByDefault) presenter.hide();

        presenter.video.addEventListener('click', presenter.stopPropagationOnClickEvent);
        presenter.video.addEventListener('error', function() { presenter.handleErrorCode(this.error); }, true);
        presenter.video.addEventListener('loadedmetadata', presenter.setMetaDataOnMetaDataLoadedEvent);
        presenter.video.addEventListener('play', setVideoStateOnPlayEvent);
        presenter.video.addEventListener('pause', setVideoStateOnPauseEvent);
        presenter.video.addEventListener('playing', AddonVideo_onVideoPlaying, false);

        presenter.eventBus.addEventListener('ValueChanged', this);

        presenter.videoObject = this.video;
        presenter.$videoObject = $(this.video);
        presenter.videoView = view;

        presenter.videoView.addEventListener('DOMNodeRemoved', function onDOMNodeRemoved(ev) {
            if (ev.target === this) {
                presenter.destroy();
            }
        });

        if (presenter.shouldHideSubtitles) {
            presenter.hideSubtitles();
        } else {
            presenter.showSubtitles();
        }
    };

    presenter.sendOnPLayingEvent = function () {
        var eventData = {
            'source': presenter.addonID,
            'item': '',
            'value': 'playing',
            'score': ''
        };

        presenter.eventBus.sendEvent('ValueChanged', eventData);
    };

    function AddonVideo_onVideoPlaying () {
        presenter.sendOnPLayingEvent();
    }

    presenter.convertTimeStringToNumber = function(timeString) {
        timeString = timeString.split(':');
        var minutes = parseInt(timeString[0] * 60, 10);
        var seconds = parseInt(timeString[1], 10);
        return { isCorrect: true, value: (minutes + seconds) };
    };

    presenter.handleErrorCode = function(error) {
        if (!error) return;

        presenter.$view.html(presenter.getVideoErrorMessage(error.code));
    };

    presenter.createPreview = function(view, model) {
        this.files = model.Files;
        this.$view = $(view);
        this.videoContainer = $(view).find('.video-container:first');
        height = model.Height;

        this.isPreview = true;
        this.setVideo();

        this.setDimensions();

        presenter.isVisibleByDefault = ModelValidationUtils.validateBoolean(model["Is Visible"]);
        presenter.isCurrentlyVisible = true;
        if (!presenter.isVisibleByDefault) presenter.hide();
    };

    presenter.showCaptions = function(time) {
        if (!presenter.configuration.dimensions) return; // No captions to show when video wasn't loaded properly

        for (var i = 0; i < this.captions.length; i++) {
            var caption = this.captions[i];
            if (caption.start <= time && caption.end >= time) {
                $(caption.element).attr('visibility', 'visible');
                $(caption.element).css('visibility', presenter.isCurrentlyVisible ? 'visible' : 'hidden');

                if (presenter.configuration.isFullScreen && !$(caption.element).attr('oldTop')) {
                    var top = parseInt($(caption.element).css('top'), 10),
                        left = parseInt($(caption.element).css('left'), 10),
                        newTop, newLeft,
                        screenWidth = screen.width,
                        screenHeight = screen.height,
                        moduleWidth = presenter.$view.width(),
                        moduleHeight = presenter.$view.height(),
                        videoFSWidth = screenWidth,
                        videoFSHeight = parseInt(moduleHeight * screenWidth / moduleWidth),
                        scale = videoFSWidth / moduleWidth,
                        offsetX, offsetY, translateX, translateY, transformation;

                    if (videoFSHeight > screenHeight) {
                        videoFSHeight = screenHeight;
                        videoFSWidth = parseInt(moduleWidth * screenHeight / moduleHeight);
                        scale = videoFSWidth / moduleWidth;
                    }

                    offsetX = screenWidth - videoFSWidth;
                    offsetY = screenHeight - videoFSHeight;
                    scale = Math.round(scale * 100) / 100;
                    offsetX = Math.round(offsetX * 100) / 100;
                    offsetY = Math.round(offsetY * 100) / 100;

                    translateX = ($(caption.element).width() / 4) * scale;
                    translateX = Math.round(translateX * 100) / 100;
                    translateY = ($(caption.element).height() / 4) * scale;
                    translateY = Math.round(translateY * 100) / 100;

                    newTop = parseInt(videoFSHeight * (top / moduleHeight), 10);
                    newLeft = parseInt(videoFSWidth * (left / moduleWidth), 10);

                    $(caption.element).attr({
                        oldTop: top,
                        oldLeft: left,
                        oldWidth: $(caption.element).width(),
                        oldHeight: $(caption.element).height()
                    });
                    transformation = 'scale(' + scale + ')';
                    $(caption.element).css({
                        position: 'fixed',
                        zIndex: 9999999999,
                        top: (newTop + offsetY + translateY) + 'px',
                        left: (newLeft + offsetX + translateX) + 'px',
                        'transform': transformation,
                        '-ms-transform': transformation,
                        '-webkit-transform': transformation,
                        '-o-transform': transformation,
                        '-moz-transform': transformation
                    });
                }

            } else {
                $(caption.element).css('visibility', 'hidden');
                $(caption.element).attr('visibility', 'hidden');
            }
        }
    };

    presenter.reload = function() {
        presenter.isVideoLoaded = false;
        $(this.videoContainer).find('.captions').remove();
        this.setVideo();
        this.loadSubtitles();
        $(this.video).unbind('timeupdate');
        $(this.video).bind("timeupdate", function () {
            onTimeUpdate(this);
        });
        presenter.removeClassFromView('playing');
    };

    function onTimeUpdate(video) {
        presenter.showCaptions(presenter.video.currentTime);

        var currentTime = Math.round(video.currentTime * 10) / 10,
            videoDuration = Math.round(video.duration * 10) / 10,
            isFullScreen = document.mozFullScreen || document.webkitIsFullScreen;

        if (currentTime >= videoDuration) {
            presenter.sendVideoEndedEvent();
            presenter.reload();

            if (isFullScreen && document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }

            if (presenter.configuration.isFullScreen) {
                fullScreenChange();
            }
        }
        else {
            var currentMinutesSeconds = addonVideo_formatTime(video.currentTime);
            if(currentMinutesSeconds !== sentCurrentTime) {
                presenter.sendTimeUpdate(currentMinutesSeconds);
            }
        }
    }

    presenter.getState = function() {
        var isPaused = this.video.paused;
        this.video.pause();
        return JSON.stringify({
            currentTime : this.video.currentTime,
            isCurrentlyVisible : this.isCurrentlyVisible,
            isPaused: isPaused,
            currentMovie: this.currentMovie,
            areSubtitlesHidden: presenter.areSubtitlesHidden
        });
    };

    presenter.setState = function(stateString) {
        if (ModelValidationUtils.isStringEmpty(stateString)) return;
        var state = JSON.parse(stateString);
        var currentTime = state.currentTime;
        this.isCurrentlyVisible = state.isCurrentlyVisible;

        if (presenter.isCurrentlyVisible !== (presenter.$view.css('visibility') !== 'hidden')) {
            presenter.setVisibility(this.isCurrentlyVisible);
        }

        this.currentMovie = state.currentMovie;
        this.reload();

        $(this.video).on('canplay', function onVideoCanPlay() {
            if (this.currentTime < currentTime) {
                this.currentTime = currentTime;
                this.startTime = currentTime;
                presenter.videoState = presenter.VIDEO_STATE.PAUSED;
                $(this).off('canplay');
            }

            if(state.areSubtitlesHidden != undefined) {
                if (state.areSubtitlesHidden) {
                    presenter.hideSubtitles();
                } else {
                    presenter.showSubtitles();
                }
            }
        });
    };

    presenter.getIOSVersion = function(userAgent) {
        var match = /CPU OS ([\d_]+) like Mac OS X/.exec(userAgent);
        return match === null ? '' : match[1];
    };

    presenter.addAttributePoster = function(video, posterSource) {
        if (posterSource) {
            if (!MobileUtils.isSafariMobile(navigator.userAgent)) {
                if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1){
                    var tmpVideo = video;
                    video.remove();
                    $(tmpVideo).attr('poster', '');
                    $(tmpVideo).attr('poster', posterSource);
                    presenter.videoContainer.append(tmpVideo);
                }else{
                    video.attr('poster', '');
                    video.attr('poster', posterSource);
                }
                return;
            }

            var video_width = presenter.configuration.dimensions.video.width,
                video_height = presenter.configuration.dimensions.video.height;

            var $poster_wrapper = $('<div>');
            $poster_wrapper.width(video_width);
            $poster_wrapper.height(video_height);
            $poster_wrapper.addClass('poster-wrapper');
            $poster_wrapper.on('click', function onPosterWrapperClick(e) {
                e.stopPropagation();
                $(this).remove();
                video.attr('controls', true);
                presenter.video.play();
            });

            var $poster = $('<img>');
            $poster.attr('src', posterSource);
            $poster.width(video_width);
            $poster.height(video_height);
            $poster_wrapper.append($poster);

            var $playBTN = $('<div>');
            $playBTN.addClass('video-poster-play');
            $playBTN.css({top:(video_height-80)/2, left:(video_width-80)/2});
            $poster_wrapper.append($playBTN);

            video.parent().append($poster_wrapper);

            if (presenter.getIOSVersion(navigator.userAgent) === '8_3') {
                video.attr('controls', true);
            } else {
                // Default video controls should be disabled to enable events on poster
                video.attr('controls', false);
            }
        } else {
            video.attr('poster', '');
            presenter.$view.find('.poster-wrapper').remove();
        }
    };

    presenter.setVideo = function() {
        if (this.video) {
            $(this.video).unbind("ended");
            $(this.video).unbind("error");
            $(this.video).unbind("canplay");

            this.video.pause();
        }
        this.videoContainer.find('source').remove();
        this.video = this.videoContainer.find('video')[0];
        presenter.videoState = presenter.VIDEO_STATE.STOPPED;
        var $video = $(this.video);
        var files = this.files;
        this.addAttributePoster($video, files[this.currentMovie].Poster);
        if (!presenter.defaultControls) {
            $video.removeAttr('controls');
        }
        if (presenter.isPreview) {
            $video.attr('preload', 'none');
        } else {
            $video.attr('preload', 'auto');
            for (var vtype in this.videoTypes) {
                if (files[this.currentMovie][this.videoTypes[vtype].name] && this.video.canPlayType(this.videoTypes[vtype].type)) {
                    var source = $('<source>');
                    source.attr('type', this.videoTypes[vtype].type);
                    source.attr('src', files[this.currentMovie][this.videoTypes[vtype].name]);
                    $video.append(source);
                }
            }

            // "ended" event doesn't work on Safari
            $(this.video).unbind('timeupdate');
            $(this.video).bind("timeupdate", function onTimeUpdate() {
                onTimeUpdate(this);
            });

            $(this.video).bind("error", function onError() {
                $(this).unbind("error");
                presenter.reload();
                if (presenter.configuration.isFullScreen) {
                    fullScreenChange();
                }
            });

            $(this.video).bind("canplay", function onCanPlay() {
                presenter.isVideoLoaded = true;

                if (!presenter.commandsQueue.isQueueEmpty()) {
                    presenter.commandsQueue.executeAllTasks();
                }

                $(this).unbind("canplay");

                if (presenter.areSubtitlesHidden) {
                    presenter.hideSubtitles();
                } else {
                    presenter.showSubtitles();
                }
            });

            // Android devices have problem with loading content.
            this.video.addEventListener("stalled", presenter.onStalledEventHandler, false);
            this.video.load();

            if(ModelValidationUtils.validateBoolean(files[this.currentMovie]['Loop video'])) {
                if (typeof this.video.loop == 'boolean') {
                    this.video.loop = true;
                } else {
                    $(this.video).on('ended', function () {
                        this.currentTime = 0;
                        this.play();
                    }, false);
                }

                presenter.isAborted = false;

                $(this.video).on('abort', function() {
                    presenter.isAborted = true;
                });

                $(this.video).on('canplay', function() {
                    if(presenter.isAborted) {
                        this.play();
                    }
                });
            }
        }
    };

    /**
     * Creates DIV element containing caption text.
     *
     * @param caption - used text, top and left properties
     * @return reference do newly created element
     */
    function createCaptionElement(caption) {
        var captionElement = document.createElement('div');

        $(captionElement).addClass('captions');
        $(captionElement).addClass(caption.cssClass);
        $(captionElement).html(caption.text);
        $(captionElement).css({
            top: caption.top,
            left: caption.left
        });

        $(captionElement).css('visibility', 'hidden');
        $(captionElement).attr('visibility', 'hidden');
        presenter.videoContainer.append(captionElement);

        return captionElement;
    }

    presenter.convertLinesToCaptions = function(lines) {
        this.captions = [];

        for (var i = 0; i < lines.length; i++) {
            var parts = lines[i].split('|');
            if (parts.length == 6) {
                var caption = {
                    start:parts[0],
                    end:parts[1],
                    top:(StringUtils.endsWith(parts[2], 'px') ? parts[2] : parts[2] + 'px'),
                    left:(StringUtils.endsWith(parts[3], 'px') ? parts[3] : parts[3] + 'px'),
                    cssClass:parts[4],
                    text:parts[5]
                };

                caption.element = createCaptionElement(caption);
                this.captions.push(caption);

                presenter.captionDivs.push(caption.element);
            }
        }

        presenter.registerFullScreenEventCallbacks();
    };

    presenter.loadSubtitles = function() {
        var subtitlesLoadedDeferred = new $.Deferred(),
            subtitles = this.files[this.currentMovie].Subtitles;

        if (subtitles) {
            if (StringUtils.startsWith(subtitles, "/file")) {
                $.get(subtitles, function(data) {
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

    presenter.setDimensions = function() {
        var video = this.getVideo();

        this.videoContainer.css('height',  presenter.calculateVideoContainerHeight(this.videoContainer, height) + 'px');

        video.css("width", "100%")
             .attr('height', this.videoContainer.height());

        presenter.configuration.dimensions = {
            video:{
                width:$(video).width(),
                height:$(video).height()
            },
            container:{
                width:$(presenter.videoContainer).width(),
                height:$(presenter.videoContainer).height()
            }
        };
    };

    presenter.showSubtitles = function () {
        presenter.$view.find('.captions').show();
        presenter.areSubtitlesHidden = false;
    };

    presenter.hideSubtitles = function () {
        presenter.$view.find('.captions').hide();
        presenter.areSubtitlesHidden = true;
    };

    presenter.executeCommand = function(name, params) {
        var commands = {
            'show': presenter.show,
            'hide': presenter.hide,
            'next': presenter.next,
            'previous': presenter.previous,
            'jumpTo': presenter.jumpToCommand,
            'jumpToID': presenter.jumpToIDCommand,
            'seek': presenter.seekCommand,
            'play' : presenter.play,
            'stop' : presenter.stop,
            'showSubtitles' : presenter.showSubtitles,
            'hideSubtitles' : presenter.hideSubtitles
        };

        Commands.dispatch(commands, name, params, presenter);
    };

    presenter.setVisibility = function(isVisible) {
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

    presenter.seek = function (seconds) {
        if (!presenter.isVideoLoaded) {
            presenter.commandsQueue.addTask('seek', [seconds]);
            return;
        }

        this.video.currentTime = seconds;
    };

    presenter.seekCommand = function(params) {
        presenter.seek(params[0]);
    };

    presenter.show = function() {
        if (presenter.isCurrentlyVisible) return;
        if(presenter.VIDEO_STATE.PLAYING == presenter.videoState) {
            this.video.play();
        }
        this.isCurrentlyVisible = true;
        presenter.setVisibility(true);
    };

    presenter.hide = function() {
        if (!presenter.isCurrentlyVisible) return;

        if (presenter.VIDEO_STATE.PLAYING == presenter.videoState) {
            this.video.pause();
            presenter.videoState = presenter.VIDEO_STATE.PLAYING;
            presenter.isHideExecuted = true;
        }
        this.isCurrentlyVisible = false;
        presenter.setVisibility(false);
    };

    presenter.jumpTo = function(movieNumber) {
        var newMovie = parseInt(movieNumber, 10) - 1;
        if (0 <= newMovie && newMovie < this.files.length) {
            this.currentMovie = newMovie;
            this.reload();
        }
    };

    presenter.jumpToCommand = function (params) {
        presenter.jumpTo(params[0]);
    };

    presenter.jumpToID = function(id) {
        for (var i = 0; i < this.files.length; i++) {
            if (id === this.files[i].ID) {
                this.jumpTo(i + 1);  // Video numbers are counted from 1 to n
                break;
            }
        }
    };

    presenter.jumpToIDCommand = function (params) {
        presenter.jumpToID(params[0]);
    };

    presenter.onStalledEventHandler = function () {
        var video = this;

        if (!presenter.commandsQueue.isQueueEmpty() && video.readyState >= 2) {
            presenter.isVideoLoaded = true;
            presenter.commandsQueue.executeAllTasks();
        }
    };

    presenter.removeWaterMark = function () {
        presenter.$view.find('.poster-wrapper').remove();
    };

    presenter.loadVideoAtPlayOnMobiles = function () {
        if (MobileUtils.isSafariMobile(navigator.userAgent)) {
            if(!presenter.isVideoLoaded) {
                this.video.load();
            }
        }
    };

    presenter.addClassToView = function (className) {
        presenter.$view.addClass(className);
    };

    presenter.removeClassFromView = function (className) {
        presenter.$view.removeClass(className);
    };

    presenter.play = function () {
        presenter.removeWaterMark();

        presenter.loadVideoAtPlayOnMobiles();

        if (!presenter.isVideoLoaded) {
            presenter.commandsQueue.addTask('play', []);
            return;
        }

        if (this.video.paused) {
            this.video.play();
            presenter.addClassToView('playing');
        }
    };

    presenter.stop = function () {
        if (!presenter.isVideoLoaded) {
            presenter.commandsQueue.addTask('stop', []);
            return;
        }

        if (!this.video.paused) {
            presenter.seek(0); // sets the current time to 0
            this.video.pause();
            presenter.removeClassFromView('playing');
        }
    };

    presenter.pause = function () {
        if (!presenter.isVideoLoaded) {
            presenter.commandsQueue.addTask('pause', []);
            return;
        }

        if (!this.video.paused) {
            this.video.pause();
            presenter.removeClassFromView('playing');
        }
    };

    presenter.previous = function() {
        if (this.currentMovie > 0) {
            this.currentMovie--;
            this.reload();
        }
    };

    presenter.next = function() {
        if (this.currentMovie < this.files.length - 1) {
            this.currentMovie++;
            this.reload();
        }
    };

    presenter.reset = function() {
        presenter.isVisibleByDefault ? presenter.show() : presenter.hide();
        presenter.videoState = presenter.VIDEO_STATE.STOPPED;

        this.currentMovie = 0;
        if (this.metadadaLoaded) {
            this.video.pause();
        }

        presenter.reload();

        if (presenter.shouldHideSubtitles) {
            presenter.hideSubtitles();
        } else {
            presenter.showSubtitles();
        }
    };

    presenter.getVideo = function() {
        return this.videoContainer.find('video:first');
    };

    /**
     * Validates string representation of integer. Only positive integer values are allowed. If both (value and default) are
     * undefined then isError property is set to true.
     */
    presenter.validatePositiveInteger = function (value, defaultValue) {
        var isValueDefined = value !== undefined && value !== "";
        var isDefaultDefined = defaultValue !== undefined && !isNaN(defaultValue);

        if (!isValueDefined && !isDefaultDefined) {
            return {
                isError: true,
                value: 1
            };
        }

        if (!isValueDefined && isDefaultDefined) {
            return {
                isError: false,
                value: defaultValue
            };
        }

        var parsedValue = parseInt(value, 10);
        if (isNaN(parsedValue) || parsedValue < 1) {
            return {
                isError: true,
                value: defaultValue
            };
        }

        return {
            isError: false,
            value: parsedValue
        };
    };

    return presenter;
}