## Description

Connector is a special kind of addon that combines multiple addons and modules in fully interactive, responsive exercises. It reports to ValueChanged type events and executes provided script if a received event meets specified conditions.

##Properties

<table border='1'>
<tbody>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Tasks</td>
        <td>List of tasks (scripts) which will be executed when specified conditions occur</td>
    </tr>
    <tr>
        <td>Source</td>
        <td><b>Required!</b> Specifies sources of event (i. e. True/False Addon)</td>
    </tr>
    <tr>
        <td>Item</td>
        <td>Event 'item' field value filter. Blank value means that all values are acceptable</td>
    </tr>
    <tr>
        <td>Value</td>
        <td>Event 'value' field value filter. Blank value means that all values are acceptable</td>
    </tr>
    <tr>
        <td>Score</td>
        <td>Event 'score' field value filter. Blank value means that all values are acceptable</td>
    </tr>
    <tr>
        <td>Script</td>
        <td><b>Required!</b> Script to be executed when incoming event meets conditions</td>
    </tr>
</tbody>
</table>

An example task can look like this:

<table border='1'>
<tbody>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Source</td>
        <td>TrueFalse1</td>
    </tr>
    <tr>
        <td>Item</td>
        <td>*</td>
    </tr>
    <tr>
        <td>Value</td>
        <td>1</td>
    </tr>
    <tr>
        <td>Score</td>
        <td>*</td>
    </tr>
    <tr>
        <td>Script</td>
        <td>text1.setText("Answer for True/False was choosen")</td>
    </tr>
</tbody>
</table>

The above task will be executed for each selection (Value = 1) in the True/False addon with ID TrueFalse1 resulting in setting the Text module text "Answer for True/False was chosen".

<b>Important:</b> If nothing is provided for source, item, value or score, then the connector will try to match the script to execute to an empty text. This is different than using wildcard. Wildcard (*) matches to any characters and empty text matches exactly to empty text. For
example a gap after deselecting may send an empty text as a value to indicate it's current state.

If there are many similar tasks, it's often useful to use wildcard (<b>'*'</b>) character. It replaces zero and more characters and can be used in Item, Value and Score fields. An example task can look like this:

<table border='1'>
<tbody>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Source</td>
        <td>TrueFalse1</td>
    </tr>
    <tr>
        <td>Item</td>
        <td>1-*</td>
    </tr>
    <tr>
        <td>Value</td>
        <td>1</td>
    </tr>
    <tr>
        <td>Score</td>
        <td>*</td>
    </tr>
    <tr>
        <td>Script</td>
        <td>text1.setText("Answer for first question was choosen")</td>
    </tr>
</tbody>
</table>

The above task will be executed when any answer will be made for question 1.

##Supported commands

<table border='1'>
<tbody>
    <tr>
        <th>Command name</th>
        <th>Params</th>
        <th>Description</th>
    </tr>

    <tr>
        <td>-</td>
        <td>-</td>
        <td>-</td>
    </tr>
</tbody>
</table>

##CSS classes

<table border='1'>
    <tbody>
        <tr>
            <th>Class name</th>
            <th>Description</th>
        </tr>
        <tr>
            <td>---</td>
            <td>---</td>
        </tr>
    </tbody>
</table>

Connector addon doesn't expose any CSS classes because its internal structure should not be changed (neither via Advanced Connector nor CSS styles).

## Demo presentation

[Demo presentation](/embed/2447206 "Demo presentation") contains examples of how the Connector addon can be used.           