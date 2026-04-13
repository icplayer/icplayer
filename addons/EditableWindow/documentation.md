<h2>Description</h2>

<p>The Editable Window module displays external content within a number of possibilities in a popup window that can be moved and enlarged across the entire lesson area.</p>


<h2>Properties</h2>

<p>The list starts with the common properties. Learn more about them by visiting the <a href="/doc/en/page/Modules-description" target="_blank" rel="noopener noreferrer">Modules description</a> section. The other available properties are described below.</p>

<table border='1'>
    <tbody>
        <tr>
            <th>Property name</th>
            <th>Description</th>
        </tr>
        <tr>
            <td>Title</td>
            <td>Title displayed on the header.</td>
        </tr>
        <tr>
            <td>Text</td>
            <td>Text displayed by the module. To display text, remember to check the "Text editor content" property.</td>
        </tr>
        <tr>
            <td>Text editor content</td>
            <td>If checked, the module will display the text configured in the Text property.</td>
        </tr>
        <tr>
            <td>Header style</td>
            <td>Allows to apply a style defined in the CSS.</td>
        </tr>
        <tr>
            <td>File list</td>
            <td>List of files (images, etc.) used by the index file (set in the Index file property).</td>
        </tr>
        <tr>
            <td>Index file</td>
            <td>File (e.g., HTML) to be displayed. It displays only if the "Text editor content" is not checked.</td>
        </tr>
        <tr>
            <td>Audio file</td>
            <td>Audio file to be played in the module. It displays only if "Text editor content" is not checked and the index file is not provided.</td>
        </tr>
        <tr>
            <td>Video file</td>
            <td>Video file to be played in the module. It displays only if "Text editor content" is not checked and the index file and audio file are not provided.</td>
        </tr>
        <tr>
            <td>Editing enabled</td>
            <td>If checked, it will be possible for the user to edit the contents of the popup.</td>
        </tr>
        <tr>
            <td>Disable resize height</td>
            <td>If checked, changing the height of the popup will not be possible.</td>
        </tr>
        <tr>
            <td>Offline message</td>
            <td>This message will be displayed if the module was configured to display an online video resource, but there's no internet access.</td>
        </tr>
        <tr>
            <td>Speech texts</td>
            <td>Sets the values of speech texts - predefined phrases providing additional context while using the module in the <a href="/doc/en/page/Text-To-Speech" target="_blank" rel="noopener noreferrer">Text To Speech</a> mode. Speech texts are always read using the content's default language.</td>
        </tr>
        <tr>
            <td>Lang attribute</td>
            <td>This property allows defining the language for this module (different than the language of the lesson).</td>
        </tr>
    </tbody>
</table>


<h2>Events</h2>

<p>The Editable Window module sends the ValueChanged events when the window is moved or closed.</p>

<table border='1'>
    <tbody>
        <tr>
            <th>Field Name</th>
            <th>Description</th>
        </tr>
        <tr>
            <td>Value</td>
            <td>'move-editable-windows' if the window was moved, or 'close' if it was closed.</td>
        </tr>
    </tbody>
</table>


<h2>Supported commands</h2>

<table border='1'>
    <tbody>
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
            <td>Returns <i>true</i> if visible.</td>
        </tr>
        <tr>
            <td>centerPosition</td>
            <td>---</td>
            <td>Centers the position of the module's popup.</td>
        </tr>
        <tr>
            <td>openPopup</td>
            <td>---</td>
            <td>Opens the module's popup.</td>
        </tr>
    </tbody>
</table>

<h2>Support of Math expressions</h2>

The addon supports <a href="/doc/en/MathJax/page/Math-expressions" target="_blank" rel="noopener noreferrer">Math expressions</a> only when the "Text editor content" property is checked and "Editing enabled" is unchecked.