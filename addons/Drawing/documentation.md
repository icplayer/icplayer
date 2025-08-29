## Description

The Drawing module allows users to draw, write, and upload images on the digital canvas.


## Properties

The list starts with the common properties. Learn more about them by visiting the <a href="/doc/en/page/Modules-description" target="_blank" rel="noopener noreferrer">Modules description</a> section. The other available properties are described below.

<table border='1'>
    <tbody>
        <tr>
            <th>Property name</th>
            <th>Description</th>
        </tr>
        <tr>
            <td>Color</td>
            <td>Color of the pencil specified in '#RRGGBB' notation or by name, e.g., 'pink'.</td>
        </tr>
        <tr>
            <td>Thickness</td>
            <td>Width of the pencil. Number between 1 and 40.</td>
        </tr>
        <tr>
            <td>Border</td>
            <td>Border size. Number between 0 (no border) and 5 (5px black border).</td>
        </tr>
        <tr>
            <td>Opacity</td>
            <td>Opacity for the whole module. Number between 0 - 1.</td>
        </tr>
        <tr>
            <td>Font</td>
            <td>The value should be expressed in the same way as in CSS.<br />
                For example: 1.2rem "Fira Sans", sans-serif<br />
                For more information, please visit <a href="https://www.w3schools.com/cssref/pr_font_font.php" target="_blank" rel="noopener noreferrer">https://www.w3schools.com/</a></td>
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
            <td>hide</td>
            <td>---</td>
            <td>Hides the module if it is visible.</td>
        </tr>
        <tr>
            <td>show</td>
            <td>---</td>
            <td>Shows the module if it is hidden.</td>
        </tr>
        <tr>
            <td>setThickness</td>
            <td>number between 1 and 40</td>
            <td>Set the thickness of the pencil.</td>
        </tr>
        <tr>
            <td>setColor</td>
            <td>color's name or #RRGGBB notation</td>
            <td>Set the color and switch to pencil mode.</td>
        </tr>
        <tr>
            <td>setOpacity</td>
            <td>number between 0 and 1</td>
            <td>Set opacity for the whole module.</td>
        </tr>
        <tr>
            <td>setEraserOn</td>
            <td>---</td>
            <td>Turns on the eraser mode.</td>
        </tr>
        <tr>
            <td>setEraserOff</td>
            <td>---</td>
            <td>Turns off the eraser mode.</td>
        </tr>
        <tr>
            <td>setEraserThickness</td>
            <td>number between 1 and 40</td>
            <td>Set the thickness of the eraser.</td>
        </tr>
        <tr>
            <td>addText</td>
            <td>---</td>
            <td>Open text editor.<br>
                To cancel writing, click the close button belonging to the editor.<br>
                Clicking the canvas will close the text editor and save the text to the canvas.</td>
        </tr>
        <tr>
            <td>setFont</td>
            <td>The value should be expressed in the same way as in CSS.<br />
                For example: 1.2rem "Fira Sans", sans-serif<br />
                For more information, please visit <a href="https://www.w3schools.com/cssref/pr_font_font.php" target="_blank" rel="noopener noreferrer">https://www.w3schools.com/</a></td>
            <td>Set font to be used in the text editor.</td>
        </tr>
        <tr>
            <td>uploadImage</td>
            <td>---</td>
            <td>Open the panel to upload an image from the device to the canvas. To delete an image that has been uploaded to the canvas (but is still movable), press the "Delete" key on your keyboard.</td>
        </tr>
        <tr>
            <td>downloadBoard</td>
            <td>---</td>
            <td>Download the canvas as an image in the PNG format.</td>
        </tr>
    </tbody>
</table>

## Events

The Drawing addon sends ValueChanged type events to Event Bus when a user interacts with it.

The <b>modified</b> event is sent when the canvas is modified, that is, it occurs not only when the drawing 
is completed, but also when the erasing is completed, the image or text is inserted.

<table border='1'>
    <tbody>
        <tr>
            <th>Field name</th>
            <th>Description</th>
        </tr>
        <tr>
            <td>Name</td>
            <td>ValueChanged</td>
        </tr>
        <tr>
            <td>Item</td>
            <td>N/A</td>
        </tr>
        <tr>
            <td>Value</td>
            <td>modified</td>
        </tr>
        <tr>
            <td>Score</td>
            <td>N/A</td>
        </tr>
    <tbody>
</table>

The <b>empty</b> event occurs on reset

<table border='1'>
    <tbody>    
        <tr>
            <th>Field name</th>
            <th>Description</th>
        </tr>
        <tr>
            <td>Name</td>
            <td>ValueChanged</td>
        </tr>
        <tr>
            <td>Item</td>
            <td>N/A</td>
        </tr>
        <tr>
            <td>Value</td>
            <td>empty</td>
        </tr>
        <tr>
            <td>Score</td>
            <td>N/A</td>
        </tr>
    </tbody>
</table>

and just before page close (due to a switch to another lesson page) when canvas is clear (e.g., drawing not started or after reset).

<table border='1'>
    <tbody>    
        <tr>
            <th>Field name</th>
            <th>Description</th>
        </tr>
        <tr>
            <td>Name</td>
            <td>PreDestroyed</td>
        </tr>
        <tr>
            <td>Item</td>
            <td>N/A</td>
        </tr>
        <tr>
            <td>Value</td>
            <td>empty</td>
        </tr>
    </tbody>
</table>

## CSS classes

<table border='1'>
    <tbody>
        <tr>
            <th>Class name</th>
            <th>Description</th>
        </tr>
        <tr>
            <td>drawing</td>
            <td>Class of div containing content to draw.</td>
        </tr>
        <tr>
            <td>text-handle</td>
            <td>Class of the element that is used to drag the text editor.</td>
        </tr>
        <tr>
            <td>text-close</td>
            <td>Class of the element that is used to close the text editor.</td>
        </tr>
    </tbody>
</table>


## Advanced Connector integration

Each command supported by the Drawing module can be used in the <a href="/doc/en/page/Advanced-Connector" target="_blank" rel="noopener noreferrer">Advanced Connector</a> module's scripts. The following example shows how to change the color (to green) and thickness (to 13) when the image source is selected and the <a href="/doc/en/page/Text" target="_blank" rel="noopener noreferrer">Text</a> module's gap content changes.

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


## Demo presentation

[Demo presentation](https://www.mauthor.com/present/5896726509387776 "Demo presentation") contains examples of how to use the Drawing module. 