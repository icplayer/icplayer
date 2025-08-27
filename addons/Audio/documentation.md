## Description

The Audio module allows users to play sounds in their presentations. This module works on all common browsers. You can use the MP3 and/or OGG format.

<div style="border:1px solid Tomato; padding:5px; margin-bottom:21px;">
    Note: It's recommended to use files with <a href="http://en.wikipedia.org/wiki/Bit_rate" target="_blank" rel="noopener noreferrer">bitrate</a> 64 kb/s or higher. Files with lower quality could have difficulties with reproduction.
</div>


## Properties

The list starts with the common properties. Learn more about them by visiting the <a href="/doc/en/page/Modules-description" target="_blank" rel="noopener noreferrer">Modules description</a> section. The other available properties are described below.

<table border='1'>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>MP3</td>
        <td>This property serves for uploading an audio file in MP3 format into the module.
            <p><em>This property allows online resources. <a href="/doc/page/Online-resources" target="_blank" rel="noopener noreferrer">Find out more »</a></em>
            </p>
        </td>
    </tr>
    <tr>
        <td>OGG</td>
        <td>This property serves for uploading an audio file in OGG format into the module.
            <p><em>This property allows online resources. <a href="/doc/page/Online-resources" target="_blank" rel="noopener noreferrer">Find out more »</a></em>
            </p>
        </td>
    </tr>
    <tr>
        <td>Default controls</td>
        <td>If this property is checked, the default HTML player will be displayed. In order to make custom controls, just edit the corresponding CSS styles. To use a native browser player, check the property "Use browser controls".
        </td>
    </tr>
    <tr>
        <td>Use browser controls</td>
        <td>If this and the "Default controls" properties are checked, the native browser audio player will be shown.
        </td>
    </tr>
    <tr>
        <td>Display time</td>
        <td>If this property is checked and the "Default controls" are unchecked, then the Timer will be shown.</td>
    </tr>
    <tr>
        <td>Enable loop</td>
        <td>If this property is checked, the audio will be played repeatedly.</td>
    </tr>
    <tr>
        <td>Narration</td>
        <td>Narration for the recorded audio.</td>
    </tr>
    <tr>
        <td>On end</td>
        <td>Event to be executed when (and only then) the audio ends and the "Enable loop" property is not marked.</td>
    </tr>
    <tr>
        <td>Force load audio</td>
        <td>Try to load the audio while loading the page. The audio can't be played until it is loaded.</td>
    </tr>
    <tr>
        <td>Enable playback speed controls</td>
        <td>If checked, the Audio module will display a dropdown menu allowing the user to control the audio speed by changing the selected option. The dropdown menu will appear only if the "Default controls" property has been checked. If you would like to hide some options, you can do that using the CSS style, e.g., this code will hide options 0.25 and 0.5 from the dropdown:<br>
            <pre>
            .audio-playback-rate [value="0.25"],
            .audio-playback-rate [value="0.5"] {
                display: none;
            }</pre>
        </td>
    </tr>
</table>

<div style="border:1px solid Tomato; padding:5px; margin-bottom:21px;">
    Note: If you also want to use a file in the OGG format, you can use this <a href="http://media.io/" target="_blank" rel="noopener noreferrer">MP3 to OGG converter</a>. In the Safari browser, the file size is limited (~4 MB).
</div>

<div style="border:1px solid Tomato; padding:5px; margin-bottom:21px;">
    Note: Due to the policy of Android and iOS systems, using the "On end" property to play another media element will not work on mobile devices, as it requires user interaction.
</div>


## Supported commands

<table border='1'>
    <tr>
        <th>Command name</th>
        <th>Params</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>play</td>
        <td>---</td>
        <td>Plays the sound if it is not playing already.</td>
    </tr>
    <tr>
        <td>stop</td>
        <td>---</td>
        <td>Stops the sound.</td>
    </tr>
    <tr>
        <td>pause</td>
        <td>---</td>
        <td>Pauses the sound.</td>
    </tr>
    <tr>
        <td>hide</td>
        <td>---</td>
        <td>Hides the module if it is visible and stops the sound.</td>
    </tr>
    <tr>
        <td>show</td>
        <td>---</td>
        <td>Shows the module if it is hidden.</td>
    </tr>
    <tr>
        <td>getNarration</td>
        <td>---</td>
        <td>Gets the narration property.</td>
    </tr>
    <tr>
        <td>setPlaybackRate</td>
        <td>playbackRate</td>
        <td>Sets the audio speed to the playbackRate value as per the playbackRate property of the HTML Audio element, with 1.0 by default. You may use this command even when the "Enable playback speed controls" property has not been checked. The playbackRate does *not* have to be equal to one of the values displayed in the dropdown menu.</td>
    </tr>
</table>


## Advanced Connector integration

Each command supported by the Audio module can be used in the <a href="/doc/en/page/Advanced-Connector" target="_blank" rel="noopener noreferrer">Advanced Connector</a> module scripts. The below examples show how to play sound when the <a href="/doc/en/page/TrueFalse" target="_blank" rel="noopener noreferrer">True False</a> module sends an event about the correct answer, and how to stop it when the event
indicates the incorrect answer.

    EVENTSTART
    Source:TrueFalse1
    Score:1
    SCRIPTSTART

    presenter.playerController.getModule('Audio1').play();

    SCRIPTEND
    EVENTEND

    EVENTSTART
    Source:TrueFalse1
    Score:0
    SCRIPTSTART

    presenter.playerController.getModule('Audio1').stop();

    SCRIPTEND
    EVENTEND


## Events

The Audio module sends ValueChanged type events to the Event Bus when the playback time changes.

<table border='1'>
    <tbody>
        <tr>
            <th>Field name</th>
            <th>Description</th>
        </tr>
        <tr>
            <td>Name</td>
            <td>ValueChanged</td>
        </tr>
        <tr>
            <td>Item</td>
            <td>N/A</td>
        </tr>
        <tr>
            <td>Value</td>
            <td>Current time (in MM.SS format)</td>
        </tr>
        <tr>
            <td>Score</td>
            <td>N/A</td>
        </tr>
    </tbody>
</table>

When the audio playback is finished, the Audio module sends the OnEnd event to the Event Bus.

<table border='1'>
    <tbody>
        <tr>
            <th>Field name</th>
            <th>Description</th>
        </tr>
        <tr>
            <td>Name</td>
            <td>ValueChanged</td>
        </tr>
        <tr>
            <td>Item</td>
            <td>end</td>
        </tr>
        <tr>
            <td>Value</td>
            <td>N/A</td>
        </tr>
        <tr>
            <td>Score</td>
            <td>N/A</td>
        </tr>
    </tbody>
</table>

The playing event occurs when the audio is playing.

<table border='1'>
    <tbody>
        <tr>
            <th>Field name</th>
            <th>Description</th>
        </tr>
        <tr>
            <td>Name</td>
            <td>ValueChanged</td>
        </tr>
        <tr>
            <td>Item</td>
            <td>N/A</td>
        </tr>
        <tr>
            <td>Value</td>
            <td>playing</td>
        </tr>
        <tr>
            <td>Score</td>
            <td>N/A</td>
        </tr>
    </tbody>
</table>

The pause event occurs when the audio is paused.

<table border='1'>
    <tbody>
        <tr>
            <th>Field name</th>
            <th>Description</th>
        </tr>
        <tr>
            <td>Name</td>
            <td>ValueChanged</td>
        </tr>
        <tr>
            <td>Item</td>
            <td>N/A</td>
        </tr>
        <tr>
            <td>Value</td>
            <td>pause</td>
        </tr>
        <tr>
            <td>Score</td>
            <td>N/A</td>
        </tr>
    </tbody>
</table>

The not-started event occurs just before destruction of module (e.g., due to a switch to another lesson page) when the audio has never been started. 
Reset does not affect the sending of this event.

<table border='1'>
    <tbody>
        <tr>
            <th>Field name</th>
            <th>Description</th>
        </tr>
        <tr>
            <td>Name</td>
            <td>PreDestroyed</td>
        </tr>
        <tr>
            <td>Item</td>
            <td>N/A</td>
        </tr>
        <tr>
            <td>Value</td>
            <td>not-started</td>
        </tr>
    </tbody>
</table>

When the module is set to play in a loop then no OnEnd event is sent. 
Instead, the replayed-in-loop event is sent when the audio is replayed in a loop.

<table border='1'>
    <tbody>
        <tr>
            <th>Field name</th>
            <th>Description</th>
        </tr>
        <tr>
            <td>Name</td>
            <td>ValueChanged</td>
        </tr>
        <tr>
            <td>Item</td>
            <td>N/A</td>
        </tr>
        <tr>
            <td>Value</td>
            <td>replayed-in-loop</td>
        </tr>
        <tr>
            <td>Score</td>
            <td>N/A</td>
        </tr>
    </tbody>
</table>

## CSS Classes
<table border='1'>
    <tr>
        <th>Class name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>.wrapper-addon-audio</td>
        <td>A simple wrapper.</td>
    </tr>
    <tr>
        <th colspan="2" style="text-align:center">Default HTML player</th>
    </tr>
    <tr>
        <td>.audioplayer</td>
        <td>Default HTML player controller.</td>
    </tr>
    <tr>
        <td>.play-pause-btn</td>
        <td>Switchable button for the Play/Pause commands.</td>
    </tr>
    <tr>
        <td>.audio-play-btn</td>
        <td>A style for the play-pause-btn when the audio is not playing.</td>
    </tr>
    <tr>
        <td>.audio-pause-btn</td>
        <td>A style for the play-pause-btn when audio is playing.</td>
    </tr>
    <tr>
        <td>.audio-stop-btn</td>
        <td>A button to execute the Stop command.</td>
    </tr>
    <tr>
        <td>.audio-volume-btn</td>
        <td>A button that allows volume control.</td>
    </tr>
    <tr>
        <td>.audio-volume0</td>
        <td>Style for the audio-volume-btn, which is active when the audio volume is zero.</td>
    </tr>
    <tr>
        <td>.audio-volume1</td>
        <td>Style for audio-volume-btn which is active when the audio volume is less than 40%.</td>
    </tr>
    <tr>
        <td>.audio-volume2</td>
        <td>Style for audio-volume-btn which is active when the audio volume is between 40% and 70%.</td>
    </tr>
    <tr>
        <td>.audio-volume3</td>
        <td>Style for audio-volume-btn which is active when the audio volume is more than 70%.</td>
    </tr>
    <tr>
        <td>.player-time</td>
        <td>A layer that includes information about the audio time.</td>
    </tr>
    <tr>
        <td>.audio-progress-bar</td>
        <td>A layer that visualizes the progress of the playback.</td>
    </tr>
    <tr>
        <td>.audio-bar</td>
        <td>An element of the audio-progress-bar that visualizes the real progress of the playback.</td>
    </tr>
    <tr>
        <td>.audio-slider-btn</td>
        <td>An element of the audio-progress-bar that is at the end of the audio-bar, and it can be used to go to another place in the audio file.</td>
    </tr>
    <tr>
        <td>.audio-volume-layer</td>
        <td>A layer that allows volume control.</td>
    </tr>
    <tr>
        <td>.volume-control-background</td>
        <td>An element of the audio-volume-layer that is used to visualize the volume controller.</td>
    </tr>
    <tr>
        <td>.audio-volume-control</td>
        <td>An element of the audio-volume-layer that is used to visualize the current audio volume.</td>
    </tr>
</table>


## Demo presentation

[Demo presentation](https://mauthor.com/present/2443022 "Demo presentation") contains examples of how to use the Audio module. 