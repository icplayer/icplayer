TestCase("Scoring", {
    setUp: function () {
        this.presenter = Addonmultiplegap_create();
        this.presenter.configuration = {};
        this.presenter.items = [''];
    },

    'test not an activity mode': function() {
        this.presenter.configuration.isActivity = false;

        assertEquals(0, this.presenter.getMaxScore());
        assertEquals(0, this.presenter.getScore());
        assertEquals(0, this.presenter.getErrorCount());
    },

    'test an activity mode but list of items with empty value': function() {
        this.presenter.configuration.isActivity = false;

        assertEquals(0, this.presenter.getMaxScore());
        assertEquals(0, this.presenter.getScore());
        assertEquals(0, this.presenter.getErrorCount());
    }
});

TestCase("AllOK", {
    setUp: function () {
        this.presenter = Addonmultiplegap_create();
        this.presenter.configuration = {
            isActivity: true
        };

        this.getMaxScoreStub = sinon.stub(this.presenter, 'getMaxScore');
        this.getMaxScoreStub.returns(3);
        this.getScoreStub = sinon.stub(this.presenter, 'getScore');
        this.getErrorCountStub = sinon.stub(this.presenter, 'getErrorCount');
    },

    tearDown: function () {
        this.presenter.getMaxScore.restore();
        this.presenter.getScore.restore();
        this.presenter.getErrorCount.restore();
    },

    'test allOK should return true': function () {
        this.getScoreStub.returns(3);
        this.getErrorCountStub.returns(0);

        var isAllOK = this.presenter.isAllOK();

        assertTrue(isAllOK);
        assertTrue(this.getMaxScoreStub.calledOnce);
        assertTrue(this.getScoreStub.calledOnce);
        assertTrue(this.getErrorCountStub.calledOnce);
    },

    'test allOK should return false': function () {
        this.getScoreStub.returns(2);
        this.getErrorCountStub.returns(1);

        var isAllOK = this.presenter.isAllOK();

        assertFalse(isAllOK);
        assertTrue(this.getMaxScoreStub.calledOnce);
        assertTrue(this.getScoreStub.calledOnce);
    },

    'test allOK should return nothing because addon is not an activity': function () {
        this.getMaxScoreStub.returns(undefined);
        this.getScoreStub.returns(undefined);
        this.getErrorCountStub.returns(undefined);
        this.presenter.configuration.isActivity = false;

        var isAllOK = this.presenter.isAllOK();

        assertUndefined(isAllOK);
        assertFalse(this.getMaxScoreStub.calledOnce);
        assertFalse(this.getScoreStub.calledOnce);
        assertFalse(this.getErrorCountStub.calledOnce);
    }
});