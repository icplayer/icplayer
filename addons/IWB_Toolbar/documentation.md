## Description

IWB Toolbar is a set of tools to help teachers in conducting lessons and giving presentations. It has been specially designed to work with IWB (Interactive Whiteboard).

## Properties

<table border='1'>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Floating Images (optional)</td>
        <td>Here you can change the default Floating Images.
            <p><em>This property allows online resources. <a href="/doc/page/Online-resources">Find out more »</a></em></p>
        </td>
    </tr>
	<tr>
        <td>Width When Opened (optional)</td>
        <td>Width of the panel when it's open. Default 457. This value is in pixels.</td>
    </tr>
    <tr>
        <td>Width When Closed (optional)</td>
        <td>Width of the panel when it's closed. Default: 30. This value is in pixels.</td>
    </tr>
    <tr>
        <td>Show for pen</td>
        <td>You can choose the default panel (one of three options: None, Color Panel or Thickness Panel) which will be displayed after clicking on a pen drawing tool icon.</td>
    </tr>
    <tr>
        <td>Show for marker</td>
        <td>You can choose the default panel (one of three options: None, Color Panel or Thickness Panel) which will be displayed afterclicking on a marker drawing tool icon.</td>
    </tr>
    <tr>
        <td>Keep state and position</td>
        <td>The checked property sets IWB in the same position as on a previously visited page. When the property is unchecked, it means that the addon's position is remembered independently on each page.</td>
    </tr>
    <tr>
        <td>Closed panel drawing</td>
        <td>This property allows to draw when the panel is closed.</td>
    </tr>
    <tr>
        <td>Expansion direction</td>
        <td>Indicates in which direction the panel will expand when opened.</td>
    </tr>
    <tr>
        <td>Vertical popups direction</td>
        <td>Indicates in which direction (left or right) popups will show when opened. Works only with up or down Expansion direction option.</td>
    </tr>
    <tr>
        <td>Horizontal popups direction</td>
        <td>Indicates in which direction (up or down) popups will show when opened. Works only with left or right Expansion direction option.</td>
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
        <td>-</td>
        <td>Shows the module.</td> 
    </tr>
    <tr>
        <td>hide</td>
        <td>-</td>
        <td>Hides the module.</td> 
    </tr>
    <tr>
        <td>setPenColor</td>
        <td>color</td>
        <td>Sets pen color specified in '#RRGGBB' notation or by name, e.g. 'pink'.</td> 
    </tr>
    <tr>
        <td>setMarkerColor</td>
        <td>color</td>
        <td>Sets marker color specified in '#RRGGBB' notation or by name, e.g. 'pink'.</td> 
    </tr>
    <tr>
        <td>setDefaultPenThickness</td>
        <td>thickness</td>
        <td>Sets the default pen thickness specified in pixels.</td> 
    </tr>
    <tr>
        <td>setMarkerThickness</td>
        <td>thickness</td>
        <td>Sets the marker thickness specified in pixels.</td> 
    </tr>
    <tr>
        <td>setEraserThickness</td>
        <td>thickness</td>
        <td>Sets the eraser thickness specified in pixels.</td>
    </tr>
</table>

## How to hide unnecessary buttons

Let's assume that we want to hide the Floating Images option. In order to do that, it's necessary to perform the following steps:

1) Change Width When Opened property so that it doesn't take into consideration the width of Floating Images button ( 30px ). It will be 457 - 30 = 427.

2) In Edit CSS section we need to add a new style rule: 

<pre>
#IWB_Toolbar1-panel .button.floating-image { 
	display: none; 
}
</pre>

*IWB_Toolbar1 is the module's ID in editor

3) Save the lesson and it's ready.

## Icons for Tools mapping

<img src='/file/serve/4927175100727296' /> – Open

This will open the toolbar.

<img src='/file/serve/6100241533108224' /> – Close

This will close the toolbar.

<img src='/file/serve/5046441594585088' /> – Default Mode

This is the default mode. It is used to hide all drawing masks or turn off the zooming mode.

<img src='/file/serve/6343786848321536' /> – Zooming Mode

In this mode you can zoom in the elements visible on a page. Once you have zoomed in an element, you can zoom it out by clicking on the element once again. On IE 10 and IE on mobile devices with Windows, 8 this option works only with the filled in elements. An empty element (e.g. only with given width and height) will not be zoomed.

<img src='/file/serve/5530271925403648' /> – Pen Mode

It's one of the drawing modes. When it's active, you cannot interact with modules on the page, but you can make some notes or draw something.

<img src='/file/serve/5478758423199744' /> – Marker Mode

It's one of the drawing modes. The difference between a pen and a marker mode is that marker is transparent in color and it's thicker.

<img src='/file/serve/6093221878824960' /> – Eraser Mode

In this mode you can erase previously drawn lines.

<img src='/file/serve/6310041827147776' /> – Add Note

This tool gives you the possibility of leaving a note for your students. Double click on the note body to edit it.

<img src='/file/serve/5476216473649152' /> – Hide Area

It will let you hide a chosen area.

<img src='/file/serve/4541538124169216' /> – Stand Area

It will let you stand a chosen area.

<img src='/file/serve/5266687433637888' /> – Undo All

This option will clear all drawings: pen, marker, hide area, stand area and all notes.

<img src='/file/serve/5778617671876608' /> – Floating Images ( default: ruler, setsquare and protractor )

When this mode is active, you can select one of the 3 floating images. You can move or rotate the selected image. To change from move mode to rotate just double click on the image. Double click again to change back to a move mode.

<img src='/file/serve/5708248927698944' /> – Color

Select a color for a pen, a marker, a stand area, a hide area.

<img src='/file/serve/6591516803858432' /> – Thickness

Select a thickness for a pen or a marker.

<img src='/file/serve/5658063500476416' /> – Clock

Select the 'Clock" icon to display a clock object. It doesn't disappear after closing the toolbar or while changing the presentation pages. It can also be moved freely on the screen.

<img src='/file/serve/6544185533399040' /> – Stopwatch

Select the 'Stopwatch' icon to display a stopwatch object. As the clock object, it doesn't disappear after closing the toolbar or while changing the presentation pages. It can also be moved freely on the screen.

## Translate the default 'delete note' confirmation box and buttons' tooltips

Let's assume that we want to translate the content of the 'delete note' confirmation box, which is by default set to "Are you sure to remove this note?".
In order to do that, it's necessary to edit the CSS section:

<pre>
.confirmation-remove-note > span:after {
     content: 'Czy na pewno usunąć tę notatkę?';
}
</pre>

The translation above is in Polish but you can translate it to any language of your choice.

## Default Styling

The Addon class is added to its panel as a way of ensuring that the custom class styling applies.
Normally, the addon has a custom class set by the Player but in this addon the view is hidden and the visible part (panel) is not a child of it.

<pre>
.iwb-toolbar-panel {
    padding: 5px 25px;
    cursor: move;
    border-radius: 3px;
    min-width: 30px;
    min-height: 30px;
    box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.6);
    background-color: rgba(255, 255, 255, 0.8);
    background-image: url('resources/wb_panel_move_icon.svg'), url('resources/wb_panel_move_icon.svg');
    background-position: left center, right center;
    background-repeat: no-repeat;
}

.iwb-toolbar-panel.right {
    width: 30px;
}

.iwb-toolbar-panel.left {
    display: flex;
    flex-direction: row-reverse;
    flex-wrap: wrap;
    width: 30px;
}

.iwb-toolbar-panel.up {
    display: flex;
    flex-direction: column-reverse;
    flex-wrap: wrap;
    height: 30px;
}

.iwb-toolbar-panel.down {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    height: 30px;
}

.iwb-toolbar-panel.running {
    z-index: 1001;
    position: fixed;
}

.iwb-toolbar-panel.up .button-separator,
.iwb-toolbar-panel.down .button-separator {
    width: 30px;
    float: inherit;
    height: 1px;
    margin-top: 5px;
    margin-left: 0px;
}

.iwb-toolbar-panel .button.clicked {
    background-color: #7A7A7A;
}

.iwb-toolbar-panel .button.clicked-lighter, .iwb-toolbar-panel .button-drawing-details.clicked-lighter, .iwb-toolbar-panel .button-floating-image.clicked-lighter {
    background-color: #CACACA;
}

.iwb-toolbar-panel .button, .iwb-toolbar-panel .button-drawing-details, .iwb-toolbar-panel .button-floating-image {
    width: 30px;
    height: 30px;
    float: left;
    text-align: center;
    border-radius: 3px;
    font-size: 16px;
    line-height: 30px;
    margin-left: 5px;
    background-position: center;
    background-repeat: no-repeat;
    cursor: pointer;
}

.iwb-toolbar-panel .button.hidden, .iwb-toolbar-panel .button-separator.hidden {
    display: none;
}

.iwb-toolbar-panel.up .button,
.iwb-toolbar-panel.up .button-drawing-details,
.iwb-toolbar-panel.up .button-floating-image,
.iwb-toolbar-panel.down .button,
.iwb-toolbar-panel.down .button-drawing-details,
.iwb-toolbar-panel.down .button-floating-image {
    float: inherit;
    margin-top: 5px;
    margin-left: 0px;
}

.iwb-toolbar-panel.left .button.first,
.iwb-toolbar-panel.right .button.first {
    margin-left: 0px;
}

.iwb-toolbar-panel.up .button.first,
.iwb-toolbar-panel.down .button.first{
    margin-top: 0px;
}

.iwb-toolbar-panel .button.hovered {
    cursor: pointer;
}

.iwb-toolbar-mask {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0px;
    left: 0px;
    cursor: crosshair;
}

.iwb-toolbar-mask.pen-mask {
    z-index: 999;
}

.iwb-toolbar-mask.marker-mask {
    z-index: 1000;
    opacity: 0.4;
}

.iwb-toolbar-mask canvas {
    width: 100%;
    height: 100%;
}

.iwb-toolbar-selection {
    border: 1px dotted #0000ff;
    position: absolute;
}

.iwb-toolbar-panel.right .bottom-panel .container {
    float: right;
    margin-top: 5px;
}

.iwb-toolbar-panel.left .bottom-panel .container {
    display: flex;
    flex-direction: row-reverse;
    float: right;
    margin-top: 5px;
}

.iwb-toolbar-panel.up .bottom-panel .container {
    display: flex;
    flex-direction: column-reverse;
    float: right;
    margin-left: 5px;
}

.iwb-toolbar-panel.down .bottom-panel .container {
    display: flex;
    flex-direction: column;
    float: right;
    margin-left: 5px;
}

.iwb-toolbar-panel.right .bottom-panel-floating-image {
    margin-right: 77px;
}

.iwb-toolbar-panel.left .bottom-panel-floating-image {
    margin-left: 77px;
}

.iwb-toolbar-panel.up .bottom-panel-floating-image {
    margin-top: 77px;
}

.iwb-toolbar-panel.down .bottom-panel-floating-image {
    margin-bottom: 77px;
}

.iwb-toolbar-panel .bottom-panel {
    display: none;
}

.iwb-toolbar-panel.left .bottom-panel {
    margin-right: auto;
}

.iwb-toolbar-panel.up .bottom-panel {
    margin-bottom: auto;
}

.iwb-toolbar-panel.down .bottom-panel {
    margin-top: auto;
}

.iwb-toolbar-panel .button.close, .iwb-toolbar-panel .button.open {
    font-size: 10px;
    line-height: 30px;
}

.iwb-toolbar-panel .button.open {
    display: block;
    background-image: url('resources/wb-panel_open.svg');
}

.iwb-toolbar-panel .button.close {
    background-image: url('resources/wb-panel_close.svg');
}

.iwb-toolbar-panel .button.zoom {
    background-image: url('resources/wb_panel_zoom_icon.svg');
}

.iwb-toolbar-panel .button.zoom.clicked {
    background-image: url('resources/wb_panel_zoom_icon-active.svg');
}

.iwb-toolbar-panel .button.pen {
    background-image: url('resources/wb_panel_pen_icon.svg');
}

.iwb-toolbar-panel .button.pen.clicked {
    background-image: url('resources/wb_panel_pen_icon-active.svg');
}

.iwb-toolbar-panel .button.marker {
    background-image: url('resources/wb_panel_marker_icon.svg');
}

.iwb-toolbar-panel .button.marker.clicked {
    background-image: url('resources/wb_panel_marker_icon-active.svg');
}

.iwb-toolbar-panel .button.stand-area {
    background-image: url('resources/wb_panel_blind_icon.svg');
}

.iwb-toolbar-panel .button.stand-area.clicked {
    background-image: url('resources/wb_panel_blind_icon-active.svg');
}

.iwb-toolbar-panel .button.hide-area {
    background-image: url('resources/wb_panel_focus_icon.svg');
}

.iwb-toolbar-panel .button.hide-area.clicked {
    background-image: url('resources/wb_panel_focus_icon-active.svg');
}

.iwb-toolbar-panel .button.eraser {
    background-image: url('resources/wb_panel_erase_icon.svg');
}

.iwb-toolbar-panel .button.eraser.clicked {
    background-image: url('resources/wb_panel_erase_icon-active.svg');
}

.iwb-toolbar-panel .button.reset {
    background-image: url('resources/wb_panel_reset_icon.svg');
}

.iwb-toolbar-panel .button.reset.clicked {
    background-image: url('resources/wb_panel_reset_icon-active.svg');
}

.iwb-toolbar-panel .button.default {
    background-image: url('resources/wb_panel_cursor_icon.svg');
}

.iwb-toolbar-panel .button.default.clicked {
    background-image: url('resources/wb_panel_cursor_icon-active.svg');
}

.iwb-toolbar-panel .button.note {
    background-image: url('resources/wb_panel_note_icon.svg');
}

.iwb-toolbar-panel .button.note.clicked {
    background-image: url('resources/wb_panel_note_icon-active.svg');
}

.iwb-toolbar-panel .button.floating-image {
    background-image: url('resources/wb_panel_rullers_icon.svg');
}

.iwb-toolbar-panel .button.floating-image.clicked {
    background-image: url('resources/wb_panel_rullers_icon-active.svg');
}

.iwb-toolbar-panel .button.color {
    background-image: url('resources/wb_panel_color_black_icon.svg');
}

.iwb-toolbar-panel .button.thickness.clicked {
    background-image: url('resources/wb_panel_size1_icon-active.svg');
}

.iwb-toolbar-panel .button.thickness {
    background-image: url('resources/wb_panel_size1_icon.svg');
}

.iwb-toolbar-panel .color-black {
    background-image: url('resources/wb_panel_color_black_icon.svg');
}

.iwb-toolbar-panel .color-blue {
    background-image: url('resources/wb_panel_color_blue_icon.svg');
}

.iwb-toolbar-panel .color-green {
    background-image: url('resources/wb_panel_color_green_icon.svg');
}

.iwb-toolbar-panel .color-orange {
    background-image: url('resources/wb_panel_color_orange_icon.svg');
}

.iwb-toolbar-panel .color-red {
    background-image: url('resources/wb_panel_color_red_icon.svg');
}

.iwb-toolbar-panel .color-violet {
    background-image: url('resources/wb_panel_color_violet_icon.svg');
}

.iwb-toolbar-panel .color-white {
    background-image: url('resources/wb_panel_color_white_icon.svg');
}

.iwb-toolbar-panel .color-yellow {
    background-image: url('resources/wb_panel_color_yellow_icon.svg');
}

.iwb-toolbar-panel .thickness-1 {
    background-image: url('resources/wb_panel_size1_icon.svg');
}

.iwb-toolbar-panel .thickness-1.clicked {
    background-image: url('resources/wb_panel_size1_icon-active.svg');
}

.iwb-toolbar-panel .thickness-2 {
    background-image: url('resources/wb_panel_size2_icon.svg');
}

.iwb-toolbar-panel .thickness-2.clicked {
    background-image: url('resources/wb_panel_size2_icon-active.svg');
}

.iwb-toolbar-panel .thickness-3 {
    background-image: url('resources/wb_panel_size3_icon.svg');
}

.iwb-toolbar-panel .thickness-3.clicked {
    background-image: url('resources/wb_panel_size3_icon-active.svg');
}

.iwb-toolbar-panel .thickness-4 {
    background-image: url('resources/wb_panel_size4_icon.svg');
}

.iwb-toolbar-panel .thickness-4.clicked {
    background-image: url('resources/wb_panel_size4_icon-active.svg');
}

.button-floating-image.button-floating-image-1 {
    background-image: url('resources/wb_panel_ruller1_icon.svg');
}

.button-floating-image.button-floating-image-2 {
    background-image: url('resources/wb_panel_ruller2_icon.svg');
}

.button-floating-image.button-floating-image-3 {
    background-image: url('resources/wb_panel_ruller3_icon.svg');
}

.iwb-toolbar-note {
    top: 0px;
    width: 180px;
    min-height: 100px;
    position: absolute;
    background-color: rgba(255, 255, 155, 0.9);
    border-radius: 4px;
    box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.5);
}

.iwb-toolbar-note .note-header {
    height: 20px;
    box-shadow: 0px 1px #b1b1b1;
    line-height: 20px;
}

.iwb-toolbar-note .note-body {
    padding: 5px;
    font-size: 0.8em;
    word-wrap: break-word;
    overflow-wrap: break-word;
    white-space: pre;
}

.iwb-toolbar-note textarea {
    width: 160px;
    margin: auto;
    box-sizing: border-box;
    min-height: 70px;
    display: block;
    resize: vertical;
}

.iwb-toolbar-note .save {
    float: right;
    right: 3px;
    position: relative;
}

.iwb-toolbar-note .note-date {
    font-style: italic;
    font-size: 0.6em;
    width: 80%;
    position: relative;
    left: 10px;
    float: left;
}

.iwb-toolbar-note .note-close {
    width: 10%;
    right: 5px;
    float: right;
    position: relative;
    cursor: pointer;
    text-align: right;
}

.iwb-toolbar-note .note-close.hovered {
    color: #696969;
}

.iwb-toolbar-floating-image {
    display: none;
}

.iwb-toolbar-panel .button .tooltip {
    display: none;
    position: absolute;
    top: -20px;
    font-size: 8px;
    line-height: 8px;
    min-width: 30px;
    padding: 3px;
    border-radius: 2px;
    background-color: rgba(255, 255, 255, 0.5);
    box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.6);
}

.iwb-toolbar-panel .button.default .tooltip span:after {
    content: 'Default Mode';
}

.iwb-toolbar-panel .button.close .tooltip span:after {
    content: 'Close';
}

.iwb-toolbar-panel .button.open .tooltip span:after {
    content: 'Open';
}

.iwb-toolbar-panel .button.zoom .tooltip span:after {
    content: 'Zoom';
}

.iwb-toolbar-panel .button.pen .tooltip span:after {
    content: 'Pen';
}

.iwb-toolbar-panel .button.marker .tooltip span:after {
    content: 'Marker';
}

.iwb-toolbar-panel .button.eraser .tooltip span:after {
    content: 'Eraser';
}

.iwb-toolbar-panel .button.note .tooltip span:after {
    content: 'Add Note';
}

.iwb-toolbar-panel .button.hide-area .tooltip span:after {
    content: 'Hide Area';
}

.iwb-toolbar-panel .button.stand-area .tooltip span:after {
    content: 'Stand Area';
}

.iwb-toolbar-panel .button.reset .tooltip span:after {
    content: 'Undo All';
}

.iwb-toolbar-panel .button.floating-image .tooltip span:after {
    content: 'Floating Image';
}

.iwb-toolbar-panel .button.color .tooltip span:after {
    content: 'Color';
}

.iwb-toolbar-panel .button.thickness .tooltip span:after {
    content: 'Thickness';
}

.confirmation-remove-note > span:after {
     content: 'Are you sure to remove this note?';
}

.confirmation-remove-note .yes-button > span:after {
    content: 'Yes';
}

.confirmation-remove-note .no-button > span:after {
    content: 'No';
}

.confirmation-remove-note .no-button {
    float: right;
}

.confirmation-remove-note .yes-button {
    float: left;
}

.confirmation-remove-note .button {
    padding: 5px;
    border-radius: 5px;
    border: 1px solid #696969;
    width: 50px;
    text-align: center;
    box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
    cursor: pointer;
}

.confirmation-remove-note .ui-helper-clearfix {
    margin-top: 10px;
}

.confirmation-remove-note {
    min-height: 50px;
    padding: 10px;
    display: none;
    width: 200px;
    left: 50%;
    margin-left: -100px;
    position: absolute;
    background-color: rgba(245, 245, 245, 0.7);
    border-radius: 4px;
    box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.5);
    font-size: 0.7em;
    z-index: 1002;
}
</pre>

## Demo presentation
[Demo presentation](/embed/6634472466284544  "Demo presentation") contains an example of the Addon.                                        