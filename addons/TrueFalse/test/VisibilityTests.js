function getValidModel(isVisible) {
    return {
        "Is Visible": isVisible,
        isValid: true,
        'Questions': [{
             'Question': "True is on the left",
             'Answser': "1"
        }],
        'Choices': [
            { 'Choice': "True" },
            { 'Choice': "False" }
        ],
        'Speech texts': {
            'Selected': {},
            'Deselected': {},
            'Correct': {},
            'Incorrect': {}
        }
    }
}

TestCase('[TrueFalse] Visibility tests', {
    setUp: function () {
        this.presenter = AddonTrueFalse_create();

        this.stubs = {
            validateModelStub: sinon.stub(),
            setVisibilityStub: sinon.stub(),
            getEventBusStub: sinon.stub(),
            getTextParserStub: sinon.stub(),
            generateTableContentStub: sinon.stub(),
            renderObjectStub: sinon.stub()
        };

        this.stubs.getEventBusStub.returns({
            addEventListener: function () {}
        });

        this.stubs.getTextParserStub.returns({
            connectLinks: function () {}
        });

        this.presenter.setPlayerController({
            getEventBus: this.stubs.getEventBusStub,
            getTextParser: this.stubs.getTextParserStub
        });

        this.presenter.validateModel = this.stubs.validateModelStub;
        this.presenter.upgradeModel = this.stubs.validateModelStub;
        this.presenter.setVisibility = this.stubs.setVisibilityStub;

        this.presenter.generateTableContent = this.stubs.generateTableContentStub;
        this.presenter.renderObject = this.stubs.renderObjectStub;

        this.view = document.createElement('div');
    },

    'test when in preview mode, setVisibility should be called with true': function () {
        this.stubs.validateModelStub.returns(getValidModel("True"));

        this.presenter.createPreview(this.view, getValidModel("True"));

        assertFalse(this.stubs.setVisibilityStub.called);
    },

    'test when in preview mode and addon is not visible, setVisibility should not be called': function () {
        this.stubs.validateModelStub.returns(getValidModel("False"));
        this.presenter.createPreview(this.view, getValidModel("True"));

        assertFalse(this.stubs.setVisibilityStub.called);
    },

    'test when not in preview mode and addon is visible, setVisibility should not be called': function () {
        this.stubs.validateModelStub.returns(getValidModel("True"));
        this.presenter.run(this.view, {});

        assertTrue(this.stubs.setVisibilityStub.calledWith(true));
    },

    'test when not in preview mode and addon is not visible, setVisibility should be called with false': function () {
        this.stubs.validateModelStub.returns(getValidModel("False"));

        this.presenter.run(this.view, {});

        assertTrue(this.stubs.setVisibilityStub.calledWith(false));
    }
});