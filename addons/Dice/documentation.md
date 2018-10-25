## Description
Dice addon allows getting a random value by dice rolling.

## Properties

<table border='1'>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Is disabled</td>
        <td>Allows disabling the dice rolling (currently works only with the Board Game addon).</td>
    </tr>
    <tr>
        <td>Elements list</td>
        <td>List of possible results
<table border='1'>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
	<tr>
		<td>Name</td>
		<td>A text which will be visible in Dice addon.</td>
	</tr>
	<tr>
		<td>Image</td>
		<td>An image visible in Dice addon</td>
	</tr>
</table>		
</td>
    </tr>
    <tr>
        <td>Animation length</td>
        <td>Animation length of the dice rolling</td>
    </tr>
    <tr>
        <td>Initial item</td>
        <td>The first dice item from the "Elements" list property. The "Elements" list is counted from 1.</td>
    </tr>
    <tr>
        <td>Works with</td>
        <td>An ID of the addon which automatically supports Dice addon.</td>
    </tr>
</table>

## Events
The Dice Addon sends the ValueChanged type event when the user starts dice rolling.

<table border='1'>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>value</td>
        <td>start</td>
    </tr>
</table>

If dice rolling has been ended, the Dice addon sends the ValueChanged type event with the element name if provided, otherwise the element index.
<table border='1'>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>value</td>
        <td>an element name or element index if the name is not provided.</td>
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
        <td>disable</td>
        <td>---</td>
        <td>Disables the addon.</td>
    </tr>
        <td>enable</td>
        <td>---</td>
        <td>Enables the addon.</td>
    </tr>
	    <tr>
        <td>roll</td>
        <td>---</td>
        <td>Dice rolling</td>
    </tr>
</table>

## CSS classes

<table border='1'>
    <tr>
        <th>Class name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>.loading</td>
        <td>DIV which is visible when addon images are loading.</td>
    </tr>
    <tr>
        <td>.addon-Dice-dice-container</td>
        <td>DIV container for images.</td>
    </tr>
    <tr>
        <td>.dice-element-visible</td>
        <td>This image is actually visible</td>
    </tr>
    <tr>
        <td>.addon-Dice-image-element</td>
        <td>DIV which contains a background image.</td>
    </tr>
	<tr>
        <td>.isRolling</td>
        <td>Image class when the addon is rolling.</td>
    </tr>
	<tr>
        <td>.disabled</td>
        <td>Wrapper class when the addon is disabled.</td>
    </tr>
</table>
 
## Demo presentation

[Demo presentation](/embed/4603461487034368 "Demo presentation") contains examples showing how this addon can be used.          