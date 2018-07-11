TestCase("[Commons - Text Parser] parseAltTexts method", {
    setUp:  function () {
       this.textParser = new TextParserProxy({ parseAltTexts: function(string) {return string+" parsed";} });

    },

    'test if parseAltTexts is called': function () {
        var text = "hello \\alt{visible|readable}";
        var answer = text+" parsed";
        assertEquals(answer, this.textParser.parseAltTexts(text));
    }
});
