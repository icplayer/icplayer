## Description
The Audio Playlist addon allows users to create a list of sounds and play them. This addon works on all common browsers.
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
    <td>Items</td>
        <td>
            This property serves for storing audio items.
                <table border='1'>
                    <tr>
                        <th>Property name</th>
                        <th>Description</th>
                    </tr>
                    <tr>
                        <td>Name</td>
                        <td>Audio name displays in the list.</td>
                    </tr>
                    <tr>
                        <td>Mp3</td>
                        <td>This property serves for uploading an audio file in mp3 format into the module.</td>
                    </tr>
                    <tr>
                        <td>Ogg</td>
                        <td>This property serves for uploading an audio file in ogg format into the module. It's needed for all common browsers.</td>
                    </tr>
                </table>
                <div style="border:1px solid Tomato; padding:5px; margin-bottom:21px;">
                    Note: It's important to put 2 different format files if you want your audio to work on all common browsers. If you don't have a file in ogg format, you can use this <a href="http://media.io/">mp3 to ogg converter.</a> In Safari browser the file size is limited ( ~4mb ).
                </div>
        </td>
    </tr>
    <tr>
        <td>Stop playing</td>
        <td>This property disables auto playing.</td>
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
            List of speech texts: Play, Pause, Previous audio, Next audio, Audio speed controller, Volume level, Timer, Audio item.
        </td>
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
        <td>play</td>
        <td>---</td>
        <td>Plays the sound if not playing already.</td> 
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
        <td>show</td>
        <td>---</td>
        <td>Shows the module.</td> 
    </tr>
    <tr>
        <td>hide</td>
        <td>---</td>
        <td>Hides the module and stops the sound.</td> 
    </tr>
    <tr>
        <td>jumpTo</td>
        <td>
            index (type int) <br>
            startPlaying (type boolean)
        </td>
        <td>Sets selected audio correct with the index.</td> 
    </tr>
    <tr>
        <td>previous</td>
        <td>---</td>
        <td>Changes selected audio to the previous one.</td> 
    </tr>
    <tr>
        <td>next</td>
        <td>---</td>
        <td>Changes selected audio to the next one.</td> 
    </tr>
    <tr>
        <td>setPlaybackRate</td>
        <td>value (type string)</td>
        <td>Sets playback rate correct with the value.</td> 
    </tr>
</table>

##Events

The Audio Playlist addon sends ValueChanged type events to Event Bus. <br>
When a user changes the audio.
<table border='1'>
<tbody>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Value</td>
        <td>next</td>
    </tr>
    <tr>
        <td>Item</td>
        <td>Index of current audio item</td>
    </tr>
    <tr>
        <td>Source</td>
        <td>Addon ID</td>
    </tr>
    <tr>
        <td>Score</td>
        <td>N/A</td>
    </tr>
</tbody>
</table>

When a playback time changes.
<table border='1'>
<tbody>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Value</td>
        <td>Current time (in MM.SS format)</td>
    </tr>
    <tr>
        <td>Item</td>
        <td>Index of current audio item</td>
    </tr>
    <tr>
        <td>Source</td>
        <td>Addon ID</td>
    </tr>
    <tr>
        <td>Score</td>
        <td>N/A</td>
    </tr>
</tbody>
</table>

When audio playback is finished.
<table border='1'>
<tbody>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Value</td>
        <td>end</td>
    </tr>
    <tr>
        <td>Item</td>
        <td>Index of current audio item</td>
    </tr>
    <tr>
        <td>Source</td>
        <td>Addon ID</td>
    </tr>
    <tr>
        <td>Score</td>
        <td>N/A</td>
    </tr>
</tbody>
</table>

When audio playback is playing.
<table border='1'>
<tbody>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Value</td>
        <td>playing</td>
    </tr>
    <tr>
        <td>Item</td>
        <td>Index of current audio item</td>
    </tr>
    <tr>
        <td>Source</td>
        <td>Addon ID</td>
    </tr>
    <tr>
        <td>Score</td>
        <td>N/A</td>
    </tr>
</tbody>
</table>

When audio playback is paused.
<table border='1'>
<tbody>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Value</td>
        <td>pause</td>
    </tr>
    <tr>
        <td>Item</td>
        <td>Index of current audio item</td>
    </tr>
    <tr>
        <td>Source</td>
        <td>Addon ID</td>
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
        <td>wrapper-addon-audio-playlist</td>
        <td>Styles for a container keeps all elemnts.</td>
    </tr>
    <tr>
        <td>addon-audio-playlist-controls</td>
        <td>Styles for a wrapper which keeps audio control buttons.</td>
    </tr>
    <tr>
        <td>audio-playlist-prev-btn</td>
        <td>Styles for a button that supports picking previous audio.</td>
    </tr>
    <tr>
        <td>audio-playlist-next-btn</td>
        <td>Styles for a button that supports picking next audio.</td>
    </tr>
    <tr>
        <td>audio-playlist-play-pause-btn</td>
        <td>Common styles for buttons that handling play or pause audio.</td>
    </tr>
    <tr>
        <td>audio-playlist-play-btn</td>
        <td>Styles for a button that supports start playing audio</td>
    </tr>
    <tr>
        <td>audio-playlist-pause-btn</td>
        <td>Styles for a button that supports stop playing audio</td>
    </tr>
    <tr>
        <td>audio-playlist-timer</td>
        <td>Styles A layer which includes information about audio time.</td>
    </tr>
    <tr>
        <td>audio-playlist-bar</td>
        <td>Styles for an element shows the progress of the playback.</td>
    </tr>
    <tr>
        <td>audio-playlist-bar--fill</td>
        <td>Styles for a layer which visualizes the progress of the playback.</td>
    </tr>
    <tr>
        <td>audio-playlist-bar--ball</td>
        <td>Styles for a point which visualizes the progress of the playback.</td>
    </tr>
    <tr>
        <td>audio-playlist-max-time</td>
        <td>Styles for a text shows duration of the playback.</td>
    </tr>
    <tr>
        <td>audio-playlist-volume-btn</td>
        <td>Styles for a button which allows volume control.</td>
    </tr>
    <tr>
        <td>addon-audio-playlist-items</td>
        <td>Styles for a container which keeps audio items.</td>
    </tr>
    <tr>
        <td>addon-audio-playlist-item</td>
        <td>Style for an audio item.</td>
    </tr>
    <tr>
        <td>addon-audio-playlist-item--name</td>
        <td>Styles for an audio item title.</td>
    </tr>
    <tr>
        <td>addon-audio-playlist-item--selected</td>
        <td>Styles for an audio which is marked.</td>
    </tr>
    <tr>
        <td>addon-audio-playlist-item--button</td>
        <td>Styles for an audio item control buttons.</td>
    </tr>
    <tr>
        <td>addon-audio-playlist-item--button-playing</td>
        <td>Styles for a button which shows playing audio.</td>
    </tr>
    <tr>
        <td>addon-audio-playlist-volume-wrapper</td>
        <td>Styles for a container which keeps volume control button.</td>
    </tr>
    <tr>
        <td>addon-audio-playlist-volume-wrapper--expanded</td>
        <td>Styles for an opened volume container.</td>
    </tr>
    <tr>
        <td>addon-audio-playlist-volume-bar</td>
        <td>Styles for an element shows the volume level.</td>
    </tr>
    <tr>
        <td>addon-audio-playlist-volume-bar--hidden</td>
        <td>Styles for a hidden layer which visualizes the volume level</td>
    </tr>
    <tr>
        <td>addon-audio-playlist-volume-bar--fill</td>
        <td>Styles for a layer which visualizes the volume level.</td>
    </tr>
    <tr>
        <td>audio-speed-controller</td>
        <td>Styles for an element which changes audio playback rate.</td>
    </tr>
</table>
