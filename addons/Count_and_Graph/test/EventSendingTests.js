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
        assertEquals('1', firstEventData.item);
        assertEquals('', firstEventData.value);
        assertEquals('1', firstEventData.score);
    },

    'test new bad answer' : function () {
        this.presenter.sendEvent(false, 2, "increase");

        var firstEvent = this.presenter.eventBus.sendEvent.getCall(0),
            firstEventData = firstEvent.args[1];

        assertEquals('ValueChanged', firstEvent.args[0]);
        assertEquals('graph1', firstEventData.source);
        assertEquals('2 increase', firstEventData.item);
        assertEquals('', firstEventData.value);
        assertEquals('0', firstEventData.score);
    }

//    'test new good answer + all ok' : function () {
//        this.presenter.configuration.results = [[true, true],[true, true]];
//
//        this.presenter.sendOverallScoreEvent('increase', '1 0', 3, true, true, false, true);
//
//        assertTrue(this.presenter.eventBus.sendEvent.calledThrice);
//
//        var firstEvent = this.presenter.eventBus.sendEvent.getCall(0),
//            firstEventData = firstEvent.args[1],
//            secondEvent = this.presenter.eventBus.sendEvent.getCall(1),
//            secondEventData = secondEvent.args[1],
//            thirdEvent = this.presenter.eventBus.sendEvent.getCall(2),
//            thirdEventData = thirdEvent.args[1];
//
//        assertEquals('ValueChanged', firstEvent.args[0]);
//        assertEquals('graph1', firstEventData.source);
//        assertEquals('1 0 increase', firstEventData.item);
//        assertEquals('3', firstEventData.value);
//        assertNotUndefined(firstEventData.score);
//
//        assertEquals('ValueChanged', secondEvent.args[0]);
//        assertEquals('graph1', secondEventData.source);
//        assertEquals('1 0', secondEventData.item);
//        assertEquals('3', secondEventData.value);
//        assertEquals('1', secondEventData.score);
//
//        assertEquals('ValueChanged', thirdEvent.args[0]);
//        assertEquals('graph1', thirdEventData.source);
//        assertEquals('all', thirdEventData.item);
//    }
});