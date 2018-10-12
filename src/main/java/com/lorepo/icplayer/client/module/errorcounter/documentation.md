## Description
Error counter module displays the number of mistakes made on a current page of a presentation. 

##Properties

<table border='1'>
<tbody>
    <tr>
        <th>Property name</th>
        <th>Description</th> 
    </tr>
    <tr>
        <td>Show errors</td>
        <td>Checking this property enables to display all errors made on a current page</td> 
    </tr>
<tr>
        <td>Show mistakes</td>
        <td>Checking this property enables to display current mistakes made. It's a sum of all errors made on a current page.</td> 
    </tr>
    <tr>
        <td>Calculate in real time</td>
        <td>Checking this property sets the module in a mode in which errors and mistakes are calculated after any change in the activity module on a page. Be aware that mistakes are the cumulated value so their count can be very high in this mode.</td> 
    </tr>
    <tr>
        <td>Lang attribute</td>
        <td>This property allows to define the language for this addon (different than the language of the lesson).</td> 
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
        <td>show</td>
        <td>---</td>
        <td>Shows module</td> 
    </tr>
    <tr>
        <td>hide</td>
        <td>---</td>
        <td>Hides module</td> 
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
        <td>.ic_errorcounter</td>
        <td>indicates the look of the error counter module</td> 
    </tr>
</tbody>
</table>
    

### Examples

   .ic_errorcounter{  
line-height: 30px;  
font-family: Arial;  
font-size: 17px;  
color: red;  
text-align: center;  
border-radius: 5px;  
border:2px solid #02789f;  
}      

## Demo presentation
[Demo presentation](/embed/6361269650063360"Demo presentation") contains examples of how to use this module.                  