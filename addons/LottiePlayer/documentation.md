## Description

##### LottiePlayer allows for easy embedding and playing Lottie animations and the Lottie-based Telegram Sticker (tgs) animations in lessons.

## Properties

<table border='1'>
<tbody>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Animation JSON</td>
        <td>File of Animation in JSON.</td>
    </tr>
    <tr>
        <td>Loop</td>
        <td>When set to true, loops the animation.
            Property not works when property Play in succession is set to true and property Loops number have not defined value.
        </td>
    </tr>
    <tr>
        <td>Loops number</td>
        <td>The Loops number property defines the number of times to loop the animation. Setting the count property to 0 and setting loop to true, loops the animation indefinitely.
            Property only works when property Loop is set to true.
        </td>
    </tr>
    <tr>
        <td>Autoplay</td>
        <td>When set to true, automatically plays the visible animation on loading it.</td>
    </tr>
    <tr>
        <td>Direction</td>
        <td>Direction of the animation. Set to Forward to play the animation forward or set to Backward to play it backward.</td>
    </tr>
    <tr>
        <td>Mode</td>
        <td>Play mode. Setting the mode to Bounce plays the animation in an indefinite cycle, forwards and then backwards.</td>
    </tr>
    <tr>
        <td>Speed</td>
        <td>Animation speed. 
            Set this parameter to any positive number.
        </td>
    </tr>
    <tr>
        <td>Intermission [ms]</td>
        <td>Duration (in milliseconds) to pause before playing each cycle in a looped animation. 
            Set this parameter to 0 (no pause) or any positive number.</td>
    </tr>
    <tr>
        <td>Background</td>
        <td>Background color. By default, the background is transparent and will take the color of the parent container. 
            Supported formats:
            <ul>
                <li>HEX - For example: #D5F5E3</li>
                <li>RGB - For example: RGB(255,0,0)</li>
                <li>RGBA - For example: RGBA(255,0,0,0.3)</li>
            </ul>
        </td>
    </tr>
    <tr>
        <td>Alternative text</td>
        <td>This texts will be read by Text to Speech addon after a user performs an action.</td>
    </tr>
    <tr>
        <td>Preview alternative text</td>
        <td>This texts will be read by Text to Speech addon in preview.</td>
    </tr>
    <tr>
        <td>Controls</td>
        <td>When set to true, displays player controls.</td>
    </tr>
    <tr>
        <td>Play in succession</td>
        <td>When set to true, all animation playing after previous.
            Autoplay work automatically. Looping will not work without setting value to property Loops number.
        </td>
    </tr>
    <tr>
        <td>Loop succession</td>
        <td>When set to true, after played last animation goes to first.
            Works only when Play in succession set to true.</td>
    </tr>
    <tr>
        <td>Send event on every frame</td>
        <td>When set to true, animations send frame event on every frame.</td>
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
        <td>load</td>
        <td>animationIndex, URL</td>
        <td>Load animation. Animation index should be from 1 to n, where n is the number of configured animation files. URL, or a JSON string or object representing a Bodymovin JSON animation to play.</td>
    </tr>
    <tr>
        <td>play</td>
        <td>animationIndex</td>
        <td>Play animation. Animation index should be from 1 to n, where n is the number of configured animation files. If animation index will not be provided then current animation start playing. All other animations will be stopped.</td>
    </tr>
    <tr>
        <td>pause</td>
        <td>animationIndex</td>
        <td>Pause animation. Animation index should be from 1 to n, where n is the number of configured animation files. If animation index will not be provided then current animation will be paused.</td>
    </tr>
    <tr>
        <td>stop</td>
        <td>animationIndex</td>
        <td>Stop animation. Animation index should be from 1 to n, where n is the number of configured animation files. If animation index will not be provided then current animation will be stopped.</td>
    </tr>
    <tr>
        <td>freeze</td>
        <td>animationIndex</td>
        <td>Animation is paused due to player being invisible. Animation index should be from 1 to n, where n is the number of configured animation files. If animation index will not be provided then current animation will be frozen.</td>
    </tr>
    <tr>
        <td>playAll</td>
        <td>---</td>
        <td>Current animation will be played. All other animations will be stopped.</td>
    </tr>
    <tr>
        <td>pauseAll</td>
        <td>---</td>
        <td>All animation will be paused.</td>
    </tr>
    <tr>
        <td>stopAll</td>
        <td>---</td>
        <td>All animation will be stopped.</td>
    </tr>    
    <tr>
        <td>freezeAll</td>
        <td>---</td>
        <td>All animation will be paused due to player being invisible.</td>
    </tr>            
    <tr>
        <td>loop</td>
        <td>animationIndex, value</td>
        <td>Enables or disables looping the animation. Animation index should be from 1 to n, where n is the number of configured animation  Value is true or false - true enables looping, while false disables looping.</td>
    </tr>
    <tr>
        <td>frame</td>
        <td>animationIndex, numberFrame</td>
        <td>Seek animation to a given frame. Animation index should be from 1 to n, where n is the number of configured animation files. NumberFrame can either be a number or a percent string (for example, 40%). </td>
    </tr>
    <tr>
        <td>show</td>
        <td>---</td>
        <td>Show the addon.</td>
    </tr>
    <tr>
        <td>hide</td>
        <td>---</td>
        <td>Hide the addon.</td>
    </tr>
    <tr>
        <td>jumpTo</td>
        <td>animationIndex</td>
        <td>Jumps to animation with specified index. Animation index should be from 1 to n, where n is the number of configured animation files. Providing a animation number out of this range will have no effect.</td>
    </tr>
    <tr>
        <td>next</td>
        <td>---</td>
        <td>Jumps to next animation. If the last animation is currently displayed this command will have no effect.</td>
    </tr>
    <tr>
        <td>previous</td>
        <td>---</td>
        <td>Jumps to previous animation. If the first animation is currently displayed this command will have no effect.</td>
    </tr>
</tbody>
</table>

## Events

##### LottiePlayer addon sends ValueChanged type events to Event Bus when either user selects it.

<table border='1'>
<tbody>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Item</td>
        <td>---</td>
    </tr>
    <tr>
        <td>Value</td>
        <td>1</td>
    </tr>
    <tr>
        <td>Score</td>
        <td>---</td>
    </tr>
</tbody>
</table>

##### The load event occurs when the animation load.

<table border='1'>
<tbody>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Item</td>
        <td>Number animation from list. Animation number should be from 1 to n.</td>
    </tr>
    <tr>
        <td>Value</td>
        <td>load</td>
    </tr>
    <tr>
        <td>Score</td>
        <td>---</td>
    </tr>
</tbody>
</table>

##### The error event occurs when  animation source cannot be parsed, fails to load or has format errors.

<table border='1'>
<tbody>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Item</td>
        <td>Number animation from list. Animation number should be from 1 to n.</td>
    </tr>
    <tr>
        <td>Value</td>
        <td>error</td>
    </tr>
    <tr>
        <td>Score</td>
        <td>---</td>
    </tr>
</tbody>
</table>

##### The ready event occurs when animation data is loaded and player is ready.

<table border='1'>
<tbody>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Item</td>
        <td>Number animation from list. Animation number should be from 1 to n.</td>
    </tr>
    <tr>
        <td>Value</td>
        <td>ready</td>
    </tr>
    <tr>
        <td>Score</td>
        <td>---</td>
    </tr>
</tbody>
</table>


##### The play event occurs when animation starts playing.

<table border='1'>
<tbody>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Item</td>
        <td>Number animation from list. Animation number should be from 1 to n.</td>
    </tr>
    <tr>
        <td>Value</td>
        <td>play</td>
    </tr>
    <tr>
        <td>Score</td>
        <td>---</td>
    </tr>
</tbody>
</table>

##### The pause event occurs when animation paused.

<table border='1'>
<tbody>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Item</td>
        <td>Number animation from list. Animation number should be from 1 to n.</td>
    </tr>
    <tr>
        <td>Value</td>
        <td>pause</td>
    </tr>
    <tr>
        <td>Score</td>
        <td>---</td>
    </tr>
</tbody>
</table>

##### The stop event occurs when animation stopped.

<table border='1'>
<tbody>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Item</td>
        <td>Number animation from list. Animation number should be from 1 to n.</td>
    </tr>
    <tr>
        <td>Value</td>
        <td>stop</td>
    </tr>
    <tr>
        <td>Score</td>
        <td>---</td>
    </tr>
</tbody>
</table>

##### The freeze event occurs when animation is paused due to player being invisible.

<table border='1'>
<tbody>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Item</td>
        <td>Number animation from list. Animation number should be from 1 to n.</td>
    </tr>
    <tr>
        <td>Value</td>
        <td>freeze</td>
    </tr>
    <tr>
        <td>Score</td>
        <td>---</td>
    </tr>
</tbody>
</table>

##### The loop event occurs when animation loop is completed.

<table border='1'>
<tbody>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Item</td>
        <td>Number animation from list. Animation number should be from 1 to n.</td>
    </tr>
    <tr>
        <td>Value</td>
        <td>loop</td>
    </tr>
    <tr>
        <td>Score</td>
        <td>---</td>
    </tr>
</tbody>
</table>

##### The complete event occurs when animation is complete (all loops completed).

<table border='1'>
<tbody>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Item</td>
        <td>Number animation from list. Animation number should be from 1 to n.</td>
    </tr>
    <tr>
        <td>Value</td>
        <td>complete</td>
    </tr>
    <tr>
        <td>Score</td>
        <td>---</td>
    </tr>
</tbody>
</table>

##### The frame event occurs when a new frame is entered.

<table border='1'>
<tbody>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Item</td>
        <td>Number animation from list. Animation number should be from 1 to n.</td>
    </tr>
    <tr>
        <td>Value</td>
        <td>frame</td>
    </tr>
    <tr>
        <td>Score</td>
        <td>---</td>
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
        <td>.lottie-player-invalid-configuration</td>
        <td>Addon's invalid configuration</td>
    </tr>
    <tr>
        <td>.lottie-player-visible-animation</td>
        <td>Indicates the style that applies to currently displayed animation</td>
    </tr>
    <tr>
        <td>.lottie-player-invisible-animation</td>
        <td>Indicates the style that applies to not displayed animations</td>
    </tr>
    <tr>
        <td>lottie-player::part(keyboard_navigation_active_element)</td>
        <td>Indicates the style that applies to the control activated by keyboard navigation</td>
    </tr>
</tbody>
</table>
