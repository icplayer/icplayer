## Comparison for student answer for General and Quantity input

<table border='1'>
    <thead>
        <tr>
            <th style="width:15%">Field</th>
            <th>Description</th>
            <th style="width:10%">WIRIS documentation</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Tolerance</td>
            <td>The Tolerance number is used to compare the student answer and the Correct answer.
                <br><br>
                The tolerance options only apply to decimal numbers! For instance, if the question's answer is 10, we may set 10.0 as the correct answer so that the validation system takes into account the defined tolerance.
            </td>
            <td></td>
        </tr>
        <tr>
            <td>Literally equal</td>
            <td>This removes all mathematical interpretations from the comparison. 
                The student's answer is only correct if it matches the correct answer exactly. 
                For example, if the correct answer is 4, but the student writes 4.0, it will <em>not</em> be counted. 
                This criterion is rarely recommended.
            </td>
            <td></td>
        </tr>
        <tr>
            <td>Mathematically equal</td>
            <td>This is the default comparison. It will detect if what the student has written is mathematically equal 
                to the correct answer. For example, we don't need to worry if the student writes 
                <math><mi>a</mi><mo>+</mo><mi>b</mi></math> or <math><mi>b</mi><mo>+</mo><mi>a</mi></math>.
            </td>
            <td><a href="https://docs.wiris.com/quizzes/en/validation-options/mathematically-equal.html" title="Mathematically equal">More details</a></td>
        </tr>
        <tr>
            <td>Equivalent equations</td>
            <td>This comparison is very similar to the mathematically equal option. Still, it is for the particular 
                case where the answer is an equation (e.g. the student could write 
                <math><mi>y</mi><mo>=</mo><mn>2</mn><mi>x</mi><mo>-</mo><mn>5</mn></math>
                , or <math><mn>2.5</mn><mo>=</mo><mi>x</mi><mo>-</mo><mfrac><mrow><mi>y</mi></mrow><mrow><mn>2</mn></mrow></mfrac></math>
                , or any equivalent form).
            </td>
            <td><a href="https://docs.wiris.com/quizzes/en/validation-options/equivalent-equations.html" title="Equivalent equations">More details</a></td>
        </tr>
        <tr>
            <td>Any answer</td>
            <td>Anything that the student answers will be counted as correct. This is useful in some cases.</td>
            <td><a href="https://docs.wiris.com/quizzes/en/validation-options/any-answer.html" title="Any answer">More details</a></td>
        </tr>
    </tbody>
    <tfoot>
        <tr>
            <td>Compare as sets</td>
            <td>Order and repetition don't matter in lists: When checked, order and repetition are ignored from lists. 
                So, if the correct answer is the set {2,-2} (for example of task to find roots of <math><mi>y</mi><mo>=</mo><msup><mi>x</mi><mn>2</mn></msup><mo>-</mo><mn>4</mn></math>), then {2,-2,2,2} (for example) would be accepted.
            </td>
            <td></td>
        </tr>
    </tfoot>
</table>

## Comparison for student answer for Text input

<table border='1'>
    <thead>
        <tr>
            <th style="width:15%">Property</th>
            <th>Description</th>
            <th style="width:10%">Correct examples</th>
            <th style="width:10%">Wrong examples</th>
            <th style="width:10%">WIRIS documentation</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Literally equal</td>
            <td>Checks whether the response is literally equal to correct answer</td>
            <td><math><mn>2</mn><mo>+</mo><mn>2</mn></math> when correct answer is <math><mn>2</mn><mo>+</mo><mn>2</mn></math></td>
            <td><math><mn>2</mn><mo>+</mo><mn>2.0</mn></math> when correct answer is <math><mn>2</mn><mo>+</mo><mn>2</mn></math></td>
            <td></td>
        </tr>
        <tr>
            <td>Any answer</td>
            <td>Dummy assertion that always returns true, even if the answer is not sintactically valid.</td>
            <td><math><mn>2</mn><mo>+</mo><mn>2</mn></math> when correct answer is <math><mn>5</mn></math></td>
            <td></td>
            <td><a href="https://www.wiris.net/demo/quizzes/assertions.xml#Any%20answer" title="Any answer">More details</a></td>
        </tr>
        <tr>
            <td>Match case</td>
            <td>For textual inpunts, whether to take into account character case or not. If false, the comparison will be case insensitive.</td>
            <td><em>"answer"</em> when correct answer is <em>"answer"</em></td>
            <td><em>"answer"</em> when correct answer is <em>"Answer"</em></td>
            <td><a href="https://www.wiris.net/demo/quizzes/assertions.xml#Literally%20equal" title="Literally equal">More details</a></td>
        </tr>
        <tr>
            <td>Match spaces (Deprecated)</td>
            <td><s>For textual inpunts, whether to take blank spaces into account. If true, the spaces in the answer must exactly match the spaces in the correct answer. If false, leading and trailing spaces are ignored, as well as multiple spaces.</s></td>
            <td></td>
            <td></td>
            <td></td>
        </tr>
    </tbody>
</table>

## Related topics

<ol>
    <li><a href="../page/WIRIS-Allowed-input" title="Allowed input">Allowed input</a></li>
    <li><a href="../page/WIRIS-General-input-options" title="General input options">General input options</a></li>
    <li><a href="../page/WIRIS-Quantity-input-options" title="Quantity input options">Quantity input options</a></li>
    <li><a href="../page/WIRIS-Additional-properties" title="Additional properties">Additional properties</a></li>
</ol>
