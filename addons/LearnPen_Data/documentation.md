## Description

The LearnPen Data addon displays all data from LearnPen in real time. The graph in LearnPen Data Addon has 4 stripes – 3 for the squeeze sensors (A, B, C) and 1 for the pressure sensor (a stripe at the bottom – P). Every stripe consists of 12 parts.

<div style="border:1px solid Tomato; padding:5px; margin-bottom:21px;">
Note: Currently the Addon works only on mLibro Android application with LearnPen.
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
        <td>Defines if the addon is disabled, which means that it won't be able to display the sensors' data.</td>
    </tr>
    <tr>
        <td>Steps and colors</td>
        <td>This property describes colors and how much force needs to be used to highlight a particular part of a stripe. More info in the next section.</td>
    </tr>
    <tr>
        <td>Refresh time</td>
        <td>One integer value in milliseconds between 50 and 2000 (1 second = 1000 milliseconds); (default value: 100).</td>
    </tr>
</table>

## Steps and colors property

A function where you can specify the values for every step in a stripe for every sensor. The default correct range is: (33% - 66%). It's necessary to know that steps should be the same as in the Lesson Report addon, if exists on a page. In the first line, choose a relevant sensor (A, B, C or P), and then in the next 12 lines you have to define the percentage value and color (separated with semicolons – the ';' sign). For example:

    A
    20%; yellow 
    35%; yellow
    50%; yellow
    60%; green
    70%; green
    75%; green
    80%; green
    85%; orange
    87%; orange
    90%; red
    93%; red
    95%; red

You can declare more than one sensor, e.g.

    A;B;C

After that you can define other functions for other sensors.

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