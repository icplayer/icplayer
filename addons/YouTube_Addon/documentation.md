## Description
The YouTube addon allows you to add a YouTube video to a presentation. It can be done by specifying the video ID or its URL (either full or shortened version).

## Properties

<table border='1'>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>ID</td>
        <td>The video ID which can be obtained from the YouTube website.</td>
    </tr>
    <tr>
        <td>URL</td>
        <td>URL from the YouTube website (.com domain) or shortened version (.be domain, default in YouTube share option). If an ID is set, then this property is ignored!</td>
    </tr>
    <tr>
        <td>HTTPS</td>
        <td>If this option is checked, the Addon embeds the YouTube video over SSL/TLS secure protocol.</td>
    </tr>
    <tr>
        <td>Offline message</td>
        <td>This message will be displayed instead of a video when the Internet connection is offline.</td>
    </tr>
    <tr>
        <td>Disable fullscreen</td>
        <td>If checked displaying video in fullscreen is disabled.</td>
    </tr>
    <tr>
        <td>Time start</td>
        <td>Value in seconds, greater than 0 that determines time of video start. If video should start from the beginning then leave field empty.</td>
    </tr>
    <tr>
        <td>Autoplay</td>
        <td>If checked video will start automatically. Note: the sound is muted.</td>
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
        <td>Shows the module.</td>
    </tr>
    <tr>
        <td>hide</td>
        <td>---</td>
        <td>Hides the module.</td>
    </tr>
</table>


## CSS classes

<table border='1'>
    <tr>
        <th>Class name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>---</td>
        <td>---</td>
    </tr>
</table>

YouTube addon doesn't expose any CSS classes because its internal structure should not be changed (neither via Advanced Connector nor CSS styles).

## Posible errors

<table border='1'>
    <tr>
        <th>Error message</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Video ID seems to be incorrect!</td>
        <td>This error message suggests that video ID was set incorrectly. For most cases it means that user pasted video URL instead of its ID</td>
    </tr>
    <tr>
        <td>Neither a video ID nor a URL has been given!</td>
        <td>This error message is shown when neither video ID nor URL was set in Addon configuration</td>
    </tr>
    <tr>
        <td>URL seems to be incorrect!</td>
        <td>This error message is shown if Addon wasn't able o extract video ID from URL. Remember that URL has to be from .com or .be domain!</td>
    </tr>
    <tr>
        <td>URL seems to be incorrect. It must contain a video ID!</td>
        <td>It's a common mistake to set a video URL without a video ID. If this is the case, then this error message will be shown</td>
    </tr>
    <tr>
        <td>Incorrect video time start - value must be number greater than 0</td>
        <td>This error is shown when value is equal or less than 0 or contains characters/string instead of valid number greater than 0.</td>
    </tr>
</table>

## Demo presentation

[Demo presentation](/embed/2836044 "Demo presentation") showing how to use the YouTube addon.               