## Description
A Page Counter addon allows to add a page counter to a presentation. It's truly useful if you have more than 5 pages presentation.
It can present a current page index and a presentation page count either in normal or reversed order. Additionally, due to the addon's web nature, it allows to fully customize its appearance via CSS styles. For more details on that matter, please see the demo presentation.

## Properties

<table border='1'>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Numericals</td>
        <td>Allows user to choose if the numbers are to be displayed using Western Arabic, Eastern Arabic or Perso-Arabic numericals.</td>
    </tr>

    <tr>
        <td>Start from</td>
        <td>Specifies page number (from 1 to n) from which counting pages in presentation starts over.
            Leaving this property empty sets page counting at the first page.
            For pages before the selected page number, addon will display nothing. Accepts only positive integers.
        </td>
    </tr>

    <tr>
        <td>Omitted pages texts</td>
        <td>List of comma separated indexes (1-based) of pages and text for specified pages. Provided page indexes can't be greater than or equal to
        'Start from' property. For example, setting 'Start from' as 3 and 'Omitted pages texts' as pages "1, 2" with text "Test" will result in displaying the word "Test" on presentation pages 1 & 2.
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
        <td>---</td>
        <td>---</td>
        <td>---</td>
    </tr>
</table>


## CSS classes

<table border='1'>
    <tr>
        <th>Class name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>pagecounter</td>
        <td>Main class containing all Addon content.</td>
    </tr>
</table>

## Demo presentation
[Demo presentation](/embed/2488609 "Demo presentation") showing how to use Page Counter Addon.    