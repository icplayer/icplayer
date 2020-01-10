TestCase('[Limited Submit] Event sending tests', {
    setUp: function () {
        this.presenter = AddonLimited_Submit_create();

        this.stubs = {
            sendEventStub: sinon.stub()
        };

        this.presenter.eventBus = {
            sendEvent: this.stubs.sendEventStub
        };

        this.presenter.configuration = {
            addonID: 'Limited_Submit1',
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

    'test given empty event value when sendEvent is called then will send event by event bus': function () {
        this.presenter.sendEvent("");

        assertTrue(this.stubs.sendEventStub.calledOnce);
    },

    'test given addon id when sendEvent is called then will send addonId as source': function () {
        this.presenter.sendEvent("");
        var result = this.stubs.sendEventStub.getCall(0).args;

        assertEquals('Limited_Submit1', result[1].source);
    },

    'test given simple value when sendEvent is called then will send ValueChanged event': function () {
        this.presenter.sendEvent('Data');
        var result = this.stubs.sendEventStub.getCall(0).args;

        assertEquals('ValueChanged', result[0]);
    },

    'test given event value when sendEvent is called then this data is send as event value': function () {
        this.presenter.sendEvent('Data');
        var result = this.stubs.sendEventStub.getCall(0).args;

        assertEquals('Data', result[1].value);
    }
});