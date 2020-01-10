## Description

This addon allows users to embed animations and other projects created in Adobe Edge Animate software.

## Properties

<table border='1'>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Animations</td>
        <td><ul><li><b>Composition Class</b> – Composition Class of the animation created in Edge Animate found in the Stage properties.
<li><b>edge.js</b> – If Edge project is saved as “Project1”, then you have to upload the "Project1_edge.js" file.
<li><b>edgeActions.js</b> – If Edge project is saved as “Project1”, then you have to uploadthe "Project1_edgeActions.js" file.</li></ul>
</td>
    </tr>
    <tr>
        <td>Images</td>
        <td><ul><li><b>Animation Item Number</b> – provide the animation number from the Animations list.
<li><b>Edge element IDs (csv)</b> – the list of Egde elements or symbols that will use the image provided in the next property field. Element names have to be comma separated, e.g. "head,eyes,nose,mouth". If the element is inside a symbol, e.g. element "eyes" is within a symbol "head", the full name has to be "head_eyes". The same rule applies to all nested symbols, e.g. when the element "pupil" is within a symbol "eye" which is inside a symbol "head", then the full name should be "head_eye_pupil".
<li><b>Image File</b> – a file in the Internet browser supported by a file type that will be used as a background or a "src" attribute of all elements provided in the previous property.
<p><em>This property allows online resources. <a href="/doc/page/Online-resources">Find out more »</a></em></p>
</li></ul>
</td>
</tr>
    <tr>
    <td>Initial Animation</td>
        <td>The item number of the initially displayed animation.</td>
    </tr>
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
        <td>switchAnimation</td>
        <td>item</td>
        <td>Changes the visible animation to the one with the item number provided as a parameter.</td>
    </tr>
<tr>
        <td>getEdgeComposition</td>
        <td>---</td>
        <td>Returns current Edge animation’s Composition Object and all its methods.</td>
    </tr>
<tr>
        <td>getEdgeStage</td>
        <td>---</td>
        <td>Returns current Edge animation’s Stage Object and all its methods.</td>
    </tr>
<tr>
        <td>play</td>
        <td>position</td>
        <td>Starts the animation and all nested symbols from their current position or from the position provided as a parameter.</td>
</tr>
<tr>
        <td>stop</td>
        <td>---</td>
        <td>Stops the animation and all nested symbols at 0.</td>
</tr>
<tr>
        <td>pause</td>
        <td>position</td>
        <td>Stops the animation and all nested symbols in their current position or in the position provided as a parameter.</td>
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
</tbody>
</table>

## Events

Edge Animation addon does not send events.

## CSS classes

<table border='1'>
    <tr>
        <th>Class name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>.edgeMultiAnimWrapper</td>
        <td>Main class containing the entire Addon's content.</td>
    </tr>
</table>

## Styles from a sample presentation

    EdgeAnimation_test{    
        background: #ffffff;    
        padding: 2px;    
        border: 1px solid #bbbbbb;    
    }    
  
##Demo presentation
[Demo presentation](/embed/5307052876365824 "Demo presentation") contains examples of how to use the Edge Animation addon.                  