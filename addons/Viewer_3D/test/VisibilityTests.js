function getValidModel(isVisible) {
    return {
        isVisible: isVisible,
        isValid: true
    }
}

TestCase('[Viewer_3D] Visibility tests', {
    setUp: function () {
        this.presenter = AddonViewer_3D_create();

        this.stubs = {
            parseModelStub: sinon.stub(),
            setVisibilityStub: sinon.stub(),
            setCanvasDimensionsStub: sinon.stub(),
            renderObjectStub: sinon.stub()
        };

        this.presenter.parseModel = this.stubs.parseModelStub;
        this.presenter.setVisibility = this.stubs.setVisibilityStub;
        this.presenter.setCanvasDimensions = this.stubs.setCanvasDimensionsStub;
        this.presenter.renderObject = this.stubs.renderObjectStub;
    },

    'test when in preview mode, setVisibility should be called with true': function () {
        this.stubs.parseModelStub.returns(getValidModel(true));

        this.presenter.createPreview('', {});

        assertTrue(this.stubs.setVisibilityStub.calledWith(true));
    },

    'test when in preview mode and addon is not visible, setVisibility should be called with true': function () {
        this.stubs.parseModelStub.returns(getValidModel(false));
        this.presenter.createPreview('', {});

        assertTrue(this.stubs.setVisibilityStub.calledWith(true));
    },

    'test when not in preview mode and addon is visible, setVisibility should be called with true': function () {
        this.stubs.parseModelStub.returns(getValidModel(true));
        this.presenter.run('', {});

        assertTrue(this.stubs.setVisibilityStub.calledWith(true));
    },

    'test when not in preview mode and addon is not visible, setVisibility should be called with false': function () {
        this.stubs.parseModelStub.returns(getValidModel(false));

        this.presenter.run('', {});

        assertTrue(this.stubs.setVisibilityStub.calledWith(false));
    }
});