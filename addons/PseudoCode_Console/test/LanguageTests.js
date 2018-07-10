var MAX_TIME_FOR_TEST = 200;

TestCase("[PseudoCode_Console - language tests] if statement", {
    setUp: function () {
        this.presenter = AddonPseudoCode_Console_create();

        this.afterExecutingObject = {};
        var self = this;

        this.presenter.configuration.functions = {
            mock: this.presenter.validateFunction({name: "name", body: "builtIn.data.mockCalled = true;"}).value.body,
            mock2: this.presenter.validateFunction({name: "name", body: "builtIn.data.mockCalled2 = true;"}).value.body,
            mock3: this.presenter.validateFunction({name: "name", body: "builtIn.data.mockCalled3 = true;"}).value.body,
            mock4: this.presenter.validateFunction({name: "name", body: "builtIn.data.mockCalled4 = true;"}).value.body
        };

        this.presenter.configuration.answer = {
            parameters: [],
            maxTimeForAnswer: {
                parsedValue: MAX_TIME_FOR_TEST
            },
            answerCode: function () {
                self.afterExecutingObject = this;
            }
        };

        this.presenter.initializeGrammar();
        this.presenter.completeObjectsMethods();

        /*
        program test
        variable a, b
        begin
            a = 1
            b = 8
            
            if a == 1 then
                if b > 2 then
                    mock()
                    
            mock2()
            
            if a < 0 then
                mock3()
        end
        */
        this.test1 = "program test \n variable a, b \n begin \n a=1 \n b = 8 \n if a == 1 then \n if b > 2 then \n mock()\nmock2()\nif a < 0 then \n mock3() \n end";

        /*
        program test
        variable a, b
        begin
            a=1
            b = 8
            
            if a == 1 then
                if b > 2 then
                    mock()
                else
                    mock4()
                    
            mock2()
            
            if a < 0 then
                mock3()
        end
        */
        this.test2 = "program test \n variable a, b \n begin \n a=1 \n b = 8 \n if a == 1 then \n if b > 2 then \n mock() \n else \n mock4() \n mock2()\nif a < 0 then \n mock3() \n end";

        /*
        program test
        variable a, b
        begin
            a=1
            b = 8
            
            if a == 1 then
            begin
                if b < 2 then
                    mock()
                else
                    mock4()
            end
                    
            mock2()
            
            if a < 0 then
                mock3()
        end
        */
        this.test3 = "program test \n variable a, b \n begin \n a=1 \n b = 8 \n if a == 1 then \n begin \n if b < 2 then \n mock() \n else \n mock4() \n end \n mock2()\nif a < 0 then \n mock3() \n end";
    },

    'test code will enter to if statement': function () {
        this.presenter.state.lastUsedCode = this.presenter.state.codeGenerator.parse(this.test1);

        this.presenter.evaluateScoreFromUserCode();
        assertTrue(this.afterExecutingObject.data.mockCalled);
        assertTrue(this.afterExecutingObject.data.mockCalled2);
        assertEquals(undefined, this.afterExecutingObject.data.mockCalled3);
        assertEquals(3, this.afterExecutingObject.calledInstructions.if);
    },

    'test code will enter to if statement in if-else instruction' : function () {
        this.presenter.state.lastUsedCode = this.presenter.state.codeGenerator.parse(this.test2);

        this.presenter.evaluateScoreFromUserCode();

        assertTrue(this.afterExecutingObject.data.mockCalled);
        assertTrue(this.afterExecutingObject.data.mockCalled2);
        assertEquals(undefined, this.afterExecutingObject.data.mockCalled3);
        assertEquals(undefined, this.afterExecutingObject.data.mockCalled4);
        assertEquals(this.afterExecutingObject.calledInstructions.if, 3);
    },

    'test code will enter to else statement in if-else instruction' : function () {
        this.presenter.state.lastUsedCode = this.presenter.state.codeGenerator.parse(this.test3);

        this.presenter.evaluateScoreFromUserCode();

        assertTrue(this.afterExecutingObject.data.mockCalled2);
        assertTrue(this.afterExecutingObject.data.mockCalled4);
        assertEquals(undefined, this.afterExecutingObject.data.mockCalled);
        assertEquals(undefined, this.afterExecutingObject.data.mockCalled3);
        assertEquals(this.afterExecutingObject.calledInstructions.if, 3);
    }

});

TestCase("[PseudoCode_Console - language tests] variables statement", {
    setUp: function () {
        this.presenter = AddonPseudoCode_Console_create();

        this.presenter.configuration.functions = {
            mock: this.presenter.validateFunction({name: "name", body: "builtIn.data.mockCalled = arguments[0];"}).value.body,
            mock2: this.presenter.validateFunction({name: "name", body: "builtIn.data.mockCalled2 = arguments[0];"}).value.body,
            mock3: this.presenter.validateFunction({name: "name", body: "builtIn.data.mockCalled3 = arguments[0];"}).value.body,
            mock4: this.presenter.validateFunction({name: "name", body: "builtIn.data.mockCalled4 = arguments[0];"}).value.body
        };

        this.afterExecutingObject = {};
        var self = this;

        this.presenter.configuration.answer = {
            parameters: [],
            maxTimeForAnswer: {
                parsedValue: MAX_TIME_FOR_TEST
            },
            answerCode: function () {
                self.afterExecutingObject = this;
            }
        };

        this.presenter.initializeGrammar();
        this.presenter.completeObjectsMethods();

        this.test1 = "program test \n variable a, b \n begin \n a=1 \n mock2(a) \n mock(b) \n a = \"aaaa\" \n mock3(a) \n end";

        /*
        program test
        variable a = 2, b, c = "ok"
        variable d = ".."
        begin
            mock(a)
            mock2(b)
            mock3(c)
            mock4(d)
        end
         */
        this.test2 = "        program test\n" +
            "        variable a = 2, b, c = \"ok\"\n" +
            "        variable d = \"..\"\n" +
            "        begin\n" +
            "            mock(a)\n" +
            "            mock2(b)\n" +
            "            mock3(c)\n" +
            "            mock4(d)\n" +
            "        end";
    },

    'test variable will have at default value 0': function () {
        this.presenter.state.lastUsedCode = this.presenter.state.codeGenerator.parse(this.test1);

        this.presenter.evaluateScoreFromUserCode();

        assertEquals(0, this.afterExecutingObject.data.mockCalled.value);
    },

    'test assign value works': function () {
        this.presenter.state.lastUsedCode = this.presenter.state.codeGenerator.parse(this.test1);

        this.presenter.evaluateScoreFromUserCode();

        assertEquals(1, this.afterExecutingObject.data.mockCalled2.value);
        assertEquals("aaaa", this.afterExecutingObject.data.mockCalled3.value);
    },

    'test starts values works correctly': function () {
        this.presenter.state.lastUsedCode = this.presenter.state.codeGenerator.parse(this.test2);

        this.presenter.evaluateScoreFromUserCode();

        assertEquals(2, this.afterExecutingObject.data.mockCalled.value);
        assertEquals(0, this.afterExecutingObject.data.mockCalled2.value);
        assertEquals("ok", this.afterExecutingObject.data.mockCalled3.value);
        assertEquals("..", this.afterExecutingObject.data.mockCalled4.value);
    }
});

TestCase("[PseudoCode_Console - language tests] math statement", {
    setUp: function () {
        this.presenter = AddonPseudoCode_Console_create();

        this.presenter.configuration.functions = {
            mock: this.presenter.validateFunction({name: "name", body: "builtIn.data.mockCalled = arguments[0];"}).value.body,
            mock2: this.presenter.validateFunction({name: "name", body: "builtIn.data.mockCalled2 = arguments[0];"}).value.body,
            mock3: this.presenter.validateFunction({name: "name", body: "builtIn.data.mockCalled3 = arguments[0];"}).value.body
        };

        this.presenter.configuration.round = 4;

        this.afterExecutingObject = {};
        var self = this;

        this.presenter.configuration.answer = {
            parameters: [],
            maxTimeForAnswer: {
                parsedValue: MAX_TIME_FOR_TEST
            },
            answerCode: function () {
                self.afterExecutingObject = this;
            }
        };

        this.presenter.initializeGrammar();
        this.presenter.completeObjectsMethods();

        /*
        program test
        variable a, b
        begin
            a = 2 + 2 * 2 - 40 / 2
            mock(a)
        end
        */
        this.test1 = "program test \n variable a, b \n begin \n a = 2 + 2 * 2 - 40 / 2\n mock(a) \n end";
        /*
        program test
        variable a, b
        begin
            a = (2 + 2) * (((2 - 40) / 2) + 2)
            mock(a)
        end
        */
        this.test2 = "program test \n variable a, b \n begin \n a = (2 + 2) * (((2 - 40) / 2) + 2) \n mock(a) \n end";
        /*
        program test
        variable a, b
        begin
            a = 60 % 7 /_ 3
            mock(a)
        end
        */
        this.test3 = "program test \n variable a, b \n begin \n a = 60 % 7 /_ 3 \n mock(a) \n end";

        /*
        program test
        variable a
        begin
            a = 2 / 3
            mock(a)
        end
         */
        this.test4 = "" +
            "program test\n" +
            "variable a\n" +
            "begin\n" +
            "    a = 2 / 3\n" +
            "    mock(a)\n" +
            "end";


        /*
        program test
        variable a
        begin
            a = 0.0002002 * 2
            mock(a)
        end
         */
        this.test5 = "" +
            "program test\n" +
            "variable a\n" +
            "begin\n" +
            "    a = 0.0002002 * 2\n" +
            "    mock(a)\n" +
            "end";
    },

    'test order of addition, subtraction, multiplication and division': function () {
        this.presenter.state.lastUsedCode = this.presenter.state.codeGenerator.parse(this.test1);

        this.presenter.evaluateScoreFromUserCode();

        assertEquals(-14, this.afterExecutingObject.data.mockCalled.value);
    },

    'test order of bracers': function () {
        this.presenter.state.lastUsedCode = this.presenter.state.codeGenerator.parse(this.test2);
        
        this.presenter.evaluateScoreFromUserCode();

        assertEquals(-68, this.afterExecutingObject.data.mockCalled.value);
    },

    'test floor and modulo': function () {
        this.presenter.state.lastUsedCode = this.presenter.state.codeGenerator.parse(this.test3);
        
        this.presenter.evaluateScoreFromUserCode();

        assertEquals(1, this.afterExecutingObject.data.mockCalled.value);
    },

    'test div correctly round number': function () {
        this.presenter.state.lastUsedCode = this.presenter.state.codeGenerator.parse(this.test4);

        this.presenter.evaluateScoreFromUserCode();

        assertEquals(0.6667, this.afterExecutingObject.data.mockCalled.value);
    },

    'test mul correctly round number': function () {
        this.presenter.state.lastUsedCode = this.presenter.state.codeGenerator.parse(this.test5);

        this.presenter.evaluateScoreFromUserCode();

        assertEquals(0.0004, this.afterExecutingObject.data.mockCalled.value);
    }
});

TestCase("[PseudoCode_Console - language tests] logical statement", {
    setUp: function () {
        this.presenter = AddonPseudoCode_Console_create();

        this.presenter.configuration.functions = {
            mock: this.presenter.validateFunction({name: "name", body: "builtIn.data.mockCalled = builtIn.data.mockCalled || {}; builtIn.data.mockCalled[arguments[0].value] = arguments[1]; "}).value.body,
            mock1: this.presenter.validateFunction({name: "name", body: "builtIn.data.mock1Called = true;"}).value.body,
            mock2: this.presenter.validateFunction({name: "name", body: "builtIn.data.mock2Called = true;\n"}).value.body
        };

        this.afterExecutingObject = {};
        var self = this;

        this.presenter.configuration.answer = {
            parameters: [],
            maxTimeForAnswer: {
                parsedValue: MAX_TIME_FOR_TEST
            },
            answerCode: function () {
                self.afterExecutingObject = this;
            }
        };

        this.presenter.initializeGrammar();
        this.presenter.completeObjectsMethods();

        /*
        program test
        variable true, false, a, b
        begin
            true = 1 == 1
            false = 1 != 1
            a = true and (true or false)
            mock(1,a)
            a = true and (false or (false and true))
            mock(2,a)
        end
        */
        this.test1 = "program test \n variable true, false, a, b \n begin \n true = 1 == 1 \n false = 1 != 1 \n a = true and (true or false) \n mock(1, a) \n a = true and (false or (false and true)) \n mock(2, a) \n end";
    
    /*
        program test
        variable a, b, c
        begin
            a = 1 > 2
            b = 2 > 1
            mock(1, a)
            mock(2, b)
            
            a = 1 == 2
            b = 2 == 2
            mock(3, a)
            mock(4, b)
            
            a = 1 >= 2
            b = 2 >= 1
            c = 2 >= 2
            mock(5, a)
            mock(6, b)
            mock(7, c)

            a = 1 <= 2
            b = 2 <= 1
            c = 2 <= 2
            mock(8, a)
            mock(9, b)
            mock(10, c)
            
            a = 1 != 1
            b = 1 != 2
            mock(11, a)
            mock(12, b)

            a = 1 < 2
            b = 2 < 1
            mock(13, a)
            mock(14, b)
        end
    */
    this.test2 = "program test \n variable a, b, c \n begin \n a = 1 > 2 \n b = 2 > 1 \n mock(1, a) \n mock(2, b) \n a = 1 == 2 \n b = 2 == 2 \n mock(3, a) \n mock(4, b) \n a = 1 >= 2 \n b = 2 >= 1 \n c = 2 >= 2 \n mock(5, a) \n mock(6, b) \n mock(7, c) \n a = 1 <= 2 \n b = 2 <= 1 \n c = 2 <= 2 \n mock(8, a) \n mock(9, b) \n mock(10, c) \n a = 1 != 1 \n b = 1 != 2 \n mock(11, a) \n mock(12, b) \n a = 1 < 2 \n b = 2 < 1 \n mock(13, a) \n mock(14, b) \n end";

    /*
    program a
    variable true = 1 == 1, false = 1 != 1
    begin
        if true or mock1() then
        begin

        end

        if false and mock2() then
        begin

        end
    end
     */
    this.test3 = "" +
        "    program a\n" +
        "    variable true = 1 == 1, false = 1 != 1\n" +
        "    begin\n" +
        "        if true or mock1() then\n" +
        "        begin\n" +
        "        \n" +
        "        end\n" +
        "        \n" +
        "        if false and mock2() then\n" +
        "        begin\n" +
        "        \n" +
        "        end\n" +
        "    end";
    },

    'test "and" and "or" statements': function () {
        this.presenter.state.lastUsedCode = this.presenter.state.codeGenerator.parse(this.test1);

        this.presenter.evaluateScoreFromUserCode();

        assertEquals(true, this.afterExecutingObject.data.mockCalled[1].value);
        assertEquals(false, this.afterExecutingObject.data.mockCalled[2].value);
    },

    'test comparasions': function () {
        var expected = [false, true, false, true, false, true, true, true, false, true, false, true, true, false];
        var i;

        this.presenter.state.lastUsedCode = this.presenter.state.codeGenerator.parse(this.test2);
        
        this.presenter.evaluateScoreFromUserCode();

        for (i = 0; i < expected.length; i += 1) {
            assertEquals(expected[i], this.afterExecutingObject.data.mockCalled[i + 1].value);
        }
    },

    'test "and" and "or" optimizations are working': function () {
        this.presenter.state.lastUsedCode = this.presenter.state.codeGenerator.parse(this.test3);

        this.presenter.evaluateScoreFromUserCode();

        assertUndefined(this.afterExecutingObject.data.mock1Called);
        assertUndefined(this.afterExecutingObject.data.mock2Called);
    }

});

TestCase("[PseudoCode_Console - language tests] user defined functions", {
    setUp: function () {
        this.presenter = AddonPseudoCode_Console_create();

        this.presenter.configuration.functions = {
            mock: this.presenter.validateFunction({name: "name", body: "builtIn.data.mockCalled = builtIn.data.mockCalled || {}; builtIn.data.mockCalled[arguments[0].value] = arguments[1];"}).value.body
        };

        this.afterExecutingObject = {};
        var self = this;

        this.presenter.configuration.answer = {
            parameters: [],
            maxTimeForAnswer: {
                parsedValue: MAX_TIME_FOR_TEST
            },
            answerCode: function () {
                self.afterExecutingObject = this;
            }
        };

        this.presenter.initializeGrammar();
        this.presenter.completeObjectsMethods();

        /*
        function testfunc ()
        begin
        mock(1, "OK")
        end

        program test
        begin
            testfunc()
            mock(2, "OK2")
        end
        */
        this.test1 = "function testfunc () \n begin \n mock(1, \"OK\") \n end \n program test \n begin \n testfunc() \n mock(2, \"OK2\") \n end";

        /*
        function testfunc (a, b)
        begin
        mock(1, a)
        mock2(2, b)
        end

        program test
        begin
            testfunc("W", 5, 6, 7, 8, 9, 10)
            mock(3, "OK2")
        end
        */
        this.test2 = "function testfunc (a, b) \n begin \n mock(1, a) \n mock(2, b) \n end \n program test \n begin \n testfunc(\"W\", 5, 6, 7, 8, 9, 10) \n mock(3, \"OK2\") \n end";

        /*
        function testfunc (a, b)
        begin
            return a + b
        end

        program test
        variable a
        begin
            a = testfunc(2, 4)
            mock(1, a)
        end
        */
        this.test3 = "function testfunc (a, b) \n begin \n return a + b \n end \n program test \n variable a \n begin \n a = testfunc(2, 4) \n mock(1, a) \n end";


        /*
        function testfunc (a, b, c)
        begin
            return a + b
        end

        program test
        variable a
        begin
            a = testfunc(2, 4)
            mock(1, a)
        end
        */
        this.test4 = "function testfunc (a, b, c) \n begin \n return a + b \n end \n program test \n variable a \n begin \n a = testfunc(2, 4) \n mock(1, a) \n end";

        /*
        function testfunc (a, b)
        variable d = 5
        array e[2] = [1, 2]
        begin
            return a + b + d * e[1]
        end

        program test
        variable a
        begin
            a = testfunc(2, 4)
            mock(1, a)
        end
        */
        this.test5 = "function testfunc (a, b)\n" +
            "        variable d = 5\n" +
            "        array e[2] = [1, 2]\n" +
            "        begin\n" +
            "            return a + b + d * e[1]\n" +
            "        end\n" +
            "\n" +
            "        program test\n" +
            "        variable a\n" +
            "        begin\n" +
            "            a = testfunc(2, 4)\n" +
            "            mock(1, a)\n" +
            "        end";
    },

    'test function defined by user is called': function () {
        this.presenter.state.lastUsedCode = this.presenter.state.codeGenerator.parse(this.test1);

        this.presenter.evaluateScoreFromUserCode();

        assertEquals("OK", this.afterExecutingObject.data.mockCalled[1].value);
        assertEquals("OK2", this.afterExecutingObject.data.mockCalled[2].value);
    },

    'test function defined by user  with args is properly called': function () {
        this.presenter.state.lastUsedCode = this.presenter.state.codeGenerator.parse(this.test2);

        this.presenter.evaluateScoreFromUserCode();

        assertEquals("W", this.afterExecutingObject.data.mockCalled[1].value);
        assertEquals(5, this.afterExecutingObject.data.mockCalled[2].value);
        assertEquals("OK2", this.afterExecutingObject.data.mockCalled[3].value);
    },

    'test function defined by user returs valid value': function () {
        this.presenter.state.lastUsedCode = this.presenter.state.codeGenerator.parse(this.test3);
        
        this.presenter.evaluateScoreFromUserCode();

        assertEquals(6, this.afterExecutingObject.data.mockCalled[1].value);
    },


    'test function defined by user with to few arguments while calling returns error': function () {
        this.presenter.state.lastUsedCode = this.presenter.state.codeGenerator.parse(this.test4);

        this.presenter.evaluateScoreFromUserCode();
        assertEquals(undefined, this.afterExecutingObject.data.mockCalled);
    },

    'test function will work with defined variables in local scope': function () {
        this.presenter.state.lastUsedCode = this.presenter.state.codeGenerator.parse(this.test5);

        this.presenter.evaluateScoreFromUserCode();
        assertEquals(16, this.afterExecutingObject.data.mockCalled[1].value);
    }
});

TestCase("[PseudoCode_Console - language tests] for statement", {
    setUp: function () {
        this.presenter = AddonPseudoCode_Console_create();

        this.presenter.configuration.functions = {
            mock: this.presenter.validateFunction({name: "name", body: "builtIn.data.mockCalled = builtIn.data.mockCalled || 0;  builtIn.data.mockCalled++;"}).value.body,
            mock2: this.presenter.validateFunction({name: "name", body: "builtIn.data.mockCalled2 = true;"}).value.body,
            mock3: this.presenter.validateFunction({name: "name", body: "builtIn.data.mockCalled3 = arguments[0];"}).value.body
        };

        this.afterExecutingObject = {};
        var self = this;

        this.presenter.configuration.answer = {
            parameters: [],
            maxTimeForAnswer: {
                parsedValue: MAX_TIME_FOR_TEST
            },
            answerCode: function () {
                self.afterExecutingObject = this;
            }
        };

        this.presenter.initializeGrammar();
        this.presenter.completeObjectsMethods();

        /*
        program test
        variable a
        begin
            for a from 1 to 5 by 1 do
            begin
                mock()
            end
            mock2()
        end
        */
        this.test1 = "program test \n variable a \n begin \n for a from 1 to 5 by 1 do \n begin \n mock() \n end \n mock2() \n end";

        /*
        program test
        variable a, b, c
        begin
            b = 8
            for a from 1 to b by 1 do
            begin
                for c from 1 to 2 by 1 do
                    mock()
            end
            mock2()
        end
        */
        this.test2 = "program test \n variable a, b, c \n begin \n b = 8\n for a from 1 to b by 1 do \n begin \n for c from 1 to 2 by 1 do \n mock() \n end \n mock2() \n end";

        /*
        program test
        variable a, b, c, d, e
        begin
            d = 2
            b = 8
            e = 1

            for a from 1 to b by 1 do
            begin
                for c from e to d by 1 do
                    mock()
            end
            mock2()
        end
         */
        this.test3 = "program test\n" +
            "variable a, b, c, d, e\n" +
            "begin\n" +
            "    d = 2\n" +
            "    b = 8\n" +
            "    e = 1\n" +
            "    \n" +
            "    for a from 1 to b  by 1 do\n" +
            "    begin\n" +
            "        for c from e to d by 1 do\n" +
            "            mock()\n" +
            "    end\n" +
            "    mock2()\n" +
            "end";

        /*
        program test
        variable a, b, c, d, e
        begin
            d = 2
            b = 8
            e = 1

            for a from 1 to b by 2do
            begin
                for c from e to d by 2 do
                    mock()
            end
            mock2()
        end
         */
        this.test4 = "program test\n" +
            "variable a, b, c, d, e\n" +
            "begin\n" +
            "    d = 9\n" +
            "    b = 8\n" +
            "    e = 1\n" +
            "    \n" +
            "    for a from 1 to b by 2 do\n" +
            "    begin\n" +
            "        for c from e to d by 3 do\n" +
            "            mock()\n" +
            "    end\n" +
            "    mock2()\n" +
            "end";

        /*
        program test
        variable a, b, c, d, e
        begin
            d = 9
            b = 8
            e = 1

            for a from 1 to b do
            begin
                for c from e to d do
                    mock()
            end
            mock2()
        end
         */
        this.test5 = "program test\n" +
            "variable a, b, c, d, e\n" +
            "begin\n" +
            "    d = 1\n" +
            "    b = 9\n" +
            "    e = 1\n" +
            "    \n" +
            "    for a from 1 to b do\n" +
            "    begin\n" +
            "        for c from e to d do\n" +
            "            mock()\n" +
            "    end\n" +
            "    mock2()\n" +
            "end";

        /*
        program test
        variable a
        begin
            for a from 1 to 5 by 8 do
            begin
                mock()
            end
            mock2()
        end
        */
        this.test6 = "program test\n" +
            "variable a\n" +
            "begin\n" +
            "    for a from 1 to 5 by 8 do\n" +
            "    begin\n" +
            "        mock()\n" +
            "    end\n" +
            "    mock2()\n" +
            "end";

        /*
        program test
        variable a
        begin
            for a from 5 downto 1 by 2 do
            begin
                mock()
            end
            mock2()
        end
        */
        this.test7 = "program test\n" +
            "variable a\n" +
            "begin\n" +
            "    for a from 5 downto 1 by 2 do\n" +
            "    begin\n" +
            "        mock()\n" +
            "    end\n" +
            "    mock2()\n" +
            "end";

        /*
        program test
        variable a
        begin
            for a from 5 downto 1 do
            begin
                mock()
            end
            mock2()
        end
        */
        this.test8 = "program test\n" +
            "variable a\n" +
            "begin\n" +
            "    for a from 5 downto 1 do\n" +
            "    begin\n" +
            "        mock()\n" +
            "    end\n" +
            "    mock2()\n" +
            "end";


        /*
        program a
        array b[4]
        variable c = 0
        begin
            for c from 0 to 3 do
            begin
                b[c] = c
            end

            mock3(b)
        end
         */
        this.test9 = "" +
            "program a\n" +
            "array b[4]\n" +
            "variable c = 0\n" +
            "begin\n" +
            "    for c from 0 to 3 do\n" +
            "    begin\n" +
            "        b[c] = c\n" +
            "    end\n" +
            "    \n" +
            "    mock3(b)\n" +
            "end";
    },

    'test for will be called 5 times' : function () {
        this.presenter.state.lastUsedCode = this.presenter.state.codeGenerator.parse(this.test1);
        
        this.presenter.evaluateScoreFromUserCode();

        assertTrue(this.afterExecutingObject.data.mockCalled2);
        assertEquals(5, this.afterExecutingObject.data.mockCalled);
        assertEquals(5, this.afterExecutingObject.calledInstructions.for);
    },

    'test for end value can be variable': function () {
        this.presenter.state.lastUsedCode = this.presenter.state.codeGenerator.parse(this.test2);
        
        this.presenter.evaluateScoreFromUserCode();

        assertTrue(this.afterExecutingObject.data.mockCalled2);
        assertEquals(16, this.afterExecutingObject.data.mockCalled);
        assertEquals(24, this.afterExecutingObject.calledInstructions.for);
    },

    'test for start value and end value are variables': function () {
        this.presenter.state.lastUsedCode = this.presenter.state.codeGenerator.parse(this.test3);

        this.presenter.evaluateScoreFromUserCode();

        assertTrue(this.afterExecutingObject.data.mockCalled2);
        assertEquals(16, this.afterExecutingObject.data.mockCalled);
        assertEquals(24, this.afterExecutingObject.calledInstructions.for);
    },

    'test for can be skipped more than one': function () {
        this.presenter.state.lastUsedCode = this.presenter.state.codeGenerator.parse(this.test4);

        this.presenter.evaluateScoreFromUserCode();

        assertTrue(this.afterExecutingObject.data.mockCalled2);
        assertEquals(12, this.afterExecutingObject.data.mockCalled);
        assertEquals(16, this.afterExecutingObject.calledInstructions.for);
    },

    'test in for statement "BY" can be skipped': function () {
        this.presenter.state.lastUsedCode = this.presenter.state.codeGenerator.parse(this.test5);

        this.presenter.evaluateScoreFromUserCode();

        assertTrue(this.afterExecutingObject.data.mockCalled2);
        assertEquals(9, this.afterExecutingObject.data.mockCalled);
        assertEquals(18, this.afterExecutingObject.calledInstructions.for);
    },

    'test for statement contains correct start value': function () {
        this.presenter.state.lastUsedCode = this.presenter.state.codeGenerator.parse(this.test6);

        this.presenter.evaluateScoreFromUserCode();

        assertTrue(this.afterExecutingObject.data.mockCalled2);
        assertEquals(1, this.afterExecutingObject.data.mockCalled);
        assertEquals(1, this.afterExecutingObject.calledInstructions.for);
    },

    'test for statement with downto statement': function () {
        this.presenter.state.lastUsedCode = this.presenter.state.codeGenerator.parse(this.test7);

        this.presenter.evaluateScoreFromUserCode();

        assertTrue(this.afterExecutingObject.data.mockCalled2);
        assertEquals(3, this.afterExecutingObject.data.mockCalled);
        assertEquals(3, this.afterExecutingObject.calledInstructions.for);
    },

    'test in for with downto statement BY can be skipped': function () {
        this.presenter.state.lastUsedCode = this.presenter.state.codeGenerator.parse(this.test8);

        this.presenter.evaluateScoreFromUserCode();

        assertTrue(this.afterExecutingObject.data.mockCalled2);
        assertEquals(5, this.afterExecutingObject.data.mockCalled);
        assertEquals(5, this.afterExecutingObject.calledInstructions.for);
    },

    'test for value returns new objects': function () {
        this.presenter.state.lastUsedCode = this.presenter.state.codeGenerator.parse(this.test9);

        this.presenter.evaluateScoreFromUserCode();

        assertEquals(0, this.afterExecutingObject.data.mockCalled3.value[0].value);
        assertEquals(1, this.afterExecutingObject.data.mockCalled3.value[1].value);
        assertEquals(2, this.afterExecutingObject.data.mockCalled3.value[2].value);
        assertEquals(3, this.afterExecutingObject.data.mockCalled3.value[3].value);

    }
});

TestCase("[PseudoCode_Console - language tests] while statement", {
    setUp: function () {
        this.presenter = AddonPseudoCode_Console_create();

        this.presenter.configuration.functions = {
            mock: this.presenter.validateFunction({name: "name", body: "builtIn.data.mockCalled = builtIn.data.mockCalled || 0;  builtIn.data.mockCalled++;"}).value.body,
            mock2: this.presenter.validateFunction({name: "name", body: "builtIn.data.mockCalled2 = true;"}).value.body
        };

        this.afterExecutingObject = {};
        var self = this;

        this.presenter.configuration.answer = {
            parameters: [],
            maxTimeForAnswer: {
                parsedValue: MAX_TIME_FOR_TEST
            },
            answerCode: function () {
                self.afterExecutingObject = this;
            }
        };

        this.presenter.initializeGrammar();
        this.presenter.completeObjectsMethods();

        /*
        program test
        variable a
        begin
            a = 1
            while a < 5 do
            begin
                mock()
                a = a + 1
            end
            mock2()
        end
        */
        this.test1 = "program test \n variable a \n begin \n a = 1 \n while a < 5 do \n begin \n mock() \n a = a + 1 \n end \n mock2() \n end";
        /*
        program test
        variable a
        begin
            a = 8
            while a < 5 do
            begin
                mock()
                a = a + 1
            end
            mock2()
        end
        */
        this.test2 = "program test \n variable a \n begin \n a = 8 \n while a < 5 do \n begin \n mock() \n a = a + 1 \n end \n mock2() \n end";
    },

    'test while will work if value of expression is true' : function () {
        this.presenter.state.lastUsedCode = this.presenter.state.codeGenerator.parse(this.test1);
        
        this.presenter.evaluateScoreFromUserCode();

        assertTrue(this.afterExecutingObject.data.mockCalled2);
        assertEquals(4, this.afterExecutingObject.data.mockCalled);
        assertEquals(4, this.afterExecutingObject.calledInstructions.while);

    },

    'test code wont enter to the while if value of expression is false': function () {
        this.presenter.state.lastUsedCode = this.presenter.state.codeGenerator.parse(this.test2);
        
        this.presenter.evaluateScoreFromUserCode();

        assertTrue(this.afterExecutingObject.data.mockCalled2);
        assertEquals(undefined, this.afterExecutingObject.data.mockCalled);
        assertEquals(0, this.afterExecutingObject.calledInstructions.while);
    }
});

TestCase("[PseudoCode_Console - language tests] do-while statement", {
    setUp: function () {
        this.presenter = AddonPseudoCode_Console_create();

        this.presenter.configuration.functions = {
            mock: this.presenter.validateFunction({name: "name", body: "builtIn.data.mockCalled = builtIn.data.mockCalled || 0;  builtIn.data.mockCalled++;"}).value.body,
            mock2: this.presenter.validateFunction({name: "name", body: "builtIn.data.mockCalled2 = true;"}).value.body
        };

        this.afterExecutingObject = {};
        var self = this;

        this.presenter.configuration.answer = {
            parameters: [],
            maxTimeForAnswer: {
                parsedValue: MAX_TIME_FOR_TEST
            },
            answerCode: function () {
                self.afterExecutingObject = this;
            }
        };

        this.presenter.initializeGrammar();
        this.presenter.completeObjectsMethods();

        /*
        program test
        variable a
        begin
            a = 1
            do
            begin
                mock()
                a = a + 1
            end
            while a < 5 
            mock2()
        end
        */
        this.test1 = "program test \n variable a \n begin \n a = 1 \n do \n begin \n mock() \n a = a + 1 \n end \n while a < 5 \n mock2() \n end";
        /*
        program test
        variable a
        begin
            a = 8
            while a < 5 do
            begin
                mock()
                a = a + 1
            end
            mock2()
        end
        */
        this.test2 = "program test \n variable a \n begin \n a = 8 \n do \n begin \n mock() \n a = a + 1 \n end \n while a < 5  \n mock2() \n end";
    },

    'test while will work if value of expression is true' : function () {
        this.presenter.state.lastUsedCode = this.presenter.state.codeGenerator.parse(this.test1);
        
        this.presenter.evaluateScoreFromUserCode();

        assertTrue(this.afterExecutingObject.data.mockCalled2);
        assertEquals(4, this.afterExecutingObject.data.mockCalled);
        assertEquals(4, this.afterExecutingObject.calledInstructions.doWhile);

    },

    'test code always enter to doWhile ': function () {
        this.presenter.state.lastUsedCode = this.presenter.state.codeGenerator.parse(this.test2);
        
        this.presenter.evaluateScoreFromUserCode();

        assertTrue(this.afterExecutingObject.data.mockCalled2);
        assertEquals(1, this.afterExecutingObject.data.mockCalled);
        assertEquals(1, this.afterExecutingObject.calledInstructions.doWhile);
    }
});

TestCase("[PseudoCode_Console - language tests] case statement", {
    setUp: function () {
        this.presenter = AddonPseudoCode_Console_create();

        this.presenter.configuration.functions = {
            mock:  this.presenter.validateFunction({name: "name", body: "builtIn.data.mockCalled = builtIn.data.mockCalled || {};  builtIn.data.mockCalled[arguments[0].value] = true"}).value.body

        };

        this.afterExecutingObject = {};
        var self = this;

        this.presenter.configuration.answer = {
            parameters: [],
            maxTimeForAnswer: {
                parsedValue: MAX_TIME_FOR_TEST
            },
            answerCode: function () {
                self.afterExecutingObject = this;
            }
        };

        this.presenter.initializeGrammar();
        this.presenter.completeObjectsMethods();

        /*
        program test
        variable a
        begin
            a = 1
            case a
                option 1,2 then
                begin
                    mock(1)
                end
                option "1","2" then
                    mock("s1")
            mock(2)
        end
        */
        this.test1 = "program test \n variable a \n begin \n a = 1 \n case a \n option 1,2 then \n begin \n mock(1) \n end \n option \"1\",\"2\" then \n mock(\"s1\") \n mock(2) \n end";
        
        /*
        program test
        variable a
        begin
            a = "2"
            case a
                option 1,2 then
                begin
                    mock(1)
                end
                option "1","2" then
                    mock("s1")
            mock(2)
        end
        */
        this.test2 = "program test \n variable a \n begin \n a = \"1\" \n case a \n option 1,2 then \n begin \n mock(1) \n end \n option \"1\",\"2\" then \n mock(\"s1\") \n mock(2) \n end";
        
    },

    'test case element can contains number': function () {
        this.presenter.state.lastUsedCode = this.presenter.state.codeGenerator.parse(this.test1);
        
        this.presenter.evaluateScoreFromUserCode();

        assertEquals(undefined, this.afterExecutingObject.data.mockCalled["s1"]);
        assertTrue(this.afterExecutingObject.data.mockCalled[1]);
        assertTrue(this.afterExecutingObject.data.mockCalled[2]);
    },

    'test case element can contains string' : function () {
        this.presenter.state.lastUsedCode = this.presenter.state.codeGenerator.parse(this.test2);
        
        this.presenter.evaluateScoreFromUserCode();

        assertEquals(true, this.afterExecutingObject.data.mockCalled["s1"]);
        assertEquals(undefined, this.afterExecutingObject.data.mockCalled[1]);
        assertTrue(this.afterExecutingObject.data.mockCalled[2]);
    }
});

TestCase("[PseudoCode_Console - language tests] array statement", {
    setUp: function () {
        this.presenter = AddonPseudoCode_Console_create();

        this.presenter.configuration.functions = {
            mock:  this.presenter.validateFunction({name: "name", body: "builtIn.data.mockCalled = arguments[0].value;"}).value.body,
            mock2: this.presenter.validateFunction({name: "name2", body: "builtIn.retVal.value = builtIn.objects.Number.__constructor__(22);"}).value.body

        };

        this.afterExecutingObject = {};
        var self = this;

        this.presenter.configuration.answer = {
            parameters: [],
            maxTimeForAnswer: {
                parsedValue: MAX_TIME_FOR_TEST
            },
            answerCode: function () {
                self.afterExecutingObject = this;
            }
        };

        this.presenter.initializeGrammar();
        this.presenter.completeObjectsMethods();

        /*
        program test
        variable a
        array b[2] = [1, 2]
        begin
            mock(b)
        end
         */
        this.test1 = "program test \n variable a \n array b[2] = [1, 2] \n begin \n mock(b) \n end";

        /*
        program test
        variable a
        array b[2] = [1, 2]
        begin
            a = b[0]
            mock(a)
        end
         */
        this.test2 = "program test \n variable a \n array b[2] = [1, 2] \n begin \n a = b[0] \n mock(a) \n end";

        /*
        program test
        variable a
        array b[2] = [1, 2]
        begin
            b[1] = 4
            mock(b[1])
        end
         */
        this.test3 = "program test \n variable a \n array b[2] = [1, 2] \n begin \n b[1] = 4 \n mock(b[1]) \n end";


        /*
        program test
        variable a, c
        array b[3] = [1, 2]
        begin
            c = 0
            b[1 + 1 + (0 * 5) + 0] = 4 + 4 * 2 + mock2()
            mock(b[c + 1 + 1])
        end
         */
        this.test4 = "program test \n variable a, c \n array b[3] = [1, 2] \n begin \n b[1 + 1 + (0 * 5) + 0] = 4 + 4 * 2 + mock2() \n mock(b[c + 1 + 1]) \n end";
    },

    'test array is correctly passed to function': function () {
        this.presenter.state.lastUsedCode = this.presenter.state.codeGenerator.parse(this.test1);

        this.presenter.evaluateScoreFromUserCode();

        assertEquals(1, this.afterExecutingObject.data.mockCalled[0].value);
        assertEquals(2, this.afterExecutingObject.data.mockCalled[1].value);
        assertEquals(2, this.afterExecutingObject.data.mockCalled.length);
    },

    'test array get value are correctly set': function () {
        this.presenter.state.lastUsedCode = this.presenter.state.codeGenerator.parse(this.test2);

        this.presenter.evaluateScoreFromUserCode();

        assertEquals(1, this.afterExecutingObject.data.mockCalled);
    },

    'test array get value are correctly received': function () {
        this.presenter.state.lastUsedCode = this.presenter.state.codeGenerator.parse(this.test3);

        this.presenter.evaluateScoreFromUserCode();

        assertEquals(4, this.afterExecutingObject.data.mockCalled);
    },

    'test array set correctly working with complicated statements': function () {
        this.presenter.state.lastUsedCode = this.presenter.state.codeGenerator.parse(this.test4);

        this.presenter.evaluateScoreFromUserCode();
        assertEquals(34, this.afterExecutingObject.data.mockCalled);
    }

});

TestCase("[PseudoCode_Console - language tests] methods", {
    setUp: function () {
        this.afterExecutingObject = {};

        this.presenter = AddonPseudoCode_Console_create();

        this.presenter.configuration.methods = [
            this.presenter.validateMethod({
                objectName: "Number",
                methodName: "test1",
                methodBody: "builtIn.data.mockCalled = arguments"
            }).method
        ];

        this.presenter.completeObjectsMethods();
        this.presenter.initializeExceptions();


        var self = this;
        this.presenter.configuration.answer = {
            parameters: [],
            maxTimeForAnswer: {
                parsedValue: MAX_TIME_FOR_TEST
            },
            answerCode: function () {
                self.afterExecutingObject = this;
            }
        };

        this.presenter.initializeGrammar();

        /*
        program test
        begin
            23.test1(1, 2, 3, "4", 5, 1==1)
        end
         */
        this.test1 = "" +
            "        program test\n" +
            "        begin\n" +
            "            23.test1(1, 2, 3, \"4\", 5, 1==1)\n" +
            "        end";
    },

    'test methods is called with args in correct order': function () {
        this.presenter.state.lastUsedCode = this.presenter.state.codeGenerator.parse(this.test1);

        this.presenter.evaluateScoreFromUserCode();

        assertEquals(1, this.afterExecutingObject.data.mockCalled[0].value);
        assertEquals(2, this.afterExecutingObject.data.mockCalled[1].value);
        assertEquals(3, this.afterExecutingObject.data.mockCalled[2].value);
        assertEquals("4", this.afterExecutingObject.data.mockCalled[3].value);
        assertEquals(5, this.afterExecutingObject.data.mockCalled[4].value);
        assertEquals(true, this.afterExecutingObject.data.mockCalled[5].value);
    }
});

TestCase("[PseudoCode_Console - language tests] exceptions", {
    setUp: function () {
        this.presenter = AddonPseudoCode_Console_create();
        this.presenter.initializeExceptions();
        this.presenter.completeObjectsMethods();

        var self = this;

        var prototype = Object.getPrototypeOf(this.presenter.exceptions);
        Object.getOwnPropertyNames(prototype).forEach(function (exceptionName) {
            if (exceptionName !== "translations" && exceptionName !== "constructor") {
                sinon.spy(self.presenter.exceptions, exceptionName);
            }
        });


        this.afterExecutingObject = {};

        this.presenter.configuration.functions = {
            mock2:  this.presenter.validateFunction({name: "name", body: "builtIn.data.mockCalled = arguments[0].value;"}).value.body
        };

        this.presenter.configuration.answer = {
            parameters: [],
            maxTimeForAnswer: {
                parsedValue: MAX_TIME_FOR_TEST
            },
            answerCode: function () {
                self.afterExecutingObject = this;
            }
        };

        this.presenter.initializeGrammar();

        /*
        program test
        variable a
        array b[2] = [1, 2]
        begin
            mock(b)
            mock2(b)
        end
         */
        this.test1 = "program test \n variable a \n array b[2] = [1, 2] \n begin \n mock(b)\n mock2(b)\n end";

        /*
        program test
        variable a
        begin
            mock2(b)
        end
         */
        this.test2 = "program test \n variable a \n begin \n mock2(b)\n end";

        /*
        program test
        variable a
        array b[2] = [1, 2]
        begin
            mock2(b);
        end
         */
        this.test3 = "program test \n variable a \n array b[2] = [1, 2] \n begin \n mock2(b);\n end";


        /*
        program test
        variable a
        array b[2] = [1, 2]
        begin
            mock2(b[1])
            mock2(b[3])
        end
         */
        this.test4 = "program test \n variable a \n array b[2] = [1, 2] \n begin \n mock2(b[1])\n mock2(b[2]) \n end";

        /*
        program test
        variable a
        array b[2] = [1, 2]
        begin
            mock2(b[1])
            mock2(b[-1])
        end
         */
        this.test5 = "program test \n variable a \n array b[2] = [1, 2] \n begin \n mock2(b[1])\n mock2(b[-1]) \n end";

        /*
        program test
        variable a
        array b[2] = [1]
        begin
            mock2(b[0])
            mock2(b[1])
        end
         */
        this.test6 = "program test \n variable a \n array b[2] = [1] \n begin \n mock2(b[0])\n mock2(b[1]) \n end";

        /*
        program test
        variable a
        array b[2] = [1]
        begin
            mock2(b[0])
            mock2(b["1"])
        end
         */
        this.test7 = "program test \n variable a \n array b[2] = [1] \n begin \n mock2(b[0])\n mock2(b[\"1\"]) \n end";

        /*
        program test
        variable a
        array b[2] = [1]
        begin

        end
         */
        this.test8 = "program test \n variable a \n array b[2] = [1] \n begin \n b[3] = 1 \n end";

        /*
        program test
        variable a
        array b[2] = [1]
        begin
            b[-1] = 2
        end
         */
        this.test9 = "program test \n variable a \n array b[2] = [1] \n begin \n b[-1] = 2 \n end";

        /*
        program test
        variable a
        array b[2] = [1]
        begin
            b["-1"] = 2
        end
         */
        this.test10 = "program test \n variable a \n array b[2] = [1] \n begin \n b[\"-1\"] = 2 \n end";

        /*
        program test
        variable a, b, c
        begin
            a = 1 == 1
            b = "xd"
            c = b + a
        end
         */
        this.test11 = "program test \n variable a, b, c \n begin \n a = 1 == 1 \n b = \"xd\" \n c = b + a \n end";

        /*
        program test
        variable a, b, c
        begin
            a = 1 == 1
            b = 12
            c = b + a
        end
         */
        this.test12 = "program test \n variable a, b, c \n begin \n a = 1 == 1 \n b = 12 \n c = b + a \n end";

        /*
        program test
        variable a, b, c
        begin
            a = 12
            b = "12"
            c = a - b
        end
        */
        this.test13 = "program test \n variable a, b, c \n begin \n a = 12 \n b = \"12\" \n c = a - b \n end";

        /*
        program test
        variable a, b, c
        begin
            a = 12
            b = "12"
            c = a / b
        end
        */
        this.test14 = "program test \n variable a, b, c \n begin \n a = 12 \n b = \"12\" \n c = a / b \n end";


        /*
        program test
        variable a, b, c
        begin
            a = 12
            b = "12"
            c = a * b
        end
        */
        this.test15 = "program test \n variable a, b, c \n begin \n a = 12 \n b = \"12\" \n c = a * b \n end";

        /*
        program test
        variable a, b, c
        begin
            a = 12
            b = "12"
            c = a /_ b
        end
        */
        this.test16 = "program test \n variable a, b, c \n begin \n a = 12 \n b = \"12\" \n c = a /_ b \n end";


        /*
        program test
        variable a, b, c
        begin
            a = 12
            b = "12"
            c = a % b
        end
        */
        this.test17 = "program test \n variable a, b, c \n begin \n a = 12 \n b = \"12\" \n c = a % b \n end";

        /*
        function a ()
        begin

        end

        function a ()
        begin

        end

        program test
        begin

        end
         */
        this.test18 = "function a () \n begin \n end \n function a () \n begin \n end \n program test \n begin \n end";

        /*
        function mock2 ()
        begin

        end
        program test
        begin

        end
         */
        this.test19 = "function mock2() \n begin \n end \n program test \n begin \n end \n";

        /*
        program test
        begin
            1.toString()
        end
         */
        //This toString is on purpose and will check if js built in method is not returned.
        this.test20 = "program test \n begin \n 1.toString2() \n end";
    },

    tearDown: function () {
    },

    'test executing undefined function will throw exception': function () {
        this.presenter.state.lastUsedCode = this.presenter.state.codeGenerator.parse(this.test1);

        try {
            this.presenter.checkCode();
        } catch (e) {
        }

        this.presenter.evaluateScoreFromUserCode();

        assertTrue(this.presenter.exceptions.UndefinedFunctionNameException.called);
    },

    'test executing undefined variable will throw exception': function () {
        this.presenter.state.lastUsedCode = this.presenter.state.codeGenerator.parse(this.test2);

        try {
            this.presenter.checkCode();
        } catch (e) {
        }

        this.presenter.evaluateScoreFromUserCode();

        assertTrue(this.presenter.exceptions.UndefinedVariableNameException.called);
    },

    'test wrong syntax will throw error': function () {
        var wasError = false;
        try {
            this.presenter.state.lastUsedCode = this.presenter.state.codeGenerator.parse(this.test3);
        } catch (e) {
            wasError = true;
        }

        assertEquals(true, wasError);
    },

    'test array throw OutOfBounds exception if index is above array length': function () {
        this.presenter.state.lastUsedCode = this.presenter.state.codeGenerator.parse(this.test4);

        this.presenter.evaluateScoreFromUserCode();

        assertTrue(this.presenter.exceptions.IndexOutOfBoundsException.called);
    },

    'test array throw OutOfBounds exception if index is below 0': function () {
        this.presenter.state.lastUsedCode = this.presenter.state.codeGenerator.parse(this.test5);

        this.presenter.evaluateScoreFromUserCode();

        assertTrue(this.presenter.exceptions.IndexOutOfBoundsException.called);
    },

    'test if array getter parameter is not a integer then throws Cast exception': function () {
        this.presenter.state.lastUsedCode = this.presenter.state.codeGenerator.parse(this.test7);

        this.presenter.evaluateScoreFromUserCode();

        assertTrue(this.presenter.exceptions.CastErrorException.called);
    },

    'test array setter throw OutOfBounds exception if index is above array size': function () {
        this.presenter.state.lastUsedCode = this.presenter.state.codeGenerator.parse(this.test8);

        this.presenter.evaluateScoreFromUserCode();

        assertTrue(this.presenter.exceptions.IndexOutOfBoundsException.called);
    },

    'test array setter throw OutOfBounds exception if index is below 0': function () {
        this.presenter.state.lastUsedCode = this.presenter.state.codeGenerator.parse(this.test9);

        this.presenter.evaluateScoreFromUserCode();

        assertTrue(this.presenter.exceptions.IndexOutOfBoundsException.called);
    },

    'test array setter will throw cast exception if index is not a number': function () {
        this.presenter.state.lastUsedCode = this.presenter.state.codeGenerator.parse(this.test10);

        this.presenter.evaluateScoreFromUserCode();

        assertTrue(this.presenter.exceptions.CastErrorException.called);
    },

    'test string will throw exception if is trying to add not a number and not a string': function () {
        this.presenter.state.lastUsedCode = this.presenter.state.codeGenerator.parse(this.test11);

        this.presenter.evaluateScoreFromUserCode();

        assertTrue(this.presenter.exceptions.CastErrorException.called);
    },

    'test number will throw exception if is trying to add not a number and not a string': function () {
        this.presenter.state.lastUsedCode = this.presenter.state.codeGenerator.parse(this.test12);

        this.presenter.evaluateScoreFromUserCode();

        assertTrue(this.presenter.exceptions.CastErrorException.called);
    },

    'test number will throw exception if is trying to sub not a number': function () {
        this.presenter.state.lastUsedCode = this.presenter.state.codeGenerator.parse(this.test13);

        this.presenter.evaluateScoreFromUserCode();

        assertTrue(this.presenter.exceptions.CastErrorException.called);
    },

    'test number will throw exception if is trying to div not a number': function () {
        this.presenter.state.lastUsedCode = this.presenter.state.codeGenerator.parse(this.test14);

        this.presenter.evaluateScoreFromUserCode();

        assertTrue(this.presenter.exceptions.CastErrorException.called);
    },

    'test number will throw exception if is trying to mul not a number': function () {
        this.presenter.state.lastUsedCode = this.presenter.state.codeGenerator.parse(this.test15);

        this.presenter.evaluateScoreFromUserCode();

        assertTrue(this.presenter.exceptions.CastErrorException.called);
    },

    'test number will throw exception if is trying to div without rest not a number': function () {
        this.presenter.state.lastUsedCode = this.presenter.state.codeGenerator.parse(this.test16);

        this.presenter.evaluateScoreFromUserCode();

        assertTrue(this.presenter.exceptions.CastErrorException.called);
    },

    'test number will throw exception if is trying to modulo not a number': function () {
        this.presenter.state.lastUsedCode = this.presenter.state.codeGenerator.parse(this.test17);

        this.presenter.evaluateScoreFromUserCode();

        assertTrue(this.presenter.exceptions.CastErrorException.called);
    },

    'test user defined multiple instructions with the same name': function () {
        this.presenter.state.lastUsedCode = this.presenter.state.codeGenerator.parse(this.test18);

        try {
            this.presenter.checkCode();
        } catch (e) {
        }

        this.presenter.evaluateScoreFromUserCode();

        assertTrue(this.presenter.exceptions.InstructionIsDefinedException.called);
    },

    'test user defined instruction with name which was defined in addon property': function () {
        this.presenter.state.lastUsedCode = this.presenter.state.codeGenerator.parse(this.test19);

        try {
            this.presenter.checkCode();
        } catch (e) {
        }

        this.presenter.evaluateScoreFromUserCode();

        assertTrue(this.presenter.exceptions.InstructionIsDefinedException.called);
    },

    'test user calls method which is not defined': function () {
        this.presenter.state.lastUsedCode = this.presenter.state.codeGenerator.parse(this.test20);

        try {
            this.presenter.checkCode();
        } catch (e) {
        }

        this.presenter.evaluateScoreFromUserCode();

        assertTrue(this.presenter.exceptions.MethodNotFoundException.called);
    }
});