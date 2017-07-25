TestCase("[Video] Event data creation", {
    setUp: function () {
        this.presenter = Addonvideo_create();
        this.presenter.configuration.addonID = 'video1';
    },

    'test create event for first video ended': function () {
        var eventData = this.presenter.createEndedEventData(0);

        assertEquals('video1', eventData.source);
        assertEquals(1, eventData.item);
        assertEquals('ended', eventData.value);
    }
});

TestCase("[Video] Event sending", {
    setUp: function () {
        this.presenter = Addonvideo_create();
        this.presenter.configuration.addonID = 'video1';
        this.presenter.currentMovie = 0;

        this.presenter.eventBus = {
            sendEvent: function () {}
        };

        sinon.stub(this.presenter.eventBus, 'sendEvent');
    },

    'test send event when first video ended': function () {
        this.presenter.sendVideoEndedEvent();

        assertTrue(this.presenter.eventBus.sendEvent.calledOnce);

        var callArguments = this.presenter.eventBus.sendEvent.getCall(0).args;

        assertEquals('ValueChanged', callArguments[0]);
        assertEquals('video1', callArguments[1].source);
        assertEquals('1', callArguments[1].item);
        assertEquals('ended', callArguments[1].value);
    },

    'test send event when second video ended': function () {
        this.presenter.currentMovie = 1;

        this.presenter.sendVideoEndedEvent();

        assertTrue(this.presenter.eventBus.sendEvent.calledOnce);

        var callArguments = this.presenter.eventBus.sendEvent.getCall(0).args;

        assertEquals('ValueChanged', callArguments[0]);
        assertEquals('video1', callArguments[1].source);
        assertEquals('2', callArguments[1].item);
        assertEquals('ended', callArguments[1].value);
    }
});

(function () {
    TestCase("[Video] sendTimeUpdateEvent", {

        setUp: setUpPresenter,

        'test should send ValueChanged type event at updating time': function () {
            this.presenter.sendTimeUpdateEvent({});

            var call = this.stubs.sendEventStub.getCall(0);
            assertEquals("ValueChanged", call.args[0]);
        },

        'test should send addonId in the event data': function () {
            this.presenter.sendTimeUpdateEvent({});

            var call = this.stubs.sendEventStub.getCall(0);

            assertEquals(this.presenter.configuration.addonID, call.args[1].source);
        },

        'test should send currentMovie + 1 in the event data': function () {
            this.presenter.sendTimeUpdateEvent({});

            var call = this.stubs.sendEventStub.getCall(0);

            assertEquals(this.presenter.currentMovie + 1, call.args[1].item);
        },

        'test should send "Value" in the event data': function () {
            this.presenter.sendTimeUpdateEvent("Value");

            var call = this.stubs.sendEventStub.getCall(0);

            assertEquals("Value", call.args[1].value);
        },

        'test should send event only once': function () {
            this.presenter.sendTimeUpdateEvent({});

            assertTrue(this.stubs.sendEventStub.calledOnce);
        }
    });

    TestCase("[Video] onVideoPlaying", {

        setUp: setUpPresenter,

        'test should send ValueChanged event on playing': function () {
            this.presenter.onVideoPlaying();

            var call = this.stubs.sendEventStub.getCall(0);

            assertEquals("ValueChanged", call.args[0]);
        },

        'test should send addonID as source in event data on playing': function () {
            this.presenter.onVideoPlaying();

            var call = this.stubs.sendEventStub.getCall(0);

            assertEquals(this.presenter.configuration.addonID, call.args[1].source);
        },

        'test should send currentMovie + 1 as item in event data on playing': function () {
            this.presenter.onVideoPlaying();

            var call = this.stubs.sendEventStub.getCall(0);

            assertEquals(this.presenter.currentMovie + 1, call.args[1].item);
        },

        'test should send playing as value in event data on playing': function () {
            this.presenter.onVideoPlaying();

            var call = this.stubs.sendEventStub.getCall(0);

            assertEquals("playing", call.args[1].value);
        },

        'test should two events when started playing from 0 seconds': function () {
            this.presenter.videoObject.currentTime = 0;
            this.presenter.onVideoPlaying();

            assertTrue(this.stubs.sendEventStub.calledTwice);
        },

        'test should one event when started playing from other than 0 seconds': function () {
            this.presenter.videoObject.currentTime = 1;
            this.presenter.onVideoPlaying();

            assertTrue(this.stubs.sendEventStub.calledOnce);
        },

        'test should send 00:00 as value of second event when started from 0 seconds': function () {
            this.presenter.onVideoPlaying();

            var call = this.stubs.sendEventStub.getCall(1);

            assertEquals("00:00", call.args[1].value);
        },

        'test should send addonId as source of second event when started from 0 seconds': function () {
            this.presenter.onVideoPlaying();

            var call = this.stubs.sendEventStub.getCall(1);

            assertEquals(this.presenter.configuration.addonID, call.args[1].source);
        },

        'test should send currentMovie + 1 as item of second event when started from 0 seconds': function () {
            this.presenter.onVideoPlaying();

            var call = this.stubs.sendEventStub.getCall(1);

            assertEquals(this.presenter.currentMovie + 1, call.args[1].item);
        }
    });

    function setUpPresenter() {
        this.presenter = new Addonvideo_create();

        this.stubs = {
            registerHooks: sinon.stub(this.presenter, 'registerHook'),
            getEventBus: sinon.stub(),
            addEventListenerStub: sinon.stub(),
            sendEventStub: sinon.stub()
        };

        this.playerController = {
            getEventBus: this.stubs.getEventBus
        };

        this.eventBusStub = {
            addEventListener: this.stubs.addEventListenerStub,
            sendEvent: this.stubs.sendEventStub
        };

        this.presenter.configuration.addonID = 'video1';
        this.presenter.currentMovie = 0;
        this.presenter.videoObject = document.createElement("video");
        this.presenter.videoObject.currentTime = 0;

        this.stubs.getEventBus.returns(this.eventBusStub);
        this.presenter.setPlayerController(this.playerController)
    }
})();


TestCase("[Video] sendTimeUpdate", {
    setUp: function () {
        this.presenter = new Addonvideo_create();

        this.presenter.videoObject = document.createElement("video");

        this.stubs = {
            sendTimeUpdateEvent: sinon.stub(this.presenter, "sendTimeUpdateEvent")
        }
    },

    tearDown: function () {
        this.stubs.sendTimeUpdateEvent.restore();
    },

    'test should not call sendTimeUpdateEvent when current time equals last sent time': function () {
        this.presenter.lastSentCurrentTime = 0;
        this.presenter.videoObject.currentTime = 0;

        this.presenter.sendTimeUpdate();

        assertFalse(this.stubs.sendTimeUpdateEvent.called);
    },

    'test should call sendTimeUpdateEvent when current time not equals last sent time': function () {
        this.presenter.lastSentCurrentTime = 0;
        this.presenter.videoObject.currentTime = 1;

        this.presenter.sendTimeUpdate();

        assertTrue(this.stubs.sendTimeUpdateEvent.called);
    },

    'test should change last sent time to actual video time': function () {
        this.presenter.lastSentCurrentTime = 0;
        this.presenter.videoObject.currentTime = 1;

        this.presenter.sendTimeUpdate();

        assertEquals(this.presenter.lastSentCurrentTime, this.presenter.videoObject.currentTime);
    }
});
