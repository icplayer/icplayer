## Description

Lesson Progress enables you to insert a ready-made Lesson progress bar indicating the percentage progress made in a lesson together with correct answers, checks, maximum score and errors/mistakes. It is possible to enable or disable each of these properties.

## Properties

<table border='1'>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Show Progress Bar</td>
        <td>Progress bar that shows the percentage progress made in a lesson.</td>
    </tr>
    <tr>
        <td>Show Checks</td>
        <td>Shows how many times a user has checked the correctness of given answers.</td>
    </tr>
    <tr>
        <td>Show Correct Answers</td>
        <td>Shows the number of correct answers.</td>
    </tr>
    <tr>
        <td>Show Errors</td>
        <td>Shows the number of errors made at this time.</td>
    </tr>
    <tr>
        <td>Show mistakes</td>
        <td>Shows the number of mistakes made when the activity was being checked.</td>
    </tr>
    <tr>
        <td>Show All Answers</td>
        <td>Shows the maximum score obtained in a lesson. </td>
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
        <td>Shows the Addon</td>
    </tr>
    <tr>
        <td>getLessonProgress</td>
        <td>---</td>
        <td>Returns lesson progress.</td>
    </tr>
    <tr>
        <td>getLessonScore</td>
        <td>---</td>
        <td>Returns lesson score.</td>
    </tr>
    <tr>
        <td>getLessonMaxScore</td>
        <td>---</td>
        <td>Returns max lesson score.</td>
    </tr>
    <tr>
        <td> getLessonMistakes </td>
        <td>---</td>
        <td>Returns the number of all mistakes made in lesson.</td>
    </tr>
    <tr>
        <td> getLessonChecks </td>
        <td>---</td>
        <td>Returns the number of checks.</td>
    </tr>
    <tr>
        <td> getLessonErrors </td>
        <td>---</td>
        <td>Returns the number of errors made in a lesson.</td>
    </tr></table>

## Advanced Connector integration
Each command supported by the Lesson Progress addon can be used in the Advanced Connector addon's scripts. The below example shows how it interacts with Double State Button modules.

    EVENTSTART
    Source:TrueFalse1
    Item:1-1
    SCRIPTSTART
       var module = presenter.playerController.getModule('Lesson_Progress1');
       module.show();
    SCRIPTEND
    EVENTEND
    EVENTSTART
    Source:TrueFalse1
    Item:1-2
    SCRIPTSTART
       var module = presenter.playerController.getModule('Lesson_Progress1');
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
        <td>.lesson-progress-container</td>
        <td>DIV element being container for Addon elements</td>
    </tr>   
    <tr>
        <td>.lesson-progress-container .progress-bar-container</td>
        <td>DIV element being container for bar elements</td>
    </tr>
    <tr>
        <td>.lesson-progress-container .progress-bar</td>
        <td>DIV element containing progress bar</td>
    </tr>
    <tr>
        <td>.lesson-progress-container .progress-text</td>
        <td>DIV element containing text in progress bar</td>
    </tr>
    <tr>
        <td>.lesson-progress-container .progress-box</td>
        <td>DIV elements for Correct, Max Score, Mistakes, Checks and Errors boxes</td>
    </tr>    
</table>

## Example
 **1.1.Lesson progress — progress-bar**   
.lesson-progress-container .progress-bar {<br/>
    background-color: #3CC6CD;   
    position: absolute;<br/>
    height: 50px;<br/>
    border-radius: 5px;<br/>
}
## Demo presentation
[Demo presentation](/embed/5185066027188224 "Demo presentation") shows examples on how to use the Lesson progress addon.                                   