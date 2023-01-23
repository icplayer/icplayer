TestCase('[Text_To_Speech] Splitting text into sentences and reading them in correct order tests', {
    setUp: function () {
        this.presenter = AddonText_To_Speech_create();

        this.model = {
            'ID': 'Text_To_Speech1',
            'configuration': [{
                ID: 'Text1',
                Area: '',
                Title: 'Title text 1'
            }]
        };
        this.stubs = {
            readTextStub: sinon.stub(this.presenter, "readText")
        };
    },

    getTextVoiceObject: function (text, lang) {
        return {text: text, lang: lang};
    },

    validateTextVoicesTexts: function (expectedTexts, textVoices) {
        for (let i = 0; i < expectedTexts.length; i++) {
            assertEquals(expectedTexts[i], textVoices[i].text.trim());
        }
    },

    'test given speech text with multiple sentences and saveSentence == true when saveSentences is called then correctly split the speech text into sentences and save it': function () {
        var textVoices = [];
        textVoices.push(this.getTextVoiceObject('test hello world',''));
        textVoices.push(this.getTextVoiceObject('This is sentence. This is also a sentence','pl'));
        this.presenter.saveNextSentences = true;

        this.presenter.saveSentences(textVoices);

        assertEquals(3, this.presenter.savedSentences.length);
        assertEquals('test hello world', this.presenter.savedSentences[0].text);
        assertEquals('This is sentence', this.presenter.savedSentences[1].text);
        assertEquals('pl', this.presenter.savedSentences[1].lang);
        assertEquals(' This is also a sentence', this.presenter.savedSentences[2].text);
        assertEquals('pl', this.presenter.savedSentences[2].lang);
    },

    'test given speech text with multiple sentences with "a.m." and "p.m." syntax and saveSentence == true when saveSentences is called then correctly split the speech text into sentences and save it': function () {
        var textVoices = [];
        textVoices.push(this.getTextVoiceObject('On my favourite day I get up at 7 a.m. and listen to music.',''));
        textVoices.push(this.getTextVoiceObject('I meet my friends and we walk to school. ' +
            'We often talk about our plans for the weekend. ' +
            'Lessons ends at 9 p.m., with Music, then Art – my favourite subjects!','pl'));
        this.presenter.saveNextSentences = true;

        this.presenter.saveSentences(textVoices);

        assertEquals(4, this.presenter.savedSentences.length);
        assertEquals('On my favourite day I get up at 7 a.m. and listen to music', this.presenter.savedSentences[0].text);
        assertEquals('I meet my friends and we walk to school', this.presenter.savedSentences[1].text);
        assertEquals('pl', this.presenter.savedSentences[1].lang);
        assertEquals(' We often talk about our plans for the weekend', this.presenter.savedSentences[2].text);
        assertEquals('pl', this.presenter.savedSentences[2].lang);
        assertEquals(' Lessons ends at 9 p.m., with Music, then Art – my favourite subjects', this.presenter.savedSentences[3].text);
        assertEquals('pl', this.presenter.savedSentences[3].lang);
    },

    'test given speech text with multiple sentences hh:mm hour syntax and saveSentence == true when saveSentences is called then correctly split the speech text into sentences and save it': function () {
        var textVoices = [];
        this.presenter.maxUtteranceLength = 100;
        textVoices.push(this.getTextVoiceObject('On my favourite day I get up at 7:15 and listen to music.',''));
        textVoices.push(this.getTextVoiceObject('I meet my friends and we walk to school. ' +
            'We often talk about our plans for the weekend. ' +
            'Lessons ends at 18:00, with Music, then Art – my favourite subjects!','pl'));
        this.presenter.saveNextSentences = true;

        this.presenter.saveSentences(textVoices);

        assertEquals(4, this.presenter.savedSentences.length);
        assertEquals('On my favourite day I get up at 7:15 and listen to music', this.presenter.savedSentences[0].text);
        assertEquals('I meet my friends and we walk to school', this.presenter.savedSentences[1].text);
        assertEquals('pl', this.presenter.savedSentences[1].lang);
        assertEquals(' We often talk about our plans for the weekend', this.presenter.savedSentences[2].text);
        assertEquals('pl', this.presenter.savedSentences[2].lang);
        assertEquals(' Lessons ends at 18:00, with Music, then Art – my favourite subjects', this.presenter.savedSentences[3].text);
        assertEquals('pl', this.presenter.savedSentences[3].lang);
    },

    'test given speech text with multiple sentences number + dot syntax and saveSentence == true when saveSentences is called then correctly split the speech text into sentences and save it': function () {
        var textVoices = [];
        this.presenter.maxUtteranceLength = 100;
        textVoices.push(this.getTextVoiceObject('Example 1.2.3.',''));
        textVoices.push(this.getTextVoiceObject('The result of dividing two by five is: 0.2. ' +
            'And of course: 0.2 + 0.4 = 0.6','pl'));
        this.presenter.saveNextSentences = true;

        this.presenter.saveSentences(textVoices);

        assertEquals(3, this.presenter.savedSentences.length);
        assertEquals('Example 1.2.3', this.presenter.savedSentences[0].text);
        assertEquals('The result of dividing two by five is: 0.2', this.presenter.savedSentences[1].text);
        assertEquals('pl', this.presenter.savedSentences[1].lang);
        assertEquals(' And of course: 0.2 + 0.4 = 0.6', this.presenter.savedSentences[2].text);
        assertEquals('pl', this.presenter.savedSentences[2].lang);
    },

    'test given speech text with multiple sentences and saveSentence == false when saveSentences is called then do not save sentences': function () {
        var textVoices = [];
        textVoices.push(this.getTextVoiceObject('test hello world',''));
        textVoices.push(this.getTextVoiceObject('This is sentence. This is also a sentence','pl'));
        this.presenter.saveNextSentences = false;

        this.presenter.saveSentences(textVoices);

        assertEquals(0, this.presenter.savedSentences.length);
    },

    'test given speech text with multiple sentences and saveNextSentences == true when saveSentences is called then set saveNextSentences to false': function () {
        var textVoices = [];
        textVoices.push(this.getTextVoiceObject('test hello world',''));
        textVoices.push(this.getTextVoiceObject('This is sentence. This is also a sentence','pl'));
        this.presenter.saveNextSentences = true;

        this.presenter.saveSentences(textVoices);

        assertFalse(this.presenter.saveNextSentences);
    },

    'test given a saved sentence and default index, when readNextSavedSentence is called, read the first sentence and set correct index': function () {
        var textVoices = [];
        textVoices.push(this.getTextVoiceObject('test hello world',''));
        textVoices.push(this.getTextVoiceObject('This is sentence','pl'));
        textVoices.push(this.getTextVoiceObject(' This is also a sentence','pl'));
        this.presenter.savedSentences = textVoices;
        this.presenter.savedSentencesIndex = -1;

        this.presenter.readNextSavedSentence();

        let calls = this.stubs.readTextStub.getCalls();
        assertEquals(1, calls.length);
        assertEquals(1, calls[0].args[0].length);
        assertEquals("test hello world", calls[0].args[0][0].text);
        assertEquals(0, this.presenter.savedSentencesIndex);
    },

    'test given a saved sentence and index is not default, when readNextSavedSentence is called, read the correct sentence and set correct index': function () {
        var textVoices = [];
        textVoices.push(this.getTextVoiceObject('test hello world',''));
        textVoices.push(this.getTextVoiceObject('This is sentence','pl'));
        textVoices.push(this.getTextVoiceObject(' This is also a sentence','pl'));
        this.presenter.savedSentences = textVoices;
        this.presenter.savedSentencesIndex = 0;

        this.presenter.readNextSavedSentence();

        let calls = this.stubs.readTextStub.getCalls();
        assertEquals(1, calls.length);
        assertEquals(1, calls[0].args[0].length);
        assertEquals("This is sentence", calls[0].args[0][0].text);
        assertEquals(1, this.presenter.savedSentencesIndex);
    },

    'test given a saved sentence and highest index, when readNextSavedSentence is called, read the last sentence and set correct index': function () {
        var textVoices = [];
        textVoices.push(this.getTextVoiceObject('test hello world',''));
        textVoices.push(this.getTextVoiceObject('This is sentence','pl'));
        textVoices.push(this.getTextVoiceObject(' This is also a sentence','pl'));
        this.presenter.savedSentences = textVoices;
        this.presenter.savedSentencesIndex = 2;

        this.presenter.readNextSavedSentence();

        let calls = this.stubs.readTextStub.getCalls();
        assertEquals(1, calls.length);
        assertEquals(1, calls[0].args[0].length);
        assertEquals(" This is also a sentence", calls[0].args[0][0].text);
        assertEquals(2, this.presenter.savedSentencesIndex);
    },

    'test given a saved sentence and default index, when readPrevSavedSentence is called, read the first sentence and set correct index': function () {
        var textVoices = [];
        textVoices.push(this.getTextVoiceObject('test hello world',''));
        textVoices.push(this.getTextVoiceObject('This is sentence','pl'));
        textVoices.push(this.getTextVoiceObject(' This is also a sentence','pl'));
        this.presenter.savedSentences = textVoices;
        this.presenter.savedSentencesIndex = -1;

        this.presenter.readPrevSavedSentence();

        let calls = this.stubs.readTextStub.getCalls();
        assertEquals(1, calls.length);
        assertEquals(1, calls[0].args[0].length);
        assertEquals("test hello world", calls[0].args[0][0].text);
        assertEquals(0, this.presenter.savedSentencesIndex);
    },

    'test given a saved sentence and index higher than 0, when readPrevSavedSentence is called, read the correct sentence and set correct index': function () {
        var textVoices = [];
        textVoices.push(this.getTextVoiceObject('test hello world',''));
        textVoices.push(this.getTextVoiceObject('This is sentence','pl'));
        textVoices.push(this.getTextVoiceObject(' This is also a sentence','pl'));
        this.presenter.savedSentences = textVoices;
        this.presenter.savedSentencesIndex = 2;

        this.presenter.readPrevSavedSentence();

        let calls = this.stubs.readTextStub.getCalls();
        assertEquals(1, calls.length);
        assertEquals(1, calls[0].args[0].length);
        assertEquals("This is sentence", calls[0].args[0][0].text);
        assertEquals(1, this.presenter.savedSentencesIndex);
    },

    'test given a saved sentence and index of 0, when readPrevSavedSentence is called, read the first sentence and set correct index': function () {
        var textVoices = [];
        textVoices.push(this.getTextVoiceObject('test hello world',''));
        textVoices.push(this.getTextVoiceObject('This is sentence','pl'));
        textVoices.push(this.getTextVoiceObject(' This is also a sentence','pl'));
        this.presenter.savedSentences = textVoices;
        this.presenter.savedSentencesIndex = 0;

        this.presenter.readPrevSavedSentence();

        let calls = this.stubs.readTextStub.getCalls();
        assertEquals(1, calls.length);
        assertEquals(1, calls[0].args[0].length);
        assertEquals("test hello world", calls[0].args[0][0].text);
        assertEquals(0, this.presenter.savedSentencesIndex);
    },
});
