## Description
Cross Lesson addon is used to link to other lessons and courses.

## Properties

<table border='1'>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Text</td>
        <td>Text displayed by the addon</td>
    </tr>
    <tr>
        <td>Image</td>
        <td>Image displayed while not in selected state.
<p><em>This property allows online resources. <a href="/doc/page/Online-resources">Find out more »</a></em></p></td>
    </tr>
    <tr>
        <td>Defined lesson id</td>
        <td>The defined id of the target resource.</td>
    </tr>
    <tr>
        <td>Course id</td>
        <td>The id of the course containing the target resource. If this property is left empty, it will be assumed to the target lesson is a part of the currently selected course.</td>
    </tr>
    <tr>
        <td>Page</td>
        <td>Id of the target page. If this property is left empty, the addon will link to the first page of the target resource.</td>
    </tr>
    <tr>
        <td>Type</td>
        <td>Specifies wheter the target resource is a lesson or an ebook.</td>
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
        <td>requestCrossLesson</td>
        <td>---</td>
        <td>Opens a new tab or window with the resource specified in the addon</td>
    </tr>
    <tr>
        <td>show</td>
        <td>---</td>
        <td>Shows the addon</td>
    </tr>
    <tr>
        <td>hide</td>
        <td>---</td>
        <td>Hides the addon</td>
    </tr>
</table>


## Managing in custom LMS
In case of managing cross lesson addon in custom LMS, there is need to connect to player external event bus:

    player.onExternalEvent((eventName: string, data: string) => {
    });
    
Cross lesson addon calls that method with provided data:
* eventName: `"crossLesson"`
* data: JSON string which contains:
  * lessonID: Id from `Defined lesson id` property.
  * type: Type from `Type` property.
  * page: Optional value from `page` property.
  * courseID: Optional value from `Course ID` property.
  
Optional values may be not defined in JSON string. It depends on addon configuration.
