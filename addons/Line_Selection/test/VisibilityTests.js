function getValidModel(isVisible) {
    return {
        isVisible: isVisible,
        isError: false
    }
}

TestCase('[Line_Selection] Visiblity tests', {
    setUp: function () {
        this.presenter = AddonLine_Selection_create();

        this.stubs = {
            validateModelStub: sinon.stub(),
            updateVisibilityStub: sinon.stub(),
            drawLinesStub: sinon.stub()
        };

        this.presenter.validateModel = this.stubs.validateModelStub;
        this.presenter.updateVisibility = this.stubs.updateVisibilityStub;
        this.presenter.drawLines = this.stubs.drawLinesStub;

        this.stubs.drawLinesStub.returns(false);

        this.view = document.createElement('div');
    },

    'test when in preview mode, setVisibility should not be called': function () {
        this.stubs.validateModelStub.returns(getValidModel(true));
        this.presenter.initiate(this.view, {}, true);

        assertFalse(this.stubs.updateVisibilityStub.called);
    },

    'test when in preview mode and addon is not visible, setVisibility should not be called': function () {
        this.stubs.validateModelStub.returns(getValidModel(false));
        this.presenter.initiate(this.view, {}, true);

        assertFalse(this.stubs.updateVisibilityStub.called);
    },

    'test when not in preview mode and addon is visible, setVisibility should be called with true': function () {
        this.stubs.validateModelStub.returns(getValidModel(true));
        this.presenter.initiate(this.view, {}, false);

        assertTrue(this.stubs.updateVisibilityStub.called);
    },

    'test when not in preview mode and addon is not visible, setVisibility should be called with false': function () {
        this.stubs.validateModelStub.returns(getValidModel(false));
        this.presenter.initiate(this.view, {}, false);

        assertTrue(this.stubs.updateVisibilityStub.called);
    }
});