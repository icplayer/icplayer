## Description
Drawing addon allows users to draw images on the digital canvas. It is possible to define the line thickness and color in the editor.

## Properties

<table border='1'>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Color</td>
        <td>Color of pencil specified in '#RRGGBB' notation or by name e.g. 'pink'</td>
    </tr>
    <tr>
        <td>Thickness</td>
        <td>Width of pencil. Number between 1 and 40.</td>
    </tr>
    <tr>
        <td>Border</td>
        <td>Border size. Number between 0 (no border) and 5 (5px black border)</td>
    </tr>
    <tr>
        <td>Opacity</td>
        <td>Opacity for the whole addon. Number between 0 - 1</td>
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
        <td>hide</td>
        <td>---</td>
        <td>Hide the addon.</td>
    </tr>
    <tr>
        <td>show</td>
        <td>---</td>
        <td>Show the addon.</td>
    </tr>
</table>

## CSS classes

<table border='1'>
    <tr>
        <th>Class name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>drawing</td>
        <td>Main class containing the entire Addon's content.</td>
    </tr>
</table>

## Advanced Connector integration
Each command supported by the Drawing addon can be used in the Advanced Connector addon's scripts. The below example shows how to change color (to green) and thickness (to 13) when the image source is selected and Text module's gap content changes.

        EVENTSTART
        Name:ItemSelected
        Item:green
        SCRIPTSTART
        var drawing = presenter.playerController.getModule('Drawing1');
        drawing.setColor('green');
        SCRIPTEND
        EVENTEND

        EVENTSTART
        Source:Text1
        Item:1
        Value:^medium$
        SCRIPTSTART
        var drawing = presenter.playerController.getModule('Drawing1');
        drawing.setThickness(13);
        SCRIPTEND
        EVENTEND

To turn on eraser, you have to use function:

        drawing.setEraserOn();

To set eraser's Thickness, use function:

        drawing.setEraserThickness(10);

To turn off Eraser, just set pencil color e.g.:

        drawing.setColor('pink');

## Demo presentation
[Demo presentation](/embed/6183083237703680 "Demo presentation") contains examples on how to use the Drawing addon.                               