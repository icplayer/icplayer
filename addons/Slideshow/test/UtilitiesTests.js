UtilitiesTests = TestCase("[Slideshow] Utilities Tests");

UtilitiesTests.prototype.setUp = function() {
    this.presenter = AddonSlideshow_create();
};

UtilitiesTests.prototype.testButtonWithBackground = function() {
    var buttons = [$("<div style='background-image:url(/file/serve/123)'>test</div>")];
    var expectedText = "";
    this.presenter.checkBackgroundImageOfButtonElements(buttons);

    assertEquals("If background is set, then button element should not have text.", expectedText, buttons[0].html());
};

UtilitiesTests.prototype.testButtonWithoutBackground = function() {
    var buttons = [$("<div>test</div>")];
    var expectedText = "test";
    this.presenter.checkBackgroundImageOfButtonElements(buttons);

    assertEquals("If background is NOT set, then button element should have text.", expectedText, buttons[0].html());
};