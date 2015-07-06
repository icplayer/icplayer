TestCase("[Commons - Statefull Addon Object] Start State", {
    setUp: function () {
        this.correct = "";
        this.wrong = "";
        this.answers = "";
        this.block = "";
        this.work = "";

        this.configuration = {
            correct: this.correct,
            wrong: this.wrong,
            showAnswers: this.answers,
            block: this.block,
            work: this.work
        };

        this.startStateObject = new StatefullAddonObject(this.configuration);

        this.stubs = {
            onBlock: sinon.stub(StatefullAddonObject.prototype, 'onBlock'),
            onShowAnswers: sinon.stub(StatefullAddonObject.prototype, 'onShowAnswers'),
            addCssClass: sinon.stub(StatefullAddonObject.prototype, 'addCssClass')
        };

        this.spies = {
            notifyEdit: sinon.spy(StatefullAddonObject.prototype, 'notifyEdit'),
            setCssOnBlock: sinon.spy(StatefullAddonObject.prototype, 'setCssOnBlock')
        };
    },

    tearDown: function () {
        StatefullAddonObject.prototype.onBlock.restore();
        StatefullAddonObject.prototype.onShowAnswers.restore();
        StatefullAddonObject.prototype.addCssClass.restore();
        StatefullAddonObject.prototype.notifyEdit.restore();
        StatefullAddonObject.prototype.setCssOnBlock.restore();
    },

    'test check should move object to block state': function () {
        this.startStateObject.check();

        assertEquals(StatefullAddonObject._internal.STATE.BLOCK, this.startStateObject._actualState);
    },

    'test check should call onBlock': function () {
        this.startStateObject.check();

        assertTrue(this.stubs.onBlock.calledOnce);
    },

    'test check should add block css': function () {
        this.startStateObject.check();

        assertTrue(this.stubs.addCssClass.calledOnce);
        assertTrue(this.stubs.addCssClass.calledWith(this.block));
    },

    'test check should call setCssOnBlock': function () {
        this.startStateObject.check();

        assertTrue(this.spies.setCssOnBlock.calledOnce);
    },

    'test show answers should move object to show answers state': function () {
        this.startStateObject.showAnswers();

        assertEquals(StatefullAddonObject._internal.STATE.SHOW_ANSWERS, this.startStateObject._actualState);
    },

    'test show answers should call notifyEdit': function () {
        this.startStateObject.showAnswers();

        assertTrue(this.spies.notifyEdit.calledOnce);
    },

    'test show answers should call onShowAnswers': function () {
        this.startStateObject.showAnswers();

        assertTrue(this.stubs.onShowAnswers.calledOnce);
    },

    'test show answers should call notifyEdit and after that onShowAnswers': function () {
        this.startStateObject.showAnswers();

        assertTrue(this.spies.notifyEdit.calledBefore(this.stubs.onShowAnswers));
    },

    'test show answers should add show answers css class': function () {
        this.startStateObject.showAnswers();

        assertTrue(this.stubs.addCssClass.calledOnce);
        assertTrue(this.stubs.addCssClass.calledWith(this.answers));
    },

    'test show answers shouldnt change state': function () {
        this.startStateObject.hideAnswers();

        assertEquals(StatefullAddonObject._internal.STATE.START, this.startStateObject._actualState);
    }
});

TestCase("[Commons - Statefull Addon Object] Start State notifyEdit", {
    setUp: function () {
        this.startStateObject = new StatefullAddonObject({});
    },

    'test notifyEdit should move object to work state': function () {
        this.startStateObject.notifyEdit();

        assertEquals(StatefullAddonObject._internal.STATE.WORK, this.startStateObject._actualState);
    }
});