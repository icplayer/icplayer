## Description

This addon allows users to add selectable lines to the presentation. This can be used either as an activity or a simulation.

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
        <td>Lines</td>
        <td>Here you define the coordinates of the lines' ending points and decide if the line should be selected or not.<br>
It's a new line separated property. Each single line should contain x, y values of both points as well as 0 if a line should not be selected or 1 if it should. <br>
For example:<br>
x1;y1-x2;y2-0<br>
x3;y3-x4;y4-1
</td>
    </tr>
    <tr>
        <td>Is activity</td>
        <td>Enables to define whether the module is an activity or not.</td>
    </tr>
<tr>
        <td>Is disabled</td>
        <td>Allows to disable the module so that it won't be possible to select any line.</td>
    </tr>
<tr>
        <td>Single Mode</td>
        <td>If checked, only one line can be selected at a time. Otherwise, user can select many lines.</td>
    </tr>
</tbody>
</table>

## Events

The Line Selection Addon sends the ValueChanged type events to Event Bus when a line is selected or deselected.

<table border='1'>
<tbody>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <tr>
            <td>item</td>
            <td>Id of the line (lines are numbers as they are put in the Lines property)</td>
        </tr>
        <tr>
            <td>value</td>
            <td>1 for selection, 0 for deselection</td>
        </tr>
        <tr>
            <td>score</td>
            <td>1 for correct answer, 0 for wrong</td>
        </tr>
    </tr>
</tbody>
</table>

When a user selects all lines properly without any error, the addon sends the 'ALL OK' event.

<table border='1'>
<tbody>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <tr>
            <td>item</td>
            <td>all</td>
        </tr>
        <tr>
            <td>value</td>
            <td>N/A</td>
        </tr>
        <tr>
            <td>score</td>
            <td>N/A</td>
        </tr>
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
        <td>select</td>
        <td>index</td>
        <td>Selects the line with a given index.</td>
</tr>
<tr>
        <td>deselect</td>
        <td>index</td>
        <td>Delects the line with a given index.</td>
</tr>
</tbody>
</table>

## Scoring

The Line Selection Addon allows you to create exercises. To set the module in an excercise mode, choose the 'Is activity' property. If the addon is not in an excercise mode, all of the below methods return 0!

<table border='1'>
<tbody>
    <tr>
        <th>Property</th>
        <th>Description</th>
    </tr>
    <tr>
        <tr>
            <td>maxScore</td>
            <td>The sum of all lines that should be selected.</td>
        </tr>
        <tr>
            <td>score</td>
            <td>The sum of all selected lines that have 1 at the end of their definition in the Lines property.</td>
        </tr>
        <tr>
            <td>errorCount</td>
            <td>The sum of all selected lines that have 0 at the end of their ddefinition in the Lines property.</td>
        </tr>
</tbody>
</table>

##Show Answers

This module is fully compatible with the [Show Answers](/doc/page/Show-Answers) module and displays correct answers when a relevant event is sent.

##CSS classes

  <table border='1'>
<tbody>
    <tr>
        <th>Class name</th>
        <th>Description</th>
    </tr>
    <tr>
        <tr>
            <td>.lines_selection</td>
            <td>DIV containing the whole addon</td>
        </tr>
        <tr>
            <td>.lines_wrapper</td>
            <td>SVG containting the lines</td>
        </tr>
        <tr>
            <td>.disabled</td>
            <td>Additional class for lines-selection for disabled addon</td>
        </tr>
<tr>
            <td>.lines_wrapper .line</td>
            <td>Indicates the look of the line.</td>
        </tr>
<tr>
            <td>.lines_wrapper <br> .lines.selected</td>
            <td>Additional class for the line. Indicates the look of the selected line.</td>
        </tr>
<tr>
            <td>.lines_wrapper <br> .lines.correct</td>
            <td>Additional class for the line. Indicates the look of the correctly selected line in the error checking mode.</td>
        </tr>
<tr>
            <td>.lines_wrapper <br> .lines.wrong</td>
            <td>Additional class for the line. Indicates the look of the incorrectly selected line in the error checking mode.</td>
        </tr>
<tr>
            <td>.lines_wrapper <br> .lines.show_answers_ok</td>
            <td>Additional class for the line. Indicates the look of the line that should be selected in the Show Answers mode.</td>
        </tr>
</tbody>
</table>       

##Demo presentation
[Demo presentation](/embed/6170918666108928 "Demo presentation") contains examples of how to use the Line Selection addon.                         