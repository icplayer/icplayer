SlidesValidationTests = TestCase("[Slideshow] Slides validation");

SlidesValidationTests.prototype.testProperConfig = function() {
    var presenter = AddonSlideshow_create();
    var slides = [{
        Image: "/files/serve/slide_01.png",
        Start: "00:00"
    }, {
        Image: "/files/serve/slide_02.png",
        Start: "00:10"
    }];

    var validationResult = presenter.validateSlides(slides);
    
    assertEquals(2, validationResult.slides.count);
    
    assertEquals("/files/serve/slide_01.png", validationResult.slides.content[0].image);
    assertEquals(0, validationResult.slides.content[0].start);
    
    assertEquals("/files/serve/slide_02.png", validationResult.slides.content[1].image);
    assertEquals(10, validationResult.slides.content[1].start);
};

SlidesValidationTests.prototype.testUndefinedImage = function() {
    var presenter = AddonSlideshow_create();
    var slides = [{
        Start: "00:00"
    }];

    var validationResult = presenter.validateSlides(slides);

    assertTrue(validationResult.isError);
    assertEquals("S_01", validationResult.errorCode);
};
    
SlidesValidationTests.prototype.testEmptyImage = function() {
    var presenter = AddonSlideshow_create();
    var slides = [{
        Image: "",
        Start: "00:00"
    }];

    var validationResult = presenter.validateSlides(slides);
    
    assertTrue(validationResult.isError);
    assertEquals("S_01", validationResult.errorCode);
};

SlidesValidationTests.prototype.testInvalidTimeFormat = function() {
    var presenter = AddonSlideshow_create();
    var slides = [{
        Image: "/files/serve/slide.png",
        Start: "00-00"
    }];

    var validationResult = presenter.validateSlides(slides);
    
    assertTrue(validationResult.isError);
    assertEquals("S_02", validationResult.errorCode);
};

SlidesValidationTests.prototype.testStartTimeWrongOrder = function() {
    var presenter = AddonSlideshow_create();
    var slides = [{
        Image: "/files/serve/slide_01.png",
        Start: "00:00"
    }, {
        Image: "/files/serve/slide_02.png",
        Start: "00:20"
    }, {
        Image: "/files/serve/slide_03.png",
        Start: "00:10"
    }];

    var validationResult = presenter.validateSlides(slides);
    
    assertTrue(validationResult.isError);
    assertEquals("S_03", validationResult.errorCode);
};

SlidesValidationTests.prototype.testFirstSlideStartTime = function() {
    var presenter = AddonSlideshow_create();
    var slides = [{
        Image: "/files/serve/slide_01.png",
        Start: "02:00"
    }];

    var validationResult = presenter.validateSlides(slides);
    
    assertFalse(validationResult.isError);
    assertEquals("/files/serve/slide_01.png", validationResult.slides.content[0].image);
    assertEquals(0, validationResult.slides.content[0].start);
};