## Description

A Points and Lines addon enables you to present a set of points on a plane where by choosing two points you can draw or remove a segment connecting the two points. 
This can be used as an activity or as a presentation/simulation.

The Addon supports both click & click and drag & drop operating methods. You may choose a more convenient gesture depending on the situation and the device being used. 

## Properties

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
        <td>Points' coordinates</td>
        <td>Here you define the points' coordinates. Put the coordinates in brackets and separate them with a comma. Put each point in a new line, for example:    
<br>[30,60]<br>[70,120]<br>[50,200]     
</td>
    </tr>
    <tr>
        <td>Points' indexes</td>
        <td>This property allows to add indexes to the points. Separate the indexes with commas, e.g. A, B, C, D, E. Remember that the number of indexes must be equal to the number of points.
<br>If left empty, the points will appear without indexes.</td>
    </tr>
    <tr>
        <td>Starting lines</td>
        <td>This property allows to define the segments that will be visible at the beginning. 
<br>Define a segment by writing the numbers of its endpoints separated with a dash (points are numbered in the order they appear in the Points' coordinates). Definitions of different segments should be comma separated.
<br>If you want the line to be nonremovable, add an asterisk (*) after the second point.
<br>e.g.: 1-2, 1-3, 1-4*
    </td>
    </tr>
    <tr>
        <td>Answer</td>
        <td>This property allows to define the segments that are to be drawn as an answer. Define the segment by writing the numbers of its endpoints separated with a dash (points are numbered in the order they appear in the Points' coordinates). Definitions of different segments should be comma separated.</td>
    </tr>
    <tr>
        <td>Show all answers in GSA mode</td>
        <td>If this property is selected the gradual show answer button will show correct answers for entire addon.</td>
    </tr>
    <tr>
        <td>Is activity</td>
        <td>Enables to define whether the module is an activity or not.</td>
    </tr>
    <tr>
        <td>Is disabled</td>
        <td>Allows to disable the module so that it won't be possible to select any point.</td>
    </tr>
    <tr>
        <td>Blocked lines</td>
        <td>This property allows to define the segments that cannot be drawn. 
<br>Define a segment by writing the numbers of its endpoints separated with a dash (points are numbered in the order they appear in the Points' coordinates). Definitions of different segments should be comma separated.</td>
    </tr>
    <tr>
        <td>Block wrong answers</td>
        <td>With this option checked, wrong answers are removed and the "on wrong" event is sent.</td>
    </tr>
    <tr>
        <td>Single Connection</td>
        <td>With this option checked, only one line can go out from a point.</td>
    </tr>
    <tr>
        <td>Alternative texts</td>
        <td>This property allows to add points descriptions used in TTS mode. Put each description in a new line, for example:
            <br>Point 1
            <br>Point 2
            <br>Point 3
            <br>If no value is defined for this property then values from the property 'Points' indexes' or numbers will be used to describe the points, which will read as follows:
            <br>'Point A', where 'A' is a point index defined in 'Points' indexes'
            <br>'Point 1', where '1' is a index of point when not defined 'Points' indexes'
            <br>It is not necessary to declare alternative text for all points. A point without alternative text will read as previously presented. For example:
            <br>Point A
            <br>
            <br>Point C
            <br>will be read as:
            <br>Point A
            <br>Point 1
            <br>Point C
        </td>
    </tr>
    <tr>
        <td>Lang attribute</td>
        <td>Allows you to set the langauge used to read the points descriptions via the TTS module.</td>
    </tr>
    <tr>
        <td>Speech texts</td>
        <td>Sets the values of speech texts - predefined phrases providing additional context while using the module in the TTS mode. Speech texts are always read using the content's default language.</td>
    </tr> 
</tbody>
</table>

## Events

The Points and Lines addon sends ValueChanged type events to Event Bus when a line is drawn or removed.

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
        <td>the name of the line defined as: line_ponit1_point2</td>
    </tr>
    <tr>
        <td>Value</td>
        <td>1 when a line is drawn, 0 when a line is removed</td>
    </tr>
    <tr>
        <td>Score</td>
        <td>1 if the added line should be drawn or if the removed line should be removed, otherwise 0</td>
    </tr>
</tbody>
</table>

When a user makes all lines properly without any error, the addon sends the 'ALL OK' event.

<table border='1'>
<tbody>
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
        <td>Resets the addon.</td>
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
    <tr>
        <td>isAllOK</td>
        <td>---</td>
        <td>Returns true if all lines are made correctly and there are no mistakes, otherwise false.</td>
    </tr>
    <tr>
        <td>markAsCorrect </td>
        <td>---</td>
        <td>Mark the addon as correct.</td>
    </tr>
    <tr>
        <td>markAsWrong </td>
        <td>---</td>
        <td>Mark the addon as wrong.</td>
    </tr>
    <tr>
        <td>markAsNeutral</td>
        <td>---</td>
        <td>Mark the addon as neutral.</td>
    </tr>
    <tr>
        <td>isConnected</td>
        <td>---</td>
        <td>index1, index2 (integers from 1 to the number of points defined)<br> Returns true if the points 'index1' and 'index2' are connected with a line, otherwise false.</td>
    </tr>
    <tr>
        <td>isEmpty</td>
        <td>---</td>
        <td>Returns true if no line was added or removed by a student, otherwise false.</td>
    </tr>
    <tr>
        <td>isAttempted</td>
        <td>---</td>
        <td>Returns true if any segment is selected.</td>
    </tr>
</tbody>
</table>

## Scoring

Points and Lines addon allows to create exercises. To set the module in an excercise mode, choose the 'Is activity' property. If the addon is not in an excercise mode, all of the below methods return 0!

<table border='1'>
<tbody>
    <tr>
        <th>Property</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>maxScore</td>
        <td>The sum of all lines given in the 'Answer' property that are not defined in the 'Starting lines' property and the lines provided in 'Starting lines' (not marked with an asterisk) that are not defined in 'Answer'.</td>
    </tr>
    <tr>
        <td>score</td>
        <td>The sum of all drawn lines given in the 'Answer' property that are not defined in the 'Starting lines' property and the removed lines entered in 'Starting lines' (not marked with an asterisk) that are not defined in 'Answer'.</td>
    </tr>
    <tr>
        <td>errorCount</td>
        <td>The sum of all drawn lines that are not defined in the 'Answer' property or the 'Starting lines' property and the removed lines given both in 'Starting lines' and 'Answer'.</td>
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
        <td>.pointslines</td>
        <td>DIV containing the points</td>
    </tr>
    <tr>
        <td>.disabled</td>
        <td>additional class for a disabled addon</td>
    </tr>
    <tr>
        <td>.point_container</td>
        <td>DIV element, a child of pointslines adding more styling possibilities</td>
    </tr>
    <tr>
        <td>.point</td>
        <td>indicates the look of the point</td>
    </tr>
    <tr>
        <td>.point_index</td>
        <td>indicates the look of the index of the point</td>
    </tr>
    <tr>
        <td>.line</td>
        <td>indicates the look of the line</td>
    </tr>
    <tr>
        <td>.selected</td>
        <td>additional class for a selected point</td>
    </tr>
    <tr>
        <td>.correct</td>
        <td>additional class for pointslines for an activity solved correctly</td>
    </tr>
    <tr>
        <td>.wrong</td>
        <td>additional class for pointslines for an activity not solved completely</td>
    </tr>
    <tr>
        <td>.noremovable</td>
        <td>additional class for a nonremovable line</td>
    </tr>
    <tr>
        <td>.correctLine</td>
        <td>additional class for a correct line</td>
    </tr>
    <tr>
        <td>.wrongLine</td>
        <td>additional class for a wrong line</td>
    </tr>
</tbody>
</table>

## Demo presentation
[Demo presentation](/embed/5419134734041088 "Demo presentation") contains examples on how to use the Points and Lines addon.                             