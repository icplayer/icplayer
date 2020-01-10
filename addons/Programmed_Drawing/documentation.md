## Description
The Programmed Drawing addon allows drawing by commands provided by the module.

Squares are counted from the left down corner (starting from 1).
## Properties

<table border='true'>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Rows</td>
        <td>Number of rows.</td>
    </tr>
    <tr>
        <td>Columns</td>
        <td>Number of columns</td>
    </tr>
    <tr>
        <td>Color</td>
        <td>Color of drawing (default is black).</td>
    </tr>
    <tr>
        <td>Initial design</td>
        <td>Coordinates of squares to be colored on start. Each coordinate (x y) in new line.</td>
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
        <td>colorSquare</td>
        <td>x, y</td>
        <td>Colors a square in given coordinates.</td>
    </tr>
    <tr>
        <td>resetSquare</td>
        <td>x, y</td>
        <td>Resets a square in given coordinates.</td>
    </tr>
    <tr>
        <td>reset</td>
        <td>---</td>
        <td>Resets the module.</td>
    </tr>
</table>

## CSS classes

<table border='1'>
    <tr>
        <th>Class name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>cellGridWrapper</td>
        <td>Main DIV element surrounding all grid cells.</td>
    </tr>
    <tr>
        <td>cell-element</td>
        <td>Grid element</td>
    </tr>
    <tr>
        <td>cell-element-wrapper</td>
        <td>Grid element surrounding the element allowing to create border for elements.</td>
    </tr>
</table>

## Demo presentation
[Demo presentation](/embed/5323888655859712 "Demo presentation") contains examples of how the Programmed Drawing Addon can be used.     