TestCase("[Graph] Event sending", {
    setUp: function () {
        this.presenter = Addongraph_create();
        this.presenter.configuration = {
            isDecimalSeparatorSet: false,
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

    'test areAllOk function' : function () {
        assertTrue(this.presenter.areAllOk([[true, true, true],[true, true],[true]]));
        assertFalse(this.presenter.areAllOk([[true, true, true],[true, true],[false]]));
    },

    'test new good answer' : function () {
        this.presenter.configuration.results = [[false, false],[false, false]];

        this.presenter.sendOverallScoreEvent('increase', '1 0', 3.4, true, true, false, true);

        assertTrue(this.presenter.eventBus.sendEvent.calledTwice);

        var firstEvent = this.presenter.eventBus.sendEvent.getCall(0),
            firstEventData = firstEvent.args[1],
            secondEvent = this.presenter.eventBus.sendEvent.getCall(1),
            secondEventData = secondEvent.args[1];

        assertEquals('ValueChanged', firstEvent.args[0]);
        assertEquals('graph1', firstEventData.source);
        assertEquals('1 0 increase', firstEventData.item);
        assertEquals('3.4', firstEventData.value);
        assertNotUndefined(firstEventData.score);

        assertEquals('ValueChanged', secondEvent.args[0]);
        assertEquals('graph1', secondEventData.source);
        assertEquals('1 0', secondEventData.item);
        assertEquals('3.4', secondEventData.value);
        assertEquals('1', secondEventData.score);
    },

    'test new bad answer' : function () {
        this.presenter.configuration.results = [[false, false],[false, false]];

        this.presenter.sendOverallScoreEvent('increase', '1 0', 3.4, true, true, false, false);

        assertTrue(this.presenter.eventBus.sendEvent.calledTwice);

        var firstEvent = this.presenter.eventBus.sendEvent.getCall(0),
            firstEventData = firstEvent.args[1],
            secondEvent = this.presenter.eventBus.sendEvent.getCall(1),
            secondEventData = secondEvent.args[1];

        assertEquals('ValueChanged', firstEvent.args[0]);
        assertEquals('graph1', firstEventData.source);
        assertEquals('1 0 increase', firstEventData.item);
        assertEquals('3.4', firstEventData.value);
        assertNotUndefined(firstEventData.score);

        assertEquals('ValueChanged', secondEvent.args[0]);
        assertEquals('graph1', secondEventData.source);
        assertEquals('1 0', secondEventData.item);
        assertEquals('3.4', secondEventData.value);
        assertEquals('0', secondEventData.score);
    },

    'test new good answer + all ok' : function () {
        this.presenter.configuration.results = [[true, true],[true, true]];

        this.presenter.sendOverallScoreEvent('increase', '1 0', 3.4, true, true, false, true);

        assertTrue(this.presenter.eventBus.sendEvent.calledThrice);

        var firstEvent = this.presenter.eventBus.sendEvent.getCall(0),
            firstEventData = firstEvent.args[1],
            secondEvent = this.presenter.eventBus.sendEvent.getCall(1),
            secondEventData = secondEvent.args[1],
            thirdEvent = this.presenter.eventBus.sendEvent.getCall(2),
            thirdEventData = thirdEvent.args[1];

        assertEquals('ValueChanged', firstEvent.args[0]);
        assertEquals('graph1', firstEventData.source);
        assertEquals('1 0 increase', firstEventData.item);
        assertEquals('3.4', firstEventData.value);
        assertNotUndefined(firstEventData.score);

        assertEquals('ValueChanged', secondEvent.args[0]);
        assertEquals('graph1', secondEventData.source);
        assertEquals('1 0', secondEventData.item);
        assertEquals('3.4', secondEventData.value);
        assertEquals('1', secondEventData.score);

        assertEquals('ValueChanged', thirdEvent.args[0]);
        assertEquals('graph1', thirdEventData.source);
        assertEquals('all', thirdEventData.item);
    },

    'test new good answer with coma decimal separator' : function () {
        this.presenter.configuration.isDecimalSeparatorSet = true;
        this.presenter.configuration.decimalSeparator = ',';
        this.presenter.configuration.results = [[false, false],[false, false]];

        this.presenter.sendOverallScoreEvent('increase', '1 0', 3.4, true, true, false, true);

        assertTrue(this.presenter.eventBus.sendEvent.calledTwice);

        var firstEvent = this.presenter.eventBus.sendEvent.getCall(0),
            firstEventData = firstEvent.args[1],
            secondEvent = this.presenter.eventBus.sendEvent.getCall(1),
            secondEventData = secondEvent.args[1];

        assertEquals('ValueChanged', firstEvent.args[0]);
        assertEquals('graph1', firstEventData.source);
        assertEquals('1 0 increase', firstEventData.item);
        assertEquals('3,4', firstEventData.value);
        assertNotUndefined(firstEventData.score);

        assertEquals('ValueChanged', secondEvent.args[0]);
        assertEquals('graph1', secondEventData.source);
        assertEquals('1 0', secondEventData.item);
        assertEquals('3,4', secondEventData.value);
        assertEquals('1', secondEventData.score);
    }
});