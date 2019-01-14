## Description
Completion Progress is a module that enables to insert a ready-made progress bar indicating the percentage of attempted activity modules on a current page.

## Properties

<table border='1'>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>

    <tr>
        <td>Turn off automatic counting</td>
        <td>When this property is selected, module doesn't react on changes in activity modules</td>
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
        <td>Hides the module</td>
    </tr>
    <tr>
        <td>show</td>
        <td>---</td>
        <td>Shows the module</td>
    </tr>
	<tr>
        <td>getProgress</td>
        <td>---</td>
        <td>Returns current completion progress as integer in &lt;0;100&gt; range</td>
    </tr>
    <tr>
        <td>setProgress</td>
        <td>progress</td>
        <td>Sets current completion progress. Argument should be an integer in &lt;0;100&gt; range</td>
    </tr>
</table>

## Advanced Connector integration
Each command supported by the Completion Progress module can be used in the Advanced Connector addon's scripts. The below example shows how to show or hide the addon accordingly to the Double State Button module's state.

    EVENTSTART
    Source:DoubleStateButton1
    Value:1
    SCRIPTSTART
		var module = presenter.playerController.getModule('Completion_Progress1');
        module.show();
	SCRIPTEND
    EVENTEND
    
	EVENTSTART
    Source:DoubleStateButton1
    Value:0
    SCRIPTSTART
		var module = presenter.playerController.getModule('Completion_Progress1');
        module.hide();
	SCRIPTEND
    EVENTEND

## CSS classes

<table border='1'>
    <tr>
        <th>Class name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>progress-bar</td>
        <td>DIV element that indicates the look of the internal bar, which increases proportionally to the user's progress</td>
    </tr>
    <tr>
        <td>progress-text</td>
        <td>DIV element that indicates the look of the inner text (current progress)</td>
    </tr>
</table>

## Example
    .addon_Completion_Progress {
		padding: 2px;
		width: 130px;
		height: 25px;
		border-radius: 5px;
		border: 2px solid black;
	}

	.addon_Completion_Progress .progress-bar {
		background-color: #FA8805;
		border-radius: 5px;
		height: 100%;
	}

	.addon_Completion_Progress .progress-text {
		color: #000000;
		font-size: 18px;
		position: absolute;
		width: 10%;
		left: 45%;
		height: 50%;
		top: 25%;
		text-align: center;
	}


The above example shows default module styling.

## Demo presentation
[Demo presentation](/embed/6145775199322112 "Demo presentation") contains examples on how to use the Completion Progress module.                               