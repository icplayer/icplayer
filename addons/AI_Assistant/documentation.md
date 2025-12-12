## Description
AI Assistant is an addon that allows you to configure an AI chatbot that the user can talk to. AI API key needs to be configured in mAuthor/mCourser for this addon to function correctly.

## Properties

The list starts with the common properties, learn more about them by visiting the [Modules description](https://www.mauthor.com/doc/en/page/Modules-description) section. The other available properties are described below.

<table>
<tbody>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Chat name</td>
        <td>The name of the chat, which will be displayed at the top of the addon.</td>
    </tr>
    <tr>
        <td>Welcome text</td>
        <td>The initial text which will be displayed by the addon.</td>
    </tr>
    <tr>
        <td>Hidden prompt</td>
        <td>This will be the first message that will be sent to the AI assistant automatically after it has been initialized. The content of the Hidden prompt will not be displayed for the user.</td>
    </tr>
    <tr>
        <td>Suggestions</td>
        <td>These suggestions will be displayed for the user as a prompt under the Welcome text.</td>
    </tr>
    <tr>
        <td>Instructions</td>
        <td>This property allows you to define the instructions for the AI Assistant. Instructions serve to guide its responses and behaviour.</td>
    </tr>
    <tr>
        <td>Draggable</td>
        <td>When checked, the addon becomes draggable.</td>
    </tr>
    <tr>
        <td>Hide header</td>
        <td>When checked, the addon's header will not be displayed.</td>
    </tr>
    <tr>
        <td>Mute voice</td>
        <td>If checked, the addon will not read the contents of the Assistant's messages. This property does not affect the TTS functionality in the WCAG mode.</td>
    </tr>
    <tr>
        <td>Voice language</td>
        <td>Defines the language which will be used to read the contents of the Assistant's messages. The default value is 'en'. This property does not affect the TTS functionality in the WCAG mode.</td>
    </tr>
    <tr>
        <td>Voice type</td>
        <td>Defines the voice type which will be used to read the contents of the Assistant's messages. The default value is 'onyx'. This property does not affect the TTS functionality in the WCAG mode.</td>
    </tr>
    <tr>
        <td>Translation languages</td>
        <td>Defines the languages which will be available for translating the Assistant's messages. Each code should be separated by a comma.</td>
    </tr>
    <tr>
        <td>Class names</td>
        <td>The specified classes will be used in place of 'display: none' when using the hide and show methods. This enables the author to define the exact behaviour when hiding/showing the addon, such as by adding css for animations. If the property is left empty, 'display: none' will be used.</td>
    </tr>
    <tr>
        <td>Lang attribute</td>
        <td>Defines the language that will be used by TTS in the WCAG mode.</td>
    </tr>
    <tr>
        <td>Speech texts</td>
        <td>List of speech texts: Message sent, Recording, Finished Recording, Last message, Assistant message number:, User message number:, Text input, Record button, Send button, Disabled, Active. These texts will be read while using the addon in the WCAG mode.</td>
    </tr>
</tbody>
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
        <td></td>
        <td>Displays the addon. If Class names property has been set, the classes specified in that property will be used.</td>
    </tr>
        <td>hide</td>
        <td></td>
        <td>Hides the addon. If Class names property has been set, the classes specified in that property will be used.</td>
    </tr>
    <tr>
        <td>showAnimated</td>
        <td></td>
        <td>Displays the addon by assigning it either the class specified in the class names property, or the 'open' class if the Class names property is empty.</td>
    </tr>
        <td>hideAnimated</td>
        <td></td>
        <td>Hides the addon by assigning it either the class specified in the class names property, or the 'close' class if the Class names property is empty.</td>
    </tr>
</table>
