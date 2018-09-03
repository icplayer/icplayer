TestCase('[External_Link_Button] Visibility tests', {
    setUp: function () {
        this.presenter = AddonExternal_Link_Button_create();

        this.stubs = {
            validateModelStub: sinon.stub(),
            setVisibilityStub: sinon.stub(),
            isLocalResourceStub: sinon.stub(),
            getWrapperStub: sinon.stub(),
            createElementsStub: sinon.stub(),
            setElementsDimensionsStub: sinon.stub()
        };

        this.presenter.validateModel = this.stubs.validateModelStub;
        this.presenter.setVisibility = this.stubs.setVisibilityStub;
        this.presenter.isLocalResource = this.stubs.isLocalResourceStub;
        this.presenter.getWrapper = this.stubs.getWrapperStub;
        this.presenter.createElements = this.stubs.createElementsStub;
        this.presenter.setElementsDimensions = this.stubs.setElementsDimensionsStub;

        this.presenter.graphObject = function () {
            this.initializeGraph = function () {};
            this.block = function () {};
        };

        this.view = document.createElement('div');
    },

    'test when in preview mode, setVisibility should be called with true': function () {
        this.stubs.validateModelStub.returns({
            isValid: true,
            isVisibleByDefault: true
        });
        this.presenter.createPreview(this.view, {});

        assertTrue(this.stubs.setVisibilityStub.calledWith(true));
    },

    'test when in preview mode and addon is not visible, setVisibility should be called with true': function () {
        this.stubs.validateModelStub.returns({
            isValid: true,
            isVisibleByDefault: false
        });
        this.presenter.createPreview(this.view, {});

        assertTrue(this.stubs.setVisibilityStub.calledWith(true));
    },

    'test when not in preview mode and addon is visible, setVisibility should be called with true': function () {
        this.stubs.validateModelStub.returns({
            isValid: true,
            isVisibleByDefault: true
        });
        this.presenter.run(this.view, {});

        assertTrue(this.stubs.setVisibilityStub.calledWith(true));
    },

    'test when not in preview mode and addon is not visible, setVisibility should be called with false': function () {
        this.stubs.validateModelStub.returns({
            isValid: true,
            isVisibleByDefault: false
        });
        this.presenter.run(this.view, {});

        assertTrue(this.stubs.setVisibilityStub.calledWith(false));
    }
});