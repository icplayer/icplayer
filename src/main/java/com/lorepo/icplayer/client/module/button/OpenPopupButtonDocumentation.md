## Description
Opens a corresponding popup window.

## Properties

The list starts with the common properties, learn more about them by visiting the [Modules description](https://www.mauthor.com/doc/en/page/Modules-description) section. The other available properties are described below.

<table border='1'>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Title</td>
        <td>A title displayed inside the addon.</td>
    </tr>
    <tr>
        <td>Page Title</td>
        <td>A title of a corresponding page to be opened.</td>
    </tr>
    <tr>
        <td>Additional classes</td>
        <td>This option allows user to add additional classes.</td>
    </tr>
    <tr>
        <td>Popup top position</td>
        <td>This option allows to set top position. The value represents the distance between top of a player and popup. If a value is not provided, the popup will be placed in the center of the visible vertical player space.</td>
    </tr>
    <tr>
        <td>Popup left position</td>
        <td>This option allows to set left position. The value represents the distance between left of a player and popup. If a value is not provided, the popup will be placed in the center of the visible horizontal player space.</td>
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
        <td>hide</td>
        <td>---</td>
        <td>Hides the module.</td>
    </tr>
    <tr>
        <td>show</td>
        <td>---</td>
        <td>Shows the module.</td>
    </tr>
</table>

## Events
The module sends events to Event Bus when a user clicks on it.

<table border='1'>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Value</td>
        <td>clicked</td>
    </tr>
</table>

## CSS classes

<table border="1">
    <tr>
        <th style="width: 300px;">Class name</th>
        <th style="width: 843px;">Description</th>
    </tr>
    <tr>
        <td style="width: 300px;">.ic_button_popup</td>
        <td style="width: 843px;">indicates the look of the Popup button</td>
    </tr>
    <tr>
        <td style="width: 300px;">.ic_button_popup-up-hovering</td>
        <td style="width: 843px;">indicates the look of the Popup button on mouse hover</td>
    </tr>
    <tr>
        <td style="width: 300px;">.ic_button_popup-down-hovering</td>
        <td style="width: 843px;">indicates the look of the Popup button on mouse click</td>
    </tr>
</table>

### Examples

**1.1. Popup:**

    .ic_button_popup {
        background-image: url('/file/serve/117040');
        background-repeat: no-repeat;
        background-position: center;
    }
    
**1.2. Popup — up-hovering:**

    .ic_button_popup-up-hovering {
        background-image: url('/file/serve/117041');
    }
    
**1.3. Popup — down-hovering:**

    .ic_button_popup-down-hovering {
        background-image: url('/file/serve/123001');
    }
