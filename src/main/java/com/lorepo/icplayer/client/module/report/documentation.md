## Description
The Lesson report module enables to insert a ready-made lesson report, including  percentage results for each individual page of a presentation, a total percentage result, and a number of checks and errors. It is possible to modify the appearance of each part of the report individually.


## Supported commands

<table border="1">
  <tbody>
    <tr>
      <th>Command
name</th>
      <th>Params</th>
      <th>Description</th>
    </tr>
    <tr>
      <td>...</td>
      <td>...</td>
      <td>...</td>
    </tr>
  </tbody>
</table>


## CSS classes

<table border="1">
  <tbody>
    <tr>
      <th style="width: 235px;">Class
name</th>
      <th style="width: 908px;">Description</th>
    </tr>
    <tr>
      <td style="width: 235px;">.ic_report</td>
      <td style="width: 908px;">indicates
the distance between the data cells in the report's table</td>
    </tr>
    <tr>
      <td style="width: 235px;">.ic_report
td</td>
      <td style="width: 908px;">indicates
the distance between the data cells in the report's table</td>
    </tr>
    <tr>
      <td style="width: 235px;">.ic_report-header</td>
      <td style="width: 908px;">indicates
the look of the report's header</td>
    </tr>
    <tr>
      <td style="width: 235px;">.ic_report-odd</td>
      <td style="width: 908px;">indicates
the look of the oddly numbered lines</td>
    </tr>
    <tr>
      <td style="width: 235px;">.ic_report-even</td>
      <td style="width: 908px;">indicates
the look of the evenly numbered lines</td>
    </tr>
    <tr>
      <td style="width: 235px;">.ic_report-footer</td>
      <td style="width: 908px;">indicates
the look of the report's footer</td>
    </tr>
    <tr>
      <td style="width: 235px;">.ic_report
.ic_progress</td>
      <td style="width: 908px;">indicates
the look of the progress bar modules located inside the report's
table, excluding the parameter defining the look of the internal bar,
which increases proportionally to the user's progress</td>
    </tr>
    <tr>
      <td style="width: 235px;">.ic_report
.ic_progress-bar</td>
      <td style="width: 908px;">indicates
the parameter defining the look of internal bars, which increase
proportionally to the user's progress
      </td>
    </tr>
    <tr>
      <td style="width: 235px;">.ic_report
.ic_progress-text </td>
      <td style="width: 908px;">indicates
the look of the texts inside the progress bars</td>
    </tr>
  </tbody>
</table>


    

### Examples

**1.1. Report**  
.ic_report{  
padding: 15px;  
border-radius: 5px;  
border: 2px solid gray;  
background-color:white;  
color:gray;  
}  
  
**1.2. Report td**  
.ic_report td{   
padding: 10px;      
}  
  
**1.3. Report header**  
.ic_report-header{  
font-weight: bold;  
color: black;  
}  
  
**1.4. Report odd**   
.ic_report-odd{  
background-color: #f5f6f6;  
}  
  
**1.5. Report even**  
.ic_report-even{  
background-color: #edefef;  
}  
  
**1.6. Report progress**  
.ic_report .ic_progress{  
border-radius: 4px;  
border: 2px solid #128700;  
padding: 2px;  
}  
  
**1.7. Report progress-bar**    
.ic_report .ic_progress-bar{  
background-color: #54e600;  
border-radius: 4px;  
}  
  
**1.8. Report progress-text**  
.ic_report .ic_progress-text{  
line-height: 21px;  
font-family: Arial;  
font-size: 18px;  
}  
               