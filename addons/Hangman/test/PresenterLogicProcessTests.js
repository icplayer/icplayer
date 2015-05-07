TestCase("[Hangman] Presenter logic process", {
    setUp: function () {
        this.presenter = AddonHangman_create();

        this.modelSanitizationStub = sinon.stub(this.presenter, 'sanitizeModel');
        this.modelSanitizationStub.returns({
            isError: false,
            phrases: [{
                letters: this.presenter.DEFAULT_LETTERS,
                phrase: ['HANGMAN']
            }]
        });

        sinon.stub(this.presenter, 'drawElements');
        sinon.stub(this.presenter, 'handleMouseActions');
        sinon.stub(this.presenter, 'showCorrect');
        sinon.stub(this.presenter, 'assignVariablesToPresenter');
        sinon.stub(DOMOperationsUtils, 'showErrorMessage');
        sinon.stub(this.presenter, 'addMarkedLetter');

        this.viewElement = $('<div></div>');
    },

    tearDown: function () {
        this.presenter.sanitizeModel.restore();
        this.presenter.drawElements.restore();
        this.presenter.handleMouseActions.restore();
        this.presenter.showCorrect.restore();
        this.presenter.assignVariablesToPresenter.restore();
        this.presenter.addMarkedLetter.restore();

        DOMOperationsUtils.showErrorMessage.restore();
    },

    'test error while sanitizing model': function () {
        this.modelSanitizationStub.returns({ isError: true});
        var model = {
            Phrases: [{
                Letters: 'A,BA',
                Phrase: 'Hangman'
            }],
            'Number of trials': ''
        };

        this.presenter.presenterLogic(this.viewElement, model, false);

        assertTrue(DOMOperationsUtils.showErrorMessage.calledOnce);
        assertFalse(this.presenter.assignVariablesToPresenter.called);
        assertFalse(this.presenter.drawElements.called);
        assertFalse(this.presenter.handleMouseActions.called);
        assertFalse(this.presenter.showCorrect.called);
    },

    'test model sanitation went well in Addon preview (Editor)': function () {
        var model = {
            Phrases: [{
                Letters: '',
                Phrase: 'Hangman'
            }],
            'Number of trials': '3'
        };

        this.presenter.presenterLogic(this.viewElement, model, true);

        assertFalse(DOMOperationsUtils.showErrorMessage.called);
        assertTrue(this.presenter.assignVariablesToPresenter.called);
        assertTrue(this.presenter.drawElements.called);
        assertFalse(this.presenter.handleMouseActions.called);
        assertTrue(this.presenter.showCorrect.called);
    },

    'test model sanitation went well in Addon run (Player)': function () {
        var model = {
            Phrases: [{
                Letters: '',
                Phrase: 'Hangman'
            }],
            'Number of trials': '6'
        };

        this.presenter.presenterLogic(this.viewElement, model, false);

        assertFalse(DOMOperationsUtils.showErrorMessage.called);
        assertTrue(this.presenter.assignVariablesToPresenter.called);
        assertTrue(this.presenter.drawElements.called);
        assertTrue(this.presenter.handleMouseActions.called);
        assertFalse(this.presenter.showCorrect.called);
    }
});