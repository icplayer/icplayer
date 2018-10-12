## Description
The Text Selection addon allows marking / selecting parts of text as correct and wrong phrases.

You can work in two modes:
<ul>
<li>'Mark phrases to select', where you can mark wrong and correct answers,</li>
<li>'All selectable', where all phrases are selectable and you can mark only the correct answers</li>
</ul>
and two selection types:
<ul>
<li>'Single select', where you can select only one phrase,</li>
<li>'Multiselect', where you are able to select multiple phrases.</li>
</ul>

## Properties
<table border='1'>
    <tr>
        <th>Property</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Mode</td>
        <td>'Mark phrases to select' or 'All selectable'</td>
    </tr>
    <tr>
         <td>Selection type</td>
         <td>'Single select' or 'Multiselect'</td>
    </tr>
    <tr>
        <td>Text</td>
        <td>Input text</i></td>
    </tr>
    <tr>
        <td>Enable letters selection</td>
        <td>This property enables user to specify single letters in a given word that are to be marked as correct or wrong.</td>
    </tr>
    <tr>
        <td>Is Not Activity</td>
        <td>When checked, no score (done, errors) is returned by the addon.</td>
    </tr>
    <tr>
        <td>Enable scroll on mobile devices</td>
        <td>When checked, the addon allows you to scroll after touching the text.</td>
    </tr>
</table>

## Configuration

Each text element has to be marked with keywords <i>\\correct{}</i> (if the word or phrase is correct) and <i>\\wrong{}</i> (if the word or phrase is wrong).

<i>\\wrong{}</i> is available only in 'Mark phrases to select' mode. In 'All selectable' mode you can mark only the correct phrases and the remaining phrases are wrong.

Selection type: 'Single select' allows you to select only one word or phrase. If one phrase is selected and student selects another one, then only the last phrase will be selected. In 'Multiselect' selection type you can select multiple numbers of phrases.

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
        <td>Shows the addon.</td>
    </tr>
	<tr>
        <td>hide</td>
        <td>---</td>
        <td>Hides the addon</td>
    </tr>
	<tr>
        <td>isAllOK</td>
        <td>---</td>
        <td>Returns true if all correct words are selected, otherwise false.</td>
    </tr>
	<tr>
        <td>isAttempted</td>
        <td>---</td>
        <td>Returns true if a user tries to solve the module.</td>
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
        <td>source</td>
        <td>module id</td> 
    </tr>
    <tr>
        <td>item</td>
        <td>value: "all"</td> 
    </tr>
    <tr>
        <td>value</td>
        <td>N/A</td> 
    </tr>
    <tr>
        <td>score</td>
        <td>N/A</td> 
    </tr>
</tbody>
</table>

##Show Answers

This module is fully compatible with [Show Answers module](/doc/page/Show-Answers "Show Answers module") and displays correct answers when an adequate event is sent.

## Scoring
<table border='1'>
    <tr>
        <th>Property</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>maxScore</td>
        <td>maximum score is equal to number of phrases marked as <i>correct</i></td>
    </tr>
    <tr>
        <td>score</td>
        <td>score is equal to number of selected correct phrases</td>
    </tr>
    <tr>
        <td>errorCount</td>
        <td>errorCount is equal to number of selected wrong phrases</td>
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
        <td>Phrases are available to be selected in player.</td>
    </tr>
    <tr>
        <td>.addon_Text_Selection .selected</td>
        <td>Phrases are selected.</td>
    </tr>
    <tr>
        <td>.addon_Text_Selection .wrong</td>
        <td>A phrase marked as wrong.</td>
    </tr>
    <tr>
        <td>.addon_Text_Selection .correct</td>
        <td>A phrase marked as correct.</td>
    </tr>
    <tr>
        <td>.addon_Text_Selection .hover</td>
        <td>When a selectable phrase is on mouse hover.</td>
    </tr>
    <tr>
        <td>.addon_Text_Selection .correct-answer</td>
        <td>A phrase marked in the show answers mode.</td>
    </tr>
</table>

##Styles from the sample presentation
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
[Demo presentation](/embed/5091169529757696 "Demo presentation") contains examples of how to use the Text Selection addon.                                                       