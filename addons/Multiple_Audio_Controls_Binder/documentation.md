## Description
Multiple Audio Controls Binder is a special kind of addon, which controls multiple [Audio](/doc/page/Audio "Audio") and [MultiAudio](/doc/page/MultiAudio "MultiAudio")  playbacks based on user interactions via [Double State Button](/doc/page/Double-State-Button "Double State Button") addons. The only thing that user has to provide is the information which Audio addon is controlled by which Double State Buttons.

## Properties

<table border='1'>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Connections</td>
        <td>List of connections between Audio and Double State Button addons. Each row should be composed of Audio ID, '|' character and Double State Button ID. When using MultiAudio, row should have additional '|' character and the item number from MultiAudio.</td>
    </tr>
</table>

## Sample configuration

    Audio1|Double_State_Button1
    Audio2|Double_State_Button2
    Audio3|Double_State_Button3
    Audio4|Double_State_Button4

This configuration matches 4 Audio addons with 4 Double State Buttons.

    Audio1|Double_State_Button1
    Audio2|Double_State_Button2
    MultiAudio1|Double_State_Button3|1
    MultiAudio1|Double_State_Button4|2

This configuration matches 2 Audio addons with 2 Double State Buttons and 1 MultiAudio addon with 2 Double State Buttons.

## Behavior
There are few specifications that rule the addon's behavior:

* if user enters wrong Double State Button ID, there will be no errors displayed but an exception will be raised when user comes back to the page
* if user enters wrong Audio ID and tries to play it, there will be an exception thrown to JavaScript console
* whenever user enters the page, each Double State Button will be deselected
* on audio playback end, an associated Double State Button will be deselected
* only one audio can be played at one time
* either Audio and Double State Button events (onEnd, onSelected, onDeselected) can brake control flow and should not be used

## Supported commands

<table border='1'>
    <tr>
        <th>Command name</th>
        <th>Params</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>---</td>
        <td>---</td>
        <td>---</td>
    </tr>
</table>

## Advanced Connector integration
Multiple Audio Controls Binder doesn't support any commands so there is no way to integrate it with Advanced Connector.

## Scoring
Multiple Audio Controls Binder is not an activity module, so there is no scoring present.

##Events
Multiple Audio Controls Binder does not send any events to Event Bus. It only reacts to them.

## CSS classes

<table border='1'>
    <tr>
        <th>Class name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>---</td>
        <td>---</td>
    </tr>
</table>

## Demo presentation
[Demo presentation](/embed/2489555 "Demo presentation") contains examples of how to use Multiple Audio Controls Binder addon.        