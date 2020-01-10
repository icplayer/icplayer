## Description

This addon allows users to create activities that include parts of two geometrical figures: a circle and a rectangle.

##Properties

<table border='1'>
<tbody>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
<tr>
        <td>Figure</td>
        <td>Here you can choose a geometrical figure you wish to use: a circle, square or a rectangle. Choosing a circle will make all properties related to a rectangle, square inactive and vice-versa.</td>
    </tr>
    <tr>
        <td>Rectangular horizontal parts</td>
        <td>Enables to choose horizontal parts of a rectangle. Active only when figure Rectangular is selected.</td>
    </tr>
    <tr>
        <td>Rectangular vertical parts</td>
        <td>Enables to choose vertical parts of a rectangle. Active only when figure Rectangular is selected.</td>
    </tr>
    <tr>
        <td>Circle parts</td>
        <td>Enables to choose the parts of a circle. Active only when figure Circle is selected.</td>
    </tr>
    <tr>
        <td>Square parts</td>
        <td>Enables to choose the parts of a square. Active only when figure Square is selected. Number of parts must be the power of two</td>
    </tr>
    <tr>
        <td>Number of correct parts</td>
        <td>Defines how many elements should be selected.</td>
    </tr>
    <tr>
        <td>Selected parts</td>
        <td>This property defines which elements should be selected at the beginning. The elements are numbered from 1 to a number of parts and can be comma separated (e.g. 1,2,3 means that the elements with numbers 1, 2 and 3 will be selected). It is also possible to use the interval notation:<br>*From-To-Step (From dash To dash Step) defines the element the selection will start and end with as well as its step (if you write From-To, the Step will be 1 by default).
</td>
    </tr>
    <tr>
        <td>Selection color</td>
        <td>Defines the color of the selected parts.</td>
    </tr>
<tr>
        <td>Empty color</td>
        <td>Defines the color of the unselected parts.</td>
    </tr>
<tr>
        <td>Stroke color</td>
        <td>Defines the color of a stroke.</td>
    </tr>
<tr>
        <td>Stroke width</td>
        <td>Defines the width of a stroke.</td>
    </tr>
<tr>
        <td>isNotActivity</td>
        <td>Enables to define whether the Fractions addon is an activity or not. </td>
    </tr>
<tr>
        <td>isDisable</td>
        <td>Disables the addon.</td>
    </tr>
<tr>
        <td>Image for selected parts</td>
        <td>An image displayed when a part is selected.
<p><em>This property allows online resources. <a href="/doc/page/Online-resources">Find out more »</a></em></p></td>
    </tr>
<tr>
        <td>Image for deselected parts</td>
        <td>An image displayed when a part is deselected.
<p><em>This property allows online resources. <a href="/doc/page/Online-resources">Find out more »</a></em></p></td>
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
        <td>setSelectionColor</td>
        <td>color</td>
        <td>Changes the selection color.</td>
    </tr>
<tr>
        <td>getCurrentNumber</td>
        <td>---</td>
        <td>Returns the current number of the selected parts.</td>
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
<tr>
        <td>enable</td>
        <td>---</td>
        <td>Changes state to "enabled".</td>
    </tr>
    <tr>
        <td>disable</td>
        <td>---</td>
        <td>Changes state to "disabled."</td>
    </tr>
<tr>
        <td>isAllOK</td>
        <td>---</td>
        <td>Returns true if all answers are correct.</td>
    </tr>
</tbody>
</table>

## Events
The Fractions addon sends events to Event Bus when a user selects/deselects its element.

<table border='1'>
<tbody>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <tr>
            <td>Item</td>
            <td>The number of the part</td>
        </tr>
        <tr>
            <td>Value</td>
            <td>1 for selection, 0 for deselection</td>
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
        <td>.FractionsWrapper</td>
        <td>Main class containing the entire Addon's content.</td>
    </tr>
    <tr>
        <td>.FractionsWrapper.disable</td>
        <td>Added when the module is disabled.</td>
    </tr>
    <tr>
        <td>.FractionsWrapper.incorrect</td>
        <td>Added when the module is incorrect in the show errors mode.</td>
    </tr>
    <tr>
        <td>.FractionsWrapper.correct</td>
        <td>Added when the module is correct in the show errors mode.</td>
    </tr>
</table>

## Styles from the sample presentation

    .Fractions_test{    
    }    

    .Fractions_test .FractionsWrapper{    
	   padding: 10px;     
  	   border: 3px solid #bbbbbb;    
  	   background: #ffffff;    
    }    

    Fractions_test .FractionsWrapper.disable{        
 	   opacity: 0.5;    
    }    

    .Fractions_test .FractionsWrapper.incorrect{    
 	   border: 3px solid  #ff4901;    
    }

    .Fractions_test .FractionsWrapper.correct{    
 	   border: 3px solid  #06d401;    
    }

    .Fractions_test2{    
  	   padding: 10px;     
 	   background: #ffffff;    
    }    

    .Fractions_test2 .FractionsWrapper.disable{        
 	   opacity: 0.5;    
    }     

    .Fractions_test2 .FractionsWrapper.incorrect{    
 	   outline: 3px solid  #ff4901;    
    }

    .Fractions_test2 .FractionsWrapper.correct{
 	   outline: 3px solid  #06d401;
    }    

##Demo presentation
[Demo presentation](/embed/6417239809982464 "Demo presentation") contains examples of how to use the Fractions addon.              