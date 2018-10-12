## Description
The Page Score Counter module displays the score and max score values on a current presentation page. 

##Properties

<table border='1'>
<tbody>
    <tr>
        <th>Property name</th>
        <th>Description</th> 
    </tr>
    <tr>
        <td>Display mode</td>
        <td>
<ul>
<li><b>Fraction (Score/Max Score)</b> &ndash; Displays score and max score</li>
<li><b>Score</b> &ndash; Displays score</li>
<li><b>Max Score</b> &ndash; Displays max score</li>
</ul>
</td> 
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
        <td>show</td>
        <td>---</td>
        <td>Shows the module.</td> 
    </tr>
    <tr>
        <td>hide</td>
        <td>---</td>
        <td>Hides the module.</td> 
    </tr>
    <tr>
        <td>getPageScore</td>
        <td>---</td>
        <td>Returns page score.</td> 
    </tr>
    <tr>
        <td>getPageMaxScore</td>
        <td>---</td>
        <td>Returns page max score.</td> 
    </tr>
</table>

## CSS classes

<table border='1'>
<tbody>
    <tr>
        <th>Class name</th>
        <th>Description</th> 
    </tr>
    <tr>
        <td>.page-score-counter-wrapper</td>
        <td>DIV wrapping the Addon's elements.</td> 
    </tr>
</tbody>
</table>
    

### Examples

    .page-score-counter-wrapper > div.hidden {
        display: none;
    }

    .page-score-counter-wrapper > div {
        text-align: center;
    }

    .page-score-counter-wrapper .fraction > div {
        text-align: left;
        display: inline-block;
    }   

## Demo presentation
[Demo presentation](/embed/6374396332081152"Demo presentation") contains examples of how to use this module.                   