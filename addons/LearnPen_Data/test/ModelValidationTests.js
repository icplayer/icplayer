TestCase("[LearnPen_Data] Model validation", {

    setUp: function() {
        this.presenter = AddonLearnPen_Data_create();

        this.model = {
            "ID": "LearnPen_Data1",
            "Is Visible": "True",
            "isDisable": "",
            "stepsAndColors": "",
            "refreshTime": ""
        };
    },

    tearDown: function() { },

    'test proper model': function() {
        var validatedModel = this.presenter.validateModel(this.model);

        assertEquals("LearnPen_Data1", validatedModel.id);
        assertTrue(validatedModel.isVisible);
        assertFalse(validatedModel.isDisable);
        assertEquals(100, validatedModel.refreshTime);

        assertEquals("#ffff00", validatedModel.stepsAndColors.a[2].color);
        assertEquals(32, validatedModel.stepsAndColors.a[3].value);
        assertEquals("#008000", validatedModel.stepsAndColors.b[4].color);
        assertEquals(40, validatedModel.stepsAndColors.b[5].value);
        assertEquals("#008000", validatedModel.stepsAndColors.c[6].color);
        assertEquals(66, validatedModel.stepsAndColors.c[7].value);
        assertEquals("#ff0000", validatedModel.stepsAndColors.p[8].color);
        assertEquals(70, validatedModel.stepsAndColors.p[9].value);
    },

    'test correct custom steps and colors property': function() {
        function getStep(col, val) { return { color: col, value: val }; }

        this.model.stepsAndColors = "A \n\
             1%; yellow \n\
             2%; yellow \n\
             3%; yellow \n\
             4%; green \n\
             5%; green \n\
             6%; green \n\
             7%; green \n\
             8%; orange \n\
             9%; orange \n\
             10%; red \n\
             11%; red \n\
             12%; red \n\
             \n\
             B;C \n\
             20%; pink \n\
             35%; pink \n\
             50%; grey \n\
             60%; pink \n\
             70%; grey \n\
             75%; pink \n\
             80%; grey \n\
             \n\
             85%; pink \n\
             87%; grey \n\
             90%; pink \n\
             93%; grey \n\
             95%; pink \n\
             \n\
             P \n\
             20%; black \n\
             30%; black \n\
             40%; blue \n\
             50%; blue \n\
             60%; black \n\
             65%; blue \n\
             70%; blue \n\
             75%; blue \n\
             80%; blue \n\
             85%; blue \n\
             90%; blue \n\
             95%; purple";

        var expectedObjectResult = {
            a: [getStep("#ffff00", 1), getStep("#ffff00", 2), getStep("#ffff00", 3), getStep("#008000", 4), getStep("#008000", 5), getStep("#008000", 6), getStep("#008000", 7), getStep("#ffa500", 8), getStep("#ffa500", 9), getStep("#ff0000", 10), getStep("#ff0000", 11), getStep("#ff0000", 12)],
            b: [getStep("#ffc0cb", 20), getStep("#ffc0cb", 35), getStep("#808080", 50), getStep("#ffc0cb", 60), getStep("#808080", 70), getStep("#ffc0cb", 75), getStep("#808080", 80), getStep("#ffc0cb", 85), getStep("#808080", 87), getStep("#ffc0cb", 90), getStep("#808080", 93), getStep("#ffc0cb", 95)],
            c: [getStep("#ffc0cb", 20), getStep("#ffc0cb", 35), getStep("#808080", 50), getStep("#ffc0cb", 60), getStep("#808080", 70), getStep("#ffc0cb", 75), getStep("#808080", 80), getStep("#ffc0cb", 85), getStep("#808080", 87), getStep("#ffc0cb", 90), getStep("#808080", 93), getStep("#ffc0cb", 95)],
            p: [getStep("#000000", 20), getStep("#000000", 30), getStep("#0000ff", 40), getStep("#0000ff", 50), getStep("#000000", 60), getStep("#0000ff", 65), getStep("#0000ff", 70), getStep("#0000ff", 75), getStep("#0000ff", 80), getStep("#0000ff", 85), getStep("#0000ff", 90), getStep("#800080", 95)]
        };

        var validatedModel = this.presenter.validateModel(this.model);

        assertTrue(validatedModel.isValid);

        for (var sensor in expectedObjectResult) {
            for (var i=0; i<12; i++) {
                assertEquals(expectedObjectResult[sensor][i].color, validatedModel.stepsAndColors[sensor][i].color);
                assertEquals(expectedObjectResult[sensor][i].value, validatedModel.stepsAndColors[sensor][i].value);
            }
        }
    },

    'test missing sensor': function() {
        this.model.stepsAndColors = "100%;black\nB\n_\n_\n_\n_\n_\n_\n_\n_\n_\n_\n_";

        var validatedModel = this.presenter.validateModel(this.model);

        assertFalse(validatedModel.isValid);
        assertEquals('S01', validatedModel.errorCode);
    },

    'test sensors in new lines': function() {
        this.model.stepsAndColors = "A\nB\n_\n_\n_\n_\n_\n_\n_\n_\n_\n_\n_";

        var validatedModel = this.presenter.validateModel(this.model);

        assertFalse(validatedModel.isValid);
        assertEquals('S02', validatedModel.errorCode);
    },

    'test wrong step and color value': function() {
        this.model.stepsAndColors = "A\n%1000;blablabla\n_\n_\n_\n_\n_\n_\n_\n_\n_\n_";

        var validatedModel = this.presenter.validateModel(this.model);

        assertFalse(validatedModel.isValid);
        assertEquals('S02', validatedModel.errorCode);
    },

    'test values non descent order': function() {
        this.model.stepsAndColors = "A\n100%;black\n50%;black\n10%;black\n_\n_\n_\n_\n_\n_\n_\n_\n_";

        var validatedModel = this.presenter.validateModel(this.model);

        assertFalse(validatedModel.isValid);
        assertEquals('S03', validatedModel.errorCode);
    },

    'test refresh time below 50': function() {
        this.model.refreshTime = "2001";
        var validatedModel = this.presenter.validateModel(this.model);

        assertFalse(validatedModel.isValid);
        assertEquals("T01", validatedModel.errorCode);
    },

    'test refresh time over 2000': function() {
        this.model.refreshTime = "49";
        var validatedModel = this.presenter.validateModel(this.model);

        assertFalse(validatedModel.isValid);
        assertEquals("T01", validatedModel.errorCode);
    },

    'test non-numeric refresh time property': function() {
        this.model.refreshTime = "numerek 100";
        var validatedModel = this.presenter.validateModel(this.model);

        assertFalse(validatedModel.isValid);
        assertEquals("T02", validatedModel.errorCode);
    }

});