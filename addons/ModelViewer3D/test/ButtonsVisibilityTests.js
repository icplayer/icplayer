TestCase('[ModelViewer3D] Button visibility tests', {
    setUp: function () {
        this.presenter = AddonModelViewer3D_create();
        this.presenter.labelsButton = $('<div></div>');
        this.presenter.copyButton = $('<div></div>');
        this.presenter.fullscreenButton = $('<div></div>');
    },

    'test given model with empty annotations when handleDisplayingButtons was called should add hidden class to labelsButton': function () {
        this.presenter.configuration = {
            "annotations": "",
            "copyInfo": "",
            enableFullscreen: false
        };

        this.presenter.handleDisplayingButtons();

        assertTrue(this.presenter.labelsButton.hasClass('hidden'));
    },

    'test given model with empty copyInfo when handleDisplayingButtons was called should add hidden class to copyButton': function () {
        this.presenter.configuration = {
            "annotations": "",
            "copyInfo": "",
            enableFullscreen: false
        };

        this.presenter.handleDisplayingButtons();

        assertTrue(this.presenter.copyButton.hasClass('hidden'));
    },

    'test given model with disabled fullscreen when handleDisplayingButtons was called should add hidden class to fullscreenButton': function () {
        this.presenter.configuration = {
            "annotations": "",
            "copyInfo": "",
            enableFullscreen: false
        };

        this.presenter.handleDisplayingButtons();

        assertTrue(this.presenter.fullscreenButton.hasClass('hidden'));
    },

    'test given model with enabled fullscreen and without API support when handleDisplayingButtons was called should add hidden class to fullscreenButton': function () {
        this.presenter.configuration = {
            "annotations": "",
            "copyInfo": "",
            enableFullscreen: true
        };
        this.presenter.fullscreen.hasSupport = false;

        this.presenter.handleDisplayingButtons();

        assertTrue(this.presenter.fullscreenButton.hasClass('hidden'));
    },

    'test given model with enabled fullscreen and with API support when handleDisplayingButtons was called should not add hidden class to fullscreenButton': function () {
        this.presenter.configuration = {
            "annotations": "",
            "copyInfo": "",
            enableFullscreen: true
        };
        this.presenter.fullscreen.hasSupport = true;

        this.presenter.handleDisplayingButtons();

        assertFalse(this.presenter.fullscreenButton.hasClass('hidden'));
    },
});
