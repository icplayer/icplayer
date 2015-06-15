TestCase("[Commons - String Utils] startsWith method", {
    'test proper prefix': function () {
        var text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ";
        var prefix = "Lorem";

        assertBoolean(StringUtils.startsWith(text, prefix));
        assertEquals(true, StringUtils.startsWith(text, prefix));
    },
    'test improper prefix': function () {
        var text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ";
        var prefix = "elit.";

        assertBoolean(StringUtils.startsWith(text, prefix));
        assertEquals(false, StringUtils.startsWith(text, prefix));
    },
    'test prefix with regexp': function () {
        var text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ";
        var prefix = ".orem";

        assertBoolean(StringUtils.startsWith(text, prefix));
        assertEquals(false, StringUtils.startsWith(text, prefix));
    },
    'test prefix with many words': function () {
        var text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ";
        var prefix = "Lorem ipsum dolor sit amet, consectetur";

        assertBoolean(StringUtils.startsWith(text, prefix));
        assertEquals(true, StringUtils.startsWith(text, prefix));
    }
});