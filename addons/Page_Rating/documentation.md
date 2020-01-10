## Description
The Page Rating addon allows users to add the rating functionality to their presentations.

## Properties

<table border='1'>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Title Text</td>
        <td>Text that appears as a module title.</td>
    </tr>
    <tr>
        <td>Comment Text</td>
        <td>Text that appears above the comment area.</td>
    </tr>
    <tr>
        <td>Rates</td>
        <td>List of Rates. Each rate consists of two images: 'Deselected' and 'Selected'. 'Selected' image appears when a rate is chosen. Otherwise 'Deselected' image is shown.
<p><em>This property allows online resources. <a href="/doc/page/Online-resources">Find out more »</a></em></p>
</td>
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
        <td>hide</td>
        <td>---</td>
        <td>Hide Addon</td>
    </tr>
    <tr>
        <td>show</td>
        <td>---</td>
        <td>Show Addon</td>
    </tr>
    <tr>
        <td>getRate</td>
        <td>---</td>
        <td>Return rate of selected item</td>
    </tr>
</table>

## Advanced Connector integration
Each command supported by the Page Rating addon can be used in the Advanced Connector addon's scripts. The below example shows how it interacts with TrueFalse modules.

    EVENTSTART
    Source:TrueFalse1
    Item:1-1
    SCRIPTSTART
       var module = presenter.playerController.getModule('Page_Rating3');
       module.show();
    SCRIPTEND
    EVENTEND
    EVENTSTART
    Source:TrueFalse1
    Item:1-2
    SCRIPTSTART
       var module = presenter.playerController.getModule('Page_Rating3');
       module.hide();
    SCRIPTEND
    EVENTEND

## Events
Page Rating sends events compatible with [Advanced Connector](/doc/page/Advanced-Connector). 

It sends an event when a user selects the star.

<table border='1'>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Item</td>
        <td>Rate id</td>
    </tr>
    <tr>
        <td>Value</td>
        <td>0 - unselected | 1 - selected</td>
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
        <td>page-rating-wrapper</td>
        <td>DIV wrapping Addon elements</td>
    </tr>
    <tr>
        <td>page-rating-title</td>
        <td>DIV containing Title Text</td>
    </tr>
    <tr>
        <td>page-rating-rates</td>
        <td>DIV containing rates</td>
    </tr>
    <tr>
        <td>page-rating-comment</td>
        <td>DIV element containing comment text and comment area</td>
    </tr>    
</table>

## Example

    .page-rating-title  {
      background-color: orange;
    }

    .page-rating-rates {
      background-color: blanchedAlmond;
    }

    .page-rating-comment {
      background-color: white;
    }


The above example shows how to change background color in DIVs.

## Demo presentation
[Demo presentation](/embed/4572679782793216 "Demo presentation") contains examples on how to use the Page Rating addon.                       