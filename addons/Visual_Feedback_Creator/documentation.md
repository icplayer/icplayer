## Description
Visual Feedback Creator makes it possible to combine multiple addons and modules into fully interactive, responsive exercises. While similar in functionality to the Advanced Connector addon, Visual Feedback Connector provides a user friendly graphic interface, making it much easier to work with for those with no previous experience writing scripts.

## Properties

<table border='1'>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Scripts</td>
        <td>List of scripts to be executed when specified conditions occur</td>
    </tr>
	<tr>
        <td>Is Disabled</td>
        <td>	This property allows to disable the Visual Feedback Creator module so that it doesn't react (evaluate any scripts) when new events hit Event Bus.</td>
    </tr>
</table>

## Scripts

Majority of scripts consist of at least 4 blocks, sequentially connected together.

* Source module block - specifies the module sending the event. In cases where Source Event block is used, this block is ommited.
* Event block - specifies the conditions that the event must meet in order to trigger the action to occur.
* Feedback module block - specifies the module performing the command.
* Action block - specifies the command to be called on the feedback module.

Each Event block can have multiple Feedback module blocks attached to it, and each feedback module can have multiple Action modules attached to it. Actions are performed in order from top to bottom.

An example script is shown below.

<img src='/file/serve/4998794742333440' />

This script will be executed when a correct answer has been selected in the Choice addon with ID "Choice1". Once that happens, modules 'Image1' and 'Video1' will become visible. In addition, 'Video1' will begin playing it's content.

## Supported Addons

Presently, following addons are supported by the Visual Feedback Creator:

* Audio
* Choice
* Connection
* Feedback
* Image
* Ordering
* Text
* True False
* Video

The blocks provided for the supported addons are based on their available commands and events. You will find more information about them in the documentation of each individual addon. Unsupported addons can still be used, thanks to the blocks in the Custom blocks category.

## Module blocks

<table border='1'>
    <tr>
        <th>Block name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Source module</td>
        <td>Specifies the module sending the event
			<table border='1'>
				<tr>
					<th style='width: 7em;'>Field name</th>
					<th>Description</th>
				</tr>
				<tr>
					<td>ID</td>
					<td>module's ID</td>
				</tr>
			</table>
		</td>
    </tr>
	<tr>
        <td>Feeback module</td>
        <td>Specifies which module will perform a specific command once the event is triggered
			<table border='1'>
				<tr>
					<th style='width: 7em;'>Field name</th>
					<th>Description</th>
				</tr>
				<tr>
					<td>ID</td>
					<td>module's ID</td>
				</tr>
			</table>
		</td>
    </tr>
	<tr>
        <td>Source event</td>
        <td>Specifies the event that will, trigger a command, in cases where such event is not being sent by a module. 
			<table border='1'>
				<tr>
					<th>Field name</th>
					<th>Description</th>
				</tr>
				<tr>
					<td>Event</td>
					<td>Dropdown list of supported events: Page Loaded, Reset, Show Answers, Hide Answers, Check, Uncheck</td>
				</tr>
			</table></td>
    </tr>
</table>

## Custom blocks

In cases where a specific addon is not yet supported by the Visual Feedback Creator, or greater control over the triggering event is desired, the user may use custom blocks to still access the functionality they need. 

<table border='1'>
	<tr>
        <th>Block name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Custom action</td>
        <td>Allows the user to call any command available for the feedback module, using the same syntax as the one used by the Advanced Connector.
			<table border='1'>
				<tr>
					<th>Field name</th>
					<th>Description</th>
				</tr>
				<tr>
					<td>Script</td>
					<td>The call to the feedback module's command. For example, while trying to call 'Image1.hide();', this field should contain value 'hide()' </td>
				</tr>
			</table></td>
    </tr>
    <tr>
        <td>Custom event</td>
        <td>Allows for exactly defining any event that is to be triggered. If any of this blocks fields is left empty (with the exception of the field 'Event'), it will not be used.
			<table border='1'>
				<tr>
					<th>Field name</th>
					<th>Description</th>
				</tr>
				<tr>
					<td>Event</td>
					<td>Dropdown list of available event types: Value Changed, Page Loaded, Reset, Show Answers, Hide Answers, Check, Uncheck. </td>
				</tr>
				<tr>
					<td>Item</td>
					<td>'item' field value of event data</td>
				</tr>
				<tr>
					<td>Value</td>
					<td>'value' field value of event data</td>
				</tr>
				<tr>
					<td>Score</td>
					<td>'score' field value of event data</td>
				</tr>
				<tr>
					<td>Type</td>
					<td>'type' field value of event data</td>
				</tr>
				<tr>
					<td>Word</td>
					<td>'word' field value of event data</td>
				</tr>
			</table>
		</td>
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
        <td>---</td>
        <td>---</td>
        <td>---</td>
    </tr>
</table>


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