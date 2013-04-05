SetGetStateTests = TestCase("Setting and Getting States Tests");

SetGetStateTests.prototype.setUp = function() {
    this.presenter = Addonvideo_create();
    this.presenter.isVisibleByDefault = true;
    this.presenter.isCurrentlyVisible = false;
    this.presenter.$view = $("<div></div>");
    this.presenter.video = document.createElement("video");
    this.presenter.currentMovie = 1;
    this.presenter.videoContainer = $('<div></div>');
    this.presenter.videoContainer.append(this.presenter.video);
    this.presenter.files = ['video1.ogg', 'video2.ogg'];
    sinon.stub(this.presenter, 'reload');
    sinon.stub(this.presenter, 'setVisibility');
};

SetGetStateTests.prototype.testGetState = function() {
    // When
    var stateString = this.presenter.getState();

    // Then
    assertEquals('{\"currentTime\":0,\"isCurrentlyVisible\":false,\"isPaused\":true}', stateString);
};

SetGetStateTests.prototype.testSetState = function() {
    // Given
    var stateString = '{\"currentTime\":12,\"isCurrentlyVisible\":true,\"isPaused\":false}';

    // When
    this.presenter.setState(stateString);

    // Then
    assertEquals(true, this.presenter.isCurrentlyVisible);
};

SetGetStateTests.prototype.testSetStateSetVisibilityCalledProperly = function() {
    // Given
    var stateString = '{\"currentTime\":12,\"isCurrentlyVisible\":true,\"isPaused\":false}';

    // When
    this.presenter.setState(stateString);

    // Then
    assertFalse(this.presenter.setVisibility.calledOnce);
};

SetGetStateTests.prototype.testSetStateSetVisibilityCalledProperlyIfViewIsHidden = function() {
    // Given
    this.presenter.$view.css('visibility', 'hidden');
    var stateString = '{\"currentTime\":12,\"isCurrentlyVisible\":true,\"isPaused\":false}';

    // When
    this.presenter.setState(stateString);

    // Then
    assertTrue(this.presenter.setVisibility.calledOnce);
};