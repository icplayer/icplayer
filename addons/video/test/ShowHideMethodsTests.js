ShowHideMethodsTests = TestCase("[Video] Show and Hide Methods Tests");

ShowHideMethodsTests.prototype.setUp = function() {
    this.presenter = Addonvideo_create();
    this.presenter.isVisibleByDefault = true;
    this.presenter.isCurrentlyVisible = false;
    this.presenter.$view = $("<div></div>");
    this.presenter.video = document.createElement("video");
};

ShowHideMethodsTests.prototype.testShowMethod = function() {
    // Given
    var expectedVisibility = true;

    // When
    this.presenter.show();

    // Then
    assertEquals(expectedVisibility, this.presenter.isCurrentlyVisible);
    assertTrue(this.presenter.isVisibleByDefault);
};

ShowHideMethodsTests.prototype.testHideMethod = function() {
    // Given
    var expectedVisibility = false;

    // When
    this.presenter.hide();

    // Then
    assertEquals(expectedVisibility, this.presenter.isCurrentlyVisible);
    assertTrue("isVisibleByDefault should NOT change!", this.presenter.isVisibleByDefault);
};