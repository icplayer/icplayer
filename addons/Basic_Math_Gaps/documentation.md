## Description

Basic Math Gaps is used to quickly create simple mathematical expressions.

## Properties

<table border='1'>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Decimal Separator</td>
        <td>By default, the decimal separator in Basic Math Gaps is a dot character. When this field is filled in with, e.g. a comma, all settings containing the dot character will have it replaced with a comma.</td>
    </tr>
    <tr>
        <td>Gaps Definition</td>
        <td>Gaps Definitions, examples can be found in Gaps Definition Examples chapter or Demo Presentation.</td>
    </tr>
    <tr>
        <td>Is Equation</td>
        <td>Defines if the addon is an equation, which indicates that the correctness of the mathematical expressions will be verified.</td>
    </tr>
    <tr>
        <td>Is Not Activity</td>
        <td>Defines if the addon is NOT an activity, which means that it won't be taken into consideration when checking correctness.</td>
    </tr>
    <tr>
        <td>Is Disabled</td>
        <td>Defines if the addon is disabled, which means that you won't be able to  interact with it.</td>
    </tr>
    <tr>
        <td>Gap Type</td>
        <td>This property allows selecting a proper gap type – editable or draggable.</td>
    </tr>
    <tr>
        <td>Signs</td>
        <td>Property signs allows defining the signs to be declared for mathematical operations like: addition, subtraction, division and multiplication.</td>
    </tr>
</table>

## Gaps Definition

[1] + 2 = [3]

1/[2] = 1/[4] + [1/4]

1 [1/4] + 2 [1/4] = 3 2/4

## Supported commands

<table border='1'>
    <tr>
        <th>Command name</th>
        <th>Params</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>show</td>
        <td>---</td>
        <td>Shows the addon.</td>
    </tr>
	<tr>
        <td>hide</td>
        <td>---</td>
        <td>Hides the addon</td>
    </tr>
	<tr>
        <td>disable</td>
        <td>---</td>
        <td>Disables the addon.</td>
    </tr>
	<tr>
        <td>enable</td>
        <td>---</td>
        <td>Enables the addon.</td>
    </tr>
	<tr>
        <td>isAllOK</td>
        <td>---</td>
        <td>Returns true if all gaps are filled correctly and there are no mistakes, otherwise false.</td>
    </tr>
	<tr>
        <td>getView</td>
        <td>---</td>
        <td>Returns HTML element, which is the container of the addon.</td>
    </tr>
</table>

## Advanced Connector integration
Each command supported by the Basic Math Gaps addon can be used in the Advanced Connector addon scripts. The below example shows how to check if all gaps are filled correctly:

    EVENTSTART
    Source:Basic_Math_Gaps1
    SCRIPTSTART
        var bmg = presenter.playerController.getModule('basicMathGaps1');
		if (bmg.isAllOK()) {
			// do something when all gaps are filled correctly
		} else {
			// do something otherwise
		}
    SCRIPTEND
    EVENTEND

## Scoring
By default, the Basic Math Gaps addon allows to create exercises as well as activities. To set a module in a non-excercise mode, it is necessary to set the 'Is not an activity' property. If the addon is not in an excercise mode, all of the below methods return 0!

<table border='1'>
    <tr>
        <th>Property</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>maxScore - is Equation false</td>
        <td>Number of gap items</td>
    </tr>
	<tr>
        <td>maxScore - is Equation true</td>
        <td>1</td>
    </tr>
    <tr>
        <td>score - is Equation false</td>
        <td>1 point for each gap filled in correctly</td>
    </tr>
	<tr>
        <td>score - is Equation true</td>
        <td>1 if all gaps are filled in correctly</td>
    </tr>
    <tr>
        <td>errorCount - is Equation false</td>
        <td>1 error point for each gap filled in incorrectly.</td>
    </tr>
	<tr>
        <td>errorCount - is Equation true</td>
        <td>1 if any gap is filled in incorrectly.</td>
    </tr>
</table>

## Events
Basic Math Gaps sends events compatible with both [Connector](/doc/page/Connector) and [Advanced Connector](/doc/page/Advanced-Connector) modules.  When a gap is filled, it sends an event with the following arguments:

<table border='1'>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Item</td>
        <td>Id of the gap filled</td>
    </tr>
    <tr>
        <td>Value</td>
        <td>Value inserted into a gap</td>
    </tr>
    <tr>
        <td>Score</td>
        <td>Depending on the correct or wrong value, it sends 1 or 0 respectively.</td>
    </tr>
</table>

When a user properly places all items without any error, the addon sends the 'ALL OK' event. This event is different from a normal event so its structure is shown below.

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
        <td>if the addon is Equation true, the score is 1 or 0, depending on the answer.</td>
    </tr>
</table>

##Show Answers

This module is fully compatible with [Show Answers module](/doc/page/Show-Answers "Show Answers module") and displays correct answers when adequate event is sent.

## CSS Classes

<table border='1'>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
	<tr>
        <td>.basic-math-gaps-wrapper</td>
        <td>Outer wrapper of a whole addon</td>
    </tr>
    <tr>
        <td>.basic-math-gaps-container</td>
        <td>Inner container of a whole addon</td>
    </tr>
    <tr>
        <td>.element</td>
        <td>Elements other than a gap</td>
    </tr>
    <tr>
        <td>.fraction-container</td>
        <td>Container for fractions</td>
    </tr>
    <tr>
        <td>.numerator</td>
        <td>Numerator in fraction container</td>
    </tr>
    <tr>
        <td>.denominator</td>
        <td>Denominator in fraction container</td>
    </tr>
    <tr>
        <td>.correct</td>
        <td>This class is added in error checking mode when the gap is filled in correctly.</td>
    </tr>
    <tr>
        <td>.wrong</td>
        <td>This class is added in error checking mode when the gap is filled in incorrectly.</td>
    </tr>
</table>

### Default Styling

<pre>
.basic-math-gaps-wrapper .basic-math-gaps-container {
    padding: 10px 0px;
    border: 1px solid transparent;
}

.basic-math-gaps-wrapper .basic-math-gaps-container input,
.basic-math-gaps-wrapper .basic-math-gaps-container .element {
    width: 30px;
    text-align: center;
    margin: 0 2px;
}

.basic-math-gaps-wrapper .basic-math-gaps-container > input,
.basic-math-gaps-wrapper .basic-math-gaps-container > .element,
.basic-math-gaps-wrapper .basic-math-gaps-container > .fraction-container {
    float: left;
}

.basic-math-gaps-wrapper .basic-math-gaps-container.hasFractions > input,
.basic-math-gaps-wrapper .basic-math-gaps-container.hasFractions > .element {
    margin-top: 15px;
}

.basic-math-gaps-wrapper .basic-math-gaps-container .element {
    display: inline-block;
}

.basic-math-gaps-wrapper .basic-math-gaps-container .fraction-container {
    display: inline-block;
    text-align: center;
    padding: 0 5px;
}

.basic-math-gaps-wrapper .basic-math-gaps-container .fraction-container .numerator {
    padding: 0 5px;
}

.basic-math-gaps-wrapper .basic-math-gaps-container .fraction-container .denominator {
    border-top: 1px solid #000;
    display: block;
    padding: 2px 5px 0px 5px;
    margin-top: 2px;
}

.basic-math-gaps-wrapper .basic-math-gaps-container .hidden-addition {
    width: 0px;
    height: 0px;
    visibility: hidden;
    display: inline-block;
}

.basic-math-gaps-wrapper .basic-math-gaps-container .correct {
    border-color: #00bb00;
    background-color: #bbffbb;
}

.basic-math-gaps-wrapper .basic-math-gaps-container .wrong {
    border-color: #ff1111;
    background-color: #ffbbbb;
}
.basic-math-gaps-wrapper .basic-math-gaps-container.wrong {
    border: 1px solid #ff1111;
}

.basic-math-gaps-wrapper .basic-math-gaps-container.correct {
    border: 1px solid #00bb00;
}
</pre>

## Demo presentation
[Demo presentation](/present/5856743356628992 "Demo presentation") contains examples of how this addon can be used.                    