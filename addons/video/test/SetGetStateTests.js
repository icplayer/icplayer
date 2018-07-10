SetGetStateTests = TestCase("[Video] Setting and Getting States Tests");

SetGetStateTests.prototype.setUp = function() {
    this.presenter = Addonvideo_create();
    this.presenter.isVisibleByDefault = true;
    this.presenter.isCurrentlyVisible = false;
    this.presenter.$view = $("<div></div>");
    this.presenter.videoObject = document.createElement("video");
    this.presenter.currentMovie = 1;
    this.presenter.currentTime = 1;
    this.presenter.videoContainer = $('<div></div>');
    this.presenter.videoContainer.append(this.presenter.videoObject);
    this.presenter.$captionsContainer = $('<div></div>');
    this.presenter.posterPlayButton = $(document.createElement("div"));
    this.presenter.addedVideoURLS = {

    };
    this.files = ['video1.ogg', 'video2.ogg'];
    this.presenter.configuration.files = this.files;
    sinon.stub(this.presenter, 'setVisibility');
};

SetGetStateTests.prototype.testGetState = function() {
    this.presenter.addedVideoURLS = {
        "0": {
            "url": {
                "subtitles":"0|2|100|200|red|This is a sample text\n2.5|4|10|10|green|Another line of text",
                "oggFormat":"https://www.w3schools.com/html/mov_bbb.mp4",
                "mp4Format":"https://www.w3schools.com/html/mov_bbb.mp4",
                "webMFormat":"https://www.w3schools.com/html/mov_bbb.mp4",
                "poster":"",
                "id":"some id",
                "altText":"ALT :)",
                "loop":true
            },
            "index":0
        }
    };

    // When
    var stateString = this.presenter.getState();

    // Then
    assertEquals('{"files":"deprecated","videoURLS":{"0":{"url":{"subtitles":"0|2|100|200|red|This is a sample text\\n2.5|4|10|10|green|Another line of text","oggFormat":"https://www.w3schools.com/html/mov_bbb.mp4","mp4Format":"https://www.w3schools.com/html/mov_bbb.mp4","webMFormat":"https://www.w3schools.com/html/mov_bbb.mp4","poster":"","id":"some id","altText":"ALT :)","loop":true},"index":0}},"currentTime":0,"isCurrentlyVisible":false,"isPaused":true,"currentMovie":1,"areSubtitlesHidden":false}', stateString);
};

SetGetStateTests.prototype.testSetState = function() {
    var expectedFiles = [{
            "Ogg video":"https://www.w3schools.com/html/mov_bbb.mp4",
            "MP4 video":"https://www.w3schools.com/html/mov_bbb.mp4",
            "WebM video":"https://www.w3schools.com/html/mov_bbb.mp4",
            "Subtitles":"0|2|100|200|red|This is a sample text\n2.5|4|10|10|green|Another line of text",
            "ID":"some id",
            "AlternativeText":"ALT :)",
            "Loop video":true,
            "Poster": undefined
    }];

    this.presenter.configuration.files = [
        {}
    ];
    // Given
    var stateString = '{"files":"deprecated","videoURLS":{"0":{"url":{"subtitles":"0|2|100|200|red|This is a sample text\\n2.5|4|10|10|green|Another line of text","oggFormat":"https://www.w3schools.com/html/mov_bbb.mp4","mp4Format":"https://www.w3schools.com/html/mov_bbb.mp4","webMFormat":"https://www.w3schools.com/html/mov_bbb.mp4","poster":"","id":"some id","altText":"ALT :)","loop":true},"index":0}},"currentTime":0.521326,"isCurrentlyVisible":true,"isPaused":true,"currentMovie":0,"areSubtitlesHidden":false}';

    // When
    this.presenter.setState(stateString);

    // Then
    assertEquals(true, this.presenter.isCurrentlyVisible);
    assertEquals(0, this.presenter.currentMovie);
    assertEquals(expectedFiles,
        this.presenter.configuration.files
    );
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


SetGetStateTests.prototype.testSetStateAndGetStateCurrentTime = function () {
    //Given
    this.presenter.videoObject.currentTime = 1;
    var  time = 4;
    var stateString = '{"files":"deprecated","videoURLS":{},"currentTime":' + time + ',"isCurrentlyVisible":true,"isPaused":false,"currentMovie":1,"areSubtitlesHidden":false}';

     // When
    this.presenter.setState(stateString);
    $(this.presenter.videoObject).trigger('canplay');

    // Then
    assertEquals(this.presenter.videoObject.currentTime, time);
};