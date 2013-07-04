TestCase("[Graph] Scoring logic", {
    setUp: function () {
        this.presenter = Addongraph_create();
        this.presenter.configuration = {
            isInteractive: true,
            answers: ['1', '2', '3', '4', '5']
        };

        sinon.stub(this.presenter, 'calcScore');
        this.presenter.calcScore.returns(3);
    },

    tearDown: function () {
        this.presenter.calcScore.restore();
    },

    'test module not touched by user': function () {
        assertEquals(5, this.presenter.getMaxScore());
        assertEquals(0, this.presenter.getScore());
        assertEquals(0, this.presenter.getErrorCount());
    },

    'test user made interactions': function () {
        this.presenter.configuration.shouldCalcScore = true;

        assertEquals(5, this.presenter.getMaxScore());
        assertEquals(3, this.presenter.getScore());
        assertEquals(2, this.presenter.getErrorCount());
    },

    'test module is not in interactive mode': function () {
        this.presenter.configuration.isInteractive = false;
        this.presenter.configuration.shouldCalcScore = true;

        assertEquals(0, this.presenter.getMaxScore());
        assertEquals(0, this.presenter.getScore());
        assertEquals(0, this.presenter.getErrorCount());
    }
});