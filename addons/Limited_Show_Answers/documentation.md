## Description

Limited Show Answers is a module that allows users to view the correct answers in the specified modules. 

Limited Show Answers module is based on <a href="/doc/page/Show-Answers">Show Answers </a>module. In addition to its base module, Limited Show Answers has some additional rules and functions:

* when the Show Answers module is selected, all Limited Show Answers modules are also selected
* all Limited Show Answers modules are also disabled in the error checking mode, triggered by Check Answers module
* selecting one Limited Show Answers module will not select the Show Answers module or any other Limited Show module
* selecting one Limited Show Answers module will deactivate the error checking mode on dependent modules covered by Limited Check Answer module
* selecting one Limited Check Answer module will deactivate the show answers mode on dependent modules covered by Limited Check Answers and Check Answers modules

<div style="border:1px solid Tomato; padding:5px; margin-bottom:21px;">
Note: Limited Show Aswers module and Limited Check must cover the same modules.
</div>

## Properties

<table border='1'>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Text</td>
        <td>Text displayed on the button.</td>
    </tr>
    <tr>
        <td>Text selected</td>
        <td>Text displayed on the button when it's selected.</td>
    </tr>
    <tr>
        <td>Increment check counter</td>
        <td>When this option is selected, check counter will be increased while showing answers.</td>
    </tr>
	<tr>
        <td>Increase mistake counter</td>
        <td>When this option is selected, mistake counter will be increased while showing answers.</td>
    </tr>
    <tr>
        <td>Works with</td>
        <td>List of modules connected to Limited Check module. Each line should consist of separate modules' IDs.</td>
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
        <td>Hides the module.</td>
    </tr>
    <tr>
        <td>show</td>
        <td>---</td>
        <td>Shows the module.</td>
    </tr>
    <tr>
        <td>getWorksWithModulesList</td>
        <td>---</td>
        <td>Gets list of modules configured in "Works With" property.</td>
    </tr>
</table>

## Advanced Connector integration

Each command supported by the Show Answers module can be used in the Advanced Connector's scripts. The below example shows how it interacts with the module Next.

    EVENTSTART
        Name:AllAttempted
    SCRIPTSTART
        var limitedShowAnswers = presenter.playerController.getModule('Limited_Show_Answers1');
        showAnswers.show();
    SCRIPTEND
    EVENTEND
	
	EVENTSTART
        Name:NotAllAttempted
	SCRIPTSTART
        var limitedShowAnswers = presenter.playerController.getModule('Limited_Show_Answers1');
        showAnswers.hide();
	SCRIPTEND
	EVENTEND

## Events
Limited Show Answers sends events compatible with [Advanced Connector](/doc/page/Advanced-Connector). 

It sends <b>ValueChanged</b> event when a user selects the button.

<table border='1'>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Value</td>
        <td>
            LimitedShowAnswers - it is sent when a user selects the button.<br />
            LimitedHideAnswers - it is sent when a user deselects the button.
        </td>
    </tr>
    <tr>
        <td>Source</td>
        <td>Module ID of Limited Show Answers module</td>
    </tr>
    <tr>
        <td>Item</td>
        <td>["module1", "module2", "module3"] - an array of modules connected to Limited Check module as JSON object</td>
    </tr>
</table>

## CSS Classes

<table border='1'>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
	<tr>
        <td>.limited-show-answers-wrapper</td>
        <td>The outer wrapper of the whole module.</td>
    </tr>
    <tr>
        <td>.limited-show-answers-container</td>
        <td>The inner container of the whole addon.</td>
    </tr>
    <tr>
        <td>.limited-show-answers-button</td>
        <td>Button element</td>
    </tr>
</table>

`.limited-show-answers-wrapper` may have additional properties `selected` or `disabled`. The disabled module is simultaneously selected.

### Default Styling

<pre>
.limited-show-answers-wrapper,
.limited-show-answers-wrapper .limited-show-answers-container,
.limited-show-answers-wrapper .limited-show-answers-container .limited-show-answers-button {
    width: 100%;
    height: 100%;
}

.limited-show-answers-wrapper .limited-show-answers-container .limited-show-answers-button {
    background: url('resources/show-answers-button.png') no-repeat center;
    cursor: pointer;
    text-align: center;
}
</pre>

## Demo presentation
<a href="https://www.mauthor.com/embed/5358261977743360">Demo presentation</a> contains examples of how to use this module. 