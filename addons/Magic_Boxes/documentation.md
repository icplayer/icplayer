## Description
The Magic Boxes module allows adding a ready-made word search activity to a presentation. To define the boxes, all texts must be entered in the "Grid" section, where each line corresponds to one row in the grid. All answers in the word search should also be typed in the relevant fields.

Of course, it is possible to change the look of the grid, including the size and color of the individual boxes, which can be done using the CSS classes.

## Properties

The list starts with the common properties, learn more about them by visiting the [Modules description](https://www.mauthor.com/doc/en/page/Modules-description) section. The other available properties are described below.

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
        <td>In this section a user must specify all answers to be found in a word search. Those answers should be separated using commas or new line separators. If a grid contains answers not specified in the Answers section, they will not be considered in progress, score, and error count.</td>
    </tr>
    <tr>
        <td>Check By Words</td>
        <td>When this option is selected, the module will check all answers by words, not by letters in the Check Errors mode.</td>
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
        <td>hide</td>
        <td>---</td>
        <td>Hides the module if it is visible.</td>
    </tr>
    <tr>
        <td>show</td>
        <td>---</td>
        <td>Shows the module if it is hidden.</td>
    </tr>
</table>

##Show Answers

This module is fully compatible with [Show Answers module](/doc/page/Show-Answers "Show Answers module") and displays correct answers when a relevant event is sent.

## Scoring
The Magic Boxes module allows the author to create activities.

<table border='1'>
    <tr>
        <th>Property</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>maxScore</td>
        <td>A number of grid elements that need to be selected to cover all words from the Answers property.</td>
    </tr>
    <tr>
        <td>score</td>
        <td>1 point for a correctly selected grid element.</td>
    </tr>
    <tr>
        <td>errorCount</td>
        <td>1 error point for an incorrectly selected grid element.</td>
    </tr>
</table>

##Events

The Magic Boxes module sends the ValueChanged type events to the Event Bus when the user selects a box.

<table border='1'>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Item</td>
        <td>Information about which box has been selected/deselected (i.e. 1-4 means that the box which has been selected is in the first row and the fourth column).</td>
    </tr>
    <tr>
        <td>Value</td>
        <td>Contains content of the selected box.</td>
    </tr>
    <tr>
        <td>Score</td>
        <td>1 if the selected box is correct, 0 if it is incorrect.</td>
    </tr>
</table>

When the user selects all correct boxes without any error, the module sends the 'ALL OK' event. This event is different from the normal Magic Boxes event, so its structure is shown below.

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
        <td>The main DIV element that surrounds all the grid cells.</td>
    </tr>
    <tr>
        <td>selectable-element</td>
        <td>The grid element when not in a selected mode.</td>
    </tr>
    <tr>
        <td>selectable-element-selected</td>
        <td>The grid element when in a selected mode.</td>
    </tr>
    <tr>
        <td>selectable-element-wrapper</td>
        <td>The grid element surrounding the element allows the creation of the border for elements in both (selected and unselected) states.</td>
    </tr>
    <tr>
        <td>selectable-element-selected-correct</td>
        <td>The grid element that is correctly selected while in the error-checking mode.</td>
    </tr>
    <tr>
        <td>selectable-element-selected-uncorrect</td>
        <td>The grid element that is incorrectly selected while in the error-checking mode.</td>
    </tr>
    <tr>
        <td>selectable-element-show-answers</td>
        <td>The grid element when the Show Answers is active.</td>
    </tr>
</table>

## Demo presentation
[Demo presentation](/embed/5428893948313600 "Demo presentation") contains examples of how Addon Magic Boxes can be used.                          