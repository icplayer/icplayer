TestCase("[Single State Button] Toggle disable", {
    setUp: function () {
        this.presenter = AddonSingle_State_Button_create();
        this.presenter.$view = $("<div class='singlestate-button-wrapper'><div class='singlestate-button-element'></div></div>");
        this.presenter.configuration = {"isDisabled" : false};
    },

    'test should be disabled': function () {
        var element = this.presenter.$view.find('div[class*=singlestate-button-element]:first');

        this.presenter.toggleDisable(true);

        assertTrue(element.hasClass("disable"));
        assertTrue(this.presenter.configuration.isDisabled);
    },

    'test should not be disabled': function () {
        var element = this.presenter.$view.find('div[class*=singlestate-button-element]:first');

        this.presenter.toggleDisable(false);

        assertFalse(element.hasClass("disable"));
        assertFalse(this.presenter.configuration.isDisabled);
    }
});