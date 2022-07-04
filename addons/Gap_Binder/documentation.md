##Description
#####Addon works with the text and table module. Reads the contents of the gap from the text (and table) module it works with and verifies them. In check errors mode, assign the appropriate classes to the gaps in the text and table modules. In show answers mode, inserts the declared values into the gaps from the text and table module.
##Properties

<table border='1'>
<tbody>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>ID Text (or Table)</td>
        <td>ID of the text module (or Table) it works with. Each identifier is separated by commas.</td>
    </tr>
    <tr>
        <td>Answers</td>
        <td>Entered consecutive values that are correct answers (each line is one answer)</td>
    </tr>
</tbody>
</table>


##Supported commands
<table border='1'>
<tbody>
    <tr>
        <th>Command name</th>
        <th>Params</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>isOK</td>
        <td>(ModuleID,index)</td>
        <td>checks if the gap is correct, returns true / false</td>
    </tr>
    <tr>
        <td>isAllOK()</td>
        <td>-</td>
        <td>sprawdza czy wszystkie gapy są poprawne, zwraca true / false</td>
    </tr>
    <tr>
        <td>isAttempted()</td>
        <td>-</td>
        <td>checks if any of the gaps have been filled, returns true / false</td>
    </tr>
</tbody>
</table>

##Events

<table border='1'>
<tbody>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>ValueChanged</td>
        <td>
            Source: AddonID (gap binder)<br>
            Item: gap_number (according to the order defined in the gap binder)<br>
            Value: gap content<br>
            Score: 1 if correct, 0 if incorrect</td>
    </tr>
    <tr>
        <td>ValueChanged</td>
        <td>
            Source:AddonID (gap bindera)<br>
            Item:all<br>
            Value:-<br>
            Score:-<br>
        </td>
    </tr>
</tbody>
</table>
