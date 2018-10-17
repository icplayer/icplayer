##Description
The Line Number module is used to draw the X-axis ranges.

## Properties

<table border='1'>
<tbody>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Decimal Separator</td>
        <td>By default, the decimal separator in LineNumber is a dot character. 
		When this field is filled with, e.g. a comma, 
		all settings containing the dot character will have it replaced with a comma. </td>
    </tr>
    <tr>
        <td>Min</td>
        <td>This is the minimum value on the axis.</td>
    </tr>
    <tr>
        <td>Max</td>
        <td>This is the maximum value on the axis.</td>
    </tr>
    <tr>
        <td>Ranges</td>
        <td>Correct ranges seperated by new lines. For examples, see the "Ranges" section below.</td>
    </tr>
    <tr>
        <td>Not Activity</td>
        <td>When checked, no score (done, errors) is returned by the addon. </td>
    </tr>
	<tr>
        <td>Step</td>
        <td>By default, the step in LineNumber is 1.
		Increase this value if you want the points on the axis to appear less frequently.
		Decrease this value if you want the points on the axis to appear more frequently.</td>
    </tr>
    <tr>
        <td>Show Axis X Values</td>
        <td>When checked, the axis number values are shown.</td>
    </tr>
    <tr>
        <td>Axis X Values</td>
        <td>Enables to define the values you want to be shown. You can specify single values, e.g. "2;3;-5", cyclic
            values, e.g."2*" or mixed values, e.g. "2*;5;3;-3.5;7*". The cyclic value means that every n-th occurrence will be shown.</td>
    </tr>
    <tr>
        <td>Disable</td>
        <td>Disable module. It is not possible to select any range.</td>
    </tr>
    <tr>
        <td>Don't show ranges</td>
        <td>This property allows clicking only one number on the line number to make a point. It is not possible to make a range.</td>
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
        <td>drawRange</td>
        <td>String range, e.g. <1; 2); 1. For more examples, see the "Ranges" section below.</td> 
        <td>Draw the range on the axis.</td> 
    </tr>
    <tr>
        <td>enable</td>
        <td>void</td> 
        <td>Enables addon.</td> 
    </tr>
    <tr>
        <td>Disable</td>
        <td>void</td> 
        <td>Disables addon.</td> 
    </tr>
    <tr>
        <td>show</td>
        <td>void</td> 
        <td>Shows addon.</td> 
    </tr>
    <tr>
        <td>hide</td>
        <td>void</td> 
        <td>Hides addon.</td> 
    </tr>
</tbody>
</table>

##Events

The Line Number addon sends ValueChanged type events to Event Bus when a user selects the range or a point on the axis.

<table border='1'>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Item</td>
        <td>It's a string representation of range.</td>
    </tr>
    <tr>
        <td>Value</td>
        <td>
           The Value is 1 if the action performed was drawing, 0 if it was erasing.
        </td>
    </tr>
    <tr>
        <td>Score</td>
        <td>
           It's 1 for the  correct range drawn or 0 for wrong.
        </td>
    </tr>
</table>

If you are using [Advanced Connector](/doc/page/Advanced-Connector), please note that due to the Regular Expression syntax which has special meaning for "-" and "." characters, you need to escape them with backshlash.

When a user draws all ranges properly without any error, the addon sends the 'ALL OK' event.

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
Please note that most of these propeties refer to svg css capabilities described [here](http://www.w3.org/TR/SVG/styling.html).



<table border='true'>
    <tr>
        <th>Class name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>.addon_Line_Number .outer .infinity-left, <br />
			.addon_Line_Number .outer .infinity-right</td>
        <td>Describes divs for infinity areas.</td>
    </tr>
    <tr>
        <td>.addon_Line_Number .outer</td>
        <td>Describes a main wrapper.</td>
    </tr>
    <tr>
        <td>.addon_Line_Number .inner</td>
        <td>Describes a main container.</td>
    </tr>
    <tr>
        <td>.addon_Line_Number .x-axis</td>
        <td>Describes a container for step lines.</td>
    </tr>
    <tr>
        <td>.addon_Line_Number .stepLine</td>
        <td>Describes step lines.</td>
    </tr>
    <tr>
        <td>.addon_Line_Number .rangeImage</td>
        <td>Describes a container for range image.</td>
    </tr>
    <tr>
        <td>.addon_Line_Number .currentMousePosition</td>
        <td>Describes a container for a current mouse position.</td>
    </tr>
    <tr>
        <td>.addon_Line_Number .exclude</td>
        <td>Describes a situation when the range end is excluded from range.</td>
    </tr>
    <tr>
        <td>.addon_Line_Number .include</td>
        <td>Describes a situation when the range end is within range.</td>
    </tr>
    <tr>
        <td>.addon_Line_Number .correctRangeExclude</td>
        <td>Describes a situation when the range end is excluded from range and is correct.</td>
    </tr>
    <tr>
        <td>.addon_Line_Number .correctRangeInclude</td>
        <td>Describes a situation when the range end is within range and is correct.</td>
    </tr>
    <tr>
        <td>.addon_Line_Number .wrongRangeExclude</td>
        <td>Describes a situation when the range end is excluded from range and is wrong.</td>
    </tr>
    <tr>
        <td>.addon_Line_Number .wrongRangeInclude</td>
        <td>Describes a situation when the range end is within range and is wrong.</td>
    </tr>
    <tr>
        <td>.addon_Line_Number .clickArea</td>
        <td>Describes a clickable area.</td>
    </tr>
    <tr>
        <td>.addon_Line_Number .stepText</td>
        <td>Describes text containers under step lines.</td>
    </tr>
    <tr>
        <td>.addon_Line_Number .x-arrow</td>
        <td>Describes an arrow head.</td>
    </tr>
    <tr>
        <td>.addon_Line_Number .selectedRange</td>
        <td>Describes a range.</td>
    </tr>
    <tr>
        <td>.addon_Line_Number .correct</td>
        <td>Describes a range when it is correct.</td>
    </tr>
    <tr>
        <td>.addon_Line_Number .wrong</td>
        <td>Describes a range when it is wrong.</td>
    </tr>
    <tr>
        <td>.addon_Line_Number .currentSelectedRange</td>
        <td>Describes a range when it's clicked.</td>
    </tr>
    <tr>
        <td>.addon_Line_Number .currentMousePosition</td>
        <td>Describes the background image for a current mouse position.</td>
    </tr>
    <tr>
        <td>.addon_Line_Number .infinityRight</td>
        <td>Describes a range when its start is infinity.</td>
    </tr>
    <tr>
        <td>.addon_Line_Number .infinityLeft</td>
        <td>Describes a range when its end is infinity.</td>
    </tr>
	<tr>
        <td>.addon_Line_Number .infinityBoth</td>
        <td>Describes a range when its end and start are infinity.</td>
    </tr>
	<tr>
        <td>.addon_Line_Number .infinity-hover</td>
        <td>Describes a range when it is on mouse hover.</td>
    </tr>
</table>

If you define your own CSS class for this addon, you have to provide the style definition for all elements because the default styles are not provided in such a case. For example: 

    .Line_Number_demo {
    }

    .Line_Number_demo .outer .infinity-left,.Line_Number_demo .outer .infinity-right {
        height: 100%;
        width: 5%;
        position: absolute;
        z-index: 9;
    }

    .Line_Number_demo .outer .infinity-left {
        left: 0px;
    }

    .Line_Number_demo .outer .infinity-right {
        right: 0px;
    }

    .Line_Number_demo .outer {
        width: 100%;
        height: 100%;
        background-color: #f3f3f3;
        position: relative;
    }

    .Line_Number_demo .inner {
        width: 90%;
        height: 100%;
        position: absolute;
        left: 5%;
        background-color: #fefefe;
    }

    .Line_Number_demo .x-axis {
        width: 100%;
        height: 2px;
        min-height: 2px;
        max-height: 2px;
        position: absolute;
        z-index: 12;
        top: 50%;
        background-color: #111;
    }

    .Line_Number_demo .stepLine {
        width: 2px;
        height: 8px;
        min-height: 8px;
        background-color: #111;
        position: absolute;
        top: 50%;
        margin-top: -4px;
    }

    .Line_Number_demo .rangeImage, .Line_Number_demo .currentMousePosition {
        background-repeat: no-repeat;
        width: 12px;
        height: 12px;
        position: absolute;
        left: -5px;
        top: -1px;
        z-index: 11;
        background-size: 12px 12px;
    }

    .Line_Number_demo .exclude {
        background-image: url('resources/range_exclude.svg');
    }

    .Line_Number_demo .include {
        background-image: url('resources/range_include.svg');
    }

    .Line_Number_demo .correctRangeExclude {
        background-image: url('resources/correct_range_exclude.svg');
    }

    .Line_Number_demo .correctRangeInclude {
        background-image: url('resources/correct_range_include.svg');
    }

    .Line_Number_demo .wrongRangeExclude {
        background-image: url('resources/wrong_range_exclude.svg');
    }

    .Line_Number_demo .wrongRangeInclude {
        background-image: url('resources/wrong_range_include.svg');
    }

    .Line_Number_demo .clickArea {
        width: 10px;
        height: 50px;
        top: -25px;
        min-height: 10px;
        min-width: 10px;
        position: absolute;
        z-index: 12;
        overflow: hidden;
    }

    .Line_Number_demo .stepText {
        position: absolute;
        font-size: 12px;
        top: 10px;
        white-space: nowrap;
    }

    .Line_Number_demo .x-arrow {
        border-bottom: 6px solid transparent;
        border-left: 6px solid black;
        border-top: 6px solid transparent;
        right: -5px;
        top: -5px;
        position: absolute;
    }

    .Line_Number_demo .clickArea:hover,.Line_Number_demo .outer .infinity-left:hover,.Line_Number_demo .outer .infinity-right:hover {
        cursor: pointer;
    }

    .Line_Number_demo .selectedRange {
        background-color: #00bb44;
        box-shadow: 0px 0px 1px #111;
        min-height: 10px;
        height: 10px;
        min-width: 2px;
        width: 2px;
        top: -7px;
        position: absolute;
        z-index: 10;
        border-radius: 5px 5px 0px 0px;
    }

    .Line_Number_demo .currentSelectedRange {
        background-color: #00aaff;
    }

    .Line_Number_demo .correct {
        background-color: #00ff44;
    }

    .Line_Number_demo .wrong {
        background-color: #ff3344;
    }

    .Line_Number_demo .currentMousePosition {
        background-image: url('resources/current_mouse_pos.svg');
    }

    .Line_Number_demo .infinityLeft {
        border-radius: 0px 5px 0px 0px;
    }

    .Line_Number_demo .infinityRight {
        border-radius: 5px 0px 0px 0px;
    }

    .Line_Number_demo .infinityBoth {
        border-radius: 0px;
    }

    .Line_Number_demo .infinity-hover {
        background-color: #d8d8d8;
    }
  
##Ranges
Range pattern:

< or ( x; y ) or >; 0 or 1

<table>
	<tr>
		<th> Character </th>
		<th> Explanation </th>
	</tr>
	<tr>
		<td> < </td>
		<td> Include x in range </td>
	</tr>
	<tr>
		<td> ( </td>
		<td> Exclude x from range </td>
	</tr>
	<tr>
		<td> x </td>
		<td> Beginning of range (must be higher or equal to Min value) </td>
	</tr>
	<tr>
		<td> ; </td>
		<td> Separator </td>
	</tr>
	<tr>
		<td> y </td>
		<td> End of range (must be lower or equal to Max value) </td>
	</tr>
	<tr>
		<td> > </td>
		<td> Include y in range </td>
	</tr>
	<tr>
		<td> ) </td>
		<td> Exclude y from range </td>
	</tr>
	<tr>
		<td> 0 or 1 on end </td>
		<td> It's a boolean value. If true, then the range will be drawn on init, otherwise it won't..</td>
	</tr>
</table>

Examples:

<table>
	<tr>
		<th> Example </th>
		<th> Explanation </th>
	</tr>
	<tr>
		<td> <1; 12); 1 </td>
		<td> Draw range on init from 1 (including) to 12 (excluding). </td>
	</tr>
	<tr>
		<td> <-INF; 5); 1 </td>
		<td> Draw range on init from -Infinity to 5 (excluding). </td>
	</tr>
	<tr>
		<td> <-5; 5>; 0 </td>
		<td> Don't draw range on init, but the correct range is from -5 (including) to 5 (including). </td>
	</tr>
	<tr>
		<td> <-5; INF>; 0 </td>
		<td> Don't draw range on init, but the correct range is from -5 (including) to Infinity. </td>
	</tr>
	<tr>
		<td> <-1.5; 1.5); 1 </td>
		<td> Draw range on init from -1.5 (including) to 1.5 (excluding). </td>
	</tr>
</table>

## Demo presentation
[Demo presentation](http://www.mauthor.com/embed/5662426855899136 "Demo presentation") contains examples on how to use the Line Number addon.
                                           