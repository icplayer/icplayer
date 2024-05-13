## Description

The Zoom module allows to zoom in on a lesson page (`.ic_page` element) and interact with modules while zoomed in.

If the lesson page does not fit on the screen then note that the zoomed in area will also not fit on the page. 
However, using the scroll, it will be possible to get to the specified area. For this reason, it is recommended to 
test if the set width and height of the addon for the mobile layout is sufficient so that the user does not have to 
scroll too much.

Addons embedded in the header and footer that need scale information (like Ordering module) will work incorrectly 
when zoomed in by the Zoom addon (even if neither header nor footer is zoomed in).

Addon must not be placed in the header or footer to work properly.

## Requirements
If the content of the player is scaled then to make addon work, it is necessary to set the scale information 
using the `player.setScaleInformation` command. 
Learn more about scale information by visiting the 
[Modules description](doc/en/scale%20information/page/Scale-Information) section.

## Properties
The list starts with the common properties, learn more about them by visiting the 
[Modules description](doc/en/page/Modules-description) section.

<table border='1'>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Mode</td>
        <td>
            <table border='1'>
                <tr>
                    <th>Mode name</th>
                    <th>Description</th> 
                </tr>
                <tr>
                    <td>Targeted area</td>
                    <td>Zooms the area within the size of the addon. 
                        It is required that the addon is within the boundaries of the page (`.ic_page` element).
                        <br><br>
                        <i>This mode is chosen by default.</i>
                    </td> 
                </tr>
                <tr>
                    <td>Area around a clicked point</td>
                    <td>Zooms twice in on the area around the point clicked by the user.</td> 
                </tr>
            </table>
        </td>
    </tr>
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
            <td>Show the addon.</td>
        </tr>
        <tr>
            <td>hide</td>
            <td>---</td>
            <td>Hide the addon.</td>
        </tr>
        <tr>
            <td>zoomIn</td>
            <td>xPosition, yPosition</td>
            <td>Zoom twice in at position relative to page. If page is already zoomed in, use the `zoomOut` command first.<br>
                For more information about page, see 
                <a href='//www.mauthor.com/doc/en/ic_page/page/Page' target='_blank'>documentation.</a><br><br>
                <i>Command is available regardless of the chosen `mode`.</i><br>
                <i>The command will execute, even if values are specified by the user that would make the zoom not 
                    inside the page border. For such a situation, the zoom will execute, but the addon will modify the 
                    user-specified values to ones where the zoomed area will be inside the page boundary.
                </i>
            </td>
        </tr>
        <tr>
            <td>zoomInArea</td>
            <td>xCenterPosition, yCenterPosition, areaWidth, areaHeight</td>
            <td>Zoom in on the area relative to page. If page is already zoomed in, use the `zoomOut` command first.<br>
                For more information about page, see 
                <a href='//www.mauthor.com/doc/en/ic_page/page/Page' target='_blank'>documentation.</a><br><br>
                <i>Command is available regardless of the chosen `mode`.</i><br>
                <i>The command will execute, even if values are specified by the user that would make the zoom not 
                    inside the page border. For such a situation, the zoom will execute, but the addon will modify the 
                    user-specified values to ones where the zoomed area will be inside the page boundary.
                </i>
            </td>
        </tr>
        <tr>
            <td>zoomOut</td>
            <td>---</td>
            <td>Zoom out.</td>
        </tr>
    </tbody>
</table>

## Events

This module does not send events.

## CSS classes

<table border='1'>
    <tbody>
        <tr>
            <th>Class name</th>
            <th>Description</th>
        </tr>
        <tr>
            <td>.zoom-wrapper</td>
            <td>Addon's main class for zoom in elements.</td>
        </tr>
        <tr>
            <td>.zoom-wrapper.targeted-area</td>
            <td>Indicates the style that applies to addon's zoom wrapper when `Targeted area` mode is chosen.</td>
        </tr>
        <tr>
            <td>.zoom-wrapper.area-around-clicked-point</td>
            <td>Indicates the style that applies to addon's zoom wrapper when `Area around a clicked point` mode is chosen.</td>
        </tr>
        <tr>
            <td>.zoom-wrapper.zoom-wrapper-highlight</td>
            <td>Indicates the style that applies to addon's zoom wrapper while mouse if over the zoom in button.<br><br>
                <i>Available when `Targeted area` mode is chosen.</i>
            </td>
        </tr>
        <tr>
            <td>.zoom-wrapper .zoom-button-container</td>
            <td>Indicates the style that applies to container of zoom in button.</td>
        </tr>
        <tr>
            <td>.zoom-wrapper .zoom-button-container .zoom-button</td>
            <td>Indicates the style that applies to zoom in button.</td>
        </tr>
        <tr>
            <td>.zoom-wrapper .zoom-button-container .zoom-button.selected</td>
            <td>Indicates the style that applies to selected zoom in button.</td>
        </tr>
        <tr>
            <td>.zoomed-area-container</td>
            <td>Indicates the style that applies to fixed div element created in body of document when zoomed in. 
                Position and size are calculated to match visible content of player.
            </td>
        </tr>
        <tr>
            <td>.zoomed-area-container .zoom-out-button-container</td>
            <td>Indicates the style that applies to container of zoom out button.</td>
        </tr>
        <tr>
            <td>.zoomed-area-container .zoom-out-button-container .zoom-out-button</td>
            <td>Indicates the style that applies to zoom out button.</td>
        </tr>
        <tr>
            <td>.ic_page.zoom-cursor-zoom-in</td>
            <td>Indicates the style that applies to page when next click on page will zoom in to the selected 
                position.
            </td>
        </tr>
        <tr>
            <td>.ic_page.zoom-zoomed-in</td>
            <td>Indicates the style that applies to page when it has been zoomed in by a Zoom addon.</td>
        </tr>
    </tbody>
</table>

## Keyboard navigation

* Esc – Zoom out.

## Addons and functionalities without support or partial support for zoomed in area by Zoom addon

* IWB Toolbar
* Slider
* PieChart
* Points and Lines
* Editable Window
* File Sender
* Glossary
* Open Popup Button
* Command <a href='//www.mauthor.com/doc/en/PlayerServices/page/Player-services' target='_blank'>showPopup</a>
* mAuthor and mCourser "Full screen" option