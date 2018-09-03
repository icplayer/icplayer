function getValidModel(isVisible) {
    return {
        "Is Visible": isVisible,
        isValid: true,
        "Values": [' ']
    }
}

TestCase('[Sudoku] Visibility tests', {
    setUp: function () {
        this.presenter = AddonSudoku_create();

        this.stubs = {
            drawSudokuStub: sinon.stub(),
            setVisibilityStub: sinon.stub(),
            drawInitialStub: sinon.stub()
        };

        this.presenter.drawSudoku = this.stubs.drawSudokuStub;
        this.stubs.drawSudokuStub.returns(document.createElement('div'));

        this.presenter.setVisibility = this.stubs.setVisibilityStub;
        this.presenter.drawInitial = this.stubs.drawInitialStub;

        this.presenter.eventBus = {
            addEventListener: function(){}
        };

		this.view = document.createElement('div');
    },

    'test when in preview mode, setVisibility should be called with true': function () {
        this.presenter.createPreview(this.view, getValidModel("True"));

        assertTrue(this.stubs.setVisibilityStub.calledWith(true));
    },

    'test when in preview mode and addon is not visible, setVisibility should be called with true': function () {
        this.presenter.createPreview(this.view, getValidModel("false"));

        assertTrue(this.stubs.setVisibilityStub.calledWith(true));
    },

    'test when not in preview mode and addon is visible, setVisibility should be called with true': function () {
        this.presenter.run(this.view, getValidModel("True"));

        assertTrue(this.stubs.setVisibilityStub.calledWith(true));
    },

    'test when not in preview mode and addon is not visible, setVisibility should be called with false': function () {
        this.presenter.run(this.view, getValidModel("false"));

        assertTrue(this.stubs.setVisibilityStub.calledWith(false));
    }
});