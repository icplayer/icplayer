## Description

The Quiz module allows creating a single choice test. When a user selects the wrong answer – the test will end. The module allows you to add hints to questions and use the 50/50 type of assistance.

The demo presentation is available [here](/embed/6492154773110784 "Demo presentation").

## Properties

<table border='1'>
<tbody>
    <tr>
        <th>Property name</th>
        <th>Description</th> 
    </tr>
	<tr>
        <td>Is visible</td>
        <td>This property allows hiding or showing the module depending on the activity requirements.</td> 
    </tr>
    <tr>
        <td>Questions</td>
        <td>This property contains a list of questions. Each question must have a specified Question topic, a CorrectAnswer and three wrong answers. If the module is configured to show help buttons, each question also needs to have a specified Hint.</td> 
    </tr>
	<tr>
        <td>Show help buttons</td>
        <td>If this property is marked, in the module area the buttons "50/50" and "Show Hint" are displayed. Each button can be used once in a whole excersise – no matter how many questions are put.</td> 
    </tr>
	<tr>
        <td>Game lost message</td>
        <td>Information that appears when a user selects the wrong answer.</td> 
    </tr>
	<tr>
        <td>Game won message</td>
        <td>Information that appears when a user gives proper answers to all questions.</td> 
    </tr>
	<tr>
        <td>Is activity</td>
        <td>This property allows defining whether the quiz module is an activity or not. When it is not defined as an activity, the answers given are not taken into account in the overall result. It is helpful for e.g. simulations.</td>
    </tr>
	<tr>
        <td>Next label</td>
        <td>The text which appears on the "Next" button</td> 
    </tr>
</tbody>
</table>


## Supported commands

<table border='1'>
    <tr>
        <th>Command name</th>
        <th>Params</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>isAllOK</td>
        <td>---</td>
        <td>Returns true when all questions are answered correctly, otherwise false.</td>
    </tr>
    <tr>
        <td>isAttempted</td>
        <td>---</td>
        <td>Returns true if a user has made any interaction with the module, false otherwise.</td>
    </tr>
    <tr>
        <td>show</td>
        <td>---</td>
        <td>Shows the module.</td>
    </tr>
    <tr>
        <td>hide</td>
        <td>---</td>
        <td>Hides the module.</td>
    </tr>
    <tr>
        <td>enable</td>
        <td>---</td>
        <td>Enables the module.</td>
    </tr>
    <tr>
        <td>disable</td>
        <td>---</td>
        <td>Disables the module.</td>
    </tr>
    <tr>
        <td>reset</td>
        <td>---</td>
        <td>Resets the module.</td>
    </tr>
</table>


##Show Answers

This module is fully compatible with [Show Answers module](/doc/page/Show-Answers "Show Answers module") and displays correct answers when a relevant event is sent.

## Events

When a user answers all questions properly, the addon sends the 'ALL OK' event. This event is different from a normal event so its structure is shown below.

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

When a user selects the answer, the addon sends the 'ValueChanged' event. This event has score 1 if the answer is correct, otherwise 0.
The event has also an item, which is the number of a current question.

<table border='1'>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>source</td>
        <td>ID of this instance of the addon.</td>
    </tr>

    <tr>
        <td>Item</td>
        <td>The number of a currently answered question.</td>
    </tr>
    <tr>
        <td>Value</td>
        <td>1</td>
    </tr>
    <tr>
        <td>Score</td>
        <td>1 - answered correctly <br>
        0 - answered incorrectly</td>
    </tr>
</table>

## Configuration

The module expects at least one fully-configured question to appear correctly. If the "Show help buttons" option is marked, each question needs to have a specified hint. Otherwise, the hint is not required.

## CSS classes

<table border='1'>
<tbody>
    <tr>
        <th>Class name</th>
        <th>Description</th> 
    </tr>

    <tr>
        <td>.question-wrapper</td>
        <td>the main addon's layer</td> 
    </tr>
    <tr>
        <td>.question-wrapper .question-title</td>
        <td>indicates the style that applies to the question content</td> 
    </tr>
    <tr>
        <td>.question-wrapper .hint-button</td>
        <td>indicates the style that applies to the "Hint" button</td> 
    </tr>
    <tr>
        <td>.question-wrapper .fifty-fifty</td>
        <td>indicates the style that applies to the "50/50" button</td> 
    </tr>
    <tr>
        <td>.question-wrapper .next-question-button</td>
        <td>indicates the style that applies to the inactive "Next question" button</td> 
    </tr>
    <tr>
        <td>.question-wrapper .next-question-button.active</td>
        <td>indicates the style that applies to the active "Next question" button</td> 
    </tr>
    <tr>
        <td>.question-wrapper .question-tips</td>
        <td>indicates the style that applies to a layer with possible answers</td>
    </tr>
    <tr>
        <td>.question-wrapper .question-hint-buttons</td>
        <td>indicates the style that applies to a layer with special buttons (Next Button, Hint, 50/50)</td>
    </tr>
    <tr>
        <td>.question-wrapper .question-hint-buttons .used</td>
        <td>indicates the style that applies to the inactive Hint and/or 50/50 buttons</td>
    </tr>
    <tr>
        <td>.question-wrapper .removed</td>
        <td>indicates the style that applies to a possible answer removed by the 50/50 hint.</td>
    </tr>
    <tr>
        <td>.question-wrapper .question-tips .question-tip</td>
        <td>indicates the style that applies to each possible answer</td>
    </tr>
    <tr>
        <td>.question-wrapper .question-tips .question-tip.correct</td>
        <td>indicates the style that applies to a correct answer</td>
    </tr>
    <tr>
        <td>.question-wrapper .question-tips .question-tip.wrong</td>
        <td>indicates the style that applies to a wrong answer</td>
    </tr>
    <tr>
        <td>.question-wrapper .question-hint-wrapper</td>
        <td>indicates the style that applies to a wrapper of a feedback area</td>
    </tr>
    <tr>
        <td>.question-wrapper .question-hint</td>
        <td>indicates the style that applies to a layer with a hint to a current question, placed in a feedback area</td>
    </tr>
    <tr>
        <td>.question-wrapper .game-won-message-wrapper</td>
        <td>indicates the style of the overlay placed in feedback area, when game is won.</td>
    </tr>
    <tr>
        <td>.question-wrapper .game-won-message</td>
        <td>indicates the style of a layer placed in a feedback area with "Game Won Message"</td>
    </tr>
	<tr>
        <td>.question-wrapper .game-lost-message-wrapper</td>
        <td>indicates the style of an overlay placed in a feedback area, when a game is lost.</td>
    </tr>
    <tr>
        <td>.question-wrapper .game-lost-message</td>
        <td>indicates the style of a layer placed in a feedback area with "Game Lost Message"</td>
    </tr>
    <tr>
        <td>.question-wrapper .question-tips .question-tip.correct-answer</td>
        <td>indicates the style that applies to a correct possible answer in the "Show Answers" mode</td>
    </tr>
    <tr>
        <td>.question-wrapper .quiz-progress</td>
        <td>indicates the style that applies to a layer with information about progress</td>
    </tr>
    <tr>
        <td>.question-wrapper.disabled</td>
        <td>indicates the style that applies to the module when it is disabled</td>
    </tr>
	</tbody>
</table>

**Default styles:**


	.quiz-error-layer {
		color: #FF0000;
		background-color: #FFFFFF;
		width:100%;
		height: 100%;
	}

	.question-wrapper {
		width: 100%;
		height: 100%;
	}

	.question-wrapper .question-title {
		text-align: center;
		height: 33%;
	}

	.question-wrapper .hint-button {
		background: url("resources/hint.png");
		width: 60px;
		height: 60px;
		cursor: pointer;
		float: right;
	}

	.question-wrapper .fifty-fifty {
		background: url("resources/50-50.png");
		width: 60px;
		height: 60px;
		cursor: pointer;
		float: right;
	}

	.question-wrapper .next-question-button {
		width: 60px;
		height: 60px;
		cursor: default;
		float: right;
		opacity: 0.5;
	}

	.question-wrapper .next-question-button.active {
		cursor: pointer;
		opacity: 1;
	}

	.question-wrapper .question-tips {
		display: inline-block;
		width: 80%;
		float: left;
		height: 34%;
	}

	.question-wrapper .question-hint-buttons {
		display: block;
		width: 20%;
		float: right;
	}

	.question-wrapper .question-hint-buttons .used {
		opacity: 0.5;
		cursor: default;
	}

	.question-wrapper .removed {
		opacity: 0.5;
	}

	.question-wrapper .question-tips .question-tip {
		display: inline-block;
		cursor: pointer;
		width: 50%;
		height: 50%;
	}

	.question-wrapper .question-tips .question-tip.correct {
		background-color: greenyellow;
	}

	.question-wrapper .question-tips .question-tip.wrong {
		background-color: #A52A2A;
	}

	.question-wrapper .question-hint-wrapper {
		height: 33%;
		width: 80%;
		float: left;
		display: block;
	}

	.question-wrapper .question-hint {
		background-color: #FFFF00;
		color: #000000;
		width: 100%;
		height: 100%;
	}

	.question-wrapper .game-won-message-wrapper {
		background-color: #00aa00;
		color: #ffffff;
		width: 100%;
		height: 100%;
	}
	.question-wrapper .game-won-message {
		text-align: center;
	}

	.question-wrapper .game-lost-message-wrapper {
		background-color: #aa0000;
		color: #ffffff;
		width: 100%;
		height: 100%;

	}
	.question-wrapper .game-lost-message {
		text-align: center;
	}

	.question-wrapper.disabled,
	.question-wrapper.disabled .hint-button,
	.question-wrapper.disabled .fifty-fifty,
	.question-wrapper.disabled .question-tips .question-tip {
		cursor: not-allowed;
	}

	.question-wrapper .question-tips .question-tip.correct-answer {
		background-color: #99FF55;
	}

	.question-wrapper .quiz-progress {
		width: 60px;
		float: right;
		text-align: center;
	}

## Demo presentation

[Demo presentation](/embed/6492154773110784 "Demo presentation") contains examples of how to use the Quiz addon.     