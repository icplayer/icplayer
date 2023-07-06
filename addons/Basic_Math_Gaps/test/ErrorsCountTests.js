TestCase("[Basic Math Gaps] Get Error Count", {
    setUp: function () {
        this.presenter = AddonBasic_Math_Gaps_create();

        this.presenter.gapsContainer = new this.presenter.GapsContainerObject();
        this.presenter.configuration = {
            isEquation: false,
            isShowAnswersActive: false
        };

        this.stubs = {
            hideAnswers: sinon.stub(this.presenter, 'hideAnswers'),

            blockGaps: sinon.stub(this.presenter.GapsContainerObject.prototype, 'lock'),
            areAllGapsEmpty: sinon.stub(this.presenter.GapsContainerObject.prototype, 'areAllGapsEmpty'),
            areAllGapsFilled: sinon.stub(this.presenter.GapsContainerObject.prototype, 'areAllGapsFilled'),
            getNonEmptyGapsNumber: sinon.stub(this.presenter.GapsContainerObject.prototype, 'getNonEmptyGapsNumber'),

            isEquationCorrect: sinon.stub(this.presenter, 'isEquationCorrect'),

            validateScore: sinon.stub(this.presenter, 'validateScore'),
            showAnswers: sinon.stub(this.presenter, 'showAnswers')
        };

        this.stubs.validateScore.returns({
            validGapsCount: 1
        });

        this.stubs.getNonEmptyGapsNumber.returns(3);
    },

    tearDown: function () {
        this.presenter.hideAnswers.restore();
        this.presenter.showAnswers.restore();
        this.presenter.isEquationCorrect.restore();
        this.presenter.validateScore.restore();

        this.presenter.GapsContainerObject.prototype.lock.restore();
        this.presenter.GapsContainerObject.prototype.areAllGapsEmpty.restore();
        this.presenter.GapsContainerObject.prototype.areAllGapsFilled.restore();
        this.presenter.GapsContainerObject.prototype.getNonEmptyGapsNumber.restore();
    },

    'test should hide answers if show answers is active and restore after': function () {
        this.presenter.configuration.isShowAnswersActive = true;

        this.presenter.getErrorCount();

        assertTrue(this.stubs.hideAnswers.calledOnce);
        assertTrue(this.stubs.showAnswers.calledOnce);
    },

    'test shouldnt hide answers if show answers isnt active ': function () {
        this.presenter.getErrorCount();

        assertFalse(this.stubs.hideAnswers.called);
        assertFalse(this.stubs.showAnswers.called);
    },

    'test should return zero errors if is not activity': function () {
        this.presenter.configuration.isNotActivity = true;

        assertEquals(0, this.presenter.getErrorCount());
    },

    'test should return zero errors if is disabled': function () {
        this.presenter.configuration.isDisabled = true;

        assertEquals(0, this.presenter.getErrorCount());
    },

    'test should return zero errors if all gaps are empty': function () {
        this.stubs.areAllGapsEmpty.returns(true);

        assertEquals(0, this.presenter.getErrorCount());
    },

    'test in equation mode should return 0 errors if equation is correct': function () {
        this.presenter.configuration.isEquation = true;

        this.stubs.validateScore.returns({});
        this.stubs.isEquationCorrect.returns(true);

        assertEquals(0, this.presenter.getErrorCount());
    },

    'test in equation mode should return 1 error if equation is incorrect': function () {
        this.presenter.configuration.isEquation = true;

        this.stubs.validateScore.returns({});
        this.stubs.isEquationCorrect.returns(false);
        this.stubs.areAllGapsFilled.returns(true);

        assertEquals(1, this.presenter.getErrorCount());
    },

    'test if is not equation error count should be equal to non empty gaps number minus valid gaps': function () {
        assertEquals(2, this.presenter.getErrorCount());

        this.stubs.validateScore.returns({
            validGapsCount: 3
        });

        assertEquals(0, this.presenter.getErrorCount());
    }
});