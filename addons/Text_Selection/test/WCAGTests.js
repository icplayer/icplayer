TestCase('[Text Selection] WCAG', {
    setUp : function() {
        this.presenter = AddonText_Selection_create();
        this.presenter.$view = $('<div><div class="text_selection"></div></div>');

        this.firstElement = $('<span number="4" class="selectable">a</span>');
        this.secondElement = $('<span number="5" class="selectable">b</span>');
        this.thirdElement = $('<span number="6" class="selectable">c</span>');

        this.presenter.$view.find('.text_selection')
            .append(this.firstElement)
            .append(this.secondElement)
            .append(this.thirdElement);

        this.presenter.configuration = {
            isActivity: true,
            langTag: 'pl'
        };

        this.presenter.setSpeechTexts();
    },

    'test build controller set correctly values to controller': function () {
        this.presenter.buildKeyboardController();

        assertEquals(3, this.presenter._keyboardController.keyboardNavigationElements.length);
        assertEquals(this.firstElement[0], this.presenter._keyboardController.keyboardNavigationElements[0][0]);
        assertEquals(this.secondElement[0], this.presenter._keyboardController.keyboardNavigationElements[1][0]);
        assertEquals(this.thirdElement[0], this.presenter._keyboardController.keyboardNavigationElements[2][0]);
    },

    'test reading of active element': function() {
        var $element = $('<span class="selectable" number="5">test</span>');
        var $correctElement = $('<span class="selectable selected correct" number="5">test</span>');
        var $wrongElement = $('<span class="selectable selected wrong" number="5">test</span>');
        var $selectedElement = $('<span class="selectable selected" number="5">test</span>');
        var $correctAnswerElement = $('<span class="selectable correct-answer" number="5">test</span>');
        var $altElement = $('<span class="selectable" number="11"><span aria-label="alternative test"><span aria-hidden="true">visible test</span></span></span>');

        var textVoices = this.presenter.getElementTextVoices($element);
        var correctTextVoices = this.presenter.getElementTextVoices($correctElement);
        var wrongTextVoices = this.presenter.getElementTextVoices($wrongElement);
        var selectTextVoices = this.presenter.getElementTextVoices($selectedElement);
        var correctAnswerTextVoices = this.presenter.getElementTextVoices($correctAnswerElement);
        var altTextVoices = this.presenter.getElementTextVoices($altElement);

        assertEquals(1, textVoices.length);
        assertEquals({text:'test', lang: 'pl'},textVoices[0]);

        assertEquals(3, correctTextVoices.length);
        assertEquals({text:'test', lang: 'pl'}, correctTextVoices[0]);
        assertEquals({text: "selected", lang: undefined}, correctTextVoices[1]);
        assertEquals({text: "correct", lang: undefined}, correctTextVoices[2]);

        assertEquals(3, wrongTextVoices.length);
        assertEquals({text:'test', lang: 'pl'}, wrongTextVoices[0]);
        assertEquals({text: "selected", lang: undefined}, wrongTextVoices[1]);
        assertEquals({text: "wrong", lang: undefined}, wrongTextVoices[2]);

        assertEquals(2, selectTextVoices.length);
        assertEquals({text:'test', lang: 'pl'}, selectTextVoices[0]);
        assertEquals({text: "selected", lang: undefined}, selectTextVoices[1]);

        assertEquals(2, correctAnswerTextVoices.length);
        assertEquals({text:'test', lang: 'pl'}, correctAnswerTextVoices[0]);
        assertEquals({text: "selected", lang: undefined}, correctAnswerTextVoices[1]);

        assertEquals(1, altTextVoices.length);
        assertEquals({text:'alternative test', lang: 'pl'}, altTextVoices[0]);

    },

    'test reading of view in all selectable mode': function() {
        var $selectedView = $('<div class="addon_Text_Selection ic_selected_module ic_active_module" id="Text_Selection1" style="width: 425px; height: 79px; position: absolute; left: 115px; top: 94px; visibility: visible;"><div class="text_selection"><div><div><span class="selectable" number="0">This</span><span left="0" right="1"> </span><span class="selectable" number="1">is</span><span left="1" right="2"> </span><span class="selectable" number="2">a</span><span left="2" right="3"> </span><span class="selectable selected" number="3">text</span><span left="3" right="4">. </span><span class="selectable selected" number="4">It</span><span left="4" right="5"> </span><span class="selectable selected" number="5">contains</span><span left="5" right="6"> </span><span aria-label="alternative texts"><span aria-hidden="true"><span class="selectable selected" number="6">alttexts</span></span></span><span left="6" right="7">. </span><span class="selectable" number="7">Some</span><span left="7" right="8"> </span><span class="selectable" number="8">of</span><span left="8" right="9"> </span><span aria-label="them"><span aria-hidden="true"><span class="selectable" number="9">them</span></span></span><span left="9" right="10"> </span><span class="selectable selected" number="10">are</span><span left="10" right="11"> </span><span class="selectable selected" number="11"><span aria-label="possible to select"><span aria-hidden="true"> selectable </span></span></span></div></div></div></div>');
        var $checkAnswersView = $('<div class="addon_Text_Selection ic_selected_module ic_active_module" id="Text_Selection1" style="width: 425px; height: 79px; position: absolute; left: 115px; top: 94px; visibility: visible;"><div class="text_selection"><div><div><span class="selectable keyboard_navigation_active_element" number="0">This</span><span left="0" right="1"> </span><span class="selectable" number="1">is</span><span left="1" right="2"> </span><span class="selectable" number="2">a</span><span left="2" right="3"> </span><span class="selectable selected wrong" number="3">text</span><span left="3" right="4">. </span><span class="selectable selected wrong" number="4">It</span><span left="4" right="5"> </span><span class="selectable selected wrong" number="5">contains</span><span left="5" right="6"> </span><span aria-label="alternative texts"><span aria-hidden="true"><span class="selectable selected wrong" number="6">alttexts</span></span></span><span left="6" right="7">. </span><span class="selectable" number="7">Some</span><span left="7" right="8"> </span><span class="selectable" number="8">of</span><span left="8" right="9"> </span><span aria-label="them"><span aria-hidden="true"><span class="selectable" number="9">them</span></span></span><span left="9" right="10"> </span><span class="selectable selected wrong" number="10">are</span><span left="10" right="11"> </span><span class="selectable selected correct" number="11"><span aria-label="possible to select"><span aria-hidden="true"> selectable </span></span></span></div></div></div></div>');
        var $showAnswersView = $('<div class="addon_Text_Selection ic_selected_module ic_active_module" id="Text_Selection1" style="width: 425px; height: 79px; position: absolute; left: 115px; top: 94px; visibility: visible;"><div class="text_selection"><div><div><span class="selectable keyboard_navigation_active_element" number="0">This</span><span left="0" right="1"> </span><span class="selectable" number="1">is</span><span left="1" right="2"> </span><span class="selectable" number="2">a</span><span left="2" right="3"> </span><span class="selectable" number="3">text</span><span left="3" right="4">. </span><span class="selectable" number="4">It</span><span left="4" right="5"> </span><span class="selectable" number="5">contains</span><span left="5" right="6"> </span><span aria-label="alternative texts"><span aria-hidden="true"><span class="selectable" number="6">alttexts</span></span></span><span left="6" right="7">. </span><span class="selectable" number="7">Some</span><span left="7" right="8"> </span><span class="selectable" number="8">of</span><span left="8" right="9"> </span><span aria-label="them"><span aria-hidden="true"><span class="selectable" number="9">them</span></span></span><span left="9" right="10"> </span><span class="selectable" number="10">are</span><span left="10" right="11"> </span><span class="selectable correct-answer" number="11"><span aria-label="possible to select"><span aria-hidden="true"> selectable </span></span></span></div></div></div></div>');

        var selectedTextVoices = this.presenter.getSectionsTextVoices($selectedView);
        var checkAnswersTextVoices = this.presenter.getSectionsTextVoices($checkAnswersView);
        var showAnswersTextVoices = this.presenter.getSectionsTextVoices($showAnswersView);

        assertEquals(8, selectedTextVoices.length);
        assertEquals({text: "This is a ", lang: "pl"}, selectedTextVoices[0]);
        assertEquals({text: "start of selected section", lang: undefined}, selectedTextVoices[1]);
        assertEquals({text: "text. It contains alternative texts", lang: "pl"}, selectedTextVoices[2]);
        assertEquals({text: "end of selected section", lang: undefined}, selectedTextVoices[3]);
        assertEquals({text: ". Some of them ", lang: "pl"}, selectedTextVoices[4]);
        assertEquals({text: "start of selected section", lang: undefined}, selectedTextVoices[5]);
        assertEquals({text: "are possible to select", lang: "pl"}, selectedTextVoices[6]);
        assertEquals({text: "end of selected section", lang: undefined}, selectedTextVoices[7]);

        assertEquals(14, checkAnswersTextVoices.length);
        assertEquals({text: "This is a ", lang: "pl"}, checkAnswersTextVoices[0]);
        assertEquals({text: "start of selected section", lang: undefined}, checkAnswersTextVoices[1]);
        assertEquals({text: "text. It contains alternative texts", lang: "pl"}, checkAnswersTextVoices[2]);
        assertEquals({text: "end of selected section", lang: undefined}, checkAnswersTextVoices[3]); //wrong
        assertEquals({text: "wrong", lang: undefined}, checkAnswersTextVoices[4]);
        assertEquals({text: ". Some of them ", lang: "pl"}, checkAnswersTextVoices[5]);
        assertEquals({text: "start of selected section", lang: undefined}, checkAnswersTextVoices[6]);
        assertEquals({text: "are", lang: "pl"}, checkAnswersTextVoices[7]);
        assertEquals({text: "end of selected section", lang: undefined}, checkAnswersTextVoices[8]); //wrong
        assertEquals({text: "wrong", lang: undefined}, checkAnswersTextVoices[9]);
        assertEquals({text: "start of selected section", lang: undefined}, checkAnswersTextVoices[10]);
        assertEquals({text: "possible to select", lang: "pl"}, checkAnswersTextVoices[11]);
        assertEquals({text: "end of selected section", lang: undefined}, checkAnswersTextVoices[12]); //correct
        assertEquals({text: "correct", lang: undefined}, checkAnswersTextVoices[13]);

        assertEquals(4, showAnswersTextVoices.length);
        assertEquals({text: "This is a text. It contains alternative texts. Some of them are ", lang: "pl"}, showAnswersTextVoices[0]);
        assertEquals({text: "start of selected section", lang: undefined}, showAnswersTextVoices[1]);
        assertEquals({text: "possible to select", lang: "pl"}, showAnswersTextVoices[2]);
        assertEquals({text: "end of selected section", lang: undefined}, showAnswersTextVoices[3]);

    },

    'test reading of view when in "mark phrases to select" mode': function () {
        var $selectedView = $('<div class="addon_Text_Selection" id="Text_Selection1" style="width: 425px; height: 79px; position: absolute; left: 115px; top: 94px; visibility: visible;"><div class="text_selection"><div><div>This<span left="0" right="1"> </span>is<span left="1" right="2"> </span>a<span left="2" right="3"> </span><span class="selectable selected" number="3">text</span><span left="3" right="4">. </span>It<span left="4" right="5"> </span>contains<span left="5" right="6"> </span><span aria-label="alternative texts"><span aria-hidden="true">alttexts</span></span><span left="6" right="7">. </span>Some<span left="7" right="8"> </span>of<span left="8" right="9"> </span><span aria-label="them"><span aria-hidden="true">them</span></span><span left="9" right="10"> </span>are<span left="10" right="11"> </span><span class="selectable selected" number="11"><span aria-label="possible to select"><span aria-hidden="true"> selectable </span></span></span></div></div></div></div>');
        var $checkAnswersView = $('<div class="addon_Text_Selection ic_selected_module ic_active_module" id="Text_Selection1" style="width: 425px; height: 79px; position: absolute; left: 115px; top: 94px; visibility: visible;"><div class="text_selection"><div><div>This<span left="0" right="1"> </span>is<span left="1" right="2"> </span>a<span left="2" right="3"> </span><span class="selectable selected keyboard_navigation_active_element wrong" number="3">text</span><span left="3" right="4">. </span>It<span left="4" right="5"> </span>contains<span left="5" right="6"> </span><span aria-label="alternative texts"><span aria-hidden="true">alttexts</span></span><span left="6" right="7">. </span>Some<span left="7" right="8"> </span>of<span left="8" right="9"> </span><span aria-label="them"><span aria-hidden="true">them</span></span><span left="9" right="10"> </span>are<span left="10" right="11"> </span><span class="selectable selected correct" number="11"><span aria-label="possible to select"><span aria-hidden="true"> selectable </span></span></span></div></div></div></div>');
        var $showAnswersView = $('<div class="addon_Text_Selection ic_selected_module ic_active_module" id="Text_Selection1" style="width: 425px; height: 79px; position: absolute; left: 115px; top: 94px; visibility: visible;"><div class="text_selection"><div><div>This<span left="0" right="1"> </span>is<span left="1" right="2"> </span>a<span left="2" right="3"> </span><span class="selectable keyboard_navigation_active_element" number="3">text</span><span left="3" right="4">. </span>It<span left="4" right="5"> </span>contains<span left="5" right="6"> </span><span aria-label="alternative texts"><span aria-hidden="true">alttexts</span></span><span left="6" right="7">. </span>Some<span left="7" right="8"> </span>of<span left="8" right="9"> </span><span aria-label="them"><span aria-hidden="true">them</span></span><span left="9" right="10"> </span>are<span left="10" right="11"> </span><span class="selectable correct-answer" number="11"><span aria-label="possible to select"><span aria-hidden="true"> selectable </span></span></span></div></div></div></div>');

        var selectedTextVoices = this.presenter.getWordsTextVoices($selectedView);
        var checkAnswersTextVoices = this.presenter.getWordsTextVoices($checkAnswersView);
        var showAnswersTextVoices = this.presenter.getWordsTextVoices($showAnswersView);

        assertEquals(6, selectedTextVoices.length);
        assertEquals({text: "This is a ", lang: "pl"}, selectedTextVoices[0]);
        assertEquals({text: "text", lang: "pl"}, selectedTextVoices[1]);
        assertEquals({text: "selected", lang: undefined}, selectedTextVoices[2]);
        assertEquals({text: ". It contains alternative texts. Some of them are ", lang: "pl"}, selectedTextVoices[3]);
        assertEquals({text: "possible to select", lang: "pl"}, selectedTextVoices[4]);
        assertEquals({text: "selected", lang: undefined}, selectedTextVoices[5]);

        assertEquals(8, checkAnswersTextVoices.length);
        assertEquals({text: "This is a ", lang: "pl"}, checkAnswersTextVoices[0]);
        assertEquals({text: "text", lang: "pl"}, checkAnswersTextVoices[1]);
        assertEquals({text: "selected", lang: undefined}, checkAnswersTextVoices[2]);
        assertEquals({text: "wrong", lang: undefined}, checkAnswersTextVoices[3]);
        assertEquals({text: ". It contains alternative texts. Some of them are ", lang: "pl"}, checkAnswersTextVoices[4]);
        assertEquals({text: "possible to select", lang: "pl"}, checkAnswersTextVoices[5]);
        assertEquals({text: "selected", lang: undefined}, checkAnswersTextVoices[6]);
        assertEquals({text: "correct", lang: undefined}, checkAnswersTextVoices[7]);

        assertEquals(3, showAnswersTextVoices.length);
        assertEquals({text: "This is a text. It contains alternative texts. Some of them are ", lang: "pl"}, showAnswersTextVoices[0]);
        assertEquals({text: "possible to select", lang: "pl"}, showAnswersTextVoices[1]);
        assertEquals({text: "selected", lang: undefined}, showAnswersTextVoices[2]);
    },

    'test reading of view when in "mark phrases to select" mode and some phrases have more than one word': function () {
        var $selectedView = $('<div class="addon_Text_Selection ic_selected_module ic_active_module" id="Text_Selection1" style="width: 425px; height: 50px; position: absolute; left: 129px; top: 118px; visibility: visible;"><div class="text_selection">The<span left="0" right="1"> </span>Text<span left="1" right="2"> </span>Selection<span left="2" right="3"> </span>addon<span left="3" right="4"> </span>allows<span left="4" right="5"> </span>marking<span left="5" right="6"> </span><span aria-label="or"><span aria-hidden="true">/</span></span><span left="6" right="7"> </span>selecting<span left="7" right="8"> </span>parts<span left="8" right="9"> </span>of<span left="9" right="10"> </span>text<span left="10" right="11"> </span>as<span left="11" right="12"> </span><span class="selectable selected" number="12"><span aria-label="poprawny"><span aria-hidden="true">correct</span></span> </span><span left="12" right="13"> </span>and<span left="13" right="14"> </span><span class="selectable selected" number="14">very wrong</span><span left="14" right="15"> </span>phrases<span left="15" right="16">.</span></div></div>');
        var $checkAnswersView = $('<div class="addon_Text_Selection ic_selected_module ic_active_module" id="Text_Selection1" style="width: 425px; height: 50px; position: absolute; left: 129px; top: 118px; visibility: visible;"><div class="text_selection">The<span left="0" right="1"> </span>Text<span left="1" right="2"> </span>Selection<span left="2" right="3"> </span>addon<span left="3" right="4"> </span>allows<span left="4" right="5"> </span>marking<span left="5" right="6"> </span><span aria-label="or"><span aria-hidden="true">/</span></span><span left="6" right="7"> </span>selecting<span left="7" right="8"> </span>parts<span left="8" right="9"> </span>of<span left="9" right="10"> </span>text<span left="10" right="11"> </span>as<span left="11" right="12"> </span><span class="selectable selected correct" number="12"><span aria-label="poprawny"><span aria-hidden="true">correct</span></span> </span><span left="12" right="13"> </span>and<span left="13" right="14"> </span><span class="selectable selected wrong" number="14">very wrong</span><span left="14" right="15"> </span>phrases<span left="15" right="16">.</span></div></div>');
        var $showAnswersView = $('<div class="addon_Text_Selection ic_selected_module ic_active_module" id="Text_Selection1" style="width: 425px; height: 50px; position: absolute; left: 129px; top: 118px; visibility: visible;"><div class="text_selection">The<span left="0" right="1"> </span>Text<span left="1" right="2"> </span>Selection<span left="2" right="3"> </span>addon<span left="3" right="4"> </span>allows<span left="4" right="5"> </span>marking<span left="5" right="6"> </span><span aria-label="or"><span aria-hidden="true">/</span></span><span left="6" right="7"> </span>selecting<span left="7" right="8"> </span>parts<span left="8" right="9"> </span>of<span left="9" right="10"> </span>text<span left="10" right="11"> </span>as<span left="11" right="12"> </span><span class="selectable correct-answer" number="12"><span aria-label="poprawny"><span aria-hidden="true">correct</span></span> </span><span left="12" right="13"> </span>and<span left="13" right="14"> </span><span class="selectable" number="14">very wrong</span><span left="14" right="15"> </span>phrases<span left="15" right="16">.</span></div></div>');


        var selectedTextVoices = this.presenter.getPhrasesTextVoices($selectedView);
        var checkAnswersTextVoices = this.presenter.getPhrasesTextVoices($checkAnswersView);
        var showAnswersTextVoices = this.presenter.getPhrasesTextVoices($showAnswersView);

        assertEquals(11, selectedTextVoices.length);
        assertEquals({text: "The Text Selection addon allows marking or selecting parts of text as ", lang: "pl"}, selectedTextVoices[0]);
        assertEquals({text: "phrase 1", lang: undefined}, selectedTextVoices[1]);
        assertEquals({text: "poprawny ", lang: "pl"}, selectedTextVoices[2]);
        assertEquals({text: "end of phrase", lang: undefined}, selectedTextVoices[3]);
        assertEquals({text: "selected", lang: undefined}, selectedTextVoices[4]);
        assertEquals({text: " and ", lang: "pl"}, selectedTextVoices[5]);
        assertEquals({text: "phrase 2", lang: undefined}, selectedTextVoices[6]);
        assertEquals({text: "very wrong", lang: "pl"}, selectedTextVoices[7]);
        assertEquals({text: "end of phrase", lang: undefined}, selectedTextVoices[8]);
        assertEquals({text: "selected", lang: undefined}, selectedTextVoices[9]);
        assertEquals({text: " phrases.", lang: "pl"}, selectedTextVoices[10]);

        assertEquals(13, checkAnswersTextVoices.length);
        assertEquals({text: "The Text Selection addon allows marking or selecting parts of text as ", lang: "pl"}, checkAnswersTextVoices[0]);
        assertEquals({text: "phrase 1", lang: undefined}, checkAnswersTextVoices[1]);
        assertEquals({text: "poprawny ", lang: "pl"}, checkAnswersTextVoices[2]);
        assertEquals({text: "end of phrase", lang: undefined}, checkAnswersTextVoices[3]);
        assertEquals({text: "selected", lang: undefined}, checkAnswersTextVoices[4]);
        assertEquals({text: "correct", lang: undefined}, checkAnswersTextVoices[5]);
        assertEquals({text: " and ", lang: "pl"}, checkAnswersTextVoices[6]);
        assertEquals({text: "phrase 2", lang: undefined}, checkAnswersTextVoices[7]);
        assertEquals({text: "very wrong", lang: "pl"}, checkAnswersTextVoices[8]);
        assertEquals({text: "end of phrase", lang: undefined}, checkAnswersTextVoices[9]);
        assertEquals({text: "selected", lang: undefined}, checkAnswersTextVoices[10]);
        assertEquals({text: "wrong", lang: undefined}, checkAnswersTextVoices[11]);
        assertEquals({text: " phrases.", lang: "pl"}, checkAnswersTextVoices[12]);

        assertEquals(10, showAnswersTextVoices.length);
        assertEquals({text: "The Text Selection addon allows marking or selecting parts of text as ", lang: "pl"}, showAnswersTextVoices[0]);
        assertEquals({text: "phrase 1", lang: undefined}, showAnswersTextVoices[1]);
        assertEquals({text: "poprawny ", lang: "pl"}, showAnswersTextVoices[2]);
        assertEquals({text: "end of phrase", lang: undefined}, showAnswersTextVoices[3]);
        assertEquals({text: "selected", lang: undefined}, showAnswersTextVoices[4]);
        assertEquals({text: " and ", lang: "pl"}, showAnswersTextVoices[5]);
        assertEquals({text: "phrase 2", lang: undefined}, showAnswersTextVoices[6]);
        assertEquals({text: "very wrong", lang: "pl"}, showAnswersTextVoices[7]);
        assertEquals({text: "end of phrase", lang: undefined}, showAnswersTextVoices[8]);
        assertEquals({text: " phrases.", lang: "pl"}, showAnswersTextVoices[9]);
    }

});