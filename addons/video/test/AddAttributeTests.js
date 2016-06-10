AddAttributeTests = TestCase("[Video] Add Attribute");

AddAttributeTests.prototype.setUp = function() {
    this.presenter = Addonvideo_create();
};

AddAttributeTests.prototype.testAddPosterAttribute = function() {
	// Given
    this.presenter.videoContainer = $('<div></div>');
	var video = $('<video></video>');
	var src = "/media/image.jpg";
	var expectedVideo = $('<video poster="/media/image.jpg"></video>');
	
	// When
	this.presenter.addAttributePoster(video, src);
	
	// Then
	assertEquals("", expectedVideo.attr('poster'), video.attr('poster'));
};