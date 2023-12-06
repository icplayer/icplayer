## Description
The Ordering module enables to insert a ready-made activity template with  different, pre-defined items which can be determined either by texts or by images. All the elements are automatically disarranged and are to be put in the correct order.  Each time the page is re-entered or the activity is reset, a new random order is generated. It is possible to place the items either vertically or horizontally, depending on the activity type. 

The module allows to indicate multiple items, their content and of course the correct order. The correct answers are not counted individually, the Ordering activity is to be solved right or wrong as a whole. However, it is possible to define more than one correct order.

The Ordering module also allows inserting simple audio controls. They add the possibility of playing and stopping a sound. Though there may be more than one audio in the text module, only one sound can be played simultaneously.
To add an audio control, use "Insert Audio" button on the toolbar of the text editor.
Adding the audio control is also possible using \audio{URL} syntax, where URL is the URL of the audio resource.

## Properties

The list starts with the common properties, learn more about them by visiting the [Modules description](https://www.mauthor.com/doc/en/page/Modules-description) section. The other available properties are described below.

<table border='1'>
<tbody>
    <tr>
        <th>Property name</th>
        <th>Description</th> 
    </tr>
    <tr>
        <td>Is vertical</td>
        <td>This property indicates whether the Ordering module is in a vertical or horizontal position.
        </td> 
    </tr>
    <tr>
        <td>Ordering item</td>
        <td>This property indicates the number of items in the Ordering activity and allows to insert texts describing these elements and to define optional position, on which item should always be placed during randomizing order. Starting position value should be integer higer than 0 and lower or equal to items count.
        </td> 
     </tr>
    <tr>
        <td>Alternative Correct Order</td>
        <td>This property allows you to insert an alternative order of the items, e.g. if the correct order is item 3, item 2, item 1, then it should be entered like this: 3,2,1. Of course the default order doesn't have to be typed in and it is always active. Numbers cannot be larger than the amount of items.
        </td> 
    </tr>
    <tr>
        <td>Is activity</td>
        <td>This property allows to define whether this module is an activity or not. When it is not defined as an activity, the answers given are not taken into account in the overall result. It is helpful for e.g. simulations.</td> 
    </tr>
    <tr>
        <td>Even width for all elements</td>
        <td>If this property is selected all option will have the same width.</td> 
    </tr>
    <tr>
        <td>Graduate Score</td>
        <td>This property allows defining the score calculation. If the property is checked, max score equals to the number of items items, and score equals to the correct answer divided by max score.</td> 
    </tr>
    <tr>
        <td>Don't generate correct order</td>
        <td>If this property is selected the generated order will not be correct.</td> 
    </tr>
    <tr>
        <td>Show all answers in gradual show answers mode</td>
        <td>If this property is selected the gradual show answer button will correct entire ordering addon.</td> 
    </tr>
    <tr>
        <td>Lang attribute</td>
        <td>This property allows to define the language for this addon (different than the language of the lesson).</td> 
    </tr>
    <tr>
        <td>Speech texts</td>
        <td>List of speech texts: Selected, Deselected, Replaced with, Correct, Wrong. <br />
This texts will be read by Text to Speech addon after a user performs an action.</td> 
    </tr>
    <tr>
        <td>Disable axis lock</td>
        <td>When selected, it allows the items to be dragged also vertically.</td> 
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
        <td>isAllOK</td>
        <td>---</td>
        <td>Returns true if all items are in correct order, otherwise false.</td>
    </tr>
    <tr>
        <td>isAttempted</td>
        <td>---</td>
        <td>returns true if user tries to solve module. This command is not available if module has 'Is Activity' property deselected.</td> 
    </tr>
    <tr>
        <td>show</td>
        <td>---</td>
        <td>shows module</td> 
    </tr>
    <tr>
        <td>hide</td>
        <td>---</td>
        <td>hides module</td> 
    </tr>
    <tr>
        <td>reset</td>
        <td>---</td>
        <td>resets module</td> 
    </tr>
</tbody>
</table>

##Events

Ordering sends ValueChanged type events to Event Bus when a user changes the position of any element.

<table border='1'>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Item</td>
        <td>Element (index) position before movement</td>
    </tr>
    <tr>
        <td>Value</td>
        <td>Element (index) position after movement</td>
    </tr>
    <tr>
        <td>Score</td>
        <td>Module score after movement</td>
    </tr>
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
        <td>.ic_ordering </td>
        <td>indicates the external look not related to the ordering draggable items, e.g. the background behind                       
               the items. In case of a standard styling, this CSS class will not have any style. If the class does not   
               have a complete definition, it should be entered as empty.</td> 
    </tr>
    <tr>
        <td>.ice_even_width</td>
        <td>CSS class added to the same element that has the .ic_ordering CSS class when using the presentation's editor and when the property "Even width for all elements" is checked. This class allows to freely change the width and height of the module.</td> 
    </tr>
    <tr>
        <td>.ic_ordering-item </td>
        <td>indicates the look of a stationary items</td> 
    </tr>
    <tr>
        <td>.ic_ordering-item-correct</td>
        <td>indicates the look of an item marked as correct</td> 
    </tr>
    <tr>
        <td>.ic_ordering-item-wrong</td>
        <td>indicates the look of an item marked as wrong</td> 
    </tr>
    <tr>
        <td>.ic_drag-source</td>
        <td>indicates the look of a single item ready to be dragged to the proper place</td> 
    </tr>
    <tr>
        <td>.correct-answer</td>
        <td>indicates the look of an item in show answers mode</td> 
    </tr>
</tbody>
</table>

    
### Examples

   **1.1. Ordering**   
.ic_ordering{   
}   
  
**1.2. Ordering item**   
.ic_ordering-item{  
margin: 5px;  
padding: 4px;  
border: 2px solid #66cc33;   
border-radius: 3px;  
background-color: #66cc33;  
font-size: 16px;  
color: #ffffff;  
font-family: Verdana;  
height: 18px;  
line-height: 18px;  
text-align: center;  
}  
  
**1.3. Ordering item — drag source**       
.ic_drag-source{  
background-color: #38c8d3;  
border: 2px solid #38c8d3;  
}  
    
**1.4. Ordering item — correct**        
.ic_ordering-item-correct{ 
border: 2px solid green; 
}   
   
**1.5. Ordering item — wrong**     
.ic_ordering-item-wrong{  
border: 2px solid red;  
}  

## Demo presentation
[Demo presentation](/embed/5414091897176064 "Demo presentation") contains examples of the addon's usage.                                         