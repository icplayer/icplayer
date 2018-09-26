TestCase('[Grid_Scene] Visibility tests', {
    setUp: function () {
        this.presenter = AddonGrid_Scene_create();

        this.stubs = {
            validateModelStub: sinon.stub(),
            setVisibilityStub: sinon.stub(),
            setQueLoopTimerStub: sinon.stub(),
            saveAnswerStub: sinon.stub()
        };

        this.presenter.validateModel = this.stubs.validateModelStub;
        this.presenter.setVisibility = this.stubs.setVisibilityStub;
        this.presenter.setQueLoopTimer = this.stubs.setQueLoopTimerStub;
        this.presenter.saveAnswer = this.stubs.saveAnswerStub;

        this.view = document.createElement('div');
    },

    'test when in preview mode, setVisibility should be called with true': function () {
        this.stubs.validateModelStub.returns({
            isError: false,
            isVisible: true,
            rows: 0,
            columns: 0
        });
        this.presenter.presenterLogic(this.view, {}, true);

        assertTrue(this.stubs.setVisibilityStub.calledWith(true));
    },

    'test when in preview mode and addon is not visible, setVisibility should be called with true': function () {
        this.stubs.validateModelStub.returns({
            isError: false,
            isVisible: false,
            rows: 0,
            columns: 0
        });
        this.presenter.presenterLogic(this.view, {}, true);

        assertTrue(this.stubs.setVisibilityStub.calledWith(true));
    },

    'test when not in preview mode and addon is visible, setVisibility should be called with true': function () {
        this.stubs.validateModelStub.returns({
            isError: false,
            isVisible: true,
            rows: 0,
            columns: 0
        });
        this.presenter.presenterLogic(this.view, {}, false);

        assertTrue(this.stubs.setVisibilityStub.calledWith(true));
    },

    'test when not in preview mode and addon is not visible, setVisibility should be called with false': function () {
        this.stubs.validateModelStub.returns({
            isError: false,
            isVisible: false,
            rows: 0,
            columns: 0
        });
        this.presenter.presenterLogic(this.view, {}, false);

        assertTrue(this.stubs.setVisibilityStub.calledWith(false));
    }
});