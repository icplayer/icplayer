## Description
The Hierarchical Lesson Report module enables to insert a ready-made lesson report, including percentage results for each individual presentation page, a total percentage result, and a number of checks, mistakes and errors. 
The module supports hierarchical lesson structure and displays summary values for all chapters. 
It is possible to modify the appearance of each part of the report individually.

##Properties

The list starts with the common properties, learn more about them by visiting the <a href="https://mauthor.com/doc/page/Modules-description">Modules description</a> section. The other available properties are described below.

<table border='1'>
<tbody>
    <tr>
        <th>Property name</th>
        <th>Description</th> 
    </tr>
	<tr>
        <td>Title Label</td>
        <td>Label for a column with page names, displayed in the report's header.</td> 
    </tr>
	<tr>
        <td>Show Results</td>
        <td>Checking this property enables to display a column with progress bar and percentage result.</td> 
    </tr>
	<tr>
        <td>Results Label</td>
        <td>Label for a column showing the result, displayed in the report's header.</td> 
    </tr>
	<tr>
        <td>Show Checks</td>
        <td>Checking this property enables to display a column with the number of checks.</td> 
    </tr>
	<tr>
        <td>Checks Label</td>
        <td>Label for the Checks column, displayed in the report's header.</td> 
    </tr>
	<tr>
        <td>Show Mistakes</td>
        <td>Checking this property enables to display a column with the number of mistakes.</td> 
    </tr>
	<tr>
        <td>Mistakes Label</td>
        <td>Label for the Mistakes column, displayed in the report's header.</td> 
    </tr>
	<tr>
        <td>Show Errors</td>
        <td>Checking this property enables to display a column showing the number of errors.</td> 
    </tr>
	<tr>
        <td>Errors Label</td>
        <td>A label for the Errors column, displayed in the report's header.</td> 
    </tr>
		<tr>
        <td>Show Total</td>
        <td>Checking this property enables to display a row with a total presentation result.</td> 
    </tr>
	<tr>
        <td>Total Label</td>
        <td>Label for the Total row, displayed in the first column.</td> 
    </tr>
	<tr>
		<td>Max score award label</td>
		<td>Label for the Max score column, displayed in the report's header</td>
	</tr>
		<tr>
		<td>Page scores label</td>
		<td>Label for the Page scores column, displayed in the report's header</td>
	</tr>
	<tr>
        <td>Depth of expand</td>
        <td>Defines the depth of expanding the initial nodes. If the value is not set, all nodes will be collapsed.</td> 
    </tr>
	<tr>
		<td>Row classes</td>
		<td>Each line of this property is a class that will be assigned to a corresponding row in the report. If the number of class rows is smaller than the number of report rows - the classes will be assigned repeatedly.</td>
	</tr>
	<tr>
		<td>Show page scores</td>
		<td>Checking this property enables to display a column showing the page score (in &lt;score&gt; / &lt;max score&gt; format).</td>
	</tr>
	<tr>
		<td>Show max score award</td>
		<td>Checking this property enables to display a column showing the maximum page score.</td>
	</tr>
	<tr>
		<td>Disable score on pages</td>
		<td>Semicolon separated list of page indexes for which user progress (e.g. results) won't be displayed. In addition, ignored pages will not be taken into account while calculating the total score of the lesson. NOTE: When providing page indexes lesson chapters visible in the pages section are also counted towards the index.</td>
	</tr>
	<tr>
		<td>Enable pages</td>
		<td>Semicolon separated list of page indexes which will be displayed and taken into account while calculating the score. If empty, all pages will be displayed.</td>
	</tr>
	<tr>
		<td>Unvisited page scores label</td>
		<td>If a page hadn't been visited, the score is shown as 0/0. To avoid this situation it is possible to change the value 0/0 to some text. This text can be defined in this property.</td>
	</tr>
	<tr>
		<td>Alternative page titles</td>
		<td>The list of specified alternative page names. If the "is chapter" option is checked, the item will apply to the chapter specified by an index. The index is the number of a page or a chapter. 
		Page name input is used to replace the tile.
		</td>
	</tr>
    <tr>
        <td>Lang attribute</td>
        <td>Allows you to set the langauge used to read the contents of the card via the TTS module.</td>
    </tr>
    <tr>
        <td>Speech texts</td>
        <td>Sets the values of speech texts - predefined phrases providing additional context while using the module in the TTS mode. Speech texts are always read using the content's default language.</td>
    </tr>  
	<tr>
		<td>Use weighted arithmetic mean</td>
		<td>Checking this property enables to use weighted arithmetic mean to calculate value in result column (progress bar and percentage result). <br>
        Learn more about weights by visiting the <a href="https://mauthor.com/doc/page/Activity-scoring">Activity scoring</a> section.
        </td>
	</tr>
    <tr>
		<td>Include unvisited pages in the total</td>
		<td>When checked total score is calculating from all pages.</td>
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
        <th>---</th>
        <th>---</th>
        <th>---</th>
    </tr>
</table>

Hierarchical Lesson Report module doesn't support any commands.

## Advanced Connector integration

Due to no supported commands, there is no integration of the Hierarchical Lesson Report module with Advanced Connector.

## Events

Hierarchical Lesson Report module does not send any events.

## CSS classes

<table border="1">
  <tbody>
    <tr>
      <th style="width: 235px;">Class
name</th>
      <th style="width: 908px;">Description</th>
    </tr>
    <tr>
      <td style="width: 235px;">.hier_report</td>
      <td style="width: 908px;">indicates  the main look of the report</td>
    </tr>
    <tr>
      <td style="width: 235px;">.hier_report td</td>
      <td style="width: 908px;">indicates
the distance between the data cells in the report's table</td>
    </tr>
    <tr>
      <td style="width: 235px;">.hier_report-header</td>
      <td style="width: 908px;">indicates the look of the report's header</td>
    </tr>
    <tr>
      <td style="width: 235px;">.hier_report-odd</td>
      <td style="width: 908px;">indicates
the look of the oddly numbered lines</td>
    </tr>
    <tr>
      <td style="width: 235px;">.hier_report-even</td>
      <td style="width: 908px;">indicates
the look of the evenly numbered lines</td>
    </tr>
    <tr>
      <td style="width: 235px;">.hier_report-footer</td>
      <td style="width: 908px;">indicates
the look of the report's footer</td>
    </tr>
	<tr>
      <td style="width: 235px;">.hier_report-chapter</td>
      <td style="width: 908px;">indicates
the look of the lines containing chapters</td>
    </tr>
    <tr>
      <td style="width: 235px;">.hier_report-progress</td>
      <td style="width: 908px;">indicates
the look of the progress column including the text value of the percentage result</td>
    </tr>
    <tr>
      <td style="width: 235px;">.ui-progressbar</td>
      <td style="width: 908px;">indicates
the parameter defining the look of internal bars, which increase
proportionally to the user's progress
      </td>
    </tr>
    <tr>
      <td style="width: 235px;">.hier_report-checks</td>
      <td style="width: 908px;">indicates
the look of the checks column</td>
    </tr>
	<tr>
      <td style="width: 235px;">.hier_report-mistakes</td>
      <td style="width: 908px;">indicates
the look of the mistakes column</td>
    </tr>
	<tr>
      <td style="width: 235px;">.hier_report-errors</td>
      <td style="width: 908px;">indicates
the look of the errors column</td>
    </tr>
  </tbody>
</table>



### Examples

**1.1. Report**  
.hier_report {     
    padding: 15px;    
    border-radius: 5px;     
    border:1px solid gray;    
    background-color: white;    
    color: gray;    
    overflow: auto;    
}

**1.2. Report td**  
.hier_report td{    
    padding: 10px;    
}    

**1.3. Report header**  
.hier_report-header{    
    font-weight: bold;    
    color:black !important;    
    background-color: #bde0ff;    
}    

**1.4. Report footer**  
.hier_report-footer{    
    font-weight: bold;    
    color:black !important;    
    background-color: #bde0ff;    
}    

**1.5. Report chapter**      
.hier_report-chapter{    
    background-color: Lavender;    
}    

**1.6. Report odd**     
.hier_report-odd{    
    background-color: AliceBlue;    
}    

**1.7. Report even**     
.hier_report-even{    
    background-color: #f0f1ff;    
}    

**1.8. Report progress column**     
.hier_report-progress {    
    text-align: center;    
    color: #0A8DBD;        
    display: inline-block;    
    width:	190px;    
}    

**1.9. Report checks column**     
.hier_report-checks {    
    width: 10%;    
    color: green;    
    text-align: center;    
}

**1.10. Report mistakes column**     
.hier_report-mistakes {    
    width: 10%;    
    color: #990000;     
    text-align: center;    
}

**1.11. Report errors column**     
.hier_report-errors {    
    width: 10%;    
    color: red;    
    text-align: center;    
}    

**1.12. Report progress bar**     
.ui-progressbar {    
    padding: 2px;    
    width:	130px  !important;    
    height: 15px    !important;    
    border-radius: 5px;    
    border:2px solid #02789F;    
    background-color: #3CC6CD;    
    border-radius: 5px;    
    float: left;    
} 

## Demo presentation
Demo presentation is available [here](https://mauthor.com/embed/5665978565263360).                               