## Description

The Paragraph eKeyboard module allows a student to enter a free form text. It also allows providing basic formatting in a WYSIWYG way (similar to MS Word and other rich text editors) and entering national chars from the virtual keyboard attached to a text field.

## Properties

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
      <td>Custom toolbar</td>
      <td>Enables to define a custom toolbar. Below is a list of all available toolbar/menu controls that you can add to your Paragraph addon:<br><br>
newdocument bold italic underline strikethrough alignleft aligncenter alignright alignjustify styleselect formatselect fontselect fontsizeselect bullist numlist outdent indent blockquote undo redo removeformat subscript superscript<br><br>
<strong>Note:</strong> Use pipe "|" to group buttons.
</td>
    </tr>
    <tr>
      <td>Custom CSS</td>
      <td>This property enables you to specify a separate file with custom CSS styles that extend the main CSS content. This CSS file is the one used within the editor (the editable area).<br /> If "Default font family" and "Default font size" are defined, they have higher priority than styles used in Custom CSS file.
<p><em>This property allows online resources. <a href="/doc/page/Online-resources">Find out more »</a></em></p>
</td>
    </tr>
    <tr>
      <td>Keyboard Layout Type</td>
      <td>Type of the eKeyboard layout. You can choose one of the standard layouts: French, German and Spanish special characters or Custom which means you can set whatever Layout you like by configuring Custom Layout field.
</td>
    </tr>
    <tr>
      <td>Custom Keyboard Layout</td>
      <td>Buttons should be space separated, group of buttons (rows) should be new line separated. Layout object has to have at least a "default" property with standard keyboard. The following action keys are supported: <ul>
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

</table>

## Supported commands

This module does not provide any commands.

## Scoring

This module does not provide any score information.

## Events

This module does not generate any events.     

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
    </tr>
	<tr>
        <td>.paragraph-wrapper</td>
        <td>Simple wrapper for Text editor.</td>
    </tr>
    </tr>
	<tr>
        <td>.paragraph-keyboard</td>
        <td>Layer with eKeyboard.</td>
    </tr>
    </tr>
	<tr>
        <td>.paragraph-keyboard-letter</td>
        <td>Standard keyboard letter.</td>
    </tr>
    </tr>
	<tr>
        <td>.paragraph-keyboard-empty</td>
        <td>Empty field on keyboard.</td>
    </tr>
    </tr>
	<tr>
        <td>.paragraph-keyboard-letter.clicked</td>
        <td>Style appears when a letter is clicked.</td>
    </tr>
    </tr>
	<tr>
        <td>.paragraph-keyboard-shift</td>
        <td>Style for CapsLock button.</td>
    </tr>
    </tr>
	<tr>
        <td>.paragraph-keyboard-shift.clicked</td>
        <td>Style when CapsLock button is clicked.</td>
    </tr>
</table>

## Demo presentation
[Demo presentation](/embed/4724619291394048 "Demo presentation") contains examples of the Paragraph eKeyboard addon's usage.              