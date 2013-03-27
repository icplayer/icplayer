TestCase("LaTeX Methods Tests", {
    'setUp' : function() {
        this.presenter = AddonWritingCalculations_create();
    },

    'test convertLaTeX method for multiplication': function() {
        // Given
        var expectedElementID = "MathDiv";
        var expectedConvertedValue = "\\(\\times\\)";

        // When
        var element = this.presenter.convertLaTeX("*");

        // Then
        assertEquals("", expectedElementID, $(element).attr("id"));
        assertEquals("", expectedConvertedValue, $(element).last().html())
    },

    'test convertLaTeX method for division': function() {
        // Given
        var expectedElementID = "MathDiv";
        var expectedConvertedValue = "\\(\\div\\)";

        // When
        var element = this.presenter.convertLaTeX(":");

        // Then
        assertEquals("", expectedElementID, $(element).attr("id"));
        assertEquals("", expectedConvertedValue, $(element).last().html())
    },

    'test convertLaTeX method for others': function() {
        // Given
        var expectedElementID = undefined;
        var expectedValue = "a";

        // When
        var element = this.presenter.convertLaTeX("a");

        // Then
        assertEquals("", expectedElementID, $(element).attr("id"));
        assertEquals("", expectedValue, element);
    }
});
