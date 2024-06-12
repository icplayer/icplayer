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
