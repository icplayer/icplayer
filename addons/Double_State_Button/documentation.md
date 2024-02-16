## Description
Double state button allows users to perform different actions in presentations, such as changing other addons' states when the button is selected/deselected.

## Properties

<table border='1'>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Text</td>
        <td>Text displayed while not in selected state.</td>
    </tr>
    <tr>
        <td>Text selected</td>
        <td>Text displayed while in selected state.</td>
    </tr>
    <tr>
        <td>Image</td>
        <td>Image displayed while not in selected state.
<p><em>This property allows online resources. <a href="/doc/page/Online-resources">Find out more »</a></em></p></td>
    </tr>
    <tr>
        <td>Image selected</td>
        <td>Image displayed while in selected state.
<p><em>This property allows online resources. <a href="/doc/page/Online-resources">Find out more »</a></em></p></td>
    </tr>
    <tr>
        <td>onSelected</td>
        <td>Event which should be triggered while a user presses the button and changes its state to selected. Event isn't triggered with select() command</td>
    </tr>
    <tr>
        <td>onDeselected</td>
        <td>Event which should be triggered while a user presses the button and changes its state to deselected. Event isn't triggered with select() command</td>
    </tr>
    <tr>
        <td>isSelected</td>
        <td>With this option checked, the addon is selected at startup</td>
    </tr>
    <tr>
        <td>Disable</td>
        <td>Disable button. No events will be triggered when selected.</td>
    </tr>
    <tr>
        <td>Speech texts</td>
        <td>Sets the values of speech texts - predefined phrases providing additional context while using the module in the TTS mode. Speech texts are always read using the content's default language.</td>
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
        <td>Change button's state to selected if not in this state already</td>
    </tr>
    <tr>
        <td>deselect</td>
        <td>---</td>
        <td>Change button state to deselected if not in this state already</td>
    </tr>
    <tr>
        <td>show</td>
        <td>---</td>
        <td>Shows the button</td>
    </tr>
    <tr>
        <td>hide</td>
        <td>---</td>
        <td>Hides the button</td>
    </tr>
    <tr>
        <td>enable</td>
        <td>---</td>
        <td>Changing state to enable</td>
    </tr>
    <tr>
        <td>disable</td>
        <td>---</td>
        <td>Changing state to disable</td>
    </tr>
    <tr>
        <td>isSelected</td>
        <td>---</td>
        <td>Returns true if addon is selected, otherwise returns false</td>
    </tr>
</table>

## Advanced Connector integration
Each command supported by the Double State Button addon can be used in the Advanced Connector addon's scripts. The below examples show how to enable the button when True/False addon will send event about correct answer and how to disable it when event means that a user selects the incorrect answer.

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
Double State Button addon sends ValueChanged type events to Event Bus when either user selects or deselects it.

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
            <td>1 for selection, 0 for deselection</td>
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
        <td>DIV surrounding the image element. Image element is a direct child of this element</td>
    </tr>
    <tr>
        <td>doublestate-button-element</td>
        <td>Element base class, when it has no other state</td>
    </tr>
    <tr>
        <td>doublestate-button-element-mouse-hover</td>
        <td>Class for element on which mouse pointer is positioned while not in selected state</td>
    </tr>
    <tr>
        <td>doublestate-button-element-mouse-click</td>
        <td>Class for element on which a mouse click is positioned while not in selected state</td>
    </tr>
    <tr>
        <td>doublestate-button-element-selected</td>
        <td>Class for selected element</td>
    </tr>
    <tr>
        <td>doublestate-button-element-selected-mouse-hover</td>
        <td>Class for element on which a mouse pointer is positioned while in selected state</td>
    </tr>
    <tr>
        <td>doublestate-button-element-selected-mouse-click</td>
        <td>Class for element on which a mouse click is positioned while in selected state</td>
    </tr>
    <tr>
        <td>doublestate-button-image</td>
        <td>Class for image (IMG) element</td>
    </tr>
    <tr>
        <td>doublestate-button-text</td>
        <td>Class for text (SPAN) element</td>
    </tr>
    <tr>
        <td>disable</td>
        <td>Additional class for singlestate-button-element when the button is disabled.</td>
    </tr>
</table>

Note that the addon's size is the same in every state so properties responsible for dimensions (i.e. width, height, border/margin/padding size) should be consistent across all states.

## Demo presentation
[Demo presentation](/embed/2416219 "Demo presentation") contains examples on how to use the Double State Button addon.

[Demo disable property](/embed/2803004 "Demo disable property") contains examples of the "disable" property.         