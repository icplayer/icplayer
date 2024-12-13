## Description

The Paragraph eKeyboard module allows a student to enter a free form text. It also allows providing basic formatting in a WYSIWYG way (similar to MS Word and other rich text editors) and entering national chars from the virtual keyboard attached to a text field.

## Properties

The list starts with the common properties, learn more about them by visiting the [Modules description](https://www.mauthor.com/doc/en/page/Modules-description) section. The other available properties are described below.

<table border="1">
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Default font family</td>
        <td>Set the default font family for the editor body. The value should be expressed in the same way as in CSS. It is a comma separated list of font names. <br/>For example: Helvetica, Arial, Verdana. <br/>For more information, visit <a href="http://www.w3schools.com/cssref/pr_font_font-family.asp">http://www.w3schools.com/cssref/pr_font_font-family.asp</a>.</td>
    </tr>
    <tr>
        <td>Default font size</td>
        <td>Set the default font size for the editor body. The value should be expressed in the same way as in CSS. It is a numeric value with a unit. <br/>For example: 14px, 3em.<br/>For more information, please visit <a href="http://www.w3schools.com/cssref/pr_font_font-size.asp">http://www.w3schools.com/cssref/pr_font_font-size.asp</a>.</td>
    </tr>
    <tr>
        <td>Hide toolbar</td>
        <td>Hides a toolbar and so extends the editable area space.</td>
    </tr>
    <tr>
        <td>Editable placeholder</td>
        <td>Makes placeholder editable, so it's contents will not be cleared on the focus on the module.</td>
    </tr>
    <tr>
        <td>Custom toolbar</td>
        <td>Enables to define a custom toolbar. Below is a list of all available toolbar/menu controls that you can add to your Paragraph addon:<br><br>
            newdocument bold italic underline strikethrough alignleft aligncenter alignright alignjustify styleselect formatselect fontselect fontsizeselect bullist numlist outdent indent blockquote undo redo removeformat subscript superscript<br><br>
            <strong>Note:</strong> Use pipe "|" to group buttons.
        </td>
    </tr>
    <tr>
        <td>Placeholder text</td>
        <td>This property enables you to specify a free text content to be used as a placeholder. Allows for html styling.</td>
    </tr>
    <tr>
        <td>Custom CSS</td>
        <td>This property enables you to specify a separate file with custom CSS styles that extend the main CSS content. This CSS file is the one used within the editor (the editable area).<br /> If "Default font family" and "Default font size" are defined, they have higher priority than styles used in Custom CSS file.
            <p><em>This property allows online resources. <a href="/doc/page/Online-resources">Find out more »</a></em></p>
        </td>
    </tr>
    <tr>
        <td>Use Custom CSS files</td>
        <td>This property allows the use of resources defined in the CSS file specified in the “Custom CSS” property.
            <br>
            <b>It is required that the files listed in the file in “Custom CSS” property are added as assets to the lesson.</b>
        </td> 
    </tr>
    <tr>
        <td>Keyboard Layout Type</td>
        <td>Type of the eKeyboard layout. You can choose one of the standard layouts: French, German and Spanish special characters or Custom which means you can set whatever Layout you like by configuring Custom Layout field.
        </td>
    </tr>
    <tr>
        <td>Custom Keyboard Layout</td>
        <td>Buttons should be space separated, group of buttons (rows) should be new line separated. Layout object has to have at least a "default" property with standard keyboard. The following action keys are supported: 
            <ul>
                <li>{shift} – used as CapsLock</li>
                <li>{empty} – used as an empty space</li>
            </ul>
        </td>
    </tr>
    <tr>
        <td>Keyboard Position</td>
        <td>Position of the Keyboard in relation to the text field. If position is right or left, the keyboard layout will be transposed. If position is set as Custom, you have to specify the position by presentation CSS styles.
        </td>
    </tr>
    <tr>
        <td>Manual grading</td>
        <td>Selecting this Paragraph's property allows the teacher to manually grade the Paragraph’s content when the lesson is part of the submitted Assignment. The Paragraph can be instantly viewed by the teacher in the Assignment's results on the LMS and possibly be verified without previewing the lesson. If selected, the value of `weight` property will be treated as max score.</td>
    </tr>
    <tr>
        <td>Show answers</td>
        <td>Text to display on Show Answers.</td>
    </tr>
    <tr>
        <td>Title</td>
        <td>The title of the Paragraph visible when the Assignment’s open activities are manually graded on mCourser. The title is visible above each Paragraph's preview, however, it is not visible in the lesson itself.</td>
    </tr>
    <tr>
        <td>Weight</td>
        <td>The maximum number of points the teacher can grant when grading the Assignment's open activities. This can be only a whole number in range from 0 to 100. The default Paragraph’s weight equals 1. If the `Manual grading` property is selected, this value will be used as the max score.</td>
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
        <td>hides the module</td> 
    </tr>
    <tr>
        <td>show</td>
        <td>---</td>
        <td>shows the module</td> 
    </tr>
    <tr>
        <td>isVisible</td>
        <td>---</td>
        <td>returns true if module is visible, otherwise false</td> 
    </tr>
    <tr>
        <td>lock</td>
        <td>---</td>
        <td>locks the module, hiding it's contents and disabling edition</td> 
    </tr>
    <tr>
        <td>unlock</td>
        <td>---</td>
        <td>unlocks the module, displaying it's contents and enabling edition</td> 
    </tr>
    <tr>
        <td>getText</td>
        <td>---</td>
        <td>returns module content</td> 
    </tr>
    <tr>
        <td>setText</td>
        <td>text</td>
        <td>sets the content of the module to the text given as parameter</td> 
    </tr>
    <tr>
        <td>isAttempted</td>
        <td>---</td>
        <td>returns true if any text was inserted</td> 
    </tr>
    <tr>
        <td>isAIReady</td>
        <td>---</td>
        <td>Returns true if model AI is ready to score addon.</td> 
    </tr>
</table>

## Scoring

Paragraph thanks to `Open Activity` functionality can be scored by AI and/or Teacher. 
To activate scoring addon must have the `Manual grading` property selected.

<table border='1'>
<tbody>
    <tr>
        <th>Property</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>maxScore</td>
        <td>Equal to the value provided in `Weight` propety.<br>
            If `Manual grading` property is not selected then returns 0.
        </td>
    </tr>
    <tr>
        <td>score</td>
        <td>Content of addon can be scored by Teacher and AI.<br>
            If `Manual grading` property is not selected then returns 0.<br>
            If addon was scored by Teacher and AI, then use score provided by Teacher.<br>
            If addon was neither scored by Teacher and AI, then score will be equal to 0.
        </td>
    </tr>
    <tr>
        <td>errorCount</td>
        <td>Always returns 0.</td>
    </tr>
</tbody>
</table>

## Events

<table border='1'>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Value</td>
        <td>blur - event send on exiting the module</td>
    </tr>
</table>

## CSS Classes

<table border='1'>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
	<tr>
        <td>.paragraph-keyboard-wrapper</td>
        <td>Simple addon wrapper</td>
    </tr>
	<tr>
        <td>.paragraph-wrapper</td>
        <td>Simple wrapper for Text editor.</td>
    </tr>
	<tr>
        <td>.paragraph-keyboard</td>
        <td>Layer with eKeyboard.</td>
    </tr>
	<tr>
        <td>.paragraph-keyboard-letter</td>
        <td>Standard keyboard letter.</td>
    </tr>
	<tr>
        <td>.paragraph-keyboard-empty</td>
        <td>Empty field on keyboard.</td>
    </tr>
	<tr>
        <td>.paragraph-keyboard-letter.clicked</td>
        <td>Style appears when a letter is clicked.</td>
    </tr>
	<tr>
        <td>.paragraph-keyboard-shift</td>
        <td>Style for CapsLock button.</td>
    </tr>
	<tr>
        <td>.paragraph-keyboard-shift.clicked</td>
        <td>Style when CapsLock button is clicked.</td>
    </tr>
</table>

## Demo presentation
[Demo presentation](/embed/4724619291394048 "Demo presentation") contains examples of the Paragraph eKeyboard addon's usage.              
