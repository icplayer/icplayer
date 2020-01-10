## Description
Lesson Error Counter is a module that enables to display the summed up number of errors of the entire lesson.

## Properties

<table border='1'>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>

    <tr>
        <td>---</td>
        <td>---</td>
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
</table>

## Advanced Connector integration

Each command supported by the Lesson Error Counter module can be used in the Advanced Connector addon's scripts. The below example shows how to show or hide the addon accordingly to the Double State Button module's state.

    EVENTSTART
    Source:DoubleStateButton1
    Value:1
    SCRIPTSTART
		var module = presenter.playerController.getModule('Lesson_Error_Counter_1');
        module.show();
	SCRIPTEND
    EVENTEND
    
	EVENTSTART
    Source:DoubleStateButton1
    Value:0
    SCRIPTSTART
		var module = presenter.playerController.getModule('Lesson_Error_Counter_1');
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
        <td>---</td>
        <td>---</td>
    </tr>
</table>

Lesson Error Counter module doesn't expose any CSS classes because its internal structure is only a text.


## Example
    .addon_Lesson_Error_Counter {
		text-align: center;
		border-radius: 5px;
		border: 2px solid black;
		color: red;
	}


The above example shows default module styling.  