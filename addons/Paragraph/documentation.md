## Description

The Paragraph module allows a student to enter a free form text. It also allows providing basic formatting in a WYSIWYG way (similar to MS Word and other rich text editors).

## Properties

<table border="1">
    <tr>
      <th>Property name</th>
      <th>Description</th>
    </tr>
    <tr>
      <td>Default font family</td>
      <td>Set the default font family for the editor body. The value should be expressed in the same way as in CSS. It is a comma separated list of font names. <br/>For example: Helvetica, Arial, Verdana. <br/>For more information, visit <a href="http://www.w3schools.com/cssref/pr_font_font-family.asp">http://www.w3schools.com/cssref/pr_font_font-family.asp</a></td>
    </tr>
    <tr>
      <td>Default font size</td>
      <td>Set the default font size for the editor body. The value should be expressed in the same way as in CSS. It is a numeric value with a unit. <br/>For example: 14px, 3em.<br/>For more information, please visit <a href="http://www.w3schools.com/cssref/pr_font_font-size.asp">http://www.w3schools.com/cssref/pr_font_font-size.asp</a></td>
    </tr>
    <tr>
      <td>Hide toolbar</td>
      <td>Hides a toolbar and so extends the editable area space</td>
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
      <td>Placeholder text</td>
      <td>This property enables you to specify a free text content to be used as a placeholder in Paragraph. Allows for html styling.
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
        <td>shows the module</td> 
    </tr>
    <tr>
        <td>hide</td>
        <td>---</td>
        <td>hides the module</td> 
    </tr>
    <tr>
        <td>isVisible</td>
        <td>---</td>
        <td>returns true if module is visible, otherwise false</td> 
    </tr>
    <tr>
        <td>getText</td>
        <td>---</td>
        <td>returns module content</td> 
    </tr>
    <tr>
        <td>isAttempted</td>
        <td>---</td>
        <td>returns true if any text was inserted</td> 
    </tr>
</table>

## Scoring

This module does not provide any score information.

## Events

This module does not generate any events.     

## Demo presentation
[Demo presentation](/embed/5136219777269760 "Demo presentation") contains examples of the Paragraph addon's usage.                