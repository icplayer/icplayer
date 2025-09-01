TestCase("[Text_Selection] GradualHideAnswers tests", {
    setUp: function () {
        this.presenter = AddonText_Selection_create();
        this.presenter.isGradualShowAnswersActive = true;
        this.presenter.restoreSelection = sinon.stub();
        this.presenter.turnOnEventListeners = sinon.stub();
        this.presenter.configuration = { isActivity: true, areEventListenersOn: false };
        this.createView();
    },

    createView: function () {
        this.presenter.$view = $('<div><div class="text_selection disabled"></div></div>');
    },

    "test should set isGradualShowAnswersActive to false": function () {
        this.presenter.onEventReceived('GradualHideAnswers');

        assertFalse(this.presenter.isGradualShowAnswersActive);
    },

    "test should call turnOnEventListeners": function () {
        this.presenter.onEventReceived('GradualHideAnswers');

        assertTrue(this.presenter.turnOnEventListeners.called);
    },

    "test should remove disabled class": function () {
        this.presenter.onEventReceived('GradualHideAnswers');

        assertFalse(this.presenter.$view.find('.text_selection').hasClass("disabled"));
    }
});
