## Description
3D Viewer addon allows users to embed 3D models saved in Wavefront OBJ file format (more about this format can be found on [Wikipedia](http://en.wikipedia.org/wiki/Wavefront_.obj_file "Wikipedia")).

## Properties

<table border='1'>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>OBJ File</td>
        <td>OBJ file containing model description</td>
    </tr>
	<tr>
        <td>MTL File</td>
        <td>Additional file with materials (colors and textures) definitions</td>
    </tr>
	<tr>
        <td>Initial Rotation X</td>
        <td>Initial rotation in X-axis (default to 0)</td>
    </tr>
	<tr>
        <td>Initial Rotation Y</td>
        <td>Initial rotation in Y-axis (default to 0)</td>
    </tr>
	<tr>
        <td>Initial Rotation Z</td>
        <td>Initial rotation in Z-axis (default to 0)</td>
    </tr>
	<tr>
        <td>Model Color</td>
        <td>Fallback color for all meshes (default to #EEEEEE)</td>
    </tr>
	<tr>
        <td>Background Color 1</td>
        <td>Color at the top of the background (default to #CCCCCC)</td>
    </tr>
	<tr>
        <td>Background Color 1</td>
        <td>Color at the bottom of the background (default to #EEEEEE)</td>
    </tr>
	<tr>
        <td>Render Mode</td>
        <td>Render mode (default to smooth)</td>
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
        <td>hide</td>
        <td>---</td>
        <td>Hide the addon.</td>
    </tr>
    <tr>
        <td>show</td>
        <td>---</td>
        <td>Show the addon.</td>
    </tr>
	<tr>
        <td>rotateX</td>
        <td>angle</td>
        <td>Rotates a model around the X-axis. The angle must be a positive integer.</td>
    </tr>
	<tr>
        <td>rotateY</td>
        <td>angle</td>
        <td>Rotates a model around the Y-axis by a given angle in degrees. The angle must be a  positive integer.</td
    </tr>
	<tr>
        <td>rotateZ</td>
        <td>angle</td>
        <td>Rotates a model around the Z-axis by a given angle in degrees. The angle must be a positive integer.</td>
    </tr>
	<tr>
        <td>rotateZ</td>
        <td>angle</td>
        <td>Rotates a model around the Z-axis by a given angle in degrees. The angle must be a positive integer.</td>
    </tr>
	<tr>
        <td>startRotationX</td>
        <td>angle, delay</td>
        <td>Continuously rotates a model around the X-axis by a given angle in degrees with given delays between each rotation. The angle and the delay must be positive integers.</td>
    </tr>
	<tr>
        <td>stopRotationX</td>
        <td>---</td>
        <td>Stops the continuous rotation around the X-axis.</td>
    </tr>
	<tr>
        <td>startRotationY</td>
        <td>angle, delay</td>
        <td>Continuously rotates a model around the Y-axis by a given angle in degrees with given delays between each rotation. The angle and the delay must be positive integers.</td>
    </tr>
	<tr>
        <td>stopRotationY</td>
        <td>---</td>
        <td>Stops the continuous rotation around the Y-axis.</td>
    </tr>
	<tr>
        <td>startRotationZ</td>
        <td>angle, delay</td>
        <td>Continuously rotates a model around the Z-axis by a given angle in degrees with given delays between each rotation. The angle and the delay must be positive integers.</td>
    </tr>
	<tr>
        <td>stopRotationZ</td>
        <td>---</td>
        <td>Stops the continuous rotation around the Z-axis.</td>
    </tr>
	<tr>
        <td>stopAllRotations</td>
        <td>---</td>
        <td>Stops all continuous rotations around each axis.</td>
    </tr>
	<tr>
        <td>setQuality</td>
        <td>quality</td>
        <td>Changes a rendering quality. The quality parameter can be one of the three: 'low', 'standard' (default) and 'high'.</td>
    </tr>
</table>

## CSS classes

<table border='1'>
    <tr>
        <th>Class name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>viewer-3d-wrapper</td>
        <td>Main class containing the entire Addon's content.</td>
    </tr>
</table>

## Advanced Connector integration
Each command supported by the 3D Viewer addon can be used in the Advanced Connector addon's scripts. The below example shows how to show and hide addon when the Text module's gap content changes (i.e. by putting in it elements from the Source List).

        EVENTSTART
        Source:Text2
        Value:1
        SCRIPTSTART
            var viewer = presenter.playerController.getModule('Viewer_3D1');
            viewer.show();
        SCRIPTEND
        EVENTEND
        EVENTSTART
        Source:Text2
        Value:2
        SCRIPTSTART
            var viewer = presenter.playerController.getModule('Viewer_3D1');
            viewer.hide();
        SCRIPTEND
        EVENTEND

## Demo presentation
[Demo presentation](/embed/7414054 "Demo presentation") contains examples on how to use the 3D Viewer addon.                   