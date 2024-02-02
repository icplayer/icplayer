## Description
Plot drawing/exercise module allows users to present plots and make plot/points based activities. Plot enables to draw functions f(x) and f(y).

Addon may work in 4 modes:

- simple plot functions - set all expressions/selectable and expressions/correct  to false

- choose function - user has to select correct plot - define all clickable functions to true (expressions/selectable) and set appropriate answers (expressions/correct)

- choose points - if user defines points, module shows clickable points on grid intersections. It is important to note that the answer should be a point on that intersection. It must be defined which points are correct.

- the addon can work as a base module for plot type addons and communicate with them through the interface.

Addon is able to work in a mixed mode eg. simple plot + choose plot + choose points.

## Properties

The list starts with the common properties, learn more about them by visiting the [Modules description](https://www.mauthor.com/doc/en/page/Modules-description) section. The other available properties are described below.

<table border='1'>
<tbody>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Expressions</td>
        <td>List of expressions to draw</td>
    </tr>
    <tr>
        <td>Expressions/Id</td>
        <td>Plot id given by user (used for references in Variables section)</td>
    </tr>
    <tr>
        <td>Expressions/expression</td>
        <td>expression, see "expressions" section for more details</td>
    </tr>
    <tr>
        <td>Expressions/xMin,xMax,yMin,yMax</td>
        <td>Minimum and maximum values for expression. These can also be variables defined in the Variables section eg. xMin=-a, xMax=a+2*b</td>
    </tr>
    <tr>
        <td>Expressions/selectable</td>
        <td>boolean true/false defines if plot is clickable</td>
    </tr>
    <tr>
        <td>Expressions/correct</td>
        <td>boolean true/false defines if plot is the correct answer</td>
    </tr>
    <tr>
        <td>Expressions/y to x</td>
        <td>Draw f(y) functions. By default, f(x) are drawn</td>
    </tr>
    <tr>
        <td>Expressions/hidden</td>
        <td>if this property is set on "true", it indicates that the given function will not be visible on entry</td>
    </tr>
    <tr>
        <td>Expressions/mark at length</td>
        <td>Draw a correct/error mark for the Check Answers event at a location equal to the value defined in this property relative to the length of the visible expression. When field remains empty then draw mark in the middle of the expression (equivalent of value 50). This value must be empty or a positive number between 0 and 100. Property used when "Individual marks" is selected in "Check marks" property.</td>
    </tr>
    <tr>
        <td>Asymptote DY</td>
        <td>Set minimum <i>&Delta;Y</i> for the heuristic asymptote detection algorithm. The default value is <i>5</i> and it should be adjusted accordingly in case when the asymptote is drawn incorrectly in the addon, e.g. when the <i>Y</i> value range is too large and the addon's height is relatively small.</td>
    </tr>
    <tr>
        <td>Variables</td>
        <td>A section where you can define plot's variable values.</td>
    </tr>
    <tr>
        <td>Variables/plot id</td>
        <td>Id of plot (expressions section)</td>
    </tr>
    <tr>
        <td>Variables/variable</td>
        <td>Variable name</td>
    </tr>
    <tr>
        <td>Variables/value</td>
        <td>Value of a variable</td>
    </tr>
    <tr>
        <td>Variables/expected</td>
        <td>An expected value of a variable. Controlled by external module and api can become some kind of an activity. It is important to remember that all correct variables (with <i>expected</i> set) in plot give result = 1 (correct). Error otherwise.</td>
    </tr>
    <tr>
        <td>Points</td>
        <td>List of points which are correct answers. Points are defined by x and y values and should refer to intersections of grid as only these points are clickable.</td>
    </tr>
    <tr>
        <td>Points/selected</td>
        <td>A boolean true/false defines if a point should be selected on start</td>
    </tr>
    <tr>
        <td>Points/correct</td>
        <td>A boolean true/false defines if a point is correct answer when selected (true) or shouldn't be selected (false)</td>
    </tr>
    <tr>
        <td>Points/not scored</td>
        <td>A boolean true/false defines if a point is not included in result. Point which is not scoreable is also non-clickable</td>
    </tr>
    <tr>
        <td>xMin, xMax, yMin, yMax</td>
        <td>Minimum and maximum values of x and y axis. -10 to 10 by default</td>
    </tr>
    <tr>
        <td>Grid</td>
        <td>Shows/hides grid</td>
    </tr>
    <tr>
        <td>GridStepX, GridStepY</td>
        <td>Step of x and y grid. 1 by default</td>
    </tr>
    <tr>
        <td>Arrowhead size</td>
        <td>Size of arrowhead on axis. 6px by default</td>
    </tr>
    <tr>
        <td>Axis values</td>
        <td>Shows/hides values for axis</td>
    </tr>
    <tr>
        <td>Axis x/y values</td>
        <td>Shows/hides cyclic or custom values on axis. You can specify single values eg. <i>2,3,-5</i>, cyclic values eg.<i>2*</i> or mixed eg. <i>2*,5*,3,-3.5,7.1</i>. The cyclic value means that every n-th occurrence will be shown</td>
    </tr>
    <tr>
        <td>X/Y axis description</td>
        <td>Description for axis</td>
    </tr>
    <tr>
        <td>hide X/Y axis</td>
        <td>Hides corresponding axis</td>
    </tr>
    <tr>
        <td>Point active area size</td>
        <td>Defines size of active area for points</td>
    </tr>
    <tr>
        <td>Point radius</td>
        <td>Radius of point</td>
    </tr>
    <tr>
        <td>Point outline radius</td>
        <td>Radius of point's outline</td>
    </tr>
    <tr>
        <td>Max selected points</td>
        <td>How many points user can choose</td>
    </tr>
    <tr>
        <td>Not activity</td>
        <td>When checked, no score (done, errors) is returned by the addon. It is important to mention that events are still passed (except of all OK) with no score</td>
    </tr>
    <tr>
        <td>Free points</td>
        <td>When checked, user is able to select points freely. Selected points are not included in results unless they are defined in the points section. The addon sends events on selected/deselected points with no score</td>
    </tr>
    <tr>
        <td>Broadcast</td>
        <td> The property that enables to add a list of addons (e.g. Points To Plot) to the Plot addon. Plot will send events to the addons included in the list. All items in the list should be comma separated, e.g. addon1, addon2.</td>
    </tr>
    <tr>
        <td>Decimal separator</td>
        <td>By default, the decimal separator in Plot is a dot character. When this field is filled in with, e.g. a comma, all settings containing the dot character will have it replaced with a comma. Changing the default decimal separator has also impact on the "Axis values" properties. In such a case, it is necessary to replace a comma with a semi-colon in "Axis x values" and "Axis y values" fields, i.e. -10,-9,-8,-7,-6,-5,-4, ... to -10;-9;-8;-7;-6;-5;-4;...</td>
    </tr>
    <tr>
        <td>X axis values position</td>
        <td>A position of values on the x axis.</td>
    </tr>
    <tr>
        <td>Y axis values position</td>
        <td>A position of values on the y axis.</td>
    </tr>
    <tr>
        <td>Check marks</td>
        <td>Selection of functionality to draw marks for Check answers event.<br>
            When "No" option is selected, the addon will not draw additional marks.<br>
            When "One mark" option is selected, the addon will draw one mark.<br>
            When "Individual marks" option is selected, the addon will draw one mark per correct/incorrect point/expression.
        </td>
    </tr>
    <tr>
        <td>Correct marks HTML</td>
        <td>HTML of the tag displayed next to the point/chart/addon when the user correctly provided the answer. When field remains empty then draw checkmark (&#10004;).</td>
    </tr>
    <tr>
        <td>Error marks HTML</td>
        <td>HTML of the mark displayed next to the point/chart/addon when the user incorrectly provided the answer. When field remains empty then draw checkmark (&#10006;).</td>
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
        <td>zoomIn</td>
        <td>void</td> 
        <td>Zooms plot in</td> 
    </tr>
    <tr>
        <td>zoomOut</td>
        <td>void</td> 
        <td>Zooms plot out</td> 
    </tr>
    <tr>
        <td>moveLeft, moveRight, moveUp, moveDown</td>
        <td>int pixels</td> 
        <td>moves plot by given value (in pixels). Eg. moveLeft(50)</td> 
    </tr>
    <tr>
        <td>restoreView</td>
        <td>void</td> 
        <td>Resets view to its initial state</td> 
    </tr>
    <tr>
        <td>setVariable</td>
        <td>string plot_id, string variable, string value</td> 
        <td>Sets value of variable for given plot</td> 
    </tr>
    <tr>
        <td>setVisible</td>
        <td>string plot_id, boolean visible</td> 
        <td>Sets visibility for given plot</td> 
    </tr>
    <tr>
        <td>setPointVisibility</td>
        <td>string point_x, string point_y, boolean visible</td> 
        <td>Sets visibility for given point. It behaves like normal click on point so it sends events, changes score (in interactive mode). It follows rule of max selected points</td> 
    </tr>
    <tr>
        <td>setPlotStyle</td>
        <td>string plot_id, string type_id, string property, string value</td> 
        <td>Sets css style for plot with plot_id. Type_id is type of element we'd like to change - it supports only <i>plot</i> for now. Property/value is css/svg property and value. Eg. setPlotStyle('p1', 'plot', 'stroke', '#ff0000') - sets color of plot p1 to red</td> 
    </tr>
    <tr>
        <td>show</td>
        <td>void</td> 
        <td>Shows addon</td> 
    </tr>
    <tr>
        <td>hide</td>
        <td>void</td> 
        <td>Hides addon</td> 
    </tr>
    <tr>
        <td>isAllOK</td>
        <td>---</td>
        <td>Returns true if all connections are made correctly and there are no mistakes, otherwise false.</td>
    </tr>
</tbody>
</table>

## Events

Plot Addon sends ValueChanged type events to Event Bus when user selects point, plot or sets variable.

<table border='1'>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Item</td>
        <td>Information about item:
            <ul>
                <li>plot_PLOTID - refers to plot with PLOTID - eg. plot_function1 - plot <i>function1</i> has changed state</li>
                <li>point_X_Y - refers to point with coordinates X and Y - eg. point_1_5 - point at coords <i>x = 1</i> and <i>y = 5</i> has changed state</li>
                <li>variable_PLOTID_VARIABLE - refers to variable VARIABLE of plot PLOTID - variable_function1_a - variable <i>a</i> of plot <i>function1</i> has changed state</li>
                <li>variables_PLOTID - refers to all variables of PLOTID - eg. variables_function1 - all expected variables are set so state of plot <i>function1</i> has changed</li>
            </ul>
        </td>
    </tr>
    <tr>
        <td>Value</td>
        <td>
            <ul>
                <li>for plot - 1 when selected, 0 when deselected</li>
                <li>for point - 1 when selected, 0 when deselected</li>
                <li>for variable - value of variable</li>
                <li>N/A for variables</li>
            </ul>
        </td>
    </tr>
    <tr>
        <td>Score</td>
        <td>
            <ul>
                <li>in case of plot - 1 when correct, 0 when incorrect or N/A when not activity</li>
                <li>in case of point - 1 when correct, 0 when incorrect or N/A when not activity</li>
                <li>in case of variable - 1 when correct, 0 when incorrect or N/A when not activity</li>
                <li>in case of variables - 1 when all expected values are correct, 0 when any is incorrect or N/A when not activity</li>
            </ul>
        </td>
    </tr>
</table>

If you are using [Advanced Connector](/doc/page/Advanced-Connector), please note that due to Regular Expression syntax which has special meaning for "-" and "." characters, you need to escape them with backshlash eg. point_\-5\.2_4\.5

When a user makes all connections properly without any error, the addon sends the 'ALL OK' event.

<table border='1'>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Item</td>
        <td>all</td>
    </tr>
    <tr>
        <td>Value</td>
        <td>N/A</td>
    </tr>
    <tr>
        <td>Score</td>
        <td>N/A</td>
    </tr>
</table>

## CSS classes
Please note that most of these properties refer to svg css capabilities described at http://www.w3.org/TR/SVG/styling.html

<table border='true'>
    <tr>
        <th>Class name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>.canvas</td>
        <td>Describes the div for whole addon</td>
    </tr>
    <tr>
        <td>.axis</td>
        <td>Describes x and y axis</td>
    </tr>
    <tr>
        <td>.axisArrows</td>
        <td>Describes properties for axis arrowheads</td>
    </tr>
    <tr>
        <td>.axisText</td>
        <td>General descriptions of the axis (x,y,0)</td>
    </tr>
    <tr>
        <td>.axisXText, .axisYText</td>
        <td>Descriptions of the axis x, y</td>
    </tr>
    <tr>
        <td>.axisThicksTextX, .axisThicksTextY</td>
        <td>Descriptions of the axis values</td>
    </tr>
    <tr>
        <td>.grid</td>
        <td>Grid properties</td>
    </tr>
    <tr>
        <td>.draw_active_area</td>
        <td>Describes style for plot's active area. Use stroke-width to define size of active area</td>
    </tr>
    <tr>
        <td>.draw_outline_base</td>
        <td>Basic properties for plot's outline. Generally do not modify but if you want to make outline visible set stroke-opacity, stroke-width, stroke</td>
    </tr>
    <tr>
        <td>.draw_outline</td>
        <td>Defines properties of outline for selected plot</td>
    </tr>
    <tr>
        <td>.draw_outline_mark_error, .draw_X_outline_mark_error,<br> .draw_outline_mark_correct, .draw_X_outline_mark_correct</td>
        <td>Properties of outline for wrong/correct plots in show errors mode. Classes with X (where X is number of plot) define properties for given X plot</td>
    </tr>
    <tr>
        <td>.draw, .draw_X</td>
        <td>Describe style for plots in normal state. Classes with X (where X is number of plot) define properties for given X plot</td>
    </tr>
    <tr>
        <td>.draw_over, .draw_X_over</td>
        <td>Describes style for plots in hover (mouseover) state. Classes with X (where X is number of plot) define properties for given X plot</td>
    </tr>
    <tr>
        <td>.draw_selected, .draw_X_selected</td>
        <td>Describes style for selected (clicked) plot. Classes with X (where X is number of plot) define properties for given X plot</td>
    </tr>
    <tr>
        <td>.draw_mark_error, .draw_X_mark_error,<br> .draw_mark_correct, .draw_X_mark_correct</td>
        <td>Properties for wrong/correct plots in show errors mode. Classes with X (where X is number of plot) define properties for given X plot</td>
    </tr>
    <tr>
        <td>.point_active_area</td>
        <td>Describes style for point's active area. Use fill and fill-opacity to define make active area visible. Use model's <i>Point active area size</i> to define size of active area</td>
    </tr>
    <tr>
        <td>.point_outline_base</td>
        <td>Basic properties for points's outline. Generally do not modify but if you want to make outline visible set stroke-opacity, stroke-width, stroke, fill and fill-opacity</td>
    </tr>
    <tr>
        <td>.point_outline</td>
        <td>Defines properties of outline for selected point</td>
    </tr>
    <tr>
        <td>.point_outline_mark_error,<br> .point_outline_mark_correct</td>
        <td>Define properties of outline for wrong/correct points in show errors mode</td>
    </tr>
    <tr>
        <td>.point</td>
        <td>Describes style for points</td>
    </tr>
    <tr>
        <td>.point_over</td>
        <td>Describes style for points in hover (mouseover) state</td>
    </tr>
    <tr>
        <td>.point_selected</td>
        <td>Describes style for selected points</td>
    </tr>
    <tr>
        <td>.point_error, .point_correct</td>
        <td>Describe styles for wrong/correct points in show errors mode</td>
    </tr>
    <tr>
        <td>.mark</td>
        <td>Describe styles for wrong/correct marks in check errors mode</td>
    </tr>
    <tr>
        <td>.mark.point_mark.mark_error, .mark.point_mark.mark_correct</td>
        <td>Describe styles for wrong/correct marks for points in check errors mode</td>
    </tr>
    <tr>
        <td>.mark.expression_mark.mark_error, .mark.expression_mark.mark_correct</td>
        <td>Describe styles for wrong/correct marks for expressions in check errors mode</td>
    </tr>
    <tr>
        <td>.mark.addon_mark.mark_error, .mark.addon_mark.mark_correct</td>
        <td>Describe styles for wrong/correct mark for addon in check errors mode</td>
    </tr>
</table>
 
Additionally you are able to override style for each plot by setting .draw_X, .draw_X_over, .draw_X_selected, where X is number (1..X) of plot.
  
## Expressions
The parser accepts a pretty basic grammar. Operators have the normal precidence — ^ (exponentiation), *, /, and % (multiplication, division, and remainder), and finally +, - — and bind from left to right. Eg. x+2; x^2+2; x+sin(x); x-5*cos(2*x)	

The parser has several built-in “functions” that are actually operators.
<table border='true'>
    <tr>
        <th>Function</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>sin(x)</td>
        <td>Sine of x (x is in radians)</td>
    </tr>
    <tr>
        <td>cos(x)</td>
        <td>Cosine of x (x is in radians)</td>
    </tr>
    <tr>
        <td>tan(x)</td>
        <td>	Tangent of x (x is in radians)</td>
    </tr>
    <tr>
        <td>asin(x)</td>
        <td>Arc sine of x (in radians)</td>
    </tr>
    <tr>
        <td>acos(x)</td>
        <td>Arc cosine of x (in radians)</td>
    </tr>
    <tr>
        <td>atan(x)</td>
        <td>Arc tangent of x (in radians)</td>
    </tr>
    <tr>
        <td>sqrt(x)</td>
        <td>Square root of x. Result is NaN (Not a Number) if x is negative</td>
    </tr>
    <tr>
        <td>log(x)</td>
        <td>Natural logarithm of x (not base-10)</td>
    </tr>
    <tr>
        <td>abs(x)</td>
        <td>Absolute value (magnatude) of x</td>
    </tr>
    <tr>
        <td>ceil(x)</td>
        <td>Ceiling of x — the smallest integer that’s >= x</td>
    </tr>
    <tr>
        <td>floor(x)</td>
        <td>Floor of x — the largest integer that’s <= x</td>
    </tr>
    <tr>
        <td>round(x)</td>
        <td>X, rounded to the nearest integer, using gradeschool rounding</td>
    </tr>
    <tr>
        <td>exp(x)</td>
        <td>ex (exponential/antilogarithm function with base e)</td>
    </tr>
</table> 

## Defining variables
Let's assume you have a plot a\*x\+ b. Normally you can write expression like 3\*x\+5, but if you want to change value of a and/or b dynamically (eg. by slider/button) you have to use Variables section.
Give a plot id, eg. 'p1', write expression a\*x\+b. Plot addon is expecting values for a and b in Variables section.

Now go to Variables and create list of 2 items. Item 1 - set plot id 'p1', name variable as 'a' and set value eg. 3. In Item 2 - set plot id' p1', variable 'b', value 5. 

Addon is able to parse plot 'p1' in form of a\*x\+b as 3\*x\+5

## Demo presentation
[Demo presentation](/embed/4505122450178048 "Demo presentation") contains examples of how to use the Plot addon and integrate it with other Addons, i.e. Slider, buttons. 
                                    