## Description
This addon allows users to add multiple selections activity with HTML content to a presentation. Each element works as a single selection option.

## Properties

<table border='1'>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Text</td>
        <td>This property serves for inserting HTML content to be displayed in the module</td>
    </tr>
    <tr>
        <td>Selection is correct</td>
        <td>This property indicates whether a selected element is correct.</td>
    </tr>
    <tr>
        <td>On selected</td>
        <td>Event to be executed when the module is selected.</td>
    </tr>
    <tr>
        <td>On deselected</td>
        <td>Event to be executed when the module is deselected.</td>
    </tr>
    <tr>
        <td>Block wrong answers</td>
        <td>With this option checked, wrong answers are removed and the "on wrong" event is sent.</td>
    </tr>
    <tr>
        <td>Send event on select/deselect</td>
        <td>With this option is checked and the command select/deselect is run on the addon the event is sent..</td>
    </tr>
    <tr>
        <td>Speech texts</td>
        <td>List of speech texts: selected, deselected, correct, incorrect. <br />
This texts will be read by Text to Speech addon after a user performs an action.</td> 
    </tr>
    <tr>
        <td>Lang attribute</td>
        <td>This property allows to define the language for this addon (different than the language of the lesson).</td> 
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
        <td>select</td>
        <td>---</td>
        <td>Select the element if not selected (not available in error checking mode).</td>
    </tr>
    <tr>
        <td>deselect</td>
        <td>---</td>
        <td>Deselect the element if selected (not available in error checking mode).</td>
    </tr>
    <tr>
        <td>isSelected</td>
        <td>---</td>
        <td>Returns true if the addon is selected, otherwise false.</td>
    </tr>
    <tr>
        <td>markAsCorrect</td>
        <td>---</td>
        <td>Marks the addon as correct.</td>
    </tr>
    <tr>
        <td>markAsWrong</td>
        <td>---</td>
        <td>Marks the addon as wrong.</td>
    </tr>
    <tr>
        <td>markAsEmpty</td>
        <td>---</td>
        <td>Marks the addon as empty.</td>
    </tr>
    <tr>
        <td>isAllOK</td>
        <td>---</td>
        <td>Returns true if the element is selected correctly, otherwise false.</td>
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
    <tr>
        <td>disable</td>
        <td>---</td>
        <td>Disables module activities.</td>
    </tr>
    <tr>
        <td>enable</td>
        <td>---</td>
        <td>Enables module activities.</td>
    </tr>
</table>

##Show Answers

This module is fully compatible with [Show Answers module](/doc/page/Show-Answers "Show Answers module") and displays correct answers when a relevant event is sent.

## CSS classes

<table border='1'>
    <tr>
        <th>Class name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>text-identification-element</td>
        <td>The element base class when it has no other state.</td>
    </tr>
    <tr>
        <td>text-identification-element-selected</td>
        <td>Class for a selected element while not in the error checking mode.</td>
    </tr>
    <tr>
        <td>text-identification-element-correct</td>
        <td>Class for an element (un)selected correctly while in the error checking mode.</td>
    </tr>
    <tr>
        <td>text-identification-element-incorrect</td>
        <td>Class for an element (un)selected incorrectly while in the error checking mode.</td>
    </tr>
    <tr>
        <td>text-identification-element-mouse-hover</td>
        <td>Class for an element if it is deselected & when it is on mouse hover.</td>
    </tr>
    <tr>
        <td>text-identification-element-mouse-hover-selected</td>
        <td>Class for an element if it is selected & when it is on mouse hover.</td>
    </tr>
    <tr>
        <td>text-identification-container</td>
        <td>Class for a container.</td>
    </tr>
    <tr>
        <td>text-identification-element-show-answers</td>
        <td>Class for an element if Show Answers is active.</td>
    </tr>
    <tr>
        <td>text-identification-element-empty</td>
        <td>Class for an empty element.</td>
    </tr>
</table>

##Events

Text Identification Addon sends events to Event Bus when user selects it.

<table border='1'>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Item</td>
        <td>It's always '1'</td>
    </tr>
    <tr>
        <td>Value</td>
        <td>1 for selection, 0 for deselection</td>
    </tr>
    <tr>
        <td>Score</td>
        <td>1 for correct answer, 0 for wrong</td>
    </tr>
</table>

When a user selects element properly, the addon sends the 'ALL OK' event. This event is different from a normal event so its structure is shown below.

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
## Keyboard navigation

* Enter – select a current element

## Demo presentation
[Demo presentation](/embed/6491787808997376 "Demo presentation") contains examples of how the Text Identification addon can be used.                            