DisplayContentDeterminationTests = TestCase("Display content determination");

DisplayContentDeterminationTests.prototype.testNone = function() {
    var presenter = AddonDouble_State_Button_create();
    var text = presenter.validateString();
    var image = presenter.validateString();

    var result = presenter.determineDisplayContent(text, image);

    assertEquals(presenter.DISPLAY_CONTENT_TYPE.NONE, result);
};

DisplayContentDeterminationTests.prototype.testNone = function() {
    var presenter = AddonDouble_State_Button_create();
    var text = presenter.validateString("Some text");
    var image = presenter.validateString();

    var result = presenter.determineDisplayContent(text, image);

    assertEquals(presenter.DISPLAY_CONTENT_TYPE.TEXT, result);
};

DisplayContentDeterminationTests.prototype.testImage = function() {
    var presenter = AddonDouble_State_Button_create();
    var text = presenter.validateString();
    var image = presenter.validateString("/file/serve/123456");

    var result = presenter.determineDisplayContent(text, image);

    assertEquals(presenter.DISPLAY_CONTENT_TYPE.IMAGE, result);
};

DisplayContentDeterminationTests.prototype.testBoth = function() {
    var presenter = AddonDouble_State_Button_create();
    var text = presenter.validateString("Some text");
    var image = presenter.validateString("/file/serve/123456");

    var result = presenter.determineDisplayContent(text, image);

    assertEquals(presenter.DISPLAY_CONTENT_TYPE.BOTH, result);
};