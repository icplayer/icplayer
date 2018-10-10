## Description
Line addon allows you to embed lines in a presentation. 

## Properties

<table border='1'>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    
    <tr>
        <td>Rotation angle</td>
        <td>The angle (counted in degrees) of line rotation. The angle should be between 0 and 360 degrees</td>
    </tr>
    <tr>
        <td>Line width</td>
        <td>The width of brush which is used to draws the line</td>
    </tr>
    <tr>
        <td>Line color</td>
        <td>The color of brush which is used to draw the line; specified in '#RRGGBB' notation</td>
    </tr>
    <tr>
        <td>Line opacity</td>
        <td>The opacity of brush which is used to draw the line. Be aware of anti-aliasing effect! The opacity value should be between 0 (transparent) and 1 (default)</td>
    </tr>
<tr>
        <td>Right line ending, Left line ending</td>
        <td>The shape of line arrowhead. The choice is between: None (default), Round (rounded ending), Circle (oval ending), Square (square on the line end)</td>
    </tr>
</table>

## Supported commands

<table border='true'>
    <tr>
        <th>Command name</th>
        <th>Params</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>show</td>
        <td>---</td>
        <td>Shows the module</td>
    </tr>
    <tr>
        <td>hide</td>
        <td>---</td>
        <td>Hides the module</td>
    </tr>
</table>


## CSS classes

<table border='1'>
    <tr>
        <th>Class name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>line-wrapper</td>
        <td>DIV surrounding the line element. The line itself is a svg tag, which in this case is a direct child of this element</td>
    </tr>
</table>

## Possible errors

<table border='1'>
    <tr>
        <th>Error message</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Rotation angle must be between 0 and 360 degrees!,<br/>
            Rotation angle is not a number!
        </td>
        <td>These error messages suggest that Rotation angle property wasn't set correctly</td>
    </tr>
    <tr>
        <td>Line width must be a positive number,<br/>
            Line width is not a number!
        </td>
        <td>These error messages suggest that Line width property wasn't set correctly</td>
    </tr>
    <tr>
        <td>Line color must be in RGB format (hexadecimal) and start with #</td>
        <td>These error messages suggest that Line color property was set in a  wrong notation</td>
    </tr>
    <tr>
        <td>Line opacity must be a positive number between 0 and 1,<br/>
            Line opacity is not a number!
        </td>
        <td>These error messages suggest that Line opacity property wasn't set correctly</td>
    </tr>
</table>

## Demo presentation
[Demo presentation](/embed/6079850412507136 "Demo presentation") contains examples of how to use Line Addon.                