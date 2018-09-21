function getValidModel(isVisible) {
    return {
        isVisible: isVisible,
        isError: false
    }
}

TestCase('[Page_Rating] Visibility tests', {
    setUp: function () {
        this.presenter = AddonPage_Rating_create();

        this.stubs = {
            sanitizeModelStub: sinon.stub(),
            setVisibilityStub: sinon.stub(),
            getEventBusStub: sinon.stub(),
            updateViewStub: sinon.stub()
        };

        this.presenter.sanitizeModel = this.stubs.sanitizeModelStub;
        this.presenter.setVisibility = this.stubs.setVisibilityStub;
        this.presenter.setCanvasDimensions = this.stubs.setCanvasDimensionsStub;
        this.presenter.updateView = this.stubs.updateViewStub;

		this.stubs.getEventBusStub.returns({
            addEventListener: function () {}
        });

        this.presenter.setPlayerController({
            getEventBus: this.stubs.getEventBusStub
        });

		this.view = document.createElement('div');
    },

    'test when in preview mode, setVisibility should be called with true': function () {
        this.stubs.sanitizeModelStub.returns(getValidModel(true));

        this.presenter.createPreview(this.view, {});

        assertTrue(this.stubs.setVisibilityStub.calledWith(true));
    },

    'test when in preview mode and addon is not visible, setVisibility should be called with true': function () {
        this.stubs.sanitizeModelStub.returns(getValidModel(false));
        this.presenter.createPreview(this.view, {});

        assertTrue(this.stubs.setVisibilityStub.calledWith(true));
    },

    'test when not in preview mode and addon is visible, setVisibility should be called with true': function () {
        this.stubs.sanitizeModelStub.returns(getValidModel(true));
        this.presenter.run(this.view, {});

        assertTrue(this.stubs.setVisibilityStub.calledWith(true));
    },

    'test when not in preview mode and addon is not visible, setVisibility should be called with false': function () {
        this.stubs.sanitizeModelStub.returns(getValidModel(false));

        this.presenter.run(this.view, {});

        assertTrue(this.stubs.setVisibilityStub.calledWith(false));
    }
});