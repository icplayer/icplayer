## Description
The Layered Image addon allows users to embed multilayered images into presentations. Each layer is represented by an image with transparent elements (alpha channel).

**Note:** Layered Image supports the following graphic formats: JPG, PNG, BMP. Vector formats are not supported.
 
## Properties

<table border='1'>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Base image</td>
        <td>An image which serves as lowest layer (on which all layers are placed).
<p><em>This property allows online resources. <a href="/doc/page/Online-resources">Find out more »</a></em></p>
</td>
    </tr>
    <tr>
        <td>Layers</td>
        <td>Each layer consists of an image with transparent elements (Image) and "Show at start" property. With the second property set to 1, a layer will be visible at Addon start</td>
    </tr>
    <tr>
        <td>Image size</td>
        <td>List of possible image size adjustments to Addon size. Choice is from: Original (no changes), 'Keep aspect ratio' and 'Stretched' </td>
    </tr>
    <tr>
        <td>Animated gif refresh</td>
        <td>If selected, animated gifs will always be refreshed after page loading</td>
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
        <td>showLayer</td>
        <td>layerNumber</td>
        <td>Show layer with given number</td>
    </tr>
    <tr>
        <td>hideLayer</td>
        <td>layerNumber</td>
        <td>Hide layer with given number</td>
    </tr>
    <tr>
        <td>toggleLayer</td>
        <td>layerNumber</td>
        <td>Toggle (hide if visible and show if hidden) layer with given number</td>
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

<b>Layer numbers are counted from 1 to n!</b>

## Advanced Connector integration
Each command supported by the Layered Image addon can be used in the Advanced Connector addon scripts. The below example shows how to react on Text module gap content changes (i.e. throughout putting in it elements from Source List) and change toggle visibility of two of the layers..

        EVENTSTART
        Source:Text2
        Item:1
        Value:ON
        SCRIPTSTART
            var layeredImage = presenter.playerController.getModule('Layered_Image1');
            layeredImage.showLayer(2);
        SCRIPTEND
        EVENTEND
        EVENTSTART
        Source:Text2
        Item:1
        Value:OFF
        SCRIPTSTART
            var layeredImage = presenter.playerController.getModule('Layered_Image1');
            layeredImage.hideLayer(2);
        SCRIPTEND
        EVENTEND
        EVENTSTART
        Source:Text2
        Item:2
        Value:ON
        SCRIPTSTART
            var layeredImage = presenter.playerController.getModule('Layered_Image1');
            layeredImage.showLayer(3);
        SCRIPTEND
        EVENTEND
        EVENTSTART
        Source:Text2
        Item:2
        Value:OFF
        SCRIPTSTART
            var layeredImage = presenter.playerController.getModule('Layered_Image1');
            layeredImage.hideLayer(3);
        SCRIPTEND
        EVENTEND

## CSS classes

<table border='1'>
    <tr>
        <th>Class name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>layeredimage-wrapper</td>
        <td>DIV surrounding all image elements. Base image and layers are direct children of this element</td>
    </tr>
    <tr>
        <td>layeredimage-image</td>
        <td>An image which serves as layer (including base image). Do not change background properties for this element!</td>
    </tr>
    <tr>
        <td>layeredimage-loading</td>
        <td>Loading image showed while loading resources. Image is placed in slides center. Default width and hight are 50px. Do not change/set position attributes for this element!</td>
    </tr>
</table>

Addon accepts all CSS selectors and modificators, e.g. if user would like to specify Addon appearance for on mouse hover, CSS declaration could look like this:<br/><br/>
.Layered_Image_custom {<br/>
}<br/>
<br/>
.Layered_Image_custom .layeredimage-wrapper {<br/>
&nbsp;&nbsp;border: 2px solid black;<br/>
}<br/>
<br/>
<b>.Layered_Image_custom .layeredimage-wrapper:hover</b> {<br/>
&nbsp;&nbsp;border: 2px solid red;<br/>
}<br/>
<br/>
This declaration will result in red border on mouse hover over Addon wrapper element.

## Demo presentation
[Demo presentation](/embed/2485667 "Demo presentation") contains examples of how to use, configure and style Addon.                