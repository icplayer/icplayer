## Description
This Addon allows conducting a competition and scoring the points won by multiple teams. Number of teams, their names and points can be modify in the runtime of lesson.

Addon Scoreboard has two modes of working:

* One-page mode
* Multiple pages lesson mode

**One-page mode** - is turned on if *Variable Storage id* property is empty.  
**Multiple-page mode** - is turned on if *Variable Storage id* property is fulfilled and Variable Storage is correctly configured.

## Multiple-page mode configuration

To configure Scoreboard to work in multiple-page mode creator has to add Variable Storage addon to Common part of lesson (header/footer).
It can be added either in header or footer.
If Variable Storage addon was added to footer, redactor has to change default Variable Storage location and Variable Storage properties to correctly point new Variable Storage location. By default, the values are set to point to Variable Storage located in the header.

Next step is to copy the created Scoreboard addon to each page where we want to use it in multiple-page mode. If configuration is correct Scoreboard should store values between pages of the lesson in the Variable Storage addon.

## Properties

<table border='1'>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Variable Storage id</td>
        <td>Default: (Variable_Storage1). Id of Variable Storage addon used for storing Scoreboard state in multiple-page mode.</td>
    </tr>
    <tr>
        <td>Is draggable</td>
        <td>Default: (Checked). The checked property sets Scoreboard drag ability on this concrete page. When the property is unchecked addon will not be draggable on this page.</td>
    </tr>
    <tr>
        <td>Variable Storage location</td>
        <td>Default: (header). Placement of Variable Storage addon in lesson when multiple-page mode is supported. The choice is between: (Default) header, footer.</td>
    </tr>
    <tr>
        <td>Variable Storage location name</td>
        <td>Default: (header). Specific name of place where Variable Storage addon was placed. This property refers to "Name" property inside header or footer.</td>
    </tr>
    <tr>
        <td>Initial number of teams</td>
        <td>Initial number of teams which will be added to Scoreboard on addon first appearance.</td>
    </tr>
    <tr>
        <td>Initial list of teams</td>
        <td>List of object with teams properties: Team name (Name of initial team which will be used if new team will be added), Team colour(The color of team which is used to show team in addon; specified in '#RRGGBB' notation).</td>
    </tr>
    <tr>
        <td>Maximum number of teams</td>
        <td>Maximum number of teams which can be added to Scoreboard.</td>
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
        <td>Hides the addon.</td>
    </tr>
    <tr>
        <td>show</td>
        <td>---</td>
        <td>Shows the addon.</td>
    </tr>
</table>

## Events

**Scoreboard close event**

When user close Scoreboard addon, it sends the 'ValueChanged' event. It can be supported with Advanced Connector.

<table border='1'>
<tbody>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <tr>
            <td>source</td>
            <td>addon ID</td>
        </tr>
        <tr>
            <td>value</td>
            <td>HideScoreboard</td>
        </tr>
</tbody>
</table>

## Advanced Connector integration
Scoreboard 'ValueChanged' event can be used in the Advanced Connector addon's scripts. Common use case triggers deselectCustomButton command on IWB_Toolbar addon to deselect the custom button. 

        EVENTSTART
        Source:Scoreboard1
        SCRIPTSTART
            var iwbToolbar= presenter.playerController.getModule('IWB_Toolbar1');
            iwbToolbar.deselectCustomButton();
        SCRIPTEND
        EVENTEND

## Demo presentation
[Demo presentation](/embed/4794504243838976 "Demo presentation") Contain example on how to use the Scoreboard addon with IWB_Toolbar addon.                                                   