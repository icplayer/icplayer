## Description

A Board Game addon enables you to create a simple game with moveable elements and defined fields. When the game includes fields, they are only places on the board where a user can drop the elements.

##Properties

<table border='1'>
<tbody>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Is visible</td>
        <td>Enables hiding or showing the module.</td>
    </tr>
    <tr>
        <td>Background</td>
        <td>Here you add the background image.</td>
    </tr>
<tr>
        <td>has Fields</td>
        <td>If marked, it means that the addon includes fields.</td>
    </tr>
    <tr>
        <td>Fields</td>
        <td>This property allows you to define the fields. It contains a definition of each field, like: position (top and left), CSS class for field and dimensions (height and width).</td>
    </tr>
    <tr>
        <td>Elements</td>
        <td>This property allows you to define the elements. It contains a definition of each field, like: an image inside the element, position (top and left) and dimensions (height and width).</td>
    </tr>
    <tr>
        <td>Is disabled</td>
        <td>Allows disabling the module so that it won't be possible to drag any element.</td>
    </tr>
	<tr>
        <td>Game mode</td>
        <td>There are avaibale two game modes: "Free", where the player can move an element by him or herself or "Game" mode, where a board element can be moved by a command or "Dice" addon. Clicking on the board element will select this element.</td>
    </tr>
</tbody>
</table>

##Supported commands

<table border='1'>
<tbody>
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
        <td>enable</td>
        <td>---</td>
        <td>Enables the addon</td>
    </tr>
    <tr>
        <td>disable</td>
        <td>---</td>
        <td>Disables the addon.</td>
    </tr>
	<tr>
        <td>reset</td>
        <td>---</td>
        <td>Resets the addon.</td>
	</tr>
	<tr>
        <td>move</td>
        <td>distance</td>
        <td>Move the currently selected counter by a provided distance.</td>
	</tr>
	<tr>
		<td>undo</td>
		<td>---</td>
		<td>Undo the last move. Only one move can be undone.</td>
	</tr>
</tbody>
</table>

## Events
The Board Game addon sends ValueChanged type events to Event Bus only in a situation when a user drops the element inside the defined field.

<table border='1'>
<tbody>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
	<tr>
		<td>Source</td>
		<td>module ID</td>
	</tr>
		<td>Item</td>
		<td>field + index</td>
	</tr>
	<tr>
		<td>Value</td>
		<td>element + index</td>
	</tr>
	<tr>
		<td>Score</td>
		<td>N/A</td>
	</tr>
</tbody>
</table>

In "Game" mode, Board Game addon sends ValueChanged event if the element was moved.
<table border='1'>
<tbody>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
	<tr>
		<td>Source</td>
		<td>module ID</td>
	</tr>
		<td>Item</td>
		<td>Counter index</td>
	</tr>
	<tr>
		<td>Value</td>
		<td>Field index</td>
	</tr>
	<tr>
		<td>Score</td>
		<td>N/A</td>
	</tr>
</tbody>
</table>


## Scoring

N/A

## CSS classes

<table border='1'>
<tbody>
    <tr>
        <th>Class name</th>
        <th>Description</th>
    </tr>
    <tr>
        <tr>
            <td>.board-game-container</td>
            <td>DIV containing the elements and fields.</td>
        </tr>
        <tr>
            <td>.disabled</td>
            <td>An additional class for a disabled addon.</td>
        </tr>
		<tr>
            <td>.board-game-element</td>
            <td>DIV element which can be moved on the board.</td>
        </tr>
		<tr>
            <td>.board-game-field</td>
            <td>DIV element in which the elements can be dropped.</td>
        </tr>
		<tr>
			<td>.board-game-selected</td>
			<td>Currently selected board element.</td>
		</tr>
		<tr>
			<td>.game</td>
			<td>If the addon is in the game mode, then each board element will receive this class.</td>
		</tr>
    </tr>
</tbody>
</table>


## Demo presentation
[Demo presentation](/embed/5252612606132224 "Demo presentation") contains examples of how to use the Board Game Addon.

                                                             