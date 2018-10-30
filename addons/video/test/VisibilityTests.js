function getValidModel(isVisible) {
    return {
        isVisible: isVisible,
        isValid: true
    }
}

TestCase('[Video] Visibility tests', {
    setUp: function () {
        this.presenter = Addonvideo_create();

        this.stubs = {
            validateModelStub: sinon.stub(),
            upgradeModelStub: sinon.stub(),
            hideStub: sinon.stub(),
            setVideoStub: sinon.stub(),
            setDimensionsStub: sinon.stub()
        };

        this.presenter.validateModel = this.stubs.validateModelStub;
        this.presenter.upgradeModel = this.stubs.upgradeModelStub;
        this.presenter.hide = this.stubs.hideStub;
        this.presenter.setVideo = this.stubs.setVideoStub;
        this.presenter.setDimensions = this.stubs.setDimensionsStub;
    },

    'test when in preview mode, setVisibility should be called with true': function () {
        this.stubs.validateModelStub.returns(getValidModel(true));

        this.presenter.createPreview('', {});

        assertFalse(this.stubs.hideStub.called);
    },

    'test when in preview mode and addon is not visible, setVisibility should be called with true': function () {
        this.stubs.validateModelStub.returns(getValidModel(false));
        this.presenter.createPreview('', {});

        assertFalse(this.stubs.hideStub.called);
    }
});