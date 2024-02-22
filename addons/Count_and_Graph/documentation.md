## Description
Count and Graph addon enables users to insert a ready-made bar graph into a presentation. To make the activity work, it is enough to predefine a few specific properties in the addon’s side menu.

## Properties

<table border='1'>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>X axis description</td>
        <td>Your description of X axis</td>
    </tr>
    <tr>
        <td>X axis data</td>
        <td>You can define here the number of columns, numeric answers for every column, color of every column and description, which can be a string or an image. You can also designate a columns as an example. Example columns cannot be interacted with and constantly display their numeric answer.
<p><em>This property allows online resources. <a href="/doc/page/Online-resources">Find out more »</a></em></p>
</td>
    </tr>
    <tr>
        <td>Y axis description</td>
        <td>Your description of Y axis</td>
    </tr>
    <tr>
        <td>Y axis maximum value</td>
        <td>Defines maximum value on scale on Y axis</td>
    </tr>
    <tr>
        <td>Y axis values</td>
        <td>You can specify values on y axis separated by semi-colons, e.g. "2;3;4;7" or increase the value, e.g. "2*" (remember to include a star), then values on y axis will be: (0, 2, 4, ... , [Y axis maximum value])</td>
    </tr>
    <tr>
        <td>Bars width</td>
        <td>Width of every column in graph in pixels</td>
    </tr>
    <tr>
        <td>Background color</td>
        <td>Background color specified in '#RRGGBB' (hex) notation or by name, e.g. 'pink'</td>
    </tr>
    <tr>
        <td>Grid line color</td>
        <td>Color of lines in background grid specified in '#RRGGBB' (hex) notation or by name, e.g. 'pink'</td>
    </tr>
    <tr>
        <td>Border</td>
        <td>Border size. A number between 0 (no border) and 5 (5px black border)</td>
    </tr>
</table>

## Scoring
<table border='1'>
    <tr>
        <th>Property</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>maxScore</td>
        <td>maximum score is equal to the number of columns on correct position</td>
    </tr>
    <tr>
        <td>score</td>
        <td>score is equal to the number of columns on correct position</td>
    </tr>
    <tr>
        <td>errorCount</td>
        <td>errorCount is equal to the number of columns on wrong position</td>
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
        <td>showAnswers</td>
        <td>---</td>
        <td>Shows the addon answers.</td>
    </tr>
    <tr>
        <td>hideAnswers</td>
        <td>---</td>
        <td>Hides the addon answers.</td>
    </tr>
</table>

##Events

The Count and Graph addon sends ValueChanged type events to Event Bus when a user fills in the graph levels..

<table border='1'>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Item</td>
        <td>Information on which column has been filled (i.e. "2 increase" means that the second column has been filled in)</td>
    </tr>
    <tr>
        <td>Value</td>
        <td></td>
    </tr>
    <tr>
        <td>Score</td>
        <td>1 if level is correct, 0 if incorrect</td>
    </tr>
</table>

When a user fills in all columns without any error, the addon sends the 'ALL OK' event. This event is different from a normal Count and Graph event so its structure is shown below.

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

## CSS classes

<table border='1'>
    <tr>
        <th>Class name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>jqplot-yaxis</td>
        <td>Class for the y axis box.</td>
    </tr>
    <tr>
        <td>jqplot-xaxis</td>
        <td>Class for the x axis box.</td>
    </tr>
    <tr>
        <td>jqplot-yaxis-label</td>
        <td>Class for the y axis descriptions.</td>
    </tr>
    <tr>
        <td>jqplot-xaxis-label</td>
        <td>Class for the x axis descriptions.</td>
    </tr>
    <tr>
        <td>jqplot-yaxis-tick</td>
        <td>Class for every value description on the Y axis.</td>
    </tr>
    <tr>
        <td>jqplot-xaxis-tick</td>
        <td>Class for every value description on the X axis.</td>
    </tr>
    <tr>
        <td><p>.jqplot-point-label .jqplot-series-&lt;column level&gt;</p> <p>.jqplot-point-&lt;column number&gt; up</p></td>
        <td>Class for div that shows the up arrow. jqplot-series and jqplot-point are counted from 0.</td>
    </tr>
    <tr>
        <td><p>.jqplot-point-label .jqplot-series-&lt;column level&gt;</p> <p>.jqplot-point-&lt;column number&gt; down</p></td>
        <td>Class for div that shows the down arrow. jqplot-series and jqplot-point are counted from 0.</td>
    </tr>
    <tr>
        <td><p>.jqplot-point-label .jqplot-series-&lt;column level&gt;</p> <p>.jqplot-point-&lt;column number&gt; ok</p></td>
        <td>Class for div that shows the ok sign. jqplot-series and jqplot-point are counted from 0.</td>
    </tr>
jqplot-point-label jqplot-series-1 jqplot-point-2 up
</table>

## Demo presentation
[Demo presentation](/embed/6540243277709312 "Demo presentation") contain examples of how to use and configure the addon.                      