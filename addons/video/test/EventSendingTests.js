TestCase("[Video] Event data creation", {
    setUp: function () {
        this.presenter = Addonvideo_create();
        this.presenter.addonID = 'video1';
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
        this.presenter.addonID = 'video1';
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

TestCase("[Video] sendTimeUpdateEvent", {

    setUp: function () {
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

        this.stubs.getEventBus.returns(this.eventBusStub);
        this.presenter.setPlayerController(this.playerController)
    },

    'test should send ValueChanged type event at updating time': function () {
        this.presenter.sendTimeUpdateEvent({});

        var call = this.stubs.sendEventStub.getCall(0);
        assertEquals("ValueChanged", call.args[0]);
    },

    'test should send proper source, item, and value in the event data': function () {
        this.presenter.addonID = 1;
        this.presenter.currentMovie = 0;
        this.presenter.sendTimeUpdateEvent("Value");

        var call = this.stubs.sendEventStub.getCall(0);

        assertEquals(this.presenter.addonID, call.args[1].source);
        assertEquals(this.presenter.currentMovie + 1, call.args[1].item);
        assertEquals("Value", call.args[1].value);
    }
});