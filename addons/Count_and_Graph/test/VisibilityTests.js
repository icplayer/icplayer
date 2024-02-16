TestCase('[Count_and_graph] Visibility tests', {
    setUp: function () {
        this.presenter = AddonCount_and_Graph_create();

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
            isValid: true,
            isVisible: true,
            axisYValues: {},
            answers: [],
            exampleColumns: []
        });
        this.presenter.runLogic(this.view, {}, true);

        assertTrue(this.stubs.setVisibilityStub.calledWith(true));
    },

    'test when in preview mode and addon is not visible, setVisibility should be called with true': function () {
        this.stubs.validateModelStub.returns({
            isValid: true,
            isVisible: false,
            axisYValues: {},
            answers: [],
            exampleColumns: []
        });
        this.presenter.runLogic(this.view, {}, true);

        assertTrue(this.stubs.setVisibilityStub.calledWith(true));
    },

    'test when not in preview mode and addon is visible, setVisibility should be called with true': function () {
        this.stubs.validateModelStub.returns({
            isValid: true,
            isVisible: true,
            axisYValues: {},
            answers: [],
            exampleColumns: []
        });
        this.presenter.runLogic(this.view, {}, false);

        assertTrue(this.stubs.setVisibilityStub.calledWith(true));
    },

    'test when not in preview mode and addon is not visible, setVisibility should be called with false': function () {
        this.stubs.validateModelStub.returns({
            isValid: true,
            isVisible: false,
            axisYValues: {},
            answers: [],
            exampleColumns: []
        });
        this.presenter.runLogic(this.view, {}, false);

        assertTrue(this.stubs.setVisibilityStub.calledWith(false));
    }
});