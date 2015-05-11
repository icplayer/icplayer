TestCase("[Line number] Utilities value in range validation", {

    setUp: function () {
        this.presenter = AddonLine_Number_create();
        this.presenter.configuration = { drawnRangesData: { ranges: [] } };
        this.presenter.configuration.drawnRangesData.ranges = [
            {
                start: { value: -5, include: false },
                end: { value: 0, include: false }
            },
            {
                start: { value: -5, include: true },
                end: { value: 0, include: true }
            }
        ];

    },

    'test value -5 in range (-5, 0) should return false because -5 is excluded': function() {
        assertFalse('', this.presenter.isValueInRange(-5, this.presenter.configuration.drawnRangesData.ranges[0], true));
    },

    'test value -5 in range <-5, 0> should return true because -5 is included': function() {
        assertTrue('', this.presenter.isValueInRange(-5, this.presenter.configuration.drawnRangesData.ranges[1], true));
    },

    'test value -10 in range (-5, 0) should return false because -10 is out of range': function() {
        assertFalse('', this.presenter.isValueInRange(-10, this.presenter.configuration.drawnRangesData.ranges[0], true));
    },

    'test value -3 in range <-5, 0> should return true because -3 is in range': function() {
        assertTrue('', this.presenter.isValueInRange(-3, this.presenter.configuration.drawnRangesData.ranges[1], true));
    }

});

TestCase("[Line number] Find starting point in field validation", {
    setUp: function () {
        this.presenter = AddonLine_Number_create();
    },


    'test finding starting point in positive range, int numbers': function () {
        var result = this.presenter.findStartingPointInField(10, 30, 3);

        assertEquals({startingPoint: 12, fieldEnd: 30}, result);
    },

    'test finding starting point in positive range, float numbers': function () {
        var result = this.presenter.findStartingPointInField(11.9, 33.4, 3.5);

        assertEquals({startingPoint: 14, fieldEnd: 33.4}, result);
    },

    'test finding starting point in negative range, float numbers': function () {
        var result = this.presenter.findStartingPointInField(-33.4, -11.9, 3.5);

        assertEquals({startingPoint: -14, fieldEnd: -33.4}, result);

        result = this.presenter.findStartingPointInField(-27.4, -8.8, 5);

        assertEquals({startingPoint: -10, fieldEnd: -27.4}, result);
    },

    'test checking precision of calculations': function () {
        var result = this.presenter.findStartingPointInField(-21, -12, 4.2);

        assertEquals({startingPoint: -12.6, fieldEnd: -21}, result);
    }

});

TestCase("[Line number] Zero in range validation", {
    setUp: function () {
        this.presenter = AddonLine_Number_create();
    },

    'test range contains zero': function () {
        assertTrue(this.presenter.isZeroInRange(-10, 25));
        assertTrue(this.presenter.isZeroInRange(0, 25));
        assertTrue(this.presenter.isZeroInRange(-33.5, 25));
        assertTrue(this.presenter.isZeroInRange(-33.5, 0));
    },

    'test range dont contains zero': function () {
        assertFalse(this.presenter.isZeroInRange(-25, -5));
        assertFalse(this.presenter.isZeroInRange(10, 25));
        assertFalse(this.presenter.isZeroInRange(0.000009, 25));
        assertFalse(this.presenter.isZeroInRange(-33.5, -7.5));
        assertFalse(this.presenter.isZeroInRange(-33.5, -0.0000009));
    }
});

TestCase("[Line number] Get precision validation", {
    setUp: function () {
        this.presenter = AddonLine_Number_create();
    },

    'test float numbers precision': function () {
        assertEquals(3, this.presenter.getNumberPrecision(4.023));
        assertEquals(3, this.presenter.getNumberPrecision(-4.023));
        assertEquals(2, this.presenter.getNumberPrecision(-4.12));
        assertEquals(0, this.presenter.getNumberPrecision(-4.0));
        assertEquals(0, this.presenter.getNumberPrecision(-4.0));
        assertEquals(0, this.presenter.getNumberPrecision(4.0));
    },

    'test int numbers precision': function () {
        assertEquals(0, this.presenter.getNumberPrecision(4));
        assertEquals(0, this.presenter.getNumberPrecision(-4));
        assertEquals(0, this.presenter.getNumberPrecision(-12));
        assertEquals(0, this.presenter.getNumberPrecision(-25));
        assertEquals(0, this.presenter.getNumberPrecision(12312));
        assertEquals(0, this.presenter.getNumberPrecision(1));
    }

});

TestCase("[Line number] Number to precision validation", {
    setUp: function () {
        this.presenter = AddonLine_Number_create();
    },

    'test checking proper float precision changing' : function () {
        assertEquals(0.3, this.presenter.changeNumberToPrecision(0.30000000000000004, 1));
        assertEquals(0, this.presenter.changeNumberToPrecision(0.30000000000000004, 0));
        assertEquals(-12.6, this.presenter.changeNumberToPrecision(-12.600000000000001, 1));
        assertEquals(23.602, this.presenter.changeNumberToPrecision(23.602000043200000001, 3));
        assertEquals(23, this.presenter.changeNumberToPrecision(23.602000043200000001, 0));
        assertEquals(23, this.presenter.changeNumberToPrecision(23.0000001, 2));
    },

    'test checking proper int precision changing': function () {
        assertEquals(5, this.presenter.changeNumberToPrecision(5, 1));
        assertEquals(5, this.presenter.changeNumberToPrecision(5, 2));
        assertEquals(-3, this.presenter.changeNumberToPrecision(-3, 0));
        assertEquals(-123, this.presenter.changeNumberToPrecision(-123, 4));
    }
});

TestCase("[Line number] max validation", {
    setUp: function () {
        this.presenter = AddonLine_Number_create();
    },

    'test int arrays, positive numbers': function () {
        var myArray = [1, 2, 3, 4, 5, 6, 7];
        assertEquals(7, this.presenter.maxFromArray(myArray));

        myArray = [12, 4321 , 3, 4, 5, 6, 7];
        assertEquals(4321, this.presenter.maxFromArray(myArray));

        myArray = [12, 4321 , 32314, 142341, 654325, 643236, 999999999999997];
        assertEquals(999999999999997, this.presenter.maxFromArray(myArray));
    },

    'test int arrays, negative numbers': function () {
        var myArray = [-1, -2, -3, -4, -5, -6, -7];
        assertEquals(-1, this.presenter.maxFromArray(myArray));

        myArray = [-12, -4321 , -3, -4, -5, -6, -7];
        assertEquals(-3, this.presenter.maxFromArray(myArray));

        myArray = [-12, -4321 , -32314, -142341, -654325, -643236, -999999999999997];
        assertEquals(-12, this.presenter.maxFromArray(myArray));
    },

    'test int arrays, mixed numbers': function () {
        var myArray = [-123, 124, 5432, 0, 123, -1928371];
        assertEquals(5432, this.presenter.maxFromArray(myArray));
    },

    'test float arrays, mixed numbers': function () {
        var myArray = [-123.12391, 124.02, 5432.123, 0, 123.2342, -1928371];
        assertEquals(5432.123, this.presenter.maxFromArray(myArray));
    },

    'test one element arrays': function () {
        var myArray = [1];
        assertEquals(1, this.presenter.maxFromArray(myArray));

        myArray = [-1.123];
        assertEquals(-1.123, this.presenter.maxFromArray(myArray));

        myArray = [0];
        assertEquals(0, this.presenter.maxFromArray(myArray));
    },

    'test empty arrays': function () {
        var myArray = [];
        try {
            assertException(this.presenter.maxFromArray(myArray), "ValueError: maxFromArray() arg is an empty array");
        } catch (_) {
            return;
        }
    }
});

TestCase("[Line number] min validation", {
    setUp: function () {
        this.presenter = AddonLine_Number_create();
    },

    'test int arrays, positive numbers': function () {
        var myArray = [1, 2, 3, 4, 5, 6, 7];
        assertEquals(1, this.presenter.minFromArray(myArray));

        myArray = [12, 4321 , 3, 4, 5, 6, 7];
        assertEquals(3, this.presenter.minFromArray(myArray));

        myArray = [12, 4321 , 32314, 142341, 654325, 643236, 999999999999997];
        assertEquals(12, this.presenter.minFromArray(myArray));
    },

    'test int arrays, negative numbers': function () {
        var myArray = [-1, -2, -3, -4, -5, -6, -7];
        assertEquals(-7, this.presenter.minFromArray(myArray));

        myArray = [-12, -4321 , -3, -4, -5, -6, -7];
        assertEquals(-4321, this.presenter.minFromArray(myArray));

        myArray = [-12, -4321 , -32314, -142341, -654325, -643236, -999999999999997];
        assertEquals(-999999999999997, this.presenter.minFromArray(myArray));
    },

    'test int arrays, mixed numbers': function () {
        var myArray = [-123, 124, 5432, 0, 123, -1928371];
        assertEquals(-1928371, this.presenter.minFromArray(myArray));
    },

    'test float arrays, mixed numbers': function () {
        var myArray = [-123.12391, 124.02, 5432.123, 0, 123.2342, -1928371];
        assertEquals(-1928371, this.presenter.minFromArray(myArray));
    },

    'test one element arrays': function () {
        var myArray = [1];
        assertEquals(1, this.presenter.minFromArray(myArray));

        myArray = [-1.123];
        assertEquals(-1.123, this.presenter.minFromArray(myArray));

        myArray = [0];
        assertEquals(0, this.presenter.minFromArray(myArray));
    },

    'test empty arrays': function () {
        var myArray = [];
        try {
            assertException(this.presenter.minFromArray(myArray), "ValueError: minFromArray() arg is an empty array");
        } catch (_) {
            return;
        }
    }
});

TestCase("[Line number] Create axis X custom values", {
    setUp: function () {
        this.presenter = AddonLine_Number_create();
        this.inArray = function(element) {
            if (this.indexOf(element) == -1) {
                return false;
            }
            return true;
        };
    },

    'test creating only from int fixed values': function () {
        this.presenter.configuration = {
            axisXValues: {cyclicValues: [], fixedValues: [1, 5, 10]},
            min: -10,
            max: 10
        };

        var expectedResult = [1, 5, 10];

        var result = this.presenter.createAxisXCustomValues();

        assertTrue(expectedResult.every(this.inArray, result));
    },

    'test creating only from float fixed values': function () {
        this.presenter.configuration = {
            axisXValues: {cyclicValues: [], fixedValues: [1.032, 5.45, 10.1023]},
            min: -10,
            max: 10
        };

        var expectedResult = [1.032, 5.45, 10.1023];

        var result = this.presenter.createAxisXCustomValues();

        assertTrue(expectedResult.every(this.inArray, result));
    },

    'test creating only from int cyclic values 1': function () {
        this.presenter.configuration = {
            axisXValues: {cyclicValues: [2], fixedValues: []},
            min: -10,
            max: 10
        };

        var expectedResult = [0, 2, 4, 6, 8, 10, -2, -4, -6, -8, -10];

        var result = this.presenter.createAxisXCustomValues();

        assertTrue(expectedResult.every(this.inArray, result));
    },

    'test creating only from int cyclic values 2': function () {
        this.presenter.configuration = {
            axisXValues: {cyclicValues: [2, 3], fixedValues: []},
            min: -10,
            max: 10
        };

        var expectedResult = [0, 2, 4, 6, 8, 10, -2, -4, -6, -8, -10, 3, 9, -3, -9];

        var result = this.presenter.createAxisXCustomValues();

        assertEquals(expectedResult.length, result.length);
        assertTrue(expectedResult.every(this.inArray, result));
    },

    'test creating only from float cyclic values': function () {
        this.presenter.configuration = {
            axisXValues: {cyclicValues: [4.2], fixedValues: []},
            min: -25,
            max: 25
        };

        var expectedResult = [0, 4.2, 8.4, 12.6, 16.8, 21, -4.2, -8.4, -12.6, -16.8, -21];

        var result = this.presenter.createAxisXCustomValues();

        assertTrue(expectedResult.every(this.inArray, result));
    },

    'test numbers': function () {
        this.presenter.configuration = {
            axisXValues: {cyclicValues: [4.2], fixedValues: [10, 15, 22]},
            min: -25,
            max: 25
        };

        var expectedResult = [10, 15, 22, 0, 4.2, 8.4, 12.6, 16.8, 21, -4.2, -8.4, -12.6, -16.8, -21];

        var result = this.presenter.createAxisXCustomValues();

        assertTrue(expectedResult.every(this.inArray, result));
    },

    'test maxElement': function() {
        assertEquals(4, this.presenter.maxElement([1, 2, 3, 4]));
        assertEquals(3, this.presenter.maxElement([1, 2, 3]));
        assertEquals(Infinity, this.presenter.maxElement([Infinity, -4 , 0]));
        assertEquals(Infinity, this.presenter.maxElement([-Infinity, Infinity]));

        assertEquals('4', this.presenter.maxElement(['1', '2', '3', '4']));

        //assertException(this.presenter.maxElement([]), "Empty array");
    }
});
