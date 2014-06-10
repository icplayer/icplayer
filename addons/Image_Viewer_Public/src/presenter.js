function AddonImage_Viewer_Public_create() {
    var presenter = function () {};

    var playerController = null;
    var watermarkElement;
    var loadingScreen = {
        element: null,
        counter: 0
    };
    var audioElements = [];

    presenter.addonId = null;
    presenter.upgradedModel = null;

    presenter.lastMovePosition = null;
    presenter.totalPercentage = 0;
    presenter.lastReceivedEvent = null;
    presenter.isMouseDown = false;

    presenter.ERROR_CODES = {
        'IM_01': "Image must be uploaded to display Addon!",
        'FN_01': "Frame number must be set to properly display Addon",
        'FN_02': "Frame number is not a number!",
        'FN_03': "Frame number must be a positive integer!",
        'FN_04': "Frame name cannot be empty!",
        'FN_05': "Frame names - frame number must be between 1 and frames count",
        'LA_01': "Label text cannot be empty!",
        'LA_02': "Label top value incorrect!",
        'LA_03': "Label left value incorrect!",
        'LA_04': "All label fields must be filled correctly!",
        'FL_01': "Label must be assigned to at least one frame!",
        'FL_02': "Frames list syntax incorrect! Check for separators!",
        'FL_03': "Frame number is invalid!",
        'FL_04': "Frame number missing inside list!",
        'FL_05': "Frame numbers range incorrect!",
        'WM_01': "Watermark color must be provided in #RRGGBB format!",
        'WM_02': "Watermark opacity must be a value from 0.0 to 1.0!",
        'WM_03': "Watermark size must be a positive integer number!",
        'CF_01': "Correct frame number must be between 1 and frames count!",
        'IF_01': "Initial frame is out of range. Please choose number between 1 and frames count."
    };

    presenter.FRAME_SIZE = {
        'Original': 'ORIGINAL',
        'Keep aspect ratio': 'SCALED',
        'Stretch': 'STRETCHED',
        DEFAULT: 'Original'
    };

    presenter.ANIMATION = {
        'None': 'NONE',
        'Linear': 'LINEAR',
        'Fading': 'FADING',
        DEFAULT: 'None'
    };

    presenter.configuration = {};

    presenter.upgradeModel = function (model) {
        var upgradedModel = presenter.upgradeFrom_01(model);

        return presenter.upgradeFrom_02(upgradedModel);
    };

    presenter.upgradeFrom_01 = function (model) {
        var upgradedModel = {};
        $.extend(true, upgradedModel, model); // Deep copy of model object

        if (!upgradedModel["Do not reset"]) {
            upgradedModel["Do not reset"] = false;
        }

        return upgradedModel;
    };

    presenter.upgradeFrom_02 = function (model) {
        var upgradedModel = {};
        $.extend(true, upgradedModel, model); // Deep copy of model object

        if (!upgradedModel["Random frame"]) {
            upgradedModel["Random frame"] = false;
        }

        if (!upgradedModel["Initial frame"]) {
            upgradedModel["Initial frame"] = "";
        }

        return upgradedModel;
    };

    function showErrorMessage(element, errorCode) {
        $(element).html(presenter.ERROR_CODES[errorCode]);
    }

    function setContainerDimensions(wrapper) {
        var elementReducedSize = DOMOperationsUtils.calculateReducedSize(wrapper, presenter.$element);
        $(presenter.$element).css({
            width: elementReducedSize.width,
            height: elementReducedSize.height
        });

        presenter.configuration.containerDimensions = {
            width: elementReducedSize.width,
            height: elementReducedSize.height
        };
    }

    function loadSounds() {
        // Check for browser audio tag support
        if (!buzz.isSupported()) {
            return;
        }

        buzz.defaults.autoplay = false;
        buzz.defaults.loop = false;
        showLoadingScreen();

        for (var i = 0; i < presenter.configuration.frames; i++) {
            if ((i > presenter.configuration.sounds.length - 1 ) || presenter.configuration.sounds[i].isEmpty) {
                audioElements[i] = null;
            } else {
                if (presenter.configuration.sounds[i].MP3 !== "" && buzz.isMP3Supported()) {
                    audioElements[i] = new buzz.sound(presenter.configuration.sounds[i].MP3);
                } else if (presenter.configuration.sounds[i].OGG !== "" && buzz.isOGGSupported()) {
                    audioElements[i] = new buzz.sound(presenter.configuration.sounds[i].OGG);
                } else {
                    audioElements[i] = new buzz.sound(presenter.configuration.sounds[i].AAC);
                }

                audioElements[i].load();
            }
        }

        hideLoadingScreen();
    }

    function hideWatermarkIfVisible() {
        if ($(watermarkElement).is(':visible')) {
            $(watermarkElement).hide();
        }
    }

    function showWatermarkIfNotVisible() {
        if ($(watermarkElement).not(':visible')) {
            $(watermarkElement).show();
        }
    }

    function clickHandler(e) {
        e.stopPropagation();

        if (presenter.configuration.isClickDisabled) return;
        if (presenter.configuration.isErrorMode && presenter.configuration.correctFrames.isExerciseMode) return;

        if (presenter.mouseData.isMouseDragged) {
            presenter.mouseData.isMouseDragged = false;
            return;
        }

        hideWatermarkIfVisible();

        presenter.next();
    }

    function isMoreThanOneFingerGesture(event) {
        var touchPoints = (typeof event.changedTouches != 'undefined') ? event.changedTouches : [event];
        return (event.touches.length || touchPoints.length) > 1;
    }

    function touchStartCallback (event) {
        if (isMoreThanOneFingerGesture(event)) return;

        var touchPoints = (typeof event.changedTouches != 'undefined') ? event.changedTouches : [event];

        var touch = event.touches[0] || touchPoints[0];
        mouseDownCallback(touch);
    }

    function getFixedBackgroundPosition() {
        return parseInt(presenter.$element.css('backgroundPosition'), 10);
    }

    function mouseDownCallback(event) {
        if (presenter.configuration.isClickDisabled) return;
        if (presenter.configuration.isErrorMode && presenter.configuration.correctFrames.isExerciseMode) return;

        presenter.mouseData.isMouseDown = true;
        presenter.mouseData.oldPosition.x = event.pageX;
        presenter.mouseData.oldPosition.y = event.pageY;
    }

    function touchEndCallback () {
        mouseUpCallback();
    }

    function getRequiredShift() {
        return (presenter.$element.width() / 100) * 30; // 30% of frame width
    }

    function mouseUpCallback() {
        if (presenter.configuration.isClickDisabled) return;
        if (presenter.configuration.isErrorMode && presenter.configuration.correctFrames.isExerciseMode) {
            presenter.mouseData.isMouseDown = false;
            delete presenter.mouseData.originalBackgroundPosition;
            return;
        }

        var originalAnimation = presenter.configuration.animation;
        presenter.configuration.animation = presenter.ANIMATION.Linear;

        if (presenter.mouseData.isMouseDragged) {
            var currentBackgroundPosition = getFixedBackgroundPosition(),
                shift = Math.abs(currentBackgroundPosition - presenter.mouseData.originalBackgroundPosition),
                isNextFrameShift = currentBackgroundPosition - presenter.mouseData.originalBackgroundPosition < 0;

            // Restoring percentage calculation of background position
            var newPosition = Math.abs(currentBackgroundPosition) / (presenter.configuration.backgroundImageWidth - presenter.$element.width());
            newPosition *= 100;
            presenter.$element.css('backgroundPosition', newPosition + '%');

            if (shift > getRequiredShift()) {
                var currentFrame = presenter.configuration.currentFrame;
                var framesCount = presenter.configuration.frames;

                if (isNextFrameShift) {
                    if (currentFrame < framesCount - 1) {
                        presenter.next();
                    } else {
                        presenter.configuration.currentFrame = 0;
                        presenter.$element.css({
                            'background-position':'-' + presenter.configuration.frameWidthPercentage + '%'
                        });
                        presenter.$element.animate({
                            'background-position':'0%'
                        }, 500, "linear");
                        presenter.changeFrameLogic(false, true);
                    }
                } else {
                    if (currentFrame !== 0) {
                        presenter.previous();
                    } else {
                        presenter.configuration.currentFrame = framesCount - 1;
                        presenter.$element.css({
                            'background-position':(100 + presenter.configuration.frameWidthPercentage) + '%'
                        });
                        presenter.$element.animate({
                            'background-position':'100%'
                        }, 500, "linear")
                        presenter.changeFrameLogic(false, true);
                    }
                    presenter.configuration.currentFrame = currentFrame > 1 ? currentFrame - 1 : framesCount - 1;
                }

            } else {
                var isReverseOrder = presenter.configuration.currentFrame === 0;
                presenter.changeFrame(false, isReverseOrder, false);
            }
        }

        presenter.configuration.animation = originalAnimation;
        presenter.mouseData.isMouseDown = false;
        delete presenter.mouseData.originalBackgroundPosition;
    }

    function touchMoveCallback (event) {
        if (isMoreThanOneFingerGesture(event)) return;

        event.preventDefault();

        var touchPoints = (typeof event.changedTouches != 'undefined') ? event.changedTouches : [event];

        var touch = event.touches[0] || touchPoints[0];
        mouseMoveCallback(touch);
    }

    function mouseMoveCallback(event) {
        if (presenter.configuration.isClickDisabled) return;
        if (presenter.configuration.isErrorMode && presenter.configuration.correctFrames.isExerciseMode) return;

        if (presenter.mouseData.isMouseDown) {
            presenter.mouseData.isMouseDragged = true;

            if (presenter.$element.css('background-position').indexOf('px') == -1) {
                var oldPositionInPx = (-1 * presenter.configuration.currentFrame) * presenter.$element.width();
                presenter.$element.css('backgroundPosition', oldPositionInPx + 'px');
                presenter.mouseData.originalBackgroundPosition = oldPositionInPx;
            }

            var relativeDistance = event.pageX - presenter.mouseData.oldPosition.x,
                oldPosition = parseInt(presenter.$element.css('backgroundPosition'), 10);
            presenter.$element.css('backgroundPosition', (oldPosition + relativeDistance) + 'px');

            presenter.mouseData.oldPosition.x = event.pageX;
            presenter.mouseData.oldPosition.y = event.pageY;
        }
    }

    /**
     * Calculate scale for image containing element depending on frame aspect ratio
     *
     * @return {Object} calculated horizontal and vertical scale
     */
    presenter.calculateContainerDimensions = function(imageWidth, imageHeight, containerWidth, containerHeight) {
        var imageRatio = imageWidth / imageHeight;
        var containerRatio = containerWidth / containerHeight;

        var horizontal = imageRatio >= containerRatio ? containerWidth : containerHeight * imageRatio;
        var vertical = imageRatio >= containerRatio ? containerWidth / imageRatio : containerHeight;

        return {
            horizontal: horizontal,
            vertical: vertical
        };
    };


    // This function returns string containing CSS declaration of elements
    // background image size in percentage measure
    function calculateBackgroundSize(size, framesCount) {
        var cssValue;

        switch(size) {
            case 'SCALED':
            case 'STRETCHED':
                cssValue = framesCount * 100;
                cssValue += '% 100%';
                break;
            default:
                cssValue = '';
        }

        return cssValue;
    }

    function shouldShowWatermark() {
        return presenter.configuration.showWatermark && !presenter.configuration.isClickDisabled;
    }

    function loadImage(preview) {
        var tempImageElement = document.createElement('img');
        $(tempImageElement).addClass('image-viewer-hidden-image');
        $(tempImageElement).attr('src', presenter.configuration.imageSrc);
        $(presenter.$view).append(tempImageElement);

        $(tempImageElement).load(function() {
            var containerWidth = presenter.configuration.containerDimensions.width;
            var containerHeight = presenter.configuration.containerDimensions.height;
            var imageWidth = $(this).width();
            var imageHeight = $(this).height();
            var containerDimensions = presenter.calculateContainerDimensions(imageWidth / presenter.configuration.frames, imageHeight, containerWidth, containerHeight);
            var backgroundSize = calculateBackgroundSize(presenter.configuration.frameSize, presenter.configuration.frames);

            var elementWidth;
            var elementHeight;

            switch (presenter.configuration.frameSize) {
                case 'ORIGINAL':
                    elementWidth = imageWidth / presenter.configuration.frames;
                    elementHeight = imageHeight;
                    break;
                case 'SCALED':
                    elementWidth = containerDimensions.horizontal;
                    elementHeight = containerDimensions.vertical;
                    break;
                case 'STRETCHED':
                    elementWidth = containerWidth;
                    elementHeight = containerHeight;
                    break;
            }

            presenter.$element.css({
                width: elementWidth + 'px',
                height: elementHeight + 'px',
                backgroundImage: "url('" + presenter.configuration.imageSrc + "')"
            });
            presenter.$elementHelper.css({
                width: elementWidth + 'px',
                height: elementHeight + 'px'
            });

            if (backgroundSize) {
                $(presenter.$element).css('background-size', backgroundSize);
            }

            presenter.configuration.backgroundImageWidth = $(this).width();

            $(this).remove();
            presenter.changeFrame(true, false, false);

            if (shouldShowWatermark()) {
                var watermarkOptions = {
                    "color": presenter.model["Watermark color"],
                    "opacity": presenter.model["Watermark opacity"],
                    "size": presenter.model["Watermark size"]
                };
                Watermark.draw(watermarkElement, watermarkOptions);
            }

            hideLoadingScreen();
            presenter.$view.trigger("onLoadImageEnd", [preview]);
        });
    }

    function prepareLoadingScreen(containerWidth, containerHeight) {
        $(loadingScreen.element).css({
            top: ((containerHeight - $(loadingScreen.element).height()) / 2) + 'px',
            left: ((containerWidth - $(loadingScreen.element).width()) / 2) + 'px'
        });
    }

    function showLoadingScreen() {
        $(loadingScreen.element).show();
        loadingScreen.counter++;
    }

    function hideLoadingScreen() {
        loadingScreen.counter--;
        if (loadingScreen.counter === 0) {
            $(loadingScreen.element).hide();
        }
    }

    /**
     * Creates label SPAN element and appends it to Addon space
     *
     * @param label
     * @return newly created element DOM reference
     */
    function createLabelElement(label) {
        var labelElement = document.createElement('span');

        $(labelElement).addClass('image-viewer-label');
        $(labelElement).html(label.text);
        $(labelElement).css({
            top: label.top + 'px',
            left: label.left + 'px'
        });

        $(presenter.$view).append(labelElement);

        return labelElement;
    }

    function loadLabels() {
        for (var i = 0; i < presenter.configuration.labels.length; i++) {
            presenter.configuration.labels[i].element = createLabelElement(presenter.configuration.labels[i]);
        }
    }

    presenter.hideLabels = function () {
        $(presenter.$view).find('.image-viewer-label').css('visibility', 'hidden');
    };

    /**
     * Displays labels that are assigned to given frame.
     *
     * @param frame frame number counted from 1 to n
     */
    presenter.displayLabels = function (frame) {
        $(presenter.$view).find('.image-viewer-label').css('visibility', 'hidden');
        for (var i = 0; i < presenter.configuration.labels.length; i++) {
            var label = presenter.configuration.labels[i];
            for (var j = 0; j < label.frames.length; j++) {
                if (frame === label.frames[j]) {
                    $(label.element).css('visibility', 'visible');
                }
            }
        }
    };

    function attachEventHandlers() {

        if (window.navigator.msPointerEnabled) { // isWindowsMobile
            presenter.$element[0].addEventListener("MSPointerDown", touchStartCallback, false);
            presenter.$element[0].addEventListener("MSPointerUp", touchEndCallback, false);
            presenter.$element[0].addEventListener("MSPointerMove", touchMoveCallback, false);
        }
        else if (MobileUtils.isMobileUserAgent(navigator.userAgent)) {
            presenter.$element[0].ontouchstart = touchStartCallback;
            presenter.$element[0].ontouchend = touchEndCallback;
            presenter.$element[0].ontouchmove = touchMoveCallback;
        }
        else {
            presenter.$element.mousedown(mouseDownCallback);
            presenter.$element.mouseup(mouseUpCallback);
            presenter.$element.mousemove(mouseMoveCallback);
        }

        presenter.$element.click(clickHandler);

        $(watermarkElement).click(function(e) {
            e.stopPropagation();

            $(watermarkElement).hide();
            clickHandler();
        });

        if (presenter.configuration.showFrameCounter) {
            var $frameCounter = presenter.$view.find('.frame-counter:first');

            $frameCounter.find('.dot').each(function (index) {
                $(this).click(function (e) {
                    e.stopPropagation();

                    if (presenter.configuration.isClickDisabled) return;
                    if (presenter.configuration.isErrorMode && presenter.configuration.correctFrames.isExerciseMode) return;
                    if (index === presenter.configuration.currentFrame) return;

                    hideWatermarkIfVisible();

                    presenter.moveToFrame(index + 1);
                });
            });
        }
    }

    function loadImagesCallback(preview) {
        if (!presenter.configuration.correctFrames.isExerciseMode) {
            presenter.getMaxScore = undefined;
            presenter.getScore = undefined;
            presenter.getErrorCount = undefined;
        }

        if (!preview) {
            loadSounds();

            if (!presenter.configuration.isClickDisabled) {
                attachEventHandlers();
            }
        }
        presenter.$view.trigger("onLoadImageCallbackEnd");
    }

    function loadImageEndCallback() {
        var configuration = presenter.configuration;
        var state = JSON.parse(configuration.savedState);
        configuration.currentFrame = state.currentFrame;
        configuration.currentVisibility = state.currentVisibility;
        configuration.showWatermark = state.showWatermark;
        configuration.showWatermarkbyDefault = state.showWatermarkbyDefault;
        configuration.shouldCalcScore = state.shouldCalcScore;
        configuration.isClickDisabled = state.isClickDisabled;
        configuration.isClickDisabledbyDefault = state.isClickDisabledbyDefault;

        if(!configuration.showWatermark) {
            $(watermarkElement).remove();
        }
        presenter.setVisibility(configuration.currentVisibility);
        presenter.changeFrame(false, false, false);
    }

    function presenterLogic(view, model, preview) {
        presenter.addonId = model.ID;
        presenter.$view = $(view);
        presenter.model = model;
        presenter.preview = preview;
        presenter.$element = $(presenter.$view.find('.image-viewer:first')[0]);
        presenter.$elementHelper = $(presenter.$view.find('.image-viewer-helper:first')[0]);
        loadingScreen.element = presenter.$view.find('.image-viewer-loading-image:first')[0];
        watermarkElement = presenter.$view.find('.image-viewer-watermark:first')[0];

        if (!preview) {
            var loadingSrc = DOMOperationsUtils.getResourceFullPath(playerController, "media/loading.gif");
            if (loadingSrc) $(loadingScreen.element).attr('src', loadingSrc);
        }

        var configuration = presenter.validateModel(model);
        if (configuration.isError) {
            showErrorMessage(view, configuration.errorCode);
        } else {
            showLoadingScreen();

            presenter.configuration = configuration;
            presenter.configuration.frameWidthPercentage = 100 / (presenter.configuration.frames - 1);
            presenter.configuration.isErrorMode = false;

            // Initialize mouse data
            presenter.mouseData = {
                isMouseDown : false,
                oldPosition : { x: 0, y: 0 },
                isMouseDragged : false
            };

            if (preview) {
                presenter.configuration.currentFrame = presenter.configuration.showFrame <= presenter.configuration.frames ? presenter.configuration.showFrame - 1 : 0;
            } else {
                presenter.setCurrentFrame();
            }

            setContainerDimensions(view);
            prepareLoadingScreen(model.Width, model.Height);
            presenter.adjustFrameCounter();
            loadLabels();

            presenter.$view.bind("onLoadImageEnd", function (event, isPreview) {
                loadImagesCallback(isPreview);
            });

            loadImage(preview);
            presenter.setVisibility(presenter.configuration.defaultVisibility);
            if (presenter.configuration.defaultVisibility) {
                presenter.displayLabels(1);
            }
        }
    }

    presenter.adjustFrameCounter = function () {
        var $wrapper = presenter.$view.find('.frame-counter-wrapper:first'), i, $dot,
            $frameCounter = $wrapper.find('.frame-counter:first');

        if (!presenter.configuration.showFrameCounter) {
            $wrapper.remove();
            return;
        }

        for (i = 0; i < presenter.configuration.frames - 1; i++) {
            $dot = $(document.createElement('div'));
            $dot.addClass('dot');
            $frameCounter.append($dot);
        }
    };

    presenter.changeCurrentDot = function () {
        var $frameCounter = presenter.$view.find('.frame-counter:first');

        $frameCounter.find('.dot.current').removeClass('current');
        $frameCounter.find('.dot:eq(' + presenter.configuration.currentFrame + ')').addClass('current');
    };

    presenter.setCurrentFrame = function() {
        if(presenter.configuration.initialFrame) {
            presenter.configuration.currentFrame = presenter.configuration.initialFrame - 1;
        } else if(presenter.configuration.isRandomFrame) {
            presenter.configuration.currentFrame = presenter.getRandomFrame();
        } else {
            presenter.configuration.currentFrame = 0;
        }
    };

    presenter.next = function() {
        var currentFrame = presenter.configuration.currentFrame,
            framesCount = presenter.configuration.frames;

        presenter.configuration.shouldCalcScore = true;
        presenter.configuration.currentFrame = currentFrame === framesCount - 1 ? 0 : currentFrame + 1;
        presenter.changeFrame(false, false, true);
    };

    presenter.previous = function() {
        var currentFrame = presenter.configuration.currentFrame,
            framesCount = presenter.configuration.frames;

        presenter.configuration.shouldCalcScore = true;
        presenter.configuration.currentFrame = currentFrame === 0 ? framesCount - 1 : currentFrame - 1;
        presenter.changeFrame(false, true, true);
    };

    presenter.isValidFrameNumber = function(frame, framesCount) {
        return !isNaN(frame) && frame > 0 && frame <= framesCount;
    };

    presenter.moveToFrameCommand = function(params) {
        var framesCount = presenter.configuration.frames,
            currentFrame = presenter.configuration.currentFrame,
            validatedFrame = ModelValidationUtils.validateIntegerInRange(params[0], framesCount, 1);

        presenter.configuration.shouldCalcScore = true;

        if (validatedFrame.isValid && validatedFrame.value - 1 !== currentFrame) {
            var isReverseOrder = currentFrame > validatedFrame.value - 1;
            presenter.configuration.currentFrame = validatedFrame.value - 1;
            presenter.changeFrame(false, isReverseOrder, true);
        }
    };

    presenter.moveToFrame = function (frame) {
        presenter.moveToFrameCommand([frame]);
    };

    presenter.isValidFrameName = function (frameName) {
        var isInvalid = !frameName || frameName === "";

        return !isInvalid;
    };

    presenter.findFrame = function (name, frames) {
        for (var i = 0, length = frames.length; i < length; i++) {
            if (frames[i].name == name) {
                return {
                    found: true,
                    frameNumber: parseInt(frames[i].frame, 10)
                }
            }
        }

        return {
            found: false
        };
    };

    presenter.moveToFrameNameCommand = function (params) {
        var frameFindResult, frameNumber;

        presenter.configuration.shouldCalcScore = true;

        if (!presenter.isValidFrameName(params[0])) return;

        frameFindResult = presenter.findFrame(params[0], presenter.configuration.frameNames);
        if (!frameFindResult.found) return;

        frameNumber = frameFindResult.frameNumber;
        if (frameNumber - 1 !== presenter.configuration.currentFrame) {
            var currentFrame = presenter.configuration.currentFrame;
            var isReverseOrder = currentFrame > frameNumber - 1;
            presenter.configuration.currentFrame = frameNumber - 1;
            presenter.changeFrame(false, isReverseOrder, true);
        }
    };

    presenter.moveToFrameName = function (frameName) {
        presenter.moveToFrameNameCommand([frameName]);
    };

    presenter.getRandomFrame = function() {
        var frames = presenter.configuration.frames;
        return Math.floor( Math.random() * frames );
    };

    presenter.setClickDisabled = function() {
    	presenter.configuration.isClickDisabled = true;
    	hideWatermarkIfVisible();
    };
    presenter.setClickEnabled = function() {
    	presenter.configuration.isClickDisabled = false;
    	if (presenter.configuration.showWatermarkbyDefault) {
    		showWatermarkIfNotVisible();
    	}
    };

    presenter.executeCommand = function(name, params) {
        if (presenter.configuration.isErrorMode && presenter.configuration.correctFrames.isExerciseMode) return;

        var commands = {
            'next': presenter.next,
            'previous': presenter.previous,
            'moveToFrame': presenter.moveToFrameCommand,
            'moveToFrameName': presenter.moveToFrameNameCommand,
            'getCurrentFrame': presenter.getCurrentFrame,
            'show': presenter.show,
            'hide': presenter.hide,
            'markAsCorrect': presenter.markAsCorrect,
            'markAsWrong': presenter.markAsWrong,
            'setClickDisabled': presenter.setClickDisabled,
            'setClickEnabled': presenter.setClickEnabled
        };

        return Commands.dispatch(commands, name, params, presenter);
    };

    presenter.setVisibility = function(isVisible) {
        presenter.$view.css("visibility", isVisible ? "visible" : "hidden");
    };

    presenter.show = function() {
        presenter.configuration.shouldCalcScore = true;
        presenter.setVisibility(true);
        presenter.displayLabels(presenter.configuration.currentFrame + 1);
        presenter.configuration.currentVisibility = true;
    };

    presenter.hide = function() {
        presenter.configuration.shouldCalcScore = true;
        presenter.setVisibility(false);
        presenter.hideLabels();
        presenter.configuration.currentVisibility = false;
    };

    presenter.markAsCorrect = function() {
        presenter.$element.addClass('correct');
        presenter.$element.removeClass('wrong');
    };

    presenter.markAsWrong = function() {
        presenter.$element.addClass('wrong');
        presenter.$element.removeClass('correct');
    };

    presenter.getCurrentFrame = function () {
        return presenter.configuration.currentFrame + 1;
    };

    presenter.createPreview = function(view, model){
        presenterLogic(view, model, true);
    };

    presenter.run = function(view, model){
        this.upgradedModel = this.upgradeModel(model);
        presenterLogic(view, this.upgradedModel, false);
    };

    presenter.validateAnimation = function (animation) {
        return ModelValidationUtils.validateOption(presenter.ANIMATION, animation);
    };

    presenter.validateFrameSize = function(size) {
        return ModelValidationUtils.validateOption(presenter.FRAME_SIZE, size);
    };

    presenter.validateImage = function(imageSrc) {
        if (ModelValidationUtils.isStringWithPrefixEmpty(imageSrc, '/file/')) {
            return { isError : true, errorCode: "IM_01" };
        }

        return { isError: false, image : imageSrc };
    };

    presenter.validateFrameNumber = function(frame) {
        if (!frame) return { isError: true, errorCode: "FN_01" };

        var parsedFrame = parseInt(frame, 10);

        if (isNaN(parsedFrame)) return { isError:true, errorCode:"FN_02" };
        if (parsedFrame < 1) return { isError:true, errorCode:"FN_03" };

        return { isError: false, frames : parsedFrame };
    };

    presenter.validateSound = function(soundsArray) {
        var sounds = [];

        if (soundsArray && $.isArray(soundsArray)) {
            for (var i = 0; i < soundsArray.length; i++) {
                var isMP3Empty = ModelValidationUtils.isStringWithPrefixEmpty(soundsArray[i]['MP3 sound'], '/file/');
                var isAACEmpty = ModelValidationUtils.isStringWithPrefixEmpty(soundsArray[i]['AAC sound'], '/file/');
                var isOGGEmpty = ModelValidationUtils.isStringWithPrefixEmpty(soundsArray[i]['OGG sound'], '/file/');
                var isEmpty = isMP3Empty && isAACEmpty && isOGGEmpty;

                sounds.push({
                    AAC : isAACEmpty ? "" : soundsArray[i]['AAC sound'],
                    OGG : isOGGEmpty ? "" : soundsArray[i]['OGG sound'],
                    MP3 : isMP3Empty ? "" : soundsArray[i]['MP3 sound'],
                    isEmpty : isEmpty
                });
            }
        }

        return {
            sounds : sounds
        };
    };

    presenter.validateFrameNames = function(frameNames, frames) {
        var frameNamesArray = [];

        var frameNamesEmpty = false;
        if (frameNames && $.isArray(frameNames)) {
            var firstName = frameNames[0].name;
            var firstFrame = frameNames[0].frame;
            if (firstFrame === "" && firstName === "") {
                frameNamesEmpty = true;
            } else {
                for (var j = 0; j < frameNames.length; j++) {
                    var frame = frameNames[j]['frame'];
                    var name = frameNames[j]['name'];

                    if (!name || name === null || name === "") {
                        return {
                            isError: true,
                            errorCode: "FN_04"
                        };
                    }

                    var validatedFrame = presenter.validateFrameNumber(frame);
                    if (validatedFrame.isError) {
                        return {
                            isError: true,
                            errorCode: validatedFrame.errorCode
                        };
                    }

                    if (validatedFrame.frames > frames) {
                        return {
                            isError: true,
                            errorCode: "FN_05"
                        };
                    }

                    frameNamesArray.push({
                        name: name,
                        frame: frame
                    });
                }
            }
        }

        return {
            isError: false,
            frameNames: frameNamesArray,
            frameNamesEmpty: frameNamesEmpty
        };
    };

    /**
     * This function validates and converts number from string representation to integer value
     */
    presenter.validatePosition = function (position) {
        var validatedPosition = ModelValidationUtils.validateInteger(position);

        if (!validatedPosition.isValid) {
            return { isError:true };
        }

        if (validatedPosition.value < 0) {
            return { isError:true };
        }

        return {
            isError: false,
            position: validatedPosition.value
        };
    };

    /**
     * Removes duplicates from sorted array of numbers
     *
     * @param array sorted array of numbers
     * @return array with removed duplicates
     */
    presenter.removeDuplicatesFromArray = function(array) {
        if (array.length === 0) {
            return [];
        }

        var results = [];

        for (var i = 0; i < array.length - 1; i++) {
            if (array[i + 1] !== array[i]) {
                results.push(array[i]);
            }
        }

        results.push(array[array.length - 1]);

        return results;
    };

    /**
     * Validates frames numbers list separated with commas
     *
     * @param frames string representation of frames list
     * @param count frames count
     *
     * @return array of frames numbers counted from 1 to n
     */
    presenter.validateFramesList = function (frames, count) {
        var list = [];

        if (ModelValidationUtils.isStringEmpty(frames)) {
            return {
                isError: true,
                errorCode: "FL_01"
            };
        }

        var regExp = new RegExp('[0-9a-zA-Z\,\-]+'); // Only digits and commas are allowed in slides list
        var matchResult = frames.match(regExp);
        if (matchResult === null || frames.length !== matchResult[0].length) {
            return {
                isError: true,
                errorCode: "FL_02"
            };
        }

        var splittedFrames = frames.split(',');
        for (var i = 0; i < splittedFrames.length; i++) {
            if (ModelValidationUtils.isStringEmpty(splittedFrames[i])) {
                return {
                    isError: true,
                    errorCode: "FL_04"
                };
            }

            var indexOfRange = splittedFrames[i].search('-');
            if (indexOfRange !== -1) {
                var rangeEnd = splittedFrames[i].split('-')[1];
                var validatedRangeEnd = ModelValidationUtils.validateIntegerInRange(rangeEnd, count, 1);
                if (!validatedRangeEnd.isValid) {
                    return {
                        isError: true,
                        errorCode: "FL_05"
                    };
                }

                var rangeStart = splittedFrames[i].split('-')[0];
                var validatedRangeStart = ModelValidationUtils.validateIntegerInRange(rangeStart, rangeEnd.value, 1);
                if (!validatedRangeStart.isValid || validatedRangeStart.value > validatedRangeEnd.value) {
                    return {
                        isError: true,
                        errorCode: "FL_05"
                    };
                }

                for (var frameNumber = validatedRangeStart.value; frameNumber <= validatedRangeEnd.value; frameNumber++) {
                    list.push(frameNumber);
                }

                continue;
            }

            var validatedFrame = ModelValidationUtils.validateIntegerInRange(splittedFrames[i], count, 1);
            if (!validatedFrame.isValid) {
                return {
                    isError: true,
                    errorCode: "FL_03"
                };
            }

            list.push(validatedFrame.value);
        }

        list = list.sort();
        list = presenter.removeDuplicatesFromArray(list);

        return {
            isError: false,
            list: list
        };
    };

    presenter.validateLabels = function (labelsArray, framesCount) {
        var labels = [], element;

        // Ugly fix for Editor problems
        if (labelsArray === undefined) return { isError:false, labels:labels };

        for (var i = 0; i < labelsArray.length; i++) {
            element = {
                Text: labelsArray[i].Text,
                Frames: labelsArray[i].Frames,
                Top: labelsArray[i].Top,
                Left: labelsArray[i].Left
            };

            if (ModelValidationUtils.isArrayElementEmpty(element)) {
                if (labelsArray.length == 1)
                    return { isError:false, labels:labels };
                else
                    return { isError:true, errorCode:"LA_04" };
            }

            if (ModelValidationUtils.isStringEmpty(element.Text)) {
                return { isError:true, errorCode:"LA_01" };
            }

            var validatedFramesList = presenter.validateFramesList(element.Frames, framesCount);
            if (validatedFramesList.isError) return { isError:true, errorCode: validatedFramesList.errorCode };

            var validatedTopPosition = ModelValidationUtils.validateInteger(element.Top);
            if (!validatedTopPosition.isValid) return { isError:true, errorCode:"LA_02" };

            var validatedLeftPosition = ModelValidationUtils.validateInteger(element.Left);
            if (!validatedLeftPosition.isValid) return { isError:true, errorCode:"LA_03" };

            var text = {
                text: element.Text,
                frames: validatedFramesList.list,
                top: validatedTopPosition.value,
                left: validatedLeftPosition.value
            };

            labels.push(text);
        }

        return { isError:false, labels:labels };
    };

    presenter.validateInitialFrame = function(frame, framesCount) {
        if(frame && !ModelValidationUtils.validateIntegerInRange(frame, framesCount, 1).isValid) {
            return {
                isError: true,
                errorCode: 'IF_01'
            }
        }
        var isValid = this.isValidFrameNumber(frame, framesCount);
        return isValid ? frame : false;
    };

    presenter.validateOpacity = function (opacity) {
        if (ModelValidationUtils.isStringEmpty(opacity)) return { isError: false, opacity: 1.0 };

        var parsedOpacity = ModelValidationUtils.validateFloatInRange(opacity, 1.0, 0.0, 2);
        if (!parsedOpacity.isValid) return { isError: true };

        return { isError: false, opacity: parsedOpacity.value };
    };

    presenter.validateCorrectFrame = function (frames, framesCount) {
        if (ModelValidationUtils.isStringEmpty(frames)) return { isExerciseMode: false };

        var framesArray = frames.split(',');
        var correctFrames = [];

        for (var i = 0, length = framesArray.length; i < length; i++) {
            var frameNumber = ModelValidationUtils.validateInteger(framesArray[i]);
            if (!frameNumber.isValid) return { errorCode: "FN_02" };

            frameNumber = ModelValidationUtils.validateIntegerInRange(framesArray[i], framesCount, 1);
            if (!frameNumber.isValid) return { errorCode: "CF_01" };

            correctFrames.push(frameNumber.value - 1);
        }

        return { frames: correctFrames, isExerciseMode: true };
    };

    presenter.validateModel = function(model) {
        var validatedImage = presenter.validateImage(model.Image);
        if (validatedImage.isError) return { isError: true, errorCode: validatedImage.errorCode };

        var validatedFrames = presenter.validateFrameNumber(model.Frames);
        if (validatedFrames.isError) return { isError: true, errorCode: validatedFrames.errorCode };

        var validatedFrameNames = presenter.validateFrameNames(model["Frame names"], validatedFrames.frames);
        if (validatedFrameNames.isError) return { isError: true, errorCode: validatedFrameNames.errorCode };

        var validatedLabels = presenter.validateLabels(model.Labels, validatedFrames.frames);
        if (validatedLabels.isError) return { isError: true, errorCode: validatedLabels.errorCode };

        var validatedCorrectFrames = presenter.validateCorrectFrame(model["Correct frames"], validatedFrames.frames);
        if (validatedCorrectFrames.errorCode) return { isError: true, errorCode: validatedCorrectFrames.errorCode };

        var showFrame = 1;
        var validatedShowFrame = ModelValidationUtils.validateIntegerInRange(model["Show frame"], validatedFrames.frames, 1);
        if (validatedShowFrame.isValid) {
            showFrame = validatedShowFrame.value;
        }

        var validatedInitialFrame = this.validateInitialFrame(model["Initial frame"], validatedFrames.frames);
        if(validatedInitialFrame.errorCode) return { isError: true, errorCode: validatedInitialFrame.errorCode };

        var validatedSound = presenter.validateSound(model.Sounds);
        var isClickDisabled = ModelValidationUtils.validateBoolean(model.isClickDisabled);
        var frameSize = presenter.validateFrameSize(model["Frame size"]);
        var animation = presenter.validateAnimation(model.Animation);
        var defaultVisibility = ModelValidationUtils.validateBoolean(model["Is Visible"]);
        var isDoNotReset = ModelValidationUtils.validateBoolean(model["Do not reset"]);
        var isRandomFrame = ModelValidationUtils.validateBoolean(model["Random frame"]);

        return {
            isError: false,
            imageSrc : validatedImage.image,
            frames : validatedFrames.frames,
            sounds : validatedSound.sounds,
            frameNames: validatedFrameNames.frameNames,
            frameNamesEmpty: validatedFrameNames.frameNamesEmpty,
            isClickDisabled: isClickDisabled,
            isClickDisabledbyDefault: isClickDisabled,
            frameSize: frameSize,
            labels: validatedLabels.labels,
            showWatermark: ModelValidationUtils.validateBoolean(model["Show watermark"]),
            showWatermarkbyDefault: ModelValidationUtils.validateBoolean(model["Show watermark"]),
            showFrame: showFrame,
            animation: animation,
            correctFrames: validatedCorrectFrames,
            defaultVisibility: defaultVisibility,
            currentVisibility: defaultVisibility,
            isDoNotReset: isDoNotReset,
            isRandomFrame: isRandomFrame,
            initialFrame: validatedInitialFrame,
            showFrameCounter: ModelValidationUtils.validateBoolean(model["Show frame counter"]),
            shouldCalcScore: false
        };
    };

    function animateLinearly(element, backgroundPositionValue) {
        $(element).animate({
            'background-position':backgroundPositionValue
        }, 500, "linear");
    }

    function animateLinearlyLastElement(element) {
        $(element).animate({
            'background-position':(100 + presenter.configuration.frameWidthPercentage) + '%'
        }, {
            duration:500,
            easing:"linear",
            complete:function () {
                $(element).css({
                    'background-position':'-' + presenter.configuration.frameWidthPercentage + '%'
                });
                $(element).animate({
                    'background-position':'0%'
                }, 500, "linear")
            }
        });
    }

    function animateLinearlyFirstElement(element) {
        $(element).animate({
            'background-position':'-' + presenter.configuration.frameWidthPercentage + '%'
        }, {
            duration:500,
            easing:"linear",
            complete:function () {
                $(element).css({
                    'background-position':(100 + presenter.configuration.frameWidthPercentage) + '%'
                });
                $(element).animate({
                    'background-position':'100%'
                }, 500, "linear")
            }
        });
    }

    function animateFading(element, backgroundPositionValue) {
        $(element).fadeOut({
            duration: 750,
            complete: function() {
                $(element).css({
                    'background-position': backgroundPositionValue
                });
                $(element).fadeIn(750);
            }
        });
    }

    presenter.changeBackgroundPosition = function (isPreview, element, isReverseOrder) {
        var backgroundPositionValue = (presenter.configuration.currentFrame * presenter.configuration.frameWidthPercentage + '%');

        if (isPreview || presenter.configuration.animation === 'NONE') {
            $(element).css('background-position', backgroundPositionValue);
        } else {
            switch (presenter.configuration.animation) {
                case 'LINEAR':
                    if (isReverseOrder) {
                        if (presenter.configuration.currentFrame === presenter.configuration.frames - 1) {
                            animateLinearlyFirstElement(element);
                        } else {
                            animateLinearly(element, backgroundPositionValue);
                        }
                    } else {
                        if (presenter.configuration.currentFrame !== 0) {
                            animateLinearly(element, backgroundPositionValue);
                        } else {
                            animateLinearlyLastElement(element);
                        }
                    }
                    break;
                case 'FADING':
                    animateFading(element, backgroundPositionValue);
                    break;
            }
        }
    };

    presenter.changeFrameLogic = function (isPreview, triggerEvent) {
        presenter.changeCurrentDot();

        if (presenter.configuration.currentFrame === 0) {
            if (!isPreview) presenter.stopAllAudio();
        } else {
            if (!isPreview) presenter.playAudio();
        }

        if (presenter.configuration.currentVisibility) {
            presenter.displayLabels(presenter.configuration.currentFrame + 1);
        } else {
            presenter.hideLabels();
        }

        if (triggerEvent && !isPreview) {
            presenter.triggerFrameChangeEvent(presenter.configuration.currentFrame + 1);
        }
    };
    presenter.changeFrame = function(isPreview, isReverseOrder, triggerEvent) {
        presenter.changeBackgroundPosition(isPreview, presenter.$element, isReverseOrder);
        presenter.changeFrameLogic(isPreview, triggerEvent);
    };

    presenter.stopAllAudio = function () {
        for (var i = 0; i < audioElements.length; i++) {
            if (audioElements[i] !== null ) {
                stopAudio(audioElements[i]);
            }
        }
    };

    function stopAudio(audio) {
        audio.pause();
        audio.setTime(0);
    }

    presenter.playAudio = function() {
        presenter.stopAllAudio();

        var audio = audioElements[presenter.configuration.currentFrame - 1];
        if (audio) {
            audio.play();
        }
    };

    presenter.createEventData = function(frameNumber) {
        return {
            source : this.addonId,
            item : "" + frameNumber,
            value : '',
            score : ''
        }
    };

    presenter.triggerFrameChangeEvent = function(frameNumber) {
        var eventData = this.createEventData(frameNumber);
        if (playerController != null) {
            playerController.getEventBus().sendEvent('ValueChanged', eventData);
        }
    };

    presenter.setPlayerController = function(controller) {
        playerController = controller;
    };

    presenter.isCurrentFrameCorrectlySelected = function () {
        var correctFrames = presenter.configuration.correctFrames.frames;

        for (var i = 0, length = correctFrames.length; i < length; i++) {
            if (presenter.configuration.currentFrame === correctFrames[i]) {
                return true;
            }
        }

        return false;
    };

    presenter.getState = function() {
        return JSON.stringify({
            currentFrame : this.configuration.currentFrame,
            currentVisibility : this.configuration.currentVisibility,
            showWatermark : ($(watermarkElement).is(':visible')) ? true : false,
            showWatermarkbyDefault : this.configuration.showWatermarkbyDefault, 
            isClickDisabled: presenter.configuration.isClickDisabled,
            isClickDisabledbyDefault : presenter.configuration.isClickDisabledbyDefault,
            shouldCalcScore: presenter.configuration.shouldCalcScore
        });
    };

    presenter.setState = function(state) {
        presenter.configuration.savedState = state;
        presenter.$view.bind("onLoadImageCallbackEnd", function () {
            loadImageEndCallback();
        });
    };

    presenter.reset = function() {
        presenter.configuration.shouldCalcScore = true;
        presenter.configuration.isErrorMode = false;

        if (presenter.configuration.isDoNotReset) return;

        presenter.setCurrentFrame();
        presenter.changeFrame(false, false, false);

        if (shouldShowWatermark()) {
            showWatermarkIfNotVisible();
        }
        
        presenter.configuration.isClickDisabled = presenter.configuration.isClickDisabledbyDefault;

        var isVisible = presenter.configuration.currentVisibility = presenter.configuration.defaultVisibility;
        presenter.setVisibility(isVisible);
        removeCorrectnessClasses();
    };

    presenter.getScore = function() {
        if (!presenter.configuration.correctFrames.isExerciseMode) return 0;
        if (!presenter.configuration.shouldCalcScore) return 0;

        return presenter.isCurrentFrameCorrectlySelected() ? 1 : 0;
    };

    presenter.getErrorCount = function() {
        if (!presenter.configuration.correctFrames.isExerciseMode) { return 0; }
        if (!presenter.configuration.shouldCalcScore) return 0;

        return presenter.isCurrentFrameCorrectlySelected() ? 0 : 1;
    };

    presenter.getMaxScore = function() {
        if(!presenter.configuration.correctFrames.isExerciseMode) { return 0; }
        return 1;
    };

    presenter.setShowErrorsMode = function() {
        presenter.configuration.isErrorMode = true;
        presenter.configuration.shouldCalcScore = true;

        if(!presenter.configuration.correctFrames.isExerciseMode) return;

        var isCorrect = presenter.isCurrentFrameCorrectlySelected();

        presenter.$element.addClass(isCorrect ? 'correct' : 'wrong');
    };

    function removeCorrectnessClasses() {
        presenter.$element.removeClass('correct');
        presenter.$element.removeClass('wrong');
    }

    presenter.setWorkMode = function() {
        presenter.configuration.isErrorMode = false;
        if(!presenter.configuration.correctFrames.isExerciseMode) return;

        removeCorrectnessClasses();
    };

    return presenter;
}