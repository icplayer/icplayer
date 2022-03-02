## Description
Single State Button allows users to perform different actions in presentations, such as changing other addons' states when the button is clicked.

## Properties

<table border='1'>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Title</td>
        <td>Title displayed inside the addon</td>
    </tr>
    <tr>
        <td>Image</td>
        <td>Image displayed inside the addon.
<p><em>This property allows online resources. <a href="/doc/page/Online-resources">Find out more »</a></em></p>
</td>
    </tr>
    <tr>
        <td>onClick</td>
        <td>Event which will be triggered when a user presses the button</td>
    </tr>
    <tr>
        <td>Disable</td>
        <td>Disable button. No events will be triggered when selected.</td>
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
        <td>Shows the addon</td>
    </tr>
    <tr>
        <td>hide</td>
        <td>---</td>
        <td>Hides the addon</td>
    </tr>
    <tr>
        <td>enable</td>
        <td>---</td>
        <td>Changing state to enable</td>
    </tr>
    <tr>
        <td>disable</td>
        <td>---</td>
        <td>Changing state to disable</td>
    </tr>
</table>

## Events
Single State Button addon sends ValueChanged type events to Event Bus when either user selects it.

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
            <td>Always '1'</td>
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
        <td>singlestate-button-wrapper</td>
        <td>DIV surrounding the button element. Button element is a direct child of this element</td>
    </tr>
    <tr>
        <td>singlestate-button-element</td>
        <td>Element's base class</td>
    </tr>
    <tr>
        <td>doublestate-button-image</td>
        <td>Class for image (IMG) element</td>
    </tr>
    <tr>
        <td>doublestate-button-title</td>
        <td>Class for text (SPAN) element</td>
    </tr>
    <tr>
        <td>disable</td>
        <td>Additional class for singlestate-button-element when the button is disabled.</td>
    </tr>
</table>

## Demo presentation
[Demo presentation](/embed/2486886 "Demo presentation") contains examples of how to use the Single State Button addon.

[Demo disable property](/embed/2803004 "Demo disable property") contains examples of the disable property.        