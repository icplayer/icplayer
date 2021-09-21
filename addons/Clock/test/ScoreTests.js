TestCase('[Clock] Counting score tests', {
    setUp: function () {
        this.presenter = AddonClock_create();
        
        this.showAnswersSpy = sinon.spy(this.presenter, 'showAnswers');

        this.stubs = {
            drawClockStub: sinon.stub(),
            setClockTimeStub: sinon.stub(),
            validateStub: sinon.stub(),
            validateTimeStub: sinon.stub()
        };

        this.model = {
            'ID': 'Clock',
            'Is Visible': 'True'
        }

        this.presenter.setClockTime = this.stubs.setClockTimeStub;
        this.presenter.drawClock = this.stubs.drawClockStub;
        this.presenter.setClockTime = this.stubs.setClockTimeStub;
        this.presenter.validate = this.stubs.validateStub;
        this.presenter.validateTime = this.stubs.validateTimeStub;
        this.presenter.modelID = this.model.ID;
        this.view = document.createElement('div');
        this.stubs.validateStub.returns(true);
    },

    'test given default value when getMaxScore was called should return 0': function () {
        this.presenter.CorrectAnswer = '12:12';
        this.presenter.InitialTime = '12:12';

        var result = this.presenter.getMaxScore();

        assertEquals(result, 0);
    },

    'test given changed value activated model when getMaxScore was called should return 1': function () {
        this.presenter.CorrectAnswer = '12:12';
        this.presenter.InitialTime = '12:10';
        this.presenter.isActivity = true;

        var result = this.presenter.getMaxScore();

        assertEquals(result, 1);
    },

    'test given correct value and activated model when getScoreValue was called should return 1': function () {
        this.presenter.isActivity = true;
        var getCurrentTimeStub = sinon.stub(this.presenter, 'getCurrentTime');
        getCurrentTimeStub.returns('12:12');
        this.presenter.CorrectAnswer = '12:12';

        var result = this.presenter.getScoreValue();

        assertEquals(result, 1);
    },

    'test given incorrect value and activated model when getScoreValue was called should return 0': function () {
        this.presenter.isActivity = true;
        var getCurrentTimeStub = sinon.stub(this.presenter, 'getCurrentTime');
        getCurrentTimeStub.returns('12:12');
        this.presenter.CorrectAnswer = '12:10';

        var result = this.presenter.getScoreValue();

        assertEquals(result, 0);
    },

    'test given displayed answers when getScore was called should be visible after the score has been calculated': function () {
        this.presenter.showAnswersMode = true;
        this.presenter.isErrorCheckingMode = false;
        this.presenter.createPreview(this.view, this.model);
        var getCurrentTimeStub = sinon.stub(this.presenter, 'getCurrentTime');
        getCurrentTimeStub.returns('12:12');
        var getNewTimeStub = sinon.stub(this.presenter, 'getNewTime');
        getNewTimeStub.returns('12:00');
        this.presenter.isActivity = true;

        this.presenter.getScore();

        assertTrue(this.presenter.showAnswersMode);
        assertTrue(this.showAnswersSpy.called);
    },

    'test given displayed answers when getErrorCount was called should be visible after the errors have been calculated': function () {
        this.presenter.showAnswersMode = true;
        this.presenter.isErrorCheckingMode = false;
        this.presenter.createPreview(this.view, this.model);
        var getCurrentTimeStub = sinon.stub(this.presenter, 'getCurrentTime');
        getCurrentTimeStub.returns('12:12');
        var getNewTimeStub = sinon.stub(this.presenter, 'getNewTime');
        getNewTimeStub.returns('12:00');
        this.presenter.isActivity = true;

        this.presenter.getErrorCount();

        assertTrue(this.presenter.showAnswersMode);
        assertTrue(this.showAnswersSpy.called);
    },

    'test given incorrect value and activated model when getErrorCountValue was called should return 1': function () {
        this.presenter.CorrectAnswer = '12:12';
        this.presenter.InitialTime = '12:12';
        this.presenter.isActivity = true;
        var getCurrentTimeStub = sinon.stub(this.presenter, 'getCurrentTime');
        getCurrentTimeStub.returns('12:00');

        var result = this.presenter.getErrorCountValue();

        assertEquals(result, 1);
    },

    'test given not changed value and activated model when getErrorCountValue was called should return 0': function () {
        this.presenter.CorrectAnswer = '12:12';
        this.presenter.InitialTime = '12:10';
        this.presenter.isActivity = true;
        var getCurrentTimeStub = sinon.stub(this.presenter, 'getCurrentTime');
        getCurrentTimeStub.returns('12:10');

        var result = this.presenter.getErrorCountValue();

        assertEquals(result, 0);
    },

    'test given changed value and activated model when getErrorCountValue was called should return 1': function () {
        this.presenter.CorrectAnswer = '12:12';
        this.presenter.InitialTime = '12:10';
        this.presenter.isActivity = true;
        var getCurrentTimeStub = sinon.stub(this.presenter, 'getCurrentTime');
        getCurrentTimeStub.returns('12:15');

        var result = this.presenter.getErrorCountValue();

        assertEquals(result, 1);
    }
});
