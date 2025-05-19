## Description

A text module enables to insert different parts of text into a presentation, including a type of task called "gap". A text gap consists of three activity types:

* a **drop-down** gap which enables to choose answers from a drop-down menu,
* a **draggable** gap which can be filled in with an item selected from a Source list (Source list is a separate module presented further in this documentation),
* an **editable** gap that enables to type text manually into it,
* a **math** gap, which is an editable gap working with MathJax.
* a **filled** gap, which is an editable gap with a placeholder.

All texts should be entered in the property called "Text" in the right-side menu. To define a certain type of a text gap, it is required to use simple scripts presented below:

* **draggable** and **editable** gap

\\gap{blue} – blue is the correct answer that should be entered into a gap. "1" defines the value of a correct answer.

In case of more than one correct possibility the script is a bit different:

\\gap{blue|navy} – both options are correct and they will be counted as such.

* **drop-down** gap

{{1:blue|yellow|red}} – the first option is always the correct answer, in this case it is "blue". "1" defines the value of a correct answer.
if you want to keep the original order of the elements, check the 'Keep original order' property, and use the following formula: {{one|two|1:three}}, which means that "three" is the correct answer and 1 is the value of the correct answer.

* **math** gap

Use the editable gap pattern inside MathJax brackets \\( MathJax commands \\). For example: \\( \\frac{1}{\\gap{2}} \\) will render fraction with 1 as the nominator and an editable gap as the denominator, where the correct answer is 2.

Note: Keep in mind that the index of the gap in the module is defined by the order of the gaps written in the LaTeX formula.
To properly navigate between gaps on a page in a situation when you have two gaps – one over another (e.g. integration limits), you should always define the upper limit first.

Example: \\(\\int^\\gap{b}_\\gap{a}f(x)dx\\)

* **filled** gap

If you want a gap with the introductory text (e.g. to be corrected by students), use the filled gap's syntax. For example: \\filledGap{initial text|answer} will render a gap with "initial text" as a placeholder and "answer" as the right answer.

For more than one answer, you should use the syntax for a draggable and editable gap:

\\filledGap{initial text|answer|another answer} where the first value is a placeholder and the next two values are the answers. 

## Definitions
It is possible to put definitions inside the Text module. To do it, use \\def{my_id|word} syntax and "word" will be displayed as a clickable element with an id – "my_id". Clicking on the definition will trigger a Definition event which can be used by other modules. The most common use involves cooperation with Glossary addon.

## eKeyboard integration
It is possible to enter text into gaps using the eKeyboard module. 

[See the documentation of eKeyboard module &raquo;](/doc/page/eKeyboard "eKeyboard")

## Audio
The text module also allows inserting simple audio controls. They add the possibility of playing and stopping a sound. Though there may be more than one audio in the text module, only one sound can be played simultaneously.  
To add an audio control, use "Insert Audio" button on the toolbar of the text editor.  
Adding the audio control is also possible using \audio{URL} syntax, where URL is the URL of the audio resource.


## Gap editor
The gap editor allows you to create a gap in an easy way.
Depending on a gap type you want to create, you can choose:

- Editable
- Draggable
- Filled

For example, to create the editable gap, you should choose Editable from the 'Add gap' option.

<img src='/file/serve/5016692163346432' />

Then, you will see the editor window like the one presented below:

<img src='/file/serve/6738941836787712' />

If you fill in the first input: "first" and the second input: "second", that's equivalent to: \gap{first|second}

In each case, if you choose the Editable, Dropdown or Filled gap, simply click OK to save your changes, or Cancel to discard them.

## Properties

The list starts with the common properties, learn more about them by visiting the [Modules description](https://www.mauthor.com/doc/en/page/Modules-description) section. The other available properties are described below.

<table border='1'>
<tbody>
    <tr>
        <th>Property name</th>
        <th>Description</th> 
    </tr>
    <tr>
        <td>Gap type</td>
        <td>This property serves for selecting a gap module type - editable (drop-down and fillable gap) or draggable. A common text paragraph should be marked as an "editable" gap type.</td> 
    </tr>
    <tr>
        <td>Gap width</td>
        <td>This property allows defining a gap width by default.</td> 
    </tr>
    <tr>
        <td>Gap max length</td>
        <td>This property allows defining a maximum amount of chars available to be put in each gap.
		If this property is set to zero, no restriction will be applied.
		If a gap's right answer is longer than the Gap max length property, the restriction for this gap will automatically increase to this length. For filled gaps, the length of placeholder is also taken into account in determining the maximum number of characters.</td> 
    </tr>
	<td>Is activity</td>
        <td>This property allows defining whether a text module is an activity or not. When it is not defined as an activity, the answers given are not taken into account in the overall result. It is helpful for e.g. simulations.</td> 
    </tr>
    <tr>
        <td>Is disabled</td>
        <td>Allows disabling the module so that the user is not able to interact with it.
        </td> 
    </tr>
    <tr>
        <td>Case sensitive</td>
        <td>When this property is checked it means that letter case is important while giving answers.
        </td> 
    </tr>
	<tr>
        <td>Use numeric keyboard</td>
        <td>When enabled, gaps will activate the virtual numeric keyboard on mobile devices when selected. This will also cause the gaps to only accept numeric values.</td> 
	</tr>
    <tr>
        <td>Text</td>
        <td>This property serves for inserting text into a module. Here it is also possible to define different types of gaps together with the required answers.
        </td> 
    </tr>
    <tr>
        <td>Ignore punctuation</td>
        <td>This property allows ignoring punctuation marks while checking the answers' correctness.
        </td> 
    </tr>
    <tr>
        <td>Open external link in</td>
        <td>This property allows selecting the location for new pages being opened via external links: new tab (default) or the same tab.
        </td> 
    </tr>
    <tr>
        <td>Keep original order</td>
        <td>This property let you keep the original order of elements in dropdown gaps.
        </td> 
    </tr>
    <tr>
        <td>Clear placeholder on focus</td>
        <td>This property allows clearing the placeholder on click in a filled gap.
        </td> 
    </tr>
    <tr>
        <td>Value type</td>
        <td>This property allows defining characters to be put into a gap. There are four vaues to choose from: Numbers only, Letters only, Alphanumeric and All. The default value of this property is set to "All".
        </td> 
    </tr>
    <tr>
        <td>Block wrong answers</td>
        <td>With this option checked, wrong answers are removed and the "on wrong" event is sent.</td>
    </tr>
    <tr>
        <td>User action events</td>
        <td>With this option checked, text module will send the ValueChanged event on every change made in a gap.</td>
    </tr>
    <tr>
        <td>Use escape character in gap</td>
        <td>This property allows using backslash ('\') to escape special characters in dropdown gaps. Backslash can escape: ':', '\'.</td>
    </tr>
    <tr>
        <td>Lang attribute</td>
        <td>This property allows to define the language for this addon (different than the language of the lesson).</td> 
    </tr>
    <tr>
        <td>Speech texts</td>
        <td>List of speech texts: Number, Gap, Dropdown, Correct, Wrong, Empty, Inserted, Removed. <br />
This texts will be read by Text to Speech addon after a user performs an action.</td> 
    </tr>
    <tr>
        <td>Group answers</td>
        <td>Group answers allows defining the groups to which the given gaps will belong. 
            Groups change the calculation of scores and maximum scores for gaps belonging to the group. 
            Gaps that are in a group do not have their own scores (when the score and maximum score are calculated). 
            If a correct answer is given to each gap in the group then the addon will get 1 point. 
            Otherwise, the number of points will not increase.<br/>
            <br/>
            This property change data in ValueChanged event due to change in value of gap in group.<br/>
            <br/>
            To create a group, provide indexes (1-based indexes of gaps in text) in the following formats:<br />
            Separated by comma: "1,2".<br />
            In range: "1-3".<br />
            Single number: "2".<br />
            Mixed format: "1-3,5".</td> 
    </tr>
</tbody>
</table>

## Supported commands

<table border='1'>
<tbody>
    <tr>
        <th>Command name</th>
        <th>Params</th> 
        <th>Description</th> 
    </tr>
    <tr>
        <td>setText</td>
        <td>text</td> 
        <td>Changes the text inside the module</td> 
    </tr>
    <tr>
        <td>getGapText</td>
        <td>index - 1-based index of gap in text</td> 
        <td>Returns gap text entered by user</td> 
    </tr>
    <tr>
        <td>setGapText</td>
        <td>index - 1-based index of gap in text</td> 
        <td>Changes the text inside the gap. Command supported only when "editable" is selected as "Gap Type".</td> 
    </tr>
    <tr>
        <td>markGapAsCorrect</td>
        <td>index - 1-based index of gap in text</td> 
        <td>Mark gap as correct</td> 
    </tr>
    <tr>
        <td>markGapAsWrong</td>
        <td>index - 1-based index of gap in text</td> 
        <td>Mark gap as wrong</td> 
    </tr>
    <tr>
        <td>markGapAsEmpty</td>
        <td>index - 1-based index of gap in text</td> 
        <td>Mark gap as empty</td> 
    </tr>
	<tr>
        <td>show</td>
        <td>–</td> 
        <td>Shows the module</td> 
    </tr>
    <tr>
        <td>hide</td>
        <td>–</td> 
        <td>Hides the module</td> 
    </tr>
	<tr>
        <td>enableGap</td>
        <td>index - 1-based index of gap in module</td> 
        <td>Enables gap</td> 
    </tr>
	<tr>
        <td>enableAllGaps</td>
        <td>---</td> 
        <td>Enables all gaps</td> 
    </tr>
    <tr>
        <td>disableGap</td>
        <td>index - 1-based index of gap in module</td> 
        <td>Disables gap</td> 
    </tr>
	<tr>
        <td>disableAllGaps</td>
        <td>---</td> 
        <td>Disables all gaps</td> 
    </tr>
	<tr>
        <td>isAllOK</td>
        <td>---</td>
        <td>Returns true if all gaps are filled in correctly and there are no mistakes, otherwise false.</td>
    </tr>
    <tr>
        <td>isAttempted</td>
        <td>---</td> 
        <td>Returns true if all gaps are filled in. This command is not available if module has 'Is Activity' property deselected.</td> 
    </tr>
<tr>
<td>getView</td>
<td>---</td>
<td>Returns HTML element, which is the container of the addon.</td>
</tr>
	
</tbody>
</table>

## Calculating gaps index

It's important to know that for each kind of gap (editable, draggable, math) the calculating order is:</br>
<ol><li>First, all editable gaps are counted (both \gap and \filledgap),
<li>Next, drop-down gaps are counted.</li></ol>

Example:</br>

<img src="data:image/png;base64,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"/>

In this case, the getGapText(8) method returns text of a draggable gap, not the last gap.

## Decimal separator
Different countries use different decimal separators. In the Text module, the default one is a dot ('.') character but it doesn't mean that a user is forced to use this one. Thanks to [Advanced Connector module](/doc/page/Advanced-Connector "Advanced Connector"), it's possible to change the decimal separator 'on the fly'. It can be done by using a simple JavaScript [replace() function](http://www.w3schools.com/jsref/jsref_replace.asp "JavaScript replace() Method"). Let's assume that there is a [Slider module](/doc/page/Slider "Slider") and its current step value (from 1 to 36) should be inserted in some equations and displayed using the Text module's setText command.

	EVENTSTART
	Source:Slider1
	SCRIPTSTART
		var text = presenter.playerController.getModule('Text1');
		var slider = presenter.playerController.getModule('Slider1');
		var currentValue = sliderModule.getCurrentStep();
		var calculatedValue = (parseInt(currentValue, 10) - 18) / 5;

		calculatedValue = '' + calculatedValue;
		
		if (calculatedValue !== '0') {
			calculatedValue = calculatedValue.replace("\.", ",");
		};
		
		text.setText('Calculated value: ' + calculatedValue);
	SCRIPTEND
	EVENTEND
	
## Events

The Text module sends ValueChanged events to Event Bus when a user changes the value of a gap.<br> 
ValueChanged event when gap not defined in `Group answers` property:

<table border='1'>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Item</td>
        <td>index - 1-based index of gap in module</td>
    </tr>
    <tr>
        <td>Value</td>
        <td>gap value</td>
    </tr>
    <tr>
        <td>Score</td>
        <td>n for correct answer (where n is a maximum score for given gap), 0 for wrong</td>
    </tr>
</table>

ValueChanged event when gap defined in `Group answers` property:

<table border='1'>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Item</td>
        <td>index - 1-based index of gap in module</td>
    </tr>
    <tr>
        <td>Value</td>
        <td>gap value</td>
    </tr>
    <tr>
        <td>Score</td>
        <td>"correct" for correct answer, "wrong" for wrong</td>
    </tr>
</table>

The Text module sends additional ValueChanged event to Event Bus when a user changes the value of a gap in group and all gaps of this group are filled in.<br>

<table border='1'>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Item</td>
        <td>Group index ("Group" + 1-based index of group answers)</td>
    </tr>
    <tr>
        <td>Value</td>
        <td>N/A</td>
    </tr>
    <tr>
        <td>Score</td>
        <td>1 for correct answers, 0 for wrong</td>
    </tr>
</table>

When a user clicks on a definition, it will trigger a definition event.

<table border='1'>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>word</td>
        <td>id of the definition</td>
    </tr>
</table>

Audio added to addon has its own events.

The audio in Text addon sends ValueChanged type events to Event Bus when playing begins.

<table border='1'>
<tbody>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <tr>
            <td>Item</td>
            <td>Current item</td>
        </tr>
        <tr>
            <td>Value</td>
            <td>playing</td>
        </tr>
        <tr>
            <td>Score</td>
            <td>N/A</td>
        </tr>
    </tr>
</tbody>
</table>

When playback time changes, audio in Text addon sends a relevant event to Event Bus.

<table border='1'>
<tbody>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <tr>
            <td>Item</td>
            <td>Current item</td>
        </tr>
        <tr>
            <td>Value</td>
            <td>Current time (in MM:SS format)</td>
        </tr>
        <tr>
            <td>Score</td>
            <td>N/A</td>
        </tr>
    </tr>
</tbody>
</table>

The pause event occurs when the audio in Text addon is paused.

<table border='1'>
<tbody>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <tr>
            <td>Item</td>
            <td>Current item</td>
        </tr>
        <tr>
            <td>Value</td>
            <td>pause</td>
        </tr>
        <tr>
            <td>Score</td>
            <td>N/A</td>
        </tr>
    </tr>
</tbody>
</table>

When audio playback is finished, audio in Text addon sends OnEnd event to Event Bus.

<table border='1'>
<tbody>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <tr>
            <td>Item</td>
            <td>Current item</td>
        </tr>
        <tr>
            <td>Value</td>
            <td>end</td>
        </tr>
        <tr>
            <td>Score</td>
            <td>N/A</td>
        </tr>
    </tr>
</tbody>
</table>


##Show Answers

All types of gaps in Text moule are fully compatible with [Show Answers module](/doc/page/Show-Answers "Show Answers module") and correct answers are displayed when an adequate event is sent.

## CSS classes

<table border='1'>
<tbody>
    <tr>
        <th>Class name</th>
        <th>Description</th> 
    </tr>
    <tr>
        <td>.text_gap</td>
        <td>Indicates the look of a gap that can be completed by typing the answer into it.</td> 
    </tr>
    <tr>
        <td>.text_gap-correct</td>
        <td>A way of indicating a right answer.</td> 
    </tr>
    <tr>
        <td>.text_gap-wrong</td>
        <td>a way of indicating a wrong answer.</td> 
    </tr>
    <tr>
        <td>.text_gap-empty</td>
        <td>A way of indicating an empty gap.</td> 
    </tr>
     <tr>
        <td>.ic_inlineChoice-correct</td>
        <td>A way of indicating a right answer in a drop-down menu.</td> 
    </tr>
    <tr>
        <td>.ic_inlineChoice-wrong</td>
        <td>A way of indicating a wrong answer in a drop-down menu.</td> 
    </tr>
    <tr>
        <td>.ic_inlineChoice-correct-answer</td>
        <td>A way of indicating a correct answer in a drop-down menu in the show answers mode.</td> 
    </tr>
    <tr>
        <td>.ic_draggableGapEmpty</td>
        <td>A way of displaying an empty gap.</td> 
    </tr>
     <tr>
        <td>.ic_draggableGapFilled</td>
        <td>A way of displaying a filled gap.</td> 
    </tr>
    <tr>
        <td>.ic_draggableGapFilled-correct</td>
        <td>a way of indicating a right answer in a filled gap</td> 
    </tr>
     <tr>
        <td>.ic_draggableGapFilled-wrong</td>
        <td>A way of indicating a wrong answer in a filled gap.</td> 
    </tr>
     <tr>
        <td>.ic_draggableGapFilled-correct-answer</td>
        <td>A way of indicating a correct answer in a draggable gap in the show answers mode.</td> 
    </tr>
     <tr>
        <td>.ic_filled_gap</td>
        <td>Indicates the look of a filled gap .</td> 
    </tr>
     <tr>
        <td>.ic_filled_gap-correct</td>
        <td>A way of indicating a corect answer in a filled gap.</td> 
    </tr>
     <tr>
        <td>.ic_filled_gap-wrong</td>
        <td>A way of indicating a wrong answer in a filled gap.</td> 
    </tr>
     <tr>
        <td>.ic_filled_gap-correct-answer</td>
        <td>A way of indicating a correct answer in a filled gap in the show answers mode.</td> 
    </tr>
     <tr>
        <td>.ic_gap-correct-answer</td>
        <td>A way of indicating a correct answer in an editable gap in the show answers mode.</td> 
    </tr>
</tbody>
</table>
    

### Examples

**1. Text:**  
.text{  
font-family: Arial;    
font-size: 20px;  
line-height: 23px;  
color: #993399;    
border: 2px solid #009999;  
border-radius: 7px;  
padding: 10px;  
text-shadow: 1px 2px 2px  #616161;  
box-shadow: 1px 2px 3px  #406d93;  
background: #ffffff;  
} 
 
**2.1. Gap:**  
.ic_gap{  
height: 15px;  
width: 108px;  
}  

**2.2. Gap — correct:**  
.ic_gap-correct{  
background-image: url('/file/serve/79016');  
background-repeat: no-repeat;  
padding-left: 19px;  
border: 2px solid #009900;  
}  

**2.3. Gap — wrong:**  
.ic_gap-wrong{    
background-image: url('/file/serve/77022');  
background-repeat: no-repeat;  
padding-left: 19px;  
border: 2px solid #f74224;  
}  

**3.1. Inline Choice — correct:**  
.ic_inlineChoice-correct{  
border: 2px solid #009900;  
}

**3.2. InlineChoice — wrong:**  
.ic_inlineChoice-wrong{  
border: 2px solid #f74224;  
}

**4.1. Draggable Gap Empty:**  
.ic_draggableGapEmpty{
height: 25px;  
line-height: 23px;  
border: 1px solid #9e9e9e;  
border-radius: 4px;  
display:inline-block;  
text-align: center;  
}  

**4.2. Draggable Gap Filled:**  
.ic_draggableGapFilled{
height: 25px;  
margin-right: 0px;  
line-height: 23px;  
display:inline-block;  
border: 1px solid #9e9e9e;  
border-radius: 4px;  
background-color: #fff7b2;  
border-radius: 4px;  
cursor: pointer;  
text-align: center;  
font-size: 17px;  
color: #656565;  
font-family: Verdana;  
font-weight: bold;  
}

**4.3. Draggable Gap Filled — correct:**  
.ic_draggableGapFilled-correct{  
padding-left: 12px;  
background-image: url('/file/serve/79016');  
background-repeat: no-repeat;  
}  

**4.4. Draggable Gap Filled — wrong:**  
.ic_draggableGapFilled-wrong{  
padding-left: 12px;  
background-image: url('/file/serve/77022');  
background-repeat: no-repeat;  
}

## Keyboard navigation

* Tab – navigate to the next gap.
* Shift + Tab – navigate to the previous gap.

Dropdown gaps:

* Space – expand the choice options.
* up/down arrows – choose a gap.
* Enter – accept.

Draggable gaps:

* Space – insert a currently selected item into a gap or remove an item from a gap.

## Demo presentation
[Demo presentation](/embed/5018312485371904 "Demo presentation") contains examples of the addon's usage.                                                                                                                                    