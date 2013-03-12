UpgradeModelValidation = TestCase("Upgrade model validation");

UpgradeModelValidation.prototype.setUp = function() {
    this.presenter = AddonDouble_State_Button_create();
    this.oldModel = {
        Title: "Some text",
        Image: "/file/server/123456",
        onClick: "Empty script"
    };
};

UpgradeModelValidation.prototype.testUpgradeDisable = function() {
    // Given
    var expectedModel = {
        Title: "Some text",
        Image: "/file/server/123456",
        onClick: "Empty script",
        Disable: "False"
    };

    // When
    var model = this.presenter.upgradeDisable(this.oldModel);

    // Then
    assertEquals("", expectedModel, model);
};