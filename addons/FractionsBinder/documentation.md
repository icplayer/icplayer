## Description

This addon allows users to create one activity using many Fractions addons. It is very useful for showing fractions greater than 1.

##Properties

<table border='1'>
<tbody>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
<tr>
        <td>Fractions</td>
        <td>A list of Fractions addons. Each row should be composed of an addon ID.</td>
    </tr>
    <tr>
        <td>Correct Elements</td>
        <td>Defines how many elements should be selected in all Fractions addons.</td>
    </tr>
</tbody>
</table>


## Advanced Connector integration
Fractions Binder doesn't support any commands so there is no way to integrate it with Advanced Connector.


## Scoring

<table border='1'>
    <tr>
        <th>Property</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>maxScore</td>
        <td>1</td>
    </tr>
    <tr>
        <td>score</td>
        <td>1 if correct number of parts is selected, otherwise 0</td>
    </tr>
    <tr>
        <td>errorCount</td>
        <td>0 if correct number of parts is selected, otherwise 1</td>
    </tr>
</table>

<strong>It's very important to select the 'Is not an activity' option in all Fractions addons used in the Fractions Binder! Otherwise scoring for the whole page will be counted incorrectly!</strong>

##Demo presentation
[Demo presentation](/embed/5681268832600064"Demo presentation") contains examples of how to use the Fractions addon.              