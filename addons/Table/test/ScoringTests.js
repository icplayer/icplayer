TestCase("Scoring - single gap", {
    setUp: function () {
        this.presenter = AddonTable_create();
        this.presenter.configuration = {
            isCaseSensitive: false,
            isPunctuationIgnored: false,
            addonID: "Table1"
        };
    },

    'test empty gap not filled': function () {
        var gap = { answers: [""], id: "Table1-1", value: "" };

        assertTrue(this.presenter.isGapCorrect(gap, false, false));
    },

    'test empty gap filled': function () {
        var gap = { answers: [""], id: "Table1-1", value: "some value" };

        assertFalse(this.presenter.isGapCorrect(gap, false, false));
    },

    'test gap not filled': function () {
        var gap = { answers: ["answer"], id: "Table1-1", value: "" };

        assertFalse(this.presenter.isGapCorrect(gap, false, false));
    },

    'test gap filled correctly': function () {
        var gap = { answers: ["answer"], id: "Table1-1", value: "answer" };

        assertTrue(this.presenter.isGapCorrect(gap, false, false));
    },

    'test gap filled incorrectly': function () {
        var gap = { answers: ["answer"], id: "Table1-1", value: "answer to question" };

        assertFalse(this.presenter.isGapCorrect(gap, false, false));
    },

    'test gap with multiple answers not filled': function () {
        var gap = { answers: ["answer", "another"], id: "Table1-1", value: "" };

        assertFalse(this.presenter.isGapCorrect(gap, false, false));
    },

    'test gap with multiple answers filled correctly': function () {
        var gap = { answers: ["answer", "another"], id: "Table1-1", value: "Another" };

        assertTrue(this.presenter.isGapCorrect(gap, false, false));
    },

    'test gap with multiple answers filled incorrectly': function () {
        var gap = { answers: ["answer", "another"], id: "Table1-1", value: "answer to question" };

        assertFalse(this.presenter.isGapCorrect(gap, false, false));
    },

    'test gap with single answer with value containing only whitespaces': function () {
        var gap = { answers: ["answer"], id: "Table1-1", value: "  " };

        assertFalse(this.presenter.isGapCorrect(gap, false, false));
    },

    'test gap with multiple answers with value containing only whitespaces': function () {
        var gap = { answers: ["answer", "another"], id: "Table1-1", value: "  " };

        assertFalse(this.presenter.isGapCorrect(gap, false, false));
    },

    'test gap filled incorrectly - case sensitive': function () {
        var gap = { answers: ["answer"], id: "Table1-1", value: "Answer" };

        assertFalse(this.presenter.isGapCorrect(gap, true, false));
    },

    'test gap with multiple answers filled incorrectly - case sensitive': function () {
        var gap = { answers: ["answer", "another"], id: "Table1-1", value: "Another" };

        assertFalse(this.presenter.isGapCorrect(gap, true, false));
    },

    'test gap with punctuation in answer - not ignored': function () {
        var gap = { answers: ["1.000"], id: "Table1-1", value: "1000" };

        assertFalse(this.presenter.isGapCorrect(gap, false, false));
    },

    'test gap with punctuation in answer - ignored': function () {
        var gap = { answers: ["1.000"], id: "Table1-1", value: "1000" };

        assertTrue(this.presenter.isGapCorrect(gap, false, true));
    }
});

TestCase("Scoring", {
    setUp: function () {
        this.presenter = AddonTable_create();
        this.presenter.configuration = {
            gaps: {
                descriptions: []
            },
            isActivity: true,
            isCaseSensitive: false,
            isPunctuationIgnored: false,
            addonID: "Table1"
        };
    },

    'test no gaps': function () {
        assertEquals(0, this.presenter.getMaxScore());
        assertEquals(0, this.presenter.getScore());
        assertEquals(0, this.presenter.getErrorCount());
    },

    'test single empty gap filled': function () {
        this.presenter.configuration.gaps.descriptions = [
            { answers: [""], id: "Table1-1", value: "some value", score: 1 }
        ];

        assertEquals(1, this.presenter.getMaxScore());
        assertEquals(0, this.presenter.getScore());
        assertEquals(1, this.presenter.getErrorCount());
    },

    'test single gap case sensitive and with punctuation ignored': function () {
        this.presenter.configuration.isCaseSensitive = true;
        this.presenter.configuration.isPunctuationIgnored = true;
        this.presenter.configuration.gaps.descriptions = [
            { answers: ["aaAA 1.0000"], id: "Table1-1", value: "aaAA 10000", score: 1 }
        ];

        assertEquals(1, this.presenter.getMaxScore());
        assertEquals(1, this.presenter.getScore());
        assertEquals(0, this.presenter.getErrorCount());
    },

    'test single gap not filled': function () {
        this.presenter.configuration.gaps.descriptions = [
            { answers: ["some value"], id: "Table1-1", value: "", score: 1 }
        ];

        assertEquals(1, this.presenter.getMaxScore());
        assertEquals(0, this.presenter.getScore());
        assertEquals(0, this.presenter.getErrorCount()); // Although gap is incorrect, it's empty, so no errors are reported
    },

    'test single gap filled with just whitespaces': function () {
        this.presenter.configuration.gaps.descriptions = [
            { answers: ["some value"], id: "Table1-1", value: " \t ", score: 1 }
        ];

        assertEquals(1, this.presenter.getMaxScore());
        assertEquals(0, this.presenter.getScore());
        assertEquals(0, this.presenter.getErrorCount()); // Although gap is incorrect, it contains only white characters, so no errors are reported
    },

    'test multiple gaps - each filled correctly': function () {
        this.presenter.configuration.gaps.descriptions = [
            { answers: [""], id: "Table1-1", value: "", score: 1 },
            { answers: ["ans1"], id: "Table1-2", value: "ans1", score: 1 },
            { answers: ["some"], id: "Table1-3", value: "some", score: 1 },
            { answers: ["answ1", "answ2", "answ3"], id: "Table1-4", value: "answ3", score: 2 }
        ];

        assertEquals(5, this.presenter.getMaxScore());
        assertEquals(5, this.presenter.getScore());
        assertEquals(0, this.presenter.getErrorCount());
    },

    'test multiple gaps - each filled incorrectly': function () {
        this.presenter.configuration.gaps.descriptions = [
            { answers: [""], id: "Table1-1", value: "some", score: 1 },
            { answers: ["ans1"], id: "Table1-2", value: "ans2", score: 1 },
            { answers: ["some"], id: "Table1-3", value: "some value", score: 1 },
            { answers: ["answ1", "answ2", "answ3"], id: "Table1-4", value: "answ4", score: 1 }
        ];

        assertEquals(4, this.presenter.getMaxScore());
        assertEquals(0, this.presenter.getScore());
        assertEquals(4, this.presenter.getErrorCount());
    },

    'test multiple gaps - each filled differently': function () {
        this.presenter.configuration.gaps.descriptions = [
            { answers: [""], id: "Table1-1", value: "", score: 4 }, // correct
            { answers: ["ans1"], id: "Table1-2", value: "ans1", score: 1 }, // correct
            { answers: ["some"], id: "Table1-3", value: "some value", score: 1 }, // incorrect
            { answers: ["answ1", "answ2", "answ3"], id: "Table1-4", value: "" , score: 1}, // empty - no score and error points
            { answers: ["answ1", "answ2"], id: "Table1-4", value: "answ2" , score: 1} // correct
        ];

        assertEquals(8, this.presenter.getMaxScore());
        assertEquals(6, this.presenter.getScore());
        assertEquals(1, this.presenter.getErrorCount());
    }
});

TestCase("Scoring - is not activity option selected", {
    setUp: function () {
        this.presenter = AddonTable_create();
        this.presenter.configuration = {
            gaps: {
                descriptions: []
            },
            isActivity: false
        };
    },

    'test single empty gap filled': function () {
        this.presenter.configuration.gaps.descriptions = [
            { answers: [""], id: "Table1-1", value: "some value", score: 1 }
        ];

        assertEquals(0, this.presenter.getMaxScore());
        assertEquals(0, this.presenter.getScore());
        assertEquals(0, this.presenter.getErrorCount());
    },

    'test multiple gaps - each filled differently': function () {
        this.presenter.configuration.gaps.descriptions = [
            { answers: [""], id: "Table1-1", value: "", score: 1 }, // correct
            { answers: ["ans1"], id: "Table1-2", value: "ans1", score: 1 }, // correct
            { answers: ["some"], id: "Table1-3", value: "some value", score: 1 }, // incorrect
            { answers: ["answ1", "answ2", "answ3"], id: "Table1-4", value: "", score: 1 }, // empty - no score and error points
            { answers: ["answ1", "answ2"], id: "Table1-4", value: "answ2", score: 1 } // correct
        ];

        assertEquals(0, this.presenter.getMaxScore());
        assertEquals(0, this.presenter.getScore());
        assertEquals(0, this.presenter.getErrorCount());
    }
});