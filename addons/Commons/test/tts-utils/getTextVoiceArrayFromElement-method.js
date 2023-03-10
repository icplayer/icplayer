TestCase("[Commons - TTS Utils] getTextVoiceArrayFromElement method", {
    'test html without aria or images': function() {
        var $input = $("<span>hello world</span>");
        var langTag = "";
        var voicesArray = window.TTSUtils.getTextVoiceArrayFromElement($input,langTag);
        assertEquals(voicesArray.length,1);
        assertEquals({text:'hello world',lang:''},voicesArray[0]);
    },

    'test simple html with lang tag': function() {
        var $input = $("<span>hello world</span>");
        var langTag = "de";
        var voicesArray = window.TTSUtils.getTextVoiceArrayFromElement($input,langTag);
        assertEquals(voicesArray.length,1);
        assertEquals({text:'hello world',lang:'de'},voicesArray[0]);
    },

    'test aria hidden handling': function() {
        var $input = $("<span> hello world 1<span aria-hidden='true'> hello world 2</span></span>");
        var langTag = "";
        var voicesArray = window.TTSUtils.getTextVoiceArrayFromElement($input,langTag);
        assertEquals(voicesArray.length,1);
        assertEquals({text:'hello world 1',lang:''},voicesArray[0]);
    },

    'test aria label handling': function() {
        var $input = $("<span> hello world 4<span aria-label='hello world 3'></span></span>");
        var langTag = "";
        var voicesArray = window.TTSUtils.getTextVoiceArrayFromElement($input,langTag);
        assertEquals(voicesArray.length,1);
        assertEquals({text:'hello world 4hello world 3',lang:''},voicesArray[0]);
    },

    'test aria label with lang attribute handling': function() {
        var $input = $("<span> hello world 4<span aria-label='hello world 3' lang='pl'></span></span>");
        var langTag = "de";
        var voicesArray = window.TTSUtils.getTextVoiceArrayFromElement($input,langTag);
        assertEquals(voicesArray.length,1);
        assertEquals({text:'hello world 4\\alt{ |hello world 3}[lang pl]',lang:'de'},voicesArray[0]);
    },

    'test image without alt handling': function() {
        var $input = $("<span> hello <img href='123.jpg'/> world</span>");
        var langTag = "en";
        var voicesArray = window.TTSUtils.getTextVoiceArrayFromElement($input,langTag);
        assertEquals(voicesArray.length,1);
        assertEquals({text:'hello  world',lang:'en'},voicesArray[0]);
    },

    'test image with alt handling': function() {
        var $input = $("<span> hello <img href='123.jpg' alt='image'/> world</span>");
        var langTag = "en";
        var voicesArray = window.TTSUtils.getTextVoiceArrayFromElement($input,langTag);
        assertEquals(voicesArray.length,3);
        assertEquals({text:'hello',lang:'en'},voicesArray[0]);
        assertEquals({text:'image',lang:'en'},voicesArray[1]);
        assertEquals({text:'world',lang:'en'},voicesArray[2]);
    },

    'test parse single line break': function() {
        var $input = $("<font size=\"6\"> test-string <b>test-string2</b> <br></font>");
        var langTag = "de";

        var voicesArray = window.TTSUtils.getTextVoiceArrayFromElement($input, langTag);

        assertEquals(voicesArray.length,1);
        assertEquals({text: "test-string test-string2 .", lang: "de"}, voicesArray[0]);
    },

    'test parse div after br will not add redundant dot': function() {
        var $input = $("<div> test-string <b>test-string2</b> <br></div>");
        var langTag = "de";

        var voicesArray = window.TTSUtils.getTextVoiceArrayFromElement($input, langTag);

        assertEquals(voicesArray.length,1);
        assertEquals({text: "test-string test-string2 .", lang: "de"}, voicesArray[0]);
    },

    'test parse line break with attribute': function() {
        var $input = $("<div> test-string <b>test-string2</b> <br id=\"someID\"></div>");
        var langTag = "de";

        var voicesArray = window.TTSUtils.getTextVoiceArrayFromElement($input, langTag);

        assertEquals(voicesArray.length,1);
        assertEquals({text: "test-string test-string2 .", lang: "de"}, voicesArray[0]);
    },

    'test parse div before br will add dot': function() {
        var $input = $("<div> test-string <b>test-string2</b> </div><br>");
        var langTag = "de";

        var voicesArray = window.TTSUtils.getTextVoiceArrayFromElement($input, langTag);

        assertEquals(voicesArray.length,1);
        assertEquals({
            text: "test-string test-string2 ."
                + window.TTSUtils.statics.nonBreakingSpace
                + window.TTSUtils.statics.nonBreakingSpace
                + ".",
            lang: "de"}, voicesArray[0]);
    },

    'test parse multiple line breaks': function() {
        var $input = $("<div> test-string <b>test-string2</b> <br></div><br>");
        var langTag = "de";

        var voicesArray = window.TTSUtils.getTextVoiceArrayFromElement($input, langTag);

        assertEquals(voicesArray.length,1);
        assertEquals({
            text: "test-string test-string2 ."
                + window.TTSUtils.statics.nonBreakingSpace
                + window.TTSUtils.statics.nonBreakingSpace
                + ".",
            lang: "de"}, voicesArray[0]);
    },

});
