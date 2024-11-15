## Description

##### Model Viewer 3D allows for displaying 3D models. <br> Please note that when using a mobile device, an additional <img src="/file/serve/6093598547116032" style="border: 0; display:inline; margin: 0 2px; box-shadow: none" alt="AR"> icon will be visible in the vicinity of the 3D model. Interacting with the icon allows switching the preview to the Augmented Reality mode ([https://modelviewer.dev/examples/augmentedreality](https://modelviewer.dev/examples/augmentedreality "https://modelviewer.dev/examples/augmentedreality"))
##### Model Viewer 3D works on iPhones from iOS version 14.
## Properties

The list starts with the common properties, learn more about them by visiting the [Modules description](https://www.mauthor.com/doc/en/page/Modules-description) section. The other available properties are described below.

<table border='1'>
<tbody>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Model</td>
        <td>Path to the file containing the 3D model. Supports only the glTF/GLB 3D models.</td>
    </tr>
    <tr>
        <td>Model iOS</td>
        <td>Path to the file containing the 3D model necessary to run the AR functionality in iOS. Supports only the usdz 3D models. Check chapter Augmented Reality (AR) for more information.</td>
    </tr>
    <tr>
        <td>Poster</td>
        <td>Displays an image instead of the model, useful for showing the user something before the model is loaded and ready to render.</td>
    </tr>
    <tr>
        <td>Annotations</td>
        <td>Additional text displayed in the preview.</td>
    </tr>
    <tr>
        <td>Environment Image</td>
        <td>Controls the environmental reflection of the model. Normally, if skybox-image is set, that image will also be used for the environment-image.</td>
    </tr>
    <tr>
        <td>Skybox Image</td>
        <td>Sets the background image of the scene. Takes a URL to an equirectangular projection image that is used for the skybox, as well as applied as an environment map on the model. Supports PNG, HDR, and JPG images.</td>
    </tr>
    <tr>
        <td>Shadow Intensity</td>
        <td>Controls the opacity of the shadow. Setting it to 0 turns off the shadow.</td>
    </tr>
    <tr>
        <td>Shadow Softness</td>
        <td>Controls the blurriness of the shadow. Setting it to 0 results in hard shadows. Softness should not be changed for each frame as this has a performance cost.
        </td>
    </tr>
    <tr>
        <td>Auto Rotate</td>
        <td>Automatically slowly rotates the model.</td>
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
        <td>Sets the alternative text for the "model-viewer" element.</td>
    </tr>
    <tr>
        <td>Additional Attributes</td>
        <td>Additional attributes that could be set for the model (see the Additional Attributes section below). Data should be entered in JSON format.</td>
    </tr>
    <tr>
        <td>Copyright Info</td>
        <td>This field contains information relating to copyright.</td>
    </tr>
    <tr>
        <td>Interaction Prompt</td>
        <td>Allows disabling the visual and audible interaction prompt. If checked, the interaction prompt is set to "auto". The interaction prompt will be displayed as soon as the interaction-prompt-threshold time has elapsed (after the model is loaded). The interaction prompt will only display if camera-controls are enabled.</td>
    </tr>
    <tr>
        <td>Enable fullscreen</td>
        <td>Allows to enter fullscreen mode. After checking this property, the content of the addon will be wrapped with an element with CSS class `.modelViewerWrapper`, regardless of whether the device supports Fullscreen API. Check chapter `Fullscreen` for more information.</td>
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
        <td>Shows the module if it is hidden.</td> 
    </tr>
    <tr>
        <td>hide</td>
        <td>...</td> 
        <td>Hides the module if it is visible.</td> 
    </tr>
    <tr>
        <td>showAnnotations</td>
        <td>...</td> 
        <td>Shows annotations if they are available for the model.</td> 
    </tr>
    <tr>
        <td>hideAnnotations</td>
        <td>...</td> 
        <td>Hides annotations available for the model.</td> 
    </tr>
    <tr>
        <td>getAnnotationsVisibility</td>
        <td>...</td> 
        <td>Returns annotations visibility status of the model.</td> 
    </tr>
    <tr>
        <td>setScale</td>
        <td>number</td>
        <td>Sets the model's scale.</td> 
    </tr>
    <tr>
        <td>requestFullscreen</td>
        <td>...</td>
        <td>Enters addon in fullscreen mode. Check chapter `Fullscreen` for more information.</td> 
    </tr>
    <tr>
        <td>exitFullscreen</td>
        <td>...</td>
        <td>Exits addon from fullscreen mode. Check chapter `Fullscreen` for more information.</td> 
    </tr>
</tbody>
</table>

## Additional Attributes Examples

<table border='1'>
    <tbody>
        <tr>
            <th>Attribute</th>
            <th>Description</th>
        </tr>
        <tr>
            <td>autoplay</td>
            <td>Possible values: "true", "false". When set to "true", the animation is played automatically when the page is loaded.</td>
        </tr>
        <tr>
            <td>animation-name</td>
            <td>Changes the default animation to the specified one.</td>
        </tr>
        <tr>
            <td>camera-orbit</td>
            <td>Sets the starting position of the camera. The properties are specified in the following order: x-axis, y-axis, and camera distance. Example value: "0deg 75deg 105%".</td>
        </tr>
        <tr>
            <td>max-camera-orbit</td>
            <td>Sets the maximum orbital values of the camera – useful if the default 3D model values are too large/too small. Example value: "auto 360deg 120%".</td>
        </tr>
        <tr>
            <td>camera-target</td>
            <td>Sets the starting point that the camera orbits around. The properties are specified in the following order: x-axis, y-axis, and z-axis. Example value: "1m -1m 0m".</td>
        </tr>
    </tbody>
</table>

The full list of attributes is available at [https://modelviewer.dev/docs/](https://modelviewer.dev/docs/ "https://modelviewer.dev/docs/")

## CSS classes

<table border='1'>
<tbody>
    <tr>
        <th>Class name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>.copyMessage</td>
        <td>Sets styles for the message wrapper.</td>
    </tr>
    <tr>
        <td>.copyMessage-visible</td>
        <td>Sets styles for the displayed message wrapper.</td>
    </tr>
    <tr>
        <td>.buttonsContainer</td>
        <td>Sets styles for the button's container.</td>
    </tr>
    <tr>
        <td>.labelsButton</td>
        <td>Sets styles for the button which changes the view of annotations.</td>
    </tr>
    <tr>
        <td>.labelsButton-selected</td>
        <td>Sets styles for the clicked button which changes the view of annotations.</td>
    </tr>
    <tr>
        <td>.copyButton</td>
        <td>Sets styles for the copy button.</td>
    </tr>
    <tr>
        <td>.model-viewer-button</td>
        <td>Sets styles for all the buttons.</td>
    </tr>
    <tr>
        <td>.fullscreenButton</td>
        <td>Sets styles for the fullscreenButton. This button is used to request fullscreen mode and exit from fullscreen mode.</td>
    </tr>
    <tr>
        <td>.modelViewerWrapper</td>
        <td>Sets styles for wrapper of the content when `Enable fullscreen` property is selected .</td>
    </tr>
    <tr>
        <td>.modelViewerFullscreen</td>
        <td>Sets styles for wrapper of the content when fullscreen mode is active.</td>
    </tr>
</tbody>
</table>

## Fullscreen

In order for an addon to start supporting fullscreen functionality, it must:
<ul>
    <li>Support <a href="https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API">Fullscreen API</a>. At this point, iphones do not support the Fullscreen API.</li>
    <li>The `Enable fullscreen` property must be selected.</li>
</ul>

When these conditions are met, the addon will:
<ul>
    <li>Show in view a button that allows to enter in fullscreen mode.</li>
    <li>Allow to use `requestFullscreen` and `exitFullscreen` commands.</li>
</ul>

When `Enable fullscreen` property is selected the content of the addon will be wrapped with an element with CSS class `.modelViewerWrapper`, regardless of whether the device supports Fullscreen API
 
## Augmented Reality (AR)
The addon supports Augmented Reality (AR) session in mobile device, in iOS it is necessary to check "Disable navigation panels automatic appearance" in Lesson editor for the AR function to work properly.