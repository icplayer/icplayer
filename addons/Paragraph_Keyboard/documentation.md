## Description

The Paragraph eKeyboard module allows the user to enter free-form text. It also allows providing basic formatting in a WYSIWYG way (similar to MS Word and other rich text editors) and entering national characters from the virtual keyboard attached to the text field.


## Properties

The list starts with the common properties. Learn more about them by visiting the <a href="/doc/en/page/Modules-description" target="_blank" rel="noopener noreferrer">Modules description</a> section. The other available properties are described below.

<table border="1">
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Default font family</td>
        <td>Set the default font family for the editor's body. The value should be expressed in the same way as in the CSS. It is a comma-separated list of font names.
            <br />For example: Helvetica, Arial, Verdana.
            <br />For more information, visit: <a href="https://www.w3schools.com/cssref/pr_font_font-family.asp" target="_blank" rel="noopener noreferrer">https://www.w3schools.com/cssref/pr_font_font-family</a>.
        </td>
    </tr>
    <tr>
        <td>Default font size</td>
        <td>Set the default font size for the editor's body. The value should be expressed in the same way as in the CSS. It is a numeric value with a unit.<br />For example: 14px, 3em.<br />For more information, please visit: <a href="https://www.w3schools.com/cssref/pr_font_font-size.asp" target="_blank" rel="noopener noreferrer">https://www.w3schools.com/cssref/pr_font_font-size</a>.
        </td>
    <tr>
        <td>Hide toolbar</td>
        <td>Hides the toolbar and thus extends the editable area.</td>
    </tr>
    <tr>
        <td>Editable placeholder</td>
        <td>Makes placeholder editable, so its contents will not be cleared on focus on the module.</td>
    </tr>
        <tr>
        <td>Custom toolbar</td>
        <td>Enables defining a custom toolbar. Below is a list of all available toolbar/menu controls that you can add to your Paragraph eKeyboard module:<br><br>
            newdocument bold italic underline strikethrough alignleft aligncenter alignright alignjustify styleselect
            formatselect fontselect fontsizeselect bullist numlist outdent indent blockquote undo redo removeformat
            subscript superscript<br><br>
            <strong>Note:</strong> Use pipe "|" to group buttons.
        </td>
    </tr>
    <tr>
        <td>Placeholder text</td>
        <td>This property enables specifying free text content to be used as a placeholder in the Paragraph eKeyboard. Allows for HTML styling.
        </td>
    <tr>
        <td>Custom CSS</td>
        <td>This property lets you specify a separate file with custom CSS styles extending the main CSS content. This CSS file is used within the editor (the editable area). <br /> If "Default font family" and "Default font size" are defined, they have higher priority than styles used in the "Custom CSS" file.
            <p><em>This property allows online resources. <a href="/doc/page/Online-resources" target="_blank" rel="noopener noreferrer">Find out more »</a></em>
            </p>
        </td>
    </tr>
    <tr>
        <td>Use Custom CSS files</td>
        <td>This property allows the use of resources defined in the CSS file specified in the “Custom CSS” property.
            <br>
            <b>It is required that the files listed in the file in “Custom CSS” property are added as assets to the lesson.</b>
            <br>
            <em>In case this property was selected first and then a CSS file was added to the “Custom CSS” property, the list of assets will be updated automatically. Functionality does not yet work with <a href="/doc/page/Updating-assets" target="_blank" rel="noopener noreferrer">Update assets »</a></em>
        </td>
    </tr>
    <tr>
        <td>Keyboard Layout Type</td>
        <td>Type of the eKeyboard layout. You can choose one of the standard layouts: French, German, and Spanish special characters, or Custom, which means you can set whatever Layout you like by configuring the Custom Layout field.
        </td>
    </tr>
    <tr>
        <td>Custom Keyboard Layout</td>
        <td>Buttons should be space-separated, groups of buttons (rows) should be separated by a new line. The layout object must have at least a "default" property with a standard keyboard. The following action keys are supported: 
            <ul>
                <li>{shift} - used as CapsLock</li>
                <li>{empty} - used as an empty space</li>
            </ul>
            Alternative texts can be configured for buttons. See section <b>Layout with alternative texts</b> for details. For more general information, visit: <a href="/doc/page/Alternative-texts" target="_blank" rel="noopener noreferrer">Alternative texts »</a>.
        </td>
    </tr>
    <tr>
        <td>Keyboard Position</td>
        <td>Position of the Keyboard concerning the text field. If the position is right or left, the keyboard layout will be transposed. If the position is set as Custom, you must specify the position by presentation CSS styles.
        </td>
    </tr>
    <tr>
        <td>Manual grading</td>
        <td>Selecting this Paragraph eKeyboard's property allows the teacher to manually grade the module's content when the lesson is part of the submitted Assignment. The Paragraph eKeyboard can be instantly viewed by the teacher in the Assignment's results on the LMS and possibly verified without previewing the lesson. If selected, the value of the "weight" property will be treated as the max score. </td>
    </tr>
    <tr>
        <td>Show answers</td>
        <td>Text to display on Show Answers.</td>
    </tr>
    <tr>
        <td>Title</td>
        <td>The title of the Paragraph eKeyboard is visible when the Assignment's open activities are manually graded on mCourser. The title is visible above each Paragraph eKeyboard's preview; however, it is not visible in the lesson itself.</td>
    </tr>
    <tr>
        <td>Weight</td>
        <td>The maximum number of points the teacher can grant when grading the Assignment's open activities. This can only be a whole number in the range from 0 to 100. The default Paragraph eKeyboard's weight equals 1. If the `Manual grading` property is selected, this value will be used as the max score.</td>
    </tr>
    <tr>
        <td>Speech texts</td>
        <td>Sets the values of speech texts - predefined phrases providing additional context while using the module in the <a href="/doc/en/page/Text-To-Speech" target="_blank" rel="noopener noreferrer">Text To Speech</a> mode. Speech texts are always read using the content's default language.</td>
    </tr>
    <tr>
        <td>Lang attribute</td>
        <td>This property allows defining the language for this module (different than the language of the lesson).</td>
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
        <td>Hides the module if it is visible.</td> 
    </tr>
    <tr>
        <td>show</td>
        <td>---</td>
        <td>Shows the module if it is hidden.</td> 
    </tr>
    <tr>
        <td>isVisible</td>
        <td>---</td>
        <td>Returns true if the module is visible, otherwise false.</td> 
    </tr>
    <tr>
        <td>lock</td>
        <td>---</td>
        <td>Covers the module with the mask.</td> 
    </tr>
    <tr>
        <td>unlock</td>
        <td>---</td>
        <td>Removes the mask from the module.</td> 
    </tr>
    <tr>
        <td>getText</td>
        <td>---</td>
        <td>Returns module's content.</td> 
    </tr>
    <tr>
        <td>setText</td>
        <td>text</td>
        <td>Sets the content of the module to the text given as a parameter.</td>
    </tr>
    <tr>
        <td>isAttempted</td>
        <td>---</td>
        <td>Returns true if any text was inserted.</td>
    </tr>
    <tr>
        <td>isAIReady</td>
        <td>---</td>
        <td>Returns true if the model AI is ready to score the module.</td>
    </tr>
</table>


## Scoring

The Paragraph eKeyboard, thanks to the `Open Activity` functionality, can be scored by AI and/or a teacher. To activate the scoring, the module must have the `Manual grading` property selected. At this point, the module supports only the default way of <a href="https:/doc/page/Activity-scoring" target="_blank" rel="noopener noreferrer">Activity scoring</a>, that is, when:
<ul>
    <li><b>Score Type</b> in page is set to <b>percentage</b>.</li>
    <li>If the <a href="https://www.mauthor.com/doc/page/Grouping-modules" target="_blank" rel="noopener noreferrer">module belongs to a group</a> then the <b>Group scoring</b> in the group is set to <b>Default</b>.</li>
</ul>

With other settings, the scoring will be miscalculated.

<table border='1'>
    <tbody>
        <tr>
            <th>Property</th>
            <th>Description</th>
        </tr>
        <tr>
            <td>maxScore</td>
            <td>Equal to the value provided in <b>Weight</b> property.<br>
                If <b>Manual grading</b> property is not selected, then it returns 0.
            </td>
        </tr>
        <tr>
            <td>score</td>
            <td>Content of the module can be scored by the teacher and AI. <br>
                If <b>Manual grading</b> property is not selected, then it returns 0. <br>
                If the module was scored by the teacher and AI, then use the score provided by the teacher. <br>
                If the module was neither scored by the teacher nor AI, then the score will be equal to <b>maxScore</b>.
            </td>
        </tr>
        <tr>
            <td>errorCount</td>
            <td>Always returns 0.</td>
        </tr>
    </tbody>
</table>


## Layout with alternative texts

The addon supports alternative text only for the Custom Keyboard Layout property. Alternative text is assigned to specific keyboard keys. Please note that the assigned alternative text (and the underlying structure providing it) is not transferred to the editor along with the button's content.

Compared to other instances of alternative text, the following limitations apply:
<ol>
    <li>The visible text (text_shown from the pattern <code>\alt{text_shown|text_read}[lang lang_attribute])</code> cannot contain whitespace characters. However, the alternative text (text_read) may include spaces.</li>
    <li>A single key cannot contain multiple alternative text definitions. For example, <code>\alt{text_shown1|text_read1}\alt{text_shown2|text_read2}</code> will not work.</li>
</ol>

Usage example:

    {
        'default': ['{shift} \alt{Ø|Zbiór pusty}[lang pl] \alt{N|Zbiór liczb naturalnych}[lang pl] \alt{C|Zbiór liczb całkowitych}[lang pl]'],
        'shift' : ['{shift} \alt{α|Alfa} \alt{β|Beta} \alt{γ|Gamma} \alt{Δ|Delta} \alt{λ|Lambda} \alt{π|Pi}']
    }

## Events

<table border='1'>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Value</td>
        <td>blur - event sent on exiting the module.</td>
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
        <td>Simple module wrapper.</td>
    </tr>
	<tr>
        <td>.paragraph-wrapper</td>
        <td>Simple wrapper for the text editor.</td>
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

<a href="https://www.mauthor.com/present/8228456600440666" target="_blank" rel="noopener noreferrer">Demo presentation</a> contains examples of how to use the Paragraph eKeyboard module. 