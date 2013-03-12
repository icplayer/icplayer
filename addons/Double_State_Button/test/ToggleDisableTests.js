ToggleDisableTests = TestCase("Toggle Disable Function Tests");

ToggleDisableTests.prototype.setUp = function() {
    this.presenter = AddonDouble_State_Button_create();

    this.presenter.configuration = {};
    this.presenter.$view = $("<div class='doublestate-button-wrapper'><div class='doublestate-button-element'></div></div>");
};

ToggleDisableTests.prototype.testToggleDisableTrue = function() {
    // Given
    var element = this.presenter.$view.find('div[class*=doublestate-button-element]:first');

    // When
    this.presenter.toggleDisable(true);

    // Then
    assertTrue("", element.hasClass("disable"));
    assertTrue("", this.presenter.configuration.isDisabled);
};

ToggleDisableTests.prototype.testToggleDisableFalse = function() {
    // Given
    var element = this.presenter.$view.find('div[class*=doublestate-button-element]:first');

    // When
    this.presenter.toggleDisable(false);

    // Then
    assertFalse("", element.hasClass("disable"));
    assertFalse("", this.presenter.configuration.isDisabled);
};