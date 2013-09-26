TestCase("[Plot] Event sending", {
    setUp: function() {
        this.presenter = AddonPlot_create();
        this.presenter.eventBus = {
            sendEvent: function() {
            }
        };
        this.presenter.broadcast = [];
        sinon.stub(this.presenter.eventBus, 'sendEvent');
    },
    tearDown: function() {
        this.presenter.eventBus.sendEvent.restore();
    },
    'test point event with minus x - unexpected en dash conversion error': function() {
        var addonID = 'Plot';
        var data = {
            item: 'point_-1_1',
            value: 0,
            score: 0
        };
        this.presenter.stateChanged(data);

        var eventData = this.presenter.eventBus.sendEvent.getCall(0).args[1];
        assertEquals('point_-1_1', eventData.item);
    },
    'test point event with minus y - unexpected en dash conversion error': function() {
        var addonID = 'Plot';
        var data = {
            item: 'point_1_-1',
            value: 0,
            score: 0
        };
        this.presenter.stateChanged(data);

        var eventData = this.presenter.eventBus.sendEvent.getCall(0).args[1];
        assertEquals('point_1_-1', eventData.item);
    },
    'test point event with minus x and y - unexpected en dash conversion error': function() {
        var addonID = 'Plot';
        var data = {
            item: 'point_-1_-1',
            value: 0,
            score: 0
        };
        this.presenter.stateChanged(data);

        var eventData = this.presenter.eventBus.sendEvent.getCall(0).args[1];
        assertEquals('point_-1_-1', eventData.item);
    },
    'test point event with . as decimal separator': function() {
        var addonID = 'Plot';
        var data = {
            item: 'point_-1.5_-1.5',
            value: 0,
            score: 0
        };
        this.presenter.decimalSeparator = '.';
        this.presenter.stateChanged(data);

        var eventData = this.presenter.eventBus.sendEvent.getCall(0).args[1];
        assertEquals('point_-1.5_-1.5', eventData.item);
    },
    'test point event with , as decimal separator': function() {
        var addonID = 'Plot';
        var data = {
            item: 'point_-1.5_-1.5',
            value: 0,
            score: 0
        };
        this.presenter.decimalSeparator = ',';
        this.presenter.stateChanged(data);

        var eventData = this.presenter.eventBus.sendEvent.getCall(0).args[1];
        assertEquals('point_-1,5_-1,5', eventData.item);
    }
});