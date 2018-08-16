function AddonImage_Viewer_Button_Controlled_Public_create(){
    var presenter = function(){};

    var viewerElement;
    var loadingScreen = {
        element: null,
        counter: 0
    };
    var audioElements = [];

    presenter.lastMovePosition = null;
    presenter.totalPercentage = 0;
    presenter.lastReceivedEvent = null;
    presenter.isMouseDown = false;

    presenter.ERROR_CODES = {
        'I_01': "Image must be uploaded to display Addon!",
        'FN_01': "Frame name cannot be empty!",
        'FN_02': "Frame number must be set to properly display Addon",
        'FN_03': "Frame number is not a number!",
        'FN_04': "Frame number must be a positive integer!",
        'FN_05': "Frame names - frame number must be between 1 and frames count",
        'L_01': "Label text cannot be empty!",
        'L_02': "Label top value incorrect!",
        'L_03': "Label left value incorrect!",
        'L_04': "All label fields must be filled correctly!",
        'FL_01': "Label must be assigned to at least one frame!",
        'FL_02': "Frames list syntax incorrect! Check for separators!",
        'FL_03': "Frame number is not a number!",
        'FL_04': "Frame number must be positive integer!",
        'FL_05': "Frame number cannot be higher than Frames!",
        'FL_06': "Frame number missing inside list!",
        'FL_07': "Frame numbers range incorrect!"
    };

    presenter.FRAME_SIZE = {
        ORIGINAL: 0,
        SCALED: 1,
        STRETCHED: 2
    };

    function setContainerDimensions(width, height) {
        var viewerDimensions = DOMOperationsUtils.getOuterDimensions(viewerElement);
        var viewerDistances = DOMOperationsUtils.calculateOuterDistances(viewerDimensions);
        var viewerWidth = width - viewerDistances.horizontal;
        var viewerHeight = height - viewerDistances.vertical;

        $(viewerElement).css({
            width: viewerWidth,
            height: viewerHeight
        });

        presenter.configuration.containerDimensions = {
            width: viewerWidth,
            height: viewerHeight
        };
    }

    function loadSounds(){
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


    function getDirection(type, touch) {
        var direction = null;

        if(type == 'touchstart') {
            presenter.lastMovePosition = touch.pageX;
            return false;
        } else if(presenter.lastMovePosition == touch.pageX) {
            return false;
        } else {
            direction = presenter.lastMovePosition > touch.pageX ? 'left' : 'right';
            presenter.lastMovePosition = touch.pageX;
        }

        if(type == 'touchend') {
            presenter.lastMovePosition = null;
            return false;
        }

        return direction;
    }

    function getMouseDirection(evt) {
        var direction = null;
        if(presenter.lastMovePosition > evt.pageX) {
            direction = 'left';
        } else if(presenter.lastMovePosition < evt.pageX){
            direction = 'right';
        } else {
            direction = null;
        }

        presenter.lastMovePosition = evt.pageX;
        return direction;
    }

    function setTotalPercentage(percentage, direction) {
        if(direction == 'right') {
            presenter.totalPercentage += percentage;
        } else {
            presenter.totalPercentage -= percentage;
        }
    }

    function calculateShift() {
        return (presenter.configuration.frameWidthPercentage / 100) * 30;
    }

    function shouldChangeFrame(shiftValue) {
        return (Math.abs(presenter.totalPercentage) >= shiftValue) &&
            (presenter.lastReceivedEvent == 'touchend' || presenter.lastReceivedEvent == 'mouseup')
    }

    function shouldMoveBackToDefaultPosition() {
        return (presenter.lastReceivedEvent == 'touchend' || presenter.lastReceivedEvent == 'mouseup');
    }

    function changeFrameDependingOnShiftValue(shiftValue) {
        if(presenter.totalPercentage <= shiftValue) {
            presenter.next();
        } else {
            presenter.previous();
        }
        presenter.totalPercentage = 0;
    }

    function moveBackToDefaultPosition() {
        $(viewerElement).css({
            'background-position' : presenter.configuration.currentFrame * presenter.configuration.frameWidthPercentage + '%'
        });
        presenter.totalPercentage = 0;
    }

    function calculateBackgroundPosition() {
        var base = (presenter.configuration.currentFrame * presenter.configuration.frameWidthPercentage);
        return base - presenter.totalPercentage;
    }

    function isTap(evt) {
        return presenter.lastReceivedEvent == 'touchstart' && evt.type == 'touchend';
    }

    function isClick(evt) {
        return presenter.lastReceivedEvent == 'mousedown' && evt.type == 'mouseup';
    }

    function setMouseDown(evt) {
        if(evt.type == 'mousedown') {
            presenter.isMouseDown = true;
            presenter.lastMovePosition = evt.pageX;
            viewerElement.unbind('click');
        } else if(evt.type == 'mouseup') {
            presenter.isMouseDown = false;
            presenter.lastMovePosition = null;
        }
    }

    function handleClickAction() {
        viewerElement.click(function(e) {
            e.stopPropagation();

            presenter.configuration.currentFrame = presenter.configuration.currentFrame === presenter.configuration.frames - 1 ? 0 : presenter.configuration.currentFrame + 1;

            presenter.changeFrame(this, presenter.configuration, true);
        });
    }


    function handleMouseDragActions(shiftValue, percentage) {
        viewerElement.on('mousedown mousemove mouseup', function(evt) {
            evt.preventDefault();
            setMouseDown(evt);

            if(isClick(evt)) {
                handleClickAction();
                presenter.lastReceivedEvent = null;
            } else {
                presenter.lastReceivedEvent = evt.type;
            }

            if(evt.type != 'mousemove') {
                if(shouldChangeFrame(shiftValue)) {
                    changeFrameDependingOnShiftValue(shiftValue)
                } else if(shouldMoveBackToDefaultPosition()) {
                    moveBackToDefaultPosition();
                }
            }

            if(presenter.isMouseDown) {
                var direction = getMouseDirection(evt);
                if(direction) {
                    setTotalPercentage(percentage, direction);
                    $(this).css({
                        'background-position' : calculateBackgroundPosition() + '%'
                    })
                }
            }
        });
    }

    function handleTouchAction(shiftValue, percentage) {

        viewerElement.on('touchstart touchmove touchend', function(evt){
            evt.preventDefault();
            evt.stopPropagation();

            if(isTap(evt)) {
                presenter.lastReceivedEvent = null;
                viewerElement.trigger('click');
            } else {
                presenter.lastReceivedEvent = evt.type;
            }

            var touch = event.touches[0] || event.changedTouches[0];
            var direction = getDirection(evt.type, touch);

            if(shouldChangeFrame(shiftValue)) {
                changeFrameDependingOnShiftValue(shiftValue)
            } else if(shouldMoveBackToDefaultPosition()) {
                moveBackToDefaultPosition();
            }

            if(direction){
                setTotalPercentage(percentage, direction);
                $(this).css({
                    'background-position' : calculateBackgroundPosition() + '%'
                });
            }
        });
    }

    // Calculate scale for image containing element depending on frame aspect ratio
    presenter.calculateContainerDimensions = function(imageWidth, imageHeight, containerWidth, containerHeight) {
        var imageRatio = imageWidth / imageHeight;
        var containerRatio = containerWidth / containerHeight;

        var horizontal;
        var vertical;

        if (imageRatio >= containerRatio) {
            horizontal = containerWidth;
            vertical = containerWidth / imageRatio;
        } else {
            vertical = containerHeight;
            horizontal = containerHeight * imageRatio;
        }


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
            case presenter.FRAME_SIZE.SCALED:
            case presenter.FRAME_SIZE.STRETCHED:
                cssValue = framesCount * 100;
                cssValue += '% 100%';
                break;
            default:
                cssValue = '';
        }

        return cssValue;
    }

    function loadImage(preview) {
        var tempImageElement = document.createElement('img');
        $(tempImageElement).addClass('image-viewer-hidden-image');
        $(tempImageElement).attr('src', presenter.configuration.imageSrc);
        $(presenter.$view).append(tempImageElement);

        $(tempImageElement).load(function() {
            var containerWidth = presenter.configuration.containerDimensions.width;
            var containerHeight = presenter.configuration.containerDimensions.height;
            var containerDimensions = presenter.calculateContainerDimensions($(this).width() / presenter.configuration.frames, $(this).height(), containerWidth, containerHeight);
            var backgroundSize = calculateBackgroundSize(presenter.configuration.frameSize, presenter.configuration.frames);

            var elementWidth;
            var elementHeight;

            switch (presenter.configuration.frameSize) {
                case presenter.FRAME_SIZE.ORIGINAL:
                    elementWidth = $(tempImageElement).width() / presenter.configuration.frames;
                    elementHeight = $(tempImageElement).height();
                    break;
                case presenter.FRAME_SIZE.SCALED:
                    elementWidth = containerDimensions.horizontal;
                    elementHeight = containerDimensions.vertical;
                    break;
                case presenter.FRAME_SIZE.STRETCHED:
                    elementWidth = containerWidth;
                    elementHeight = containerHeight;
                    break;
            }

            viewerElement.css({
                width: elementWidth + 'px',
                height: elementHeight + 'px',
                backgroundImage: "url('" + presenter.configuration.imageSrc + "')"
            });

            if (backgroundSize) {
                $(viewerElement).css('background-size', backgroundSize);
            }

            $(this).remove();
            presenter.changeFrame(viewerElement, presenter.configuration, false);

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
            left: label.left + 'px',
            visibility: 'hidden'
        });

        $(presenter.$view).append(labelElement);

        return labelElement;
    }

    function loadLabels() {
        for (var i = 0; i < presenter.configuration.labels.length; i++) {
            presenter.configuration.labels[i].element = createLabelElement(presenter.configuration.labels[i]);
        }
    }

    function hideLabels() {
        $(presenter.$view).find('.image-viewer-label').css('visibility', 'hidden');
    }

    /**
     * Displays labels that are assigned to given frame.
     *
     * @param frame frame number counted from 1 to n
     */
    function displayLabels(frame) {
        hideLabels();

        for (var i = 0; i < presenter.configuration.labels.length; i++) {
            var label = presenter.configuration.labels[i];
            for (var j = 0; j < label.frames.length; j++) {
                if (frame === label.frames[j]) {
                    $(label.element).css('visibility', 'visible');
                }
            }
        }
    }

    function loadImagesCallback(isPreview) {
        if (!isPreview) {
            loadSounds();

            if (!presenter.configuration.isClickDisabled) {
                var shiftValue = calculateShift();
                var percentage = (viewerElement.width() / presenter.configuration.frames) / 100;
                handleClickAction();
                handleTouchAction(shiftValue, percentage);
                handleMouseDragActions(shiftValue, percentage);
            }

            presenter.setVisibility(presenter.configuration.defaultVisibility);
        }

        presenter.imageLoadedDeferred.resolve();
    }

    function loadImageEndCallback() {
        var configuration = presenter.configuration;

        presenter.setVisibility(presenter.configuration.currentVisibility);
        presenter.changeFrame(viewerElement, configuration, true);
    }

    presenter.setPlayerController = function (controller) {
        presenter.playerController = controller;
    };

    function presenterLogic(view, model, preview) {
        presenter.imageLoadedDeferred = new jQuery.Deferred();
        presenter.imageLoaded = presenter.imageLoadedDeferred.promise();

        presenter.$view = $(view);
        viewerElement = presenter.$view.find('.image-viewer:first');
        loadingScreen.element = presenter.$view.find('.image-viewer-loading-image:first')[0];

        if (!preview) {
            var loadingSrc = DOMOperationsUtils.getResourceFullPath(presenter.playerController, "media/loading.gif");
            if (loadingSrc) $(loadingScreen.element).attr('src', loadingSrc);
        }

        presenter.configuration = presenter.validateModel(model);
        if (presenter.configuration.isError) {
            DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, presenter.configuration.errorCode);
        } else {
            showLoadingScreen();
            presenter.configuration.frameWidthPercentage = 100 / (presenter.configuration.frames - 1);
            presenter.configuration.flags = [];

            if (preview) {
                presenter.configuration.currentFrame = presenter.configuration.showFrame <= presenter.configuration.frames ? presenter.configuration.showFrame - 1 : 0;
            } else {
                presenter.configuration.currentFrame = 0;
            }

            setContainerDimensions(model.Width, model.Height);
            prepareLoadingScreen(model.Width, model.Height);
            loadLabels();

            presenter.$view.bind("onLoadImageEnd", function (event, isPreview) {
                loadImagesCallback(isPreview);
            });

            loadImage(preview);
            if (presenter.configuration.currentVisibility) {
                displayLabels(0);
            }
        }
    }

    presenter.changeFlag = function (flag) {
        var frame, element = presenter.$view.find('.image-viewer:first')[0];
        flag = parseInt(flag, 10);

        if (!isNaN(flag) && flag > 0) {
            var oldFlag = presenter.configuration.flags[flag];
            presenter.configuration.flags[flag] = (!oldFlag || oldFlag == 0) ? 1 : 0;

            frame = 0;
            for (var i in presenter.configuration.flags) {
                if (presenter.configuration.flags[i] == 1) {
                    frame += Math.pow(2, i - 1);
                }
            }

            if (frame >= 0 && frame <= presenter.configuration.frames - 1) {
                presenter.configuration.currentFrame = frame;
                presenter.changeFrame(element, presenter.configuration, true);
            }
        }
    };

    presenter.next = function() {
        var currentFrame = presenter.configuration.currentFrame;
        var framesCount = presenter.configuration.frames;

        presenter.configuration.currentFrame = currentFrame === framesCount - 1 ? 0 : currentFrame + 1;
        presenter.changeFrame(viewerElement, presenter.configuration, true);
    };

    presenter.previous = function() {
        var currentFrame = presenter.configuration.currentFrame;
        var framesCount = presenter.configuration.frames;

        presenter.configuration.currentFrame = currentFrame === 0 ? framesCount - 1 : currentFrame - 1;
        presenter.changeFrame(viewerElement, presenter.configuration, true);
    };

    presenter.changeFlagCommand = function (params) {
        presenter.changeFlag(params[0]);
    };

    presenter.moveToFrame = function (frame) {
        var element = presenter.$view.find('.image-viewer:first')[0];
        frame = parseInt(frame, 10);

        if (!isNaN(frame) && frame > 0 && frame <= presenter.configuration.frames) {
            presenter.configuration.currentFrame = frame - 1;
            presenter.changeFrame(element, presenter.configuration, true);
        }
    };

    presenter.moveToFrameCommand = function (params) {
        presenter.moveToFrame(params[0]);
    };

    presenter.moveToFrameName = function (frameName) {
        if (ModelValidationUtils.isStringEmpty(frameName) || presenter.configuration.frameNamesEmpty) {
            return;
        }

        var element = presenter.$view.find('.image-viewer:first')[0], frame, isFrameFound;

        isFrameFound = false;
        for (var i = 0; i < presenter.configuration.frameNames.length; i++) {
            if (presenter.configuration.frameNames[i].name == frameName) {
                frame = presenter.configuration.frameNames[i].frame;
                isFrameFound = true;
                break;
            }
        }

        if (isFrameFound) {
            presenter.configuration.currentFrame = frame - 1;
            presenter.changeFrame(element, presenter.configuration, true);
        }
    };

    presenter.moveToFrameNameCommand = function (params) {
        presenter.moveToFrameName(params[0]);
    };

    presenter.executeCommand = function(name, params) {
        var commands = {
            'show': presenter.show,
            'hide': presenter.hide,
            'changeFlag': presenter.changeFlagCommand,
            'moveToFrame': presenter.moveToFrameCommand,
            'moveToFrameName': presenter.moveToFrameNameCommand
        };

        Commands.dispatch(commands, name, params, presenter);
    };

    presenter.setVisibility = function(isVisible) {
        presenter.$view.css("visibility", isVisible ? "visible" : "hidden");
    };

    presenter.show = function() {
        presenter.setVisibility(true);
        presenter.configuration.currentVisibility = true;
        displayLabels(presenter.configuration.currentFrame + 1);
    };

    presenter.hide = function() {
        presenter.setVisibility(false);
        presenter.configuration.currentVisibility = false;
        hideLabels();
    };

    presenter.createPreview = function(view, model){
        presenterLogic(view, model, true);
    };

    presenter.run = function(view, model){
        presenterLogic(view, model, false);
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

    /**
     * Function returns errorCode if any of this errors occurs:
     * FN_02 - frame number empty
     * FN_03 - frame number is not a number
     * FN_04 - frame number negative
     *
     * @return errorCode
     */
    presenter.validateFramesCount = function(frames) {
        if (!frames) {
            return {
                isError: true,
                errorCode: "FN_02"
            };
        } else {
            var parsedFrames = parseInt(frames, 10);
            if (isNaN(parsedFrames)) {
                return {
                    isError: true,
                    errorCode: "FN_03"
                };
            } else if (parsedFrames < 1 ) {
                return {
                    isError: true,
                    errorCode: "FN_04"
                };
            }
        }

        return {
            isError: false,
            frames : parsedFrames
        };
    };

    presenter.validateSound = function(soundsArray) {
        var sounds = [];

        if (soundsArray && $.isArray(soundsArray)) {
            for (var i = 0; i < soundsArray.length; i++) {
                var isMP3Empty = soundsArray[i]['MP3 sound'] === "" || soundsArray[i]['MP3 sound'] === "/file/";
                var isAACEmpty = soundsArray[i]['AAC sound'] === "" || soundsArray[i]['AAC sound'] === "/file/";
                var isOGGEmpty = soundsArray[i]['OGG sound'] === "" || soundsArray[i]['OGG sound'] === "/file/";
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

    /**
     * Function returns errorCode if any of this errors occurs:
     * FN_01 - frame name empty
     * FN_02 - frame number empty
     * FN_03 - frame number is not a number
     * FN_04 - frame number negative
     * FN_05 - frame number out of bounds
     *
     * @return errorCode
     */
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

                    if (!name || name === null || name === "") return { isError: true, errorCode: "FN_01" };
                    if (!frame || frame === "") return { isError: true, errorCode: "FN_02" };

                    frame = parseInt(frame, 10);
                    if (isNaN(frame)) return { isError: true, errorCode: "FN_03" };
                    if (frame <= 0) return { isError: true, errorCode: "FN_04" };
                    if (frame > frames) return { isError: true, errorCode: "FN_05" };

                    frameNamesArray.push({ name: name, frame: frame });
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
    presenter.sanitizePosition = function (position) {
        if (!position) return { isError:true };

        var parsedPosition = parseInt(position, 10);
        if (isNaN(parsedPosition)) return { isError:true };
        if (parsedPosition < 0) return { isError:true };

        return { isError:false, position:parseInt(position, 10) };
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
     * @returns FL_01 if list is empty or undefined
     * @returns FL_02 if list is incorrectly constructed
     * @returns FL_03 if frame number is not a number
     * @returns FL_04 if frame number is not positive integer
     * @returns FL_05 if frame number higher than frames count
     * @returns FL_06 if frame number is missing (inside list)
     * @returns FL_07 if frame numbers range is incorrect
     */
    presenter.validateFramesList = function (frames, count) {
        var list = [];

        if (!frames || frames.length === 0) {
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
            if (splittedFrames[i] === "") {
                return {
                    isError: true,
                    errorCode: "FL_06"
                };
            }

            var indexOfRange = splittedFrames[i].search('-');
            if (indexOfRange !== -1) {
                var rangeStart = parseInt(splittedFrames[i].split('-')[0], 10);
                var rangeEnd = parseInt(splittedFrames[i].split('-')[1], 10);


                var isRangeError = isNaN(rangeStart) || isNaN(rangeEnd);
                isRangeError = isRangeError || rangeStart < 1;
                isRangeError = isRangeError || rangeEnd < 1;
                isRangeError = isRangeError || rangeStart > rangeEnd;
                isRangeError = isRangeError || rangeStart > count;
                isRangeError = isRangeError || rangeEnd > count;
                if (isRangeError) {
                    return {
                        isError: true,
                        errorCode: "FL_07"
                    };
                }

                for (var frameNumber = rangeStart; frameNumber <= rangeEnd; frameNumber++) {
                    list.push(frameNumber);
                }

                continue;
            }

            var frame = parseInt(splittedFrames[i]);

            if (isNaN(frame)) {
                return {
                    isError: true,
                    errorCode: "FL_03"
                };
            }

            if (frame < 1) {
                return {
                    isError: true,
                    errorCode: "FL_04"
                };
            }

            if (frame > count) {
                return {
                    isError: true,
                    errorCode: "FL_05"
                };
            }

            list.push(frame);
        }

        list = list.sort();
        list = presenter.removeDuplicatesFromArray(list);

        return {
            isError: false,
            list: list
        };
    };

    /** If validation error occurs then one of the following error codes are returned
     * @returns L_01 if text is empty
     * @returns L_02 if top value is invalid
     * @returns L_03 if left value is invalid
     * @returns L_04 if empty label and labels count > 0
     * @returns FL_** if there was problem with frames property
     */
    presenter.validateLabels = function (labelsArray, framesCount) {
        var labels = [];

        // Ugly fix for Editor problems
        if (!labelsArray) return { isError:false, labels:labels };

        for (var i = 0; i < labelsArray.length; i++) {
            var frames = labelsArray[i].Frames;
            var topPosition = labelsArray[i].Top;
            var leftPosition = labelsArray[i].Left;

            if (labelsArray[i].Text == "" && topPosition == "" && leftPosition == "" && frames == "") {
                if (labelsArray.length == 1) {
                    labels = [];
                    break;
                } else return { isError:true, errorCode:"L_04" };
            }

            if (!labelsArray[i].Text || labelsArray[i].Text === "") return { isError:true, errorCode:"L_01" };

            var validatedFramesList = presenter.validateFramesList(frames, framesCount);
            if (validatedFramesList.isError) return { isError:true, errorCode: validatedFramesList.errorCode };

            var sanitizedTopPosition = presenter.sanitizePosition(topPosition);
            if (sanitizedTopPosition.isError) return { isError:true, errorCode:"L_02" };

            var sanitizedLeftPosition = presenter.sanitizePosition(leftPosition);
            if (sanitizedLeftPosition.isError)  return { isError:true, errorCode:"L_03" };

            var text = {
                text:labelsArray[i].Text,
                frames:validatedFramesList.list,
                top:sanitizedTopPosition.position,
                left:sanitizedLeftPosition.position
            };

            labels.push(text);
        }

        return { isError:false, labels:labels };
    };

    /**
     * Validates string representation of integer. Only positive integer values are allowed. If both (value and default) are
     * undefined then isError property is set to true.
     */
    presenter.validatePositiveInteger = function (value, defaultValue) {
        var isValueDefined = value != undefined && value !== "";
        var isDefaultDefined = defaultValue != undefined && !isNaN(defaultValue);

        if (!isValueDefined && !isDefaultDefined) return { isError: true };

        if (!isValueDefined && isDefaultDefined) return { isError: false, value: defaultValue };

        var parsedSize = parseInt(value, 10);
        if (isNaN(parsedSize) || parsedSize < 1) return { isError: true };

        return { isError: false, value: parsedSize };
    };

    presenter.validateModel = function(model) {
        if (ModelValidationUtils.isStringEmpty(model.Image)) return { isError: true, errorCode: "I_01" };

        var validatedFrames = presenter.validateFramesCount(model.Frames);
        if (validatedFrames.isError) return { isError: true, errorCode: validatedFrames.errorCode };

        var validatedFrameNames = presenter.validateFrameNames(model["Frame names"], validatedFrames.frames);
        if (validatedFrameNames.isError) return { isError: true, errorCode: validatedFrameNames.errorCode };

        var validatedLabels = presenter.validateLabels(model.Labels, validatedFrames.frames);
        if (validatedLabels.isError) return { isError: true, errorCode: validatedLabels.errorCode };

        var showFrame = 1;
        var validatedShowFrame = presenter.validatePositiveInteger(model["Show frame"], 1);
        if (!validatedShowFrame.isError) {
            showFrame = validatedShowFrame.value;
        }

        var defaultVisibility = ModelValidationUtils.validateBoolean(model["Is Visible"]);

        return {
            isError: false,
            imageSrc : model.Image,
            frames : validatedFrames.frames,
            sounds : presenter.validateSound(model.Sounds).sounds,
            frameNames: validatedFrameNames.frameNames,
            frameNamesEmpty: validatedFrameNames.frameNamesEmpty,
            isClickDisabled: ModelValidationUtils.validateBoolean(model.isClickDisabled),
            frameSize: presenter.validateFrameSize(model["Frame size"]),
            labels: validatedLabels.labels,
            showFrame: showFrame,
            defaultVisibility: defaultVisibility,
            currentVisibility: defaultVisibility
        };
    };

    // Frames are counted from 0 to (frameCount - 1)
    presenter.changeFrame = function(element, configuration, playAudio) {
        $(element).css('backgroundPosition', configuration.currentFrame * configuration.frameWidthPercentage + '% ' + ' 0%');
        if (presenter.configuration.currentVisibility) {
            displayLabels(configuration.currentFrame + 1);
        }

        if (configuration.currentFrame !== 0 && playAudio) {
            presenter.playAudio(presenter.$view, configuration);
        } else if (configuration.currentFrame === 0) {
            stopAllAudio();
        }
    };

    function stopAllAudio() {
        for (var i = 0; i < audioElements.length; i++) {
            if (audioElements[i] !== null) {
                stopAudio(audioElements[i]);
            }
        }
    }

    function stopAudio(audio) {
        audio.pause();
        audio.setTime(0);
    }

    presenter.playAudio = function(viewContainer, configuration) {
        stopAllAudio();

        var audio = audioElements[configuration.currentFrame - 1];
        if (audio) {
            audio.play();
        }
    };

    presenter.getState = function() {
        return JSON.stringify({
            "currentFrame" : this.configuration.currentFrame,
            "currentVisibility" : this.configuration.currentVisibility,
            "flags": presenter.configuration.flags
        });
    };

    presenter.setState = function(state) {
        var savedState = JSON.parse(state);

        var configuration = presenter.configuration;
        configuration.currentFrame = savedState["currentFrame"];
        configuration.currentVisibility = savedState["currentVisibility"];
        configuration.flags = savedState["flags"];

        $.when(presenter.imageLoaded).then(loadImageEndCallback);
    };

    presenter.reset = function () {
        stopAllAudio();
        presenter.configuration.flags = [];
        presenter.configuration.currentFrame = 0;
        presenter.changeFrame(viewerElement, presenter.configuration, true);
        displayLabels(1);
        presenter.setVisibility(presenter.configuration.defaultVisibility);
    };

    return presenter;
}