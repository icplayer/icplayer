TestCase("[Commons - Controls-bar] Creating controls bar", {
    setUp: function () {
        this.controlsBar = new CustomControlsBar();
    },

    'test created main element': function () {
        var controlBar = this.controlsBar;
        var mainTreeElement = controlBar.getMainElement();

        assertNotUndefined(mainTreeElement);
        assertEquals(mainTreeElement.tagName, "DIV");
    },

    'test created all child elements': function () {
        var expectedElements = ["mainDiv", "playButton", "pauseButton", "stopButton", "progressBarWrapper", "volume", "volumeBarWrapper", "timer", "controlsWrapper", "volumeBackground", "fullscreen", "redProgressBar", "grayProgressBar", "closeFullscreen", "volumeBackgroundSelected"];

        var controlBar = this.controlsBar;

        for (var i = 0; i < expectedElements.length; i++) {
            assertTrue(controlBar.elements.hasOwnProperty(expectedElements[i]));
        }
    },

    'test default configuration': function () {
        var expected = {
            mouseDontMoveOnPlaybackRate:10,
            mouseDontMoveClocks: 30,
            mouseDontMoveRefreshTime: 100,
            maxMediaTime: 0,
            actualMediaTime: 0,
            videoObject: null,
            parentElement: null,
            isVolumeEnabled: true
        };
        var controlBar = new CustomControlsBar();

        assertEquals(expected, controlBar.configuration);
    },

    'test user configuration': function () {
        var divElement = document.createElement("div");

        var expected = {
            mouseDontMoveOnPlaybackRate:10,
            mouseDontMoveClocks: 40,
            mouseDontMoveRefreshTime: 100,
            maxMediaTime: 7,
            actualMediaTime: 2,
            videoObject: null,
            parentElement: divElement,
            isVolumeEnabled: false
        };

        var configuration = {
            mouseDontMoveClocks: 40,
            mouseDontMoveRefreshTime: 100,
            maxMediaTime: 7,
            actualMediaTime: 2,
            parentElement: divElement,
            isVolumeEnabled: false
        };

        var controlBar = new CustomControlsBar(configuration);

        assertEquals(expected, controlBar.configuration);
    },

    'test created tree node': function () {
        var controlBar = this.controlsBar;

        assertEquals("DIV", controlBar.elements.closeFullscreen.element.tagName);
        assertTrue(controlBar.elements.closeFullscreen.events.hasOwnProperty("click"));
        assertTrue(controlBar.elements.closeFullscreen.events['click'].length > 0);

    }
});
