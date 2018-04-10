TestCase('Parsing alternative texts', {
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

    'test altText without lang tag': function () {
        function getTextVoiceObject (text, lang) { return {text: text, lang: lang}; }
        var textVoices = [];
        textVoices.push(getTextVoiceObject('test \\alt{hello|world} test2',''));
        textVoices.push(getTextVoiceObject('test \\alt{hello|world} test2 \\alt{hello2|world2} test3','pl'));
        textVoices.push(getTextVoiceObject('test \\alt{<b>hello</b>|world3} test4',''));
        textVoices = this.presenter.parseAltTexts(textVoices);
        assertEquals(3, textVoices.length);
        assertEquals('test world test2', textVoices[0].text);
        assertEquals('test world test2 world2 test3', textVoices[1].text);
        assertEquals('pl', textVoices[1].lang);
        assertEquals('test world3 test4', textVoices[2].text);

    },

    'test altText with lang tag': function () {
        function getTextVoiceObject (text, lang) { return {text: text, lang: lang}; }
        var textVoices = [];
        textVoices.push(getTextVoiceObject('test \\alt{hello|world}[lang pl] test2','en'));
        textVoices.push(getTextVoiceObject('\\alt{hello2|world2}[lang de]','en'));
        textVoices.push(getTextVoiceObject('\\alt{hello3|world3}[lang de]\\alt{hello4|world4}[lang pl] test \\alt{hello3|world3}[lang de] test2','en'));
        textVoices.push(getTextVoiceObject('\\alt{hello4|world4}[lang pl] after','en'));
        textVoices.push(getTextVoiceObject('before \\alt{hello5|world5}[lang de]','en'));
        textVoices = this.presenter.parseAltTexts(textVoices);

        assertEquals(13, textVoices.length);
        assertEquals({text:'test ',lang:'en'}, textVoices[0]);
        assertEquals({text:'world',lang:'pl'}, textVoices[1]);
        assertEquals({text:' test2',lang:'en'}, textVoices[2]);
        assertEquals({text:'world2',lang:'de'}, textVoices[3]);
        assertEquals({text:'world3',lang:'de'}, textVoices[4]);
        assertEquals({text:'world4',lang:'pl'}, textVoices[5]);
        assertEquals({text:' test ',lang:'en'}, textVoices[6]);
        assertEquals({text:'world3',lang:'de'}, textVoices[7]);
        assertEquals({text:' test2',lang:'en'}, textVoices[8]);
        assertEquals({text:'world4',lang:'pl'}, textVoices[9]);
        assertEquals({text:' after',lang:'en'}, textVoices[10]);
        assertEquals({text:'before ',lang:'en'}, textVoices[11]);
        assertEquals({text:'world5',lang:'de'}, textVoices[12]);

    },

        'test altText with and without lang tag mixed together': function () {
        function getTextVoiceObject (text, lang) { return {text: text, lang: lang}; }
        var textVoices = [];
        textVoices.push(getTextVoiceObject('\\alt{hello3|world3}[lang de] \\alt{hello|world} test2',''));
        textVoices.push(getTextVoiceObject('\\alt{hello5|world5}[lang de]\\alt{hello2|world2}\\alt{hello4|world4}[lang en]','pl'));
        textVoices = this.presenter.parseAltTexts(textVoices);

        assertEquals(5, textVoices.length);
        assertEquals({text:'world3',lang:'de'}, textVoices[0]);
        assertEquals({text:' world test2',lang:''}, textVoices[1]);
        assertEquals({text:'world5',lang:'de'}, textVoices[2]);
        assertEquals({text:'world2',lang:'pl'}, textVoices[3]);
        assertEquals({text:'world4',lang:'en'}, textVoices[4]);

    }

});