## Description
This addon allows users to add a multiple image selection activity to a presentation. Each element works in a single selection option mode.

<div style="border:1px solid Tomato; padding:5px; margin-bottom:21px;">
Note: To display .svg files in Internet Explorer browsers correctly, you have to add to &ltsvg&gt tag the following parameter: viewBox="0 0 WIDTH HEIGHT". 
<br>For example: &ltsvg width="800" height="400" viewBox="0 0 800 400" ...
<br>You can edit .svg files in any text editor.
</div>

## Properties

<table border='1'>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Image</td>
        <td>This property serves for inserting images to be displayed in the module.
<p><em>This property allows online resources. <a href="/doc/page/Online-resources">Find out more »</a></em></p></td>
    </tr>
    <tr>
        <td>Selection is correct</td>
        <td>This property indicates whether the selected element is correct and a user should do it in order to solve the activity successfully.</td>
    </tr>
    <tr>
        <td>Is Disabled</td>
        <td>This property allows to disable a module so that it is not possible to select or deselect it.</td>
    </tr>
    <tr>
        <td>Is not an activity</td>
        <td>With this option, the selected score and errors will not be returned by addon</td>
    </tr>
    <tr>
        <td>Block in error checking mode</td>
        <td>If this option is selected, the addon is blocked in error checking mode.</td>
    </tr>
    <tr>
        <td>Block wrong answers</td>
        <td>With this option checked, wrong answers are removed and the "on wrong" event is sent.</td>
    </tr>
   <tr>
        <td>Alternative text</td>
        <td>This property enables to define a text description that will be added to the image.</td> 
    </tr>
    <tr>
        <td>Lang attribute</td>
        <td>This property allows to define the language for this addon (different than the language of the lesson).</td> 
    </tr>
    <tr>
        <td>Speech texts</td>
        <td>List of speech texts: Selected, Deselected, Correct, Wrong. <br />
This texts will be read by Text to Speech addon after a user performs an action.</td> 
    </tr>
</table>

It's very good practice to set the Image property in a form of the sprite image and operate on it via CSS attributes (see the "CSS classes" section below). You can read more about sprites on [Wikipedia](http://en.wikipedia.org/wiki/Sprite_(computer_graphics) "Wikipedia").

## Supported commands

<table border='1'>
    <tr>
        <th>Command name</th>
        <th>Params</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>select</td>
        <td><i>optional</i> dontSendEvent: true/false</td>
        <td>Select an element if not selected (not available in the error checking mode)</td>
    </tr>
    <tr>
        <td>deselect</td>
        <td><i>optional</i> dontSendEvent: true/false</td>
        <td>Deselect an element if selected (not available in the error checking mode)</td>
    </tr>
    <tr>
        <td>isAllOK</td>
        <td>---</td>
        <td>Returns true if the image is (not)selected correctly, otherwise false</td>
    </tr>
    <tr>
        <td>isSelected</td>
        <td>---</td>
        <td>Returns true if the image is selected correctly, otherwise false</td>
    </tr>
    <tr>
        <td>show</td>
        <td>---</td>
        <td>Shows the module</td>
    </tr>
    <tr>
        <td>hide</td>
        <td>---</td>
        <td>Hides the module</td>
    </tr>
    <tr>
        <td>markAsCorrect</td>
        <td>---</td>
        <td>Marks addon as correct.</td>
    </tr>
    <tr>
        <td>markAsWrong</td>
        <td>---</td>
        <td>Marks addon as wrong.</td>
    </tr>
    <tr>
        <td>markAsEmpty</td>
        <td>---</td>
        <td>Marks addon as empty.</td>
    </tr>
    <tr>
        <td>removeMark</td>
        <td>---</td>
        <td>Removes addon mark (class).</td>
    </tr>
    <tr>
        <td>disable</td>
        <td>---</td>
        <td>Disables module activities.</td>
    </tr>
    <tr>
        <td>enable</td>
        <td>---</td>
        <td>Enables module activities.</td>
    </tr>
</table>

## Events

The Image Identification addon sends ValueChanged type events to Event Bus when the element selection changes.

<table border='1'>
<tbody>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>

    <tr>
        <tr>
            <td>Item</td>
            <td>N/A</td>
        </tr>
        <tr>
            <td>Value</td>
            <td>1 when the element is selected, 0 if deselected</td>
        </tr>
        <tr>
            <td>Score</td>
            <td>1 if the element should selected, 0 if not</td>
        </tr>
    </tr>
</tbody>
</table>

##Show Answers

This module is fully compatible with [Show Answers module](/doc/page/Show-Answers "Show Answers module") and displays correct answers when adequate event is sent.

## CSS classes

<table border='1'>
    <tr>
        <th>Class name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>image-identification-element</td>
        <td>The element base class when it has no other state.</td>
    </tr>
    <tr>
        <td>image-identification-element-selected</td>
        <td>Class for a selected element while not in the error checking mode.</td>
    </tr>
    <tr>
        <td>image-identification-element-empty</td>
        <td>Class for the element that should be selected while it's not in the error checking mode.</td>
    </tr>
    <tr>
        <td>image-identification-element-correct</td>
        <td>Class for the element (un)selected correctly while in the error checking mode.</td>
    </tr>
    <tr>
        <td>image-identification-element-incorrect</td>
        <td>Class for the element (un)selected incorrectly while in the error checking mode.</td>
    </tr>
    <tr>
        <td>image-identification-element-mouse-hover</td>
        <td>Class for the element on mouse hover while not in the error checking mode.</td>
    </tr>
    <tr>
        <td>image-identification-background-image</td>
        <td>Inner DIV element whose background is the provided image.</td>
    </tr>
    <tr>
        <td>image-identification-element-show-answers</td>
        <td>Class for the element in the show answers mode.</td>
    </tr>
</table>

Note that the addon's size is the same in every state so the properties responsible for dimensions (i.e. width, height, border/margin/padding size) should be consistent across all states.

## Demo presentation
[Demo presentation](/embed/6308755495976960 "Demo presentation") contains examples of how the Image Identification addon can be used.                  