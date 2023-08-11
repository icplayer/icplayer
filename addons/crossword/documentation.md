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
			<li><b>none</b> &ndash; don't put any word numbers</li>
		</ul>
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
	<tr>
        <td>Show all answers in gradual show answers mode</td>
        <td>Show all answers at once using gradual show answers functionality. Without checking this option, the gradual show answers functionality reveals the answers one by one.</td>
    </tr>
	<tr>
        <td>Auto navigation</td>
        <td>Auto navigation for editable cells in a crossword.

            Auto navigation uses an algorithm that, based on data (such as the currently selected cell in the crossword, neighboring cells, and the user's last action), determines the direction of cursor movement when the user attempts to fill in the crossword cell. The rules of the algorithm are described below.
			
			There are three directions of movement for auto navigation:
			<ul>
				<li><b>horizontal</b></li>
				<li><b>vertical</b></li>
				<li><b>TabIndex direction</b> &ndash; see description below</li>
			</ul>

			Auto navigation modes:
			<ul>
				<li><b>Extended</b> &ndash; Auto navigation works in any of the directions listed above. In this mode, if there is no next editable cell for the crossword then auto navigation will not point to the next cell. This is the default mode.</li>
				<li><b>Simple</b> &ndash; Auto navigation works in vertical and horizontal directions. In this mode, if there is no next editable cell for the currently filled in word, then auto navigation will not point to the next cell.</li>
				<li><b>Off</b> &ndash; Auto navigation is turned off.</li>
			</ul>
		</td>
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
        <td>Returns true when all cells are filled in correctly, otherwise false.</td>
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
        <td><em>Number of the word</em></td>
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


Advanced Connector example:

<pre>
EVENTSTART
Name:CorrectWord
Source:crossword1
SCRIPTSTART

presenter.playerController.getModule('feedback1').change('1');

SCRIPTEND
EVENTEND
</pre>


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
        <td>Indicates the look of cells in a particular row where X is its index (counted from the top left, the first row is 0).</td>
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

### CSS classes for printable

CSS classes for the printable version of the addon have the same names as in the original version but with the prefix `printable_`. 
For example `printable_cell_container_letter` is equivalent to `cell_container_letter` in the printable version. 
Like the original classes should be defined by providing a path where the first name is `printable_crossword_container`, e.g. ```.printable_crossword_container .printable_cell_container_letter```.

The new CSS classes include:

<table border='1'>
<tbody>
    <tr>
        <th>Class name</th>
        <th>Description</th> 
    </tr>
    <tr>
        <td>.printable_crossword_container .printable_cell_letter_content</td>
        <td>Indicates the look of fields that are used to capture answers written by a user (in their default state).</td> 
    </tr>
    <tr>
        <td>.printable_crossword_container .printable_sign_valid</td>
        <td>Indicates the look of fields that are used to show valid sign for the correct answer given by the user. The sign is set as ::after class.</td> 
    </tr>
    <tr>
        <td>.printable_crossword_container .printable_sign_invalid</td>
        <td>Indicates the look of fields that are used to show invalid sign for the wrong answer given by the user. The sign is set as ::after class.</td> 
    </tr>
</tbody>
</table>

### Examples

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


## Auto navigation algorithm

In order to better understand the algorithm, a legend has been created with a description of the elements. 

Legend:
<table border="1">
	<tbody>
		<tr>
			<th>Name</th>
			<th>Description</th>
		</tr>
		<tr>
			<td><b>blank cell</b></td>
			<td>Cell that does not belong to the crossword.</td>
		</tr>
		<tr>
			<td><b>constant cell</b></td>
			<td>Cell with initial, non-editable value.</td>
		</tr>
		<tr>
			<td><b>editable cell</b></td>
			<td>Editable cell.</td>
		</tr>
		<tr>
			<td><b>current word</b></td>
			<td>One of the words whose <b>editable cell</b> is pointed to by the cursor. The <b>current word</b> consists only of <b>editable cells</b> and <b>constant cells</b>.</td>
		</tr>
		<tr>
			<td><b>TabIndex direction</b></td>
			<td>Direction for the auto navigation cursor to point to the next <b>editable cell</b> to the right, regardless of whether the next cell belongs to the same word. If movement in the right direction is not possible then cursor is moved to the leftmost <b>editable cell</b> from the next row.</td>
		</tr>
    </tbody>
</table>

Algorithm rules/sequential steps of the algorithm:
<ol>
	<li>If the current direction is horizontal and there is at least one <b>editable cell</b> on the right side in the <b>current word</b>, then move to the first possible <b>editable cell</b> on the right side.</li>
	<li>If the current direction is horizontal and there is not at least one <b>editable cell</b> to the right side in the <b>current word</b>, then move using the <b>TabIndex direction</b>.</li>
	<li>If the current direction is vertical and there is at least one <b>editable cell</b> below it in the <b>current word</b>, then move to the first possible <b>editable cell</b> below it.</li>
	<li>If the current direction is vertical and there is not at least one <b>editable cell</b> below it in the <b>current word</b>, then move using the <b>TabIndex direction</b>.</li>
	<li>If there is at least one <b>editable cell</b> below it in the <b>current word</b>, and if the right cell is an <b>blank cell</b>, then move to the first possible <b>editable cell</b> below it.</li>
	<li>If there is at least one <b>editable cell</b> on the right side in the <b>current word</b>, and if the top cell and the bottom cell are <b>blank cells</b>, then move to the first possible <b>editable cell</b> on the right side.</li>
	<li>If there is at least one <b>editable cell</b> below it in the <b>current word</b>, and if the top cell is an <b>blank cell</b> and the right cell is not an <b>blank cell</b>, then move to the first possible <b>editable cell</b> below it.</li>
	<li>If there is at least one <b>editable cell</b> below in the <b>current word</b>, and if the right cell is not an <b>blank cell</b> that the user has filled in, and the cell at the bottom is not an <b>blank cell</b> that the user has not filled in, then move to the first possible <b>editable cell</b> below.</li>
	<li>If there is at least one <b>editable cell</b> on the right side in the <b>current word</b>, then move to the first possible <b>editable cell</b> on the right side.</li>
	<li>Use the TabIndex direction.</li>
</ol>

<b>Note:</b> The rules of the algorithm are checked from the first rule to the last. This means that rule 1 will be checked first, then rule 2, and so on. If any rule has all conditions satisfied, then the next rules are not checked.

<b>Note:</b> If "Word numbers" property is set to horizontal or vertical, auto-navigation will ignore the algorithm and jump to the next possible horizontal/vertical answer if available.

<b>Note:</b> If the auto-navigation mode does not allow chosen direction, then the navigation will not move cursor to the next cell. For example, if the auto-navigation mode is set to Simple and the direction analysis shows the <b>TabIndex direction</b>, then cursor will not be moved to the next cell.


In short, the following directions are used for the following rules:
<ul>
	<li>1, 6, 9 &ndash; horizontal direction</li>
	<li>3, 5, 7, 8 &ndash; vertical direction</li>
	<li>2, 4, 10 &ndash; <b>TabIndex direction</b></li>
</ul>

## Demo presentation
[Demo presentation](/embed/5522005014085632 "Demo presentation") contains examples on how to use the Crossword addon.                           