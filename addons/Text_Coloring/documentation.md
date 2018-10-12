## Description
The Text Coloring addon allows marking / selecting relevant parts of text with chosen colors.

You can work in one of two modes:
<ul>
<li>'All selectable' (default), where all words are selectable. </li>
<li>'Mark phrases to select', where only some phrases are selectable. Unlike in 'All selectable' however, a phrase may be longer than a single word.</li>
</ul>

## Properties
<table border='1'>
    <tr>
        <th>Property</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Colors</td>
        <td>A list of colors which can be used to mark words.</br>
			<table border='1'>
				<tr>
					<th>Property name</th>
					<th>Description</th>
				</tr>
                <tr>
                    <td>ID</td>
                    <td>Color ID which will be used to mark words.</td>
                </tr>
				<tr>
					<td>Color</td>
					<td>RGB Hex Color format, e.g. #FFAA00.</td>
				</tr>
				<tr>
					<td>Description</td>
					<td>The text to be shown in the color box.</td>
				</tr>
		</table>
		</td>
    </tr>
    <tr>
        <td>Text</td>
        <td>Input text</td>
    </tr>
    <tr>
        <td>Buttons position</td>
        <td>Sets the buttons position in relation to the text. Possible positions: left, top, right, bottom</td>
    </tr>
    <tr>
        <td>Hide color buttons</td>
        <td>Hides color buttons.</td>
    </tr>
    <tr>
        <td>Show eraser button</td>
        <td>Shows the eraser button.</td>
    </tr>
    <tr>
        <td>Eraser button text</td>
        <td>Sets the eraser button text. If no text is provided, the default value: "Eraser Mode" is displayed.</td>
    </tr>
    <tr>
        <td>Mode</td>
        <td>'Mark phrases to select' or 'All selectable'</td>
    </tr>
</table>

## Configuration

Each text element has to be marked with the relevant keywords <i>\\color{correct_color_id}{word}</i>.

## Supported commands

<table border='1'>
<tbody>
    <tr>
        <th>Command name</th>
        <th>Params</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>setColor</td>
        <td>Color id</td>
        <td>Sets an active color for coloring selected words.</td>
    </tr>
    <tr>
        <td>setEraserMode</td>
        <td></td>
        <td>Set the erasing mode.</td>
    </tr>
    <tr>
        <td>show</td>
        <td></td>
        <td>Shows the addon.</td>
    </tr>
    <tr>
        <td>hide</td>
        <td></td>
        <td>Hides the addon.</td>
    </tr>
</tbody>
</table>

##Events

The Text Coloring addon sends ValueChanged type events to Event Bus when a user selects the word.

<table border='1'>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Source</td>
        <td>Id of the source addon.</td>
    </tr>
    <tr>
        <td>Item</td>
        <td>Index of a word in a text, all words are indexed starting from 1.</td>
    </tr>
    <tr>
        <td>Value</td>
        <td>
           The Value is 1 for selecting, 0 – deselecting.
        </td>
    </tr>
    <tr>
        <td>Score</td>
        <td>
           It's 1 for the correct selection, 0 for wrong.
        </td>
    </tr>
</table>

## AllOk Event
This event contains the following fields
<table border='1'>
<tbody>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>source</td>
        <td>module id</td>
    </tr>
    <tr>
        <td>item</td>
        <td>value: "all"</td>
    </tr>
    <tr>
        <td>value</td>
        <td>N/A</td>
    </tr>
    <tr>
        <td>score</td>
        <td>N/A</td>
    </tr>
</tbody>
</table>

##Show Answers

This module is fully compatible with [Show Answers module](/doc/page/Show-Answers "Show Answers module") and displays correct answers when an adequate event is sent.

## Scoring
<table border='1'>
    <tr>
        <th>Property</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>maxScore</td>
        <td>maximum score is equal to the number of phrases marked</td>
    </tr>
    <tr>
        <td>score</td>
        <td>score is equal to the number of phrases selected correctly</td>
    </tr>
    <tr>
        <td>errorCount</td>
        <td>errorCount is equal to the number of phrases selected incorrectly</td>
    </tr>
</table>

## CSS classes

<table border='1'>
    <tr>
        <th>Class name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>text-coloring-active-button</td>
        <td>The class for an active button.</td>
    </tr>
    <tr>
        <td>text-coloring-token-correct-marking</td>
        <td>The class for correctly selected words.</td>
    </tr>
    <tr>
        <td>text-coloring-token-wrong-marking</td>
        <td>The class for incorrectly selected words.</td>
    </tr>
    <tr>
        <td>text-coloring-colored-with-[color-id]</td>
        <td>The class for words selected with the color of a defined id. Coloring a word with the "red" color id will add the class: "text-coloring-colored-with-red"</td>
    </tr>
    <tr>
        <td>text-coloring-color-button</td>
        <td>The class for buttons switching to a defined color.</td>
    </tr>
    <tr>
        <td>text-coloring-eraser-button</td>
        <td>The class for a button switching to the eraser mode.</td>
    </tr>
    <tr>
        <td>text-coloring-show-answers-[color-id]</td>
        <td>This class will be given for selectable words with defined color in show answers mode. If word should be colored with "green" color id, it will be given "text-coloring-show-answers-green".</td>
    </tr>
</table>

## Position CSS classes

Text Coloring depending on the value selected in the property "position" adds different css classes for html elements.
Position values are: left, top, bottom, right
<table border='1'>
    <tr>
        <th>Class name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>text-coloring-main-container-[position value]-position</td>
        <td>The class for main container. The property "position" with the value "top" will add the class: text-coloring-main-container-top-position</td>
    </tr>
    <tr>
        <td>text-coloring-colors-buttons-container-[position value]-position</td>
        <td>The class for the color buttons container. The property "position" with the value "top" will add the class: text-coloring-colors-buttons-container-top-position</td>
    </tr>
    <tr>
        <td>text-coloring-eraser-button-container-[position value]-position</td>
        <td>The class for the eraser mode button container. The property "position" with the value "top" will add the class: text-coloring-eraser-button-container-top-position</td>
    </tr>
    <tr>
        <td>text-coloring-buttons-container-[position value]-position</td>
        <td>The Class for the buttons container. The property "position" with the value "top" will add the class: text-coloring-buttons-container-top-position</td>
    </tr>
    <tr>
        <td>text-coloring-tokens-container-[position value]-position</td>
        <td>The class for the words container. The property "position" with the value "top" will add the class: text-coloring-tokens-container-top-position</td>
    </tr>
</table>

## Demo presentation
[Demo presentation](/embed/5501371197685760 "Demo presentation") contains examples of how to use the Text Coloring addon.
        