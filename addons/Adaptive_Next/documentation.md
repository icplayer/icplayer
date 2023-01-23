## Description
Adaptive navigation button is an addon for navigating through adaptive lessons.

## Properties

<table border='1'>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Direction</td>
        <td>
            <ul>
            <li><b>Previous</b> &ndash; Navigate to the previous lesson.</li>
            <li><b>Next</b> &ndash; Navigate to the next lesson.</li>
            </ul>
        </td>
    </tr>
    <tr>
        <td>Is disabled</td>
        <td>Allows disabling the addon so that it won't be able to interact.</td>
    </tr>
    <tr>
        <td>Image</td>
        <td>Image will be displayed as button icon. If the value is empty, a default image will be displayed based on the button type.</td>
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
        <td>enable</td>
        <td>---</td>
        <td>Enables the addon and removes the .disabled style class for the entire addon.</td> 
    </tr>
    <tr>
        <td>disable</td>
        <td>---</td>
        <td>Disables the addon and adds the .disabled style class for the entire addon.</td> 
    </tr>
</table>

## CSS classes

<table border='1'>
<tbody>
    <tr>
        <th>Class name</th>
        <th>Description</th> 
    </tr>
    <tr>
        <td>adaptive-next-wrapper</td>
        <td>DIV wrapping the Addon's elements.</td> 
    </tr>
</tbody>
</table>
