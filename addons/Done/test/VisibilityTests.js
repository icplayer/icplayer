TestCase('[Done] Visibility tests', {
    setUp: function () {
        this.presenter = AddonDone_create();

        this.stubs = {
            validateModelStub: sinon.stub(),
            initializeGraphFromConfigurationStub: sinon.stub(),
            setVisibilityStub: sinon.stub()
        };

        this.presenter.validateModel = this.stubs.validateModelStub;
        this.presenter.setVisibility = this.stubs.setVisibilityStub;
        this.presenter.initializeGraphFromConfiguration = this.stubs.initializeGraphFromConfigurationStub;

        this.presenter.graphObject = function () {
            this.initializeGraph = function () {};
            this.block = function () {};
        };

        this.view = document.createElement('div');
    },

    'test when in preview mode, setVisibility should be called with true': function () {
        this.stubs.validateModelStub.returns({
            isError: false,
            isVisible: true
        });
        this.presenter.createPreview(this.view, {});

        assertTrue(this.stubs.setVisibilityStub.calledWith(true));
    },

    'test when in preview mode and addon is not visible, setVisibility should be called with true': function () {
        this.stubs.validateModelStub.returns({
            isError: false,
            isVisible: false
        });
        this.presenter.createPreview(this.view, {});

        assertTrue(this.stubs.setVisibilityStub.calledWith(true));
    },

    'test when not in preview mode and addon is visible, setVisibility should be called with true': function () {
        this.stubs.validateModelStub.returns({
            isError: false,
            isVisible: true
        });
        this.presenter.run(this.view, {});

        assertTrue(this.stubs.setVisibilityStub.calledWith(true));
    },

    'test when not in preview mode and addon is not visible, setVisibility should be called with false': function () {
        this.stubs.validateModelStub.returns({
            isError: false,
            isVisible: false
        });
        this.presenter.run(this.view, {});

        assertTrue(this.stubs.setVisibilityStub.calledWith(false));
    }
});