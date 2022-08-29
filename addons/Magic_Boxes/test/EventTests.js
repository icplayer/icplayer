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

    'test given showAnswers event then the right method is called': function () {
        var eventName = "ShowAnswers";

        this.presenter.onEventReceived(eventName);

        assertTrue(this.stubs.showAnswers.calledOnce);
    },

    'test given hideAnswers event then the right method is called': function () {
        var eventName = "HideAnswers";

        this.presenter.onEventReceived(eventName);

        assertTrue(this.stubs.hideAnswers.calledOnce);
    },

    'test given GSA event then the right method is called': function () {
        var eventName = "GradualShowAnswers";

        this.presenter.onEventReceived(eventName);

        assertTrue(this.stubs.gradualShowAnswers.calledOnce);
    },

    'test given GHA event then the right method is called': function () {
        var eventName = "GradualHideAnswers";

        this.presenter.onEventReceived(eventName);

        assertTrue(this.stubs.gradualHideAnswers.calledOnce);
    }

});
