TestCase("Element Type Tests", {
    'setUp' : function() {
        this.presenter = AddonWritingCalculations_create();
    },

    'test isInteger positive and negative': function() {
        // Given
        var integerElement = "3";
        var stringElement = "Karol";

        // When
        var positiveResult = this.presenter.isInteger(integerElement);
        var negativeResult = this.presenter.isInteger(stringElement);

        // Then
        assertTrue(positiveResult);
        assertFalse(negativeResult);
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
    }
});