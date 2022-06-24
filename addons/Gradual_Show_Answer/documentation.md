## Description

The Gradual Show Answers addon allows the user to switch on the Gradual Show Answers mode.

If the button is in default mode (Hide Answers Mode – off), selecting the button will show all answers on a page one by one.

If the button is in Hide Answers Mode, selecting the button will hide all the already displayed answers one by one and reset their progress.

The Gradual Show Answers addon also allows working with specific components on a page.
This can be achieved by writing components' IDs in "Works with" attribute. 
Supported elements should be listed there, each in a new line.

## Properties

<table border="1">
  <tbody>
    <tr>
      <th>Property name</th>
      <th>Description</th>
    </tr>
    <tr>
        <td>Is disabled</td>
        <td>Defines if the addon is disabled, which means that the user won't be able to interact with it.</td>
    </tr>
    <tr>
        <td>Hide answers mode</td>
        <td>Defines if the addon hides all displayed answers and switches off the Gradual Show Answers mode.</td>
    </tr>
    <tr>
        <td>Works with</td>
        <td>Contains the list of components' ID's which are working with the specific Gradual Show Answer button. 
        ID's should be written in a column, each placed in a new line.</td>
    </tr>
    <tr>
        <td>Speech texts</td>
        <td>List of speech texts: 
            One answer has been shown, 
            All answers are hidden, 
            No new answer to show, 
            Page edition is blocked,
            Page edition is not blocked,
            Disabled. <br /> 
        This texts will be read by Text to Speech addon after a user performs an action.</td> 
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
            <td>show</td>
            <td>-</td>
            <td>Shows the addon.</td>
        </tr>
        <tr>
            <td>hide</td>
            <td>-</td>
            <td>Hides the addon.</td>
        </tr>    
        <tr>
            <td>disable</td>
            <td>-</td>
            <td>Disables the addon.</td>
        </tr>    
        <tr>
            <td>enable</td>
            <td>-</td>
            <td>Enables the addon.</td>
        </tr>
    </tbody>
</table>

##Events

The Gradual Show Answers addon sends ValueChanged type events to Event Bus when the user selects the button.
Depending on Gradual Show Answers mode:

#### Show answer mode
<table border='1'>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>source</td>
        <td>ID of Gradual Show Answers button</td>
    </tr>
    <tr>
        <td>Value</td>
        <td>ShowNextAnswer</td>
    </tr>
</table>

#### Hide answers mode
<table border='1'>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>source</td>
        <td>ID of Gradual Show Answers button</td>
    </tr>
    <tr>
        <td>Value</td>
        <td>HideAllAnswers</td>
    </tr>
</table>

## CSS classes

<table border='1'>
    <tbody>
        <tr>
            <th>Class name</th>
            <th>Description</th> 
        </tr>
        <tr>
            <td>.gradual-show-answers-wrapper</td>
            <td>Main wrapper for the whole addon.</td> 
        </tr>
        <tr>
            <td>.gradual-show-answers-container</td>
            <td>The container for the button.</td> 
        </tr>
        <tr>
            <td>.gradual-show-answers-button</td>
            <td>Class of the button.</td> 
        </tr>
        <tr>
            <td>.gradual-show-answers-active</td>
            <td>Additional class of the button, it will be added when Gradual Show Answers mode is switched on.</td> 
        </tr>        
        <tr>
            <td>.gradual-hide-answers-button</td>
            <td>Additional class of the button, it will be added when the button is used for switching off the Gradual Show Answers mode.</td> 
        </tr>
    </tbody>
</table>

## Examples

[Demo presentation](/embed/5253547551227904 "Demo presentation") contains examples of how to use the Gradual Show Answers addon.

