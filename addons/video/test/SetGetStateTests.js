SetGetStateTests = TestCase("[Video] Setting and Getting States Tests");

SetGetStateTests.prototype.setUp = function() {
    this.presenter = Addonvideo_create();
    this.presenter.isVisibleByDefault = true;
    this.presenter.isCurrentlyVisible = false;
    this.presenter.$view = $("<div></div>");
    this.presenter.videoObject = document.createElement("video");
    this.presenter.currentMovie = 1;
    this.presenter.videoContainer = $('<div></div>');
    this.presenter.videoContainer.append(this.presenter.videoObject);
    this.presenter.configuration.files = ['video1.ogg', 'video2.ogg'];
    sinon.stub(this.presenter, 'setVisibility');
};

SetGetStateTests.prototype.testGetState = function() {
    // When
    var stateString = this.presenter.getState();

    // Then
    assertEquals('{\"currentTime\":0,\"isCurrentlyVisible\":false,\"isPaused\":true,\"currentMovie\":1,\"areSubtitlesHidden\":false}', stateString);
};

SetGetStateTests.prototype.testSetState = function() {
    // Given
    var stateString = '{\"currentTime\":0,\"isCurrentlyVisible\":true,\"isPaused\":true,\"currentMovie\":0}';

    // When
    this.presenter.setState(stateString);

    // Then
    assertEquals(true, this.presenter.isCurrentlyVisible);
    assertEquals(0, this.presenter.currentMovie);
};

SetGetStateTests.prototype.testSetStateSetVisibilityCalledProperly = function() {
    // Given
    var stateString = '{\"currentTime\":12,\"isCurrentlyVisible\":true,\"isPaused\":false,\"currentMovie\":0}';

    // When
    this.presenter.setState(stateString);

    // Then
    assertFalse(this.presenter.setVisibility.calledOnce);
};

SetGetStateTests.prototype.testSetStateSetVisibilityCalledProperlyIfViewIsHidden = function() {
    // Given
    this.presenter.$view.css('visibility', 'hidden');
    var stateString = '{\"currentTime\":12,\"isCurrentlyVisible\":true,\"isPaused\":false,\"currentMovie\":0}';

    // When
    this.presenter.setState(stateString);

    // Then
    assertTrue(this.presenter.setVisibility.calledOnce);
};