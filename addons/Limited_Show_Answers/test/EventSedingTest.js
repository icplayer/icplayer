TestCase('[Limited_Show_Answers] Event sending tests', {
    setUp: function () {
        this.presenter = AddonLimited_Show_Answers_create();

        this.stubs = {
            sendEventStub: sinon.stub()
        };

        this.presenter.eventBus = {
            sendEvent: this.stubs.sendEventStub
        };

        this.presenter.configuration = {
            addonID: 'Show_Answers1',
            worksWithModulesList: ["text1", "text2", "text3"]
        };

        self = this;
        self.addons = [];

        player = {
            getPlayerServices: function () {
                return {
                    getModule: function (id) {
                        return {
                            onEventReceived: function (eventName) {
                                self.addons.push({
                                    id: id,
                                    eventName: eventName
                                });
                            }
                        }
                    }
                }
            }
        };
    },

    tearDown: function () {
      delete player;
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
        this.presenter.sendEvent('Data');
        var result = this.stubs.sendEventStub.getCall(0).args;

        assertEquals('ValueChanged', result[0]);
    },

    'test should send as value LimitedShowAnswers': function () {
        this.presenter.sendEvent('Data');
        var result = this.stubs.sendEventStub.getCall(0).args;

        assertEquals('Data', result[1].value);
    },

    'test send event should call onEventReceived': function () {
        this.presenter.sendEvent('LimitedShowAnswers');

    }
});