## Description
The Image module enables to insert an image into a presentation. It is possible to determine the look of the Image module's frame.

<div style="border:1px solid Tomato; padding:5px; margin-bottom:21px;">
Note: To display .svg files in Internet Explorer browsers correctly, you have to add to &ltsvg&gt tag the following parameter: viewBox="0 0 WIDTH HEIGHT". 
<br>For example: &ltsvg width="800" height="400" viewBox="0 0 800 400" ...
<br>You can edit .svg files in any text editor.</br>
To embed an SVG image, it is recommended using the SVG addon.
</div>

## Properties

<table border='1'>
<tbody>
    <tr>
        <th>Property name</th>
        <th>Description</th> 
    </tr>
    <tr>
        <td>Image</td>
        <td>This property enables to insert an image into the module.
<p><em>This property allows online resources. <a href="/doc/page/Online-resources">Find out more »</a></em></p>
</td> 
    </tr>
    <tr>
        <td>Mode</td>
        <td>This property enables to select the mode in which the image should be displayed (keep aspect, stretch and original size)</td>
    </tr>
    <tr>
        <td>Animated gif refresh</td>
        <td>If selected, animated gifs will always be refreshed after page loading</td>
    </tr>
    <tr>
        <td>Alternative text</td>
        <td>This property enables to define a text description that will be added to an image's HTML tag</td>
    </tr>
</tbody>
</table>

## CSS classes

<table border='1'>
<tbody>
    <tr>
        <th>Class name</th>
        <th>Description</th> 
    </tr>
    <tr>
        <td>.ic_image</td>
        <td>indicates the module that serves for inserting an image</td> 
    </tr>
</tbody>
</table>
    

### Examples

   .ic_image{  
border: 2px solid #02789f;  
border-radius: 3px;  
padding: 4px;  
box-shadow: 1px 2px 3px #406d93;  
}                              