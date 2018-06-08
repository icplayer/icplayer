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
        var $correctElement = $('<span class="selectable correct" number="5">test</span>');
        var $wrongElement = $('<span class="selectable wrong" number="5">test</span>');
        var $selectedElement = $('<span class="selectable selected" number="5">test</span>');
        var $altElement = $('<span class="selectable" number="11"><span aria-label="alternative test"><span aria-hidden="true">visible test</span></span></span>');

        var textVoices = this.presenter.getElementTextVoice($element);
        var correctTextVoices = this.presenter.getElementTextVoice($correctElement);
        var wrongTextVoices = this.presenter.getElementTextVoice($wrongElement);
        var selectTextVoices = this.presenter.getElementTextVoice($selectedElement);
        var altTextVoices = this.presenter.getElementTextVoice($altElement);

        assertEquals(1, textVoices.length);
        assertEquals({text:'test', lang: 'pl'},textVoices[0]);

        assertEquals(2, correctTextVoices.length);
        assertEquals({text:'test', lang: 'pl'}, correctTextVoices[0]);
        assertEquals({text: "correct", lang: undefined}, correctTextVoices[1]);

        assertEquals(2, wrongTextVoices.length);
        assertEquals({text:'test', lang: 'pl'}, wrongTextVoices[0]);
        assertEquals({text: "wrong", lang: undefined}, wrongTextVoices[1]);

        assertEquals(2, selectTextVoices.length);
        assertEquals({text:'test', lang: 'pl'}, selectTextVoices[0]);
        assertEquals({text: "selected", lang: undefined}, selectTextVoices[1]);

        assertEquals(1, altTextVoices.length);
        assertEquals({text:'alternative test', lang: 'pl'}, altTextVoices[0]);

    },

    'test reading of view in all selectable mode': function() {
        var $selectedView = $('<div class="addon_Text_Selection ic_selected_module ic_active_module" id="Text_Selection1" style="width: 425px; height: 79px; position: absolute; left: 115px; top: 94px; visibility: visible;"><div class="text_selection"><div><div><span class="selectable" number="0">This</span><span left="0" right="1"> </span><span class="selectable" number="1">is</span><span left="1" right="2"> </span><span class="selectable" number="2">a</span><span left="2" right="3"> </span><span class="selectable selected" number="3">text</span><span left="3" right="4">. </span><span class="selectable selected" number="4">It</span><span left="4" right="5"> </span><span class="selectable selected" number="5">contains</span><span left="5" right="6"> </span><span aria-label="alternative texts"><span aria-hidden="true"><span class="selectable selected" number="6">alttexts</span></span></span><span left="6" right="7">. </span><span class="selectable" number="7">Some</span><span left="7" right="8"> </span><span class="selectable" number="8">of</span><span left="8" right="9"> </span><span aria-label="them"><span aria-hidden="true"><span class="selectable" number="9">them</span></span></span><span left="9" right="10"> </span><span class="selectable selected" number="10">are</span><span left="10" right="11"> </span><span class="selectable selected" number="11"><span aria-label="possible to select"><span aria-hidden="true"> selectable </span></span></span></div></div></div></div>');
        var $checkAnswersView = $('<div class="addon_Text_Selection ic_selected_module ic_active_module" id="Text_Selection1" style="width: 425px; height: 79px; position: absolute; left: 115px; top: 94px; visibility: visible;"><div class="text_selection"><div><div><span class="selectable keyboard_navigation_active_element" number="0">This</span><span left="0" right="1"> </span><span class="selectable" number="1">is</span><span left="1" right="2"> </span><span class="selectable" number="2">a</span><span left="2" right="3"> </span><span class="selectable selected wrong" number="3">text</span><span left="3" right="4">. </span><span class="selectable selected wrong" number="4">It</span><span left="4" right="5"> </span><span class="selectable selected wrong" number="5">contains</span><span left="5" right="6"> </span><span aria-label="alternative texts"><span aria-hidden="true"><span class="selectable selected wrong" number="6">alttexts</span></span></span><span left="6" right="7">. </span><span class="selectable" number="7">Some</span><span left="7" right="8"> </span><span class="selectable" number="8">of</span><span left="8" right="9"> </span><span aria-label="them"><span aria-hidden="true"><span class="selectable" number="9">them</span></span></span><span left="9" right="10"> </span><span class="selectable selected wrong" number="10">are</span><span left="10" right="11"> </span><span class="selectable selected correct" number="11"><span aria-label="possible to select"><span aria-hidden="true"> selectable </span></span></span></div></div></div></div>');
        var $showAnswersView = $('<div class="addon_Text_Selection ic_selected_module ic_active_module" id="Text_Selection1" style="width: 425px; height: 79px; position: absolute; left: 115px; top: 94px; visibility: visible;"><div class="text_selection"><div><div><span class="selectable keyboard_navigation_active_element" number="0">This</span><span left="0" right="1"> </span><span class="selectable" number="1">is</span><span left="1" right="2"> </span><span class="selectable" number="2">a</span><span left="2" right="3"> </span><span class="selectable" number="3">text</span><span left="3" right="4">. </span><span class="selectable" number="4">It</span><span left="4" right="5"> </span><span class="selectable" number="5">contains</span><span left="5" right="6"> </span><span aria-label="alternative texts"><span aria-hidden="true"><span class="selectable" number="6">alttexts</span></span></span><span left="6" right="7">. </span><span class="selectable" number="7">Some</span><span left="7" right="8"> </span><span class="selectable" number="8">of</span><span left="8" right="9"> </span><span aria-label="them"><span aria-hidden="true"><span class="selectable" number="9">them</span></span></span><span left="9" right="10"> </span><span class="selectable" number="10">are</span><span left="10" right="11"> </span><span class="selectable correct-answer" number="11"><span aria-label="possible to select"><span aria-hidden="true"> selectable </span></span></span></div></div></div></div>');

        var selectedTextVoices = this.presenter.getPhrasesTextVoices($selectedView);
        var checkAnswersTextVoices = this.presenter.getPhrasesTextVoices($checkAnswersView);
        var showAnswersTextVoices = this.presenter.getPhrasesTextVoices($showAnswersView);

        assertEquals(8, selectedTextVoices.length);
        assertEquals({text: "This is a ", lang: "pl"}, selectedTextVoices[0]);
        assertEquals({text: "start of selected section", lang: undefined}, selectedTextVoices[1]);
        assertEquals({text: "text. It contains alternative texts", lang: "pl"}, selectedTextVoices[2]);
        assertEquals({text: "end of selected section", lang: undefined}, selectedTextVoices[3]);
        assertEquals({text: ". Some of them ", lang: "pl"}, selectedTextVoices[4]);
        assertEquals({text: "start of selected section", lang: undefined}, selectedTextVoices[5]);
        assertEquals({text: "are possible to select", lang: "pl"}, selectedTextVoices[6]);
        assertEquals({text: "end of selected section", lang: undefined}, selectedTextVoices[7]);

        assertEquals(11, checkAnswersTextVoices.length);
        assertEquals({text: "This is a ", lang: "pl"}, checkAnswersTextVoices[0]);
        assertEquals({text: "start of wrong section", lang: undefined} , checkAnswersTextVoices[1]);
        assertEquals({text: "text. It contains alternative texts", lang: "pl"}, checkAnswersTextVoices[2]);
        assertEquals({text: "end of wrong section", lang: undefined}, checkAnswersTextVoices[3]);
        assertEquals({text: ". Some of them ", lang: "pl"}, checkAnswersTextVoices[4]);
        assertEquals({text: "start of wrong section", lang: undefined}, checkAnswersTextVoices[5]);
        assertEquals({text: "are", lang: "pl"}, checkAnswersTextVoices[6]);
        assertEquals({text: "end of wrong section", lang: undefined}, checkAnswersTextVoices[7]);
        assertEquals({text: "start of correct section", lang: undefined}, checkAnswersTextVoices[8]);
        assertEquals({text: "possible to select", lang: "pl"}, checkAnswersTextVoices[9]);
        assertEquals({text: "end of correct section", lang: undefined}, checkAnswersTextVoices[10]);

        assertEquals(4, showAnswersTextVoices.length);
        assertEquals({text: "This is a text. It contains alternative texts. Some of them are ", lang: "pl"}, showAnswersTextVoices[0]);
        assertEquals({text: "start of correct section", lang: undefined}, showAnswersTextVoices[1]);
        assertEquals({text: "possible to select", lang: "pl"}, showAnswersTextVoices[2]);
        assertEquals({text: "end of correct section", lang: undefined}, showAnswersTextVoices[3]);

    },

    'test reading of view when in "mark phrases to select" mode': function () {
        var $selectedView = $('<div class="addon_Text_Selection" id="Text_Selection1" style="width: 425px; height: 79px; position: absolute; left: 115px; top: 94px; visibility: visible;"><div class="text_selection"><div><div>This<span left="0" right="1"> </span>is<span left="1" right="2"> </span>a<span left="2" right="3"> </span><span class="selectable selected" number="3">text</span><span left="3" right="4">. </span>It<span left="4" right="5"> </span>contains<span left="5" right="6"> </span><span aria-label="alternative texts"><span aria-hidden="true">alttexts</span></span><span left="6" right="7">. </span>Some<span left="7" right="8"> </span>of<span left="8" right="9"> </span><span aria-label="them"><span aria-hidden="true">them</span></span><span left="9" right="10"> </span>are<span left="10" right="11"> </span><span class="selectable selected" number="11"><span aria-label="possible to select"><span aria-hidden="true"> selectable </span></span></span></div></div></div></div>');
        var $checkAnswersView = $('<div class="addon_Text_Selection ic_selected_module ic_active_module" id="Text_Selection1" style="width: 425px; height: 79px; position: absolute; left: 115px; top: 94px; visibility: visible;"><div class="text_selection"><div><div>This<span left="0" right="1"> </span>is<span left="1" right="2"> </span>a<span left="2" right="3"> </span><span class="selectable selected keyboard_navigation_active_element wrong" number="3">text</span><span left="3" right="4">. </span>It<span left="4" right="5"> </span>contains<span left="5" right="6"> </span><span aria-label="alternative texts"><span aria-hidden="true">alttexts</span></span><span left="6" right="7">. </span>Some<span left="7" right="8"> </span>of<span left="8" right="9"> </span><span aria-label="them"><span aria-hidden="true">them</span></span><span left="9" right="10"> </span>are<span left="10" right="11"> </span><span class="selectable selected correct" number="11"><span aria-label="possible to select"><span aria-hidden="true"> selectable </span></span></span></div></div></div></div>');
        var $showAnswersView = $('<div class="addon_Text_Selection ic_selected_module ic_active_module" id="Text_Selection1" style="width: 425px; height: 79px; position: absolute; left: 115px; top: 94px; visibility: visible;"><div class="text_selection"><div><div>This<span left="0" right="1"> </span>is<span left="1" right="2"> </span>a<span left="2" right="3"> </span><span class="selectable keyboard_navigation_active_element" number="3">text</span><span left="3" right="4">. </span>It<span left="4" right="5"> </span>contains<span left="5" right="6"> </span><span aria-label="alternative texts"><span aria-hidden="true">alttexts</span></span><span left="6" right="7">. </span>Some<span left="7" right="8"> </span>of<span left="8" right="9"> </span><span aria-label="them"><span aria-hidden="true">them</span></span><span left="9" right="10"> </span>are<span left="10" right="11"> </span><span class="selectable correct-answer" number="11"><span aria-label="possible to select"><span aria-hidden="true"> selectable </span></span></span></div></div></div></div>');

        var selectedTextVoices = this.presenter.getSelectableTextVoices($selectedView);
        var checkAnswersTextVoices = this.presenter.getSelectableTextVoices($checkAnswersView);
        var showAnswersTextVoices = this.presenter.getSelectableTextVoices($showAnswersView);

        assertEquals(6, selectedTextVoices.length);
        assertEquals({text: "This is a ", lang: "pl"}, selectedTextVoices[0]);
        assertEquals({text: "text", lang: "pl"}, selectedTextVoices[1]);
        assertEquals({text: "selected", lang: undefined}, selectedTextVoices[2]);
        assertEquals({text: ". It contains alternative texts. Some of them are ", lang: "pl"}, selectedTextVoices[3]);
        assertEquals({text: "possible to select", lang: "pl"}, selectedTextVoices[4]);
        assertEquals({text: "selected", lang: undefined}, selectedTextVoices[5]);

        assertEquals(6, checkAnswersTextVoices.length);
        assertEquals({text: "This is a ", lang: "pl"}, checkAnswersTextVoices[0]);
        assertEquals({text: "text", lang: "pl"}, checkAnswersTextVoices[1]);
        assertEquals({text: "wrong", lang: undefined}, checkAnswersTextVoices[2]);
        assertEquals({text: ". It contains alternative texts. Some of them are ", lang: "pl"}, checkAnswersTextVoices[3]);
        assertEquals({text: "possible to select", lang: "pl"}, checkAnswersTextVoices[4]);
        assertEquals({text: "correct", lang: undefined}, checkAnswersTextVoices[5]);

        assertEquals(3, showAnswersTextVoices.length);
        assertEquals({text: "This is a text. It contains alternative texts. Some of them are ", lang: "pl"}, showAnswersTextVoices[0]);
        assertEquals({text: "possible to select", lang: "pl"}, showAnswersTextVoices[1]);
        assertEquals({text: "correct", lang: undefined}, showAnswersTextVoices[2]);
    }

});