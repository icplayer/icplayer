The Audio addon allows users to play sounds in their presentations. This addon works on all common browsers.

<div style="border:1px solid Tomato; padding:5px; margin-bottom:21px;">
Note: It's recommended to use files with <a href="http://en.wikipedia.org/wiki/Bit_rate">bitrate</a> 64 kb/s or higher. Files with lower quality could have difficulties with reproduction.
</div>

## Properties
<table border='1'>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>ogg</td>
        <td>This property serves for uploading an audio file in ogg format into the module.

*This property allows online resources. [Find out more &raquo;](/doc/page/Online-resources)*</td>
    </tr>
    <tr>
        <td>mp3</td>
        <td>This property serves for uploading an audio file in mp3 format into the module.

*This property allows online resources. [Find out more &raquo;](/doc/page/Online-resources)*</td>
    </tr>
    <tr>
        <td>defaultControls</td>
        <td>If this property is checked, the default HTML player will be displayed. In order to make custom controls, just edit the corresponding CSS styles. To use native browser player, check the property "useBrowserControls".</td>
    </tr>
    <tr>
        <td>useBrowserControls</td>
        <td>If this and "defaultControls" properties are checked, the native browser audio player will be shown.</td>
    </tr>
    <tr>
        <td>displayTime</td>
        <td>If this property is checked and defaultControls are unchecked, then the Timer will be shown.</td>
    </tr>
    <tr>
        <td>enableLoop</td>
        <td>If this property is checked, the audio will be played repeatedly.</td>
    </tr>
    <tr>
        <td>Narration</td>
        <td>Narration for recorded audio</td>
    </tr>
	<tr>
        <td>onEnd</td>
        <td>Event to be executed when (and only then) audio ends and looping sound is not enabled</td>
    </tr>
	<tr>
        <td>Force Load Audio</td>
        <td>Try to load audio while loading a page. The audio can't be played until it is loaded.</td>
    </tr>
</table>

<div style="border:1px solid Tomato; padding:5px; margin-bottom:21px;">
Note: It's important to put 2 different format files if you want your audio to work on all common browsers. If you don't have a file in ogg format, you can use this <a href="http://media.io/">mp3 to ogg converter.</a> In Safari browser the file size is limited ( ~4mb ).
</div>

<div style="border:1px solid Tomato; padding:5px; margin-bottom:21px;">
Note: Due to the policy of Android and iOS systems, using "onEnd" property to play another media element will not work on mobile devices as it requires user interaction.
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
        <td>plays the sound if not playing already</td> 
    </tr>
    <tr>
        <td>stop</td>
        <td>---</td>
        <td>stops the sound</td> 
    </tr>
    <tr>
        <td>pause</td>
        <td>---</td>
        <td>pauses the sound</td> 
    </tr>
    <tr>
        <td>show</td>
        <td>---</td>
        <td>shows the module</td> 
    </tr>
    <tr>
        <td>hide</td>
        <td>---</td>
        <td>hides the module and stops the sound</td> 
    </tr>
</table>

## Advanced Connector integration
Each command supported by the Audio addon can be used in the Advanced Connector addon scripts. The below examples show how to play sound when the True/False addon sends an event about the correct answer and how to stop it when the event indicates the incorrect answer.

        EVENTSTART
        Source:TrueFalse1
        Score:1
        SCRIPTSTART
            var audio = presenter.playerController.getModule('Audio1');
            audio.play();
        SCRIPTEND
        EVENTEND

        EVENTSTART
        Source:TrueFalse1
        Score:0
        SCRIPTSTART
            var audio = presenter.playerController.getModule('Audio1');
            audio.stop();
        SCRIPTEND
        EVENTEND

## Events
The Audio addon sends ValueChanged type events to Event Bus when playback time changes.

<table border='1'>
<tbody>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
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
    </tr>
</tbody>
</table>

When audio playback is finished, Audio addon sends OnEnd event to Event Bus.

<table border='1'>
<tbody>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
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
    </tr>
</tbody>
</table>

The playing event occurs when the audio is playing

<table border='1'>
<tbody>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
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
    </tr>
</tbody>
</table>

The pause event occurs when the audio is paused

<table border='1'>
<tbody>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
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
        <td>Switchable button for Play / Pause commands</td>
    </tr>
    <tr>
        <td>.audio-play-btn</td>
        <td>A style for play-pause-btn when audio is not playing.</td>
    </tr>
    <tr>
        <td>.audio-pause-btn</td>
        <td>A style for play-pause-btn when audio is playing.</td>
    </tr>
    <tr>
        <td>.audio-stop-btn</td>
        <td>A button to execute Stop command.</td>
    </tr>
    <tr>
        <td>.audio-volume-btn</td>
        <td>A button which allows volume control.</td>
    </tr>
    <tr>
        <td>.audio-volume0</td>
        <td>Style for audio-volume-btn which is active when audio volume is zero.</td>
    </tr>
    <tr>
        <td>.audio-volume1</td>
        <td>Style for audio-volume-btn which is active when audio volume is less than 40%.</td>
    </tr>
    <tr>
        <td>.audio-volume2</td>
        <td>Style for audio-volume-btn which is active when audio volume is between 40% and 70%.</td>
    </tr>
    <tr>
        <td>.audio-volume3</td>
        <td>Style for audio-volume-btn which is active when audio volume is more than 70%.</td>
    </tr>
    <tr>
        <td>.player-time</td>
        <td>A layer which includes information about audio time.</td>
    </tr>
    <tr>
        <td>.audio-progress-bar</td>
        <td>A layer which visualizes the progress of the playback.</td>
    </tr>
    <tr>
        <td>.audio-bar</td>
        <td>An element of audio-progress-bar which visualizes real progress of the playback.</td>
    </tr>
    <tr>
        <td>.audio-slider-btn</td>
        <td>An element of audio-progress-bar which is on the end of audio-bar and it can be used to go to another place in the audio file.</td>
    </tr>
    <tr>
        <td>.audio-volume-layer</td>
        <td>A layer which allows volume control.</td>
    </tr>
    <tr>
        <td>.volume-control-background</td>
        <td>An element of audio-volume-layer which is used to visualize volume controller.</td>
    </tr>
    <tr>
        <td>.audio-volume-control</td>
        <td>An element of audio-volume-layer which is used to visualize current audio volume.</td>
    </tr>
</table>

## Demo presentation
[Demo presentation](/embed/2443022 "Demo presentation") contains examples of how to use the Audio addon.                         