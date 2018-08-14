TestCase('[Basic_Math_Gap] Preview tests', {
    setUp: function () {
        this.presenter = AddonClock_create();

        this.stubs = {
            drawClockStub: sinon.stub(),
            setVisibilityStub: sinon.stub(),
            validateTimeStub: sinon.stub()
        };

        this.presenter.setVisibility = this.stubs.setVisibilityStub;
        this.presenter.drawClock = this.stubs.drawClockStub;
        this.presenter.validateTime = this.stubs.validateTimeStub;
        this.view = document.createElement('div');
    },

    'test when in preview mode, setVisibility should be called with true': function () {
        var model = {
            "Is Visible": "True"
        };
        this.presenter.init(this.view, model, true);

        assertTrue(this.stubs.setVisibilityStub.calledWith(true));
    },

    'test when in preview mode and addon is not visible, setVisibility should be called with true': function () {
        var model = {
            "Is Visible": "False"
        };
        this.presenter.init(this.view, model, true);

        assertTrue(this.stubs.setVisibilityStub.calledWith(true));
    },

    'test when not in preview mode and addon is visible, setVisibility should be called with true': function () {
        var model = {
            "Is Visible": "True"
        };
        this.presenter.init(this.view, model, false);

        assertTrue(this.stubs.setVisibilityStub.calledWith(true));
    },

    'test when not in preview mode and addon is not visible, setVisibility should be called with false': function () {
        var model = {
            "Is Visible": "False"
        };
        this.presenter.init(this.view, model, false);

        assertTrue(this.stubs.setVisibilityStub.calledWith(false));
    }
});