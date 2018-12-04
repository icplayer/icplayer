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
            isNextAdaptivePageAvailableMock: sinon.stub(),
            moveToNextPageMock: sinon.stub(),
            getCurrentPageConnectionsMock: sinon.stub(),

            evaluateConditionMock: sinon.stub()
        };

        this.adaptiveLearningServiceMock = {
            moveToNextPage: this.stubs.moveToNextPageMock,
            isNextAdaptivePageAvailable: this.stubs.isNextAdaptivePageAvailableMock,
            getCurrentPageConnections: this.stubs.getCurrentPageConnectionsMock
        };

        this.presenter.adaptiveLearningService = this.adaptiveLearningServiceMock;
        this.presenter.configuration = {
            Direction: this.presenter.BUTTON_TYPE.NEXT
        };

        this.presenter.evaluateCondition = this.stubs.evaluateConditionMock;
    },

    'test given service returning next page is available when handling click then will call moveToNextPage': function () {
        this.stubs.isNextAdaptivePageAvailableMock.returns(true);

        this.presenter.triggerButtonClickedEvent();

        assertTrue(this.stubs.moveToNextPageMock.called);
    },

    'test given no connections for current page when no next page available then will call not moveToNextPage': function () {
        this.stubs.isNextAdaptivePageAvailableMock.returns(false);
        this.stubs.getCurrentPageConnectionsMock.returns([]);

        this.presenter.triggerButtonClickedEvent();

        assertFalse(this.stubs.moveToNextPageMock.called);
    },

    'test given connections for current page when no next page available then will call not moveToNextPage': function () {
        this.stubs.isNextAdaptivePageAvailableMock.returns(false);
        this.stubs.getCurrentPageConnectionsMock.returns([]);

        this.presenter.triggerButtonClickedEvent();

        assertFalse(this.stubs.moveToNextPageMock.called);
    },

    'test given false when evaluating conditions then will call not moveToNextPage': function () {
        this.stubs.isNextAdaptivePageAvailableMock.returns(false);
        this.stubs.getCurrentPageConnectionsMock.returns(generateConnections(3));
        this.stubs.evaluateConditionMock.returns(false);

        this.presenter.triggerButtonClickedEvent();

        assertFalse(this.stubs.moveToNextPageMock.called);
        assertEquals(3, this.stubs.evaluateConditionMock.callCount)
    }
});