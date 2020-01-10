## Description

Multiple Gap module constitutes a box where multiple Image Sources or text items from Source Lists should be inserted.

## Properties

<table border='1'>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Orientation</td>
        <td>Indicates if elements placed in the Multiple Gap should have horizontal or vertical alignment</td>
    </tr>
    <tr>
        <td>Source type</td>
        <td>Indicates if this Multiple Gap should accept content from Image Lists (choose "texts") or Image Sources (choose "images")</td>
    </tr>
    <tr>
        <td>Items</td>
        <td>List of identifiers of items that are considered as valid answers. In case of Source type set to "images" just define a list of module IDs as they are shown in Modules list in the editor. In case of Source type set to "texts", answer identifier consists of Source List ID concatenated with dash and answer number counted from 1. For instance, if you have placed Source List with ID "MySourceList" and you want to indicate its third text as valid answer, put "MySourceList-3" in this property.</td>
    </tr>
    <tr>
        <td>Item width</td>
        <td>Width in pixels of each item placed into this Multiple Gap</td>
    </tr>
    <tr>
        <td>Item height</td>
        <td>Height in pixels of each item placed into this Multiple Gap</td>
    </tr>
    <tr>
        <td>Item spacing</td>
        <td>Space in pixels between each item placed into this Multiple Gap</td>
    </tr>
    <tr>
        <td>Stretch images?</td>
        <td>In case of Source type set to "images", indicates if images have to be stretched to fit dimensions defined with Item width and Item height</td>
    </tr>
    <tr>
        <td>Item horizontal align</td>
        <td>Indicates how to horizontally align contents within the placeholders</td>
    </tr>
    <tr>
        <td>Item vertical align</td>
        <td>Indicates how to vertically align contents within the placeholders</td>
    </tr>
    <tr>
        <td>Maximum item count</td>
        <td>The amount of items that can be put into multiple gap</td>
    </tr>
    <tr>
        <td>Is not an activity</td>
        <td>With this option selected addon is not an activity, therefore it doesn't mark (in)correct answers and it doesn't return score points (maximum, score and error count)</td>
    </tr>
    <tr>
        <td>Number of repetitions</td>
        <td>This option allows you to define the number of elements needed for the answer to be deemed correct. It doesn't matter which elements have been inserted.</td>
    </tr>
    <tr>
        <td>ID repeated element</td>
        <td>This property allows you to define the element to show when the show answers mode is active.</td>
    </tr>
    <tr>
        <td>Block wrong answers</td>
        <td>With this option checked, wrong answers are removed and the "on wrong" event is sent.</td>
    </tr>    
    <tr>
        <td>Wrap items</td>
        <td>With this option checked, all elements are wrapped in columns or rows depending on the orientation property selected.</td>
    </tr>
</table>

## Supported commands

<table border='1'>
    <tr>
        <th>Command name</th>
        <th>Params</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>countItems</td>
        <td>---</td>
        <td>Returns the current number of item places in a gap</td>
    </tr>
<tr>
        <td>isAllOK</td>
        <td>---</td>
        <td>Returns true if all answers are selected correctly and there are no mistakes, otherwise false.</td>
    </tr>
<tr>
        <td>isAttempted</td>
        <td>---</td>
        <td>Returns true if there is at least one item in a gap</td>
    </tr>
</table>

##Show Answers

This module is fully compatible with [Show Answers module](/doc/page/Show-Answers "Show Answers module") and displays correct answers when a relevant event is sent.

## Advanced Connector integration
Each command supported by the Multiple Gap addon can be used in the Advanced Connector addon scripts. The below example shows how to display current items count in the Text module.

    EVENTSTART
    Source:Multiple_Gap_Development1
    SCRIPTSTART
        var gap = presenter.playerController.getModule('multiplegap1');
        var text1 = presenter.playerController.getModule('Text1');
        var itemsCount = gap.countItems();
        text1.setText('Items count: ' + itemsCount);
    SCRIPTEND
    EVENTEND

## Scoring
By default, the Multiple Gap addon allows to create exercises as well as activities. To set a module in a non-excercise mode, it is necessary to set the 'Is not an activity' property. If the addon is not in an excercise mode, all of the below methods return 0!

<table border='1'>
    <tr>
        <th>Property</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>maxScore</td>
        <td>Number of answer items</td>
    </tr>
    <tr>
        <td>score</td>
        <td>1 point for each correctly inserted element</td>
    </tr>
    <tr>
        <td>errorCount</td>
        <td>1 error point for each incorrectly inserted element</td>
    </tr>
</table>

## Events
Multiple Gap sends events compatible with both [Connector](/doc/page/Connector) and [Advanced Connector](/doc/page/Advanced-Connector) modules.  When an element is added or removed, it sends an event with following arguments:

<table border='1'>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Item</td>
        <td>added item's ID, specified in the same way as in the Items property</td>
    </tr>
    <tr>
        <td>Value</td>
        <td>"add" if an element has been added, "remove" if an element has been removed</td>
    </tr>
    <tr>
        <td>Score</td>
        <td>always "1"</td>
    </tr>
</table>

When a user properly places all items without any error, the addon sends the 'ALL OK' event. This event is different from a normal event so its structure is shown below.

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

## CSS Classes

<table border='1'>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>.multiplegap_container</td>
        <td>Outer container of a whole Addon</td>
    </tr>
    <tr>
        <td>.multiplegap_active</td>
        <td>Outer container of a whole Addon when Source List or Image Source was clicked and Addon is waiting for users activity</td>
    </tr>
    <tr>
        <td>.multiplegap_inactive</td>
        <td>Outer container of a whole Addon in error checking mode and not waiting for users activity</td>
    </tr>
    <tr>
        <td>.multiplegap_placeholders</td>
        <td>Outer container of a box where contents are put, by default it is invisible but it can be used for instance to make margin between contents and inner border of the outer container.</td>
    </tr>
    <tr>
        <td>.multiplegap_container .placeholder</td>
        <td>Container of each content put into Addon, regardless of its type.</td>
    </tr>
    <tr>
        <td>.multiplegap_container .placeholder_valid</td>
        <td>In errors check mode, container of content that is valid.</td>
    </tr>
    <tr>
        <td>.multiplegap_container .placeholder_invalid</td>
        <td>In errors check mode, container of content that is invalid.</td>
    </tr>
    <tr>
        <td>.multiplegap_container .placeholder img</td>
        <td>If Source type is set to "images", that indicates image tag of image placed into the Addon</td>
    </tr>
    <tr>
        <td>.multiplegap_container .placeholder p</td>
        <td>If Source type is set to "images", that indicates paragraph tag of text contents placed into the Addon</td>
    </tr>
    <tr>
        <td>.placeholder-show-answers</td>
        <td>Added to element when Show Answers is active</td>
    </tr>
</table>

### Examples

**1.1. Inset shadow, yellow background when active, inner margin to separate placeholders from inset shadow**  

    .multiplegap_inset {
    }

    .multiplegap_inset .multiplegap_container {
        background: #f0f0f0;
        border-radius: 4px;
        box-shadow:inset 1px 1px 8px #000000;
    }

    .multiplegap_inset .multiplegap_placeholders {
        position: absolute;
        top: 16px;
        left: 16px;
        right: 16px;
        bottom: 16px;
    }

    .multiplegap_inset .multiplegap_active {
        background: #F2D99C;
    }

    .multiplegap_inset .multiplegap_container .placeholder {
        background: #fff;
        border: 1px solid #000;
        border-radius: 4px;
    }

    .multiplegap_inset .multiplegap_container .placeholder_valid {
        color: #00ff00;
    }

    .multiplegap_inset .multiplegap_container .placeholder_invalid {
        color: #ff0000;
    }

**1.2. Simple border, small inneer margin**

    .multiplegap_simple {
    }

    .multiplegap_simple .multiplegap_container {
        border: 1px solid #000;
        border-radius: 4px;
        background: #f0f0f0;
    }

    .multiplegap_simple .multiplegap_placeholders {
        position: absolute;
        top: 8px;
        left: 8px;
        right: 8px;
        bottom: 8px;
    }

    .multiplegap_simple .multiplegap_active {
        background: #F2D99C;
    }

## Demo presentation
[Demo presentation](/embed/4903674326286336 "Demo presentation") contains examples of how this addon can be used.                