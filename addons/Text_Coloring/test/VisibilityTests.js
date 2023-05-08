function getValidModel(isVisible) {
    return {
        isVisible: isVisible,
        isError: false,
        colors: [{id: 'a'}]
    }
}

TestCase('[Text_Coloring] Visibility tests', {
    setUp: function () {
        this.presenter = AddonText_Coloring_create();

        this.stubs = {
            validateModelStub: sinon.stub(),
            hideStub: sinon.stub(),
            upgradeModelStub: sinon.stub(),
            setFilteredTokensDataStub: sinon.stub(),
            setViewStub: sinon.stub(),
            colorTokensInPreviewStub: sinon.stub(),
            connectHandlersStub: sinon.stub(),
            setColorStub: sinon.stub(),
            buildKeyboardControllerStub: sinon.stub(),
            setSpeechTextsStub: sinon.stub()
        };

        this.presenter.validateModel = this.stubs.validateModelStub;
        this.presenter.hide = this.stubs.hideStub;
        this.presenter.upgradeModel = this.stubs.upgradeModelStub;
        this.presenter.upgradeModel.returns({});
        this.presenter.setFilteredTokensData = this.stubs.setFilteredTokensDataStub;
        this.presenter.setView = this.stubs.setViewStub;
        this.presenter.colorTokensInPreview = this.stubs.colorTokensInPreviewStub;
        this.presenter.connectHandlers = this.stubs.connectHandlersStub;
        this.presenter.setColor = this.stubs.setColorStub;
        this.presenter.buildKeyboardController = this.stubs.buildKeyboardControllerStub;
        this.presenter.setSpeechTexts = this.stubs.setSpeechTextsStub;

		this.view = document.createElement('div');
    },

    'test when in preview mode, hide should be not called': function () {
        this.stubs.validateModelStub.returns(getValidModel(true));

        this.presenter.createPreview(this.view, {});

        assertFalse(this.stubs.hideStub.called);
    },

    'test when in preview mode and addon is not visible, hide should not be called': function () {
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