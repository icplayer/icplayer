##Description
The addon is the expansion of the Plot addon and it allows defining the points or the number of points to be selected in the Plot activity. In order to configure the connection properly, it is necessary to enter the ID of the Points To Plot addon in the Broadcast property and check the „Not activity” box.

## Properties

<table border='1'>
<tbody>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Source</td>
        <td>The base Plot addon which the Points To Plot addon is communicating with</td>
    </tr>
    <tr>
        <td>Points to plot</td>
        <td>Connecting the points with plots</td>
    </tr>
    <tr>
        <td>Points to plot/plot id</td>
        <td>The plot’s ID in the Plot addon</td>
    </tr>
    <tr>
        <td>Points to plot/points</td>
        <td>Defines the numer of points to be selected in a plot</td>
    </tr>
    <tr>
        <td>Points to plot/strict points</td>
        <td>Defines the points to be selected in a plot, e.g. (1,1), (0,0), (-1,1)</td>
    </tr>
    <tr>
        <td>Show answers</td>
        <td>Defines the points to be displayed in show answers and gradual show answers modes, e.g. (1,1), (0,0), (-1,1)</td>
    </tr>

</tbody>
</table>

##Events

Addon sends ValueChanged type events to Event Bus as follows:

<table border='1'>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <th colspan='2'>when a point is selected</th>
    </tr>
    <tr>
        <td>Item</td>
        <td>point_X_Y; point with coordinates X and Y</td>
    </tr>
    <tr>
        <td>Value</td>
        <td>1</td>
    </tr>
    <tr>
        <td>Score</td>
        <td>1 when correct (point belongs to any plot), 0 when incorrect</td>
    </tr>
    <tr>
        <th colspan='2'>when a point is deselected</th>
    </tr>
    <tr>
        <td>Item</td>
        <td>point_X_Y; point with coordinates X and Y</td>
    </tr>
    <tr>
        <td>Value</td>
        <td>0</td>
    </tr>
    <tr>
        <td>Score</td>
        <td>0</td>
    </tr>
    <tr>
        <th colspan='2'>when the points and a plot are correct (individually for each plot when a point is selected/deselectd)</th>
    </tr>
    <tr>
        <td>Item</td>
        <td>plot_plotId</td>
    </tr>
    <tr>
        <td>Value</td>
        <td>N/A</td>
    </tr>
    <tr>
        <td>Score</td>
        <td>1 when correct, 0 when incorrect</td>
    </tr>
</table>

If you are using [Advanced Connector](/doc/page/Advanced-Connector), please note that due to the Regular Expression syntax, which has special meaning for "-" and "." characters, you need to escape them with backshlash, e.g. point_\-5\.2_4\.5

The „All OK” event is sent when all answers given in a Plot activity are 100% correct.

<table border='1'>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Item</td>
        <td>all</td>
    </tr>
    <tr>
        <td>Value</td>
        <td>N/A</td>
    </tr>
    <tr>
        <td>Score</td>
        <td>N/A</td>
    </tr>
</table>


## Demo presentation
[Demo presentation](/embed/4505122450178048 "Demo presentation") contains examples of how to use the Plot addon and integrate it with other addons, e.g. Slider, buttons. 
                            