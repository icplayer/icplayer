## Description
The button closes a corresponding popup window.

## Properties

<table border='1'>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Title</td>
        <td>Title displayed inside the module.</td>
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
      <td style="width: 300px;">.ic_button_cancel</td>
      <td style="width: 843px;">indicates the look of the Close Popup button</td>
    </tr>
    <tr>
      <td style="width: 300px;">.ic_button_cancel-up-hovering</td>
      <td style="width: 843px;">indicates the look of the Close Popup button on mouse hover</td>
    </tr>
    <tr>
      <td style="width: 300px;">.ic_button_cancel-down-hovering</td>
      <td style="width: 843px;">indicates the look of the Close Popup button on mouse click</td>
    </tr>
  </tbody>
</table>

### Examples

**1.1. Close Popup:**  
.ic_button_cancel{  
background-image: url('/file/serve/117040');  
background-repeat: no-repeat;  
background-position: center;  
} 

**1.2. Close Popup — up-hovering:**  
.ic_button_cancel-up-hovering{  
background-image: url('/file/serve/117041');  
}

**1.3. Close Popup — down-hovering:**  
.ic_button_cancel-down-hovering{  
background-image: url('/file/serve/123001');  
}
     