TestCase("[Slideshow] States - get", {
    setUp: function () {
        this.presenter = AddonSlideshow_create();
        this.presenter.configuration = {
            isDomReferenceArrayComplete: true,
            isVisible: false
        };

        sinon.stub(this.presenter, 'pauseAudioResource');
    },

    tearDown: function () {
        this.presenter.pauseAudioResource.restore();
    },

    'test dom references ready': function () {
        var state = this.presenter.getState(),
            parsedState = JSON.parse(state);

        assertFalse(parsedState.isVisible);
    },

    'test dom references not ready': function () {
        this.presenter.configuration.isDomReferenceArrayComplete = false;
        this.presenter.configuration.isVisible = true;

        var state = this.presenter.getState(),
            parsedState = JSON.parse(state);

        assertTrue(parsedState.isVisible);
    }
});

TestCase("[Slideshow] States - set", {
    setUp: function () {
        this.presenter = AddonSlideshow_create();

        sinon.stub(this.presenter, 'setVisibility');
    },

    tearDown: function () {
        this.presenter.setVisibility.restore();
    },

    'test visible module': function () {
        this.presenter.setState(JSON.stringify({ isVisible: true }));

        assertTrue(this.presenter.setVisibility.calledWith(true));
    },

    'test hidden module': function () {
        this.presenter.setState(JSON.stringify({ isVisible: false }));

        assertTrue(this.presenter.setVisibility.calledWith(false));
    }
});