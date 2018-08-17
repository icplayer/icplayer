function getValidModel(isVisible) {
    return {
        isVisibleByDefault: isVisible,
        isError: false,
        Width: 10,
        Height: 10,
        layers: {length: 0}
    }
}

TestCase('[Layered_Image] Visiblity tests', {
    setUp: function () {
        this.presenter = AddonLayered_Image_create();

        this.stubs = {
            validateModelStub: sinon.stub(),
            hideStub: sinon.stub()
        };

        this.presenter.validateModel = this.stubs.validateModelStub;
        this.presenter.hide = this.stubs.hideStub;

        this.view = document.createElement('div');
    },

    'test when in preview mode, hide should not be called': function () {
        this.stubs.validateModelStub.returns(getValidModel(true));
        this.presenter.createPreview(this.view, {});

        assertFalse(this.stubs.hideStub.called);
    },

    'test when in preview mode and addon is not visible, hide should not be': function () {
        this.stubs.validateModelStub.returns(getValidModel(false));
        this.presenter.createPreview(this.view, {});

        assertFalse(this.stubs.hideStub.called);
    },

    'test when not in preview mode and addon is visible, hide should not be called': function () {
        this.stubs.validateModelStub.returns(getValidModel(true));
        this.presenter.run(this.view, {});

        assertFalse(this.stubs.hideStub.called);
    },

    'test when not in preview mode and addon is not visible, hide should be called': function () {
        this.stubs.validateModelStub.returns(getValidModel(false));
        this.presenter.run(this.view, {});

        assertTrue(this.stubs.hideStub.called);
    }
});