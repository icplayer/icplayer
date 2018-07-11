TestCase("[Commons - TTS Utils] getTextVoiceArrayFromElementWithGaps method", {
    setUp: function () {
        this.speechTexts = {
            correct: 'testcorrect',
            wrong: 'testwrong',
            empty: 'testempty',
            dropdown: 'testdropdown',
            gap: 'testgap'
        }
    },
    'test html without aria or images': function() {
        var $input = $("<span>hello world</span>");
        var langTag = "";
        var voicesArray = window.TTSUtils.getTextVoiceArrayFromElementWithGaps($input, langTag, this.speechTexts);
        assertEquals(voicesArray.length,1);
        assertEquals({text:'hello world',lang:''},voicesArray[0]);
    },

    'test simple html with lang tag': function() {
        var $input = $("<span>hello world</span>");
        var langTag = "de";
        var voicesArray = window.TTSUtils.getTextVoiceArrayFromElementWithGaps($input, langTag, this.speechTexts);
        assertEquals(voicesArray.length,1);
        assertEquals({text:'hello world',lang:'de'},voicesArray[0]);
    },

    'test aria hidden handling': function() {
        var $input = $("<span> hello world 1<span aria-hidden='true'> hello world 2</span></span>");
        var langTag = "";
        var voicesArray = window.TTSUtils.getTextVoiceArrayFromElementWithGaps($input, langTag, this.speechTexts);
        assertEquals(voicesArray.length,1);
        assertEquals({text:'hello world 1',lang:''},voicesArray[0]);
    },

    'test aria label handling': function() {
        var $input = $("<span> hello world 4<span aria-label='hello world 3'></span></span>");
        var langTag = "";
        var voicesArray = window.TTSUtils.getTextVoiceArrayFromElementWithGaps($input, langTag, this.speechTexts);
        assertEquals(voicesArray.length,1);
        assertEquals({text:'hello world 4hello world 3',lang:''},voicesArray[0]);
    },

    'test aria label with lang attribute handling': function() {
        var $input = $("<span> hello world 4<span aria-label='hello world 3' lang='pl'></span></span>");
        var langTag = "de";
        var voicesArray = window.TTSUtils.getTextVoiceArrayFromElementWithGaps($input, langTag, this.speechTexts);
        assertEquals(voicesArray.length,1);
        assertEquals({text:'hello world 4\\alt{ |hello world 3}[lang pl]',lang:'de'},voicesArray[0]);
    },

    'test image without alt handling': function() {
        var $input = $("<span> hello <img href='123.jpg'/> world</span>");
        var langTag = "en";
        var voicesArray = window.TTSUtils.getTextVoiceArrayFromElementWithGaps($input, langTag, this.speechTexts);
        assertEquals(voicesArray.length,1);
        assertEquals({text:'hello  world',lang:'en'},voicesArray[0]);
    },
    'test image with alt handling': function() {
        var $input = $("<span> hello <img href='123.jpg' alt='image'/> world</span>");
        var langTag = "en";
        var voicesArray = window.TTSUtils.getTextVoiceArrayFromElementWithGaps($input, langTag, this.speechTexts);
        assertEquals(voicesArray.length,3);
        assertEquals({text:'hello',lang:'en'},voicesArray[0]);
        assertEquals({text:'image',lang:'en'},voicesArray[1]);
        assertEquals({text:'world',lang:'en'},voicesArray[2]);
    },

    'test editable gap': function() {
        var $input = $('<td class="row_1 col_1" colspan="1" rowspan="1" style="width: auto; height: auto;">hello <input type="text" value="" id="Table2-1" class="ic_gap" size="5"> world</td>');
        var langTag = "en";
        var voicesArray = window.TTSUtils.getTextVoiceArrayFromElementWithGaps($input, langTag, this.speechTexts);
        assertEquals(4, voicesArray.length);
        assertEquals({text: "hello", lang: "en"}, voicesArray[0]);
        assertEquals({text: "testgap 1", lang: undefined}, voicesArray[1]);
        assertEquals({text: "testempty", lang: undefined}, voicesArray[2]);
        assertEquals({text: "world", lang: "en"}, voicesArray[3]);
    },

    'test draggable gap': function() {
        var $input = $('<td class="row_1 col_2 keyboard_navigation_active_element" colspan="1" rowspan="1" style="width: auto; height: auto;">hello <span id="Table1-1" class="ui-draggable ui-widget-content draggable-gap ic_gap ui-droppable gapFilled" style="display: inline-block;" size="5" aria-disabled="false">zebra</span> world</td>');
        var langTag = "en";
        var voicesArray = window.TTSUtils.getTextVoiceArrayFromElementWithGaps($input, langTag, this.speechTexts);
        assertEquals(4, voicesArray.length);
        assertEquals({text: "hello", lang: "en"}, voicesArray[0]);
        assertEquals({text: "testgap 1", lang: undefined}, voicesArray[1]);
        assertEquals({text: "zebra", lang: "en"}, voicesArray[2]);
        assertEquals({text: "world", lang: "en"}, voicesArray[3]);
    },

    'test dropdown gap': function() {
        var $input = $('<td class="row_1 col_2 keyboard_navigation_active_element" colspan="1" rowspan="1" style="width: auto; height: auto;">hello <select class="ic_inlineChoice ic_gap" id="Table2-4"><option value="-">---</option><option value="1" aria-label="1">1</option><option value="2" aria-label="2">2</option><option value="3" aria-label="3">3</option></select> world</td>');
        $input.find('select').prop('selectedIndex',1);
        var langTag = "en";
        var voicesArray = window.TTSUtils.getTextVoiceArrayFromElementWithGaps($input, langTag, this.speechTexts);
        assertEquals(4, voicesArray.length);
        assertEquals({text: "hello", lang: "en"}, voicesArray[0]);
        assertEquals({text: "testdropdown 1", lang: undefined}, voicesArray[1]);
        assertEquals({text: "1", lang: "en"}, voicesArray[2]);
        assertEquals({text: "world", lang: "en"}, voicesArray[3]);
    },

    'test empty gap': function() {
        var $input = $('<td class="row_1 col_2 keyboard_navigation_active_element" colspan="1" rowspan="1" style="width: auto; height: auto;">hello <select class="ic_inlineChoice ic_gap" id="Table2-4"><option value="-">---</option><option value="1" aria-label="1">1</option><option value="2" aria-label="2">2</option><option value="3" aria-label="3">3</option></select> world</td>');
        var langTag = "en";
        var voicesArray = window.TTSUtils.getTextVoiceArrayFromElementWithGaps($input, langTag, this.speechTexts);
        assertEquals(4, voicesArray.length);
        assertEquals({text: "hello", lang: "en"}, voicesArray[0]);
        assertEquals({text: "testdropdown 1", lang: undefined}, voicesArray[1]);
        assertEquals({text: "testempty", lang: undefined}, voicesArray[2]);
        assertEquals({text: "world", lang: "en"}, voicesArray[3]);
    },

    'test correct gap': function() {
        var $input = $('<td class="row_1 col_2" colspan="1" rowspan="1" style="width: auto; height: auto;">hello<select class="ic_inlineChoice ic_gap ic_gap-correct" id="Table1-3"><option value="-">---</option><option value="1" aria-label="1">1</option><option value="2" aria-label="2">2</option><option value="3" aria-label="3">3</option></select>world</td>');
        $input.find('select').prop('selectedIndex',1);
        var langTag = "en";
        var voicesArray = window.TTSUtils.getTextVoiceArrayFromElementWithGaps($input, langTag, this.speechTexts);
        assertEquals(5, voicesArray.length);
        assertEquals({text: "hello", lang: "en"}, voicesArray[0]);
        assertEquals({text: "testdropdown 1", lang: undefined}, voicesArray[1]);
        assertEquals({text: "1", lang: "en"}, voicesArray[2]);
        assertEquals({text: "testcorrect", lang: undefined}, voicesArray[3]);
        assertEquals({text: "world", lang: "en"}, voicesArray[4]);
    },

    'test wrong gap': function() {
        var $input = $('<td class="row_1 col_2 keyboard_navigation_active_element" colspan="1" rowspan="1" style="width: auto; height: auto;">hello <select class="ic_inlineChoice ic_gap ic_gap-wrong" id="Table2-4" disabled="disabled"><option value="-">---</option><option value="1" aria-label="1">1</option><option value="2" aria-label="2">2</option><option value="3" aria-label="3">3</option></select> world</td>');
        $input.find('select').prop('selectedIndex',2);

        var langTag = "en";
        var voicesArray = window.TTSUtils.getTextVoiceArrayFromElementWithGaps($input, langTag, this.speechTexts);
        assertEquals(5, voicesArray.length);
        assertEquals({text: "hello", lang: "en"}, voicesArray[0]);
        assertEquals({text: "testdropdown 1", lang: undefined}, voicesArray[1]);
        assertEquals({text: "2", lang: "en"}, voicesArray[2]);
        assertEquals({text: "testwrong", lang: undefined}, voicesArray[3]);
        assertEquals({text: "world", lang: "en"}, voicesArray[4]);
    },

    'test gap index assignment when a cell is provided': function() {
        var $input = $('<td class="row_1 col_1" colspan="1" rowspan="1" style="width: auto; height: auto;"> Month&nbsp;<input type="text" value="" id="Table1-1" class="ic_gap" size="7"> january&nbsp;<select class="ic_inlineChoice ic_gap" id="Table1-2"><option value="-">---</option><option value="1" aria-label="1">1</option><option value="2" aria-label="2">2</option><option value="3" aria-label="3">3</option></select></td>');

        var langTag = "en";
        var voicesArray = window.TTSUtils.getTextVoiceArrayFromElementWithGaps($input, langTag, this.speechTexts);
        assertEquals(6, voicesArray.length);
        assertEquals({text: "Month", lang: "en"}, voicesArray[0]);
        assertEquals({text: "testgap 1", lang: undefined}, voicesArray[1]);
        assertEquals({text: "testempty", lang: undefined}, voicesArray[2]);
        assertEquals({text: "january", lang: "en"}, voicesArray[3]);
        assertEquals({text: "testdropdown 2", lang: undefined}, voicesArray[4]);
        assertEquals({text: "testempty", lang: undefined}, voicesArray[5]);
    }

});