## Description
It's an upgraded version of the Audio addon. New features: multi audio files, loop for each file, the possibility of assigning ID to each file in order to jump between files, improved interface selection.

## Properties
<table border="1">
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Files</td>
        <td>It's a list of files. Each file has it's properties: ID, Mp3, Ogg, Enable loop, which are described below.
<p><em>This property allows online resources. <a href="/doc/page/Online-resources">Find out more »</a></em></p>
</td>
    </tr>
    <tr>
        <td>ID</td>
        <td>This must be a unique value. It's use for command jumpToID.</td>
    </tr>
    <tr>
        <td>Mp3</td>
        <td>It's a file with mp3 extension.</td>
    </tr>
    <tr>
        <td>Ogg</td>
        <td>It's a file with ogg extension.</td>
    </tr>
    <tr>
        <td>Enable loop</td>
        <td>True or False property, which enable looping for current file.</td>
    </tr>
    <tr>
        <td>Narration</td>
        <td>Narration for recorded audio</td>
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
        <td>jumpTo</td>
        <td>audio number</td> 
        <td>Jumps to specified audio number. Audio number should be from 1 to n, where n is the number of configured audio files. Providing a audio number out of this range will have no effect</td> 
    </tr>
    <tr>
        <td>jumpToID</td>
        <td>audio id</td> 
        <td>Jumps to specified audio ID (provided in Addon configuration, IDs property). Providing a audio ID not defined in IDs property will have no effect</td> 
    </tr>
    <tr>
        <td>previous</td>
        <td>-</td> 
        <td>Jumps to previous audio. If the first audio is currently displayed this command will have no effect</td> 
    </tr>
    <tr>
        <td>next</td>
        <td>-</td> 
        <td>Jumps to next audio. If the last audio is currently displayed this command will have no effect</td> 
    </tr>
    <tr>
        <td>play</td>
        <td>-</td> 
        <td>Plays the audio. Example usage: MultiAudio1.play()</td> 
    </tr>
    <tr>
        <td>pause</td>
        <td>-</td> 
        <td>Pauses the audio. Example usage: MultiAudio1.pause()</td> 
    </tr>
    <tr>
        <td>stop</td>
        <td>-</td> 
        <td>Stops the audio. Example usage: MultiAudio1.stop()</td> 
    </tr>
    <tr>
        <td>show</td>
        <td>---</td>
        <td>Shows the module</td>
    </tr>
    <tr>
        <td>hide</td>
        <td>---</td>
        <td>Hides the module</td>
    </tr>
</table>

## Advanced Connector integration
Each command supported by the MultiAudio Addon can be used in the Advanced Connector addon scripts. The below examples show how to play next audio when True/False addon will send correct event
and how to jump to audio with ID = 1 when Choice module will send incorrect event.

        EVENTSTART
        Source:TrueFalse1
        Score:1
        SCRIPTSTART
            var multiAudioModule = presenter.playerController.getModule('MultiAudio1');
            multiAudioModule.jumpToID(2);
            multiAudioModule.play();
        SCRIPTEND
        EVENTEND

        EVENTSTART
        Source:TrueFalse1
        Score:0
        SCRIPTSTART
            var multiAudioModule = presenter.playerController.getModule('MultiAudio1');
            multiAudioModule.stop();
        SCRIPTEND
        EVENTEND

## Events

The MultiAudio addon sends ValueChanged type events to Event Bus when playing begins.

<table border='1'>
<tbody>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <tr>
            <td>Item</td>
            <td>Current item</td>
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

When playback time changes, MultiAudio addon sends a relevant event to Event Bus.

<table border='1'>
<tbody>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <tr>
            <td>Item</td>
            <td>Current item</td>
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

When MultiAudio playback stops or is paused, but is not finished (such as after calling pause() or stop() methods, or after a different file has been selected), MultiAudio addon sends pause event to Event Bus.

<table border='1'>
<tbody>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <tr>
            <td>Item</td>
            <td>Current item</td>
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

When MultiAudio playback is finished, MultiAudio addon sends OnEnd event to Event Bus.

<table border='1'>
<tbody>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <tr>
            <td>Item</td>
            <td>Current item</td>
        </tr>
        <tr>
            <td>Value</td>
            <td>end</td>
        </tr>
        <tr>
            <td>Score</td>
            <td>N/A</td>
        </tr>
    </tr>
</tbody>
</table>


## CSS classes

<table border='1'>
    <tr>
        <th>Class name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>.wrapper-addon-audio</td>
        <td>A simple wrapper.</td> 
    </tr>
</table>

## Example

**Default styling**  

    .wrapper-addon-audio audio {
        bottom: 0;
        position: absolute;
    }

    .wrapper-addon-audio {
        height: 30px;
        position: relative;
    }

## Demo presentation
[Demo presentation](/embed/2437247 "Demo presentation") contain examples of how to use MultiAudio addon.           