TestCase("[Text_Selection] HideAnswers tests", {
    setUp: function () {
        this.presenter = AddonText_Selection_create();
        this.presenter.isShowAnswers = true;
        this.presenter.showAnswersForElements = sinon.stub();
        this.presenter.saveAndRemoveSelection = sinon.stub();
        this.presenter.turnOnEventListeners = sinon.stub();
        this.presenter.configuration = { isActivity: true, areEventListenersOn: false };
        this.createView();
    },

    createView: function () {
        this.presenter.$view = $('<div><div class="text_selection disabled"></div></div>');
    },

    "test should set isShowAnswers to false": function () {
        this.presenter.onEventReceived('HideAnswers');

        assertFalse(this.presenter.isShowAnswers);
    },

    "test should call turnOnEventListeners": function () {
        this.presenter.onEventReceived('HideAnswers');

        assertTrue(this.presenter.turnOnEventListeners.called);
    },

    "test should remove disabled class": function () {
        this.presenter.onEventReceived('HideAnswers');

        assertFalse(this.presenter.$view.find('.text_selection').hasClass("disabled"));
    }
});
