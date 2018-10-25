## Description
The Lesson Reset module allows you to reset the lesson score and optionally the number of mistakes and checks.

## Properties

<table border='1'>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Title</td>
        <td>Text that appears as a module title.</td>
    </tr>
    <tr>
        <td>Reset mistakes</td>
        <td>When this option is selected, the number of mistakes will be reset.</td>
    </tr>
    <tr>
        <td>Reset checks</td>
        <td>When this option is selected,the number of checks will be reset.</td>
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
        <td>execute</td>
        <td>---</td>
        <td>Allows calling the module's function by command.</td>
    </tr>
</table>

## Advanced Connector integration

Each command supported by the Lesson Reset module can be used in the Advanced Connector's scripts. The below example shows how it interacts with the Single State Button module.

    EVENTSTART
    Name:ValueChanged
	Source:SingleStateButton1
    SCRIPTSTART
        var lessonReset = presenter.playerController.getModule('LessonReset1');

		lessonReset.show();
    SCRIPTEND
    EVENTEND
	
	EVENTSTART
    Name:ValueChanged
	Source:SingleStateButton2
    SCRIPTSTART
        var lessonReset = presenter.playerController.getModule('LessonReset1');

		lessonReset.hide();
    SCRIPTEND
    EVENTEND

## Events
Lesson Reset does not send any events.

## CSS classes

<table border='1'>
    <tr>
        <th>Class name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>ic_button_lesson_reset</td>
        <td>indicates the look of the Lesson Reset button</td>
    </tr>
    <tr>
        <td>.ic_button_lesson_reset-up-hovering</td>
        <td>indicates the look of the Lesson Reset button while putting a mouse cursor on it</td>
    </tr>
    <tr>
        <td>.ic_button_lesson_reset-down-hovering</td>
        <td>indicates the look of the Lesson Reset button while clicking on it</td>
    </tr>

</table>

### Default Styling

<pre>
.ic_button_lesson_reset {
	background-image	:url('images/reset.png');
	background-repeat	:no-repeat;
	background-position	:center;
	cursor: pointer; 	
}
</pre>   

## Demo presentation
[Demo presentation](/embed/6102884622532608"Demo presentation") contains examples of how to use this module.              