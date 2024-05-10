## Description

##### ModelViewer3D allows for displaying 3D models.

## Properties

<table border='1'>
<tbody>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Model</td>
        <td>Path to file contains the 3D model. Supports only glTF/GLB 3D models.</td>
    </tr>
    <tr>
        <td>Poster</td>
        <td>Displays an image instead of the model, useful for showing the user something before a model is loaded and ready to render.</td>
    </tr>
    <tr>
        <td>Annotations</td>
        <td>Additional text displayed on the view.</td>
    </tr>
    <tr>
        <td>Environment Image</td>
        <td>Controls the environmental reflection of the model. Normally if skybox-image is set, that image will also be used for the environment-image.</td>
    </tr>
    <tr>
        <td>Skybox Image</td>
        <td>Sets the background image of the scene. Takes a URL to an equirectangular projection image that's used for the skybox, as well as applied as an environment map on the model. Supports png, hdr, and jpg images.</td>
    </tr>
    <tr>
        <td>Shadow Intensity</td>
        <td>Controls the opacity of the shadow. Set to 0 to turn off the shadow entirely.</td>
    </tr>
    <tr>
        <td>Shadow Softness</td>
        <td>Controls the blurriness of the shadow. Set to 0 for hard shadows. Softness should not be changed every frame as it incurs a performance cost.</td>
    </tr>
    <tr>
        <td>Auto Rotate</td>
        <td>Enables rotating the view.</td>
    </tr>
    <tr>
        <td>Scale</td>
        <td>Sets scale of the model.</td>
    </tr>
    <tr>
        <td>Labels Enabled on Start</td>
        <td>Labels are visible immediately after loading the model.</td>
    </tr>
    <tr>
        <td>Alt Text</td>
        <td>Sets alternative text for "model-viewer" element.</td>
    </tr>
    <tr>
        <td>Additional Attributes</td>
        <td>Additional attributes which could be set to the model. Data should be entered in JSON format.</td>
    </tr>
    <tr>
        <td>Copyright Info</td>
        <td>Sets text of the rights their creators.</td>
    </tr>
    <tr>
        <td>Interaction Prompt</td>
        <td>Allows you to disable the visual and audible interaction prompt. If checked interaction prompt is set to "auto". The interaction prompt will be displayed as soon as the interaction-prompt-threshold time has elapsed (after the model is revealed). The interaction prompt will only display if camera-controls are enabled.</td>
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
        <td>show</td>
        <td>...</td> 
        <td>Shows the module.</td> 
    </tr>
    <tr>
        <td>hide</td>
        <td>...</td> 
        <td>Hides the module.</td> 
    </tr>
    <tr>
        <td>showAnnotations</td>
        <td>...</td> 
        <td>Shows annotations in the model.</td> 
    </tr>
    <tr>
        <td>hideAnnotations</td>
        <td>...</td> 
        <td>Hides annotations in the model.</td> 
    </tr>
    <tr>
        <td>getAnnotationsVisibility</td>
        <td>...</td> 
        <td>Returns annotations visibility status in the model.</td> 
    </tr>
    <tr>
        <td>setScale</td>
        <td>number</td>
        <td>Sets the model scale.</td> 
    </tr>
</tbody>
</table>

## CSS classes

<table border='1'>
<tbody>
    <tr>
        <th>Class name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>.copyMessage</td>
        <td>Set styles for the message wrapper.</td>
    </tr>
    <tr>
        <td>.copyMessage-visible</td>
        <td>Set styles for the displayed message wrapper.</td>
    </tr>
    <tr>
        <td>.buttonsContainer</td>
        <td>Set styles for the buttons container.</td>
    </tr>
    <tr>
        <td>.labelsButton</td>
        <td>Set styles for the button which changing view of annotations.</td>
    </tr>
    <tr>
        <td>.labelsButton-selected</td>
        <td>Set styles for the clicked button which changing view of annotations.</td>
    </tr>
    <tr>
        <td>.copyButton</td>
        <td>Set styles for the copy button.</td>
    </tr>
    <tr>
        <td>.model-viewer-button</td>
        <td>Set styles for all buttons.</td>
    </tr>
</tbody>
</table>
