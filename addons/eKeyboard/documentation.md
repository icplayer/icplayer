## Description

eKeyboard is a virtual keyboard displayed right after clicking on the input/textarea the addon works with.

## Properties

<table border='1'>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Work With</td>
        <td>New line separated IDs of the modules that eKeyboard can work with. It is compatible with Basic Math Gaps and gaps in Table, Writing Calculations, Text and Crossword modules.</td>
    </tr>
    <tr>
        <td>Layout Type</td>
        <td>Type of the eKeyboard layout. You can choose one of the standard layouts: Numeric, QWERTY or Custom which means you can set whatever Layout you like by configuring Custom Layout field.</td>
    </tr>
    <tr>
        <td>Custom Layout</td>
        <td>Buttons should be space separated, group of buttons (rows) should be new line separated. For Action keys: <a href="https://github.com/Mottie/Keyboard/wiki/Layout#wiki-customlayout---object">Mottie Keyboard Wiki</a></td>
    </tr>
    <tr>
        <td>Position My</td>
        <td>Position of the addon relative to input/textarea it works with. Read more: <a href="http://jqueryui.com/position">jQuery UI Position</a></td>
    </tr>
    <tr>
        <td>Position At</td>
        <td>Position of the input/textarea relative to the addon. Read more: <a href="http://jqueryui.com/position">jQuery UI Position</a></td>
    </tr>
	<tr>
        <td>Max Characters</td>
        <td>Maximum number of characters the input/textarea can get before the focus will jump to the next input/textarea.</td>
    </tr>
	<tr>
        <td>Don't Open On Focus</td>
        <td>When this property is selected, the eKeyboard will NOT show up on input focus. You will have to open it manually.</td>
    </tr>
	<tr>
        <td>Lock Standard Keyboard Input</td>
        <td>This option locks inputs from standard keyboard. The user can input only characters available from eKeyboard keyset.</td>
    </tr>
	<tr>
        <td>Custom Display</td>
        <td>This property allows changing text on the button. For example, an equivalent of English word: Caps Lock in German is: Umschalt. It is possible to change the following buttons:
a, accept, alt, bksp, c, cancel, clear, combo, dec, enter, left, next, prev, right, shift, sign, space, t, tab</td>
    </tr>	
	<tr>
		<td>Show Close Button</td>
		<td>When this property is selected, the eKeyboard module will have the button to disable/enable it on this page.</td>
	</tr>
</table>

## Example configuration of Work With property

Basic_Math_Gaps1    
Table1
Text1  

It means that when a user clicks on the input within these addons, the virtual keyboard will show up.

## Example configuration of Custom Layout property

{ 'default' : ['1 2 3', '4 5 6', '7 8 9', '{prev} {accept} {next}'] }

This configuration will display eKeyboard with digits 1–9 in 3 rows and in the last row there will be 3 action keys: previous, accept, next.

## Example configuration of Position My and Position At property

Position My: right center    
Positon At: left center    

It means that the eKeyboard right side will be on the left side of the input/textarea.

## Example configuration of Custom Display property
It is possible to change the button text from e.g. CapsLock to Umschalt. All you need to do is fill in the "Custom Display" property: 
{'shift' : 'Umschalt'}.
You may change more than one button.</br> 
The writing convention is: {'shift' : 'Umschalt', 'prev' : 'früher', 'weiter' : 'next' }

## Supported commands

<table border='1'>
    <tr>
        <th>Command name</th>
        <th>Params</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>open</td>
        <td>moduleId, inputIndex</td>
        <td>Shows the addon.</td>
    </tr>
	<tr>
        <td>disable</td>
        <td>---</td>
        <td>Disable addon on page.</td>
    </tr>
	<tr>
        <td>enable</td>
        <td>---</td>
        <td>Enable addon on page.</td>
    </tr>
</table>

## Advanced Connector integration

This will open eKeyboard module when all answers in True False module are correct. eKeyboard will be next to input with index 1.

<pre>
EVENTSTART
Source:TrueFalse
Item: all
SCRIPTSTART
    var module= presenter.playerController.getModule('eKeyboard1');
    module.open('Text7', 1);
SCRIPTEND
EVENTEND
</pre>

## CSS Classes

<table border='1'>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
	<tr>
        <td>.ui-keyboard-button</td>
        <td>Default button class</td>
    </tr>
    <tr>
        <td>.ui-state-hover</td>
        <td>Button in hovered state</td>
    </tr>
    <tr>
        <td>.ui-keyboard-actionkey</td>
        <td>Special/action button</td>
    </tr>
    <tr>
        <td>.ui-state-default</td>
        <td>Button in default state</td>
    </tr>
    <tr>
        <td>.ui-keyboard</td>
        <td>Whole keyboard container</td>
    </tr>
    <tr>
        <td>.ui-keyboard-keyset</td>
        <td>Container for buttons</td>
    </tr>
    <tr>
        <td>.eKeyboard-close-button</td>
        <td>Container for close button</td>
    </tr>
    <tr>
        <td>.eKeyboard-open-button</td>
        <td>Container for open button</td>
    </tr>
</table>

## Demo presentation
[Demo presentation](/embed/6409622973841408 "Demo presentation") contains examples of how this addon can be used.                     