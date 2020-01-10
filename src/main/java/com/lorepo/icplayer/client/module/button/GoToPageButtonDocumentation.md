## Description
The Go To Page Button redirects user to a given page title or page index.

This button also allows redirecting to a page in Commons. However, in this case there are some rules that need to be followed:

* Use only the Page Title property.
* A page name in the Page Title property must start with: CM_, e.g: CM_Page1.
* Names of pages must be unique in the Commons Pages list.
* Such pages should be treated as popups to display text, not content with activity modules.


## Properties

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
        <td>A page title that a user wants to redirect to.</td>
    </tr>
    <tr>
        <td>Page Index</td>
        <td>A page index that a user wants to redirect to.</td>
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
        <td>hide</td>
        <td>---</td>
        <td>Hides the module.</td>
    </tr>
    <tr>
        <td>show</td>
        <td>---</td>
        <td>Shows the module.</td>
    </tr>
</tbody>
</table>

## CSS classes

<table border="1">
  <tbody>
    <tr>
      <th style="width: 300px;">Class
name</th>
      <th style="width: 843px;">Description</th>
    </tr>
    <tr>
      <td style="width: 300px;">.ic_button_gotopage</td>
      <td style="width: 843px;">indicates the look of the Go to page button. To determine the page to which the
Go to page button should lead, it is necessary to enter its name in the Page section in the Properties side menu</td>
    </tr>
    <tr>
      <td style="width: 300px;">.ic_button_gotopage-up-hovering</td>
      <td style="width: 843px;">indicates the look of the Go to page button on mouse hover</td>
    </tr>
    <tr>
      <td style="width: 300px;">.ic_button_gotopage-down-hovering</td>
      <td style="width: 843px;">indicates the look of the Go to page button on mouse click</td>
    </tr>
  </tbody>
</table>

### Examples

**1.1. Go to page:**  
.ic_button_gotopage{  
background-image: url('/file/serve/117040');  
background-repeat: no-repeat;  
background-position: center;  
} 

**1.2. Go to page — up-hovering:**  
.ic_button_gotopage-up-hovering{  
background-image: url('/file/serve/117041');  
}

**1.3. Go to page — down-hovering:**  
.ic_button_gotopage-down-hovering{  
background-image: url('/file/serve/123001');  
}       