TestCase("[Text_Selection] setWorkMode tests", {
    setUp: function () {
        this.presenter = AddonText_Selection_create();
        this.presenter.isWorkMode = false;
        this.presenter.turnOnEventListeners = sinon.stub();
        this.presenter.configuration = { isActivity: true, areEventListenersOn: false };
        this.createView();
    },

    createView: function () {
        this.presenter.$view = $('<div><div class="text_selection disabled"></div></div>');
    },

    "test should set isWorkMode to true": function () {
        this.presenter.setWorkMode();

        assertTrue(this.presenter.isWorkMode);
    },

    "test should call turnOnEventListeners": function () {
        this.presenter.setWorkMode();

        assertTrue(this.presenter.turnOnEventListeners.called);
    },

    "test should remove disabled class": function () {
        this.presenter.setWorkMode();

        assertFalse(this.presenter.$view.find('.text_selection').hasClass("disabled"));
    }
});
