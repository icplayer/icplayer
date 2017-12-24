TestCase("[Pseudo_Console - language tests] if statement", {
    setUp: function () {
        this.presenter = AddonPseudo_Console_create();

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
                parsedValue: 20
            },
            answerCode: function () {
                self.afterExecutingObject = this;
            }
        };

        this.presenter.initializeGrammar();
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

TestCase("[Pseudo_Console - language tests] variables statement", {
    setUp: function () {
        this.presenter = AddonPseudo_Console_create();

        this.presenter.configuration.functions = {
            mock: this.presenter.validateFunction({name: "name", body: "builtIn.data.mockCalled = arguments[0];"}).value.body,
            mock2: this.presenter.validateFunction({name: "name", body: "builtIn.data.mockCalled2 = arguments[0];"}).value.body,
            mock3: this.presenter.validateFunction({name: "name", body: "builtIn.data.mockCalled3 = arguments[0];"}).value.body
        };

        this.afterExecutingObject = {};
        var self = this;

        this.presenter.configuration.answer = {
            parameters: [],
            maxTimeForAnswer: {
                parsedValue: 20
            },
            answerCode: function () {
                self.afterExecutingObject = this;
            }
        };

        this.presenter.initializeGrammar();
        this.test1 = "program test \n variable a, b \n begin \n a=1 \n mock2(a) \n mock(b) \n a = \"aaaa\" \n mock3(a) \n end";
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
    }

});


TestCase("[Pseudo_Console - language tests] math statement", {
    setUp: function () {
        this.presenter = AddonPseudo_Console_create();

        this.presenter.configuration.functions = {
            mock: this.presenter.validateFunction({name: "name", body: "builtIn.data.mockCalled = arguments[0];"}).value.body,
            mock2: this.presenter.validateFunction({name: "name", body: "builtIn.data.mockCalled2 = arguments[0];"}).value.body,
            mock3: this.presenter.validateFunction({name: "name", body: "builtIn.data.mockCalled3 = arguments[0];"}).value.body
        };

        this.afterExecutingObject = {};
        var self = this;

        this.presenter.configuration.answer = {
            parameters: [],
            maxTimeForAnswer: {
                parsedValue: 20
            },
            answerCode: function () {
                self.afterExecutingObject = this;
            }
        };

        this.presenter.initializeGrammar();
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
    }
});

TestCase("[Pseudo_Console - language tests] logical statement", {
    setUp: function () {
        this.presenter = AddonPseudo_Console_create();

        this.presenter.configuration.functions = {
            mock: this.presenter.validateFunction({name: "name", body: "builtIn.data.mockCalled = builtIn.data.mockCalled || {}; builtIn.data.mockCalled[arguments[0].value] = arguments[1]; "}).value.body
        };

        this.afterExecutingObject = {};
        var self = this;

        this.presenter.configuration.answer = {
            parameters: [],
            maxTimeForAnswer: {
                parsedValue: 20
            },
            answerCode: function () {
                self.afterExecutingObject = this;
            }
        };

        this.presenter.initializeGrammar();
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
        end
    */
    this.test2 = "program test \n variable a, b, c \n begin \n a = 1 > 2 \n b = 2 > 1 \n mock(1, a) \n mock(2, b) \n a = 1 == 2 \n b = 2 == 2 \n mock(3, a) \n mock(4, b) \n a = 1 >= 2 \n b = 2 >= 1 \n c = 2 >= 2 \n mock(5, a) \n mock(6, b) \n mock(7, c) \n a = 1 <= 2 \n b = 2 <= 1 \n c = 2 <= 2 \n mock(8, a) \n mock(9, b) \n mock(10, c) \n a = 1 != 1 \n b = 1 != 2 \n mock(11, a) \n mock(12, b) \n end";
    },

    'test "and" and "or" statements': function () {
        this.presenter.state.lastUsedCode = this.presenter.state.codeGenerator.parse(this.test1);

        this.presenter.evaluateScoreFromUserCode();

        assertEquals(true, this.afterExecutingObject.data.mockCalled[1].value);
        assertEquals(false, this.afterExecutingObject.data.mockCalled[2].value);
    },

    'test comparasions': function () {
        var expected = [false, true, false, true, false, true, true, true, false, true, false, true],
            i;
        this.presenter.state.lastUsedCode = this.presenter.state.codeGenerator.parse(this.test2);
        
        this.presenter.evaluateScoreFromUserCode();

        for (i = 0; i < expected.length; i += 1) {
            assertEquals(expected[i], this.afterExecutingObject.data.mockCalled[i + 1].value);
        }
    }

});

TestCase("[Pseudo_Console - language tests] user defined functions", {
    setUp: function () {
        this.presenter = AddonPseudo_Console_create();

        this.presenter.configuration.functions = {
            mock: this.presenter.validateFunction({name: "name", body: "builtIn.data.mockCalled = builtIn.data.mockCalled || {}; builtIn.data.mockCalled[arguments[0].value] = arguments[1];"}).value.body
        };

        this.afterExecutingObject = {};
        var self = this;

        this.presenter.configuration.answer = {
            parameters: [],
            maxTimeForAnswer: {
                parsedValue: 20
            },
            answerCode: function () {
                self.afterExecutingObject = this;
            }
        };

        this.presenter.initializeGrammar();

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
            testfunc("W", 5)
            mock(3, "OK2")
        end
        */
        this.test2 = "function testfunc (a, b) \n begin \n mock(1, a) \n mock(2, b) \n end \n program test \n begin \n testfunc(\"W\", 5) \n mock(3, \"OK2\") \n end";

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
        this.test3 = "function testfunc (a, b) \n begin \n return a + b \n end \n program test \n variable a \n begin \n a = testfunc(2, 4) \n mock(1, a) \n end"
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
    }
});

TestCase("[Pseudo_Console - language tests] for statement", {
    setUp: function () {
        this.presenter = AddonPseudo_Console_create();

        this.presenter.configuration.functions = {
            mock: this.presenter.validateFunction({name: "name", body: "builtIn.data.mockCalled = builtIn.data.mockCalled || 0;  builtIn.data.mockCalled++;"}).value.body,
            mock2: this.presenter.validateFunction({name: "name", body: "builtIn.data.mockCalled2 = true;"}).value.body
        };

        this.afterExecutingObject = {};
        var self = this;

        this.presenter.configuration.answer = {
            parameters: [],
            maxTimeForAnswer: {
                parsedValue: 20
            },
            answerCode: function () {
                self.afterExecutingObject = this;
            }
        };

        this.presenter.initializeGrammar();
        /*
        program test
        variable a
        begin
            for a from 1 to 5 do
            begin
                mock()
            end
            mock2()
        end
        */
        this.test1 = "program test \n variable a \n begin \n for a from 1 to 5 do \n begin \n mock() \n end \n mock2() \n end";

        /*
        program test
        variable a, b
        begin
            b = 8
            for a from 1 to b do
            begin
                mock()
            end
            mock2()
        end
        */
        this.test2 = "program test \n variable a, b \n begin \n b = 8\n for a from 1 to b do \n begin \n mock() \n end \n mock2() \n end";
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
        assertEquals(8, this.afterExecutingObject.data.mockCalled);
        assertEquals(8, this.afterExecutingObject.calledInstructions.for);        
    }
});

TestCase("[Pseudo_Console - language tests] while statement", {
    setUp: function () {
        this.presenter = AddonPseudo_Console_create();

        this.presenter.configuration.functions = {
            mock: this.presenter.validateFunction({name: "name", body: "builtIn.data.mockCalled = builtIn.data.mockCalled || 0;  builtIn.data.mockCalled++;"}).value.body,
            mock2: this.presenter.validateFunction({name: "name", body: "builtIn.data.mockCalled2 = true;"}).value.body
        };

        this.afterExecutingObject = {};
        var self = this;

        this.presenter.configuration.answer = {
            parameters: [],
            maxTimeForAnswer: {
                parsedValue: 20
            },
            answerCode: function () {
                self.afterExecutingObject = this;
            }
        };

        this.presenter.initializeGrammar();

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

TestCase("[Pseudo_Console - language tests] do-while statement", {
    setUp: function () {
        this.presenter = AddonPseudo_Console_create();

        this.presenter.configuration.functions = {
            mock: this.presenter.validateFunction({name: "name", body: "builtIn.data.mockCalled = builtIn.data.mockCalled || 0;  builtIn.data.mockCalled++;"}).value.body,
            mock2: this.presenter.validateFunction({name: "name", body: "builtIn.data.mockCalled2 = true;"}).value.body
        };

        this.afterExecutingObject = {};
        var self = this;

        this.presenter.configuration.answer = {
            parameters: [],
            maxTimeForAnswer: {
                parsedValue: 20
            },
            answerCode: function () {
                self.afterExecutingObject = this;
            }
        };

        this.presenter.initializeGrammar();

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

TestCase("[Pseudo_Console - language tests] case statement", {
    setUp: function () {
        this.presenter = AddonPseudo_Console_create();

        this.presenter.configuration.functions = {
            mock:  this.presenter.validateFunction({name: "name", body: "builtIn.data.mockCalled = builtIn.data.mockCalled || {};  builtIn.data.mockCalled[arguments[0].value] = true"}).value.body

        };

        this.afterExecutingObject = {};
        var self = this;

        this.presenter.configuration.answer = {
            parameters: [],
            maxTimeForAnswer: {
                parsedValue: 20
            },
            answerCode: function () {
                self.afterExecutingObject = this;
            }
        };

        this.presenter.initializeGrammar();

        /*
        program test
        variable a
        begin
            a = 1
            case a
                option 1 then
                begin
                    mock(1)
                end
                option "1" then
                    mock("s1")
            mock(2)
        end
        */
        this.test1 = "program test \n variable a \n begin \n a = 1 \n case a \n option 1 then \n begin \n mock(1) \n end \n option \"1\" then \n mock(\"s1\") \n mock(2) \n end";
        
        /*
        program test
        variable a
        begin
            a = "1"
            case a
                option 1 then
                begin
                    mock(1)
                end
                option "1" then
                    mock("s1")
            mock(2)
        end
        */
        this.test2 = "program test \n variable a \n begin \n a = \"1\" \n case a \n option 1 then \n begin \n mock(1) \n end \n option \"1\" then \n mock(\"s1\") \n mock(2) \n end";
        
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

TestCase("[Pseudo_Console - language tests] array statement", {
    setUp: function () {
        this.presenter = AddonPseudo_Console_create();

        this.presenter.configuration.functions = {
            mock:  this.presenter.validateFunction({name: "name", body: "builtIn.data.mockCalled = arguments[0].value;"}).value.body

        };

        this.afterExecutingObject = {};
        var self = this;

        this.presenter.configuration.answer = {
            parameters: [],
            maxTimeForAnswer: {
                parsedValue: 20
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
        this.test2 = "program test \n variable a \n array b[2] = [1, 2] \n begin \n b[1] = 4 \n mock(b[1]) \n end";

    },

    'test array get value are correctly received': function () {
        this.presenter.state.lastUsedCode = this.presenter.state.codeGenerator.parse(this.test2);

        this.presenter.evaluateScoreFromUserCode();

        assertEquals(4, this.afterExecutingObject.data.mockCalled);
    }

});