function getValidModel(isVisible) {
    return {
        isVisibleByDefault: isVisible,
        isValid: true,
        imageSrc: "src",
        Width: 100,
        Height: 100
    }
}

TestCase('[Image_Identification] Visibility tests', {
    setUp: function () {
        this.presenter = AddonImage_Identification_create();

        this.stubs = {
            validateModelStub: sinon.stub(),
            setVisibilityStub: sinon.stub(),

            addEventListenerStub: sinon.stub(),
            getEventBusStub: sinon.stub(),
            upgradeModelStub: sinon.stub()
        };

        this.eventBus = {
            addEventListener: this.stubs.addEventListenerStub
        };

        this.playerController = {
            getEventBus: this.stubs.getEventBusStub
        };

        this.stubs.getEventBusStub.returns(this.eventBus);
        this.stubs.upgradeModelStub.returnsArg(0);

        this.presenter.setPlayerController(this.playerController);

        this.presenter.validateModel = this.stubs.validateModelStub;
        this.presenter.setVisibility = this.stubs.setVisibilityStub;
        this.presenter.upgradeModel = this.stubs.upgradeModelStub;

        this.view = document.createElement('div');
    },

    'test when in preview mode, setVisibility should be called with true': function () {
        this.stubs.validateModelStub.returns(getValidModel(true));
        this.presenter.createPreview(this.view, {Width: 100, Height: 100}, true);

        assertTrue(this.stubs.setVisibilityStub.calledWith(true));
    },

    'test when in preview mode and addon is not visible, setVisibility should be called with true': function () {
        this.stubs.validateModelStub.returns(getValidModel(false));
        this.presenter.createPreview(this.view, {}, true);

        assertTrue(this.stubs.setVisibilityStub.calledWith(true));
    },

    'test when not in preview mode and addon is visible, setVisibility should be called with true': function () {
        this.stubs.validateModelStub.returns(getValidModel(true));
        this.presenter.run(this.view, {}, false);

        assertTrue(this.stubs.setVisibilityStub.calledWith(true));
    },

    'test when not in preview mode and addon is not visible, setVisibility should be called with false': function () {
        this.stubs.validateModelStub.returns(getValidModel(false));
        this.presenter.run(this.view, {}, false);

        assertTrue(this.stubs.setVisibilityStub.calledWith(false));
    }
});