## Description

The Gradual Show Answers addon allows the user to switch on the Gradual Show Answers mode.

If the button is in default mode (Hide Answers Mode - off), 
then every button press will show next answer in modules on the current page.

If the button is in Hide Answers Mode, then every button press will hide all already displayed answers 
and reset displayed answer progress.

The Gradual Show Answer addon allows also to work with concrete components on the page.
It is possible to achieve by writing ID's of components in "Works with" attribute. 
Supported elements should be listed there, each on a new line.

## Properties

<table border="1">
  <tbody>
    <tr>
      <th>Property name</th>
      <th>Description</th>
    </tr>
    <tr>
        <td>Is visible</td>
        <td>When this option is selected, the addon is visible when the page is loaded</td>
    </tr>
    <tr>
        <td>Is disabled</td>
        <td>Defines if the addon is disabled, which means that user won't be able to interact with it</td>
    </tr>
    <tr>
        <td>Hide answers mode</td>
        <td>Defines if the addon is hides all showed answers and switches off Gradual Show Answers mode</td>
    </tr>
    <tr>
        <td>Works with</td>
        <td>Contains list of components ID's which are working with the concrete Gradual Show Answer button. 
        ID's should be written in column starting from new line.
    </td>
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

The Gradual Show Answers addon sends ValueChanged type events to Event Bus when a user press button.
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
            <td>Main wrapper for whole addon</td> 
        </tr>
        <tr>
            <td>.gradual-show-answers-container</td>
            <td>The container for the button</td> 
        </tr>
        <tr>
            <td>.gradual-show-answers-button</td>
            <td>Class of the button</td> 
        </tr>
        <tr>
            <td>.gradual-show-answers-active</td>
            <td>Additional class of the button, it will be added when Gradual Show Answers mode is switched on</td> 
        </tr>        
        <tr>
            <td>.gradual-hide-answers-button</td>
            <td>Additional class of the button, it will be added when the button is used for switching off the Gradual Show Answers mode</td> 
        </tr>
    </tbody>
</table>

## Examples

[Demo presentation](/embed/5253547551227904 "Demo presentation") contains examples of how to use the Gradual Show Answers addon.
