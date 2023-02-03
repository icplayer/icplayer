TestCase("[Writing Calculations] LaTeX Methods Tests", {
    'setUp' : function() {
        this.presenter = AddonWritingCalculations_create();
        this.presenter.signs = {
            'Multiplication' : '\\(\\times\\)',
            'Division' : '\\(\\big)\\)',
            'Addition' : '\\(\\+\\)'
        }
    },

    'test convertLaTeX method for multiplication': function() {
        // Given
        var expectedConvertedValue = "\\(\\times\\)";

        // When
        var value = this.presenter.convertLaTeX("*");

        // Then
        assertEquals("", expectedConvertedValue, value);
    },

    'test convertLaTeX method for division': function() {
        // Given
        var expectedConvertedValue = "\\(\\big)\\)";

        // When
        var value1 = this.presenter.convertLaTeX(":");
        var value2 = this.presenter.convertLaTeX(")");

        // Then
        assertEquals("", expectedConvertedValue, value1);
        assertEquals("", expectedConvertedValue, value2);
    },

    'test convertLaTeX method for others': function() {
        // Given
        var expectedValue = "\\(\\+\\)";

        // When
        var value = this.presenter.convertLaTeX("+");

        // Then
        assertEquals("", expectedValue, value);
    }
});
