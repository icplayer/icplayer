## Description
This addon is an extension of the [Image Viewer Addon](/doc/page/Image-Viewer "Image Viewer Addon"). It has one additional command - changeFlag, allowing its integration with modules like [Double State Button](/doc/page/Double-State-Button "Double State Button").

Like the original addon, it allows users to embed simple animations where new frames are shown on a mouse click. It also allows users to add a sound notification on a changing frame. It supports 3 video formats:

* MP3
* OGG Vorbis
* AAC

Additionally,  the addon is extended with Frame names. Those frame names were added to integrate Image Viewer with Image Gap addon. Of course it can serve for other purposes - possibilities are limited to the author's imagination.

**Note:** Image Viewer Button Controlled supports the following graphic formats: JPG, PNG, BMP. Vector formats are not supported.


## Properties

<table border='1'>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Images</td>
        <td>An image which serves as a fundamental for the animation. It should contain at least one frame.
<p><em>This property allows online resources. <a href="/doc/page/Online-resources">Find out more »</a></em></p>
</td>
    </tr>
    <tr>
        <td>Frames</td>
        <td>Number of frames specifies to how many pieces an image will be spitted. In our example it is 6. Remember to set only positive integer numbers here!</td>
    </tr>
    <tr>
        <td>Frame size</td>
        <td>List of possible frame size adjustments to Addon size. Choice is from: Original (no changes), 'Keep aspect ratio' and 'Stretched' </td>
    </tr>
    <tr>
        <td>Sounds</td>
        <td>A collection of audio files played by the addon on frame change. For each frame you can upload 3 audio files in different formats. Sounds will be played on frame change accordingly to order of sounds set. If playing audio on some frame change is undesirable then don't upload files and just leave this Item empty.
<p><em>This property allows online resources. <a href="/doc/page/Online-resources">Find out more »</a></em></p>
</td>
    </tr>
    <tr>
        <td>Frame names</td>
        <td>A collection of frame names with corresponding frame number. Frame numbers have to be positive integers from 1 to frames count</td>
    </tr>
    <tr>
        <td>isClickDisabled</td>
        <td>With this option selected user is disabling mouse click on Image Viewer Addon and limits the frame manipulation to commands</td>
    </tr>
    <tr>
        <td>Labels</td>
        <td>A collection of text label shown at given frame. Each Label is composed of text string, its position (counted from slide upper-left corner) in pixels and list of frames on which Label should be displayed. Frames can be specified as comma separated list of numbers or their's range (i.e. 1-3,5 will display Label on frames 1,2,3 and 5).</td>
    </tr>
    <tr>
        <td>Show frame</td>
        <td>This option is for Presentation Editor only! It allows you to view specified frame (counted from 1 to Frames)</td>
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
        <td>moveToFrame</td>
        <td>frame</td>
        <td>Change displayed frame to specified</td>
    </tr>
    <tr>
        <td>moveToFrameName</td>
        <td>frameName</td>
        <td>Change displayed frame to one specified in Frame names property</td>
    </tr>
    <tr>
        <td>changeFlag</td>
        <td>flag</td>
        <td>Change given flag to 1 (0) if flag is set to 0 (1)</td>
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

### Example
<img src='/file/serve/561094' width="100%"/>

Above image contain 8 frames: black-white, red, green, red-green, blue, red-blue, green-blue and red-green-blue. Those frames shows image with only some (or none) color pallets displayed in RGB.
The combination of flags (in our example color pallets) turned on/off is shown below.

<table border='true'>
    <tr>
        <th>3 - "Blue"</th>
        <th>2 - "Green"</th>
        <th>1 - "Red"</th>
        <th>Frame</th>
    </tr>
    <tr>
        <td>0</td>
        <td>0</td>
        <td>0</td>
        <td>1</td>
    </tr>
    <tr>
        <td>0</td>
        <td>0</td>
        <td>1</td>
        <td>2</td>
    </tr>
    <tr>
        <td>0</td>
        <td>1</td>
        <td>0</td>
        <td>3</td>
    </tr>
    <tr>
        <td>0</td>
        <td>1</td>
        <td>1</td>
        <td>4</td>
    </tr>
    <tr>
        <td>1</td>
        <td>0</td>
        <td>0</td>
        <td>5</td>
    </tr>
    <tr>
        <td>1</td>
        <td>0</td>
        <td>1</td>
        <td>6</td>
    </tr>
    <tr>
        <td>1</td>
        <td>1</td>
        <td>0</td>
        <td>7</td>
    </tr>
    <tr>
        <td>1</td>
        <td>1</td>
        <td>1</td>
        <td>8</td>
    </tr>
</table>

Setting proper flags will result in displying frame accordingly to table above.
Because flags can have only two values, 0 (off) and 1 (on), number of flags should be chosen properly. In example above image has 8 frames, so 3 flags is suitable. Because of that fact, i.e. setting on flag number 9 will have no effect - calculated combination of flags from 1 to 9 will result in frame number bigger than frames number.

## Advanced Connector integration
Each command supported by Image Viewer Button Controlled addon can be used in the Advanced Connector addon scripts. The below example shows how to implement excercise from a demo presentation with RGB colors in Advanced Connector.

        EVENTSTART
        Source:Text1
        Value:Red
        SCRIPTSTART
            var imageViewer = presenter.playerController.getModule('Image_Viewer_Button_Controlled_Public1');
            imageViewer.moveToFrame(2);
        SCRIPTEND
        EVENTEND
        EVENTSTART
        Source:Text1
        Value:Green
        SCRIPTSTART
            var imageViewer = presenter.playerController.getModule('Image_Viewer_Button_Controlled_Public1');
            imageViewer.moveToFrame(3);
        SCRIPTEND
        EVENTEND
        EVENTSTART
        Source:Text1
        Value:Blue
        SCRIPTSTART
            var imageViewer = presenter.playerController.getModule('Image_Viewer_Button_Controlled_Public1');
            imageViewer.moveToFrame(5);
        SCRIPTEND
        EVENTEND
        EVENTSTART
        Source:Text1
        Value:^$
        SCRIPTSTART
            var imageViewer = presenter.playerController.getModule('Image_Viewer_Button_Controlled_Public1');
            imageViewer.moveToFrame(1);
        SCRIPTEND
        EVENTEND

## CSS classes

<table border='1'>
    <tr>
        <th>Class name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>image-viewer</td>
        <td>DIV surrounding the image element. image element is a direct child of this element</td>
    </tr>
    <tr>
        <td>image-viewer-label</td>
        <td>Labels are span elements which are show when animation isn't playing. Do not change/set position attributes for this elements!</td>
    </tr>
    <tr>
        <td>image-viewer-loading-image</td>
        <td>Loading image showed while loading resources. Image is placed in slides center. Default width and hight are 50px. Do not change/set position attributes for this elements!</td>
    </tr>
</table>

Addon accepts all CSS selectors and modificators. I.e. if user would like to specify separate appearance for image on mouse hover CSS declaration could look like this:<br/><br/>
.Image_Viewer_Button_Controlled_Public_custom {<br/>
}<br/>
<br/>
.Image_Viewer_Button_Controlled_Public_custom .image-viewer {<br/>
&nbsp;&nbsp;border: 2px solid black;<br/>
}<br/>
<br/>
<b>.Image_Viewer_Button_Controlled_Public_custom .image-viewer:hover</b> {<br/>
&nbsp;&nbsp;border: 2px solid red;<br/>
}<br/>
<br/>
This declaration will result in red border on mouse hover over Addon.

## Demo presentation
[Demo presentation](/embed/2495361 "Demo presentation") contain example of how to use Image Viewer Button Controlled Addon.        