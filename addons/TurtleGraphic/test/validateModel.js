TestCase("validateCorrectCode", {
    setUp: function () {
        this.turtleGraphic = AddonTurtleGraphic_create();
    },


    'test emptyCorrectCode should return null value': function () {
        var model = {
            "correctCode": ""
        };

        var result = this.turtleGraphic.validateCorrectCode(model);


        assertTrue(result.isValid);
        assertNull(result.value);

        model["correctCode"] = "                " +
            "";

        result = this.turtleGraphic.validateCorrectCode(model);

        assertTrue(result.isValid);
        assertNull(result.value);
    },

    'test non empty correct code should return provided code': function () {
        var expectedValue = "fd 10" +
            "lt 90";

        var model = {
            "correctCode": expectedValue
        };

        var result = this.turtleGraphic.validateCorrectCode(model);

        assertTrue(result.isValid);
        assertNotNull(result.value);
        assertEquals(expectedValue, result.value);
    }
});