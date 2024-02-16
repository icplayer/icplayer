TestCase('[Graph] Visibility tests', {
    setUp: function () {
        this.presenter = Addongraph_create();

        this.stubs = {
            validateModelStub: sinon.stub(),
            setVisibilityStub: sinon.stub(),
            upgradeModelStub: sinon.stub(),
            drawGraphStub: sinon.stub(),
            drawExampleAnswersStub: sinon.stub()
        };

        this.presenter.validateModel = this.stubs.validateModelStub;
        this.presenter.setVisibility = this.stubs.setVisibilityStub;
        this.presenter.upgradeModel = this.stubs.upgradeModelStub;
        this.presenter.drawGraph = this.stubs.drawGraphStub;
        this.presenter.drawExampleAnswers = this.stubs.drawExampleAnswersStub;

        this.view = document.createElement('div');
    },

    'test when in preview mode, setVisibility should be called with true': function () {
        this.stubs.validateModelStub.returns({
            isValid: true,
            isVisible: true
        });
        this.presenter.initialize(this.view, {}, true);

        assertTrue(this.stubs.setVisibilityStub.calledWith(true));
    },

    'test when in preview mode and addon is not visible, setVisibility should be called with true': function () {
        this.stubs.validateModelStub.returns({
            isValid: true,
            isVisible: false
        });
        this.presenter.initialize(this.view, {}, true);

        assertTrue(this.stubs.setVisibilityStub.calledWith(true));
    },

    'test when not in preview mode and addon is visible, setVisibility should be called with true': function () {
        this.stubs.validateModelStub.returns({
            isValid: true,
            isVisible: true
        });
        this.presenter.initialize(this.view, {}, false);

        assertTrue(this.stubs.setVisibilityStub.calledWith(true));
    },

    'test when not in preview mode and addon is not visible, setVisibility should be called with false': function () {
        this.stubs.validateModelStub.returns({
            isValid: true,
            isVisible: false
        });
        this.presenter.initialize(this.view, {}, false);

        assertTrue(this.stubs.setVisibilityStub.calledWith(false));
    }
});