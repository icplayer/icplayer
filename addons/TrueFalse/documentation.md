## Description

This addon is an alternative for the Choice module. It allows putting a single or a multiple-choice activity in a presentation.

##Properties
<table border='1'>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Multi</td>
        <td>Indicates whether an activity is in a multiple or single choice mode. For a single choice activity it is enough to leave the box unchecked.</td> 
    </tr>
    <tr>
          <td>Choices</td>
          <td>Choice options list. i.e. True and False as possible choices.</td> 
    </tr>
    <tr>
          <td>Questions</td>
          <td>Questions list. Here you can insert your questions and answers.</td>
    </tr>
    <tr>
          <td>Question</td>
          <td>Single question.</td>
     </tr>
     <tr>
          <td>Answer</td>
          <td>This is a number. It's an index of a correct answer. i.e. in case of 3 possible choices A, B, C "1" indicates the first choice option (A), "2" the second (B), and so on (always counted from left to right). For instance, if "C" is the correct answer, "3" is the number that should be inserted in the "Answer" field. In case of a multiple choice mode, the indexes should be comma separated.
          </td>
     </tr>
     <tr>
          <td>Is not an activity</td>
          <td>With this option, the selected score and errors will not be returned by addon.</td>
    </tr>
    <tr>
        <td>Lang attribute</td>
        <td>This property allows to define the language for this addon (different than the language of the lesson).</td> 
    </tr>
    <tr>
        <td>Speech texts</td>
        <td>List of speech texts: Selected, Deselected, Correct, Incorrect. <br />
This texts will be read by Text to Speech addon after a user performs an action.</td> 
    </tr>
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
        <td>isAllOK</td>
        <td>---</td>
        <td>Returns true if all answers are selected correctly and there are no mistakes, otherwise false.</td>
    </tr>
    <tr>
        <td>isAttempted</td>
        <td>---</td>
        <td>Returns true if any answer to any question is selected.</td>
    </tr>
    <tr>
        <td>reset</td>
        <td>---</td>
        <td>Resets the module.</td>
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
</tbody>
</table>

##Custom Scoring

The True/False addon supports Custom Scoring scripts. For more information about Custom Scoring see [documentation](/doc/page/Custom-Scoring).

<table border='1'>
<tbody>
    <tr>
        <th>Command name</th>
        <th>Params</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>isSelected</td>
        <td>questionIndex - index of row<br>
		answerIndex - index of answer</td>
        <td>Returns true if answer is selected, otherwise false.</td>
    </tr>
	    <tr>
        <td>markAsCorrect</td>
        <td>questionIndex - index of row<br>
		answerIndex - index of answer</td>
        <td>Marks answer as correct.</td>
    </tr>
	    <tr>
        <td>markAsWrong</td>
        <td>questionIndex - index of row<br>
		answerIndex - index of answer</td>
        <td>Marks answer as wrong.</td>
    </tr>
	    <tr>
        <td>markAsEmpty</td>
        <td>questionIndex - index of row<br>
		answerIndex - index of answer</td>
        <td>Marks answer as empty.</td>
    </tr>
	  <tr>
        <td>removeMark</td>
        <td>questionIndex - index of row<br>
		answerIndex - index of answer</td>
        <td>Removes answer's mark.</td>
    </tr>
</tbody>
</table>

##Events

The True/False addon sends events to Event Bus when a user selects an option. If the answer has already been selected and a question has only one answer possible (Multi option deselected), then the event isn't sent.

<table border='1'>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Item</td>
        <td>&lt;Question_number&gt;-&lt;Answer_number&lt; (i.e. 2-3 means that the 3rd answer has been (de)selected for the 2nd question)</td>
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

When a user selects all answers properly without any error, the addon sends the 'ALL OK' event. This event is different from the normal True/False event and its structure is shown below.

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

The second event which is different from others is the 'ROW OK' event. This event is sent when all answers in a single row are correct.

<table border='1'>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Item</td>
        <td>&lt;row_number&gt;-all (i.e. 2-all means that all answers were correct for the 2nd row.)</td>
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

##Show Answers

This module is fully compatible with [Show Answers module](/doc/page/Show-Answers "Show Answers module") and displays correct answers when an adequate event is sent.

##CSS classes

<table border='1'>
    <tbody>
        <tr>
            <th>Class name</th>
            <th>Description</th>
        </tr>
        <tr>
            <td>.addon_TrueFalse .tf_radio, .tf_checkbox</td>
            <td>indicates the look of the table</td>
        </tr>
        <tr>
            <td>.addon_TrueFalse .tf_radio_text, .tf_checkbox_text</td>
            <td>indicates the look of the table cell containing Choice</td>
        </tr>
        <tr>
            <td>.addon_TrueFalse .tf_radio_image, .tf_checkbox_image</td>
            <td>indicates the look of the table cell containing single/multi Choice icon. Icons are inner DIV elements with 'background-image' property pointing to icons URL addresses</td>
        </tr>
        <tr>
            <td>.addon_TrueFalse .tf_radio_image.last, .tf_checkbox_image.last</td>
            <td>indicates the look of the last table cell containing single/multi Choice icon </td>
        </tr>
        <tr>
            <td>.addon_TrueFalse .tf_radio_question, .tf_checkbox_question</td>
            <td>indicates the look of the table cell containing question </td>
        </tr>
        <tr>
            <td>.addon_TrueFalse .up</td>
            <td>Standard state of Choice icon.</td>
        </tr>
        <tr>
            <td>.addon_TrueFalse .up.disabled</td>
            <td>State when choice isn't selected and check answers is pressed.</td>
        </tr>
        <tr>
            <td>.addon_TrueFalse .down</td>
            <td>State when choice is selected.</td>
        </tr>
        <tr>
            <td>.addon_TrueFalse .down.wrong</td>
            <td>State when choice is selected and it's wrong answer.</td>
        </tr>
        <tr>
            <td>.addon_TrueFalse .down.correct</td>
            <td>State when choice is selected and it's correct answer.</td>
        </tr>
        <tr>
            <td>.addon_TrueFalse .down.correct-answer</td>
            <td>State when correct answers are displayed after ShowAnswers event was sent.</td>
        </tr>
        <tr>
            <td>.addon_TrueFalse .mouse-hover</td>
            <td>State of choice on mouse hover</td>
        </tr>
    </tbody>
</table>

## Demo presentation
[Demo presentation](/embed/5509869026148352 "Demo presentation") contain examples of how the True/False Addon can be used.                   