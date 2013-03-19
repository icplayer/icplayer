ValidateModel = TestCase("Validate Model Multi Audio");

ValidateModel.prototype.setUp = function() {
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

ValidateModel.prototype.testFilesLength = function() {
	// Given
	var expectedLength = 2;
	var audio = document.createElement("audio");
	
	// When
	this.presenter.loadFiles(audio, this.model);
	var files = this.presenter.files;
	
	// Then
	assertEquals("Files size after calling loadFiles should be 2.", expectedLength, files.length);
};

ValidateModel.prototype.testValidateFilesNegative = function() {
	// Given 
	var files = [{
				"Mp3" : "",
	            "Ogg" : ""
	             }];
	
	// When
	var validated = this.presenter.validateFiles(files);
	
	// Then
	assertFalse("testValidateFiles should be negative.", validated);
};

ValidateModel.prototype.testValidateFilesPositive = function() {
	// Given 
	var files = {
				"Mp3" : "/file/serve/123",
	            "Ogg" : "/file/serve/321"
	             };
	
	// When
	var validated = this.presenter.validateFiles(files);
	
	// Then
	assertTrue("testValidateFiles should be positive.", validated);
};