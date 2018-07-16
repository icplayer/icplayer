TestCase("[Text_Coloring] getTextHTML  test", {
    setUp: function () {
        this.presenter = AddonText_Coloring_create();

        this.tokens = [];
        this.tokens.push(setUpUtils.getWordToken("The"));
        this.tokens.push(setUpUtils.getSpaceToken());
        this.tokens.push(setUpUtils.getWordToken("text"));
        this.tokens.push(setUpUtils.getSpaceToken());
        this.tokens.push(setUpUtils.getSelectableToken("red", "red"));
        this.tokens.push(setUpUtils.getSpaceToken());
        this.tokens.push(setUpUtils.getWordToken("and"));
        this.tokens.push(setUpUtils.getSpaceToken());
        this.tokens.push(setUpUtils.getWordToken("all"));
        this.tokens.push(setUpUtils.getSpaceToken());
        this.tokens.push(setUpUtils.getWordToken("nouns"));
        this.tokens.push(setUpUtils.getSpaceToken());
        this.tokens.push(setUpUtils.getSelectableToken("blue", "blue"));
        this.tokens.push(setUpUtils.getWordToken("."));
        this.tokens.push(setUpUtils.getSpaceToken());
        this.tokens.push(setUpUtils.getWordToken("Also"));
        this.tokens.push(setUpUtils.getSpaceToken());
        this.tokens.push(setUpUtils.getWordToken("this:"));
        this.tokens.push(setUpUtils.getSpaceToken());
        this.tokens.push(setUpUtils.getSelectableToken("neither", "green"));

        this.cssClass = "text-coloring-tokens-container-top-position";

    },

    "test getTextHTML when in all selectable mode": function() {
        var expectedResult = "<div class='text-coloring-tokens-container-top-position'><span class='text-coloring-selectable-word' data-word-index='0' >The</span><span> </span><span class='text-coloring-selectable-word' data-word-index='1' >text</span><span> </span><span class='text-coloring-selectable-word' data-word-index='2' >red</span><span> </span><span class='text-coloring-selectable-word' data-word-index='3' >and</span><span> </span><span class='text-coloring-selectable-word' data-word-index='4' >all</span><span> </span><span class='text-coloring-selectable-word' data-word-index='5' >nouns</span><span> </span><span class='text-coloring-selectable-word' data-word-index='6' >blue</span><span class='text-coloring-selectable-word' data-word-index='7' >.</span><span> </span><span class='text-coloring-selectable-word' data-word-index='8' >Also</span><span> </span><span class='text-coloring-selectable-word' data-word-index='9' >this:</span><span> </span><span class='text-coloring-selectable-word' data-word-index='10' >neither</span></div>";

        var result = this.presenter.getTextHTML(this.tokens, this.cssClass, "ALL_SELECTABLE");
        assertEquals(result,expectedResult);
    },

    "test getTextHTML when in all phrase selection mode": function() {
        var expectedResult = "<div class='text-coloring-tokens-container-top-position'>The<span> </span>text<span> </span><span class='text-coloring-selectable-word' data-word-index='2' >red</span><span> </span>and<span> </span>all<span> </span>nouns<span> </span><span class='text-coloring-selectable-word' data-word-index='6' >blue</span>.<span> </span>Also<span> </span>this:<span> </span><span class='text-coloring-selectable-word' data-word-index='10' >neither</span></div>";

        var result = this.presenter.getTextHTML(this.tokens, this.cssClass, "MARK_PHRASES");
        assertEquals(result,expectedResult);
    }
});