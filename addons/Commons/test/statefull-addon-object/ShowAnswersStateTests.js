TestCase("[Commons - Statefull Addon Object] Show Answers State", {
    setUp: function () {
        this.correct = "";
        this.wrong = "";
        this.showAnswers = "";
        this.block = "";
        this.work = "";

        this.configuration = {
            correct: this.correct,
            wrong: this.wrong,
            showAnswers: this.showAnswers,
            block: this.block,
            work: this.work
        };

        this.showAnswersStateObject = new StatefullAddonObject(this.configuration);

        this.showAnswersStateObject._actualState = StatefullAddonObject._internal.STATE.SHOW_ANSWERS;

        this.stubs = {
            onHideAnswers: sinon.stub(StatefullAddonObject.prototype, 'onHideAnswers'),
            onReset: sinon.stub(StatefullAddonObject.prototype, 'onReset'),
            isCorrect: sinon.stub(StatefullAddonObject.prototype, 'isCorrect'),
            onWrong: sinon.stub(StatefullAddonObject.prototype, 'onWrong'),
            onCorrect: sinon.stub(StatefullAddonObject.prototype, 'onCorrect'),
            addCssClass: sinon.stub(StatefullAddonObject.prototype, 'addCssClass'),
            removeCssClass: sinon.stub(StatefullAddonObject.prototype, 'removeCssClass')
        };

        this.spies = {
            setCssOnHideAnswers: sinon.spy(StatefullAddonObject.prototype, 'setCssOnHideAnswers')
        };
    },

    tearDown: function () {
        StatefullAddonObject.prototype.onHideAnswers.restore();
        StatefullAddonObject.prototype.onReset.restore();
        StatefullAddonObject.prototype.isCorrect.restore();
        StatefullAddonObject.prototype.onWrong.restore();
        StatefullAddonObject.prototype.onCorrect.restore();
        StatefullAddonObject.prototype.addCssClass.restore();
        StatefullAddonObject.prototype.removeCssClass.restore();
        StatefullAddonObject.prototype.setCssOnHideAnswers.restore();
    },

    'test hide answers should move object to work state': function () {
        this.showAnswersStateObject.hideAnswers();

        assertEquals(StatefullAddonObject._internal.STATE.WORK, this.showAnswersStateObject._actualState);
    },

    'test hide answers should call onHideAnswers': function () {
        this.showAnswersStateObject.hideAnswers();

        assertTrue(this.stubs.onHideAnswers.calledOnce);
    },

    'test hide answers should remove show answers css class': function () {
        this.showAnswersStateObject.hideAnswers();

        assertTrue(this.stubs.removeCssClass.calledOnce);
        assertTrue(this.stubs.removeCssClass.calledWith(this.showAnswers));
    },

    'test hide answers should call setCssOnHideAnswers': function () {
        this.showAnswersStateObject.hideAnswers();

        assertTrue(this.spies.setCssOnHideAnswers.calledOnce);
    },

    'test reset should move object to start state': function () {
        this.showAnswersStateObject.reset();

        assertEquals(StatefullAddonObject._internal.STATE.START, this.showAnswersStateObject._actualState);
    },

    'test reset should call onHideAnswers': function () {
        this.showAnswersStateObject.reset();

        assertTrue(this.stubs.onHideAnswers.calledOnce);
    },

    'test reset should call onReset': function () {
        this.showAnswersStateObject.reset();

        assertTrue(this.stubs.onReset.calledOnce);
    },

    'test reset should call onHideAnswers before onReset': function () {
        this.showAnswersStateObject.reset();

        assertTrue(this.stubs.onHideAnswers.calledBefore(this.stubs.onReset));
    },

    'test reset should remove show answers css class': function () {
        this.showAnswersStateObject.reset();

        assertTrue(this.stubs.removeCssClass.calledOnce);
        assertTrue(this.stubs.removeCssClass.calledWith(this.showAnswers));
    },

    'test check when object isCorrect should move to correct state': function () {
        this.stubs.isCorrect.returns(true);

        this.showAnswersStateObject.check();

        assertEquals(StatefullAddonObject._internal.STATE.CORRECT, this.showAnswersStateObject._actualState);
    },

    'test check when object isCorrect should call onHideAnswers': function () {
        this.stubs.isCorrect.returns(true);

        this.showAnswersStateObject.check();

        assertTrue(this.stubs.onHideAnswers.calledOnce);
    },

    'test check when object isCorrect should call isCorrect': function () {
        this.stubs.isCorrect.returns(true);

        this.showAnswersStateObject.check();

        assertTrue(this.stubs.isCorrect.calledOnce);
    },

    'test check when object isCorrect should call onCorrect': function () {
        this.stubs.isCorrect.returns(true);

        this.showAnswersStateObject.check();

        assertTrue(this.stubs.onCorrect.calledOnce);
    },

    'test check when object isCorrect should call onHideAnswers first than isCorrect': function () {
        this.stubs.isCorrect.returns(true);

        this.showAnswersStateObject.check();

        assertTrue(this.stubs.onHideAnswers.calledBefore(this.stubs.isCorrect));
        assertTrue(this.stubs.onHideAnswers.calledBefore(this.stubs.onCorrect));

        assertTrue(this.stubs.isCorrect.calledBefore(this.stubs.onCorrect));

        assertTrue(this.stubs.onCorrect.calledAfter(this.stubs.onHideAnswers));
        assertTrue(this.stubs.onCorrect.calledAfter(this.stubs.isCorrect));
    },

    'test check when object isCorrect should remove show answers css class': function () {
        this.stubs.isCorrect.returns(true);

        this.showAnswersStateObject.check();

        assertTrue(this.stubs.removeCssClass.calledOnce);
        assertTrue(this.stubs.removeCssClass.calledWith(this.showAnswers));
    },

    'test check when object isCorrect should add correct css class': function () {
        this.stubs.isCorrect.returns(true);

        this.showAnswersStateObject.check();

        assertTrue(this.stubs.addCssClass.calledOnce);
        assertTrue(this.stubs.addCssClass.calledWith(this.correct));
    },

    'test check when object not isCorrect should move to wrong state': function () {
        this.stubs.isCorrect.returns(false);

        this.showAnswersStateObject.check();

        assertEquals(StatefullAddonObject._internal.STATE.WRONG, this.showAnswersStateObject._actualState);
    },

    'test check when object not isCorrect should call onHideAnswers': function () {
        this.stubs.isCorrect.returns(false);

        this.showAnswersStateObject.check();

        assertTrue(this.stubs.onHideAnswers.calledOnce);
    },

    'test check when object not isCorrect should call isCorrect': function () {
        this.stubs.isCorrect.returns(false);

        this.showAnswersStateObject.check();

        assertTrue(this.stubs.isCorrect.calledOnce);
    },

    'test check when object not isCorrect should call onWrong': function () {
        this.stubs.isCorrect.returns(false);

        this.showAnswersStateObject.check();

        assertTrue(this.stubs.onWrong.calledOnce);
    },

    'test check when object not isCorrect should call onHideAnswers first than isCorrect': function () {
        this.stubs.isCorrect.returns(false);

        this.showAnswersStateObject.check();

        assertTrue(this.stubs.onHideAnswers.calledBefore(this.stubs.isCorrect));
        assertTrue(this.stubs.onHideAnswers.calledBefore(this.stubs.onWrong));

        assertTrue(this.stubs.isCorrect.calledBefore(this.stubs.onWrong));

        assertTrue(this.stubs.onWrong.calledAfter(this.stubs.onHideAnswers));
        assertTrue(this.stubs.onWrong.calledAfter(this.stubs.isCorrect));
    },

    'test check when object is not Correct should add wrong css class': function () {
        this.stubs.isCorrect.returns(false);

        this.showAnswersStateObject.check();

        assertTrue(this.stubs.addCssClass.calledOnce);
        assertTrue(this.stubs.addCssClass.calledWith(this.wrong));
    },

    'test check should remove show answers css class': function () {
        this.stubs.isCorrect.returns(false);

        this.showAnswersStateObject.check();

        assertTrue(this.stubs.removeCssClass.calledOnce);
        assertTrue(this.stubs.removeCssClass.calledWith(this.showAnswers));
    },

    'test show answers shouldnt change state': function () {
        this.showAnswersStateObject.showAnswers();

        assertEquals(StatefullAddonObject._internal.STATE.SHOW_ANSWERS, this.showAnswersStateObject._actualState);
    }
});