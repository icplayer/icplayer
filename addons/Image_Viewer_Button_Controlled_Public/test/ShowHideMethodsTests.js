ShowHideMethodsTests = TestCase("Show and Hide Methods Tests");

ShowHideMethodsTests.prototype.setUp = function() {
    this.presenter = AddonImage_Viewer_Button_Controlled_Public_create();
    this.presenter.configuration = {};
    this.presenter.configuration.defaultVisibility = true;
    this.presenter.configuration.currentVisibility = false;
    this.presenter.configuration.currentFrame = 0;
    var hiddenLabel = $("<span style='visibility:hidden' class='image-viewer-label'></span>");
    var visibleLabel = $("<span style='visibility:visible' class='image-viewer-label'></span>");
    this.presenter.configuration.labels = [
        { 'frames' : [1], element : hiddenLabel },
        { 'frames' : [2], element : visibleLabel }
    ];
    this.presenter.$view = $("<div></div>");
    this.presenter.$view.append(visibleLabel);
    this.presenter.$view.append(hiddenLabel);
};

ShowHideMethodsTests.prototype.testShowMethod = function() {
    // Given
    var expectedVisibility = true;

    // When
    this.presenter.show();

    // Then
    assertEquals("", expectedVisibility, this.presenter.configuration.currentVisibility);
    assertTrue("", this.presenter.configuration.defaultVisibility);
    assertEquals("", "visible", $(this.presenter.configuration.labels[0].element).css('visibility'));
};

ShowHideMethodsTests.prototype.testHideMethod = function() {
    // Given
    var expectedVisibility = false;

    // When
    this.presenter.hide();

    // Then
    assertEquals("", expectedVisibility, this.presenter.configuration.currentVisibility);
    assertTrue("defaultVisibility should NOT change !", this.presenter.configuration.defaultVisibility);
    assertEquals("", "hidden", $(this.presenter.configuration.labels[1].element).css('visibility'))
};