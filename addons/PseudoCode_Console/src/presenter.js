/**
 * Teoria:
 * http://wazniak.mimuw.edu.pl/index.php?title=Podstawy_kompilator%C3%B3w
 * Check comments if you want to add OOP to language.
 */
function AddonPseudoCode_Console_create() {
    var presenter = function () {},
        JISON_GRAMMAR;

    // ----------------------- LANGUAGE COMPILER SECTION -----------------------------------
    /**
     * OOP:
     *      Each variable is object, with struct as:
     *      {
     *          value: valueOfObject,
     *          methods: {
     *              methodName: {isBuiltIn: true|false, labelToJump: string|null, jsCode: string|null}
     *          },
     *          type: typeNameAsString,
     *          parent: object to parent or null
     *      }
     *      New object is created by function which will returns empty object.
     *      Each object can contains class methods, which name will start with __. (Concept: user can override this methods by built prefix.)
     *
     *      Calling built in methods:
     *          Check Object call manager for more information
     *
     *      Defined by user (concept):
     *          Set as actual context object value, and jump to labelToJump
     *
     *          Example class:
     *          class A
     *               field zmienna
     *
     *               method getName (tekst)
     *               begin
     *                   print()
     *               end
     *           
     *               built method add ()    %As override class method in add%
     *               begin
     *                   return "A"
     *               end
     *
     *
     *           endClass
     *
     *          check object call manager for more information
     *
     */
    JISON_GRAMMAR = {
        "lex": {
            "options" : {
                flex: true
            },
            "rules": [
                //String section, if lexer will catch " without string condition, then start condition string. While this condition, only rules with ["string"] will be in use
                //and this condition will be turned off if " will be catch with start condition
                ["[\"]",                    "this.begin('string'); return 'START_STRING'"],
                [["string"], "[^\"\\\\]",   "return 'STRING';"],
                [["string"], "[\\n]",       "return 'NEWLINE_IN_STRING';"],
                [["string"], "\\\\.",       "return 'STRING'"],  // match \. <- escaped characters"
                [["string"], "$",           "return 'EOF_IN_STRING';"],
                [["string"], "[\"]",        "this.popState(); return 'END_STRING';"],
                //Words between |<name>| will be replaced by values from configuration
                ["|begin|",                 "return 'BEGIN_BLOCK';"],
                ["|end|",                   "return 'END_BLOCK';"],
                ["|program|",               "return 'PROGRAM';"],
                ["|variable|",              "return 'VARIABLE_DEF';"],
                ["|for|",                   "return 'FOR';"],
                ["|from|",                  "return 'FROM';"],
                ["|to|",                    "return 'TO';"],
                ["|do|",                    "return 'DO';"],
                ["|or|",                    "return 'OR';"],
                ["|and|",                   "return 'AND';"],
                ["|while|",                 "return 'WHILE';"],
                ["|if|",                    "return 'IF';"],
                ["|then|",                  "return 'THEN';"],
                ["|else|",                  "return 'ELSE';"],
                ["|case|",                  "return 'CASE';"],
                ["|option|",                "return 'OPTION';"],
                ["|function|",              "return 'FUNCTION';"],
                ["|return|",                "return 'RETURN';"],
                ["|array_block|",           "return 'ARRAY_DEF';"],
                ["\\n+",                    "return 'NEW_LINE';"],
                ["$",                       "return 'EOF';"],
                ["[0-9]+(?:\\.[0-9]+)?\\b", "return 'NUMBER';"],
                ["<=",                      "return '<=';"],
                [">=",                      "return '>=';"],
                ["!=",                      "return '!=';"],
                ["==",                      "return '==';"],
                ["<",                       "return '<';"],
                [">",                       "return '>';"],
                ["\\*",                     "return '*';"],
                ["\\/_",                    "return 'DIV_FLOOR';"],
                ["\\/",                     "return '/';"],
                ["-",                       "return '-';"],
                ["\\+",                     "return '+';"],
                ["%",                       "return '%';"],
                ["\\(",                     "return '(';"],
                ["\\)",                     "return ')';"],
                ["[A-Za-z_][a-zA-Z0-9_]*",  "return 'STATIC_VALUE';"],
                ["\\[",                     "return '[';"],
                ["\\]",                     "return ']';"],
                [",",                       "return 'COMMA';"],
                ["\\.",                     "return 'DOT';"],
                ["=",                       "return '=';"],
                ["[ \f\r\t\v​\u00A0\u1680​\u180e\u2000​\u2001\u2002​\u2003\u2004​\u2005\u2006​\u2007\u2008​\u2009\u200a​\u2028\u2029​\u2028\u2029​\u202f\u205f​\u3000]",                   "/* IGNORE SPACES */"],
                [".",                       "return 'NOT_MATCH';"]
            ],

            //Each conditions used by lexer must be defined there
            "startConditions" : {
                string: 1,
            }
        },

        //Operators order
        "operators": [                  //Be sure, you added operators here to avoid problems with conflicts
            ["left", "OR", "AND"],
            ["left", "<=", ">=", "<", ">", "!=", "=="],
            ["left", "+", "-"],
            ["left", "*", "/", "DIV_FLOOR", "%"],
            ["left", "(", ")"],
            ["lefr", "DOT"],
            ["left", "[", "]"],
            ["left", "UMINUS"],
            ["right", "IF", "ELSE", "THEN"],
            ["right", "CASE", "OPTION"]
        ],
        "bnf": {
            //entry point
            "expressions" : [
                //Code executor will stop when will receive undefined to execute.
                [ "functions program_name section_list code_block",   "return {sections: $3, code: $4.concat(undefined).concat($1).concat(undefined).concat(yy.presenterContext.bnf['getObjectCallManager']())};($2 || '') + ($3 || '');"  ]
            ],

            "functions" : [
                "",
                ["functions_list", "$$ = $1;"]
            ],

            "functions_list" : [
                ["function", "$$ = $1;"],
                ["functions_list function", "$$ = $1.concat($2);"]
            ],

            "function" : [
                ["function_declaration ( function_arguments ) end_line section_list code_block", "$$ = yy.presenterContext.bnf['function'](yy, $1, $3 || [], $6, $7);"]
            ],

            "function_declaration" : [
                ["FUNCTION STATIC_VALUE", "$$ = yy.presenterContext.bnf['function_declaration'](yy, $2);"]
            ],

            "function_arguments" : [
                "",
                ["function_arguments_list", "$$ = $1 || [];"]
            ],

            "function_arguments_list" : [
                ["STATIC_VALUE", "$$ = [$1];"],
                ["function_arguments_list COMMA STATIC_VALUE", "$1.push($3); $$ = $1;"]
            ],

            "program_name" : [
                ["program_const STATIC_VALUE end_line", "$$ = yy.presenterContext.bnf['program_name'](yy, $2); "]
            ],

            "program_const" : [
                ["PROGRAM", "$$ = '';"]
            ],

            "section_list" : [
                "",
                ["section_list section", "$$ = ($1 || '') + $2;"]
            ],

            "section" : [
                ["var_section", "$$ = $1;"],
                ["array_section", "$$ = $1;"]
            ],

            "array_section" : [
                ["ARRAY_DEF array_list NEW_LINE", "$$ = $2 || ''"]
            ],

            "array_list": [
                ["array_definition", "$$ = $1"],
                ["array_list COMMA array_definition", "$$ = $1"]
            ],

            "array_definition" : [
                ["STATIC_VALUE [ NUMBER ] array_start_value", "$$ = yy.presenterContext.bnf['array'](yy, $1, $3, $5);"]
            ],

            "array_start_value": [
                "",
                [" = [ array_start_entries ]", "$$ = $3"]
            ],

            "array_start_entries": [
                ["array_start_entry", "$$ = $1"],
                ["array_start_entries COMMA array_start_entry", "$$ = $1.concat($3);"]
            ],

            "array_start_entry" : [
                ["number_or_string", "$$ = $1"]
            ],

            "var_section" : [
                ["variable_def_const var_list end_line", "$$ = $2;"]
            ],

            "variable_def_const" : [
                ["VARIABLE_DEF", "$$ = '';"]
            ],

            "var_list" : [
                ["var", "$$ = $1;"],
                ["var_list comma_separator var", "$$ = $1 + $3;"]
            ],

            "comma_separator" : [
                ["COMMA", "$$ = '';"]
            ],

            "var" : [
                ["STATIC_VALUE", "$$ = yy.presenterContext.bnf['var'](yy, yytext);"]
            ],

            "code_block" : [
                ["begin_block instructions end_block", "$$ = $2 || [];"]
            ],

            "code_block_or_instruction" : [
                ["code_block", "$$ = $1 || [];"],
                ["instruction", "$$ = $1 || [];"]
            ],

            "begin_block" : [
                ["BEGIN_BLOCK end_line", "$$ = '';"]
            ],

            "end_block": [
                ["END_BLOCK end_line", "$$ = '';"]
            ],

            "instructions" : [
                "",
                ["instruction_list", "$$ = $1;"]
            ],

            "instruction_list" : [
                ["instruction", "$$ = $1;"],
                ["instruction_list instruction", "$$ = $1.concat($2);"]
            ],

            "instruction" : [
                ['for_instruction', '$$ = $1;'],
                ['while_instruction', '$$ = $1;'],
                ['do_while_instruction', '$$ = $1;'],
                ["assign_value", "$$ = $1;"],
                ["if_instruction", "$$ = $1"],
                ["case_instruction", "$$ = $1;"],
                ["RETURN operation end_line", "$$ = yy.presenterContext.bnf['return_value'](yy, $2);"]
            ],

            "case_instruction" : [
                ["CASE variable_get end_line case_options", "$$ = yy.presenterContext.bnf['case']($2, $4);"]
            ],

            "case_options" : [
                ["case_option", "$$ = $1;"],
                ["case_options case_option", "$$ = $1.concat($2);;"]
            ],

            "case_option": [
                ["OPTION number_or_string THEN end_line code_block_or_instruction", "$$ = yy.presenterContext.bnf['case_option']($2, $5);"]
            ],

            "number_or_string" : [
                ["number_value", "$$ = $1;"],
                ["string_value", "$$ = $1;"]
            ],

            "if_instruction" : [
                ["IF operation THEN end_line code_block_or_instruction", "$$ = yy.presenterContext.bnf['if_instruction']($2, $5);"],
                ["IF operation THEN end_line code_block_or_instruction ELSE end_line code_block_or_instruction",  "$$ = yy.presenterContext.bnf['if_else_instruction']($2, $5, $8);"]
            ],

            "assign_value" : [
                ['operation [ operation ] = operation end_line', "$$ = yy.presenterContext.bnf['assign_array_value']($1, $3, $6);"],
                ['STATIC_VALUE = operation end_line', "$$ = yy.presenterContext.bnf['assign_value_1'](yy, $1, $3);"],
                ['operation end_line', "$$ = yy.presenterContext.bnf['assign_value_2']($1);"]
            ],

            "do_while_instruction" : [
                ["do_while_header end_line code_block_or_instruction do_while_checker", "$$ = $1.concat($3).concat($4);"]
            ],

            "do_while_header" : [
                ["DO", "$$ = yy.presenterContext.bnf['do_while_header'](yy);"]
            ],

            "do_while_checker" : [
                ["WHILE operation end_line", "$$ = yy.presenterContext.bnf['do_while_exiter'](yy, $2);"]
            ],

            "while_instruction" : [
                ["while_header end_line code_block_or_instruction", "var endBlock = yy.presenterContext.bnf['while_exiter'](yy); $$ = $1.concat($3).concat(endBlock);"]
            ],

            "while_header" : [
                ["WHILE operation DO", "$$ = $$ = yy.presenterContext.bnf['while_header'](yy, $2);"]
            ],

            "for_instruction" : [
                ["for_value_header end_line code_block_or_instruction", "$$ = $1.concat($3).concat(yy.presenterContext.bnf['for_exiter'](yy));"]
            ],

            "for_value_header" : [
                ["FOR STATIC_VALUE FROM NUMBER TO static_value_or_number DO", "$$ = yy.presenterContext.bnf['for_value_header'](yy, $2, $4, $6);"]
            ],

            "static_value_or_number" : [
                ["STATIC_VALUE", "$$ = yy.presenterContext.bnf['for_argument'](yy, yytext);"],
                ["NUMBER", "$$ = Number(yytext);"]
            ],

            "arguments" : [
                "",
                ["arguments_list", "$$ = $1;"]
            ],

            "arguments_list" : [
                ["argument", "$$ = [$1];"],
                ["arguments_list COMMA argument", "$1.push($3); $$ = $1;"]
            ],

            "argument" : [
                ["operation", "$$ = $1;"]
            ],

            "string_value": [
                ["START_STRING string_chars END_STRING", "$$ = [yy.presenterContext.generateExecuteObject('stack.push(presenter.objectMocks.String.__constructor__.call({},\"' +  ($2 || '') + '\"))', '')];"]
            ],

            "string_chars" : [
                "",
                ["string_char", "$$ = $1"]
            ],

            "string_char" : [
                ["STRING", "$$ = $1;"],
                ["string_char STRING", "$$ = $1 + $2"]
            ],

            "end_line" : [
                ["new_line_list", "$$='';"]
            ],

            "new_line_list" : [
                ["EOF", "$$='';"],
                ["NEW_LINE", "$$='';"],
                ["new_line_list NEW_LINE", "$$='';"],
                ["new_line_list EOF", "$$ = '';"]
            ],

            "operation" : [
                [ "STATIC_VALUE ( arguments )", "$$ = yy.presenterContext.bnf['function_call'](yy, $1, $3);"],
                [ "operation + operation",      "$$ = yy.presenterContext.generateOperationCode($1, $3, '__add__');" ],
                [ "operation - operation",      "$$ = yy.presenterContext.generateOperationCode($1, $3, '__sub__');" ],
                [ "operation * operation",      "$$ = yy.presenterContext.generateOperationCode($1, $3, '__mul__');" ],
                [ "operation DIV_FLOOR operation", "$$ = yy.presenterContext.generateOperationCode($1, $3, '__div_full__');" ],
                [ "operation / operation",      "$$ = yy.presenterContext.generateOperationCode($1, $3, '__div__');" ],
                [ "operation % operation",      "$$ = yy.presenterContext.generateOperationCode($1, $3, '__mod__');" ],
                [ "operation <= operation",     "$$ = yy.presenterContext.generateOperationCode($1, $3, '__le__');" ],
                [ "operation >= operation",     "$$ = yy.presenterContext.generateOperationCode($1, $3, '__ge__');" ],
                [ "operation > operation",      "$$ = yy.presenterContext.generateOperationCode($1, $3, '__gt__');" ],
                [ "operation < operation",      "$$ = yy.presenterContext.generateOperationCode($1, $3, '__lt__');" ],
                [ "operation != operation",     "$$ = yy.presenterContext.generateOperationCode($1, $3, '__neq__');" ],
                [ "operation == operation",     "$$ = yy.presenterContext.generateOperationCode($1, $3, '__eq__');" ],
                [ "operation OR operation",     "$$ = yy.presenterContext.generateOperationCode($1, $3, '__or__');" ],
                [ "operation AND operation",    "$$ = yy.presenterContext.generateOperationCode($1, $3, '__and__');" ],
                [ "( operation )",              "$$ = $2" ],
                [ "- operation",                "$$ = yy.presenterContext.generateMinusOperation($2);", {"prec": "UMINUS"} ],
                [ "operation DOT STATIC_VALUE ( arguments )", "$$ = yy.presenterContext.bnf['method_call']($3, $5 || [], $1);"],
                [ "number_value",               "$$ = $1" ],
                [ "variable_get",               "$$ = $1" ],
                [ "string_value",               "$$ = $1" ],
            ],

            "variable_get": [
                ["STATIC_VALUE", "$$ = yy.presenterContext.bnf['argument'](yy, yytext);"],
                ["operation [ operation ]", "$$ = yy.presenterContext.bnf['array_get']($1, $3);"]
            ],

            "number_value": [
                ["NUMBER", "$$ = [yy.presenterContext.generateExecuteObject('stack.push(presenter.objectMocks.Number.__constructor__.call({}, Number(' + yytext + ')))', '')];"]
            ]
        }
    };

    presenter.uidDecorator = function presenter_uidDecorator(fn) {
        return function () {
            presenter.bnf.uid += 1;
            return fn.apply(this, arguments);
        };
    };

    /**
     * Arguments dispatcher for methods. Before calling method get object and arguments from stack and convert it to js call with arguments
     * @param fn {Function}
     * @returns {Function}
     */
    presenter.objectMocksMethodArgumentsDispatcherDecorator = function presenter_objectMocksMethodArgumentsDispatcherDecorator (fn) {
        return function () {
            var builtIn = {
               console: arguments[0].console,
               data: arguments[0].data,
               objects: arguments[1],
               retVal: arguments[4]
            };
            builtIn.console.nextIns = arguments[2];
            builtIn.console.pauseIns = arguments[3];
            arguments = Array.prototype.slice.call(arguments, 5);

            arguments.push(builtIn);

            builtIn.retVal.value = fn.apply(this, arguments);
        };
    };

    /**
     * Each object in pseudocode console must be created by this mock.
     */
    presenter.objectMocks = {
        Object: {
            __constructor__: function object__constructor__ () {
                return {
                    value: null,
                    type: "Object",
                    methods: presenter.objectMocks.Object['__methods__'],
                    parent: null
                }
            },
            __methods__: {
                __and__: {
                    native: true,
                    jsCode: presenter.objectMocksMethodArgumentsDispatcherDecorator(function object__and__method (toValue) {
                        /** Table which value should be returned
                         *  Value1 and Value2 -Will Return -> ValueX:
                         *  -----------------------------
                         *  False1 and True2  -> False1
                         *  False1 and False2 -> False1
                         *  True1  and False2 -> False2
                         *  True1  and True2  -> True2
                         */
                        if (!this.value) {
                            return this;
                        }

                        if (toValue.value) {
                            return toValue;
                        }

                        return toValue;
                    })
                },
                __or__: {
                        /** Table which value should be returned
                         *  Value1 and Value2 -Will Return -> ValueX:
                         *  --------------------------------
                         *  False1 and True2  -> True2
                         *  False1 and False2 -> False2
                         *  True1  and False2 -> True1
                         *  True1  and True2  -> True1
                         */
                    native: true,
                    jsCode: presenter.objectMocksMethodArgumentsDispatcherDecorator(function object__or__method (toValue) {
                        if (this.value) {
                            return this;
                        }

                        return toValue;
                    })
                },
                __ge__: {
                    native: true,
                    jsCode: presenter.objectMocksMethodArgumentsDispatcherDecorator(function object_ge__method (toValue) {
                        if (this.value >= toValue.value) {
                            return presenter.objectMocks.Boolean.__constructor__(true);
                        }

                        return presenter.objectMocks.Boolean.__constructor__(false);
                    })
                },
                __le__: {
                    native: true,
                    jsCode: presenter.objectMocksMethodArgumentsDispatcherDecorator(function object__le__method (toValue) {
                        if (this.value <= toValue.value) {
                            return presenter.objectMocks.Boolean.__constructor__(true);
                        }

                        return presenter.objectMocks.Boolean.__constructor__(false);
                    })
                },

                __gt__: {
                    native: true,
                    jsCode: presenter.objectMocksMethodArgumentsDispatcherDecorator(function object__gt__method (toValue) {
                        if (this.value > toValue.value) {
                            return presenter.objectMocks.Boolean.__constructor__(true);
                        }

                        return presenter.objectMocks.Boolean.__constructor__(false);
                    })
                },

                __lt__: {
                    native: true,
                    jsCode: presenter.objectMocksMethodArgumentsDispatcherDecorator(function object__lt__method (toValue) {
                        if (this.value < toValue.value) {
                            return presenter.objectMocks.Boolean.__constructor__(true);
                        }

                        return presenter.objectMocks.Boolean.__constructor__(false);
                    })
                },

                __neq__: {
                    native: true,
                    jsCode: presenter.objectMocksMethodArgumentsDispatcherDecorator(function object__neq__method (toValue) {
                        if (this.value !== toValue.value) {
                            return presenter.objectMocks.Boolean.__constructor__(true);
                        }

                        return presenter.objectMocks.Boolean.__constructor__(false);
                    })
                },

                __eq__: {
                    native: true,
                    jsCode: presenter.objectMocksMethodArgumentsDispatcherDecorator(function object__eq__method (toValue) {
                        if (this.value === toValue.value) {
                            return presenter.objectMocks.Boolean.__constructor__(true);
                        }

                        return presenter.objectMocks.Boolean.__constructor__(false);
                    })
                }
            }
        },

        Array: {
            __constructor__: function array__constructor__ (count, values) {
                values = values || [];

                var value = [];

                for (var i = 0; i < values.length; i += 1) {
                    value[i] = values[i];
                }

                for (; i < count; i += 1) {
                    value.push(null);
                }

                return {
                    value: value,
                    type: "Array",
                    methods: presenter.objectMocks.Array['__methods__'],
                    parent: presenter.objectMocks.Object
                }
            },

            __methods__: {
                __get__: {
                    native: true,
                    jsCode: presenter.objectMocksMethodArgumentsDispatcherDecorator(function array__get__code (index) {
                        if (index.type !== "Number") {
                            throw new presenter.exceptions.CastErrorException(index.type, "Number");
                        }

                        if (this.value[index.value] === null) {
                            throw new presenter.exceptions.GetErrorException(this.type, index.value);
                        }

                        if (this.value[index.value] === undefined) {
                            throw new presenter.exceptions.IndexOutOfBoundsException(this.type, index.value, this.value.length);
                        }

                        return this.value[index.value];
                    })
                },
                __set__: {
                    native: true,
                    jsCode: presenter.objectMocksMethodArgumentsDispatcherDecorator(function array__set__code (index, value) {
                        if (index.type !== "Number") {
                            throw new presenter.exceptions.CastErrorException("String", "Number");
                        }

                        if (this.value[index.value] === undefined) {
                            throw new presenter.exceptions.IndexOutOfBoundsException(this.type, index.value, this.value.length);
                        }

                        this.value[index.value] = value;

                        return this;
                    })
                }
            }
        },

        Boolean: {
            __constructor__: function boolean__constructor__ (val) {
                return {
                    value: Boolean(val) || false,
                    type: "Boolean",
                    methods: presenter.objectMocks.Boolean['__methods__'],
                    parent: presenter.objectMocks.Object
                }
            },

            __methods__: {
            }
        },

        String: {
            __constructor__: function string__constructor__ (val) {
                return {
                    value: String(val) || '',
                    type: "String",
                    methods: presenter.objectMocks.String['__methods__'],
                    parent: presenter.objectMocks.Object
                }
            },

            __methods__: {
                __add__: {
                    native: true,
                    jsCode: presenter.objectMocksMethodArgumentsDispatcherDecorator(function string__add__method__ (toValue) {
                        if (toValue.type === "Number" || toValue.type === "String") {
                            return presenter.objectMocks.String.__constructor__(this.value + toValue.value);
                        }

                        throw new presenter.exceptions.CastErrorException(this.type, toValue.type);
                    })
                }
            }
        },

        Number: {
            __constructor__: function number__constructor__ (value) {
                return {
                    constructor: presenter.objectMocks.Number['__constructor__'],
                    value: Number(value) || 0,
                    type: "Number",
                    methods: presenter.objectMocks.Number['__methods__'],
                    parent: presenter.objectMocks.Object
                }
            },
            __methods__: {
                __add__: {
                    native: true,
                    jsCode: presenter.objectMocksMethodArgumentsDispatcherDecorator(function number__add__method (toValue) {
                        if (toValue.type === "Number") {
                            return presenter.objectMocks.Number.__constructor__(this.value + toValue.value);
                        } else if (toValue.type === "String") {
                            return presenter.objectMocks.String.__constructor__(this.value + toValue.value);
                        }

                        throw new presenter.exceptions.CastErrorException(this.type, toValue.type);
                    })
                },
                __sub__: {
                    native: true,
                    jsCode: presenter.objectMocksMethodArgumentsDispatcherDecorator(function number__sub__method (toValue) {
                        if (toValue.type === "Number") {
                            return presenter.objectMocks.Number.__constructor__(this.value - toValue.value);
                        }

                        throw new presenter.exceptions.CastErrorException(this.type, toValue.type);
                    })
                },

                __mul__: {
                    native: true,
                    jsCode: presenter.objectMocksMethodArgumentsDispatcherDecorator(function number__mul__method (toValue) {
                        if (toValue.type === "Number") {
                            return presenter.objectMocks.Number.__constructor__(this.value * toValue.value);
                        }

                        throw new presenter.exceptions.CastErrorException(this.type, toValue.type);
                    })
                },

                __div__: {
                    native: true,
                    jsCode: presenter.objectMocksMethodArgumentsDispatcherDecorator(function number__div__method (toValue) {
                        if (toValue.type === "Number") {
                            return presenter.objectMocks.Number.__constructor__(this.value / toValue.value);
                        }

                        throw new presenter.exceptions.CastErrorException(this.type, toValue.type);
                    })
                },
                __div_full__: {
                    native: true,
                    jsCode: presenter.objectMocksMethodArgumentsDispatcherDecorator(function number__div_full__method (toValue) {
                        if (toValue.type === "Number") {
                            return presenter.objectMocks.Number.__constructor__(~~(this.value / toValue.value));
                        }

                        throw new presenter.exceptions.CastErrorException(this.type, toValue.type);
                    })
                },
                __mod__: {
                    native: true,
                    jsCode: presenter.objectMocksMethodArgumentsDispatcherDecorator(function number__mod__method (toValue) {
                        if (toValue.type === "Number") {
                            return presenter.objectMocks.Number.__constructor__(this.value % toValue.value);
                        }

                        throw new presenter.exceptions.CastErrorException(this.type, toValue.type);
                    })
                },
                __minus__: {
                    native: true,
                    jsCode: presenter.objectMocksMethodArgumentsDispatcherDecorator(function number__minus__method () {
                        return presenter.objectMocks.Number.__constructor__(this.value * -1);
                    })
                }
            }
        }
    };

    presenter.bnf = {
        uid: 0,

        case: presenter.uidDecorator(
            /**
             * @param  {Object[]} variableDef
             * @param  {{option:String, code:Object[]}[]} options
             */
            function bnf_case (variableDef, options) {
                var i,
                    exitLabel = presenter.bnf.uid + "_case_end",
                    execCode = [presenter.generateExecuteObject('presenter.objectForInstructions.calledInstructions.case++;', '')];

                execCode = execCode.concat(variableDef);    //On stack is variable value

                for (i = 0; i < options.length; i += 1) {
                    execCode = execCode.concat(options[i].option);  //Now on stack we have option to compare
                    execCode.push(presenter.generateJumpInstruction('stack[stack.length - 2].value === stack.pop().value', presenter.bnf.uid + '_case_option_' + i));
                }
                execCode.push(presenter.generateJumpInstruction('true', exitLabel));

                for (i = 0; i < options.length; i += 1) {
                    execCode.push(presenter.generateExecuteObject('', presenter.bnf.uid + '_case_option_' + i));
                    execCode = execCode.concat(options[i].code);
                    execCode.push(presenter.generateJumpInstruction('true', exitLabel));
                }
                execCode.push(presenter.generateExecuteObject('', exitLabel));
                execCode.push(presenter.generateExecuteObject('stack.pop();', ''));
                return execCode;
            }
        ),


        /**
         * Try to find method in object. If object doesn't contains method then check his parent.
         * @param object {Object}
         * @param methodName {String}
         * @returns {Function}
         */
        getMethodFromObject: function bnf_getMethodFromObject (object, methodName) {
            var methods = object.methods;
            while(true) {
                if (methods.hasOwnProperty(methodName)) {
                    return methods[methodName];
                }

                if (object.parent == null) {
                    throw new presenter.exceptions.MethodNotFoundException(methodName);
                }

                object = object.parent;
                methods = object.__methods__;
            }
        },

        /**
         * Manager should be added to each program. If method is called then this manager will find correct function.
         *  Built in methods:
         *  -get method from object. Call this object method as js call function with passed object and stack and builtIn arguments.
         *  -get retVal value and add it to stack
         * 
         * 
         * Objects and inheritance in pseudocode (Concept):
         *  -Add to machine new instruction evaluateJumpLabelAndJump which will execute code in label and will jump to generated label.
         *  -Add new object to presenter.objectMocks
         *  -Use it in object call manager, if getMethodFromObject(a,b).native is True, then execute original code, if false then use evaluateJumpLabelAndJump to getMethodFromObject(a,b).labelCode where will be code to jump.
         *  -Each class should be saved in precessor code, each method should contains own label to jump, for example MyClass.myMethod should contains MyClass.myMethod label for jump
         *  -Before jump, set scope for this class and jump to method.
         * 
         */
        getObjectCallManager: function bnf_getObjectCallManager () {
            var execCode = [];
            
            execCode.push(presenter.generateExecuteObject('', '1_get_object_call_manager'));

            var code = "";
            code += "presenter.builtInMethodCall(stack, presenter.objectForInstructions, presenter.objectMocks, next, pause, retVal);;";

            
            execCode.push(presenter.generateExecuteObject(code, ''));

            execCode.push(presenter.generateExecuteObject("actualIndex = functionsCallPositionStack.pop() + 1;", ""));

            return execCode;
        },        

        case_option: function bnf_case_option (option, code) {

            return [{
                option: option,
                code: code
            }];
        },

        array: function bnf_array (yy, arrayName, arraySize, startValues) {
            var code = 'var buff1 = [];';
            
            startValues = startValues || [];

            startValues.forEach(function (el) {
                code += el.code;
                code += ';buff1.push(stack.pop());';
            });


            presenter.state.variablesAndFunctionsUsage[yy.actualFunctionName].defined.push(arrayName);
            return code + 'actualScope.' + arrayName + '= presenter.objectMocks.Array.__constructor__.call({},' + arraySize + ', buff1);';
        },


        var: function bnf_var (yy, varName) {
            presenter.state.variablesAndFunctionsUsage[yy.actualFunctionName].defined.push(varName);
            return 'actualScope.' + varName + ' = presenter.objectMocks.Number.__constructor__.call({}, 0);';
        },

        function_call: function bnf_function_call (yy, functionName, args) {
            presenter.state.variablesAndFunctionsUsage[yy.actualFunctionName].fn.push(functionName);

            return yy.presenterContext.dispatchFunction(functionName, args || []);
        },

        method_call: function bnf_method_call (methodName, args, operations) {
            var execObjects = [];

            //Call args code in reverse order to save it on stack
            for (var i = 0; i < args.length; i++){
                execObjects = execObjects.concat(args[i]);
            }

            execObjects = execObjects.concat(operations);

            execObjects.push(presenter.generateExecuteObject("stack.push('" + methodName + "');", ''));
            execObjects.push(presenter.generateExecuteObject("stack.push(" + args.length + ");", ''));

            execObjects.push(presenter.generateExecuteObject("functionsCallPositionStack.push(actualIndex);", ""));
            execObjects.push(presenter.generateJumpInstruction('true', '1_get_object_call_manager'));
            execObjects.push(presenter.generateExecuteObject("stack.push(retVal.value);", ''));

            return execObjects;
        },

        array_get: function bnf_array_get (variableName, operations) {
            return presenter.bnf.method_call("__get__", operations, variableName);
        },

        function: function bnf_function (yy, functionName, functionArgs, sectionsBlock, codeBlock) {
            var sections = [presenter.generateExecuteObject(sectionsBlock || '', '')];

            presenter.state.variablesAndFunctionsUsage[yy.actualFunctionName].args = functionArgs;
            yy.functionNames.pop();

            return presenter.generateFunctionStart(functionArgs, functionName).concat(sections).concat(codeBlock).concat(yy.presenterContext.generateFunctionEnd(functionName));
        },

        function_declaration: function bnf_function_declaration (yy, functionName) {
            presenter.state.variablesAndFunctionsUsage[functionName] = {defined: [], args: [], vars: [], fn: []};
            yy.actualFunctionName = functionName;
            presenter.state.definedByUserFunctions.push(functionName);
            yy.functionNames.push(functionName);

            return functionName;
        },

        assign_value_1: function bnf_assign_value_1 (yy, variableName, operations) {
            operations.push(presenter.generateExecuteObject('actualScope.' + variableName + ' = stack.pop();', ''));
            presenter.state.variablesAndFunctionsUsage[yy.actualFunctionName].vars.push(variableName);

            return operations;
        },

        assign_value_2: function bnf_assign_value_2 (operations) {
            operations.push(presenter.generateExecuteObject('stack.pop()'));

            return operations;
        },

        assign_array_value: function bnf_assign_array_value (variableName, operations, value) {
            return presenter.bnf.method_call("__set__", [value, operations], variableName);
        },

        program_name: function bnf_program_name (yy, programName) {
            yy.actualFunctionName = '1_main';
            presenter.state.variablesAndFunctionsUsage['1_main'] = {defined: [], args: [], vars: [], fn: []};
            return programName;
        },

        argument: function bnf_argument (yy, argName) {
            presenter.state.variablesAndFunctionsUsage[yy.actualFunctionName].vars.push(argName);

            return [presenter.generateExecuteObject('stack.push(actualScope.' + argName + ');', '')];
        },

        for_argument: function bnf_for_argument (yy, argName) {
            presenter.state.variablesAndFunctionsUsage[yy.actualFunctionName].vars.push(argName);

            return 'actualScope.' + argName + '.value';
        },

        for_value_header: presenter.uidDecorator(function bnf_for_value_header (yy, variableName, from, to) {
            var execElements = [];

            presenter.state.variablesAndFunctionsUsage[yy.actualFunctionName].vars.push(variableName);

            yy.labelsStack.push(presenter.bnf.uid + '_for');
            yy.labelsStack.push(presenter.bnf.uid + '_for_end');


            execElements.push(presenter.generateExecuteObject("actualScope." + variableName + '.value = ' + from + ' - 1;'));
            execElements.push(presenter.generateExecuteObject('presenter.objectForInstructions.calledInstructions.for++', presenter.bnf.uid + '_for'));
            execElements.push(presenter.generateJumpInstruction('!((Boolean(actualScope.' + variableName + '.value += 1) || true) && actualScope.' + variableName + '.value <=' + to + ")", presenter.bnf.uid + '_for_end'));
            return execElements;

        }),

        for_exiter: function bnf_for_exiter (yy) {
            var execElements = [],
                exitLabel = yy.labelsStack.pop(),
                checkerLabel = yy.labelsStack.pop();

            execElements.push(presenter.generateJumpInstruction('true', checkerLabel));
            execElements.push(presenter.generateExecuteObject('presenter.objectForInstructions.calledInstructions.for--', exitLabel));
            return execElements;
        },

        /**
         * @param  {Object[]} expression
         * @param  {Object[]} code
         */
        if_instruction: presenter.uidDecorator(function bnf_if_instruction (expression, code) {
            var executableCode = [presenter.generateExecuteObject('presenter.objectForInstructions.calledInstructions.if++;')],
                if_end = presenter.bnf.uid + "_end_if";

            executableCode = executableCode.concat(expression);
            executableCode.push(presenter.generateJumpInstruction('!Boolean(stack.pop().value);', if_end));
            executableCode = executableCode.concat(code);
            executableCode.push(presenter.generateExecuteObject('', if_end));

            return executableCode;
        }),

        /**
         * @param  {Object[]} expression
         * @param  {Object[]} ifCode
         * @param  {Object[]} elseCode
         */
        if_else_instruction: presenter.uidDecorator(function bnf_if_else_instruction (expression, ifCode, elseCode) {
            var executableCode = [presenter.generateExecuteObject('presenter.objectForInstructions.calledInstructions.if++;')],
                else_start = presenter.bnf.uid + "_else_if",
                if_end = presenter.bnf.uid + "_end_if";

            executableCode = executableCode.concat(expression);
            executableCode.push(presenter.generateJumpInstruction('!Boolean(stack.pop().value);', else_start));
            executableCode = executableCode.concat(ifCode);
            executableCode.push(presenter.generateJumpInstruction('true', if_end));
            executableCode.push(presenter.generateExecuteObject('', else_start));
            executableCode = executableCode.concat(elseCode);
            executableCode.push(presenter.generateExecuteObject('', if_end));

            return executableCode;
        }),

        while_header: presenter.uidDecorator(function bnf_while_header (yy, expression) {
            yy.labelsStack.push(presenter.bnf.uid + "_while");
            yy.labelsStack.push(presenter.bnf.uid + "_while_end");

            var execElements = [];

            execElements.push(presenter.generateExecuteObject('presenter.objectForInstructions.calledInstructions.while++', presenter.bnf.uid + "_while"));
            execElements = execElements.concat(expression);
            execElements.push(presenter.generateJumpInstruction('!Boolean(stack.pop().value)',  presenter.bnf.uid + "_while_end"));

            return execElements;
        }),

        while_exiter: function bnf_while_exiter (yy) {
            var exitLabel = yy.labelsStack.pop(),
                startWhileLabel = yy.labelsStack.pop(),
                execElements = [];

            execElements.push(presenter.generateJumpInstruction('true', startWhileLabel));
            execElements.push(presenter.generateExecuteObject('presenter.objectForInstructions.calledInstructions.while--', exitLabel));

            return execElements;
        },

        return_value: function bnf_return_value (yy, returnCode) {
            var actualFunctionName = yy.functionNames[yy.functionNames.length - 1],
                execCommands = returnCode;

            execCommands.push(presenter.generateExecuteObject("retVal = {value: stack.pop()};", ""));
            execCommands.push(presenter.generateJumpInstruction('true', "1_" + actualFunctionName));

            return execCommands;
        },

        do_while_header: presenter.uidDecorator(function bnf_do_while_header (yy) {
            var execElements = [],
                enterLabel = presenter.bnf.uid + "_do_while_enter";

            execElements.push(presenter.generateExecuteObject('presenter.objectForInstructions.calledInstructions.doWhile++;', enterLabel));
            yy.labelsStack.push(enterLabel);

            return execElements;
        }),

        do_while_exiter: function bnf_do_while_exiter (yy, expression) {
            var execElements = [],
                enterLabel = yy.labelsStack.pop();

            execElements = execElements.concat(expression);
            execElements.push(presenter.generateJumpInstruction('Boolean(stack.pop().value)', enterLabel));

            return execElements;
        }
    };

    presenter.TYPES = {
        EXECUTE: 1,
        JUMP: 2
    };

    /**
     * @param stack {Object[]}
     * @param consoleObj {UserConsole}
     * @param objects {Object[]} List of objects from objectMocks
     * @param next {Function}
     * @param pause {Function}
     * @param retVal {{value: Object}}
     * @returns {*|void}
     */
    presenter.builtInMethodCall = function presenter_builtInMethodCall (stack, consoleObj, objects, next, pause, retVal) {
        var argsCount = stack.pop();
        var methName = stack.pop();
        var obj = stack.pop();
        var args = [consoleObj, objects, next, pause, retVal];

        var method = presenter.bnf.getMethodFromObject(obj, methName).jsCode;

        for (var i = 0; i < argsCount; i++) {
            args.push(stack.pop());
        }

        return method.apply(obj, args);
    };

    /**
     * @param  {Object[]} firstVal array with calculations first value
     * @param  {Object[]} secVal array with calculations second value
     * @param  {('__add__'|'__sub__'|'__div__'|'__mul__'|'__div_full__'|'__mod__'|'__ge__'|'__le__'|'__gt__'|'__lt__'|'__neq__'|'__eq__'|'__or__'|'__and__')} operationType 
     * @return {Object[]}
     */
    presenter.generateOperationCode = function presenter_generateOperationCode (firstVal, secVal, operationType) {
        var execObjects = firstVal.concat(secVal),
            code = "",
            exitCode = "",
            preCode = "";

        code += "ebx = stack.pop();";
        code += "eax = stack.pop();";
        code += "stack.push(ebx);";
        code += "stack.push(eax);";
        code += "stack.push('" + operationType +"');";
        code += "stack.push(1);";
        code += "functionsCallPositionStack.push(actualIndex);";

        exitCode += "stack.push(retVal.value);";

        execObjects.push(presenter.generateExecuteObject(code, ""));
        execObjects.push(presenter.generateJumpInstruction('true', '1_get_object_call_manager'));
        execObjects.push(presenter.generateExecuteObject(exitCode, ''));
        return execObjects;
    };

    presenter.generateMinusOperation = function presenter_generateMinusOperation (execObjects) {
        var retVal = [].concat(execObjects);
        var code = "";
        var exitCode = "";

        code += "stack.push('__minus__');";
        code += "stack.push(0);";
        code += "functionsCallPositionStack.push(actualIndex);";

        exitCode += "stack.push(retVal.value);";

        retVal.push(presenter.generateExecuteObject(code, ""));
        retVal.push(presenter.generateJumpInstruction('true', '1_get_object_call_manager'));
        retVal.push(presenter.generateExecuteObject(exitCode, ''));
        return retVal;
    };

    presenter.generateFunctionStart = function presenter_generateFunctionStart (argsList, functionName) {
        var execObjects = [],
            i,
            initialCommand = "";

        // Set start label
        execObjects.push(presenter.generateExecuteObject('', functionName));

        initialCommand += "eax = stack.pop();\n";         //Size of args array
        initialCommand += "ebx = Math.abs(eax - " + argsList.length + ");\n";

        initialCommand += "if (eax < " + argsList.length + ") throw new presenter.exceptions.ToFewArgumentsException('" + functionName + "'," + argsList.length + ");\n";

        initialCommand += "stack.push(actualScope);\n";  //Save actualScope on stack
        initialCommand += "actualScope = {};\n";        //Reset scope to default

        // Add to actualScope variables passed in stack, but in stack is actualScope saved! (while function call)
        for (i = argsList.length - 1; i >= 0; i -= 1) {
            initialCommand += "actualScope['" + argsList[Math.abs(i - (argsList.length - 1))] + "'] = stack[stack.length - (2 + " + i + " + ebx)];\n";
        }

        execObjects.push(presenter.generateExecuteObject(initialCommand, '')); //Call it as code

        return execObjects;
    };

    presenter.generateFunctionEnd = function presenter_generateFunctionEnd (functionName) {
        var execCommands = [],
            exitCommand = "";

        execCommands.push(presenter.generateExecuteObject('retVal.value = presenter.objectMocks.Number.__constructor__(0);', ''));   //If code goes there without return, then add to stack default value

        execCommands.push(presenter.generateExecuteObject('', '1_' + functionName));    //Here return will jump. Define as 1_<function_name>.

        exitCommand += "actualScope = {};"; // Clear scope
        exitCommand += "actualScope = stack.pop();"; //Get saved scope

        execCommands.push(presenter.generateExecuteObject(exitCommand, ''));

        execCommands.push(presenter.generateExecuteObject("actualIndex = functionsCallPositionStack.pop() + 1;", ""));


        return execCommands;
    };

    presenter.dispatchFunction = function presenter_dispatchFunction  (functionName, args) {
        var execCode = [],
            clearStackCode = '',
            i;

        for (i = 1; i <= args.length; i += 1) {
            execCode = execCode.concat(args[i - 1]);
            clearStackCode += 'stack.pop();';
        }

        if (presenter.configuration.functions.hasOwnProperty(functionName)) {
            execCode = execCode.concat(presenter.dispatchForBuiltInFunctions(functionName, args));
        } else {
            execCode.push(presenter.generateExecuteObject("stack.push(" + args.length + ");", ''));
            execCode.push(presenter.generateExecuteObject("functionsCallPositionStack.push(actualIndex);", ""));    //Push actual index of code, function before end will return to that index
            execCode = execCode.concat(presenter.dispatchUserFunction(functionName));
        }

        execCode.push(presenter.generateExecuteObject(clearStackCode, ''));
        execCode.push(presenter.generateExecuteObject('stack.push(retVal.value);', ''));
        return execCode;
    };

    presenter.dispatchUserFunction = function presenter_dispatchUserFunction (functionName) {
        var execCode = [];

        execCode.push(presenter.generateJumpInstruction('true',  functionName));

        return execCode;
    };

    /**
     * Dispatch for build in function (function declared in properties)
     * Returned value is executed in machine scope, so next, pause, retVal are locally variable for each machine (function presenter.codeExecutor is scope for this code (eval))
     * @param  {String} functionName
     * @param  {Array[]} args contains how to resolve each argument
     */
    presenter.dispatchForBuiltInFunctions = function presenter_dispatchForBuiltInFunctions (functionName, args) {
        var parsedArgs = [],
            i,
            code,
            execCode = [];

        // That must be there, because, we don't know how many args receive built in function, so we send all args to this function
        for (i = 1; i <= args.length; i += 1) {
            parsedArgs.unshift("stack[stack.length - " + i + "]");
        }

        code = "presenter.configuration.functions." + functionName + ".call({}, presenter.objectForInstructions, presenter.objectMocks, next, pause, retVal," + parsedArgs.join(",") + ");";

        execCode.push(presenter.generateExecuteObject(code, '', true));

        return execCode;
    };

    /**
     * Generate code executed by addon. 
     * @param  {String} code
     * @param  {String} label set label for goto instruction
     * @param  {Boolean} [isAsync] async instructions cant be merged and is optional
     */
    presenter.generateExecuteObject = function presenter_generateExecuteObject (code, label, isAsync) {
        return {
            code: code,
            type: presenter.TYPES.EXECUTE,
            label: label,
            isAsync: isAsync || false
        };
    };

    presenter.generateJumpInstruction = function presenter_generateJumpInstruction (code, toLabel) {
        return {
            code: code,
            toLabel: toLabel,
            type: presenter.TYPES.JUMP
        };
    };

    presenter.exceptions = {
        InstructionIsDefinedException: function InstructionIsDefinedException(instrName) {
            this.message = "Instruction was defined before: \"" + instrName + "\"";
            this.name = "InstructionIsDefinedException";
        },

        CastErrorException: function CastErrorException(type, toType) {
            this.message = "Cast exception \"" + type + "\" to type: \"" + toType + "\"";
            this.name = "CastErrorException";
        },

        GetErrorException: function GetErrorException(type, index) {
            this.message = "Exception (" + type + "): Value at index " + index + " is not defined";
            this.name = "GetErrorException";
        },

        IndexOutOfBoundsException: function IndexOutOfBoundsException(type, index, length) {
            this.message = "Exception (" + type + "): index " + index + " is out of bounds";
            this.name = "IndexOutOfBoundsException";
        },

        ToFewArgumentsException: function ToFewArgumentsException(functionName, expected) {
            this.name = "ToFewArgumentsException";
            this.message = "To few arguments for function " + functionName + " (expected at least: " + expected + " arguments)";
        },

        MethodNotFoundException: function MethodNotFoundException(instrName) {
            this.message = "Undefined method \"" + instrName + "\"";
            this.name = "MethodNotFoundException";
        },

        UndefinedVariableNameException: function UndefinedVariableNameException(varName, functionName) {
            this.message = "Usage of undefined variable '" + varName + "' in function '" + functionName + "'";
            this.name = "UndefinedVariableNameException";
        },

        UndefinedFunctionNameException: function UndefinedFunctionNameException(varName, functionName) {
            this.message = "Usage of undefined function '" + varName + "' in function '" + functionName + "'";
            this.name = "UndefinedFunctionNameException";
        }

    };
    // ---------------------------------- ADDON SECTION ---------------------------------------------------------------

    //This object will be passed to instruction as scope
    presenter.objectForInstructions = {
        calledInstructions: {
            for: 0,
            while: 0,
            doWhile: 0,
            if: 0,
            case: 0
        },    //Object with calculated each built in instruction call e.g. for, while,
        data: {

        }
    };

    presenter.state = {
        console: null,
        functions: {},          //Functions defined by user
        codeGenerator: null,    //Generator code to execute from string.
        wasChanged: false,      //If code was changed and addon must recalculate score
        lastScore: 0,           //Last score, we dont need to recalculate score if user dont run code
        lastUsedCode: [],        //Compiled code which was last used,
        definedByUserFunctions: [], //Functions defined by user
        variablesAndFunctionsUsage : {} //Functions and variables used by user each element contains: {defined: [], args: [], vars: [], fn: []}
    };

    presenter.configuration = {
        aliases: {
            "begin": "begin",
            "do": "do",
            "end": "end",
            "for": "for",
            "from": "from",
            "to": "to",
            "variable": "variable",
            "program": "program",
            "while": "while",
            "or": "or",
            "and": "and",
            "if": "if",
            "then": "then",
            "else": "else",
            "case": "case",
            "option": "option",
            "function": "function",
            "return": "return",
            "array_block": "array"
        },
        isValid: false,
        addonID: null,
        isActivity: false,
        isVisibleByDefault: false,
        functions: [],
        answer: null,
        methods: []
    };

    presenter.ERROR_CODES = {
        "FN01": "Defined function name must match to ^[A-Za-z_][a-zA-Z0-9_]*$",
        "FN02": "Defined function must have unique name",
        "FN03": "Defined function overrides built in alias",
        "AN01": "Defined alias name must match to ^[A-Za-z_][a-zA-Z0-9_]*$",
        "AN02": "Multiple aliases got the same name",
        "JS01": "Java Script code in mdefined ethod is not valid.",
        "JS02": "Java Script code in defined function is not valid"
    };

    presenter.setPlayerController = function presenter_setPlayerController (controller) {
        presenter.state.playerController = controller;
        presenter.state.eventBus = presenter.state.playerController.getEventBus();
        presenter.state.eventBus.addEventListener('ShowAnswers', this);
        presenter.state.eventBus.addEventListener('HideAnswers', this);
    };

    presenter.killMachine = {}; // Object which contains all machines with kill machine function

    presenter.killAllMachines = function presenter_killAllMachines () {
        var id;

        for (id in presenter.killMachine) {
            if (presenter.killMachine.hasOwnProperty(id)) {
                presenter.killMachine[id]();
            }
        }
    };

    presenter.run = function presenter_run (view, model) {
        presenter.initialize(view, model, false);
    };

    presenter.createPreview = function presenter_createPreview (view, model) {
        presenter.initialize(view, model, true);
    };

    presenter.getWordBetweenHorizontalLine = function presenter_getWordBetweenHorizontalLine (word) {
        if (word.indexOf("|") > -1 && word.lastIndexOf("|") !== word.indexOf("|")) {
            return word.substring(1, word.length - 1);
        }
        return null;
    };

    presenter.initializeGrammar = function presenter_initializeGrammar () {
        var rules = JISON_GRAMMAR.lex.rules,
            aliases = presenter.configuration.aliases,
            i,
            rule,
            word,
            parser;

        for (i = 0; i < rules.length; i += 1) {
            rule = rules[i][0];
            word = presenter.getWordBetweenHorizontalLine(rule);
            if (word !== null) {    //We want to find words between "$" and replace them with aliases
                if (aliases.hasOwnProperty(word)) {
                    rules[i][0] = aliases[word];
                }
            }
        }

        parser = new Jison.Parser(JISON_GRAMMAR);
        parser.yy.presenterContext = presenter;
        parser.yy.labelsStack = [];
        parser.yy.functionNames = [];
        presenter.state.codeGenerator = parser;
    };

    /**
     * Before each user code call, this object should be initialized
     * @param  {Object} [consoleMock] optional argument for console
     */
    presenter.initializeObjectForCode = function presenter_initializeObjectForCode (consoleMock) {
        presenter.objectForInstructions = {
            calledInstructions: {
                for: 0,
                while: 0,
                doWhile: 0,
                if: 0,
                case: 0
            },
            data: {

            }
        };
        presenter.objectForInstructions.console = consoleMock || presenter.state.console;
        presenter.state.definedByUserFunctions = [];
    };

    presenter.initializeConsole = function presenter_initializeConsole () {
        presenter.state.console = new presenter.console(presenter.state.$view.find(".addon-PseudoCode_Console-wrapper"));
        var originalReadLine = presenter.state.console.ReadLine,
            originalReadChar = presenter.state.console.ReadChar;

        /**
         * Because console is asynchronous but pseudocode console is synchronous we must wrap user callback  for console.
         * Before executing original console function we must stop machine which is executing this code and when user enters input then we resume machine
         * pauseIns and nextIns are set while executing each command (see dispatchForBuiltInFunctions which is calling wrapMethodOrFunctionWithBuiltInCode code)
         * @param callback {Function}
         */
        presenter.state.console.ReadLine = function console_read_line_override (callback) {
            presenter.state.console.pauseIns();
            originalReadLine.call(presenter.state.console, function (input) {
                callback.call(this, input);
                presenter.state.console.nextIns();
            });
        };

        /**
         * Like ReadLine
         * @param callback {Function}
         */
        presenter.state.console.ReadChar = function console_read_char_override (callback) {
            presenter.state.console.pauseIns();
            originalReadChar.call(presenter.state.console, function (input) {
                callback.call(this, input);
                presenter.state.console.nextIns();
            });
        };
    };

    presenter.completeObjectsMethods = function presenter_completeObjectsMethods () {
        presenter.configuration.methods.forEach(function (method) {
            if (method.objectName !== "" && method.methodName !== "") {
                presenter.objectMocks[method.objectName].__methods__[method.methodName] = {
                    native: true,
                    jsCode: method.function
                };
            }
        });
    };

    presenter.initialize = function presenter_initialize (view, model, isPreview) {
        presenter.configuration = presenter.validateModel(model);
        if (!presenter.configuration.isValid) {
            DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, presenter.configuration.errorCode);
            return;
        }
        presenter.state.$view = $(view);
        presenter.state.view = view;
        if (!isPreview) {
            presenter.initializeConsole();
            presenter.initializeObjectForCode();
            presenter.initializeGrammar();
            presenter.completeObjectsMethods();
        }
        presenter.setVisibility(presenter.configuration.isVisibleByDefault);
        view.addEventListener('DOMNodeRemoved', presenter.destroy);
    };

    presenter.stop = function presenter_stop () {
        presenter.state.console.Reset();
        presenter.killAllMachines();
    };

    presenter.onEventReceived = function presenter_onEventReceived (eventName) {
        if (eventName === "ShowAnswers") {
            presenter.showAnswers();
        }

        if (eventName === "HideAnswers") {
            presenter.hideAnswers();
        }
    };

    presenter.executeCommand = function presenter_executeCommand (name, params) {
        var commands = {
            'show': presenter.show,
            'hide': presenter.hide,
            'stop': presenter.stop,
            'showAnswers' : presenter.showAnswers,
            'hideAnswers' : presenter.hideAnswers
        };
        Commands.dispatch(commands, name, params, presenter);
    };

    presenter.showAnswers = function presenter_showAnswers () {
        presenter.state.console.disable();
    };

    presenter.hideAnswers = function presenter_hideAnswers () {
        presenter.state.console.enable();
    };

    presenter.destroy = function presenter_destroy (event) {
        if (event.target !== this) {
            return;
        }

        presenter.state.view.removeEventListener("DOMNodeRemoved", presenter.destroy);
        if (presenter.state.console) {
            presenter.state.console.destroy();
        }
    };

    presenter.setVisibility = function presenter_setVisibility (isVisible) {
        presenter.state.$view.css('visibility', isVisible ? 'visible' : 'hidden');
        presenter.state.$view.css('display', isVisible ? 'block' : 'none');

        presenter.state.isVisible = isVisible;
    };

    presenter.show = function presenter_show () {
        presenter.setVisibility(true);
    };

    presenter.hide = function presenter_hide () {
        presenter.setVisibility(false);
    };

    presenter.reset = function presenter_reset () {
        presenter.killAllMachines();
        presenter.state.console.Reset();
        presenter.setVisibility(presenter.configuration.isVisibleByDefault);
        presenter.state.console.enable();
    };

    presenter.setShowErrorsMode = function presenter_setShowErrorsMode () {
        presenter.state.console.disable();
    };

    presenter.setWorkMode = function presenter_setWorkMode () {
        presenter.state.console.enable();
    };

    presenter.setState = function presenter_setState (stateString) {
        var state = JSON.parse(stateString);

        presenter.setVisibility(state.isVisible);
        presenter.state.lastScore = state.score;
    };

    presenter.getState = function presenter_getState () {
        var state = {
            isVisible: presenter.state.isVisible,
            score: presenter.state.lastScore
        };

        return JSON.stringify(state);
    };

    presenter.evaluateScoreFromLastOutput = function presenter_evaluateScoreFromLastOutput () {
        try {
            if (presenter.configuration.answer.answerCode.call(presenter.objectForInstructions)) {
                return 1;
            }

            return 0;

        } catch (e) {
            return 0;
        }
    };

    presenter.generateConsoleMock = function presenter_generateConsoleMock (input) {
        var actualInputIndex = 0;
        return {
            Reset: function () {

            },

            ReadLine: function (callback) {
                var actualInput = input[actualInputIndex];
                if (actualInput !== null) {
                    callback.call(presenter.state.console, actualInput);
                    actualInputIndex += 1;
                }
            },

            ReadChar: function (callback) {
                var actualInput = input[actualInputIndex];
                if (actualInput !== null) {
                    callback.call(presenter.state.console, actualInput);
                    actualInputIndex += 1;
                }
            },
            Write: function () {

            }
        };
    };

    presenter.evaluateScoreFromUserCode = function presenter_evaluateScoreFromUserCode () {
        var code = presenter.state.lastUsedCode,
            objectForInstructionsSaved = presenter.objectForInstructions,
            score;

        presenter.initializeObjectForCode(presenter.generateConsoleMock(presenter.configuration.answer.parameters));
        presenter.codeExecutor(code, true);
        score = presenter.evaluateScoreFromLastOutput();

        presenter.objectForInstructions = objectForInstructionsSaved;

        return score;
    };

    presenter.evaluateScore = function presenter_evaluateScore () {
        if (presenter.configuration.answer.runUserCode) {
            return presenter.evaluateScoreFromUserCode();
        }

        return presenter.evaluateScoreFromLastOutput();
    };

    function sendValueChangedEvent(eventData) {
        if (presenter.state.eventBus !== null) {
            presenter.state.eventBus.sendEvent('ValueChanged', eventData);
        }
    }

    function sendScoreChangedEvent(score) {
        var eventData = {
            'source': presenter.configuration.addonID,
            'item': 'all',
            'value': '',
            'score': score
        };
        sendValueChangedEvent(eventData);
    }

    presenter.getScore = function presenter_getScore () {
        if (!presenter.state.wasChanged) {
            return presenter.state.lastScore;
        }

        var score = 0;
        if (presenter.configuration.isActivity) {
            score = presenter.evaluateScore();

            presenter.state.lastScore = score;
            presenter.state.wasChanged = false;

            sendScoreChangedEvent(score);
        }

        return score;
    };

    presenter.getMaxScore = function presenter_getMaxScore () {
        if (presenter.configuration.isActivity) {
            return 1;
        }

        return 0;
    };

    presenter.getErrorCount = function presenter_getErrorCount () {
        if (presenter.configuration.isActivity) {
            return 1 - presenter.getScore();
        }

        return 0;
    };

    presenter.getExcludedNames = function presenter_getExcludedNames () {
        var i,
            excludedNames = {};

        for (i in presenter.configuration.aliases) {
            if (presenter.configuration.aliases.hasOwnProperty(i)) {
                excludedNames[presenter.configuration.aliases[i]] = true;
            }
        }

        for (i in presenter.configuration.functions) {
            if (presenter.configuration.functions.hasOwnProperty(i)) {
                excludedNames[i] = true;
            }
        }

        return excludedNames;
    };

    /**
     * If user defined function which was defined then throw error
     */
    presenter.multiDefineInstructionChecker = function presenter_multiDefineInstructionChecker () {
        var i,
            userFunctionName = "",
            excludedNames = presenter.getExcludedNames();


        for (i = 0; i < presenter.state.definedByUserFunctions.length; i += 1) {
            userFunctionName = presenter.state.definedByUserFunctions[i];
            if (!excludedNames[userFunctionName]) {
                excludedNames[userFunctionName] = true;
            } else {
                throw new presenter.exceptions.InstructionIsDefinedException(userFunctionName);
            }
        }
    };

    /**
     * User calls undefined function
     * @param  {{defined: String[], args: String[], vars:String [], fn: String[]}} functionData
     * @param  {String} functionName
     */
    presenter.undefinedUsageForFunctionChecker = function presenter_undefinedUsageForFunctionChecker(functionData, functionName) {
        var usedVariableName = "",
            usedFunctionName = "",
            i,
            excludedNames = presenter.getExcludedNames();

        for (i = 0; i < functionData.vars.length; i += 1) {
            usedVariableName = functionData.vars[i];
            if ($.inArray(usedVariableName, functionData.defined) === -1 && $.inArray(usedVariableName, functionData.args) === -1) {
                throw new presenter.exceptions.UndefinedVariableNameException(usedVariableName, functionName);
            }
        }

        for (i = 0; i < functionData.fn.length; i += 1) {
            usedFunctionName = functionData.fn[i];
            if (!excludedNames[usedFunctionName] && $.inArray(usedFunctionName, presenter.state.definedByUserFunctions) === -1) {
                throw new presenter.exceptions.UndefinedFunctionNameException(usedFunctionName, functionName);
            }
        }
    };

    /**
     * Check if user uses not defined variable or instruction
     */
    presenter.undefinedInstructionOrVariableChecker = function presenter_undefinedInstructionOrVariableChecker () {
        var i,
            usedVariablesAndFunctions = {};

        for (i in presenter.state.variablesAndFunctionsUsage) {
            if (presenter.state.variablesAndFunctionsUsage.hasOwnProperty(i)) {
                usedVariablesAndFunctions = presenter.state.variablesAndFunctionsUsage[i];
                presenter.undefinedUsageForFunctionChecker(usedVariablesAndFunctions, i);
            }
        }
    };

    presenter.checkCode = function presenter_checkCode () {
        presenter.multiDefineInstructionChecker();
        presenter.undefinedInstructionOrVariableChecker();
    };

    presenter.executeCode = function presenter_executeCode (code) {
        if (!presenter.configuration.isValid) {
            return;
        }

        presenter.state.variablesAndFunctionsUsage = {};
        presenter.state.wasChanged = true;
        presenter.initializeObjectForCode();
        try {
            presenter.state.console.Reset();
            var executableCode = presenter.state.codeGenerator.parse(code);

            presenter.checkCode();

            presenter.state.lastUsedCode = executableCode;
            presenter.stop();

            presenter.codeExecutor(executableCode, false);
        } catch (e) {
            if (e.name !== "Error") {
                presenter.state.console.Write(e.message + "\n", 'program-error-output');
            } else {
                presenter.state.console.Write("Unexpected identifier\n", 'program-error-output');
            }
        }
    };

    /**
     * @param  {Object} parsedData parsed code by jison
     * @param  {Boolean} getScore if function will be called to get score
     */
    presenter.codeExecutor = function presenter_codeExecutor (parsedData, getScore) {
        var actualIndex = 0,
            code = parsedData.code,
            timeoutId = 0,
            isEnded = false,
            startTime = new Date().getTime() / 1000,
            actualScope = {},         // There will be saved actual variables
            stack = [],               // Stack contains saved scopes
            functionsCallPositionStack = [], //Stack which contains information about actual executed code position.
            retVal = {value: 0},      // value returned by function,
            eax = {value: 0},         // Helper register used in generated code (used for saving temporary data while executing code)
            ebx = {value: 0},         // Helper register used in generated code (used for saving temporary data while executing code)
            id = window.Helpers.uuidv4();            // Each machine contains own unique id which will be saved in presenter

        function getIndexByLabel(label) {
            var i;
            for (i = 0; i < code.length; i += 1) {
                if (code[i] && code[i].label === label) {
                    return i;
                }
            }
        }

        /**
         *  Execute each line of code generated by JISON
         * @returns {Boolean} false - if code was executed, true if program is ended
         */
        function executeLine() {
            var actualEntry = code[actualIndex];
            if (actualEntry) {
                if (actualEntry.type === presenter.TYPES.EXECUTE) {
                    eval(actualEntry.code);
                    actualIndex += 1;
                } else if (actualEntry.type === presenter.TYPES.JUMP) {
                    if (eval(actualEntry.code)) {
                        actualIndex = getIndexByLabel(actualEntry.toLabel);
                    } else {
                        actualIndex += 1;
                    }
                }
                return false;
            }
            return true;
        }

        function pause() {
            clearTimeout(timeoutId);
        }

        function next() {
            if (!isEnded) {
                timeoutId = setTimeout(executeAsync, 1);
            }
        }

        function executeAsync() {
            next();
            try {
                isEnded = executeLine();
                if (isEnded) {
                    pause();
                }
            } catch (e) {
                if (!e.message) {
                    presenter.state.console.Write(e + "\n", 'program-error-output');
                } else {
                    presenter.state.console.Write(e.message + "\n", 'program-error-output');
                }
                killMachine();
            }
        }

        function killMachine() {
            pause();
            delete presenter.killMachine[id];
            actualScope = null;
            stack = null;
            functionsCallPositionStack = null;
            eax = null;
            ebx = null;
            isEnded = true;
            return true;
        }

        function executeCodeSyncWithMaxTime() {
            var actualTime;
            while (true) {
                actualTime = new Date().getTime() / 1000;
                if (actualTime - startTime > presenter.configuration.answer.maxTimeForAnswer.parsedValue) {
                    killMachine();
                    return;
                }
                try {
                    isEnded = executeLine();
                    if (isEnded) {
                        killMachine();
                        return;
                    } 
                } catch (e) {
                    killMachine();
                    return;
                }
            }
        }

        presenter.killMachine[id] = killMachine;

        eval(parsedData.sections);

        if (getScore) {
            executeCodeSyncWithMaxTime();
        } else {
            executeAsync();
        }
    };
    // ----------------------------------CONSOLE----------------------------------------------
    var consoleClasses = {
        "LINES_CONTAINER": "pseudoConsole-console-container",
        "CURSOR": "pseudoConsole-console-cursor",
        "ACTIVE_CURSOR": "pseudoConsole-console-cursor-active",
        "RIGHT_ELEMENT": "pseudoConsole-console-right-element",
        "LEFT_ELEMENT": "pseudoConsole-console-left-element",
        "TEXT_AREA": "pseudoConsole-console-textarea"
    };

    function UserConsole($element) {
        this.container = $("<pre></pre>");
        this.$textArea = $("<textarea class='pseudoConsole-console-textarea'></textarea>");
        this.linesContainer = $("<div class='" + consoleClasses.LINES_CONTAINER + "'></div>");
        this.$parentElement = $element;
        this.lines = [];
        this.activeLineIndex = -1;
        this.isReadMode = false;    //Console is waiting for user input
        this.isDisabled = false;

        $element.append(this.container);
        $element.append(this.$textArea);

        this.container.append(this.linesContainer);

        this.addNewLine(true);
    }

    UserConsole.prototype = {
        generateLine: function (className) {
            if (!className) {
                className = '';
            }

            var $htmlObject = $("<span></span>"),
                $left = $("<span class='" + className + " " + consoleClasses.LEFT_ELEMENT + "'></span>"),
                $right = $("<span class='" + className + " " + consoleClasses.RIGHT_ELEMENT + "'></span>"),
                $cursor = $("<span class='" + consoleClasses.CURSOR + "'></span>");

            $htmlObject.append($left);
            $htmlObject.append($cursor);
            $htmlObject.append($right);

            return {
                $htmlObject : $htmlObject,
                elements: {
                    $left: $left,
                    $cursor: $cursor,
                    $right: $right
                }
            };
        },

        /**
         * @param  {Boolean} isActive Activate this line automatically
         * @param  {String} [className] set class for that line
         */
        addNewLine: function (isActive, className) {
            if (!className) {
                className = '';
            }

            var line = this.generateLine(className);
            this.lines.push(line);
            this.linesContainer.append(line.$htmlObject);

            if (isActive) {
                this.selectLineAsActive(this.lines.length - 1);
            }

            this.$parentElement[0].scrollTop = this.$parentElement[0].scrollHeight;
        },

        selectLineAsActive: function (index) {
            var activeLine = null;
            if (this.activeLineIndex > -1) {
                activeLine = this.getActiveLine();
                activeLine.elements.$left.text(activeLine.elements.$left.text() + activeLine.elements.$right.text());
                activeLine.elements.$right.text('');
                activeLine.elements.$cursor.html('');
                activeLine.elements.$cursor.removeClass(consoleClasses.ACTIVE_CURSOR);
            }

            this.activeLineIndex = index;
            activeLine = this.lines[index];
            activeLine.elements.$cursor.html('&nbsp;');
            activeLine.elements.$cursor.addClass(consoleClasses.ACTIVE_CURSOR);
        },
        /**
         * @returns {{$htmlObject: jQuery, elements: {$left: jQuery, $right: jQuery, $cursor: jQuery}}}
         */
        getActiveLine: function () {
            return this.lines[this.activeLineIndex];
        },

        /**
         * @param  {String} text
         * @param  {String} className
         */
        Write: function (text, className) {
            if (this.isReadMode) {  //Dont write to console if is in read mode.
                return;
            }

            text = String(text);

            this.addNewLine(true, className);

            var lines = text.split('\n'),
                line,
                activeLine = this.getActiveLine(),
                i;

            for (i = 0; i < lines.length - 1; i += 1) {
                line = lines[i];
                activeLine.elements.$left.text(activeLine.elements.$left.text() + line);
                this.addNewLine(true, className);
                activeLine = this.getActiveLine();
                activeLine.elements.$left.text("\n");
            }

            activeLine = this.getActiveLine();
            line = lines[i];
            activeLine.elements.$left.text(activeLine.elements.$left.text() + line);
        },

        ReadLine: function (callback) {
            if (this.isReadMode) {
                return;
            }

            this.isReadMode = true;
            var self = this;

            this.readLineFunction(function (data) {
                self.isReadMode = false;
                callback(data);
            });
        },

        readLineFunction: function (onExitCallback) {
            if (!this.isReadMode) {
                return;
            }

            this.addNewLine(true);

            var textAreaElement = this.$textArea,
                parentElement = this.$parentElement,
                self = this;

            $(parentElement).on('click', function () {
                textAreaElement.off();
                textAreaElement.focus();

                textAreaElement.on('input', function () {
                    return self.onInputCallback();
                });

                textAreaElement.on('keydown', function (event) {
                    return self.onKeyDownCallback(event, onExitCallback);
                });
            });

            $(parentElement).click();
        },

        onInputCallback: function () {
            if (this.isDisabled) {
                return;
            }

            var textAreaElement = this.$textArea,
                activeLine = this.getActiveLine(),
                data = textAreaElement.val(),
                leftText = activeLine.elements.$left.text(),
                rightText = activeLine.elements.$right.text();

            if (data.length > 0) {
                if (data[data.length - 1] !== '\n') {
                    leftText = leftText + data;
                }
            }

            activeLine.elements.$left.text(leftText);
            activeLine.elements.$right.text(rightText);
            textAreaElement.val('');

            return false;
        },

        onKeyDownCallback: function (event, onExitCallback) {
            if (this.isDisabled) {
                return;
            }

            var textAreaElement = this.$textArea,
                activeLine = this.getActiveLine(),
                keycode = event.which || event.keycode,
                leftText = activeLine.elements.$left.text(),
                rightText = activeLine.elements.$right.text(),
                parentElement = this.$parentElement;

            if (keycode === 39 || keycode === 37 || keycode === 8 || keycode === 13) {
                if (keycode === 39) {    //Left arrow
                    if (rightText.length > 0) {
                        leftText += rightText[0];
                        rightText = rightText.substring(1);
                    }
                } else if (keycode === 37) {    //Right arrow
                    if (leftText.length > 0) {
                        rightText = leftText[leftText.length - 1] + rightText;
                        leftText = leftText.substring(0, leftText.length - 1);
                    }
                } else if (keycode === 8) {     //Backspace
                    leftText = leftText.substring(0, leftText.length - 1);
                } else if (keycode === 13) {
                    if ((leftText + rightText).length > 0) {
                        $(parentElement).off();
                        textAreaElement.off();
                        onExitCallback(leftText + rightText);
                    }
                }

                activeLine.elements.$left.text(leftText);
                activeLine.elements.$right.text(rightText);
                textAreaElement.val('');

                return false;
            }
        },

        ReadChar: function (callback) {
            if (this.isReadMode) {
                return;
            }

            this.isReadMode = true;

            this.addNewLine(true);

            var activeLine = this.getActiveLine(),
                textAreaElement = this.$textArea,
                parentElement = this.$parentElement,
                data,
                leftText,
                self = this;

            $(parentElement).on('click', function () {
                textAreaElement.off();
                textAreaElement.focus();

                textAreaElement.on('input', function () {
                    if (self.isDisabled) {
                        return;
                    }

                    leftText = activeLine.elements.$left.text();
                    data = textAreaElement.val();
                    if (data[data.length - 1] !== "\n") {
                        $(parentElement).off();
                        textAreaElement.off();
                        activeLine.elements.$left.text(leftText + data[data.length - 1]);   //Get only last char
                        self.isReadMode = false;
                        textAreaElement.val('');
                        callback(data[data.length - 1]);
                    }
                });
            });

            $(parentElement).click();
        },

        Reset: function () {
            var textAreaElement = this.$textArea,
                parentElement = this.$parentElement;

            parentElement.off();
            textAreaElement.off();

            this.isReadMode = false;

            this.linesContainer.find('span').remove();
            this.lines = [];

            this.activeLineIndex = -1;

            this.addNewLine(true);

            this.$textArea.val('');
        },

        destroy: function () {
            this.Reset();
        },

        disable: function () {
            this.isDisabled = true;
        },

        enable: function () {
            this.isDisabled = false;
        }
    };

    presenter.console = UserConsole;
    // ---------------------------------- VALIDATION SECTION ---------------------------------
    /**
     * Wrap each function or method defined by user by this code. It will set default values for function and initialize console for call
     * Functions pause and next will stop or resume machine which actually executes this code.
     * @param {String} userCode
     * @returns {string}
     */
    function wrapMethodOrFunctionWithBuiltInCode (userCode) {
        var code = "var builtIn = {\n";
        code += "   console: arguments[0].console,\n";
        code += "   data: arguments[0].data,";
        code += "   objects: arguments[1],\n";
        code += "   retVal: arguments[4]\n";
        code += "};";
        code += "builtIn.console.nextIns = arguments[2];\n";
        code += "builtIn.console.pauseIns = arguments[3];\n";
        code += "arguments = Array.prototype.slice.call(arguments, 5)\n";

        code += userCode;

        return code;
    }

    function generateValidationError(errorCode) {
        return {
            isValid: false,
            errorCode: errorCode
        };
    }

    presenter.validateFunction = function presenter_validateFunction (functionToValidate) {
        var validatedFunction;

        if (!/^[A-Za-z_][a-zA-Z0-9_]*$/g.exec(functionToValidate.name)) {
            return generateValidationError("FN01");
        }

        try {
            validatedFunction = new Function(wrapMethodOrFunctionWithBuiltInCode(functionToValidate.body));
        } catch (e) {
            return generateValidationError("JS02");
        }

        return {
            isValid: true,
            value: {
                name: functionToValidate.name,
                body: validatedFunction
            }
        };
    };

    presenter.validateFunctions = function presenter_validateFunctions (functions) {
        var validatedFunctions = {},
            i,
            validatedFunction;

        for (i = 0; i < functions.length; i += 1) {
            if (functions[i].name.trim().length === 0) {
                continue;
            }

            validatedFunction = presenter.validateFunction(functions[i]);
            if (!validatedFunction.isValid) {
                return validatedFunction;
            }

            if (validatedFunctions[validatedFunction.value.name]) {
                return generateValidationError("FN02");
            }

            validatedFunctions[validatedFunction.value.name] = validatedFunction.value.body;
        }

        return {
            isValid: true,
            value: validatedFunctions
        };
    };

    presenter.validateAliases = function presenter_validateAliases (aliases) {
        var definedAliases = {},
            aliasKey,
            aliasName,
            exists = {};

        for (aliasKey in aliases) {
            if (aliases.hasOwnProperty(aliasKey)) {
                if (aliases[aliasKey].name && !ModelValidationUtils.isStringEmpty(aliases[aliasKey].name.trim())) {
                    aliasName = aliases[aliasKey].name.trim();

                    if (!/^[A-Za-z_][a-zA-Z0-9_]*$/g.exec(aliasName)) {
                        return generateValidationError("AN01");
                    }

                    definedAliases[aliasKey] = aliases[aliasKey].name.trim();
                }
            }
        }

        for (aliasKey in definedAliases) {
            if (definedAliases.hasOwnProperty(aliasKey)) {
                if (exists[definedAliases[aliasKey]]) {
                    return generateValidationError("AN02");
                }

                exists[definedAliases[aliasKey]] = true;
            }
        }

        return {
            isValid: true,
            value: definedAliases
        };
    };

    presenter.validateParameters = function presenter_validateParameters (params) {
        var parameters = [],
            i;
        for (i = 0; i < params.length; i += 1) {
            parameters.push(params[i].value);
        }

        return {
            isValid: true,
            value: parameters
        };
    };

    presenter.validateAnswer = function presenter_validateAnswer (model) {
        var runUserCode = ModelValidationUtils.validateBoolean(model.runUserCode),
            answerCode = model.answerCode,
            maxTimeForAnswer = ModelValidationUtils.validateFloatInRange(model.maxTimeForAnswer, 10, 0),
            validatedParameters;

        if (runUserCode && (!maxTimeForAnswer.isValid || maxTimeForAnswer.parsedValue === 0)) {
            return generateValidationError("IP01");
        }

        validatedParameters = presenter.validateParameters(model.runParameters);

        return {
            isValid: true,
            runUserCode: runUserCode,
            answerCode: new Function(answerCode),
            maxTimeForAnswer: maxTimeForAnswer,
            parameters: validatedParameters.value
        };


    };

    presenter.validateUniquenessAliasesNamesAndFunctions = function presenter_validateUniquenessAliasesNamesAndFunctions (aliases, functions) {
        var aliasKey;

        for (aliasKey in aliases) {
            if (aliases.hasOwnProperty(aliasKey)) {
                if (functions[aliases[aliasKey]]) {
                    return generateValidationError("FN03");
                }
            }
        }

        return {
            isValid: true
        };
    };

    /**
     * @param {{objectName: (Array|Number|String), methodName: String, methodBody: String}} method 
     */
    presenter.validateMethod = function presenter_validateMethod (method) {
        var validatedMethod = {};

        try {
            validatedMethod = {
                objectName: method.objectName,
                methodName: method.methodName,
                function: new Function (wrapMethodOrFunctionWithBuiltInCode(method.methodBody))
            }
        } catch (e) {
            return generateValidationError("JS01");
        }

        return {
            isValid: true,
            method: validatedMethod
        };
    };

    /**
     * @param {{objectName: (Array|Number|String), methodName: String, methodBody: String}[]} methods 
     */
    presenter.validateMethods = function presenter_validateMethods (methods) {
        var validatedMethods = [];

        methods.forEach(function (method) {
            var validatedMethod = presenter.validateMethod(method);

            if (!validatedMethod.isValid) {
                return validatedMethod;
            }

            validatedMethods.push(validatedMethod.method);
        });

        return {
            isValid: true,
            methods: validatedMethods
        }
    };

    presenter.validateModel = function presenter_validateModel (model) {
        var validatedAliases,
            validatedFunctions,
            validatedAnswer,
            isUniqueInAliasesAndFunctions,
            validatedMethods;

        validatedAliases = presenter.validateAliases(model.default_aliases);
        if (!validatedAliases.isValid) {
            return validatedAliases;
        }

        validatedFunctions = presenter.validateFunctions(model.functionsList);
        if (!validatedFunctions.isValid) {
            return validatedFunctions;
        }

        if (validatedAliases.isValid && validatedFunctions.isValid) {
            isUniqueInAliasesAndFunctions = presenter.validateUniquenessAliasesNamesAndFunctions(validatedAliases.value, validatedFunctions.value);
            if (!isUniqueInAliasesAndFunctions.isValid) {
                return isUniqueInAliasesAndFunctions;
            }
        }

        validatedAnswer = presenter.validateAnswer(model);
        if (!validatedAnswer.isValid) {
            return validatedAnswer;
        }

        validatedMethods = presenter.validateMethods(model.methodsList);
        if (!validatedMethods.isValid) {
            return validatedMethods;
        }

        return {
            isValid: true,
            addonID: model.ID,
            isActivity: !ModelValidationUtils.validateBoolean(model.isNotActivity),
            isVisibleByDefault: ModelValidationUtils.validateBoolean(model['Is Visible']),
            functions: validatedFunctions.value,
            aliases: $.extend(presenter.configuration.aliases, validatedAliases.value),
            answer: validatedAnswer,
            methods: validatedMethods.methods
        };
    };

    return presenter;
}