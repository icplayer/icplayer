## Description
This module allows to prepare a dictionary. After triggering a proper command from another module, a selected word together with its description will appear in a modal dialog box.

It is also possible to use one Glossary addon for the entire lesson. To do that, simply embed the addon in a header or footer page in Commons, and then trigger Glossary on all pages available in a presentation. You may of course call different dictionary entries on different pages.

By default, Glossary cooperates with Text module and shows definitions triggered by the Definition event.

## Properties

<table border="1">
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>List of words</td>
        <td>It's dictionary describing ID, Text, Description of words.</td>
    </tr>
    <tr>
        <td>ID</td>
        <td>This must be a unique value. It's a key for other modules to find selected Text and Description in dicitonary.</td>
    </tr>
    <tr>
        <td>Text</td>
        <td>This value will be displayed in a header of modal box.</td>
    </tr>
    <tr>
        <td>Description</td>
        <td>This is a description for the word.</td>
    </tr>
    <tr>
        <td>Visible</td>
        <td>This is a helper, which allows you to preview dialog box in editor.</td>
    </tr>
    <tr>
        <td>Open external link in</td>
        <td>This property allows selecting the location for new pages being opened via external links: new tab (default) or the same tab.
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
        <td>id</td> 
        <td>Example: Glossary1.show("Word_ID"). This command will open dialog box with description of Word with id = Word_ID.</td> 
    </tr>
</tbody>
</table>

## Advanced Connector integration
Each command supported by the Glossary addon can be used in Advanced Connector addon scripts. The below example presents how to show a Dialog Box with a definition of Word_ID element set in Glossary.

<pre>
    EVENTSTART
    Source:Text2
    SCRIPTSTART
        var glossaryModule = presenter.playerController.getModule('Glossary1');
        glossaryModule.show("Word_ID");
    SCRIPTEND
    EVENTEND
</pre>

## CSS classes

<table border='1'>
    <tr>
        <th>Class name</th>
        <th>Description</th> 
    </tr>
    <tr>
        <td>.ui-dialog</td>
        <td>indicates the look of the dialog box</td> 
    </tr>
    <tr>
        <td>.ui-dialog-titlebar</td>
        <td>indicates the look of the titlebar</td> 
    </tr>
    <tr>
        <td>ui-dialog-title-dialog</td>
        <td>indicates the look of the title</td> 
    </tr>
    <tr>
        <td>.ui-dialog-titlebar-close</td>
        <td>indicates the look of the close button</td> 
    </tr>
    <tr>
        <td>.ui-dialog-content</td>
        <td>indicates the look of the description container</td> 
    </tr>
</table>

## Example styling

**Custom styling from demo presentation:**  

    .GlossaryCustomStyling {
    }

    .GlossaryCustomStyling .ui-dialog {
        width:500px !important;
        border:1px solid #fcc;
        overflow:visible;
    }

    .GlossaryCustomStyling .ui-dialog-titlebar {
        border:2px solid #fcc;
        background:none;
        background-color:Tomato;
    }

    .GlossaryCustomStyling .ui-dialog-title {
        color:#111;
    }

    .GlossaryCustomStyling .ui-widget-content {
        background:none;
        background-color:#111;
        color:#fff;
    }

    .GlossaryCustomStyling .ui-corner-all {
        border-radius:10px;
    }

## Demo presentation
[Demo presentation](/embed/2452236 "Demo presentation") contain examples of how to use Glossary addon.            