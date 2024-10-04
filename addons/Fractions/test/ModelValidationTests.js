TestCase("[Fractions] Model validation tests", {
    setUp: function () {
        this.presenter = AddonFractions_create();

        this.model = {
            "ID": "Fractions1",
        };
    },

    'test given empty model when setSpeechTexts was called then update model with speech text': function () {
        this.presenter.setSpeechTexts(this.model['speechTexts']);

        assertEquals(Object.keys(this.presenter.speechTexts).length, 6);
    },

    'test given empty model when setSpeechTexts was called then update model with default speech text value': function () {
        this.presenter.setSpeechTexts(this.model['speechTexts']);

        assertEquals(this.presenter.speechTexts.Selected, this.presenter.DEFAULT_TTS_PHRASES.SELECTED);
        assertEquals(this.presenter.speechTexts.of, this.presenter.DEFAULT_TTS_PHRASES.OF);
        assertEquals(this.presenter.speechTexts.Correct, this.presenter.DEFAULT_TTS_PHRASES.CORRECT);
    },

    'test given model with speech text values when setSpeechTexts was called then update model with model speech text value': function () {
        const model = {
            'Selected': { 'Selected': 'Zaznaczony' },
            'Deselected': { 'Deselected': 'Odznaczony' },
            'Item': { 'Item': '' },
            'Correct': { 'Correct': '' },
            'Wrong': { 'Wrong': '' },
            'of': { 'of': 'z' },
        };

        this.presenter.setSpeechTexts(model);

        assertEquals(this.presenter.speechTexts.Selected, 'Zaznaczony');
        assertEquals(this.presenter.speechTexts.Item, this.presenter.DEFAULT_TTS_PHRASES.ITEM);
        assertEquals(this.presenter.speechTexts.of, 'z');
    },
});