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
    this.files = ['video1.ogg', 'video2.ogg'];
    this.presenter.configuration.files = this.files;
    sinon.stub(this.presenter, 'setVisibility');
};

SetGetStateTests.prototype.testGetState = function() {
    // When
    var stateString = this.presenter.getState();

    // Then
    assertEquals('{\"files\":[\"video1.ogg\",\"video2.ogg\"],\"currentTime\":0,\"isCurrentlyVisible\":false,\"isPaused\":true,\"currentMovie\":1,\"areSubtitlesHidden\":false}', stateString);
};

SetGetStateTests.prototype.testSetState = function() {
    // Given
    var stateString = '{\"currentTime\":0,\"isCurrentlyVisible\":true,\"isPaused\":true,\"currentMovie\":0, \"files\":[{\"Ogg video\":\"//www.mauthor.com/file/serve/4963160974426112\",\"MP4 video\":\"//www.mauthor.com/file/serve/4893696589299712\",\"WebM video\":\"//www.mauthor.com/file/serve/6094735673917440\",\"Subtitles\":\"\",\"Poster\":\"//www.mauthor.com/file/serve/6019596496142336\",\"ID\":\"\",\"AlternativeText\":\"\",\"Loop video\":false}]}';

    // When
    this.presenter.setState(stateString);

    // Then
    assertEquals(true, this.presenter.isCurrentlyVisible);
    assertEquals(0, this.presenter.currentMovie);
};

SetGetStateTests.prototype.testSetStateSetVisibilityCalledProperly = function() {
    // Given
    var stateString = '{\"currentTime\":0,\"isCurrentlyVisible\":true,\"isPaused\":true,\"currentMovie\":0, \"files\":[{\"Ogg video\":\"//www.mauthor.com/file/serve/4963160974426112\",\"MP4 video\":\"//www.mauthor.com/file/serve/4893696589299712\",\"WebM video\":\"//www.mauthor.com/file/serve/6094735673917440\",\"Subtitles\":\"\",\"Poster\":\"//www.mauthor.com/file/serve/6019596496142336\",\"ID\":\"\",\"AlternativeText\":\"\",\"Loop video\":false}]}';

    // When
    this.presenter.setState(stateString);

    // Then
    assertFalse(this.presenter.setVisibility.calledOnce);
};

SetGetStateTests.prototype.testSetStateSetVisibilityCalledProperlyIfViewIsHidden = function() {
    // Given
    this.presenter.$view.css('visibility', 'hidden');
    var stateString = '{\"currentTime\":0,\"isCurrentlyVisible\":true,\"isPaused\":true,\"currentMovie\":0, \"files\":[{\"Ogg video\":\"//www.mauthor.com/file/serve/4963160974426112\",\"MP4 video\":\"//www.mauthor.com/file/serve/4893696589299712\",\"WebM video\":\"//www.mauthor.com/file/serve/6094735673917440\",\"Subtitles\":\"\",\"Poster\":\"//www.mauthor.com/file/serve/6019596496142336\",\"ID\":\"\",\"AlternativeText\":\"\",\"Loop video\":false}]}';

    // When
    this.presenter.setState(stateString);

    // Then
    assertTrue(this.presenter.setVisibility.calledOnce);
};

SetGetStateTests.prototype.testSetStateWithoutFileShouldStillWork = function() {
    // Given
    this.presenter.$view.css('visibility', 'hidden');
    var stateString = '{\"currentTime\":0,\"isCurrentlyVisible\":true,\"isPaused\":true,\"currentMovie\":0}';

    // When
    this.presenter.setState(stateString);

    // Then
    assertTrue(this.presenter.setVisibility.calledOnce);
    assertEquals(this.files, this.presenter.configuration.files);
};