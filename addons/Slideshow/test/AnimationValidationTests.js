AnimationValidationTests = TestCase("[Slideshow] Animation validation");

AnimationValidationTests.prototype.testUndefined = function() {
    var presenter = AddonSlideshow_create();
    
    var validationResult = presenter.validateAnimation();

    assertFalse(validationResult.slideAnimation);
    assertFalse(validationResult.textAnimation);
};

AnimationValidationTests.prototype.testSlideAnimationFalse = function() {
    var presenter = AddonSlideshow_create();
    
    var validationResult = presenter.validateAnimation('False');

    assertFalse(validationResult.slideAnimation);
    assertFalse(validationResult.textAnimation);
};

AnimationValidationTests.prototype.testSlideAnimationTrue = function() {
    var presenter = AddonSlideshow_create();
    
    var validationResult = presenter.validateAnimation('True');

    assertTrue(validationResult.slideAnimation);
    assertFalse(validationResult.textAnimation);
};

AnimationValidationTests.prototype.testTextAnimationFalse = function() {
    var presenter = AddonSlideshow_create();
    
    var validationResult = presenter.validateAnimation(undefined, 'False');

    assertFalse(validationResult.slideAnimation);
    assertFalse(validationResult.textAnimation);
};

AnimationValidationTests.prototype.testTextAnimationTrue = function() {
    var presenter = AddonSlideshow_create();
    
    var validationResult = presenter.validateAnimation(undefined, 'True');

    assertFalse(validationResult.slideAnimation);
    assertTrue(validationResult.textAnimation);
};