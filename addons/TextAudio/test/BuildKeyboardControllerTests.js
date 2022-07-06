TestCase("[TextAudio] Build keyboard controller tests", {

    setUp: function () {
        this.presenter = new AddonTextAudio_create();

        this.presenter.configuration = {};

        this.stubs = {
            playPauseCallbackStub: sinon.stub(this.presenter, "playPauseCallback"),
            stopStub: sinon.stub(this.presenter, "stop"),
            attachProgressListenersStub: sinon.stub(this.presenter, "attachProgressListeners"),
            toogleVolumeLayerStub: sinon.stub(this.presenter, "toogleVolumeLayer"),
            volumeLayerOnClickStub: sinon.stub(this.presenter, "volumeLayerOnClick"),
            setPlaybackRateStub: sinon.stub(this.presenter, "setPlaybackRate"),
        };
    },

    tearDown: function() {
        this.stubs.playPauseCallbackStub.restore();
        this.stubs.stopStub.restore();
        this.stubs.attachProgressListenersStub.restore();
        this.stubs.toogleVolumeLayerStub.restore();
        this.stubs.volumeLayerOnClickStub.restore();
        this.stubs.setPlaybackRateStub.restore();
    },

    'test given presenter without built keyboard controller when buildKeyboardController is called then set keyboard controller to presenter with elements returned from getElementsForKeyboardNavigation' : function () {
        this.elements = [sinon.spy(), sinon.spy(), sinon.spy()];
        this.presenter.getElementsForKeyboardNavigation = sinon.stub();
        this.presenter.getElementsForKeyboardNavigation.returns(this.elements);

        assertTrue(this.presenter.keyboardControllerObject === null);

        this.presenter.buildKeyboardController();

        assertTrue(this.presenter.keyboardControllerObject !== null);
        assertTrue(this.presenter.getElementsForKeyboardNavigation.calledOnce);
        assertEquals(this.elements, this.presenter.keyboardControllerObject.keyboardNavigationElements);
    },

    'test given view, custom controls and enabled playback speed controls when buildKeyboardController is called then keyboard controller have 6 elements in correct order' : function () {
        this.editConfigurationToUseCustomControls();
        this.enablePlaybackSpeedControls();
        this.createView();

        assertTrue(this.presenter.keyboardControllerObject === null);

        this.presenter.buildKeyboardController();

        const expectedElements = [this.presenter.$playPauseBtn, this.presenter.$stopBtn, this.presenter.$playbackRateControls]
            .concat(this.presenter.slidesSpanElements.map(spanElement => $(spanElement)));
        assertTrue(this.presenter.keyboardControllerObject !== null);
        assertEquals(expectedElements.length, this.presenter.keyboardControllerObject.keyboardNavigationElementsLen);
        assertEquals(expectedElements, this.presenter.keyboardControllerObject.keyboardNavigationElements);
    },

    'test given view, custom controls and disabled playback speed controls when buildKeyboardController is called then keyboard controller have 5 elements in correct order' : function () {
        this.editConfigurationToUseCustomControls();
        this.disablePlaybackSpeedControls();
        this.createView();

        assertTrue(this.presenter.keyboardControllerObject === null);

        this.presenter.buildKeyboardController();

        const expectedElements = [this.presenter.$playPauseBtn, this.presenter.$stopBtn]
            .concat(this.presenter.slidesSpanElements.map(spanElement => $(spanElement)));
        assertTrue(this.presenter.keyboardControllerObject !== null);
        assertEquals(expectedElements.length, this.presenter.keyboardControllerObject.keyboardNavigationElementsLen);
        assertEquals(expectedElements, this.presenter.keyboardControllerObject.keyboardNavigationElements);
    },

    'test given view, browser controls when buildKeyboardController is called then keyboard controller have 3 slide elements in correct order' : function () {
        this.editConfigurationToUseBrowserControls();
        this.createView();

        assertTrue(this.presenter.keyboardControllerObject === null);

        this.presenter.buildKeyboardController();

        const expectedElements = this.presenter.slidesSpanElements.map(spanElement => $(spanElement));
        assertTrue(this.presenter.keyboardControllerObject !== null);
        assertEquals(expectedElements.length, this.presenter.keyboardControllerObject.keyboardNavigationElementsLen);
        assertEquals(expectedElements, this.presenter.keyboardControllerObject.keyboardNavigationElements);
    },

    'test given view, none controls when buildKeyboardController is called then keyboard controller have 3 slide elements in correct order' : function () {
        this.editConfigurationToNotUseControls();
        this.createView();

        assertTrue(this.presenter.keyboardControllerObject === null);

        this.presenter.buildKeyboardController();

        const expectedElements = this.presenter.slidesSpanElements.map(spanElement => $(spanElement));
        assertTrue(this.presenter.keyboardControllerObject !== null);
        assertEquals(expectedElements.length, this.presenter.keyboardControllerObject.keyboardNavigationElementsLen);
        assertEquals(expectedElements, this.presenter.keyboardControllerObject.keyboardNavigationElements);
    },

    editConfigurationToUseCustomControls: function () {
        this.presenter.configuration["controls"] = "Custom";
    },

    editConfigurationToUseBrowserControls: function () {
        this.presenter.configuration["controls"] = "Browser";
    },

    editConfigurationToNotUseControls: function () {
        this.presenter.configuration["controls"] = "None";
    },

    disablePlaybackSpeedControls: function () {
        this.presenter.configuration["enablePlaybackSpeedControls"] = false;
    },

    enablePlaybackSpeedControls: function () {
        this.presenter.configuration["enablePlaybackSpeedControls"] = true;
    },

    createView: function () {
        let view = document.createElement("div");
        view.classList.add("wrapper-addon-textaudio");

        let player = document.createElement("div");
        player.classList.add("textaudio-player");
        view.append(player);

        let text = document.createElement("div");
        text.classList.add("textaudio-text");
        text.classList.add("slide-id-0");
        view.append(text);

        this.presenter.view = view;
        this.presenter.$view = $(view);
        this.presenter.$audioWrapper = $(player);

        this.presenter.createHtmlPlayer();

        this.presenter.slidesSpanElements = []
        for (var i = 0; i < 3; i++ ) {
            let span = document.createElement("span");
            span.classList.add("textelement" + i);
            span.value = "Slide " + i;
            this.presenter.slidesSpanElements.push(span);
        }
    },
});
