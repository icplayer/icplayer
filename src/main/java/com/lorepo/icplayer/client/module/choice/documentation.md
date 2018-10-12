## Description
A choice module enables to insert a Multiple choice or a Single choice activity. In a Multiple choice activity it is possible to give more that one correct answer, whereas in a Single choice task only one option is correct. The Choice module enables to set multiple numbers of choice options which can be defined either by texts or by images. 

The activity layout is vertical by default, but if needed it is possible to place it horizontally thanks to the  CSS styling.

The module also enables to establish different values for the correct answers, e.g. the answer marked as "2" will generate more points than the answer marked as "1". Both of them are correct but one of them is worth more points than the other.

## Properties

<table border="1">
  <tbody>
    <tr>
      <th>Property name</th>
      <th>Description</th>
    </tr>
<tr>
      <td>Is visible</td>
      <td>This property allows to hide or show the module depending on the activity requirements.</td>
    </tr>
    <tr>
      <td>Is multi</td>
      <td>Indicates whether an activity is a multiple or single choice activity. For a single choice activity it is enough to leave the box unchecked.</td>
    </tr>
    <tr>
      <td>Item</td>
      <td>This section allows to enter all the choice options in the "Text" field and mark the correct answer(s) as "1" in the "Value" field. The options which are not correct should be marked as "0". Item count serves for indicating the number of choice options in an activity.</td>
    </tr>
 <tr>
       <td>Is disabled</td>
        <td>This property allows to disable a choice module so that it is not possible to enter any answers before certain actions are performed, e.g. a particular part of an activity is completed correctly.
        </td> 
    </tr>
<tr>
 <td>Is activity</td>
        <td>This property allows to define whether a choice module is an activity or not. When it is not defined as an activity, the answers given are not taken into account in the overall result. It is helpful for e.g. simulations.</td> 
    </tr>
 <tr>
       <td>Random Order</td>
        <td>If this property is checked, items in Choice module will appear in random order every time you reload the lesson's page.
        </td> 
    </tr>
 <tr>
       <td>Horizontal Layout</td>
        <td>If this property is checked, the choice module will be displayed horizontally.
        </td> 
    </tr>
    <tr>
        <td>Lang attribute</td>
        <td>This property allows to define the language for this addon (different than the language of the lesson).</td> 
    </tr> 
    <tr>
        <td>Speech texts</td>
        <td>List of speech texts: Selected, Deselected, Correct, Wrong. <br />
This texts will be read by Text to Speech addon after a user performs an action.</td> 
    </tr>
	</tbody>
</table>

## Supported commands

<table border='1'>
    <tr>
        <th>Command name</th>
        <th>Params</th>
        <th>Description</th> 
    </tr>
    <tr>
        <td>disable</td>
        <td>-</td>
        <td>disable module</td> 
    </tr>
    <tr>
        <td>enable</td>
        <td>-</td>
        <td>enable module</td> 
    </tr>
    <tr>
        <td>show</td>
        <td>-</td>
        <td>show module</td> 
    </tr>
    <tr>
        <td>hide</td>
        <td>-</td>
        <td>hide module</td> 
    </tr>
    <tr>
        <td>reset</td>
        <td>-</td>
        <td>reset module</td> 
    </tr>
    <tr>
        <td>isAttempted</td>
        <td>-</td>
        <td>returns true if choice has at least one option selected.</td> 
    </tr>
    <tr>
        <td>isAllOK</td>
        <td>-</td>
        <td>returns true if all answers are selected correctly, otherwise false</td> 
    </tr>
    <tr>
        <td>markOptionAsCorrect</td>
        <td>index</td>
        <td>set correct css style</td> 
    </tr>
    <tr>
        <td>markOptionAsWrong</td>
        <td>index</td>
        <td>set wrong css style</td> 
    </tr>
    <tr>
        <td>markOptionAsEmpty</td>
        <td>index</td>
        <td>set empty css style</td> 
    </tr>
    <tr>
        <td>isOptionSelected</td>
        <td>index</td>
        <td>returns true if given option is selected</td> 
    </tr>
</table>

## Events

### OnValueChanged Event

This event contains the following fields
<table border='1'>
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
        <td>last changed option id</td> 
    </tr>
    <tr>
        <td>value</td>
        <td>New value 1 or 0</td> 
    </tr>
    <tr>
        <td>score</td>
        <td>choice item score</td> 
    </tr>
</table>

### AllOk Event
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
        <td>last changed option id</td> 
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

## Supported commands

<table border='1'>
<tbody>
    <tr>
        <th>Command name</th>
        <th>Params</th> 
        <th>Description</th> 
    </tr>
    <tr>
        <td>markOptionAsCorrect</td>
        <td>index - 1-based index of option</td> 
        <td>Mark option as correct</td> 
    </tr>
    <tr>
        <td>markOptionAsWrong</td>
        <td>index - 1-based index of option</td> 
        <td>Mark option as wrong</td> 
    </tr>
    <tr>
        <td>markOptionAsEmpty</td>
        <td>index - 1-based index of option</td> 
        <td>Mark option as empty</td> 
    </tr>
<tr>
        <td>show</td>
        <td>–</td> 
        <td>Shows the addon</td> 
    </tr>
    <tr>
        <td>hide</td>
        <td>–</td> 
        <td>Hides the addon</td> 
    </tr>
    <tr>
        <td>reset</td>
        <td>–</td> 
        <td>Clears out all answers selected in the addon</td> 
    </tr>
    <tr>
        <td>isAttempted</td>
        <td>–</td> 
        <td>Returns True if choice has at least one option selected.</td> 
    </tr>
</tbody>
</table>

##Show Answers

This module is fully compatible with [Show Answers module](/doc/page/Show-Answers "Show Answers module") and displays correct answers when adequate event is sent.

## CSS classes

<table border='1'>
<tbody>
    <tr>
        <th>Class name</th>
        <th>Description</th> 
    </tr>
    <tr>
        <td>.ic_moption</td>
        <td>indicates the look of the Multiple choice activity's option</td> 
    </tr>
 <tr>
        <td>.ic_moption-up</td>
        <td>indicates the look of the unselected Multiple choice activity's option</td> 
    </tr>
 <tr>
        <td>.ic_moption-up-hovering</td>
        <td>indicates the look of the Multiple choice activity's selected option while putting a mouse cursor on it</td> 
    </tr>
<tr>
        <td>.ic_moption-down</td>
        <td>indicates the look of the Multiple choice activity's option while selecting it</td> 
    </tr>
<tr>
        <td>.ic_moption-down-hovering</td>
        <td>indicates the look of the Multiple choice activity's selected option while putting a mouse cursor on it</td> 
    </tr>
 <tr>
        <td>.ic_moption-up-correct</td>
        <td>indicates the look of the correct Multiple choice activity's option — unselected</td> 
    </tr>
 <tr>
        <td>.ic_moption-up-wrong</td>
        <td>indicates the look of the incorrect Multiple choice activity's option — unselected</td> 
    </tr>
 <tr>
        <td>.ic_moption-down-correct</td>
        <td>indicates the look of the correct Multiple choice activity's option — selected 
</td> 
 <tr>
        <td>.ic_moption-down-correct-answer</td>
        <td>indicates the look of the correct answer in Multiple choice activity's option after ShowAnswers event was sent
</td> 
    </tr>
 <tr>
        <td>.ic_moption-down-wrong</td>
        <td>indicates the look of the incorrect Multiple choice activity's option — selected </td> 
    </tr>
 <tr>
        <td>.ic_soption</td>
        <td>indicates the look of the Single choice activity's option</td> 
    </tr>
 <tr>
        <td>.ic_soption-up</td>
        <td>indicates the look of the Single choice activity's option while putting a mouse cursor on it</td> 
    </tr>
 <tr>
        <td>.ic_soption-up-hovering</td>
        <td>indicates the look of the Single choice activity's option while putting a mouse cursor on it</td> 
    </tr>
<tr>
        <td>.ic_soption-down</td>
        <td>indicates the look of the Single choice activity's option while selecting it</td> 
    </tr>
<tr>
        <td>.ic_soption-down-hovering</td>
        <td>indicates the look of the Single choice activity's selected option while putting a mouse cursor on it</td> 
    </tr>
<tr>
        <td>.ic_soption-up-correct</td>
        <td>indicates the look of the correct Single choice activity's option — unselected</td> 
    </tr>
<tr>
        <td>.ic_soption-up-correct-answer</td>
        <td>indicates the look of the correct Single choice activity's option — unselected</td> 
    </tr>
<tr>
        <td>.ic_soption-up-wrong</td>
        <td>indicates the look of the correct answer in Single choice activity's option after ShowAnswers event was sent</td> 
    </tr>
<tr>
        <td>.ic_soption-down-correct</td>
        <td>indicates the look of the correct Single choice activity's option — selected</td> 
    </tr>
<tr>
        <td>.ic_soption-down-wrong</td>
        <td>indicates the look of the incorrect Single choice activity's option — selected</td> 
    </tr>
<tr>
        <td>ic_soption-markedAsCorrect</td>
        <td>indicates the look of the correct Single choice activity's option — it's not important if the option is or isn't selected</td> 
    </tr>
<tr>
        <td>ic_soption-markedAsWrong</td>
        <td>indicates the look of the wrong Single choice activity's option — it's not important if the option is or isn't selected</td> 
    </tr>
</tbody>
</table>

###Examples

**1.1. Single choice:**  
.ic_soption{  
background-position: right center;  
background-repeat: no-repeat;  
cursor: pointer;  
padding-right: 59px;  
font-family: Arial;  
line-height: 20px;  
font-size: 18px;  
color: #717171;  
}  
  
**1.2. Single choice — up:**  
.ic_soption-up{  
background-image:url('/file/serve/262420');  
}  
  
**1.3. Single choice — down:**   
.ic_soption-down{  
background-image:url('/file/serve/263409');  
}  
  
**1.4. Single choice — up-correct:**  
.ic_soption-up-correct{  
background-image:url('/file/serve/260411');  
}  
  
**1.5. Single choice — down-correct:**  
.ic_soption-down-correct{  
background-image:url('/file/serve/258368');  
}  
  
**1.6. Single choice — down-wrong:**  
.ic_soption-up-wrong{  
background-image:url('/file/serve/260411');  
}  
  
**1.7. Single choice — down-wrong:**  
.ic_soption-down-wrong{  
background-image:url('/file/serve/258369');  
}  
  
**1.8. Single choice — up-wrong:**  
.ic_soption-up-hovering{  
background-image:url('/file/serve/262420');  
}  
  
**1.9. Single choice — down-hovering:**   
.ic_soption-down-hovering{  
background-image:url('/file/serve/263409');  
}  
  
**2.1. Multiple choice:**  
.ic_moption{  
background-position: right center;  
background-repeat: no-repeat;  
cursor: pointer;  
padding-right: 59px;  
font-family: Arial;  
line-height: 20px;  
font-size: 18px;  
color: #717171;  
}  
    
**2.2. Multiple choice — up:**  
.ic_moption-up{  
background-image:url('/file/serve/256387');  
}  
  
**2.3. Multiple choice — down:**  
.ic_moption-down{  
background-image:url('/file/serve/262418');  
}  
  
**2.4. Multiple choice — up-correc:**  
.ic_moption-up-correct{  
background-image:url('/file/serve/262419');  
}  
  
**2.5. Multiple choice — down-correc:**  
.ic_moption-down-correct{  
background-image:url('/file/serve/263405');  
}  
  
**2.6. Multiple choice — up-wrong:**  
.ic_moption-up-wrong{  
background-image:url('/file/serve/262419');  
}  
  
**2.7. Multiple choice — down-wrong:**  
.ic_moption-down-wrong{  
background-image:url('/file/serve/263408');  
}  
  
**2.8. Multiple choice — up-hovering:**  
.ic_moption-up-hovering{  
background-image:url('/file/serve/256387');  
}  
  
**2.9. Multiple choice — up-hovering:**  
.ic_moption-down-hovering{  
background-image:url('/file/serve/262418');  
}  

## Keyboard navigation
Tab – navigation between modules.    
Space – accept the choice option.

## Demo presentation
[Demo presentation](/embed/5161195309891584 "Demo presentation") contains examples of the addon's usage.                                                            