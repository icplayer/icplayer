TestCase("[Hangman] Finding letter element", {
    setUp: function () {
        this.presenter = AddonHangman_create();
        /*:DOC += <div id="hagnman-letters-finding-container"><div class="hangman-letter">A</div><div class="hangman-letter">B</div></div>*/
        this.presenter.$lettersContainer = $('#hagnman-letters-finding-container');
    },

    'test find existing letter': function () {
        var $letter = this.presenter.findLetterElement('B');

        assertEquals('B', $letter.text());
    },

    'test letter does not appear in letters container': function () {
        var $letter = this.presenter.findLetterElement('D');

        assertUndefined($letter);
    }
});