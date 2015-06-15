TestCase("[Commons - States Serialization] Deserialize method tests", {
    'test undefined': function() {
        // Given

        // When
        var state = Serialization.deserialize(undefined);

        // Then
        assertUndefined(state);
    },

    'test empty string' : function() {
        // Given
        var stateString = "";

        // When
        var state = Serialization.deserialize(stateString);

        // Then
        assertUndefined(state);
    },

    'test string with one pair key:type:value' : function() {
        // Given
        var expectedState = {
            "test" : "test"
        };
        var stateString = "[test:string:test]"

        // When
        var state = Serialization.deserialize(stateString);

        // Then
        assertEquals("", expectedState, state);
    },

    'test string with different pairs key:type:value' : function() {
        // Given
        var expectedState = {
            "string" : "test",
            "int" : 1,
            "float" : 1.23,
            "array" : [1,2,3],
            "boolean" : false
        };
        var stateString = "[string:string:test][int:number:1][float:number:1.23][array:array:1-number,2-number,3-number][boolean:boolean:false]";

        // When
        var state = Serialization.deserialize(stateString);

        // Then
        assertEquals("", expectedState, state);
    },

    'test string with different type of arrays' : function() {
        // Given
        var expectedState = {
            "arrayBoolean" : [true, false],
            "arrayString" : ["test", "testing"],
            "arrayInt" : [1,2,3],
            "arrayFloat" : [1.2, 1.3, 1.5],
            "mixed" : [1, "2", true]
        };
        var stateString = "[arrayBoolean:array:true-boolean,false-boolean]" +
            "[arrayString:array:test-string,testing-string]" +
            "[arrayInt:array:1-number,2-number,3-number]" +
            "[arrayFloat:array:1.2-number,1.3-number,1.5-number]" +
            "[mixed:array:1-number,2-string,true-boolean]";

        // When
        var state = Serialization.deserialize(stateString);

        // Then
        assertEquals("", expectedState, state);
    }


});