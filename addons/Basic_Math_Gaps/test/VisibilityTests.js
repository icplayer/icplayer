TestCase('[Basic_Math_Gap] Preview tests', {
    setUp: function () {
        this.presenter = AddonBasic_Math_Gaps_create();

        this.stubs = {
            upgradeModelStub: sinon.stub(),
            validateModelStub: sinon.stub(),
            createGapsStub: sinon.stub(),
            addFocusOutEventListenerStub: sinon.stub(),
            setWrapperCssStub: sinon.stub(),
            setVisibilityStub: sinon.stub(),
            setOnEventListenersStub: sinon.stub()
        };

        this.presenter.upgradeModel = this.stubs.upgradeModelStub;
        this.presenter.validateModel = this.stubs.validateModelStub;
        this.presenter.createGaps = this.stubs.createGapsStub;
        this.presenter.addFocusOutEventListener = this.stubs.addFocusOutEventListenerStub;
        this.presenter.setWrapperCss = this.stubs.setWrapperCssStub;
        this.presenter.setVisibility = this.stubs.setVisibilityStub;
        this.presenter.setOnEventListeners = this.stubs.setOnEventListenersStub;
    },

    'test when in preview mode, setVisibility should be called with true': function () {
        this.stubs.validateModelStub.returns({
            isVisible: true,
            isError: false
        });

        this.presenter.createPreview('', {});

        assertTrue(this.stubs.setVisibilityStub.calledWith(true));
    },

    'test when in preview mode and addon is not visible, setVisibility should be called with true': function () {
        this.stubs.validateModelStub.returns({
            isVisible: false,
            isError: false
        });
        this.presenter.createPreview('', {});

        assertTrue(this.stubs.setVisibilityStub.calledWith(true));
    },

    'test when not in preview mode and addon is visible, setVisibility should be called with true': function () {
        this.stubs.validateModelStub.returns({
            isVisible: true,
            isError: false
        });
        this.presenter.run('', {});

        assertTrue(this.stubs.setVisibilityStub.calledWith(true));
    },

    'test when not in preview mode and addon is not visible, setVisibility should be called with false': function () {
        this.stubs.validateModelStub.returns({
            isVisible: false,
            isError: false
        });

        this.presenter.run('', {});

        assertTrue(this.stubs.setVisibilityStub.calledWith(false));
    }
});