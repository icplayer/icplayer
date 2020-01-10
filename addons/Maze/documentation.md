## Description
The Maze addon allows you to define questions and answers for a user to complete a maze.


## Properties

<table border='1'>
<tbody>
    <tr>
        <th>Property name</th>
        <th>Description</th> 
    </tr>
    <tr>
        <td>Width</td>
        <td>The number of cells in one row.</td>
    </tr>
    <tr>
        <td>Height</td>
        <td>The number of cells in one column.</td>
    </tr>
    <tr>
        <td>Number of mazes</td>
        <td>The number of mazes to win the game. By default 1.</td>
    </tr>
    <tr>
        <td>Game mode</td>
        <td>The Addon gives two modes: letters, where to win a user must gather all letters in a maze and diamond where the user must open all gates for entering the end game element.</td>
    </tr>
    <tr>
        <td>Questions</td>
        <td>The list of questions and answers for all mazes. <table border='1'>
		<tbody>
    <tr>
        <th>Property name</th>
        <th>Description</th> 
    </tr>
	<tr>
		<td>Question</td>
		<td>The text shown to a user when he or she enters a letter or a gate.</td>
	</td>	
	<tr>
		<td>Answer</td>
		<td>The answer which a user must enter in order to collect a letter or open the door. The answer value is case sensitive.</td>
	</td>
	<tr>
		<td>Letter</td>
		<td>The letter which a user will receive when entering a correct answer. The property is used only in the Letter mode. At the end of a maze level, the addon will show all letters in the order defined in the property.</td>
	</td>
	<tr>
		<td>Maze numer</td>
		<td>The number of a maze where a question is added. The number is counted from 1.</td>
	</td>			
		</tbody>
		</table></td>
    </tr>
	<tr>
		<td>Is disabled</td>
		<td>Player navigation is disabled.</td>
	</tr>
	<tr>
		<td>Hide controls bar</td>
		<td>Hide the controls bar visible in the right side of the addon.</td>
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
        <td>disable</td>
        <td>---</td>
        <td>Disable player navigation.</td> 
    </tr>
    <tr>
        <td>enable</td>
        <td>---</td>
        <td>Enable player navigation.</td> 
    </tr>
    <tr>
        <td>moveUp</td>
        <td></td> 
        <td>Move the player's position up.</td> 
    </tr>
    <tr>
        <td>moveDown</td>
        <td>---</td> 
        <td>Move the player's position down.</td> 
    </tr>
    <tr>
        <td>moveLeft</td>
        <td>---</td>
        <td>Move the player's position left.</td>
    </tr>
    <tr>
        <td>moveRight</td>
        <td>---</td>
        <td>Move the player's position right.</td>
    </tr>
</tbody>
</table>

## Events
The Maze addon sends ValueChanged type events to Event Bus when a player has opened the door.

<table border='1'>
<tbody>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <tr>
            <td>Item</td>
            <td>opened</td>
        </tr>
        <tr>
            <td>Value</td>
            <td>A number of the door as a string.</td>
        </tr>
        <tr>
            <td>Score</td>
            <td>N/A</td>
        </tr>
    </tr>
</tbody>
</table>

The Maze addon sends ValueChanged type events to Event Bus when a player has collected a letter.

<table border='1'>
<tbody>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <tr>
            <td>Item</td>
            <td>gathered</td>
        </tr>
        <tr>
            <td>Value</td>
            <td>A letter which was collected.</td>
        </tr>
        <tr>
            <td>Score</td>
            <td>N/A</td>
        </tr>
    </tr>
</tbody>
</table>
		
The Maze addon sends ValueChanged type events to Event Bus when a player has finished one maze.

<table border='1'>
<tbody>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <tr>
            <td>Item</td>
            <td>Maze number</td>
        </tr>
        <tr>
            <td>Value</td>
            <td>1</td>
        </tr>
        <tr>
            <td>Score</td>
            <td>1</td>
        </tr>
    </tr>
</tbody>
</table>

The Maze addon sends ValueChanged type events to Event Bus when a player has finished all mazes.

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
            <td>1</td>
        </tr>
        <tr>
            <td>Score</td>
            <td>1</td>
        </tr>
    </tr>
</tbody>
</table>

## CSS addon classes

<table border="1">
  <tbody>
    <tr>
      <th style="width: 126px;">Class name</th>
      <th style="width: 731px;">Description</th>
    </tr>
    <tr>
      <td style="width: 126px;">Maze-wrapper-menu/td>
      <td style="width: 731px;">DIV which is surrounding the menu at the left side of the addon. If the hide navigation bar is enabled, the width of this wrapper is zero.</td>
    </tr>
    <tr>
      <td style="width: 126px;">Maze-wrapper-game-container</td>
      <td style="width: 731px;">DIV which is surrounding the game elements at the right side of the addon. If the hide navigation bar is enabled, the width of this wrapper is 100%.</td>
    </tr>
	<tr>
      <td style="width: 126px;">Maze-wrapper-menu-controls</td>
      <td style="width: 731px;">Div which is surrounding the navigation buttons.</td>
    </tr>
	<tr>
      <td style="width: 126px;">Maze-wrapper-menu-controls-up</td>
      <td style="width: 731px;">The Up button.</td>
    </tr>
	<tr>
      <td style="width: 126px;">Maze-wrapper-menu-controls-down</td>
      <td style="width: 731px;">The Down button.</td>
    </tr>
	<tr>
      <td style="width: 126px;">Maze-wrapper-menu-controls-left</td>
      <td style="width: 731px;">The Left button.</td>
    </tr>
	<tr>
      <td style="width: 126px;">Maze-wrapper-menu-controls-right</td>
      <td style="width: 731px;">The Right button.</td>
    </tr>
	<tr>
      <td style="width: 126px;">Maze_room_image_top_left_right_bottom</td>
      <td style="width: 731px;">DIV which contains as background the closed top, left, right and bottom walls image. This element may be rotated by the addon.</td>
    </tr>
	<tr>
      <td style="width: 126px;">Maze_room_image_top_left_right</td>
      <td style="width: 731px;">DIV which contains as background the closed top, left, right walls image. This element may be rotated by the addon.</td>
    </tr>
	<tr>
      <td style="width: 126px;">Maze_room_image_top_left</td>
      <td style="width: 731px;">DIV which contains as background the closed top, left walls image. This element may be rotated by the addon.</td>
    </tr>
	<tr>
      <td style="width: 126px;">Maze_room_image_top_bottom</td>
      <td style="width: 731px;">DIV which contains as background the closed top and bottom walls image. This element may be rotated by the addon.</td>
    </tr>
	<tr>
      <td style="width: 126px;">Maze_room_image_top</td>
      <td style="width: 731px;">DIV which contains as background the closed top wall image. This element may be rotated by the addon.</td>
    </tr>
	<tr>
      <td style="width: 126px;">Maze_player_element</td>
      <td style="width: 731px;">DIV which contains as background the player image.</td>
    </tr>
	<tr>
      <td style="width: 126px;">Maze_treasure_element</td>
      <td style="width: 731px;">DIV which contains as background the end level image in the diamond game type.</td>
    </tr>
	<tr>
      <td style="width: 126px;">Maze_door</td>
      <td style="width: 731px;">DIV which contains the closed door as a background image.</td>
    </tr>
	<tr>
      <td style="width: 126px;">Maze_door_opened</td>
      <td style="width: 731px;">DIV which contains the opened door as a background image.</td>
    </tr>
	<tr>
      <td style="width: 126px;">Maze_room_left_top_dot</td>
      <td style="width: 731px;">Sometimes a maze needs to complete an empty dot in the connection between walls. This element contains this dot in the left top corner as a background image.</td>
    </tr>
	<tr>
      <td style="width: 126px;">Maze_game_question_background</td>
      <td style="width: 731px;">A background element while showing a question.</td>
    </tr>
	<tr>
      <td style="width: 126px;">Maze_game_question_container</td>
      <td style="width: 731px;">A DIV element which is surrounding questions' elements.</td>
    </tr>
	<tr>
      <td style="width: 126px;">Maze_game_question_container_question_input</td>
      <td style="width: 731px;">An input for the player's answer.</td>
    </tr>
	<tr>
      <td style="width: 126px;">Maze_game_question_container_question_apply_text</td>
      <td style="width: 731px;">A DIV element which contains the text for entering an answer. Text is set as ::after class.</td>
    </tr>
	<tr>
      <td style="width: 126px;">Maze_letters_end_level_next_maze_button</td>
      <td style="width: 731px;">A button which is shown on the end level in the Letters game mode when going to the next level.</td>
    </tr>
	<tr>
      <td style="width: 126px;">Maze_game_end</td>
      <td style="width: 731px;">A background element when a player completes all mazes.</td>
    </tr>
	<tr>
      <td style="width: 126px;">Maze_letters_end_level_answer_wrapper</td>
      <td style="width: 731px;">DIV which is surrounding the elements in the end level in the Letters game mode.</td>
    </tr>
	<tr>
      <td style="width: 126px;">Maze_game_end_text</td>
      <td style="width: 731px;">DIV which contains the end game text. The text is set as ::after class.</td>
    </tr>
	<tr>
      <td style="width: 126px;">Maze_letters_end_level</td>
      <td style="width: 731px;">DIV which a user must enter to the end level in the Letters game mode.</td>
    </tr>
	<tr>
      <td style="width: 126px;">Maze_letters_end_level_background</td>
      <td style="width: 731px;">DIV which is a background element in the end level in the Letters game mode.</td>
    </tr>
	<tr>
      <td style="width: 126px;">Maze_letters_letter_element</td>
      <td style="width: 731px;">DIV element which contains a letter answer in the end level in the Letters game mode.</td>
    </tr>
	<tr>
      <td style="width: 126px;">Maze_letters_end_level_answer_letters_container</td>
      <td style="width: 731px;">DIV which is surrounding the answer letters.</td>
    </tr>
	<tr>
      <td style="width: 126px;">Maze_letters_room_letter</td>
      <td style="width: 731px;">DIV which contains a letter.</td>
    </tr>
	<tr>
      <td style="width: 126px;">Maze_game_question_container_question_apply</td>
      <td style="width: 731px;">DIV which contains the OK button text while entering an answer by a player. The text is set as ::after class.</td>
    </tr>
  </tbody>
</table>



## Demo presentation
[Demo presentation](/embed/6101114704101376 "Demo presentation") contains examples of how this addon can be used.                                 