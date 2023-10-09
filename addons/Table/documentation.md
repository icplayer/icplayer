## Description

This addon allows users to add simple tables into presentations. With this functionality, users can easily organize their lessons and presentations.

## Properties

The list starts with the common properties, learn more about them by visiting the [Modules description](https://www.mauthor.com/doc/en/page/Modules-description) section. The other available properties are described below.

<table border='1'>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Rows</td>
        <td>Number of table rows.</td>
    </tr>
    <tr>
        <td>Columns</td>
        <td>Number of table column.s</td>
    </tr>
    <tr>
        <td>Table cells</td>
        <td>List of table cells' content. The Row and Column fields can be comma separated lists of sequential numbers which will result in generating cells that take more than a single cell space (equivalent of HTML colspan and rowspan attributes).
            Each cell can have its own CSS class or inline CSS style. Specifying the dimensions of the cells using these styles is prohibited. To define them, use "Columns width" and "Rows height" properties.</td>
    </tr>
    <tr>
        <td>Columns width</td>
        <td>Defines columns 'width' CSS style. Number of entries should not be higher than the Columns count. Blank entry means that the width of a column (counted as list items) will be set to auto.</td>
    </tr>
    <tr>
        <td>Rows height</td>
        <td>Defines rows' 'height' CSS style. Number of entries should not be higher than the Rows count. Blank entry means that the width of a row (counted as list items) will be set to auto.</td>
    </tr>
    <tr>
        <td>Is not an activity</td>
        <td>When this option is selected, no points and errors are reported in the error checking mode.</td>
    </tr>
    <tr>
        <td>Is disabled</td>
        <td>Allows disabling the module so that the user is not able to interact with it.</td>
    </tr>
    <tr>
        <td>Case sensitive</td>
        <td>When this option is selected, the answers in gaps are case sensitive in the error checking mode.</td>
    </tr>
    <tr>
        <td>Use numeric keyboard</td>
        <td>When enabled, gaps will activate the virtual numeric keyboard on mobile devices when selected. This will also cause the gaps to only accept numeric values.</td>
    </tr>
    <tr>
        <td>Ignore punctuation</td>
        <td>When this option is selected, all non-word characters are omitted when errors are checked.</td>
    </tr>
    <tr>
        <td>Gap width</td>
        <td>Indicates gaps' width in pixels.</td>
    </tr>
    <tr>
        <td>Gap Type</td>
        <td>The property defines the type of gaps to be rendered. The available options are: "editable" or "draggable."</td>
    </tr>
    <tr>
        <td>Gap max length</td>
        <td>
            This property allows defining a maximum amount of chars available to be put in each gap. If this property 
            is set to zero, no restriction will be applied. If a gap's right answer is longer than the Gap max length 
            property, the restriction for this gap will automatically increase to this length. For filled gaps, the 
            length of placeholder is also taken into account in determining the maximum number of characters.
        </td>
    </tr>
</table>

## Gaps

The Table addon allows users to add gaps, known from the [Text module](/doc/page/Text "Text module").
A table gap consists of the following activity types:

* a **drop-down** gap which enables to choose answers from a drop-down menu,
* an **editable** gap that enables to type text manually into it.
* a **draggable** gap which can be filled in with an item selected from a Source list.
* a **math** gap, which is an editable gap working with MathJax.
* a **filled** gap, which is an editable gap with a placeholder.

To insert a gap into a Table cell, enter a simple script into the cell content:

* **editable** and **draggable** gap    
*\gap{orange}* - will result in a gap for which the correct answer is "orange".
For multiple answers, just separate them with '|' sign like this: *\gap{orange|blue|red}*  - will result in a gap for which the correct answers are "orange", "blue" and "red"

* **drop-down** gap    
*{{2:blue|yellow|red}}* – will result in a drop-down menu with "blue", "yellow" and "red" options to choose from.
The first option is always the correct answer, in this case it is "blue". "2" defines the value of a correct answer.

* **math** gap    
Use the editable gap pattern inside MathJax brackets \\( MathJax commands \\). For example: \\( \\frac{1}{\\gap{2}} \\) will render fraction with 1 as the nominator and an editable gap as the denominator, where the correct answer is 2.

Note: Keep in mind that the index of the gap in the module is defined by the order of the gaps written in the LaTeX formula.
To properly navigate between gaps on a page in a situation when you have two gaps – one over another (e.g. integration limits), you should always define the upper limit first.

Example: \\(\\int^\\gap{b}_\\gap{a}f(x)dx\\)

* **filled** gap
If you want a gap with the introductory text (e.g. to be corrected by students), use the filled gap's syntax. For example: \\filledGap{initial text|answer} will render a gap with "initial text" as a placeholder and "answer" as the right answer.

## Calculating gaps index

It's important to know that for each kind of gap (editable, draggable, math) the calculating order is:</br>
<ol><li>First, all editable gaps are counted (both \gap and \filledgap),
<li>Next, drop-down gaps are counted.</li></ol>

Example:</br>

<img src="data:image/png;base64,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"/>

In this case, the getGapText(8) method returns text of a draggable gap, not the last gap.
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
        <td>Shows the module.</td>
    </tr>
    <tr>
        <td>hide</td>
        <td>---</td>
        <td>Hides the module.</td>
    </tr>
    <tr>
        <td>getGapText</td>
        <td>index - 1-based index of gap in table</td>
        <td>Returns gap text entered by user.</td>
    </tr>
    <tr>
        <td>setGapText</td>
        <td>index - 1-based index of gap in table</td> 
        <td>Changes the text inside the gap. Command supported only when "editable" is selected as "Gap Type".</td> 
    </tr>
    <tr>
        <td>getGapValue</td>
        <td>index - 1-based index of gap in table</td>
        <td>Returns gap text entered by user.</td>
    </tr>
    <tr>
        <td>markGapAsCorrect</td>
        <td>index - 1-based index of gap in table</td>
        <td>Mark gap as correct.</td>
    </tr>
    <tr>
        <td>markGapAsWrong</td>
        <td>index - 1-based index of gap in table</td>
        <td>Mark gap as wrong.</td>
    </tr>
    <tr>
        <td>markGapAsEmpty</td>
        <td>index - 1-based index of gap in table</td>
        <td>Mark gap as empty.</td>
    </tr>
    <tr>
        <td>enableGap</td>
        <td>index - 1-based index of gap in table</td>
        <td>Enables gap.</td>
    </tr>
    <tr>
        <td>enableAllGaps</td>
        <td>---</td>
        <td>Enables all gaps.</td>
    </tr>
    <tr>
        <td>disableGap</td>
        <td>index - 1-based index of gap in table</td>
        <td>Disables gap.</td>
    </tr>
    <tr>
        <td>disableAllGaps</td>
        <td>---</td>
        <td>Disables all gaps.</td>
    </tr>
    <tr>
        <td>getView</td>
        <td>---</td>
        <td>Returns HTML element which is the container of the addon.</td>
    </tr>
    <tr>
        <td>isAllOK</td>
        <td>---</td>
        <td>Returns true if all gaps are filled in correctly and there are no mistakes, otherwise false.</td>
    </tr>
    <tr>
        <td>isAttempted</td>
        <td>---</td> 
        <td>Returns true if any gap is filled in. This command will not work properly if the module has the 'Is not an activity' property selected.</td>
    </tr>
</table>

## Advanced Connector integration
Each command supported by the Table addon can be used in the Advanced Connector addon scripts. The below example shows how to show or hide addon accordingly to the Double State Button addon's state.

    EVENTSTART
    Source:DoubleStateButton1
    Value:1
    SCRIPTSTART
        var table = presenter.playerController.getModule('Table1');
        table.show();
    SCRIPTEND
    EVENTEND

    EVENTSTART
    Source:DoubleStateButton1
    Value:0
    SCRIPTSTART
        var table = presenter.playerController.getModule('Table1');
        table.hide();
    SCRIPTEND
    EVENTEND

## Scoring
Table addon allows to create exercises as well as activities. By default addon is in activity mode, so whenever gaps are included it will report points and errors. To disable excercise mode set 'Is not an activity' property. If Addon is not in excercise mode, all of below methods returns 0!

<table border='1'>
    <tr>
        <th>Property</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>maxScore</td>
        <td>number of gaps</td>
    </tr>
    <tr>
        <td>score</td>
        <td>1 for each gap filled correctly</td>
    </tr>
    <tr>
        <td>errorCount</td>
        <td>1 for each gap filled incorrectly, but only if gap is not-empty</td>
    </tr>
</table>

## Events

Table addon sends ValueChanged type events to Event Bus when either gap is changed.

<table border='1'>
    <tbody>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <tr>
            <td>Item</td>
            <td>Modified gap index (1-based)</td>
        </tr>
        <tr>
            <td>Value</td>
            <td>Gap value or "-" sign if no value is selected (default option)</td>
        </tr>
        <tr>
            <td>Score</td>
            <td>1 if new value is correct answer, 0 otherwise</td>
        </tr>
    </tr>
    </tbody>
</table>

Table addon sends ValueChanged type events to Event Bus when all gaps are filled correctly.

<table border='1'>
    <tbody>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <tr>
            <td>Item</td>
            <td>all</td>
        </tr>
        <tr>
            <td>Value</td>
            <td></td>
        </tr>
        <tr>
            <td>Score</td>
            <td></td>
        </tr>
    </tr>
    </tbody>
</table>

##Show Answers

This module is fully compatible with [Show Answers module](/doc/page/Show-Answers "Show Answers module") and displays correct answers when an adequate event is sent.

## CSS classes

<table border='1'>
    <tr>
        <th>Class name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>table-addon-wrapper</td>
        <td>DIV surrounding the table element.</td>
    </tr>
    <tr>
        <td>col_&lt;column number&gt;</td>
        <td>Additional class for every table cell (td) defining in which column the cell is placed. Columns are counted from 1 to Columns (model property).</td>
    </tr>
    <tr>
        <td>row_&lt;row number&gt;</td>
        <td>Additional class for every table cell (td) defining in which row the cell is placed. Rows are counted from 1 to Rows (model property).</td>
    </tr>
    <tr>
        <td>.ic_gap</td>
        <td>Indicates the look of a gap in a table that can be completed by typing the answer into it.</td>
    </tr>
    <tr>
        <td>.ic_gap-correct</td>
        <td>A way of indicating a right answer.</td>
    </tr>
    <tr>
        <td>.ic_gap-wrong</td>
        <td>A way of indicating a wrong answer.</td>
    </tr>
    <tr>
        <td>.ic_gap-empty</td>
        <td>A way of indicating an empty gap.</td>
    </tr>
    <tr>
        <td>.ic_gap-show-answers</td>
        <td>Indicates the look of a gap in the show answers mode.</td>
    </tr>
    <tr>
        <td>.draggable-gap</td>
        <td>Indicates the look of a draggable gap.</td>
    </tr>
    <tr>
        <td>.draggable-gap.gapFilled</td>
        <td>A way of indicating a filled draggable gap.</td>
    </tr>
    <tr>
        <td>.table-addon-wrapper .table-addon-gap-highlight </td>
        <td>A way of indicating that droppable object is over this gap.</td>
    </tr>
</table>

## Examples

.Table_header { }

.Table_header .row_1 {
background-color: #F2BF5B;
font-weight: bold;
}

The above declaration will change the apperance of every cell in the first row which will function as a header.

.Table_custom_cell { }

.Table_custom_cell .row_1.col_2 {
background-color: red;
}

The above declaration will change a background color only for a cell in the first row and the second column.

.Table_not_first { }

.Table_not_first td[class*='row_']:not(.row_1) {
background-color: #F2BF5B;
}

The above declaration will change the apperance of a cell in all rows but first.

.Table_last_row_and_column { }

.Table_last_row_and_column tr:last-child td {
color: red;
}

.Table_last_row_and_column tr td:last-child {
color: red;
}

The above declaration will change a font color in cells that are in the last row and column.

## Keyboard navigation

* Tab – navigate to the next gap.

Dropdown gaps:

* Space – expand the choice options.
* Up/Down arrows – choose an option.
* Enter – accept.

Draggable gaps:

* Space – insert a currently selected item into a gap or remove an item from a gap.

## Demo presentation
[Demo presentation](/embed/4962017162035200 "Demo presentation") contains examples of the Table addon's usage.                                       