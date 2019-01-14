## Description

Done is connected closely with Submit addon. It checks whether all activities on the page have been attempted and the Submit button has been used, and then it sends 'Done' event.

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
</table>

## Advanced Connector integration
In Advanced Connector you can react to events sent by Done addon.

    EVENTSTART
    Source:Done1
	Name:NotAllAttempted
    SCRIPTSTART
        var feedback = presenter.playerController.getModule('feedback1');
        feedback.change('NotAllAttempted');
    SCRIPTEND
    EVENTEND
	
	EVENTSTART
	Source:Done1
	Name:AllAttempted
	SCRIPTSTART
		var feedback = presenter.playerController.getModule('feedback1');
        feedback.change('AllAttempted');
	SCRIPTEND
	EVENTEND
	
	EVENTSTART
	Source:Done1
	Name:Done
	SCRIPTSTART
		var feedback = presenter.playerController.getModule('feedback1');
        feedback.change('Done');
	SCRIPTEND
	EVENTEND

## Events
Done sends events compatible with [Advanced Connector](/doc/page/Advanced-Connector). 

It sends AllAttempted event when the user selects the Done button and all activities on the page have been attempted but the Submit button hasn't been used.

<table border='1'>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Name</td>
        <td>AllAttempted</td>
    </tr>
</table>

It sends NotAllAttempted event when the user clicks on the Done button but NOT all activities on the page have been attempted.

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

It sends Done event when the user clicks on the Done button and all activities on the page have been attempted.

<table border='1'>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Name</td>
        <td>Done</td>
    </tr>
</table>

## CSS Classes

<table border='1'>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
	<tr>
        <td>.done-wrapper</td>
        <td>The outer wrapper of the whole addon.</td>
    </tr>
    <tr>
        <td>.done-container</td>
        <td>The inner container of the whole addon.</td>
    </tr>
    <tr>
        <td>.done-button</td>
        <td>A button element.</td>
    </tr>
    <tr>
        <td>.done-wrapper.disabled</td>
        <td>Added to wrapper when disabled.</td>
    </tr>
</table>

### Default Styling

<pre>
.done-wrapper,
.done-wrapper .done-container,
.done-wrapper .done-container .done-button {
    width: 100%;
    height: 100%;
}

.done-wrapper .done-container .done-button {
    background: url('resources/done-button.png') no-repeat center;
    cursor: pointer;
    text-align: center;
}
</pre>

## Demo presentation
[Demo presentation](/embed/6238534109233152 "Demo presentation") contains examples of to use this addon.       