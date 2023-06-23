## Description

Limited Reset is a module that allows you to add a button clicking on which will reset answers given in the specified modules.

<div style="border:1px solid Tomato; padding:5px; margin-bottom:21px;">
Note: This module should not be used when a lesson has the Score type defined as first (more about score types can be found in <a href="/doc/page/Saving-user's-result">documentation</a>)!
</div>

The Limited Reset module is based on the <a href="/doc/page/Check-and-Reset-buttons">Reset module</a>. In addition to the base module, Limited Reset has additional rules and functions:

* when the Check module is selected, all Limited Reset modules are disabled during the error checking mode
* when the Show Answers module is selected and a user selects the Limited Reset module, the Show Answers module will be disabled and deselected

## Properties

<table border='1'>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Title</td>
        <td>A title displayed inside the module.</td>
    </tr>
	<tr>
        <td>Works with</td>
        <td>List of modules connected to the Limited Check module. Each line should consist of a separate module ID.</td>
    </tr>
    <tr>
        <td>Reset only wrong answers</td>
        <td>Resets only wrong answers.</td>
    </tr>
    <tr>
        <td>Speech texts</td>
        <td>List of speech texts: 
            Disabled, 
            Activity has been reset. <br /> 
        This texts will be read by Text to Speech addon after a user performs an action.</td> 
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
        <td>getWorksWithModulesList</td>
        <td>---</td>
        <td>Returns the list of module ids configured in the "Works With" property.</td>
    </tr>
</table>

## Advanced Connector integration

Each command supported by the Limited Reset module can be used in the Advanced Connector's scripts. The below example shows how it interacts with the Single Stare Button module.

    EVENTSTART
    Name:ValueChanged
	Source:SingleStateButton1
    SCRIPTSTART
        var limitedReset = presenter.playerController.getModule('LimitedReset1');

		limitedReset.show();
    SCRIPTEND
    EVENTEND
	
	EVENTSTART
    Name:ValueChanged
	Source:SingleStateButton2
    SCRIPTSTART
        var limitedReset = presenter.playerController.getModule('LimitedReset1');

		limitedReset.hide();
    SCRIPTEND
    EVENTEND

## Events
Limited Reset does not send any events.

## CSS Classes

<table border="1">
	<tbody>
		<tr>
			<th>Class name</th>
			<th>Description</th>
		</tr>
		<tr>
			<td>.ic_button_limited_reset</td>
			<td>indicates the look of the Limited Reset button</td>
		</tr>
		<tr>
			<td>.ic_button_limited_reset-up-hovering</td>
			<td>indicates the look of the Limited Reset button while putting a mouse cursor on it.</td>
		</tr>
		<tr>
			<td>.ic_button_limited_reset-down-hovering</td>
			<td>indicates the look of the Limited Reset button while clicking on it.</td>
		</tr>
	</tbody>
</table>

### Default Styling

<pre>
.ic_button_limited_reset{
	background-image	:url('images/reset.png');
	background-repeat	:no-repeat;
	background-position	:center;
	cursor: pointer; 	
}
</pre>

### Custom Styling Example

<pre>
.LimitedReset_MyClass{
	background-color: #fefefe;
	border-radius: 2px;
	cursor: pointer; 	
}
</pre>

## Demo presentation
[Demo presentation](/embed/5169063738212352"Demo presentation") contains examples of how to use this module.
