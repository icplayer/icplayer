## Description

This addon allows users to create activities related to clock and time.

##Properties

<table border='1'>
<tbody>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>TimeStandard</td>
        <td>Enables to choose the time display (12H or 24H).</td>
    </tr>
    <tr>
        <td>InitialTime</td>
        <td>Enables to set the initial time for the addon. The time should be entered in a 00:00 or 0:00 format.
        If Show Second Hand is active this property requires format 00:00:00.</td>
    </tr>
    <tr>
        <td>Step (minutes)</td>
        <td>Enables to choose the big hand minute step. For example, if you define the step as 5, the big hand will be moved every 5 minutes.</td>
    </tr>
    <tr>
        <td>ShowClockLabels</td>
        <td>Enables to show the clock labels.</td>
    </tr>
    <tr>
        <td>ShowSecondHand</td>
        <td>Enables third hand for seconds.</td>
    </tr>
    <tr>
        <td>Step (seconds)</td>
        <td>Analogous to Step-minutes but defined for seconds.</td>
    </tr>
    <tr>
        <td>ActiveHand</td>
        <td>This property allows choosing the active clock hand.
</td>
    </tr>
    <tr>
        <td>SynchronizeHands</td>
        <td>This property enables to choose how the hands should be synchronized.</td>
    </tr>
<tr>
        <td>Images</td>
        <td>Enables to set an image as a background.<br> Please note that this property does not support the SVG format.
<p><em>This property allows online resources. <a href="/doc/page/Online-resources">Find out more »</a></em></p>
</td>
    </tr>
<tr>
        <td>CorrectAnswer</td>
        <td>Defines the correct answer (required when “isActivity” is checked). The time should be entered in a 00:00 or 0:00 format.</td>
    </tr>
<tr>
        <td>isDisable</td>
        <td>Defines whether the clock addon is disabled.</td>
    </tr>
<tr>
        <td>isActivity</td>
        <td>Enables to define whether the Clock addon is an activity or not.</td>
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
        <td>setClockTime</td>
        <td>time<br>(h : min)</td>
        <td>Sets the clock's time.</td>
    </tr>
<tr>
        <td>getCurrentTime</td>
        <td>---</td>
        <td>Returns current time (hours : minutes).</td>
    </tr>
<tr>
        <td>getCurrentHour</td>
        <td>---</td>
        <td>Returns current hour.</td>
    </tr>
<tr>
        <td>getCurrentMinute</td>
        <td>---</td>
        <td>Returns current minute.</td>
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
        <td>Removes all addon marks.</td>
</tr>
</tbody>
</table>

## Events
The Clock addon sends events to Event Bus when a user selects/deselects its element.

<table border='1'>
<tbody>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <tr>
            <td>Item</td>
            <td>Always 1</td>
        </tr>
        <tr>
            <td>Value</td>
            <td>Current time</td>
        </tr>
        <tr>
            <td>Score</td>
            <td>1 when the addon has a correct answer, 0 for other answers</td>
        </tr>
    </tr>
</tbody>
</table>

## CSS classes

<table border='1'>
    <tr>
        <th>Class name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>.analog-clock</td>
        <td>Main class containing the entire Addon's content.</td>
    </tr>
    <tr>
        <td>.analog-clock.disable</td>
        <td>Added when the module is disabled.</td>
    </tr>
    <tr>
        <td>.analog-clock.incorrect</td>
        <td>Added when the module is incorrect in the show errors mode.</td>
    </tr>
    <tr>
        <td>.analog-clock.correct</td>
        <td>Added when the module is correct in the show errors mode.</td>
    </tr>
</table>

## Styles from a sample presentation

To imrove the user experience while working with the Clock addon on mobile devices, there is the possibility of enlarging the active/clickable area of the clock hands without visually increasing their size. It can be achieved by adding the "stroke-width" class and setting the "stroke-opacity" to zero. Please note that if the "stroke-width" value is too big, it may cause the clock hands to cover each other up. By default, the "stroke-width" is set to 50px.

    .Clock_test{    
      }    

    .Clock_test .analog-clock{    
         padding: 10px;    
         border: 3px solid #bbbbbb;    
         background: #ffffff;        
      }

    .Clock_test .analog-clock #m-hand{
         stroke-width:50px;
         stroke-opacity:0;
      }

    .Clock_test2 .analog-clock #h-hand{
         stroke-width:50px;
         stroke-opacity:0;
      }
    
    .Clock_test .analog-clock.disable{    
         opacity: 0.5;        
      }    

    .Clock_test .analog-clock.incorrect{    
         border: 3px solid  #ff4901;    
      }    

    .Clock_test .analog-clock.correct{    
         border: 3px solid  #06d401;    
      }    


## Demo presentation
[Demo presentation](/embed/5030952561541120 "Demo presentation") contains examples of how this addon can be used.  

                                                      