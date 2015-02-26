TextsValidationTests = TestCase("[Slideshow] Texts validation");

TextsValidationTests.prototype.testProperConfig = function() {
    var presenter = AddonSlideshow_create();
    var texts = [{
        Text: "Sky",
        Start: "00:00",
        End: "00:20",
        Top: "0",
        Left: "0"
    }, {
        Text: "Mountains",
        Start: "00:00",
        End: "00:20",
        Top: "110",
        Left: "50"
    }, {
        Text: "Sun",
        Start: "00:00",
        End: "00:20",
        Top: "200",
        Left: "30"
    }];

    var validationResult = presenter.validateTexts(texts);
    
    assertFalse(validationResult.isError);
    
    assertEquals(3, validationResult.texts.count);
    
    assertEquals("Sky", validationResult.texts.content[0].text);
    assertEquals(0, validationResult.texts.content[0].start);
    assertEquals(20, validationResult.texts.content[0].end);
    assertEquals(0, validationResult.texts.content[0].top);
    assertEquals(0, validationResult.texts.content[0].left);
    
    assertEquals("Mountains", validationResult.texts.content[1].text);
    assertEquals(0, validationResult.texts.content[1].start);
    assertEquals(20, validationResult.texts.content[1].end);
    assertEquals(110, validationResult.texts.content[1].top);
    assertEquals(50, validationResult.texts.content[1].left);
    
    assertEquals("Sun", validationResult.texts.content[2].text);
    assertEquals(0, validationResult.texts.content[2].start);
    assertEquals(20, validationResult.texts.content[2].end);
    assertEquals(200, validationResult.texts.content[2].top);
    assertEquals(30, validationResult.texts.content[2].left);
};

TextsValidationTests.prototype.testUndefinedText = function() {
    var presenter = AddonSlideshow_create();
    var texts = [{
        Start: "00:00",
        End: "00:20",
        Top: "0",
        Left: "0"
    }];
    
    var validationResult = presenter.validateTexts(texts);
    
    assertTrue(validationResult.isError);
    assertEquals("T_01", validationResult.errorCode);
};

TextsValidationTests.prototype.testEmptyText = function() {
    var presenter = AddonSlideshow_create();
    var texts = [{
        Text: "",
        Start: "00:00",
        End: "00:20",
        Top: "0",
        Left: "0"
    }];

    var validationResult = presenter.validateTexts(texts);
    
    assertTrue(validationResult.isError);
    assertEquals("T_01", validationResult.errorCode);
};

TextsValidationTests.prototype.testInvalidStartTimeFormat = function() {
    var presenter = AddonSlideshow_create();
    var texts = [{
        Text: "Text",
        Start: "00-00",
        End: "00:20",
        Top: "0",
        Left: "0"
    }];
    
    var validationResult = presenter.validateTexts(texts);
    
    assertTrue(validationResult.isError);
    assertEquals("T_02", validationResult.errorCode);
};

TextsValidationTests.prototype.testInvalidEndTimeFormat = function() {
    var presenter = AddonSlideshow_create();
    var texts = [{
        Text: "Text",
        Start: "00:00",
        End: "00-20",
        Top: "0",
        Left: "0"
    }];
    
    var validationResult = presenter.validateTexts(texts);
    
    assertTrue(validationResult.isError);
    assertEquals("T_03", validationResult.errorCode);
};

TextsValidationTests.prototype.testTimesImposed = function() {
    var presenter = AddonSlideshow_create();
    var texts = [{
        Text: "Text",
        Start: "00:20",
        End: "00:10",
        Top: "0",
        Left: "0"
    }];
    
    var validationResult = presenter.validateTexts(texts);
    
    assertTrue(validationResult.isError);
    assertEquals("T_04", validationResult.errorCode);
};

TextsValidationTests.prototype.testTopValueUndefined = function() {
    var presenter = AddonSlideshow_create();
    var texts = [{
        Text: "Text",
        Start: "00:00",
        End: "00:20",
        Left: "0"
    }];
    
    var validationResult = presenter.validateTexts(texts);
    
    assertTrue(validationResult.isError);
    assertEquals("T_05", validationResult.errorCode);
};

TextsValidationTests.prototype.testInvalidTopValue = function() {
    var presenter = AddonSlideshow_create();
    var texts = [{
        Text: "Text",
        Start: "00:00",
        End: "00:20",
        Top: "kaka",
        Left: "0"
    }];
    
    var validationResult = presenter.validateTexts(texts);
    
    assertTrue(validationResult.isError);
    assertEquals("T_05", validationResult.errorCode);
};

TextsValidationTests.prototype.testLeftValueUndefined = function() {
    var presenter = AddonSlideshow_create();
    var texts = [{
        Text: "Text",
        Start: "00:00",
        End: "00:20",
        Top: "0"
    }];
    
    var validationResult = presenter.validateTexts(texts);
    
    assertTrue(validationResult.isError);
    assertEquals("T_06", validationResult.errorCode);
};

TextsValidationTests.prototype.testInvalidLeftValue = function() {
    var presenter = AddonSlideshow_create();
    var texts = [{
        Text: "Text",
        Start: "00:00",
        End: "00:20",
        Top: "0",
        Left: "kaka"
    }];
    
    var validationResult = presenter.validateTexts(texts);
    
    assertTrue(validationResult.isError);
    assertEquals("T_06", validationResult.errorCode);
};
TextsValidationTests.prototype.testEmptyTexts = function() {
    var presenter = AddonSlideshow_create();
    var texts = [{
        Text: "",
        Start: "",
        End: "",
        Top: "",
        Left: ""
    }];
    
    var validationResult = presenter.validateTexts(texts);
    
    assertFalse(validationResult.isError);
    assertEquals(0, validationResult.texts.count);
};

TextsValidationTests.prototype.testEmptySecondTexts = function() {
    var presenter = AddonSlideshow_create();
    var texts = [{
        Text: "Text",
        Start: "00:00",
        End: "00:20",
        Top: "0",
        Left: "0"
    }, {
        Text: "",
        Start: "",
        End: "",
        Top: "",
        Left: ""
    }];
    
    var validationResult = presenter.validateTexts(texts);
    
    assertTrue(validationResult.isError);
    assertEquals("T_07", validationResult.errorCode);
};