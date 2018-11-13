## Description
A Crossword addon allows inserting a Crossword game into a presentation. It's enough to predefine some specific parameters to make it work.

## Properties

<table border="1">
  <tbody>
    <tr>
      <th>Property
name</th>
      <th>Description</th>
    </tr>
    <tr>
      <td>Crossword</td>
      <td>Defines crossword. It has to be written like this:<br />

<pre>
ENGLISH
···O···
·NEVER·
·E·E···
·W·····
</pre>

(in the above example spaces were replaced with dots, use spaces in real environment to indicate blank cells).

In other words, it is just a text representation of a crossword. Spaces indicate blank cells, anything other indicates a place for a letter. You must ensure that the amount of characters in each row is equal (including leading and trailing spaces) and it is equal to the value in the Columns property. Amount of rows has to be equal to the value in the Rows property.

While numbering of words is done automatically, you have to put their descriptions and hints to the user in a separate text module.

If you would like to make a letter visible from start, simply type an exclamation mark before this letter, e.g. in order to put the letters 'E', 'N', and 'G' permanently in the word 'ENGLISH', then the whole word should look like this: '!E!N!GLISH'
</td>
    </tr>
    <tr>
      <td>Columns</td>
      <td>indicates the number of columns in a crossword</td>
    </tr>
    <tr>
      <td>Rows</td>
      <td>indicates the number of rows in a crossword</td>
    </tr>
    <tr>
      <td>Cell width</td>
      <td>indicates particular crossword's cell width, in pixels</td>
    </tr>
    <tr>
      <td>Cell height</td>
      <td>indicates particular crossword's cell height, in pixels</td>
    </tr>
    <tr>
      <td>Blank cells border color</td>
      <td>indicates color of borders that are drawn around blank cells, has to be defined in the way that is used in CSS, e.g. "#ff00ff" or "black"</td>
    </tr>
    <tr>
      <td>Blank cells border style</td>
      <td>indicates style of borders that are drawn around blank cells, has to be defined in the way that is used in CSS - "solid", "dotted" or "dashed"</td>
    </tr>
    <tr>
      <td>Blank cells border width</td>
      <td>indicates width of borders that are drawn around blank cells. Please note that for technical reasons, this value would be multiplied by 2 and interpreted as pixels. Set to 0 to disable blank cells' borders.</td>
    </tr>
    <tr>
      <td>Letter cells border color</td>
      <td>indicates color of borders that are drawn around letter placeholder cells, has to be defined in the way that is used in CSS, e.g. "#ff00ff" or "black"</td>
    </tr>
    <tr>
      <td>Letter cells border style</td>
      <td>indicates style of borders that are drawn around letter placeholder cells, has to be defined in the way that is used in CSS - "solid", "dotted" or "dashed"</td>
    </tr>
    <tr>
      <td>Letter cells border width</td>
      <td>indicates width of borders that are drawn around letter placeholder cells. Please note that for technical reasons, this value would be multiplied by 2 and interpreted as pixels. Set to 0 to disable letter placeholder cells' borders.</td>
    <tr>
    <tr>
      <td>Word numbers</td>
      <td>indicates how words should be automatically numbered:

<ul>
<li><b>both</b> &ndash; put numbers on the first cell of both horizontal & vertical words</li>
<li><b>horizontal</b> &ndash; put numbers on the first cell of horizontal words</li>
<li><b>vertical</b> &ndash; put numbers on the first cell of vertical words</li>
<li><b>none</b> &ndash; don't put any word numbers</li></ul>
<b>Note:</b> Please keep in mind that having chosen the "None" option in this property, the addon is automatically switched to the "Not Activity" mode. In the Crossword addon, points are awarded only for the words numbered with the "Word numbers" property.
</td>
    <tr>
    <tr>
      <td>Marked column index</td>
      <td>If set to a value greater than 0, it indicates the index of a column whose cells should have an additional CSS class "cell_column_marked". The column number is calculated starting from 1,  and 1 means leftmost column in the crossword.</td>
    </tr>
    <tr>
      <td>Marked row index</td>
      <td>If set to a value greater than 0, it indicates the index of a row whose cells should have an additional CSS class "cell_row_marked". The row number is calculated starting from 1,  and 1 means topmost row in the crossword.</td>
    </tr>

    <tr>
        <td>Block wrong answers</td>
        <td>With this option checked, wrong answers are removed and the "on wrong" event is sent.</td>
    </tr>
  </tbody>
</table>

## Supported commands

<table border='1'>
    <tr>
        <th>Command name</th>
        <th>Params</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>isAllOK</td>
        <td>---</td>
        <td>Returns true when all cells are filled in correctly, otherwise false</td>
    </tr>
</table>

## Events

*ValueChanged event*

When a user types a letter into the crossword and leaves the cell, the ValueChanged event is sent.
Its structure is shown below.

<table border='1'>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Item</td>
        <td>[y][x] <em>(where x and y are coordinates of the cell)</em></td>
    </tr>
    <tr>
        <td>Value</td>
        <td><em>inserted letter</em></td>
    </tr>
    <tr>
        <td>Score</td>
        <td>1 <em>if letter is correct</em>, 0 <em>otherwise</em></td>
    </tr>
</table>

*AllOK event*

When a user fills in all cells properly, the addon sends the 'ALL OK' event. This event is different from a normal event so its structure is shown below.

<table border='1'>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Item</td>
        <td>all</td>
    </tr>
    <tr>
        <td>Value</td>
        <td>N/A</td>
    </tr>
    <tr>
        <td>Score</td>
        <td>N/A</td>
    </tr>
</table>

*CorrectWord event*

When a user fills in a correct word, the CorrectWord event is sent.
This event has the following structure:

<table border='1'>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Item</td>
        <td><em>Numer of the word</em></td>
    </tr>
    <tr>
        <td>Value</td>
        <td><em>The correct word</em></td>
    </tr>
    <tr>
        <td>Score</td>
        <td>N/A</td>
    </tr>
</table>


##Show Answers

This module is fully compatible with [Show Answers module](/doc/page/Show-Answers "Show Answers module") and displays correct answers when adequate event is sent.

## eKeyboard integration
It is possible to enter text into cells using the eKeyboard module. 

[See the documentation of eKeyboard module &raquo;](/doc/page/eKeyboard "eKeyboard")


## CSS classes

<table border='1'>
<tbody>
    <tr>
        <th>Class name</th>
        <th>Description</th> 
    </tr>

    <tr>
        <td>.crossword_container .cell_container_blank</td>
        <td>Indicates the look of blank cells, except for their borders which are set using Properties.</td> 
    </tr>

    <tr>
        <td>.crossword_container .cell_container_letter</td>
        <td>Indicates the look of letter placeholder cells, except for their borders which are set using Properties.</td> 
    </tr>

    <tr>
        <td>.crossword_container .cell_letter input</td>
        <td>Indicates the look of input fields that are used to capture answers written by a user (in their default state).</td> 
    </tr>

    <tr>
        <td>.crossword_container .cell_invalid input</td>
        <td>Indicates the look of letter placeholder cells that are used to capture answers written by a user (if Check Answers has been selected and the cell content does not match the answer).</td> 
    </tr>

    <tr>
        <td>.crossword_container .cell_invalid input</td>
        <td>Indicates the look of input fields that are used to capture answers written by a user (if Check Answers has been selected and the cell content does not match the answer).</td> 
    </tr>

    <tr>
        <td>.crossword_container .cell_valid input</td>
        <td>Indicates the look of letter placeholder cells that are used to capture answers written bya  user (if Check Answers has been selected and the cell content matches the answer).</td> 
    </tr>

    <tr>
        <td>.crossword_container .cell_valid input</td>
        <td>Indicates the look of input fields that are used to capture answers written by a user (if Check Answers has been selected and the cell content matches the answer).</td> 
    </tr>

    <tr>
        <td>.crossword_container .cell_AxB</td>
        <td>Indicates the look of a particular cell where A is its horizontal position (counted from the left, the first cell is 0) and B is its vertical position (counted from the top, the first cell is 0).</td>
    </tr>

    <tr>
        <td>.crossword_container .cell_AxB input</td>
        <td>The same as above but refers to the input field inside the cell.</td>
    </tr>

    <tr>
        <td>.crossword_container .cell_column_X</td>
        <td>Indicates the look of cells in a particular column where X is its index (counted from the left, the first column is 0).</td>
    </tr>

    <tr>
        <td>.crossword_container .cell_column_X input</td>
        <td>The same as above but refers to the input field inside the cells.</td>
    </tr>

    <tr>
        <td>.crossword_container .cell_row_X</td>
        <td>Indicates the look of cells in a particular row where X is its index (counted from the top left, the first row is 0)</td>
    </tr>

    <tr>
        <td>.crossword_container .cell_row_X input</td>
        <td>The same as above but refers to the input field inside the cells.</td>
    </tr>

    <tr>
        <td>.crossword_container .cell_column_marked</td>
        <td>Indicates the look of cells in a marked column (please see the "Marked column index" property). Please combine it with other styles to limit the style to particular types of cells (for instance, ".crossword_container .cell_column_marked.cell_letter will change the look of letter cells in the marked column only).</td>
    </tr>

    <tr>
        <td>.crossword_container .cell_row_marked</td>
        <td>Indicates the look of cells in a marked row (please see the "Marked row index" property). Please combine it with other styles to limit the style to particular types of cells (for instance, ".crossword_container .cell_row_marked.cell_letter will change the look of letter cells in the marked row only).</td>
    </tr>

    <tr>
        <td>.crossword_container .word_number</td>
        <td>Indicates the look of a word number.</td> 
    </tr>

    <tr>
        <td>.crossword_cell_show-answers</td>
        <td>Indicates the look of cells in the show answers mode.</td> 
    </tr>

</tbody>
</table>

Please note that in practice, styles related to the cell position (.cell_AxB, .cell_row_X, .cell_column_X) have to be combined with another style that indicates a type of cell, e.g.

* .cell_column_3.cell_letter will apply only to cells with letters in column 4,
* .cell_row_0.cell_blank  will apply only to cells without letters in row 1.

###Examples

**1.1. Make font bigger:**  

    .crossword_bigfont {
    }

    .crossword_bigfont .cell_letter input {
        font-size: 24pt;
    }

**1.2. Green background, only cells with a letters are visible:**  

* Set _Blank cells border width_  to 0
* Set _Letter cells border width_  to 1
* Set _Letter cells border color_  to #aaa

<pre>
.crossword_green {
    background: #D6FFE9;
}

.crossword_green .cell_container_blank {
    background: transparent;
}

.crossword_green .cell_container_letter {
    box-shadow: 5px 5px 2px 2px #ccc;
}

.crossword_green .cell_invalid {
    background: #fff;
}

.crossword_green .cell_invalid input {
    color: #aa0000;
    text-decoration: line-through;
    font-weight: bold;
}
</pre>

## Demo presentation
[Demo presentation](/embed/5522005014085632 "Demo presentation") contains examples on how to use the Crossword addon.                           