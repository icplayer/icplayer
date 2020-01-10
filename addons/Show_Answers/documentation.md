## Description

Show Answers is a module that allows users to view the correct answers for every activity on a page. 

Currently Show Answers has been integrated with the following addons:<ul>
<li>Basic Math Gaps
<li>Choice
<li>Clock
<li>Coloring
<li>Connecting Dots
<li>Connection
<li>Count and Graph
<li>Crossword
<li>Figure Drawing
<li>Fractions
<li>Fractions Binder
<li>Image gap
<li>Image Identification
<li>ImageViewer
<li>Graph
<li>Hangman
<li>Line Number
<li>Math
<li>Magic Boxes
<li>Memo Game
<li>Multiple Gaps
<li>Line Selection
<li>Pie CHart
<li>Plot
<li>Points and Lines
<li>Puzzle
<li>Quiz
<li>Ordering
<li>Shape Tracing
<li>Shooting Range
<li>Sudoku
<li>Table (gaps)
<li>Text (gaps)
<li>Text Identification
<li>Text Coloring
<li>Text Selection
<li>TrueFalse
<li>Writing Calculations
</li>
</ul>

<br/>
The Show Answers module is connected to all <a href="https://www.mauthor.com/doc/en/page/Limited-Show-Answers">Limited Show Answer</a> modules. Selecting the module disables or enables all Limited Show Answer modules.   

## Properties

<table border='1'>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Text</td>
        <td>Text displayed on the button.</td>
    </tr>
    <tr>
        <td>Text selected</td>
        <td>Text displayed on the button when it's selected.</td>
    </tr>
    <tr>
        <td>Increment check counter</td>
        <td>When this option is selected, check counter will be increased while showing answers.</td>
    </tr>
	<tr>
        <td>Increase mistake counter</td>
        <td>When this option is selected, mistake counter will be increased while showing answers.</td>
    </tr>
    <tr>
        <td>Lang attribute</td>
        <td>This property allows to define the language for this addon (different than the language of the lesson).</td> 
    </tr>
</table>

## Supported commands

<table border='1'>
    <tr>
        <th>Command name</th>
        <th>Params</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>hide</td>
        <td>---</td>
        <td>Hides the module.</td>
    </tr>
    <tr>
        <td>show</td>
        <td>---</td>
        <td>Shows the module.</td>
    </tr>
</table>

## Advanced Connector integration

Each command supported by the Show Answers module can be used in the Advanced Connector's scripts. The below example shows how it interacts with module Next.

    EVENTSTART
        Name:AllAttempted
    SCRIPTSTART
        var showAnswers= presenter.playerController.getModule('ShowAnswers1');
        showAnswers.show();
    SCRIPTEND
    EVENTEND
	
	EVENTSTART
        Name:NotAllAttempted
	SCRIPTSTART
		var showAnswers= presenter.playerController.getModule('ShowAnswers1');
        showAnswers.hide();
	SCRIPTEND
	EVENTEND

## Events
Show Answers sends events compatible with [Advanced Connector](/doc/page/Advanced-Connector). 

It sends ShowAnswers event when a user selects the button.

<table border='1'>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Name</td>
        <td>ShowAnswers</td>
    </tr>
</table>

It sends HideAnswers event when a user deselects the button.

<table border='1'>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Name</td>
        <td>HideAnswers </td>
    </tr>
</table>

## CSS Classes

<table border='1'>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
	<tr>
        <td>.show-answers-wrapper</td>
        <td>The outer wrapper of the whole module.</td>
    </tr>
    <tr>
        <td>.show-answers-container</td>
        <td>The inner container of the whole addon.</td>
    </tr>
    <tr>
        <td>.show-answers-button</td>
        <td>Button element</td>
    </tr>
</table>

### Default Styling

<pre>
.show-answers-wrapper,
.show-answers-wrapper .show-answers-container,
.show-answers-wrapper .show-answers-container .show-answers-button {
    width: 100%;
    height: 100%;
}

.show-answers-wrapper .show-answers-container .show-answers-button {
    background: url('resources/show-answers-button.png') no-repeat center;
    cursor: pointer;
    text-align: center;
}
</pre>

## Demo presentation
[Demo presentation](/embed/5642374371082240"Demo presentation") contains examples of how to use this module.                         