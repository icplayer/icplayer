## Description

This addon allows users to create activities based on Sudoku games.

##Properties

<table border='1'>
<tbody>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Rows Values</td>
        <td>This property allows user to put the initial cell value. An empty cell is defined as “_“. If, for example, a whole row hasn’t got any initial value, it is enough to leave the row empty (empty values are defined automatically)</td>
    </tr>
        <td>isDisable</td>
        <td>Defines whether the Sudoku addon is disabled.</td>
    </tr>
<tr>
        <td>isActivity</td>
        <td>Enables to define whether the Sudoku addon is an activity or not.</td>
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
        <td>isAllOk</td>
        <td>---</td>
        <td>Returns true when all cells are filled in correctly.</td>
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
        <td>enable</td>
        <td>---</td>
        <td>Enables the addon</td>
    </tr>
    <tr>
        <td>disable</td>
        <td>---</td>
        <td>Disables the addon.</td>
    </tr>
</tbody>
</table>

##Show Answers

This module is fully compatible with [Show Answers module](/doc/page/Show-Answers "Show Answers module") and displays correct answers when a relevant event is sent.

## Events
The Sudoku addon sends events to Event Bus when a user enters a value into the cell.

<table border='1'>
<tbody>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <tr>
            <td>Item</td>
            <td>column_number - row_number</td>
        </tr>
        <tr>
            <td>Value</td>
            <td>Current value</td>
        </tr>
        <tr>
            <td>Score</td>
            <td>available only when the addon is an activity: 1 when addon has a correct answer, 0 for other answers</td>
        </tr>
    </tr>
</tbody>
</table>

##AllOK Event

When all cells are filled in correctly, the addon sends allOk event.

<table border='1'>
<tbody>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <tr>
            <td>Item</td>
            <td>n/a</td>
        </tr>
        <tr>
            <td>Value</td>
            <td>allOK</td>
        </tr>
        <tr>
            <td>Score</td>
            <td>n/a</td>
        </tr>
    </tr>
</tbody>
</table>

##CSS classes

<table border='1'>
<tbody>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <tr>
            <td>sudoku-wrapper</td>
            <td>Outer wrapper of the whole addon.</td>
        </tr>
        <tr>
            <td>input.cell</td>
            <td>Each cell in the Addon.</td>
        </tr>
        <tr>
            <td>input.filled</td>
            <td>Each cell with value at the beginning.</td>
        </tr>
        <tr>
            <td>input.active</td>
            <td>Each empty cell at the beginning.</td>
        </tr>
        <tr>
            <td>input.wrong</td>
            <td>Style for a wrong answer.</td>
        </tr>
        <tr>
            <td>input.correct</td>
            <td>Style for a correct answer.</td>
        </tr>
        <tr>
            <td>input.disable</td>
            <td>Style for disable cells.</td>
        </tr>
        <tr>
            <td>input.check</td>
            <td>Style after clicking on the Check button.</td>
        </tr>
    </tr>
</tbody>
</table>

## Styles from a sample presentation

    .Sudoku_dev_test{
    }

    .Sudoku_dev_test input.check{
     opacity: 0.6;
    }

    .Sudoku_dev_test input.disable{
     opacity: 0.6;
    }

    .Sudoku_dev_test input.wrong{
     opacity: 1;
    }

    .Sudoku_dev_test input.correct{
    opacity: 1;
    }



## Demo presentation
[Demo presentation](/embed/5125260253855744 "Demo presentation") contains examples of how this addon can be used.  

                                                          