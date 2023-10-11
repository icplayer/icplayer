###Description

In Flash Cards module, you can create cards with varied content such as text, images and audio, which are different at the front and back of the card. Each card can be marked as favourite and graded by the student as correct or wrong in the activity mode.

##Properties

<table border='1'>
<tbody>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Cards</td>
        <td>A list of card items in which you define the front and back of each card.<br/>
- Front: The content displayed on the front side of the card.<br/>
- Back: The content displayed on the back side of the card. It is shown when the user clicks on the front side of the card.<br/>
- Audio Front: The audio file in mp3 format to be displayed on the front side of the card.<br/>
- Audio Back: The audio file in mp3 format to be displayed on the back side of the card.<br/>
</td>
    </tr>
    <tr>
        <td>Disable Loop</td>
        <td>Disables the loop mode, so that the "previous" button won't turn to the first card and the "next" button won't turn to the last one.</td>
    </tr>
    <tr>
        <td>Favourites</td>
        <td>Enables marking cards as favourite. When enabled, the button is displayed on each card.</td>
    </tr>
    <tr>
        <td>Hide Previous and Next Buttons</td>
        <td>Makes Previous and Next Buttons invisible.</td>
    </tr>
    <tr>
        <td>Show Activity Buttons</td>
        <td>Displays Activity Buttons that allow marking the cards as correct or wrong. The buttons also allow users to reset the cards' state.</td>
    </tr>
    <tr>
        <td>Is Activity</td>
        <td>When enabled, the module sends the score data depending on how many cards are marked as correct and wrong by Activity Buttons.</td>
    </tr>
    <tr>
        <td>Lang attribute</td>
        <td>Allows you to set the langauge used to read the contents of the card via the TTS module.</td>
    </tr>
    <tr>
        <td>Speech texts</td>
        <td>Sets the values of speech texts - predefined phrases providing additional context while using the module in the TTS mode. Speech texts are always read using the content's default language.</td>
    </tr>  
</tbody>
</table>


##Supported commands
<table border='1'>
<tbody>
    <tr>
        <th>Command name</th>
        <th>Params</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>show</td>
        <td>-</td>
        <td>Displays the module.</td>
    </tr>
    <tr>
        <td>hide</td>
        <td>-</td>
        <td>Hides the module.</td>
    </tr>
    <tr>
        <td>nextCard</td>
        <td>-</td>
        <td>Turns to the next card. If "disable loop property" is enabled, it stops at the last card.</td>
    </tr>
    <tr>
        <td>prevCard</td>
        <td>-</td>
        <td>Turns to the previous card. If "disable loop property" is enabled, it stops at the fisrt card.</td>
    </tr>
    <tr>
        <td>reset</td>
        <td>-</td>
        <td>Resets everything to the initial state.</td>
    </tr>
    <tr>
        <td>resetFavourites</td>
        <td>-</td>
        <td>Resets favourite cards' selection.</td>
    </tr>
    <tr>
        <td>ShowOnlyFavourites</td>
        <td>-</td>
        <td>Displays only the cards marked as favourite.</td>
    </tr>
    <tr>
        <td>ShowAllCards</td>
        <td>-</td>
        <td>Displays all cards, favourite or not.</td>
    </tr>
    <tr>
        <td>countFavourites</td>
        <td>-</td>
        <td>Returns the number of cards marked as favourite.</td>
    </tr>
    <tr>
        <td>play</td>
        <td>cardNumber, reverse</td>
        <td>Plays the audio file of the indicated card and side. If no argument is provided, the method will play the audio associated with the currently visible card and side. If there is no audio file associated with the selected card and side, the method does nothing. The reverse argument should be a boolean (only if used within an Advanced Connector script or a custom addon, but not an onClick property of another addon), or a string with a value of "front", "reverse", "true", or "false".</td>
    </tr>
    <tr>
        <td>pause</td>
        <td>-</td>
        <td>Pauses the audio currently being played.</td>
    </tr>
    <tr>
        <td>stop</td>
        <td>-</td>
        <td>Stops (pauses and resets the progress) the audio currently being played.</td>
    </tr>
</tbody>
</table>

##Events

<table border='1'>
<tbody>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>item</td>
        <td>card number</td>
    </tr>
    <tr>
        <td>value</td>
        <td>favourite/unfavourite/playing/pause/ended</td>
    </tr>
</tbody>
</table>

##CSS classes

<table border='1'>
<tbody>
    <tr>
        <th>Class name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>.flashcards-wrapper</td>
        <td>Main addon container.</td>
    </tr>
    <tr>
        <td>.flashcards-main</td>
        <td>Wrapper of everything but the panel with card counter.</td>
    </tr>
    <tr>
        <td>.flashcards-panel</td>
        <td>Panel with card counter.</td>
    </tr>
    <tr>
        <td>.flashcards-prev, .flashcards-next </td>
        <td>Buttons on the sides of the module.</td>
    </tr>
    <tr>
        <td>.flashcards-card</td>
        <td>Main card container</td>
    </tr>
    <tr>
        <td>.flashcards-card-audio-wrapper</td>
        <td>Audio button wrapper.</td>
    </tr>
    <tr>
        <td>.flashcards-card-audio-button</td>
        <td>Audio button</td>
    </tr>
    <tr>
        <td>.flashcards-card-audio-button.playing</td>
        <td>Audio button playing state.</td>
    </tr>
    <tr>
        <td>.flashcards-card-audio-button.disabled</td>
        <td>Audio button disabled state (while loading audio).</td>
    </tr>  
    <tr>
        <td>.flashcards-card-front, .flashcards-card-back </td>
        <td>Front and back containers.</td>
    </tr>
    <tr>
        <td>.flashcards-card-contents</td>
        <td>Front and back content.</td>
    </tr>
    <tr>
        <td>.flashcards-button-favourite</td>
        <td>Favourite button</td>
    </tr>
    <tr>
        <td>.flashcards-button-favourite.flashcards-button-selected</td>
        <td>Favourite button selected state</td>
    </tr>
    <tr>
        <td>.flashcards-buttons</td>
        <td>Activity mode grading buttons wrapper</td>
    </tr>
    <tr>
        <td>.flashcards-button </td>
        <td>Activity mode grading button</td>
    </tr>
    <tr>
        <td>.flashcards-button.flashcards-button-selected</td>
        <td>Activity mode grading button selected state</td>
    </tr>
</tbody>
</table>    