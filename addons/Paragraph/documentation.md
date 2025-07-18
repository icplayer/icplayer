## Description

The Paragraph module allows the user to enter a free-form text. It also allows providing basic formatting in a WYSIWYG way (similar to MS Word and other rich text editors).

## Properties

The list starts with the common properties, learn more about them by visiting the [Modules description](https://www.mauthor.com/doc/en/page/Modules-description) section. The other available properties are described below.

<table border="1">
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Default font family</td>
        <td>Set the default font family for the editor's body. The value should be expressed in the same way as in the CSS. It is a comma-separated list of font names.
            <br/>For example: Helvetica, Arial, Verdana.
            <br/>For more information, visit:
            <br/><a href="http://www.w3schools.com/cssref/pr_font_font-family.asp">http://www.w3schools.com/cssref/pr_font_font-family.asp</a>
        </td>
    </tr>
    <tr>
        <td>Default font size</td>
        <td>Set the default font size for the editor's body. The value should be expressed in the same way as in the CSS. It is a numeric value with a unit.<br/>For example: 14px, 3em.<br/>For more information, please visit: 
            <br/><a href="http://www.w3schools.com/cssref/pr_font_font-size.asp">http://www.w3schools.com/cssref/pr_font_font-size.asp</a>
        </td>
    </tr>
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
        <td>Enables to define a custom toolbar. Below is a list of all available toolbar/menu controls that you can add to your Paragraph module:<br><br>
            newdocument bold italic underline strikethrough alignleft aligncenter alignright alignjustify styleselect formatselect fontselect fontsizeselect bullist numlist outdent indent blockquote undo redo removeformat subscript superscript<br><br>
            <strong>Note:</strong> Use pipe "|" to group buttons.
        </td>
    </tr>
    <tr>
        <td>Custom CSS</td>
        <td>This property lets you specify a separate file with custom CSS styles extending the main CSS content. This CSS file is used within the editor (the editable area).<br /> If "Default font family" and "Default font size" are defined, they have higher priority than styles used in the "Custom CSS" file.
            <p><em>This property allows online resources. <a href="/doc/page/Online-resources">Find out more »</a></em></p>
        </td>
    </tr>
    <tr>
        <td>Use Custom CSS files</td>
        <td>This property allows the use of resources defined in the CSS file specified in the “Custom CSS” property.
            <br>
            <b>It is required that the files listed in the file in “Custom CSS” property are added as assets to the lesson.</b>
            <br>
            <em>In case this property was selected first and then a CSS file was added to the “Custom CSS” property, the list of assets will be updated automatically. Functionality does not yet work with <a href="/doc/page/Updating-assets">Update assets »</a>.</em>
        </td> 
    </tr>
    <tr>
        <td>Placeholder text</td>
        <td>This property enables you to specify free text content to be used as a placeholder in the Paragraph. Allows for HTML styling.
        </td>
    </tr>
    <tr>
        <td>Layout Type</td>
        <td>Choose the "Default" or "French" layout.</td>
    </tr>
    <tr>
        <td>Manual grading</td>
        <td>Selecting this Paragraph's property allows the teacher to manually grade the Paragraph’s content when the lesson is part of the submitted Assignment. The Paragraph can be instantly viewed by the teacher in the Assignment's results on the LMS and possibly be verified without previewing the lesson. If selected, the value of `weight` property will be treated as max score.</td>
    </tr>
    <tr>
        <td>Show Answers</td>
        <td>A list of correct answers. On Show Answers, all correct answers are displayed at the same time, each answer separated by a new line. On Gradual Show Answers, correct answers are displayed gradually, one after another, each time a Gradual Show Answers event is triggered.</td>
    </tr>
    <tr>
        <td>Title</td>
        <td>The title of the Paragraph is visible when the Assignment’s open activities are manually graded on mCourser. The title is visible above each Paragraph's preview; however, it is not visible in the lesson itself.</td>
    </tr>
    <tr>
        <td>Weight</td>
        <td>The maximum number of points the teacher can grant when grading the Assignment's open activities. This can be only a whole number in range from 0 to 100. The default Paragraph’s weight equals 1. If the `Manual grading` property is selected, this value will be used as the max score.</td>
    </tr>
    <tr>
        <td>Printable</td>
        <td>Allows to choose if the module should be included in the <a href="/doc/en/page/Marking-elements-that-should-be-included-in-the-printout">printout</a>.</td>
    </tr>
    <tr>
        <td>Speech texts</td>
        <td>Sets the values of speech texts - predefined phrases providing additional context while using the module in the Text To Speech mode. Speech texts are always read using the content's default language.</td>
    </tr>
    <tr>
        <td>Lang attribute</td>
        <td>This property allows defining the language for this module (different than the language of the lesson).</td>
    </tr>
    <tr>
        <td>Block in error checking mode</td>
        <td>If this option is selected, the module is blocked in the error checking mode.</td>
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
        <td>getText</td>
        <td>---</td>
        <td>Returns module's content.</td> 
    </tr>
    <tr>
        <td>setText</td>
        <td>text</td>
        <td>Sets the content of the module to the text given as parameter.</td> 
    </tr>
    <tr>
        <td>isAttempted</td>
        <td>---</td>
        <td>Returns true if any text was inserted.</td> 
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
        <td>isAIReady</td>
        <td>---</td>
        <td>Returns true if model AI is ready to score addon.</td> 
    </tr>
</table>

## Scoring

Paragraph thanks to `Open Activity` functionality can be scored by AI and/or Teacher. 
To activate scoring addon must have the `Manual grading` property selected.
At this point, addon supports only the default way of <a href="https:/doc/page/Activity-scoring">Activity scoring</a>, that is, when:
* <b>Score Type</b> in page is set to <b>percentage</b>.
* If <a href="/doc/page/Grouping-modules">addon belongs to group</a> then <b>Group scoring</b> in group is set to <b>Default</b>.

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
            If <b>Manual grading</b> property is not selected then returns 0.
        </td>
    </tr>
    <tr>
        <td>score</td>
        <td>Content of addon can be scored by Teacher and AI.<br>
            If <b>Manual grading</b> property is not selected then returns 0.<br>
            If addon was scored by Teacher and AI, then use score provided by Teacher.<br>
            If addon was neither scored by Teacher and AI, then score will be equal to <b>maxScore</b>.
        </td>
    </tr>
    <tr>
        <td>errorCount</td>
        <td>Always returns 0.</td>
    </tr>
</tbody>
</table>

## Events
The <b>blur</b> event occurs on exiting the module.

<table border='1'>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Item</td>
        <td>N/A</td>
    </tr>
    <tr>
        <td>Value</td>
        <td>blur</td>
    </tr>
    <tr>
        <td>Item</td>
        <td>N/A</td>
    </tr>
</table>

<b>Note:</b> Which event (<b>empty</b> or <b>modified</b>) will be sent depends on the result of the <b>isAttempted</b> 
command. That is, if an addon has the <b>Placeholder text</b> property defined and the <b>Editable placeholder</b> 
property checked, then as long as the text in the editor is the same as from the placeholder, it will be treated as 
<b>empty</b>.

The <b>empty</b> event occurs:
<ul>
    <li>after a reset,</li>
    <li>after <b>blur</b> event, when module content has not been modified,</li> 
    <li>before lesson's page close when it had no content, e.g., due to a switch to another lesson page.</li>
</ul>

<table border='1'>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Item</td>
        <td>N/A</td>
    </tr>
    <tr>
        <td>Value</td>
        <td>empty</td>
    </tr>
    <tr>
        <td>Score</td>
        <td>N/A</td>
    </tr>
</table>

The <b>modified</b> event occurs after <b>blur</b> event, when module content has been modified. 

<table border='1'>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Item</td>
        <td>N/A</td>
    </tr>
    <tr>
        <td>Value</td>
        <td>modified</td>
    </tr>
    <tr>
        <td>Score</td>
        <td>N/A</td>
    </tr>
</table>

## Demo presentation
[Demo presentation](/embed/5136219777269760 "Demo presentation") contains examples of the Paragraph addon's usage.                
