TestCase("Event sending", {
    setUp: function () {
        this.presenter = AddonCount_and_Graph_create();
        this.presenter.configuration = {
            'ID': 'graph1'
        };

        this.presenter.eventBus = {
            sendEvent: function () {}
        };
        sinon.stub(this.presenter.eventBus, 'sendEvent');
    },

    tearDown: function () {
        this.presenter.eventBus.sendEvent.restore();
    },

    'test new good answer' : function () {
        this.presenter.sendEvent(true, 1, "noChange");

        var firstEvent = this.presenter.eventBus.sendEvent.getCall(0),
            firstEventData = firstEvent.args[1];

        assertEquals('ValueChanged', firstEvent.args[0]);
        assertEquals('graph1', firstEventData.source);
        assertEquals('2', firstEventData.item);
        assertEquals('', firstEventData.value);
        assertEquals('1', firstEventData.score);
    },

    'test new bad answer' : function () {
        this.presenter.sendEvent(false, 2, "increase");

        var firstEvent = this.presenter.eventBus.sendEvent.getCall(0),
            firstEventData = firstEvent.args[1];

        assertEquals('ValueChanged', firstEvent.args[0]);
        assertEquals('graph1', firstEventData.source);
        assertEquals('3 increase', firstEventData.item);
        assertEquals('', firstEventData.value);
        assertEquals('0', firstEventData.score);
    }
});