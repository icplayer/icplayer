TestCase("Utils and helpers", {
    setUp: function() {
        this.presenter = AddonPlot_create();
    },
    'test isCorrectDecimal with ,': function() {
        this.presenter.decimalSeparator = ',';

        assertFalse(this.presenter.isCorrectDecimal(3.5));
        assertFalse(this.presenter.isCorrectDecimal('3.5'));
        assertFalse(this.presenter.isCorrectDecimal('-3.5'));
        assertFalse(this.presenter.isCorrectDecimal(-3.5));
        assertTrue(this.presenter.isCorrectDecimal('3,5'));
        assertTrue(this.presenter.isCorrectDecimal('-3,5'));
    },
    'test isCorrectDecimal with .': function() {
        this.presenter.decimalSeparator = '.';

        assertTrue(this.presenter.isCorrectDecimal(3.5));
        assertTrue(this.presenter.isCorrectDecimal('3.5'));
        assertTrue(this.presenter.isCorrectDecimal('-3.5'));
        assertTrue(this.presenter.isCorrectDecimal(-3.5));
        assertFalse(this.presenter.isCorrectDecimal('3,5'));
        assertFalse(this.presenter.isCorrectDecimal('-3,5'));
    },
    'test isCorrectDecimal with null': function() {
        this.presenter.decimalSeparator = '.';

        assertFalse(this.presenter.isCorrectDecimal(null));
        assertFalse(this.presenter.isCorrectDecimal(''));
    },
    'test value to float convert with . separator': function() {
        this.presenter.decimalSeparator = '.';

        assertEquals(3.5, this.presenter.valueToFloat(3.5));
        assertEquals(-3.5, this.presenter.valueToFloat(-3.5));
        assertEquals(-3.0, this.presenter.valueToFloat(-3));
        assertEquals(3.5, this.presenter.valueToFloat('3.5'));
        assertEquals(-3.5, this.presenter.valueToFloat('-3.5'));
    },
    'test value to float convert with , separator': function() {
        this.presenter.decimalSeparator = ',';

        assertEquals(3.5, this.presenter.valueToFloat('3,5'));
        assertEquals(-3.5, this.presenter.valueToFloat('-3,5'));
        assertEquals(3.0, this.presenter.valueToFloat('3'));
    },
    'test value to float convert with wrong separator': function() {
        this.presenter.decimalSeparator = '.';

        assertTrue(isNaN(this.presenter.valueToFloat('2,5')));
        assertTrue(isNaN(this.presenter.valueToFloat('-2,5')));
    },
    'test value to float convert with NaN': function() {
        this.presenter.decimalSeparator = '.';

        assertTrue(isNaN(this.presenter.valueToFloat('a')));
        assertTrue(isNaN(this.presenter.valueToFloat('')));
        assertTrue(isNaN(this.presenter.valueToFloat(null)));
        assertTrue(isNaN(this.presenter.valueToFloat(undefined)));
        assertTrue(isNaN(this.presenter.valueToFloat(Number.NaN)));
    },
    'test value to float convert with 0': function() {
        this.presenter.decimalSeparator = '.';

        assertEquals(0, this.presenter.valueToFloat(0));
        assertEquals(0, this.presenter.valueToFloat('0'));
    }
});