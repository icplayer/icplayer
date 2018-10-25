## Description
Animated Lesson Progress is a module that allows users to display images assigned to the percentage score of the whole lesson.  

## Properties

<table border='1'>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>

    <tr>
        <td>Ranges</td>
        <td>List of ranges. Each range consists of 'Image' and 'Score' which is the maximum percentage score for the image.
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
        <td>Hides the Addon.</td>
    </tr>
    <tr>
        <td>show</td>
        <td>---</td>
        <td>Shows the Addon.</td>
    </tr>
</table>


## Advanced Connector integration
Each command supported by the Animated Lesson Progress module can be used in the Advanced Connector addon's scripts. The below example shows how to show or hide the addon accordingly to the Double State Button module's state.

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
        <td>animated-lesson-progress-wrapper</td>
        <td>DIV wrapping the Addon's elements</td>
    </tr>
    <tr>
        <td>animated-lesson-progress-rate</td>
        <td>DIV containing additional image for the percentage score</td>
    </tr>  
</table>

## CSS Example

<pre>
.animated_lesson_progress_fixed_dimension {
}

.animated_lesson_progress_fixed_dimension .animated-lesson-progress-wrapper img {
	width: 100px;
	height: 100px;
}
</pre>


The above example shows how to set a fixed dimension of images.

## Demo presentation
[Demo presentation](/embed/5005850835943424 "Demo presentation") contains examples on how to use the Animated Lesson Progress addon.                                   