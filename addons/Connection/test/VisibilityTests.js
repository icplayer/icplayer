TestCase('[Connection] Visibility tests', {
    setUp: function () {
        this.presenter = AddonConnection_create();

        this.stubs = {
            upgradeModelStub: sinon.stub(),
            setUpViewBodyStub: sinon.stub(),
            loadElementsStub: sinon.stub(),
            validateModelStub: sinon.stub(),
            chooseOrientationStub: sinon.stub(),
            initializeViewStub: sinon.stub(),
            removeNonVisibleInnerHTMLStub: sinon.stub(),
            drawConfiguredConnectionsStub: sinon.stub(),
            gatherCorrectConnectionsStub: sinon.stub(),
            buildKeyboardControllerStub: sinon.stub(),
            setVisibilityStub: sinon.stub()
        };

        this.presenter.upgradeModel = this.stubs.upgradeModelStub;
        this.presenter.setUpViewBody = this.stubs.setUpViewBodyStub;
        this.presenter.loadElements = this.stubs.loadElementsStub;
        this.presenter.validateModel = this.stubs.validateModelStub;
        this.presenter.chooseOrientation = this.stubs.chooseOrientationStub;
        this.presenter.initializeView = this.stubs.initializeViewStub;
        this.presenter.removeNonVisibleInnerHTML = this.stubs.removeNonVisibleInnerHTMLStub;
        this.presenter.drawConfiguredConnections = this.stubs.drawConfiguredConnectionsStub;
        this.presenter.gatherCorrectConnections = this.stubs.gatherCorrectConnectionsStub;
        this.presenter.buildKeyboardController = this.stubs.buildKeyboardControllerStub;
        this.presenter.setVisibility = this.stubs.setVisibilityStub;

        this.presenter.mathJaxProcessEnded = {
            'then': function(){}
        };

        this.stubs.validateModelStub.returns({isValid: true});

        this.presenter.upgradeModel.returnsArg(0);

        this.view = document.createElement('div');
    },

    'test when in preview mode, setVisibility should be called with true': function () {
        var model = {
            "Is Visible": "True",
            "Single connection mode": "True",
            "initialConnections": [],
            "disabledConnectionColor": ""
        };

        this.presenter.initialize(this.view, model, true);

        assertTrue(this.stubs.setVisibilityStub.calledWith(true));
    },

    'test when in preview mode and addon is not visible, setVisibility should be called with true': function () {
        var model = {
            "Is Visible": "False",
            "Single connection mode": "True",
            "initialConnections": [],
            "disabledConnectionColor": ""
        };

        this.presenter.initialize(this.view, model, true);

        assertTrue(this.stubs.setVisibilityStub.calledWith(true));
    },

    'test when not in preview mode and addon is visible, setVisibility should be called with true': function () {
        var model = {
            "Is Visible": "True",
            "Single connection mode": "True",
            "initialConnections": [],
            "disabledConnectionColor": ""
        };

        this.presenter.initialize(this.view, model, false);

        assertTrue(this.stubs.setVisibilityStub.calledWith(true));
    },

    'test when not in preview mode and addon is not visible, setVisibility should be called with false': function () {
        var model = {
            "Is Visible": "False",
            "Single connection mode": "True",
            "initialConnections": [],
            "disabledConnectionColor": ""
        };


        this.presenter.initialize(this.view, model, false);

        assertTrue(this.stubs.setVisibilityStub.calledWith(false));
    }
});