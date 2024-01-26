TestCase("[PieChart] getMaxScore tests", {
    setUp: function () {
        this.presenter = AddonPieChart_create();
        this.presenter.activity = true;
        this.presenter.error = false;
        this.presenter.numberOfItems = 3;
        this.presenter.currentPercents = [20, 40, 40];
        this.presenter.items = [
            {"Name": 'Item 1', "Color": '#FFCA28', "Starting percent": '10', "Answer": '20'},
            {"Name": 'Item 2', "Color": '#EC407A', "Starting percent": '20', "Answer": '30'},
            {"Name": 'Item 3', "Color": '#42A5F5', "Starting percent": '70', "Answer": '50'}
        ];

        this.stubs = {
            showAnswers: sinon.stub(this.presenter, "showAnswers"),
            hideAnswers: sinon.stub(this.presenter, "hideAnswers"),
            gradualShowAnswers: sinon.stub(this.presenter, "gradualShowAnswers"),
            gradualHideAnswers: sinon.stub(this.presenter, "gradualHideAnswers")
        };
    },

    tearDown: function () {
        this.presenter.showAnswers.restore();
        this.presenter.hideAnswers.restore();
        this.presenter.gradualHideAnswers.restore();
        this.presenter.gradualShowAnswers.restore();
    },

    'test given active addon without error in configuration when calling getMaxScore then return 1': function () {
        assertEquals(1, this.presenter.getMaxScore());
    },

    'test given not active addon when calling getMaxScore then return 0': function () {
        this.presenter.activity = false;

        assertEquals(0, this.presenter.getMaxScore());
    },

    'test given addon with error in configuration when calling getMaxScore then return 0': function () {
        this.presenter.error = true;

        assertEquals(0, this.presenter.getMaxScore());
    },

    'test given addon in SA mode then after getMaxScore called addon is still in SA mode': function () {
        this.presenter.isShowAnswersActive = true;

        this.presenter.getMaxScore();

        assertTrue(this.presenter.isShowAnswersActive);
    },

    'test given addon in GSA mode then after getMaxScore called addon is still in GSA mode': function () {
        this.presenter.isGradualShowAnswersActive = true;

        this.presenter.getMaxScore();

        assertTrue(this.presenter.isGradualShowAnswersActive);
    },
});

TestCase("[PieChart] getScore tests", {
    setUp: function () {
        this.presenter = AddonPieChart_create();
        this.presenter.activity = true;
        this.presenter.error = false;
        this.presenter.numberOfItems = 3;
        this.presenter.currentPercents = [20, 40, 40];
        this.presenter.items = [
            {"Name": 'Item 1', "Color": '#FFCA28', "Starting percent": '10', "Answer": '20'},
            {"Name": 'Item 2', "Color": '#EC407A', "Starting percent": '20', "Answer": '30'},
            {"Name": 'Item 3', "Color": '#42A5F5', "Starting percent": '70', "Answer": '50'}
        ];

        this.stubs = {
            showAnswers: sinon.stub(this.presenter, "showAnswers"),
            hideAnswers: sinon.stub(this.presenter, "hideAnswers"),
            gradualShowAnswers: sinon.stub(this.presenter, "gradualShowAnswers"),
            gradualHideAnswers: sinon.stub(this.presenter, "gradualHideAnswers")
        };
    },

    tearDown: function () {
        this.presenter.showAnswers.restore();
        this.presenter.hideAnswers.restore();
        this.presenter.gradualHideAnswers.restore();
        this.presenter.gradualShowAnswers.restore();
    },

    'test given not active addon when calling getScore then return 0': function () {
        this.presenter.activity = false;

        assertEquals(0, this.presenter.getScore());
    },

    'test given addon with error in configuration when calling getScore then return 0': function () {
        this.presenter.error = true;

        assertEquals(0, this.presenter.getScore());
    },

    'test given addon in SA mode then after getScore called addon is still in SA mode': function () {
        this.presenter.isShowAnswersActive = true;

        this.presenter.getScore();

        assertTrue(this.presenter.isShowAnswersActive);
    },

    'test given addon in GSA mode then after getScore called addon is still in GSA mode': function () {
        this.presenter.isGradualShowAnswersActive = true;

        this.presenter.getScore();

        assertTrue(this.presenter.isGradualShowAnswersActive);
    },

    'test given addon with all of parts of chart are correct when calling getScore then return 1': function () {
        this.presenter.currentPercents = [20, 30, 50];

        assertEquals(1, this.presenter.getScore());
    },

    'test given addon with at least one wrong part of chart when calling getScore then return 0': function () {
        this.presenter.currentPercents = [20, 20, 60];

        assertEquals(0, this.presenter.getScore());
    },
});

TestCase("[PieChart] getErrorCount tests", {
    setUp: function () {
        this.presenter = AddonPieChart_create();
        this.presenter.activity = true;
        this.presenter.error = false;
        this.presenter.numberOfItems = 3;
        this.presenter.currentPercents = [20, 40, 40];
        this.presenter.items = [
            {"Name": 'Item 1', "Color": '#FFCA28', "Starting percent": '10', "Answer": '20'},
            {"Name": 'Item 2', "Color": '#EC407A', "Starting percent": '20', "Answer": '30'},
            {"Name": 'Item 3', "Color": '#42A5F5', "Starting percent": '70', "Answer": '50'}
        ];
        this.presenter.isMoved = true;

        this.stubs = {
            showAnswers: sinon.stub(this.presenter, "showAnswers"),
            hideAnswers: sinon.stub(this.presenter, "hideAnswers"),
            gradualShowAnswers: sinon.stub(this.presenter, "gradualShowAnswers"),
            gradualHideAnswers: sinon.stub(this.presenter, "gradualHideAnswers")
        };
    },

    tearDown: function () {
        this.presenter.showAnswers.restore();
        this.presenter.hideAnswers.restore();
        this.presenter.gradualHideAnswers.restore();
        this.presenter.gradualShowAnswers.restore();
    },

    'test given not active addon when calling getErrorCount then return 0': function () {
        this.presenter.activity = false;

        assertEquals(0, this.presenter.getErrorCount());
    },

    'test given addon with error in configuration when calling getErrorCount then return 0': function () {
        this.presenter.error = true;

        assertEquals(0, this.presenter.getErrorCount());
    },

    'test given addon with where any part was moved when calling getErrorCount then return 0': function () {
        this.presenter.isMoved = false;

        assertEquals(0, this.presenter.getErrorCount());
    },

    'test given addon in SA mode then after getErrorCount called addon is still in SA mode': function () {
        this.presenter.isShowAnswersActive = true;

        this.presenter.getErrorCount();

        assertTrue(this.presenter.isShowAnswersActive);
    },

    'test given addon in GSA mode then after getErrorCount called addon is still in GSA mode': function () {
        this.presenter.isGradualShowAnswersActive = true;

        this.presenter.getErrorCount();

        assertTrue(this.presenter.isGradualShowAnswersActive);
    },

    'test given addon with all of parts of chart are correct when calling getErrorCount then return 0': function () {
        this.presenter.currentPercents = [20, 30, 50];

        assertEquals(0, this.presenter.getErrorCount());
    },

    'test given addon with at least one wrong part of chart when calling getErrorCount then return 1': function () {
        this.presenter.currentPercents = [20, 20, 60];

        assertEquals(1, this.presenter.getErrorCount());
    },
});
