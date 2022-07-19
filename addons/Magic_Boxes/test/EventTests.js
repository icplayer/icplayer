TestCase("[Magic_Boxes] Events tests", {
    setUp: function() {
        this.presenter = AddonMagic_Boxes_create();
        this.presenter.addonID = 'Magic_Boxes1';

        this.stubs = {
            showAnswers: sinon.stub(this.presenter, 'showAnswers'),
            hideAnswers: sinon.stub(this.presenter, 'hideAnswers'),
            gradualShowAnswers: sinon.stub(this.presenter, 'gradualShowAnswers'),
            gradualHideAnswers: sinon.stub(this.presenter, 'gradualHideAnswers')
        }
    },

    tearDown: function () {
        this.presenter.showAnswers.restore();
        this.presenter.hideAnswers.restore();
        this.presenter.gradualHideAnswers.restore();
        this.presenter.gradualShowAnswers.restore();
    },

    'test showAnswers event calls the right method': function () {
        var eventName = "ShowAnswers";

        this.presenter.onEventReceived(eventName);

        assertTrue(this.stubs.showAnswers.calledOnce);
    },

    'test hideAnswers event calls the right method': function () {
        var eventName = "HideAnswers";

        this.presenter.onEventReceived(eventName);

        assertTrue(this.stubs.hideAnswers.calledOnce);
    },

    'test GSA event calls the right method': function () {
        var eventName = "GradualShowAnswers";

        this.presenter.onEventReceived(eventName);

        assertTrue(this.stubs.gradualShowAnswers.calledOnce);
    },

    'test GHA event calls the right method': function () {
        var eventName = "GradualHideAnswers";

        this.presenter.onEventReceived(eventName);

        assertTrue(this.stubs.gradualHideAnswers.calledOnce);
    }

});
