TestCase("[Commons - Image Viewer] Frames list validation", {
    'test list undefined': function () {
        var conversionResult = ImageViewer.convertFramesList(undefined, undefined, undefined);

        assertTrue(conversionResult.isError);
        assertEquals("FL01", conversionResult.errorCode);
    },

    'test list empty': function () {
        var validationResult = ImageViewer.convertFramesList("", undefined, undefined);

        assertTrue(validationResult.isError);
        assertEquals("FL01", validationResult.errorCode);
    },

    'test single frame': function () {
        var validationResult = ImageViewer.convertFramesList("1", 1, 3);

        assertFalse(validationResult.isError);
        assertArray(validationResult.list);
        assertEquals([1], validationResult.list);
    },

    'test multiple frames': function () {
        var validationResult = ImageViewer.convertFramesList("1,2,3", 1, 3);

        assertFalse(validationResult.isError);
        assertArray(validationResult.list);
        assertEquals([1, 2, 3], validationResult.list);
    },

    'test separator error': function () {
        var validationResult = ImageViewer.convertFramesList("1;2;3", 1, 3);

        assertTrue(validationResult.isError);
        assertEquals("FL02", validationResult.errorCode);
    },

    'test frame number is NaN': function () {
        var validationResult = ImageViewer.convertFramesList("1,a,3", 1, 3);

        assertTrue(validationResult.isError);
        assertEquals("FL03", validationResult.errorCode);
    },

    'test frame number lower than minimum': function () {
        var validationResult = ImageViewer.convertFramesList("1", 2, 3);

        assertTrue(validationResult.isError);
        assertEquals("FL03", validationResult.errorCode);
    },

    'test frame number higher than frames count': function () {
        var validationResult = ImageViewer.convertFramesList("5", 1, 3);

        assertTrue(validationResult.isError);
        assertEquals("FL03", validationResult.errorCode);
    },

    'test missing frame number': function () {
        var validationResult = ImageViewer.convertFramesList("1,,3", 1, 3);

        assertTrue(validationResult.isError);
        assertEquals("FL04", validationResult.errorCode);
    },

    'test multiple frame numbers range': function () {
        var validationResult = ImageViewer.convertFramesList("1-3,2-5", 1, 6);

        assertFalse(validationResult.isError);
        assertArray(validationResult.list);
        assertEquals([1, 2, 3, 4, 5], validationResult.list);
    },

    'test frame number range reversed': function () {
        var validationResult = ImageViewer.convertFramesList("3-1,5", 1, 6);

        assertTrue(validationResult.isError);
        assertEquals("FL05", validationResult.errorCode);
    },

    'test multiple occurrences of frame numbers': function () {
        var validationResult = ImageViewer.convertFramesList("1,3,4,3", 1, 6);

        assertFalse(validationResult.isError);
        assertArray(validationResult.list);
        assertEquals([1, 3, 4], validationResult.list);
    },

    'test list of frames starts with a zero': function () {
        var validationResult = ImageViewer.convertFramesList("0-6,8", 0, 9);

        assertFalse(validationResult.isError);
        assertArray(validationResult.list);
        assertEquals([0, 1, 2, 3, 4, 5, 6, 8], validationResult.list);
    }
});