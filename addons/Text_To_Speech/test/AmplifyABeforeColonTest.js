TestCase('[Text_To_Speech] Amplify A before colon tests', {
    setUp: function () {
        this.presenter = AddonText_To_Speech_create();
        this.textVoices = [];
        this.whitespaceChars = [
            " ", this.getNonBreakingSpace(), "\n", "\t"
        ]
    },

    getNonBreakingSpace: function () {
        return String.fromCharCode(160);
    },

    createTextsRepresentations: function (isTestedFirst = false, isTestedSecond = false) {
        this.whitespaceChars.forEach(whitespaceChar => {
            const firstChar = isTestedFirst ? whitespaceChar : ' ';
            const secondChar = isTestedSecond ? whitespaceChar : ' ';

            let text1 = this.createCapitalizedTextRepresentation(firstChar, secondChar);
            this.textVoices.push(this.getTextVoiceObject(text1,''));

            let text2 = this.createSmallTextRepresentation(firstChar, secondChar);
            this.textVoices.push(this.getTextVoiceObject(text2,''));
        })
    },

    getTextVoiceObject: function (text, lang) {
        return {text: text, lang: lang};
    },

    validateTextsRepresentations: function (isTestedFirst = false, isTestedSecond = false) {
        this.whitespaceChars.forEach((whitespaceChar, index) => {
            const firstChar = isTestedFirst ? whitespaceChar : ' ';
            const secondChar = isTestedSecond ? whitespaceChar : ' ';

            let text1 = this.createCapitalizedTextRepresentation(firstChar, secondChar, true);
            assertEquals({text: text1, lang: ''}, this.textVoices[2*index]);

            let text2 = this.createSmallTextRepresentation(firstChar, secondChar, true);
            assertEquals({text: text2, lang: ''}, this.textVoices[2*index + 1]);
        })
    },

    createCapitalizedTextRepresentation: function (firstChar = '', secondChar = ' ', isWithComma = false) {
        return this.createTextRepresentation(firstChar, secondChar, true, isWithComma);
    },

    createSmallTextRepresentation: function (firstChar = '', secondChar = ' ', isWithComma = false) {
        return this.createTextRepresentation(firstChar, secondChar, false, isWithComma);
    },

    createTextRepresentation: function (firstChar = '', secondChar = ' ', isCapitalized = true, isWithComma = false) {
        const charSeparator = isWithComma ? "," : ":";
        const letter = isCapitalized ? "A" : "a";
        return `${letter}${firstChar}${charSeparator}${secondChar}Please lift this box.`;
    },

    'test given text voices with whitespace character after letter other than A with colon then do not replace colon with comma': function () {
        const alphabet = "bBcCdDeEfFgGhHiIjJkKlLmMnNoOpPrRsStTuUwWxXyYzZ";
        let expectedTexts = [];
        for (let i = 0; i< alphabet.length; i++) {
            const text = `${alphabet[i]}: Please lift this box.`;
            expectedTexts.push(text);
            this.textVoices.push(this.getTextVoiceObject(text,''));
        }

        this.presenter.amplifyABeforeColon(this.textVoices);

        expectedTexts.forEach((expectedText, index) => {
            assertEquals({text: expectedText, lang: ''}, this.textVoices[index]);
        })
    },

    'test given text voice with A, tested whitespace character, and colon when amplifyABeforeColon is called then replace colon with comma': function () {
        this.createTextsRepresentations(true, false);

        this.presenter.amplifyABeforeColon(this.textVoices);

        this.validateTextsRepresentations(true, false);
    },

    'test given text voice with A, colon, and tested whitespace character when amplifyABeforeColon is called then replace colon with comma': function () {
        this.createTextsRepresentations(false, true);

        this.presenter.amplifyABeforeColon(this.textVoices);

        this.validateTextsRepresentations(false, true);
    },

    'test given text voice with A, tested whitespace character, colon, and tested whitespace character when amplifyABeforeColon is called then replace colon with comma': function () {
        this.createTextsRepresentations(true, true);

        this.presenter.amplifyABeforeColon(this.textVoices);

        this.validateTextsRepresentations(true, true);
    },
});
