TestCase("[Commons - Controls-bar] Show hide elements", {
    setUp: function () {
        this.controlsBar = new CustomControlsBar();
    },

    'test show play button': function () {
        var expectedPause = 'none';
        this.controlsBar.showPlayButton();
        var afterPlay = this.controlsBar.elements.playButton.element.style.display;
        var afterPause = this.controlsBar.elements.pauseButton.element.style.display;
        assertTrue(afterPlay !== 'none');
        assertEquals(expectedPause, afterPause);
    },

    'test show pause button': function () {
        var expectedPlay = 'none';
        this.controlsBar.showPauseButton();
        var afterPlay = this.controlsBar.elements.playButton.element.style.display;
        var afterPause = this.controlsBar.elements.pauseButton.element.style.display;
        assertEquals(expectedPlay, afterPlay);
        assertTrue(afterPause !== 'none');
    },

    'test show fullscreen button': function () {
        var expectedCloseFullscreen = 'none';
        this.controlsBar.showFullscreenButton();
        var afterFullscreen = this.controlsBar.elements.fullscreen.element.style.display;
        var afterCloseFullscreen = this.controlsBar.elements.closeFullscreen.element.style.display;
        assertTrue(afterFullscreen !== 'none');
        assertEquals(expectedCloseFullscreen, afterCloseFullscreen);
    },

    'test show closefullscreen button': function () {
        var expectedFullscreen = 'none';
        this.controlsBar.showCloseFullscreenButton();
        var afterFullscreen = this.controlsBar.elements.fullscreen.element.style.display;
        var afterCloseFullscreen = this.controlsBar.elements.closeFullscreen.element.style.display;
        assertEquals(expectedFullscreen, afterFullscreen);
        assertTrue(afterCloseFullscreen !== 'none');
    },

    'test show controls': function () {
        this.controlsBar.showControls();
        var afterShow = this.controlsBar.elements.mainDiv.element.style.display;
        assertTrue(afterShow !== 'none');
    },

    'test hide controls': function () {
        var expectedStyle = 'none';
        this.controlsBar.hideControls();
        var afterShow = this.controlsBar.elements.mainDiv.element.style.display;
        assertEquals(expectedStyle, afterShow);
    },

    'test given disabled volume bar when controls are created then volume is hidden': function () {
        var expectedStyle = 'none';
        var controlsBar = new CustomControlsBar({
            isVolumeEnabled: false
        });

        var afterShow = controlsBar.elements.volume.element.style.display;

        assertEquals(expectedStyle, afterShow);
    },

    'test given enabled volume bar when controls are created then volume is visible': function () {
        var expectedStyle = '';
        var controlsBar = new CustomControlsBar({
            isVolumeVisible: true
        });

        var afterShow = controlsBar.elements.volume.element.style.display;
        assertEquals(expectedStyle, afterShow);
    }
});
