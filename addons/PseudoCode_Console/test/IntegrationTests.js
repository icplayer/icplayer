TestCase("[PseudoCode_Console - integration tests] correct run", {
    setUp: function () {
        this.presenter = AddonPseudoCode_Console_create();

        this.model = {
            ID: "kmfskmfskdfmsk",
            'Is Visible': "True",
            runUserCode: "True",
            isNotActivity: "True",
            maxTimeForAnswer: "10",
            runParameters : [{value: "A"}, {value: "B"}, {value: "C"}],
            answerCode: "return this.data.mockCalled && this.data.mockCalled2 && this.data.mockCalled3 && this.data.mockCalled4 && this.data.mockCalled5;",
            functionsList: [
                {name: "function1", body: "builtIn.data.mockCalled = true;"},
                {name: "function2", body: "builtIn.data.mockCalled2 = true;"},
                {name: "function3", body: "builtIn.data.mockCalled3 = true;"}
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
                    methodBody: "builtIn.data.mockCalled4 = true;"
                },
                {
                    objectName: "Number",
                    methodName: "toString2",
                    methodBody: "builtIn.data.mockCalled5 = true;"
                }
            ],
            mathRound: " 20  ",
            consoleAvailableInput: "All"
        };

        this.view = $("<div><div class=\"addon-PseudoCode_Console-wrapper\"></div></div>")[0];


        /*
        function fun(a, b)
        poczatek
            a.toString()
            function2()

            return 3
        koniec

        program testInt
        zmienna cd
        poczatek
            function1()
            cd = fun(1, "asd")
            cd.toString2()
            function3()
        koniec
         */
        this.code = "function fun(a, b) \n poczatek \n a.toString() \n function2() \n return 3 \n koniec \n program testInt \n zmienna cd \n poczatek \n function1() \n cd = fun(1, \"asd\") \n cd.toString2() \n function3() \n koniec";

    },

    'test addon from validation to execute answer': function () {
        this.presenter.run(this.view, this.model);

        this.presenter.executeCode(this.code);

        this.presenter.stop();

        assertEquals(1, this.presenter.evaluateScoreFromUserCode());
    }

});