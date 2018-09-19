function getValidModel(isVisible) {
    return {
        isVisible: isVisible,
        isValid: true
    }
}

TestCase('[Show_Answers] Visibility tests', {
    setUp: function () {
        this.presenter = AddonShow_Answers_create();

        this.stubs = {
            validateModelStub: sinon.stub(),
            setVisibilityStub: sinon.stub(),
            connectClickActionStub: sinon.stub(),
            connectKeyDownActionStub: sinon.stub(),
            getEventBusStub: sinon.stub()
        };

        this.presenter.validateModel = this.stubs.validateModelStub;
        this.presenter.setVisibility = this.stubs.setVisibilityStub;
        this.presenter.connectClickAction = this.stubs.connectClickActionStub;
        this.presenter.connectKeyDownAction = this.stubs.connectKeyDownActionStub;

		this.stubs.getEventBusStub.returns({
            addEventListener: function () {}
        });

        this.presenter.setPlayerController({
            getEventBus: this.stubs.getEventBusStub
        });

		this.view = document.createElement('div');
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
    }
});