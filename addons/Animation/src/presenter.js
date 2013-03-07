function AddonAnimation_create (){
    var presenter = function () {};
    presenter.DOMElements = {};
    presenter.configuration = {};

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
        'FL05': "Frame list - frame numbers range incorrect!"
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

    presenter.upgradeModel = function (model) {
        return presenter.addFramesToLabels(model);
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
        var previewReducedSize = DOMOperationsUtils.calculateReducedSize(wrapper, presenter.DOMElements.preview)
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

    function animationImageLogic(animationImage) {
        $(animationImage).addClass('animation-hidden-image');
        $(presenter.DOMElements.viewContainer).append(animationImage);

        var animationWidth = presenter.configuration.dimensions.animation.width;
        var animationHeight = presenter.configuration.dimensions.animation.height;
        var animationDimensions = presenter.calculateContainerDimensions($(animationImage).width() / presenter.configuration.framesCount, $(animationImage).height(), animationWidth, animationHeight);
        var animationBackgroundSize = calculateBackgroundSize(presenter.configuration.frameSize, presenter.configuration.framesCount, presenter.IMAGE_TYPE.ANIMATION);
        var elementWidth;
        var elementHeight;

        switch (presenter.configuration.frameSize) {
            case presenter.FRAME_SIZE.ORIGINAL:
                elementWidth = $(animationImage).width() / presenter.configuration.framesCount;
                elementHeight = $(animationImage).height();
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

        $(presenter.DOMElements.animation).css({
            'background-image': 'url(' + presenter.configuration.animation + ')',
            width: elementWidth + 'px',
            height: elementHeight + 'px'
        });

        if (animationBackgroundSize) {
            $(presenter.DOMElements.animation).css('background-size', animationBackgroundSize);
        }

        $(animationImage).remove();
    }

    function loadImages(id, preview) {
        showLoadingScreen();

        $.imgpreload([presenter.configuration.image, presenter.configuration.animation], {
            all: function() {
                var isFirstPreview = $(this[0]).attr('src') == presenter.configuration.image;
                var previewImage = isFirstPreview ? this[0] : this[1];
                var animationImage = isFirstPreview ? this[1] : this[0];

                previewImageLogic(previewImage);
                animationImageLogic(animationImage);
                hideLoadingScreen();
                $(presenter.DOMElements.viewContainer).trigger("onLoadImagesEnd", [id, preview]);
            }
        });
    }

    function prepareLoadingScreen(containerWidth, containerHeight) {
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
        var pixels = $(presenter.DOMElements.animation).width() * (presenter.configuration.currentFrame);

        $(presenter.DOMElements.animation).css({
            'background-position': '-' + pixels + 'px 0px'
        });

        if (presenter.configuration.animationState === presenter.ANIMATION_STATE.STOPPED) {
            showLabelsForFrame(0);
        } else {
            showLabelsForFrame(presenter.configuration.currentFrame + 1);
        }
    }

    function prepareLabels() {
        for (var i = 0; i < presenter.configuration.labels.count; i++) {
            var label = presenter.configuration.labels.content[i];
            var labelElement = document.createElement('span');

            $(labelElement).addClass('animation-label');
            $(labelElement).html(label.text);
            $(labelElement).css({
                top: label.top,
                left: label.left,
                visibility: 'hidden'
            });

            $(presenter.DOMElements.viewContainer).append(labelElement);
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
        $.doTimeout(presenter.configuration.queueName, presenter.configuration.frameDuration, function(){
            if (presenter.configuration.animationState !== presenter.ANIMATION_STATE.PLAYING) {
                return false;
            }

            if (presenter.configuration.currentFrame < presenter.configuration.framesCount - 1) {
                presenter.configuration.currentFrame++;
                changeFrame();
            } else {
                if (presenter.configuration.loop || presenter.configuration.resetOnEnd) {
                    presenter.configuration.currentFrame = 0;
                    changeFrame();
                } else {
                    presenter.configuration.animationState = presenter.ANIMATION_STATE.ENDED;
                    $.doTimeout(presenter.configuration.queueName, false);
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
        });
    };

    presenter.pause = function() {
        if (presenter.configuration.animationState !== presenter.ANIMATION_STATE.PLAYING) return;

        presenter.configuration.animationState = presenter.ANIMATION_STATE.PAUSED;
        if (presenter.configuration.watermarkOptions.show) {
            $(presenter.DOMElements.watermark).show();
        }
        presenter.configuration.watermarkOptions.clicked = false;
        $.doTimeout(presenter.configuration.queueName, true);
    };

    presenter.stop = function() {
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
    };

    function elementClickHandler() {
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
        $(presenter.DOMElements.preview).click(elementClickHandler);
        $(presenter.DOMElements.animation).click(elementClickHandler);
        $(presenter.DOMElements.watermark).click(elementClickHandler);
    }

    function presenterLogic(view, model, preview) {
        setDOMElementsHrefsAndSelectors(view);
        presenter.model = presenter.upgradeModel(model);
        presenter.configuration = presenter.validateModel(presenter.model);

        if (presenter.configuration.isError) {
            DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, presenter.configuration.errorCode);
            return;
        }

        setElementsDimensions(view);
        prepareLoadingScreen(model.Width, model.Height);

        $(presenter.DOMElements.viewContainer).bind("onLoadImagesEnd", function(event, id, preview) {
            loadImagesEndCallback(id, preview);
        });

        loadImages(model.ID, preview);
        prepareLabels();
        showLabelsForFrame(0);
    }

    presenter.createPreview = function(view, model){
        presenterLogic(view, model, false);
    };

    presenter.run = function(view, model){
        presenterLogic(view, model, false);
    };

    presenter.reset = function(){
        this.stop();
        presenter.configuration.watermarkOptions.clicked = false;
        if(presenter.configuration.watermarkOptions.show) {
            $(presenter.DOMElements.watermark).show();
        } else {
            $(presenter.DOMElements.watermark).hide();
        }

        presenter.configuration.currentVisibility = presenter.configuration.defaultVisibility;
        presenter.setVisibility(presenter.configuration.defaultVisibility);
        if (!presenter.configuration.defaultVisibility) {
            presenter.hideLabels();
        }
    };

    presenter.getState = function() {
        if (presenter.ANIMATION_STATE.PLAYING === presenter.configuration.animationState) {
            presenter.pause();
        }

        var state = {
            "currentFrame": presenter.configuration.currentFrame,
            "animationState": presenter.configuration.animationState,
            "currentVisibility" : presenter.configuration.currentVisibility,
            "watermarkClicked" : presenter.configuration.watermarkOptions.clicked
        };
        return JSON.stringify(state);
    };

    presenter.setState = function(stateString) {
        presenter.configuration.savedState = stateString;

        if (stateString) {
            restoreState();
        }
    };

    function restoreState() {
        var state = JSON.parse(presenter.configuration.savedState);
        presenter.configuration.currentFrame = state.currentFrame;
        presenter.configuration.animationState = state.animationState;
        presenter.configuration.watermarkOptions.clicked = state.watermarkClicked;
        changeFrame();

        if (state.currentVisibility) {
            presenter.show();
        } else {
            presenter.hide();
        }

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
    }

    function loadImagesEndCallback(id, preview) {
        if (preview) {
            return;
        }

        presenter.configuration.animationState = presenter.ANIMATION_STATE.PAUSED;
        presenter.configuration.currentFrame = 0;
        presenter.configuration.queueName = id;

        if (!presenter.configuration.isClickDisabled) {
            handleMouseActions();
        }

        Watermark.draw(presenter.DOMElements.watermark, presenter.configuration.watermarkOptions);
        if (presenter.configuration.watermarkOptions.show && !presenter.configuration.watermarkOptions.clicked) {
            $(presenter.DOMElements.watermark).show();
        } else {
            $(presenter.DOMElements.watermark).hide();
        }

        presenter.setVisibility(presenter.configuration.defaultVisibility);
        if (!presenter.configuration.defaultVisibility) {
            presenter.hideLabels();
        }

        if (presenter.configuration.savedState) {
            restoreState();
        }
    }

    presenter.play = function () {
        if (presenter.configuration.animationState === presenter.ANIMATION_STATE.ENDED) {
            presenter.stop();
        } else {
            presenter.playAnimation();
        }
    };

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

    presenter.hide = function() {
        this.configuration.currentVisibility = false;
        if(presenter.configuration.animationState == presenter.ANIMATION_STATE.PLAYING) {
            this.pause();
        }
        this.setVisibility(false);
        this.hideLabels();
    };

    presenter.show = function() {
        this.configuration.currentVisibility = true;
        if(presenter.configuration.animationState == presenter.ANIMATION_STATE.PLAYING) {
            this.playAnimation();
        }
        this.setVisibility(true);
        showLabelsForFrame(presenter.configuration.currentFrame + 1);
    };

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

        var defaultVisibility = ModelValidationUtils.validateBoolean(model["Is Visible"]);
        return {
            isError: false,
            image: model["Preview image"],
            animation: model.Animation,
            framesCount: validatedFramesCount.framesCount,
            frameDuration: validatedFrameDuration.frameDuration,
            loop: ModelValidationUtils.validateBoolean(model.Loop),
            labels: validatedLabels.labels,
            frameSize: presenter.validateFrameSize(model["Frame size"]),
            resetOnEnd: !ModelValidationUtils.validateBoolean(model["Don't reset on end"]),
            isClickDisabled: ModelValidationUtils.validateBoolean(model["Is click disabled"]),
            defaultVisibility: defaultVisibility,
            currentVisibility: defaultVisibility,
            watermarkOptions: validatedOptions
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

    function showLabelsForFrame(frame) {
        var labels = presenter.configuration.labels.content;
        var indexes = presenter.getLabelIndexesForFrame(labels, frame);
        presenter.hideLabels();

        for (var i = 0, length = indexes.length; i < length; i++) {
            $(presenter.DOMElements.viewContainer).find('.animation-label:eq(' + indexes[i] + ')').css('visibility', 'visible');
        }
    }

    return presenter;
}