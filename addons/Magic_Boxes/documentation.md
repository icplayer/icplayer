## Description
The Magic Boxes addon allows adding a ready-made wordsearch activity to a presentation. To define the boxes, it is enough to enter all texts in the "Grid" section, where each line corresponds to one row in the grid. All possible answers to be found in a wordsearch should also be typed into a relevant field.

Of course it is possible to change the look of the grid, including the size and color of the individual boxes, which can be done by using the CSS classes.

## Properties

<table border='true'>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Grid</td>
        <td>This section serves for entering all texts visible in the grid, where each line corresponds to one row. Each grid box equals its corresponding character in a row.</td>
    </tr>
    <tr>
        <td>Answers</td>
        <td>In this section a user must specify all possible answers to be found in a wordsearch. Those answers should be separated by commas or new line separators. If a grid contains answers not specified in the Answers section, they will not be taken into account in progress, score and error count.</td>
    </tr>
    <tr>
        <td>Check By Words</td>
        <td>When this option is selected, the module will be checking all answers by words, not by letters in the Check Errors mode.</td>
    </tr>
    <tr>
        <td>Lang attribute</td>
        <td>Allows you to set the langauge used to read the contents of the magic box via the TTS module.</td>
    </tr>
    <tr>
        <td>Speech texts</td>
        <td>Sets the values of speech texts - predefined phrases providing additional context while using the module in the TTS mode. Speech texts are always read using the content's default language.</td>
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
        <td>isAllOK</td>
        <td>---</td>
        <td>Returns true when all letters are marked properly.</td>
    </tr>
    <tr>
        <td>show</td>
        <td>---</td>
        <td>Shows the module.</td>
    </tr>
    <tr>
        <td>hide</td>
        <td>---</td>
        <td>Hides the module.</td>
    </tr>
</table>

##Show Answers

This module is fully compatible with [Show Answers module](/doc/page/Show-Answers "Show Answers module") and displays correct answers when a relevant event is sent.

## Scoring
Magic Boxes addon allows to create exercises as well as activities.

<table border='1'>
    <tr>
        <th>Property</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>maxScore</td>
        <td>a number of grid elements that need to be selected to cover all words from the Answers property</td>
    </tr>
    <tr>
        <td>score</td>
        <td>1 point for a correctly selected grid element</td>
    </tr>
    <tr>
        <td>errorCount</td>
        <td>1 error point for an incorrectly selected grid element</td>
    </tr>
</table>

##Events

The Magic Boxes addon sends ValueChanged type events to Event Bus when a user selects a box.

<table border='1'>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Item</td>
        <td>Information about which box has been selected/deselected (i.e. 1-4 means that the box which has been selected is in the first row and the fourth column)</td>
    </tr>
    <tr>
        <td>Value</td>
        <td>Contains content of the selected box</td>
    </tr>
    <tr>
        <td>Score</td>
        <td>1 if the selected box is correct, 0 if it is incorrect</td>
    </tr>
</table>

When a user selects all correct boxes without any error, the addon sends the 'ALL OK' event. This event is different from a normal Magic Boxes event so its structure is shown below.

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
        <td>magicGridWrapper</td>
        <td>Element main DIV element surrounding all grid cells</td>
    </tr>
    <tr>
        <td>selectable-element</td>
        <td>Grid element when not in a selected mode</td>
    </tr>
    <tr>
        <td>selectable-element-selected</td>
        <td>Grid element when in a selected mode</td>
    </tr>
    <tr>
        <td>selectable-element-wrapper</td>
        <td>Grid element surrounding element allowing to create border for elements in both (selected and unselected) states</td>
    </tr>
    <tr>
        <td>selectable-element-selected-correct</td>
        <td>Grid element correctly selected while in error checking mode</td>
    </tr>
    <tr>
        <td>selectable-element-selected-uncorrect</td>
        <td>Grid element incorrectly selected while in error checking mode</td>
    </tr>
    <tr>
        <td>selectable-element-show-answers</td>
        <td>Grid element when Show Answers is active</td>
    </tr>
</table>

## Demo presentation
[Demo presentation](/embed/5428893948313600 "Demo presentation") contains examples of how Addon Magic Boxes can be used.                          