TestCase("[Text_Selection] setShowErrorsMode tests", {
    setUp: function () {
        this.presenter = AddonText_Selection_create();
        this.presenter.isWorkMode = true;
        this.presenter.turnOffEventListeners = sinon.stub();
        this.presenter.configuration = { isActivity: true, areEventListenersOn: true };
        this.createView();
    },

    createView: function () {
        this.presenter.$view = $('<div><div class="text_selection"></div></div>');
    },

    setDisabledClass: function () {
        this.presenter.$view.find('.text_selection').addClass('text_selection_disabled');
    },

    "test should set isWorkMode to false": function () {
        this.presenter.setShowErrorsMode();

        assertFalse(this.presenter.isWorkMode);
    },

    "test should call turnOffEventListeners": function () {
        this.presenter.setShowErrorsMode();

        assertTrue(this.presenter.turnOffEventListeners.called);
    },

    "test should add text_selection_disabled class": function () {
        this.presenter.setShowErrorsMode();

        assertTrue(this.presenter.$view.find('.text_selection').hasClass("text_selection_disabled"));
    },

    "test should not set isWorkMode to false if addon is not activity": function () {
        this.presenter.configuration.isActivity = false;

        this.presenter.setShowErrorsMode();

        assertTrue(this.presenter.isWorkMode);
    },

    "test should not call turnOffEventListeners if addon is not activity": function () {
        this.presenter.configuration.isActivity = false;

        this.presenter.setShowErrorsMode();

        assertFalse(this.presenter.turnOffEventListeners.called);
    },

    "test should not add text_selection_disabled class if addon is not activity": function () {
        this.presenter.configuration.isActivity = false;

        this.presenter.setShowErrorsMode();

        assertFalse(this.presenter.$view.find('.text_selection').hasClass("text_selection_disabled"));
    },
});
