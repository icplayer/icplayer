## Description

Next module works in a way similar to Next Page button allowing to move on to the next page, however, it first checks whether all activities on a current page have been attempted and the Submit button has been used.

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
In Advanced Connector you can react to events that are sent by Next addon:

    EVENTSTART
    Source:Next1
	Name:NotAllAttempted
    SCRIPTSTART
        var feedback = presenter.playerController.getModule('feedback1');
        feedback.change('NotAllAttempted');
    SCRIPTEND
    EVENTEND
	
	EVENTSTART
	Source:Next
	Name:AllAttempted
	SCRIPTSTART
		var feedback = presenter.playerController.getModule('feedback1');
        feedback.change('AllAttempted');
	SCRIPTEND
	EVENTEND

## Events
Next sends events compatible with [Advanced Connector](/doc/page/Advanced-Connector). 

It sends AllAttempted event when the user selects the Next button and all activities on the page have been attempted but the Submit button hasn't been used.

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

It sends NotAllAttempted event when the user chooses the Next button but NOT all activities on the page have been attempted.

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

## CSS Classes

<table border='1'>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
	<tr>
        <td>.next-wrapper</td>
        <td>The outer wrapper of the whole addon</td>
    </tr>
    <tr>
        <td>.next-container</td>
        <td>The inner container of the whole addon</td>
    </tr>
    <tr>
        <td>.next-button</td>
        <td>Button element</td>
    </tr>
	<tr>
        <td>.next-wrapper.disabled</td>
        <td>The outer wrapper when the addon is in disable state</td>
    </tr>
</table>

### Default Styling

<pre>
.next-wrapper,
.next-wrapper .next-container,
.next-wrapper .next-container .next-button {
    width: 100%;
    height: 100%;
}

.next-wrapper .next-container .next-button {
    background: url('resources/next-button.png') no-repeat center;
    cursor: pointer;
    text-align: center;
}

.next-wrapper.disabled .next-container .next-button {
    cursor: not-allowed;
    background: url('resources/next-button-disabled.png') no-repeat center;
}
</pre>

## Demo presentation
[Demo presentation](/embed/5044264765489152 "Demo presentation") contains examples of how to use this addon.              