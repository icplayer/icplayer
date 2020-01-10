## Description
The Hangman addon allows users to embed the hangman game functionality in their presentations.

## Multiple phrases

It is possible to set more than one phrase in the addon. A user will be able to switch between them via the addon's commands (nextPhrase(), previousPhrase() and switchPhrase()).

## Properties

<table border='1'>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Phrases</td>
        <td>List of phrases. Each phrase consists of 'Phrase' (string with space separated words ) and 'Letters' (comma separated letters available for users to select, an empty field means that all English alphabet letters are available). If you want to mark a letter in 'Phrase' as a tip, then type an exclamation mark before it, e.g. if you want to make letters 'H', 'G', and 'D' constant in the phrase 'HANGMAN DEMO', then the whole phrase will look like this: '!HAN!GMAN !DEMO'</td>
    </tr>
    <tr>
        <td>Possible mistakes</td>
        <td>Number of mistakes user can make for each phrase and still would be able to select letters</td>
    </tr>
    <tr>
        <td>Keyboard letters order</td>
        <td>This property allows you to set a custom order of letters on a keyboard. The input consists of comma separated letters, which are to present the active keyboard letters order for all phrases in the Hangman module. You don't need to specify
            all the letters. This property uses basic English alphabet (A-Z), letters not entered will be added in the alphabetical order. Leaving this property empty causes the module to use the A-Z order.
            For example "a, g, h, j, b, c, d" will create the Hangman keyboard with the following order of letters "a, g, h, j, b, c, d, e, f, g... z".</td>
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
        <td>nextPhrase</td>
        <td>---</td>
        <td>Switch to the next phrase</td>
    </tr>
    <tr>
        <td>previousPhrase</td>
        <td>---</td>
        <td>Switch to the previous phrase</td>
    </tr>
    <tr>
        <td>switchPhrase</td>
        <td>phraseNumber</td>
        <td>Switch to the specified phrase</td>
    </tr>
    <tr>
        <td>showCorrect</td>
        <td>---</td>
        <td>Show correct answer for a current phrase</td>
    </tr>
    <tr>
        <td>hide</td>
        <td>---</td>
        <td>Hide Addon</td>
    </tr>
    <tr>
        <td>show</td>
        <td>---</td>
        <td>Show Addon</td>
    </tr>
    <tr>
        <td>isAllOK</td>
        <td>---</td>
        <td>Returns true when all phrases are filled in correctly</td>
    </tr>
</table>

## Advanced Connector integration
Each command supported by the Hangman addon can be used in the Advanced Connector addon's scripts. The below example shows how to react when the Text module's gap content changes (i.e. by putting in it elements from the Source List) and change displayed phrase.

        EVENTSTART
        Source:Text2
        Value:1
        SCRIPTSTART
            var hangman = presenter.playerController.getModule('Hangman1');
            hangman.switchPhrase(1);
        SCRIPTEND
        EVENTEND
        EVENTSTART
        Source:Text2
        Value:2
        SCRIPTSTART
            var hangman = presenter.playerController.getModule('Hangman1');
            hangman.switchPhrase(2);
        SCRIPTEND
        EVENTEND
        EVENTSTART
        Source:Text2
        Value:3
        SCRIPTSTART
            var hangman = presenter.playerController.getModule('Hangman1');
            hangman.switchPhrase(3);
        SCRIPTEND
        EVENTEND

## Scoring
The Hangman addon allows to create exercises as well as activities.

<table border='1'>
    <tr>
        <th>Property</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>maxScore</td>
        <td>Number of phrases</td>
    </tr>
    <tr>
        <td>score</td>
        <td>1 score point for every correctly and fully selected phrase</td>
    </tr>
    <tr>
        <td>errorCount</td>
        <td>1 error point for every not fully selected phrase</td>
    </tr>
</table>

## Events
The Hangman addon sends ValueChanged type events to Event Bus when users select a letter and when they have used all possible attempts. Event sent on a letter selection has the following fields:

<table border='1'>
<tbody>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <tr>
            <td>Item</td>
            <td>Current phrase number (from 1 to n)</td>
        </tr>
        <tr>
            <td>Value</td>
            <td>Selected letter</td>
        </tr>
        <tr>
            <td>Score</td>
            <td>1 for correct selection, 0 for incorrect</td>
        </tr>
    </tr>
</tbody>
</table>

When a user has run out of mistakes, the addon sends an event with fields completed as described below.

<table border='1'>
<tbody>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <tr>
            <td>Item</td>
            <td>Current phrase number (from 1 to n)</td>
        </tr>
        <tr>
            <td>Value</td>
            <td>EOT</td>
        </tr>
        <tr>
            <td>Score</td>
            <td>N/A</td>
        </tr>
    </tr>
</tbody>
</table>

When a user has lose game (have mistakes above declared in Possible mistakes property), the addon sends an event with fields completed as described below.

<table border='1'>
<tbody>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <tr>
            <td>Item</td>
            <td>Current phrase number (from 1 to n)</td>
        </tr>
        <tr>
            <td>Value</td>
            <td>EOG</td>
        </tr>
        <tr>
            <td>Score</td>
            <td>N/A</td>
        </tr>
    </tr>
</tbody>
</table>
When a user fills in all phrases properly, the addon sends the 'ALL OK' event. This event is different from a normal event so its structure is shown below.

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
        <td>hangman-wrapper</td>
        <td>DIV wrapping Addon elements</td>
    </tr>
    <tr>
        <td>hangman-letters</td>
        <td>DIV containing letters for user to be selected</td>
    </tr>
    <tr>
        <td>hangman-phrase</td>
        <td>DIV containing current phrase words</td>
    </tr>
    <tr>
        <td>hangman-phrase-word</td>
        <td>DIV element containing single word in current phrase</td>
    </tr>
    <tr>
        <td>hangman-letter</td>
        <td>DIV element representing a single letter (both in letters and phrase containers)</td>
    </tr>
    <tr>
        <td>empty</td>
        <td>Additional class for letter element in phrase container that has no text</td>
    </tr>
    <tr>
        <td>selected</td>
        <td>Additional class for letter element in letters container that has been selected</td>
    </tr>
    <tr>
        <td>correct</td>
        <td>Additional class for a correctly selected letter in error checking mode</td>
    </tr>
    <tr>
        <td>incorrect</td>
        <td>Additional class for incorrectly selected or not selected letter in error checking mode</td>
    </tr>
</table>

## Example
    .Hangman_cheerful { }

    .Hangman_cheerful .hangman-letter {
      background-color: orange;
    }

    .Hangman_cheerful .hangman-letter.selected {
      background-color: blanchedAlmond;
    }

    .Hangman_cheerful .hangman-letter.empty {
      background-color: white;
    }

    .Hangman_cheerful .hangman-letter.correct {
        background-color: #adff2f;
    }

    .Hangman_cheerful .hangman-letter.incorrect {
        background-color: red;
    }

Above example changes letters background color in every scenario (work and error checking mode).

## Demo presentation
[Demo presentation](/embed/4871920265723904 "Demo presentation") contains examples on how to use the Hangman addon.                    