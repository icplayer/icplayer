## Description
This addon embeds iframe with Speechace courses in icPlayer. <br><br>
Configuration of this addon requires passing proper data in setContextMetadata method on icPlayer:
- JWTsessionTokenURL - url to fetch JWT token for authorization (it must consist of username/user_id - required in speechace course),
- speechaceCourseURL - url to get the url to set to the iframe with speechace course. Should return: <br>{course_url, speechaceToken, speechaceUrl}
- (optional) collectionId - only required for mCourser - mCourser collection id.

##Properties

<table>
<tbody>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Course Key</td>
        <td>This property is the course key in speechace system. It cannot remain empty.</td>
    </tr>
</tbody>
</table>

##Supported commands

<table>
<tbody>
    <tr>
        <th>Command name</th>
        <th>Params</th>
        <th>Description</th>
    </tr>    
    <tr>
        <td>show</td>
        <td>---</td>
        <td>Shows the addon.</td>
    </tr>
    <tr>
        <td>hide</td>
        <td>---</td>
        <td>Hides the addon.</td>
    </tr>
</tbody>
</table>

##Events

The Speechace addon sends ValueChanged type events to Event Bus whenever a score is being updated.

<table border='1'>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Source</td>
        <td>Id of the source addon.</td>
    </tr>
    <tr>
        <td>Item</td>
        <td>N/A</td>
    </tr>
    <tr>
        <td>Value</td>
        <td>
          N/A
        </td>
    </tr>
    <tr>
        <td>Score</td>
        <td>
           Current score in range 0-100.
        </td>
    </tr>
</table>

##CSS classes

<table border='1'>
<tbody>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <tr>
            <td>speechace-container</td>
            <td>Outer wrapper of the whole addon.</td>
        </tr>
        <tr>
            <td>speechace-iframe</td>
            <td>Iframe styles.</td>
        </tr>
        <tr>
            <td>speechace-message</td>
            <td>Styles for a message container. Message displayed to inform user of fetching the score.</td>
        </tr>
        <tr>
            <td>speechace-message-text</td>
            <td>Styles for a text inside message container.</td>
        </tr>
</tbody>
</table>

## Default styles

    .speechace-iframe {
        width: 100%;
        height: 100%;
        border: none;
        position: absolute;
    }
    
    .speechace-message {
        display: none;
        position: absolute;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
    }
    
    .speechace-message-text {
        color: white;
        font-size: 30px;
    }