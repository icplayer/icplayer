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

    'test given speech text with multiple sentences  and saveSentence == true when saveSentences is called then correctly split the speech text into sentences and save it': function () {
        function getTextVoiceObject (text, lang) { return {text: text, lang: lang}; }
        var textVoices = [];
        textVoices.push(getTextVoiceObject('test hello world',''));
        textVoices.push(getTextVoiceObject('This is sentence. This is also a sentence','pl'));
        this.presenter.saveNextSentences = true;

        this.presenter.saveSentences(textVoices);

        assertEquals(3, this.presenter.savedSentences.length);
        assertEquals('test hello world', this.presenter.savedSentences[0].text);
        assertEquals('This is sentence.', this.presenter.savedSentences[1].text);
        assertEquals('pl', this.presenter.savedSentences[1].lang);
        assertEquals(' This is also a sentence', this.presenter.savedSentences[2].text);
        assertEquals('pl', this.presenter.savedSentences[2].lang);
    },

    'test given speech text with multiple sentences  and saveSentence == false when saveSentences is called then do not save sentences': function () {
        function getTextVoiceObject (text, lang) { return {text: text, lang: lang}; }
        var textVoices = [];
        textVoices.push(getTextVoiceObject('test hello world',''));
        textVoices.push(getTextVoiceObject('This is sentence. This is also a sentence','pl'));
        this.presenter.saveNextSentences = false;

        this.presenter.saveSentences(textVoices);

        assertEquals(0, this.presenter.savedSentences.length);
    },

    'test given speech text with multiple sentences  and saveNextSentences == true when saveSentences is called then set saveNextSentences to false': function () {
        function getTextVoiceObject (text, lang) { return {text: text, lang: lang}; }
        var textVoices = [];
        textVoices.push(getTextVoiceObject('test hello world',''));
        textVoices.push(getTextVoiceObject('This is sentence. This is also a sentence','pl'));
        this.presenter.saveNextSentences = true;

        this.presenter.saveSentences(textVoices);

        assertFalse(this.presenter.saveNextSentences);
    },

    'test given a saved sentence and default index, when readNextSavedSentence is called, read the first sentence and set correct index': function () {
        function getTextVoiceObject (text, lang) { return {text: text, lang: lang}; }
        var textVoices = [];
        textVoices.push(getTextVoiceObject('test hello world',''));
        textVoices.push(getTextVoiceObject('This is sentence','pl'));
        textVoices.push(getTextVoiceObject(' This is also a sentence','pl'));
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
        function getTextVoiceObject (text, lang) { return {text: text, lang: lang}; }
        var textVoices = [];
        textVoices.push(getTextVoiceObject('test hello world',''));
        textVoices.push(getTextVoiceObject('This is sentence','pl'));
        textVoices.push(getTextVoiceObject(' This is also a sentence','pl'));
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
        function getTextVoiceObject (text, lang) { return {text: text, lang: lang}; }
        var textVoices = [];
        textVoices.push(getTextVoiceObject('test hello world',''));
        textVoices.push(getTextVoiceObject('This is sentence','pl'));
        textVoices.push(getTextVoiceObject(' This is also a sentence','pl'));
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
        function getTextVoiceObject (text, lang) { return {text: text, lang: lang}; }
        var textVoices = [];
        textVoices.push(getTextVoiceObject('test hello world',''));
        textVoices.push(getTextVoiceObject('This is sentence','pl'));
        textVoices.push(getTextVoiceObject(' This is also a sentence','pl'));
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
        function getTextVoiceObject (text, lang) { return {text: text, lang: lang}; }
        var textVoices = [];
        textVoices.push(getTextVoiceObject('test hello world',''));
        textVoices.push(getTextVoiceObject('This is sentence','pl'));
        textVoices.push(getTextVoiceObject(' This is also a sentence','pl'));
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
        function getTextVoiceObject (text, lang) { return {text: text, lang: lang}; }
        var textVoices = [];
        textVoices.push(getTextVoiceObject('test hello world',''));
        textVoices.push(getTextVoiceObject('This is sentence','pl'));
        textVoices.push(getTextVoiceObject(' This is also a sentence','pl'));
        this.presenter.savedSentences = textVoices;
        this.presenter.savedSentencesIndex = 0;

        this.presenter.readPrevSavedSentence();

        let calls = this.stubs.readTextStub.getCalls();
        assertEquals(1, calls.length);
        assertEquals(1, calls[0].args[0].length);
        assertEquals("test hello world", calls[0].args[0][0].text);
        assertEquals(0, this.presenter.savedSentencesIndex);
    }
});
