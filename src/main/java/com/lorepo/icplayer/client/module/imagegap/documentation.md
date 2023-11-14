## Description
An Image gap module is an empty box which should be filled in with a relevant item (image) from an Image source module. Each gap and each image are separate modules – Image gap and Image source respectively. In order to indicate a correct answer, it is required to put the image source module ID in the Answer ID section.

## Properties

<table border='1'>
<tbody>
    <tr>
        <th>Property name</th>
        <th>Description</th> 
    </tr>
<tr>
        <td>Is visible</td>
        <td>This property allows to hide or show the module depending on the activity requirements.</td> 
    </tr>
    <tr>
        <td>Answer ID</td>
        <td>This property serves for inserting the ID of the corresponding answer in the Image source module</td> 
    </tr>
<tr>
        <td>Is activity</td>
        <td>This property allows to define whether an image gap module is an activity or not. When it is not defined as an activity, the answers given are not taken into account in the overall result. It is helpful for e.g. simulations.</td> 
    </tr>
    <tr>
        <td>onCorrect</td>
        <td>This property indicates the events sent when a gap's state is changed to correct.</td> 
    </tr>
    <tr>
        <td>onWrong</td>
        <td>This property indicates the events sent when a gap's state is changed to wrong.</td> 
    </tr>
    <tr>
        <td>onEmpty</td>
        <td>This property indicates the events sent when a gap's state is changed to empty.</td> 
    </tr>
    <tr>
        <td>Is Disabled</td>
        <td>This property allows you to disable the module so that the element cannot be selected and dragged & dropped.</td> 
    </tr>
    <tr>
        <td>Block wrong answers</td>
        <td>With this option checked, wrong answers are removed and the "on wrong" event is sent.</td>
    </tr>
    <tr>
        <td>Add container for response mark</td>
        <td>Attach new HTML element for response mark, when check answers is active. The element overlays image gap.</td>
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
        <td>markGapAsCorrect</td>
        <td>index – 1-based gap index in text</td> 
        <td>Marks gap as correct.</td> 
    </tr>
    <tr>
        <td>markGapAsWrong</td>
        <td>index – 1-based gap index in text</td> 
        <td>Marks gap as wrong.</td> 
    </tr>
    <tr>
        <td>markGapAsEmpty</td>
        <td>index – 1-based gap index in text</td> 
        <td>Marks gap as empty.</td> 
    </tr>
    <tr>
        <td>isAttempted</td>
        <td>–</td> 
        <td>Returns True if a gap is filled in.</td> 
    </tr>
    <tr>
        <td>disable</td>
        <td>–</td> 
        <td>Disables the module.</td> 
    </tr>
    <tr>
        <td>enable</td>
        <td>–</td> 
        <td>Enables the module.</td> 
    </tr>
    <tr>
        <td>getImageId</td>
        <td>–</td> 
        <td>Returns the image ID in a gap.</td> 
    </tr>
    <tr>
        <td>isAllOK</td>
        <td>–</td> 
        <td>Returns true if an image in a gap is correct.</td> 
    </tr>
</tbody>
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
        <td>.ic_imageGap</td>
        <td>indicates the look of the items included in the source list</td> 
    </tr>
    <tr>
        <td>.ic_imageGap-filled</td>
        <td>indicates the look of an image gap with an image source placed in it</td> 
    </tr>
<tr>
        <td>.ic_imageGap-correct</td>
        <td>indicates the look of an image gap with a correct answer</td> 
    </tr>
    <tr>
        <td>.ic_gapImage-wrong</td>
        <td>indicates the look of an image gap with a wrong answer</td> 
    </tr>
    <tr>
        <td>.ic_gapImageFilled-disabled</td>
        <td>indicates the look of a disabled image gap</td> 
    </tr>
    <tr>
        <td>.ic_gapImageFilled-empty</td>
        <td>indicates the look of an image gap with an empty answer</td> 
    </tr>
    <tr>
        <td>.ic_imageGap-correct-answer</td>
        <td>indicates the look of an image gap with the correct answer displayed</td>
    </tr>
    <tr>
        <td>.ic_imageGap-mark-container</td>
        <td>indicates the look of a response mark container</td>
    </tr>
    <tr>
        <td>.correct-container</td>
        <td>indicates the look of a response mark container on correct answer</td>
    </tr>
    <tr>
        <td>.wrong-container</td>
        <td>indicates the look of a response mark container on wrong answer</td>
    </tr>
    <tr>
        <td>.disabled-container</td>
        <td>indicates the look of a disabled response mark container</td>
    </tr>
</tbody>
</table>
    
    
### Examples

  **2.1. Image gap**   
.ic_imageGap{  
cursor: pointer;  
border: 2px solid #d5dddf;  
background-color: #fdfbf2  
}  

**2.2. Image gap filled**  
.ic_imageGap-filled{  
cursor: pointer;  
border: 2px solid #d5dddf;  
background-color: #fdfbf2;  
box-shadow: 2px 2px 3px #406d93;  
}

**2.3. Image gap filled — correct**  
.ic_imageGap-correct{   
border: 2px solid green;  
}  

**2.4. Image gap filled — wrong**  
.ic_imageGap-wrong{  
border: 2px solid red;  
}  
 
## Demo presentation
[Demo presentation](/embed/6628181474803712 "Demo presentation") contains examples of the addon's usage.                       