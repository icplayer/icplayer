## Description

The Print Report module enables printing a ready-made lesson report, including percentage results for each individual presentation page, a total percentage result, a number of checks, mistakes and errors, and time.
It is possible to modify the appearance of each part of the report individually.

## Properties 

<table border='1'>
<tbody>
    <tr>
        <th>Property name</th>
        <th>Description</th> 
    </tr>

    <tr>
        <td>Text</td>
        <td>Text displayed on the button.</td>
    </tr>

    <tr>
        <td>Print report label</td>
        <td>Label for the Print button, displayed above the report.</td>
    </tr>
    <tr>
        <td>Close report label</td>
        <td>Label for the Close button, displayed above the report.</td>
    </tr>

    <tr>
        <td>Show title</td>
        <td>Checking this property enables displaying the report's title.</td>
    </tr>
    <tr>
        <td>Show title</td>
        <td>Text displayed as the report's title.</td>
    </tr>

    <tr>
        <td>Show subtitle</td>
        <td>Checking this property enables displaying the report's subtitle.</td>
    </tr>
    <tr>
        <td>Subitle</td>
        <td>Text displayed as the report's subtitle.</td>
    </tr>

    <tr>
        <td>Show user first and last name</td>
        <td>Checking this property enables displaying user's first and last name. When this property is checked, the user's form will be displayed.</td>
    </tr>

    <tr>
        <td>Show percentage score</td>
        <td>Checking this property enables displaying a column with the percentage score.</td>
    </tr>
    <tr>
        <td>Percentage score label</td>
        <td>Label for the Percentage score column, displayed in the report's header.</td>
    </tr>

    <tr>
        <td>Show checks count</td>
        <td>Checking this property enables displaying a column with the number of checks.</td>
    </tr>
    <tr>
        <td>Checks count label</td>
        <td>Label for the Checks count column, displayed in the report's header.</td>
    </tr>

    <tr>
        <td>Show mistakes count</td>
        <td>Checking this property enables displaying  a column with the number of mistakes.</td>
    </tr>
    <tr>
        <td>Mistakes count label</td>
        <td>Label for the Mistakes count column, displayed in the report's header.</td>
    </tr>

    <tr>
        <td>Show errors count</td>
        <td>Checking this property enables displaying a column showing the number of errors.</td>
    </tr>
    <tr>
        <td>Errors count label</td>
        <td>A label for the Errors count column, displayed in the report's header.</td>
    </tr>

    <tr>
        <td>Show page score</td>
        <td>Checking this property enables displaying a column with the page score.</td>
    </tr>
    <tr>
        <td>Page score label</td>
        <td>Label for the Page score column, displayed in the report's header.</td>
    </tr>

    <tr>
        <td>Show time per page</td>
        <td>Checking this property enables displaying a column with the page time.</td>
    </tr>
    <tr>
        <td>Time per page label</td>
        <td>Label for the Time per page column, displayed in the report's header.</td>
    </tr>

    <tr>
        <td>Show total results</td>
        <td>Checking this property enables displaying a row with a total presentation result.</td>
    </tr>
    <tr>
        <td>Total results label</td>
        <td>Label for the Total results row, displayed in the first column.</td>
    </tr>

    <tr>
        <td>Time per page: days label</td>
        <td>A letter to be used as days label in time per page value. Default: "d".</td>
    </tr>
    <tr>
        <td>Time per page: hours label</td>
        <td>A letter to be used as hours label in time per page value. Default: "h".</td>
    </tr>
    <tr>
        <td>Time per page: minutes label</td>
        <td>A letter to be used as minutes label in time per page value. Default: "m".</td>
    </tr>
    <tr>
        <td>Time per page: seconds label</td>
        <td>A letter to be used as seconds label in time per page value. Default: "s".</td>
    </tr>

    <tr>
        <td>User form: first name label</td>
        <td>Label for the First name input field, displayed in the user's form. Default: "First name".</td>
    </tr>
    <tr>
        <td>User form: last name label</td>
        <td>Label for the Last name input field, displayed in the user's form. Default: "Last name".</td>
    </tr>
    <tr>
        <td>User form: confirm button label</td>
        <td>Text displayed on the Confrim button in the user's form. Default: "Print".</td>
    </tr>
    <tr>
        <td>User form: cancel button label</td>
        <td>Text displayed on the Cancel button in the user's form. Default: "Cancel".</td>
    </tr>

    <tr>
        <td>Styles</td>
        <td>Styles definitions which are to be applied to report.</td>
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

## Advanced Connector integration
Each command supported by the Print Report addon can be used in the Advanced Connector addon's scripts. The below example shows how it interacts with Double State Button modules.

    EVENTSTART
    Source:TrueFalse1
    Item:1-1
    SCRIPTSTART
       var module = presenter.playerController.getModule('Print_Report1');
       module.show();
    SCRIPTEND
    EVENTEND
    EVENTSTART
    Source:TrueFalse1
    Item:1-2
    SCRIPTSTART
       var module = presenter.playerController.getModule('Print_Report1');
       module.hide();
    SCRIPTEND
    EVENTEND


## Events

The Print Report module does not send any events. 

## CSS classes

<table border="1">
  <tbody>
    <tr>
      <th style="width: 235px;">Class
name</th>
      <th style="width: 908px;">Description</th>
    </tr>
    <tr>
      <td style="width: 235px;">.print-report-addon-wrapper</td>
      <td style="width: 908px;">DIV surrounding the Text.</td>
    </tr>

    <tr>
      <td style="width: 235px;">.print-report-popup</td>
      <td style="width: 908px;">DIV surrounding the User's form.</td>
    </tr>
    <tr>
      <td style="width: 235px;">.print-report-form</td>
      <td style="width: 908px;">User's FORM.</td>
    </tr>

    <tr>
      <td style="width: 235px;">.print-report-form-firstname-wrapper</td>
      <td style="width: 908px;">DIV surrounding the User's form first name field.</td>
    </tr>
    <tr>
      <td style="width: 235px;">.print-report-form-firstname-label</td>
      <td style="width: 908px;">User's form first name field LABEL.</td>
    </tr>
    <tr>
      <td style="width: 235px;">.print-report-form-firstname</td>
      <td style="width: 908px;">User's form first name field INPUT.</td>
    </tr>

    <tr>
      <td style="width: 235px;">.print-report-form-lastname-wrapper</td>
      <td style="width: 908px;">DIV surrounding the User's form last name field.</td>
    </tr>
    <tr>
      <td style="width: 235px;">.print-report-form-lastname-label</td>
      <td style="width: 908px;">User's form last name field LABEL.</td>
    </tr>
    <tr>
      <td style="width: 235px;">.print-report-form-lastname</td>
      <td style="width: 908px;">User's form last name field INPUT.</td>
    </tr>

    <tr>
      <td style="width: 235px;">.print-report-form-actions</td>
      <td style="width: 908px;">DIV surrounding the User's form action buttons.</td>
    </tr>
    <tr>
      <td style="width: 235px;">.print-report-form-cancel-btn</td>
      <td style="width: 908px;">User's form cancel BUTTON.</td>
    </tr>
    <tr>
      <td style="width: 235px;">.print-report-form-confirm-btn</td>
      <td style="width: 908px;">User's form confirm BUTTON.</td>
    </tr>
  </tbody>
</table> 


## Report CSS classes

<table border="1">
  <tbody>
    <tr>
      <th style="width: 235px;">Class name</th>
      <th style="width: 908px;">Description</th>
    </tr>
    <tr>
      <td style="width: 235px;">.wrapper</td>
      <td style="width: 908px;">SECTION surrounding the report.</td>
    </tr>
    <tr>
      <td style="width: 235px;">.actions</td>
      <td style="width: 908px;">DIV surrounding the report's print and close buttons.</td>
    </tr>
    <tr>
      <td style="width: 235px;">.print</td>
      <td style="width: 908px;">Report's print BUTTON.</td>
    </tr>
    <tr>
      <td style="width: 235px;">.close</td>
      <td style="width: 908px;">Report's close BUTTON.</td>
    </tr>
    <tr>
      <td style="width: 235px;">.header</td>
      <td style="width: 908px;">DIV surrounding the report's header.</td>
    </tr>
    <tr>
      <td style="width: 235px;">.title</td>
      <td style="width: 908px;">DIV surrounding the report's title H1 element.</td>
    </tr>
    <tr>
      <td style="width: 235px;">.subtitle</td>
      <td style="width: 908px;">DIV surrounding the report's subtitle H2 element.</td>
    </tr>
    <tr>
      <td style="width: 235px;">.user</td>
      <td style="width: 908px;">DIV surrounding the User's first and last name.</td>
    </tr>
    <tr>
      <td style="width: 235px;">.firstname</td>
      <td style="width: 908px;">SPAN surrounding the User's first name.</td>
    </tr>
    <tr>
      <td style="width: 235px;">.lastname</td>
      <td style="width: 908px;">SPAN surrounding the User's last name.</td>
    </tr>
    <tr>
      <td style="width: 235px;">.report</td>
      <td style="width: 908px;">DIV surrounding the report's table.</td>
    </tr>
    <tr>
      <td style="width: 235px;">.percentage-score-label</td>
      <td style="width: 908px;">Report's table header TH surrounding the percentage score label.</td>
    </tr>
    <tr>
      <td style="width: 235px;">.checks-label</td>
      <td style="width: 908px;">Report's table header TH surrounding the checks count label.</td>
    </tr>
    <tr>
      <td style="width: 235px;">.mistakes-label</td>
      <td style="width: 908px;">Report's table header TH surrounding the mistakes count label.</td>
    </tr>
    <tr>
      <td style="width: 235px;">.errors-label</td>
      <td style="width: 908px;">Report's table header TH surrounding the errors count label.</td>
    </tr>
    <tr>
      <td style="width: 235px;">.page-score-label</td>
      <td style="width: 908px;">Report's table header TH surrounding the page score label.</td>
    </tr>
    <tr>
      <td style="width: 235px;">.time-per-page-label</td>
      <td style="width: 908px;">Report's table header TH surrounding the time per page label.</td>
    </tr>
    <tr>
      <td style="width: 235px;">.name</td>
      <td style="width: 908px;">Report's table body TD surrounding the page name.</td>
    </tr>
    <tr>
      <td style="width: 235px;">.percentage-score</td>
      <td style="width: 908px;">Report's table body TD surrounding the percentage score.</td>
    </tr>
    <tr>
      <td style="width: 235px;">.checks</td>
      <td style="width: 908px;">Report's table body TD surrounding the checks count.</td>
    </tr>
    <tr>
      <td style="width: 235px;">.mistakes</td>
      <td style="width: 908px;">Report's table body TD surrounding the mistakes count.</td>
    </tr>
    <tr>
      <td style="width: 235px;">.errors</td>
      <td style="width: 908px;">Report's table body TD surrounding the errors count.</td>
    </tr>
    <tr>
      <td style="width: 235px;">.page-score</td>
      <td style="width: 908px;">Report's table body TD surrounding the page score.</td>
    </tr>
    <tr>
      <td style="width: 235px;">.time-per-page</td>
      <td style="width: 908px;">Report's table body TD surrounding the time per page.</td>
    </tr>
    <tr>
      <td style="width: 235px;">.total</td>
      <td style="width: 908px;">Report's table body TR surrounding the total score row.</td>
    </tr>
  </tbody>
</table>  


## Demo presentation
Demo presentation is available [here](/embed/6362787821912064).  