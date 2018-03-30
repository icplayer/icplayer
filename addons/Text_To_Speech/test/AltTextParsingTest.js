TestCase("Parsing alternative texts", {
    setUp: function () {
        this.presenter = AddonText_To_Speech_create();

        this.model = {
            "ID": "Text_To_Speech1",
            "configuration": [{
                ID: "Text1",
                Area: "",
                Title: "Title text 1"
            }]
        }
    },

    'test altText without lang tag': function () {
        function getTextVoiceObject (text, lang) { return {text: text, lang: lang}; }
        var textVoices = [];
        textVoices.push(getTextVoiceObject('test \\alt{hello|world} test2',''));
        textVoices.push(getTextVoiceObject('test \\alt{hello|world} test2 \\alt{hello2|world2} test3','pl'));
        textVoices = this.presenter.parseAltTexts(textVoices);
        assertEquals(2, textVoices.length);
        assertEquals("test world test2", textVoices[0].text);
        assertEquals("test world test2 world2 test3", textVoices[1].text);
        assertEquals("pl", textVoices[1].lang);

    },

    'test altText with lang tag': function () {
        function getTextVoiceObject (text, lang) { return {text: text, lang: lang}; }
        var textVoices = [];
        textVoices.push(getTextVoiceObject('test \\alt{hello|world|pl} test2','en'));
        textVoices.push(getTextVoiceObject('\\alt{hello2|world2|de}','en'));
        textVoices.push(getTextVoiceObject('\\alt{hello3|world3|de}\\alt{hello4|world4|pl} test \\alt{hello3|world3|de} test2','en'));
        textVoices = this.presenter.parseAltTexts(textVoices);

        assertEquals(9, textVoices.length);
        assertEquals({text:"test ",lang:'en'}, textVoices[0]);
        assertEquals({text:"world",lang:'pl'}, textVoices[1]);
        assertEquals({text:" test2",lang:'en'}, textVoices[2]);
        assertEquals({text:"world2",lang:'de'}, textVoices[3]);
        assertEquals({text:"world3",lang:'de'}, textVoices[4]);
        assertEquals({text:"world4",lang:'pl'}, textVoices[5]);
        assertEquals({text:" test ",lang:'en'}, textVoices[6]);
        assertEquals({text:"world3",lang:'de'}, textVoices[7]);
        assertEquals({text:" test2",lang:'en'}, textVoices[8]);

    }

});