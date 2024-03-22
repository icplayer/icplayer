## Description
The Slideshow addon allows users to embed a slideshow presentation together with the corresponding audio recording.

**Note:** Image Viewer supports the following graphic formats: JPG, PNG, BMP. Vector formats are not supported.

<div style="border:1px solid Tomato; padding:5px; margin-bottom:21px;">
Note: It's recommended to use files with <a href="http://en.wikipedia.org/wiki/Bit_rate">bitrate</a> 64 kb/s or higher. The files with lower quality could experience some difficulties in reproduction.
It's also important that audio files have <strong>constant bitrate</strong> because Mozilla Firefox experiences problems while seeking in the files that have variable bitrate mode.
</div>

## Properties

<table border='1'>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Audio</td>
        <td>A collection of audio files played by the Addon. Only first item is taken under consideration as narration for the slideshow. Supported formats are: MP3 and OGG Vorbis.
<p><em>This property allows online resources. <a href="/doc/page/Online-resources">Find out more »</a></em></p>
</td>
    </tr>
    <tr>
        <td>Slides</td>
        <td>A collection of slides composed of image file (slide) and starting time in MM:SS format. First slide always starts at 00:00 regardless of the user input.
<p><em>This property allows online resources. <a href="/doc/page/Online-resources">Find out more »</a></em></p>
</td>
    </tr>
    <tr>
        <td>Texts</td>
        <td>A collection of text label shown at some time of presentation. Each Text is composed of text string, starting end ending time (in MM:SS format) and its position (counted from slide upper-left corner) in pixels</td>
    </tr>
    <tr>
        <td>Slide animation</td>
        <td>Selecting this property will result in showing and hidding slides with additional animation (except for selecting specific slide with Previous and Next buttons)</td>
    </tr>
    <tr>
        <td>Text animation</td>
        <td>Selecting this property will result in showing and hidding text label with additional animation (except for selecting specific slide with Previous and Next buttons)</td>
    </tr>
    <tr>
        <td>Hide progressbar</td>
        <td>Selecting this property will result in hiding progress bar (which results in more space for other Slideshow controls elements))</td>
    </tr>
    <tr>
        <td>Show slide</td>
        <td>This option is for Presentation Editor only! It allows you to view specified slide (counted from 1 to Frames)</td>
    </tr>
    <tr>
        <td>Group next and previous buttons</td>
        <td>Wrap Next and Previous buttons in additional DIV element</td>
    </tr>
    <tr>
        <td>Narration</td>
        <td>Narration for recorded audio</td>
    </tr>
    <tr>
        <td>Base width</td>
        <td>Base width and base height properties are used for positioning texts. If the current dimensions of the addon differ from those provided in the Base width/height property (such as, because the addon has a different size depending on the selected layout), the position of the texts will be scaled appropriately. If the properties are left empty, the position of the texts will be the same regardless of the size of the addon.</td>
    </tr>
    <tr>
        <td>Base height</td>
        <td>This property is used for positioning texts. See "Base width" property for more details.</td>
    </tr>
</table>

## Events

The end event occurs when the slideshow playback is finished.
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

The playing event occurs when the slideshow is playing.

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

The pause event occurs when the slideshow is paused.

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

The stop event occurs when the slideshow is stopped.

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
            <td>stop</td>
        </tr>
        <tr>
            <td>Score</td>
            <td>N/A</td>
        </tr>
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
        <td>---</td>
        <td>Shows the module.</td>
    </tr>
    <tr>
        <td>hide</td>
        <td>---</td>
        <td>Hides the module.</td>
    </tr>
    <tr>
        <td>play</td>
        <td>---</td>
        <td>Plays the module.</td>
    </tr>
    <tr>
        <td>pause</td>
        <td>---</td>
        <td>Pauses the module.</td>
    </tr>
    <tr>
        <td>stop</td>
        <td>---</td>
        <td>Stops the module.</td>
    </tr>
    <tr>
        <td>next</td>
        <td>---</td>
        <td>Changes a slide to the next one if available. Sets audio to the time set in the next slide.</td>
    </tr>
    <tr>
        <td>previous</td>
        <td>---</td>
        <td>Changes a slide to the previous one if available. Sets audio to the time set in the next slide.</td>
    </tr>
    <tr>
        <td>moveTo</td>
        <td>Slide index</td>
        <td>Changes a slide to the provided slide index if such a slide exists. Sets audio to the time set in the selected slide.</td>
    </tr>

</table>

## Advanced Connector integration

Each command supported by SlideShow Addon can be used in Advanced Connector Addon scripts. Below example shows how to show the addon, when is invisible.

    EVENTSTART
    Source:Text2
    SCRIPTSTART
        var slideShowModule = presenter.playerController.getModule('Slideshow1');
        slideShowModule.show();
    SCRIPTEND
    EVENTEND

## CSS classes

<table border='1'>
    <tr>
        <th>Class name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>slideshow-container</td>
        <td>DIV surrounding all slideshow elements. Slides, texts and controls panel elements are a direct childs of this element</td>
    </tr>
    <tr>
        <td>slideshow-container-slide</td>
        <td>Slides are DIV elements (with background-image property set to image) which are shown/hidden accordingly to narration time. Do not change/set position attributes for this elements!</td>
    </tr>
    <tr>
        <td>slideshow-container-text</td>
        <td>Texts are span elements which are shown/hidden accordingly to narration time. Do not change/set position attributes for this elements!</td>
    </tr>
    <tr>
        <td>slideshow-controls-container</td>
        <td>DIV containing all controls elements. It's width is adjusted to Addons Width property. Height is by default 50px (with horizontal padding, each 5px), but can be changed by user freely. Each child elements have height equal 40px (except for progress bar components)</td>
    </tr>
    <tr>
        <td>slideshow-controls-timer</td>
        <td>DIV containing spans for current playback time and audio duration. Default width is 120px and shouldn't be lowered by user</td>
    </tr>
    <tr>
        <td>slideshow-controls-timer-time</td>
        <td>SPAN element containing narration current time</td>
    </tr>
    <tr>
        <td>slideshow-controls-timer-duration</td>
        <td>SPAN element containing audio file duration</td>
    </tr>
    <tr>
        <td>slideshow-controls-play</td>
        <td>Button to start narration. It's default width is 40px</td>
    </tr>
    <tr>
        <td>slideshow-controls-play-pause</td>
        <td>Button to pause narration. It's default width is 40px</td>
    </tr>
    <tr>
        <td>slideshow-controls-stop</td>
        <td>Button to stop narration. It's default width is 40px</td>
    </tr>
    <tr>
        <td>slideshow-controls-previous</td>
        <td>Button to select previous slide (if possible) and change narration time to specified in configuration time. It's default width is 40px</td>
    </tr>
    <tr>
        <td>slideshow-controls-previous-inactive</td>
        <td>Button to select previous slide if there are no previous slides available</td>
    </tr>
    <tr>
        <td>slideshow-controls-next</td>
        <td>Button to select next slide (if possible) and change narration time to specified in configuration time. It's default width is 40px</td>
    </tr>
    <tr>
        <td>slideshow-controls-next-inactive</td>
        <td>Button to select next slide if there are no more slides available</td>
    </tr>
    <tr>
        <td>slideshow-controls-navigation</td>
        <td>Next and Previous buttons container while 'Group next and previous buttons' option is checked</td>
    </tr>
    <tr>
        <td>slideshow-controls-progressbar</td>
        <td>DIV element which contains narration progress bar. It's width is automaticly set on Addon creation to use all spare space in controls sections.</td>
    </tr>
    <tr>
        <td>slideshow-controls-progressbar-slider</td>
        <td>DIV element which serves as slider. By default it's shape is a circle, but can be freely changed by user. Do not change/set position attributes for this elements!</td>
    </tr>
    <tr>
        <td>slideshow-controls-progressbar-line</td>
        <td>DIV element which serves as horizontal line. Do not change/set position attributes for this elements!</td>
    </tr>
    <tr>
        <td>slideshow-loading-image</td>
        <td>Loading image showed while loading resources. Image is placed in slides center. Default width and hight are 80px. Do not change/set position attributes for this elements!</td>
    </tr>
    <tr>
        <td>slideshow-loading-text</td>
        <td>Loading status showed while loading resources. Element is placed at slides bottom. Default width is 250px and hight is 40px. Do not change/set position attributes for this elements!</td>
    </tr>
    <tr>
        <td>slideshow-controls-play-mouse-hover,<br/>
            slideshow-controls-play-pause-mouse-hover,<br/>
            slideshow-controls-stop-mouse-hover,<br/>
            slideshow-controls-previous-mouse-hover,<br/>
            slideshow-controls-previous-inactive-mouse-hover,<br/>
            slideshow-controls-next-mouse-hover,<br/>
            slideshow-controls-next-inactive-mouse-hover
        </td>
        <td>Buttons states on mouse hover</td>
    </tr>
</table>

## Demo presentation
[Demo presentation](/embed/4247034 "Demo presentation") contains examples of how to use Slideshow Addon.               