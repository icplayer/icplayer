ValidateUtilities = TestCase("Validate Utilities Methods MultiAudio");

ValidateUtilities.prototype.setUp = function() {
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
    this.presenter.audioWrapper = $("<div class='wrapper-addon-audio'></div>");
};

ValidateUtilities.prototype.testFormatTime = function() {
    // Given
    var timeInSeconds = 60;
    var expectedResult = "01:00";

    // When
    var result = this.presenter.formatTime(timeInSeconds);

    // Then
    assertEquals("Function formatTime should return a valid string.", expectedResult, result);
};

ValidateUtilities.prototype.testDisplayTimer = function() {
    // Given
    var currentTimeInSeconds = 60;
    var durationTimeInSeconds = 120;
    var expectedCurrentTime = "01:00 / ";
    var expectedDurationTime = "02:00";
    this.presenter.globalView = $("<div><div class='wrapper-addon-audio'></div><span id='currentTime'></span><span id='durationTime'></span></div>");

    // When
    this.presenter.displayTimer(currentTimeInSeconds, durationTimeInSeconds);
    var currentTimeSpan = this.presenter.globalView.find("#currentTime");
    var durationTimeSpan = this.presenter.globalView.find("#durationTime");

    // Then
    assertEquals("", expectedCurrentTime, currentTimeSpan.html());
    assertEquals("", expectedDurationTime, durationTimeSpan.html());
};
