function getValidModel(isVisible) {
    return {
        isVisibleByDefault: isVisible,
        isValid: true,
        haveURL: true,
        allowFullScreen: false,
        isVisible: isVisible
    }
}

TestCase('[Iframe] Visibility tests', {
    setUp: function () {
        this.presenter = AddonIframe_create();

        this.stubs = {
            validateModelStub: sinon.stub(),
            setVisibilityStub: sinon.stub()
        };

        this.presenter.validateModel = this.stubs.validateModelStub;
        this.presenter.setVisibility = this.stubs.setVisibilityStub;
        this.presenter.eventBus = {
            addEventListener: function(){}
        };

        this.view = document.createElement('div');
        this.view.append(document.createElement('iframe'));
    },

    'test when in preview mode, setVisibility should be called with true': function () {
        this.stubs.validateModelStub.returns(getValidModel(true));
        this.presenter.createPreview(this.view, {});

        assertTrue(this.stubs.setVisibilityStub.calledWith(true));
    },

    'test when in preview mode and addon is not visible, setVisibility should be called with true': function () {
        this.stubs.validateModelStub.returns(getValidModel(false));
        this.presenter.createPreview(this.view, {});

        assertTrue(this.stubs.setVisibilityStub.calledWith(true));
    },

    'test when not in preview mode and addon is visible, setVisibility should be called with true': function () {
        this.stubs.validateModelStub.returns(getValidModel(true));
        this.presenter.run(this.view, {});

        assertTrue(this.stubs.setVisibilityStub.calledWith(true));
    },

    'test when not in preview mode and addon is not visible, setVisibility should be called with false': function () {
        this.stubs.validateModelStub.returns(getValidModel(false));
        this.presenter.run(this.view, {});

        assertTrue(this.stubs.setVisibilityStub.calledWith(false));
    },

    'test when not in preview mode, flag isEditor should be false': function () {
        this.stubs.validateModelStub.returns(getValidModel(true));
        this.presenter.run(this.view, {});

        assertFalse(this.presenter.isEditor);
    },

    'test when in preview mode, flag isEditor should be true': function () {
        this.stubs.validateModelStub.returns(getValidModel(true));
        this.presenter.createPreview(this.view, {});

        assertTrue(this.presenter.isEditor);
    }

});