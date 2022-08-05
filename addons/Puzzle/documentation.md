## Description
A Puzzle module allows you to insert a puzzle game into a presentation. It is enough to upload an image which is later automatically divided into separate items and put in rows and columns. The required number of rows and columns can be defined in the Properties menu. 

**Note:** Puzzle supports the following graphic formats: JPG, PNG, BMP. Vector formats are not supported.

## Properties

<table border='1'>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Image</td>
        <td>An image which serves as a base for creating puzzles.
<p><em>This property allows online resources. <a href="/doc/page/Online-resources">Find out more »</a></em></p>
</td>
    </tr>
    <tr>
        <td>Columns</td>
        <td>Number of columns. Required for Addon to work</td>
    </tr>
    <tr>
        <td>Rows</td>
        <td>Number of rows. Required for Addon to work</td>
    </tr>
    <tr>
        <td>Is Not Activity</td>
        <td>Defines if the addon is NOT an activity, which means that it won't be taken into consideration when checking correctness.</td>
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
        <td>show</td>
        <td>---</td>
        <td>Shows the module</td>
    </tr>
    <tr>
        <td>hide</td>
        <td>---</td>
        <td>Hides the module</td>
    </tr>
    <tr>
        <td>reset</td>
        <td>---</td>
        <td>randomly shuffles the pieces</td>
    </tr>
    <tr>
        <td>isAllOK</td>
        <td>---</td>
        <td>Returns true when all pieces are put correctly</td>
    </tr>
</table>

## Advanced Connector integration
Each command supported by the Puzzle addon can be used in the Advanced Connector addon scripts. The below example shows how to react on Text module gap content changes (i.e. throughout putting elements from Source List in it) and change puzzles visibility accordingly.

        EVENTSTART
        Source:Text2
        Value:1
        SCRIPTSTART
            var puzzle = presenter.playerController.getModule('Puzzle1');
            puzzle.show();
        SCRIPTEND
        EVENTEND
        EVENTSTART
        Source:Text2
        Value:2
        SCRIPTSTART
            var puzzle = presenter.playerController.getModule('Puzzle1');
            puzzle.hide();
        SCRIPTEND
        EVENTEND

## Scoring
Puzzle addon allows to create various types of activities:

<table border='1'>
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
        <td>1 if user places all puzzle elements correctly, otherwise 0</td>
    </tr>
    <tr>
        <td>errorCount</td>
        <td>1 if user incorrectly places at least one puzzle element, otherwise 0</td>
    </tr>
</table>

##Events

When user moves one piece of the Puzzle addon, it sends the 'ValueChanged' event:

<table border='1'>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Item</td>
        <td>position of the moved element (where is its correct placement) in format row-column, ie. 1-2 </td>
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


When user places all pieces of the Puzzle addon properly, it sends the 'ALL OK' event. This event is ValueChanged type and its structure is shown below.

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
        <td>puzzle-container</td>
        <td>DIV surrounding all puzzle elements</td>
    </tr>
    <tr>
        <td>puzzle</td>
        <td>DIV element representing a puzzle element</td>
    </tr>
    <tr>
        <td>selected</td>
        <td>Puzzle elements in selected state</td>
    </tr>
    <tr>
        <td>mark</td>
        <td>Mark element (DIV) shown in the error checking mode. When setting its background-image property, remember to set width and height properties as well</td>
    </tr>
    <tr>
        <td>correct</td>
        <td>Mark element showed in error checking mode when puzzle is in right place</td>
    </tr>
    <tr>
        <td>wrong</td>
        <td>Mark element shown in the error checking mode when a Puzzle is in a wrong place</td>
    </tr>
    <tr>
        <td>top, right, bottom and right</td>
        <td>Classes assigned to puzzles on Addon edges</td>
    </tr>
    <tr>
        <td>hovered-over-by-other</td>
        <td>When puzzle A is dragged over B, assign this class to B</td>
    </tr>
    <tr>
        <td>being-hovered</td>
        <td>Assigned to puzzle that is dragged</td>
    </tr>
</table>

## Demo presentation
[Demo presentation](/embed/5622942877614080 "Demo presentation") contains example usage of the Puzzle Addon.              