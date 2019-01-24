## Description

Limited Submit works in the same way as the Submit button but gives the possibility of selecting specific addons to work with it.

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
    <tr>
        <td>Works with</td>
        <td>List of addons to be checked by Limited Submit separated by new lines.</td>
    </tr>
    <tr>
        <td>Speech texts</td>
        <td><table border='1'>
            <tr>
                <th>Property name</th>
                <th>Description</th>
            </tr>
            <tr>
                <td>Selected</td>
                <td>Text to be read when the button is selected, when the selection is over the button.</td>
            </tr>
            <tr>
                <td>The exercise edition is blocked</td>
                <td>Text to be read when the button changed its state to 'selected'.</td>
            </tr>
            <tr>
                <td>The exercise is not blocked</td>
                <td>Text to be read when the button changed its state to 'deselected'.</td>
            </tr>
            <tr>
                <td>Not attempted</td>
                <td>Text to be read when one addon was not 'attempted'</td>
            </tr>
        </table></td>
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
    <tr>
        <td>getWorksWithModulesList</td>
        <td>---</td>
        <td>Gets list of modules configuerd in "Works With" property.
    </tr>
</table>


## Events
Limited Submit sends events compatible with [Advanced Connector](/doc/page/Advanced-Connector) module. 

It sends <b>ValueChanged</b> event when a user selects the button.

<table border='1'>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Value</td>
        <td>
            <b>selected</b> - it is sent when all modules were attempted and the button changed its state to 'selected' by a user's click.<br />
            <b>deselected</b> - it is sent when the button changed its state to 'deselected' by a user's click.<br />
            <b>canceled</b> - it is sent when not all modules were attempted.
        </td>
    </tr>
    <tr>
        <td>Source</td>
        <td>Module ID of Limited Submit module</td>
    </tr>
</table>


## CSS Classes

<table border='1'>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
	<tr>
        <td>.limited-submit-wrapper</td>
        <td>The outer wrapper of the whole addon</td>
    </tr>
    <tr>
        <td>.limited-submit-container</td>
        <td>The inner container of the whole addon</td>
    </tr>
    <tr>
        <td>.limited-submit-button</td>
        <td>A button's element</td>
    </tr>
    <tr>
        <td>.limited-submit-wrapper.selected</td>
        <td>The outer wrapper when the addon has been clicked</td>
    </tr>
</table>

### Default Styling

<pre>
.limited-submit-wrapper,
.limited-submit-wrapper .limited-submit-container,
.limited-submit-wrapper .limited-submit-container .limited-submit-button {
    width: 100%;
    height: 100%;
}

.limited-submit-wrapper .limited-submit-container .limited-submit-button {
    background: url('resources/submit-button.png') no-repeat center;
    cursor: pointer;
    text-align: center;
}
</pre>

## Demo presentation
[Demo presentation](/embed/6082998918971392 "Demo presentation") contains examples of how this addon can be used.                 