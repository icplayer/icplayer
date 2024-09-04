## Description

The Geometric Construct addon allows the user to create, move, edit and remove geometric figures within a workspace.

In order to add a new geometric figure to a workspace, you should select it from the toolbar and then click on the workspace to select a place where it should be added. A created figure can then be edited by selecting the Cursor tool from the toolbar and using it to move elements of a geometric figure to the desired position. In order to delete a geometric figure from the workspace, you should select it using the Cursor tool and then click on the trash icon in the lower right corner of the workspace.

## Properties

<table border='1'>
<tbody>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Fill color</td>
        <td>Specifies the fill color used while drawing the geometric figures ("blue" by default)</td>
    </tr>
    <tr>
        <td>Stroke color</td>
        <td>Specifies the stroke color used while drawing the geometric figures ("black" by default)</td>
    </tr>
    <tr>
        <td>Figures</td>
        <td>The property allows the author to define which figures will be available in the addon as well as their labels.</td>
    </tr>
    <tr>
        <td>Labels</td>
        <td>The property allows the author to change the text labels used by the addon (labels used by the figures are defined in the "Figures" property instead).</td>
    </tr>
    <tr>
        <td>Labels visibility</td>
        <td>Specified whether the labels of geometric figures in the workspace will be visible by default.</td>
    </tr>
    <tr>
        <td>Angle measures visibility</td>
        <td>Specified whether the values of angles in the workspace will be visible by default.</td>
    </tr>
    <tr>
        <td>Disable undo/redo buttons</td>
        <td>If checked, undo/redo buttons will no longer be visible in the toolbar. The nextState and prevState commands will still be available.</td>
    </tr>
    <tr>
        <td>Disable reset button</td>
        <td>If checked, the reset button will no longer be visible in the toolbar. The reset command will still be available.</td>
    </tr>
    <tr>
        <td>Disable 'toggle labels' button</td>
        <td>If checked, the toggle labels button will no longer be visible in the toolbar. The showLabels and hideLabels commands will still be available.</td>
    </tr>
    <tr>
        <td>Axis color</td>
        <td>Specifies the color of the axis. The default value is #444444.</td>
    </tr>
    <tr>
        <td>Axis increment</td>
        <td>The increment used when labeling ticks on the axis. For instance, if set to 3, the ticks will be labeled 3, 6, 9, 12 etc. The default value is 1.</td>
    </tr>
    <tr>
        <td>X-axis position</td>
        <td>The default position of the x axis, starting from the top edge of the workspace, measured in pixels. If left empty, the X axis will be displayed in the middle of the workspace.</td>
    </tr>
    <tr>
        <td>Y-axis position</td>
        <td>The default position of the y axis, starting from the left edge of the workspace, measured in pixels. If left empty, the Y axis will be displayed in the middle of the workspace.</td>
    </tr>
    <tr>
        <td>Hide x-axis</td>
        <td>When selected, the x-axis will not be displayed in the workspace.</td>
    </tr>
    <tr>
        <td>Hide y-axis</td>
        <td>When selected, the y-axis will not be displayed in the workspace.</td>
    </tr>
    <tr>
        <td>Grid color</td>
        <td>Specifies the color of the grid in the workspace. If left empty, the grid will not be displayed.</td>
    </tr>
    <tr>
        <td>Unit length</td>
        <td>The default length of a single unit of measure in pixels. The default value is 25.</td>
    </tr>
    <tr>
        <td>Angle's decimal point</td>
        <td>This property specifies how many digits past the decimal point of an angle's value should be displayed. Default is 0.</td>
    </tr>
    <tr>
        <td>Length's decimal point</td>
        <td>This property specifies how many digits past the decimal point of a length measure's value should be displayed. Default is 0.</td>
    </tr>
    <tr>
        <td>Labels visibility</td>
        <td>Specifies whether the length measures in the workspace will be visible by default.</td>
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
        <td>---</td>
        <td>Displays the addon if it was hidden</td>
    </tr>
    <tr>
        <td>hide</td>
        <td>---</td>
        <td>Hides the addon.</td>
    </tr>
    <tr>
        <td>reset</td>
        <td>---</td>
        <td>Resets the addon to the default value</td>
    </tr>
    <tr>
        <td>prevState</td>
        <td>---</td>
        <td>Undoes recent changes to the workspace. The addon stores up to 20 previous states of the workspace.</td>
    </tr>
    <tr>
        <td>nextState</td>
        <td>---</td>
        <td>Restores the changes to the workspace that were undone by prevState.</td>
    </tr>
    <tr>
        <td>showLabels</td>
        <td>---</td>
        <td>Displays the labels of geometric figures in the workspace if they were hidden</td>
    </tr>
    <tr>
        <td>hideLabels</td>
        <td>---</td>
        <td>Hides the labels of geometric figures in the workspace.</td>
    </tr>
    <tr>
        <td>showAngleMeasures</td>
        <td>---</td>
        <td>Displays the values of angles in the workspace if they were hidden.</td>
    </tr>
    <tr>
        <td>hideAngleMeasures</td>
        <td>---</td>
        <td>Hides the values of angles in the workspace.</td>
    </tr>
</tbody>
</table>

## CSS Classes

<table border='1'>
    <tr>
        <th>Class name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>.geometricConstructLabel</td>
        <td>The label next to points in workspace</td>
    </tr>
    <tr>
        <td>.toolbar_wrapper</td>
        <td>The toolbar</td>
    </tr>
    <tr>
        <td>.toolbarButton</td>
        <td>The options with the toolbar</td>
    </tr>
    <tr>
        <td>.workspace_wrapper</td>
        <td>The workspace</td>
    </tr>
</table>
