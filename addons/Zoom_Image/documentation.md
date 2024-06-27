## Description
The Zoom Image module enables displaying two versions of an image. To display a full-screen image, click on the area in the bottom-right corner of the module.

<div style="border:1px solid Tomato; padding:5px; margin-bottom:21px;">
Note: To correctly display the SVG files in the Internet Explorer browser, it is necessary to add to &ltsvg&gt tag the following parameter: viewBox="0 0 WIDTH HEIGHT". 
<br>For example: &ltsvg width="800" height="400" viewBox="0 0 800 400" ...
<br>You can edit SVG files in any text editor.
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
        <td>Full Screen image</td>
        <td>This property enables inserting a full-screen image version into the module.</td> 
    </tr>
    <tr>
        <td>Page image</td>
        <td>This property enables inserting a page image version into the module.</td> 
    </tr>
    <tr>
        <td>Alternative text</td>
        <td>This text will be added to the module's HTML tag. It will be read by the Text to Speech module (if used) after the user performs a certain action.</td> 
    </tr>
    <tr>
        <td>Lang attribute</td>
        <td>This property allows defining the language for this module (different than the language of the lesson).</td> 
    </tr>
    <tr>
        <td>Speech texts</td>
        <td>Sets the values of speech texts - predefined phrases providing additional context while using the module in the Text To Speech mode. Speech texts are always read using the content's default language.</td> 
    </tr>
    <tr>
        <td>Printable</td>
        <td>Allows to choose if the module should be included in the <a href="/doc/en/page/Marking-elements-that-should-be-included-in-the-printout">printout</a>.</td> 
    </tr>
</tbody>
</table>

<p><em>These properties allow online resources. <a href="/doc/page/Online-resources">Find out more »</a></em></p>

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
        <td>...</td> 
        <td>Hides the module if it is visible.</td> 
    </tr>
    <tr>
        <td>show</td>
        <td>...</td> 
        <td>Shows the module if it is hidden.</td> 
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
        <td>.icon</td>
        <td>indicates the active area in the bottom-right corner.</td> 
    </tr>
    <tr>
        <td>.small</td>
        <td>indicates the page image version.</td> 
    </tr>
    <tr>
        <td>.zoom-image-wraper</td>
        <td>indicates the wrapper for full-screen image version.</td> 
    </tr>
    <tr>
        <td>.big</td>
        <td>indicates the full screen image version.</td> 
    </tr>
    <tr>
        <td>.ui-dialog</td>
        <td>indicates the look of the dialog box.</td> 
    </tr>
    <tr>
        <td>.ui-dialog-titlebar</td>
        <td>indicates the look of the titlebar.</td> 
    </tr>
    <tr>
        <td>ui-dialog-title-dialog</td>
        <td>indicates the look of the title.</td> 
    </tr>
    <tr>
        <td>.ui-dialog-titlebar-close</td>
        <td>indicates the look of the close button.</td> 
    </tr>
    <tr>
        <td>.ui-dialog-content</td>
        <td>indicates the look of the description container.</td> 
    </tr>
</tbody>
</table>

## Demo presentation
[Demo presentation](/embed/6178001817436160 "Demo presentation") contains examples of how to use this addon.   