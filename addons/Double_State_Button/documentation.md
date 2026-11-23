## Description
The Double State Button module allows users to perform different actions in presentations, such as changing other modules' states when the button is selected/deselected.

## Properties

The list starts with the common properties, learn more about them by visiting the [Modules description](https://www.mauthor.com/doc/en/page/Modules-description) section. The other available properties are described below.

<table border='1'>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Text</td>
        <td>Text displayed while not in the selected state.</td>
    </tr>
    <tr>
        <td>Image</td>
        <td>Image displayed while not in the selected state.
<p><em>This property allows online resources. <a href="/doc/page/Online-resources">Find out more »</a></em></p></td>
    </tr>
    <tr>
        <td>Image alternative text</td>
        <td>This property enables defining a text description that will be added to the image.</td>
    </tr>
    <tr>
        <td>On selected</td>
        <td>Event that should be triggered while the user presses the button and changes its state to selected. The event is not triggered with the select() command.</td>
    </tr>
    <tr>
        <td>Text selected</td>
        <td>Text displayed while in the selected state.</td>
    </tr>
    <tr>
        <td>Image selected</td>
        <td>Image displayed while in the selected state.
<p><em>This property allows online resources. <a href="/doc/page/Online-resources">Find out more »</a></em></p></td>
    </tr>
    <tr>
        <td>Image selected alternative text</td>
        <td>This property enables defining a text description that will be added to the image in the selected state.</td>
    </tr>
    <tr>
        <td>On deselected</td>
        <td>Event that should be triggered while the user presses the button and changes its state to deselected. The event isn't triggered with the deselect() command.</td>
    </tr>
    <tr>
        <td>Is selected</td>
        <td>With this option checked, the module is selected at the startup.</td>
    </tr>
    <tr>
        <td>Disable</td>
        <td>Allows disabling the module so that the user is not able to interact with it.</td>
    </tr>
    <tr>
        <td>Do not block in check mode</td>
        <td>If this option is selected, the module is blocked in the error checking mode.</td>
    </tr>
    <tr>
        <td>Lang attribute</td>
        <td>This property allows defining the language for this module (different than the language of the lesson).</td>
    <tr>
    </tr>
        <td>Render SVG as HTML</td>
        <td>This option allows to represent the loaded SVG files as an HTML tag.</td>
    </tr>
    <tr>
        <td>Omit text in TTS</td>
        <td>After selecting this option, TTS will not read what is in the Text and Text selected fields. However, it will still read the content of the Image alternative text and Image selected alternative text.</td>
    </tr>
    </tr>
        <td>Speech texts</td>
        <td>List of speech texts: Selected, Deselected, Disabled. This text will be read by the Text to Speech module after the user performs a certain action. The list also includes the "Do not read the Speech texts" checkbox.</td>
    </tr>
    <tr>
        <td>Render SVG as HTML</td>
        <td>This option allows to represent the loaded SVG files as an HTML tag.</td>
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
        <td>select</td>
        <td>---</td>
        <td>Change button's state to selected if not in this state already.</td>
    </tr>
    <tr>
        <td>deselect</td>
        <td>---</td>
        <td>Change button's state to deselected if not in this state already.</td>
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
        <td>enable</td>
        <td>---</td>
        <td>Changes the state of the module to enable.</td>
    </tr>
    <tr>
        <td>disable</td>
        <td>---</td>
        <td>Changes the state of the module to disable.</td>
    </tr>
    <tr>
        <td>isSelected</td>
        <td>---</td>
        <td>Returns "true" if the module is selected, otherwise returns "false".</td>
    </tr>
</table>

## Advanced Connector integration
Each command supported by the Double State Button module can be used in the Advanced Connector module's scripts. The examples below show how to enable the button when the True/False module sends an event about the correct answer and how to disable it when the user selects the incorrect answer.

        EVENTSTART
        Source:TrueFalse1
        Score:1
        SCRIPTSTART

            var doubleButton = presenter.playerController.getModule('DSB1');
            doubleButton.enable();

        SCRIPTEND
        EVENTEND

        EVENTSTART
        Source:TrueFalse1
        Score:0
        SCRIPTSTART

            var doubleButton = presenter.playerController.getModule('DSB1');
            doubleButton.disable();

        SCRIPTEND
        EVENTEND

## Events
The Double State Button module sends ValueChanged type events to the Event Bus when the user selects or deselects it.

<table border='1'>
<tbody>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <tr>
            <td>Item</td>
            <td>N/A</td>
        </tr>
        <tr>
            <td>Value</td>
            <td>1 for selection, 0 for deselection.</td>
        </tr>
        <tr>
            <td>Score</td>
            <td>N/A</td>
        </tr>
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
        <td>doublestate-button-wrapper</td>
        <td>DIV surrounding the image element. The image element is a direct child of this element.</td>
    </tr>
    <tr>
        <td>doublestate-button-element</td>
        <td>Element base class, when it has no other state.</td>
    </tr>
    <tr>
        <td>doublestate-button-element-mouse-hover</td>
        <td>Class for element on which mouse pointer is positioned while not in selected state.</td>
    </tr>
    <tr>
        <td>doublestate-button-element-selected</td>
        <td>Class for selected element.</td>
    </tr>
    <tr>
        <td>doublestate-button-element-selected-mouse-hover</td>
        <td>Class for element on which a mouse pointer is positioned while in selected state.</td>
    </tr>
    <tr>
        <td>doublestate-button-image</td>
        <td>Class for the image (IMG) element.</td>
    </tr>
    <tr>
        <td>doublestate-button-text</td>
        <td>Class for the text (SPAN) element.</td>
    </tr>
    <tr>
        <td>disable</td>
        <td>Additional class for the singlestate-button-element when the button is disabled.</td>
    </tr>
</table>


Note that the module's size is the same in every state so properties responsible for dimensions (i.e. width, height, border/margin/padding size) should be consistent across all states.

## Demo presentation
[Demo presentation](https://mauthor.com/present/2416219 "Demo presentation") contains examples of how to use the Double State Button module.    

[Demo disable property](https://mauthor.com/present/2803004 "Demo disable property") contains examples of the "disable" property.                      