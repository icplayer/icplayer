function getValidModel(isVisible) {
    return {
        isVisible: isVisible,
        isValid: true
    }
}

TestCase('[Zoom_Image] Visiblity tests', {
    setUp: function () {
        this.presenter = AddonZoom_Image_create();

        this.stubs = {
            validateModelStub: sinon.stub(),
            setVisibilityStub: sinon.stub(),
            upgradeModelStub: sinon.stub()
        };

        this.presenter.validateModel = this.stubs.validateModelStub;
        this.presenter.setVisibility = this.stubs.setVisibilityStub;
        this.presenter.upgradeModel = this.stubs.upgradeModelStub;

        this.view = document.createElement('div');
    },

    'test when in preview mode, setVisibility should not be called': function () {
        this.stubs.validateModelStub.returns(getValidModel(true));
        this.presenter.createPreview(this.view, {}, true);

        assertFalse(this.stubs.setVisibilityStub.called);
    },

    'test when in preview mode and addon is not visible, setVisibility should not be called': function () {
        this.stubs.validateModelStub.returns(getValidModel(false));
        this.presenter.createPreview(this.view, {}, true);

        assertFalse(this.stubs.setVisibilityStub.called);
    },

    'test when not in preview mode and addon is visible, setVisibility should be called with true': function () {
        this.stubs.validateModelStub.returns(getValidModel(true));
        this.presenter.run(this.view, {}, false);

        assertTrue(this.stubs.setVisibilityStub.called);
    },

    'test when not in preview mode and addon is not visible, setVisibility should be called with false': function () {
        this.stubs.validateModelStub.returns(getValidModel(false));
        this.presenter.run(this.view, {}, false);

        assertTrue(this.stubs.setVisibilityStub.called);
    }
});