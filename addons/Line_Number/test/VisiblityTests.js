function getValidModel(isVisible) {
    return {
        isVisibleByDefault: isVisible,
        rotation: '1',
        isError: false
    }
}

TestCase('[Line_Number] Visibility tests', {
    setUp: function () {
        this.presenter = AddonLine_Number_create();

        this.stubs = {
            validateModelStub: sinon.stub(),
            hideStub: sinon.stub(),
            createStepsStub: sinon.stub(),
            bindInfinityAreasStub: sinon.stub(),
            drawRangesStub: sinon.stub(),
            getEventBusStub: sinon.stub()
        };

        this.presenter.validateModel = this.stubs.validateModelStub;
        this.presenter.hide = this.stubs.hideStub;
        this.presenter.createSteps = this.stubs.createStepsStub;
        this.presenter.bindInfinityAreas = this.stubs.bindInfinityAreasStub;
        this.presenter.drawRanges = this.stubs.drawRangesStub;

        this.stubs.getEventBusStub.returns({
            addEventListener: function(){}
        });

        this.controller = {
            getEventBus: this.stubs.getEventBusStub
        };

        this.presenter.setPlayerController(this.controller);

        this.view = document.createElement('div');
    },

    'test when in preview mode, setVisibility should not be called': function () {
        this.stubs.validateModelStub.returns(getValidModel(true));
        this.presenter.createPreview(this.view, {});

        assertFalse(this.stubs.hideStub.called);
    },

    'test when in preview mode and addon is not visible, setVisibility should not be called': function () {
        this.stubs.validateModelStub.returns(getValidModel(false));
        this.presenter.createPreview(this.view, {});

        assertFalse(this.stubs.hideStub.called);
    },

    'test when not in preview mode and addon is visible, setVisibility should be called with true': function () {
        this.stubs.validateModelStub.returns(getValidModel(true));
        this.presenter.run(this.view, {});

        assertFalse(this.stubs.hideStub.called);
    },

    'test when not in preview mode and addon is not visible, setVisibility should be called with false': function () {
        this.stubs.validateModelStub.returns(getValidModel(false));
        this.presenter.run(this.view, {});

        assertTrue(this.stubs.hideStub.called);
    }
});