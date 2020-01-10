## Description
Opens a corresponding popup window.

## Properties

<table border='1'>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Title</td>
        <td>A title displayed inside the addon.</td>
    </tr>
    <tr>
        <td>Page Title</td>
        <td>A title of a corresponding page to be opened.</td>
    </tr>
    <tr>
        <td>Additional classes</td>
        <td>This option allows user to add additional classes.</td>
    </tr>
    <tr>
        <td>Popup top position</td>
        <td>This option allows user to set top position.</td>
    </tr>
    <tr>
        <td>Popup left position</td>
        <td>This option allows user to set left position.</td>
    </tr>
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
        <td>hide</td>
        <td>---</td>
        <td>Hides the module.</td>
    </tr>
    <tr>
        <td>show</td>
        <td>---</td>
        <td>Shows the module.</td>
    </tr>
</tbody>
</table>

## Events
The module sends events to Event Bus when a user clicks on it.

<table border='1'>
<tbody>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <tr>
            <td>Value</td>
            <td>clicked</td>
        </tr>
    </tr>
</tbody>
</table>

## CSS classes

<table border="1">
  <tbody>
    <tr>
      <th style="width: 300px;">Class
name</th>
      <th style="width: 843px;">Description</th>
    </tr>
    <tr>
      <td style="width: 300px;">.ic_button_popup</td>
      <td style="width: 843px;">indicates the look of the Popup button</td>
    </tr>
    <tr>
      <td style="width: 300px;">.ic_button_popup-up-hovering</td>
      <td style="width: 843px;">indicates the look of the Popup button on mouse hover</td>
    </tr>
    <tr>
      <td style="width: 300px;">.ic_button_popup-down-hovering</td>
      <td style="width: 843px;">indicates the look of the Popup button on mouse click</td>
    </tr>
  </tbody>
</table>

### Examples

**1.1. Popup:**  
.ic_button_popup{  
background-image: url('/file/serve/117040');  
background-repeat: no-repeat;  
background-position: center;  
} 

**1.2. Popup — up-hovering:**  
.ic_button_popup-up-hovering{  
background-image: url('/file/serve/117041');  
}

**1.3. Popup — down-hovering:**  
.ic_button_popup-down-hovering{  
background-image: url('/file/serve/123001');  
}       