### Description

In the Flash Cards module, you can create cards with varied content such as text, images, and audio, which are different at the front and back of the card. Each card can be marked as a favourite and graded by the student as correct or wrong in the activity mode.

## Properties

The list starts with the common properties, learn more about them by visiting the [Modules description](https://www.mauthor.com/doc/en/page/Modules-description) section. The other available properties are described below.

<table border='1'>
<tbody>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Cards</td>
        <td>A list of card items in which you define the front and back of each card.<br> 
        <table border='1'>
            <tbody>
                <tr>
                    <th>Property name</th>
                    <th>Description</th>
                </tr>
                <tr>
                    <td>Front</td>
                    <td>The content displayed on the front side of the card.</td>
                </tr>
                <tr>
                    <td>Back</td>
                    <td>The content displayed on the back side of the card. It is shown when the user clicks the front side of the card.</td>
                </tr>
                <tr>
                    <td>Audio Front</td>
                    <td>The audio file in MP3 format to be displayed on the front side of the card.</td>
                </tr>
                <tr>
                    <td>Audio Back</td>
                    <td>The audio file in MP3 format to be displayed on the back side of the card.</td>
                </tr>
            </tbody>
        </table>
    </td>
    </tr>
    <tr>
        <td>Disable Loop</td>
        <td>Disables the loop mode, so that the "previous" button won't turn to the first card and the "next" button won't turn to the last one.</td>
    </tr>
    <tr>
        <td>Enable Favourites</td>
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
        <td>When enabled, the module sends the score data depending on how many cards are marked as correct and wrong by using the Activity Buttons.</td>
    </tr>
    <tr>
        <td>Send event only on card changed</td>
        <td>When checked, only the card change event will be sent.</td>
    </tr>
    <tr>
        <td>Lang attribute</td>
        <td>This property allows defining the language for this module (different than the language of the lesson).</td>
    </tr>
    <tr>
        <td>Speech texts</td>
        <td>List of speech texts: Card, Out of, Favourite, Audio, Correct, Wrong, Reset, Selected, Deselected, Card has been reset, Turned. This text will be read by the Text to Speech module after the user performs a certain action.</td>
    </tr>
    <tr>
        <td>Randomize order</td>
        <td>When enabled, the order of cards will be randomized every time the module is loaded.</td>
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
        <td>-</td>
        <td>Shows the module if it is hidden.</td>
    </tr>
    <tr>
        <td>hide</td>
        <td>-</td>
        <td>Hides the module if it is visible.</td>
    </tr>
    <tr>
        <td>nextCard</td>
        <td>-</td>
        <td>Turns to the next card. If the "Disable Loop" property is enabled, it stops at the last card.</td>
    </tr>
    <tr>
        <td>prevCard</td>
        <td>-</td>
        <td>Turns to the previous card. If the "Disable Loop" property is enabled, it stops at the first card.</td>
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
        <td>showOnlyFavourites</td>
        <td>-</td>
        <td>Displays only the cards marked as favourite.</td>
    </tr>
    <tr>
        <td>showAllCards</td>
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

## Events

<table border='1'>
<tbody>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Item</td>
        <td>card number.</td>
    </tr>
    <tr>
        <td>Value</td>
        <td>favourite/unfavourite/playing/pause/ended/front/back.</td>
    </tr>
    
</tbody>
</table>

## CSS classes

<table border='1'>
<tbody>
    <tr>
        <th>Class name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>.flashcards-wrapper</td>
        <td>Main module container.</td>
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
        <td>Main card container.</td>
    </tr>
    <tr>
        <td>.flashcards-card-audio-wrapper</td>
        <td>Audio button wrapper.</td>
    </tr>
    <tr>
        <td>.flashcards-card-audio-button</td>
        <td>Audio button.</td>
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
        <td>Favourite button.</td>
    </tr>
    <tr>
        <td>.flashcards-button-favourite.flashcards-button-selected</td>
        <td>Favourite button selected state.</td>
    </tr>
    <tr>
        <td>.flashcards-buttons</td>
        <td>Activity mode grading buttons wrapper.</td>
    </tr>
    <tr>
        <td>.flashcards-button </td>
        <td>Activity mode grading button.</td>
    </tr>
    <tr>
        <td>.flashcards-button.flashcards-button-selected</td>
        <td>Activity mode grading button selected state.</td>
    </tr>
</tbody>
</table>