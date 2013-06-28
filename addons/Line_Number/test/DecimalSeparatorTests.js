TestCase("Decimal Separator Tests", {
    setUp: function () {
        this.presenter = AddonLine_Number_create();

    },

    'test an empty string will set decimal separator to a dot': function() {
        var separator = this.presenter.validateDecimalSeparator('');

        assertEquals('.', separator.value);
    },

    'test that a semicolon as decimal separator should rise an error': function() {
        var separator = this.presenter.validateDecimalSeparator(';');

        assertFalse(separator.isValid);
        assertEquals('DSE01', separator.errorCode);
    },

    'test that a semicolon with whitespaces as decimal separator should rise an error': function() {
        var separator = this.presenter.validateDecimalSeparator(';         ');

        assertFalse(separator.isValid);
        assertEquals('DSE01', separator.errorCode);
    },

    'test validateValueWithSeparator true' : function() {
        var validated = this.presenter.validateValueWithSeparator('1r22', 'r');

        assertTrue(validated.isValid);
        assertEquals('1.22', validated.value);
    },

    'test validateValueWithSeparator false' : function() {
        var validated = this.presenter.validateValueWithSeparator('1r22', '.');

        assertFalse(validated.isValid);
    },

    'test validateValueWithSeparator when value is lower than 0' : function() {
        var validated = this.presenter.validateValueWithSeparator('-1r22', 'r');

        assertTrue(validated.isValid);
        assertEquals('-1.22', validated.value);
    },

    'test validateValueWithSeparator when separator is spacial character' : function() {
        var validated = this.presenter.validateValueWithSeparator('-1+22', '+');

        assertTrue(validated.isValid);
        assertEquals('-1.22', validated.value);
    },

    'test ranges with custom separator' : function() {
        var ranges = '<1r2; 1r5); 1';
        var separator = 'r';

        var validated = this.presenter.validateRanges(ranges, separator);

        assertEquals('', validated.errorCode);
        assertFalse(validated.isError);
    }

});