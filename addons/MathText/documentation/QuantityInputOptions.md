## Description

<table border='1'>
    <thead>
        <tr>
            <th style="width:10%">Field</th>
            <th>Description</th>
            <th style="width:10%">WIRIS documentation</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Constants</td>
            <td>The list of words that should be considered as known constants instead of variables. 
                The available predefined constants are: <math><mo>e</mo></math> (the Euler constant), 
                <math><mo>i</mo></math> (the imaginary unit), <math><mo>j</mo></math> (the imaginary unit), 
                <math><mo>π</mo></math> (the number Pi). By default all these constants but the 
                Euler constant <math><mo>e</mo></math> are considered as such.
            </td>
            <td></td>
        </tr>
        <tr>
            <td>Units</td>
            <td>The list of words that will be considered as units of measurement.</td>
            <td></td>
        </tr>
        <tr>
            <td>Unit prefixes</td>
            <td>The list of allowed multiplier prefixes for units.</td>
            <td></td>
        </tr>
        <tr>
            <td>Mixed fractions</td>
            <td>Whether to accept the mixed fraction notation. Possible values are true or false. 
                The default value is false. If set to true the implicit operator between an integer and a fraction 
                will be understood to be a sum. If set to false this implicit operator between number and fraction 
                will be, as usual, a product.</td>
            <td></td>
        </tr>
        <tr>
            <td>List</td>
            <td>The curly brackets <math><mo>{</mo></math><math><mo>}</mo></math> are interpreted as list enclosures. 
                Otherwise they are interpreted as parentheses.
            </td>
            <td></td>
        </tr>
        <tr>
            <td>Separators</td>
            <td>You can decide which symbols act as separators by choosing the meaning of point, comma, and space 
                symbols. Additionally, you can use apostrophes <math><mo>'</mo></math> for decimal marks. You only 
                have to check that <math><mo>º</mo><mo>'</mo><mo>"</mo></math> are unselected as units of measure.
            </td>
            <td></td>
        </tr>
    </tbody>
</table>

## Related topics

<ol>
    <li><a href="../page/WIRIS-Allowed-input" title="Allowed input">Allowed input</a></li>
    <li><a href="../page/WIRIS-Comparison-with-student-answer" title="Comparison with student answer">Comparison with student answer</a></li>
    <li><a href="../page/WIRIS-Additional-properties" title="Additional Properties">Additional Properties</a></li>
</ol>
