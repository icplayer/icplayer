TestCase("YouTube Test", {
    setUp: function () {
        this.presenter = AddonYouTube_Addon_create();
    },

    'test decode video ID': function() {
        var ERROR_MESSAGE = 'Decoded ID should be same as method argument';

        var methodResult = this.presenter.decodeVideoID('', '114331');

        assertBoolean(methodResult.isError === false);
        assertEquals(methodResult.errorMessage, "");
        assertEquals(ERROR_MESSAGE, '114331', methodResult.videoID);
    },

    'test decode video ID from URL': function () {
        var ERROR_MESSAGE = 'Decoded ID should be same as method argument';

        var methodResult = this.presenter.decodeVideoID('http://www.youtube.com/watch?v=XNtTEibFvlQ', '');

        assertBoolean(methodResult.isError === false);
        assertEquals(methodResult.errorMessage, "");
        assertEquals(ERROR_MESSAGE, 'XNtTEibFvlQ', methodResult.videoID);
    },

    'test decode video ID from URL without protocol': function () {
        var ERROR_MESSAGE = 'Decoded ID should be same as method argument';

        var methodResult = this.presenter.decodeVideoID('www.youtube.com/watch?v=XNtTEibFvlQ', '');

        assertBoolean(methodResult.isError === false);
        assertEquals(methodResult.errorMessage, "");
        assertEquals(ERROR_MESSAGE, 'XNtTEibFvlQ', methodResult.videoID);
    },

    'test decode video ID from URL and ID': function () {
        var ERROR_MESSAGE = 'Decoded ID must be given ID';

        var methodResult = this.presenter.decodeVideoID('http://www.youtube.com/watch?v=XNtTEibFvlQ', '114331');

        assertBoolean(methodResult.isError === false);
        assertEquals(methodResult.errorMessage, "");
        assertEquals(ERROR_MESSAGE, '114331', methodResult.videoID);
    },

    'test decode video ID from ID and shortened URL': function () {
        var ERROR_MESSAGE = 'Decoded ID must be given ID';

        var methodResult = this.presenter.decodeVideoID('http://www.youtu.be/XNtTEibFvlQ', '114331');

        assertBoolean(methodResult.isError === false);
        assertEquals(methodResult.errorMessage, "");
        assertEquals(ERROR_MESSAGE, '114331', methodResult.videoID);
    },

    'test empty video ID and URL': function () {
        var ERROR_MESSAGE = "Neither video ID nor URL was given!";

        var methodResult = this.presenter.decodeVideoID('', '');

        assertBoolean(methodResult.isError);
        assertEquals(ERROR_MESSAGE, methodResult.errorMessage);
        assertEquals('-1', methodResult.videoID);
    },

    'test incorrect ID - with special character "%" at the beginning of ID': function () {
        var ERROR_MESSAGE = "Video ID seems to be incorrect!";

        var methodResult = this.presenter.decodeVideoID('', '%114331');

        assertBoolean(methodResult.isError);
        assertEquals(ERROR_MESSAGE, methodResult.errorMessage);
        assertEquals('-1', methodResult.videoID);

        // Test with special character - '$' in the middle of ID
        methodResult = this.presenter.decodeVideoID('', '11$4331');

        assertBoolean(methodResult.isError);
        assertEquals(ERROR_MESSAGE, methodResult.errorMessage);
        assertEquals('-1', methodResult.videoID);

        // Test with special character - '#' at the end of ID
        methodResult = this.presenter.decodeVideoID('', '114331#');

        assertBoolean(methodResult.isError);
        assertEquals(ERROR_MESSAGE, methodResult.errorMessage);
        assertEquals('-1', methodResult.videoID);
    },

    'test incorrect ID - with special character "$" in the middle of ID': function () {
        var ERROR_MESSAGE = "Video ID seems to be incorrect!";

        var methodResult = this.presenter.decodeVideoID('', '11$4331');

        assertBoolean(methodResult.isError);
        assertEquals(ERROR_MESSAGE, methodResult.errorMessage);
        assertEquals('-1', methodResult.videoID);

        // Test with special character - '#' at the end of ID
        methodResult = this.presenter.decodeVideoID('', '114331#');

        assertBoolean(methodResult.isError);
        assertEquals(ERROR_MESSAGE, methodResult.errorMessage);
        assertEquals('-1', methodResult.videoID);
    },

    'test incorrect ID - with special character "#" at the end of ID': function () {
        var ERROR_MESSAGE = "Video ID seems to be incorrect!";

        var methodResult = this.presenter.decodeVideoID('', '114331#');

        assertBoolean(methodResult.isError);
        assertEquals(ERROR_MESSAGE, methodResult.errorMessage);
        assertEquals('-1', methodResult.videoID);
    },

    'test URL without ID and with shortened URL': function () {
        var ERROR_MESSAGE = "URL seems to be incorrect. It must contain video ID!";

        var methodResult = this.presenter.decodeVideoID('youtu.be/', '');

        assertBoolean(methodResult.isError);
        assertEquals(ERROR_MESSAGE, methodResult.errorMessage);
        assertEquals('-1', methodResult.videoID);

        // Test with original URL
        methodResult = this.presenter.decodeVideoID('www.youtube.com/watch?v=', '');

        assertBoolean(methodResult.isError);
        assertEquals(ERROR_MESSAGE, methodResult.errorMessage);
        assertEquals('-1', methodResult.videoID);
    },

    'test URL without ID and with original URL': function () {
        var ERROR_MESSAGE = "URL seems to be incorrect. It must contain video ID!";

        var methodResult = this.presenter.decodeVideoID('www.youtube.com/watch?v=', '');

        assertBoolean(methodResult.isError);
        assertEquals(ERROR_MESSAGE, methodResult.errorMessage);
        assertEquals('-1', methodResult.videoID);
    },

    'test incorrect URL': function () {
        var ERROR_MESSAGE = "URL seems to be incorrect!";

        var methodResult = this.presenter.decodeVideoID('youtube.com/', '');

        assertBoolean(methodResult.isError);
        assertEquals(ERROR_MESSAGE, methodResult.errorMessage);
        assertEquals('-1', methodResult.videoID);
    },

    'test incorrect URL - with "watch" parameter but without value (ID)': function () {
        var ERROR_MESSAGE = "URL seems to be incorrect!";

        var methodResult = this.presenter.decodeVideoID('youtube.com', '');

        assertBoolean(methodResult.isError);
        assertEquals(ERROR_MESSAGE, methodResult.errorMessage);
        assertEquals('-1', methodResult.videoID);
    },

    'test incorrect URL - given URL is not valid YouTube URL': function () {
        var ERROR_MESSAGE = "URL seems to be incorrect!";

        var methodResult = this.presenter.decodeVideoID('lorepo.com', '');

        assertBoolean(methodResult.isError);
        assertEquals(ERROR_MESSAGE, methodResult.errorMessage);
        assertEquals('-1', methodResult.videoID);
    },

    'test incorrect URL - given URL is not valid URL at all': function () {
        var ERROR_MESSAGE = "URL seems to be incorrect!";

        var methodResult = this.presenter.decodeVideoID('I am am not a url', '');

        assertBoolean(methodResult.isError);
        assertEquals(ERROR_MESSAGE, methodResult.errorMessage);
        assertEquals('-1', methodResult.videoID);
    }
});