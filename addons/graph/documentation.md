## Description
The Graph addon allows inserting a ready-made bar graph into a presentation.

## Properties

<table border="1">
  <tbody>
    <tr>
      <th>Property name</th>
      <th>Description</th>
    </tr>
    <tr>
        <td>Is not an activity</td>
        <td>When this option is selected, no points and errors are reported in Error Checking mode</td>
    </tr>
    <tr>
      <td>X axis description</td>
      <td>indicates the description shown near X axis</td>
    </tr>
    <tr>
      <td>Y axis description</td>
      <td>indicates the description shown near Y axis</td>
    </tr>
    <tr>
      <td>Y axis maximum value</td>
      <td>indicates the maximum value that could be shown on the graph, can have fractional part</td>
    </tr>
    <tr>
      <td>Y axis minimum value</td>
      <td>indicates the minimum value that could be shown on the graph, can have fractional part</td>
    </tr>
    <tr>
      <td>Y axis grid step</td>
      <td>indicates how often draw horizontal grid lines, can have fractional part</td>
    </tr>

    <tr>
      <td>Interactive</td>
      <td>indicates if user can change graph columns' values by clicking above or below them</td>
    </tr>
    <tr>
      <td>Interactive step</td>
      <td>indicates value that will be added/removed to a clicked column, can have fractional part</td>
    </tr>
    <tr>
      <td>Data</td>
      <td>Graph data, in CSV format. For instance:<br />

<pre>
"1", "2", "3", "4"
"2", "-2", "-6", "8"
"12", "4", "6", "8"
</pre>

Each row has to have equal amount of columns. Values have to be placed in quotes. Values can have fractional part.
</td>
    </tr>
    <tr>
      <td>Series colors</td>
      <td>list containing colors for bars, colors have to be defined in any notation that browsers understand, amount of colors must be equal to amount of columns in data</td>
    </tr>
    <tr>
      <td>Answers</td>
      <td>List of objects containing correct answer and example answer status. Used only if interactive property is set to true.</td>
    </tr>
    <tr>
      <td>Show X axis bars descriptions</td>
      <td>indicates if there should be description shown below each bar (column)</td>
    </tr>
    <tr>
      <td>X axis bars descriptions</td>
      <td>list of descriptions to show below each of bar (column). Used only if "Show X axis bars descriptions" property is set to true. Amount of items must be equal to amount of bars on the graph</td>
    </tr>
    <tr>
      <td>Show X axis series descriptions</td>
      <td>indicates if there should be description shown below each of series</td>
    </tr>
    <tr>
      <td>X axis series descriptions</td>
      <td>list of descriptions to show below each serie. Used only if "Show X axis series descriptions" property is set to true. Amount of items must be equal to amount of series.</td>
    </tr>
    <tr>
	<td>Decimal separator</td>
	<td><b>By default, the decimal separator in Graph is a dot character.</b> When this field is filled with, e.g. a comma, all settings (i.e. the Y-axis minimum and maximum values, interactive step) containing the dot character will have it replaced with a comma.
        </td>
    </tr>
    <tr>
      <td>Y axis values</td>
      <td>Shows/hides cyclic or custom values on Y axis. You can specify single values, e.g. "2;3;-5", cyclic values, e.g."2*" or mixed values, e.g. "2*;5;3;-3.5;7.1*". Cyclic value means that every n-th occurrence will be shown.</td>
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
        <td>.graph_serie_size</td>
        <td>indicates the look of series (rows from the "data" property). If you want to add margin between each of the series, use "left" CSS property with fixed value in pixels</td> 
    </tr>

    <tr>
        <td>.graph_value_size</td>
        <td>indicates the look of values, represented as vertical bars (rows' items from the "data" property). If you want to add margin between each of the bars, use "left" CSS property with fixed value in pixels</td> 
    </tr>

    <tr>
        <td>.graph_container_outer</td>
        <td>indicates the look of the most outer container of the graph</td> 
    </tr>

    <tr>
        <td>.graph_container_inner</td>
        <td>indicates the look of the container that provides a margin between outer container and the graph. Default margin is 10px. If you want to adjust it, use "top", "left", "right" and "bottom" CSS properties</td> 
    </tr>

    <tr>
        <td>.graph_grid</td>
        <td>indicates the look of the container that contains grid, use "display" CSS property to disable grid</td> 
    </tr>

    <tr>
        <td>.graph_grid_block_above</td>
        <td>indicates the look of the grid lines that are located above X axis, use "border-top" CSS property to change look of the grid line</td> 
    </tr>

    <tr>
        <td>.graph_grid_block_below</td>
        <td>indicates the look of the grid lines that are located below X axis, use "border-bottom" CSS property to change look of the grid line</td> 
    </tr>

    <tr>
        <td>.graph_grid_description</td>
        <td>indicates the look of the Y axis values, located on the left side of Y axis, near grid lines</td> 
    </tr>

    <tr>
        <td>.graph_axis_description</td>
        <td>indicates the look of axes' descriptions</td> 
    </tr>

    <tr>
        <td>.graph_axis_x_description</td>
        <td>indicates the look of axis X description</td> 
    </tr>

    <tr>
        <td>.graph_axis_y_description</td>
        <td>indicates the look of axis Y description</td> 
    </tr>

    <tr>
        <td>.graph_value_element</td>
        <td>indicates the look of bars. <br /><br />

Note about borders: if you want to set border, use this CSS class to set only "border-left" and "border-right". As top and bottom border can affect positioning of elements, bars that represent positive values should have set only top border and bars that represent negative values should have set only bottom border. For such purpose please use .graph_value_element_positive and .graph_value_element_negative classes, respectively.<br /><br />

Note about errors: if you want to style bars during error checking mode, use .graph_value_element_valid and .graph_value_element_invalid respectively for valid and invalid elements. Rules for borders apply also during this mode.</td> 
    </tr>

    <tr>
        <td>.graph_value_element_valid</td>
        <td><i>see .graph_value_element</i></td>
    </tr>

    <tr>
        <td>.graph_value_element_invalid</td>
        <td><i>see .graph_value_element</i></td>
    </tr>

    <tr>
        <td>.graph_value_element_positive</td>
        <td>indicates the look of bars that represent positive values. Please see note in .graph_value_element<br /><br />

Note about errors: if you want to style bars during error checking mode, use .graph_value_element_positive_valid and .graph_value_element_positive_invalid respectively for valid and invalid elements. Rules for borders apply also during this mode.</td> 
    </tr>

    <tr>
        <td>.graph_value_element_positive_valid</td>
        <td><i>see .graph_value_element_positive</i></td>
    </tr>

    <tr>
        <td>.graph_value_element_positive_invalid</td>
        <td><i>see .graph_value_element_positive</i></td>
    </tr>


    <tr>
        <td>.graph_value_element_negative</td>
        <td>indicates the look of bars that represent negative values. Please see note in .graph_value_element<br /><br />

Note about errors: if you want to style bars during error checking mode, use .graph_value_element_negative_valid and .graph_value_element_negative_invalid respectively for valid and invalid elements. Rules for borders apply also during this mode.</td> 
    </tr>

    <tr>
        <td>.graph_value_element_negative_valid</td>
        <td><i>see .graph_value_element_negative</i></td>
    </tr>

    <tr>
        <td>.graph_value_element_negative_invalid</td>
        <td><i>see .graph_value_element_negative</i></td>
    </tr>

    <tr>
        <td>.graph_column_description</td>
        <td>indicates style of description placed below each bar (column) if they are enabled</td>
    </tr>

    <tr>
        <td>.graph_serie_description</td>
        <td>indicates style of description placed below each serie if they are enabled</td>
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
        <td>-</td>
        <td>Shows the addon.</td>
    </tr>
    <tr>
        <td>hide</td>
        <td>-</td>
        <td>Hides the addon.</td>
    </tr>
	<tr>
        <td>getValue</td>
        <td>index</td>
        <td>Returns current value of column with given index. Index can be from 1 to number of columns (regardless of number of series).</td>
    </tr>
	<tr>
        <td>isAllOK</td>
        <td>-</td>
        <td>Returns true if all columns are set correctly.</td>
    </tr>
</tbody>
</table>

###Examples

**1.1. Make bigger spaces between series and smaller between bars:**  

    .graph_xx {
    }

    .graph_xx .graph_serie_size {
        left: 12px;
    }

    .graph_xx .graph_value_size {
        left: 2px;
    }

**1.2. Make bars' borders pink on invalid answers and yellow on valid answers:**  

    .graph_xx {
    }

    .graph_xx .graph_value_element_valid {
        border-left-color: yellow;
        border-right-color: yellow;
    }

    .graph_xx .graph_value_element_positive_valid {
        border-top-color: yellow;
    }

    .graph_xx .graph_value_element_negative_valid {
        border-bottom-color: yellow;
    }

    .graph_xx .graph_value_element_invalid {
        border-left-color: pink;
        border-right-color: pink;
    }

    .graph_xx .graph_value_element_positive_invalid {
        border-top-color: pink;
    }

    .graph_xx .graph_value_element_negative_invalid {
        border-bottom-color: pink;
    }

## Events (scripting)

When a bar's value is increased or decreased by the user, it sends an event with following arguments:

<table border='1'>
     <tr>
        <th>Parameter</th>
        <th>Value</th>
    </tr>
    <tr>
        <td>source</td>
        <td>ID of this instance of addon</td>
    </tr>
    <tr>
        <td>item</td>
        <td>Clicked bar ID in format:<br />

        <pre>
            SERIE_ID COLUMN_ID
        </pre>

        where:
        <ul>
            <li>SERIE_ID is a row index, counted from 0</li>
            <li>COLUMN_ID is a column index in particular row, counted from 0</li>
        </ul></td>
        If all columns are in correct position then item value is 'all'.
    </tr>

    <tr>
        <td>value</td>
        <td>New value associated with the clicked column.<br /><br />

If you are using Advanced Connector, please note that due to Regular Expression syntax which has special meaning for "-" and "." characters, you need to escape them with backshlash. For example:

<ul>
<li>if you want to match value of -10, you should write "\-10", </li>
<li>if you want to match value 20.5, you should write "20\.5".</li>
</ul>
(in both examples quotes are used only to distinguish value from description, do not copy them to  Advanced Connector's script).
<br/><br />
If 'Decimal separator' property was filled, new value will contain specified decimal separator.<br />
If all columns are in correct position then value is empty ('').
</td>
    </tr>
    <tr>
        <td>score</td>
        <td>1 if comuln is correct, 0 if column is incorrect<br />
        If all columns are in correct position then score value is empty ('').</td>
    </tr>
</table>

## Demo presentation
[Demo presentation](/embed/2416838 "Demo presentation") contains examples of how to use the Graph addon.                              