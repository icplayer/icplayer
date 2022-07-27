TestCase("[Magic Boxes] Serialization", {
    setUp: function () {
        this.presenter = AddonMagic_Boxes_create();
    },

    'test empty serialized array': function () {
        var gridSelection = [
            [false, false],
            [false, false]
        ];

        var serializationResult = this.presenter.serializeGridSelection(gridSelection, 2, 2);

        assertEquals("", serializationResult);
    },
    
    'test proper serialization': function () {
        var gridSelection = [
            [false, true, false], 
            [true, false, true],
            [false, false, true]
        ];
        
        var serializationResult = this.presenter.serializeGridSelection(gridSelection, 3, 3);
        
        assertEquals("1,3,5,8", serializationResult); 
    },
    
    'test empty deserialization': function () {
        var serializedArray = "";
        
        var deserializationResult = this.presenter.deserialiseGridSelection(serializedArray);
        
        assertArray(deserializationResult);
        assertEquals(0, deserializationResult.length);
    },
    
    'test proper deserialization': function () {
        var serializedArray = "1,3,5,8";
        
        var deserializationResult = this.presenter.deserialiseGridSelection(serializedArray);
        
        assertArray(deserializationResult);
        assertEquals(4, deserializationResult.length);
        assertEquals([1, 3, 5, 8], deserializationResult);
    }
});