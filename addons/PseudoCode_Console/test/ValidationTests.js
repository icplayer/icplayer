TestCase("[PseudoCode_Console - validation tests] validate aliases", {
    setUp: function () {
        this.presenter = AddonPseudoCode_Console_create();

        this.aliases = {
            "begin": {name: "poczatek  "},
            "do": {name: "wykonuj"},
            "end": {name: "koniec"},
            "for": {name: "dla"},
            "from": {name: " od"},
            "to": {name: " do "},
            "variable": {name: "zmienna"},
            "program": {name: "program"},
            "while": {name: "dopoki"},
            "or": {name: "lub"},
            "and": {name: "i"}
        };

        this.expectedAliases = {
            "begin": "poczatek",
            "do": "wykonuj",
            "end": "koniec",
            "for": "dla",
            "from": "od",
            "to": "do",
            "variable": "zmienna",
            "program": "program",
            "while": "dopoki",
            "or": "lub",
            "and": "i"
        };

    },

    'test validate aliases should return validated model': function () {
        var validatedAliases = this.presenter.validateAliases(this.aliases);

        assertTrue(validatedAliases.isValid);
        assertEquals(this.expectedAliases, validatedAliases.value);
    },


    'test if alias name not pass /[A-Za-z_][a-zA-Z0-9_]*/g regexp then validation will return error': function () {
        this.aliases.begin.name = "początek";

        var validatedAliases = this.presenter.validateAliases(this.aliases);

        assertFalse(validatedAliases.isValid);
    },

    'test if there is multiple aliases with the same name then validation will return error': function () {
        this.aliases.and.name = "lub";

        var validatedAliases = this.presenter.validateAliases(this.aliases);

        assertFalse(validatedAliases.isValid);
    }

});

TestCase("[PseudoCode_Console - validation tests] validate functions", {
    setUp: function () {
        this.presenter = AddonPseudoCode_Console_create();

        this.functions = [
            {name: "function1", body: "asdfghjklmnbvder56tyujndfrtgyh();"},
            {name: "function2", body: "vssdfvfsdvdsvdsvfsdv();"},
            {name: "function3", body: "ldfsjdikfjdsofnsofnjd();"}
        ];

    },


    'test validate function will return valid function': function () {
        var validatedFunction = this.presenter.validateFunction(this.functions[0]);

        assertTrue(validatedFunction.isValid);
        assertTrue(validatedFunction.value.body.toString().indexOf(this.functions[0].body) > -1);
        assertEquals(this.functions[0].name, validatedFunction.value.name);
    },

    'test if function dont pass /[A-Za-z_][a-zA-Z0-9_]*/g regexp then validation will return error': function () {
        this.functions[1].name = "1funnĄ";

        var validatedFunction = this.presenter.validateFunction(this.functions[1]);

        assertFalse(validatedFunction.isValid);        
    },

    'test validateFunctions will return validated functions' : function () {
        var validatedFunctions = this.presenter.validateFunctions(this.functions);

        assertTrue(validatedFunctions.isValid);
        assertTrue(validatedFunctions.value[this.functions[0].name].toString().indexOf(this.functions[0].body) > -1);
        assertTrue(validatedFunctions.value[this.functions[1].name].toString().indexOf(this.functions[1].body) > -1);
        assertTrue(validatedFunctions.value[this.functions[2].name].toString().indexOf(this.functions[2].body) > -1);
    },

    'test if user define functions with the same name, then validateFunctions will return error': function () {
        this.functions[2].name = "function1";

        var validatedFunctions = this.presenter.validateFunctions(this.functions);

        assertFalse(validatedFunctions.isValid);
    }

});

TestCase("[PseudoCode_Console - validation tests] validate answer", {
    setUp: function () {
        this.presenter = AddonPseudoCode_Console_create();

        this.model = {
            runUserCode: "True",
            maxTimeForAnswer: "0.1",
            runParameters : [{value: "A"}, {value: "B"}, {value: "C"}],
            answerCode: "someCodeWhichWillBeCalledAfterGetState();"
        };

    },

    'test validate answer will return validated answer': function () {
        var validatedAnswer = this.presenter.validateAnswer(this.model);

        assertTrue(validatedAnswer.isValid);
        assertEquals(["A", "B", "C"], validatedAnswer.parameters);
        assertTrue(validatedAnswer.runUserCode);
        assertEquals({"isValid": true, "value": "0.10", "parsedValue": 0.1}, validatedAnswer.maxTimeForAnswer);
        assertTrue(validatedAnswer.answerCode.toString().indexOf(this.model.answerCode) > -1);
    },

    'test if user code will be run and max time is equals or below zero then validation will return error': function () {
        this.model.maxTimeForAnswer = "0";

        var validatedAnswer = this.presenter.validateAnswer(this.model);

        assertFalse(validatedAnswer.isValid);
    },

    'test if answer code is not valid js function then will throw error': function () {
        this.model.answerCode = "dfskfk sdjfk sdjfksdjfsdfdf;lsdkfsdlkf;dskf;";

        var validatedAnswer = this.presenter.validateAnswer(this.model);

        assertFalse(validatedAnswer.isValid);
    }
});

TestCase("[PseudoCode_Console - validation tests] validate model", {
    setUp: function () {
        this.presenter = AddonPseudoCode_Console_create();

        this.model = {
            ID: "kmfskmfskdfmsk",
            'Is Visible': "True",
            runUserCode: "True",
            isNotActivity: "True",
            maxTimeForAnswer: "0.1",
            runParameters : [{value: "A"}, {value: "B"}, {value: "C"}],
            answerCode: "someCodeWhichWillBeCalledAfterGetState();",
            functionsList: [
                {name: "function1", body: "asdfghjklmnbvder56tyujndfrtgyh();"},
                {name: "function2", body: "vssdfvfsdvdsvdsvfsdv();"},
                {name: "function3", body: "ldfsjdikfjdsofnsofnjd();"},
            ],
            default_aliases: {
                "begin": {name: "poczatek  "},
                "do": {name: "wykonuj"},
                "end": {name: "koniec"},
                "for": {name: "dla"},
                "variable": {name: "zmienna"},
                "program": {name: "program"},
                "while": {name: "dopoki"},
                "or": {name: "lub"},
                "and": {name: "i"}
            },

            methodsList: [
                {
                    objectName: "Number",
                    methodName: "toString",
                    methodBody: ""
                },
                {
                    objectName: "Number",
                    methodName: "toString2",
                    methodBody: ""
                }
            ],

            mathRound: " 2 ",
            consoleAvailableInput: "All"
        };

        this.expectedAliases = {
            "begin": "poczatek", //
            "do": "wykonuj",    //
            "end": "koniec",    //
            "for": "dla",       //
            "from": "from",
            "to": "to",
            "variable": "zmienna",  //
            "program": "program",   //
            "while": "dopoki",      //
            "or": "lub",            //
            "and": "i",             //
            "if": "if",
            "then": "then",
            "else": "else",
            "case": "case",
            "option": "option",
            "function": "function",
            "return": "return",
            "array_block": "array",
            "by": "by",
            "down_to": "downto"
        };

    },

    'test validate model will return validated model' : function () {
        var validatedModel = this.presenter.validateModel(this.model, this.presenter.configuration.aliases);

        assertTrue(validatedModel.isValid);
        assertEquals(this.model.ID, validatedModel.addonID);
        assertTrue(validatedModel.isVisibleByDefault);
        assertFalse(validatedModel.isActivity);
        assertEquals(this.expectedAliases, validatedModel.aliases);

        assertTrue(validatedModel.functions[this.model.functionsList[0].name].toString().indexOf(this.model.functionsList[0].body) > -1);
        assertTrue(validatedModel.functions[this.model.functionsList[1].name].toString().indexOf(this.model.functionsList[1].body) > -1);
        assertTrue(validatedModel.functions[this.model.functionsList[2].name].toString().indexOf(this.model.functionsList[2].body) > -1);

        assertEquals(["A", "B", "C"], validatedModel.answer.parameters);
        assertTrue(validatedModel.answer.runUserCode);
        assertEquals({"isValid": true, "value": "0.10", "parsedValue": 0.1}, validatedModel.answer.maxTimeForAnswer);
        assertTrue(validatedModel.answer.answerCode.toString().indexOf(this.model.answerCode) > -1);

        assertTrue(validatedModel.methods.length === 2);
        assertEquals(validatedModel.methods[0].objectName, "Number");
        assertEquals(validatedModel.methods[0].methodName, 'toString');
        assertEquals(validatedModel.methods[1].objectName, "Number");
        assertEquals(validatedModel.methods[1].methodName, 'toString2');

        assertEquals(2, validatedModel.round);
        assertEquals("All", validatedModel.availableConsoleInput);
    },


    'test validate model will return error if function will override alias name' : function () {
        this.model.functionsList[0].name = "poczatek";

        var validatedModel = this.presenter.validateModel(this.model);

        assertFalse(validatedModel.isValid);
    },

    'test validate model will return error if round is above 20': function () {
        this.model.mathRound = "21";
        var validatedModel = this.presenter.validateModel(this.model);

        assertFalse(validatedModel.isValid);
    },

    'test validate model will return error if round is 0': function () {
        this.model.mathRound = "0";
        var validatedModel = this.presenter.validateModel(this.model);

        assertFalse(validatedModel.isValid);
    },

    'test validate model will return error if round is below 0': function () {
        this.model.mathRound = "-1";
        var validatedModel = this.presenter.validateModel(this.model);

        assertFalse(validatedModel.isValid);
    },

    'test validate model will return error if round contains string': function () {
        this.model.mathRound = "sdfsd";
        var validatedModel = this.presenter.validateModel(this.model);

        assertFalse(validatedModel.isValid);
    }
});