## Description
The Page progress module enables to insert a ready-made Page progress bar indicating the percentage of correct answers given on a current page. It is possible to modify the appearance of each part of the Page progress module individually — its frame, text and progress bar.


## Properties

<table border='1'>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>

    <tr>
        <td>Works with</td>
        <td>List of Limited Check modules connected with Page progress. Each line should consist of separate modules ID</td>
    </tr>
    <tr>
        <td>Lang attribute</td>
        <td>This property allows to define the language for this addon (different than the language of the lesson).</td> 
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
        <td>show</td>
        <td>–</td> 
        <td>Shows the addon</td> 
    </tr>
    <tr>
        <td>hide</td>
        <td>–</td> 
        <td>Hides the addon</td> 
    </tr>
    </tr>
</tbody>
</table>

## CSS classes

<table border="1">
  <tbody>
    <tr>
      <th style="width: 193px;">Class
name</th>
      <th
 style="width: 828px;">Description</th>
    </tr>
    <tr>
      <td style="width: 193px;">.ic_pageprogress</td>
      <td style="width: 828px;">indicates
the module's look excluding the parameter defining the look of the
internal bar, which increases proportionally to the user's progress</td>
    </tr>
    <tr>
      <td style="width: 193px;">.ic_progress-shell</td>
      <td style="width: 828px;">indicates
the progress of solving the tasks correctly on a current page</td>
    </tr>
    <tr>
      <td style="width: 193px;">.ic_pageprogress-bar</td>
      <td style="width: 828px;">indicates
the look of the internal bar, which increases proportionally to the
user's progress</td>
    </tr>
    <tr>
      <td style="width: 193px;">.ic_pageprogress-text</td>
      <td style="width: 828px;">indicates
the look of the Page progress text</td>
    </tr>
  </tbody>
</table>


### Examples

**1.1. Page Progress**  
.ic_pageprogress{  
background-color: #0070b0;  
border-radius: 4px;  
border: 1px solid #ffffff;  
box-shadow: 1px 2px 2px  #406d93;  
padding: 3px;  
}    
   
**1.2 Page Progress — progress-text**   
.ic_pageprogress .ic_progress-text{  
color: #ffffff;  
font-size: 18px;  
font-family: Verdana;  
text-shadow: 1px 2px 2px  #043651;  
}   
   
**1.3.Page Progress — progress-bar**   
.ic_pageprogress .ic_progress-bar{  
background-color: #3cc5cc;  
border-radius: 4px;  
}        
           