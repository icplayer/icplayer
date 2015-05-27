TestCase("[Text Selection] MathJax functions", {
    setUp: function() {
        this.presenter = AddonText_Selection_create();
        this.presenter.markedMathJaxContent = [];
    },

    'test simple mark math jax and retrieve': function() {
        var text = 'some text \\( hello math jax \\) bye';
        assertEquals(text, this.presenter.retrieveMathJax(this.presenter.markMathJax(text)));
    },

    'test multiple values mark math jax and retrieve': function() {
        var text = 'some text \\(2 + 2\\) one more \\(2 + 2\\) bye \\(last\\)';
        assertEquals(text, this.presenter.retrieveMathJax(this.presenter.markMathJax(text)));
    },

    'test mark math jax 1': function() {
        var text = '\\( bul \\) text1 ';
        assertEquals('MATHJAX0 text1 ', this.presenter.markMathJax(text));
    },

    'test mark math jax 2': function() {
        var text = '\\(0\\) text1 \\(1\\) text2 \\(2\\)';
        assertEquals('MATHJAX0 text1 MATHJAX1 text2 MATHJAX2', this.presenter.markMathJax(text));
    },

    'test retrieve math jax': function() {
        this.presenter.markedMathJaxContent = ['\\(1+1\\)'];
        var text = 'MATHJAX0 text1 text2';
        assertEquals('\\(1+1\\) text1 text2', this.presenter.retrieveMathJax(text));
    }
});