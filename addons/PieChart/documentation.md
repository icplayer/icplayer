## Description

A Pie Chart addon enables you to present a pie chart. This can be used both as a presentatoin/simulation or as an activity, where a student can change percentage values.

##Properties

<table border='1'>
<tbody>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Is visible</td>
        <td>Enables to hide or show the module.</td>
    </tr>
    <tr>
        <td>Items</td>
        <td>This section allows to enter all the details about every Item. <br>
"Name" is only needed if the property “Show names” is selected.<br>
"Color" defines the color of the item; if left empty, the color is taken from the CSS style.<br>
"Starting percent" defines the percentage values at the beginning.<br>
"Answer" is only needed if the property "Is Activity" is selected.
</td>
    </tr>
<tr>
        <td>Step</td>
        <td>This property defines the step (in percent) by which a user can change the Items. It is equal to 1 if left empty.</td>
    </tr>
    <tr>
        <td>Show values</td>
        <td>If this property is selected, the items' percentage values are shown.
</td>
    </tr>
    <tr>
        <td>Show names</td>
        <td>If this property is selected, the legend is displayed.</td>
    </tr>
<tr>
        <td>Is activity</td>
        <td>Enables to define whether the module is an activity or not.</td>
    </tr>
<tr>
        <td>Is disabled</td>
        <td>Allows to disable the module so that it won't be possible to change any item.</td>
    </tr>
<tr>
        <td>Radius size</td>
        <td>This property enables to change the graph radius in the module (a number between 0 and 1).</td>
    </tr>
<tr>
        <td>Percent positions</td>
        <td>This property enables to change the position where the values are displayed (a number between 0 and 1).</td>
    </tr>
</tbody>
</table>

## Scoring

Pie Chart addon allows to create exercises. To set the module in an excercise mode, choose the 'Is Activity' property. If the addon is not in an excercise mode, all the below methods return 0!

<table border='1'>
<tbody>
    <tr>
        <th>Property</th>
        <th>Description</th>
    </tr>
    <tr>
        <tr>
            <td>maxScore</td>
            <td>1</td>
        </tr>
        <tr>
            <td>score</td>
            <td>1 if all answers are correct, otherwise 0</td>
        </tr>
        <tr>
            <td>errorCount</td>
            <td>1 if all answers are correct, otherwise 1</td>
        </tr>
</tbody>
</table>

##Supported commands

<table border='1'>
<tbody>
    <tr>
        <th>Command name</th>
        <th>Params</th>
        <th>Description</th>
    </tr>
<tr>
        <td>disable</td>
        <td>---</td>
        <td>Disables the addon.</td>
</tr>
<tr>
        <td>enable</td>
        <td>---</td>
        <td>Enables the addon.</td>
</tr>
<tr>
        <td>show</td>
        <td>---</td>
        <td>Shows the addon.</td>
    </tr>
<tr>
        <td>hide</td>
        <td>---</td>
        <td>Hides the addon.</td>
</tr>
<tr>
        <td>reset</td>
        <td>---</td>
        <td>Resets the addon.</td>
</tr>
<tr>
        <td>isAttempted</td>
        <td>---</td>
        <td>Returns true if a user tries to solve the module.</td>
</tr>
<tr>
        <td>isAllOK</td>
        <td>---</td>
        <td>Returns true if all items have correct values, otherwise false.</td>
</tr>
<tr>
        <td>isOK</td>
        <td>index</td>
        <td>Returns true if the chosen item has the correct value, otherwise false.</td>
</tr>
<tr>
        <td>getPercent</td>
        <td>---</td>
        <td>Returns the value of the chosen item.</td>
    </tr>
</tbody>
</table>

## Events

**OnValueChanged Event**

This event contains the following fields:

<table border='1'>
<tbody>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <tr>
            <td>source</td>
            <td>module ID</td>
        </tr>
        <tr>
            <td>item</td>
            <td>N/A</td>
        </tr>
        <tr>
            <td>value</td>
            <td>N/A</td>
        </tr>
        <tr>
            <td>score</td>
            <td>1 when the addon has a correct answer, otherwise 0</td>
        </tr>
    </tr>
</tbody>
</table>

##CSS classes

  <table border='1'>
<tbody>
    <tr>
        <th>Class name</th>
        <th>Description</th>
    </tr>
    <tr>
        <tr>
            <td>.piechart</td>
            <td>DIV containing the pie chart</td>
        </tr>
        <tr>
            <td>.disabled</td>
            <td>additional class for a disabled addon</td>
        </tr>
<tr>
            <td>.correct</td>
            <td>additional class for the addon solved correctly</td>
        </tr>
<tr>
            <td>.wrong</td>
            <td>additional class for the addon solved incorrectly</td>
        </tr>
<tr>
            <td>.graph</td>
            <td>indicates the look of the graph</td>
        </tr>
        <tr>
            <td>.line</td>
            <td>indicates the look of the line</td>
        </tr>
<tr>
            <td>.item, .itemX</td>
            <td>indicates the color of an Item (X is the number of the item) and its color in the legend</td>
        </tr>
<tr>
            <td>.legend</td>
            <td>describes the style for the legend</td>
        </tr>
<tr>
            <td>.legendItem</td>
            <td>indicates the look of the items in the legend</td>
        </tr>
<tr>
            <td>.legendSquare</td>
            <td>indicates the look of the colored square in the legend</td>
        </tr>
<tr>
            <td>.legendText</td>
            <td>indicates the look of the items' names in the legend</td>
        </tr>
<tr>
            <td>.percentsValues</td>
            <td>indicates the look of the percentage values on the pie chart</td>
        </tr>
</tbody>
</table>       
  
## Demo presentation
[Demo presentation](/embed/4604044036276224 "Demo presentation") contains examples on how to use the Pie Chart addon.                                