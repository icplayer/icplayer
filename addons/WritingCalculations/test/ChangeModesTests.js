TestCase("[Writing Calculations] Change Modes Tests", {
    'setUp' : function() {
        this.presenter = AddonWritingCalculations_create();
        this.presenter.$view = $("<div><input class='writing-calculations-input correct' value='test' /></div>")
    },

    'test removeMark method': function() {
        // Given
        var element = $("<div class='correct incorrect'></div>");

        // When
        this.presenter.removeMark(element);

        // Then
        assertFalse("", element.hasClass("correct"));
        assertFalse("", element.hasClass("incorrect"));
    },

    'test removeValue method': function() {
        // Given
        var element = $("<input value='test' />");
        var expectedElementValue = "";

        // When
        this.presenter.removeValue(element);

        // Then
        assertEquals("", expectedElementValue, element.val());
    },

    'test clean method': function() {
        // Given
        var removeMark = true;
        var removeValue = true;
        var element = this.presenter.$view.find(".writing-calculations-input");
        var expectedElementValue = "";

        // When
        this.presenter.clean(removeMark, removeValue);

        // Then
        assertEquals("", expectedElementValue, $(element).val());
        assertFalse("", element.hasClass("correct"));
        assertFalse("", element.hasClass("incorrect"));
    }
});
