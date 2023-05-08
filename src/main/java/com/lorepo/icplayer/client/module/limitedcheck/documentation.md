## Description

Limited Check is a module that allows users to add a button clicking on which will show whether the answers given in the specified modules are correct or wrong.

<div style="border:1px solid Tomato; padding:5px; margin-bottom:21px;">
Note: This module should not be used when a lesson has a defined Score type as first (more about score types can be found in <a href="/doc/page/Saving-user's-result">documentation</a>)!
</div>

Limited Check module is based on <a href="/doc/page/Check-and-Reset-buttons">Check module</a>. In addition to its base module, Limited Check has additional rules and functions:

* when the Check module is selected, all Limited Check modules are selected as well but they are also disabled in error checking mode
* selecting one Limited Check module will not select the Check module or any other Limited Check module
* when the Show Answers module is selected and a user selects the Limited Check module, the Show Answers mode will be disabled and deselected
* selecting one Limited Check Answer module will deactivate show answer mode on dependent modules covered by Limited Check Answers and Check Answers modules
* selecting one Limited Show module will deactivate error checking mode on dependent modules covered by Limited Check Answer module

<div style="border:1px solid Tomato; padding:5px; margin-bottom:21px;">
Note: Limited Show Aswers module and Limited Check must covered the same modules.
</div>

## Properties

<table border='1'>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Check text</td>
        <td>Text displayed on the button.</td>
    </tr>
    <tr>
        <td>Uncheck text</td>
        <td>Text displayed on the button when it's selected.</td>
    </tr>
	<tr>
        <td>Works with</td>
        <td>List of modules connected to Limited Check module. Each line should consist of separate modules ID.</td>
    </tr>
    <tr>
        <td>Count mistakes from provided modules</td>
        <td>With this option checked, mistakes will be counted from modules connected with Limited Check module.</td>
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
	<tr>
        <td>getModulesScore</td>
        <td>---</td>
        <td>Returns JavaScript object with score information (score, errors and maxScore) that is the sum of all score info for individual connected module.</td>
    </tr>
    <tr>
        <td>getWorksWithModulesList</td>
        <td>---</td>
        <td>Gets list of modules configuerd in "Works With" property.</td>
    </tr>
</table>

## Advanced Connector integration

Each command supported by the Limited Check module can be used in the Advanced Connector's scripts. The below example shows how it interacts with the Single Stare Button and Text modules.

    EVENTSTART
    Name:ValueChanged
	Source:SingleStateButton1
    SCRIPTSTART
        var limitedCheck= presenter.playerController.getModule('LimitedCheck1');
		var textModule= presenter.playerController.getModule('Text1');
		var scoreInfo = limitedCheck.getModulesScore();
		
		textModule.setText('Total score: ' + scoreInfo.score);
    SCRIPTEND
    EVENTEND

## Events
Limited Check sends events compatible with [Advanced Connector](/doc/page/Advanced-Connector). 

It sends the LimitedCheck event when a user selects the button.

<table border='1'>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Name</td>
        <td>LimitedCheck</td>
    </tr>
	<tr>
        <td>Score</td>
        <td>Total score of connected modules.</td>
    </tr>
	<tr>
        <td>Errors</td>
        <td>Total number of errors for connected modules.</td>
    </tr>
	<tr>
        <td>MaxScore</td>
        <td>A sum of maximum score for connected modules.</td>
    </tr>
</table>

It sends the LimitedCheck event when a user unselects the button.
<table border='1'>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Name</td>
        <td>LimitedCheck</td>
    </tr>
    <tr>
        <td>Value</td>
        <td>"unchecked"</td>
    </tr>
</table>

It sends the LimitedHideAnswers event when a user select the button and show answer mode is enabled.
<table border='1'>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Name</td>
        <td>LimitedHideAnswers</td>
    </tr>
    <tr>
        <td>Module1</td>
        <td>Module ID of first supported module</td>
    </tr>
    <tr>
        <td>Module2</td>
        <td>Module ID of second supported module</td>
    </tr>
    <tr>
        <td>Module[N]</td>
        <td>Module ID of nth supported module</td>
    </tr>
</table>

## CSS Classes

<table border="1">
	<tbody>
		<tr>
			<th>Class name</th>
			<th>Description</th>
		</tr>
		<tr>
			<td>.ic_button_limited_check</td>
			<td>indicates the look of the Limited Check button.</td>
		</tr>
		<tr>
			<td>.ic_button_limited_check-up-hovering</td>
			<td>indicates the look of the Limited Check button while putting a mouse cursor on it.</td>
		</tr>
		<tr>
			<td>.ic_button_limited_check-down-hovering</td>
			<td>indicates the look of the Limited Check button while clicking on it.</td>
		</tr>
		<tr>
			<td>.ic_button_limited_uncheck</td>
			<td>indicates the look of the Limited Check button when its pressed.</td>
		</tr>
		<tr>
			<td>.ic_button_limited_uncheck.disabled</td>
			<td>indicates the look of the Limited Check button when its pressed and disabled (because the Check Answers button was pressed).</td>
		</tr>
		<tr>
			<td>.ic_button_limited_uncheck-up-hovering</td>
			<td>indicates the look of the Limited Check button when its pressed while putting a mouse cursor on it.</td>
		</tr>
		<tr>
			<td>.ic_button_limited_uncheck-down-hovering</td>
			<td>indicates the look of the Limited Check button when its pressed while clicking on it.</td>
		</tr>
	</tbody>
</table>

### Default Styling

<pre>
.ic_button_limited_check {
	background-image: url('images/check.png');
	background-repeat: no-repeat;
	background-position: center; 	
	cursor: pointer;
}

.ic_button_limited_uncheck {
	background-image: url('images/uncheck.png');
	background-repeat: no-repeat;
	background-position: center; 	
	cursor: pointer;
}
</pre>

## Demo presentation
[Demo presentation](/embed/5169063738212352"Demo presentation") contains examples of how to use this module.                          