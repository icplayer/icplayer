TestCase("[Limited_Show_Answers] Event receiving tests", {
    setUp: function () {
        this.presenter = AddonLimited_Show_Answers_create();

        this.stubs = {
            textStub: sinon.stub(),
            removeClassStub: sinon.stub(),
            addClassStub: sinon.stub()
        };

        this.presenter.configuration = {
            addonID: 'Show_Answers1',
            worksWithModulesList: ["module1", "module2"],
            isEnabled: true,
            isSelected: false
        };

        this.presenter.$button = {
            text: this.stubs.textStub
        };

        this.presenter.$wrapper = {
            removeClass: this.stubs.removeClassStub,
            addClass: this.stubs.addClassStub
        };
    },

    'test should resets addon layout when HideAnswers event was received': function () {
        this.presenter.onEventReceived("HideAnswers");

        assertTrue(this.stubs.removeClassStub.calledTwice);
        assertTrue(this.stubs.removeClassStub.getCall(0).args.includes("selected"));
        assertTrue(this.stubs.removeClassStub.getCall(1).args.includes("disabled"));

        assertTrue(this.presenter.configuration.isEnabled);
        assertFalse(this.presenter.configuration.isSelected);
    },

    'test should makes addon disabled when ShowAnswers event was received': function () {
        this.presenter.onEventReceived("ShowAnswers");

        assertTrue(this.stubs.addClassStub.calledOnce);
        assertTrue(this.stubs.addClassStub.getCall(0).args.includes("selected"));

        assertTrue(this.stubs.removeClassStub.calledOnce);
        assertTrue(this.stubs.removeClassStub.getCall(0).args.includes("disabled"));

        assertFalse(this.presenter.configuration.isEnabled);
        assertTrue(this.presenter.configuration.isSelected);
    },

    'test should does nothing when LimitedHideAnswers event was received and event module is not supported': function () {
        this.presenter.onEventReceived("LimitedHideAnswers", ["module3"]);

        assertTrue(this.stubs.addClassStub.notCalled);
        assertTrue(this.stubs.removeClassStub.notCalled);
        assertTrue(this.presenter.configuration.isEnabled);
        assertFalse(this.presenter.configuration.isSelected);
    },

    'test should resets addon layout when LimitedHideAnswers event was received and event module is supported': function () {
        this.presenter.configuration.isEnabled = false;
        this.presenter.configuration.isSelected = true;

        this.presenter.onEventReceived("LimitedHideAnswers", ["module1"]);

        assertTrue(this.stubs.removeClassStub.calledTwice);
        assertTrue(this.stubs.removeClassStub.getCall(0).args.includes("selected"));
        assertTrue(this.stubs.removeClassStub.getCall(1).args.includes("disabled"));
        assertTrue(this.presenter.configuration.isEnabled);
        assertFalse(this.presenter.configuration.isSelected);
    }
});