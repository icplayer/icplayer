## Description
This Addon allows playing a simple "Catch" game, where you have to catch a "correct" falling object and avoid the "wrong" ones. You can move the plate by using the arrows (← or →) or mouse (click on the left or right side of the game).

## Properties

<table border='1'>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Items</td>
        <td>List of object with properties: Image, Description, Is Correct, Levels (in range 1 to 3, separated by comma)</td>
    </tr>
    <tr>
        <td>Item width</td>
        <td>Logical width (in pixels) of every item.</td>
    </tr>
    <tr>
        <td>Item height</td>
        <td>Logical height (in pixels) of every item.</td>
    </tr>
    <tr>
        <td>Points to finish</td>
        <td>Correct points to finish current level or game. If it's 0, then game never ends.</td>
    </tr>
    <tr>
        <td>Count errors</td>
        <td>Count errors to points (every error is minus one point).</td>
    </tr>
</table>

## Scoring
<table border='1'>
    <tr>
        <th>Property</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>score</td>
        <td>Number of correct objects caught.</td>
    </tr>
    <tr>
        <td>errorCount</td>
        <td>Number of wrong objects caught.</td>
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
        <td>Resets drawing.</td>
    </tr>
    <tr>
        <td>setLevel</td>
        <td>number</td>
        <td>Sets game level. (in range of 1 to 3)</td>
    </tr>
    <tr>
        <td>getPoints</td>
        <td>---</td>
        <td>Returns points from a current level.</td>
    </tr>
    <tr>
        <td>getErrors</td>
        <td>---</td>
        <td>Return errors from a current level.</td>
    </tr>
    <tr>
        <td>getMaxScore</td>
        <td>---</td>
        <td>0 if property "Points to finish" equals 0 (then it's neverending game). Else its value of "Points to finish". </td>
    </tr>
</table>

## Events

**correct object event**

<table border='1'>
<tbody>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <tr>
            <td>source</td>
            <td>addon ID</td>
        </tr>
        <tr>
            <td>item</td>
            <td>item number (from Items property)</td>
        </tr>
        <tr>
            <td>value</td>
            <td>1</td>
        </tr>
        <tr>
            <td>score</td>
            <td>Always: 1</td>
        </tr>
    </tr>
</tbody>
</table>

**wrong object event**

<table border='1'>
<tbody>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <tr>
            <td>source</td>
            <td>addon ID</td>
        </tr>
        <tr>
            <td>item</td>
            <td>item number (from Items property)</td>
        </tr>
        <tr>
            <td>value</td>
            <td>1</td>
        </tr>
        <tr>
            <td>score</td>
            <td>Always: 0</td>
        </tr>
    </tr>
</tbody>
</table>

**game end event**

<table border='1'>
<tbody>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <tr>
            <td>source</td>
            <td>addon ID</td>
        </tr>
        <tr>
            <td>item</td>
            <td>'all'</td>
        </tr>
        <tr>
            <td>value</td>
            <td>'EOG'</td>
        </tr>
        <tr>
            <td>score</td>
            <td>Always: 1</td>
        </tr>
    </tr>
</tbody>
</table>

**object created event**

<table border='1'>
<tbody>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <tr>
            <td>source</td>
            <td>addon ID</td>
        </tr>
        <tr>
            <td>item</td>
            <td>item number (from Items property)</td>
        </tr>
        <tr>
            <td>value</td>
            <td>0</td>
        </tr>
        <tr>
            <td>score</td>
            <td>Always: 0</td>
        </tr>
    </tr>
</tbody>
</table>

## Advanced Connector integration
Each command supported by the Catch addon can be used in the Advanced Connector addon's scripts. The below example shows how to change level when the Single State Button is selected.

        EVENTSTART
        Name:ItemSelected
        Item:LevelTwo
        SCRIPTSTART
        var catch = presenter.playerController.getModule('Catch1');
        catch.setLevel(2);
        SCRIPTEND
        EVENTEND

## Demo presentation
[Demo presentation](/embed/4794504243838976 "Demo presentation") contains examples on how to use the Catch addon.                                                   