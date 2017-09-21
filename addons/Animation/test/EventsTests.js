TestCase("[Animation] events tests", {
    setUp: function () {
        this.presenter = AddonAnimation_create();

        this.presenter.configuration.animationState = this.presenter.ANIMATION_STATE.PLAYING;
        this.presenter.configuration.currentFrame = 50;
        this.presenter.configuration.framesCount = 49;
        $.doTimeout = function () {};
        this.presenter.eventBus = {
            sendEvent: sinon.spy()
        }

        this.presenter.frames = [];
        for (var i = 0; i < 200; i++) {
            this.presenter.frames.push($("<div></div>"));
        }

        this.presenter.configuration.labels = {
            content: ""
        }
    },

    'test event end animation will be called if animation was ended without loop': function () {
        this.presenter.onTimeoutCallback();
        
        assertTrue(this.presenter.eventBus.sendEvent.calledOnce);
    },

    'test event end animation will be called if animation was ended with loop': function () {
        this.presenter.configuration.loop = true;
        this.presenter.onTimeoutCallback();
        assertTrue(this.presenter.eventBus.sendEvent.calledOnce);
    },

    'test if animation is not ended, then event will not be sent': function () {
        this.presenter.configuration.framesCount = 100;
        this.presenter.onTimeoutCallback();

        assertFalse(this.presenter.eventBus.sendEvent.called);
    }
});