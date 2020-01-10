## Description
This addon allows users to add variables that can be used in exercises and simulations.

## Properties

<table border='1'>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Variables</td>
        <td>A list of variables.<br>
Each of them has the following parameters:<ul><li>Name – a name that is later used to identify the variable,
<li>Start value – variables’s starting value.</li></ul>
</td>
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
        <td>getVariable</td>
        <td>name</td>
        <td>Returns the current value of the variable.</td>
    </tr>
    <tr>
        <td>setVariable </td>
        <td>name,<br> value</td>
        <td>Changes the current value of the variable.</td>
    </tr>
<tr>
        <td>reset </td>
        <td>---</td>
        <td>Resets the variables' values to the start ones.</td>
    </tr>
</table>

If users use the command setVariable for a variable that was not defined in the addon, a new variable will be created. Its start value will be false.

## Scoring
Variable storage is not an activity module, so there is no scoring present.

##Events
Variable storage does not send any events to Event Bus.      

## Demo presentation

[Demo presentation](/embed/5265903702245376 "Demo presentation") contains examples of how to use the Advanced Connector addon.                       