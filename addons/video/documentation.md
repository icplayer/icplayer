## Description
The Video addon allows you to upload and embed video files in your presentation. It supports 3 video formats:

* MP4
* OGG Video
* WebM

Providing video in all of these formats is very important as different browsers and OS support different formats. If you don't have video conversion software installed, you can convert the files online using [http://video.online-convert.com/](http://video.online-convert.com/).

***Note:***
*Be careful with the video compression. We noticed that Windows Media Player (responsible for video playback on desktop browsers) experiences problems with playback when the video file dowload is interrupted with keyframe. To prevent this problem it is necessary to put keyframes in the film frequently enough (for example: 1 keyframe per second).*

The addon allows you to provide custom styled captions for the movie. Using CSS, you can move the captions, change their color and background.

The Video addon can be configured with more than one video file. Its API lets you change the movies dynamically with standard buttons. See the commands section for more details.


## Properties

<table border='1'>
<tbody>
    <tr>
        <th>Property name</th>
        <th>Description</th> 
    </tr>
    <tr>
        <td>Files</td>
        <td>A collection of movie files displayed by the addon. For each movie you can upload 3 video files in different formats, subtitles, a poster image (shown before and after playing the video) and a video ID (for command-based navigation). You can also select Loop video (It is recommended to set the resolution to 720p and if the key frame distance is left as "auto", the video doesn't loop properly). You can set time labels for each file, where a user can jump to labels by selecting them from the drop down menu. You can also add audio description for each file.

<p><em>This property allows online resources. <a href="/doc/page/Online-resources">Find out more »</a></em></p>

</td>
    </tr>
    <tr>
        <td>IDs</td>
        <td>A collection of movie IDs names with corresponding movie number. Movie numbers have to be positive integers from 1 to n, where n is the number of configured movie files</td>
    </tr>
    <tr>
        <td>Show video <b>(deprecated)</b></td>
        <td>This option is for Presentation Editor only! It allows you to view specified video (counted from 1 to n, where n is the number of uploaded videos). This works only with Show time option filled</td>
    </tr>
    <tr>
        <td>Show time <b>(deprecated)</b></td>
        <td>This option is for Presentation Editor only! It allows you to view specified time ('MM:SS'). This works only with Show video option filled</td>
    </tr>
    <tr>
        <td>Narration</td>
        <td>Narration for the recorded audio</td>
    </tr>
    <tr>
        <td>Hide subtitles</td>
        <td>If this option is selected, subtitles will be hidden on start</td>
    </tr>
    <tr>
        <td>Enable video speed controller</td>
        <td>If this option is selected, the video speed controller will be display on the video controller bar</td>
    </tr>
</tbody>
</table>


## Supported commands

<table border='1'>
<tbody>
    <tr>
        <th>Command name</th>
        <th>Params</th> 
        <th>Description</th> 
    </tr>
    <tr>
        <td>jumpTo</td>
        <td>movieNumber</td>
        <td>Jumps to specified movie number. Movie number should be from 1 to n, where n is the number of configured movie files. Providing a movie number out of this range will have no effect</td> 
    </tr>
    <tr>
        <td>jumpToID</td>
        <td>movieID</td>
        <td>Jumps to specified movie ID (provided in Addon configuration, IDs property). Providing a movie ID not defined in IDs property will have no effect</td> 
    </tr>
    <tr>
        <td>previous</td>
        <td>-</td> 
        <td>Jumps to previous movie. If the first movie is currently displayed this command will have no effect</td> 
    </tr>
    <tr>
        <td>next</td>
        <td>-</td> 
        <td>Jumps to next movie. If the last movie is currently displayed this command will have no effect</td> 
    </tr>
    <tr>
        <td>seek</td>
        <td>seconds</td>
        <td>Changes playback time to provided seconds in a currently played video</td>
    </tr>
    <tr>
        <td>show</td>
        <td>---</td>
        <td>Shows the video</td>
    </tr>
    <tr>
        <td>hide</td>
        <td>---</td>
        <td>Hides the video</td>
    </tr>
<tr>
        <td>play</td>
        <td>---</td>
        <td>Plays the video</td>
    </tr>
<tr>
        <td>stop</td>
        <td>---</td>
        <td>Stops the video</td>
    </tr>
<tr>
        <td>showSubtitles</td>
        <td>---</td>
        <td>Shows the subtitles</td>
    </tr>
<tr>
        <td>hideSubtitles</td>
        <td>---</td>
        <td>Hides the subtitles</td>
    </tr>
</tbody>
</table>

## Advanced Connector integration
Each command supported by the Video addon can be used in the Advanced Connector addon scripts. The below example shows how to react on Text module gap content changes (i.e. throughout putting in it elements from Source List) and change displayed video accordingly.

        EVENTSTART
        Source:Text2
        Value:1
        SCRIPTSTART
            var video = presenter.playerController.getModule('video1');
            video.jumpTo(1);
        SCRIPTEND
        EVENTEND
        EVENTSTART
        Source:Text2
        Value:2
        SCRIPTSTART
            var video = presenter.playerController.getModule('video1');
            video.jumpTo(2);
        SCRIPTEND
        EVENTEND
        EVENTSTART
        Source:Text2
        Value:3
        SCRIPTSTART
            var video = presenter.playerController.getModule('video1');
            video.jumpTo(3);
        SCRIPTEND
        EVENTEND

## Events
The Video addon sends ValueChanged type events to Event Bus when playback is finished.

<table border='1'>
<tbody>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <tr>
            <td>Item</td>
            <td>current movie index</td>
        </tr>
        <tr>
            <td>Value</td>
            <td>'ended' string</td>
        </tr>
        <tr>
            <td>Score</td>
            <td>N/A</td>
        </tr>
    </tr>
</tbody>
</table>

The playing event occurs when the video is playing.

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

The time update event is sent every second while the video is playing.

<table border='1'>
<tbody>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <tr>
            <td>Item</td>
            <td>current movie index</td>
        </tr>
        <tr>
            <td>Value</td>
            <td>current time in format MM:SS</td>
        </tr>
        <tr>
            <td>Score</td>
            <td>N/A</td>
        </tr>
    </tr>
</tbody>
</table>
		
## CSS addon classes

<table border="1">
  <tbody>
    <tr>
      <th style="width: 126px;">Class
name</th>
      <th
 style="width: 731px;">Description</th>
    </tr>
    <tr>
      <td style="width: 126px;">video-container</td>
      <td style="width: 731px;">DIV
surrounding the video element. The video element is a direct child of this
element.</td>
    </tr>
    <tr>
      <td style="width: 126px;">captions</td>
      <td style="width: 731px;">DIV
containing the captions. By default it has an absolute positioning in
reference to the video container and is played in the top left corner.</td>
    </tr>
	<tr>
      <td style="width: 126px;">playing</td>
      <td style="width: 731px;">This class is added when a video is being played.</td>
    </tr>
		<tr>
      <td style="width: 126px;">captions-container</td>
      <td style="width: 731px;">Div surrounding the captions. Size of this div will be changed by addon, shouldn't be styled.</td>
    </tr>
  </tbody>
</table>

## CSS control bar classes

<table border="1">
  <tbody>
    <tr>
      <th style="width: 126px;">Class
name</th>
      <th
 style="width: 731px;">Description</th>
    </tr>
    <tr>
      <td style="width: 126px;">CustomControlsBar-wrapper</td>
      <td style="width: 731px;">DIV surrounding the controls bar elements</td>
    </tr>
    <tr>
      <td style="width: 126px;">CustomControlsBar-wrapper-controls-controlsWrapper</td>
      <td style="width: 731px;">DIV containing all buttons in lower panel</td>
    </tr>
	<tr>
      <td style="width: 126px;">CustomControlsBar-wrapper-controls-play</td>
      <td style="width: 731px;">Play button which is visible when video is paused. CSS display value shouldn't be changed</td>
    </tr>
	<tr>
      <td style="width: 126px;">CustomControlsBar-wrapper-controls-pause</td>
      <td style="width: 731px;">Pause button which is visible when video is playing. CSS display value shouldn't be changed</td>
    </tr>
	<tr>
      <td style="width: 126px;">CustomControlsBar-wrapper <br/>
	  -controls-stop</td>
      <td style="width: 731px;">Stop button</td>
    </tr>
	<tr>
      <td style="width: 126px;">CustomControlsBar-wrapper<br/>
	  -controls-volume</td>
      <td style="width: 731px;">Volume button</td>
    </tr>	
	<tr>
      <td style="width: 126px;">CustomControlsBar-wrapper<br/>
	  -controls-volumeBarWrapper</td>
      <td style="width: 731px;">DIV container for volume bar elements</td>
    </tr>
	<tr>
      <td style="width: 126px;">CustomControlsBar-<br/>
	  -controls-volumeBarWrapper-volumeBackground</td>
      <td style="width: 731px;">DIV which is background for volume bar. Is visible if volume button is clicked. CSS display value shouldn't be changed</td>
    </tr>
	<tr>
      <td style="width: 126px;">CustomControlsBar-wrapper-controls<br/>
	  -volumeBarWrapper-volumeBackgroundSelected</td>
      <td style="width: 731px;">DIV which show how much volume is selected. Is visible if volume button is clicked. CSS display value shouldn't be changed</td>
    </tr>
	<tr>
      <td style="width: 126px;">CustomControlsBar-wrapper<br/>
	  -controls-fullscreen</td>
      <td style="width: 731px;">Fullscreen button. Is visible when addon is not in fullscreen. CSS display value shouldn't be changed</td>
    </tr>	
	<tr>
      <td style="width: 126px;">CustomControlsBar-wrapper<br/>
	  -controls-closeFullscreen</td>
      <td style="width: 731px;">Close fullscreen button. Is visible if addon is in fullscreen. CSS display value shouldn't be changed</td>
    </tr>	
	<tr>
      <td style="width: 126px;">CustomControlsBar-wrapper<br/>
	  -controls-timer</td>
      <td style="width: 731px;">DIV which contain actual duration time in video. Value is changed by addon.</td>
    </tr>	
	<tr>
      <td style="width: 126px;">CustomControlsBar-wrapper<br/>
	  -controls-progressBarWrapper</td>
      <td style="width: 731px;">DIV containing progress bar elements</td>
    </tr>	
	<tr>
      <td style="width: 126px;">CustomControlsBar-wrapper<br/>
	  -controls-progressBarWrapper-grayProgressBar</td>
      <td style="width: 731px;">Background for progress bar.</td>
    </tr>	
	<tr>
      <td style="width: 126px;">CustomControlsBar-wrapper<br/>
	  -controls-progressBarWrapper-redProgressBar</td>
      <td style="width: 731px;">Actual video progress.</td>
    </tr>
<tr>
      <td style="width: 126px;">video-poster-play</td>
      <td style="width: 731px;">Play "watermark" button class.</td>
    </tr>
<tr>
      <td style="width: 126px;">video-poster-pause</td>
      <td style="width: 731px;">Additional "watermark" button class when video is paused.</td>
    </tr>	
  </tbody>
</table>      

# Default styles
	.video-container .CustomControlsBar-wrapper {
		bottom : 0px;
		left : 0px;
		background-color: #EBEFF0;
		height: 40px;
		width: 100%;
		position: absolute;
	}

	.video-container .CustomControlsBar-wrapper-controls-controlsWrapper {
		margin-top: 3px;
		position: absolute;
		height: 37px;
		width: 100%;
	}

	.video-container-video {
		display: block;
		pointer-events: none;
		position: absolute;
	}

	.video-container .CustomControlsBar-wrapper-controls-play {
		height: 100%;
		width: 38px;
		background: url("resources/video-play-btn.png") no-repeat center;
		box-sizing: border-box;
		cursor: pointer;
		float: left;

	}

	.video-container .CustomControlsBar-wrapper-controls-pause {
		height: 100%;
		width: 38px;
		background: url("resources/video-pause-btn.png") no-repeat center;
		box-sizing: border-box;
		cursor: pointer;
		float: left;

	}

	.video-container .CustomControlsBar-wrapper-controls-stop {
		height: 100%;
		width: 40px;
		background: url("resources/video-stop-btn.png") no-repeat center center;
		cursor: pointer;
		float: left;

	}

	.video-container .CustomControlsBar-wrapper-controls-progressBarWrapper {
		position:absolute;
		width: 100%;
		height: 3px;
		float: left;
	}

	.video-container .CustomControlsBar-wrapper-controls-progressBarWrapper:hover {
		height: 6px;
	}

	.video-container .CustomControlsBar-wrapper-controls-progressBarWrapper-redProgressBar {
		background-color: red;
		height: 100%;
		position:absolute;
	}

	.video-container .CustomControlsBar-wrapper-controls-progressBarWrapper-grayProgressBar {
		background-color: dimgrey;
		width: 100%;
		height: 100%;
		position:absolute;
	}

	.video-container .CustomControlsBar-wrapper-controls-volume {
		height: 100%;
		width: 40px;
		background: url("resources/video-volume-btn.png") no-repeat center center;
		cursor: pointer;
		float: left;

	}

	.video-container .CustomControlsBar-wrapper-controls-volumeBarWrapper {
		height: 100%;
		float: left;
		cursor: pointer;
	}

	.video-container .CustomControlsBar-wrapper-controls-volumeBarWrapper-volumeBackground {
		width: 100px;
		height: 14px;
		border-bottom: solid 9px white;
		float: left;
		cursor: pointer;
		position: absolute;
	}

	.video-container .CustomControlsBar-wrapper-controls-volumeBarWrapper-volumeBackgroundSelected {
		width: 100px;
		height: 14px;
		border-bottom: solid 9px lightgrey;
		float: left;
		cursor: pointer;
		position: absolute;
	}

	.video-container .CustomControlsBar-wrapper-controls-fullscreen {
		float: right;
		width: 40px;
		height: 100%;
		background: url("resources/video-fullscreen-btn.png") no-repeat center center;
		cursor: pointer;
	}

	.video-container .CustomControlsBar-wrapper-controls-closeFullscreen {
		float: right;
		width: 40px;
		height: 100%;
		background: url("resources/video-close-fullscreen-btn.png") no-repeat center center;
		cursor: pointer;
	}

	.video-container .CustomControlsBar-wrapper-controls-timer {
		height: 40px;
		color: gray;
		font-size: 14px;
		padding-right: 10px;
		display: flex;
		align-items: center;
		float: right;

	}

## Managing subtitles

This option in full-screen mode is supported by Chrome, Firefox, Safari.

Subtitles should be provided in a following format:

    0|2|100|200|red|This is a sample text
    2.5|4|10|10|green|Another line of text

Subtitles should be entered into subtitles property of the addon.
Each line represents a separate caption. Values are separated by a vertical bar. 

* The first value is a start time
* The second value is an end time of the caption
* The third value is vertical distance from the top edge
* The fourth value is horizontal distance from the left edge
* The fifth value is an additional CSS class that will be used for this specific caption
* The sixth value is the caption text itself

If you don't need a specific CSS class for a caption, just ommit it ("0|2|0|0||Text"). 

Using the presentation's CSS editor you can alter how each caption is displayed. For example:

    .video .green {
        color: green;
        font-weight: bold;
        background-color: #fff;
    }

This will make the class green and change the font color to green, together with font weight and background color.      

## Time labels

Each file can contain time labels. After adding the time labels, user can jump to the given time by selecting the time label from the drop down menu in the  video controls bar.

Time labels should be provided in the following format:

	<Hour>:<Minute>:<Second> <Label>
	<Minute>:<Second> <Label>
	<Second> <Label>
	
Time must be separated from a label by space.	
	
Labels will be visible in a drop down menu and they are optional. If the label is empty, the time will be visible in a drop down menu.

## Managing audio description

Audio descriptions should be provided in the following format:

    0|100|200|red|en|This is a sample text
    2.5|10|10|green|en|Another line of text

Audio descriptions should be entered into Audio Description property of the addon. Each line represents a separate description. Values are separated by a vertical bar.

* The first value is a start time
* The second value is the vertical distance from the top edge
* The third value is the horizontal distance from the left edge
* The fourth value is the additional CSS class that will be used for this specific caption
* The fifth value defines the language in which the description is read
* The sixth value is the description text itself

If you don't need a specific CSS class for a caption, just omit it. The same applies if you want the description to be read in the language defined in the properties of the lesson. ("0|0|0|||Text").

## Keyboard navigation
* Space – play/pause.
* Up/Down arrows – volume up/down.
* Left/Right arrows – backwards/forwards.
* Shift + Left/Right arrows – jump to a previous/next time label.

## Demo presentation
[Demo presentation](/embed/2830041 "Demo presentation") contains examples of how this addon can be used.                                 