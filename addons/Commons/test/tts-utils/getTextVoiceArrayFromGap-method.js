TestCase("[Commons - TTS Utils] getTextVoiceArrayGaps method", {
    setUp: function () {
        this.speechTexts = {
            correct: 'testcorrect',
            wrong: 'testwrong',
            empty: 'testempty',
            dropdown: 'testdropdown',
            gap: 'testgap'
        }
    },

    'test reading of editable gap': function() {
        var $cell = $('<td class="row_1 col_1" colspan="1" rowspan="1" style="width: auto; height: auto;"> Month&nbsp;<input type="text" value="" id="Table1-1" class="ic_gap" size="7"> january&nbsp;<select class="ic_inlineChoice ic_gap" id="Table1-2"><option value="-">---</option><option value="1" aria-label="1">1</option><option value="2" aria-label="2">2</option><option value="3" aria-label="3">3</option></select></td>');
        var $gap = $cell.find('input');
        $gap.val("hello");
        var langTag = "en";
        var voicesArray = window.TTSUtils.getTextVoiceArrayFromGap($gap, $cell, langTag, this.speechTexts);
        assertEquals(2, voicesArray.length);
        assertEquals({text: "testgap 1", lang: undefined}, voicesArray[0]);
        assertEquals({text: "hello", lang: "en"}, voicesArray[1]);
    },

    'test reading of draggable gap': function() {
        var $cell = $('<td class="row_1 col_1 keyboard_navigation_active_element" colspan="1" rowspan="1" style="width: auto; height: auto;"> Month&nbsp;<span id="Table2-1" class="ui-draggable ui-widget-content draggable-gap ic_gap ui-droppable gapFilled keyboard_navigation_active_element" style="display: inline-block;" size="7" aria-disabled="false">duck</span> january&nbsp;<select class="ic_inlineChoice ic_gap" id="Table2-2"><option value="-">---</option><option value="1" aria-label="1">1</option><option value="2" aria-label="2">2</option><option value="3" aria-label="3">3</option></select></td>');
        var $gap = $cell.find('span.ic_gap');

        var langTag = "en";
        var voicesArray = window.TTSUtils.getTextVoiceArrayFromGap($gap, $cell, langTag, this.speechTexts);
        assertEquals(2, voicesArray.length);
        assertEquals({text: "testgap 1", lang: undefined}, voicesArray[0]);
        assertEquals({text: "duck", lang: "en"}, voicesArray[1]);
    },

    'test reading of dropdown gap': function() {
        var $cell = $('<td class="row_1 col_2" colspan="1" rowspan="1" style="width: auto; height: auto;">hello<select class="ic_inlineChoice ic_gap" id="Table1-3"><option value="-">---</option><option value="1" aria-label="1">1</option><option value="2" aria-label="2">2</option><option value="3" aria-label="3">3</option></select>world</td>');
        var $gap = $cell.find('select');
        $gap.prop('selectedIndex',2);

        var langTag = "en";
        var voicesArray = window.TTSUtils.getTextVoiceArrayFromGap($gap, $cell, langTag, this.speechTexts);
        assertEquals(2, voicesArray.length);
        assertEquals({text: "testdropdown 1", lang: undefined}, voicesArray[0]);
        assertEquals({text: "2", lang: "en"}, voicesArray[1]);
    },

    'test assigning of the index': function() {
        var $cell = $('<td class="row_1 col_1" colspan="1" rowspan="1" style="width: auto; height: auto;"> Month&nbsp;<input type="text" value="" id="Table1-1" class="ic_gap" size="7"> january&nbsp;<select class="ic_inlineChoice ic_gap" id="Table1-2"><option value="-">---</option><option value="1" aria-label="1">1</option><option value="2" aria-label="2">2</option><option value="3" aria-label="3">3</option></select></td>');
        var $gap = $cell.find('select');
        $gap.prop('selectedIndex',2);

        var langTag = "en";
        var voicesArray = window.TTSUtils.getTextVoiceArrayFromGap($gap, $cell, langTag, this.speechTexts);
        assertEquals(2, voicesArray.length);
        assertEquals({text: "testdropdown 2", lang: undefined}, voicesArray[0]);
        assertEquals({text: "2", lang: "en"}, voicesArray[1]);
    }


});