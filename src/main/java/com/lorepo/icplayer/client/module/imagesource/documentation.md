## Description
The Image Source module is a draggable image that should be placed in the corresponding Image Gap module. Each image and each gap constitute separate modules – Image Source and Image Gap respectively. In order to indicate the correct answer, it is required to put the ID of the appropriate Image Source module in the "Answer ID" section of the Image Gap module.

<div style="border:1px solid Tomato; padding:5px; margin-bottom:21px;">
Note: To correctly display .svg files in Internet Explorer browser, you have to add to &ltsvg&gt tag the following parameter: viewBox="0 0 WIDTH HEIGHT". 
<br>For example: &ltsvg width="800" height="400" viewBox="0 0 800 400" ...
<br>You can edit .svg files in any text editor.
</div>

## Properties

The list starts with the common properties, learn more about them by visiting the [Modules description](https://www.mauthor.com/doc/en/page/Modules-description) section. The other available properties are described below.

<table border='1'>
<tbody>
    <tr>
        <th>Property name</th>
        <th>Description</th> 
    </tr>
    <tr>
        <td>Image</td>
        <td>This property serves for inserting the image to be displayed in the module.
            <p><em>This property allows online resources. <a href="/doc/page/Online-resources">Find out more »</a></em></p>
        </td> 
    </tr>
    <tr>
        <td>Is Disabled</td>
        <td>
            Allows disabling the module so that the user is not able to interact with it.
        </td> 
    </tr>
    <tr>
        <td>Removable</td>
        <td>
            This property indicates whether the image is to be removed from its location after being inserted into the module.
        </td> 
    </tr>
    <tr>
        <td>Alternative text</td>
        <td>
            This text will be added to the module's HTML tag. It will be read by the Text To Speech module (if used) after the user performs a certain action.
        </td> 
    </tr>
    <tr>
        <td>Lang attribute</td>
        <td>
            This property allows defining the language for this module (different than the language of the lesson).
        </td> 
    </tr>
    <tr>
        <td>Speech texts</td>
        <td>
            Sets the values of speech texts - predefined phrases providing additional context while using the module in the Text To Speech mode. Speech texts are always read using the content's default language.
        </td> 
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
        <td>reset</td>
        <td>---</td>
        <td>Resets the module to its original state.</td> 
    </tr>
	<tr>
        <td>getImageUrl</td>
        <td>---</td>
        <td>Returns the image's URL.</td> 
    </tr>
	<tr>
        <td>disable</td>
        <td>---</td>
        <td>Disables the module.</td> 
    </tr>
	<tr>
        <td>enable</td>
        <td>---</td>
        <td>Enables the module.</td> 
    </tr>
	<tr>
        <td>hide</td>
        <td>---</td>
        <td>Hides the module if it is visible.</td> 
    </tr>
	<tr>
        <td>show</td>
        <td>---</td>
        <td>Shows the module if it is hidden.</td> 
    </tr>
</table>

##Events

The Image Source module sends ItemSelected type of events to the Event Bus when the user selects the image.

<table border='1'>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Type</td>
        <td>It's a string representation of the selected object type.</td>
    </tr>
    <tr>
        <td>Value</td>
        <td>
           The Value is the file path.
        </td>
    </tr>
    <tr>
        <td>Item</td>
        <td>
           It is the name of the selected image.
        </td>
    </tr>
</table>

The Image Source module sends ItemConsumed type of events to the Event Bus when the user uses the image.

<table border='1'>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Type</td>
        <td>It's a string representation of the consumed object type.</td>
    </tr>
    <tr>
        <td>Value</td>
        <td>
           The Value is the file path.
        </td>
    </tr>
    <tr>
        <td>Item</td>
        <td>
           It is the name of the consumed image.
        </td>
    </tr>
</table>

The Image Source module sends ItemReturned type of events to the Event Bus when the user returns the image.

<table border='1'>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Type</td>
        <td>It is a string representation of the returned object type.</td>
    </tr>
    <tr>
        <td>Value</td>
        <td>
           The Value is the file path.
        </td>
    </tr>
    <tr>
        <td>Item</td>
        <td>
           It is the name of the returned image.
        </td>
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
        <td>.ic_sourceImage</td>
        <td>Indicates the draggable source image.</td> 
    </tr>
    <tr>
        <td>.ic_sourceImage-selected</td>
        <td>Indicates the selected source image.</td> 
    </tr>
    <tr>
        <td>.ic_sourceImage-disabled</td>
        <td>Indicates the disabled source image.</td> 
    </tr>
</tbody>
</table>
    

### Examples

   **1.1. Source image**  
.ic_sourceImage{  
cursor: pointer;  
border: 2px solid #d2d2d2;  
background-position: center;  
box-shadow: 2px 2px 3px #406d93;  
}  

**1.2. Source image — selected**   
.ic_sourceImage-selected{  
cursor: pointer;  
border: 2px solid orange;  
background-position: center;  
}  

## Demo presentation
[Demo presentation](/embed/6628181474803712 "Demo presentation") contains examples of the addon's usage.                    