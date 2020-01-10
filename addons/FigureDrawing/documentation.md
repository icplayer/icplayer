## Description

A Figure Drawing addon enables you to add a set of grid points where by choosing two points you can draw or remove the segment connecting the two points. This addon can be used to draw figures.      
In the drawing mode, it is possible to use either the click&click operations to select the two points that make a segment or drag the line from one point to another with the drag&drop method.    
In the coloring mode, the already drawn figures can be colored using the available color palette.

##Properties

<table border='1'>
<tbody>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Is visible</td>
        <td>Enables to hide or show the module.</td>
    </tr>
    <tr>
        <td>3D grid</td>
        <td>Enables to change the grid into a pseudo 3D grid.</br>     
</td>
    </tr>
<tr>
        <td>Show grid</td>
        <td>Enables to hide or show the grid lines.</td>
    </tr>
<tr>
        <td>Point radius</td>
        <td>This property defines the radius of the point. If left empty, it is equal to 5.</td>
    </tr>
    <tr>
        <td>Starting lines</td>
        <td>This property allows to define the segments that will be visible at the beginning. 
<br>Define the segment by writing the column and the row of its points separated with a dash (the column and the row are separated with a semicolon). A definition of different segments should be written in separate lines.
<br>If you want the line to be removable, add an asterisk (*) after the second point.
<br>e.g.:<br>3;5-1;5<br>2;3-3;4*
</td>
    </tr>
    <tr>
        <td>Answer lines</td>
        <td>This property allows to define the segments that are to be drawn as the answer. <br>
Define the segment by writing the column and the row of the points separated with a dash (the column and the row are separated with a semicolon). A definition of different segments should be written in separate lines.</td>
    </tr>
<tr>
        <td>Is activity</td>
        <td>Enables to define whether the module is an activity or not.</td>
    </tr>
<tr>
        <td>Is disabled</td>
        <td>Allows to disable the module so that it won't be possible to select any point or color any figure.</td>
    </tr>
<tr>
        <td>Coloring</td>
        <td>This property allows users to color the figures drawn in the addon. </td>
    </tr>
<tr>
        <td>Default Color</td>
        <td>This property allows to define the default color for coloring figures. The color needs to be define in the RGB format, e.g.:<br>255 10 255 </td>
    </tr>
<tr>
        <td>Starting Colors</td>
        <td>This property allows users to define the colors in which the figures are colored at the beginning.<br>
It's a new line separated property. The single line should contain x, y of the point inside the figure and the color in RGB format, e.g.:<br>
105;35;0 255 255<br>
47;127;255 100 0
</td>
    </tr>
<tr>
        <td>Answer Colors</td>
        <td>This property allows users to define the figures which need to be colored.
In the "Figure" property, define the figure you want to color by writing the points of the figure (the figure needs to be closed, so the first and the last points have to be the same), e.g.:<br> 1;1-1;5-3;5-3;1-1;1<br>
In the "Point and Color" property, define a point inside this figure and the color in RGB format, e.g.:<br> 50;50;255 10 10
</td>
    </tr>
<tr>
        <td>Block coloring mode until all lines are OK</td>
        <td>If this property is selected, the coloring mode is blocked until all lines are correct. Then, when all lines are correct, the addon automatically changes to the coloring mode.
</td>
    </tr>
<tr>
        <td>Show Answers in Editor</td>
        <td>If this property is selected, the defined answers are shown in the Editor.
</td>
    </tr>
</tbody>
</table>

## Events

The Figure Drawing addon sends ValueChanged type of events to Event Bus when a line is drawn or removed.

<table border='1'>
<tbody>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <tr>
            <td>source</td>
            <td>module ID</td>
        </tr>
        <tr>
            <td>item</td>
            <td>the name of the line defined as: line_column1_row1_column2_row2</td>
        </tr>
        <tr>
            <td>value</td>
            <td>1 when a line is drawn, 0 when a line is removed</td>
        </tr>
        <tr>
            <td>score</td>
            <td>1 if the added line should be drawn, otherwise 0</td>
        </tr>
    </tr>
</tbody>
</table>

When all lines are drawn correctly, the addon sends another event.

<table border='1'>
<tbody>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
            <td>source</td>
            <td>module ID</td>
        </tr>
    <tr>
        <tr>
            <td>item</td>
            <td>lines</td>
        </tr>
        <tr>
            <td>value</td>
            <td>N/A</td>
        </tr>
        <tr>
            <td>score</td>
            <td>N/A</td>
        </tr>
    </tr>
</tbody>
</table>

In the coloring mode, the addon sends ValueChanged type of events to Event Bus when a figure is colored.

<table border='1'>
<tbody>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
            <td>source</td>
            <td>module ID</td>
        </tr>
    <tr>
        <tr>
            <td>item</td>
            <td>coordinates of the clicked point</td>
        </tr>
        <tr>
            <td>value</td>
            <td>color in RGBA format</td>
        </tr>
        <tr>
            <td>score</td>
            <td>N/A</td>
        </tr>
    </tr>
</tbody>
</table>

When a user completes all lines and colors correctly, the addon sends the 'ALL OK' event.

<table border='1'>
<tbody>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
            <td>source</td>
            <td>module ID</td>
        </tr>
    <tr>
        <tr>
            <td>item</td>
            <td>all</td>
        </tr>
        <tr>
            <td>value</td>
            <td>N/A</td>
        </tr>
        <tr>
            <td>score</td>
            <td>N/A</td>
        </tr>
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
        <td>reset</td>
        <td>---</td>
        <td>Resets the addon.</td>
</tr>
<tr>
        <td>enable</td>
        <td>---</td>
        <td>Enables the addon.</td>
</tr>
<tr>
        <td>disable</td>
        <td>---</td>
        <td>Disables the addon.</td>
</tr>
<tr>
        <td>isAllOK</td>
        <td>---</td>
        <td>Returns true if all lines and colors are made correctly and there are no errors.</td>
</tr>
<tr>
        <td>isAttempted</td>
        <td>---</td>
        <td>Returns true if any segment is selected or any figure drawn.</td>
    </tr>
<tr>
        <td>setColor</td>
        <td>color</td>
        <td>Sets the current filling color, for example:<br> Coloring1.setColor('255 50 50').</td>
</tr>
<tr>
        <td>setDrawMode </td>
        <td>---</td>
        <td>Sets the addon into the line drawing mode.</td>
</tr>
<tr>
        <td>setColorMode</td>
        <td>---</td>
        <td>Sets the addon into the coloring mode.</td>
</tr>
<tr>
        <td>setEraserOn</td>
        <td>---</td>
        <td>Turns on the eraser mode.</td>
</tr>
<tr>
        <td>allLinesDrawn</td>
        <td>---</td>
        <td>Returns true if all lines are drawn corectly.</td>
</tr>
<tr>
        <td>isDrawn</td>
        <td>column1, row1, column2, row2</td>
        <td>Returns true if a line from point (column1, row1) to point (column2, row2) is drawn.</td>
</tr>
<tr>
        <td>countDrawnLines</td>
        <td>---</td>
        <td>Returns the number of drawn lines (non-removable). Be aware that every part of the drawn segment is counted separately.</td>
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
        <td>markAsNeutral</td>
        <td>---</td>
        <td>Marks the addon as neutral.</td>
</tr>
</tbody>
</table>

## Show Answers

This module is fully compatible with Show Answers module and displays correct answers when an adequate event is sent.

## Scoring

The Figure Drawing addon allows to create exercises as well as activities.

<table border='1'>
<tbody>
    <tr>
        <th>Property</th>
        <th>Description</th>
    </tr>
    <tr>
        <tr>
            <td>maxScore</td>
            <td>The number of defined answer lines (including the lines defined in the Figures Answer Colors property) plus the number of defined figures to be colored.<br>
As the line counts every part of the drawn segment, then in segment 1;2-1;4 there are two lines: 1;2-1;3 and 1;3-1;4.
</td>
        </tr>
        <tr>
            <td>score</td>
            <td>1 point for each correct line and 1 point for each correctly collored figure.</td>
        </tr>
        <tr>
            <td>errorCount</td>
            <td>1 error point for each incorrect line and 1 error point for each figure that has the correct boundaries but its color is wrong.</td>
        </tr>
</tbody>
</table>


##CSS classes

  <table border='1'>
<tbody>
    <tr>
        <th>Class name</th>
        <th>Description</th>
    </tr>
    <tr>
<tr>
            <td>.figure</td>
            <td>DIV containing the addon</td>
        </tr>
 <tr>
            <td>.correct</td>
            <td>additional class for .figure (added using the markAsCorrect command)</td>
        </tr>
 <tr>
            <td>.wrong</td>
            <td>additional class for .figure (added using the markAsCorrect command)</td>
        </tr>
         <tr>
            <td>.drawing_mode</td>
            <td>additional class for the addon in the drawing mode</td>
        </tr>
         <tr>
            <td>.coloring_mode</td>
            <td>additional class for the addon in the coloring mode</td>
        </tr>
        <tr>
            <td>.disabled</td>
            <td>additional class for a disabled addon</td>
        </tr>
<tr>
            <td>.chart</td>
            <td>SVG containing the points and figures</td>
        </tr>
        <tr>
            <td>.point</td>
            <td>indicates the look of the point</td>
        </tr>
<tr>
            <td>.grid</td>
            <td>indicates the look of the grid lines</td>
        </tr>
<tr>
            <td>.line</td>
            <td>indicates the look of the figure's lines</td>
        </tr>
<tr>
            <td>.line .noremovable</td>
            <td>additional class for the lines that can’t be removed</td>
        </tr>
<tr>
            <td>.line .correct</td>
            <td>additional class for the correct lines</td>
        </tr>
<tr>
            <td>.line .wrong</td>
            <td>additional class for the incorrect lines</td>
        </tr>
<tr>
            <td>.line .show-answers</td>
            <td>additional class for the lines in the show answers mode</td>
        </tr>
<tr>
            <td>.icon-container</td>
            <td>the container for the icon which shows up when in the check errors mode</td>
        </tr>
<tr>
            <td>.icon-container .wrong</td>
            <td>additional class for the icon-container when the answer is wrong</td>
        </tr>
<tr>
            <td>.icon-container .correct</td>
            <td>additional class for the icon-container when the answer is correct</td>
        </tr>
</tbody>
</table>       
  
## Demo presentation
[Demo presentation](/embed/4559864008278016 "Demo presentation") contains examples on how to use the Figure Drawing addon.                                      