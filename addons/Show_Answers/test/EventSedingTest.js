TestCase('[Show_Answers] Event sending tests', {
    setUp: function () {
        this.presenter = AddonShow_Answers_create();

        this.stubs = {
            sendEventStub: sinon.stub()
        };

        this.presenter.eventBus = {
            sendEvent: this.stubs.sendEventStub
        };

        this.presenter.configuration = {
            addonID: 'Show_Answers1'
        };
    },

    'test should call sendEvent only once': function () {
        this.presenter.sendEvent({});

        assertTrue(this.stubs.sendEventStub.calledOnce);
    },

    'test should send "Show_Answers1" as source in data': function () {
        this.presenter.sendEvent({});
        var result = this.stubs.sendEventStub.getCall(0).args;

        assertEquals('Show_Answers1', result[1].source);
    },

    'test should send "Event Name" as event name in data': function () {
        this.presenter.sendEvent('Event Name');
        var result = this.stubs.sendEventStub.getCall(0).args;

        assertEquals('Event Name', result[0]);
    }
});