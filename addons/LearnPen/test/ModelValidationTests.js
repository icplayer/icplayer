TestCase("[DrawingSmartPen] Model validation", {
    setUp: function() {
        this.presenter = AddonLearnPen_create();

        this.presenter.data = {
            canvas: null,
            context: null,
            isStarted: false,

            sensors: ["SQUEEZE_A", "SQUEEZE_B", "SQUEEZE_C", "SQUEEZE_SUM", "SQUEEZE_MAX", "PRESSURE", "ALL"]
        };

        this.model = {
            "ID": "Add-on1",
            "Is Visible": "True",

            "SmartPen": "True",
            "Colors": "squeeze_A\n30%black\n75%green",
            "Thickness": "SQUEEZE_B\n50%10\n90%35",
            "Opacity": "SQUEEZE_MAX\n30%0.5\n60%0.8",
            "Squeeze limits": "20;80",
            "Squeeze limits interpretation": "",
            "Pressure limits": "15;75",
            "Events": [
                { "Sensor": "SQUEEZE_A", "Reaction scope": "80;100", "Item": "Item1", "Value": "0", "Score": "0" },
                { "Sensor": "PRESSURE", "Reaction scope": "0;15", "Item": "Item2", "Value": "1", "Score": "1" }
            ],
            "Mirror": "True",
            "Background color": ""
        };
    },

    'test proper model - SmartPen on': function() {
        var eventNumber = 0;
        var validatedModel = this.presenter.validateModel(this.model);

        assertEquals("Add-on1", validatedModel.id);
        assertTrue(validatedModel.isVisible);
        assertTrue(validatedModel.isSmartPen);

        // Colors: {sensor: "SQUEEZE_A", values: [ [30, "#000000"], [75, "#008000"] ] }
        assertEquals("SQUEEZE_A", validatedModel.colors.sensor);
        assertEquals(30, validatedModel.colors.values[0][0]);
        assertEquals("#000000", validatedModel.colors.values[0][1]);
        assertEquals(75, validatedModel.colors.values[1][0]);
        assertEquals("#008000", validatedModel.colors.values[1][1]);

        // Thickness: {sensor: "SQUEEZE_B", values: [ [50, 10], [90, 35] ]}
        assertEquals("SQUEEZE_B", validatedModel.thickness.sensor);
        assertEquals(50, validatedModel.thickness.values[0][0]);
        assertEquals(10, validatedModel.thickness.values[0][1]);
        assertEquals(90, validatedModel.thickness.values[1][0]);
        assertEquals(35, validatedModel.thickness.values[1][1]);

        // Opacity: {sensor: "SQUEEZE_MAX", values: [ [30, 0.5], [60, 0.8] ]}
        assertEquals("SQUEEZE_MAX", validatedModel.opacity.sensor);
        assertEquals(30, validatedModel.opacity.values[0][0]);
        assertEquals(0.5, validatedModel.opacity.values[0][1]);
        assertEquals(60, validatedModel.opacity.values[1][0]);
        assertEquals(0.8, validatedModel.opacity.values[1][1]);

        // Squeeze limits
        assertEquals(20, validatedModel.squeezeLimits[0]);
        assertEquals(80, validatedModel.squeezeLimits[1]);

        // Squeeze limits interpretations
        assertEquals("SEPARATELY", validatedModel.squeezeLimitsInterpretation);

        // Pressure limits
        assertEquals(15, validatedModel.pressureLimits[0]);
        assertEquals(75, validatedModel.pressureLimits[1]);

        // Events[0]
        eventNumber = 0;
        assertEquals("SQUEEZE_A", validatedModel.events[eventNumber].sensor);
        assertEquals(80, validatedModel.events[eventNumber].reactionScope[0]);
        assertEquals(100, validatedModel.events[eventNumber].reactionScope[1]);
        assertEquals("Item1", validatedModel.events[eventNumber].item);
        assertEquals("0", validatedModel.events[eventNumber].value);
        assertEquals("0", validatedModel.events[eventNumber].score);

        // Events[1]
        eventNumber = 1;
        assertEquals("PRESSURE", validatedModel.events[eventNumber].sensor);
        assertEquals(0, validatedModel.events[eventNumber].reactionScope[0]);
        assertEquals(15, validatedModel.events[eventNumber].reactionScope[1]);
        assertEquals("Item2", validatedModel.events[eventNumber].item);
        assertEquals("1", validatedModel.events[eventNumber].value);
        assertEquals("1", validatedModel.events[eventNumber].score);

        assertTrue(validatedModel.isMirror);
        assertEquals("NO_BG", validatedModel.backgroundColor);

        assertTrue(validatedModel.isValid);
    },

    'test proper model - SmartPen off': function() {
        this.model["SmartPen"] = "False";
        this.model["Colors"] = "black";
        this.model["Thickness"] = "15";
        this.model["Opacity"] = "";

        var validatedModel = this.presenter.validateModel(this.model);

        assertFalse(validatedModel.isSmartPen);
        assertEquals("#000000", validatedModel.colors);
        assertEquals(15, validatedModel.thickness);
        assertEquals(1, validatedModel.opacity);

        assertTrue(validatedModel.isValid);
    },

    'test ranges out of scope': function() {
        var validatedModel;

        this.model["Colors"] = "squeeze_A\n130%black\n75%green";
        validatedModel = this.presenter.validateModel(this.model);

        assertFalse(validatedModel.isValid);
        assertEquals("F01", validatedModel.errorCode);

        this.model["Colors"] = "squeeze_A\n-10%black\n75%green";
        validatedModel = this.presenter.validateModel(this.model);

        assertFalse(validatedModel.isValid);
        assertEquals("F01", validatedModel.errorCode);
    },

    'test non ascending values': function() {
        this.model["Colors"] = "squeeze_A\n70%black\n55%green";
        var validatedModel = this.presenter.validateModel(this.model);

        assertFalse(validatedModel.isValid);
        assertEquals("F02", validatedModel.errorCode);
    },

    'test empty sensor value': function() {
        this.model["Events"] = [ { "Sensor": "", "Reaction scope": "80;100", "Item": "Item1", "Value": "0", "Score": "0" } ];
        var validatedModel = this.presenter.validateModel(this.model);

        assertFalse(validatedModel.isValid);
        assertEquals("S01", validatedModel.errorCode);
    },

    'test wrong sensor value': function() {
        this.model["Colors"] = "qwe\n70%black\n55%green";
        var validatedModel = this.presenter.validateModel(this.model);

        assertFalse(validatedModel.isValid);
        assertEquals("S02", validatedModel.errorCode);
    },

    'test empty colors property': function() {
        this.model["Colors"] = "";

        var validatedModel = this.presenter.validateModel(this.model);

        assertFalse(validatedModel.isValid);
        assertEquals("C01", validatedModel.errorCode);
    },

    'test wrong length of numbers in hex format' : function() {
        var validatedModel;

        this.model["SmartPen"] = "False";
        this.model["Colors"] = "#1234567";
        validatedModel = this.presenter.validateModel(this.model);

        assertFalse(validatedModel.isValid);
        assertEquals('C02', validatedModel.errorCode);

        this.model["Colors"] = "#12345";
        validatedModel = this.presenter.validateModel(this.model);

        assertFalse(validatedModel.isValid);
        assertEquals('C02', validatedModel.errorCode);
    },

    'test strange colors name' : function() {
        this.model["SmartPen"] = "False";
        this.model['Colors'] = "ugabuga_color";
        var validatedModel = this.presenter.validateModel(this.model);

        assertFalse(validatedModel.isValid);
        assertEquals('C03', validatedModel.errorCode);
    },

    'test thickness smaller than 1' : function() {
        this.model["SmartPen"] = "False";
        this.model['Thickness'] = "-3";
        this.model["Colors"] = "black";
        this.model["Opacity"] = "";
        var validatedModel = this.presenter.validateModel(this.model);

        assertFalse(validatedModel.isValid);
        assertEquals('T02', validatedModel.errorCode);
    },

    'test thickness bigger than 40' : function() {
        this.model["SmartPen"] = "False";
        this.model['Thickness'] = "41";
        this.model["Colors"] = "black";
        this.model["Opacity"] = "";
        var validatedModel = this.presenter.validateModel(this.model);

        assertFalse(validatedModel.isValid);
        assertEquals('T02', validatedModel.errorCode);
    },

    'test opacity less than 0' : function() {
        this.model["SmartPen"] = "False";
        this.model['Opacity'] = '-0.11';
        this.model["Colors"] = "black";
        this.model["Thickness"] = "15";
        var validatedModel = this.presenter.validateModel(this.model);

        assertFalse(validatedModel.isValid);
        assertEquals('O02', validatedModel.errorCode);
    },

    'test opacity more than 1' : function() {
        this.model["SmartPen"] = "False";
        this.model['Opacity'] = '1.11';
        this.model["Colors"] = "black";
        this.model["Thickness"] = "15";
        var validatedModel = this.presenter.validateModel(this.model);

        assertFalse(validatedModel.isValid);
        assertEquals('O02', validatedModel.errorCode);
    },

    'test Wrong amount of values in property squeeze limits': function() {
        this.model["SmartPen"] = "True";
        this.model["Colors"] = "squeeze_A\n30%black\n75%green";
        this.model["Thickness"] = "SQUEEZE_B\n50%10\n90%35";
        this.model["Opacity"] = "SQUEEZE_MAX\n30%0.5\n60%0.8";
        this.model["Squeeze limits"] = "10;10;10";

        var validatedModel = this.presenter.validateModel(this.model);

        assertFalse(validatedModel.isValid);
        assertEquals("SQL01", validatedModel.errorCode);
    },

    'test non numeric values in property squeeze limits': function() {
        this.model["SmartPen"] = "True";
        this.model["Colors"] = "squeeze_A\n30%black\n75%green";
        this.model["Thickness"] = "SQUEEZE_B\n50%10\n90%35";
        this.model["Opacity"] = "SQUEEZE_MAX\n30%0.5\n60%0.8";
        this.model["Squeeze limits"] = "qwe;10";

        var validatedModel = this.presenter.validateModel(this.model);

        assertFalse(validatedModel.isValid);
        assertEquals("SQL02", validatedModel.errorCode);
    },

    'test 2nd value in property squeeze limits is smaller than 1st': function() {
        this.model["SmartPen"] = "True";
        this.model["Colors"] = "squeeze_A\n30%black\n75%green";
        this.model["Thickness"] = "SQUEEZE_B\n50%10\n90%35";
        this.model["Opacity"] = "SQUEEZE_MAX\n30%0.5\n60%0.8";
        this.model["Squeeze limits"] = "40;10";

        var validatedModel = this.presenter.validateModel(this.model);

        assertFalse(validatedModel.isValid);
        assertEquals("SQL03", validatedModel.errorCode);
    },

    'test value in property squeeze limit smaller then 0': function() {
        this.model["SmartPen"] = "True";
        this.model["Colors"] = "squeeze_A\n30%black\n75%green";
        this.model["Thickness"] = "SQUEEZE_B\n50%10\n90%35";
        this.model["Opacity"] = "SQUEEZE_MAX\n30%0.5\n60%0.8";
        this.model["Squeeze limits"] = "-40;10";

        var validatedModel = this.presenter.validateModel(this.model);

        assertFalse(validatedModel.isValid);
        assertEquals("SQL04", validatedModel.errorCode);
    },

    'test value in property squeeze limit bigger then 100': function() {
        this.model["SmartPen"] = "True";
        this.model["Colors"] = "squeeze_A\n30%black\n75%green";
        this.model["Thickness"] = "SQUEEZE_B\n50%10\n90%35";
        this.model["Opacity"] = "SQUEEZE_MAX\n30%0.5\n60%0.8";
        this.model["Squeeze limits"] = "10;140";

        var validatedModel = this.presenter.validateModel(this.model);

        assertFalse(validatedModel.isValid);
        assertEquals("SQL05", validatedModel.errorCode);
    },

    // No need to test "Pressure limits" - same errors are in squeeze limits

    'test score and value cannot be different than 0 and 1 in property Events': function() {
        this.model["SmartPen"] = "True";
        this.model["Colors"] = "squeeze_A\n30%black\n75%green";
        this.model["Thickness"] = "SQUEEZE_B\n50%10\n90%35";
        this.model["Opacity"] = "SQUEEZE_MAX\n30%0.5\n60%0.8";
        var validatedModel;

        this.model["Events"] = [ { "Sensor": "ALL", "Reaction scope": "80;100", "Item": "Item1", "Value": "3", "Score": "0" } ];
        validatedModel = this.presenter.validateModel(this.model);

        assertFalse(validatedModel.isValid);
        assertEquals("E01", validatedModel.errorCode);

        this.model["Events"] = [ { "Sensor": "ALL", "Reaction scope": "80;100", "Item": "Item1", "Value": "0", "Score": "troll" } ];
        validatedModel = this.presenter.validateModel(this.model);

        assertFalse(validatedModel.isValid);
        assertEquals("E02", validatedModel.errorCode);
    }
});