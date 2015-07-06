TestCase("[Commons - Statefull Addon Object] Correct State", {
    setUp: function () {
        this.correct = "";
        this.wrong = "";
        this.showAnswers = "";

        this.configuration = {
            correct: this.correct,
            wrong: this.wrong,
            showAnswers: this.showAnswers
        };

        this.correctStateObject = new StatefullAddonObject(this.configuration);

        this.correctStateObject._actualState = StatefullAddonObject._internal.STATE.CORRECT;

        this.stubs = {
            onUnCorrect: sinon.stub(StatefullAddonObject.prototype, 'onUnCorrect'),
            onShowAnswers: sinon.stub(StatefullAddonObject.prototype, 'onShowAnswers'),
            onReset: sinon.stub(StatefullAddonObject.prototype, 'onReset'),
            removeCssClass: sinon.stub(StatefullAddonObject.prototype, 'removeCssClass'),
            addCssClass: sinon.stub(StatefullAddonObject.prototype, 'addCssClass')
        };

        this.spies = {
            setCssOnUnCorrect: sinon.spy(StatefullAddonObject.prototype, 'setCssOnUnCorrect')
        };
    },

    tearDown: function () {
        StatefullAddonObject.prototype.onUnCorrect.restore();
        StatefullAddonObject.prototype.onShowAnswers.restore();
        StatefullAddonObject.prototype.onReset.restore();
        StatefullAddonObject.prototype.removeCssClass.restore();
        StatefullAddonObject.prototype.addCssClass.restore();
        StatefullAddonObject.prototype.setCssOnUnCorrect.restore();
    },

    'test check should move object to work state': function () {
        this.correctStateObject.check();

        assertEquals(StatefullAddonObject._internal.STATE.WORK, this.correctStateObject._actualState);
    },

    'test check should call onUnCorrect': function () {
        this.correctStateObject.check();

        assertTrue(this.stubs.onUnCorrect.calledOnce);
    },

    'test check should remove correct css class': function () {
        this.correctStateObject.check();

        assertTrue(this.stubs.removeCssClass.calledOnce);
        assertTrue(this.stubs.removeCssClass.calledWith(this.correct));
    },

    'test check should call setCssOnUnCorrect': function () {
        this.correctStateObject.check();

        assertTrue(this.spies.setCssOnUnCorrect.calledOnce);
    },

    'test reset should move object to start state': function () {
        this.correctStateObject.reset();

        assertEquals(StatefullAddonObject._internal.STATE.START, this.correctStateObject._actualState);
    },

    'test reset should call onUnCorrect': function () {
        this.correctStateObject.reset();

        assertTrue(this.stubs.onUnCorrect.calledOnce);
    },

    'test reset should call onReset': function () {
        this.correctStateObject.reset();

        assertTrue(this.stubs.onReset.calledOnce);
    },

    'test reset should call onUnCorrect before onReset': function () {
        this.correctStateObject.reset();

        assertTrue(this.stubs.onUnCorrect.calledBefore(this.stubs.onReset));
    },

    'test reset should remove correct css class': function () {
        this.correctStateObject.reset();

        assertTrue(this.stubs.removeCssClass.calledOnce);
        assertTrue(this.stubs.removeCssClass.calledWith(this.correct));
    },

    'test show answers should move object to show answers state': function () {
        this.correctStateObject.showAnswers();

        assertEquals(StatefullAddonObject._internal.STATE.SHOW_ANSWERS, this.correctStateObject._actualState);
    },

    'test show answers should call onUnCorrect': function () {
        this.correctStateObject.showAnswers();

        assertTrue(this.stubs.onUnCorrect.calledOnce);
    },

    'test show asnwers should call onShowAnswers': function () {
        this.correctStateObject.showAnswers();

        assertTrue(this.stubs.onShowAnswers.calledOnce);
    },

    'test show answers should call onUnCorrect before onShowAnswers': function () {
        this.correctStateObject.showAnswers();

        assertTrue(this.stubs.onUnCorrect.calledBefore(this.stubs.onShowAnswers));
    },

    'test show answers should remove show answers css class': function () {
        this.correctStateObject.reset();

        assertTrue(this.stubs.removeCssClass.calledOnce);
        assertTrue(this.stubs.removeCssClass.calledWith(this.showAnswers));
    },

    'test hide answers shouldnt change state': function () {
        this.correctStateObject.hideAnswers();

        assertEquals(StatefullAddonObject._internal.STATE.CORRECT, this.correctStateObject._actualState);
    }
});