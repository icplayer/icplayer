TestCase("[Double State Button] Toggle disable", {
    setUp: function () {
        this.presenter = AddonDouble_State_Button_create();

        this.presenter.configuration = {};
        this.presenter.$view = $("<div class='doublestate-button-wrapper'><div class='doublestate-button-element'></div></div>");
    },

    'test should disable': function () {
        var element = this.presenter.$view.find('div[class*=doublestate-button-element]:first');

        this.presenter.toggleDisable(true);

        assertTrue(element.hasClass("disable"));
        assertTrue(this.presenter.configuration.isDisabled);
    },

    'test should not be disabled': function () {
        var element = this.presenter.$view.find('div[class*=doublestate-button-element]:first');

        this.presenter.toggleDisable(false);

        assertFalse(element.hasClass("disable"));
        assertFalse(this.presenter.configuration.isDisabled);
    }
});