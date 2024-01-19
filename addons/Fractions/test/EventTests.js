TestCase("[Fractions] Events tests", {
    setUp: function() {
        this.presenter = AddonFractions_create();
        this.presenter.addonID = "Fractions1";

        this.stubs = {
            showAnswers: sinon.stub(this.presenter, "showAnswers"),
            hideAnswers: sinon.stub(this.presenter, "hideAnswers"),
            gradualShowAnswers: sinon.stub(this.presenter, "gradualShowAnswers"),
            gradualHideAnswers: sinon.stub(this.presenter, "gradualHideAnswers")
        };
    },

    tearDown: function () {
        this.presenter.showAnswers.restore();
        this.presenter.hideAnswers.restore();
        this.presenter.gradualHideAnswers.restore();
        this.presenter.gradualShowAnswers.restore();
    },

    'test given ShowAnswers event then the right method is called': function () {
        const eventName = "ShowAnswers";

        this.presenter.onEventReceived(eventName);

        assertTrue(this.stubs.showAnswers.calledOnce);
    },

    'test given HideAnswers event then the right method is called': function () {
        const eventName = "HideAnswers";

        this.presenter.onEventReceived(eventName);

        assertTrue(this.stubs.hideAnswers.calledOnce);
    },

    'test given GradualShowAnswers event then the right method is called': function () {
        const eventName = "GradualShowAnswers";
        const eventData = {moduleID: this.presenter.addonID};

        this.presenter.onEventReceived(eventName, eventData);

        assertTrue(this.stubs.gradualShowAnswers.calledOnce);
        assertTrue(this.stubs.gradualShowAnswers.calledWith(eventData));
    },

    'test given GradualHideAnswers event then the right method is called': function () {
        const eventName = "GradualHideAnswers";

        this.presenter.onEventReceived(eventName);

        assertTrue(this.stubs.gradualHideAnswers.calledOnce);
    }
});