## Description
Automatic Feedback displays feedback messages in various formats (such as as a tooltip or a popup) in response to changes in the addon it is coupled with.
## Properties

<table border='1'>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>ActivityModuleID</td>
        <td>ID of the addon to Automatic Feedback is to work with</td>
    </tr>
    <tr>
        <td>Activity Type</td>
        <td>Either the type of the addon specified in the ActivityModuleID (such as Text, Choice, etc.), or Default if the addon type is not supported</td>
    </tr>
    <tr>
        <td>Correct Feedback</td>
        <td>Variable length list of elements containing two fields. ActivityItem specifies an element of the addon (for instance, a gap in a Text module). It can be a number, a list of numbers separated by commas, or a range separated with a hyphen. Feedback specified what message should be displayed when the answer in the specified element is correct.</td>
    </tr>
    <tr>
        <td>Incorrect Feedback</td>
        <td>Variable length list of elements containing two fields. ActivityItem specifies an element of the addon, as per the Correct Feedback property. Feedback specified what message should be displayed when the answer in the specified element is incorrect.</td>
    </tr>
    <tr>
        <td>Empty Feedback</td>
        <td>Variable length list of elements containing two fields. ActivityItem specifies an element of the addon, as per the Correct Feedback property. Feedback specified what message should be displayed when there is no answer in the specified element.</td>
    </tr>
    <tr>
        <td>Partial Feedback</td>
        <td>Variable length list of elements containing two fields. ActivityItem specifies an element of the addon, as per the Correct Feedback property. Feedback specified what message should be displayed when the answer in the specified element is incomplete, but not incorrect.</td>
    </tr>
    <tr>
        <td>Reset response on a page change</td>
        <td>If set to true, after a page changes, module will set its state to default, resetting all feedback</td>
    </tr>
    <tr>
        <td>Display</td>
        <td>Specifies how the feedback message is to be displayed: within the Automatic feedback addons body ("block"), as a tooltip next to the element ("tooltip"), or as a popup ("popup")</td>
    </tr>
    <tr>
        <td>Display Feedback Buttons</td>
        <td>When set to true, the addon will initially display only a small button, and only when it has been pressed the full feedback message will be shown.</td>
    </tr>
    <tr>
        <td>ReactTo</td>
        <td>Specifies in response to what event should the feedback message be displayed.</td>
    </tr>
    <tr>
        <td>lang Attribute</td>
        <td>Specifies the language used by the TTS while reading the feedback</td>
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
         <td>displayFeedback</td>
         <td>item, type</td>
         <td>Displays the correct/incorrect/empty/partial feedback for the specified item. Type argument should be one of the following values: "correct", "incorrect", "empty", "partial". Item argument should be a number coresponding to the selected element. </td>
     </tr>
    <tr>
        <td>readFeedback</td>
        <td>item, type</td>
        <td>Reads the correct/incorrect/empty/partial feedback for the specified item using the TTS addon. Type argument should be one of the following values: "correct", "incorrect", "empty", "partial". Item argument should be a number coresponding to the selected element. </td>
    </tr>
    <tr>
        <td>displayAndReadFeedback</td>
        <td>item, type</td>
        <td>Displays the correct/incorrect/empty/partial feedback for the specified item as well as reads it using the TTS addon. Type argument should be one of the following values: "correct", "incorrect", "empty", "partial". Item argument should be a number coresponding to the selected element. </td>
    </tr>
     <tr>
         <td>isAllOK</td>
         <td>---</td>
         <td>Returns true if all connections are made correctly and there are no mistakes, otherwise false.</td>
     </tr>
 </table>

## CSS classes

<table border='1'>
    <tr>
        <th>Class name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>correct-feedback</td>
        <td>DIV surrounding the feedback message or the button, when the answer is correct</td>
    </tr>
    <tr>
        <td>incorrect-feedback</td>
        <td>DIV surrounding the feedback message or the button, when the answer is incorrect</td>
    </tr>
    <tr>
        <td>empty-feedback</td>
        <td>DIV surrounding the feedback message or the button, when there is no answer</td>
    </tr>
    <tr>
        <td>partial-feedback</td>
        <td>DIV surrounding the feedback message or the button, when the answer is incomplete, but not incorrect</td>
    </tr>
</table>

> **Note:** The link is an ordinary &lt;a href=""&gt; element and the &lt;a&gt; tag is located between external-link-button-wrapper and external-link-button-element layers.
