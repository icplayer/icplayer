TestCase('[Clock] Visibility tests', {
    setUp: function () {
        this.presenter = AddonClock_create();

        this.stubs = {
            drawClockStub: sinon.stub(),
            setClockTimeStub: sinon.stub(),
            setVisibilityStub: sinon.stub(),
            validateStub: sinon.stub(),
            validateTimeStub: sinon.stub()
        };

        this.presenter.setVisibility = this.stubs.setVisibilityStub;
        this.presenter.drawClock = this.stubs.drawClockStub;
        this.presenter.setClockTime = this.stubs.setClockTimeStub;
        this.presenter.validate = this.stubs.validateStub;
        this.presenter.validateTime = this.stubs.validateTimeStub;
        this.view = document.createElement('div');

        this.stubs.validateStub.returns(true);

        this.presenter.eventBus = {
            addEventListener: function(){}
        };
    },

    'test when in preview mode, setVisibility should be called with true': function () {
        var model = {
            "Is Visible": "True"
        };
        this.presenter.createPreview(this.view, model);

        assertTrue(this.stubs.setVisibilityStub.calledWith(true));
    },

    'test when in preview mode and addon is not visible, setVisibility should be called with true': function () {
        var model = {
            "Is Visible": "False"
        };
        this.presenter.createPreview(this.view, model);

        assertTrue(this.stubs.setVisibilityStub.calledWith(true));
    },

    'test when not in preview mode and addon is visible, setVisibility should be called with true': function () {
        var model = {
            "Is Visible": "True"
        };
        this.presenter.run(this.view, model);

        assertTrue(this.stubs.setVisibilityStub.calledWith(true));
    },

    'test when not in preview mode and addon is not visible, setVisibility should be called with false': function () {
        var model = {
            "Is Visible": "False"
        };
        this.presenter.run(this.view, model);

        assertTrue(this.stubs.setVisibilityStub.calledWith(false));
    }
});