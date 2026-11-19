TestCase("[Video] Captions conversion", {
    setUp: function () {
        this.presenter = Addonvideo_create();
        this.presenter.$captionsContainer = $(document.createElement('div'));
        this.lines = [
            '0|5|10|10|class1|first',
            '5|10|20|20|class2|second'
        ];
    },

    'test given lines when converting then should create caption for each line': function () {
        this.presenter.convertLinesToCaptions(this.lines);

        assertEquals(2, this.presenter.captions.length);
        assertEquals(2, this.presenter.captionDivs.length);
        assertEquals(2, this.presenter.$captionsContainer.find('.captions').length);
    },

    'test given already converted captions when converting again then old elements should be removed': function () {
        this.presenter.convertLinesToCaptions(this.lines);
        this.presenter.convertLinesToCaptions(this.lines);

        assertEquals(2, this.presenter.captions.length);
        assertEquals(2, this.presenter.captionDivs.length);
        assertEquals(2, this.presenter.$captionsContainer.find('.captions').length);
    },

    'test given hidden subtitles when converting then created captions should be hidden': function () {
        this.presenter.areSubtitlesHidden = true;

        this.presenter.convertLinesToCaptions(this.lines);

        var elements = this.presenter.$captionsContainer.find('.captions');
        assertEquals(2, elements.length);
        for (var i = 0; i < elements.length; i++) {
            assertEquals('none', elements[i].style.display);
        }
    },

    'test given visible subtitles when converting then created captions should not be hidden': function () {
        this.presenter.areSubtitlesHidden = false;

        this.presenter.convertLinesToCaptions(this.lines);

        var elements = this.presenter.$captionsContainer.find('.captions');
        assertEquals(2, elements.length);
        for (var i = 0; i < elements.length; i++) {
            assertNotEquals('none', elements[i].style.display);
        }
    }
});
