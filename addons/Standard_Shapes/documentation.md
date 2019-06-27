## Description
Standard Shapes addon allows you to embed basic shapes into a presentation, including squares, rectangles, or cicrles.

## Properties

<table border='1'>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Shape</td>
        <td>Which one of predefined shapes should be displayed. The choice is between: Line, Square, Rectangle, Circle and Ellipse</td>
    </tr>
    <tr>
        <td>Line ending</td>
        <td>Applies only to Line. Shape of line arrowhead. The choice is between: None (default), Arrows (arrows on each side), Circles (oval ending on each side), None - Arrow (arrow on right side), None - Circle (oval on right side) and Circle - Arrow</td>
    </tr>
    <tr>
        <td>Rotation angle</td>
        <td>Angle (counted in degrees) of shape rotation. Angle should be between 0 and 360 degrees</td>
    </tr>
    <tr>
        <td>Stroke width</td>
        <td>Width of brush which draws shape</td>
    </tr>
    <tr>
        <td>Stroke color</td>
        <td>Color of brush which draws shape. Specified in '#RRGGBB' notation</td>
    </tr>
    <tr>
        <td>Stroke opacity</td>
        <td>Opacity of brush which draws shape. Be aware of anti-aliasing effect! Opacity value should between 0 (transparent) and 1 (default)</td>
    </tr>
    <tr>
        <td>Fill color</td>
        <td>Color of shape filling. Specified in '#RRGGBB' notation</td>
    </tr>
    <tr>
        <td>Corners rounding</td>
        <td>With this option selected displated shape will have rounded corners (applies to Line, Square and Rectangle)</td>
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
        <td>standardshapes-wrapper</td>
        <td>DIV surrounding the shape element. Shape itself is a svg tag, which in this case is a direct child of this element</td>
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
        <td>Those error messages suggest that Rotation angle property wasn't set correctly</td>
    </tr>
    <tr>
        <td>Stroke width must be a positive number,<br/>
            Stroke width is not a number!
        </td>
        <td>Those error messages suggest that Stroke width property wasn't set correctly</td>
    </tr>
    <tr>
        <td>Stroke color must be in RGB format (hexadecimal) and start with #</td>
        <td>Those error messages suggest that Stroke color property was set in wrong notation</td>
    </tr>
    <tr>
        <td>Stroke color must be in RGB format (hexadecimal) and start with #</td>
        <td>Those error messages suggests that Fill color property was set in wrong notation</td>
    </tr>
    <tr>
        <td>Stroke opacity must be a positive number between 0 and 1,<br/>
            Stroke opacity is not a number!
        </td>
        <td>Those error messages suggest that Stroke opacity property wasn't set correctly</td>
    </tr>
</table>

## Demo presentation
[Demo presentation](/embed/2834004 "Demo presentation") contains examples of how to use Standard Shapes Addon.            