function AddonSlideshow_create() {
    var presenter = function () {};

    var DOMElements = {};
    presenter.configuration = {};

    presenter.ERROR_CODES = {
        'A_01': "At least one audio format file must be uploaded!",
        'A_02': "Your browser does not support HTML5 audio or none of Addon media types!",
        'A_03': "No audio media was loaded!",
        'S_01': "Each slide must have Image property set properly!",
        'S_02': "Slide start time in not in proper format ('MM:SS')!",
        'S_03': "Slide start times should be consecutive!",
        'T_01': "Text value cannot be empty!",
        'T_02': "Text start time in not in proper format ('MM:SS')!",
        'T_03': "Text end time in not in proper format ('MM:SS')!",
        'T_04': "Text end time must be higher than start time!",
        'T_05': "Top position value is invalid!",
        'T_06': "Left position value is invalid!",
        'T_07': "If more than one text is set, each one of them have to be set properly!"
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
        })
    };

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
        if (time === undefined) {
            time = presenter.configuration.buzzAudio.getTime();
        }
        var percentage = time / presenter.configuration.buzzAudio.getDuration();
        $(DOMElements.controls.slider).css('left', (percentage * presenter.configuration.sliderSlideAreaLength) + 'px');
    }

    function isAudioBufferedEnough(time) {
        var buffered = presenter.configuration.buzzAudio.getBuffered();
        if (buffered === undefined || buffered === null || buffered.length < 1) {
            return false;
        }

        var bufferedEnd = 0;
        for (var i = 0; i < buffered.length; i++) {
            if (buffered[i].end) {
                bufferedEnd = Math.max(buffered[i].end, bufferedEnd);
            } else {
                return false;
            }
        }

        return bufferedEnd > time;
    }

    function loadAudio(isPreview) {
        if (!buzz.isSupported()) return { isError:true, errorCode:"A_01" };

        if (!buzz.isMP3Supported() && !buzz.isOGGSupported()) {
            return { isError:true, errorCode:"A_02" };
        }

        if (!isPreview) {
            showLoadingScreen("Loading audio file...");
        }

        var mediaLoaded = false;
        buzz.defaults.autoplay = false;
        buzz.defaults.loop = false;

        if (buzz.isMP3Supported() && presenter.configuration.audio.MP3 !== null) {
            presenter.configuration.buzzAudio = new buzz.sound(presenter.configuration.audio.MP3);
            mediaLoaded = true;
        }

        if (!mediaLoaded && buzz.isOGGSupported() && presenter.configuration.audio.OGG !== null) {
            presenter.configuration.buzzAudio = new buzz.sound(presenter.configuration.audio.OGG);
            mediaLoaded = true;
        }

        if (!mediaLoaded)  return { isError:true, errorCode:"A_03" };

        presenter.configuration.buzzAudio.bind("error", function () {
            var errorMessage = "Error occurred while loading/playing audio.";

            if (this.getErrorMessage()) errorMessage += " Reason: " + this.getErrorMessage();

            errorMessage += " Please try again.";

            DOMElements.viewContainer.html(errorMessage);
        });

        presenter.configuration.buzzAudio.bind("loadedmetadata", function () {
            var duration = buzz.toTimer(presenter.configuration.buzzAudio.getDuration(), false);
            presenter.configuration.audioDurationSet = presenter.configuration.buzzAudio.getDuration() !== '--';
            $(DOMElements.controls.duration).text(duration);
            presenter.configuration.audioLoadComplete = true;
        });

        presenter.configuration.currentTime = 0;
        presenter.configuration.audioState = presenter.AUDIO_STATE.NONE;

        return {
            isError:false
        };
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
                        var showIndex;

                        if (time !== 0) {
                            showIndex = index;
                        } else { // presentation stopped/ended
                            showIndex = 0;
                        }

                        for (var j = 0; j < presenter.configuration.slides.domReferences.length; j++) {
                            var $slideElement = $(presenter.configuration.slides.domReferences[j]);
                            if (j === showIndex) {
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
        if (presenter.configuration.audio.wasPlayed) {
            presenter.configuration.buzzAudio.pause();
        }
    };

    presenter.playAudioResource = function () {
        presenter.configuration.audio.wasPlayed = true;
        presenter.configuration.buzzAudio.play();
    };

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
            $(DOMElements.controls.currentTime).text('00:00');
            changeButtonToPlay();
            updateProgressBar(0);
            presenter.configuration.currentTime = 0;
            presenter.pauseAudioResource();
            presenter.configuration.audioState = presenter.AUDIO_STATE.STOP;
            hideAllTexts();
            // This action will trigger time update callback, but it's the only way to assure that pressing play after end/stop will trigger playing audio
            executeTasks(0, true);
            return;
        }

        if (!timeChanged) {
            return; // We want to execute tasks with an accuracy of full seconds only
        }

        executeTasks(presenter.configuration.currentTime, false);
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
                gotoSlide(slideNumber, true);
                hideLoadingScreen();

                if (presenter.configuration.savedState) {
                    $(DOMElements.viewContainer).trigger("onLoadSlidesEnd", [presenter.configuration.savedState]);
                }
            }
        });

    }

    function loadTexts() {
        showLoadingScreen("Loading text labels...");

        if (!presenter.configuration.texts.domReferences || !$.isArray(presenter.configuration.texts.domReferences)) {
            presenter.configuration.texts.domReferences = [];
        }

        for (var i = 0; i < presenter.configuration.texts.count; i++) {
            var text = presenter.configuration.texts.content[i];
            var textElement = document.createElement('span');
            $(textElement).addClass('slideshow-container-text');
            $(textElement).html(text.text);
            $(textElement).css({
                top:text.top + 'px',
                left:text.left + 'px'
            });
            presenter.configuration.texts.domReferences[i] = textElement;
            $(DOMElements.container).append(textElement);
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
    }

    presenter.stopPresentation = function() {
        updateProgressBar(0);
        presenter.configuration.audioState = presenter.AUDIO_STATE.STOP;
        presenter.pauseAudioResource();
        stopAllAnimations();
        hideAllTexts();
        executeTasks(0, true);
        changeButtonToPlay();
        $(DOMElements.controls.currentTime).text('00:00');
    };

    // Returns currently displayed index. If none slide is visible then this function returns -1
    function getCurrentSlideIndex() {
        stopAllAnimations();
        for (var i = 0; i < presenter.configuration.slides.domReferences.length; i++) {
            if ($(presenter.configuration.slides.domReferences[i]).is(":visible")) {
                return i;
            }
        }

        return -1;
    }

    function gotoNextSlide(withoutAnimation) {
        var currentSlideIndex = getCurrentSlideIndex();

        if (currentSlideIndex < presenter.configuration.slides.count - 1) {
            gotoSlide(currentSlideIndex + 1, withoutAnimation);
        }
    }

    function gotoPreviousSlide(withoutAnimation) {
        var currentSlideIndex = getCurrentSlideIndex();

        if (currentSlideIndex > 0) {
            gotoSlide(currentSlideIndex - 1, withoutAnimation);
        }
    }

    function gotoSlide(index, withoutAnimation) {
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
    }

    function playButtonClickHandler() {
        switch (presenter.configuration.audioState) {
            case presenter.AUDIO_STATE.PLAY:
                presenter.pauseAudioResource();
                presenter.configuration.audioState = presenter.AUDIO_STATE.PAUSE;
                changeButtonToPlay();
                break;
            case presenter.AUDIO_STATE.NONE:
            case presenter.AUDIO_STATE.PAUSE:
                presenter.configuration.audioState = presenter.AUDIO_STATE.PLAY;
                presenter.playAudioResource();
                changeButtonToPause();
                break;
            case presenter.AUDIO_STATE.STOP:
                updateProgressBar(0);
                presenter.configuration.currentTime = 0;
                if (presenter.configuration.audio.wasPlayed) {
                    presenter.configuration.buzzAudio.set('currentTime', 0.1);
                }
                presenter.playAudioResource();
                presenter.configuration.audioState = presenter.AUDIO_STATE.PLAY;
                changeButtonToPause();
                break;
            case presenter.AUDIO_STATE.STOP_FROM_NAVIGATION:
                stopButtonClickHandler();
                playButtonClickHandler();
                break;
        }
    }

    function stopButtonClickHandler() {
        presenter.stopPresentation();
    }

    function previousButtonClickHandler() {
        var isActive = $(this).hasClass('slideshow-controls-previous') || $(this).hasClass('slideshow-controls-previous-mouse-hover');
        if (isActive) {
            gotoPreviousSlide(false);
            presenter.configuration.audioState = presenter.AUDIO_STATE.STOP_FROM_NAVIGATION;
        }
    }

    function nextButtonClickHandler() {
        var isActive = $(this).hasClass('slideshow-controls-next') || $(this).hasClass('slideshow-controls-next-mouse-hover');
        if (isActive) {
            gotoNextSlide(false);
            presenter.configuration.audioState = presenter.AUDIO_STATE.STOP_FROM_NAVIGATION;
        }
    }

    function getCurrentIndex(element) {
        return $(element).index() - presenter.configuration.texts.count;
    }

    function mouseDownCallback (eventData) {
        if (presenter.AUDIO_STATE.PLAY === presenter.configuration.audioState) return;

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

    function touchStartCallback (event) {
        event.preventDefault();

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
        if (presenter.AUDIO_STATE.PLAY === presenter.configuration.audioState) return;

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
                        gotoSlide(currentIndex + 1, true);
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
                        gotoSlide(currentIndex - 1, true);
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

        mouseUpCallback();
    }

    function mouseMoveCallback (eventData) {
        if (presenter.AUDIO_STATE.PLAY === presenter.configuration.audioState) return;
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

        var touch = event.touches[0] || event.changedTouches[0];
        mouseMoveCallback(touch);
    }

    function mouseClickCallback () {
        if (presenter.AUDIO_STATE.PLAY === presenter.configuration.audioState) return;

        if (presenter.configuration.mouseData.isMouseDragged) {
            presenter.configuration.mouseData.isMouseDragged = false;
        }

        return false;
    }

    function handleMouseActions() {
        getControlButtonsDOMElements().play.click(playButtonClickHandler);
        getControlButtonsDOMElements().stop.click(stopButtonClickHandler);
        getControlButtonsDOMElements().previous.click(previousButtonClickHandler);
        getControlButtonsDOMElements().next.click(nextButtonClickHandler);

        DOMElements.container.find('.slideshow-container-slide').each(function () {
            $(this).mousedown(mouseDownCallback);
            this.ontouchstart = touchStartCallback;

            $(this).mouseup(mouseUpCallback);
            this.ontouchend = touchEndCallback;

            $(this).mousemove(mouseMoveCallback);
            this.ontouchmove = touchMoveCallback;
        });

        $(DOMElements.container.find('.slideshow-container-slide')).click(mouseClickCallback);
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
            var currentSlideIndex = getCurrentSlideIndex();

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
        setButtonInactive(presenter.NAVIGATION_BUTTON.PREVIOUS);
        setButtonInactive(presenter.NAVIGATION_BUTTON.NEXT);
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

    presenter.setPlayerController = function (controller) {
        presenter.playerController = controller;
    };

    function presenterLogic(view, model, preview) {
        setDOMElementsHrefsAndSelectors(view);

        if (!preview) {
            var loadingSrc = DOMOperationsUtils.getResourceFullPath(presenter.playerController, "media/loading.gif");
            if (loadingSrc) $(DOMElements.loading.image).attr('src', loadingSrc);
        }

        presenter.configuration = presenter.validateModel(model);
        if (presenter.configuration.isError) {
            DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, presenter.configuration.errorCode)
            return;
        }

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
            DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, loadingResult.errorCode)
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

        if (preview) {
            presenter.setVisibility(presenter.configuration.isVisible);
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
            'hide': presenter.hide
        };

        Commands.dispatch(commands, name, params, presenter);
    };

    presenter.setVisibility = function(isVisible) {
        $(DOMElements.viewContainer).css("visibility", isVisible ? "visible" : "hidden");
    };

    presenter.show = function() {
        if(presenter.configuration.audioState == presenter.AUDIO_STATE.PLAY) {
            presenter.playAudioResource();
        }
        presenter.setVisibility(true);
        presenter.configuration.isVisible = true;
    };

    presenter.hide = function() {
        if(presenter.configuration.audioState == presenter.AUDIO_STATE.PLAY) {
            presenter.pauseAudioResource();
        }
        presenter.setVisibility(false);
        presenter.configuration.isVisible = false;
    };

    presenter.getState = function() {
        if(presenter.configuration.isDomReferenceArrayComplete) {
            presenter.pauseAudioResource();
        }
    };

    presenter.validateAudio = function (audioArray) {
        var audio = {
            MP3:audioArray.MP3 !== "" ? audioArray.MP3 : null,
            OGG:audioArray.OGG !== "" ? audioArray.OGG : null,
            wasPlayed: false
        };

        if (audio.MP3 === null && audio.OGG === null) {
            return { isError:true, errorCode:"A_01" };
        }

        return { isError:false, audio:audio };
    };

    presenter.validateAnimation = function (slideAnimation, textAnimation) {
        return {
            textAnimation:textAnimation === 'True',
            slideAnimation:slideAnimation === 'True'
        };
    };

    // This function validates and converts timer in MM:SS format to number of seconds
    presenter.sanitizeTimer = function (timer) {
        if (!timer || timer.length === 0) {
            return {
                isError:true
            };
        }

        var buzzedTimer = buzz.fromTimer(timer);
        if (typeof buzzedTimer === "string") {
            if (buzzedTimer.split(':', 1).length !== 2) {
                return {
                    isError:true
                };
            }

            buzzedTimer = parseInt(buzzedTimer, 10);
            if (isNaN(buzzedTimer) || buzzedTimer < 0) {
                return {
                    isError:true
                };
            }
        }

        if (buzzedTimer < 0) {
            return {
                isError:true
            };
        }

        return {
            isError:false,
            sinitizedTimer:buzzedTimer
        }
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
                start:sanitizedTime.sinitizedTimer
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

    presenter.validateModel = function (model) {
        var audioValidationResult = presenter.validateAudio(model.Audio[0]);

        if (audioValidationResult.isError) {
            return {
                isError:true,
                errorCode:audioValidationResult.errorCode
            };
        }

        var animationValidationResult = presenter.validateAnimation(model["Slide animation"], model["Text animation"]);

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

        var showSlide = 1;
        var validatedShowSlide = presenter.validatePositiveInteger(model["Show slide"], 1);
        if (!validatedShowSlide.isError && validatedShowSlide.value <= slidesValidationResult.slides.count) {
            showSlide = validatedShowSlide.value;
        }

        var isVisibleByDefault = ModelValidationUtils.validateBoolean(model["Is Visible"]);

        return {
            isError:false,
            audio:audioValidationResult.audio,
            textAnimation:animationValidationResult.textAnimation,
            slideAnimation:animationValidationResult.slideAnimation,
            slides:slidesValidationResult.slides,
            texts:textsValidationResult.texts,
            hideProgressbar: ModelValidationUtils.validateBoolean(model["Hide progressbar"]),
            groupNextAndPrevious: ModelValidationUtils.validateBoolean(model["Group next and previous buttons"]),
            showSlide: showSlide,
            isVisibleByDefault: isVisibleByDefault,
            isVisible: isVisibleByDefault
        };
    };

    return presenter;
}