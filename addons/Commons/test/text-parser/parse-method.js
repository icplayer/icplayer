TestCase("[Commons - Text Parser] parse method", {
    setUp:  function () {
       this.textParser = new TextParserProxy({ parse: function(string) {return string;} });

    },

    'test hash link': function () {
        var text = "<a id='-cWuW' class='ic_definitionLink' href='#'>massa</a>";
        var answer = "<a id='-cWuW' class='ic_definitionLink' href=\"javascript:void(0)\">massa</a>";

        assertEquals(answer, this.textParser.parse(text));
    },
    'test proper link': function () {
        var text = "<a id='-cWuW' class='ic_definitionLink' href='javascript:void(0)'>massa</a>";
        var answer = "<a id='-cWuW' class='ic_definitionLink' href='javascript:void(0)'>massa</a>";

        assertEquals(answer, this.textParser.parse(text));
    },
    'test link with id': function () {
        var text = "<a id='-cWuW' class='ic_definitionLink' href='#id'>massa</a>";
        var answer = "<a id='-cWuW' class='ic_definitionLink' href='#id'>massa</a>";

        assertEquals(answer, this.textParser.parse(text));
    },
    'test empty link': function () {
        var text = "<a id='-cWuW' class='ic_definitionLink' href=''>massa</a>";
        var answer = "<a id='-cWuW' class='ic_definitionLink' href=''>massa</a>";

        assertEquals(answer, this.textParser.parse(text));
    },
    'test hash link description': function () {
        var text = "<a id='-cWuW' class='ic_definitionLink' href='#id'>'#'</a>";
        var answer = "<a id='-cWuW' class='ic_definitionLink' href='#id'>'#'</a>";

        assertEquals(answer, this.textParser.parse(text));
    }
});
