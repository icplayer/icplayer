TestCase("[Paragraph Keyboard] Get max score method tests", {
    setUp: function () {
        this.presenter = AddonParagraph_Keyboard_create();
        this.presenter.configuration = {
            isValid: true,
            manualGrading: true,
            weight: 2
        };
    },

    'test given configuration with weight equal to 2 when getMaxScore executed then return 2': function () {
        const maxScore = this.presenter.getMaxScore();

        assertEquals(2, maxScore);
    },

    'test given configuration with valid weight when getMaxScore executed then return this value': function () {
        this.presenter.configuration.weight = "11";

        const maxScore = this.presenter.getMaxScore();

        assertEquals("11", maxScore);
    },

    'test given configuration with turned off manual grading when getMaxScore executed then return 0': function () {
        this.presenter.configuration.manualGrading = false;

        const maxScore = this.presenter.getMaxScore();

        assertEquals(0, maxScore);
    },

    'test given not valid configuration when getMaxScore executed then return 0': function () {
        this.presenter.configuration.isValid = false;

        const maxScore = this.presenter.getMaxScore();

        assertEquals(0, maxScore);
    }
});

TestCase("[Paragraph Keyboard] Get score method tests", {
    setUp: function () {
        this.presenter = AddonParagraph_Keyboard_create();
        this.presenter.configuration = {
            isValid: true,
            manualGrading: true,
        };
        this.presenter.playerController = {};
        sinon.stub(OpenActivitiesUtils, 'getOpenActivityScore');
        OpenActivitiesUtils.getOpenActivityScore.returns(3);
    },

    tearDown: function () {
        OpenActivitiesUtils.getOpenActivityScore.restore();
    },

    'test given configuration with turned off manual grading when getScore executed then return 0': function () {
        this.presenter.configuration.manualGrading = false;

        const score = this.presenter.getScore();

        assertEquals(0, score);
    },

    'test given not valid configuration when getScore executed then return 0': function () {
        this.presenter.configuration.isValid = false;

        const score = this.presenter.getScore();

        assertEquals(0, score);
    },

    'test given presenter without player controller when getScore executed then return 0': function () {
        this.presenter.playerController = undefined;

        const score = this.presenter.getScore();

        assertEquals(0, score);
    },

    'test given set up player to return 3 as score when getScore executed then return 3': function () {
        const score = this.presenter.getScore();

        assertEquals(3, score);
    }
});

TestCase("[Paragraph Keyboard] Get error count method tests", {
    setUp: function () {
        this.presenter = AddonParagraph_Keyboard_create();
        this.stubs = {
            getScoreStub: sinon.stub(),
            getMaxScoreStub: sinon.stub()
        };

        this.presenter.getScore = this.stubs.getScoreStub;
        this.presenter.getMaxScore = this.stubs.getMaxScoreStub;
    },

    'test given max score and score when getErrorCount executed then return the result of subtracting these values': function () {
        this.stubs.getScoreStub.returns(1);
        this.stubs.getMaxScoreStub.returns(3);

        const errorCount = this.presenter.getErrorCount();

        assertEquals(2, errorCount);
    }
});
