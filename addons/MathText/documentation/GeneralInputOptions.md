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
            <td>The list of words that should be considered as known constants instead of variables. The predefined 
                    constants are: <math><mo>e</mo></math> (the Euler constant), 
                    <math><mo>i</mo></math> (the imaginary unit), <math><mo>j</mo></math> (the imaginary unit), 
                    <math><mo>π</mo></math> (the number Pi). By default all the previous characters are considered 
                    as such.
            </td>
            <td></td>
        </tr>
        <tr>
            <td>Functions</td>
            <td>The list of words that should be considered as functions (predefined functions). 
                The known functions will be interpreted with their usual meaning.
            </td>
            <td></td>
        </tr>
        <tr>
            <td>User functions</td>
            <td>The list of words that should be considered as functions (user defined functions). 
                The user defined functions will be treated as formal functions.
            </td>
            <td><a href="https://docs.wiris.com/quizzes/en/advanced-validation-features/user-functions.html" title="User functions">More details</a></td>
        </tr>
        <tr>
            <td>List</td>
            <td>The curly brackets <math><mo>{</mo></math><math><mo>}</mo></math> are interpreted as list enclosures. 
                Otherwise they are interpreted as parentheses.
            </td>
            <td></td>
        </tr>
        <tr>
            <td>Intervals</td>
            <td>Boolean argument. Whether to accept intervals of real numbers. If true, then the vectors and matrices 
                are disabled. Defaults to false.
            </td>
            <td><a href="https://docs.wiris.com/quizzes/en/advanced-validation-features/intervals.html" title="Intervals">More details</a></td>
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
