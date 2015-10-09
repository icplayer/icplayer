TestCase("[Count_and_Graph] Show errors mode / work mode", {
    setUp: function () {
        this.presenter = AddonCount_and_Graph_create();
        var divMock = {
            width: function () {return 500;},
            height: function () {return 500;}
        };
        var _ = 1;

        this.presenter.isShowAnswersActive = false;
        this.column = new this.presenter.columnObject(_, _, _, _, 1);
        this.presenter.graph = new this.presenter.graphObject(divMock, _, _, _, _, _, _, _, _, _, _, _);
        this.presenter.graph._columns = [this.column, this.column, this.column];

        this.stubs = {
            graphBlock: sinon.stub(this.presenter.graph, 'block'),
            graphUnblock: sinon.stub(this.presenter.graph, 'unblock'),
            hideAnswers: sinon.stub(this.presenter, 'hideAnswers'),
            columnUnblock: sinon.stub(this.column, 'unblock')
        };

        this.spies = {
            graphSetShowErrorsMode: sinon.spy(this.presenter.graph, 'setShowErrorsMode'),
            graphSetWorkMode: sinon.spy(this.presenter.graph, 'setWorkMode'),
            columnSetShowErrorsMode: sinon.spy(this.column, 'setShowErrorsMode'),
            columnSetWorkMode: sinon.spy(this.column, 'setWorkMode')
        };

        this.presenter.configuration = {
            isNotActivity: false
        };
    },

    tearDown: function () {
        this.presenter.graph.block.restore();
        this.presenter.hideAnswers.restore();
        this.presenter.graph.setShowErrorsMode.restore();
        this.column.setShowErrorsMode.restore();

    },

    'test errors mode should block graph & hide answers if necessary': function () {
        this.presenter.isShowAnswersActive = true;

        this.presenter.setShowErrorsMode();

        assertTrue(this.stubs.graphBlock.calledOnce);
        assertTrue(this.stubs.hideAnswers.called);
        assertTrue(this.spies.graphSetShowErrorsMode.called);
        assertEquals(3, this.spies.columnSetShowErrorsMode.callCount);
    },

    'test errors mode should block graph only if addon is not in show answers': function () {
        this.presenter.isShowAnswersActive = false;

        this.presenter.setShowErrorsMode();

        assertTrue(this.stubs.graphBlock.calledOnce);
        assertFalse(this.stubs.hideAnswers.called);
        assertTrue(this.spies.graphSetShowErrorsMode.called);
        assertEquals(3, this.spies.columnSetShowErrorsMode.callCount);
    },

    'test work mode should hide answers': function () {
        this.presenter.isShowAnswersActive = true;
        this.presenter.graph._isBlocked = false;

        this.presenter.setWorkMode();

        assertTrue(this.stubs.hideAnswers.called);
        assertFalse(this.stubs.graphBlock.called);
        assertTrue(this.stubs.graphUnblock.called);

        assertEquals(3, this.spies.columnSetWorkMode.callCount);
    },

    'test work mode should unblock graph only if not in show answers': function () {
        this.presenter.isShowAnswersActive = false;

        this.presenter.setWorkMode();

        assertFalse(this.stubs.hideAnswers.called);

        assertFalse(this.stubs.graphBlock.called);
        assertTrue(this.stubs.graphUnblock.called);
        assertFalse(this.stubs.columnUnblock.called);

        assertEquals(3, this.spies.columnSetWorkMode.callCount);
    }
});