TestCase("[PointsLines] gradualShowAnswers button", {
    setUp: function () {
        this.presenter = AddonPointsLines_create();

        this.presenter.points = [
          [100, 50],
          [50, 100],
          [125, 125],
          [200, 80],
        ];
        this.presenter.answer = [
          [0, 1, 0, 0],
          [null, 0, 0, 0],
          [null, null, 0, 1],
          [null, null, null, 0],
        ];

        // stubs
        this.stubs = {
            setWorkModeStub: sinon.stub(),
            drawLineStub: sinon.stub(),
            findStub: sinon.stub(),
            notStub: sinon.stub(),
            cssStub: sinon.stub(),
        };

        this.stubs.findStub.returns({
            not: this.stubs.notStub,
        });

        this.stubs.notStub.returns({
            css: this.stubs.cssStub,
        });

        this.presenter.$view = {
            find: this.stubs.findStub,
        };

        this.presenter.drawLine = this.stubs.drawLineStub;
        this.presenter.setWorkMode = this.stubs.setWorkModeStub;
    },

    'test setWorkMode should be called when in check answers mode and calling gradualShowAnswers': function(){
        this.presenter.activity = true;

        this.presenter.gradualShowAnswers();

        assertTrue(this.stubs.setWorkModeStub.called);
    },

    'test should call drawLineStub once with proper arguments when showAllAnswersInGradualShowAnswersMode is inactive and called function once': function () {
        this.presenter.showAllAnswersInGradualShowAnswersMode = false;
        this.presenter.activity = true;

        this.presenter.gradualShowAnswers();

        var expectedFirstCallArgs = {arg1: 0, arg2: 1, arg3: true};

        assertTrue(this.stubs.drawLineStub.calledOnce);
        assertTrue(this.stubs.drawLineStub.calledWithExactly(expectedFirstCallArgs.arg1, expectedFirstCallArgs.arg2, expectedFirstCallArgs.arg3));
    },

    'test should call drawLineStub twice with proper arguments when showAllAnswersInGradualShowAnswersMode is inactive and called function twice': function () {
        this.presenter.showAllAnswersInGradualShowAnswersMode = false;
        this.presenter.activity = true;

        this.presenter.gradualShowAnswers();
        this.presenter.gradualShowAnswers();

        var expectedFirstCallArgs = {arg1: 0, arg2: 1, arg3: true};
        var expectedSecondCallArgs = {arg1: 2, arg2: 3, arg3: true};

        assertTrue(this.stubs.drawLineStub.calledTwice);
        assertTrue(this.stubs.drawLineStub.calledWithExactly(expectedFirstCallArgs.arg1, expectedFirstCallArgs.arg2, expectedFirstCallArgs.arg3));
        assertTrue(this.stubs.drawLineStub.calledWithExactly(expectedSecondCallArgs.arg1, expectedSecondCallArgs.arg2, expectedSecondCallArgs.arg3));
    },

    'test should call addShowAnswerClassStub once with proper arguments when showAllAnswersInGradualShowAnswersMode is active': function () {
        this.presenter.showAllAnswersInGradualShowAnswersMode = true;
        this.presenter.activity = true;

        this.presenter.gradualShowAnswers();

        var expectedFirstCallArgs = {arg1: 0, arg2: 1, arg3: true};
        var expectedSecondCallArgs = {arg1: 2, arg2: 3, arg3: true};

        assertTrue(this.stubs.drawLineStub.calledTwice);
        assertTrue(this.stubs.drawLineStub.calledWithExactly(expectedFirstCallArgs.arg1, expectedFirstCallArgs.arg2, expectedFirstCallArgs.arg3));
        assertTrue(this.stubs.drawLineStub.calledWithExactly(expectedSecondCallArgs.arg1, expectedSecondCallArgs.arg2, expectedSecondCallArgs.arg3));
    }
});