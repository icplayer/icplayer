## Description

A Connecting Dots module enables to make a puzzle containing a sequence of numbered dots. Choosing the consecutive numbers starting from one allows to draw lines that connect the points.

## Properties

The list starts with the common properties, learn more about them by visiting the [Modules description](https://www.mauthor.com/doc/en/page/Modules-description) section. The other available properties are described below.

<table border='1'>
<tbody>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Is activity</td>
        <td>Enables to define whether the module is an activity or not.</td>
    </tr>
    <tr>
        <td>Dots' coordinates</td>
        <td>Here you define the dots' coordinates. Put the coordinates in brackets and separate them with a comma. Put each point in a new line, for example:<br>
            [30,60]<br>
            [70,120]<br>
            [50,200]
        </td>
    </tr>
    <tr>
        <td>Dots' indexes</td>
        <td>This property allows to change the default dots’ indexes. 
            <br>If left empty, the indexes will be numbered from 1 to the number of points.<br>If you want the indexes to be consecutive multiples of a number, write *number (e.g. when you want multiples of 2, write *2).
            <br>You can also specify all indexes by separating them with commas, e.g. A, B, C, D, E. Remember that the number of indexes must be equal to the number of points.</br>
        </td>
    </tr>
    <tr>
        <td>Animation time</td>
        <td>This property allows to define the time (in milliseconds) needed to draw a line. By default, it is equal to zero.</td>
    </tr>
    <tr>
        <td>Start image</td>
        <td>Enables to add an image as a background to the addon.
            <p><em>This property allows online resources. <a href="/doc/page/Online-resources">Find out more »</a></em></p></td>
    </tr>
    <tr>
        <td>End image</td>
        <td>Allows to add an image that will appear as a background after selecting the last point.
            <p><em>This property allows online resources. <a href="/doc/page/Online-resources">Find out more »</a></em></p></td>
    </tr>
    <tr>
        <td>Is disabled</td>
        <td>Allows disabling the module so that the user is not able to interact with it.</td>
    </tr>
    <tr>
        <td>Show all answers in gradual show answers mode</td>
        <td>If this property is selected the gradual show answer button will show correct answers for entire addon.</td> 
    </tr>
</tbody>
</table>

## Events

The Connecting Dots addon sends ValueChanged type events to Event Bus when a user selects a point.

<table border='1'>
<tbody>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Source</td>
        <td>module ID</td>
    </tr>
    <tr>
        <td>Item</td>
        <td>the number of the clicked point</td>
    </tr>
    <tr>
        <td>Value</td>
        <td>1 when a correct point is selected, otherwise 0</td>
    </tr>
    <tr>
        <td>Score</td>
        <td>1 when all points are selected, otherwise 0</td>
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
        <td>Clears out all drawn lines and selected points.</td>
    </tr>
    <tr>
        <td>enable</td>
        <td>---</td>
        <td>Enables the addon.</td>
    </tr>
    <tr>
        <td>disable</td>
        <td>---</td>
        <td>Disables the addon.</td>
    </tr>
</tbody>
</table>

## Scoring

Connecting Dots addon allows to create exercises. To set the module in an excercise mode, choose the 'Is activity' property. If the addon is not in an excercise mode, all of the below methods return 0!

<table border='1'>
<tbody>
    <tr>
        <th>Property</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>maxScore</td>
        <td>maximum score is 1 point</td>
    </tr>
    <tr>
        <td>score</td>
        <td>1 if all lines were drawn, otherwise 0</td>
    </tr>
    <tr>
        <td>errorCount</td>
        <td>0 if all lines were drawn or the first point was not selected, otherwise 1</td>
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
        <td>.connectingdots</td>
        <td>DIV containing the points.</td>
    </tr>
    <tr>
        <td>.dot_container</td>
        <td>DIV element, a child of connectingdots that gives more styling possibilities.</td>
    </tr>
    <tr>
        <td>.dot</td>
        <td>Indicates the look of a dot.</td>
    </tr>
    <tr>
        <td>.dot_number</td>
        <td>Indicates the look of the number next to a point.</td>
    </tr>
    <tr>
        <td>.line</td>
        <td>Indicates the look of a line.</td>
    </tr>
    <tr>
        <td>.active</td>
        <td>Additional class for a dot and a dot number for a selected point.</td>
    </tr>
    <tr>
        <td>.correct</td>
        <td>Additional class for connectingdots for an activity solved correctly.</td>
    </tr>
    <tr>
        <td>.wrong</td>
        <td>Additional class for connectingdots for an activity not solved completely.</td>
    </tr>
    <tr>
        <td>.image-start</td>
        <td>Class for the starting image.</td>
    </tr>
    <tr>
        <td>.image-end</td>
        <td>Class for the ending image.</td>
    </tr>
    <tr>
        <td>.line-show-answer</td>
        <td>Added to a line in the show answers mode.</td>
    </tr>
</tbody>
</table>       

##Demo presentation
[Demo presentation](/embed/5304264080490496 "Demo presentation") contains examples of how to use the Connecting Dots addon.                    