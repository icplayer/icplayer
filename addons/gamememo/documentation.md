## Description

The Memo Game module allows creating a simple game that checks the user's ability to match different pairs of items. Initially, all items are placed randomly on hidden cards ("face down"). A user can check what is "under" the card by clicking on it, but the card turns back to its hidden state in case of a mismatch. 
A user has to find all matching pairs by remembering the location of individual items and their meaning.

The demo presentation is available [here](/embed/6360676558700544).

Each card contains one item, which is text (unformatted) or image. You can build pairs from various types of items – text with text, text with image or image with image.

Cards' reverses can be displayed in one or two styles. In the first case, all cards look the same to the user when they are hidden. In the latter one, first items in each pair use different style then the second one, which serves as a hint to the user. Cards' reverses can be styled using CSS or can be filled with an image.

In case of a mismatch, a module draws an “X” sign on a just shown card to notify the user about the failure. That cards are hidden again when a user clicks on another card.

## Properties

<table border="1">
  <tbody>
    <tr>
      <th>Property
name</th>
      <th>Description</th>
    </tr>
    <tr>
      <td>Pairs</td>
      <td>List of items to match</td>
    </tr>
    <tr>
      <td>Columns</td>
      <td>Amount of columns in the grid of cards</td>
    </tr>
    <tr>
      <td>Rows</td>
      <td>Amount of rows in the grid of cards</td>
    </tr>
    <tr>
      <td>Use two styles for cards</td>
      <td>If checked, the first item in each pair uses different style for a card than the second one</td>
    </tr>
    <tr>
      <td>Keep cards aspect ratio</td>
      <td>If checked, cards are fitted into a rectangular shape of even if the module itself isn't rectangular</td>
    </tr>
    <tr>
      <td>Show cards for preview</td>
      <td>If checked, it shows cards instead of their reverses in the editor</td>
    </tr>
    <tr>
      <td>Image for style A</td>
      <td>If uploaded, that image will be used to indicate cards' reverses for the first item in each pair. If “Use two styles for cards” isn't checked, that will apply to all cards.
<p><em>This property allows online resources. <a href="/doc/page/Online-resources">Find out more »</a></em></p>
</td>
    </tr>
    <tr>
      <td>Image for style B</td>
      <td>If uploaded, the image will be used to indicate cards' reverses for the second item in each pair.
<p><em>This property allows online resources. <a href="/doc/page/Online-resources">Find out more »</a></em></p>
</td>
    </tr>
    <tr>
      <td>Image Mode</td>
      <td>A list of available image size adjustments to the Addon's size. The choice embraces: Original (no changes), KeepAspect and Stretch.</td>
    </tr>
    <tr>
      <td>Time to solve the task</td>
      <td>Time (in seconds) to solve the task.<br />
	  Time is measured from the first click on a card. When the time is up, the "Session ended message" is displayed.<br>
	  The default empty value means that the time will not be measured.</td>
    </tr>
    <tr>
      <td>Session ended message</td>
      <td>This message is displayed when the time to solve the task is over.</td>
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
        <td>Returns true when all cards are matched correctly, otherwise false</td>
    </tr>
    <tr>
        <td>show</td>
        <td>---</td>
        <td>Shows the module</td>
    </tr>
    <tr>
        <td>hide</td>
        <td>---</td>
        <td>Hides the module</td>
    </tr>
</table>

##Show Answers

This module is fully compatible with [Show Answers module](/doc/page/Show-Answers "Show Answers module") and displays correct answers when a relevant event is sent.

## Events

When a user properly matches all cards, the addon sends the 'ALL OK' event. This event is different from a normal event so its structure is shown below.

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

When a user matches a pair of cards, the addon sends the 'ValueChanged' event. This event has score 1 if the cards are matched properly, otherwise 0.
The event also has an item, a pair of clicked cards' IDs - (the first clicked card, the second clicked card).

<table border='1'>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>source</td>
        <td>ID of this instance of the addon</td>
    </tr>

    <tr>
        <td>Item</td>
        <td>A pair of cards' IDs. The format is as shown below:
        first_clicked_card_id-second_clicked_card_id</td>
    </tr>
    <tr>
        <td>Value</td>
        <td>1</td>
    </tr>
    <tr>
        <td>Score</td>
        <td>1 - a pair is matched correctly <br>
        0 - a pair is matched incorrectly</td>
    </tr>
</table>

When the time to solve the task is specified and a user starts a session (first card selection), the addon sends the following events:

<table border='1'>
    <tr>
        <th>Event type</th>
		<th>Field name</th>
        <th>Description</th>
    </tr>
	<tr>
		<td rowspan='4'>ItemConsumed</td>
		<td colspan='2'>Event occurs every second when addon is active (user started the game)</td>
    <tr>
        <td>source</td>
        <td>ID of this instance of the addon</td>
    </tr>

    <tr>
        <td>Item</td>
        <td>progress of time (%)</td>
    </tr>
    <tr>
        <td>Value</td>
        <td>Spent time (in format: MM:SS)</td>
    </tr>
	<tr>
		<td rowspan='5'>ItemSelected</td>
		<td colspan='2'>Event occurs when session starts or when the time is over.</td>
    <tr>
        <td>source</td>
        <td>ID of this instance of the addon</td>
    </tr>

    <tr>
        <td>Item</td>
        <td>"startSession" or "endSession"</td>
    </tr>
    <tr>
        <td>Value</td>
        <td>[empty]</td>
    </tr>
    <tr>
        <td>Score</td>
        <td>[empty]</td>
    </tr>
</table>





## Configuration

The module will obviously generate twice as many cards as are defined in "Pairs" property. They will be spread in a grid of geometry defined with the "Columns" and "Rows" properties. The amount of cells in the grid has to match the amount of cards. For example, if you have 10 pairs, it will generate 20 cards, and the grid can consist of e.g. 4 rows and 5 columns.

To configure a minimal implementation of the module you have to:

* Define at least two pairs by filling the "Pairs" property,
* Define geometry by filling the "Rows" and "Columns" property to match the required amount of cards.

## CSS classes

<table border='1'>
<tbody>
    <tr>
        <th>Class name</th>
        <th>Description</th> 
    </tr>

    <tr>
        <td>.gamememo_container .placeholder</td>
        <td>indicates the style that applies to all cards; if you want to add space between cards, use the top/left/right/bottom property with a positive value</td> 
    </tr>

    <tr>
        <td>.gamememo_container .front</td>
        <td>indicates the style that applies to cards regardless of their type when their content is hidden (user sees the reverse of the card).</td> 
    </tr>

    <tr>
        <td>.gamememo_container .front_A</td>
        <td>indicates the style that applies to type A cards (or all cards if the "Use two styles for cards" property is not set) when  their content is hidden (user sees the reverse of the card).  If you want to use an image, use the "Image for style B" property.</td> 
    </tr>

    <tr>
        <td>.gamememo_container .front_B</td>
        <td>indicates the style that applies to type B cards (used only if the "Use two styles for cards" property is not set) when their content is hidden (user sees the reverse of the card). If you want to use an image, use the "Image for style B" property.</td> 
    </tr>

    <tr>
        <td>.gamememo_container .back</td>
        <td>indicates the style that applies to cards when they are uncovered (user sees the content of the card).</td> 
    </tr>

    <tr>
        <td>.gamememo_container .mismatch_mark</td>
        <td>indicates the style that applies to the "X" symbol that appears for a while after matching the invalid pair of cards.</td> 
    </tr>

    <tr>
        <td>.gamememo_container .tick_mark</td>
        <td>indicates the style applying to the tick symbol that appears for a while after matching the right pair of cards.</td>
    </tr>

    <tr>
        <td>.gamememo_container .cell-show-answers</td>
        <td>indicates the style that applies to cards when Show Answers is active.</td> 
    </tr>
    <tr>
        <td>.gamememo_container .cell-wrong</td>
        <td>indicates the style that applies to the cards when the check answers mode is active and a card has been matched incorrectly.</td>
    </tr>

    <tr>
        <td>.gamememo_container .memo-lock-screen</td>
        <td>style of the overlay layer that displays when time to solve the tas is over.</td>
    </tr>

    <tr>
        <td>.gamememo_container .memo-lock-screen-info</td>
        <td>style of the layer on which "Session Ended Message" appears.</td>
    </tr>


    <tr>
        <td>.gamememo_container .cell-correct</td>
        <td>indicates the style that applies to the cards when the check answers mode is active and a card has been matched correctly.</td>
    </tr>
    <tr>
        <td>.gamememo_container .keyboard_navigation_active_element</td>
        <td>indicates the style that applies to the card activated by keyboard navigation</td>
    </tr>

</tbody>
</table>

###Examples

**1.1. Just add some space between cards and border:**  

    .gamememo_boxed {
    }

    .gamememo_boxed div.placeholder {
        bottom: 4px;
        top: 4px;
        left: 4px;
        right: 4px;
    }

    .gamememo_boxed div.front_A {
        border: 2px solid #000;
    }

    .gamememo_boxed div.front_A:hover {
        border: 2px solid yellow;
    }

**1.2. Rounded corners, shadow and borders:**  

    .gamememo_pretty {
    }

    .gamememo_pretty div.placeholder {
        border-radius: 12px;
        bottom: 4px;
        top: 4px;
        left: 4px;
        right: 4px;
    }

    .gamememo_pretty div.front {
        box-shadow: 1px 1px 8px 3px #ccc;
    }

    .gamememo_pretty div.front_A {
        border: 2px solid #fff;
    }

    .gamememo_pretty div.front_B {
        border: 2px solid #fff;
    }

    .gamememo_pretty div.back {
        border-radius: 12px;
        border: 1px dotted #ccc;
        bottom: 4px;
        top: 4px;
        left: 4px;
        right: 4px;
    }     

## Keyboard navigation
	
* arrows - navigation between cards
* space - select a card
	
##Demo presentation
[Demo presentation](/embed/6360676558700544 "Demo presentation") contains examples of how to use the Memo Game addon.                  