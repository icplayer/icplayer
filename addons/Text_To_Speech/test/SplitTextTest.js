TestCase('[Text_To_Speech] Splitting texts that exceed length limit tests', {
    setUp: function () {
        this.presenter = AddonText_To_Speech_create();

        this.model = {
            'ID': 'Text_To_Speech1',
            'configuration': [{
                ID: 'Text1',
                Area: '',
                Title: 'Title text 1'
            }]
        }
    },

    'test given speech text within length limit when called splitLongTexts then return unchanged speech text': function () {
        function getTextVoiceObject (text, lang) { return {text: text, lang: lang}; }
        var textVoices = [];
        textVoices.push(getTextVoiceObject('test hello world',''));
        textVoices.push(getTextVoiceObject('test hello world 2','pl'));
        textVoices = this.presenter.splitLongTexts(textVoices);

        assertEquals(2, textVoices.length);
        assertEquals('test hello world', textVoices[0].text);
        assertEquals('test hello world 2', textVoices[1].text);
        assertEquals('pl', textVoices[1].lang);
    },

    'test given too long speech text with punctuation marks when called splitLongTexts then return speech text split at punctuation marks': function () {
        function getTextVoiceObject (text, lang) { return {text: text, lang: lang}; }
        var textVoices = [];
        var marks = '.,:;!?()/\\';
        var testArray = [];
        for (var i = 0; i < 30; i++) testArray.push('test');
        var testValue = testArray.join(' ');

        for (var i = 0; i < marks.length; i++) {
            textVoices.push(getTextVoiceObject(testValue + marks[i] + testValue,'en'));
        }
        textVoices = this.presenter.splitLongTexts(textVoices);

        assertEquals(marks.length * 2, textVoices.length);
        for (var i = 0; i < marks.length * 2; i++) {
            assertEquals(testValue, textVoices[i].text);
            assertEquals('en', textVoices[i].lang);
        }
    },

    'test given too long speech text without punctuation marks when called splitLongTexts then return speech text split in equal parts without breaking words': function () {
        function getTextVoiceObject (text, lang) { return {text: text, lang: lang}; }
        var textVoices = [];
        var testArray = [];
        for (var i = 0; i < 30; i++) testArray.push('test');
        var baseValue = testArray.join(' ');
        var testValue1 = baseValue + ' alamakota';
        var testValue2 = baseValue + ' koniec';
        textVoices.push(getTextVoiceObject(testValue1 + ' ' + testValue2,'en'));

        textVoices = this.presenter.splitLongTexts(textVoices);

        assertEquals(2, textVoices.length);
        assertEquals(testValue1, textVoices[0].text.trim());
        assertEquals('en', textVoices[0].lang);
        assertEquals(testValue2, textVoices[1].text.trim());
        assertEquals('en', textVoices[1].lang);
    },
});
