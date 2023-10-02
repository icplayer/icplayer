## Description

MathText (WIRIS) is an addon that allows the use of MathType for Office Tools packages and WirisQuizzes.

With MathType for Office Tools packages it is possible to create or edit mathematical equations using a special WYSIWYG formula editor, also known as equation editor. In the WIRIS editor, it is possible to use method known as Hand - input method for writing mathematics in handwriting mode, which is provided by WIRIS. The resulting output of Hand is the equivalent presentation MathML of the formula handwritten by the user. Depending on the type selected in the addon's settings, math equations in the player can be edited or available only in SVG form.

## Properties

<table border='1'>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Initial text</td>
        <td>The initial MathML content of the editor. Used to set the content at initialization time of the editor.</td>
    </tr>
    <tr>
        <td>Correct answer</td>
        <td>MathML content that will be used as correct answer. Equations defined in this field will be validated with the 
            user's response. Editor in this field has a built-in settings panel. For example, it allows to specify 
            error tolerance on a user's response. 
        </td>
    </tr>
    <tr>
        <td>Type</td>
        <td>
            Table with available types and their descriptions:
            <table border='1'>
                <tbody>
                    <tr>
                        <th>Type</th>
                        <th>Description</th>
                        <th>The popup option is available</th>
                        <th>Is activity</th>
                    </tr>
                    <tr>
                        <td>text</td>
                        <td>In player, equations written in property 'Initial text' are available in SVG format and 
                            cannot be edited. Restrictions on minimum height and width are lifted.
                        </td>
                        <td>No</td>
                        <td>No</td>
                    </tr>
                    <tr>
                        <td>editor</td>
                        <td>In player, equations written in property 'Initial text' are editable in editor.</td>
                        <td>Yes</td>
                        <td>No</td>
                    </tr>
                    <tr>
                        <td>activity</td>
                        <td>In player, equations written in property 'Initial text' are editable in editor.
                            This type allows a user's answer to be compared and scored against the model content 
                            defined in the property 'Correct answer'.
                        </td>
                        <td>Yes</td>
                        <td>Yes</td>
                    </tr>
                </tbody>
            </table>
            , where:
            <ul>
                <li>The popup option is available - Determines whether the addon supports 'popup' mode if the 'Math editor in popup' property is checked.</li>
                <li>Is activity - Determines whether the addon is an activity or not. When it is not an activity, the answer given in 'Correct answer' property is not taken into account in the overall result.</li>
            </ul>
        </td>
    </tr>
    <tr>
        <td>Is disabled</td>
	    <td>Allows disabling the addon so that it won't be able to interact.</td>
    </tr>
    <tr>
        <td>Language</td>
        <td>Language of the editor.<br>
            List of supported languages: 
            <ul>
                <li>English</li>
                <li>Polish</li>
                <li>French</li>
                <li>Arabic</li>
                <li>Spanish</li>
            </ul>            
            Default language: English
        </td>
    </tr>
    <tr>
        <td>Formula color</td>
        <td>Defines the color of the whole formula.<br>
            A color with the form #RGB or #RRGGBB.<br>
            Default: #000000 (black)
        </td>
    </tr>
    <tr>
        <td>Background color</td>
        <td>Defines the background color of the whole formula.<br>
            A color with the form #RRGGBB.<br>
            Default: #FFFFFF (white)
        </td>
    </tr>
    <tr>
        <td>Math editor in popup</td>
        <td>Determines whether the editor is opened in a popup. The editor in the basic view is replaced by the 
            content from the editor saved in SVG format, like when type 'text' is chosen. 
            A click on SVG will open the popup.
        </td>
    </tr>
    <tr>
        <td>popup texts</td>
        <td>Editor where it is possible to change the name of the save and cancel button.
            The mentioned buttons are available in a popup.
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
        <td>showAnswers</td>
        <td>---</td>
        <td>Shows the addon answers.</td>
    </tr>
    <tr>
        <td>hideAnswers</td>
        <td>---</td>
        <td>Hides the addon answers.</td>
    </tr>
    <tr>
        <td>enable</td>
        <td>---</td>
        <td>Enables the addon.</td>
    </tr>
    <tr>
        <td>disable</td>
        <td>---</td>
        <td>Disables the addon.</td>
    </tr>
</table>

## Events

> Events are only available if the 'type' property has the 'activity' value chosen.

The MathText addon sends ValueChanged event when the user answer changed and state of scores is updated.

<table border='1'>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Item</td>
        <td>0</td>
    </tr>
    <tr>
        <td>Value</td>
        <td>1</td>
    </tr>
    <tr>
        <td>Score</td>
        <td>1 when the addon has a correct answer, otherwise 0</td>
    </tr>
</table>

## Advanced Connector integration

Each command supported by MathText addon can be used in the Advanced Connector addon scripts. 
The below example shows how to show or hide the addon according to the Double State Button module's state.

    EVENTSTART
    Source:DoubleStateButton1
    Value:1
    SCRIPTSTART
        var module = presenter.playerController.getModule('MathText1');
        module.show();
	SCRIPTEND
    EVENTEND
    
	EVENTSTART
    Source:DoubleStateButton1
    Value:0
    SCRIPTSTART
        var module = presenter.playerController.getModule('MathText1');
        module.hide();
	SCRIPTEND
    EVENTEND

## CSS classes

<table border='1'>
    <tr>
        <th>Class name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>.mathtext-editor-wrapper</td>
        <td>Class for the div wrapping addon editor or div wrapping SVG.</td>
    </tr>
    <tr>
        <td>.mathtext-editor-wrapper .wrong</td>
        <td>Class for the addon solved incorrectly.</td>
    </tr>
    <tr>
        <td>.mathtext-editor-wrapper .correct</td>
        <td>Class for the addon solved correctly.</td>
    </tr>
    <tr>
        <td>.mathtext-editor-popup-wrapper</td>
        <td>Class for the div wrapping contents of popup.</td>
    </tr>
    <tr>
        <td>.mathtext-editor-popup-editor</td>
        <td>Class for the div wrapping editor in popup.</td>
    </tr>
    <tr>
        <td>.mathtext-editor-popup-buttons</td>
        <td>Class for the div wrapping buttons in popup.</td>
    </tr>
    <tr>
        <td>.mathtext-editor-popup-buttons .cancel-button</td>
        <td>Class for the cancel button in popup.</td>
    </tr>
    <tr>
        <td>.mathtext-editor-popup-buttons .save-button</td>
        <td>Class for the save button in popup.</td>
    </tr>
</table>

## Demo presentation

N/A
