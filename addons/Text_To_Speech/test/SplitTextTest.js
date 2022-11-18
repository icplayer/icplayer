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

    getTextVoiceObject: function (text, lang) {
        return {text: text, lang: lang};
    },

    validateTextVoicesTexts: function (expectedTexts, textVoices) {
        for (let i = 0; i < expectedTexts.length; i++) {
            assertEquals(expectedTexts[i], textVoices[i].text.trim());
        }
    },

    'test given speech text within length limit when called splitLongTexts then return unchanged speech text': function () {
        let textVoices = [];
        textVoices.push(this.getTextVoiceObject('test hello world',''));
        textVoices.push(this.getTextVoiceObject('test hello world 2','pl'));

        textVoices = this.presenter.splitLongTexts(textVoices);

        assertEquals(2, textVoices.length);
        assertEquals('test hello world', textVoices[0].text);
        assertEquals('test hello world 2', textVoices[1].text);
        assertEquals('pl', textVoices[1].lang);
    },

    'test given too long speech text with punctuation marks when called splitLongTexts then return speech text split at punctuation marks': function () {
        const marks = '.,:;!?()/\\';
        const testValue = 'test '.repeat(29) + 'test';
        let textVoices = [];
        for (let i = 0; i < marks.length; i++) {
            textVoices.push(this.getTextVoiceObject(testValue + marks[i] + testValue,'en'));
        }

        textVoices = this.presenter.splitLongTexts(textVoices);

        assertEquals(marks.length * 2, textVoices.length);
        for (var i = 0; i < marks.length * 2; i++) {
            assertEquals(testValue, textVoices[i].text);
            assertEquals('en', textVoices[i].lang);
        }
    },

    'test given too long speech text without punctuation marks when called splitLongTexts then return speech text split in equal parts without breaking words': function () {
        const baseValue = 'test '.repeat(30);
        let testValue1 = baseValue + 'alamakota';
        let testValue2 = baseValue + 'koniec';
        let textVoices = [this.getTextVoiceObject(testValue1 + ' ' + testValue2,'en')];

        textVoices = this.presenter.splitLongTexts(textVoices);

        assertEquals(2, textVoices.length);
        assertEquals(testValue1, textVoices[0].text.trim());
        assertEquals('en', textVoices[0].lang);
        assertEquals(testValue2, textVoices[1].text.trim());
        assertEquals('en', textVoices[1].lang);
    },

    'test given to long text with "a.m." and "p.m." syntax then do not split by dots used in syntax': function () {
        this.presenter.maxUtteranceLength = 100;
        const text = "On my favourite day I get up \n" +
            "at 7 a.m. and listen to music. \n" +
            "I meet my friends and we \n" +
            "walk to school. We often talk about our plans for the weekend. Lessons ends at 9 p.m., with Music, " +
            "then Art – my favourite subjects!";
        let textVoices = [this.getTextVoiceObject(text, '')];

        textVoices = this.presenter.splitLongTexts(textVoices);

        const expectedTexts = [
            "On my favourite day I get up \nat 7 a.m. and listen to music",
            "I meet my friends and we \nwalk to school",
            "We often talk about our plans for the weekend",
            "Lessons ends at 9 p.m., with Music, then Art – my favourite subjects",
        ]
        assertEquals(expectedTexts.length, textVoices.length);
        this.validateTextVoicesTexts(expectedTexts, textVoices);
    },

    'test given to long text with hh:mm hour syntax then do not split by dots used in syntax': function () {
        this.presenter.maxUtteranceLength = 100;
        const text = "On my favourite day I get up \n" +
            "at 7:00 and listen to music. \n" +
            "I meet my friends and we \n" +
            "walk to school. We often talk about our plans for the weekend. Lessons ends at 18:15, with Music, " +
            "then Art – my favourite subjects!";
        let textVoices = [this.getTextVoiceObject(text, '')];

        textVoices = this.presenter.splitLongTexts(textVoices);

        const expectedTexts = [
            "On my favourite day I get up \nat 7:00 and listen to music",
            "I meet my friends and we \nwalk to school",
            "We often talk about our plans for the weekend",
            "Lessons ends at 18:15, with Music, then Art – my favourite subjects",
        ]
        assertEquals(expectedTexts.length, textVoices.length);
        this.validateTextVoicesTexts(expectedTexts, textVoices);
    },

    'test given to long text with number + dot syntax then do not split by dots used in syntax': function () {
        this.presenter.maxUtteranceLength = 50;
        const text = "Example 1.2.3.\n" +
            "The result of dividing two by five is: 0.2. " +
            "And of course: 0.2 + 0.4 = 0.6";
        let textVoices = [this.getTextVoiceObject(text, '')];

        textVoices = this.presenter.splitLongTexts(textVoices);

        const expectedTexts = [
            "Example 1.2.3",
            "The result of dividing two by five is: 0.2",
            "And of course: 0.2 + 0.4 = 0.6",
        ]
        assertEquals(expectedTexts.length, textVoices.length);
        this.validateTextVoicesTexts(expectedTexts, textVoices);
    },
});
