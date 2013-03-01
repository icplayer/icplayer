YouTubeTest = TestCase("YouTube Test");

YouTubeTest.prototype.testDecodeVideoID = function() {
    var presenter = AddonYouTube_Development_create();
    var ERROR_MESSAGE = 'Decoded ID should be same as method argument';

    var methodResult = presenter.decodeVideoID('', '114331');

    assertBoolean(methodResult.isError === false);
    assertEquals(methodResult.errorMessage, "");
    assertEquals(ERROR_MESSAGE, '114331', methodResult.videoID);
};

YouTubeTest.prototype.testDecodeVideoIDFromURL = function() {
    var presenter = AddonYouTube_Development_create();
    var ERROR_MESSAGE = 'Decoded ID should be same as method argument';

    var methodResult = presenter.decodeVideoID('http://www.youtube.com/watch?v=XNtTEibFvlQ', '');

    assertBoolean(methodResult.isError === false);
    assertEquals(methodResult.errorMessage, "");
    assertEquals(ERROR_MESSAGE, 'XNtTEibFvlQ', methodResult.videoID);

    // Test the same URL but without protocol given (HTTP)
    methodResult = presenter.decodeVideoID('www.youtube.com/watch?v=XNtTEibFvlQ', '');

    assertBoolean(methodResult.isError === false);
    assertEquals(methodResult.errorMessage, "");
    assertEquals(ERROR_MESSAGE, 'XNtTEibFvlQ', methodResult.videoID);
};

YouTubeTest.prototype.testDecodeVideoIDFromURLAndID = function() {
    var presenter = AddonYouTube_Development_create();
    var ERROR_MESSAGE = 'Decoded ID must be given ID';

    var methodResult = presenter.decodeVideoID('http://www.youtube.com/watch?v=XNtTEibFvlQ', '114331');

    assertBoolean(methodResult.isError === false);
    assertEquals(methodResult.errorMessage, "");
    assertEquals(ERROR_MESSAGE, '114331', methodResult.videoID);

    // Test the same ID but shortened URL
    methodResult = presenter.decodeVideoID('http://www.youtu.be/XNtTEibFvlQ', '114331');

    assertBoolean(methodResult.isError === false);
    assertEquals(methodResult.errorMessage, "");
    assertEquals(ERROR_MESSAGE, '114331', methodResult.videoID);
};

YouTubeTest.prototype.testEmptyVideoIDAndURL = function() {
    var presenter = AddonYouTube_Development_create();
    var ERROR_MESSAGE = "Neither video ID nor URL was given!";

    var methodResult = presenter.decodeVideoID('', '');

    assertBoolean(methodResult.isError);
    assertEquals(ERROR_MESSAGE, methodResult.errorMessage);
    assertEquals('-1', methodResult.videoID);
};

YouTubeTest.prototype.testIncorrectID = function() {
    var presenter = AddonYouTube_Development_create();
    var ERROR_MESSAGE = "Video ID seems to be incorrect!";

    // Test with special character - '%' at the beginning of ID
    var methodResult = presenter.decodeVideoID('', '%114331');

    assertBoolean(methodResult.isError);
    assertEquals(ERROR_MESSAGE, methodResult.errorMessage);
    assertEquals('-1', methodResult.videoID);

    // Test with special character - '$' in the middle of ID
    methodResult = presenter.decodeVideoID('', '11$4331');

    assertBoolean(methodResult.isError);
    assertEquals(ERROR_MESSAGE, methodResult.errorMessage);
    assertEquals('-1', methodResult.videoID);

    // Test with special character - '#' at the end of ID
    methodResult = presenter.decodeVideoID('', '114331#');

    assertBoolean(methodResult.isError);
    assertEquals(ERROR_MESSAGE, methodResult.errorMessage);
    assertEquals('-1', methodResult.videoID);
};

YouTubeTest.prototype.testURLWithoutID = function() {
    var presenter = AddonYouTube_Development_create();
    var ERROR_MESSAGE = "URL seems to be incorrect. It must contain video ID!";

    // Test with shortened URL
    var methodResult = presenter.decodeVideoID('youtu.be/', '');

    assertBoolean(methodResult.isError);
    assertEquals(ERROR_MESSAGE, methodResult.errorMessage);
    assertEquals('-1', methodResult.videoID);

    // Test with original URL
    methodResult = presenter.decodeVideoID('www.youtube.com/watch?v=', '');

    assertBoolean(methodResult.isError);
    assertEquals(ERROR_MESSAGE, methodResult.errorMessage);
    assertEquals('-1', methodResult.videoID);
};

YouTubeTest.prototype.testIncorrectURL = function() {
    var presenter = AddonYouTube_Development_create();
    var ERROR_MESSAGE = "URL seems to be incorrect!";

    var methodResult = presenter.decodeVideoID('youtube.com/', '');

    assertBoolean(methodResult.isError);
    assertEquals(ERROR_MESSAGE, methodResult.errorMessage);
    assertEquals('-1', methodResult.videoID);

    // Added 'watch' parameter but without value (ID)
    methodResult = presenter.decodeVideoID('youtube.com', '');

    assertBoolean(methodResult.isError);
    assertEquals(ERROR_MESSAGE, methodResult.errorMessage);
    assertEquals('-1', methodResult.videoID);

    // Given URL is not valid YouTube URL
    methodResult = presenter.decodeVideoID('lorepo.com', '');

    assertBoolean(methodResult.isError);
    assertEquals(ERROR_MESSAGE, methodResult.errorMessage);
    assertEquals('-1', methodResult.videoID);

    // Given URL is not valid URL at all
    methodResult = presenter.decodeVideoID('I am am not a url', '');

    assertBoolean(methodResult.isError);
    assertEquals(ERROR_MESSAGE, methodResult.errorMessage);
    assertEquals('-1', methodResult.videoID);
};