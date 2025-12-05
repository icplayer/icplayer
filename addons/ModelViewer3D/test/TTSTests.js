TestCase("[ModelViewer3D] TTS isSelectable tests", {
    setUp: function () {
        this.presenter = AddonModelViewer3D_create();
        this.presenter.configuration = {
            isVisible: true
        };
    },

    'test given TTS is on and addon is visible when isSelectable called then return true': function () {
        var result = this.presenter.isSelectable(true);

        assertTrue(result);
    },

    'test given TTS is off and addon is visible when isSelectable called then return false': function () {
        var result = this.presenter.isSelectable(false);

        assertFalse(result);
    },

    'test given TTS is on and addon is not visible when isSelectable called then return false': function () {
        this.presenter.configuration.isVisible = false;

        var result = this.presenter.isSelectable(true);

        assertFalse(result);
    },

    'test given TTS is off and addon is not visible when isSelectable called then return false': function () {
        this.presenter.configuration.isVisible = false;

        var result = this.presenter.isSelectable(false);

        assertFalse(result);
    }
});

TestCase("[ModelViewer3D] TTS setWCAGStatus tests", {
    setUp: function () {
        this.presenter = AddonModelViewer3D_create();
    },

    'test given WCAG status is off when setWCAGStatus called with true then isWCAGOn is true': function () {
        this.presenter.isWCAGOn = false;

        this.presenter.setWCAGStatus(true);

        assertTrue(this.presenter.isWCAGOn);
    },

    'test given WCAG status is on when setWCAGStatus called with false then isWCAGOn is false': function () {
        this.presenter.isWCAGOn = true;

        this.presenter.setWCAGStatus(false);

        assertFalse(this.presenter.isWCAGOn);
    }
});

TestCase("[ModelViewer3D] TTS getTextToRead tests", {
    setUp: function () {
        this.presenter = AddonModelViewer3D_create();
        this.presenter.configuration = {
            altText: ""
        };
    },

    'test given altText is set when getTextToRead called then return altText': function () {
        this.presenter.configuration.altText = "3D Model Description";

        var result = this.presenter.getTextToRead();

        assertEquals("3D Model Description", result);
    },

    'test given altText is empty when getTextToRead called then return empty string': function () {
        this.presenter.configuration.altText = "";

        var result = this.presenter.getTextToRead();

        assertEquals("", result);
    },

    'test given altText is only whitespace when getTextToRead called then return empty string': function () {
        this.presenter.configuration.altText = "   ";

        var result = this.presenter.getTextToRead();

        assertEquals("", result);
    },

    'test given altText is undefined when getTextToRead called then return empty string': function () {
        this.presenter.configuration.altText = undefined;

        var result = this.presenter.getTextToRead();

        assertEquals("", result);
    }
});

TestCase("[ModelViewer3D] TTS speak tests", {
    setUp: function () {
        this.presenter = AddonModelViewer3D_create();
        this.ttsModule = {
            speak: sinon.mock()
        };
        this.presenter.playerController = {
            getModule: sinon.stub().returns(this.ttsModule)
        };
        this.presenter.isWCAGOn = true;
    },

    'test given WCAG is on and TTS module exists when speak called then TTS speak method is called': function () {
        this.presenter.speak("Test text");

        assertTrue(this.ttsModule.speak.calledWith("Test text"));
    },

    'test given WCAG is off when speak called then TTS speak method is not called': function () {
        this.presenter.isWCAGOn = false;

        this.presenter.speak("Test text");

        assertFalse(this.ttsModule.speak.called);
    },

    'test given TTS module does not exist when speak called then no error is thrown': function () {
        this.presenter.playerController.getModule = sinon.stub().returns(null);

        this.presenter.speak("Test text");

        assertFalse(this.ttsModule.speak.called);
    }
});
