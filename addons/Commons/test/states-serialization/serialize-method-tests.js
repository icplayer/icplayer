TestCase("[Commons - States Serialization] Serialize method tests", {
    'test undefined': function() {
        // Given

        // When
        var stateString = Serialization.serialize(undefined);

        // Then
        assertUndefined(stateString);
    },

    'test empty object' : function() {
        // Given
        var state = {};
        var expectedStateString = "";

        // When
        var stateString = Serialization.serialize(state);

        // Then
        assertEquals("", expectedStateString, stateString);
    },

    'test object with one property' : function() {
        // Given
        var state = {
            "test" : "test"
        };
        var expectedStateString = "[test:string:test]";

        // When
        var stateString = Serialization.serialize(state);

        // Then
        assertEquals("", expectedStateString, stateString);
    },

    'test object with different type properties' : function() {
        // Given
        var state = {
            "string" : "test",
            "int" : 1,
            "float" : 1.23,
            "array" : [1,2,3],
            "boolean" : false,
            "mixed" : [1, "2", true]
        };
        var expectedStateString = "[string:string:test]" +
            "[int:number:1]" +
            "[float:number:1.23]" +
            "[array:array:1-number,2-number,3-number]" +
            "[boolean:boolean:false]" +
            "[mixed:array:1-number,2-string,true-boolean]";

        // When
        var stateString = Serialization.serialize(state);

        // Then
        assertEquals("", expectedStateString, stateString);
    }


});