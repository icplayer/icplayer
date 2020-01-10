## Description
The Shooting range addon allows users to select correct answers from the elements that fall down in a specific time.
	
## Properties

<table border='1'>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Initial Time For Answer</td>
        <td>The time when the first answer falls down. If the "Time For Last Answer" property is empty, then the answer time is equal to all properties.</td>
    </tr>
    <tr>
        <td>Time For Last Answer</td>
        <td>The time when the last answer falls down. The rest of answers will get the time proportionally to "Initial Time For Answer" and "Time For Last Answer".</td>
    </tr>
    <tr>
        <td>Descriptions</td>
        <td>The list where you can define possible levels in a game.</br>
			<table border='1'>
				<tr>
					<th>Property name</th>
					<th>Description</th>
				</tr>
				<tr>
					<td>Definition</td>
					<td>Current level definition. All or no definitions must be set.</td>
				</tr>
				<tr>
					<td>Answer 1</td>
					<td>Text which will be set in the answer div.</td>
				</tr>		
				<tr>
					<td>Answer 2</td>
					<td>Text which will be set in the answer div.</td>
				</tr>		
				<tr>
					<td>Answer 3</td>
					<td>Text which will be set in the answer div.</td>
				</tr>		
				<tr>
					<td>Correct Answers</td>
					<td>Select, which answers are correct.<br />Available formats:<br /> Separated by comma: "1,2".<br />In range: "1-3".<br />Single number: "2".</td>
				</tr>						
		</table>		
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
        <td>show</td>
        <td>---</td>
        <td>Shows the addon.</td>
    </tr>
    <tr>
        <td>hide</td>
        <td>---</td>
        <td>Hides the addon.</td>
    </tr>
    <tr>
        <td>restartGame</td>
        <td>---</td>
        <td>Restarts the game to the first level and resets the score.</td>
    </tr>
    <tr>
        <td>getResultsList</td>
        <td>---</td>
        <td>
Returns the list of player results. Each element is an object with the following structure:
		
		
{
	score: playerScore,
	errors: playerErrors
}
		
		</td>
    </tr>
</table>

## Events
The Shooting Range addon sends ValueChanged event when the state has been updated.
<table border='1'>
<tbody>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <tr>
            <td>Item</td>
            <td>[question number]-[answer number]</td>
        </tr>
        <tr>
            <td>Value</td>
            <td>1: if the value was clicked.<br />0: if an element was dropped.</td>
        </tr>
        <tr>
            <td>Score</td>
            <td>0: if an element was clicked and wrong or the element was dropped.<br />1: if clicked element was correct.</td>
        </tr>
    </tr>
</tbody>
</table>

## Styles

<table border='1'>
    <tr>
        <th>class name/th>
        <th>Description</th> 
    </tr>
    <tr>
        <td>addon-Shooting_Range-wrapper-question</td>
        <td>Question wrapper. In this element, the addon will set an actual definition. If definitions are empty, this element won't be displayed.</td>
    </tr>
    <tr>
		<td>addon-Shooting_Range-wrapper-answers-wrapper</td>
        <td>Wrapper for answers. In this element all answers will be added. The height of this element can't be changed by css.</td>
    </tr>
	<tr>
        <td>addon-Shooting_Range-play-button-wrapper</td>
        <td>Wrapper for the play button.</td>
    </tr>
	<tr>
        <td>addon-Shooting_Range-button-play</td>
        <td>Play button. On click addon will start a game.</td>
    </tr>
	<tr>
        <td>addon-Shooting_Range-answer-wrapper</td>
        <td>Wrapper of each answer element.</td>
    </tr>
	<tr>
        <td>addon-Shooting_Range-answer-[answer-number]</td>
        <td>To distinguish answers, each answer will receive a unique class name.</td>
    </tr>
	<tr>
        <td>addon-Shooting_Range-answer-text</td>
        <td>Each element of text in an answer will receive addon-Shooting_Range-answer-text class.</td>
    </tr>
	<tr>
        <td>addon-Shooting_Range-answer-layer</td>
        <td>A layer used by the addon. This class shouldn't be changed by a user.</td>
    </tr>
	<tr>
        <td>clicked</td>
        <td>If an element was clicked, it will get the "clicked" class.</td>
    </tr>
	<tr>
        <td>correct</td>
        <td>On show errors, a correct selected element will get a "correct" class.</td>
    </tr>
    <tr>
        <td>wrong</td>
        <td>On show errors, a wrong selected element will get a "wrong" class.</td>
    </tr>
    <tr>
        <td>isHidden</td>
        <td>The style used by the addon which shouldn't be used by a user.</td>
    </tr>	
</table>

## Examples
Example of using the getResultsList command

 
	EVENTSTART
	Source:Single_State_Button1
	SCRIPTSTART
	  var shooting = presenter.playerController.getModule('Shooting_Range1');
	  shooting.restartGame();

	  var text = presenter.playerController.getModule('Text1');
	  var list = shooting.getResultsList();
	  var textToSet = "Correct:";
	  for (var i = 0; i < list.length; i++) {
		 textToSet += list[i].score;
	  }
	  textToSet += "<br />Errors:";
	  for (var i = 0; i < list.length; i++) {
		 textToSet += list[i].errors;
	  }
	  text.setText(textToSet);

	SCRIPTEND
	EVENTEND

## Demo presentation

[Demo presentation](/embed/6348747497013248"Demo presentation") contains examples of how to use this module.        