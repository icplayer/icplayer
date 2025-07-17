## Description

The Hierarchical Table Of Contents module displays a presentation's table of contents with links to corresponding pages. The module supports the hierarchical lesson structure.

## Properties

The list starts with the common properties. Learn more about them by visiting the <a href="/doc/en/page/Modules-description" target="_blank" rel="noopener noreferrer">Modules description</a> section. The other available properties are described below.

<table border='1'>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Title label</td>
        <td>Label for a column with page names, displayed in the header.</td>
    </tr>
    <tr>
        <td>Display only chapters</td>
        <td>With this option selected, only chapters will be displayed.</td>
    </tr>
    <tr>
        <td>Depth of expand</td>
        <td>Defines the depth of expanding the initial nodes. If the value is not set, all nodes will be collapsed.</td>
    </tr>
    <tr>
        <td>Show pages</td>
        <td>
            <ul>
                <li><b>All</b> &ndash; all pages will be displayed.</li>
                <li><b>Reportable</b> &ndash; reportable pages will be displayed.</li>
                <li><b>Not-reportable</b> &ndash; pages that are not reportable will be displayed.</li>
            </ul>
        </td>
    </tr>
    <tr>
        <td>Lang attribute</td>
        <td>This property allows defining the language for this module (different than the language of the lesson).</td>
    </tr>
    <tr>
        <td>Speech texts</td>
        <td>Sets the values of speech texts - predefined phrases providing additional context while using the module in the <a href="/doc/en/page/Text-To-Speech" target="_blank" rel="noopener noreferrer">Text To Speech</a> mode. Speech texts are always read using the content's default language. </td>
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
        <td>Hides the module if it is visible.</td>
    </tr>
    <tr>
        <td>show</td>
        <td>---</td>
        <td>Shows the module if it is hidden.</td>
    </tr>
</table> 

## Advanced Connector integration

Each command supported by the Table module can be used in the <a href="/doc/en/page/Advanced-Connector" target="_blank" rel="noopener noreferrer">Advanced Connector</a> module's scripts. The following example shows how to show or hide a module according to the <a href="/doc/en/page/Double-State-Button" target="_blank" rel="noopener noreferrer">Double State Button</a> module's state.

    EVENTSTART
    Source:DoubleStateButton1
    Value:1
    SCRIPTSTART

    var module = presenter.playerController.getModule('Hierarchical_Table_Of_Contents1');
    module.show();

    SCRIPTEND
    EVENTEND


    EVENTSTART
    Source:DoubleStateButton1
    Value:0
    SCRIPTSTART

    var module = presenter.playerController.getModule('Hierarchical_Table_Of_Contents1');
    module.hide();

    SCRIPTEND
    EVENTEND

## Events

The Hierarchical Table Of Contents module does not send any events.

## CSS classes

<table border="1">
    <tr>
        <th style="width: 235px;">Class name</th>
        <th style="width: 908px;">Description</th>
    </tr>
    <tr>
        <td style="width: 235px;">.hier_report</td>
        <td style="width: 908px;">Indicates the main look of the table of contents.</td>
    </tr>
    <tr>
        <td style="width: 235px;">.hier_report td</td>
        <td style="width: 908px;">Indicates the distance between the data cells.</td>
    </tr>
    <tr>
        <td style="width: 235px;">.hier_report-header</td>
        <td style="width: 908px;">Indicates the look of the header.</td>
    </tr>
    <tr>
        <td style="width: 235px;">.hier_report-odd</td>
        <td style="width: 908px;">Indicates the look of the oddly numbered lines.</td>
    </tr>
    <tr>
        <td style="width: 235px;">.hier_report-even</td>
        <td style="width: 908px;">Indicates the look of the evenly numbered lines.</td>
    </tr>
	<tr>
        <td style="width: 235px;">.hier_report-chapter</td>
        <td style="width: 908px;">Indicates the look of the lines containing chapters.</td>
    </tr>
    <tr>
        <td style="width: 235px;">.current-page</td>
        <td style="width: 908px;">Indicates the look of the page being displayed.</td>
    </tr>
</table>

## Demo presentation
Demo presentation is available [here](/embed/5934857403760640).       