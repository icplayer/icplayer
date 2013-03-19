ValidateView = TestCase("Validate View Multi Audio");

ValidateView.prototype.setUp = function() {
    this.presenter = AddonMultiAudio_create();
    this.model = {
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
};

ValidateView.prototype.testPrepareAudio = function() {
	// Given
	var expectedAudioElement = "<audio></audio>";
	
	// When
	var audioWrapper = this.presenter.prepareAudio();
	
	// Then
	assertEquals("Inside the audioWrapper should be audio element.", expectedAudioElement, audioWrapper.html());
};

ValidateView.prototype.testCreateViewDisplayTime = function() {
    // Given
    var expectedWrapperContent = '<span id="currentTime"></span><span id="durationTime"></span>';

    // When
    this.model["Interface"] = "Display time";
    this.presenter.createView(this.presenter.globalView, this.model);
    var audioWrapper = this.presenter.globalView.find(".wrapper-addon-audio").html();

    // Then
    assertEquals("", expectedWrapperContent, audioWrapper)
};

ValidateView.prototype.testCreateViewDefaultControls = function() {
    // Given
    this.presenter.audio = "<audio></audio>";

    // When
    this.model["Interface"] = "Default controls";
    this.presenter.createView(this.presenter.globalView, this.model);

    // Then
    assertTrue("", this.presenter.audio.hasAttribute("controls"));
    assertTrue("", this.presenter.audio.hasAttribute("preload"));
};
