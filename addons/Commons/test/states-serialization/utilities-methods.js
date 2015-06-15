TestCase("[Commons - States Serialization] Utilities methods tests", {
    'test isInteger method': function() {
        // Given
        var integer = 1;
        var bigInteger = 1000000000000;
        var stringInteger = "1";
        var floatNumber = 1.2;
        var smallFloat = 0.00000000000001;
        var stringFloat = "1.2";
        var string = "dwa";
        var undefinedValue = undefined;
        var nullValue = null;

        // When -> Then
        assertTrue("", Serialization.isInteger(integer));
        assertTrue("", Serialization.isInteger(bigInteger));
        assertTrue("", Serialization.isInteger(stringInteger));
        assertFalse("", Serialization.isInteger(floatNumber));
        assertFalse("", Serialization.isInteger(smallFloat));
        assertFalse("", Serialization.isInteger(stringFloat));
        assertFalse("", Serialization.isInteger(string));
        assertFalse("", Serialization.isInteger(undefinedValue));
        assertFalse("", Serialization.isInteger(nullValue));
    },

    'test convertArray method': function() {
        // Given
        var expectedArrayStrings = ["one", "two", "three"];
        var expectedArrayIntegers = [1, 2, 3];
        var expectedArrayFloats = [1.2, 2.3, 3.4];
        var expectedArrayBooleans = [false, true, false];

        // When
        var arrayStrings = Serialization.convertArray("one-string, two-string, three-string");
        var arrayIntegers = Serialization.convertArray("1-number, 2-number, 3-number");
        var arrayFloats = Serialization.convertArray("1.2-number, 2.3-number, 3.4-number");
        var arrayBooleans = Serialization.convertArray("false-boolean, true-boolean, false-boolean");

        // Then
        assertEquals("", expectedArrayStrings, arrayStrings);
        assertEquals("", expectedArrayIntegers, arrayIntegers);
        assertEquals("", expectedArrayFloats, arrayFloats);
        assertEquals("", expectedArrayBooleans, arrayBooleans);
    },

    'test convert method with type object' : function() {
        // Given
        var expectedResult = "This type of value is unrecognized.";

        // When
        var result = Serialization.convert("Object", "object");

        // Then
        assertEquals("", expectedResult, result);
    }

});