ModelValidationTests = TestCase("String validation");

ModelValidationTests.prototype.testStringUndefined = function() {
    var presenter = AddonDouble_State_Button_create();

    var validationResult = presenter.validateString();

    assertTrue(validationResult.isEmpty);
    assertEquals("", validationResult.value);
};

ModelValidationTests.prototype.testStringEmpty = function() {
    var presenter = AddonDouble_State_Button_create();

    var validationResult = presenter.validateString("");

    assertTrue(validationResult.isEmpty);
    assertEquals("", validationResult.value);
};

ModelValidationTests.prototype.testStringDefined = function() {
    var presenter = AddonDouble_State_Button_create();

    var validationResult = presenter.validateString("/file/serve/234566");

    assertFalse(validationResult.isEmpty);
    assertEquals("/file/serve/234566", validationResult.value);
};