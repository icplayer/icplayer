## Description
This addon allows users to add timer to the presentation.

## Properties

<table border='1'>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Is visible</td>
        <td>Enables to hide or show the module.</td>
    </tr>
    <tr>
        <td>Mode</td>
        <td>Here you can choose a mode you wish to use: a Timer will count time from the defined to 0, a Stopwatch will count time up from zero.</td>
    </tr>
    <tr>
        <td>Time</td>
        <td>Time in MM:SS format (it can also be H:MM:SS). This property is optional for Stopwatch mode.</td>
    </tr>
    <tr>
        <td>Immediate start</td>
        <td>If selected the timer will start on page load</td>
    </tr>
    <tr>
        <td>Send event every second</td>
        <td>If selected the addon will send a ValueChanged event every second</td>
    </tr>
    <tr>
        <td>Show hours</td>
        <td>If selected the addon shows the hour</td>
    </tr>
    <tr>
        <td>Enable reset</td>
        <td>If selected the reset command will reset the addon, if not the addon will not react on any reset</td>
    </tr>
    <tr>
        <td>Speech texts</td>
        <td>Sets the values of speech texts - predefined phrases providing additional context while using the module in the TTS mode. Speech texts are always read using the content's default language.</td>
    </tr>
</table>

## Events
The Timer Addon sends the ValueChanged type events every second if “Send event every second” option is selected.

<table border='1'>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>value</td>
        <td>MM:SS (or H:MM:SS)</td>
    </tr>
</table>

When in the timer mode the time reaches zero an event is also send.

<table border='1'>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>value</td>
        <td>end</td>
    </tr>
</table>

When in the stopwatch mode the time reaches the value defined in the “Time” property an event is also send.

<table border='1'>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>value</td>
        <td>time</td>
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
        <td>show</td>
        <td>---</td>
        <td>Shows the addon.</td>
    </tr>
    <tr>
        <td>hide</td>
        <td>---</td>
        <td>Hides the addon.</td>
    </tr>
    <tr>
        <td>reset</td>
        <td>---</td>
        <td>Resets the addon (if the option “Enable reset” is selected).</td>
    </tr>
    <tr>
        <td>getTime</td>
        <td>---</td>
        <td>Returns the current time from the addon in MM:SS format (or H:MM:SS)</td>
    </tr>
    <tr>
        <td>addTime</td>
        <td>time</td>
        <td>Adds to the current time the given value (in seconds). Negative value reduces the time.</td>
    </tr>
    <tr>
        <td>setTime</td>
        <td>time</td>
        <td>Changes the current time to the given value (in MM:SS or H:MM:SS format)</td>
    </tr>
    <tr>
        <td>start</td>
        <td>---</td>
        <td>Starts the timer.</td>
    </tr>
    <tr>
        <td>stop</td>
        <td>---</td>
        <td>Stops the timer.</td>
    </tr>
</table>

## CSS classes

<table border='1'>
    <tr>
        <th>Class name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>.timer-wrapper</td>
        <td>DIV containing the whole addon</td>
    </tr>
    <tr>
        <td>.hours</td>
        <td>SPAN containing the hours part of the time</td>
    </tr>
    <tr>
        <td>.minutes</td>
        <td>SPAN containing the minutes part of the time</td>
    </tr>
    <tr>
        <td>.seconds</td>
        <td>SPAN containing the seconds part of the time</td>
    </tr>
    <tr>
        <td>.separator</td>
        <td>SPAN containing the separator</td>
    </tr>
    <tr>
        <td>.hour-separator</td>
        <td>Additional class for the separator between hours and minutes</td>
    </tr>
    <tr>
        <td>.minutes-separator</td>
        <td>Additional class for the separator between minutes and seconds</td>
    </tr>
</table>
 
## Demo presentation

[Demo presentation](/embed/6565715507937280 "Demo presentation") contains examples showing how this addon can be used.      