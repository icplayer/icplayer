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

function getJISONGrammar () {
    return {
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
                ["|down_to|",               "return 'DOWNTO';"],
                ["|by|",                    "return 'BY';"],
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
                ["[A-Za-z][a-zA-Z0-9_]*",  "return 'STATIC_VALUE';"],
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
                [ "functions program_name section_list code_block",   "return {sections: '', code: ($3 || []).concat($4).concat(undefined).concat($1).concat(undefined).concat(yy.presenterContext.bnf['getObjectCallManager']())};($2 || '') + ($3 || '');"  ]
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
                ["section_list section", "$$ = ($1 || []).concat($2);"]
            ],

            "section" : [
                ["var_section", "$$ = $1;"],
                ["array_section", "$$ = $1;"]
            ],

            "array_section" : [
                ["ARRAY_DEF array_list NEW_LINE", "$$ = $2 || []"]
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
                ["array_start_entry", "$$ = [$1]"],
                ["array_start_entries COMMA array_start_entry", "$1.push($3); $$ = $1;"]
            ],

            "array_start_entry" : [
                ["operation", "$$ = $1"]
            ],

            "var_section" : [
                ["variable_def_const var_list end_line", "$$ = $2;"]
            ],

            "variable_def_const" : [
                ["VARIABLE_DEF", "$$ = '';"]
            ],

            "var_list" : [
                ["var", "$$ = $1;"],
                ["var_list comma_separator var", "$$ = $1.concat($3);"]
            ],

            "comma_separator" : [
                ["COMMA", "$$ = '';"]
            ],

            "var" : [
                ["STATIC_VALUE", "$$ = [yy.presenterContext.bnf['var'](yy, yytext)];"],
                ["STATIC_VALUE = operation", "$$ = yy.presenterContext.bnf['var_start_value'](yy, $1, $3);"]
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
                ["case_options case_option", "$$ = $1.concat($2);"]
            ],

            "case_option": [
                ["OPTION case_operations THEN end_line code_block_or_instruction", "$$ = yy.presenterContext.bnf['case_option']($2, $5);"],
            ],

            "case_operations": [
                ["operation", "$$ = [$1]"],
                ["case_operations COMMA operation", "$1.push($3); $$ = $1"]
            ],

            "number_with_minus" : [
                ["number_value", "$$ = $1"],
                ["- number_value", "$$ = ($2 * -1);"]
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
                ["FOR STATIC_VALUE FROM operation TO operation BY NUMBER DO", "$$ = yy.presenterContext.bnf['for_value_header'](yy, $2, $4, $6, $8, '<=');"],
                ["FOR STATIC_VALUE FROM operation TO operation DO", "$$ = yy.presenterContext.bnf['for_value_header'](yy, $2, $4, $6, 1, '<=');"],
                ["FOR STATIC_VALUE FROM operation DOWNTO operation DO", "$$ = yy.presenterContext.bnf['for_value_header'](yy, $2, $4, $6, -1, '>=');"],
                ["FOR STATIC_VALUE FROM operation DOWNTO operation BY NUMBER DO", "$$ = yy.presenterContext.bnf['for_value_header'](yy, $2, $4, $6, $8 * -1, '>=');"]
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
                ["START_STRING string_chars END_STRING", "$$ = yy.presenterContext.bnf['string_value'](yy, $2);"]
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
                [ "operation + operation",      "$$ = yy.presenterContext.bnf['generateOperationCode'](yy, $1, $3, '__add__');" ],
                [ "operation - operation",      "$$ = yy.presenterContext.bnf['generateOperationCode'](yy, $1, $3, '__sub__');" ],
                [ "operation * operation",      "$$ = yy.presenterContext.bnf['generateOperationCode'](yy, $1, $3, '__mul__');" ],
                [ "operation DIV_FLOOR operation", "$$ = yy.presenterContext.bnf['generateOperationCode'](yy, $1, $3, '__div_full__');" ],
                [ "operation / operation",      "$$ = yy.presenterContext.bnf['generateOperationCode'](yy, $1, $3, '__div__');" ],
                [ "operation % operation",      "$$ = yy.presenterContext.bnf['generateOperationCode'](yy, $1, $3, '__mod__');" ],
                [ "operation <= operation",     "$$ = yy.presenterContext.bnf['generateOperationCode'](yy, $1, $3, '__le__');" ],
                [ "operation >= operation",     "$$ = yy.presenterContext.bnf['generateOperationCode'](yy, $1, $3, '__ge__');" ],
                [ "operation > operation",      "$$ = yy.presenterContext.bnf['generateOperationCode'](yy, $1, $3, '__gt__');" ],
                [ "operation < operation",      "$$ = yy.presenterContext.bnf['generateOperationCode'](yy, $1, $3, '__lt__');" ],
                [ "operation != operation",     "$$ = yy.presenterContext.bnf['generateOperationCode'](yy, $1, $3, '__neq__');" ],
                [ "operation == operation",     "$$ = yy.presenterContext.bnf['generateOperationCode'](yy, $1, $3, '__eq__');" ],
                [ "operation OR operation",     "$$ = yy.presenterContext.bnf['generateOptimizedOrOperationCode'](yy, $1, $3);" ],
                [ "operation AND operation",    "$$ = yy.presenterContext.bnf['generateOptimizedAndOperationCode'](yy, $1, $3);" ],
                [ "( operation )",              "$$ = $2" ],
                [ "- operation",                "$$ = yy.presenterContext.bnf['generateMinusOperation']($2);", {"prec": "UMINUS"} ],
                [ "operation DOT STATIC_VALUE ( arguments )", "$$ = yy.presenterContext.bnf['method_call']($3, $5 || [], $1);"],
                [ "number_value",               "$$ = $1" ],
                [ "variable_get",               "$$ = $1" ],
                [ "string_value",               "$$ = $1" ]
            ],

            "variable_get": [
                ["STATIC_VALUE", "$$ = yy.presenterContext.bnf['argument'](yy, yytext);"],
                ["operation [ operation ]", "$$ = yy.presenterContext.bnf['array_get']($1, $3);"]
            ],

            "number_value": [
                ["NUMBER", "$$ = yy.presenterContext.bnf['number_value'](yy, yytext);"]
            ]
        }
    }
}

function getWordBetweenHorizontalLine (word) {
        if (word.indexOf("|") > -1 && word.lastIndexOf("|") !== word.indexOf("|")) {
            return word.substring(1, word.length - 1);
        }
        return null;
}

/**
 * @param {{presenter: Object, aliases: {}}}config
 */
export function getLanguageParser(config) {
    let grammar = getJISONGrammar(),
        rules = grammar.lex.rules,
        aliases = config.aliases;

    for (let i = 0; i < rules.length; i += 1) {
        let rule = rules[i][0];
        let word = getWordBetweenHorizontalLine(rule);
        if (word !== null) {    //We want to find words between "$" and replace them with aliases
            if (aliases.hasOwnProperty(word)) {
                rules[i][0] = aliases[word];
            }
        }
    }

    let parser = new Jison.Parser(grammar);
    parser.yy.presenterContext = config.presenter;
    parser.yy.labelsStack = [];
    parser.yy.functionNames = [];
    return parser;
}