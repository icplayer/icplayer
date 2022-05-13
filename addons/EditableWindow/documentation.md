## Description
Editable window displays external content in a popup window - text, file, video or audio.

## Properties

<table border='1'>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Text</td>
        <td>Text displayed by the addon. To display text remember to tick "Text editor content" property.</td>
    </tr>
    <tr>
        <td>Text editor content</td>
        <td>If marked then addon will be primarily displaying text.</td>
    </tr>
    <tr>
        <td>File list</td>
        <td>List of files(images etc.) that feeds index file(HTML).</td>
    </tr>
    <tr>
        <td>Index file</td>
        <td>File(e.g. HTML) to be displayed. If text editor content is not marked then this is first to be displayed in addon.</td>
    </tr>
    <tr>
        <td>Audio file</td>
        <td>Audio file to be played in addon. Displays only if text editor content is not marked and index file is not provided.</td>
    </tr>
    <tr>
        <td>Video file</td>
        <td>Video file to be played in addon. Displays only if text editor content is not marked and index file and audio file are not provided.</td>
    </tr>
    <tr>
        <td>Speech texts</td>
        <td>List of speech texts provided to Text to Speech addon.</td>
    </tr>
    <tr>
        <td>Lang attribute</td>
        <td>This property allows to define the language for this addon (different than the language of the lesson).</td> 
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
        <td>Shows the addon</td>
    </tr>
    <tr>
        <td>hide</td>
        <td>---</td>
        <td>Hides the addon</td>
    </tr>
    <tr>
        <td>isVisible</td>
        <td>---</td>
        <td>Returns true if visible</td>
    </tr>
    <tr>
        <td>centerPosition</td>
        <td>---</td>
        <td>Centers the position of addon popup</td>
    </tr>
    <tr>
        <td>openPopup</td>
        <td>---</td>
        <td>Opens addon popup</td>
    </tr>
</table>