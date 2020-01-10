## Description
Animated Page Progress is a module that allows users to display images assigned to the percentage score of a page.  

## Properties

<table border='1'>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>

    <tr>
        <td>Ranges</td>
        <td>List of Ranges. Each range consists of 'Image' and 'Score' which is the maximum percentage score for the image.
<p><em>This property allows online resources. <a href="/doc/page/Online-resources">Find out more »</a></em></p>
</td>
    </tr>
    <tr>
        <td>Initial image</td>
        <td>Image to be displayed before there is any interaction with activity modules on a page. If not set, the first rate is displayed.</td>
    </tr>
    <tr>
        <td>Work in Check Mode</td>
        <td>When this option is selected, the module will be updated after clicking the Check button.</td>
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
        <td>Hide the Addon</td>
    </tr>
    <tr>
        <td>show</td>
        <td>---</td>
        <td>Show the Addon</td>
    </tr>
</table>


## Advanced Connector integration
Each command supported by the Animated Page Progress module can be used in the Advanced Connector addon scripts. The below example shows how to show or hide addon accordingly to the Double State Button module's state.

    EVENTSTART
    Source:DoubleStateButton1
    Value:1
    SCRIPTSTART
		var module = presenter.playerController.getModule('Animated_Progress1');
        module.show();
	SCRIPTEND
    EVENTEND
    
	EVENTSTART
    Source:DoubleStateButton1
    Value:0
    SCRIPTSTART
		var module = presenter.playerController.getModule('Animated_Progress1');
        module.hide();
	SCRIPTEND
    EVENTEND


## CSS classes

<table border='1'>
    <tr>
        <th>Class name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>animated-page-progress-wrapper</td>
        <td>DIV wrapping the Addon's elements</td>
    </tr>
    <tr>
        <td>animated-page-progress-rate</td>
        <td>DIV containing additional image for the percentage score</td>
    </tr>  
    <tr>
        <td>rate-&lt;rate_number&gt;</td>
        <td>Additional class for animated-page-progress-rate elements specifying for which range it's displayed. Rate numbers are counted from 1</td>
    </tr>  
    <tr>
        <td>rate-initial</td>
        <td>Additional class for animated-page-progress-rate element displaying initial image</td>
    </tr>
</table>

## Example
    .animated-page-progress-rate {
      background-color: black;
    }

The above example shows how to change the background color in DIVs.

## Demo presentation
[Demo presentation](/embed/5666018821144576 "Demo presentation") contains examples on how to use the Animated Page Progress addon.                                