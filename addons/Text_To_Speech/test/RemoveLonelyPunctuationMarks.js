TestCase('[Text_To_Speech] Remove Lonely Punctuation Marks tests', {
    setUp: function () {
        this.presenter = AddonText_To_Speech_create();

        this.textVoices = [
            {
                "text": "No, it isn’t (5)",
                "lang": ""
            },
            {
                "text": "gap 1"
            },
            {
                "text": "empty"
            },
            {
                "text": ". It’s my hat, it’s (6)",
                "lang": ""
            },
            {
                "text": "gap 2"
            },
            {
                "text": "empty"
            }
        ];
    },

    getNonBreakingSpace: function () {
        return String.fromCharCode(160);
    },

    'test given text voices with lonely punctuation mark character as last text voice then remove text voice with punctuation': function () {
        this.textVoices.push({
            "text": "!",
            "lang": ""
        });

        let result = this.presenter.removeUnnecessaryPunctuationMarks(this.textVoices);

        assertEquals(7, this.textVoices.length);
        assertEquals(6, result.length);

        for (let i = 0; i < result.length; i++) {
            assertEquals(this.textVoices[i], result[i]);
        }
    },

    'test given text voices with lonely punctuation mark character as text voice in the middle then remove text voice with punctuation': function () {
        this.textVoices.splice(2, 0, {
            "text": "?",
        });

        let result = this.presenter.removeUnnecessaryPunctuationMarks(this.textVoices);

        assertEquals(7, this.textVoices.length);
        assertEquals(6, result.length);

        assertEquals(this.textVoices[1], result[1]);
        assertEquals(this.textVoices[3], result[2]);
    },

    'test given text voices with lonely punctuation mark character as first text voice then remove text voice with punctuation': function () {
        this.textVoices.unshift({
            "text": ".",
        });

        let result = this.presenter.removeUnnecessaryPunctuationMarks(this.textVoices);

        assertEquals(7, this.textVoices.length);
        assertEquals(6, result.length);

        assertEquals(this.textVoices[2], result[1]);
    },

    'test given text voices when one text voice is with two punctuation mark characters then remove text voice with them': function () {
        this.textVoices.splice(2, 0, {
            "text": "!?",
            "lang": ""
        });

        let result = this.presenter.removeUnnecessaryPunctuationMarks(this.textVoices);

        assertEquals(7, this.textVoices.length);
        assertEquals(6, result.length);

        assertEquals(this.textVoices[1], result[1]);
        assertEquals(this.textVoices[3], result[2]);
    },

    'test given text voices when one text voice is with two punctuation mark characters and whitespace then remove text voice with them': function () {
        this.textVoices.splice(2, 0, {
            "text": "! ?",
            "lang": ""
        });

        let result = this.presenter.removeUnnecessaryPunctuationMarks(this.textVoices);

        assertEquals(7, this.textVoices.length);
        assertEquals(6, result.length);

        assertEquals(this.textVoices[1], result[1]);
        assertEquals(this.textVoices[3], result[2]);
    },

    'test given text voices when one text voice is with two punctuation mark characters and non-breaking character then remove text voice with them': function () {
        this.textVoices.splice(2, 0, {
            "text": "!" + this.getNonBreakingSpace() + "?",
            "lang": ""
        });

        let result = this.presenter.removeUnnecessaryPunctuationMarks(this.textVoices);

        assertEquals(7, this.textVoices.length);
        assertEquals(6, result.length);

        assertEquals(this.textVoices[1], result[1]);
        assertEquals(this.textVoices[3], result[2]);
    },

    'test given text voices when one text voice is with punctuation mark and some other letter then do not remove text voice with them': function () {
        this.textVoices.splice(2, 0, {
            "text": "A?",
            "lang": ""
        });

        let result = this.presenter.removeUnnecessaryPunctuationMarks(this.textVoices);

        assertEquals(7, this.textVoices.length);
        assertEquals(7, result.length);
    },
});
