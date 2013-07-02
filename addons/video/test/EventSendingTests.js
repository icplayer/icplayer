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