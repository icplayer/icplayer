## Description
The Animation addon allows users to add the animation made from a single image to a presentation. To start the animation, simply click on a preview image, then click again to pause it. If you want to stop it, use the stop() command (described below).

## Properties

<table border='1'>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Preview image</td>
        <td>An image which serves as a cover (thumbnail) for the animation.
<p><em>This property allows online resources. <a href="/doc/page/Online-resources">Find out more »</a></em></p>
</td>
    </tr>
    <tr>
        <td>Animation</td>
        <td>An image which serves as a fundamental for the animation. It should contain at least one frame.
<p><em>This property allows online resources. <a href="/doc/page/Online-resources">Find out more »</a></em></p>
</td>
    </tr>
    <tr>
        <td>Frames count</td>
        <td>Number of frames specifies to how many pieces an image will be spitted. In our example it is 6. Remember to set only positive integer numbers here!</td>
    </tr>
    <tr>
        <td>Frame duration</td>
        <td>Time (in miliseconds) between each frame change.</td>
    </tr>
    <tr>
        <td>Frame size</td>
        <td>A list of possible frame size adjustments to the addon's size. The choice is between: Original (no changes), 'Keep aspect ratio' and 'Stretched' </td>
    </tr>
    <tr>
        <td>Loop</td>
        <td>With this option selected, animation doesn't stop after last frame - it starts from the beginning</td>
    </tr>
    <tr>
        <td>Labels</td>
        <td>A collection of text labels shown at the beginning of the animation (when the Preview image is displayed). Each label is composed of a text string and its position (counted from slide upper-left corner) in pixels</td>
    </tr>
    <tr>
        <td>Show watermark</td>
        <td>With this option selected, a watermark will be displayed after the addon's start. It's purpose is to inform a user that it is necesary to click the addon to start the presentation</td>
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
        <td>Don't reset on end</td>
        <td>With this option selected, a preview image will not be displayed after the animation ends</td>
    </tr>
    <tr>
        <td>Is click disabled</td>
        <td>With this option selected, a user can interact with the addon only via commands (mouse actions are disabled)</td>
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

### Animation image example
<img src='/file/serve/793051' width="100%"/><br/>

The above image contains 6 frames, each with equal width and heigh.

## Supported commands

<table border='1'>
    <tr>
        <th>Command name</th>
        <th>Params</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>stop</td>
        <td>---</td>
        <td>Stops the animation and displays a Preview image</td>
    </tr>
    <tr>
        <td>play</td>
        <td>---</td>
        <td>Starts the animation</td>
    </tr>
    <tr>
        <td>pause</td>
        <td>---</td>
        <td>Pauses the animation</td>
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
Each command supported by the Animation addon can be used in Advanced Connector addon's scripts. Below example shows how to show and play the animation when a user selects the correct answer in a TrueFalse activity and how to stop it and hide it when the answer is incorrect.

    EVENTSTART
    Source:TrueFalse1
    Score:1
    SCRIPTSTART
        var animation = presenter.playerController.getModule('Animation1');
        animation.show();
        animation.play();
    SCRIPTEND
    EVENTEND
    EVENTSTART
    Source:TrueFalse1
    Score:0
    SCRIPTSTART
        var animation = presenter.playerController.getModule('Animation1');
        animation.stop();
        animation.hide();
    SCRIPTEND
    EVENTEND

## CSS classes

<table border='1'>
    <tr>
        <th>Class name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>animation-image-animation</td>
        <td>An image which serves as a fundamental for the animation. It should contain at least one frame! Do not change background properties for this element!</td>
    </tr>
    <tr>
        <td>animation-image-preview</td>
        <td>An image which serves as preview for the animation. Do not change background properties for this element!</td>
    </tr>
    <tr>
        <td>animation-label</td>
        <td>Labels are span elements which are shown when the animation isn't playing. Do not change/set position attributes for these elements!</td>
    </tr>
    <tr>
        <td>animation-loading-image</td>
        <td>Loading image shown while loading resources. The image is placed in slides center. Default width and height are 50px. Do not change/set position attributes for these elements!</td>
    </tr>
    <tr>
        <td>animation-watermark</td>
        <td>DIV surrounding watermark canvas element</td>
    </tr>
</table>

The Addon accepts all CSS selectors and modificators, e.g. if a user would like to specify separate appearance for a preview image on mouse hover, a CSS declaration could look like this:<br/><br/>
.Animation_custom {<br/>
}<br/>
<br/>
.Animation_custom .animation-image-preview {<br/>
&nbsp;&nbsp;border: 2px solid black;<br/>
}<br/>
<br/>
<b>.Animation_custom .animation-image-preview:hover</b> {<br/>
&nbsp;&nbsp;border: 2px solid red;<br/>
}<br/>
<br/>
This declaration will result in a red border over the addon's preview image on mouse hover.

## Demo presentation
[Demo presentation](/embed/2439020 "Demo presentation") contain examples of how to use and configure the addon.        