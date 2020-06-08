ValidateState = TestCase("Validate Get And Set State Multi Audio");

ValidateState.prototype.setUp = function() {
    this.presenter = AddonMultiAudio_create();
    this.presenter.globalModel = {
    		"Files" : [{
    		           "ID"  		 : "1",
    		           "Mp3" 		 : "/file/serve/123",
    		           "Ogg" 		 : "/file/serve/321",
    		           "Enable loop" : "True"
    					},
    					{
    		           "ID"  		 : "2",
    		           "Mp3" 		 : "/file/serve/456",
    		           "Ogg" 		 : "/file/serve/654",
    		           "Enable loop" : "False"
    					}
    					],
    		"Interface" : "None"
    };
    this.presenter.globalView = $("<div><div class='wrapper-addon-audio'></div></div>");
    sinon.stub(this.presenter, 'loadFiles');
};

ValidateState.prototype.tearDown = function() {
    this.presenter.loadFiles.restore();
};

ValidateState.prototype.testGetState = function() {
    // Given
    var expectedState = "[visible:true][currentAudio:2][currentTime:0]";
    this.presenter.currentAudio = 2;
    this.presenter.audio = document.createElement("audio");

    // When
    var state = this.presenter.getState();

    // Then
    assertEquals("", expectedState, state);
};

ValidateState.prototype.testConvertStateToString = function() {
    // Given
    var state = {
        'visible' : "false",
        'currentAudio' : "3",
        'currentTime' : "20"
    };
    var expectedStateString = "[visible:false][currentAudio:3][currentTime:20]";

    // When
    var stateString = this.presenter.convertStateToString(state);

    // Then
    assertEquals("", expectedStateString, stateString);
};

ValidateState.prototype.testConvertStringToState = function() {
    // Given
    var stateString = "[visible:false][currentAudio:3][currentTime:20]";
    var expectedState = {
        'visible' : "false",
        'currentAudio' : "3",
        'currentTime' : "20"
    };

    // When
    var state = this.presenter.convertStringToState(stateString);

    // Then
    assertEquals("", expectedState, state);
};

ValidateState.prototype.testSetState = function() {
    // Given
    var stateString = "[visible:false][currentAudio:3][currentTime:20]";

    // When
    this.presenter.setState(stateString);

    // Then
    assertFalse("", this.presenter.visible);
    assertEquals("", 3, this.presenter.currentAudio);
    assertTrue("", $(this.presenter.audio).data('events','canplay') != undefined);
};