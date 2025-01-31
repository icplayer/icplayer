## Description
The Writing Calculations module allows creating writing calculations. You can create multiplication, division, addition, or subtraction activities.

## Properties

The list starts with the common properties, learn more about them by visiting the [Modules description](https://www.mauthor.com/doc/en/page/Modules-description) section. The other available properties are described below.

<table border='1'>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Value</td>
        <td>Simple text to convert. Description of all symbols:
            <table>
                <tr>
                    <th>Symbol</th>
                    <th>Description</th>
                </tr>
                <tr>
                    <td>_ (underscore)</td>
                    <td>empty space</td>
                </tr>
                <tr>
                    <td>= (equality)</td>
                    <td>line</td>
                </tr>
                <tr>
                    <td>[x] (square brackets)</td>
                    <td>input box, x is a number which is correct answer</td>
                </tr>
                <tr>
                    <td>{x} (curly brackets)</td>
                    <td>input help box, x is the default number. 
                        The help box can be defined without a default value. 
                        Unlike input boxes with square brackets, these boxes are not scored.
                    </td>
                </tr>
                <tr>
                    <td>+ (plus)</td>
                    <td>plus</td>
                </tr>
                <tr>
                    <td>- (hyphen)</td>
                    <td>minus</td>
                </tr>
                <tr>
                    <td>: (colon) or ) (right parenthesis)</td>
                    <td>divisibility</td>
                </tr>
                <tr>
                    <td>* (asterisk)</td>
                    <td>multiplication</td>
                </tr>
                <tr>
                    <td># (hash)</td>
                    <td>equals sign</td>
                </tr>
            </table>
        </td>
    </tr>
	<tr>
        <td>Signs</td>
        <td>Here you can change the default sign/symbol assigned to a given type of calculation.
            <table>
                <tr>
                    <th>Name</th>
                    <th>Symbol</th>
                    <th>Default</th>
                </tr>
                <tr>
                    <td>Addition</td>
                    <td>+ (plus)</td>
                    <td>\(+\)</td>
                </tr>
                <tr>
                    <td>Subtraction</td>
                    <td>- (hyphen)</td>
                    <td>\(-\)</td>
                </tr>
                <tr>
                    <td>Division</td>
                    <td>: (colon) or ) (right parenthesis)</td>
                    <td>\(\big)\)</td>
                </tr>
                <tr>
                    <td>Multiplication</td>
                    <td>* (asterisk)</td>
                    <td>\(\times\)</td>
                </tr>
                <tr>
                    <td>Equals</td>
                    <td>= (equality)</td>
                    <td>\(\=\)</td>
                </tr>
            </table>
        </td>
    </tr>
    <tr>
        <td>Styles</td>
        <td>Specifying custom CSS classes and inline styles for the subset of cells:
            <table>
                <tr>
                    <th>Name</th>
                    <th>Description</th>
                </tr>
                <tr>
                    <td>Column</td>
                    <td>Coma-separated numbers of columns to be styled.</td>
                </tr>
				<tr>
                    <td>Row</td>
                    <td>Coma-separated numbers of rows to be styled.</td>
                </tr>
                <tr>
                    <td>Class</td>
                    <td>Additional CSS class for selected cells.</td>
                </tr>
                <tr>
                    <td>Style</td>
                    <td>Inline CSS style for selected cells.</td>
                </tr>
            </table>
        </td>
    </tr>
    <tr>
        <td>Commutativity</td>
        <td>This property allows users to fill in the inputs in any order (changing rows) in case of addition or multiplication. </td>
    </tr>
    <tr>
        <td>Is not activity</td>
        <td>With this option checked, the module is not an activity, therefore it doesn't mark (in)correct answers nor returns score points (maximum score, score, and error count). </td>
    </tr>
    <tr>
        <td>Enable more digits in gap</td>
        <td>Enables to write more digits than one in a gap. </td>
    </tr>
	<tr>
        <td>Use numeric keyboard</td>
        <td>When enabled, gaps will activate the virtual numeric keyboard on mobile devices when selected. This will also cause the gaps only to accept numeric values.</td>
    </tr>
    <tr>
        <td>Show all answers in gradual show answers mode</td>
        <td>If this property is marked, then the Gradual Show Answer module displays the complete solution after using this button only once.</td>
    </tr>
    <tr>
        <td>Description of operation</td>
        <td>Text read by the Text To Speech (if included) before navigating inside of the module. </td>
    </tr>
    <tr>
        <td>Lang attribute</td>
        <td>This property allows defining the language for this module (different than the language of the lesson). </td>
    </tr>
    <tr>
        <td>Speech texts</td>
        <td>Sets the values of speech texts - predefined phrases providing additional context while using the module in the Text To Speech mode. Speech texts are always read using the content's default language. </td>
    </tr>
	<tr>
        <td>Use alternative TTS navigation</td>
        <td>When enabled, addon will be navigable by alternative version of keyboard navigation with TTS. To use alternative TTS navigation it is required to fulfill <b>Rows' alt text</b> property. Enabling this property will not change keyboard navigation without TTS.</td>
    </tr>
	<tr>
        <td>Rows' alt texts</td>
        <td>Sets the rows' alternative texts. Rows receive alternative texts according to the order on this list.
            <br>
            <br>
            It is required to create number of alternative texts equal to number of navigable rows (rows with at least one symbol other than <b>empty space</b> or <b>line</b>).</td>
    </tr>
</table>

## Example value

    _[2]0__
    =====
    _40:2
    -[4]0__
    =====
    _--__
	
	OR
	
	____[3][9]
	======
	16)624
	__-[4][8]_
	======
	___[1][4][4]
	__-[1][4][4]
	======
	_____0

## The eKeyboard integration
It is possible to enter values using the eKeyboard module. 

[See the documentation of eKeyboard module &raquo;](/doc/page/eKeyboard "eKeyboard")

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
        <td>Returns true if all gaps are filled in correctly.</td>
    </tr>
    <tr>
        <td>hide</td>
        <td>---</td>
        <td>Hides the module if it is visible.</td>
    </tr>
    <tr>
        <td>show</td>
        <td>---</td>
        <td>Shows the module if it is hidden.</td>
    </tr>
</table>

## Show Answers

This module is fully compatible with the [Show Answers module](/doc/page/Show-Answers "Show Answers module") and displays correct answers when an adequate event is sent.

## Scoring
The Writing Calculations module allows the creation of exercises as well as activities.

<table border='1'>
    <tr>
        <th>Property</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>maxScore</td>
        <td>Number of defined input fields.</td>
    </tr>
    <tr>
        <td>score</td>
        <td>It's 1 point for each properly filled input field.</td>
    </tr>
    <tr>
        <td>errorCount</td>
        <td>It's 1 error point for each input field filled incorrectly.</td>
    </tr>
</table>

## Events
The Writing Calculations module sends the ValueChanged type events to the Event Bus when a user fills in either one of the fields.

<table border='1'>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Item</td>
        <td>Field identifier in &lt;row_number&gt;-&lt;gap_number&gt; format, i.e. 1-2 means input with row = 1 and gap = 2 (each gap is counted in a particular row, not from the beginning of the equation). Both row and gap numbers are counted from 1 to n.</td>
    </tr>
    <tr>
        <td>Value</td>
        <td>Filled value.</td>
    </tr>
    <tr>
        <td>Score</td>
        <td>It's 1 if the filled value was correct, otherwise 0.</td>
    </tr>
</table>

When the user fills in all fields properly, the module sends the 'ALL OK' event. This event is different, so its structure is shown below.

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

## CSS classes

<table border='1'>
    <tr>
        <th>Class name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>.wrapper-cell</td>
        <td>Wrapper for a single cell.</td>
    </tr>
    <tr>
        <td>.container-emptyBox</td>
        <td>Container with single input representing input box (square brackets).</td>
    </tr>
    <tr>
        <td>.container-helpBox</td>
        <td>Container with single input representing help box (curly brackets).</td>
    </tr>
    <tr>
        <td>.writing-calculations-input</td>
        <td>Single input (defined by square and curly brackets).</td>
    </tr>
    <tr>
        <td>.wrapper-row</td>
        <td>Single row.</td>
    </tr>
    <tr>
        <td>.cell-#number</td>
        <td>Which column.</td>
    </tr>
    <tr>
        <td>.row-#number</td>
        <td>Which row.</td>
    </tr>
    <tr>
        <td>.incorrect</td>
        <td>Subclass for an incorrect answer input.</td>
    </tr>
    <tr>
        <td>.correct</td>
        <td>Subclass for a correct answer input.</td>
    </tr>
    <tr>
        <td>.empty</td>
        <td>Subclass for an empty input.</td>
    </tr>
    <tr>
        <td>.writing-calculations_show-answers</td>
        <td>Added in the show answers mode.</td>
    </tr>
</table>

It's possible to give other columns and rows different styles.<br/>
Columns and rows are numbered. Each of them has its own number.<br/><br/>
For example:<br/>
The first row has class: row-1, the second row has class: row-2<br/>
The first column has class: cell-1, and the second column has class: cell-2.<br/>
An example CSS style for the third column:<br/>

    .addon_WritingCalculations .cell-3 {
          background: #a1f9ff;
     }

## Demo presentation
[Demo presentation](/embed/6264148351516672 "Demo presentation") contains examples of how to use the Writing Calculations module.                                   