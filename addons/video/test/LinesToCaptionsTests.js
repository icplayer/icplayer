TestCase("lines splitting", {
    setUp: function() {
        this.presenter = Addonvideo_create();
    },

    'test empty data': function() {
        var splittedLines = this.presenter.splitLines("");

        assertArray(splittedLines);
        assertEquals(1, splittedLines.length);
    },

    'test single line': function() {
        var splittedLines = this.presenter.splitLines("0|1|2|3|4");

        assertArray(splittedLines);
        assertEquals(1, splittedLines.length);
    },

    'test multiple lines': function() {
        var splittedLines = this.presenter.splitLines("0|1|2|3|4\r0|1|2|3|4\n0|1|2|3|4\r\n0|1|2|3|4");

        assertArray(splittedLines);
        assertEquals(4, splittedLines.length);
    }
});