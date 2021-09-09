function generateConnections(count) {
    var connections = [];

    for (var i = 0; i < count; i++) {
        connections.push({
            conditions: i,
            target: i
        });
    }

    return connections;
}

TestCase("[Adaptive_Next] Click handling test - prev button", {
    setUp: function() {
        this.presenter = AddonAdaptive_Next_create();

        this.stubs = {
            moveToPrevPageMock: sinon.stub()
        };

        this.adaptiveLearningServiceMock = {
            moveToPrevPage: this.stubs.moveToPrevPageMock
        };

        this.presenter.adaptiveLearningService = this.adaptiveLearningServiceMock;
        this.presenter.configuration = {
            Direction: this.presenter.BUTTON_TYPE.PREV
        };

    },

    'test given unasigned adaptiveLearningService when handling click then will call moveToPrevPage': function() {
        this.presenter.adaptiveLearningService = null;
        this.presenter.triggerButtonClickedEvent();

        assertFalse(this.stubs.moveToPrevPageMock.called);
    },

    'test given configuration as previous button when handling click then will call moveToPrevPage': function() {
        this.presenter.triggerButtonClickedEvent();

        assertTrue(this.stubs.moveToPrevPageMock.called);
    }
});


TestCase("[Adaptive_Next] Click handling test - next button", {
    setUp: function() {
        this.presenter = AddonAdaptive_Next_create();

        this.stubs = {
            isNextAdaptivePageAvailableStub: sinon.stub(),
            moveToNextPageStub: sinon.stub(),
            getCurrentPageConnectionsStub: sinon.stub(),
            addNextPageStub: sinon.stub(),
            evaluateConditionStub: sinon.stub(),
            addAndMoveToNextPageStub: sinon.stub()
        };

        this.adaptiveLearningServiceMock = {
            moveToNextPage: this.stubs.moveToNextPageStub,
            isNextAdaptivePageAvailable: this.stubs.isNextAdaptivePageAvailableStub,
            getCurrentPageConnections: this.stubs.getCurrentPageConnectionsStub,
            addNextPage: this.stubs.addNextPageStub,
            addAndMoveToNextPage: this.stubs.addAndMoveToNextPageStub
        };

        this.presenter.adaptiveLearningService = this.adaptiveLearningServiceMock;
        this.presenter.configuration = {
            Direction: this.presenter.BUTTON_TYPE.NEXT
        };

        this.presenter.evaluateCondition = this.stubs.evaluateConditionStub;
    },

    'test given service returning next page is available when handling click then will call moveToNextPage': function () {
        this.stubs.isNextAdaptivePageAvailableStub.returns(true);

        this.presenter.triggerButtonClickedEvent();

        assertTrue(this.stubs.moveToNextPageStub.called);
    },

    'test given no connections for current page when no next page available then will not call moveToNextPage': function () {
        this.stubs.isNextAdaptivePageAvailableStub.returns(false);
        this.stubs.getCurrentPageConnectionsStub.returns([]);

        this.presenter.triggerButtonClickedEvent();

        assertFalse(this.stubs.moveToNextPageStub.called);
    },

    'test given connections for current page when no next page available then will not call moveToNextPage': function () {
        this.stubs.isNextAdaptivePageAvailableStub.returns(false);
        this.stubs.getCurrentPageConnectionsStub.returns([]);

        this.presenter.triggerButtonClickedEvent();

        assertFalse(this.stubs.moveToNextPageStub.called);
    },

    'test given false when evaluating conditions then will not call moveToNextPage': function () {
        this.stubs.isNextAdaptivePageAvailableStub.returns(false);
        this.stubs.getCurrentPageConnectionsStub.returns(generateConnections(3));
        this.stubs.evaluateConditionStub.returns(false);

        this.presenter.triggerButtonClickedEvent();

        assertFalse(this.stubs.moveToNextPageStub.called);
        assertEquals(3, this.stubs.evaluateConditionStub.callCount)
    },

    'test given true when evaluating second condition then will call moveToNextPage': function () {
        var connections = generateConnections(3);

        this.stubs.isNextAdaptivePageAvailableStub.returns(false);
        this.stubs.getCurrentPageConnectionsStub.returns(connections);
        this.stubs.evaluateConditionStub.onFirstCall().returns(false);
        this.stubs.evaluateConditionStub.onSecondCall().returns(true);

        this.presenter.triggerButtonClickedEvent();

        assertFalse(this.stubs.moveToNextPageStub.called);
        assertTrue(this.stubs.addAndMoveToNextPageStub.calledWith(connections[1].target));
        assertEquals(2, this.stubs.evaluateConditionStub.callCount);
    },

    'test given true when evaluating third condition then will call moveToNextPage': function () {
        var connections = generateConnections(3);

        this.stubs.isNextAdaptivePageAvailableStub.returns(false);
        this.stubs.getCurrentPageConnectionsStub.returns(connections);
        this.stubs.evaluateConditionStub.onFirstCall().returns(false);
        this.stubs.evaluateConditionStub.onSecondCall().returns(false);
        this.stubs.evaluateConditionStub.onThirdCall().returns(true);

        this.presenter.triggerButtonClickedEvent();

        assertFalse(this.stubs.moveToNextPageStub.called);
        assertTrue(this.stubs.addAndMoveToNextPageStub.calledWith(connections[2].target));
        assertEquals(3, this.stubs.evaluateConditionStub.callCount);
    },
});