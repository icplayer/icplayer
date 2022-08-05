## Description

Addon works with the text and table module. Reads the contents of the gap from the text (and table) module it works with and verifies them. In check errors mode, assign the appropriate classes to the gaps in the text and table modules. In show answers mode, inserts the declared values into the gaps from the text and table module.

## Requirements

If the requirements are not fulfilled, the gap binder addon may not work properly with other modules.

### Setting properties of co-working modules

In order for the addon to work properly it is required to:
* for co-working Table addons check the "Is not an activity" property.
* for co-working Text modules uncheck the "Is activity" property.

### Setting the order co-working modules

In the editor, set the order of the gap binder addon so that it is in front of the co-working modules.

## Properties

<table border='1'>
<tbody>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Modules' IDs (Text or Table)</td>
        <td>IDs of Text or Table modules it works with. Each identifier is separated by comma.</td>
    </tr>
    <tr>
        <td>Answers</td>
        <td>Entered consecutive values that are correct answers (each line is one answer).</td>
    </tr>
</tbody>
</table>


## Supported commands
<table border='1'>
<tbody>
    <tr>
        <th>Command name</th>
        <th>Params</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>isOK</td>
        <td>moduleIndex, gapIndex</td>
        <td>Returns true if gap is filled in correctly, otherwise false.</td>
    </tr>
    <tr>
        <td>isAllOK</td>
        <td>---</td>
        <td>Returns true if all gaps are filled in correctly and there are no mistakes, otherwise false.</td>
    </tr>
    <tr>
        <td>isAttempted</td>
        <td>---</td>
        <td>Returns true if any of the gaps have been filled, otherwise false.</td>
    </tr>
</tbody>
</table>

## Events

The module does not block or modify the events sent by the modules specified in the configuration. If a change is made in the co-working module, the event of the co-working module and the event of the gap binder will be sent. The event of the co-working module sends information according to its own unchanged configuration.

### Value Changed event

<table border='1'>
<tbody>
    <tr>
        <th>Event name</th>
        <th>Params</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>ValueChanged</td>
        <td>
            <ul>
                <li>Source - module ID (gap binder)</li>
                <li>Item - gap number (according to the order defined in the gap binder)</li>
                <li>Value - gap content</li>
                <li>Source - "1" if correct, "0" if incorrect</li>
            </ul>
        </td>
        <td>
            Sent by interaction when a user changes state (enters new text, etc.)
        </td>
    </tr>
</tbody>
</table>

### All OK event

<table border='1'>
<tbody>
    <tr>
        <th>Event name</th>
        <th>Params</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>ValueChanged</td>
        <td>
            <ul>
                <li>Source - module ID (gap binder)</li>
                <li>Item - "all"</li>
                <li>Value - empty string ("")</li>
                <li>Source - empty string ("")</li>
            </ul>
        </td>
        <td>
            Sent by interaction when a user changes state and the score of the module is 100%
        </td>
    </tr>
</tbody>
</table>

## CSS Classes

<table border='1'>
    <tr>
        <th>Class name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>.gap_binder_invalid</td>
        <td>Addon's invalid configuration</td>
    </tr>
</table>
