TestCase("Event sending", {
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

    'test new value without custom decimal separator': function () {
        this.presenter.sendOverallScoreEvent('increase', '1 0', 3.4, true, true, false, false);

        assertTrue(this.presenter.eventBus.sendEvent.calledOnce);

        assertEquals('ValueChanged', this.presenter.eventBus.sendEvent.getCall(0).args[0]);

        var eventData = this.presenter.eventBus.sendEvent.getCall(0).args[1];
        assertEquals('graph1', eventData.source);
        assertEquals('1 0 increase', eventData.item);
        assertEquals('3.4', eventData.value);
        assertNotUndefined(eventData.score);
    },

    'test new value with custom decimal separator': function () {
        this.presenter.configuration.isDecimalSeparatorSet = true;
        this.presenter.configuration.decimalSeparator = ',';

        this.presenter.sendOverallScoreEvent('increase', '1 0', 3.4, true, true, false, false);

        assertTrue(this.presenter.eventBus.sendEvent.calledOnce);

        assertEquals('ValueChanged', this.presenter.eventBus.sendEvent.getCall(0).args[0]);

        var eventData = this.presenter.eventBus.sendEvent.getCall(0).args[1];
        assertEquals('graph1', eventData.source);
        assertEquals('1 0 increase', eventData.item);
        assertEquals('3,4', eventData.value);
        assertNotUndefined(eventData.score);
    }
});