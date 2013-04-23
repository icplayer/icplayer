TestCase("Scoring - single gap", {
    setUp: function () {
        this.presenter = AddonTable_create();
        this.presenter.configuration = {
            isCaseSensitive: false,
            isPunctuationIgnored: false
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
            isPunctuationIgnored: false
        };
    },

    'test no gaps': function () {
        assertEquals(0, this.presenter.getMaxScore());
        assertEquals(0, this.presenter.getScore());
        assertEquals(0, this.presenter.getErrorCount());
    },

    'test single empty gap filled': function () {
        this.presenter.configuration.gaps.descriptions = [
            { answers: [""], id: "Table1-1", value: "some value" }
        ];

        assertEquals(1, this.presenter.getMaxScore());
        assertEquals(0, this.presenter.getScore());
        assertEquals(1, this.presenter.getErrorCount());
    },

    'test single gap case sensitive and with punctuation ignored': function () {
        this.presenter.configuration.isCaseSensitive = true;
        this.presenter.configuration.isPunctuationIgnored = true;
        this.presenter.configuration.gaps.descriptions = [
            { answers: ["aaAA 1.0000"], id: "Table1-1", value: "aaAA 10000" }
        ];

        assertEquals(1, this.presenter.getMaxScore());
        assertEquals(1, this.presenter.getScore());
        assertEquals(0, this.presenter.getErrorCount());
    },

    'test single gap not filled': function () {
        this.presenter.configuration.gaps.descriptions = [
            { answers: ["some value"], id: "Table1-1", value: "" }
        ];

        assertEquals(1, this.presenter.getMaxScore());
        assertEquals(0, this.presenter.getScore());
        assertEquals(0, this.presenter.getErrorCount()); // Although gap is incorrect, it's empty, so no errors are reported
    },

    'test single gap filled with just whitespaces': function () {
        this.presenter.configuration.gaps.descriptions = [
            { answers: ["some value"], id: "Table1-1", value: " \t " }
        ];

        assertEquals(1, this.presenter.getMaxScore());
        assertEquals(0, this.presenter.getScore());
        assertEquals(0, this.presenter.getErrorCount()); // Although gap is incorrect, it contains only white characters, so no errors are reported
    },

    'test multiple gaps - each filled correctly': function () {
        this.presenter.configuration.gaps.descriptions = [
            { answers: [""], id: "Table1-1", value: "" },
            { answers: ["ans1"], id: "Table1-2", value: "ans1" },
            { answers: ["some"], id: "Table1-3", value: "some" },
            { answers: ["answ1", "answ2", "answ3"], id: "Table1-4", value: "answ3" }
        ];

        assertEquals(4, this.presenter.getMaxScore());
        assertEquals(4, this.presenter.getScore());
        assertEquals(0, this.presenter.getErrorCount());
    },

    'test multiple gaps - each filled incorrectly': function () {
        this.presenter.configuration.gaps.descriptions = [
            { answers: [""], id: "Table1-1", value: "some" },
            { answers: ["ans1"], id: "Table1-2", value: "ans2" },
            { answers: ["some"], id: "Table1-3", value: "some value" },
            { answers: ["answ1", "answ2", "answ3"], id: "Table1-4", value: "answ4" }
        ];

        assertEquals(4, this.presenter.getMaxScore());
        assertEquals(0, this.presenter.getScore());
        assertEquals(4, this.presenter.getErrorCount());
    },

    'test multiple gaps - each filled differently': function () {
        this.presenter.configuration.gaps.descriptions = [
            { answers: [""], id: "Table1-1", value: "" }, // correct
            { answers: ["ans1"], id: "Table1-2", value: "ans1" }, // correct
            { answers: ["some"], id: "Table1-3", value: "some value" }, // incorrect
            { answers: ["answ1", "answ2", "answ3"], id: "Table1-4", value: "" }, // empty - no score and error points
            { answers: ["answ1", "answ2"], id: "Table1-4", value: "answ2" } // correct
        ];

        assertEquals(5, this.presenter.getMaxScore());
        assertEquals(3, this.presenter.getScore());
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
            { answers: [""], id: "Table1-1", value: "some value" }
        ];

        assertEquals(0, this.presenter.getMaxScore());
        assertEquals(0, this.presenter.getScore());
        assertEquals(0, this.presenter.getErrorCount());
    },

    'test multiple gaps - each filled differently': function () {
        this.presenter.configuration.gaps.descriptions = [
            { answers: [""], id: "Table1-1", value: "" }, // correct
            { answers: ["ans1"], id: "Table1-2", value: "ans1" }, // correct
            { answers: ["some"], id: "Table1-3", value: "some value" }, // incorrect
            { answers: ["answ1", "answ2", "answ3"], id: "Table1-4", value: "" }, // empty - no score and error points
            { answers: ["answ1", "answ2"], id: "Table1-4", value: "answ2" } // correct
        ];

        assertEquals(0, this.presenter.getMaxScore());
        assertEquals(0, this.presenter.getScore());
        assertEquals(0, this.presenter.getErrorCount());
    }
});