TestCase("[Graph]  Create Y axis values validation", {
    setUp: function () {
        this.presenter = Addongraph_create();
    },

    'test valid values': function () {
        var fixedValues = [0, 1, 2];
        var cyclicValues = [5];
        var yMax = 20;
        var yMin = -20;
        var values = this.presenter.createAxisYValues(fixedValues, cyclicValues, yMax, yMin);

        assertEquals([0, 1, 2, 5, 10, 15, 20, -5, -10, -15, -20], values);
    },

    'test testing cyclic values only': function () {
        var cyclicValues = [5];
        var yMax = 20;
        var yMin = -20;
        var values = this.presenter.createAxisYValues(undefined, cyclicValues, yMax, yMin);

        assertEquals([5, 10, 15, 20, -5, -10, -15, -20], values);
    },

    'test testing cyclic&fixed values without zero': function () {
        var cyclicValues = [5];
        var fixedValues = [-3, 6, 9];
        var yMax = 20;
        var yMin = -20;
        var values = this.presenter.createAxisYValues(fixedValues, cyclicValues, yMax, yMin);

        assertEquals([-3, 6, 9, 5, 10, 15, 20, -5, -10, -15, -20], values);
    },

    'test testing cyclic values greater than y max': function () {
        // In backward compatibility Y grid step allows for greater than Y max values, but it shows nothing on grid &&
        // Y axis

        var cyclicValues = [100];
        var fixedValues = undefined;
        var yMax = 20;
        var yMin = -20;
        var values = this.presenter.createAxisYValues(fixedValues, cyclicValues, yMax, yMin);

        assertEquals([], values);
    },

    'test testing cyclic & fixed values undefined': function () {
        // In backward compatibility Y grid step allows for greater than Y max values, but it shows nothing on grid &&
        // Y axis

        var cyclicValues = undefined;
        var fixedValues = undefined;
        var yMax = 20;
        var yMin = -20;
        this.presenter.configuration = {axisYGridStep: 5};
        var values = this.presenter.createAxisYValues(fixedValues, cyclicValues, yMax, yMin);

        assertEquals([5, 10, 15, 20, -5, -10, -15, -20], values);
    }
});

TestCase("[Graph]  Float validation", {
    setUp: function () {
        this.presenter = Addongraph_create();
    },

    'test valid int input': function () {
        var number = "5";
        var validatedNumber = this.presenter.isFloat(number);

        assertTrue(validatedNumber);
    },

    'test valid float input': function () {
        var number = "5.123";
        var validatedNumber = this.presenter.isFloat(number);

        assertTrue(validatedNumber);

        number = "0.53215214321";
        validatedNumber = this.presenter.isFloat(number);

        assertTrue(validatedNumber);

    },

    'test valid negative float input': function () {
        var number = "-5.123";
        var validatedNumber = this.presenter.isFloat(number);

        assertTrue(validatedNumber);

        number = "-0.53215214321";
        validatedNumber = this.presenter.isFloat(number);

        assertTrue(validatedNumber);

        number = "-12893";
        validatedNumber = this.presenter.isFloat(number);

        assertTrue(validatedNumber);

    },

    'test valid float input, zero number': function () {
        var number = "0";
        var validatedNumber = this.presenter.isFloat(number);

        assertTrue(validatedNumber);
    },

    'test invalid float input, invalid zeros': function () {
        var number = "+0";
        var validatedNumber = this.presenter.isFloat(number);

        assertFalse(validatedNumber);

        number = "-0";
        validatedNumber = this.presenter.isFloat(number);

        assertFalse(validatedNumber);
    },

    'test invalid input, too many zeroes': function () {
        var number = "00000001237190321.42132";
        var validatedNumber = this.presenter.isFloat(number);

        assertFalse(validatedNumber);
    },

    'test invalid input, strings with digits': function () {
        var number = "2l45y8qwdwfhap78w34p9yuah3lsjfcvsda";
        var number1 = "djhcasdzlhasdluysdf12093dfsa";
        var number2 = "2l45y8qw          dwfhap78w34          p9yuah3lsjfcvsda";
        var number3 = "       2l45y8q       wdwfhap78w34p9yuah3lsjfcvsda           ";

        var validatedNumber = this.presenter.isFloat(number);
        var validatedNumber1 = this.presenter.isFloat(number1);
        var validatedNumber2 = this.presenter.isFloat(number2);
        var validatedNumber3 = this.presenter.isFloat(number3);

        assertFalse(validatedNumber);
        assertFalse(validatedNumber1);
        assertFalse(validatedNumber2);
        assertFalse(validatedNumber3);
    },

    'test invalid input, float with too many dots': function () {
        var number = "0.12321321.45324532";
        var number1 = "-12312321.1232132.1321321";

        var validatedNumber = this.presenter.isFloat(number);
        var validatedNumber1 = this.presenter.isFloat(number1);

        assertFalse(validatedNumber);
        assertFalse(validatedNumber1);
    }
});
