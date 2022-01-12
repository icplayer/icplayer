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
    },

    'test time start empty returns valid time with value 0': function () {
        var expected = {
            isValid: true,
            value: 0
        };

        var result = this.presenter.decodeTimeStart("");

        assertEquals(expected.isValid, result.isValid);
        assertEquals(expected.value, result.value);
    },

    'test time start whitespace string returns valid time with value 0': function () {
        var expected = {
            isValid: true,
            value: 0
        };

        var result = this.presenter.decodeTimeStart("                     ");

        assertEquals(expected.isValid, result.isValid);
        assertEquals(expected.value, result.value);
    },

    'test time start string text value returns isValid false': function () {
        var expected = {
            isValid: false
        };

        var result = this.presenter.decodeTimeStart("someexample");

        assertEquals(expected.isValid, result.isValid);
    },

    'test time start proper value with whitespace returns valid with correct time': function () {
        var value = 60;
        var expected = {
            isValid: true,
            value: value
        };

        var result = this.presenter.decodeTimeStart(`   ${value}         `);

        assertEquals(expected.isValid, result.isValid);
        assertEquals(expected.value, result.value);
    },

    'test time start proper value returns valid with correct value': function () {
        var expected = {
            isValid: true,
            value: "60"
        };

        var result = this.presenter.decodeTimeStart(expected.value);

        assertEquals(expected.isValid, result.isValid);
        assertEquals(expected.value, result.value);
    },

    'test getUrlParams when autoplay is off and timestart is 0': function () {
        var autoplay = false;
        var timestart = 0;

        var expected = "?enablejsapi=1&start=0&autoplay=0&mute=0";

        var result = this.presenter.getUrlParams(autoplay, timestart);

        assertEquals(expected, result);
    },

    'test getUrlParams when autoplay is on and timestart is 300': function () {
        var autoplay = true;
        var timestart = 300;

        var expected = "?enablejsapi=1&start=300&autoplay=1&mute=1";

        var result = this.presenter.getUrlParams(autoplay, timestart);

        assertEquals(expected, result);
    }
});