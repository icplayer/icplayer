TestCase("[EditableWindow] State fetching", {
    setUp: function () {
        this.presenter = AddonEditableWindow_create();

        this.presenter.configuration.isTinyMceLoaded = false;
        this.presenter.configuration.isTinyMceFilled = false;

        this.presenter.configuration.state = {
            isInitialized: true,
            content: "Addon conetnt"
        };
    },

    'test saved state is returned when method is called': function () {
        let result = JSON.parse(this.presenter.getState());

        assertEquals(result.content, "Addon conetnt");
        assertEquals(result.isInitialized, true);
    },

    'test saved state is returned when method is called and tinyMce is loaded': function () {
        let result = JSON.parse(this.presenter.getState());

        this.presenter.configuration.isTinyMceLoaded = true;

        assertEquals(result.content, "Addon conetnt");
        assertEquals(result.isInitialized, true);
    },

    'test saved state is returned when method is called and tinMce is filled': function () {
        let result = JSON.parse(this.presenter.getState());

        this.presenter.configuration.isTinyMceFilled = true;

        assertEquals(result.content, "Addon conetnt");
        assertEquals(result.isInitialized, true);
    }
});

