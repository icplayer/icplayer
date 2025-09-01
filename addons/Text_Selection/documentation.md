## Description

The Text Selection module allows marking/selecting text parts as correct and wrong phrases.

You can work in two modes:
<ul>
<li>'Mark phrases to select', where you can mark wrong and correct answers, </li>
<li>'All selectable', where all phrases are selectable and you can mark only the correct answers. </li>
</ul>
There are two selection types:
<ul>
<li>'Single select', where you can select only one phrase, </li>
<li>'Multiselect', where you can select multiple phrases. </li>
</ul>


## Properties

The list starts with the common properties. Learn more about them by visiting the <a href="/doc/en/page/Modules-description" target="_blank" rel="noopener noreferrer">Modules description</a> section. The other available properties are described below.

<table border='1'>
    <tr>
        <th>Property</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Mode</td>
        <td>'Mark phrases to select' or 'All selectable'. </td>
    </tr>
    <tr>
         <td>Selection type</td>
         <td>'Single select' or 'Multiselect'. </td>
    </tr>
    <tr>
        <td>Text</td>
        <td>Input text. </td>
    </tr>
    <tr>
        <td>Enable letters selection</td>
        <td>This property enables the user to specify single letters in a given word that are to be marked as correct or wrong. It only works in the 'Mark phrases to select' mode. </td>
    </tr>
    <tr>
        <td>Is Not Activity</td>
        <td>With this option marked, the score and errors will not be returned by the module.</td>
    </tr>
    <tr>
        <td>Enable scroll on mobile devices</td>
        <td>When checked, the module allows you to scroll after touching the text. </td>
    </tr>
    <tr>
        <td>Lang attribute</td>
        <td>This property allows defining the language for this module (different than the language of the lesson). </td>
    </tr>
    <tr>
        <td>Speech texts</td>
        <td>Sets the values of speech texts - predefined phrases providing additional context while using the module in the Text To Speech mode. Speech texts are always read using the content's default language. </td>
    </tr>
    <tr>
        <td>Printable</td>
        <td>Allows to choose if the module should be included in the <a href="/doc/en/page/Marking-elements-that-should-be-included-in-the-printout">printout</a>. </td>
    </tr>
    <tr>
        <td>Block splitting in print</td>
        <td>If this checkbox is marked, and the "Don't randomize" or "Randomize" option is selected in the Printable property, then if the entire Text module will not fit on the printed page (Print preview), it will be moved to the next printed page. </td>
    </tr>
</table>


## Configuration

Each text element must be marked with keywords <i>\\correct{}</i> (if the word or phrase is correct) and <i>\\wrong{}</i> (if the word or phrase is wrong).

<i>\\wrong{}</i> is available only in 'Mark phrases to select' mode. In 'All selectable' mode, you can mark only the correct phrases, and the remaining phrases are wrong.

Selection type: 'Single select' allows you to select only one word or phrase. If one phrase is selected and the student selects another one, then only the last phrase will be selected. In the 'Multiselect' selection type, you can select multiple numbers of phrases.


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
        <td>Hides the module if it is visible. </td>
    </tr>
	<tr>
        <td>show</td>
        <td>---</td>
        <td>Shows the module if it is hidden. </td>
    </tr>
	<tr>
        <td>isAllOK</td>
        <td>---</td>
        <td>Returns true if all correct words are selected, otherwise false. </td>
    </tr>
	<tr>
        <td>isAttempted</td>
        <td>---</td>
        <td>Returns true if a user tries to solve the module. </td>
    </tr>
</table>


## AllOk Event

This event contains the following fields
<table border='1'>
<tbody>
    <tr>
        <th>Field name</th>
        <th>Description</th> 
    </tr>
    <tr>
        <td>Source</td>
        <td>module id</td> 
    </tr>
    <tr>
        <td>Item</td>
        <td>value: "all"</td> 
    </tr>
    <tr>
        <td>Value</td>
        <td>N/A</td> 
    </tr>
    <tr>
        <td>Score</td>
        <td>N/A</td> 
    </tr>
</tbody>
</table>


## Show Answers

This module is fully compatible with [Show Answers](/doc/page/Show-Answers "Show Answers module") module and displays correct answers when an adequate event is sent.

## Scoring
<table border='1'>
    <tr>
        <th>Property</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>maxScore</td>
        <td>maximum score is equal to number of phrases marked as <i>correct</i>. </td>
    </tr>
    <tr>
        <td>score</td>
        <td>score is equal to the number of selected correct phrases. </td>
    </tr>
    <tr>
        <td>errorCount</td>
        <td>errorCount is equal to the number of selected wrong phrases. </td>
    </tr>
</table>


## CSS classes
<table border='1'>
    <tr>
        <th>Class name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>.addon_Text_Selection .selectable</td>
        <td>Phrases are available to be selected in the player. </td>
    </tr>
    <tr>
        <td>.addon_Text_Selection .selected</td>
        <td>Phrases are selected. </td>
    </tr>
    <tr>
        <td>.addon_Text_Selection .wrong</td>
        <td>A phrase marked as wrong. </td>
    </tr>
    <tr>
        <td>.addon_Text_Selection .correct</td>
        <td>A phrase marked as correct. </td>
    </tr>
    <tr>
        <td>.addon_Text_Selection .hover</td>
        <td>When a selectable phrase is on mouse hover. </td>
    </tr>
    <tr>
        <td>.addon_Text_Selection .correct-answer</td>
        <td>A phrase marked in the show answers mode. </td>
    </tr>
    <tr>
        <td>.text_selection.disabled</td>
        <td>The module is disabled. This can occur, for instance, if the Check Answers, Show Answers, or Gradual Show Answers mode is active. </td>
    </tr>
</table>


## Styles from the sample presentation
     .addon_Text_Selection .selectable {
           border-radius: 5px;
     }

     .addon_Text_Selection .selected {
           background-color: #FAFAD2; /* yellow */
     }

     .addon_Text_Selection .wrong {
           background-color: #FF6347; /* red */
     }
    
     .addon_Text_Selection .correct {
           background-color: #7CFC00; /* green */
     }

     .addon_Text_Selection .hover {
           background-color: orange;
           cursor: pointer;
     }


## Demo presentation
[Demo presentation](https://mauthor.com/embed/5091169529757696 "Demo presentation") contains examples of how to use the Text Selection module. 