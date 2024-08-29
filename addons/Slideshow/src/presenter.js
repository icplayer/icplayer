function AddonSlideshow_create() {

    var presenter = function() {};

    presenter.isPlaying = false;
    presenter.eventBus = null;
    presenter.noAudioPlayer = null;

    var isWCAGOn = false;
    presenter.isSpeaking = false;

    var DOMElements = {};
    var loadedImagesDeferred = $.Deferred(),
        loadedAudioDeferred = $.Deferred(),
        loadedTextDeferred = $.Deferred();

    var deferredSyncQueue = window.DecoratorUtils.DeferredSyncQueue(deferredQueueDecoratorChecker);

    presenter.configuration = {};

    presenter.ERROR_CODES = {
        'A_01': "At least one audio format file must be uploaded!",
        'A_02': "Your browser does not support HTML5 audio or none of Addon media types!",
        'A_03': "Your browser does not support MP3 media type. Please try to use file in OGG format.",
        'A_04': "Your browser does not support OGG media type. Please try to use file in MP3 format.",
        'S_01': "Each slide must have Image property set properly!",
        'S_02': "Slide start time in not in proper format ('MM:SS')!",
        'S_03': "Slide start times should be consecutive!",
        'T_01': "Text value cannot be empty!",
        'T_02': "Text start time in not in proper format ('MM:SS')!",
        'T_03': "Text end time in not in proper format ('MM:SS')!",
        'T_04': "Text end time must be higher than start time!",
        'T_05': "Top position value is invalid!",
        'T_06': "Left position value is invalid!",
        'T_07': "If more than one text is set, each one of them have to be set properly!",
        'N_01': "If 'no audio' is checked, presentation duration must be a positive number.",
        'ID_01': "Base width and height must be either positive integers or empty"
    };

    presenter.TIME_LINE_TASK = {
        TYPE:{
            SLIDE:0,
            TEXT:1
        },
        TASK:{
            SHOW:2,
            HIDE:3
        }
    };

    presenter.AUDIO_STATE = {
        PLAY: 0,
        PAUSE: 1,
        STOP: 2,
        NONE: 3,
        STOP_FROM_NAVIGATION: 4
    };

    presenter.checkBackgroundImageOfButtonElements = function(buttons) {
        var pattern = /url(.)/;
        $.each(buttons, function() {
            var background = $(this).css("background-image");
            var isBackgroundSet = pattern.test(background);
            if(isBackgroundSet) {
                $(this).html("");
            }
        });
    };

    function deferredQueueDecoratorChecker() {
        return presenter.configuration.audioLoadComplete;
    }

    function setElementsDimensions(width, height) {
        var container = DOMElements.viewContainer.find('.slideshow-container:first')[0];
        var containerDimensions = DOMOperationsUtils.getOuterDimensions(container);
        var containerDistances = DOMOperationsUtils.calculateOuterDistances(containerDimensions);

        var controlsContainer = DOMElements.viewContainer.find('.slideshow-controls-container:first')[0];
        var controlsContainerDimensions = DOMOperationsUtils.getOuterDimensions(controlsContainer);
        var controlsContainerDistances = DOMOperationsUtils.calculateOuterDistances(controlsContainerDimensions);

        presenter.configuration.slideDimensions = {
            width:width - containerDistances.horizontal,
            height:height - $(controlsContainer).height() - containerDistances.vertical - controlsContainerDistances.vertical
        };

        $(controlsContainer).css({
            width:width - controlsContainerDistances.horizontal
        });

        $(container).css({
            width:presenter.configuration.slideDimensions.width,
            height:presenter.configuration.slideDimensions.height
        });

        //adjust base dimensions
        if (presenter.configuration.baseDimensions.width > 0) {
            presenter.configuration.baseDimensions.width -= containerDistances.horizontal;
        }
        if (presenter.configuration.baseDimensions.height > 0) {
            presenter.configuration.baseDimensions.height -= ($(controlsContainer).height() + containerDistances.vertical + controlsContainerDistances.vertical);
        }
    }

    function adjustProgressBar() {
        var progressbar = $(DOMElements.controls.progressbar);

        if (presenter.configuration.hideProgressbar) {
            $(progressbar).hide();

            return;
        }

        var progressbarDimensions = DOMOperationsUtils.getOuterDimensions(progressbar);
        var progressbarDistances = DOMOperationsUtils.calculateOuterDistances(progressbarDimensions);

        var line = $(DOMElements.controls.line);
        var lineDimensions = DOMOperationsUtils.getOuterDimensions(line);
        var lineDistances = DOMOperationsUtils.calculateOuterDistances(lineDimensions);

        var controlsSpareWidth = $(DOMElements.controls.container).width();
        controlsSpareWidth -= $(DOMElements.controls.timer).outerWidth(true);
        controlsSpareWidth -= getControlButtonsDOMElements().play.outerWidth(true);
        controlsSpareWidth -= getControlButtonsDOMElements().stop.outerWidth(true);
        if (presenter.configuration.groupNextAndPrevious) {
            controlsSpareWidth -= $(getControlButtonsDOMElements().previous).parent().outerWidth(true);
        } else {
            controlsSpareWidth -= getControlButtonsDOMElements().previous.outerWidth(true);
            controlsSpareWidth -= getControlButtonsDOMElements().next.outerWidth(true);
        }
        controlsSpareWidth -= progressbarDistances.horizontal;

        var sliderOuterWidth = $(DOMElements.controls.slider).outerWidth(true);
        presenter.configuration.sliderSlideAreaLength = controlsSpareWidth - sliderOuterWidth;

        $(progressbar).css('width', controlsSpareWidth + 'px');
        $(line).css({
            width:(controlsSpareWidth - lineDistances.horizontal) + 'px'
        });
    }

    function updateProgressBar(time) {
        if (!presenter.configuration.buzzAudio) {
            return;
        }

        if (time === undefined) {
            time = presenter.configuration.buzzAudio.getTime();
        }
        var percentage = time / presenter.configuration.buzzAudio.getDuration();
        $(DOMElements.controls.slider).css('left', (percentage * presenter.configuration.sliderSlideAreaLength) + 'px');
    }

    function loadAudio(isPreview) {
        if (presenter.configuration.noAudio) {
            presenter.configuration.buzzAudio = new buzz.sound([]);
            presenter.configuration.audioLoadComplete = true;
            loadedAudioDeferred.resolve();
            return {isError: false};
        }

        if (!buzz.isSupported()) {
            return { isError: true, errorCode: "A_01" };
        }

        if (!buzz.isMP3Supported() && !buzz.isOGGSupported()) {
            return { isError: true, errorCode: "A_02" };
        }

        if (presenter.configuration.audio.MP3 && !buzz.isMP3Supported() && buzz.isOGGSupported() && !presenter.configuration.audio.OGG) {
            return { isError: true, errorCode: "A_03" };
        } else if (presenter.configuration.audio.OGG && !buzz.isOGGSupported() && buzz.isMP3Supported() && !presenter.configuration.audio.MP3) {
            return { isError: true, errorCode: "A_04" };
        }

        if (!isPreview) {
            showLoadingScreen("Loading audio file...");
        }

        buzz.defaults.autoplay = false;
        buzz.defaults.loop = false;

        if (presenter.configuration.audio.MP3 && buzz.isMP3Supported()) {
            presenter.configuration.buzzAudio = new buzz.sound([
                presenter.configuration.audio.MP3
            ]);
        } else if (presenter.configuration.audio.OGG && buzz.isOGGSupported()) {
            presenter.configuration.buzzAudio = new buzz.sound([
                presenter.configuration.audio.OGG
            ]);
        }

        presenter.configuration.buzzAudio.bind("error", function () {
            var errorMessage = "Error occurred while loading/playing audio.";

            if (this.getErrorMessage()) {
                errorMessage += " Reason: " + this.getErrorMessage();
            }

            DOMElements.viewContainer.html(errorMessage + " Please try again.");
        });

        presenter.configuration.buzzAudio.bind("loadedmetadata", function () {
            var duration = buzz.toTimer(presenter.configuration.buzzAudio.getDuration(), false);
            presenter.configuration.audioDurationSet = presenter.configuration.buzzAudio.getDuration() !== '--';
            $(DOMElements.controls.duration).text(duration);
        });

        presenter.configuration.buzzAudio.bind("canplay", function () {
            presenter.configuration.audioLoadComplete = true;
            loadedAudioDeferred.resolve();
        });

        presenter.configuration.currentTime = 0;
        presenter.configuration.audioState = presenter.AUDIO_STATE.NONE;

        return {
            isError:false
        };
    }

    function updateSlideCounter(index) {
        var timeText = (index + 1) + '/' + presenter.configuration.slides.count;
        DOMElements.controls.counter.text(timeText);
    }

    function executeTasks(time, withoutAnimation) {
        var isTextAnimation = presenter.configuration.textAnimation && !withoutAnimation;
        var isSlideAnimation = presenter.configuration.slideAnimation && !withoutAnimation;

        if (presenter.configuration.timeLine[time]) {
            for (var i = 0; i < presenter.configuration.timeLine[time].length; i++) {
                var type = presenter.configuration.timeLine[time][i].type;
                var index = presenter.configuration.timeLine[time][i].index;

                switch (type) {
                    case presenter.TIME_LINE_TASK.TYPE.SLIDE:
                        var showIndex = time !== 0 ? index : 0;

                        for (var j = 0; j < presenter.configuration.slides.domReferences.length; j++) {
                            var $slideElement = $(presenter.configuration.slides.domReferences[j]);
                            if (j === showIndex) {
                                updateSlideCounter(j);
                                if (isSlideAnimation) {
                                    $slideElement.show("fade", {}, 2000);
                                } else {
                                    $slideElement.show();
                                }
                            } else {
                                if (isSlideAnimation) {
                                    $slideElement.hide("fade", {}, 2000);
                                } else {
                                    $slideElement.hide();
                                }
                            }
                        }
                        if (presenter.isPlaying) {
                            presenter.readSlide(index, true);
                        }
                        setButtonActive(presenter.NAVIGATION_BUTTON.PREVIOUS);
                        setButtonActive(presenter.NAVIGATION_BUTTON.NEXT);

                        if (showIndex === 0) { // first
                            setButtonInactive(presenter.NAVIGATION_BUTTON.PREVIOUS);
                        } else if (showIndex === presenter.configuration.slides.count-1) { // last
                            setButtonInactive(presenter.NAVIGATION_BUTTON.NEXT);
                        }

                        break;
                    case presenter.TIME_LINE_TASK.TYPE.TEXT:
                        var show = presenter.configuration.timeLine[time][i].task === presenter.TIME_LINE_TASK.TASK.SHOW,
                            $textElement = $(presenter.configuration.texts.domReferences[index]);
                        if (show) {
                            if (isTextAnimation) {
                                $textElement.css({'opacity': '1'}).effect('slide', {}, 500);
                            } else {
                                $textElement.css('opacity', '1');
                            }
                        } else {
                            if (isTextAnimation) {
                                $textElement.animate({'opacity': '0'}, {}, 500);
                            } else {
                                $textElement.css('opacity', '0');
                            }
                        }

                        break;
                }
            }
        }
    }

    presenter.pauseAudioResource = function () {
        presenter.isPlaying = false;
        if (presenter.configuration.noAudio) {
            presenter.pauseNoAudioPlayer();
        } else {
            if (presenter.configuration.audio.wasPlayed) {
                try {
                    presenter.configuration.buzzAudio.pause();
                } catch (exception) {
                }  //There can ba DOMException, if audio was player but was still buffering
            }
        }
    };

    presenter.playAudioResource = function () {
        presenter.isPlaying = true;
        if (presenter.configuration.noAudio) {
            presenter.configuration.audio.wasPlayed = true;
            presenter.startNoAudioPlayer();
        } else {
            presenter.configuration.audio.wasPlayed = true;
            var nopromise = {
                catch: new Function()
            };

            (presenter.configuration.buzzAudio.get().play() || nopromise).catch(function () {
            }); //There can ba DOMException, if audio was player but was still buffering
        }
    };

    presenter.startNoAudioPlayer = function() {
        presenter.noAudioPlayer = setInterval(noAudioPlay,1000);
    };

    presenter.pauseNoAudioPlayer = function() {
        clearInterval(presenter.noAudioPlayer);
        presenter.noAudioPlayer = null;
    };


    function noAudioPlay() {
        var time = presenter.time + 1;
        if (time > presenter.configuration.maxTime) {
            onPresentationEnd();
            return;
        }
        executeTasks(time, false);
        presenter.configuration.currentTime = time;
        presenter.time = time;

    }

    function timeUpdateCallback() {
        if (presenter.configuration.audioState !== presenter.AUDIO_STATE.STOP) {
            updateProgressBar();
        }

        var parsedTime = parseInt(buzz.fromTimer(presenter.configuration.buzzAudio.getTime()), 10);
        var timeChanged = false;

        if (presenter.configuration.currentTime !== parsedTime) {
            timeChanged = true;
            var time = buzz.toTimer(presenter.configuration.buzzAudio.getTime(), false);
            presenter.configuration.currentTime = parsedTime;
            $(DOMElements.controls.currentTime).text(time);
        }

        if (presenter.configuration.buzzAudio.getTime() + 0.3 > presenter.configuration.buzzAudio.getDuration()) {
            onPresentationEnd();
            return;
        }

        if (!timeChanged) {
            return; // We want to execute tasks with an accuracy of full seconds only
        }

        executeTasks(presenter.configuration.currentTime, false);
    }

    function onPresentationEnd() {
        presenter.time = 0;
        $(DOMElements.controls.currentTime).text('00:00');
        changeButtonToPlay();
        updateProgressBar(0);
        presenter.configuration.currentTime = 0;
        presenter.pauseAudioResource();
        if (presenter.configuration.audioState == presenter.AUDIO_STATE.STOP || presenter.configuration.noAudio) {
            presenter.sendValueChangedEvent("end");
        }
        presenter.configuration.audioState = presenter.AUDIO_STATE.STOP;
        hideAllTexts();
        // This action will trigger time update callback, but it's the only way to assure that pressing play after end/stop will trigger playing audio
        executeTasks(0, true);
    }

    function getContainerPadding() {
        var topOffset = parseInt(DOMElements.container.css('paddingTop'), 10);
        var bottomOffset = parseInt(DOMElements.container.css('paddingBottom'), 10);
        var leftOffset = parseInt(DOMElements.container.css('paddingLeft'), 10);
        var rightOffset = parseInt(DOMElements.container.css('paddingRight'), 10);

        return { topOffset:topOffset, bottomOffset:bottomOffset, leftOffset:leftOffset, rightOffset:rightOffset };
    }

    function loadSlides(width, height, isPreview) {
        showLoadingScreen("Loading slides...");
        var containerPadding = getContainerPadding();

        var images = [];
        for (var i = 0; i < presenter.configuration.slides.count; i++) {
            images.push(presenter.configuration.slides.content[i].image);
        }

        $.imgpreload(images, {
            each:function () {
                var index = -1;

                for (var j = 0; j < presenter.configuration.slides.count; j++) {
                    if (presenter.configuration.slides.content[j].image === $(this).attr('src')) {
                        index = j;
                        break;
                    }
                }

                var slide = document.createElement('div');

                $(slide).addClass('slideshow-container-slide');
                $(slide).css({
                    width: width + 'px',
                    height: height + 'px',
                    backgroundImage: 'url(' + $(this).attr('src') + ')',
                    top: containerPadding.topOffset + 'px',
                    left: containerPadding.leftOffset + 'px'
                });

                if (!presenter.configuration.slides.domReferences || !$.isArray(presenter.configuration.slides.domReferences)) {
                    presenter.configuration.slides.domReferences = [];
                }

                presenter.configuration.slides.domReferences[index] = slide;
            },
            all:function () {
                $(DOMElements.container).html();

                for (var i = 0; i < presenter.configuration.slides.count; i++) {
                    $(DOMElements.container).append(presenter.configuration.slides.domReferences[i]);
                }

                presenter.configuration.isDomReferenceArrayComplete = true;
                $(presenter.configuration.slides.domReferences[0]).show();

                setButtonInactive(presenter.NAVIGATION_BUTTON.PREVIOUS);
                if (presenter.configuration.slides.count === 1) {
                    setButtonInactive(presenter.NAVIGATION_BUTTON.NEXT);
                }

                if (!isPreview) {
                    handleMouseActions();
                    handleMouseHovering();
                    presenter.configuration.buzzAudio.bind("timeupdate", timeUpdateCallback);
                }
                var slideNumber = isPreview ? presenter.configuration.showSlide - 1 : 0;
                presenter.goToSlide(slideNumber, true);
                loadedTextDeferred.resolve();

                if (presenter.configuration.savedState) {
                    $(DOMElements.viewContainer).trigger("onLoadSlidesEnd", [presenter.configuration.savedState]);
                }
                loadedImagesDeferred.resolve();
            }
        });

    }

    function loadTexts() {
        showLoadingScreen("Loading text labels...");

        if (!presenter.configuration.texts.domReferences || !$.isArray(presenter.configuration.texts.domReferences)) {
            presenter.configuration.texts.domReferences = [];
        }
        var scaleX = 1.0;
        var scaleY = 1.0;

        if (presenter.configuration.baseDimensions.width != 0) {
            scaleX = presenter.configuration.slideDimensions.width / presenter.configuration.baseDimensions.width;
        }
        if (presenter.configuration.baseDimensions.height != 0) {
            scaleY = presenter.configuration.slideDimensions.height / presenter.configuration.baseDimensions.height;
        }


        for (var i = 0; i < presenter.configuration.texts.count; i++) {
            var text = presenter.configuration.texts.content[i];
            var textElement = document.createElement('span');
            $(textElement).addClass('slideshow-container-text');
            $(textElement).html(text.text);
            $(textElement).css({
                top:text.top * scaleY + 'px',
                left:text.left * scaleX + 'px'
            });
            if (scaleX != 1.0 || scaleY != 1.0) {
            $(textElement).css(generateTransformDict(scaleX,scaleY));
            }
            presenter.configuration.texts.domReferences[i] = textElement;
            $(DOMElements.container).append(textElement);
        }

        loadedTextDeferred.resolve();
    }

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

    function hideAllTexts() {
        for (var i = 0; i < presenter.configuration.texts.domReferences.length; i++) {
            $(presenter.configuration.texts.domReferences[i]).css('opacity', '0');
        }
    }

    function stopAllAnimations() {
        for (var i = 0; i < presenter.configuration.texts.domReferences.length; i++) {
            $(presenter.configuration.texts.domReferences[i]).stop(true, true);
        }

        for (var i = 0; i < presenter.configuration.slides.domReferences.length; i++) {
            $(presenter.configuration.slides.domReferences[i]).stop(true, true);
        }

        if (presenter.noAudioPlayer) {
            presenter.pauseNoAudioPlayer();
        }
    }

    presenter.stopPresentation = function() {
        $(DOMElements.controls.currentTime).text('00:00');
        updateProgressBar(0);
        presenter.configuration.audioState = presenter.AUDIO_STATE.STOP;
        presenter.sendValueChangedEvent("stop");
        presenter.pauseAudioResource();
        stopAllAnimations();
        hideAllTexts();
        executeTasks(0, true);
        changeButtonToPlay();
        presenter.time = 0;
    };

    // Returns currently displayed index. If none slide is visible then this function returns -1
    presenter.getCurrentSlideIndex = function () {
        stopAllAnimations();
        for (var i = 0; i < presenter.configuration.slides.domReferences.length; i++) {
            if ($(presenter.configuration.slides.domReferences[i]).is(":visible")) {
                return i;
            }
        }

        return -1;
    };

    presenter.setTimeFromSlideIndex = function (slideIndex) {
        if (presenter.configuration.noAudio) {
            return;
        }
        var slide = presenter.configuration.slides.content[slideIndex];
        var time = slide.start;
        presenter.configuration.buzzAudio.setTime(time);
    };

    function goToNextSlide(withoutAnimation) {
        var currentSlideIndex = presenter.getCurrentSlideIndex();

        if (currentSlideIndex < presenter.configuration.slides.count - 1) {
            var index = currentSlideIndex + 1;
            presenter.goToSlide(index, withoutAnimation);
            presenter.setTimeFromSlideIndex(index);
        }
    }

    function goToPreviousSlide(withoutAnimation) {
        var currentSlideIndex = presenter.getCurrentSlideIndex();

        if (currentSlideIndex > 0) {
            var index = currentSlideIndex - 1;
            presenter.goToSlide(index, withoutAnimation);
            presenter.setTimeFromSlideIndex(index);
        }
    }

    presenter.goToSlide = function (index, withoutAnimation) {
        presenter.configuration.audioState = presenter.AUDIO_STATE.STOP_FROM_NAVIGATION;
        hideAllTexts();
        var slide = presenter.configuration.slides.content[index];
        var time = slide.start;
        executeTasks(time, withoutAnimation);
        $(DOMElements.controls.currentTime).text(buzz.toTimer(time, false));

        var activeTexts = presenter.findActiveTexts(presenter.configuration.timeLine, time);
        for (var i = 0; i < activeTexts.length; i++) {
            var textIndex = activeTexts[i];
            $(presenter.configuration.texts.domReferences[textIndex]).css('opacity', '1');
        }

        updateProgressBar(time);
        presenter.configuration.currentTime = time;
        presenter.time = time;

        if (index > 0) {
            setButtonActive(presenter.NAVIGATION_BUTTON.PREVIOUS);
        } else {
            setButtonInactive(presenter.NAVIGATION_BUTTON.PREVIOUS);
        }

        if (index < presenter.configuration.slides.count - 1) {
            setButtonActive(presenter.NAVIGATION_BUTTON.NEXT);
        } else {
            setButtonInactive(presenter.NAVIGATION_BUTTON.NEXT);
        }
    };

    presenter.switchSlideShowStopToPlay = function () {
        updateProgressBar(0);
        presenter.configuration.currentTime = 0;
        if (presenter.configuration.audio.wasPlayed) {
            presenter.configuration.buzzAudio.set('currentTime', 0.1);
        }
        presenter.playAudioResource();
        presenter.configuration.audioState = presenter.AUDIO_STATE.PLAY;
        presenter.sendValueChangedEvent("playing");
        changeButtonToPause();
    };

     presenter.switchSlideShowPlayToPause = function () {
        presenter.pauseAudioResource();
        presenter.configuration.audioState = presenter.AUDIO_STATE.PAUSE;
        presenter.sendValueChangedEvent("pause");
        changeButtonToPlay();
    };

    presenter.switchSlideShowPauseToPlay = function () {
        presenter.configuration.audioState = presenter.AUDIO_STATE.PLAY;
        presenter.sendValueChangedEvent("playing");
        presenter.playAudioResource();
        changeButtonToPause();
    };

    presenter.switchSlideShowToPlay = function () {
        presenter.sendValueChangedEvent("playing");
        if (presenter.isPlaying) {
            presenter.pauseAudioResource();
            presenter.configuration.audioState = presenter.AUDIO_STATE.PAUSE;
            changeButtonToPlay();
        } else {
            presenter.playAudioAction();
        }
    };

    presenter.playAudioAction = function () {
        presenter.configuration.buzzAudio.setTime(presenter.time);
        updateProgressBar(presenter.time);
        presenter.configuration.currentTime = presenter.time;
        presenter.playAudioResource();
        changeButtonToPause();
    };

    var playButtonClickHandler = deferredSyncQueue.decorate(function playButtonClickHandler(event) {
        event.stopPropagation();

        switch (presenter.configuration.audioState) {
            case presenter.AUDIO_STATE.PLAY:
                presenter.switchSlideShowPlayToPause();
                break;
            case presenter.AUDIO_STATE.NONE:
            case presenter.AUDIO_STATE.PAUSE:
                presenter.switchSlideShowPauseToPlay();
                break;
            case presenter.AUDIO_STATE.STOP:
                presenter.switchSlideShowStopToPlay();
                break;
            case presenter.AUDIO_STATE.STOP_FROM_NAVIGATION:
                presenter.switchSlideShowToPlay();
                break;
        }
    });

    var stopButtonClickHandler = deferredSyncQueue.decorate(function stopButtonClickHandler(e) {
        e.stopPropagation();
        presenter.stopPresentation();
    });

    var previousButtonClickHandler = deferredSyncQueue.decorate(function previousButtonClickHandler(e) {

        e.stopPropagation();

        var isActive = $(this).hasClass('slideshow-controls-previous') || $(this).hasClass('slideshow-controls-previous-mouse-hover');
        if (isActive) {
            goToPreviousSlide(false);
            presenter.configuration.audioState = presenter.AUDIO_STATE.STOP_FROM_NAVIGATION;
        }
    });

    var nextButtonClickHandler = deferredSyncQueue.decorate(function nextButtonClickHandler(e) {
        e.stopPropagation();
        var isActive = $(this).hasClass('slideshow-controls-next') || $(this).hasClass('slideshow-controls-next-mouse-hover');
        if (isActive) {
            goToNextSlide(false);
            presenter.configuration.audioState = presenter.AUDIO_STATE.STOP_FROM_NAVIGATION;
        }
    });

    function getCurrentIndex(element) {
        return $(element).index() - presenter.configuration.texts.count;
    }

    function mouseDownCallback(eventData) {
        //if (presenter.AUDIO_STATE.PLAY === presenter.configuration.audioState) return;

        var currentIndex = getCurrentIndex(eventData.target), $slide;
        var containerPadding = getContainerPadding();
        presenter.configuration.mouseData.isMouseDown = true;
        presenter.configuration.mouseData.oldPosition.x = eventData.pageX;
        presenter.configuration.mouseData.oldPosition.y = eventData.pageY;
        presenter.configuration.mouseData.$imageElement = $(eventData.target);

        // Previous slide
        $slide = DOMElements.container.find('.slideshow-container-slide:eq(' + (currentIndex - 1) + ')');
        $slide.css({
            left: (-1 * presenter.configuration.slideDimensions.width + containerPadding.leftOffset) + 'px',
            top: containerPadding.topOffset + 'px',
            display: 'block'
        });

        // Next slide
        $slide = DOMElements.container.find('.slideshow-container-slide:eq(' + (currentIndex + 1) + ')');
        $slide.css({
            left:(presenter.configuration.slideDimensions.width + containerPadding.leftOffset) + 'px',
            top: containerPadding.topOffset + 'px',
            display:'block'
        });

    }

    function touchStartCallback(event) {
        event.preventDefault();
        event.stopPropagation();

        var touch = event.touches[0] || event.changedTouches[0];
        mouseDownCallback(touch);
    }

    function cleanMouseData() {
        presenter.configuration.mouseData = {
            isMouseDown:false,
            oldPosition:{
                x:0,
                y:0
            },
            isMouseDragged:false
        };
    }

    function restoreTextsPositions() {
        for (var i = 0; i < presenter.configuration.texts.count; i++) {
            var text = presenter.configuration.texts.content[i];
            var textElement = presenter.configuration.texts.domReferences[i];
            $(textElement).css({
                top: text.top + 'px',
                left: text.left + 'px'
            });
        }
    }

    function mouseUpCallback () {
        //if (presenter.AUDIO_STATE.PLAY === presenter.configuration.audioState) return;

        presenter.configuration.mouseData.isMouseDown = false;
        var leftOffset = getContainerPadding().leftOffset,
            width = presenter.configuration.slideDimensions.width,
            left = parseInt(presenter.configuration.mouseData.$imageElement.css('left'), 10),
            isMoreThan30Percent = Math.abs(left - leftOffset) > (width / 10) * 3,
            animationTime = (Math.abs(left - leftOffset) / width) * 750,
            currentIndex = getCurrentIndex(presenter.configuration.mouseData.$imageElement), $previousSlide, $nextSlide;

        $previousSlide = DOMElements.container.find('.slideshow-container-slide:eq(' + (currentIndex - 1) + ')');
        $nextSlide = DOMElements.container.find('.slideshow-container-slide:eq(' + (currentIndex + 1) + ')');

        function restoreCurrentView () {
            presenter.configuration.mouseData.$imageElement.animate({
                'left': leftOffset + 'px'
            }, animationTime, "linear", function () {
                cleanMouseData();
            });

            $previousSlide.animate(
                { 'left': (-1 * presenter.configuration.slideDimensions.width + leftOffset) + 'px' },
                animationTime, "linear",
                function () { $previousSlide.hide(); $(this).css('left', leftOffset); }
            );
            $nextSlide.animate(
                { 'left': (presenter.configuration.slideDimensions.width + leftOffset) + 'px' },
                animationTime, "linear",
                function () { $nextSlide.hide(); $(this).css('left', leftOffset); }
            );

        }

        if (isMoreThan30Percent) {
            if (left < 0) {
                if (currentIndex + 1 >= presenter.configuration.slides.count) {
                    restoreCurrentView();
                } else {
                    presenter.configuration.mouseData.$imageElement.animate({
                        'left': (-1 * width + leftOffset) + 'px'
                    }, animationTime, "linear", function () {
                        presenter.configuration.mouseData.$imageElement.hide();
                        presenter.configuration.mouseData.$imageElement.css('left', leftOffset + 'px');
                        presenter.goToSlide(currentIndex + 1, true);
                        presenter.setTimeFromSlideIndex(currentIndex + 1);
                        cleanMouseData();
                    });

                    $nextSlide.animate({
                        'left': leftOffset + 'px'
                    }, animationTime, "linear", function () {
                        $previousSlide.hide();
                        $previousSlide.css('left', leftOffset + 'px');
                    });
                }
            } else {
                if (currentIndex - 1 < 0) {
                    presenter.configuration.mouseData.$imageElement.animate({
                        'left': leftOffset + 'px'
                    }, animationTime, "linear", function () {
                        cleanMouseData();
                    });
                    $previousSlide.animate(
                        { 'left': (-1 * presenter.configuration.slideDimensions.width + leftOffset) + 'px' },
                        animationTime, "linear",
                        function () { $previousSlide.hide(); }
                    );
                    $nextSlide.animate(
                        { 'left': (presenter.configuration.slideDimensions.width + leftOffset) + 'px' },
                        animationTime, "linear",
                        function () { $nextSlide.hide(); }
                    );
                } else {
                    presenter.configuration.mouseData.$imageElement.animate({
                        'left': (width + leftOffset) + 'px'
                    }, animationTime, "linear", function () {
                        presenter.configuration.mouseData.$imageElement.hide();
                        presenter.configuration.mouseData.$imageElement.css('left', leftOffset + 'px');
                        presenter.goToSlide(currentIndex - 1, true);
                        presenter.setTimeFromSlideIndex(currentIndex - 1);
                        cleanMouseData();
                    });

                    $previousSlide.animate({
                        'left': leftOffset + 'px'
                    }, animationTime, "linear", function () {
                        $nextSlide.hide();
                        $nextSlide.css('left', leftOffset + 'px');
                    });
                }
            }
        } else {
            restoreCurrentView();
        }
        restoreTextsPositions();
    }

    function touchEndCallback (event) {
        event.preventDefault();
        event.stopPropagation();

        mouseUpCallback();
    }

    function mouseMoveCallback (eventData) {
        //if (presenter.AUDIO_STATE.PLAY === presenter.configuration.audioState) return;
        if (presenter.configuration.mouseData.isMouseDown !== true) return;

        var imageElement = $(eventData.target);
        presenter.configuration.mouseData.isMouseDragged = true;
        var left = parseInt($(imageElement).css('left'), 10);
        var distance = eventData.pageX - presenter.configuration.mouseData.oldPosition.x;
        var currentIndex = getCurrentIndex(presenter.configuration.mouseData.$imageElement), $slide;

        presenter.configuration.mouseData.oldPosition.x = eventData.pageX;

        // Current slide
        $(imageElement).css('left', (left + distance) + 'px');

        // Previous slide
        $slide = DOMElements.container.find('.slideshow-container-slide:eq(' + (currentIndex - 1) + ')');
        $slide.css('left', (parseInt($slide.css('left'), 10) + distance) + 'px');

        // Next slide
        $slide = DOMElements.container.find('.slideshow-container-slide:eq(' + (currentIndex + 1) + ')');
        $slide.css('left', (parseInt($slide.css('left'), 10) + distance) + 'px');

        DOMElements.container.find('.slideshow-container-text:visible').each(function () {
            var thisLeft = parseInt($(this).css('left'), 10);
            $(this).css('left', (thisLeft + distance) + 'px');
        });
    }

    function touchMoveCallback (event) {
        event.preventDefault();
        event.stopPropagation();

        var touch = event.touches[0] || event.changedTouches[0];
        mouseMoveCallback(touch);
    }

    function mouseClickCallback() {
        //if (presenter.AUDIO_STATE.PLAY === presenter.configuration.audioState) return;

        if (presenter.configuration.mouseData.isMouseDragged) {
            presenter.configuration.mouseData.isMouseDragged = false;
        }

        return false;
    }

    function handleMouseActions() {
        if (MobileUtils.isMobileUserAgent(navigator.userAgent)) {
            getControlButtonsDOMElements().play.on('touchend', playButtonClickHandler);
            getControlButtonsDOMElements().stop.on('touchend', stopButtonClickHandler);
            getControlButtonsDOMElements().previous.on('touchend', previousButtonClickHandler);
            getControlButtonsDOMElements().next.on('touchend', nextButtonClickHandler);
        } else {
            getControlButtonsDOMElements().play.click(playButtonClickHandler);
            getControlButtonsDOMElements().stop.click(stopButtonClickHandler);
            getControlButtonsDOMElements().previous.click(previousButtonClickHandler);
            getControlButtonsDOMElements().next.click(nextButtonClickHandler);
        }

        DOMElements.container.find('.slideshow-container-slide').each(function() {
            if (MobileUtils.isMobileUserAgent(navigator.userAgent)) {
                this.ontouchstart = touchStartCallback;
                this.ontouchend = touchEndCallback;
                this.ontouchmove = touchMoveCallback;
            } else {
                $(this).mousedown(mouseDownCallback);
                $(this).mouseup(mouseUpCallback);
                $(this).mousemove(mouseMoveCallback);
            }
        });

        if (MobileUtils.isMobileUserAgent(navigator.userAgent)) {
            $(DOMElements.container.find('.slideshow-container-slide')).on('touchend', mouseClickCallback);
        } else {
            $(DOMElements.container.find('.slideshow-container-slide')).click(mouseClickCallback);
        }
    }

    function changeButtonToPlay() {
        var button = getControlButtonsDOMElements().play;
        var buttonClassName = $(button).attr('class');
        var isHover = buttonClassName.indexOf('-mouse-hover', buttonClassName.length - '-mouse-hover'.length) !== -1;

        $(button).attr('class', isHover ? 'slideshow-controls-play-mouse-hover' : 'slideshow-controls-play');
        $(button).text('Play');
        presenter.checkBackgroundImageOfButtonElements([button]);
        if (presenter.configuration.slides.count < 2) {
            setButtonInactive(presenter.NAVIGATION_BUTTON.PREVIOUS);
            setButtonInactive(presenter.NAVIGATION_BUTTON.NEXT);
        } else {
            var currentSlideIndex = presenter.getCurrentSlideIndex();

            if (currentSlideIndex < presenter.configuration.slides.count - 1) {
                setButtonActive(presenter.NAVIGATION_BUTTON.NEXT);
            } else {
                setButtonInactive(presenter.NAVIGATION_BUTTON.NEXT);
            }

            if (currentSlideIndex > 0) {
                setButtonActive(presenter.NAVIGATION_BUTTON.PREVIOUS);
            } else {
                setButtonInactive(presenter.NAVIGATION_BUTTON.PREVIOUS);
            }
        }
    }

    function changeButtonToPause() {
        var button = getControlButtonsDOMElements().play;
        var buttonClassName = $(button).attr('class');
        var isHover = buttonClassName.indexOf('-mouse-hover', buttonClassName.length - '-mouse-hover'.length) !== -1;

        $(button).attr('class', isHover ? 'slideshow-controls-play-pause-mouse-hover' : 'slideshow-controls-play-pause');
        $(button).text('Pause');
        presenter.checkBackgroundImageOfButtonElements([button]);
    }

    presenter.NAVIGATION_BUTTON = {
        PREVIOUS:0,
        NEXT:1
    };

    function setButtonActive(whichButton) {
        var button = whichButton === presenter.NAVIGATION_BUTTON.PREVIOUS ? getControlButtonsDOMElements().previous : getControlButtonsDOMElements().next;
        var buttonClassName = $(button).attr('class');
        var isHover = buttonClassName.indexOf('-mouse-hover', buttonClassName.length - '-mouse-hover'.length) !== -1;

        if (whichButton === presenter.NAVIGATION_BUTTON.PREVIOUS) {
            $(button).attr('class', isHover ? 'slideshow-controls-previous-mouse-hover' : 'slideshow-controls-previous');
        } else {
            $(button).attr('class', isHover ? 'slideshow-controls-next-mouse-hover' : 'slideshow-controls-next');
        }
    }

    function setButtonInactive(whichButton) {
        var button = whichButton === presenter.NAVIGATION_BUTTON.PREVIOUS ? getControlButtonsDOMElements().previous : getControlButtonsDOMElements().next;
        var buttonClassName = $(button).attr('class');
        var isHover = buttonClassName.indexOf('-mouse-hover', buttonClassName.length - '-mouse-hover'.length) !== -1;

        if (whichButton === presenter.NAVIGATION_BUTTON.PREVIOUS) {
            $(button).attr('class', isHover ? 'slideshow-controls-previous-inactive-mouse-hover' : 'slideshow-controls-previous-inactive');
        } else {
            $(button).attr('class', isHover ? 'slideshow-controls-next-inactive-mouse-hover' : 'slideshow-controls-next-inactive');
        }
    }

    function handleMouseHovering() {
        getControlButtonsDOMElements().stop.hover(
            function () { // Hover in
                $(this).attr('class', 'slideshow-controls-stop-mouse-hover');
            },
            function () { // Hover out
                $(this).attr('class', 'slideshow-controls-stop');
            }
        );

        getControlButtonsDOMElements().play.hover(
            function () { // Hover in
                var isPlayButton = $(this).hasClass('slideshow-controls-play') || $(this).hasClass('slideshow-controls-play-mouse-hover');

                $(this).attr('class', isPlayButton ? 'slideshow-controls-play-mouse-hover' : 'slideshow-controls-play-pause-mouse-hover');
            },
            function () { // Hover out
                var isPlayButton = $(this).hasClass('slideshow-controls-play') || $(this).hasClass('slideshow-controls-play-mouse-hover');

                $(this).attr('class', isPlayButton ? 'slideshow-controls-play' : 'slideshow-controls-play-pause');
            }
        );

        getControlButtonsDOMElements().previous.hover(
            function () { // Hover in
                var isInactive = $(this).hasClass('slideshow-controls-previous-inactive') || $(this).hasClass('slideshow-controls-previous-inactive-mouse-hover');

                $(this).attr('class', isInactive ? 'slideshow-controls-previous-inactive-mouse-hover' : 'slideshow-controls-previous-mouse-hover');
            }, function () { // Hover out
                var isInactive = $(this).hasClass('slideshow-controls-previous-inactive') || $(this).hasClass('slideshow-controls-previous-inactive-mouse-hover');

                $(this).attr('class', isInactive ? 'slideshow-controls-previous-inactive' : 'slideshow-controls-previous');
            }
        );

        getControlButtonsDOMElements().next.hover(
            function () { // Hover in
                var isInactive = $(this).hasClass('slideshow-controls-next-inactive') || $(this).hasClass('slideshow-controls-next-inactive-mouse-hover');

                $(this).attr('class', isInactive ? 'slideshow-controls-next-inactive-mouse-hover' : 'slideshow-controls-next-mouse-hover');
            }, function () { // Hover out
                var isInactive = $(this).hasClass('slideshow-controls-next-inactive') || $(this).hasClass('slideshow-controls-next-inactive-mouse-hover');

                $(this).attr('class', isInactive ? 'slideshow-controls-next-inactive' : 'slideshow-controls-next');
            }
        );
    }

    // Finds active texts in time line for given time and returns an array of theirs indexes.
    // Active texts in some time is a task that has been displayed before given time and weren't hidden.
    presenter.findActiveTexts = function (timeLine, time) {
        var activeTasks = [];
        var i, j, type, index, show, indexOfElement;

        for (i = 0; i < time; i++) {
            if (timeLine[i]) {
                for (j = 0; j < timeLine[i].length; j++) {
                    type = timeLine[i][j].type;
                    index = timeLine[i][j].index;

                    if (type === presenter.TIME_LINE_TASK.TYPE.TEXT) {
                        show = timeLine[i][j].task === presenter.TIME_LINE_TASK.TASK.SHOW;

                        if (show) {
                            activeTasks.push(index);
                        } else {
                            indexOfElement = activeTasks.indexOf(index);
                            if (indexOfElement !== -1) {
                                activeTasks.splice(indexOfElement, 1);
                            }
                        }
                    }
                }
            }
        }

        // Removing tasks that end on given time
        if (timeLine[time]) {
            for (j = 0; j < timeLine[time].length; j++) {
                type = timeLine[time][j].type;
                index = timeLine[time][j].index;

                if (type === presenter.TIME_LINE_TASK.TYPE.TEXT) {
                    show = timeLine[time][j].task === presenter.TIME_LINE_TASK.TASK.SHOW;

                    if (!show) {
                        indexOfElement = activeTasks.indexOf(index);
                        if (indexOfElement !== -1) {
                            activeTasks.splice(indexOfElement, 1);
                        }
                    }
                }
            }
        }

        return activeTasks;
    };

    presenter.buildTimeLine = function (slides, texts) {
        var timeLine = [];
        var i;

        // Slides
        for (i = 0; i < slides.length; i++) {
            var time = slides[i].start;

            if (!timeLine[time]) {
                timeLine[time] = [];
            }

            timeLine[time].push({
                type:presenter.TIME_LINE_TASK.TYPE.SLIDE,
                task:presenter.TIME_LINE_TASK.TASK.SHOW,
                index:i
            });
        }

        for (i = 0; i < texts.length; i++) {
            var startTime = texts[i].start;

            if (!timeLine[startTime]) {
                timeLine[startTime] = [];
            }

            timeLine[startTime].push({
                type:presenter.TIME_LINE_TASK.TYPE.TEXT,
                task:presenter.TIME_LINE_TASK.TASK.SHOW,
                index:i
            });

            var endTime = texts[i].end;

            if (!timeLine[endTime]) {
                timeLine[endTime] = [];
            }

            timeLine[endTime].push({
                type:presenter.TIME_LINE_TASK.TYPE.TEXT,
                task:presenter.TIME_LINE_TASK.TASK.HIDE,
                index:i
            });
        }

        return timeLine;
    };

    function setDOMElementsHrefsAndSelectors(view) {
        DOMElements.viewContainer = $(view);
        DOMElements.container = $(DOMElements.viewContainer.find('.slideshow-container:first')[0]);
        DOMElements.loading = {
            image:$(DOMElements.viewContainer.find('.slideshow-loading-image:first')[0]),
            text:$(DOMElements.viewContainer.find('.slideshow-loading-text:first')[0])
        };

        DOMElements.controls = {
            play:'[class*="slideshow-controls-play"]',
            pause:'[class*="slideshow-controls-pause"]',
            stop:'[class*="slideshow-controls-stop"]',
            next:'[class*=slideshow-controls-next]',
            previous:'[class*=slideshow-controls-previous]'
        };

        DOMElements.controls.container = $(DOMElements.viewContainer.find('.slideshow-controls-container:first')[0]);
        DOMElements.controls.timer = $(DOMElements.viewContainer.find('.slideshow-controls-timer:first')[0]);
        DOMElements.controls.currentTime = $(DOMElements.viewContainer.find('.slideshow-controls-timer-time:first')[0]);
        DOMElements.controls.duration = $(DOMElements.viewContainer.find('.slideshow-controls-timer-duration:first')[0]);
        DOMElements.controls.progressbar = $(DOMElements.viewContainer.find('.slideshow-controls-progressbar:first')[0]);
        DOMElements.controls.slider = $(DOMElements.viewContainer.find('.slideshow-controls-progressbar-slider:first')[0]);
        DOMElements.controls.line = $(DOMElements.viewContainer.find('.slideshow-controls-progressbar-line:first')[0]);
        DOMElements.controls.counter = $(DOMElements.viewContainer.find('.slideshow-controls-slide-counter:first')[0]);
    }

    function getControlButtonsDOMElements() {
        return {
            play:$(DOMElements.viewContainer.find(DOMElements.controls.play)[0]),
            pause:$(DOMElements.viewContainer.find(DOMElements.controls.pause)[0]),
            stop:$(DOMElements.viewContainer.find(DOMElements.controls.stop)[0]),
            next:$(DOMElements.viewContainer.find(DOMElements.controls.next)[0]),
            previous:$(DOMElements.viewContainer.find(DOMElements.controls.previous)[0])
        };
    }

    presenter.upgradeModel = function (model) {
        var upgradedModel = upgradeModelNoAudio(model);
        upgradedModel = upgradeModelAudiodescription(upgradedModel);
        upgradedModel = upgradeModelBaseDimensions(upgradedModel);
        return upgradedModel;
    };

    function upgradeModelNoAudio(model) {
        var upgradedModel = {};
        $.extend(true, upgradedModel, model);
        if (!upgradedModel['No audio']) {
            upgradedModel['No audio'] = 'False'
        }
        return upgradedModel;
    }

    function upgradeModelAudiodescription(model) {
        var upgradedModel = {};
        $.extend(true, upgradedModel, model);
        for (var i = 0; i < upgradedModel.Slides.length; i++) {
            if (!upgradedModel.Slides[i]['Audiodescription']) {
                upgradedModel.Slides[i]['Audiodescription'] = '';
            }
        }
        if(!upgradedModel['langAttribute']) {
            upgradedModel['langAttribute'] = '';
        }
        return upgradedModel;
    }

    function upgradeModelBaseDimensions(model) {
        var upgradedModel = {};
        $.extend(true, upgradedModel, model);
        if (!upgradedModel['Base width']) {
            upgradedModel['Base width'] = '';
        }
        if (!upgradedModel['Base height']) {
            upgradedModel['Base height'] = '';
        }
        return upgradedModel;
    }

    presenter.setPlayerController = function (controller) {
        presenter.playerController = controller;
        presenter.eventBus = controller.getEventBus();
    };

    presenter.hideInactiveControls = function () {
      if (presenter.configuration.noAudio) {
            DOMElements.controls.timer.css('display','none');
            DOMElements.controls.progressbar.css('display','none');
      }  else {
          DOMElements.controls.counter.css('display','none');
      }

    };

    function presenterLogic(view, model, preview) {
        setDOMElementsHrefsAndSelectors(view);

        if (!preview) {
            var loadingSrc = DOMOperationsUtils.getResourceFullPath(presenter.playerController, "media/loading.gif");
            if (loadingSrc) {
            	$(DOMElements.loading.image).attr('src', loadingSrc);
            }
        }
        presenter.$view = $(view);
        model = presenter.upgradeModel(model);
        presenter.configuration = presenter.validateModel(model, preview);
        if (presenter.configuration.isError) {
            DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, presenter.configuration.errorCode);
            return;
        }

        if (!preview) {
            $.when(loadedAudioDeferred, loadedImagesDeferred, loadedTextDeferred).done(function () {
                hideLoadingScreen();
                deferredSyncQueue.resolve();
            });

        	if (presenter.configuration.groupNextAndPrevious) {
	            var $container = $(DOMElements.controls.container);
	            var $next = $(getControlButtonsDOMElements().next);
	            var $previous = $(getControlButtonsDOMElements().previous);
	            presenter.groupNavigationElements($container, $next, $previous);
	        }
	
	        setElementsDimensions(model.Width, model.Height);
	        adjustProgressBar();
	
	        var loadingResult = loadAudio(preview);
	        if (loadingResult.isError) {
	            DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, loadingResult.errorCode);
	            return;
	        }
	
	        prepareLoadingScreen(presenter.configuration.slideDimensions.width, presenter.configuration.slideDimensions.height);
	        // Manual load is necessary for Apple iPad/iPhone
	        presenter.configuration.buzzAudio.load();
	        presenter.configuration.timeLine = presenter.buildTimeLine(presenter.configuration.slides.content, presenter.configuration.texts.content);
	        loadTexts();
	
	        var buttons = getControlButtonsDOMElements();
	        presenter.checkBackgroundImageOfButtonElements(buttons);
	        
	        loadSlides(presenter.configuration.slideDimensions.width, presenter.configuration.slideDimensions.height, preview);
	        
	        presenter.configuration.mouseData = {
	            isMouseDown : false,
	            oldPosition : {
	                x : 0,
	                y : 0
	            },
	            isMouseDragged : false
	        };

            MutationObserverService.createDestroyObserver(presenter.configuration.addonID, presenter.stopPresentation, presenter.$view.get(0));
            MutationObserverService.setObserver();

            presenter.hideInactiveControls();
        } else {
        	if (presenter.configuration.groupNextAndPrevious) {
	            var $container = $(DOMElements.controls.container);
	            var $next = $(getControlButtonsDOMElements().next);
	            var $previous = $(getControlButtonsDOMElements().previous);
	            presenter.groupNavigationElements($container, $next, $previous);
	        }
	
	        setElementsDimensions(model.Width, model.Height);
	        adjustProgressBar();
	        
	        prepareLoadingScreen(presenter.configuration.slideDimensions.width, presenter.configuration.slideDimensions.height);
	        // Manual load is necessary for Apple iPad/iPhone
	        presenter.configuration.timeLine = presenter.buildTimeLine(presenter.configuration.slides.content, presenter.configuration.texts.content);
	        loadTexts();
	
	        var buttons = getControlButtonsDOMElements();
	        presenter.checkBackgroundImageOfButtonElements(buttons);
	        
	        loadSlides(presenter.configuration.slideDimensions.width, presenter.configuration.slideDimensions.height, preview);
	        
	        presenter.configuration.mouseData = {
	            isMouseDown : false,
	            oldPosition : {
	                x : 0,
	                y : 0
	            },
	            isMouseDragged : false
	        };
            presenter.hideInactiveControls();
            hideLoadingScreen();
        }

    }

    function prepareLoadingScreen(slidesContainerWidth, slidesContainerHeight) {
        $(DOMElements.loading.image).css({
            top:((slidesContainerHeight - $(DOMElements.loading.image).height()) / 2) + 'px',
            left:((slidesContainerWidth - $(DOMElements.loading.image).width()) / 2) + 'px'
        });

        var textWidth = $(DOMElements.loading.text).width();
        var textHeight = $(DOMElements.loading.text).height();

        $(DOMElements.loading.text).css({
            top:(slidesContainerHeight - textHeight) + 'px',
            left:((slidesContainerWidth - textWidth) / 2) + 'px'
        });
    }

    function showLoadingScreen(text) {
        $(DOMElements.loading.image).show();
        $(DOMElements.loading.text).text(text);
        $(DOMElements.loading.text).show();
        presenter.configuration.isLoadingScreenVisible = true;
    }

    function hideLoadingScreen() {
        $(DOMElements.loading.image).hide();
        $(DOMElements.loading.text).hide();
        presenter.configuration.isLoadingScreenVisible = false;
    }

    presenter.groupNavigationElements = function($container, $next, $previous) {
        var $groupElement = $(document.createElement('div'));

        $groupElement.addClass('slideshow-controls-navigation');
        $groupElement.append($previous);
        $groupElement.append($next);

        $container.append($groupElement);
    };

    presenter.createPreview = function (view, model) {
        presenterLogic(view, model, true);
    };

    presenter.run = function (view, model) {
        presenterLogic(view, model, false);
    };

    presenter.reset = function () {
        this.configuration.isVisible = this.configuration.isVisibleByDefault;
        this.setVisibility(this.configuration.isVisible);
        presenter.stopPresentation();
    };

    presenter.executeCommand = function(name, params) {

        var commands = {
            'show': presenter.show,
            'hide': presenter.hide,
            'play': presenter.play,
            'pause': presenter.pause,
            'stop': presenter.stop,
            'next': presenter.next,
            'previous': presenter.previous,
            'moveTo': presenter.moveToCommand
        };

        Commands.dispatch(commands, name, params, presenter);
    };

    presenter.moveTo = function (number) {
        presenter.moveToCommand([number + ""]);
    };

    presenter.validateMoveToParams = function (params) {
        if (params.length > 1 ) {
            return {isValid: false};
        }

        var number = Number(params[0]) - 1;

        if (isNaN(number)) {
            return {isValid: false};
        }

        if (number > (presenter.configuration.slides.count - 1)) {
            return {isValid: false};
        }

        if (number < 0) {
            return {isValid: false};
        }

        return {isValid: true, number: number};
    };

    presenter.moveToCommand = deferredSyncQueue.decorate(function (params) {
        var validatedParams = presenter.validateMoveToParams(params);

        if (validatedParams.isValid) {
            var previousAudioState = presenter.configuration.audioState;
            var wasPlayed = presenter.configuration.audio.wasPlayed;

            presenter.goToSlide(validatedParams.number, false);
            presenter.setTimeFromSlideIndex(validatedParams.number);

            presenter.onSlideChangeAudioStateSetting(previousAudioState, wasPlayed);
        }
    });

    presenter.onSlideChangeAudioStateSetting = function (previousAudioState, wasPlayed) {
        if (previousAudioState != presenter.AUDIO_STATE.PLAY) {
            presenter.configuration.audioState = presenter.AUDIO_STATE.PAUSE;
            presenter.sendValueChangedEvent("pause");
            presenter.configuration.audio.wasPlayed = wasPlayed;
            return;
        }

        presenter.configuration.audioState = presenter.AUDIO_STATE.PLAY;
        presenter.sendValueChangedEvent("playing");
        presenter.configuration.audio.wasPlayed = wasPlayed;
    };

    presenter.next = deferredSyncQueue.decorate(function () {
        var previousAudioState = presenter.configuration.audioState;
        var wasPlayed = presenter.configuration.audio.wasPlayed;

        goToNextSlide(false);

        presenter.onSlideChangeAudioStateSetting(previousAudioState, wasPlayed);
    });

    presenter.previous = deferredSyncQueue.decorate(function () {
        var previousAudioState = presenter.configuration.audioState;
        var wasPlayed = presenter.configuration.audio.wasPlayed;

        goToPreviousSlide(false);

        presenter.onSlideChangeAudioStateSetting(previousAudioState, wasPlayed);
    });

    presenter.play = deferredSyncQueue.decorate(function () {

        switch (presenter.configuration.audioState) {
            case presenter.AUDIO_STATE.STOP:
                presenter.switchSlideShowStopToPlay();
                presenter.readSlide(0, true);
                break;
            case presenter.AUDIO_STATE.PAUSE:
                presenter.switchSlideShowPauseToPlay();
                break;
            case presenter.AUDIO_STATE.STOP_FROM_NAVIGATION:
                presenter.sendValueChangedEvent("playing");
                if(!presenter.isPlaying) {
                    presenter.playAudioAction();
                    presenter.readSlide(0, true);
                }
                break;
        }
    });

    presenter.pause = deferredSyncQueue.decorate(function () {
        if(presenter.configuration.audioState == presenter.AUDIO_STATE.PLAY || presenter.isPlaying) {
            presenter.switchSlideShowPlayToPause();
        }
    });

    presenter.stop = deferredSyncQueue.decorate(function () {
        if(presenter.configuration.audioState != presenter.AUDIO_STATE.STOP) {
            presenter.stopPresentation();
        }
    });

    presenter.setVisibility = function(isVisible) {
        $(DOMElements.viewContainer).css("visibility", isVisible ? "visible" : "hidden");
    };

    presenter.show = function() {
        if (presenter.configuration.audioState == presenter.AUDIO_STATE.PLAY) {
            presenter.playAudioResource();
        }
        presenter.setVisibility(true);
        presenter.configuration.isVisible = true;
    };

    presenter.hide = function() {
        if (presenter.configuration.audioState == presenter.AUDIO_STATE.PLAY) {
            presenter.pauseAudioResource();
        }
        presenter.setVisibility(false);
        presenter.configuration.isVisible = false;
    };

    presenter.onDestroy = function () {
        if (presenter.configuration.isDomReferenceArrayComplete) {
            presenter.pauseAudioResource();
        }
    };

    presenter.getState = function() {
        return JSON.stringify({
            isVisible: presenter.configuration.isVisible
        });
    };

    presenter.setState = function (state) {
        var isVisible = JSON.parse(state).isVisible;

        presenter.setVisibility(isVisible);
        presenter.configuration.isVisible = isVisible;
    };

    presenter.validateAudio = function (audioArray) {
        var audio = {
            MP3: audioArray.MP3 !== "" ? audioArray.MP3 : null,
            OGG: audioArray.OGG !== "" ? audioArray.OGG : null,
            wasPlayed: false
        };

        if (audio.MP3 === null && audio.OGG === null) {
            return { isError: true, errorCode: "A_01" };
        }

        return { isError: false, audio: audio };
    };

    presenter.validateAnimation = function (slideAnimation, textAnimation) {
        return {
            textAnimation:textAnimation === 'True',
            slideAnimation:slideAnimation === 'True'
        };
    };

    function returnErrorObject() {
        return { isError: true }
    }

    // This function validates and converts timer in MM:SS format to number of seconds
    presenter.sanitizeTimer = function (timer) {
        if (!timer || timer.length === 0) {
            return returnErrorObject();
        }

        var buzzedTimer = buzz.fromTimer(timer);
        if (typeof buzzedTimer === "string") {
            if (buzzedTimer.split(':', 1).length !== 2) {
                return returnErrorObject();
            }

            buzzedTimer = parseInt(buzzedTimer, 10);
            if (isNaN(buzzedTimer) || buzzedTimer < 0) {
                return returnErrorObject();
            }
        }

        if (buzzedTimer < 0) {
            return returnErrorObject();
        }

        return {
            isError:false,
            sinitizedTimer:buzzedTimer
        };
    };

    // If validation error occurs then one of the following error codes are returned
    // S_01 - empty image
    // S_02 - problem with start time
    // S_03 - times imposed
    presenter.validateSlides = function (slidesArray) {
        var slides = {
            count:0,
            content:[]
        };

        for (var i = 0; i < slidesArray.length; i++) {
            if (!slidesArray[i].Image || slidesArray[i].Image === "") {
                return {
                    isError:true,
                    errorCode:"S_01"
                };
            }

            var startTime = slidesArray[i].Start;
            var sanitizedTime = presenter.sanitizeTimer(startTime);

            if (sanitizedTime.isError) {
                return {
                    isError:true,
                    errorCode:"S_02"
                };
            }

            if (i === 0 && sanitizedTime.sinitizedTimer !== 0) {
                sanitizedTime.sinitizedTimer = 0;
            }

            var slide = {
                image:slidesArray[i].Image,
                start:sanitizedTime.sinitizedTimer,
                audiodescription:slidesArray[i].Audiodescription
            };

            slides.content.push(slide);
            slides.count++;
        }

        var previousTime = slides.content[0].start;
        for (var s = 1; s < slides.count; s++) {
            var nextTime = slides.content[s].start;
            if (nextTime < previousTime) {
                return {
                    isError:true,
                    errorCode:"S_03"
                };
            }
            previousTime = nextTime;
        }

        return {
            isError:false,
            slides:slides
        };
    };

    // This function validates and converts number from string representation to integer value
    presenter.sanitizePosition = function (position) {
        if (!position) {
            return {
                isError:true
            };
        }

        var parsedPosition = parseInt(position, 10);
        if (isNaN(parsedPosition)) {
            return {
                isError:true
            };
        }

        if (parsedPosition < 0) {
            return {
                isError:true
            };
        }

        return {
            isError:false,
            position:parseInt(position, 10)
        };
    };

    // If validation error occurs then one of the following error codes are returned
    // T_01 - empty image
    // T_02 - problem with start time
    // T_03 - problem with end time
    // T_04 - times imposed
    // T_05 - top value invalid
    // T_06 - left value invalid
    // T_07 - empty text and texts count > 0
    presenter.validateTexts = function (textsArray) {
        var texts = {
            count:0,
            content:[]
        };

        for (var i = 0; i < textsArray.length; i++) {
            var startTime = textsArray[i].Start;
            var endTime = textsArray[i].End;
            var topPosition = textsArray[i].Top;
            var leftPosition = textsArray[i].Left;

            if (textsArray[i].Text == "" && startTime == "" && endTime == "" && topPosition == "" && leftPosition == "") {
                if (textsArray.length == 1) {
                    texts.content = [];
                    texts.count = 0;
                    break;
                } else {
                    return {
                        isError:true,
                        errorCode:"T_07"
                    };
                }
            }

            if (!textsArray[i].Text || textsArray[i].Text === "") {
                return {
                    isError:true,
                    errorCode:"T_01"
                };
            }

            var sanitizedStartTime = presenter.sanitizeTimer(startTime);
            if (sanitizedStartTime.isError) {
                return {
                    isError:true,
                    errorCode:"T_02"
                };
            }

            var sanitizedEndTime = presenter.sanitizeTimer(endTime);
            if (sanitizedEndTime.isError) {
                return {
                    isError:true,
                    errorCode:"T_03"
                };
            }

            if (sanitizedStartTime.sinitizedTimer > sanitizedEndTime.sinitizedTimer) {
                return {
                    isError:true,
                    errorCode:"T_04"
                };
            }

            var sanitizedTopPosition = presenter.sanitizePosition(topPosition);
            if (sanitizedTopPosition.isError) {
                return {
                    isError:true,
                    errorCode:"T_05"
                };
            }

            var sanitizedLeftPosition = presenter.sanitizePosition(leftPosition);
            if (sanitizedLeftPosition.isError) {
                return {
                    isError:true,
                    errorCode:"T_06"
                };
            }

            var text = {
                text:textsArray[i].Text,
                start:sanitizedStartTime.sinitizedTimer,
                end:sanitizedEndTime.sinitizedTimer,
                top:sanitizedTopPosition.position,
                left:sanitizedLeftPosition.position
            };

            texts.content.push(text);
            texts.count++;
        }

        return {
            isError:false,
            texts:texts
        };
    };

    /**
     * Validates string representation of integer. Only positive integer values are allowed. If both (value and default) are
     * undefined then isError property is set to true.
     *
     */
    presenter.validatePositiveInteger = function (value, defaultValue) {
        var isValueDefined = value != undefined && value !== "";
        var isDefaultDefined = defaultValue != undefined && !isNaN(defaultValue);

        if (!isValueDefined && !isDefaultDefined) {
            return {
                isError: true
            };
        }

        if (!isValueDefined && isDefaultDefined) {
            return {
                isError: false,
                value: defaultValue
            };
        }

        var parsedSize = parseInt(value, 10);
        if (isNaN(parsedSize) || parsedSize < 1) {
            return {
                isError: true
            };
        }

        return {
            isError: false,
            value: parsedSize
        };
    };

    presenter.validateModel = function (model, isPreview) {
        var noAudio = ModelValidationUtils.validateBoolean(model["No audio"]);
		var animationValidationResult = presenter.validateAnimation(model["Slide animation"], model["Text animation"]);

		var audioValidationResult;
		if (noAudio) {
		    audioValidationResult = {audio: {wasPlayed: false}};
        } else {
            audioValidationResult = presenter.validateAudio(model.Audio[0]);
            if (audioValidationResult.isError) {
                return {
                    isError: true,
                    errorCode: audioValidationResult.errorCode
                };
            }
        }

        var slidesValidationResult = presenter.validateSlides(model.Slides);
        if (slidesValidationResult.isError) {
            return {
                isError:true,
                errorCode:slidesValidationResult.errorCode
            };
        }

        var textsValidationResult = presenter.validateTexts(model.Texts);
        if (textsValidationResult.isError) {
            return {
                isError:true,
                errorCode:textsValidationResult.errorCode
            };
        }

        var maxDurationResult = ModelValidationUtils.validateInteger(model['Presentation duration']);
        if (noAudio && (!maxDurationResult.isValid || maxDurationResult.value <= 0)) {
            return {isError: true, errorCode: 'N_01'};
        }

        var showSlide = 1;
        var validatedShowSlide = presenter.validatePositiveInteger(model["Show slide"], 1);
        if (!validatedShowSlide.isError && validatedShowSlide.value <= slidesValidationResult.slides.count) {
            showSlide = validatedShowSlide.value;
        }

        var isVisibleByDefault = ModelValidationUtils.validateBoolean(model["Is Visible"]);

        var baseDimensions = {
            width: 0,
            height: 0
        }
        if (model['Base width'].trim().length !== 0) {
            var validatedBaseWidth = ModelValidationUtils.validatePositiveInteger(model['Base width']);
            if (validatedBaseWidth.isValid) {
                baseDimensions.width = validatedBaseWidth.value;
            } else {
                return {isError: true, errorCode: 'ID_01'};
            }
        }
        if (model['Base height'].trim().length !== 0) {
            var validatedBaseHeight = ModelValidationUtils.validatePositiveInteger(model['Base height']);
            if (validatedBaseHeight.isValid) {
                baseDimensions.height = validatedBaseHeight.value;
            } else {
                return {isError: true, errorCode: 'ID_01'};
            }
        }

        return {
            isError: false,
            audio: audioValidationResult.audio,
            textAnimation: animationValidationResult.textAnimation,
            slideAnimation: animationValidationResult.slideAnimation,
            slides: slidesValidationResult.slides,
            texts: textsValidationResult.texts,
            hideProgressbar: ModelValidationUtils.validateBoolean(model["Hide progressbar"]),
            groupNextAndPrevious: ModelValidationUtils.validateBoolean(model["Group next and previous buttons"]),
            showSlide: showSlide,
            isVisibleByDefault: isVisibleByDefault,
            isVisible: isVisibleByDefault,
            addonID: model['ID'],
            noAudio: noAudio,
            maxTime: maxDurationResult.value,
            lang: model['langAttribute'],
            baseDimensions: baseDimensions
        };
    };

    presenter.sendValueChangedEvent = function slideShowAddon_sendValueChangedEvent (eventValue) {
        presenter.sendEvent({
            'source': presenter.configuration.addonID,
            'item': '',
            'value': eventValue,
            'score': ''
        }, 'ValueChanged');
    };

    presenter.sendEvent = function slideShowAddon_sendEvent(eventData, eventType) {
        if (presenter.eventBus != null) {
            presenter.eventBus.sendEvent(eventType, eventData);
        }
    };

    presenter._internal_state = {
        deferredQueue: deferredSyncQueue
    };

    presenter.keyboardController = function(keycode, isShiftKeyDown, event) {
        event.preventDefault();
        presenter.shiftPressed = event.shiftKey;

        var keys = {
            ENTER: 13,
            ESC: 27,
            SPACE: 32,
            ARROW_LEFT: 37,
            ARROW_UP: 38,
            ARROW_RIGHT: 39,
            ARROW_DOWN: 40
        };

        var leftArrowHandler = function () {
            presenter.previous();

            presenter.readSlide(presenter.getCurrentSlideIndex(), false);
        };

        var rightArrowHandler = function () {
            presenter.next();
            presenter.readSlide(presenter.getCurrentSlideIndex(), false);
        };

        var spaceHandler = function () {
            if (presenter.isPlaying) {
                presenter.pause();
            } else {
                if (presenter.isSpeaking) {
                    presenter.stopSpeech();
                } else {
                    presenter.play();
                }
            }
        };

        var upArrowHandler = function () {
            if (!presenter.noAudioPlayer && presenter.configuration.audioLoadComplete) {
                var volume = presenter.configuration.buzzAudio.getVolume();
                volume += 10;
                if (volume > 100) {
                    volume = 100;
                }
                presenter.configuration.buzzAudio.setVolume(volume);
            }
        };

        var downArrowHandler = function () {
            if (!presenter.noAudioPlayer && presenter.configuration.audioLoadComplete) {
                var volume = presenter.configuration.buzzAudio.getVolume();
                volume -= 10;
                if (volume < 0) {
                    volume = 0;
                }
                presenter.configuration.buzzAudio.setVolume(volume);
            }
        };

        var escapeHandler = function () {
            presenter.pause();
            presenter.stopSpeech();
        };

        var enterHandler = function () {
            if (!isWCAGOn) {
                presenter.pause();
                presenter.stopSpeech();
            }
        };

        var mapping = {};

        mapping[keys.ENTER] = enterHandler;
        mapping[keys.ESC] = escapeHandler;
        mapping[keys.SPACE] = spaceHandler;
        mapping[keys.ARROW_LEFT] = leftArrowHandler;
        mapping[keys.ARROW_UP] = upArrowHandler;
        mapping[keys.ARROW_RIGHT] = rightArrowHandler;
        mapping[keys.ARROW_DOWN] = downArrowHandler;

        try {
            mapping[keycode]();
        } catch (er) {};
    };

    presenter.readSlide = function(index, continueAfterTTS) {
        var audiodescription = presenter.configuration.slides.content[index].audiodescription;
        if (isWCAGOn && audiodescription.length > 0) {
            presenter.pause();
            if (continueAfterTTS) {
                presenter.speakWithCallback(
                    [window.TTSUtils.getTextVoiceObject(
                        audiodescription,
                        presenter.configuration.lang)],
                    readSlideCallback);
            } else {
                presenter.speak([window.TTSUtils.getTextVoiceObject(
                        audiodescription,
                        presenter.configuration.lang)]);
            }
        }
    };

    function readSlideCallback() {
        if (presenter.isSpeaking) {
            presenter.isSpeaking = false;
            presenter.play();
        }
    }

    presenter.getTextToSpeechOrNull = function (playerController) {
        if (playerController) {
            return playerController.getModule('Text_To_Speech1');
        }

        return null;
    };

    presenter.setWCAGStatus = function (isOn) {
        isWCAGOn = isOn;
    };

    presenter.speakWithCallback = function(data, callback) {
        var tts = presenter.getTextToSpeechOrNull(presenter.playerController);

        if (tts && isWCAGOn) {
            presenter.isSpeaking = true;
            tts.speakWithCallback(data, callback);
        }
    };

    presenter.speak = function(data) {
        var tts = presenter.getTextToSpeechOrNull(presenter.playerController);

        if (tts && isWCAGOn) {
            presenter.isSpeaking = false;
            tts.speak(data);
        }
    };

    presenter.stopSpeech = function() {
         var tts = presenter.getTextToSpeechOrNull(presenter.playerController);

        if (tts && isWCAGOn) {
            presenter.isSpeaking = false;
            tts.speakWithCallback([window.TTSUtils.getTextVoiceObject("-")], presenter.pause);
        }
    };

    presenter.isEnterable = function() {
        presenter.pause();
        presenter.stopSpeech();
        return false;
    };

    return presenter;
}

AddonSlideshow_create.__supported_player_options__ = {
    interfaceVersion: 2
};