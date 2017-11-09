TestCase("[Video] ShowPlayButton property", {
    setUp: function () {
        this.presenter = Addonvideo_create();
        this.presenter.$view = $("<div></div>");
        this.playButton = $("<div class='video-poster-play'></div>");
        this.presenter.$view.append(this.playButton);
    },

    'test check button visibility will hide button if property value is false': function () {
        this.presenter.configuration.showPlayButton = false;

        this.presenter.checkPlayButtonVisibility();

        assertEquals('none', this.playButton.css('display'));
    },

    'test check button visibility do not change button visibility if property is true': function () {
        this.presenter.configuration.showPlayButton = true;

        this.presenter.checkPlayButtonVisibility();

        assertNotEquals('none', this.playButton.css('display'));
    }
});