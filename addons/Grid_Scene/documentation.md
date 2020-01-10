## Description
Grid Scene allows marking squares on grid by Programming Command Prompt, Blockly Code Editor or javascript code.

## Properties

<table border='1'>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Rows</td>
        <td>Rows in the grid scene. Maximum 40 rows.</td>
    </tr>
    <tr>
        <td>Columns</td>
        <td>Columns in the grid scene. Maximum 40 columns.</td>
    </tr>
    <tr>
        <td>Default Color</td>
        <td>The first selected color. An empty value is equal to black.</td>
    </tr>
    <tr>
        <td>Delay</td>
        <td>A delay between called commands in the grid scene. An empty value is equal to zero. The delay is in ms.</td>
    </tr>
    <tr>
        <td>Default Commands</td>
        <td>
			<table border='1'>
				<tr>
					<th>Property name</th>
					<th>Description</th>
				</tr>
				<tr>
					<td>Command Alias</td>
					<td>Command translation. The old command name will be replaced by an alias. Old command name is not available in the code executed by the scene code. </td>
				</tr>
				<tr>
					<td>Argument Aliases</td>
					<td>Argument translations. Old arguments' aliases will be replaced by aliases. getCommands and getDefaultCommands will be displayed as argument aliases.</td>
				</tr>	
				<tr>
					<td>Is Disabled</td>
					<td>Disable command.</td>
				</tr>					
		</table>		
		</td>
    </tr>
    <tr>
        <td>Custom Command</td>
        <td>New commands' definitions list.</br>
			<table border='1'>
				<tr>
					<th>Property name</th>
					<th>Description</th>
				</tr>
				<tr>
					<td>Name</td>
					<td>Custom command name. </td>
				</tr>
				<tr>
					<td>Arguments</td>
					<td>Arguments separated by comma passed to custom command.</td>
				</tr>	
				<tr>
					<td>Code</td>
					<td>The code executed by custom command. Custom command should be called by name. In the code there are arguments available by names.</td>
				</tr>		
				<tr>
					<td>Is Disabled</td>
					<td>Disable command.</td>
				</tr>					
		</table>		
</td>
    </tr>
    <tr>
        <td>Custom Commands JSON Object</td>
		<td>New commands definitions in JSON. Commands should be called by command_name.
		
** Definiton example **

	{
		"first_command" : {
			"command_arguments" : "x,y",
			"is_disabled" : false,
			"command_code" : "mark(x,y);",
			"command_name" : "first"
		},
		"second_command" : {
			"command_arguments" : "x,y",
			"is_disabled" : false,
			"command_code" : "clearMark(x,y);",
			"command_name" : "second"
		}
	}
	
</td>
    </tr>
    <tr>
        <td>Answer</td>
        <td>Addon answer. Answer must be written in JS code.</td>
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
        <td>Shows the addon.</td>
    </tr>
    <tr>
        <td>hide</td>
        <td>---</td>
        <td>Hides the addon.</td>
    </tr>
    <tr>
        <td>mark</td>
        <td>x, y</td>
        <td>Mark cell in grid.</td>
    </tr>	
	<tr>
        <td>drawLeft</td>
        <td>steps</td>
        <td>Draw left from actual cursor position.</td>
    </tr>
	<tr>
        <td>drawRight</td>
        <td>steps</td>
        <td>Draw right from the actual cursor position.</td>
    </tr>
	<tr>
        <td>drawDown</td>
        <td>steps</td>
        <td>Draw down from the actual cursor position.</td>
    </tr>
	<tr>
        <td>drawUp</td>
        <td>steps</td>
        <td>Draw up from the actual cursor position.</td>
    </tr>
	<tr>
        <td>drawLeftFrom</td>
        <td>x, y, steps</td>
        <td>Draw left from [x,y] position.</td>
    </tr>
	<tr>
        <td>drawRightFrom</td>
        <td>x, y, steps</td>
        <td>Draw right from [x,y] position.</td>
    </tr>
	<tr>
        <td>drawDownFrom</td>
        <td>x, y, steps</td>
        <td>Draw down from [x,y] position.</td>
    </tr>
	<tr>
        <td>drawUpFrom</td>
        <td>x, y, steps</td>
        <td>Draw up from [x,y] position.</td>
    </tr>
	<tr>
        <td>setCursor</td>
        <td>x, y</td>
        <td>Set curson in [x,y] position.</td>
    </tr>
	<tr>
        <td>setColor</td>
        <td>colorName</td>
        <td>Set color by name.</td>
    </tr>
	<tr>
        <td>clearMark</td>
        <td>x, y</td>
        <td>Clear mark in [x,y] position.</td>
    </tr>
	<tr>
        <td>clear</td>
        <td>---</td>
        <td>Clear all marks in the grid scene and set cursor to start position.</td>
    </tr>
	<tr>
        <td>reset</td>
        <td>---</td>
        <td>Clear all marks in the grid scene and set cursor to start position.</td>
    </tr>
	<tr>
        <td>executeCode</td>
        <td>code</td>
        <td>Execute code from string. The executed code will be delayed by the value from the Delay property.</td>
    </tr>
	<tr>
        <td>getDefaultCommands</td>
        <td>withParams</td>
        <td>Get default commands from the scene. If withParams is false, the addon retursn commands without params.</td>
    </tr>
	<tr>
        <td>getCustomCommands</td>
        <td>withParams</td>
        <td>Get custom commands from the scene. If withParams is false, the addon returns commands without params.</td>
    </tr>
	<tr>
        <td>getCommands</td>
        <td>withParamstd</td>
        <td>Get all commands from the scene. If withParams is false, the addon returns commands without params.</td>
    </tr>
</table>

## Events
The Grid Scene addon sends the event when the state has been updated.
<table border='1'>
<tbody>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <tr>
            <td>Item</td>
            <td>N/A</td>
        </tr>
        <tr>
            <td>Value</td>
            <td>N/A</td>
        </tr>
        <tr>
            <td>Score</td>
            <td>N/A</td>
        </tr>
    </tr>
</tbody>
</table>

The Grid Scene addon sends the event when the drawing commands are called.
<table border='1'>
<tbody>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <tr>
            <td>Item</td>
            <td>Name of the command</td>
        </tr>
        <tr>
            <td>Value</td>
            <td>Coordinates of the point and number of steps</td>
        </tr>
        <tr>
            <td>Score</td>
            <td>N/A</td>
        </tr>
    </tr>
</tbody>
</table>

## CSS classes

<table border='1'>
    <tr>
        <th>Class name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>grid-scene-cell</td>
        <td>Main DIV element surrounding all grid cells.</td>
    </tr>
    <tr>
        <td>grid-scene-cell-element</td>
        <td>Grid element</td>
    </tr>
    <tr>
        <td>grid-scene-cell-element-wrapper</td>
        <td>Grid element surrounding the element allowing to create the border for elements.</td>
    </tr>
	<tr>
		<td>grid-scene-correct</td>
		<td>Correct selected grid element</td>
	</tr>
	<tr>
		<td>grid-scene-wrong</td>
		<td>Wrong selected grid element</td>
	</tr>
</table>

## Demo presentation

[Demo presentation](/embed/5327260697755648 "Demo presentation") contains examples showing how this addon can be used.                       