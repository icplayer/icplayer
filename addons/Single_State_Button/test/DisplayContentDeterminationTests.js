DisplayContentDeterminationTests = TestCase("Display content determination");

DisplayContentDeterminationTests.prototype.testBoth = function() {
    var presenter = AddonSingle_State_Button_create();
    var text = {
        isEmpty: false,
        value: "Some value"
    };
    var image = {
        isEmpty: false,
        value: "Some value"
    };

    var determinationResult = presenter.determineDisplayContent(text, image);

    assertEquals(presenter.DISPLAY_CONTENT_TYPE.BOTH, determinationResult);
};

DisplayContentDeterminationTests.prototype.testNone = function() {
    var presenter = AddonSingle_State_Button_create();
    var text = {
        isEmpty: true,
        value: ""
    };
    var image = {
        isEmpty: true,
        value: ""
    };

    var determinationResult = presenter.determineDisplayContent(text, image);

    assertEquals(presenter.DISPLAY_CONTENT_TYPE.NONE, determinationResult);
};

DisplayContentDeterminationTests.prototype.testTitle = function() {
    var presenter = AddonSingle_State_Button_create();
    var text = {
        isEmpty: false,
        value: "Some value"
    };
    var image = {
        isEmpty: true,
        value: ""
    };

    var determinationResult = presenter.determineDisplayContent(text, image);

    assertEquals(presenter.DISPLAY_CONTENT_TYPE.TITLE, determinationResult);
};

DisplayContentDeterminationTests.prototype.testImage = function() {
    var presenter = AddonSingle_State_Button_create();
    var text = {
        isEmpty: true,
        value: ""
    };
    var image = {
        isEmpty: false,
        value: "Some value"
    };

    var determinationResult = presenter.determineDisplayContent(text, image);

    assertEquals(presenter.DISPLAY_CONTENT_TYPE.IMAGE, determinationResult);
};