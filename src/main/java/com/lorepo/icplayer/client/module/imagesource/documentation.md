## Description
An Image source module is a draggable image that should be placed in the corresponding Image gap module. Each image and each gap constitute separate modules – Image source and Image gap respectively. In order to insert a correct answer, it is required to put the image source module ID in the Answer ID section.

<div style="border:1px solid Tomato; padding:5px; margin-bottom:21px;">
Note: To display .svg files in Internet Explorer browsers correctly, you have to add to &ltsvg&gt tag the following parameter: viewBox="0 0 WIDTH HEIGHT". 
<br>For example: &ltsvg width="800" height="400" viewBox="0 0 800 400" ...
<br>You can edit .svg files in any text editor.
</div>
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
        <td>Image</td>
        <td>This property serves for inserting images to be displayed in the module.
<p><em>This property allows online resources. <a href="/doc/page/Online-resources">Find out more »</a></em></p>
</td> 
    </tr>
    <tr>
        <td>Is Disabled</td>
        <td>
           This property allows you to disable the module so that the element cannot be selected and dragged & dropped.
        </td> 
    </tr>
    <tr>
        <td>Removable</td>
        <td>
           This property indicates whether the images are to be removed from a source list after being inserted into the module.
        </td> 
    </tr>
    <tr>
        <td>Alternative text</td>
        <td>
           This property enables to define a text description that will be added to an image's HTML tag
        </td> 
    </tr>
    <tr>
        <td>Lang attribute</td>
        <td>
           This property allows to define the language for this addon (different than the language of the lesson).
        </td> 
    </tr>
    <tr>
        <td>Speech texts</td>
        <td>
          List of speech texts: Selected, Deselected. <br />
This texts will be read by Text to Speech addon after a user performs an action.
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
        <td>Reset module to its original state</td> 
    </tr>
	<tr>
        <td>getImageUrl</td>
        <td>---</td>
        <td>Returns image URL</td> 
    </tr>
	<tr>
        <td>disable</td>
        <td>---</td>
        <td>Disables module</td> 
    </tr>
	<tr>
        <td>enable</td>
        <td>---</td>
        <td>Enables module</td> 
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

##Events

The Image Source addon sends ItemSelected type of events to Event Bus when a user selects an image.

<table border='1'>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Type</td>
        <td>It's a string representation of a selected object type.</td>
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
           It's a name of a selected image.
        </td>
    </tr>
</table>

The Image Source addon sends ItemConsumed type of events to Event Bus when a user consumes the image.

<table border='1'>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Type</td>
        <td>It's a string representation of a consumed object type.</td>
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
           It's a name of a consumed image.
        </td>
    </tr>
</table>

The Image Source addon sends ItemReturned type of events to Event Bus when a user returns the image.

<table border='1'>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Type</td>
        <td>It's a string representation of a returned object type</td>
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
           It's a name of a returned image.
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
        <td>Indicates a draggable source image.</td> 
    </tr>
    <tr>
        <td>.ic_sourceImage-selected</td>
        <td>Indicates a selected source image.</td> 
    </tr>
    <tr>
        <td>.ic_sourceImage-disabled</td>
        <td>Indicates a disabled source image.</td> 
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