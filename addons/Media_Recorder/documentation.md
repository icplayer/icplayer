## Description

The Media Recorder addon allows you to record audio using your microphone. Then, you can also play your recording. 

***Note:***
*Be careful with the length of the recording. Long recordings can cause the lesson to be loading longer because each recording is stored in a lesson's state. You should limit the duration of the recording by setting the **Maximum recording duration** property.*

## Properties

The list starts with the common properties, learn more about them by visiting the [Modules description](https://www.mauthor.com/doc/en/page/Modules-description) section. The other available properties are described below.

<table border="1">
    <tbody>
        <tr>
            <th>Property name</th>
            <th>Description</th>
        </tr>
        <tr>
            <td>Maximum recording duration</td>
            <td>The maximum recording time. You should limit this time so that the lesson's state is lighter. The value cannot exceed 60 seconds.</td>
        </tr>
        <tr>
            <td>Default recording</td>
            <td>The recording that will be loaded after starting the lesson. The recording should have <b>*.mp3</b> format.</td>
        </tr>
        <tr>
            <td>Recording start sound</td>
            <td>The sound effect that is played when you start recording. The sound effect should have <b>*.mp3</b> format.</td>
        </tr>
        <tr>
            <td>Recording stop sound</td>
            <td>The sound effect that is played when you stop recording. The sound effect should have <b>*.mp3</b> format.</td>
        </tr>
        <tr>
            <td>Show timer</td>
            <td>Shows the timer.</td>
        </tr>
        <tr>
            <td>Show default recording play button</td>
            <td>Shows the play button of the default recording.</td>
        </tr>
        <tr>
            <td>Reset removes recording</td>
            <td>When the reset button is pressed, the user recording is deleted.</td>
        </tr>
        <tr>
            <td>Is disabled</td>
            <td>Allows disabling the module so that the user is not able to interact with it. Sets the style class for the entire addon to <b>.disabled</b></td>
        </tr>
        <tr>
            <td>Extended mode</td>
            <td>In this mode after the recording is complete, it is possible only to play the recording, reset or download it. Only after resetting the recording, user can record again.</td>
        </tr>
        
    </tbody>
</table>

## Supported commands

<table border="1">
    <tbody>
        <tr>
            <th>Command name</th>
            <th>Parameters</th>
            <th>Description</th>
        </tr>
        <tr>
            <td>startRecording</td>
            <td>-</td>
            <td>It starts recording when the addon has just been loaded or the recording has been loaded.</td>
        </tr>
        <tr>
            <td>stopRecording</td>
            <td>-</td>
            <td>It stops recording.</td>
        </tr>
        <tr>
            <td>startPlaying</td>
            <td>-</td>
            <td>It starts playback if there is a loaded recording.</td>
        </tr>
        <tr>
            <td>stopPlaying</td>
            <td>-</td>
            <td>It stops playback.</td>
        </tr>
        <tr>
            <td>setShowErrorsMode</td>
            <td>-</td>
            <td>It sets the show errors mode. All actions such as playback or recording are interrupted. Causes the addon to be inactive. Sets the style class for the entire addon to <b>.disabled</b></td>
        </tr>
        <tr>
            <td>setWorkMode</td>
            <td>-</td>
            <td>It sets the work mode. All functions are available again.</td>
        </tr>
        <tr>
            <td>enable</td>
            <td>-</td>
            <td>All actions are restored. Removes the <b>.disabled</b> style class for the entire addon.</td>
        </tr>
        <tr>
            <td>disable</td>
            <td>-</td>
            <td>All actions such as playback or recording are interrupted. Causes the addon to be inactive. Sets the style class for the entire addon to <b>.disabled</b></td>
        </tr>
        <tr>
            <td>show</td>
            <td>-</td>
            <td>Shows the addon.</td>
        </tr>
        <tr>
            <td>hide</td>
            <td>-</td>
            <td>Hides the addon.</td>
        </tr>
        <tr>
            <td>reset</td>
            <td>-</td>
            <td>It resets the addon. All actions such as playback or recording are interrupted. The user's recording is deleted and the default recording is loaded if it has been defined.</td>
        </tr>
    </tbody>
</table>

## Advanced Connector integration

Each command supported by the Media Recorder addon can be used in the Advanced Connector addon scripts. The below example shows how to react on changes within the Text module gap content (ie. while putting in it elements from Source List) and change the displayed video accordingly.

    EVENTSTART
    Source:Text1
    Value:1
    SCRIPTSTART
        var mediaRecorder = presenter.playerController.getModule('Media_Recorder1');
        mediaRecorder.startRecording();
    SCRIPTEND
    EVENTEND

## Addon style structure

<a href="https://mauthor.com/file/serve/5965417895690240">![alt style structure](https://mauthor.com/file/serve/5065371125809152)</a>

<br/>
The structure of the styles of the addon elements is shown above. You can overwrite the default configuration to get the expected effect.
<br/><br/>

<table border="1">
    <tbody>
        <tr>
            <th>Class name</th>
            <th>Description</th>
        </tr>
        <tr>
            <td>.media-recorder-wrapper</td>
            <td>The container of the whole addon.</td>
        </tr>
        <tr>
            <td>.media-recorder-player-wrapper</td>
            <td>The player container that supports the recording. It may contain elements of the audio or video type. The audio element has a forced style that makes it invisible.</td>
        </tr>
        <tr>
            <td>.media-recorder-wrapper.disabled</td>
            <td>The style class that is added to the container of the whole addon when it is inactive.</td>
        </tr>
        <tr>
            <td>.media-recorder-player-loader</td>
            <td>The container for the animation of loading the recording.</td>
        </tr>
        <tr>
            <td>.media-recorder-interface-wrapper</td>
            <td>The interface container including all interactive elements.</td>
        </tr>
        <tr>
            <td>.media-recorder-default-recording-play-button</td>
            <td>A container that performs the function of a two-state button for playing /stopping playing the default recording.</td>
        </tr>
        <tr>
            <td>.media-recorder-recording-button</td>
            <td>A container that performs the function of a two-state button for recording / stopping recording.</td>
        </tr>
        <tr>
            <td>.media-recorder-play-button</td>
            <td>A container that performs the function of a two-state button for playing / stopping playing.</td>
        </tr>
        <tr>
            <td>.media-recorder-timer</td>
            <td>The container of the recording time counter. The recording counter has the format: <b>mm:ss</b>, and while the playback: <b>mm:ss / mm:ss</b></td>
        </tr>
        <tr>
            <td>.media-recorder-sound-intensity</td>
            <td>The container showing the level of sound intensity. Its components are shown in the next table. The level of sound intensity is represented on a 6-level scale.</td>
        </tr>
        <tr>
            <td>.media-recorder-wrapper-browser-not-supported</td>
            <td>The style class that is added to the <b>.media-recorder-wrapper</b> when a browser is not supported.</td>
        </tr>
    </tbody>
</table>


<a href="https://mauthor.com/file/serve/5071920665722880">![alt style structure](https://mauthor.com/file/serve/5695933310042112)</a>

<table border="1">
    <tbody>
        <tr>
            <th>Class name</th>
            <th>Description</th>
        </tr>
        <tr>
            <td>.sound-intensity-large</td>
            <td>The style of the two large sound levels when the level is inactive.</td>
        </tr>
        <tr>
            <td>.sound-intensity-medium</td>
            <td>The style of the two medium sound levels when the level is inactive.</td>
        </tr>
        <tr>
            <td>.sound-intensity-low</td>
            <td>The style of the two low sound levels when the level is inactive.</td>
        </tr>
        <tr>
            <td>.selected</td>
            <td>The style class that is added to active sound levels.</td>
        </tr>
    </tbody>
</table>

## Events

<table border="1">
    <tr>
        <th>Event name</th>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td rowspan="3">ValueChanged</td>
        <td>source</td>
        <td>The sender's ID</td>
    </tr>
    <tr>
        <td>item</td>
        <td>Possible values:<br/>
            <li>recorder – for recording actions</li>
            <li>player – for playing a user recording </li>
            <li>default – for playing a default recording</li>
        </td>
    </tr>
    <tr>
        <td>value</td>
        <td>Possible values:<br/>
            <li>start – for starting recording / playing</li>
            <li>stop – for stopping recording / playing</li>
        </td>
    </tr>
</table>

## Default styles

    .media-recorder-wrapper {
        position: absolute;
        width: auto;
        height: auto;
        display: block;
    }

    .media-recorder-wrapper .media-recorder-player-wrapper {
        position: relative;
        width: auto;
        height: auto;
    }

    .media-recorder-wrapper .media-recorder-interface-wrapper {
        width: 300px;
        height: 40px;
        display: flex;
        align-items: center;
        background-color: #EBEFF0;
        border-radius: 20px;
        padding-left: 10px;
        -webkit-border-radius: 20px;
        -moz-border-radius: 20px;
    }

    .media-recorder-wrapper .media-recorder-recording-button {
        width: 25px;
        height: 25px;
        margin: 0px 3px;
        background: url('resources/003-record-button.svg') no-repeat center;
        background-size: 100%;
    }

    .media-recorder-wrapper .media-recorder-recording-button.selected {
        background: black url('resources/004-stop-button.svg') no-repeat center;
        border-radius: 50%;
        background-size: 100%;
    }

    .media-recorder-wrapper .media-recorder-play-button {
        width: 25px;
        height: 25px;
        margin: 0px 3px;
        background: url('resources/001-play-button.svg') no-repeat center;
        background-size: 100%;
    }

    .media-recorder-wrapper .media-recorder-play-button.selected {
        background: black url('resources/004-stop-button.svg') no-repeat center;
        background-size: 100%;
        border-radius: 50%;
    }

    .media-recorder-wrapper .media-recorder-default-recording-play-button {
        width: 25px;
        height: 25px;
        margin: 0px 3px;
        background: url('resources/002-play-default-recording-button.svg') no-repeat center;
        background-size: 100%;
    }

    .media-recorder-wrapper .media-recorder-default-recording-play-button.selected {
        background: black url('resources/004-stop-button.svg') no-repeat center;
        background-size: 100%;
        border-radius: 50%;
    }

    .media-recorder-wrapper .media-recorder-timer {
        width: 100px;
        height: 30px;
        line-height: 30px;
        margin: 0px 10px;
        text-align: center;
        font-size: 14px;
        color: grey;
        font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
    }

    .media-recorder-wrapper .media-recorder-sound-intensity {
        width: 20px;
        margin: 0px 10px;
        display: flex;
        flex-direction: column;
    }

    .media-recorder-wrapper .sound-intensity-large:first-child {
        border-top: 1px solid;
    }

    .media-recorder-wrapper .sound-intensity-large {
        width: 100%;
        height: 3px;
        border-bottom: 1px solid;
        background-color: #990000;
        margin: auto;
    }

    .media-recorder-wrapper .sound-intensity-large.selected {
        background-color: #FF0000;
    }

    .media-recorder-wrapper .sound-intensity-medium {
        width: 100%;
        height: 3px;
        border-bottom: 1px solid;
        background-color: #999900;
        margin: auto;
    }

    .media-recorder-wrapper .sound-intensity-medium.selected {
        background-color: #E4E400;
    }

    .media-recorder-wrapper .sound-intensity-low {
        width: 100%;
        height: 3px;
        border-bottom: 1px solid;
        background-color: #4C9900;
        margin: auto;
    }

    .media-recorder-wrapper .sound-intensity-low.selected {
        background-color: #71E200;
    }

    .media-recorder-wrapper .media-recorder-player-loader {
    }

    .media-recorder-wrapper .video-loader {
        border: 5px solid #f3f3f3;
        border-top: 5px solid #1d2830;
        border-radius: 50%;
        animation: spin 0.7s linear infinite;
        position: absolute;
        margin: auto;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
    }

    .media-recorder-wrapper.disabled {
        opacity: 0.5;
    }

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
 