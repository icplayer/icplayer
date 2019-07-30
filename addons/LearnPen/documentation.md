## Description
LearnPen Drawing addon allows users to draw images on a digital canvas using LearnPen. It is possible to define the line thickness, color and opacity in the editor.

## Properties

<table border='1'>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>LearnPen</td>
        <td>When this option is selected, registering from squeeze and pressure sensors are on.</td>
    </tr>
    <tr>
        <td>Colors</td>
        <td>If LearnPen is on, color is specified by function (more information below), otherwise the color of pencil is specified in '#RRGGBB' notation or by name, e.g. "pink"</td>
    </tr>
    <tr>
        <td>Thickness</td>
        <td>If LearnPen is on, thickness is specified by function (more information below), otherwise the width of pencil is defined by a number between 1 and 40.</td>
    </tr>
    <tr>
        <td>Opacity</td>
        <td>If LearnPen is on, opacity is specified by function (more information below), otherwise it's a number between 0 and 1.</td>
    </tr>
    <tr>
        <td>Squeeze limits</td>
        <td>Property which defines the squeezes' range. Two numbers (value <strong>from</strong> and <strong>to</strong> in percentage) separated with a semicolon, e.g. "54;69".</td>
    </tr>
    <tr>
        <td>Squeeze limits interpretation</td>
        <td>Defines how Squeeze limits property should be interpreted.</td>
    </tr>
    <tr>
        <td>Pressure limits</td>
        <td>Property which defines the pressure's range. Two numbers (value <strong>from</strong> and <strong>to</strong> in percentage) separated with a semicolon, e.g. "34;90".</td>
    </tr>
    <tr>
        <td>Events</td>
        <td>In this property, you can define custom events and decide whether they are to be sent. Every event has 5 properties:
                <ul>
                        <li>Sensor - the list is below,</li>
                        <li>Reaction scope - defines the range of reaction. Two numbers separated with a semicolon, e.g. "78;82",</li>
                        <li>Item - Item field in the event,</li>
                        <li>Value - Value field in the event,</li>
                        <li>Score - Score field in the event,</li>
                </ul>
        </td>
    </tr>
    <tr>
        <td>Mirror</td>
        <td>When this option is selected, every point and line will be reflected to the other side of a digital canvas.</td>
    </tr>
    <tr>
        <td>Background color</td>
        <td>Background color</td>
    </tr>
</table>

## Sensors list

<ul>
<li>SQUEEZE_A</li>
<li>SQUEEZE_B</li>
<li>SQUEEZE_C</li>
<li>SQUEEZE_SUM</li>
<li>SQUEEZE_MAX</li>
<li>PRESSURE</li>
<li>ALL</li>
</ul>

## Function as an argument

If LearnPen is on, the properties: Colors, Thickness and Opacity are specified by function. In the first line, type one element from the Sensors list (above). In next lines, use proper values (depending on property) and a number between 1 and 100. Samples:

Property Colors:

        SQUEEZE_C
        33% red
        66% green
        100% blue

Now the color depends on the sensor squeeze C: <0%,33%> red, <34%,66%> green, <67%,100%> blue.

Property Thickness:

        PRESSURE
        50% 15
        100% 25

Property Opacity:

        ALL
        100% 1

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
    <tr>
        <td>setColor</td>
        <td>color name or RGB</td>
        <td>Change color and switch from eraser to pencil.</td>
    </tr>
    <tr>
        <td>setThickness</td>
        <td>number between 1 and 40</td>
        <td>Change thickness.</td>
    </tr>
    <tr>
        <td>setEraserOn</td>
        <td>---</td>
        <td>Switch from pencil to eraser.</td>
    </tr>
</table>

## Advanced Connector integration
Each command supported by the LearnPen Drawing addon can be used in the Advanced Connector addon's scripts. The below example shows how to change color (to green) and thickness (to 13) when the image source is selected and Text module's gap content changes.

        EVENTSTART
        Name:ItemSelected
        Item:green
        SCRIPTSTART
        var learnpendrawing = presenter.playerController.getModule('LearnPen1');
        learnpendrawing.setColor('green');
        SCRIPTEND
        EVENTEND

        EVENTSTART
        Source:Text1
        Item:1
        Value:^medium$
        SCRIPTSTART
        var learnpendrawing = presenter.playerController.getModule('LearnPen1');
        learnpendrawing.setThickness(13);
        SCRIPTEND
        EVENTEND

To turn on eraser, you have to use function:

        learnpendrawing.setEraserOn();

To set eraser's Thickness, use function:

        learnpendrawing.setEraserThickness(10);

To turn off Eraser, just set pencil color, e.g.:

        learnpendrawing.setColor('pink');

## Demo presentation
[Demo presentation](/embed/6628664185716736 "Demo presentation") contains examples on how to use the LearnPen Drawing addon.                          