TestCase("test model validation", {

    setUp: function () {
        this.presenter = AddonMathFormula_create();
    },

    'test given invalid xml as math text when validating model then return correct error code': function() {
        var model = {
            'math text': '<math xmlns="http://www.w3.org/1998/Math/MathML"><mstyle indentalign="right"><mn>1</mn>' +
            '<mo>&#xD7;</mo><msqrt><mn>2</mn></msqrt><mo>+</mo><mfrac><mn>3</mn><mn>4</mn></mfrac><mo>+</mo><msup><mn>10</mn>' +
            '<mn>4</mn></msup><mo>&#xA0;</mo><mo>&#x2282;</mo><mo>&#xA0;</mo><mfenced open="|" close="|"><mroot><mrow><mo>-</mo>' +
            '<mn>29</mn></mrow><mn>5</mn></mroot></mfenced><mspace linebreak="newline"/><mfenced open="{" close="">' +
            '<mtable columnalign="left"><mtr><mtd><mn>12</mn></mtd></mtr><mtr><mtd><mn>3</mn></mtd></mtr></mtable></mfenced></mstyle>'
        };

        var result = this.presenter.validateModel(model);

        assertTrue(result.isError);
        assertEquals(result.errorCode, 'M1')
    },

    'test given valid xml as math text when validating model then return no errors': function() {
        var model = {
            'math text':  '<math xmlns="http://www.w3.org/1998/Math/MathML"><mstyle indentalign="right"><mn>1</mn>' +
            '<mo>&#xD7;</mo><msqrt><mn>2</mn></msqrt><mo>+</mo><mfrac><mn>3</mn><mn>4</mn></mfrac><mo>+</mo><msup><mn>10</mn>' +
            '<mn>4</mn></msup><mo>&#xA0;</mo><mo>&#x2282;</mo><mo>&#xA0;</mo><mfenced open="|" close="|"><mroot><mrow><mo>-</mo>' +
            '<mn>29</mn></mrow><mn>5</mn></mroot></mfenced><mspace linebreak="newline"/><mfenced open="{" close="">' +
            '<mtable columnalign="left"><mtr><mtd><mn>12</mn></mtd></mtr><mtr><mtd><mn>3</mn></mtd></mtr></mtable></mfenced></mstyle></math>'
        };

        var result = this.presenter.validateModel(model);

        assertFalse(result.isError);
        assertEquals(result.mathML, model['math text'])
    }
});