## Description
This addon allows users to embed simple animations where new frames are shown on a mouse click. It also allows users to add a sound notification on a changing frame. It supports 3 audio formats:

* MP3
* OGG Vorbis
* AAC

Additionally, this addon is extended with frame names. These frame names were added to integrate Image Viewer with the Image Gap addon. Of course it can serve other purposes - possibilities are limited to the author's imagination.

**Note:** Image Viewer supports the following graphic formats: JPG, PNG, BMP. Vector formats are not supported.

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
        <td>Number of frames specifies to how many pieces an image will be split. In our example it is 6. Remember to set only positive integer numbers here!</td>
    </tr>
    <tr>
        <td>Frame size</td>
        <td>List of possible frame size adjustments to Addon size. Choice is from: Original (no changes), 'Keep aspect ratio' and 'Stretched' </td>
    </tr>
    <tr>
        <td>Sounds</td>
        <td>A collection of audio files played by the addon on a frame change. For each frame you can upload 3 audio files in different formats. Sounds will be played on a frame change accordingly to the order of sounds set. If playing audio on some frame change is unwanted, it is enough not to upload relevant files and just leave this Item empty.

<p><em>This property allows online resources. <a href="/doc/page/Online-resources">Find out more »</a></em></p>
</td>
    </tr>
    <tr>
        <td>Frame names</td>
        <td>A collection of frame names with corresponding frame numbers. Frame numbers have to be positive integers from 1 to frames count</td>
    </tr>
    <tr>
        <td>isClickDisabled</td>
        <td>With this option selected, user is disabling mouse click on the Image Viewer addon and limits the frame manipulation to commands</td>
    </tr>
    <tr>
        <td>Labels</td>
        <td>A collection of text label shown at given frame. Each Label is composed of text string, its position (counted from slide upper-left corner) in pixels and list of frames on which Label should be displayed. Frames can be specified as comma separated list of numbers or their range (i.e. 1-3,5 will display Label on frames 1,2,3 and 5)</td>
    </tr>
    <tr>
        <td>Show watermark</td>
        <td>With this option selected, a watermark will be displayed after the addon's start. Its purpose is to inform user to click the addon in order to start the presentation</td>
    </tr>
    <tr>
        <td>Watermark color</td>
        <td>Watermark color in #RRGGBB format (default is #000000 - black)</td>
    </tr>
    <tr>
        <td>Watermark opacity</td>
        <td>Watermark opacity (value must be between 1 - fully visible and 0 - fully transparent, default is 1)</td>
    </tr>
    <tr>
        <td>Watermark size</td>
        <td>Watermark size counted in pixels</td>
    </tr>
    <tr>
        <td>Animation</td>
        <td>List of possible animations during frame change. Choice is from: None (simple change), 'Linear' and 'Fading'</td>
    </tr>
    <tr>
        <td>Correct frames</td>
        <td>List of comma separated frames that are treated as correct answers. If nothing is set, the addon acts as a static module without points calculation</td>
    </tr>
    <tr>
        <td>Show frame</td>
        <td>This option is for the Presentation Editor only! It allows you to view a specified frame (counted from 1 to Frames)</td>
    </tr>
    <tr>
        <td>Do not reset</td>
        <td>If this property is checked, then Reset button will NOT revert any changes.</td>
    </tr>
    <tr>
         <td>Random frame</td>
         <td>If this property is checked, then random frame is displayed.</td>
     </tr>
    <tr>
        <td>Initial frame</td>
        <td>It's a number of a frame to display.</td>
    </tr>
    <tr>
        <td>Show frame counter</td>
        <td>If this property is checked, frame counter is displayed</td>
    </tr>
    <tr>
        <td>Base width</td>
        <td>Base width and base height properties are used for positioning labels. If the current dimensions of the addon differ from those provided in the Base width/height property (such as, because the addon has a different size depending on the selected layout), the position of the labels will be scaled appropriately. If the properties are left empty, the position of the labels will be the same regardless of the size of the addon.</td>
    </tr>
    <tr>
        <td>Base height</td>
        <td>This property is used for positioning labels. See "Base width" property for more details.</td>
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
        <td>next</td>
        <td>---</td>
        <td>Change displayed frame to next one (or first if last frame was displayed)</td>
    </tr>
    <tr>
        <td>previous</td>
        <td>---</td>
        <td>Change displayed frame to next one (or last if first frame was displayed)</td>
    </tr>
    <tr>
        <td>moveToFrame</td>
        <td>frame</td>
        <td>Change displayed frame to specified one</td>
    </tr>
    <tr>
        <td>moveToFrameName</td>
        <td>frameName</td>
        <td>Change displayed frame to one specified in Frame names property</td>
    </tr>
    <tr>
        <td>getCurrentFrame</td>
        <td>---</td>
        <td>Returns current frame number (values from 1 to frames count)</td>
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
    <tr>
        <td>markAsCorrect</td>
        <td>---</td>
        <td>Marks addon as correct (adds the "correct" class to image-viewer and removes the "wrong" class</td>
    </tr>
    <tr>
        <td>markAsWrong</td>
        <td>---</td>
        <td>Marks addon as wrong (adds the "wrong" class to image-viewer and removes the "correct" class</td>
    </tr>
    <tr>
        <td>setClickDisabled</td>
        <td>---</td>
        <td>Blocks the option of clicking on the module</td>
    </tr>
    <tr>
        <td>setClickEnabled</td>
        <td>---</td>
        <td>Allows user to click on the module</td>
    </tr>
</table>

## Advanced Connector integration
Each command supported by Image Viewer addon can be used in the Advanced Connector addon scripts. The below example shows how to react on Text module gap content changes (i.e. throughout putting in it elements from Source List) and change displayed frame accordingly.

        EVENTSTART
        Source:Text2
        Value:1
        SCRIPTSTART
            var imageViewer = presenter.playerController.getModule('Image_Viewer_Public1');
            imageViewer.moveToFrame(1);
        SCRIPTEND
        EVENTEND
        EVENTSTART
        Source:Text2
        Value:2
        SCRIPTSTART
            var imageViewer = presenter.playerController.getModule('Image_Viewer_Public1');
            imageViewer.moveToFrame(2);
        SCRIPTEND
        EVENTEND
        EVENTSTART
        Source:Text2
        Value:3
        SCRIPTSTART
            var imageViewer = presenter.playerController.getModule('Image_Viewer_Public1');
            imageViewer.moveToFrame(3);
        SCRIPTEND
        EVENTEND
        EVENTSTART
        Source:Text2
        Value:4
        SCRIPTSTART
            var imageViewer = presenter.playerController.getModule('Image_Viewer_Public1');
            imageViewer.moveToFrame(4);
        SCRIPTEND
        EVENTEND
        EVENTSTART
        Source:Text2
        Value:5
        SCRIPTSTART
            var imageViewer = presenter.playerController.getModule('Image_Viewer_Public1');
            imageViewer.moveToFrame(5);
        SCRIPTEND
        EVENTEND
        EVENTSTART
        Source:Text2
        Value:6
        SCRIPTSTART
            var imageViewer = presenter.playerController.getModule('Image_Viewer_Public1');
            imageViewer.moveToFrame(6);
        SCRIPTEND
        EVENTEND

## Scoring
Imaga Viewer addon allows to create exercises as well as activities. To set module in excercise mode set 'Correct frames' property. If Addon is not in excercise mode, all of below methods returns 0!

<table border='1'>
    <tr>
        <th>Property</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>maxScore</td>
        <td>maximum score is 1 point</td>
    </tr>
    <tr>
        <td>score</td>
        <td>1 if user selects one of specified correct frames, otherwise 0</td>
    </tr>
    <tr>
        <td>errorCount</td>
        <td>0 if user selects one of specified correct frames, otherwise 1</td>
    </tr>
</table>

## Events

Image Viewer Addon sends ValueChanged type events to Event Bus when frame is changed.

<table border='1'>
<tbody>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <tr>
            <td>Item</td>
            <td>Current frame number (1 to n)</td>
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

## CSS classes

<table border='1'>
    <tr>
        <th>Class name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>image-viewer</td>
        <td>DIV surrounding the image element. Image element is a direct child of this element</td>
    </tr>
    <tr>
        <td>correct</td>
        <td>Additional class for image-viewer element for correctly selected frame in error checking mode</td>
    </tr>
    <tr>
        <td>wrong</td>
        <td>Additional class for image-viewer element for incorrectly selected frame in error checking mode</td>
    </tr>
    <tr>
        <td>image-viewer-helper</td>
        <td>DIV element, child of image-viewer element, adding more styling possibilities</td>
    </tr>
    <tr>
        <td>image-viewer-label</td>
        <td>Labels are span elements which are show when animation isn't playing. Do not change/set position attributes for this elements!</td>
    </tr>
    <tr>
        <td>image-viewer-loading-image</td>
        <td>Loading image showed while loading resources. Image is placed in slides center. Default width and hight are 50px. Do not change/set position attributes for this elements!</td>
    </tr>
    <tr>
        <td>image-viewer-watermark</td>
        <td>DIV surrounding watermark canvas element</td>
    </tr>
    <tr>
        <td>frame-counter-wrapper</td>
        <td>DIV element, parent of .frame-counter element</td>
    </tr>
    <tr>
        <td>frame-counter</td>
        <td>DIV element containing all dots elements</td>
    </tr>
    <tr>
        <td>dot</td>
        <td>DIV element representing page</td>
    </tr>
    <tr>
        <td>current</td>
        <td>additional class for .dot element representing current frame dot</td>
    </tr>
</table>

Addon accepts all CSS selectors and modificators, i.e. if user would like to specify a different appearance for image on mouse hover, a CSS declaration could look like this:<br/><br/>
.Image_Viewer_Public_custom {<br/>
}<br/>
<br/>
.Image_Viewer_Public_custom .image-viewer {<br/>
&nbsp;&nbsp;border: 2px solid black;<br/>
}<br/>
<br/>
<b>.Image_Viewer_Public_custom .image-viewer:hover</b> {<br/>
&nbsp;&nbsp;border: 2px solid red;<br/>
}<br/>
<br/>
This declaration will result in red border on mouse hover over Addon.

## Demo presentation
[Demo presentation](/embed/2489519 "Demo presentation") contains examples of how to integrate Image Viewer with other Addons, i.e. Image Gap in different ways.                     