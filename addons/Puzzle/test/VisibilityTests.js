function getValidModel(isVisible) {
    return {
        isVisible: isVisible,
        isValid: true
    }
}

TestCase('[Puzzle] Visibility tests', {
    setUp: function () {
        this.presenter = AddonPuzzle_create();

        this.stubs = {
            setVisibilityStub: sinon.stub()
        };

        this.presenter.setVisibility = this.stubs.setVisibilityStub;

		this.view = document.createElement('div');
		this.view.append(document.createElement('img'));
    },

    'test when in preview mode, setVisibility should not be called': function () {
        this.presenter.createPreview(this.view, {});

        assertFalse(this.stubs.setVisibilityStub.called);
    },

    'test when in preview mode and addon is not visible, setVisibility should not be called': function () {
        this.presenter.createPreview(this.view, {});

        assertFalse(this.stubs.setVisibilityStub.called);
    }
});