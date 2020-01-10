function getValidModel(isVisible) {
    return {
        isVisible: isVisible,
        isValid: true
    }
}

function getRawModel(isVisible) {
    return {
        "Is Visible": isVisible
    }
}

TestCase('[text_identification] Visibility tests', {
    setUp: function () {
        this.presenter = Addontext_identification_create();

        this.stubs = {
            validateModelStub: sinon.stub(),
            upgradeModelStub: sinon.stub(),
            setVisibilityStub: sinon.stub(),
            registerMathJaxListenerStub: sinon.stub(),
            buildKeyboardControllerStub: sinon.stub(),
            getEventBusStub: sinon.stub(),
            getTextParserStub: sinon.stub()
        };

        this.presenter.validateModel = this.stubs.validateModelStub;
        this.presenter.upgradeModel = this.stubs.upgradeModelStub;
        this.presenter.setVisibility = this.stubs.setVisibilityStub;
        this.presenter.registerMathJaxListener = this.stubs.registerMathJaxListenerStub;
        this.presenter.buildKeyboardController = this.stubs.buildKeyboardControllerStub;


        this.stubs.getEventBusStub.returns({
            addEventListener: function () {}
        });

        this.stubs.getTextParserStub.returns({
            parse: function () {
                return "";
            }
        });

        this.presenter.setPlayerController({
            getEventBus: this.stubs.getEventBusStub,
            getTextParser: this.stubs.getTextParserStub
        });

		this.view = document.createElement('div');
    },

    'test when in preview mode, setVisibility should be called with true': function () {
        this.stubs.validateModelStub.returns(getValidModel(true));
        this.stubs.upgradeModelStub.returns(getRawModel("True"));

        this.presenter.createPreview(this.view, {});

        assertTrue(this.stubs.setVisibilityStub.calledWith(true));
    },

    'test when in preview mode and addon is not visible, setVisibility should be called with true': function () {
        this.stubs.validateModelStub.returns(getValidModel(false));
        this.stubs.upgradeModelStub.returns(getRawModel("False"));

        this.presenter.createPreview(this.view, {});

        assertTrue(this.stubs.setVisibilityStub.calledWith(true));
    },

    'test when not in preview mode and addon is visible, setVisibility should be called with true': function () {
        this.stubs.validateModelStub.returns(getValidModel(true));
        this.stubs.upgradeModelStub.returns(getRawModel("True"));
        this.presenter.run(this.view, {});

        assertTrue(this.stubs.setVisibilityStub.calledWith(true));
    },

    'test when not in preview mode and addon is not visible, setVisibility should be called with false': function () {
        this.stubs.validateModelStub.returns(getValidModel(false));
        this.stubs.upgradeModelStub.returns(getRawModel("False"));

        this.presenter.run(this.view, {});

        assertTrue(this.stubs.setVisibilityStub.calledWith(false));
    }
});