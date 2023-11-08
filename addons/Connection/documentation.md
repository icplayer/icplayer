## Description
The Connection module allows defining two sides of items which match one another. All items can be determined both by texts and by images. The activity can work either in a single connection mode where each item on first side (left column or top row) matches one corresponding item on the second side (right column or bottom row), or multiple connection mode where each item can be used in multiple connections. The aim of the activity is to find all proper connections.

It supports formatted html items (including images), styling of elements and connections.

The module allows creating a connection activity in vertical and horizontal modes. This module allows to select the orientation for each layout separately. By default, each layout has a vertical orientation selected.

Printable version is always in vertical mode.

## Properties

The list starts with the common properties, learn more about them by visiting the [Modules description](https://www.mauthor.com/doc/en/page/Modules-description) section. The other available properties are described below.

<table border='1'>
<tbody>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Is not an activity</td>
        <td>With this option, the selected score and errors will not be returned by addon.</td>
    </tr>
    <tr>
        <td>Single connection mode</td>
        <td>If checked, every item can be part of only one connection. Otherwise, each item can be used in many connections.</td>
    </tr>
    <tr>
        <td>Left column (or top row)</td>
        <td>A list of items in left column (or top row). Each item should have: id, content, connect to (id of the corresponding item on the right/bottom side) and additional class. See section "configuration" for more details.</td>
    </tr>
    <tr>
        <td>Right column (or bottom row)</td>
        <td>List of items in right column (or bottom row). Each item should have: id, content, connect to (id of the corresponding item on the left/top side) and additional class. See section "configuration" for more details.</td>
    </tr>
    <tr>
        <td>Columns width</td>
        <td>Defines columns' width in percentage.<br>
            It has 3 properties: 
            <ul>
                <li>Left,</li>
                <li>Middle,</li>
                <li>Right.</li>
            </ul>
            The defined values are used only in the vertical view. At the moment, for the horizontal view, no property has been added to set an adequate value, i.e. the height of the rows.
        </td>
    </tr>
    <tr>
        <td>Initial connections</td>
        <td>List of points connected at the module's start.
            <table border='1'>
                <tbody>
                    <tr>
                        <th>Property name</th>
                        <th>Description</th>
                    </tr>
                    <tr>
                        <td>From ID</td>
                        <td>Start point of the initial connection</td>
                    </tr>
                    <tr>
                        <td>To ID</td>
                        <td>End point of the initial connection</td>
                    </tr>
                    <tr>
                        <td>Is disabled</td>
                        <td>Disabling a provided connection. If the connection is disabled, it can't be changed by user interaction. Make sure that the disabled connection is connected to a proper path, because a user can't change it.</td>
                    </tr>
                </tbody>
            </table>
        </td>
    </tr>
    <tr>
        <td>Default connection color</td>
        <td>Color of the connection. Can be a word (e.g. black) or hexadecimal definition (#000000)</td>
    </tr>
    <tr>
        <td>Correct connection color</td>
        <td>Color of the correct connection (in check mode). Can be a word (e.g. green) or hexadecimal definition (#00FF00)</td>
    </tr>
    <tr>
        <td>Incorrect connection color</td>
        <td>Color of the incorrect connection (in check mode). Can be a word (e.g. red) or hexadecimal definition (#FF0000)</td>
    </tr>
    <tr>
        <td>Connection thickness</td>
        <td>How thick a line is, e.g. 2</td>
    </tr>
    <tr>
        <td>Random order left column (or top row)</td>
        <td>With this option checked, elements in left column (or in top row) will be arranged randomly.</td>
    </tr>
    <tr>
        <td>Random order right column (or bottom row)</td>
        <td>With this option checked, elements in right column (or in bottom row) will be arranged randomly.</td>
    </tr>
    <tr>
        <td>Show answers line color</td>
        <td>Color of the connection lines in Show Answers mode.</td>
    </tr>
    <tr>
        <td>Block wrong answers</td>
        <td>With this option checked, wrong answers are removed and the "on wrong" event is sent.</td>
    </tr>
    <tr>
        <td>Remove dragged element</td>
        <td>With this option checked, a dragged element is removed from its original position while dragging it.</td>
    </tr>
    <tr>
        <td>Lang attribute</td>
        <td>This property allows to define the language for this addon (different than the language of the lesson).</td> 
    </tr>
    <tr>
        <td>Speech texts</td>
        <td>List of speech texts: Connected, Disconnected, Connected to, Selected, Deselected, Correct, Wrong. <br />
This texts will be read by Text to Speech addon after a user performs an action.</td> 
    </tr>
    <tr>
        <td>Orientations</td>
        <td>List of configurations of orientation (vertical and horizontal) of addon depending on a layout. If there is a layout for which no orientation is defined in this list, the vertical orientation will be used.<br>
            <table border='1'>
                <tbody>
                    <tr>
                        <th>Property name</th>
                        <th>Description</th>
                    </tr>
                    <tr>
                        <td>Layout</td>
                        <td>Name of the layout.</td>
                    </tr>
                    <tr>
                        <td>Orientation</td>
                        <td>List of options (vertical and horizontal) with orientations to choose from.</td>
                    </tr>
                </tbody>
            </table>
        </td>
    </tr>
</tbody>
</table>

## Configuration

### Vertical orientation
Items in both columns are spread vertically in equal distances across the column height no matter how many elements there are.

The width of the connections' area is calculated based on the width of left and right column. However, you can change this setting in "Columns width" property.

If you include images into connection addon, and you cannot see right column then you have to set "Columns width" property other than empty or auto.

To configure which connections are allowed you have to:

 * Provide a list of items for left column in "Left column (or top row)" property.
 * Provide a list of items for right column in "Right column (or bottom row)" property.
 * Each item should have an id which is unique across all elements in both columns.
 * A "connects to" defines a list of comma separated ids of items to which the current item can be connected to. If you provide multiple ids here and select the "single mode" option, only the last one will be used.
 * It is enough to define the "connects to" on one side only.
 * Additional class is not required.

### Horizontal orientation
Items in both rows are spread horizontally in equal distances across the row width no matter how many elements there are.

The height of the connections' area is calculated based on the height of top and bottom row.

To configure which connections are allowed you have to:

 * Provide a list of items for top row in "Left column (or top row)" property.
 * Provide a list of items for bottom row in "Right column (or bottom row)" property.
 * Each item should have an id which is unique across all elements in both rows.
 * A "connects to" defines a list of comma separated ids of items to which the current item can be connected to. If you provide multiple ids here and select the "single mode" option, only the last one will be used.
 * It is enough to define the "connects to" on one side only.
 * Additional class is not required.
 * In "Orientations" property add item with name of layout on which Horizontal orientation should be used. To learn more about layouts visit the [Managing Layouts](https://www.mauthor.com/doc/en/page/Managing-Layouts) section.

## Supported commands

<table border='1'>
    <tr>
        <th>Command name</th>
        <th>Params</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>isOK</td>
        <td>id</td>
        <td>Returns an object that contains information about the connection status and its validity. The response is described below.</td>
    </tr>
    <tr>
        <td>isAllOK</td>
        <td>---</td>
        <td>Returns true if all connections are made correctly and there are no mistakes, otherwise false.</td>
    </tr>
    <tr>
        <td>isAttempted</td>
        <td>---</td>
        <td>Returns true if any connection is selected.</td>
    </tr>
    <tr>
        <td>show</td>
        <td>---</td>
        <td>Shows the module.</td>
    </tr>
    <tr>
        <td>hide</td>
        <td>---</td>
        <td>Hides the module.</td>
    </tr>
    <tr>
        <td>showAnswers</td>
        <td>---</td>
        <td>Shows the addon answers.</td>
    </tr>
    <tr>
        <td>hideAnswers</td>
        <td>---</td>
        <td>Hides the addon answers.</td>
    </tr>
    <tr>
        <td>disable</td>
        <td>from - left column (or top row) item index,<br>
		to - right column (or bottom row) item index</td>
        <td>Disable the connection.</td>
    </tr>
    <tr>
        <td>enable</td>
        <td>from - left column (or top row) item index,<br>
		to - right column (or bottom row) item index</td>
        <td>Enable the connection.</td>
    </tr>
</table>

Response of isOK(id) command:

    {
        value: boolean,
        source: string,
        selectedDestinations: string[],
        correctDestinations: string[]
    }

<table border="1">
    <tr>
        <th>Parameter</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>value</td>
        <td>Represents the correctness of source connections.</td>
    </tr>
    <tr>
        <td>source</td>
        <td>The node which is subject to analysis. Is passed in the command argument.</td>
    </tr>
    <tr>
        <td>selectedDestinations</td>
        <td>Selected nodes that are connected to the source.</td>
    </tr>
    <tr>
        <td>correctDestinations</td>
        <td>Nodes that should be connected to the source.</td>
    </tr>
</table>

## Show Answers

This module is fully compatible with [Show Answers module](/doc/page/Show-Answers "Show Answers module") and displays correct answers when adequate event is sent.

## Custom Scoring
The Connection addon supports Custom Scoring scripts. For more information about Custom Scoring, see [documentation](/doc/page/Custom-Scoring).

<table border='1'>
<tbody>
    <tr>
        <th>Command name</th>
        <th>Params</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>isSelected</td>
        <td>from - left column (or top row) item index,<br>
		to - right column (or bottom row) item index</td>
        <td>Returns true if the connection is selected, otherwise false.</td>
    </tr>
    <tr>
        <td>markAsCorrect</td>
        <td>from - left column (or top row) item index,<br>
		to - right column (or bottom row) item index</td>
        <td>Marks the connection as correct.</td>
    </tr>
    <tr>
        <td>markAsWrong</td>
        <td>from - left column (or top row) item index,<br>
		to - right column (or bottom row) item index</td>
        <td>Marks the connection as wrong.</td>
    </tr>
</tbody>
</table>
 
## Scoring
Connection addon allows to create exercises as well as activities.

<table border='1'>
    <tr>
        <th>Property</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>maxScore</td>
        <td>the number of defined connections</td>
    </tr>
    <tr>
        <td>score</td>
        <td>1 point for each proper connection</td>
    </tr>
    <tr>
        <td>errorCount</td>
        <td>1 error point for each connection that hasn't been defined</td>
    </tr>
</table>

## Events

The Connection addon sends ValueChanged type events to Event Bus when a user creates or removes a connection.

<table border='1'>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Item</td>
        <td>Information about which connection has been created/removed (i.e. 1-4 means that conection has been created/removed between elements with IDs 1 and 4)</td>
    </tr>
    <tr>
        <td>Value</td>
        <td>1 if connection has been created, 0 if connection has been removed</td>
    </tr>
    <tr>
        <td>Score</td>
        <td>1 if connection is correct, 0 if connection is incorrect</td>
    </tr>
</table>

When a user makes all connections without any error, the addon sends the 'ALL OK' event. This event is different from a normal Connection event so its structure is shown below.

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

<table border='1'>
    <tr>
        <th>Class name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>.connectionContainer</td>
        <td>Table that wraps the whole addon</td>
    </tr>
    <tr>
        <td>.connectionLeftColumn</td>
        <td>Table cell that spans left column (available only in vertical orientation)</td>
    </tr>
    <tr>
        <td>.connectionMiddleColumn</td>
        <td>Table cell that spans middle column (available only in vertical orientation)</td>
    </tr>
    <tr>
        <td>.connectionRightColumn</td>
        <td>Table cell that spans right column (available only in vertical orientation)</td>
    </tr>
    <tr>
        <td>.connectionTopRow</td>
        <td>Table row that spans top row (available only in horizontal orientation)</td>
    </tr>
    <tr>
        <td>.connectionMiddleRow</td>
        <td>Table row that spans middle row (available only in horizontal orientation)</td>
    </tr>
    <tr>
        <td>.connectionBottomRow</td>
        <td>Table row that spans bottom row (available only in horizontal orientation)</td>
    </tr>
    <tr>
        <td>.content</td>
        <td>Table that holds the items inside the one of the above columns (or rows). In vertical orientation you can set its height to decide if the items should be placed vertically across the whole module (100%) or in a different way (ie. 50%)</td>
    </tr>
    <tr>
        <td>.connections</td>
        <td>Table cell that spans the canvas element that is used to draw the lines</td>
    </tr>
    <tr>
        <td>.connectionItem</td>
        <td>Table that holds a single item. It describes the element that wraps the whole item (both text and icon).</td>
    </tr>
    <tr>
        <td>.inner</td>
        <td>Describes the table cell with the content part of a single element.</td>
    </tr>
    <tr>
        <td>.icon</td>
        <td>Describes the table cell element that can be used as an icon.</td>
    </tr>
    <tr>
        <td>.innerWrapper</td>
        <td>Describes the div within the .inner table cell that wraps the content.</td>
    </tr>
    <tr>
        <td>.iconWrapper</td>
        <td>Describes the div within the .icon table cell that wraps the icon. If you need to create an icon with an image, you should upload the file using the presentation assets. Then you can apply a custom style either to this class or the icon class to use the image as background.</td>
    </tr>
    <tr>
        <td>.selected</td>
        <td>Single item selected for a connection. Use this selector instead of .connectionItem to apply styles to the selected item.</td>
    </tr>
    <tr>
        <td>.connectionItem-correct</td>
        <td>Additional class for a correctly matched item in error checking mode.</td>
    </tr>
    <tr>
        <td>.connectionItem-wrong</td>
        <td>Additional class for an incorrectly matched item in error checking mode.</td>
    </tr>
</table>

## Styles from a sample presentation

Here are the styles used in a sample presentation. ConnectionSample style is used on the first page. The second page contains a default styling for the module.

    .ConnectionSample {
    }

    .ConnectionSample .connectionItem {
        border: none;
    }

    .ConnectionSample .connectionLeftColumn .content{
        height: 50%;
        font-size: 12px;
    }

    .ConnectionSample .connectionRightColumn .content{
        height: 100%;
        font-size: 12px;
    }

    .ConnectionSample .connectionLeftColumn .connectionItem .innerWrapper {
        border: solid 1px #555;
        padding: 5px;
        background-color: #eee;
        border-radius: 5px;
        text-align: center;
    }

    .ConnectionSample .connectionLeftColumn .connectionItem .icon {
        text-align: right;
        width: 17px;
        padding: 0px;
    }

    .ConnectionSample .connectionLeftColumn .connectionItem .iconWrapper {
        height: 15px;
        width: 15px;
        border-radius: 2px;
        background-color: #ffa;
        border: solid 1px #555;
    }

    .ConnectionSample .connectionLeftColumn .selected .iconWrapper {
        height: 15px;
        width: 15px;
        border-radius: 2px;
        background-color: #ff0;
        border: solid 1px #f00;
    }

    .ConnectionSample .connectionRightColumn .connectionItem .innerWrapper {
        border: solid 1px #469;
        padding: 5px;
        background-color: #acf;
        border-radius: 5px;
        text-align: center;
    }

    .ConnectionSample .connectionRightColumn .selected .innerWrapper {
        border: solid 1px #469;
        padding: 5px;
        background-color: #bdf;
        border-radius: 5px;
        text-align: center;
    }

    .ConnectionSample .connectionRightColumn .connectionItem .icon {
        text-align: right;
        width: 17px;
        padding: 0px;
    }

    .ConnectionSample .connectionRightColumn .connectionItem .iconWrapper {
        height: 30px;
        width: 30px;
        background-image: url('/file/serve/521194');
    }

    .ConnectionSample .connectionRightColumn .selected .iconWrapper {
        height: 30px;
        width: 30px;
        background-image: url('/file/serve/518177');
    }

## Demo presentation
[Demo presentation](/embed/5910648580997120 "Demo presentation") contains examples of how to use the Connection addon.                                    