## Description
Shape Tracing addon allows you to check the correctness of written signs. The addon consists of 3 layers (in top-to-bottom order):
<ol>
    <li>two drawing layers (the area where you can draw, it has no effect on other layers)</li>
    <li>correct image</li>
    <li>background image</li>
    <li>shape image (it can be hidden or visible)</li>
</ol>

## Properties

<table border='1'>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Shape image</td>
        <td>Image file – every non-white pixel is interpreted by the addon as a boundary point of a shape. (only .png files are permitted).
           <p> An image from an online resource different from mAuthor's origin is not supported.</p>
<p><em>This property allows online resources. <a href="/doc/page/Online-resources">Find out more »</a></em></p>
</td>
    </tr>
    <tr>
        <td>Show Shape image</td>
        <td>true / false - shows the shape image.</td>
    </tr>
    <tr>
        <td>Hide Shape image on check</td>
        <td>true / false - hides the shape image on check.</td>
    </tr>
    <tr>
        <td>Show Boundaries (editor)</td>
        <td>true / false - this option works only in editor. It enables users to check how the boundaries of a shape image are interpreted by the addon.</td>
    </tr>
    <tr>
        <td>Background image</td>
        <td>An image file (only .png files are permitted).
           <p>An image from an online resource different from mAuthor's origin is not supported.</p>
<p><em>This property allows online resources. <a href="/doc/page/Online-resources">Find out more »</a></em></p>
</td>
    </tr>
    <tr>
        <td>Correct number of lines</td>
        <td>You can define the correct number (e.g. 1;3 - it's interpreted as <1, 3>) of lines or leave it empty, then you can draw any number of lines with a positive result.</td>
    </tr>
    <tr>
        <td>Points' coordinates</td>
        <td>In every line, 3 numbers semi-colon separated "<strong>;</strong>". The first number means the number of pixels to the right from the top-left corner, the second number is the number of pixels down and the third is the ray of an activity point, e.g. 45;34;15. You can define as many points as you like.</td>
    </tr>
    <tr>
        <td>Mind points' order</td>
        <td>true / false - if true, then the addon will check the order of points.</td>
    </tr>
    <tr>
        <td>Color</td>
        <td>The pencil's color specified in '#RRGGBB' notation or by name, e.g. 'pink'.</td>
    </tr>
    <tr>
        <td>Thickness</td>
        <td>The pencil's width. A number between 1 and 40.</td>
    </tr>
    <tr>
        <td>Opacity</td>
        <td>The opacity of the whole addon. A number between 0-1</td>
    </tr>
    <tr>
        <td>Border</td>
        <td>The border size. A number between 0 (no border) and 5 (5px black border)</td>
    </tr>
</table>

##Show Answers

This module is fully compatible with [Show Answers module](/doc/page/Show-Answers "Show Answers module") and displays correct answers when a relevant event is sent.

## Scoring
<table border='1'>
    <tr>
        <th>Property</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>maxScore</td>
        <td>the maximum score is always 1</td>
    </tr>
    <tr>
        <td>score</td>
        <td>the score is 1 if the exercise is done correctly, otherwise 0</td>
    </tr>
    <tr>
        <td>errorCount</td>
        <td>errorCount is always 0 or 1 - it depends on the score result. If the score is 1, then the errorCount is 0 and when the score is 0, the errorCount is 1</td>
    </tr>
</table>

## CSS classes
<table border='1'>
    <tr>
        <th>Class name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>.outer</td>
        <td>DIV wrapping Addon elements</td>
    </tr>
    <tr>
        <td>.shape</td>
        <td>DIV wrapping shape image</td>
    </tr>
    <tr>
        <td>.background</td>
        <td>DIV wrapping background image</td>
    </tr>
    <tr>
        <td>.drawing</td>
        <td>DIV wrapping drawing field</td>
    </tr>
    <tr>
        <td>.correct</td>
        <td>Addon marked as correct</td>
    </tr>
    <tr>
        <td>.wrong</td>
        <td>Addon marked as wrong</td>
    </tr>
    <tr>
        <td>.shape-tracing-show-answers</td>
        <td>Added to addon when Show Answers is active</td>
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
        <td>Hides the addon.</td>
    </tr>
    <tr>
        <td>show</td>
        <td>---</td>
        <td>Shows the addon.</td>
    </tr>
    <tr>
        <td>reset</td>
        <td>---</td>
        <td>Resets drawing.</td>
    </tr>
    <tr>
        <td>setEraserOn</td>
        <td>---</td>
        <td>Sets eraser.</td>
    </tr>
    <tr>
        <td>setThickness</td>
        <td>thickness</td>
        <td>Sets drawing thickness, e.g. '2'.</td>
    </tr>
    <tr>
        <td>setColor</td>
        <td>color</td>
        <td>Sets drawing color specified in '#RRGGBB' notation or by name, e.g. 'red'.</td>
    </tr>
    <tr>
        <td>descentsFromShape</td>
        <td>---</td>
        <td>Returns the number of descents from a declared shape.</td>
    </tr>
    <tr>
        <td>numberOfLines</td>
        <td>---</td>
        <td>Returns the number of drawn lines.</td>
    </tr>
    <tr>
        <td>pointsMissed</td>
        <td>---</td>
        <td>Returns the number of points missed by a user.</td>
    </tr>
    <tr>
        <td>getDirections</td>
        <td>---</td>
        <td>Returns the array of directions or 'Dot'. Every line is separated with the value 'Up' in Array. Possible direction values:
            <ul>
                <li>N - North</li>
                <li>NE - Northeast</li>
                <li>E - East</li>
                <li>SE - Southeast</li>
                <li>S - South</li>
                <li>SW - Southwest</li>
                <li>W - West</li>
                <li>NW - Northwest</li>
            </ul>
        </td>
    </tr>
    <tr>
        <td>isOrderCorrect</td>
        <td>boolean (optional: true or false)</td>
        <td>Returns the boolean value if drawing order is correct. The parameter is optional (default: false). If true, user can avoid the points but the order has to be correct.</td>
    </tr>
</table>

## Events

**allOk event**

<table border='1'>
<tbody>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <tr>
            <td>source</td>
            <td>addon ID</td>
        </tr>
        <tr>
            <td>item</td>
            <td>allOk</td>
        </tr>
        <tr>
            <td>value</td>
            <td>empty</td>
        </tr>
        <tr>
            <td>score</td>
            <td>Always: 1</td>
        </tr>
    </tr>
</tbody>
</table>

**error event**

<table border='1'>
<tbody>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <tr>
            <td>source</td>
            <td>addon ID</td>
        </tr>
        <tr>
            <td>item</td>
            <td>empty</td>
        </tr>
        <tr>
            <td>value</td>
            <td>Always: 0</td>
        </tr>
        <tr>
            <td>score</td>
            <td>empty</td>
        </tr>
    </tr>
</tbody>
</table>

## Advanced Connector integration
Each command supported by the Shape Tracing addon can be used in the Advanced Connector addon's scripts. The below example shows how to change color (to green) and thickness (to 13) when the Image Source is selected and  the Text module's gap content changes.

        EVENTSTART
        Name:ItemSelected
        Item:green
        SCRIPTSTART
        var drawing = presenter.playerController.getModule('Shape_Tracing1');
        drawing.setColor('green');
        SCRIPTEND
        EVENTEND

        EVENTSTART
        Source:Text1
        Item:1
        Value:^medium$
        SCRIPTSTART
        var drawing = presenter.playerController.getModule('Shape_Tracing1');
        drawing.setThickness(13);
        SCRIPTEND
        EVENTEND

To turn on the eraser, you have to use function:

        drawing.setEraserOn();

To set the eraser's and pencil's thickness, use function:

        drawing.setThickness(10);

To turn off the eraser, just set the pencil's color, e.g.:

        drawing.setColor('pink');

## Demo presentation
[Demo presentation](/embed/6747470151286784 "Demo presentation") contains examples on how to use the Shape Tracing addon.                                          