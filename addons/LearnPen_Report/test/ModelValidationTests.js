TestCase("[LearnPen_Report] Model validation", {

    setUp: function() {
        this.presenter = AddonLearnPen_Report_create();

        this.model = {
            "ID": "LearnPen_Report1",
            "Is Visible": "True",
            "Width": "123",
            "Height": "456",

            "colors": "",
            "correctRange": "",
            "sensor": "Squeeze",
            "dataUpdateInterval": "",
            "isDisable": ""
        };
    },

    'test proper model': function() {
        var validatedModel = this.presenter.validateModel(this.model);

        assertTrue(validatedModel.isValid);
        assertEquals("LearnPen_Report1", validatedModel.ID);
        assertEquals(123, validatedModel.width);
        assertEquals(456, validatedModel.height);

        assertTrue(validatedModel.isVisible);
        assertFalse(validatedModel.isDisable);
        assertEquals({ start : 40, end : 80 }, validatedModel.range);
        assertEquals("SQUEEZE", validatedModel.sensor);
        assertEquals({ above: "red", correct: "green", below: "yellow" }, validatedModel.colors);
        assertEquals(100, validatedModel.updateTime);
    },

    'test RANGE wrong number of elements': function() {
        var validatedModel;

        this.model.correctRange = "1;2;3";
        validatedModel = this.presenter.validateModel(this.model);
        assertFalse(validatedModel.isValid);
        assertEquals("R01", validatedModel.errorCode);

        this.model.correctRange = "1";
        validatedModel = this.presenter.validateModel(this.model);
        assertFalse(validatedModel.isValid);
        assertEquals("R01", validatedModel.errorCode);
    },

    'test RANGE non numeric value': function() {
        this.model.correctRange = "1;asd";
        var validatedModel = this.presenter.validateModel(this.model);

        assertFalse(validatedModel.isValid);
        assertEquals("R02", validatedModel.errorCode);
    },

    'test RANGE below 0 and above 100': function() {
        var validatedModel;

        this.model.correctRange = "1;101";
        validatedModel = this.presenter.validateModel(this.model);
        assertFalse(validatedModel.isValid);
        assertEquals("R03", validatedModel.errorCode);

        this.model.correctRange = "1;-1";
        validatedModel = this.presenter.validateModel(this.model);
        assertFalse(validatedModel.isValid);
        assertEquals("R03", validatedModel.errorCode);
    },

    'test RANGE 1st value is bigger then 2nd': function() {
        this.model.correctRange = "50;25";
        var validatedModel = this.presenter.validateModel(this.model);

        assertFalse(validatedModel.isValid);
        assertEquals("R04", validatedModel.errorCode);
    },

    'test COLORS wrong number of arguments': function() {
        var validatedModel;

        this.model.colors = "red;red";
        validatedModel = this.presenter.validateModel(this.model);
        assertFalse(validatedModel.isValid);
        assertEquals("C01", validatedModel.errorCode);

        this.model.colors = "green;green;green;green";
        validatedModel = this.presenter.validateModel(this.model);
        assertFalse(validatedModel.isValid);
        assertEquals("C01", validatedModel.errorCode);
    },

    'test INTERVAL non numeric value': function() {
        this.model.dataUpdateInterval = "qwe";
        var validatedModel = this.presenter.validateModel(this.model);

        assertFalse(validatedModel.isValid);
        assertEquals("I01", validatedModel.errorCode);
    },

    'test INTERVAL value above 2000 or below 0': function() {
        var validatedModel;

        this.model.dataUpdateInterval = "2001";
        validatedModel = this.presenter.validateModel(this.model);
        assertFalse(validatedModel.isValid);
        assertEquals("I02", validatedModel.errorCode);

        this.model.dataUpdateInterval = "-1";
        validatedModel = this.presenter.validateModel(this.model);
        assertFalse(validatedModel.isValid);
        assertEquals("I02", validatedModel.errorCode);
    }

});