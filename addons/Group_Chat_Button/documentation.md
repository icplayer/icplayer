## Description
Group Chat Button allows users to open a group chat when the button is clicked.

## Properties

<table border='1'>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Title</td>
        <td>Title displayed inside the addon</td>
    </tr>
    <tr>
        <td>Image</td>
        <td>Image displayed inside the addon.
<p><em>This property allows online resources. <a href="/doc/page/Online-resources">Find out more »</a></em></p></td>
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
        <td>requestGroupChat</td>
        <td>---</td>
        <td>Opens a group chat</td>
    </tr>
</table>

## Managing in custom LMS
In case of managing group chat addon in custom LMS, there is need to connect to player external event bus:

    player.onExternalEvent((eventName: string, data: string) => {
    });

Group Chat addon calls that method with provided data:
* eventName: `"groupChat"`
* data: JSON string which contains:
    * ???

Optional values may be not defined in JSON string. It depends on addon configuration.

## CSS classes

<table border='1'>
    <tr>
        <th>Class name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>group-chat-button-wrapper</td>
        <td>DIV surrounding the button element. The button element is a child of this element</td>
    </tr>
    <tr>
        <td>group-chat-button-element</td>
        <td>The element's base class</td>
    </tr>
    <tr>
        <td>group-chat-button-image</td>
        <td>Class for the image (IMG) element</td>
    </tr>
    <tr>
        <td>group-chat-button-title</td>
        <td>Class for the text (SPAN) element</td>
    </tr>
</table>

## Demo presentation
