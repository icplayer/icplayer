TestCase("[Hangman] Drawing elements with attached handlers", {
    setUp: function () {
        this.presenter = AddonHangman_create();

        sinon.stub(this.presenter, 'drawElements');
        sinon.stub(this.presenter, 'showCorrect');
        sinon.stub(this.presenter, 'handleMouseActions');
    },

    tearDown: function () {
        this.presenter.drawElements.restore();
        this.presenter.showCorrect.restore();
        this.presenter.handleMouseActions.restore();
    },

    'test draw elements with handlers in Player': function () {
        this.presenter.drawElementsAndAttachMouseHandlers(0, false);

        assertTrue(this.presenter.drawElements.calledOnce);
        assertTrue(this.presenter.handleMouseActions.calledOnce);
        assertFalse(this.presenter.showCorrect.called);
    },

    'test draw elements with handlers in Editor': function () {
        this.presenter.isErrorCheckingMode = false;

        this.presenter.drawElementsAndAttachMouseHandlers(0, true);

        assertTrue(this.presenter.drawElements.calledOnce);
        assertFalse(this.presenter.handleMouseActions.calledOnce);
        assertTrue(this.presenter.showCorrect.calledOnce);
    }
});