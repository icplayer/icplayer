ToggleDisableTests = TestCase("Toggle Disable Function Tests");

ToggleDisableTests.prototype.setUp = function() {
    this.presenter = AddonSingle_State_Button_create();
    this.presenter.$view = $("<div class='singlestate-button-wrapper'><div class='singlestate-button-element'></div></div>");
    this.presenter.configuration = {"isDisabled" : false};
};

ToggleDisableTests.prototype.testToggleDisableTrue = function() {
    // Given
    var element = this.presenter.$view.find('div[class*=singlestate-button-element]:first');

    // When
    this.presenter.toggleDisable(true);

    // Then
    assertTrue("", element.hasClass("disable"));
    assertTrue("", this.presenter.configuration.isDisabled);
};

ToggleDisableTests.prototype.testToggleDisableFalse = function() {
    // Given
    var element = this.presenter.$view.find('div[class*=singlestate-button-element]:first');

    // When
    this.presenter.toggleDisable(false);

    // Then
    assertFalse("", element.hasClass("disable"));
    assertFalse("", this.presenter.configuration.isDisabled);
};