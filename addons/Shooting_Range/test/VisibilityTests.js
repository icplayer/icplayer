function getValidModel(isVisible) {
    return {
        isVisibleByDefault: isVisible,
        isValid: true
    }
}

TestCase('[Shooting_Range] Visibility tests', {
    setUp: function () {
        this.presenter = AddonShooting_Range_create();

        this.stubs = {
            validateModelStub: sinon.stub(),
            setVisibilityStub: sinon.stub(),
            initializeGameStub: sinon.stub(),
            actualizeAnswersWrapperHeightStub: sinon.stub(),
            connectHandlersStub: sinon.stub()
        };

        this.presenter.validateModel = this.stubs.validateModelStub;
        this.presenter.setVisibility = this.stubs.setVisibilityStub;
        this.presenter.initializeGame = this.stubs.initializeGameStub;
        this.presenter.actualizeAnswersWrapperHeight = this.stubs.actualizeAnswersWrapperHeightStub;
        this.presenter.connectHandlers = this.stubs.connectHandlersStub;
        
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