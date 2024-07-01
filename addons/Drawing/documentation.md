## Description
Drawing addon allows users to text, draw and upload images on the digital canvas.

## Properties

The list starts with the common properties, learn more about them by visiting the [Modules description](https://www.mauthor.com/doc/en/page/Modules-description) section. The other available properties are described below.

<table border='1'>
    <tbody>
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
        <tr>
            <td>Font</td>
            <td>The value should be expressed in the same way as in CSS. <br/>
                For example: <br/>
                &emsp;1.2rem "Fira Sans", sans-serif<br/>
                For more information, please visit <a href="https://www.w3schools.com/cssref/pr_font_font.php">https://www.w3schools.com/cssref/pr_font_font.php</a>
            /td>
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
            <td>Hide the addon.</td>
        </tr>
        <tr>
            <td>show</td>
            <td>---</td>
            <td>Show the addon.</td>
        </tr>
        <tr>
            <td>setThickness</td>
            <td>number between 1 and 40</td>
            <td>Set thickness of the pencil.</td>
        </tr>
        <tr>
            <td>setColor</td>
            <td>color's name or #RRGGBB notation</td>
            <td>Set color and switch to pencil mode.</td>
        </tr>
        <tr>
            <td>setOpacity</td>
            <td>number between 0 and 1</td>
            <td>Set opacity for the whole addon.</td>
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
            <td>Set thickness of the eraser.</td>
        </tr>
        <tr>
            <td>addText</td>
            <td>---</td>
            <td>Open text editor.<br>
                To cancel writing, click the close button belonging to the editor.<br>                
                Clicking canvas will close the text editor and save the text to the canvas.
            </td>
        </tr>
        <tr>
            <td>setFont</td>
            <td>The value should be expressed in the same way as in CSS. <br/>
                For example: <br/>
                &emsp;1.2rem "Fira Sans", sans-serif<br/>
                For more information, please visit <a href="https://www.w3schools.com/cssref/pr_font_font.php">https://www.w3schools.com/cssref/pr_font_font.php</a></td>
            <td>Set font to be used in the text editor.</td>
        </tr>
        <tr>
            <td>uploadImage</td>
            <td>---</td>
            <td>Open panel to upload an image from the device to the canvas. 
                To delete an image that has been uploaded to canvas (but is still movable), press the "Delete" key on your keyboard.
            </td>
        </tr>
        <tr>
            <td>downloadBoard</td>
            <td>---</td>
            <td>Download canvas as an image in PNG format.</td>
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
            <td>Class of the element that is used to drag the editor text.</td>
        </tr>
        <tr>
            <td>text-close</td>
            <td>Class of the element that is used to close the editor text.</td>
        </tr>
    </tbody>
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

## Demo presentation
[Demo presentation](/embed/6183083237703680 "Demo presentation") contains examples on how to use the Drawing addon.                               