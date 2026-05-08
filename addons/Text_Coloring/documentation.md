<h2>Description</h2>

<p>The Text Coloring module allows marking/selecting relevant parts of the text with chosen colors.</p>

<p>You can work in one of two modes:</p>
<ul>
    <li>'All selectable' (default), where all words are selectable.</li>
    <li>'Mark phrases to select', where only some phrases are selectable. Unlike in 'All selectable', however, a phrase may be longer than a single word.*</li>
</ul>

<p>* <i>The module also supports LaTeX formulas. A LaTeX expression is treated as a single "word" regardless of the selected mode. This is an exception for the 'All selectable' mode, where the formula will not be split into smaller components.</i></p>


<h2>Properties</h2>

<p>The list starts with the common properties. Learn more about them by visiting the <a href="/doc/en/page/Modules-description" target="_blank" rel="noopener noreferrer">Modules description</a> section. The other available properties are described below.</p>

<table border='1'>
    <tr>
        <th>Property</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Colors</td>
        <td>A list of colors that can be used to mark words.<br />
            <br />
            <table border='1'>
                <tr>
                    <th>Property name</th>
                    <th>Description</th>
                </tr>
                <tr>
                    <td>Color ID</td>
                    <td>Color ID, which will be used to mark words.</td>
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
        <td>Is Not Activity</td>
        <td>With this option marked, the score and errors will not be returned by the module.</td>
    </tr>
    <tr>
        <td>Buttons position</td>
        <td>Sets the buttons' position in relation to the text. Possible positions: left, top, right, bottom.</td>
    </tr>
    <tr>
        <td>Hide Color Buttons</td>
        <td>Hides color buttons.</td>
    </tr>
    <tr>
        <td>Show all answers in gradual show answers mode</td>
        <td>If this property is marked, then the <a href="/doc/en/page/Gradual-Show-Answers" target="_blank" rel="noopener noreferrer">Gradual Show Answers</a> module displays the complete solution after using this button only once.</td>
    </tr>
    <tr>
        <td>Show set eraser mode button</td>
        <td>Shows the eraser button.</td>
    </tr>
    <tr>
        <td>Eraser button text</td>
        <td>Sets the eraser button text. If no text is provided, the default value: "Eraser Mode" is displayed.</td>
    </tr>
    <tr>
        <td>Mode</td>
        <td>'All selectable' or 'Mark phrases to select'.</td>
    </tr>
    <tr>
        <td>Count Errors</td>
        <td>If checked, the module will not send an event to the AllOK and will not return <i>true</i> when the .isAllOK() command is called on it if all correct answers and at least one wrong answer are checked.</td>
    </tr>
    <tr>
        <td>Printable</td>
        <td>Allows to choose if the module should be included in the <a href="/doc/en/page/Marking-elements-that-should-be-included-in-the-printout" target="_blank" rel="noopener noreferrer">printout</a>.</td>
    </tr>
    <tr>
        <td>Legend title</td>
        <td>The legend is only visible in the print preview.</td>
    </tr>
    <tr>
        <td>Speech texts</td>
        <td>Sets the values of speech texts - predefined phrases providing additional context while using the module in the <a href="/doc/en/page/Text-To-Speech" target="_blank" rel="noopener noreferrer">Text To Speech</a> mode. Speech texts are always read using the content's default language.</td>
    </tr>
    <tr>
        <td>Lang attribute</td>
        <td>This property allows defining the language for this module (different than the language of the lesson).</td>
    </tr>
</table>


<h2>Configuration</h2>

<p>Each text element must be marked with the relevant keywords <i>\color{correct_color_id}{word}</i>.</p>

<p>In the 'Mark phrases to select' mode, there is an additional relevant keyword <i>\intruder{phrase}</i>. With this keyword, it is possible to mark phrases that should not be colored. Coloring them is counted as an error.</p>

<h3>Alternative text</h3>

<p>The module supports alternative text for accessibility purposes. The syntax is:</p>

<p><i>\alt{visible text|alternative text}</i></p>

<p>An optional language tag can be appended: <i>\alt{visible text|alternative text}[lang en]</i></p>

<p>The alt text feature can be applied to:</p>
<ul>
    <li>A plain word, e.g. <i>\alt{H₂O|water}</i></li>
    <li>A LaTeX expression, e.g. <i>\alt{\(H^+\)|hydrogen ion}</i></li>
    <li>The content inside a <i>\color{}</i> phrase, e.g. <i>\color{red}{\alt{phrase|alternative}}</i></li>
    <li>The content inside an <i>\intruder{}</i> phrase (in 'Mark phrases to select' mode only), e.g. <i>\intruder{\alt{phrase|alternative}}</i></li>
</ul>

<p><strong>Restrictions by mode:</strong></p>
<ul>
    <li>In the <strong>'All selectable'</strong> mode, the visible part of <i>\alt{}</i> must be exactly one word or one LaTeX expression. Wrapping more than one word is not allowed and will result in a validation error.</li>
    <li>In the <strong>'Mark phrases to select'</strong> mode, the visible part of <i>\alt{}</i> may contain multiple words or a LaTeX expression, as the entire <i>\alt{}</i> construct is treated as a single token.</li>
</ul>

<h2>Supported commands</h2>

<table border='1'>
    <tbody>
        <tr>
            <th>Command name</th>
            <th>Params</th>
            <th>Description</th>
        </tr>
        <tr>
            <td>setColor</td>
            <td>Color ID</td>
            <td>Sets an active color for coloring selected words.</td>
        </tr>
        <tr>
            <td>setEraserMode</td>
            <td>---</td>
            <td>Sets the erasing mode.</td>
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
    </tbody>
</table>


<h2>Events</h2>

<p>The Text Coloring module sends the ValueChanged type of events to the Event Bus when the user selects a word.</p>

<table border='1'>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Source</td>
        <td>ID of the source module.</td>
    </tr>
    <tr>
        <td>Item</td>
        <td>Index of a word in the text, all words are indexed starting from 1.</td>
    </tr>
    <tr>
        <td>Value</td>
        <td>The Value is 1 for selecting, 0 for deselecting.</td>
    </tr>
    <tr>
        <td>Score</td>
        <td>It's 1 for the correct selection, 0 for the wrong one.</td>
    </tr>
</table>


<h2>AllOk Event</h2>

<p>This event contains the following fields:</p>

<table border='1'>
    <tbody>
        <tr>
            <th>Field name</th>
            <th>Description</th>
        </tr>
        <tr>
            <td>Source</td>
            <td>Module's ID.</td>
        </tr>
        <tr>
            <td>Item</td>
            <td>Value: "all"</td>
        </tr>
        <tr>
            <td>Value</td>
            <td>N/A</td>
        </tr>
        <tr>
            <td>Score</td>
            <td>N/A</td>
        </tr>
    </tbody>
</table>


<h2>Show Answers</h2>

<p>This module is fully compatible with the <a href="/doc/page/Show-Answers" target="_blank" rel="noopener noreferrer">Show Answers</a> module and displays correct answers when an adequate event is sent.</p>


<h2>Scoring</h2>

<table border='1'>
    <tr>
        <th>Property</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>maxScore</td>
        <td>Maximum score is equal to the number of phrases marked.</td>
    </tr>
    <tr>
        <td>score</td>
        <td>Score is equal to the number of phrases selected correctly.</td>
    </tr>
    <tr>
        <td>errorCount</td>
        <td>errorCount is equal to the number of phrases selected incorrectly.</td>
    </tr>
</table>


<h2>CSS classes</h2>

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
        <td>The class for words selected with the color of a defined ID. Coloring a word with the "red" Color ID will add the class: "text-coloring-colored-with-red"</td>
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
        <td>This class will be given for selectable words with a defined color in show answers mode. If the word should be colored with "green" Color ID, it will be given "text-coloring-show-answers-green".</td>
    </tr>
</table>


<h2>Position CSS classes</h2>

<p>The Text Coloring, depending on the value selected in the property "Buttons position", adds different CSS classes for HTML elements. The position values are left, top, bottom, and right.</p>

<table border='1'>
    <tr>
        <th>Class name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>text-coloring-main-container-[position value]-position</td>
        <td>The class for the main container. The property "Buttons position" with the value "top" will add the class: text-coloring-main-container-top-position</td>
    </tr>
    <tr>
        <td>text-coloring-colors-buttons-container-[position value]-position</td>
        <td>The class for the color buttons container. The property "Buttons position" with the value "top" will add the class: text-coloring-colors-buttons-container-top-position</td>
    </tr>
    <tr>
        <td>text-coloring-eraser-button-container-[position value]-position</td>
        <td>The class for the eraser mode button container. The property "Buttons position" with the value "top" will add the class: text-coloring-eraser-button-container-top-position</td>
    </tr>
    <tr>
        <td>text-coloring-buttons-container-[position value]-position</td>
        <td>The class for the buttons container. The property "Buttons position" with the value "top" will add the class: text-coloring-buttons-container-top-position</td>
    </tr>
    <tr>
        <td>text-coloring-tokens-container-[position value]-position</td>
        <td>The class for the words container. The property "Buttons position" with the value "top" will add the class: text-coloring-tokens-container-top-position</td>
    </tr>
</table>


<h2>Demo presentation</h2>

<p><a href="https://www.mauthor.com/present/7699218808109027" target="_blank" rel="noopener noreferrer">Demo presentation</a> contains examples of how to use the Text Coloring module.</p>
