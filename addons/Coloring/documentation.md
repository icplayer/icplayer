## Description

The Coloring addon gives users the ability to upload an image which can be later colored.

## Properties

<table border='1'>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Image</td>
        <td>An image to be colored.
           <p>An image from an online resource different from mAuthor's origin is not supported.</p>
<p><em>This property allows online resources. <a href="/doc/page/Online-resources">Find out more »</a></em></p>
</td>
    </tr>
    <tr>
        <td>Areas</td>
        <td>The areas with provided correct coloring settings. It's a new line separated property. Each single line should contain x, y values, the color and an optional description for Text to speech. <br>For example: 155;100;255 255 50 255; Head area
<br>The color is in RGBA format. x and y can be taken from the top-left corner of the Coloring module when in Editor. The color can also be "transparent". <br>For example: 155; 100; transparent.<br>
            Marking the area as transparent makes this area to be correct only when it is left without being colored. Coloring this area will be counted as mistake.
		</td>
    </tr>
    <tr>
        <td>Colors</td>
        <td>
            The colors that will be available for coloring in Text to speech use.
            <p>Description - Description of the color. Read during color selection and while pointing at a colored area</p>
            <p>Color RGBA - RGBA for the color, if value is set as "255,255,255,255" the color will act as a eraser</p>
        </td>
    </tr>
	<tr>
		<td>Default Filling Color</td>
		<td>The default color that is used for coloring. This property left empty will provide the default filling color as "255 100 100 255" RGBA value.</td>
	</tr>
	<tr>
		<td>Tolerance</td>
		<td>The tolerated difference between the colored area and the contours. It should be used with caution and only when absolutely necessary.</td>
	</tr>
	<tr>
		<td>Is Not Activity</td>
		<td>The addon is not an activity which means it gives neither score nor errors.</td>
	</tr>
	<tr>
		<td>Is Disabled</td>
		<td>Sets the addon in a disabled state.</td>
	</tr>
    <tr>
        <td>Color correct</td>
        <td>With this option checked, all areas will be colored correctly when clicked.</td>
    </tr>
    <tr>
        <td>Show all answers in gradual show answers mode</td>
        <td>If this property is selected the gradual show answer button will show correct answers for entire addon.</td>
    </tr>
        <td>Speech texts</td>
        <td>Sets the values of speech texts - predefined phrases providing additional context while using the module in the TTS mode. Speech texts are always read using the content's default language.</td>
    </tr>
    <tr>
        <td>Lang attribute</td>
        <td>Allows you to set the langauge used to read the area names and color descriptions via the TTS module.</td>
    </tr>
    <tr>
        <td>Mark transparent areas</td>
        <td>If selected and the addon is edited, then in the Check Answers mode, areas defined as a transparent would receive an icon for the correct answer. This does not affect the addon's score.</td>
    </tr>

</table>

## Supported commands

<table border='1'>
    <tr>
        <th>Name</th>
        <th>Parameters</th>
		<th>Description</th>
    </tr>
    <tr>
        <td>show</td>
        <td>---</td>
		<td>Shows the addon.</td>
    </tr>
	<tr>
        <td>hide</td>
        <td>---</td>
		<td>Hides the addon.</td>
    </tr>
	<tr>
        <td>disable</td>
        <td>---</td>
		<td>Disables the addon.</td>
    </tr>
	<tr>
        <td>enable</td>
        <td>---</td>
		<td>Enables the addon.</td>
    </tr>
	<tr>
        <td>isAllOK</td>
        <td>---</td>
		<td>Returns true if all areas are filled in with correct colors, false otherwise</td>
    </tr>
	<tr>
        <td>getView</td>
        <td>---</td>
		<td>Returns the DOM element wrapped with jQuery which is a main container of the addon.</td>
    </tr>
	<tr>
        <td>setColor</td>
        <td>color</td>
		<td>Sets a current filling color, for example Coloring1.setColor('255 50 50 255').</td>
    </tr>
	<tr>
        <td>getColor</td>
        <td>color</td>
		<td>Returns current color at a point, for example Coloring1.getColor(116, 73).</td>
    </tr>
	<tr>
        <td>setEraserOn</td>
        <td>---</td>
		<td>Turns on the eraser mode.</td>
    </tr>
	<tr>
        <td>isAttempted</td>
        <td>---</td>
		<td>Returns true if the addon has been attempted to be completed, otherwise false.</td>
    </tr>
    </tr>
	<tr>
        <td>fillArea</td>
        <td>x coordinate, y coordinate, color</td>
		<td>Colors the selected area, for example Coloring1.fillArea(200,300,'255 50 50 255'). If the color is not specified, this method will color the area on the defined color, for exampleColoring1.fillArea(200,300). </td>
    </tr>
	<tr>
        <td>clearArea</td>
        <td>x coordinate, y coordinate</td>
		<td>Clears the selected area, for example Coloring1.clearArea(200,300)</td>
    </tr>
</table>


## Advanced Connector integration
In Advanced Connector you can react to events that are sent by Coloring addon. In the example below: you are listening to a ValueChanged event which will be sent when a user fills in the area (x: 155, y: 12). When the event arrives, you set relevant text in the Text module.

    EVENTSTART
    Source:Coloring1
	Name:ValueChanged
	Value:1
	Item:155;12
    SCRIPTSTART
        var textModule = presenter.playerController.getModule('Text1');
        textModule.setText('The user has colored area: x = 155, y = 12');
    SCRIPTEND
    EVENTEND

## Events
Coloring sends events compatible with both [Connector](/doc/page/Connector) and [Advanced-Connector](/doc/page/Advanced-Connector) modules. 

It sends a ValueChanged event when a user clicks on any area within the image.

<table border='1'>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Name</td>
        <td>ValueChanged</td>
    </tr>
	<tr>
        <td>Score</td>
        <td>It is 1 if the area is colored with a proper color, otherwise 0. For colored areas not defined in the "Areas" property, it should be the empty string "".</td>
    </tr>
	<tr>
        <td>Value</td>
        <td>It is 1 if a user colored the area and 0 if the user erased the area.</td>
    </tr>
	<tr>
        <td>Item</td>
        <td>It is x and y provided in Areas property</td>
    </tr>
</table>

##Show Answers

This module is fully compatible with [Show Answers module](/doc/page/Show-Answers "Show Answers module") and displays correct answers when an adequate event is sent.

## CSS Classes

<table border='1'>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
	<tr>
        <td>.coloring-wrapper</td>
        <td>The outer wrapper of the whole addon</td>
    </tr>
    <tr>
        <td>.coloring-container</td>
        <td>The inner container of the whole addon</td>
    </tr>
    <tr>
        <td>.icon-container</td>
        <td>The container for the icon which shows up when in "Check Errors" mode</td>
    </tr>
</table>

### Default Styling

<pre>
.coloring-wrapper .coloring-container canvas {
    display: table;
    margin: auto;
}

.coloring-wrapper {
    display: table;
    width: 100%;
    height: 100%;
}

.coloring-wrapper .coloring-container {
    display: table-cell;
    vertical-align: middle;
}

.coloring-wrapper .coloring-container .icon-container {
    border: 1px solid #111111;
    border-radius: 50%;
    font-size: 10px;
    height: 8px;
    line-height: 6px;
    padding: 2px;
    position: absolute;
    width: 8px;
    font-weight: bold;
}

.coloring-wrapper .coloring-container .icon-container.wrong {
    background-color: #ff5599;
}

.coloring-wrapper .coloring-container .icon-container.correct {
    background-color: #55ff99;
}

.coloring-wrapper .coloring-container .icon-container.correct:after {
    content: 'v';
}

.coloring-wrapper .coloring-container .icon-container.wrong:after {
    content: 'x';
}

</pre>

## Demo presentation
[Demo presentation](/embed/6386555325251584 "Demo presentation") contains examples of how this addon can be used.                                       