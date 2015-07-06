TestCase("[Commons - Statefull Addon Object] Wrong State", {
    setUp: function () {
        this.correct = "";
        this.wrong = "";
        this.showAnswers = "";

        this.configuration = {
            correct: this.correct,
            wrong: this.wrong,
            showAnswers: this.showAnswers,
        };

        this.wrongStateObject = new StatefullAddonObject(this.configuration);

        this.wrongStateObject._actualState = StatefullAddonObject._internal.STATE.WRONG;

        this.stubs = {
            onUnWrong: sinon.stub(StatefullAddonObject.prototype, 'onUnWrong'),
            onShowAnswers: sinon.stub(StatefullAddonObject.prototype, 'onShowAnswers'),
            onReset: sinon.stub(StatefullAddonObject.prototype, 'onReset'),
            addCssClass: sinon.stub(StatefullAddonObject.prototype, 'addCssClass'),
            removeCssClass: sinon.stub(StatefullAddonObject.prototype, 'removeCssClass')
        };

        this.spies = {
            setCssOnUnWrong: sinon.spy(StatefullAddonObject.prototype, 'setCssOnUnWrong')
        };
    },

    tearDown: function () {
        StatefullAddonObject.prototype.onUnWrong.restore();
        StatefullAddonObject.prototype.onShowAnswers.restore();
        StatefullAddonObject.prototype.onReset.restore();
        StatefullAddonObject.prototype.addCssClass.restore();
        StatefullAddonObject.prototype.removeCssClass.restore();
        StatefullAddonObject.prototype.setCssOnUnWrong.restore();
    },

    'test check should move object to work state': function () {
        this.wrongStateObject.check();

        assertEquals(StatefullAddonObject._internal.STATE.WORK, this.wrongStateObject._actualState);
    },

    'test check should call onUnWrong': function () {
        this.wrongStateObject.check();

        assertTrue(this.stubs.onUnWrong.calledOnce);
    },

    'test check should remove wrong css class': function () {
        this.wrongStateObject.check();

        assertTrue(this.stubs.removeCssClass.calledOnce);
        assertTrue(this.stubs.removeCssClass.calledWith(this.wrong));
    },

    'test check should call setCssOnUnwrong': function () {
        this.wrongStateObject.check();

        assertTrue(this.spies.setCssOnUnWrong.calledOnce);
    },

    'test reset should move object to start state': function () {
        this.wrongStateObject.reset();

        assertEquals(StatefullAddonObject._internal.STATE.START, this.wrongStateObject._actualState);
    },

    'test reset should call onUnWrong': function () {
        this.wrongStateObject.reset();

        assertTrue(this.stubs.onUnWrong.calledOnce);
    },

    'test reset should call onReset': function () {
        this.wrongStateObject.reset();

        assertTrue(this.stubs.onReset.calledOnce);
    },

    'test reset should call onUnWrong before onReset': function () {
        this.wrongStateObject.reset();

        assertTrue(this.stubs.onUnWrong.calledBefore(this.stubs.onReset));
    },

    'test reset should remove wrong css class': function () {
        this.wrongStateObject.reset();

        assertTrue(this.stubs.removeCssClass.calledOnce);
        assertTrue(this.stubs.removeCssClass.calledWith(this.wrong));
    },

    'test show answers should move object to show answers state': function () {
        this.wrongStateObject.showAnswers();

        assertEquals(StatefullAddonObject._internal.STATE.SHOW_ANSWERS, this.wrongStateObject._actualState);
    },

    'test show answers should call onUnWrong': function () {
        this.wrongStateObject.showAnswers();

        assertTrue(this.stubs.onUnWrong.calledOnce);
    },

    'test show asnwers should call onShowAnswers': function () {
        this.wrongStateObject.showAnswers();

        assertTrue(this.stubs.onShowAnswers.calledOnce);
    },

    'test show answers should call onUnWrong before onShowAnswers': function () {
        this.wrongStateObject.showAnswers();

        assertTrue(this.stubs.onUnWrong.calledBefore(this.stubs.onShowAnswers));
    },

    'test show answers should remove wrong css class': function () {
        this.wrongStateObject.showAnswers();

        assertTrue(this.stubs.removeCssClass.calledOnce);
        assertTrue(this.stubs.removeCssClass.calledWith(this.wrong));
    },

    'test show answers should add show answers css class': function () {
        this.wrongStateObject.showAnswers();

        assertTrue(this.stubs.addCssClass.calledOnce);
        assertTrue(this.stubs.addCssClass.calledWith(this.showAnswers));
    },

    'test hide answers shouldnt change state': function () {
        this.wrongStateObject.hideAnswers();

        assertEquals(StatefullAddonObject._internal.STATE.WRONG, this.wrongStateObject._actualState);
    }
});