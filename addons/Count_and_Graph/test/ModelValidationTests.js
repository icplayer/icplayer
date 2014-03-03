TestCase("Model validation", {
    setUp: function () {
        this.presenter = AddonCount_and_Graph_create();

        this.model = {
            "Background color": "",
            "Bars width": "40",
            "Border": "",
            "Grid line color": "",
            "ID": "Count_and_Graph1",
            "X axis data": [
                { "Answer": "1", "Color": "pink", "Description": "", "Description image": "" },
                { "Answer": "2", "Color": "pink", "Description": "", "Description image": "" },
                { "Answer": "3", "Color": "pink", "Description": "", "Description image": "" },
                { "Answer": "4", "Color": "pink", "Description": "", "Description image": "" }
            ],
            "X axis description": "",
            "Y axis description": "",
            "Y axis maximum value": "5",
            "Y axis values": "",
            "Is Visible": "True"
        }
    },

    'test proper model' : function () {
        var validationResult = this.presenter.validateModel(this.model);

        assertTrue(validationResult.isValid);
        assertUndefined(validationResult.errorCode);
        assertEquals('Count_and_Graph1', validationResult.ID);
        assertEquals(5, validationResult.axisYMaximumValue);
        assertTrue(validationResult.isVisible);
    },

    'test Y axis maximum value invalid' : function () {
        this.model["Y axis maximum value"] = "nan";

        var validationResult = this.presenter.validateModel(this.model);

        assertFalse(validationResult.isValid);
        assertEquals('AXIS_Y_MAXIMUM_VALUE_NOT_NUMERIC', validationResult.errorCode);
    },

    'test Y axis values and NaN value' : function () {
        this.model["Y axis values"] = "1;2;troll;4;5";

        var validationResult = this.presenter.validateModel(this.model);

        assertFalse(validationResult.isValid);
        assertEquals('YV01', validationResult.errorCode);
    }
});