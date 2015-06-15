TestCase("[Commons - String Utils] endsWith method", {
    'test proper suffix': function () {
        var text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ";
        var suffix = ". ";

        assertBoolean(StringUtils.endsWith(text, suffix));
        assertEquals(true, StringUtils.endsWith(text, suffix));
    },
    'test improper suffix': function () {
        var text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ";
        var suffix = "ipsu";

        assertBoolean(StringUtils.endsWith(text, suffix));
        assertEquals(false, StringUtils.endsWith(text, suffix));
    },
    'test suffix with regexp': function () {
        var text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ";
        var suffix = "elit..";

        assertBoolean(StringUtils.endsWith(text, suffix));
        assertEquals(false, StringUtils.endsWith(text, suffix));
    },
    'test suffix with many words': function () {
        var text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ";
        var suffix = "consectetur adipiscing elit. ";

        assertBoolean(StringUtils.endsWith(text, suffix));
        assertEquals(true, StringUtils.endsWith(text, suffix));
    }
});
