## Description

The LearnPen Report addon displays data from LearnPen. You can use one out of three different charts.

<div style="border:1px solid Tomato; padding:5px; margin-bottom:21px;">
Note: Currently addon works only on mLibro Android application with LearnPen.
</div>

## Properties

<table border='1'>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Is Visible</td>
        <td>This property allows you to hide or show the module depending on the activity requirements.</td>
    </tr>
    <tr>
        <td>Is Disable</td>
        <td>Defines if the addon is disabled, which means that it won't be able to record or display the sensors' data.</td>
    </tr>
    <tr>
        <td>Correct Range</td>
        <td>Two numbers between 0 and 100, which define the correct range for sensors. (default value: 40;80)</td>
    </tr>
    <tr>
        <td>Graph type</td>
        <td>The graph type to be displayed: Pie chart, Circle in circle or Four circles.</td>
    </tr>
    <tr>
        <td>Sensor</td>
        <td>Sensors to analyze the following factors: All, Squeeze or Pressure.</td>
    </tr>
    <tr>
        <td>Colors</td>
        <td>Three colors in hex notation or by name separated with semicolons (;). The first color is for the above values, the second one is for the correct values and the third color is for the values below the correct ones. (default value: red;green;yellow)</td>
    </tr>
    <tr>
        <td>Data update interval</td>
        <td>One integer value in millicesonds between 50 and 2000. (1 second = 1000 milliseconds). (default value: 100)</td>
    </tr>
    <tr>
        <td>Calculate from the last values</td>
        <td>A number that defines the number of last recorded data to be analyzed and displayed for a user. (default value: 0)</td>
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
    <tr>
        <td>reset</td>
        <td>---</td>
        <td>Resets the addon.</td>
    </tr>
    <tr>
        <td>record</td>
        <td>---</td>
        <td>Starts the recording.</td>
    </tr>
    <tr>
        <td>stop</td>
        <td>---</td>
        <td>Stops the recording and resets the recorded data.</td>
    </tr>
    <tr>
        <td>pause</td>
        <td>---</td>
        <td>Pauses the recording.</td>
    </tr>
</table>                                   