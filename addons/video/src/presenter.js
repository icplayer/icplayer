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
    presenter.showTime = { isCorrect: false, value: null };
    presenter.configuration = {};

    var height;

    presenter.upgradeModel = function (model) {
        return presenter.upgradeShowTime(presenter.upgradePoster(model));
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

    presenter.upgradeShowTime = function (model) {
        var upgradedModel = {};
        $.extend(true, upgradedModel, model); // Deep copy of model object
        if(!upgradedModel["Show time"]) {
            upgradedModel["Show time"] = "";
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

        return errorMessage += ' Please refresh page.';
    };

    presenter.videoTypes = {
        'Ogg video' : 'video/ogg',
        'WebM video' : 'video/webm',
        'MP4 video' : 'video/mp4'
    };

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
            offsetX, offsetY, element, translateX, translateY, transformation;

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

        for (i = 0; i < presenter.captions.length; i++) {
            element = presenter.captions[i].element;

            if (presenter.configuration.isFullScreen) {
                if ($(element).attr('oldLeft')) continue;

                top = parseInt($(element).css('top'), 10);
                left = parseInt($(element).css('left'), 10);
                translateX = ($(element).width() / 4) * scale;
                translateX = Math.round(translateX * 100) / 100;
                translateY = ($(element).height() / 4) * scale;
                translateY = Math.round(translateY * 100) / 100;

                newTop = parseInt(videoFSHeight * (top / moduleHeight), 10);
                newLeft = parseInt(videoFSWidth * (left / moduleWidth), 10);

                $(element).attr({
                    oldTop: top,
                    oldLeft: left,
                    oldWidth: $(element).width(),
                    oldHeight: $(element).height()
                });
                transformation = 'scale(' + scale + ')';
                $(element).css({
                    position: 'fixed',
                    zIndex: 9999999999,
                    top: (newTop + offsetY + translateY) + 'px',
                    left: (newLeft + offsetX + translateX) + 'px',
                    '-moz-transform': transformation,
                    '-webkit-transform': transformation,
                    '-o-transform': transformation,
                    '-ms-transform': transformation,
                    'transform': transformation
                });
            } else {
                newLeft = $(element).attr('oldLeft');
                newTop = $(element).attr('oldTop');
                transformation = 'scale(1.0)';
                $(element).css({
                    width: $(element).attr('oldWidth') + 'px',
                    height: $(element).attr('oldHeight') + 'px',
                    top: newTop + 'px',
                    left: newLeft + 'px',
                    position: 'absolute',
                    zIndex: '',
                    '-moz-transform': transformation,
                    '-webkit-transform': transformation,
                    '-o-transform': transformation,
                    '-ms-transform': transformation,
                    'transform': transformation
                });

                $(element).removeAttr('oldWidth oldHeight oldTop oldLeft');
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

    presenter.setPlayerController = function (controller) {
        var mathJaxDeferred = new jQuery.Deferred();
        presenter.mathJaxProcessEndedDeferred = mathJaxDeferred;
        presenter.mathJaxProcessEnded = mathJaxDeferred.promise();

        MathJax.Hub.Register.MessageHook("End Process", function (message) {
            if ($(message[1]).hasClass('ic_page')) {
                presenter.mathJaxProcessEndedDeferred.resolve();
            }
        });

        var eventBus = controller.getEventBus();
        eventBus.addEventListener('PageLoaded', this);

        var pageLoadedDeferred = new jQuery.Deferred();
        presenter.pageLoadedDeferred = pageLoadedDeferred;
        presenter.pageLoaded = pageLoadedDeferred.promise();
    };

    presenter.onEventReceived = function () {
        presenter.pageLoadedDeferred.resolve();
    };

    presenter.run = function(view, model){
        presenter.isVisibleByDefault = ModelValidationUtils.validateBoolean(model["Is Visible"]);
        presenter.isCurrentlyVisible = true;
        var upgradedModel = this.upgradeModel(model);
        presenter.files = upgradedModel.Files;
        presenter.videoContainer = $(view).find('.video-container:first');
        presenter.$view = $(view);
        presenter.videoState = presenter.VIDEO_STATE.STOPPED;
        height = upgradedModel.Height;
        this.setDimensions();
        this.reload();

        if (!presenter.isVisibleByDefault) presenter.hide();

        this.video.addEventListener('error', function() { presenter.handleErrorCode(this.error); }, true);
        this.video.addEventListener('loadedmetadata', function() { presenter.metadadaLoaded = true; }, false);
        this.video.addEventListener('play', function() {presenter.videoState = presenter.VIDEO_STATE.PLAYING; }, false);
        this.video.addEventListener('pause', function() {
            if (!presenter.isHideExecuted) {
                presenter.videoState = presenter.VIDEO_STATE.PAUSED;
            }
            delete presenter.isHideExecuted;
        }, false);
    };

    presenter.setShowTime = function(timeString) {
        var validatedTime = this.validateShowTimeString(timeString);
        if(validatedTime.isCorrect) {
            this.showTime = this.convertTimeStringToNumber(validatedTime.value);
        }
    };

    presenter.convertTimeStringToNumber = function(timeString) {
        timeString = timeString.split(':');
        var minutes = parseInt(timeString[0] * 60, 10);
        var seconds = parseInt(timeString[1], 10);
        return { isCorrect: true, value: (minutes + seconds) };
    };

    presenter.handleErrorCode = function(error) {
        if(!error) return;

        presenter.$view.html(presenter.getVideoErrorMessage(error.code));
    };

    presenter.createPreview = function(view, model){
        presenter.setShowTime(model['Show time']);
        var showVideo = presenter.validatePositiveInteger(model["Show video"], 1);
        this.files = model.Files;
        this.$view = $(view);
        this.videoContainer = $(view).find('.video-container:first');
        height = model.Height;

        if(this.showTime.isCorrect && !showVideo.isError) {
            this.isPreview = false;
            presenter.jumpTo(showVideo.value);
            this.setVideo();
            $(this.video).bind('canplay', function() {
                this.startTime = presenter.showTime.value;
                this.currentTime = presenter.showTime.value;
                this.play();
                this.pause();
                $(this).unbind('canplay');
                presenter.showCaptions(presenter.showTime.value);
            });
        } else {
            this.isPreview = true;
            this.setVideo();
        }

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
                $.when(presenter.pageLoaded, presenter.mathJaxProcessEnded).then(function () {
                    updateLaTeX(caption.element);
                });

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
                        '-moz-transform': transformation,
                        '-webkit-transform': transformation,
                        '-o-transform': transformation,
                        '-ms-transform': transformation,
                        'transform': transformation
                    });
                }

            } else {
                $(caption.element).css('visibility', 'hidden');
                $(caption.element).attr('visibility', 'hidden');
            }
        }
    };

    function updateLaTeX(text) {
        MathJax.CallBack.Queue().Push(function () { MathJax.Hub.Typeset(text); });
    }

    presenter.reload = function() {
        $(this.videoContainer).find('.captions').remove();
        this.setVideo();
        this.loadSubtitles();
        this.video.addEventListener("timeupdate", function() {
            presenter.showCaptions(presenter.video.currentTime);
        });
    };

    presenter.getState = function() {
        var isPaused = this.video.paused;
        this.video.pause();
        return JSON.stringify({
            currentTime : this.video.currentTime,
            isCurrentlyVisible : this.isCurrentlyVisible,
            isPaused: isPaused,
            currentMovie: this.currentMovie
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

        $(this.video).on('canplay', function() {
            if(this.currentTime < currentTime){
                this.currentTime = currentTime;
                this.startTime = currentTime;
                presenter.videoState = presenter.VIDEO_STATE.PAUSED;
                $(this).off('canplay');
            }
        });
    };

    presenter.addAttributePoster = function(video, posterSource) {
        video.attr('poster', posterSource ? posterSource : '');
    };

    presenter.setVideo = function() {
        if (this.video) {
            this.video.pause();
        }
        this.videoContainer.find('source').remove();
        this.video = this.videoContainer.find('video')[0];
        presenter.videoState = presenter.VIDEO_STATE.STOPPED;
        var $video = $(this.video);
        var files = this.files;
        this.addAttributePoster($video, files[this.currentMovie].Poster);
        if(presenter.isPreview) {
            $video.attr('preload', 'none');
        } else {
            $video.attr('preload', 'auto');
            for (var vtype in this.videoTypes) {
                if (!this.videoTypes.hasOwnProperty(vtype)) continue;

                if (files[this.currentMovie][vtype] && this.video.canPlayType(this.videoTypes[vtype])) {
                    var source = $('<source>');
                    source.attr('type', this.videoTypes[vtype]);
                    source.attr('src', files[this.currentMovie][vtype]);
                    $video.append(source);
                }
            }
            this.video.load();
            $(this.video).bind("ended error", function() {
                $(this).unbind("ended error");
                presenter.reload();
                if (presenter.configuration.isFullScreen) {
                    fullScreenChange();
                }
            });
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
        function endsWith(str, suffix) {
            return str.indexOf(suffix, str.length - suffix.length) !== -1;
        }

        this.captions = [];

        for (var i = 0; i < lines.length; i++) {
            var parts = lines[i].split('|');
            if (parts.length == 6) {
                var caption = {
                    start:parts[0],
                    end:parts[1],
                    top:(endsWith(parts[2], 'px') ? parts[2] : parts[2] + 'px'),
                    left:(endsWith(parts[3], 'px') ? parts[3] : parts[3] + 'px'),
                    cssClass:parts[4],
                    text:parts[5]
                };

                caption.element = createCaptionElement(caption);
                this.captions.push(caption);
            }
        }

        presenter.registerFullScreenEventCallbacks();
    };

    presenter.loadSubtitles = function() {
        function startsWith(baseString, startString) {
            return (baseString.match("^"+startString)==startString);
        }
        var subtitles = this.files[this.currentMovie].Subtitles;
        if (subtitles) {
            var lines = [];
            var captions = {};
            if (startsWith(subtitles, "/file")) {
                $.get(subtitles, function(data) {
                    lines = presenter.splitLines(data);
                    presenter.convertLinesToCaptions(lines);
                    captions = $(presenter.videoContainer[0]).find(".captions").html();
                    $.when(presenter.pageLoaded, presenter.mathJaxProcessEnded).then(function () {
                        MathJax.Hub.Queue(["Typeset", MathJax.Hub, captions])();
                    });
                });
            } else {
                lines = presenter.splitLines(subtitles);
                presenter.convertLinesToCaptions(lines);
                captions = $(presenter.videoContainer[0]).find(".captions").html();
                $.when(presenter.pageLoaded, presenter.mathJaxProcessEnded).then(function () {
                    MathJax.Hub.Queue(["Typeset", MathJax.Hub, captions])();
                });
            }
        }
    };

    presenter.splitLines = function(data) {
        return data.split(/[\n\r]+/);
    };

    presenter.setDimensions = function() {
        var video = this.getVideo();
        var a = (height - parseInt(this.videoContainer.css('border-bottom-width'), 10) -
            parseInt(this.videoContainer.css('border-top-width'), 10) -
            parseInt(this.videoContainer.css('margin-top'), 10) -
            parseInt(this.videoContainer.css('margin-bottom'), 10));
        this.videoContainer.css('height',  a + 'px');
        video.css("width", "100%");
        video.attr('height', this.videoContainer.height());

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

    presenter.seek = function (seconds) {
        this.video.currentTime = seconds;
    };

    presenter.seekCommand = function(params) {
        presenter.seek(params[0]);
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
            'stop' : presenter.stop
        };

        Commands.dispatch(commands, name, params, presenter);
    };

    presenter.setVisibility = function(isVisible) {
        presenter.$view.css("visibility", isVisible ? "visible" : "hidden");

        var $captions = presenter.$view.find('.captions');
        if (!isVisible) {
            $captions.each(function () {
                $(this).css('visibility', 'hidden');
            });
        } else {
            $captions.each(function () {
                if ($(this).attr('visibility') === 'visible') {
                    $(this).css('visibility', 'visible');
                }
            });
        }
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

        if(presenter.VIDEO_STATE.PLAYING == presenter.videoState) {
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

    presenter.play = function () {
        if (this.video.paused) this.video.play();
    };

    presenter.stop = function () {
        if (!this.video.paused) {
            presenter.seek(0); // sets the current time to 0
            this.video.pause();
        }
    };

    presenter.pause = function () {
        if (!this.video.paused) {
            this.video.pause();
        }
    };

    presenter.jumpToIDCommand = function (params) {
        presenter.jumpToID(params[0]);
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

    presenter.validateShowTimeString = function(timeString) {
        if(!timeString) {
            return { isCorrect: false, value: null };
        }

        var splittedTime = timeString.split(':');

        if(splittedTime[0] > 60 || splittedTime[1] > 60) {
            return { isCorrect: false, value: null };
        }

        if(/\d{2}:\d{2}$/g.test(timeString)) { // matches i.e. '10:15', '12:20'
            return { isCorrect: true, value: timeString };
        }

        return { isCorrect: false, value: null };
    };

    return presenter;
}