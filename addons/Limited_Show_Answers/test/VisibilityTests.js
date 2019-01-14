function getValidModel(isVisible) {
    return {
        value: {
            isVisible: isVisible,
            isTabindexEnabled: false
        }
    }
}

TestCase('[Limited_Show_Answers] Visiblity tests', {
    setUp: function () {
        this.presenter = AddonLimited_Show_Answers_create();

        this.stubs = {
            validateModelStub: sinon.stub(),
            setVisibilityStub: sinon.stub(),
            connectClickActionStub: sinon.stub(),
            connectKeyDownActionStub: sinon.stub(),
            addEventListenerStub: sinon.stub()
        };

        this.presenter.validateModel = this.stubs.validateModelStub;
        this.presenter.setVisibility = this.stubs.setVisibilityStub;
        this.presenter.connectClickAction = this.stubs.connectClickActionStub;
        this.presenter.connectKeyDownAction = this.stubs.connectKeyDownActionStub;
        this.presenter.eventBus = {
            addEventListener: this.stubs.addEventListenerStub
        };

        this.view = document.createElement('div');
    },

    'test when in preview mode, setVisibility should not be called': function () {
        this.stubs.validateModelStub.returns(getValidModel(true));
        this.presenter.createPreview(this.view, {});

        assertFalse(this.stubs.setVisibilityStub.called);
    },

    'test when in preview mode and addon is not visible, setVisibility should not be called': function () {
        this.stubs.validateModelStub.returns(getValidModel(false));
        this.presenter.createPreview(this.view, {});

        assertFalse(this.stubs.setVisibilityStub.called);
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