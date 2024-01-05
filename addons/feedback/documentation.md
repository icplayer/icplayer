## Description

The Feedback module allows to give some feedback messages or hints to the user.

It is entirely controlled by using [scripts](Addon-Scripting). It means that it does not act automatically and it is necessary to launch a command to display a feedback message, later referred as response.

There are three categories (statuses) of responses: positive, neutral and negative. You can define arbitrary amount of responses and each of them has to belong to one of the categories mentioned above. Each response is referenced with its unique identifier.

The Contents of the response can contain anything that a regular text module can display, including images, HTML formatting and mathematical formulas.

## Properties

<table border="1">
  <tbody>
    <tr>
      <th>Property
name</th>
      <th>Description</th>
    </tr>
    <tr>
      <td>Responses</td>
      <td>List of feedback messages<br /><br />
Each of them has the following parameters:
<ul>
<li><b>Unique Response ID</b> &ndash; Unique identifier that is later used to display this message</li>
<li><b>Status</b> &ndash; T for True (positive) message,
        N for neutral message,
        F for False (negative) message.</li>
<li><b>Text</b> &ndash; message contents</li>
</ul>
</td>
    </tr>
    <tr>
      <td>Default response</td>
      <td>Contents of default response, displayed when the module is loaded. Default response is treated as neutral</td>
    </tr>
    <tr>
      <td>Preview response ID</td>
      <td>Used only in editor to preview responses during editing. If not empty and contains a valid Unique Response ID, the module will display the response preview referenced with that ID instead of a default one</td>
    </tr>
    <tr>
      <td>Reset response on a page change</td>
      <td>If set to true, after a page changes, module contents will always be reset to the default response. In other case, a module state will be restored</td>
    </tr>
    <tr>
      <td>Fade transitions</td>
      <td>If set to true, the module will apply an easy "fade in/fade out" transition effect while switching between responses</td>
    </tr>
    <tr>
      <td>Center horizontally</td>
      <td>Indicates if contents should be centered horizontally. Note: uses absolute positioning</td>
    </tr>
    <tr>
      <td>Center vertically</td>
      <td>Indicates if contents should be centered vertically. Note: uses absolute positioning</td>
    </tr>
    <tr>
      <td>Is not an activity</td>
      <td>If set to true, when a presentation enters an error checking mode, the addon will not reset a response to the default one</td>
    </tr>
    <tr>
      <td>Mute</td>
      <td>If set to true, TTS will no longer read the feedback in response to a command call, such as change(id), or setDefaultResponse(). It will still be possible to read the content of the addon using TTS by selecting it with keyboard navigation and pressing Enter.</td>
    </tr>
  </tbody>
</table>

## Configuration

In order to configure a minimal implementation of the module, you have to:

* Define at least one response by filling the “Responses” property.

## Supported commands

<table border='1'>
    <tr>
        <th>Command name</th>
        <th>Params</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>next</td>
        <td>---</td>
        <td>Change a displayed response to the next one (or first if the default response was displayed)</td>
    </tr>
    <tr>
        <td>previous</td>
        <td>---</td>
        <td>Change a displayed response to the previous one (if default response was not displayed)</td>
    </tr>
    <tr>
        <td>setDefaultResponse</td>
        <td>---</td>
        <td>Displays default response</td>
    </tr>
    <tr>
        <td>change</td>
        <td>responseID</td>
        <td>Change displayed response to one with given ID</td>
    </tr>
<tr>
        <td>show</td>
        <td>---</td>
        <td>Shows the addon if hidden</td>
    </tr>
<tr>
        <td>hide</td>
        <td>---</td>
        <td>Hides the addon if visible</td>
    </tr>
</table>

## Advanced Connector integration
Each command supported by the Feedback addon can be used in the Advanced Connector addon's scripts. The below example shows how to react on Text module gap content changes (i.e. throughout putting in it elements from Source List) and change displayed response.

        EVENTSTART
        Source:Text2
        Score:1
        SCRIPTSTART
            var feedback = presenter.playerController.getModule('feedback1');
            feedback.setDefaultResponse();
        SCRIPTEND
        EVENTEND
        EVENTSTART
        Source:Text2
        Score:0
        SCRIPTSTART
            var feedback = presenter.playerController.getModule('feedback1');
            feedback.change('WRONG');
        SCRIPTEND
        EVENTEND

## CSS classes

<table border='1'>
<tbody>
    <tr>
        <th>Class name</th>
        <th>Description</th> 
    </tr>
    <tr>
        <td>.feedback_container .response</td>
        <td>indicates style that apply to all responses</td> 
    </tr>
    <tr>
        <td>.feedback_container .response.visible</td>
        <td>indicates style that apply to currently visible response</td>
    </tr>
    <tr>
        <td>.feedback_container .default_response</td>
        <td>indicates style that apply to default response</td> 
    </tr>
    <tr>
        <td>.feedback_container .neutral_response</td>
        <td>indicates style that apply to neutral responses</td> 
    </tr>
    <tr>
        <td>.feedback_container .true_response</td>
        <td>indicates style that apply to true responses</td> 
    </tr>
    <tr>
        <td>.feedback_container .false_response</td>
        <td>indicates style that apply to false responses</td> 
    </tr>
    <tr>
        <td>.feedback_container .response_inner</td>
        <td>internal container closest to the content, it is always inside one of the classes mentioned above</td> 
    </tr>
</tbody>
</table>

###Examples

**Display red text on false responses:**  

    .feedback_redtext {
    }

    .feedback_redtext .feedback_container .false_response {
        color: #ff0000;
    }

## Demo presentation
[Demo presentation](/embed/2420208 "Demo presentation") contains examples of how to use the Feedback addon.       