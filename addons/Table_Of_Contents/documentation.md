## Description
The Table of Contents addon displays a presentation's table of contents with links to corresponding pages.

## Properties

<table border='1'>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Don't show pages</td>
        <td>This option allows user to define which page numbers are to be hidden. The numbers should be semicolon separated, i.e. for pages: 2,4 the property value is: 2;4</td>
    </tr>
    <tr>
          <td>Display Types</td>
           <td><ul>
<li><b>default</b> &ndash; table of contents will be displayed as paginated pages</li>
<li><b>list</b> &ndash; table of contents will be displayed as a scrollable list</li>
<li><b>combo</b> &ndash; table of contents will be displayed as a combo list</li>
<li><b>icons</b> &ndash; table of contents will be displayed as the icons list</li>
<li><b>icons+list</b> &ndash; table of contents will be displayed as the icons list with names of pages</li>
</ul>
</td>
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
        <td>---</td>
        <td>---</td>
        <td>---</td>
    </tr>
</table>


## CSS classes

<table border='1'>
    <tr>
        <th>Class name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>table-of-contents</td>
        <td>Main class containing all Addon content</td>
    </tr>
    <tr>
        <td>table-of-contents-title</td>
        <td>DIV element containing Addon title</td>
    </tr>
    <tr>
        <td>table-of-contents-list</td>
        <td>DIV element containg HTML list element (&lt;ul&gt;). If there are more pages than the Addon can contain, then this element is multiplied></td>
    </tr>
    <tr>
        <td>table-of-contents-pagination</td>
        <td>DIV element containing links (&lt;a&gt;) for inside navigation if there are more pages than Addon can contain. By default this element is hidden</td>
    </tr>
    <tr>
        <td>current-page</td>
        <td>an element containing this class defines the page being displayed</td>
    </tr>
</table>

## Demo presentation
[Demo presentation](/embed/2832012 "Demo presentation") showing how to use Table Of Contents Addon.             