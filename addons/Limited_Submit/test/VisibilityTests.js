function getValidModel(isVisible) {
    return {
        value: {
            isVisible: isVisible,
            isTabindexEnabled: false
        }
    }
}

TestCase('[Limited Submit] Visiblity tests', {
    setUp: function () {
        this.presenter = AddonLimited_Submit_create();

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

    'test given preview mode and visibility as true when createPreview is called then setVisibility is not called': function () {
        this.stubs.validateModelStub.returns(getValidModel(true));
        this.presenter.createPreview(this.view, {});

        assertFalse(this.stubs.setVisibilityStub.called);
    },

    'test given preview mode and visibility as false when createPreview is called then setVisibility is not called': function () {
        this.stubs.validateModelStub.returns(getValidModel(false));
        this.presenter.createPreview(this.view, {});

        assertFalse(this.stubs.setVisibilityStub.called);
    },

    'test given work mode and visibility as true when run is called then setVisibility is called': function () {
        this.stubs.validateModelStub.returns(getValidModel(true));
        this.presenter.run(this.view, {});

        assertTrue(this.stubs.setVisibilityStub.calledWith(true));
    },

    'test given work mode and visibility as false when run is called then setVisbility is called': function () {
        this.stubs.validateModelStub.returns(getValidModel(false));
        this.presenter.run(this.view, {});

        assertTrue(this.stubs.setVisibilityStub.calledWith(false));
    }
});