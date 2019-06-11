TestCase("[EditableWindow] Css Classes getting test case", {
    setUp: function () {
        this.presenter = AddonEditableWindow_create();
    },

    'test given created presenter when getting css classes names then returns proper classes': function () {
        assertEquals("addon-editable-window-container", this.presenter.cssClasses.container.getName());
        assertEquals("addon-editable-close-button", this.presenter.cssClasses.closeButton.getName());
        assertEquals("addon-editable-full-screen-button", this.presenter.cssClasses.fullScreenButton.getName());
        assertEquals("addon-editable-close-full-screen-button", this.presenter.cssClasses.closeFullScreenButton.getName());
        assertEquals("addon-editable-window-wrapper", this.presenter.cssClasses.wrapper.getName());
        assertEquals("addon-editable-window-container-full-screen", this.presenter.cssClasses.containerFullScreen.getName())
    },

    'test given created presenter when getting css classes selectors then returns class names preceded with dot': function () {
        var expectedFirstCharacter = ".";

        var keys = Object.keys(this.presenter.cssClasses);

        assert(keys.length > 0);
        for (var i = 0; i < keys.length; i++) {
            assertEquals(expectedFirstCharacter, this.presenter.cssClasses[keys[i]].getSelector().charAt(0));
        }
    }
});

