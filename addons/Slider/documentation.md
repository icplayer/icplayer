## Description
This module allows adding a slider to exercises. The users either slide the image from one position to another or mouse-click on the position they wish to move an image (slider) to.

## Properties

The list starts with the common properties, learn more about them by visiting the [Modules description](https://www.mauthor.com/doc/en/page/Modules-description) section. The other available properties are described below.

<table border='1'>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>ImageElement</td>
        <td>An image which serves as a slider</td>
    </tr>
    <tr>
        <td>Orientation</td>
        <td>Addon can be used in either horizontal ("Landscape") and vertical ("Portrait") orientation</td>
    </tr>
    <tr>
        <td>Stepwise</td>
        <td>If you want to set number of steps of slider then this option must be checked</td>
    </tr>
    <tr>
        <td>Stepwise mode bar always visible</td>
        <td>If this option is selected, the "Stepwise" bar will be visible in editor's mode and normal run. If this option is deselected, bar will be visible only in editor's mode.</td>
    </tr>
    <tr>
        <td>StepsCount</td>
        <td>Number of steps in Stepwise mode</td>
    </tr>
    <tr>
        <td>Initial</td>
        <td>Initial slider position (from 1 to StepsCount)</td>
    </tr>
    <tr>
        <td>onStepChange</td>
        <td>Event triggered on step change</td>
    </tr>
    <tr>
        <td>Block in error checking mode</td>
        <td>If this option is selected, addon will not respond to touch/mouse gestures and commands in error checking mode</td>
    </tr>
    <tr>
        <td>Continuous events</td>
        <td>If this option is selected, events will be sent in a continuous way.</td>
    </tr>
    <tr>
        <td>Continuous events steps</td>
        <td><ul>
               <p>This option is available if the "Continuous events" property is selected.</p>
               <li><b>Stick: </b>slider will snap to steps.</li>
               <li><b>Smooth: </b>slider will not snap to steps.</li>
           </ul>
        </td>
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
        <td>nextStep*</td>
        <td>---</td>
        <td>Move slider to next position if possible</td>
    </tr>
    <tr>
        <td>previousStep*</td>
        <td>---</td>
        <td>Move slider to previous position if possible</td>
    </tr>
    <tr>
        <td>moveToFirst*</td>
        <td>---</td>
        <td>Move slider to first position</td>
    </tr>
    <tr>
        <td>moveToLast*</td>
        <td>---</td>
        <td>Move slider to last position</td>
    </tr>
    <tr>
        <td>moveTo*</td>
        <td>step</td>
        <td>Move slider to given position (from 1 to StepsCount)</td>
    </tr>
    <tr>
        <td>moveToInitialStep*</td>
        <td>---</td>
        <td>Move slider to initial position</td>
    </tr>
    <tr>
        <td>getCurrentStep</td>
        <td>---</td>
        <td>Returns current slider position (from 1 to StepsCount). Returned value is a string!</td>
    </tr>
    <tr>
        <td>hide</td>
        <td>---</td>
        <td>Hides addon</td>
    </tr>
    <tr>
        <td>show</td>
        <td>---</td>
        <td>Shows addon</td>
    </tr>
</table>

Commands marked with '*' have additional parameter which can disable sending events to Event Bus (helpful when in Advanced Connector user wants to manipulate one Slider from another). To disable sending events just add 'false' parameter (with single quotes characters) like in example below.

    EVENTSTART
    Source:Text2
    SCRIPTSTART
        var sliderModule = presenter.playerController.getModule('Slider1');
        sliderModule.moveTo(2, 'false');
        sliderModule.show();
    SCRIPTEND
    EVENTEND

## Advanced Connector integration
Each command supported by the Slider addon can be used in the Advanced Connector addon's scripts. The below example shows how to display the hidden module and move it to step 2.

    EVENTSTART
    Source:Text2
    SCRIPTSTART
        var sliderModule = presenter.playerController.getModule('Slider1');
        sliderModule.moveTo(2);
        sliderModule.show();
    SCRIPTEND
    EVENTEND

## Events
The Slider addon sends ValueChanged type events to Event Bus when a step is changed. On every step change the addon sends two events - one for leaving a current step and other for entering a new one.

<table border='1'>
<tbody>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Item</td>
        <td>Step number</td>
    </tr>
    <tr>
        <td>Value</td>
        <td>1 for entering step, 0 for leaving it</td>
    </tr>
    <tr>
        <td>Score</td>
        <td>N/A</td>
    </tr>
</tbody>
</table>

## CSS classes

<table border='1'>
    <tr>
        <th>Class name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>slider-wrapper</td>
        <td>DIV surrounding the slider element. Slider element is a direct child of this element</td>
    </tr>
    <tr>
        <td>disabled</td>
        <td>Additional class for 'slider-wrapper' element added in Error Checking mode when Slider is disabled (via adequate property in Model)</td>
    </tr>
    <tr>
        <td>slider-element-image</td>
        <td>Image elements which serve as a slider</td>
    </tr>
    <tr>
        <td>slider-element-image-mouse-hover</td>
        <td>Image elements which serves as a slider with mouse over it</td>
    </tr>
    <tr>
        <td>slider-element-image-mouse-click</td>
        <td>Image elements which serves as a slider when a mouse click is on it</td>
    </tr>
    <tr>
        <td>slider-stepwise-bar</td>
        <td>Class for the bar represented by canvas element when the Stepwise property is selected</td>
    </tr>
</table>

## Demo presentation
[Demo presentation](/embed/2559061 "Demo presentation") contains examples on how to use the Slider addon and integrate it with other addons, i.e. Image Viewer or Video.           