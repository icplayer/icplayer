## Description
File sender allows you to save files within the lesson or send them as messages to the student's teacher using the appropriate LMS service.

In case that the addon did not receive the necessary metadata from the LMS, it will be displayed but inactive.

## Properties

<table border='1'>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Source Id</td>
        <td>Id of the module whose contents will be sent. If content type is set to File, this property should be empty.</td>
    </tr>
    <tr>
        <td>Source type</td>
        <td>Specifies the type of the source: a Paragraph addon, a Media Recorder addon, or a file sent by the user.</td>
    </tr>
    <tr>
        <td>Button text</td>
        <td>Text on the send button</td>
    </tr>
    <tr>
        <td>Dialog title</td>
        <td>Title of the dialog displaying the teachers' list</td>
    </tr>
    <tr>
        <td>Disable send button</td>
        <td>If checked, it will not be possible to send the file to a teacher (although it will still be saved in the lesson) and the the Send button will be hidden.</td>
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
        <td>showTeacherList</td>
        <td>---</td>
        <td>Displays the teacher selection dialog</td>
    </tr>
    <tr>
        <td>show</td>
        <td>---</td>
        <td>Shows the addon if it was hidden</td>
    </tr>
    <tr>
        <td>hide</td>
        <td>---</td>
        <td>Hides the addon if it was visible</td>
    </tr>
</table>

## CSS classes

<table border='1'>
    <tr>
        <th>Class name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>.file-sender-wrapper</td>
        <td>The div wrapping all addon contents</td>
    </tr>
    <tr>
        <td>file-sender-input-wrapper</td>
        <td>The input field element (only visible if Source type is set to file)</td>
    </tr>
    <tr>
        <td>file-sender-sent-file-label</td>
        <td>The element displaying the name of the uploaded file</td>
    </tr>
    <tr>
        <td>file-sender-sent-file-reset</td>
        <td>The "reset uploaded file" element</td>
    </tr>
    <tr>
        <td>file-sender-send-file-button</td>
        <td>The "send button" element</td>
    </tr>
    <tr>
        <td>file-sender-teacher-dialog</td>
        <td>The main element of the teacher selection dialog</td>
    </tr>
    <tr>
        <td>file-sender-teacher-dialog-titlebar</td>
        <td>The titlebar of the teacher selection dialog</td>
    </tr>
    <tr>
        <td>file-sender-teacher-dialog-content</td>
        <td>The element wrapping the teachers list within the teacher selection dialog</td>
    </tr>
    <tr>
        <td>file-sender-teacher-dialog-element</td>
        <td>The individual teacher element within the teacher selection dialog</td>
    </tr>
    <tr>
        <td>file-sender-inactive</td>
        <td>The class set on the main element of the addon if it hasn't (yet, or at all) received the required metadata.</td>
    </tr>
</table>