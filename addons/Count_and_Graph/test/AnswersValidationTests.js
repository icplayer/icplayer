TestCase("Answers validation", {
    setUp: function () {
        this.presenter = AddonCount_and_Graph_create();
        this.presenter.configuration = {
            isDecimalSeparatorSet: false
        };

        this.model = {
            "Background color": "",
            "Bars width": "40",
            "Border": "",
            "Grid line color": "",
            "ID": "Count_and_Graph1",
            "X axis data": [
                { "Answer": "1", "Color": "pink", "Description": "a", "Description image": "" },
                { "Answer": "2", "Color": "pink", "Description": "a", "Description image": "" },
                { "Answer": "3", "Color": "pink", "Description": "a", "Description image": "" },
                { "Answer": "4", "Color": "pink", "Description": "a", "Description image": "" }
            ],
            "X axis description": "",
            "Y axis description": "",
            "Y axis maximum value": "5",
            "Y axis values": ""
        }
    },

    'test invalid one of the answers' : function () {
        this.model["X axis data"][1]["Answer"] = "nan";

        var validatedAnswers = this.presenter.validateModel(this.model);

        assertFalse(validatedAnswers.isValid);
        assertEquals('ANSWER_NOT_NUMERIC', validatedAnswers.errorCode);
    },

    'test non empty answer' : function () {
        this.model["X axis data"][1]["Answer"] = "";

        var validatedAnswers = this.presenter.validateModel(this.model);

        assertFalse(validatedAnswers.isValid);
        assertEquals('ANSWER_NOT_NUMERIC', validatedAnswers.errorCode);
    }
});