TestCase("[Writing Calculations] TTS Tests", {
    'setUp' : function() {
        this.presenter = AddonWritingCalculations_create();
    },

    'test given x below 26 when presenter.getCellTitle is called, return correct value': function() {
        var result1 = this.presenter.getCellTitle(0, 0);
        var result2 = this.presenter.getCellTitle(10, 0);
        var result3 = this.presenter.getCellTitle(11, 5);
        var result4 = this.presenter.getCellTitle(25, 25);


        assertEquals("A 1", result1);
        assertEquals("K 1", result2);
        assertEquals("L 6", result3);
        assertEquals("Z 26", result4);
    },

    'test given x at or above 26 when presenter.getCellTitle is called, return correct value': function() {
        var result1 = this.presenter.getCellTitle(26, 0);
        var result2 = this.presenter.getCellTitle(52, 0);
        var result3 = this.presenter.getCellTitle(27, 0);
        var result4 = this.presenter.getCellTitle(54, 0);


        assertEquals("A A 1", result1);
        assertEquals("B A 1", result2);
        assertEquals("A B 1", result3);
        assertEquals("B C 1", result4);
    }
});
