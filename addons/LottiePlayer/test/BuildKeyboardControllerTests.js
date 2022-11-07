function createSimpleLottiePLayerConfigurationForTests () {
    return {
        isValid: true,
        addonID: "LottiePlayer1",
        isVisible: true,
        animations: [
            {
                animationSrc: "src1",
                isLoop: false,
                isAutoplay: false,
                direction: "Forward",
                mode: "Bounce",
                loopsNumber: 2,
                speed: 0.5,
                intermission: 1000,
                background: "transparent",
                altText: "Some alternative text",
                altTextPreview: "Some preview alternative text",
            },
            {
                animationSrc: "src1",
                isLoop: true,
                isAutoplay: true,
                direction: "Backward",
                mode: "Normal",
                loopsNumber: 1,
                speed: 1,
                intermission: 0,
                background: "#D5F5E3",
                altText: "Alternative text",
                altTextPreview: "Preview alternative text",
            }
        ],
        controls: true,
        playInSuccession: false,
        loopSuccession: false,
        sendEventOnEveryFrame: false,
        langTag: "",
    };
}

function createLottiePlayerViewForTests (configuration, visibleAnimationIndex = 0) {
    // This view is a simplified view created by the 'lottie-player' script.
    let view = document.createElement("div");
    let $view = $(view);

    configuration.animations.forEach((animationConf, index) => {
        let $animation = $(document.createElement("lottie-player"));
        $animation.addClass(`lottie-player-${index}`);
        $view.append($animation);

        if (index === visibleAnimationIndex) {
            $animation.addClass("lottie-player-visible-animation");
        } else {
            $animation.addClass("lottie-player-invisible-animation");
        }

        let animation = $animation[0];
        setLottiePLayerAnimationIsPaused(animation, true);
        animation.play = function () {
            setLottiePLayerAnimationIsPaused(animation, false);
        };
        animation.pause = function () {
            setLottiePLayerAnimationIsPaused(animation, true);
        };
        animation.freeze = function () {
            setLottiePLayerAnimationIsPaused(animation, index, true);
        };
        animation.stop = function () {
            setLottiePLayerAnimationIsPaused(animation, index, true);
        };

        const shadowRoot = animation.attachShadow({ mode: "open" });

        let $animationContainer = $(document.createElement("div"));
        $animationContainer.attr("id", "animation-container");
        shadowRoot.appendChild(document.createElement("div"));
        shadowRoot.appendChild(document.createElement("div"));
        shadowRoot.appendChild($animationContainer[0]);

        let $trueAnimation = $(document.createElement("div"));
        $trueAnimation.attr("id", "animation");
        $animationContainer.append($trueAnimation);

        if (configuration.controls) {
            let $animationControls = $(document.createElement("div"));
            $animationControls.attr("id", "lottie-controls");
            $animationContainer.append($animationControls);

            let $playButton = $(document.createElement("button"));
            $playButton.attr("id", "lottie-play-button");
            $animationControls.append($playButton);

            let $stopButton = $(document.createElement("button"));
            $stopButton.attr("id", "lottie-stop-button");
            $animationControls.append($stopButton);

            let $seeker = $(document.createElement("input"));
            $seeker.attr("id", "lottie-seeker-input");
            $animationControls.append($seeker);

            let $loopButton = $(document.createElement("button"));
            $loopButton.attr("id", "lottie-loop-toggle");
            $animationControls.append($loopButton);
        }
    })
    return view;
}

function setLottiePLayerAnimationIsPaused (animation, isPaused = true) {
    animation.getLottie = () => ({
        isPaused: isPaused
    })
}

function hasId($element, id) {
    return $element.attr("id") === id;
}

TestCase("[LottiePlayer] Build KeyboardController tests", {

    setUp: function () {
        this.presenter = new AddonLottiePlayer_create();

        this.presenter.configuration = createSimpleLottiePLayerConfigurationForTests();
        this.presenter.currentAnimationIndex = 0;
    },

    buildView: function() {
        this.presenter.view = createLottiePlayerViewForTests(this.presenter.configuration);
        this.presenter.$view = $(this.presenter.view);
    },

    'test given view with animation with controls when buildKeyboardController is called then keyboard controller do not have elements' : function () {
        this.presenter.configuration.controls = true;
        this.buildView();

        this.presenter.buildKeyboardController();

        const expectedElementsNumber = 0;
        assertEquals(expectedElementsNumber, this.presenter.keyboardControllerObject.keyboardNavigationElementsLen);
    },

    'test given view with animation without controls when buildKeyboardController is called then keyboard controller do not have elements' : function () {
        this.presenter.configuration.controls = false;
        this.buildView();

        this.presenter.buildKeyboardController();

        const expectedElementsNumber = 0;
        assertEquals(expectedElementsNumber, this.presenter.keyboardControllerObject.keyboardNavigationElementsLen);
    },
});


TestCase("[LottiePlayer] Reload KeyboardController elements tests", {

    setUp: function () {
        this.presenter = new AddonLottiePlayer_create();

        this.presenter.configuration = createSimpleLottiePLayerConfigurationForTests();
    },

    buildViewAndControler: function() {
        this.presenter.view = createLottiePlayerViewForTests(this.presenter.configuration);
        this.presenter.$view = $(this.presenter.view);
        this.presenter.buildKeyboardController();
        this.keyboardControllerObject = this.presenter.keyboardControllerObject;
    },

    getKeyboardControllerElement: function (index) {
        return $(this.presenter.keyboardControllerObject.keyboardNavigationElements[index]);
    },

    'test given view with animation with controls when reloadElements is called then keyboard controller have current animation controls' : function () {
        this.buildViewAndControler();

        this.keyboardControllerObject.reloadElements();

        const expectedElementsNumber = 3;
        assertEquals(expectedElementsNumber, this.presenter.keyboardControllerObject.keyboardNavigationElementsLen);
        assertTrue(hasId(this.getKeyboardControllerElement(0), this.presenter.DOM_IDS.PLAY_BUTTON));
        assertTrue(hasId(this.getKeyboardControllerElement(1), this.presenter.DOM_IDS.STOP_BUTTON));
        assertTrue(hasId(this.getKeyboardControllerElement(2), this.presenter.DOM_IDS.LOOP_BUTTON));
    },

    'test given view with animation without controls when reloadElements is called then keyboard controller do not have elements' : function () {
        this.presenter.configuration.controls = false;
        this.buildViewAndControler();

        this.keyboardControllerObject.reloadElements();

        const expectedElementsNumber = 0;
        assertEquals(expectedElementsNumber, this.presenter.keyboardControllerObject.keyboardNavigationElementsLen);
    },

    'test given active keyboardController when reloadElements is called then current keyboard navigation element not changed' : function () {
        this.buildViewAndControler();
        this.keyboardControllerObject.keyboardNavigationActive = true;
        this.keyboardControllerObject.keyboardNavigationElements = this.presenter.getElementsForKeyboardNavigation();
        this.keyboardControllerObject.keyboardNavigationCurrentElementIndex = 2;
        this.keyboardControllerObject.keyboardNavigationCurrentElement = this.keyboardControllerObject.keyboardNavigationElements[2];
        assertTrue(hasId($(this.keyboardControllerObject.keyboardNavigationCurrentElement), this.presenter.DOM_IDS.LOOP_BUTTON));

        this.keyboardControllerObject.reloadElements();

        assertEquals(2, this.keyboardControllerObject.keyboardNavigationCurrentElementIndex);
        assertTrue(hasId($(this.keyboardControllerObject.keyboardNavigationCurrentElement), this.presenter.DOM_IDS.LOOP_BUTTON));
    },

    'test given not active keyboardController when reloadElements is called then current keyboard navigation element reset to first' : function () {
        this.buildViewAndControler();
        this.keyboardControllerObject.keyboardNavigationActive = false;
        this.keyboardControllerObject.keyboardNavigationElements = this.presenter.getElementsForKeyboardNavigation();
        this.keyboardControllerObject.keyboardNavigationCurrentElementIndex = 2;
        this.keyboardControllerObject.keyboardNavigationCurrentElement = this.keyboardControllerObject.keyboardNavigationElements[2];
        assertTrue(hasId($(this.keyboardControllerObject.keyboardNavigationCurrentElement), this.presenter.DOM_IDS.LOOP_BUTTON));

        this.keyboardControllerObject.reloadElements();

        assertEquals(0, this.keyboardControllerObject.keyboardNavigationCurrentElementIndex);
        assertTrue(hasId($(this.keyboardControllerObject.keyboardNavigationCurrentElement), this.presenter.DOM_IDS.PLAY_BUTTON));
    },
});
