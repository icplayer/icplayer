TestCase("[MathText] Get error count TestCase", {
    setUp: function () {
        this.presenter = AddonMathText_create();

        // stubs
        this.stubs = {
            getScoreStub: sinon.stub()
        };

        this.stubs.getScoreStub.returns(1);

        // inner states
        this.presenter.state = {
            hasUserInteracted: true
        };

        this.presenter.configuration = {
            isActivity: true
        };

        this.presenter.getScore = this.stubs.getScoreStub;
    },

    'test when addon is not an activity, then addon will return 0 errors': function () {
        this.presenter.configuration.isActivity = false;
        var errorCount = this.presenter.getErrorCount();

        assertEquals(0, errorCount);
    },

    'test when user hasnt interacted with addon, then addon will return 0 errors': function () {
        this.presenter.configuration.isActivity = true;
        this.presenter.state.hasUserInteracted = false;
        var errorCount = this.presenter.getErrorCount();

        assertEquals(0, errorCount);
    },

    'test when user has interacted with addon, addon is activity and answer is correct, then addon will return 0 errors': function () {
        this.presenter.configuration.isActivity = true;
        this.presenter.state.hasUserInteracted = true;
        this.stubs.getScoreStub.returns(1);

        var errorCount = this.presenter.getErrorCount();

        assertEquals(0, errorCount)
    },

    'test when user has interacted with addon, addon is activity and answer is not correct, then addon will return 1 error': function () {
        this.presenter.configuration.isActivity = true;
        this.presenter.state.hasUserInteracted = true;
        this.stubs.getScoreStub.returns(0);

        var errorCount = this.presenter.getErrorCount();

        assertEquals(1, errorCount)
    }
});