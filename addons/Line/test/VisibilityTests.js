function getValidModel(isVisible) {
    return {
        isVisible: isVisible,
        rotation: '1',
        isError: false
    }
}

TestCase('[Limited_Show_Answers] Visiblity tests', {
    setUp: function () {
        this.presenter = AddonLine_create();

        this.stubs = {
            validateModelStub: sinon.stub(),
            setVisibilityStub: sinon.stub(),
            drawLineStub: sinon.stub(),
            connectKeyDownActionStub: sinon.stub(),
            addEventListenerStub: sinon.stub()
        };

        this.presenter.validateModel = this.stubs.validateModelStub;
        this.presenter.setVisibility = this.stubs.setVisibilityStub;
        this.presenter.drawLine = this.stubs.drawLineStub;

        this.view = document.createElement('div');
    },

    'test when in preview mode, setVisibility should not be called': function () {
        this.stubs.validateModelStub.returns(getValidModel(true));
        this.presenter.createPreview(this.view, {});

        assertTrue(this.stubs.setVisibilityStub.calledWith(true));
    },

    'test when in preview mode and addon is not visible, setVisibility should not be called': function () {
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
    }
});