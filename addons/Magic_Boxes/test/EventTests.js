TestCase("[Magic_Boxes] Events tests", {
    setUp: function() {
        this.presenter = AddonMagic_Boxes_create();
        this.presenter.addonID = 'Magic_Boxes1';
        this.presenter.isShowAnswersActive = false;
        this.presenter.isGradualShowAnswersActive = false;

        this.spies = {
            showAnswers: sinon.spy(this.presenter, 'showAnswers'),
            hideAnswers: sinon.spy(this.presenter, 'hideAnswers'),
            gradualShowAnswers: sinon.spy(this.presenter, 'gradualShowAnswers'),
            gradualHideAnswers: sinon.spy(this.presenter, 'gradualHideAnswers')
        }
    },

    'test showAnswers event calls the right method and sets isShowAnswersActive to true': function () {
        var eventName = "ShowAnswers";

        this.presenter.onEventReceived(eventName);

        assertTrue(this.spies.showAnswers.called);
        assertTrue(this.presenter.isShowAnswersActive);
    },

    'test hideAnswers event calls the right method and sets isShowAnswersActive to false': function () {
        var eventName = "HideAnswers";
        this.presenter.isShowAnswersActive = true;

        this.presenter.onEventReceived(eventName);

        assertTrue(this.spies.showAnswers.called);
        assertFalse(this.presenter.isShowAnswersActive);
    },

    'test GSA event calls the right method and changes isGradualShowAnswersActive to true': function () {
        var eventName = "GradualShowAnswers";

        this.presenter.onEventReceived(eventName);

        assertTrue(this.spies.gradualShowAnswers.called);
        assertTrue(this.presenter.isGradualShowAnswersActive);
    },

    'test GHA event calls the right method and changes isGradualShowAnswersActive to false': function () {
        this.presenter.isGradualShowAnswersActive = true;
        var eventName = "GradualHideAnswers";

        this.presenter.onEventReceived(eventName);

        assertTrue(this.spies.gradualHideAnswers.called);
        assertFalse(this.presenter.isGradualShowAnswersActive);
    }

});
