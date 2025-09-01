TestCase("[Text_Selection] ShowAnswers tests", {
    setUp: function () {
        this.presenter = AddonText_Selection_create();
        this.presenter.isShowAnswers = false;
        this.presenter.showAnswersForElements = sinon.stub();
        this.presenter.saveAndRemoveSelection = sinon.stub();
        this.presenter.turnOffEventListeners = sinon.stub();
        this.presenter.configuration = { isActivity: true, areEventListenersOn: true };
        this.createView();
    },

    createView: function () {
        this.presenter.$view = $('<div><div class="text_selection"></div></div>');
    },

    setDisabledClass: function () {
        this.presenter.$view.find('.text_selection').addClass('disabled');
    },

    "test should set isShowAnswers to true": function () {
        this.presenter.onEventReceived('ShowAnswers');

        assertTrue(this.presenter.isShowAnswers);
    },

    "test should call turnOffEventListeners": function () {
        this.presenter.onEventReceived('ShowAnswers');

        assertTrue(this.presenter.turnOffEventListeners.called);
    },

    "test should add disabled class": function () {
        this.presenter.onEventReceived('ShowAnswers');

        assertTrue(this.presenter.$view.find('.text_selection').hasClass("disabled"));
    },

    "test should not set isShowAnswers to true if addon is not activity": function () {
        this.presenter.configuration.isActivity = false;

        this.presenter.onEventReceived('ShowAnswers');

        assertFalse(this.presenter.isShowAnswers);
    },

    "test should not call turnOffEventListeners if addon is not activity": function () {
        this.presenter.configuration.isActivity = false;

        this.presenter.onEventReceived('ShowAnswers');

        assertFalse(this.presenter.turnOffEventListeners.called);
    },

    "test should not add disabled class if addon is not activity": function () {
        this.presenter.configuration.isActivity = false;

        this.presenter.onEventReceived('ShowAnswers');

        assertFalse(this.presenter.$view.find('.text_selection').hasClass("disabled"));
    },
});
