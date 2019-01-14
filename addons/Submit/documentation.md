## Description

Submit works in a way similar to Check module as it allows to check whether the provided answers are correct or wrong. However, its most important feature is that it first checks whether the user has attempted to complete all activities included in a page. If not, the addon sends a relevant message.

## Properties

<table border='1'>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Text</td>
        <td>Text displayed while not in the 'selected' state.</td>
    </tr>
    <tr>
        <td>Text Selected</td>
        <td>Text displayed while in the 'selected' state.</td>
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
        <td>show</td>
        <td>---</td>
        <td>Shows the module.</td> 
    </tr>
    <tr>
        <td>hide</td>
        <td>---</td>
        <td>Hides the module.</td> 
    </tr>
</table>


## Advanced Connector integration
In Advanced Connector you can react to events sent by Submit addon. 


    EVENTSTART
    Source:Submit1
	Name:NotAllAttempted
    SCRIPTSTART
        var feedback = presenter.playerController.getModule('feedback1');
        feedback.change('NotAllAttempted');
    SCRIPTEND
    EVENTEND
	
	EVENTSTART
	Source:Submit1
	Name:Submitted
	SCRIPTSTART
		var text= presenter.playerController.getModule('Text1');
        text.setText('Submitted');
	SCRIPTEND
	EVENTEND

## Events
Submit sends events compatible with [Advanced Connector](/doc/page/Advanced-Connector) module. 

It sends the Submitted event when a user clicks on the Submit button and all activities on a page has been attempted to be completed.

<table border='1'>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Name</td>
        <td>Submitted</td>
    </tr>
</table>

It sends the NotAllAttempted event when a user clicks on the Submit button but NOT all activities on a page has been attempted to be completed.

<table border='1'>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Name</td>
        <td>NotAllAttempted</td>
    </tr>
</table>

It sends the State event when a user clicks on the Submit button whenever it is in its clickable state.

<table border='1'>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Name</td>
        <td>State</td>
    </tr>
	<tr>
        <td>Value</td>
        <td>It is 1 or 0 depending on the button's state before clicking. 1 means that the button has been pressed, 0 means that the button has been released.</td>
    </tr>
</table>


## CSS Classes

<table border='1'>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
	<tr>
        <td>.submit-wrapper</td>
        <td>The outer wrapper of the whole addon</td>
    </tr>
    <tr>
        <td>.submit-container</td>
        <td>The inner container of the whole addon</td>
    </tr>
    <tr>
        <td>.submit-button</td>
        <td>A button's element</td>
    </tr>
    <tr>
        <td>.submit-wrapper.selected</td>
        <td>The outer wrapper when the addon has been clicked</td>
    </tr>
</table>

### Default Styling

<pre>
.submit-wrapper,
.submit-wrapper .submit-container,
.submit-wrapper .submit-container .submit-button {
    width: 100%;
    height: 100%;
}

.submit-wrapper .submit-container .submit-button {
    background: url('resources/submit-button.png') no-repeat center;
    cursor: pointer;
    text-align: center;
}
</pre>

## Demo presentation
[Demo presentation](/embed/5324416355401728 "Demo presentation") contains examples of how this addon can be used.               