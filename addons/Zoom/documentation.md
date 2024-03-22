## Description

The Zoom module allows to zoom the view.

## Properties

The list starts with the common properties, learn more about them by visiting the [Modules description](doc/en/page/Modules-description) section.

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
            <td>
                Zoom in at position relative to page. If page is already zoomed in, use the `zoomOut` command first.<br>
                For more information about page, see <a href='//www.mauthor.com/doc/en/ic_page/page/Page' target='_blank'>documentation.
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
            <td>.zoom-wrapper .zoom-button-container</td>
            <td>Indicates the style that applies to container of zoom in button.</td>
        </tr>
        <tr>
            <td>.zoom-wrapper .zoom-button-container .zoom-button</td>
            <td>Indicates the style that applies to zoom in button.</td>
        </tr>
        <tr>
            <td>.zoomed-space-container</td>
            <td>Indicates the style that applies to fixed div element created in body of document when zoomed in. Position and size are calculated to match Visual Viewport.</td>
        </tr>
        <tr>
            <td>.zoomed-space-container .zoom-out-button-container</td>
            <td>Indicates the style that applies to container of zoom out button.</td>
        </tr>
        <tr>
            <td>.zoomed-space-container .zoom-out-button-container .zoom-out-button</td>
            <td>Indicates the style that applies to zoom out button.</td>
        </tr>
        <tr>
            <td>.ic_page.zoom-cursor-zoom-in</td>
            <td>Indicates the style that applies to page when next click on page will zoom in to the selected position.</td>
        </tr>
    </tbody>
</table>

## Keyboard navigation

* Esc – Zoom out.