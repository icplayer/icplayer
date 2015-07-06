TestCase("[Commons - Statefull Addon Object] Block State", {
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


        this.blockStateObject = new StatefullAddonObject(this.configuration);
        this.blockStateObject._actualState = StatefullAddonObject._internal.STATE.BLOCK;

        this.stubs = {
            onUnblock: sinon.stub(StatefullAddonObject.prototype, 'onUnblock'),
            onShowAnswers: sinon.stub(StatefullAddonObject.prototype, 'onShowAnswers'),
            addCssClass: sinon.stub(StatefullAddonObject.prototype, 'addCssClass'),
            removeCssClass: sinon.stub(StatefullAddonObject.prototype, 'removeCssClass')
        };
        
        this.spies = {
            notifyEdit: sinon.spy(StatefullAddonObject.prototype, 'notifyEdit'),
            setCssOnUnblock: sinon.spy(StatefullAddonObject.prototype, 'setCssOnUnblock')
        };
    },

    tearDown: function () {
        StatefullAddonObject.prototype.onUnblock.restore();
        StatefullAddonObject.prototype.onShowAnswers.restore();
        StatefullAddonObject.prototype.notifyEdit.restore();
        StatefullAddonObject.prototype.addCssClass.restore();
        StatefullAddonObject.prototype.removeCssClass.restore();
        StatefullAddonObject.prototype.setCssOnUnblock.restore();
    },

    'test check should move object to start state': function () {
        this.blockStateObject.check();

        assertEquals(StatefullAddonObject._internal.STATE.START, this.blockStateObject._actualState);
    },

    'test check should call onUnblock': function () {
        this.blockStateObject.check();

        assertTrue(this.stubs.onUnblock.calledOnce);
    },
    
    'test check should remove block css class': function () {
        this.blockStateObject.check();
        
        assertTrue(this.stubs.removeCssClass.calledOnce);
        assertTrue(this.stubs.removeCssClass.calledWith(this.block));
    },

    'test check should call setCssOnBlock': function () {
        this.blockStateObject.check();

        assertTrue(this.spies.setCssOnUnblock.calledOnce);
    },

    'test reset should move object to start state': function () {
        this.blockStateObject.reset();
    
        assertEquals(StatefullAddonObject._internal.STATE.START, this.blockStateObject._actualState);
    },

    'test reset should call onUnblock': function () {
        this.blockStateObject.reset();

        assertTrue(this.stubs.onUnblock.calledOnce);
    },
    
    'test reset should remove block css class': function () {
        this.blockStateObject.reset();
        
        assertTrue(this.stubs.removeCssClass.calledOnce);
        assertTrue(this.stubs.removeCssClass.calledWith(this.block));
    },

    'test show answers should move object to show answers state': function () {
        this.blockStateObject.showAnswers();

        assertEquals(StatefullAddonObject._internal.STATE.SHOW_ANSWERS, this.blockStateObject._actualState);
    },

    'test show answers should call onUnblock': function () {
        this.blockStateObject.showAnswers();

        assertTrue(this.stubs.onUnblock.calledOnce);
    },

    'test show answers should call notifyEdit': function () {
        this.blockStateObject.showAnswers();

        assertTrue(this.spies.notifyEdit.called);
    },

    'test show answers should call onShowAnswers': function () {
        this.blockStateObject.showAnswers();

        assertTrue(this.stubs.onShowAnswers.calledOnce);
    },

    'test show answers should call onUnblock than notifyEdit than onShowAnswers': function () {
        this.blockStateObject.showAnswers();

        assertTrue(this.stubs.onUnblock.calledBefore(this.spies.notifyEdit));
        assertTrue(this.stubs.onUnblock.calledBefore(this.stubs.onShowAnswers));

        assertTrue(this.spies.notifyEdit.calledBefore(this.stubs.onShowAnswers));

        assertTrue(this.stubs.onShowAnswers.calledAfter(this.stubs.onUnblock));
        assertTrue(this.stubs.onShowAnswers.calledAfter(this.spies.notifyEdit));
    },

    'test show answers should remove block css class': function () {
        this.blockStateObject.showAnswers();

        assertTrue(this.stubs.removeCssClass.calledOnce);
        assertTrue(this.stubs.removeCssClass.calledWith(this.block));
    },

    'test show answers should add show answers css class': function () {
        this.blockStateObject.showAnswers();

        assertTrue(this.stubs.addCssClass.calledOnce);
        assertTrue(this.stubs.addCssClass.calledWith(this.showAnswers));
    },

    'test hide answers shouldnt change state': function () {
        this.blockStateObject.hideAnswers();

        assertEquals(StatefullAddonObject._internal.STATE.BLOCK, this.blockStateObject._actualState);
    }
});
