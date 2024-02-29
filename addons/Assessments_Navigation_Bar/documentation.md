## Description
The Assessments Navigation Bar module allows users to add a navigation bar to a presentation. This addon navigates to sections specified in the "Sections" property. Every section has a defined number of pages which
are randomly assigned to a button. The random sequence is chosen only once when the presentation is started. Then the random sequence of pages is remembered and restored every time a page is selected. For the proper working of the addon, it should be placed in the header or footer.


## Properties

<table border='1'>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Sections</td>
        <td>
            Allows user to specify the sections to be shown by the module. Every section is new line separated and looks as follows:
            <p>"sectionStart-SectionEnd; SectionName; page1Name, page2Name, page3Name; pagesCSSClassName1, pagesCSSClassName2; staticPosition" </p>

            <p>for e.g "1-5;; 1, 1, 1, 1, 1; customCSSClassName1, customCSSClassName2" will create one section of
            5 pages with no section name; 
			every button of the section will have description 1; 
			every button of the section will have `customCSSClassName1` and `customCSSClassName2` CSS classes.
            </p>

            <p>staticPosition should be either "left" or "right". If provided, the section with this value will always be displayed on either left or right side of the addon, regardless of what pages are being displayed at the moment.</p>

            <br>Section start and section end may also be comma separated indexes.

            Only section start and end are required. Section name, page descriptions and pages CSS class names are optional.
            Remember to put only valid section start and section end to the section property. Providing numbers larger than the number of presentation pages may cause improper working of the addon.

            By default, the section descriptions are page numbers provided in section start and section end.
        </td>
    </tr>
    <tr>
        <td>Number of buttons</td>
        <td>Allows user to specify the number of buttons to be shown by Assessments Navigation Bar.
    </tr>
    <tr>
        <td>Width of buttons</td>
        <td>Allows user to set the width of buttons in Assessments Navigation Bar.
    </tr>
<tr>
    <td>Use dynamic pagination</td>
    <td>The property activates pagination extending by sliding to previous or next element for the first or last visible and selected page index.
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
        <td>bookmarkCurrentPage</td>
        <td>---</td>
        <td>Bookmarks a current page. Adds the "bookmark" class to a button.</td>
    </tr>

    <tr>
        <td>removeBookmark</td>
        <td>---</td>
        <td>Removes bookmark from a current page.</td>
    </tr>

    <tr>
        <td>moveToPage</td>
        <td>page index (1-based)</td>
        <td>Moves to the page specified by index. Buttons are calculated from the left. For moveToPage with index 2, it will move to the page specified by the second button..</td>
    </tr>
    <tr>
        <td>moveToPreviousPage</td>
        <td>---</td>
        <td>Moves to the previous page.</td>
    </tr>
    <tr>
        <td>moveToNextPage</td>
        <td>---</td>
        <td>Moves to the next page.</td>
    </tr>
</table>


## CSS classes

<table border='1'>
    <tr>
        <th>Class name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>.assessments-navigation-bar-wrapper</td>
        <td>Wrapper container for the module.</td>
    </tr>

    <tr>
        <td>.assessments-navigation-bar-wrapper .navigation-buttons-first</td>
        <td>Container for the navigation button 'previous' and the rewind button 'left'.</td>
    </tr>

    <tr>
        <td>.assessments-navigation-bar-wrapper .previous</td>
        <td>Class for the navigation button 'previous'.</td>
    </tr>

    <tr>
        <td>.assessments-navigation-bar-wrapper .turn_back</td>
        <td>Class for the rewind button 'back'. (hellip description)</td>
    </tr>

    <tr>
        <td>.assessments-navigation-bar-wrapper .sections</td>
        <td>Container for all visible sections</td>
    </tr>

    <tr>
        <td>.assessments-navigation-bar-wrapper .section</td>
        <td>Class for all section containers.</td>
    </tr>

    <tr>
        <td>.assessments-navigation-bar-wrapper .section_(index 0-based)</td>
        <td>Class for the section container. Index is 0-based, for example ".section_0" will be added to the first section from the Section property</td>
    </tr>

    <tr>
        <td>.assessments-navigation-bar-wrapper .section_name</td>
        <td>Class for the section_name container</td>
    </tr>

    <tr>
        <td>.assessments-navigation-bar-wrapper .buttons</td>
        <td>Class for the buttons container in a section.</td>
    </tr>

    <tr>
        <td>.assessments-navigation-bar-wrapper .button</td>
        <td>Class for the button with a page description in a section.</td>
    </tr>

    <tr>
        <td>.assessments-navigation-bar-wrapper .current_page</td>
        <td>Class for the button with a currently shown page.</td>
    </tr>

    <tr>
        <td>.assessments-navigation-bar-wrapper .bookmark</td>
        <td>Class for a bookmarked button</td>
    </tr>

    <tr>
        <td>.assessments-navigation-bar-wrapper .navigation-buttons-last</td>
        <td>Container for the navigation button 'next' and the rewind button 'forward'.</td>
    </tr>

    <tr>
        <td>.assessments-navigation-bar-wrapper .next</td>
        <td>Class for the navigation button 'next'.</td>
    </tr>

    <tr>
        <td>.assessments-navigation-bar-wrapper .turn_forward</td>
        <td>Class for the rewind button 'next' (hellip description).</td>
    </tr>

    <tr>
        <td>.assessments-navigation-bar-wrapper .element</td>
        <td>Class for clickable elements in the module - buttons in sections, navigation buttons</td>
    </tr>

    <tr>
        <td>.assessments-navigation-bar-wrapper .mouse-over</td>
        <td>Class for the button with mouse on hover.</td>
    </tr>

</table>

## Demo presentation
[Demo presentation](/embed/6222125724073984 "Demo presentation") showing how to use Assessments Navigation Bar Addon.         