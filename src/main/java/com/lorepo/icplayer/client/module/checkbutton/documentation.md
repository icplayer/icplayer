## Description

**"Check"** and **"Reset"** buttons help users perform different actions in the presentation, such as checking answers whether they are correct or wrong or resetting all answers marked in an activity. It is possible to change their look & feel depending on the action we are about to perform. 

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


## CSS classes

<table border="1">
  <tbody>
    <tr>
      <th style="width: 268px;">Class
name</th>
      <th style="width: 875px;">Description</th>
    </tr>
    <tr>
      <td style="width: 268px;">.ic_button_check</td>
      <td style="width: 875px;">indicates
the look of the Check answers button</td>
    </tr>
    <tr>
      <td style="width: 268px;">.ic_button_check-up-hovering</td>
      <td style="width: 875px;">indicates
the look of the Check answers button while putting a mouse cursor on it</td>
    </tr>
    <tr>
      <td style="width: 268px;">.ic_button_check-down-hovering</td>
      <td style="width: 875px;">indicates
the look of the Check answers button while clicking on it</td>
    </tr>
    <tr>
      <td style="width: 268px;">.ic_button_uncheck</td>
      <td style="width: 875px;">indicates
the look of the Uncheck button. This module enables to check the
answers given by a user. It is displayed after clicking on the Check
module. If a user wishes to change his answers, he should re-click the
Uncheck button or use the Reset option.
      </td>
    </tr>
    <tr>
      <td style="width: 268px;">.iic_button_reset</td>
      <td style="width: 875px;">indicates
the look of the Reset button</td>
    </tr>
    <tr>
      <td style="width: 268px;">.ic_button_reset-up-hovering</td>
      <td style="width: 875px;">indicates
the look of the Reset button while putting a mouse cursor on it </td>
    </tr>
  </tbody>
</table>

    

### Examples

**1.1. Check:**  
.ic_button_check{  
background-image:url('/file/serve/119038');  
}  

**1.2. Check — up-hovering:**  
.ic_button_check-up-hovering{  
background-image:url('/file/serve/116043');  
}  

**1.3. Check — down-hovering:**  
.ic_button_check-down-hovering{  
background-image:url('/file/serve/119039');  
}  

**1.4. Uncheck:**  
.ic_button_uncheck{  
background-image: url('/file/serve/116044');  
}  

**2.1. Reset:**  
.ic_button_reset{  
background-image:url('/file/serve/122026');    
}   

**2.2. Reset — up-hovering:**  
.ic_button_reset-up-hovering{  
background-image:url('/file/serve/121036');  
}  

**2.3. Reset — down-hovering:**  
.ic_button_reset-down-hovering{  
background-image:url('/file/serve/118058');   
}                    
        
### Custom CSS Class names

Example of a custom CSS class:   
.CheckButton_blue{   
background-color: blue;   
}  