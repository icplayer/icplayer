TestCase("[Commons - Statefull Addon Object] Work State", {
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


        this.workStateObject = new StatefullAddonObject(this.configuration);

        this.workStateObject._actualState = StatefullAddonObject._internal.STATE.WORK;

        this.stubs = {
            isCorrect: sinon.stub(StatefullAddonObject.prototype, 'isCorrect'),
            onWrong: sinon.stub(StatefullAddonObject.prototype, 'onWrong'),
            onCorrect: sinon.stub(StatefullAddonObject.prototype, 'onCorrect'),
            onShowAnswers: sinon.stub(StatefullAddonObject.prototype, 'onShowAnswers'),
            onReset: sinon.stub(StatefullAddonObject.prototype, 'onReset'),
            addCssClass: sinon.stub(StatefullAddonObject.prototype, 'addCssClass'),
            removeCssClass: sinon.stub(StatefullAddonObject.prototype, 'removeCssClass')
        };

        this.spies = {
            setCssOnCorrect: sinon.spy(StatefullAddonObject.prototype, 'setCssOnCorrect'),
            setCssOnWrong: sinon.spy(StatefullAddonObject.prototype, 'setCssOnWrong'),
            setCssOnShowAnswers: sinon.spy(StatefullAddonObject.prototype, 'setCssOnShowAnswers')
        };
    },

    tearDown: function () {
        StatefullAddonObject.prototype.isCorrect.restore();
        StatefullAddonObject.prototype.onWrong.restore();
        StatefullAddonObject.prototype.onCorrect.restore();
        StatefullAddonObject.prototype.onShowAnswers.restore();
        StatefullAddonObject.prototype.onReset.restore();
        StatefullAddonObject.prototype.addCssClass.restore();
        StatefullAddonObject.prototype.removeCssClass.restore();
        StatefullAddonObject.prototype.setCssOnCorrect.restore();
        StatefullAddonObject.prototype.setCssOnWrong.restore();
        StatefullAddonObject.prototype.setCssOnShowAnswers.restore();
    },

    'test showAnswers should move object to showAnswers state': function () {
        this.workStateObject.showAnswers();

        assertEquals(StatefullAddonObject._internal.STATE.SHOW_ANSWERS, this.workStateObject._actualState);
    },

    'test showAnswers should call object onShowAnswers': function () {
        this.workStateObject.showAnswers();

        assertTrue(this.stubs.onShowAnswers.calledOnce);
    },

    'test showAnswers should add show answers css class': function () {
        this.workStateObject.showAnswers();

        assertTrue(this.stubs.addCssClass.calledOnce);
        assertTrue(this.stubs.addCssClass.calledWith(this.showAnswers));
    },

    'test showAnswers should call setCssOnShowAnswers': function () {
        this.workStateObject.showAnswers();

        assertTrue(this.spies.setCssOnShowAnswers.calledOnce);
    },

    'test check when object isCorrect should move object to correct state': function () {
        this.stubs.isCorrect.returns(true);

        this.workStateObject.check();

        assertEquals(StatefullAddonObject._internal.STATE.CORRECT, this.workStateObject._actualState);
    },

    'test check when object isCorrect should call onCorrect': function () {
        this.stubs.isCorrect.returns(true);

        this.workStateObject.check();

        assertTrue(this.stubs.onCorrect.calledOnce);
    },

    'test checking when object isCorrect should check if object isCorrect first': function () {
        this.stubs.isCorrect.returns(true);

        this.workStateObject.check();

        assertTrue(this.stubs.isCorrect.calledBefore(this.stubs.onCorrect));
    },

    'test checking when object isCorrect should add correct css class': function () {
        this.stubs.isCorrect.returns(true);

        this.workStateObject.check();

        assertTrue(this.stubs.addCssClass.calledOnce);
        assertTrue(this.stubs.addCssClass.calledWith(this.correct));
    },

    'test checking when object isCorrect should call setCssOnCorrect': function () {
        this.stubs.isCorrect.returns(true);

        this.workStateObject.check();

        assertTrue(this.spies.setCssOnCorrect.calledOnce);
    },

    'test check when object is not Correct should move object to wrong state': function () {
        this.stubs.isCorrect.returns(false);

        this.workStateObject.check();

        assertEquals(StatefullAddonObject._internal.STATE.WRONG, this.workStateObject._actualState);
    },

    'test check when object is not isCorrect should call onWrong': function () {
        this.stubs.isCorrect.returns(false);

        this.workStateObject.check();

        assertTrue(this.stubs.onWrong.calledOnce);
    },

    'test checking when object is not isCorrect should check if object isCorrect first': function () {
        this.stubs.isCorrect.returns(false);

        this.workStateObject.check();

        assertTrue(this.stubs.isCorrect.calledBefore(this.stubs.onWrong));
    },

    'test checking when object is not isCorrect should add wrong css class': function () {
        this.stubs.isCorrect.returns(false);

        this.workStateObject.check();

        assertTrue(this.stubs.addCssClass.calledOnce);
        assertTrue(this.stubs.addCssClass.calledWith(this.wrong));
    },

    'test checking when object is not isCorrect should call setCssOnWrong': function () {
        this.stubs.isCorrect.returns(false);

        this.workStateObject.check();

        assertTrue(this.spies.setCssOnWrong.calledOnce);
    },

    'test reset should move object to start state': function () {
        this.workStateObject.reset();

        assertEquals(StatefullAddonObject._internal.STATE.START, this.workStateObject._actualState);
    },

    'test reset should call onReset': function () {
        this.workStateObject.reset();

        assertTrue(this.stubs.onReset.calledOnce);
    },

    'test reset shouldnt change css class': function () {
        this.workStateObject.reset();

        assertFalse(this.stubs.addCssClass.called);
        assertFalse(this.stubs.removeCssClass.called);
    },

    'test notifyEdit shouldnt change state': function () {
        this.workStateObject.notifyEdit();

        assertEquals(StatefullAddonObject._internal.STATE.WORK, this.workStateObject._actualState);
    },

    'test hide answers shouldnt change state': function () {
        this.workStateObject.hideAnswers();

        assertEquals(StatefullAddonObject._internal.STATE.WORK, this.workStateObject._actualState);
    }
});