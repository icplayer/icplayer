TestCase("[Writing Calculations] Element Type Tests", {
    'setUp' : function() {
        this.presenter = AddonWritingCalculations_create();
    },

    'test isInteger positive': function() {
        // Given
        const positiveValues = ["0", "5", "9", "-1", "11", "-12", 1, -12, 0];

        // When
        positiveValues.forEach((value) => {
            const positiveResult = this.presenter.isInteger(value);

            // Then
            assertTrue(positiveResult);
        })
    },

    'test isInteger negative': function() {
        // Given
        const negativeValues = ["1.1", ".", "-0", "N", "e", "-", 11.1]

        // When
        negativeValues.forEach((value) => {
            const negativeResult = this.presenter.isInteger(value);

            // Then
            assertFalse(negativeResult);
        })
    },

    'test isIntegerOrFloat positive': function() {
        // Given
        const positiveValues = ["-12,6", "0", "5", "9", "-1", "11", "-12", "1.1", "-0.12", "1,2", 11, 11.1];

        // When
        positiveValues.forEach((value) => {
            const positiveResult = this.presenter.isIntegerOrFloat(value);

            // Then
            assertTrue(positiveResult);
        })
    },

    'test isIntegerOrFloat negative': function() {
        // Given
        const negativeValues = [".", "-0", "00", "N", "e", ".1", "-1.1.1", "00.", "-00,6", "1,1.1,1", "-"];

        // When
        negativeValues.forEach((value) => {
            const negativeResult = this.presenter.isIntegerOrFloat(value);

            // Then
            assertFalse(negativeResult);
        })
    },

    'test isSymbol positive and negative' : function() {
        // Given

        // Then
        var positiveResultPlus = this.presenter.isSymbol("+");
        var positiveResultMinus = this.presenter.isSymbol("-");
        var positiveResultStar = this.presenter.isSymbol("*");
        var negativeResultDot = this.presenter.isSymbol(".");
        var negativeResult = this.presenter.isSymbol("k");

        // Then
        assertTrue(positiveResultPlus);
        assertTrue(positiveResultMinus);
        assertTrue(positiveResultStar);
        assertFalse(negativeResultDot);
        assertFalse(negativeResult);
    },

    'test isEmptySpace positive and negative' : function() {
        // Given

        // When
        var positiveResult = this.presenter.isEmptySpace("_");
        var negativeResult = this.presenter.isEmptySpace("=");

        // Then
        assertTrue(positiveResult);
        assertFalse(negativeResult);
    },

    'test isEmptyBox positive and negative' : function() {
        // Given
        var matchingElement = "[1]";
        var notMatchingElement = "1";

        // When
        var positiveResult = this.presenter.isEmptyBox(matchingElement);
        var negativeResult = this.presenter.isEmptyBox(notMatchingElement);

        // Then
        assertTrue(positiveResult);
        assertFalse(negativeResult);
    },

    'test isLine positive and negative' : function() {
        // Given
        var matchingElement = "=";
        var notMatchingElement = "1";

        // When
        var positiveResult = this.presenter.isLine(matchingElement);
        var negativeResult = this.presenter.isLine(notMatchingElement);

        // Then
        assertTrue(positiveResult);
        assertFalse(negativeResult);
    },

    'test isHelpBox positive and negative' : function() {
        // Given
        const matchingPatterns = [
            "{}", "{1}", "{12}", "{12.1}"
        ];
        const notMatchingPatterns = [
            "{", "1", "}", "[1]"
        ];

        // When
        const self = this;
        const matchingPatternsResults = matchingPatterns.map((pattern) => self.presenter.isHelpBox(pattern));
        const notMatchingPatternsResults = notMatchingPatterns.map((pattern) => self.presenter.isHelpBox(pattern));

        // Then
        matchingPatternsResults.map((result, index) => assertTrue("Failed for: " + matchingPatterns[index], result));
        notMatchingPatternsResults.map((result, index) => assertFalse("Failed for: " + notMatchingPatterns[index], result));
    },
});
