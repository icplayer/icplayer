## Description

<table border="1">
    <thead>
        <tr>
            <th colspan="3">Structure</th>      
        </tr>
        <tr>
            <th>Property</th>
            <th>Description</th>
            <th>WIRIS documentation</th>        
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Has integer form</td>
            <td>Checks whether the answer is a single integer, possibly with sign.</td>
            <td><a href="https://www.wiris.net/demo/quizzes/assertions.xml#Has%20integer%20form" title="Has integer form">More details</a></td>
        </tr>
        <tr>
            <td>Has fraction form</td>
            <td>Checks whether the answer is a single fraction or integer, possibly with sign.</td>
            <td><a href="https://www.wiris.net/demo/quizzes/assertions.xml#Has%20fraction%20form" title="Has fraction form">More details</a></td>
        </tr>
        <tr>
            <td>Has polynomial form</td>
            <td>Checks whether the answer is syntactically a polynomial with real or complex coefficients, i.e., it consists only of sums, products, natural powers, variables and constants.</td>
            <td><a href="https://www.wiris.net/demo/quizzes/assertions.xml#Has%20polynomial%20form" title="Has polynomial form">More details</a></td>
        </tr>
        <tr>
            <td>Has rational function form</td>
            <td>Checks whether the answer has the form of a rational function: sums, products, powers and quotients.</td>
            <td><a href="https://www.wiris.net/demo/quizzes/assertions.xml#Has%20rational%20function%20form" title="Has rational function form">More details</a></td>
        </tr>
        <tr>
            <td>Is a combination of elementary functions</td>
            <td>Checks whether the answer is a combination of elemental functions: there are not operators such as the integral operator, the derivative operator, infinite sums or products, etc.</td>
            <td><a href="https://www.wiris.net/demo/quizzes/assertions.xml#Is%20a%20combination%20of%20elementary%20functions" title="Is a combination of elementary functions">More details</a></td>
        </tr>
        <tr>
            <td>Is expressed in scientific notation</td>
            <td>Checks whether the answer is in scientific notation.</td>
            <td><a href="https://www.wiris.net/demo/quizzes/assertions.xml#Is%20expressed%20in%20scientific%20notation" title="Is expressed in scientific notation">More details</a></td>
        </tr>
    </tbody>
</table>

<table border='1'>
    <thead>
        <tr>
            <th colspan="5">More</th>      
        </tr>
        <tr>
            <th>Property</th>
            <th>Description</th>
            <th>Correct examples</th>
            <th>Wrong examples</th>
            <th>WIRIS documentation</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>is simplified</td>
            <td>It checks whether the expression cannot be simplified. Includes fractions, powers and roots, polynomials...</td>
            <td><math>
                    <msup>
                        <mrow>
                            <mo>(</mo>
                            <msqrt>
                                <mi>x</mi>
                            </msqrt>
                            <mo>)</mo>
                        </mrow>
                        <mn>3</mn>
                    </msup>
                </math>
            </td>
            <td>
                <math>
                    <msup>
                        <mrow>
                            <mo>(</mo>
                            <msqrt>
                                <mi>x</mi>
                            </msqrt>
                            <mo>)</mo>
                        </mrow>
                        <mn>4</mn>
                    </msup>
                </math>
            </td>
            <td><a href="https://www.wiris.net/demo/quizzes/assertions.xml#Is%20simplified" title="Is simplified">More details</a></td>
        </tr>
        <tr>
            <td>is expanded</td>
            <td>It checks whether all operations that can be done are performed.</td>
            <td><math><mn>27</mn></math></td>
            <td><math><mn>1</mn><mo>+</mo><mn>1</mn></math></td>
            <td><a href="https://www.wiris.net/demo/quizzes/assertions.xml#Is%20expanded" title="Is expanded">More details</a></td>
        </tr>
        <tr>
            <td>is factorized</td>
            <td>It checks whether an integer or a polynomial is expressed as product of primes.</td>
            <td><math>
                    <msup>
                        <mn>2</mn>
                        <mn>4</mn>
                    </msup>
                    <mo>*</mo>
                    <mn>3</mn>
                </math>
            </td>
            <td><math><mn>48</mn></math></td>
            <td><a href="https://www.wiris.net/demo/quizzes/assertions.xml#Is%20factorized" title="Is factorized">More details</a></td>
        </tr>
        <tr>
            <td>is rationalized</td>
            <td>It checks whether the expression does not have square (or higher) roots in the denominator. It also checks whether the expression has a pure real denominator (in the case of complex numbers).</td>
            <td><math>
                    <mfrac>
                        <mrow>
                            <msqrt>
                                <mn>2</mn>
                            </msqrt>
                        </mrow>
                        <mrow>
                            <mn>2</mn>
                        </mrow>
                    </mfrac>
                </math>
            </td>
            <td>
                <math>
                    <mfrac>
                        <mrow>
                            <mn>1</mn>
                        </mrow>
                        <mrow>
                            <msqrt>
                                <mn>2</mn>
                            </msqrt>
                        </mrow>
                    </mfrac>
                </math>
            </td>
            <td><a href="https://www.wiris.net/demo/quizzes/assertions.xml#Is%20rationalized" title="Is rationalized">More details</a></td>
        </tr>
        <tr>
            <td>doesn't have common factors</td>
            <td>Checks whether the summands of the answer have no common factors.</td>
            <td><math><mn>2</mn><mo>(</mo><mn>2</mn><mo>+</mo><mn>3</mn><mo>+</mo><mn>4</mn><mo>)</mo></math></td>
            <td><math><mn>4</mn><mo>+</mo><mn>6</mn><mo>+</mo><mn>8</mn></math></td>
            <td><a href="https://www.wiris.net/demo/quizzes/assertions.xml#Doesn't%20have%20common%20factors" title="Doesn't have common factors">More details</a></td>
        </tr>
        <tr>
            <td>has minimal radicands</td>
            <td>It checks whether any present radicands are minimal</td>
            <td><math><mn>2</mn><msqrt><mn>2</mn></msqrt></math></td>
            <td><math><msqrt><mn>8</mn></msqrt></math></td>
            <td><a href="https://www.wiris.net/demo/quizzes/assertions.xml#Has%20minimal%20radicands" title="Has minimal radicands">More details</a></td>
        </tr>
        <tr>
            <td>is divisible by []</td>
            <td>Checks whether the answer is divisible by the given value. This works with integers and polynomials.</td>
            <td>is divisible by <math><mn>7</mn></math>: <math><mn>-210</mn></math></td>
            <td>is divisible by <math><mn>7</mn></math>: <math><mn>24</mn></math></td>
            <td><a href="https://www.wiris.net/demo/quizzes/assertions.xml#Is%20divisible%20by" title="Is divisible by">More details</a></td>
        </tr>
        <tr>
            <td>has single common denominator</td>
            <td>It checks whether the answer has a single common denominator</td>
            <td><math>
                    <mfrac>
                        <mrow>
                            <mi>x</mi>
                            <mo>+</mo>
                            <mn>1</mn>
                        </mrow>
                        <mrow>
                            <mn>x</mn>
                            <mo>−</mo>
                            <mi>1</mi>
                        </mrow>
                    </mfrac>
                </math>
            </td>
            <td><math>
                    <mfrac>
                        <mrow>
                            <mi>x</mi>
                            <mo>+</mo>
                            <mn>1</mn>
                        </mrow>
                        <mrow>
                            <mn>x</mn>
                            <mo>−</mo>
                            <mi>1</mi>
                        </mrow>
                    </mfrac>
                    <mo>+</mo>
                    <mfrac>
                        <mrow>
                            <mi>x</mi>
                            <mo>-</mo>
                            <mn>1</mn>
                        </mrow>
                        <mrow>
                            <mn>x</mn>
                            <mo>+</mo>
                            <mi>1</mi>
                        </mrow>
                    </mfrac>
                </math>
            </td>
            <td><a href="https://www.wiris.net/demo/quizzes/assertions.xml#Has%20a%20single%20common%20denominator" title="Is divisible by">More details</a></td>
        </tr>
        <tr>
            <td>has unit equivalent to []</td>
            <td>Checks whether the unit of measurement in the student's answer is equivalent to the given one. Multiples are not equivalent.</td>
            <td>has unit equivalent to <math><mn>km</mn></math>: <math><mn>3km</mn></math></td>
            <td>has unit equivalent to <math><mn>km</mn></math>: <math><mn>3km5m</mn></math></td>
            <td><a href="https://www.wiris.net/demo/quizzes/assertions.xml#(Deprecated)%20Has%20unit%20equivalent%20to" title="Has unit equivalent to">More details</a></td>
        </tr>
        <tr>
            <td>has unit literally equal to []</td>
            <td>Checks whether the unit of the answer is literally equal to the given one.</td>
            <td>has unit equivalent to <math><mn>km</mn></math>: <math><mn>3km</mn></math></td>
            <td>has unit equivalent to <math><msub><mi>m</mi><mn>2</mn></msub></math>: <math><mo>(</mo><mn>3</mn><mo>m</mo><mo>)</mo><mo>*</mo><mo>(</mo><mn>3</mn><mo>m</mo><mo>)</mo></math></td>
            <td><a href="https://www.wiris.net/demo/quizzes/assertions.xml#Has%20unit%20literally%20equal%20to" title="Has unit literally equal to">More details</a></td>
        </tr>
        <tr>
            <td>has from [] up to [][]</td>
            <td>Checks whether the response has no more than n significant digits or check that the response is expressed within a given precision range</td>
            <td>has from <math><mn>3</mn></math> up to <math><mn>4</mn></math> decimal places: <math><mn>2.500</mn></math></td>
            <td>has from <math><mn>3</mn></math> up to <math><mn>4</mn></math> decimal places: <math><mn>2.5000</mn></math></td>
            <td><table>
                    <tr>
                        <td>decimal places</td>
                        <td><a href="https://www.wiris.net/demo/quizzes/assertions.xml#Has%20precision" title="Has precision">More details</a></td>
                    </tr>
                    <tr>
                        <td>significant figures</td>
                        <td><a href="https://www.wiris.net/demo/quizzes/assertions.xml#Has%20less%20or%20equal%20decimals%20than" title="Has less or equal digits than">More details</a></td>
                    </tr>
                </table>
            </td>
        </tr>
    </tbody>
</table>

## Related topics

<ol>
    <li><a href="../page/WIRIS-Allowed-input" title="Allowed input">Allowed input</a></li>
    <li><a href="../page/WIRIS-General-input-options" title="General input options">General input options</a></li>
    <li><a href="../page/WIRIS-Quantity-input-options" title="Quantity input options">Quantity input options</a></li>
    <li><a href="../page/WIRIS-Comparison-with-student-answer" title="Comparison with student answer">Comparison with student answer</a></li>
</ol>
