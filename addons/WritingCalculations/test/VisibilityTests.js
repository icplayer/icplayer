function getValidModel(isVisible) {
    return {
        'Is Visible': isVisible,
        Signs: ['']
    }
}

TestCase('[WritingCalculations] Visibility tests', {
    setUp: function () {
        this.presenter = AddonWritingCalculations_create();

        this.stubs = {
            setVisibilityStub: sinon.stub(),
            getEventBusStub: sinon.stub(),
            convertStringToArrayStub: sinon.stub(),
            upgradeModelStub: sinon.stub(),
            readSignsStub: sinon.stub(),
            createViewStub: sinon.stub(),
            bindValueChangeEventStub: sinon.stub(),
            setContainerWidthStub: sinon.stub(),
            addAdditionalStylesStub: sinon.stub()
        };

        this.presenter.validateModel = this.stubs.validateModelStub;
        this.presenter.convertStringToArray = this.stubs.convertStringToArrayStub;
        this.presenter.upgradeModel = this.stubs.upgradeModelStub;
        this.presenter.readSigns = this.stubs.readSignsStub;
        this.presenter.createView = this.stubs.createViewStub;
        this.presenter.bindValueChangeEvent = this.stubs.bindValueChangeEventStub;
        this.presenter.setContainerWidth = this.stubs.setContainerWidthStub;
        this.presenter.addAdditionalStyles = this.stubs.addAdditionalStylesStub;
        this.presenter.setVisibility = this.stubs.setVisibilityStub;

        this.stubs.getEventBusStub.returns({
            addEventListener: function(){}
        });

        this.presenter.playerController = {
           getEventBus: this.stubs.getEventBusStub
        };

        this.view = document.createElement('div');

        this.view = document.createElement('div');
    },

    'test when in preview mode, setVisibility should not be called': function () {
        var validModel = getValidModel('True');
        this.stubs.upgradeModelStub.returns(validModel);
        this.presenter.createPreview(this.view, validModel);

        assertTrue(this.stubs.setVisibilityStub.calledWith(true));
    },

    'test when in preview mode and addon is not visible, setVisibility should not be called': function () {
        var validModel = getValidModel('True');
        this.stubs.upgradeModelStub.returns(validModel);
        this.presenter.createPreview(this.view, validModel);

        assertTrue(this.stubs.setVisibilityStub.calledWith(true));
    },

    'test when not in preview mode and addon is visible, setVisibility should be called with true': function () {
        var validModel = getValidModel('True');
        this.stubs.upgradeModelStub.returns(validModel);
        this.presenter.run(this.view, validModel);

        assertTrue(this.stubs.setVisibilityStub.calledWith(true));
    },

    'test when not in preview mode and addon is not visible, setVisibility should be called with false': function () {
        var validModel = getValidModel('False');
        this.stubs.upgradeModelStub.returns(validModel);
        this.presenter.run(this.view, validModel);

        assertTrue(this.stubs.setVisibilityStub.calledWith(false));
    }
});