TestCase("Position sanitization", {
    setUp: function () {
        this.presenter = AddonImage_Viewer_Public_create();
    },

    'test proper format': function () {
        var validationResult = this.presenter.validatePosition("100");

        assertFalse(validationResult.isError);
        assertEquals(100, validationResult.position);
    },

    'test position negative': function () {
        var validationResult = this.presenter.validatePosition("-10");

        assertTrue(validationResult.isError);
    }
});