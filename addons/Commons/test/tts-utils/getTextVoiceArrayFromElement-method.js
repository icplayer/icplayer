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

    'test given a sentence with a dot in alt text when processing text then remove space between sentence comma and alt text': function() {
        var $input = $("<li>A text with alt comma. <span aria-label='.'></span></li>");

        var $clone = $input.clone();
        $clone = window.TTSUtils._prepareAltTexts($clone);
        $clone = window.TTSUtils._prepareImages($clone);
        $clone = window.TTSUtils._prepareLists($clone);
        var result = window.TTSUtils._removeSpaceBetweenEndOfLineAndAltDot($clone);

        assertEquals('A text with alt comma.<span aria-label=".">.</span>', result.html());
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
    }


});