function AddonLottiePlayer_create() {
    var presenter = function () {};

    presenter.eventBus = null;

    presenter.isVisible = true;
    presenter.currentAnimationIndex = 0;
    presenter.animationsStates = [];
    presenter.animationsElements = [];
    presenter.isPreview = true;
    presenter.previouslyVisited = false;

    presenter.isWCAGOn = false;
    presenter.speechTexts = null;
    presenter.keyboardControllerObject = null;

    presenter.DIRECTION = {
        Forward: "Forward",
        Backward: "Backward",
        DEFAULT: "Forward"
    };

    presenter.MODE = {
        Normal: "Normal",
        Bounce: "Bounce",
        DEFAULT: "Normal"
    };

    presenter.ERROR_CODES = {
        IAS_0: "Please provide animation JSON file.",
        ILN_0: "Number of loops must be valid integer or empty.",
        ILN_1: "Number of loops must not be less than 0.",
        IS_0: "Speed value must be valid float or empty.",
        IS_1: "Speed value must not be less than 0.",
        II_0: "Intermission must be valid integer or empty.",
        II_1: "Intermission value must not be less than 0.",
        IB_0: "Background color must be valid HEX value, RGB value, RGBA value, transparent or empty (to be transparent)",
    };

    presenter.CSS_CLASSES = {
        INVALID_CONFIGURATION: "lottie-player-invalid-configuration",
        VISIBLE_ANIMATION: "lottie-player-visible-animation",
        INVISIBLE_ANIMATION: "lottie-player-invisible-animation",
        LOTTIE_PLAYER: "lottie-player",
    };

    presenter.DOM_IDS = {
        PLAY_BUTTON: "lottie-play-button",
        STOP_BUTTON: "lottie-stop-button",
        LOOP_BUTTON: "lottie-loop-toggle",
    };

    presenter.DEFAULT_TTS_PHRASES = {
        PLAY_BUTTON: "Play button",
        PAUSE_BUTTON: "Pause button",
        STOP_BUTTON: "Stop button",
        LOOP_BUTTON: "Loop button",
        STOPPED: "Stopped",
        PAUSED: "Paused"
    };

    presenter.setPlayerController = function (controller) {
        presenter.playerController = controller;
        presenter.eventBus = presenter.playerController.getEventBus();
    };

    presenter.createPreview = function (view, model) {
        presenter.initialize(view, model, true);
    };

    presenter.run = function (view, model) {
        presenter.initialize(view, model, false);
    };

    presenter.initialize = function (view, model, isPreview) {
        presenter.view = view;
        presenter.$view = $(view);
        presenter.isPreview = isPreview;

        presenter.configuration = presenter.validateModel(model);
        if (!presenter.configuration.isValid) {
            showErrorMessage();
            return;
        }

        presenter.addAnimations(view, presenter.configuration);
        presenter.attachEventListeners(isPreview);

        if (!isPreview) {
            presenter.setSpeechTexts(model["SpeechTexts"]);
            presenter.buildKeyboardController();
        }
        presenter.displayCurrentAnimation();
    };

    presenter.validateModel = function(model) {
        let isVisible = ModelValidationUtils.validateBoolean(model["Is Visible"]);
        let controls = ModelValidationUtils.validateBoolean(model["Controls"]);
        let playInSuccession = ModelValidationUtils.validateBoolean(model["PlayInSuccession"]);
        let loopSuccession = ModelValidationUtils.validateBoolean(model["LoopSuccession"]);
        let sendEventOnEveryFrame = ModelValidationUtils.validateBoolean(model["SendEventOnEveryFrame"]);

        let animationsConfigurations = [];
        for (let itemIndex = 0; itemIndex < model.Items.length; itemIndex++) {
            let validatedAnimationConfig = validateAnimationModel(model.Items[itemIndex], itemIndex);
            if (!validatedAnimationConfig.isValid) {
                return validatedAnimationConfig;
            }
            animationsConfigurations.push(validatedAnimationConfig.configuration);
        }

        return {
            isValid: true,
            addonID: model["ID"],
            isVisible: isVisible,
            animations: animationsConfigurations,
            controls: controls,
            playInSuccession: playInSuccession,
            loopSuccession: loopSuccession,
            sendEventOnEveryFrame: sendEventOnEveryFrame,
            langTag: model["langAttribute"],
        };
    };

    function validateAnimationModel(animationModel, itemIndex) {
        let validatedAnimationSrc = validateAnimationSrc(animationModel["AnimationJSON"], itemIndex);
        if (!validatedAnimationSrc.isValid) {
            return validatedAnimationSrc;
        }

        let isLoop = ModelValidationUtils.validateBoolean(animationModel["Loop"]);
        let isAutoplay = ModelValidationUtils.validateBoolean(animationModel["Autoplay"]);
        let direction = ModelValidationUtils.validateOption(presenter.DIRECTION, animationModel["Direction"]);
        let mode = ModelValidationUtils.validateOption(presenter.MODE, animationModel["Mode"]);

        let validatedLoopsNumber = validateLoopsNumber(animationModel["LoopsNumber"], itemIndex);
        if (!validatedLoopsNumber.isValid) {
            return validatedLoopsNumber;
        }

        let validatedSpeed = validateSpeed(animationModel["Speed"], itemIndex);
        if (!validatedSpeed.isValid) {
            return validatedSpeed;
        }

        let validatedIntermission = validateIntermission(animationModel["Intermission"], itemIndex);
        if (!validatedIntermission.isValid) {
            return validatedIntermission;
        }

        let validatedBackground = validateBackground(animationModel["Background"], itemIndex);
        if (!validatedBackground.isValid) {
            return validatedBackground;
        }

        return {
            isValid: true,
            configuration: {
                animationSrc: validatedAnimationSrc.value,
                isLoop: isLoop,
                isAutoplay: isAutoplay,
                direction: direction,
                mode: mode,
                loopsNumber: validatedLoopsNumber.value,
                speed: validatedSpeed.value,
                intermission: validatedIntermission.value,
                background: validatedBackground.value,
                altText: animationModel["AlternativeText"],
                altTextPreview: animationModel["PreviewAlternativeText"],
            },
        };
    }

    function validateAnimationSrc (value, itemIndex) {
        if (!value) {
            return getErrorObject("IAS_0", itemIndex);
        }
        return getValidObject(value);
    }

    function validateLoopsNumber (value, itemIndex) {
        return validatePositiveIntValue("ILN", value, null, itemIndex);
    }

    function validateSpeed (value, itemIndex) {
        return validatePositiveFloatValue("IS", value, 1, itemIndex);
    }

    function validateIntermission (value, itemIndex) {
        return validatePositiveIntValue("II", value, null, itemIndex);
    }

    function validateBackground (value, itemIndex) {
        let defaultValue = "transparent";
        if (ModelValidationUtils.isStringEmpty(value)) {
            return getValidObject(defaultValue);
        }

        let parsedValue = value.toLowerCase();
        if (parsedValue === defaultValue) {
            return getValidObject(parsedValue);
        }

        // Regex do not support RGBA with spaces
        let isColor = value.match(/#[a-f0-9]{6}\b|#[a-f0-9]{3}\b|rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$|rgba\((\s*\d+\s*,){3}[\d\.]+\)/gi);
        if (!isColor) {
            return getErrorObject("IB_0", itemIndex);
        }
        return getValidObject(parsedValue);
    }

    function validatePositiveFloatValue(errorCodePrefix, value, defaultValue, itemIndex) {
        if (ModelValidationUtils.isStringEmpty(value)) {
            return getValidObject(defaultValue);
        }

        const parsedValue = parseFloat(value);
        if (isNaN(parsedValue)) {
            return getErrorObject(`${errorCodePrefix}_0`, itemIndex);
        }
        if (parsedValue < 0) {
            return getErrorObject(`${errorCodePrefix}_1`, itemIndex);
        }

        return getValidObject(parsedValue);
    }

    function validatePositiveIntValue(errorCodePrefix, value, defaultValue, itemIndex) {
        if (ModelValidationUtils.isStringEmpty(value)) {
            return getValidObject(defaultValue);
        }

        const parsedValue = parseInt(value);
        if (isNaN(parsedValue)) {
            return getErrorObject(`${errorCodePrefix}_0`, itemIndex);
        }
        if (parsedValue < 0) {
            return getErrorObject(`${errorCodePrefix}_1`, itemIndex);
        }

        return getValidObject(parsedValue);
    }

    function getValidObject (value) {
        return {
            isValid: true,
            value: value
        }
    }

    function getErrorObject(errorCode, itemIndex = undefined) {
        return {
            isValid: false,
            errorCode: errorCode,
            itemIndex: itemIndex
        }
    }

    function showErrorMessage() {
        let errorMessage = presenter.ERROR_CODES[presenter.configuration.errorCode];
        if (presenter.configuration.itemIndex !== undefined) {
            errorMessage = `Item ${presenter.configuration.itemIndex + 1}. ` + errorMessage;
        }
        presenter.$view.html(errorMessage);
        presenter.view.classList.add(presenter.CSS_CLASSES.INVALID_CONFIGURATION);
    }

    presenter.addAnimations = function (view, configuration) {
        configuration.animations.forEach((animationConfiguration, index) => {
            let lottie = document.createElement("lottie-player");
            hideAnimation(lottie);
            lottie.classList.add(`${presenter.CSS_CLASSES.LOTTIE_PLAYER}-${index}`);

            lottie.src = animationConfiguration.animationSrc;
            lottie.background = animationConfiguration.background;

            lottie.setAttribute("direction", parseDirectionToValue(animationConfiguration.direction));
            lottie.setAttribute("speed", animationConfiguration.speed.toString());

            if (animationConfiguration.isLoop) {
                lottie.setAttribute("loop", "loop");
            }
            if (animationConfiguration.isAutoplay) {
                lottie.setAttribute("autoplay", "autoplay");
            }
            if (configuration.controls) {
                lottie.setAttribute("controls", "controls");
            }
            if (animationConfiguration.mode === presenter.MODE.Bounce) {
                lottie.setAttribute("mode", "bounce");
            }
            if (animationConfiguration.loopsNumber !== null) {
                lottie.setAttribute("count", animationConfiguration.loopsNumber.toString());
            }
            if (animationConfiguration.intermission !== null) {
                lottie.setAttribute("intermission", animationConfiguration.intermission.toString());
            }

            view.appendChild(lottie);
        });

        presenter.animationsElements = findAnimationsElements();
        presenter.initializeAnimationsStates();
    };

    presenter.initializeAnimationsStates = function () {
        presenter.animationsElements.forEach((animation, index) => {
            presenter.animationsStates.push(new AnimationState(index));
        })
    }

    function parseDirectionToValue (mode) {
        if (mode === presenter.DIRECTION.Backward) {
            return "-1";
        } return "1";
    }

    presenter.setSpeechTexts = function(speechTexts) {
        presenter.speechTexts = {
            PlayButton: presenter.DEFAULT_TTS_PHRASES.PLAY_BUTTON,
            PauseButton: presenter.DEFAULT_TTS_PHRASES.PAUSE_BUTTON,
            StopButton: presenter.DEFAULT_TTS_PHRASES.STOP_BUTTON,
            LoopButton: presenter.DEFAULT_TTS_PHRASES.LOOP_BUTTON,
            Paused: presenter.DEFAULT_TTS_PHRASES.PAUSED,
            Stopped: presenter.DEFAULT_TTS_PHRASES.STOPPED,
        };

        if (!speechTexts || $.isEmptyObject(speechTexts)) {
            return;
        }

        presenter.speechTexts = {
            PlayButton: TTSUtils.getSpeechTextProperty(
                speechTexts.PlayButton.PlayButton,
                presenter.speechTexts.PlayButton),
            PauseButton: TTSUtils.getSpeechTextProperty(
                speechTexts.PauseButton.PauseButton,
                presenter.speechTexts.PauseButton),
            StopButton: TTSUtils.getSpeechTextProperty(
                speechTexts.StopButton.StopButton,
                presenter.speechTexts.StopButton),
            LoopButton: TTSUtils.getSpeechTextProperty(
                speechTexts.LoopButton.LoopButton,
                presenter.speechTexts.LoopButton),
            Paused: TTSUtils.getSpeechTextProperty(
                speechTexts.Paused.Paused,
                presenter.speechTexts.Paused),
            Stopped: TTSUtils.getSpeechTextProperty(
                speechTexts.Stopped.Stopped,
                presenter.speechTexts.Stopped),
        };
    };

    presenter.executeCommand = function (name, params) {
        let commands = {
            load: presenter.load,
            play: presenter.play,
            pause: presenter.pause,
            stop: presenter.stop,
            freeze: presenter.freeze,
            playAll: presenter.playAll,
            pauseAll: presenter.pauseAll,
            stopAll: presenter.stopAll,
            freezeAll: presenter.freezeAll,
            loop: presenter.loop,
            frame: presenter.frame,
            jumpTo: presenter.jumpToCommand,
            next: presenter.next,
            previous: presenter.previous,
            show: presenter.show,
            hide: presenter.hide,
        };

        return Commands.dispatch(commands, name, params, presenter);
    };

    presenter.load = function (animationIndex, url) {
        presenter.animationsElements[animationIndex - 1].load(url);
    };

    presenter.play = function (animationIndex) {
        const parsedAnimationIndex = animationIndex ? animationIndex - 1 : presenter.currentAnimationIndex;
        play(parsedAnimationIndex);
    };

    function play (animationIndex) {
        presenter.animationsElements.forEach((animation, index) => {
            if (index === animationIndex) {
                presenter.currentAnimationIndex = index;
                showAnimation(animation);
                animation.play();
            } else {
                animation.stop();
                hideAnimation(animation);
            }
        })
        if (presenter.isTTS()) {
            presenter.keyboardControllerObject.speakAlternativeText();
        }
    }

    presenter.pause = function (animationIndex) {
        const parsedAnimationIndex = animationIndex ? animationIndex - 1 : presenter.currentAnimationIndex;
        pause(parsedAnimationIndex);
    };

    function pause (animationIndex) {
        presenter.animationsElements[animationIndex].pause();
        if (presenter.isTTS()) {
            presenter.keyboardControllerObject.speakPaused();
        }
    }

    presenter.stop = function (animationIndex) {
        const parsedAnimationIndex = animationIndex ? animationIndex - 1 : presenter.currentAnimationIndex;
        stop(parsedAnimationIndex);
    };

    function stop (animationIndex) {
        presenter.animationsElements[animationIndex].stop();
        if (presenter.isTTS()) {
            presenter.keyboardControllerObject.speakStopped();
        }
    }

    presenter.freeze = function (animationIndex) {
        const parsedAnimationIndex = animationIndex ? animationIndex - 1 : presenter.currentAnimationIndex;
        freeze(parsedAnimationIndex);
    };

    function freeze (animationIndex) {
        presenter.animationsElements[animationIndex].freeze();
    }

    presenter.playAll = function () {
        presenter.play()
    };

    presenter.pauseAll = function () {
        presenter.animationsElements.forEach(animation => {
            animation.pause();
        })
        if (presenter.isTTS()) {
            presenter.keyboardControllerObject.speakPaused();
        }
    };

    presenter.stopAll = function () {
        presenter.animationsElements.forEach(animation => {
            animation.stop();
        })
        if (presenter.isTTS()) {
            presenter.keyboardControllerObject.speakStopped();
        }
    };

    presenter.freezeAll = function () {
        presenter.animationsElements.forEach(animation => {
            animation.freeze();
        })
    };

    presenter.loop = function (id, value) {
        presenter.animationsElements[id - 1].setLooping(value);
    };

    presenter.frame = function (id, value) {
        presenter.animationsElements[id - 1].seek(value);
    };

    presenter.show = function () {
        presenter.setVisibility(true);
    };

    presenter.hide = function () {
        presenter.setVisibility(false);
    };

    presenter.setVisibility = function (isVisible) {
        presenter.$view.css("visibility", isVisible ? "visible" : "hidden");
        presenter.isVisible = isVisible;
    };

    presenter.next = function () {
        if (presenter.currentAnimationIndex + 1 < presenter.configuration.animations.length) {
            presenter.currentAnimationIndex++;
            presenter.jumpTo(presenter.currentAnimationIndex + 1);
        }
    };

    presenter.previous = function () {
        if (presenter.currentAnimationIndex > 0) {
            presenter.currentAnimationIndex--;
            presenter.jumpTo(presenter.currentAnimationIndex + 1);
        }
    };

    presenter.jumpToCommand = function (params) {
        presenter.jumpTo(parseInt(params[0], 10));
    };

    presenter.jumpTo = function (animationIndex) {
        let newAnimationIndex = animationIndex - 1;
        if (newAnimationIndex >= 0 && newAnimationIndex < presenter.configuration.animations.length) {
            presenter.currentAnimationIndex = newAnimationIndex;
            if (isAnimationAutoplay(newAnimationIndex) && !isAnimationFinishedLoops(newAnimationIndex)) {
                play(presenter.currentAnimationIndex);
            } else {
                presenter.displayCurrentAnimation();
            }
            if (presenter.keyboardControllerObject) {
                presenter.keyboardControllerObject.reloadElements();
            }
        }
    };

    presenter.attachEventListeners = function (isPreview) {
        if (!isPreview) {
            attachEventListenersToView();
        }
        presenter.animationsElements.forEach(
            (animation, index) => attachRunEventListenersToAnimationElement(animation, index, isPreview)
        );
    };

    function attachEventListenersToView () {
        presenter.view.addEventListener("touchstart", (e) => {
            e.stopPropagation();
        });
        presenter.view.addEventListener("touchend", presenter.clickHandler);
        presenter.view.addEventListener("click", presenter.clickHandler);

        MutationObserverService.createDestroyObserver(presenter.configuration.addonID, presenter.destroy, presenter.view);
        MutationObserverService.setObserver();
    }

    presenter.clickHandler = function (event) {
        if (event !== undefined) {
            event.stopPropagation();
        }
        let eventData = presenter.createEventData(presenter.currentAnimationIndex, 1, "");
        presenter.eventBus.sendEvent("ValueChanged", eventData);
    };

    function attachRunEventListenersToAnimationElement (animation, index, isPreview) {
        if (!isPreview) {
            animation.addEventListener("load", (e) => presenter.onAnimationLoadForRun(e, index));
            animation.addEventListener("error", (e) => presenter.onAnimationErrorForRun(e, index));
            animation.addEventListener("ready", (e) => presenter.onAnimationReadyForRun(e, index));
            animation.addEventListener("play", (e) => presenter.onAnimationPlayForRun(e, index));
            animation.addEventListener("pause", (e) => presenter.onAnimationPauseForRun(e, index));
            animation.addEventListener("stop", (e) => presenter.onAnimationStopForRun(e, index));
            animation.addEventListener("freeze", (e) => presenter.onAnimationFreezeForRun(e, index));
            animation.addEventListener("loop", (e) => presenter.onAnimationLoopForRun(e, index));
            animation.addEventListener("complete", (e) => presenter.onAnimationCompleteForRun(e, index));

            if (presenter.configuration.sendEventOnEveryFrame) {
                animation.addEventListener("frame", (e) => presenter.onAnimationFrameForRun(e, index));
            }
        }

        if (presenter.configuration.playInSuccession) {
            animation.addEventListener("ready", (e) => presenter.onAnimationReadyForPlayedInSuccession(e, index));
            animation.addEventListener("loop", (e) => presenter.onAnimationLoopForPlayedInSuccession(e, index));
            animation.addEventListener("complete", (e) => presenter.onAnimationCompleteForPlayedInSuccession(e, index));
        } else {
            animation.addEventListener("loop", (e) => presenter.onAnimationLoopForNotPlayedInSuccession(e, index));
        }
    }

    presenter.onAnimationLoadForRun = function (event, index) {
        presenter.sendOnAnimationChangeEvent(index, "load");
    };

    presenter.onAnimationErrorForRun = function (event, index) {
        presenter.sendOnAnimationChangeEvent(index, "error");
    };

    presenter.onAnimationReadyForRun = function (event, index) {
        presenter.sendOnAnimationChangeEvent(index, "ready");

        if (!presenter.previouslyVisited
            && index !== presenter.currentAnimationIndex
            && isAnimationAutoplay(index)) {
            presenter.animationsElements[index].stop();
        }
    };

    presenter.onAnimationReadyForPlayedInSuccession = function (event, index) {
        if (!presenter.previouslyVisited
            && index === presenter.currentAnimationIndex
            && !presenter.configuration.animations[index].isAutoplay) {
            presenter.animationsElements[index].play();
        }
    };

    presenter.onAnimationReadyForSetState = function (event, index, currentFrame) {
        setCurrentFrameForAnimation(index, currentFrame);

        if (isAnimationStopped(index)) {
            presenter.animationsElements[index].stop()
        } else if (isAnimationPaused(index)) {
            presenter.animationsElements[index].pause();
        } else if (isAnimationFrozen(index)) {
            presenter.animationsElements[index].freeze();
        } else if (isAnimationPlaying(index)) {
            presenter.animationsElements[index].play();
        }
    }

    function setCurrentFrameForAnimation(animationIndex, currentFrame) {
        if (currentFrame) {
            presenter.animationsElements[animationIndex].seek(Math.floor(currentFrame));
        }
    }

    presenter.onAnimationPlayForRun = function (event, index) {
        presenter.sendOnAnimationChangeEvent(index, "play");
        setAnimationStateAsPlaying(index);
    };

    presenter.onAnimationPauseForRun = function (event, index) {
        presenter.sendOnAnimationChangeEvent(index, "pause");
        setAnimationStateAsPaused(index);
    };

    presenter.onAnimationFreezeForRun = function (event, index) {
        presenter.sendOnAnimationChangeEvent(index, "freeze");
        setAnimationStateAsFrozen(index);
    };

    presenter.onAnimationStopForRun = function (event, index) {
        presenter.sendOnAnimationChangeEvent(index, "stop");
        setAnimationStateAsStopped(index);
    };

    presenter.onAnimationFrameForRun = function (event, index) {
        presenter.sendOnAnimationChangeEvent(index, "frame");
    };

    presenter.onAnimationCompleteForRun = function (event, index) {
        presenter.sendOnAnimationChangeEvent(index, "complete");

        if (presenter.configuration.animations[index].isLoop && presenter.configuration.animations[index].loopsNumber) {
            increaseAnimationPlayedLoops(index);
        }
    };

    presenter.onAnimationCompleteForPlayedInSuccession = function (event, index) {
        jumpToNextAnimationInSuccession();
    };

    presenter.onAnimationLoopForRun = function (event, index) {
        presenter.sendOnAnimationChangeEvent(index, "loop");
    };

    presenter.onAnimationLoopForPlayedInSuccession = function (event, index) {
        if (!isAnimationFinishedLoops(index)) {
            increaseAnimationPlayedLoops(index);
        } else {
            resetAnimationPlayedLoops(index);
            jumpToNextAnimationInSuccession();
        }
    };

    presenter.onAnimationLoopForNotPlayedInSuccession = function (event, index) {
        if (!isAnimationFinishedLoops(index)) {
            increaseAnimationPlayedLoops(index);
        }
    };

    function isAnimationAutoplay (animationIndex) {
        return presenter.configuration.animations[animationIndex].isAutoplay || presenter.configuration.playInSuccession;
    }

    function jumpToNextAnimationInSuccession() {
        presenter.animationsElements[presenter.currentAnimationIndex].stop();

        let nextIndex = presenter.currentAnimationIndex + 1;
        if (nextIndex >= presenter.animationsElements.length) {
            if (!presenter.configuration.loopSuccession) return;
            nextIndex = 0;
        }

        hideAnimationWithIndex(presenter.currentAnimationIndex);
        presenter.currentAnimationIndex = nextIndex;
        showAnimationWithIndex(presenter.currentAnimationIndex);
        if (presenter.keyboardControllerObject) {
            presenter.keyboardControllerObject.reloadElements();
        }
        presenter.animationsElements[presenter.currentAnimationIndex].play();
        if (presenter.isTTS() && !presenter.keyboardControllerObject.isReadInSuccession[presenter.currentAnimationIndex]){
            presenter.keyboardControllerObject.isReadInSuccession[presenter.currentAnimationIndex] = true;
            presenter.keyboardControllerObject.speakEnterAction();
        }
    }

    presenter.sendOnAnimationChangeEvent = function (item, value) {
        const eventData = presenter.createEventData(item, value);
        presenter.eventBus.sendEvent("ValueChanged", eventData);
    };

    presenter.createEventData = function (item, value) {
        return {
            source: "" + presenter.configuration.addonID,
            item: "" + item,
            value: "" + value,
            score: "",
        };
    };

    presenter.getState = function () {
        let animationsStates = [];
        presenter.animationsStates.forEach(animationState =>
            animationsStates.push(animationState.serialize())
        )

        return JSON.stringify({
            isVisible: presenter.isVisible,
            currentAnimationIndex: presenter.currentAnimationIndex,
            animationsStates: presenter.animationsStates,
            animationsSavedFrames: getCurrentAnimationsFrames(),
            previouslyVisited: true,
        });
    };

    function getCurrentAnimationsFrames () {
        let currentFrames = [];
        presenter.animationsElements.forEach(animationElement =>  {
            if (isAnimationPlayerDOMCreated(animationElement)) {
                currentFrames.push(animationElement.getLottie().currentFrame);
            }
        })
        return currentFrames;
    }

    function isAnimationPlayerDOMCreated(animationElement) {
        return animationElement.shadowRoot && animationElement.shadowRoot.childNodes && animationElement.shadowRoot.childNodes[2];
    }

    presenter.setState = function (state) {
        let parsedState = JSON.parse(state);
        presenter.setVisibility(parsedState.isVisible);
        presenter.previouslyVisited = parsedState.previouslyVisited;
        presenter.currentAnimationIndex = parsedState.currentAnimationIndex;

        presenter.animationsStates = new Array(parsedState.animationsStates.length).fill(null);
        parsedState.animationsStates.forEach((savedAnimationState, index) => {
            let animationState = new AnimationState(index);
            animationState.deserialize(savedAnimationState);
            presenter.animationsStates[animationState.index] = animationState;
        })

        presenter.animationsElements = findAnimationsElements();
        presenter.displayCurrentAnimation();

        presenter.animationsElements.forEach((animationElement, index) => {
            animationElement.addEventListener("ready",
                (e) => presenter.onAnimationReadyForSetState(e, index, parsedState.animationsSavedFrames[index]))
        })
    };

    presenter.displayCurrentAnimation = function () {
        presenter.animationsElements.forEach((element, index) => {
            if (index === presenter.currentAnimationIndex) {
                showAnimation(element);
            } else {
                hideAnimation(element);
            }
        })
    };

    function findAnimationsElements () {
        return presenter.view.querySelectorAll("lottie-player");
    }

    function hideAnimationWithIndex (animationIndex) {
        hideAnimation(presenter.animationsElements[animationIndex]);
    }

    function hideAnimation (animationElement) {
        if (animationElement.classList.contains(presenter.CSS_CLASSES.VISIBLE_ANIMATION)) {
            animationElement.classList.remove(presenter.CSS_CLASSES.VISIBLE_ANIMATION);
        }
        animationElement.classList.add(presenter.CSS_CLASSES.INVISIBLE_ANIMATION);
    }

    function showAnimationWithIndex (animationIndex) {
        showAnimation(presenter.animationsElements[animationIndex]);
    }

    function showAnimation (animationElement) {
        if (animationElement.classList.contains(presenter.CSS_CLASSES.INVISIBLE_ANIMATION)) {
            animationElement.classList.remove(presenter.CSS_CLASSES.INVISIBLE_ANIMATION);
        }
        animationElement.classList.add(presenter.CSS_CLASSES.VISIBLE_ANIMATION);
    }

    presenter.setWCAGStatus = function(isWCAGOn) {
        presenter.isWCAGOn = isWCAGOn;
    };

    presenter.buildKeyboardController = function () {
        presenter.keyboardControllerObject
            = new LottiePlayerKeyboardController([], 1);
    };

    presenter.getElementsForKeyboardNavigation = function () {
        let currentAnimation = presenter.$view.find(`.${presenter.CSS_CLASSES.VISIBLE_ANIMATION}`);
        let animations = $(currentAnimation[0].shadowRoot.childNodes[2].children[1]).find(`
            #${presenter.DOM_IDS.PLAY_BUTTON},
            #${presenter.DOM_IDS.STOP_BUTTON},
            #${presenter.DOM_IDS.LOOP_BUTTON}
        `);
        return animations
    };

    function LottiePlayerKeyboardController(elements, columnsCount) {
        KeyboardController.call(this, elements, columnsCount);
        this.isReadInSuccession = new Array(presenter.animationsElements.length).fill(false);
    }

    presenter.isTTS = function () {
        return presenter.isWCAGOn && presenter.getTextToSpeechOrNull(presenter.playerController);
    };

    presenter.keyboardController = function (keycode, isShiftKeyDown, event) {
        presenter.keyboardControllerObject.handle(keycode, isShiftKeyDown, event);
    };

    LottiePlayerKeyboardController.prototype = Object.create(KeyboardController.prototype);
    LottiePlayerKeyboardController.prototype.constructor = LottiePlayerKeyboardController;

    LottiePlayerKeyboardController.prototype.reloadElements = function () {
        let elements = presenter.getElementsForKeyboardNavigation();

        for (let i = 0; i < this.keyboardNavigationElementsLen; i++) {
            this.unmark(this.keyboardNavigationElements[i]);
        }
        this.removeEventListeners();

        this.keyboardNavigationElements = elements;
        this.keyboardNavigationElementsLen = elements.length;
        this.attachEventListeners();

        if (!this.keyboardNavigationActive) {
            this.keyboardNavigationCurrentElementIndex = 0;
            this.keyboardNavigationCurrentElement = this.keyboardNavigationElements[0];
            return;
        }

        this.keyboardNavigationCurrentElement = this.keyboardNavigationElements[this.keyboardNavigationCurrentElementIndex];
        this.mark(this.keyboardNavigationCurrentElement)
    };

    LottiePlayerKeyboardController.prototype.attachEventListeners = function () {
        for (let i = 0; i < this.keyboardNavigationElementsLen; i++) {
            let element = this.keyboardNavigationElements[i];
            let $element = $(element);
            if (hasId($element, presenter.DOM_IDS.PLAY_BUTTON)) {
                element.addEventListener("click", this.onPlayButtonClick);
            } else if (hasId($element, presenter.DOM_IDS.STOP_BUTTON)) {
                element.addEventListener("click", this.onStopButtonClick);
            }
        }
    };

    LottiePlayerKeyboardController.prototype.removeEventListeners = function () {
        for (let i = 0; i < this.keyboardNavigationElementsLen; i++) {
            let element = this.keyboardNavigationElements[i];
            let $element = $(element);
            if (hasId($element, presenter.DOM_IDS.PLAY_BUTTON)) {
                element.removeEventListener("click", this.onPlayButtonClick, false);
            } else if (hasId($element, presenter.DOM_IDS.STOP_BUTTON)) {
                element.removeEventListener("click", this.onStopButtonClick, false);
            }
        }
    };

    LottiePlayerKeyboardController.prototype.onPlayButtonClick = function (event) {
        if (presenter.isTTS()) {
            if (presenter.animationsElements[presenter.currentAnimationIndex].getLottie().isPaused === true) {
                presenter.keyboardControllerObject.speakPaused();
            } else {
                presenter.keyboardControllerObject.speakAlternativeText();
            }
        }
    };

    LottiePlayerKeyboardController.prototype.onStopButtonClick = function (event) {
        if (presenter.isTTS()) {
            presenter.keyboardControllerObject.speakStopped();
        }
    };

    LottiePlayerKeyboardController.prototype.mark = function (element) {
        if (element)
            element.setAttribute("part", "keyboard_navigation_active_element");
    };

    LottiePlayerKeyboardController.prototype.unmark = function (element) {
        if (element)
            element.removeAttribute("part");
    };

    LottiePlayerKeyboardController.prototype.nextElement = function (event) {
        KeyboardController.prototype.nextElement.call(this, event);
        this.readCurrentElement();
    };

    LottiePlayerKeyboardController.prototype.previousElement = function (event) {
        KeyboardController.prototype.previousElement.call(this, event);
        this.readCurrentElement();
    };

    LottiePlayerKeyboardController.prototype.nextRow = function (event) {
        KeyboardController.prototype.nextRow.call(this, event);
        this.readCurrentElement();
    };

    LottiePlayerKeyboardController.prototype.previousRow = function (event) {
        KeyboardController.prototype.previousRow.call(this, event);
        this.readCurrentElement();
    };

    LottiePlayerKeyboardController.prototype.enter = function (event) {
        if (!this.keyboardNavigationActive) {
            this.reloadElements();
            this.isReadInSuccession = new Array(presenter.animationsElements.length).fill(false);
            if (presenter.configuration.playInSuccession) {
                this.isReadInSuccession[presenter.currentAnimationIndex] = true;
            }
        }
        KeyboardController.prototype.enter.call(this, event);
        this.speakEnterAction();
    };

    LottiePlayerKeyboardController.prototype.readCurrentElement = function () {
        let $element = this.getCurrentElement();

        if (hasId($element, presenter.DOM_IDS.PLAY_BUTTON)) {
            if (presenter.animationsElements[presenter.currentAnimationIndex].getLottie().isPaused === true) {
                this.speakPlayButton();
            } else {
                this.speakPauseButton();
            }
        } else if (hasId($element, presenter.DOM_IDS.STOP_BUTTON)) {
            this.speakStopButton();
        } else if (hasId($element, presenter.DOM_IDS.LOOP_BUTTON)) {
            this.speakLoopButton();
        }
    };

    LottiePlayerKeyboardController.prototype.getCurrentElement = function () {
        return this.getTarget(this.keyboardNavigationCurrentElement, false);
    };

    LottiePlayerKeyboardController.prototype.getTarget = function (element, willBeClicked) {
        return $(element);
    };

    function hasId($element, id) {
        return $element.attr("id") === id;
    }

    LottiePlayerKeyboardController.prototype.speakEnterAction = function () {
        if (presenter.animationsElements[presenter.currentAnimationIndex].getLottie().isPaused === true){
            this.speakPreviewAlternativeText();
        } else {
            this.speakAlternativeText();
        }
    };

    LottiePlayerKeyboardController.prototype.speakPlayButton = function () {
        this.speakWithLanguageFromLesson(presenter.speechTexts.PlayButton);
    };

    LottiePlayerKeyboardController.prototype.speakPauseButton = function () {
        this.speakWithLanguageFromLesson(presenter.speechTexts.PauseButton);
    };

    LottiePlayerKeyboardController.prototype.speakStopButton = function () {
        this.speakWithLanguageFromLesson(presenter.speechTexts.StopButton);
    };

    LottiePlayerKeyboardController.prototype.speakLoopButton = function () {
        this.speakWithLanguageFromLesson(presenter.speechTexts.LoopButton);
    };

    LottiePlayerKeyboardController.prototype.speakStopped = function () {
        this.speakWithLanguageFromLesson(presenter.speechTexts.Stopped);
    };

    LottiePlayerKeyboardController.prototype.speakPaused = function () {
        this.speakWithLanguageFromLesson(presenter.speechTexts.Paused);
    };

    LottiePlayerKeyboardController.prototype.speakAlternativeText = function () {
        this.speakWithLanguageFromPresenter(presenter.configuration.animations[presenter.currentAnimationIndex].altText);
    };

    LottiePlayerKeyboardController.prototype.speakPreviewAlternativeText = function () {
        this.speakWithLanguageFromPresenter(presenter.configuration.animations[presenter.currentAnimationIndex].altTextPreview);
    };

    LottiePlayerKeyboardController.prototype.speakWithLanguageFromLesson = function (message) {
        this.speakMessage(message, false);
    };

    LottiePlayerKeyboardController.prototype.speakWithLanguageFromPresenter = function (message) {
        this.speakMessage(message, true);
    };

    LottiePlayerKeyboardController.prototype.speakMessage = function (message, isLangFromPresenter = true) {
        let textVoices = [];
        if (isLangFromPresenter) {
            textVoices.push(window.TTSUtils.getTextVoiceObject(message, presenter.configuration.langTag));
        } else {
            textVoices.push(window.TTSUtils.getTextVoiceObject(message));
        }
        presenter.speak(textVoices);
    };

    presenter.speak = function (data) {
        let tts = presenter.getTextToSpeechOrNull(presenter.playerController);
        if (tts && presenter.isWCAGOn) {
            tts.speak(data);
        }
    };

    presenter.getTextToSpeechOrNull = function (playerController) {
        if (playerController) {
            return playerController.getModule('Text_To_Speech1');
        }

        return null;
    };

    presenter.destroy = function () {
        presenter.removeEventListeners(presenter.isPreview);

        if (presenter.playerController && !presenter.playerController.isPlayerInCrossDomain()) {
            $(window.parent.document).unbind("scroll");
        }
    };

    presenter.removeEventListeners = function (isPreview) {
        if (!isPreview) {
            removeEventListenersToView();
        }
        presenter.animationsElements.forEach(
            (animation, index) => removeRunEventListenersToAnimationElement(animation, index, isPreview)
        );
        presenter.keyboardControllerObject.removeEventListeners();
    };

    function removeEventListenersToView () {
        presenter.view.removeEventListener("touchstart", (e) => {
            e.stopPropagation();
        }, false);
        presenter.view.removeEventListener("touchend", presenter.clickHandler, false);
        presenter.view.removeEventListener("click", presenter.clickHandler, false);
    }

    function removeRunEventListenersToAnimationElement (animation, index, isPreview) {
        if (!isPreview) {
            animation.removeEventListener("load", (e) => presenter.onAnimationLoadForRun(e, index), false);
            animation.removeEventListener("error", (e) => presenter.onAnimationErrorForRun(e, index), false);
            animation.removeEventListener("ready", (e) => presenter.onAnimationReadyForRun(e, index), false);
            animation.removeEventListener("play", (e) => presenter.onAnimationPlayForRun(e, index), false);
            animation.removeEventListener("pause", (e) => presenter.onAnimationPauseForRun(e, index), false);
            animation.removeEventListener("stop", (e) => presenter.onAnimationStopForRun(e, index), false);
            animation.removeEventListener("freeze", (e) => presenter.onAnimationFreezeForRun(e, index), false);
            animation.removeEventListener("loop", (e) => presenter.onAnimationLoopForRun(e, index), false);
            animation.removeEventListener("complete", (e) => presenter.onAnimationCompleteForRun(e, index), false);

            if (presenter.configuration.sendEventOnEveryFrame) {
                animation.removeEventListener("frame", (e) => presenter.onAnimationFrameForRun(e, index), false);
            }
        }

        if (presenter.configuration.playInSuccession) {
            animation.removeEventListener("ready", (e) => presenter.onAnimationReadyForPlayedInSuccession(e, index), false);
            animation.removeEventListener("loop", (e) => presenter.onAnimationLoopForPlayedInSuccession(e, index), false);
            animation.removeEventListener("complete", (e) => presenter.onAnimationCompleteForPlayedInSuccession(e, index), false);
        } else {
            animation.removeEventListener("loop", (e) => presenter.onAnimationLoopForNotPlayedInSuccession(e, index), false);
        }
        if (presenter.previouslyVisited) {
            animation.removeEventListener("ready", (e) => presenter.onAnimationReadyForSetState(e, index), false);
        }
    }

    function setAnimationStateAsPlaying(index){
        return presenter.animationsStates[index].play();
    }

    function setAnimationStateAsStopped(index){
        return presenter.animationsStates[index].stop();
    }

    function setAnimationStateAsPaused(index){
        return presenter.animationsStates[index].pause();
    }

    function setAnimationStateAsFrozen(index){
        return presenter.animationsStates[index].freeze();
    }

    function isAnimationPlaying (index) {
        return presenter.animationsStates[index].isPlaying();
    }

    function isAnimationStopped (index) {
        return presenter.animationsStates[index].isStopped();
    }

    function isAnimationPaused (index) {
        return presenter.animationsStates[index].isPaused();
    }

    function isAnimationFrozen (index) {
        return presenter.animationsStates[index].isFrozen();
    }

    function increaseAnimationPlayedLoops (index) {
        return presenter.animationsStates[index].increasePlayedLoops()
    }

    function resetAnimationPlayedLoops (index) {
        return presenter.animationsStates[index].resetPlayedLoops()
    }

    function isAnimationFinishedLoops (index) {
        if (presenter.configuration.animations[index].loopsNumber === null) {
            return false;
        }
        return presenter.animationsStates[index].playedLoops === presenter.configuration.animations[index].loopsNumber;
    }

    function AnimationState (index) {
        this.index = index;

        this.playedLoops = 0;
        this.status = this.STATUES.STOPPED;
    }

    AnimationState.prototype.STATUES = {
        STOPPED: 0,
        PLAYING: 1,
        PAUSED: 2,
        FROZEN: 3
    };

    AnimationState.prototype.serialize = function () {
        return {
            index: this.index,
            status: this.status,
            playedLoops: this.playedLoops
        };
    };

    AnimationState.prototype.deserialize = function (obj) {
        this.index = obj.index;
        this.status = obj.status;
        this.playedLoops = obj.playedLoops;
    };

    AnimationState.prototype.increasePlayedLoops = function () {
        this.playedLoops++;
    };

    AnimationState.prototype.resetPlayedLoops = function () {
        this.playedLoops = 0;
    };

    AnimationState.prototype.play = function () {
        this.status = this.STATUES.PLAYING;
    };

    AnimationState.prototype.stop = function () {
        this.status = this.STATUES.STOPPED;
    };

    AnimationState.prototype.pause = function () {
        this.status = this.STATUES.PAUSED;
    };

    AnimationState.prototype.freeze = function () {
        this.status = this.STATUES.FROZEN;
    };

    AnimationState.prototype.isPlaying = function () {
        return this.status === this.STATUES.PLAYING;
    };

    AnimationState.prototype.isStopped = function () {
        return this.status === this.STATUES.STOPPED;
    };

    AnimationState.prototype.isPaused = function () {
        return this.status === this.STATUES.PAUSED;
    };

    AnimationState.prototype.isFrozen = function () {
        return this.status === this.STATUES.FROZEN;
    };

    return presenter;
}
