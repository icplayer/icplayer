function AddonAnimation_create (){
    var deferredSyncQueue = window.DecoratorUtils.DeferredSyncQueue(deferredQueueDecoratorChecker);

    var presenter = function () {};
    presenter.DOMElements = {};
    presenter.configuration = {};
    
    var isSpeaking = false; //tts is currently attempting to play the alternative text (but not the preview alt text)

    presenter.ERROR_CODES = {
        'AI_01': "Animation image wasn't set or was set incorrectly!",
        'PI_01': "Preview image wasn't set or was set incorrectly!",
        'FC_01': "Frames count must be positive integer number!",
        'FD_01': "Frame duration time must be positive integer number!",
        'L_01': "Text value cannot be empty!",
        'L_02': "Top position value is invalid!",
        'L_03': "Left position value is invalid!",
        'WM_01': "Watermark color must be provided in #RRGGBB format!",
        'WM_02': "Watermark opacity must be a value from 0.0 to 1.0!",
        'WM_03': "Watermark size must be a positive integer number!",
        'FL01': "Frame list - undefined or empty!",
        'FL02': "Frame list - syntax incorrect (probably wrong separator)!",
        'FL03': "Frame list - frame number invalid!",
        'FL04': "Frame list - frame number missing inside list!",
        'FL05': "Frame list - frame numbers range incorrect!",
        'ID_01': "Base width and height must be either positive integers or empty"
    };

    presenter.ANIMATION_STATE = {
        PAUSED: 0,
        PLAYING: 1,
        STOPPED: 2,
        ENDED: 3
    };

    presenter.FRAME_SIZE = {
        ORIGINAL: 0,
        SCALED: 1,
        STRETCHED: 2
    };

    presenter.IMAGE_TYPE = {
        PREVIEW: 0,
        ANIMATION: 1
    };

    presenter.eventBus = null;

    presenter.upgradeModel = function (model) {
        var upgradedModel = presenter.addFramesToLabels(model);
        upgradedModel = presenter.upgradeTextToSpeech(upgradedModel);
        return presenter.upgradeBaseDimensions(upgradedModel);
    };

    presenter.addFramesToLabels = function (model) {
        var upgradedModel = {}, i;
        $.extend(true, upgradedModel, model); // Deep copy of model object

        for (i = 0; i < model["Labels"].length; i++) {
            if (upgradedModel["Labels"][i]["Frames"] == undefined) {
                upgradedModel["Labels"][i]["Frames"] = "";
            }
        }

        return upgradedModel;
    };

    presenter.upgradeTextToSpeech = function (model) {
        var upgradedModel = {};
        $.extend(true, upgradedModel, model);

        if (!upgradedModel['Alternative Text']) {
            upgradedModel['Alternative Text'] = ''
        }

        if (!upgradedModel['Preview Alternative Text']) {
            upgradedModel['Preview Alternative Text'] = ''
        }

        if (!upgradedModel['speechTexts']) {
            upgradedModel['speechTexts'] = {
                Stop: {Stop: "stopped"}
            };
        }

        if (!upgradedModel['langAttribute']) {
            upgradedModel['langAttribute'] = '';
        }

        return upgradedModel;
    };

    presenter.upgradeBaseDimensions = function (model) {
        var upgradedModel = {}, i;
        $.extend(true, upgradedModel, model); // Deep copy of model object

            if (upgradedModel["Base width"] == undefined) {
                upgradedModel["Base width"] = "";
            }
            if (upgradedModel["Base height"] == undefined) {
                upgradedModel["Base height"] = "";
            }

        return upgradedModel;
    };

    function getSpeechTextProperty (rawValue, defaultValue) {
        var value = rawValue.trim();

        if (value === '') {
            return defaultValue;
        }

        return value;
    }

    presenter.getspeechTexts = function(speechTexts) {
        var speechTexts = {
            stop:    getSpeechTextProperty(speechTexts['Stop']['Stop'], "Stopped")
        };

        return speechTexts;
    };

    function setDOMElementsHrefsAndSelectors(view) {
        presenter.DOMElements.viewContainer = $(view);
        presenter.DOMElements.animation = $(view).find('.animation-image-animation:first')[0];
        presenter.DOMElements.preview = $(view).find('.animation-image-preview:first')[0];
        presenter.DOMElements.loading = $(presenter.DOMElements.viewContainer.find('.animation-loading-image:first')[0]);
        presenter.DOMElements.watermark = $(presenter.DOMElements.viewContainer.find('.animation-watermark:first')[0]);
    }

    // Calculate scale for image containing element depending on frame aspect ratio
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

    function setElementsDimensions(wrapper) {
        var previewReducedSize = DOMOperationsUtils.calculateReducedSize(wrapper, presenter.DOMElements.preview);
        $(presenter.DOMElements.preview).css({
            width: previewReducedSize.width,
            height: previewReducedSize.height
        });

        var animationReducedSize = DOMOperationsUtils.calculateReducedSize(wrapper, presenter.DOMElements.animation);
        $(presenter.DOMElements.animation).css({
            width: animationReducedSize.width,
            height: animationReducedSize.height
        });

        presenter.configuration.dimensions = {
            preview: { width: previewReducedSize.width, height: previewReducedSize.height },
            animation: { width: animationReducedSize.width, height: animationReducedSize.height }
        };
    }

    function deferredQueueDecoratorChecker() {
        return presenter.isLoaded;
    }

    // This function returns string containing CSS declaration of elements
    // background image size in percentage measure
    function calculateBackgroundSize(size, framesCount, imageType) {
        var cssValue;

        switch(size) {
            case presenter.FRAME_SIZE.SCALED:
            case presenter.FRAME_SIZE.STRETCHED:
                cssValue = imageType === presenter.IMAGE_TYPE.ANIMATION ? (framesCount * 100) : 100;
                cssValue += '% 100%';
                break;
            default:
                cssValue = '';
        }

        return cssValue;
    }

    function previewImageLogic(previewImage) {
        var isScaledMode = presenter.configuration.frameSize === presenter.FRAME_SIZE.SCALED;
        var previewWidth = presenter.configuration.dimensions.preview.width;
        var previewHeight = presenter.configuration.dimensions.preview.height;

        $(previewImage).addClass('animation-hidden-image');
        $(presenter.DOMElements.viewContainer).append(previewImage);
        var previewDimensions = presenter.calculateContainerDimensions($(previewImage).width(), $(previewImage).height(), previewWidth, previewHeight);

        var previewBackgroundSize = calculateBackgroundSize(presenter.configuration.frameSize, presenter.configuration.framesCount, presenter.IMAGE_TYPE.PREVIEW);
        $(presenter.DOMElements.preview).css({
            'background-image': 'url(' + presenter.configuration.image + ')',
            width: isScaledMode ? previewDimensions.horizontal + 'px' : previewWidth + 'px',
            height: isScaledMode ? previewDimensions.vertical + 'px' : previewHeight + 'px'
        });

        if (previewBackgroundSize) {
            $(presenter.DOMElements.preview).css('background-size', previewBackgroundSize);
        }

        $(previewImage).remove();
    }

    function getCanvasFromImg(image) {
        var canvas = document.createElement('canvas');
        canvas.setAttribute('width', $(image).width());
        canvas.setAttribute('height', $(image).height());
        var ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0);

        return canvas;
    }

    function animationImageLogic(animationImage) {
        $(animationImage).addClass('animation-hidden-image');
        $(presenter.DOMElements.viewContainer).append(animationImage);

        var animationWidth = presenter.configuration.dimensions.animation.width;
        var animationHeight = presenter.configuration.dimensions.animation.height;
        var animationDimensions = presenter.calculateContainerDimensions($(animationImage).width() / presenter.configuration.framesCount, $(animationImage).height(), animationWidth, animationHeight);
        var animationBackgroundSize = calculateBackgroundSize(presenter.configuration.frameSize, presenter.configuration.framesCount, presenter.IMAGE_TYPE.ANIMATION);
        var source_width = (parseInt(presenter.configuration.oryginal_width, 10) ? presenter.configuration.oryginal_width : $(animationImage).width()) / presenter.configuration.framesCount;
        var source_height = parseInt(presenter.configuration.oryginal_height,10) ? presenter.configuration.oryginal_height : $(animationImage).height();
        var elementWidth;
        var elementHeight;

        switch (presenter.configuration.frameSize) {
            case presenter.FRAME_SIZE.ORIGINAL:
                elementWidth = source_width;
                elementHeight = source_height;
                break;
            case presenter.FRAME_SIZE.SCALED:
                elementWidth = animationDimensions.horizontal;
                elementHeight = animationDimensions.vertical;
                break;
            case presenter.FRAME_SIZE.STRETCHED:
                elementWidth = animationWidth;
                elementHeight = animationHeight;
                break;
        }
        elementWidth = Math.round(elementWidth);
        elementHeight = Math.round(elementHeight);
        var image = animationImage;

        //Repair bug with jpg in android
        if (["5.1.1", "5.0.2"].indexOf(window.MobileUtils.getAndroidVersion(navigator.userAgent)) > -1) {
            image = getCanvasFromImg(animationImage);
        }

        presenter.images = [];
        var makeFrames = function() {
            var i;
            try {
                for (i = 0; i < presenter.configuration.framesCount; i++) {
                    presenter.images.push(new presenter.ImageWrapper({
                        destinationHeight: elementHeight,
                        destinationWidth: elementWidth,
                        destinationX: 0,
                        destinationY: 0,
                        image: image,
                        sourceHeight: source_height,
                        sourceWidth: source_width,
                        sourceX: i * source_width,
                        sourceY: 0
                    }));
                }
            } catch (e) {
                if (e.name === "NS_ERROR_NOT_AVAILABLE") {
                    makeFrames();
                } else {
                    throw e;
                }
            }
        };
        makeFrames();

        var $animationDOM = $(presenter.DOMElements.animation);
        var clickhandler = $("<div></div>").css({"background":"transparent", 'width': elementWidth, 'height': elementHeight, 'position':'absolute'});
        $animationDOM.append(clickhandler);


        presenter.createCanvas(elementWidth, elementHeight);
        $animationDOM.append(presenter.canvas);


        $(presenter.DOMElements.animation).css({
            width: elementWidth + 'px',
            height: elementHeight + 'px'
        });

        if (animationBackgroundSize) {
            $(presenter.DOMElements.animation).css('background-size', animationBackgroundSize);
        }

        $(animationImage).remove();
    }

    presenter.createCanvas = function AddonAnimation_createCanvas(elementWidth, elementHeight) {
        presenter.canvas = document.createElement('canvas');
        presenter.canvas.setAttribute('width', elementWidth);
        presenter.canvas.setAttribute('height', elementHeight);

        presenter.canvasContext = presenter.canvas.getContext('2d');

        // draw first frame
        presenter.drawImage(
            presenter.canvasContext,
            presenter.images[0]
        );
    };

    presenter.drawImage = function AddonAnimation_drawImage(ctx, image) {
        drawImageIOSFix(
            ctx,
            image.image,
            image.sourceX,
            image.sourceY,
            image.sourceWidth,
            image.sourceHeight,
            image.destinationX,
            image.destinationY,
            image.destinationWidth,
            image.destinationHeight
        );
    };

    function loadImages() {
        showLoadingScreen();

        var img = $('<img src="'+ presenter.configuration.animation +'"/>').load(function() {
        	presenter.configuration.oryginal_width = this.width;
        	presenter.configuration.oryginal_height = this.height;
        	$(this).remove();
        });

        if (presenter.configuration.isPreview) {
            $.imgpreload([presenter.configuration.image], {
                all: function () {
                    previewImageLogic(this[0]);
                    hideLoadingScreen();
                }
            });
        } else {
            $.imgpreload([presenter.configuration.image, presenter.configuration.animation], {
                all: function() {
                    var isFirstPreview = $(this[0]).attr('src') == presenter.configuration.image;
                    var previewImage = isFirstPreview ? this[0] : this[1];
                    var animationImage = isFirstPreview ? this[1] : this[0];
    
                    previewImageLogic(previewImage);
                    imageLoadedCallback(animationImage);
                }
            });
        }
    }

    function imageLoadedCallback (image) {
        animationImageLogic(image);
        hideLoadingScreen();
        loadImagesEndCallback();
    }
    
    function prepareLoadingScreen(containerWidth, containerHeight) {
        if (presenter.configuration.isPreview) return;

        var loadingSrc = DOMOperationsUtils.getResourceFullPath(presenter.playerController, "media/loading.gif");
        if (loadingSrc) presenter.DOMElements.loading.attr('src', loadingSrc);

        $(presenter.DOMElements.loading).css({
            top: ((containerHeight - $(presenter.DOMElements.loading).height()) / 2) + 'px',
            left: ((containerWidth - $(presenter.DOMElements.loading).width()) / 2) + 'px'
        });
    }

    function showLoadingScreen() {
        $(presenter.DOMElements.loading).show();
    }

    function hideLoadingScreen() {
        $(presenter.DOMElements.loading).hide();
    }

    function changeFrame() {
        var i = presenter.configuration.currentFrame;

        presenter.drawImage(presenter.canvasContext, presenter.images[i]);

        if (presenter.configuration.animationState === presenter.ANIMATION_STATE.STOPPED) {
            showLabelsForFrame(0);
        } else {
            showLabelsForFrame(presenter.configuration.currentFrame + 1);
        }
    }

    function prepareLabels() {
        var scaleX = 1.0;
        var scaleY = 1.0;
        if (presenter.configuration.baseDimensions.width != 0) {
            scaleX = presenter.configuration.dimensions.animation.width / presenter.configuration.baseDimensions.width;
        }
        if (presenter.configuration.baseDimensions.height != 0) {
            scaleY = presenter.configuration.dimensions.animation.height / presenter.configuration.baseDimensions.height;
        }

        for (var i = 0; i < presenter.configuration.labels.count; i++) {
            var label = presenter.configuration.labels.content[i];
            var labelElement = document.createElement('span');

            $(labelElement).addClass('animation-label');
            $(labelElement).html(label.text);
            $(labelElement).css({
                top: label.top * scaleY,
                left: label.left * scaleX,
                visibility: 'hidden'
            });
            if (scaleX != 1.0 || scaleY != 1.0) {
                $(labelElement).css(generateTransformDict(scaleX, scaleY));
            }
            $(presenter.DOMElements.viewContainer).append(labelElement);
        }
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

    presenter.playAnimation = function() {
        $(presenter.DOMElements.preview).hide();
        $(presenter.DOMElements.animation).show();
        presenter.configuration.animationState = presenter.ANIMATION_STATE.PLAYING;
        showLabelsForFrame(presenter.configuration.currentFrame + 1);
        if (presenter.configuration.watermarkOptions.show) {
            $(presenter.DOMElements.watermark).hide();
        }
        presenter.configuration.watermarkOptions.clicked = true;
        $.doTimeout(presenter.configuration.queueName, presenter.configuration.frameDuration, presenter.onTimeoutCallback);
    };

    presenter.onTimeoutCallback = function AddonAnimation_onTimeoutCallback() {
        if (presenter.configuration.animationState !== presenter.ANIMATION_STATE.PLAYING) {
                return false;
        }

        if (presenter.configuration.currentFrame < presenter.configuration.framesCount - 1) {
            presenter.configuration.currentFrame++;
            changeFrame();
        } else {
            if (presenter.configuration.loop || presenter.configuration.resetOnEnd) {
                presenter.configuration.currentFrame = 0;
                presenter.sendEndAnimationEvent();
                changeFrame();
            } else {
                presenter.configuration.animationState = presenter.ANIMATION_STATE.ENDED;
                $.doTimeout(presenter.configuration.queueName, false);
                presenter.endAnimationHandler();
                return false;
            }
        }

        if (presenter.configuration.currentFrame === 0 && !presenter.configuration.loop) {
            if (presenter.configuration.resetOnEnd) {
                presenter.stop();
                return false;
            }
        }

        return true;
    };

    presenter.pause = deferredSyncQueue.decorate(function() {
        if (presenter.configuration.animationState !== presenter.ANIMATION_STATE.PLAYING) return;

        presenter.configuration.animationState = presenter.ANIMATION_STATE.PAUSED;
        if (presenter.configuration.watermarkOptions.show) {
            $(presenter.DOMElements.watermark).show();
        }
        presenter.configuration.watermarkOptions.clicked = false;
        $.doTimeout(presenter.configuration.queueName, true);
    });

    presenter.stop = deferredSyncQueue.decorate(function() {
        $(presenter.DOMElements.preview).show();
        $(presenter.DOMElements.animation).hide();
        presenter.configuration.animationState = presenter.ANIMATION_STATE.STOPPED;
        presenter.configuration.currentFrame = 0;
        changeFrame();
        if (presenter.configuration.watermarkOptions.show) {
            $(presenter.DOMElements.watermark).show();
        }
        presenter.configuration.watermarkOptions.clicked = false;
        $.doTimeout(presenter.configuration.queueName, false);
    });

    function elementClickHandler(e) {
        e.stopPropagation();

        switch (presenter.configuration.animationState) {
            case presenter.ANIMATION_STATE.PAUSED:
            case presenter.ANIMATION_STATE.STOPPED:
                presenter.playAnimation();
                break;

            case presenter.ANIMATION_STATE.PLAYING:
                presenter.pause();
                break;

            case presenter.ANIMATION_STATE.ENDED:
                presenter.stop();
                break;
        }
    }

    function handleMouseActions() {
        if (presenter.configuration.isClickDisabled) return;

        $(presenter.DOMElements.preview).click(elementClickHandler);
        $(presenter.DOMElements.animation).click(elementClickHandler);
        $(presenter.DOMElements.watermark).click(elementClickHandler);
    }

    presenter.setPlayerController = function (controller) {
        presenter.playerController = controller;

        presenter.eventBus = controller.getEventBus();
    };

    function presenterLogic(view, model, isPreview) {
        setDOMElementsHrefsAndSelectors(view);

        presenter.model = presenter.upgradeModel(model);
        presenter.configuration = presenter.validateModel(presenter.model);
        presenter.configuration.isPreview = isPreview;

        if (presenter.configuration.isError) {
            DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, presenter.configuration.errorCode);
            return;
        }

        presenter.isLoaded = false;
        setElementsDimensions(view);
        prepareLoadingScreen(model.Width, model.Height);

        presenter.imagesLoadedDfd = new jQuery.Deferred();
        presenter.imagesLoaded = presenter.imagesLoadedDfd.promise();

        $.when(presenter.imagesLoaded).then(function () {
            presenter.isLoaded = true;

            deferredSyncQueue.resolve()
        });

        loadImages();
        prepareLabels();
        showLabelsForFrame(0);
    }

    presenter.createPreview = function(view, model){
        presenterLogic(view, model, true);
    };

    presenter.destroy = function AddonAnimation_destroy() {
        presenter.canvas = null;
        presenter.canvasContext = null;
    };

    presenter.run = function(view, model){
        presenterLogic(view, model, false);
    };

    presenter.reset = deferredSyncQueue.decorate(function(){
        this.stop();
        presenter.configuration.watermarkOptions.clicked = false;
        if(presenter.configuration.watermarkOptions.show) {
            $(presenter.DOMElements.watermark).show();
        } else {
            $(presenter.DOMElements.watermark).hide();
        }

        presenter.configuration.isVisible = presenter.configuration.isVisibleByDefault;
        presenter.setVisibility(presenter.configuration.isVisibleByDefault);
        if (!presenter.configuration.isVisibleByDefault) {
            presenter.hideLabels();
        }
    });

    presenter.getState = function() {
        if (!presenter.isLoaded) return '';

        if (presenter.ANIMATION_STATE.PLAYING === presenter.configuration.animationState) {
            presenter.pause();
        }

        return JSON.stringify({
            currentFrame: presenter.configuration.currentFrame,
            animationState: presenter.configuration.animationState,
            isVisible : presenter.configuration.isVisible,
            watermarkClicked : presenter.configuration.watermarkOptions.clicked
        });
    };

    presenter.setState = deferredSyncQueue.decorate(function(stateString) {
        if (!stateString) return;

        var state = JSON.parse(stateString);

        presenter.configuration.currentFrame = state.currentFrame;
        presenter.configuration.animationState = state.animationState;
        presenter.configuration.watermarkOptions.clicked = state.watermarkClicked;
        changeFrame();

        if (state.isVisible) {
            presenter.show();
        } else {
            presenter.hide();
        }

        if (!presenter.configuration.watermarkOptions.clicked) {
            showLabelsForFrame(0);
        }

        //noinspection FallthroughInSwitchStatementJS
        switch (presenter.configuration.animationState) {
            case presenter.ANIMATION_STATE.PLAYING:
                presenter.playAnimation();
                break;
            case presenter.ANIMATION_STATE.PAUSED:
            case presenter.ANIMATION_STATE.ENDED:
                $(presenter.DOMElements.preview).hide();
                $(presenter.DOMElements.animation).show();
                break;
        }

        if (presenter.configuration.watermarkOptions.show && !presenter.configuration.watermarkOptions.clicked) {
            $(presenter.DOMElements.watermark).show();
        } else {
            $(presenter.DOMElements.watermark).hide();
        }
    });

    function loadImagesEndCallback () {
        presenter.configuration.animationState = presenter.ANIMATION_STATE.PAUSED;
        presenter.configuration.currentFrame = 0;

        handleMouseActions();

        Watermark.draw(presenter.DOMElements.watermark, presenter.configuration.watermarkOptions);
        if (presenter.configuration.watermarkOptions.show && !presenter.configuration.watermarkOptions.clicked) {
            $(presenter.DOMElements.watermark).show();
        } else {
            $(presenter.DOMElements.watermark).hide();
        }

        presenter.setVisibility(presenter.configuration.isVisibleByDefault);
        if (!presenter.configuration.isVisibleByDefault) {
            presenter.hideLabels();
        }

        presenter.imagesLoadedDfd.resolve();
    }

    presenter.play = deferredSyncQueue.decorate(function () {
        if (presenter.configuration.animationState === presenter.ANIMATION_STATE.ENDED) {
            presenter.stop();
        } else {
            presenter.playAnimation();
            if (presenter.playerController.isWCAGOn()) {
                isSpeaking = true;

                var speakCallback = function () {
                    isSpeaking = false;
                    presenter.endAnimationHandler();
                };

                presenter.speakWithDelay([window.TTSUtils.getTextVoiceObject(presenter.configuration.altText, presenter.configuration.lang)], speakCallback);
            }
        }
    });

    presenter.executeCommand = function(name, params) {
        var commands = {
            'stop': presenter.stop,
            'pause': presenter.pause,
            'play': presenter.play,
            'show': presenter.show,
            'hide': presenter.hide
        };

        Commands.dispatch(commands, name, params, presenter);
    };

    presenter.setVisibility = function(isVisible) {
        $(presenter.DOMElements.viewContainer).css("visibility", isVisible ? "visible" : "hidden");
    };

    presenter.hideLabels = function() {
        $(presenter.DOMElements.viewContainer).find('.animation-label').each(function () {
            $(this).css('visibility', 'hidden');
        });
    };

    presenter.hide = deferredSyncQueue.decorate(function() {
        this.configuration.isVisible = false;
        if(presenter.configuration.animationState == presenter.ANIMATION_STATE.PLAYING) {
            this.pause();
        }
        this.setVisibility(false);
        this.hideLabels();
    });

    presenter.show = deferredSyncQueue.decorate(function() {
        this.configuration.isVisible = true;
        if(presenter.configuration.animationState == presenter.ANIMATION_STATE.PLAYING) {
            this.playAnimation();
        }
        this.setVisibility(true);
        showLabelsForFrame(presenter.configuration.currentFrame + 1);
    });

    // This function validates and converts number from string representation to positive integer value
    presenter.sanitizePositiveNumber = function(number) {
        if (!number) {
            return {
                isError: true
            };
        }

        var parsedNumber = parseInt(number, 10);
        if (isNaN(parsedNumber)) {
            return {
                isError: true
            };
        }

        if (parsedNumber < 0) {
            return {
                isError: true
            };
        }

        return {
            isError: false,
            number: parsedNumber
        };
    };

    // If validation error occurs then one of the following error codes are returned
    // L_01 - 'Text' value invalid
    // L_02 - 'Top' value invalid
    // L_03 - 'Left' value invalid
    // L_04 - Label empty
    presenter.validateLabels = function(labelsArray, framesCount) {
        var labels = { count: 0, content: [] };

        if (ModelValidationUtils.isArrayEmpty(labelsArray)) {
            return { isError: false, labels: labels };
        }

        for (var i = 0; i  < labelsArray.length; i++) {
            if (ModelValidationUtils.isArrayElementEmpty(labelsArray[i])) {
                return { isError: true, errorCode: "L_04" };
            }

            if (ModelValidationUtils.isStringEmpty(labelsArray[i].Text)) {
                return { isError: true, errorCode: "L_01" };
            }

            var sanitizedTopPosition = presenter.sanitizePositiveNumber(labelsArray[i].Top);
            if (sanitizedTopPosition.isError) {
                return { isError: true, errorCode: "L_02" };
            }

            var sanitizedLeftPosition = presenter.sanitizePositiveNumber(labelsArray[i].Left);
            if (sanitizedLeftPosition.isError) {
                return { isError: true, errorCode: "L_03" };
            }

            if (ModelValidationUtils.isStringEmpty(labelsArray[i].Frames)) {
                labelsArray[i].Frames = "0";
            }

            var convertedFrames = ImageViewer.convertFramesList(labelsArray[i].Frames, 0, framesCount);
            if (convertedFrames.isError) {
                return { isError: true, errorCode: convertedFrames.errorCode};
            }

            var label = {
                text: labelsArray[i].Text,
                top: sanitizedTopPosition.number,
                left: sanitizedLeftPosition.number,
                frames: convertedFrames.list
            };

            labels.content.push(label);
            labels.count++;
        }

        return { isError: false, labels: labels };
    };

    presenter.validateFramesCount = function(framesCount) {
        var sanitizedFramesCount = presenter.sanitizePositiveNumber(framesCount);

        if (sanitizedFramesCount.isError) {
            return {
                isError: true,
                errorCode: "FC_01"
            };
        }

        return {
            isError: false,
            framesCount: sanitizedFramesCount.number
        };
    };

    presenter.validateFrameDuration = function(frameDuration) {
        var sanitizedFrameDuration = presenter.sanitizePositiveNumber(frameDuration);

        if (sanitizedFrameDuration.isError) {
            return {
                isError: true,
                errorCode: "FD_01"
            };
        }

        return {
            isError: false,
            frameDuration: sanitizedFrameDuration.number
        };
    };

    presenter.validateFrameSize = function(frameSize) {
        var result;

        switch (frameSize) {
            case "Keep aspect ratio":
                result = presenter.FRAME_SIZE.SCALED;
                break;
            case "Stretch":
                result = presenter.FRAME_SIZE.STRETCHED;
                break;
            default:
                result = presenter.FRAME_SIZE.ORIGINAL;
                break;
        }

        return result;
    };

    presenter.validateModel = function(model) {
        var speechTexts = presenter.getspeechTexts(model['speechTexts']);

        if (ModelValidationUtils.isStringEmpty(model["Preview image"])) {
            return { isError: true, errorCode: "PI_01" };
        }

        if (ModelValidationUtils.isStringEmpty(model.Animation)) {
            return { isError: true, errorCode: "AI_01" };
        }

        var validatedFramesCount = presenter.validateFramesCount(model["Frames count"]);
        if (validatedFramesCount.isError) {
            return {
                isError: true,
                errorCode: validatedFramesCount.errorCode
            };
        }

        var validatedFrameDuration = presenter.validateFrameDuration(model["Frame duration"]);
        if (validatedFrameDuration.isError) {
            return {
                isError: true,
                errorCode: validatedFrameDuration.errorCode
            };
        }

        var validatedLabels = presenter.validateLabels(model.Labels, validatedFramesCount.framesCount);
        if (validatedLabels.isError) {
            return {
                isError: true,
                errorCode: validatedLabels.errorCode
            };
        }

        var watermarkOptions = {
            "color": model["Watermark color"],
            "opacity": model["Watermark opacity"],
            "size": model["Watermark size"]
        };
        var validatedOptions = Watermark.validateOptions(watermarkOptions);
        validatedOptions.show = ModelValidationUtils.validateBoolean(model["Show watermark"]);
        validatedOptions.clicked = false;

        var isVisibleByDefault = ModelValidationUtils.validateBoolean(model["Is Visible"]);

        var baseDimensions = {
            width: 0,
            height: 0
        };

        if (model['Base width'].trim().length !== 0) {
            var validatedBaseWidth = ModelValidationUtils.validatePositiveInteger(model['Base width']);
            if (validatedBaseWidth.isValid) {
                baseDimensions.width = validatedBaseWidth.value;
            } else {
                validatedBaseWidth.errorCode = 'ID_01';
                validatedBaseWidth.isError = true;
                return validatedBaseWidth;
            }
        }
        if (model['Base height'].trim().length !== 0) {
            var validatedBaseHeight = ModelValidationUtils.validatePositiveInteger(model['Base height']);
            if (validatedBaseHeight.isValid) {
                baseDimensions.height = validatedBaseHeight.value;
            } else {
                validatedBaseHeight.errorCode = 'ID_01';
                validatedBaseHeight.isError = true;
                return validatedBaseHeight;
            }
        }

        return {
            isError: false,
            queueName: model.ID,
            image: model["Preview image"],
            animation: model.Animation,
            framesCount: validatedFramesCount.framesCount,
            frameDuration: validatedFrameDuration.frameDuration,
            loop: ModelValidationUtils.validateBoolean(model.Loop),
            labels: validatedLabels.labels,
            frameSize: presenter.validateFrameSize(model["Frame size"]),
            resetOnEnd: !ModelValidationUtils.validateBoolean(model["Don't reset on end"]),
            isClickDisabled: ModelValidationUtils.validateBoolean(model["Is click disabled"]),
            isVisibleByDefault: isVisibleByDefault,
            isVisible: isVisibleByDefault,
            watermarkOptions: validatedOptions,
            addonID: model.ID,
            altText: model['Alternative Text'],
            altTextPreview: model['Preview Alternative Text'],
            lang: model['langAttribute'],
            speechTexts: speechTexts,
            baseDimensions: baseDimensions
        };
    };

    presenter.getLabelIndexesForFrame = function (labels, frame) {
        var indexes = [];

        if(!labels) return indexes;

        for (var i = 0, length = labels.length; i < length; i++) {
            if (labels[i].frames.indexOf(frame) !== -1) {
                indexes.push(i);
            }
        }

        return indexes;
    };

    presenter._internal = {
        deferredSyncQueue: deferredSyncQueue
    };

    function showLabelsForFrame(frame) {
        var labels = presenter.configuration.labels.content,
            indexes = presenter.getLabelIndexesForFrame(labels, frame);

        presenter.hideLabels();

        if (!presenter.configuration.isVisible) return;

        for (var i = 0, length = indexes.length; i < length; i++) {
            $(presenter.DOMElements.viewContainer).find('.animation-label:eq(' + indexes[i] + ')').css('visibility', 'visible');
        }
    }

    // This function is from https://github.com/stomita/ios-imagefile-megapixel
    function detectVerticalSquash(img) {
        if (!navigator.userAgent.match(/(iPad|iPhone|iPod touch);.*CPU.*OS 7_\d/i)){
            return 1;
        }

        try {
            var iw = img.naturalWidth, ih = img.naturalHeight;
            var canvas = document.createElement('canvas');
            canvas.width = 1;
            canvas.height = ih;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            var data = ctx.getImageData(0, 0, 1, ih).data;
            // search image edge pixel position in case it is squashed vertically.
            var sy = 0;
            var ey = ih;
            var py = ih;
            while (py > sy) {
                var alpha = data[(py - 1) * 4 + 3];
                if (alpha === 0) {
                    ey = py;
                } else {
                    sy = py;
                }
                py = (ey + sy) >> 1;
            }
            var ratio = (py / ih);
        }
        catch (err) {
            // we expect Security error on SVG files
            return 1;
        }
        return (ratio === 0) ? 1 : ratio;
    }

    function drawImageIOSFix(ctx, img, sx, sy, sw, sh, dx, dy, dw, dh) {
        var vertSquashRatio = detectVerticalSquash(img);
        ctx.clearRect(0, 0, presenter.canvas.width, presenter.canvas.height);
        ctx.drawImage(img, sx * vertSquashRatio, sy * vertSquashRatio,
            sw * vertSquashRatio, sh * vertSquashRatio,
            dx, dy, dw, dh );
    }

    presenter.sendEndAnimationEvent = function () {
        var eventData = {
            'source': presenter.configuration.addonID,
            'item': '',
            'value': 'ended',
            'score': ''
        };
        
        presenter.eventBus.sendEvent('ValueChanged', eventData);
    };

    presenter.endAnimationHandler = function () {
        if (presenter.configuration.animationState == presenter.ANIMATION_STATE.ENDED &&
            (!presenter.playerController.isWCAGOn() || !isSpeaking)) {
            presenter.sendEndAnimationEvent();
            if (presenter.playerController.isWCAGOn()) {
                presenter.stop();
            }
        }
    };

    presenter.getTextToSpeechOrNull = function (playerController) {
        if (playerController) {
            return playerController.getModule('Text_To_Speech1');
        }

        return null;
    };

    presenter.speak = function(data, callback) {
        var tts = presenter.getTextToSpeechOrNull(presenter.playerController);

        if (tts && presenter.playerController.isWCAGOn()) {
            tts.speakWithCallback(data, callback);
        }
    };

    var delayedSpeakInterval = null; // only used by speakWithDelay, which is why they are here and not at the top of the file
    var delayedSpeakTimeout = null;
    //This method works like speak, except that it waits for TTS to be idle instead of interrupting it
    presenter.speakWithDelay = function (data, callback) {
        presenter.stopDelayedTTS();

        function setSpeakInterval (data, callback) {
            delayedSpeakInterval = setInterval(function () {
                var speechSynthSpeaking = false;
                var responsiveVoiceSpeaking = false;

                // Detect if TTS is idle
                if ('speechSynthesis' in window) {
                    speechSynthSpeaking = window.speechSynthesis.speaking;
                }
                if (window.responsiveVoice) {
                    responsiveVoiceSpeaking = window.responsiveVoice.isPlaying();
                }

                if (!speechSynthSpeaking && !responsiveVoiceSpeaking) {
                    // If TTS is idle, pass data to TTS and break the loop
                    clearInterval(delayedSpeakInterval);
                    delayedSpeakInterval = null;
                    var tts = presenter.getTextToSpeechOrNull(presenter.playerController);
                    if (tts && presenter.playerController.isWCAGOn()) {
                        tts.speakWithCallback(data, callback);
                    }
                }
            }, 200);
        }

        /*
        * The timeout is used to ensure that if animation is triggered by another addon,
        * that addon has the opportunity to use TTS first, since animation acts as feedback
        */
        delayedSpeakTimeout = setTimeout(function(){ setSpeakInterval(data, callback); }, 300);
    };

    presenter.stopDelayedTTS = function() {
        if(delayedSpeakTimeout) {
            clearTimeout(delayedSpeakTimeout);
            delayedSpeakTimeout = null;
        }
         if(delayedSpeakInterval) {
            clearInterval(delayedSpeakInterval);
            delayedSpeakInterval = null;
        }
    };

    presenter.keyboardController = function(keycode, isShiftKeyDown, event) {

        var keys = {
            ENTER: 13,
            SPACE: 32
        };

        var enter = function() {
            event.preventDefault();
            presenter.stopDelayedTTS();
            if(!isShiftKeyDown) {
                presenter.speak([window.TTSUtils.getTextVoiceObject(presenter.configuration.altTextPreview, presenter.configuration.lang)]);
            }
        };

        var space = function() {
            event.preventDefault();
            presenter.stopDelayedTTS();
            if (presenter.configuration.animationState == presenter.ANIMATION_STATE.PLAYING ||
                presenter.configuration.animationState == presenter.ANIMATION_STATE.ENDED ||
                isSpeaking) {
                presenter.stop();
                presenter.speak([window.TTSUtils.getTextVoiceObject(presenter.configuration.speechTexts.stop)]);
                isSpeaking = false;
            } else {
                presenter.stop();
                presenter.play();
            }
        };

        var mapping = {};
        mapping[keys.ENTER] = enter;
        mapping[keys.SPACE] = space;

        try {
            mapping[keycode]();
        } catch (er) {
        }
    };

    presenter.isEnterable = function() {return false};

    presenter.markerWCAG = {}; // This is a marker identifying the addon as supporting WCAG to the editor

    /**
     *
     * @param configuration {object}
     * @param configuration.image source image
     * @param configuration.sourceX {number} source x position
     * @param configuration.sourceY {number} source y position
     * @param configuration.sourceWidth {number} source width
     * @param configuration.sourceHeight {number} source height
     * @param configuration.destinationWidth {number} destination width
     * @param configuration.destinationHeight {number} destination height
     * @param configuration.destinationX {number} where source should be placed in destination x position
     * @param configuration.destinationY {number} where source should be placed in destination y position
     * @constructor
     */
    presenter.ImageWrapper = function (configuration) {
        this.image = configuration.image;
        this.sourceX = configuration.sourceX;
        this.sourceY = configuration.sourceY;
        this.sourceWidth = configuration.sourceWidth;
        this.sourceHeight = configuration.sourceHeight;
        this.destinationWidth = configuration.destinationWidth;
        this.destinationHeight = configuration.destinationHeight;
        this.destinationX = configuration.destinationX;
        this.destinationY = configuration.destinationY;
    };

    return presenter;
}
