The TextAudio addon allows users to play sounds with subtitles in their presentations. This addon works on all common browsers. 

<div style="border:1px solid Tomato; padding:5px; margin-bottom:21px;">
Note: It's recommended to use files with <a href="http://en.wikipedia.org/wiki/Bit_rate">bitrate</a> 64 kb/s or higher. The files with lower quality could experience some difficulties in reproduction.
It's also important that audio files have <strong>constant bitrate</strong> because Mozilla Firefox may experience problems while seeking in files that have variable bitrate mode.
</div>

## Properties
<table border='1'>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Controls</td>
        <td>
            In this property, you can choose one of the three options. The "None" option does not display any controls, the "Browser" option displays the default controls for the currently used web-browser. The "Custom" option displays the controls defined by a user in css styles. This option displays the controls independently from a web-browser.
        </td>
    </tr>
    <tr>
        <td>Display time</td>
        <td>If this property is checked and defaultControls are unchecked, then the Timer will be shown.</td>
    </tr>
    <tr>
        <td>Enable loop</td>
        <td>If this property is checked, the audio will be played repeatedly.</td>
    </tr>
    <tr>
        <td>Slides</td>
        <td>In this property you define slides with the audio narration.
                <br />Text and times can be provided from SRT type file. <b>If file is provided - text and times fields are ignored.</b> Using srt file also enables to provide the Crop time field that simply crop the times within this file. <b>Important: crop times works only for SRT file!</b> Ignoring the srt file property, user can always provide narration by hand - described as below.
        <br />Each slide has property Text – which is the content of the slide and property Times, in which you define durations of each slide.
		<br />
		The content of the slide can be divided into fragments that will be highlighted in different periods of time. The seperator is double pipe "||". The number of pieces of text should be the same as the number of time periods in the Times property.
		<br />
		In the <strong>Times property</strong> you define time ranges for each piece of text. The time should be in the following format: mm:ss.d, where mm is minute, ss is second and d is the tenth of a second. Time range for each text should be in the seperate line. The tenth of a second parameter is not obligatory.<br> In the <strong>Position and dimensions</strong> property you define the position of a slide. This should be in the following format: X;Y;W;H, where X is the position from left, Y is the position from top, W is width and H is height.
		<br />
		<strong>For example:</strong>
		<ul>
			<li><strong>Text:</strong><br />Lorem ||ipsum ||dolor</li>
			<li><strong>Times:</strong><br />
			00:00-00:02<br />
			00:02-00:03.5<br />
			00:03.5-00:05</li>
                        <li><strong>Position and dimensions:</strong><br />10;10;150;200</li>
		        <li><b>File SRT</b> - properly formatted SRT file for audio narration</li>
            <li><b>Crop times</b> - value that crop("cut") the times in File Srt</li>
                Proper format: 00:00:00,000 where HH:MM:SS,MS
                </ul>
		</td>
    </tr>
    <tr>
        <td>mp3</td>
        <td>
            This property serves for uploading an audio file in mp3 format into the module.
            <p><em>This property allows online resources. <a href="/doc/page/Online-resources">Find out more »</a></em></p>
        </td>
    </tr>
    <tr>
        <td>ogg</td>
        <td>
            This property serves for uploading an audio file in ogg format into the module.
            <p><em>This property allows online resources. <a href="/doc/page/Online-resources">Find out more »</a></em></p>
        </td>
    </tr>
    <tr>
        <td>On Text Click Behavior</td>
        <td>
            Defines the action that is expected to happen when a word is clicked by a user. This property replaces the following old properties: "Individual fragment playback" and "Vocabulary audio files playback".<br />
            <strong>Note: This property is not taken into account when the module has old properties: "Individual fragment playback" or "Vocabulary audio files playback".</strong>
            To use this property, you should remove the old module from the page and add a new one.
        </td>
    </tr>
    <tr>
        <td>Vocabulary mp3</td>
        <td>
            This property serves for uploading an audio file in mp3 format into the module.
            Setting up this property is only needed when On Text Click Behavior is set to "Play the interval from vocabulary file".
            <p><em>This property allows online resources. <a href="/doc/page/Online-resources">Find out more »</a></em></p>
        </td>
    </tr>
    <tr>
        <td>Vocabulary ogg</td>
        <td>
            This property serves for uploading a vocabulary audio file in ogg format into the module.
            Setting up this property is only needed when On Text Click Behavior is set to "Play the interval from vocabulary file".
            <p><em>This property allows online resources. <a href="/doc/page/Online-resources">Find out more »</a></em></p>
        </td>
    </tr>
    <tr>
        <td>Vocabulary intervals</td>
        <td>
            In this property you define time intervals for vocabulary audio files. The time periods should be in the same format as in Slides -> Times property. Number of parts in Vocabulary intervals have to be equal to the sum of times periods defined in Slides property.
            Setting up this property is only needed when On Text Click Behavior is set to "Play the interval from vocabulary file".
        </td>
    </tr>
    <tr>
        <td>On end</td>
        <td>Event to be executed when (and only then) audio ends and loop is not enabled.</td>
    </tr>
    <tr>
        <td>Is Click Disabled</td>
        <td>
            With this option selected, a user can interact with the addon only via commands (mouse actions are disabled).
        </td>
    </tr>
    <tr>
        <td>Show slides</td>
        <td>
            In this property, you can choose one of the two options. The "Show current slide" option displays the currently playing slide, the "Show all slides" option displays all added slides.
        </td>
    </tr>
    <tr>
        <td>Is disabled</td>
        <td>
            Allows disabling the addon so that it won't be able to interact. Sets the style class for the entire addon to .disabled
        </td>
    </tr>
    <tr>
        <td>Enable audio speed controller</td>
        <td>This property activates option to change speed of playing audio.</td>
    </tr>
    <tr>
        <td>Lang attribute</td>
        <td>This property allows to define the language for this addon (different than the language of the lesson).</td>
    </tr>
    <tr>
        <td>Speech texts</td>
        <td>
            This texts will be read by Text to Speech addon after a user performs an action.
            List of speech texts: Play button, Pause button, Stop button, Audio speed controller.
        </td>
    </tr>
    <tr>
        <td>Individual fragment playback
            <br /><strong><em>deprecated</em></strong>
        </td>
        <td>If this property is checked, only the selected fragment will be played.</td>
    </tr>
    <tr>
        <td>Vocabulary audio files playback
            <br /><strong><em>deprecated</em></strong>
        </td>
        <td>Defines whether the addon is allowed to use files defined in "Vocabulary audio files" property.</td>
    </tr>
    <tr>
        <td>Vocabulary audio files
            <br /><strong><em>deprecated</em></strong>
        </td>
        <td>List of files for individual playback.</td>
    </tr>
    <tr>
        <td>defaultControls
            <br /><strong><em>deprecated</em></strong>
        </td>
        <td>If this property is checked, the default browser controls will be displayed. In order to make custom controls, just add the event button and call play() or pause() function in the audio addon.</td>
    </tr>
</table>

<div style="border:1px solid Tomato; padding:5px; margin-bottom:21px;">
Note: It's important to put 2 different file formats if you want your audio to work on all common browsers. If you don't have a file in ogg format, you can use this <a href="http://media.io/">mp3 to ogg converter.</a> In Safari browser the file size is limited ( ~4mb ).
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
        <td>pause</td>
        <td>---</td>
        <td>pauses the sound</td> 
    </tr>
    <tr>
        <td>stop</td>
        <td>---</td>
        <td>stops the sound</td> 
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
    <tr>
        <td>enable</td>
        <td>---</td>
        <td>enables the addon and removes the .disabled style class for the entire addon</td> 
    </tr>
    <tr>
        <td>disable</td>
        <td>---</td>
        <td>disables the addons, interrupts the playback and adds the .disabled style class for the entire addon</td> 
    </tr>
</table>

## Advanced Connector integration
Each command supported by the TextAudio addon can be used in the Advanced Connector addon scripts. The below examples show how to play sound when the True/False addon sends an event for the correct answer and how to stop it when the event indicates the incorrect answer.

        EVENTSTART
        Source:TrueFalse1
        Score:1
        SCRIPTSTART
            var audio = presenter.playerController.getModule('TextAudio1');
            audio.play();
        SCRIPTEND
        EVENTEND

        EVENTSTART
        Source:TrueFalse1
        Score:0
        SCRIPTSTART
            var audio = presenter.playerController.getModule('TextAudio1');
            audio.stop();
        SCRIPTEND
        EVENTEND

## Events
The TextAudio addon sends ValueChanged type events to Event Bus when playback time changes.

<table border='1'>
<tbody>
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
        <td>Current time (in MM.SS format)</td>
    </tr>
    <tr>
        <td>Score</td>
        <td>N/A</td>
    </tr>
</tbody>
</table>

When audio playback is finished, TextAudio addon sends OnEnd event to Event Bus.

<table border='1'>
<tbody>
    <tr>
        <th>Field name</th>
        <th>Description</th>
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

## CSS Classes
<table border='1'>
    <tr>
        <th>Class name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>.wrapper-addon-textaudio</td>
        <td>An addon's wrapper.</td>
    </tr>
    <tr>
        <td>.textaudio-text</td>
        <td>A wrapper of slide text.</td>
    </tr>
    <tr>
        <td>.wrapper-addon-textaudio  span</td>
        <td>Each text fragment is in &lt;span&gt; element.</td>
    </tr>
    <tr>
        <td>.wrapper-addon-textaudio  span.active</td>
        <td>The currently highligted &lt;span&gt; element has class .active</td>
    </tr>
    <tr>
        <td>.wrapper-addon-textaudio  span.textelement[num]</td>
        <td>Where [num] is the element number counted from 0 on every slide. It is possible that there is more than one element with the same class number but they are always resposible for the same audio part.</td>
    </tr>
    <tr>
        <td>.textaudio-play-pause-btn</td>
        <td>Shared styles used for the play button and pause button.</td>
    </tr>
    <tr>
        <td>.textaudio-play-btn</td>
        <td>Styles for the play button.</td>
    </tr>
    <tr>
        <td>.textaudio-pause-btn</td>
        <td>Styles for the pause button.</td>
    </tr>
    <tr>
        <td>.textaudio-stop-btn</td>
        <td>Styles for the stop button.</td>
    </tr>
    <tr>
        <td>.textaudio-playback-rate</td>
        <td>Styles for the audio speed controller.</td>
    </tr>
</table>

## Demo presentation
[Demo presentation](/embed/5221077257027584 "Demo presentation") contains examples of how to use the TextAudio addon.                                                 