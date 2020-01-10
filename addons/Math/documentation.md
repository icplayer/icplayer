## Description
The Math addon has been developed for all teachers who prepare math presentations. With this addon, a teacher can create both simple and complicated equations and as inputs use Text module gaps.


## Properties

<table border='1'>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Variables</td>
        <td>A list of variables assigned to Text/Image Gap module gaps separated with newlines. Each variable is defined by its name, equality character and a module ID with a gap index after each dot (i.e. 'gap01 = Text2.3' means that gap01 holds a value of the 3rd gap in a text module with ID Text2). For Image Gap module, gap index is always 1.</td>
    </tr>
    <tr>
        <td>Expressions</td>
        <td> A list of JavaScript boolean expressions (i.e. 'gap01 == 3 && 1 + 2 > 2' will evaluate to true if a gap assigned to a variable gap01 will hold '3' string). It's crucial to remember that all expressions are JavaScript boolean expressions!</td>
    </tr>
    <tr>
	<td>Decimal separator</td>
	<td><b>By default, decimal separator in Math expressions is a dot character.</b> When this field is filled, e.g. with a comma, all expressions containing this character will have it replaced with a dot character. This enables to write and use expressions with other but default decimal separators.</td>
    </tr>
    <tr>
        <td>Thousand separator</td>
	<td>By default, in Math expressions numbers are writen without any thousand separators. When this field is filled, e.g. with a dot, all expressions containing this character will have it removed.<b> Thousand separator and decimal separator cannot be the same!</b></td>
    </tr>
    <tr>
        <td>onCorrect</td>
        <td>User event code is to be executed if all expressions are evaluated as true</td>
    </tr>
    <tr>
        <td>onIncorrect</td>
        <td>User event code is to be executed if at least one expression is evaluated as false</td>
    </tr>
    <tr>
        <td>onPartiallyCompleted</td>
        <td>User event code is to be executed if at least one gap was left empty</td>
    </tr>
    <tr>
        <td>Show Answers</td>
        <td>A list of gaps' answers separated with newlines. Each answer is defined by a gap name set in Variables and value that will be displayed in the Show Answers mode (e.g. 'gap01 = 1' means that for gap01 the answer  displayed will be '1'). The Text/Table/Image Gap modules, where the answers from the Math module should be displayed, must be set to the 'not activity' mode.
        </td>
    </tr>
    <tr>
        <td>Empty Answer</td>
        <td>The empty answer is specially dedicated to dropdown gaps in Text module with the default option "---". It's treated by the Math module as an answer, not as an empty value. This property allows defining that it should be treated as an empty answer, not the triple dash value. Only one single word without spaces is allowed, e.g: "---".
        </td>
    </tr>
</table>

### Note about expressions:
Because each expression is in fact a JavaScript boolean expression, users can use immediate execution functions inside them, as long as those evaluates to boolean value. Variables (gaps values) can be accessed inside those function by passing 'this.variables' parameter (see the example below).

    (function (variables) { var sum; for (var variable in variables) {
     sum += variables[variable]; } return sum > 10; })(this.variables)

If user wants to use variables by name, immediate execution function has to be constructed in special way:

    (function (variables) { this.variables = variables;
    return gap1 > 5; })(this.variables)

This pattern is necessary due to variables parsing mechanism in Math addon.

**Remember that whole expression (in this case whole immediate execution function) has to be placed in one line (whithout line breaks)!**

## Supported commands

<table border='1'>
    <tr>
        <th>Command name</th>
        <th>Params</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>evaluate</td>
        <td>---</td>
        <td>Evaluates all specified expressions. Text gaps will not be marked as (in)correct!</td>
    </tr>
    <tr>
        <td>isAttempted</td>
        <td>---</td>
        <td>Returns true if all gaps are filled in.</td>
    </tr>
    <tr>
        <td>isAllOK</td>
        <td>---</td>
        <td>Returns true if all gaps are filled in correctly.</td>
    </tr>
</table>

##Events

When a user fills in all gaps correctly without any error, the module sends the 'ALL OK' event. This event is different from a normal event so its structure is shown below.

<table border='1'>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Item</td>
        <td>all</td>
    </tr>
    <tr>
        <td>Value</td>
        <td>N/A</td>
    </tr>
    <tr>
        <td>Score</td>
        <td>N/A</td>
    </tr>
</table>

## Advanced Connector integration
Each command supported by Math Addon can be used in the Advanced Connector addon scripts. The below example shows how to react on each gap content change and evaluate expressions.

        EVENTSTART
        Source:Text2
        SCRIPTSTART
        	var mathModule = presenter.playerController.getModule('Math1');
        	mathModule.evaluate();
        SCRIPTEND
        EVENTEND

## Scoring
The Math addon allows to create exercises as well as activities. Scoring is calculated based on variables and expressions evaluation results. Number of expressions is not taken into consideration in this process. Please keep in mind that score and error count is calculated only when all neccessary gaps are filled. **It's very important to turn off 'Is Activity' option in Text module whose gaps are variables in Math Addon! Otherwise scoring for the whole page will be counted incorrectly!**

<table border='1'>
    <tr>
        <th>Property</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>maxScore</td>
        <td>maximum score is equal to number of specified variables</td>
    </tr>
    <tr>
        <td>score</td>
        <td>if overall result of expressions evaluation is true then score is equal maxScore, otherwise it's 0</td>
    </tr>
    <tr>
        <td>errorCount</td>
        <td>if overall result of expressions evaluation is false then errorCount is equal maxScore, otherwise it's 0</td>
    </tr>
</table>

## CSS classes

<table border='1'>
    <tr>
        <th>Class name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>---</td>
        <td>---</td>
    </tr>
</table>

Math addon doesn't expose any CSS classes because its internal structure should not be changed (neither via Advanced Connector nor CSS styles).

## Demo presentation

[Demo presentation](/embed/6418557626744832 "Demo presentation") contains examples of how to use a Math addon.                          